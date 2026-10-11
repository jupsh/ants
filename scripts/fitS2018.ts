/**
 * Step 4b fit (STATUS 2026-10-11): in-nest motion on the Stroeymeyt et al.
 * 2018 fit colonies. k = 10 (S2018_FREE: per group speed factor, stop and
 * walk-on rates, the walker's pause factor; shared encounter stop and crowd
 * exponent), 32 fit rows (s2018Targets), loss Σ debiased fitZ².
 *
 * Optimiser as the 1999 pilots: CMA-ES in box coordinates [0, 4] per
 * parameter (log-linear where log-scaled), Mod-BCH bounds, tolUpSigma 20,
 * per-coordinate initial SDs from a curvature probe, common random numbers
 * within a generation, two starts plus one IPOP restart, estimate = mean of
 * the last generation means, runs compared on one common selection batch.
 * Every evaluation simulates all 22 fit colonies (one window each).
 *
 *   npx vite-node scripts/fitS2018.ts [--gens 100] [--warmup 1200] [--obs 1800] [--dt 0.1] [--runs 0,1] [--restart 1] [--tag t]
 * Trip inputs from data/fits/s2018-trips.json (scripts/calibTrips.ts).
 * Writes data/fits/s2018-motion[-tag].json.
 */
import { cmaes } from '../src/sim/analysis/cmaes';
import { S2018_FREE, s2018AtBound, s2018Loss, s2018Values, type S2018Free } from '../src/sim/experiments/stroeymeytTargets';
import { arg, numArg, provenance, seedFor, writeJson } from './lib';
import { SimPool } from './pool';
import { colonyFromData, loadS2018, loadTrips, S2018_START, s2018Params, s2018TargetsFromData, simulateAll } from './s2018Lib';

const GENS = numArg('--gens', 100);
const WARMUP = numArg('--warmup', 1200);
const OBS = numArg('--obs', 1800);
const DT = numArg('--dt', 0.1);
// Trip-process inputs (scripts/calibTrips.ts; STATUS 2026-10-11).
const { outRate: OUT_RATE, exploreGiveUp: EXPLORE } = loadTrips();
const TAG = arg('--tag', '');
// Which starts to run (seeds are keyed by run index, so a start run alone equals the same start in the full design) and whether to restart.
const RUNS = (arg('--runs', '0,1') as string).split(',').map(Number);
const RESTART = numArg('--restart', 1) === 1;
const OUT = `data/fits/s2018-motion${TAG ? `-${TAG}` : ''}.json`;
const TAG_KEY = [...TAG].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 0x5018);
const sf = (p: Parameters<typeof seedFor>[1], ...k: number[]) => seedFor(2018, p, TAG_KEY, ...k);
const TOLX = 0.03;
const AVERAGE_LAST = 20;
const BOX = 4;

const colonies = loadS2018().colonies.map(colonyFromData);
const targets = s2018TargetsFromData();
const unit = (v: number, f: S2018Free) => (f.log ? Math.log(v / f.lo) / Math.log(f.hi / f.lo) : (v - f.lo) / (f.hi - f.lo));
const ofUnit = (u: number, f: S2018Free) => (f.log ? f.lo * (f.hi / f.lo) ** u : f.lo + (f.hi - f.lo) * u);
const encode = (v: Record<string, number>) => S2018_FREE.map((f) => BOX * unit(v[f.key], f));
const decode = (x: number[]) => Object.fromEntries(S2018_FREE.map((f, i) => [f.key, ofUnit(Math.min(1, Math.max(0, x[i] / BOX)), f)]));

const PROVENANCE = provenance();
const pool = await SimPool.create();
const o = { phase: 'light' as const, warmupS: WARMUP, obsS: OBS, dt: DT, exploreGiveUp: EXPLORE };
/** One evaluation: all colonies; `reps` seeds each (the selection batch uses 3). */
const evalAt = async (v: Record<string, number>, seed: (i: number) => number, reps = 1) => {
  const cols = Array.from({ length: reps }, () => colonies).flat();
  const runs = await simulateAll(pool, s2018Params(v, OUT_RATE), cols, o, seed);
  return s2018Loss(runs.map((r) => r.rows), targets);
};

let evals = 0;
const score = (x: number[]) => evalAt(decode(x), (i) => sf('select', i), 3);
const PROBE_H = 0.2;
const PROBE_DELTA = 10;
const PROBE_CAP = 0.5;
const probe = async (x0: number[], run: number) => {
  const seed = (i: number) => sf('probe', run, i);
  const shifted = (i: number, d: number) => x0.map((v, j) => (j === i ? v + d : v));
  const [f0, ...fs] = await Promise.all([evalAt(decode(x0), seed), ...x0.flatMap((_, i) => [evalAt(decode(shifted(i, PROBE_H)), seed), evalAt(decode(shifted(i, -PROBE_H)), seed)])]);
  evals += fs.length + 1;
  return x0.map((_, i) => {
    const c = (fs[2 * i] + fs[2 * i + 1] - 2 * f0) / PROBE_H ** 2;
    return c > 0 && Number.isFinite(f0) ? Math.min(PROBE_CAP, Math.max(0.02, Math.sqrt(PROBE_DELTA / c))) : PROBE_CAP;
  });
};
const one = async (label: string, x0: number[], lambda: number | undefined, run: number) => {
  const stds = await probe(x0, run);
  console.log(`${label}: initial SDs ${stds.map((v) => v.toFixed(2)).join(' ')}`);
  const r = await cmaes((x, g) => evalAt(decode(x), (i) => sf('fit', run, g, i)), x0, {
    sigma: 1,
    stds,
    lambda,
    maxGenerations: GENS,
    tolX: TOLX,
    seed: sf('cmaes', run),
    averageLast: AVERAGE_LAST,
    bounds: { lo: S2018_FREE.map(() => 0), hi: S2018_FREE.map(() => BOX) },
    tolUpSigma: 20,
    log: (g) => g.generation % 5 === 0 && console.log(`${label} gen ${g.generation} evals ${g.evals} best ${g.fs[0].toFixed(1)} median ${g.fs[g.fs.length >> 1].toFixed(1)} σ ${g.sigma.toFixed(3)} (${((Date.now() - t0) / 60000).toFixed(1)} min)`),
  });
  evals += r.evals;
  const f = await score(r.meanAvg);
  console.log(`${label}: ${r.generations} generations, ${r.evals} evaluations, stop ${r.stopReason}, final σ ${r.sigma.toFixed(3)}; selection-batch loss ${f.toFixed(2)}`);
  return { label, run, x0, initialSds: stds, lambda: lambda ?? null, generations: r.generations, evals: r.evals, finalSigma: r.sigma, avgWindow: r.avgWindow, meanDrift: r.meanDrift, stopReason: r.stopReason, converged: r.stopReason === 'tolX', gamma: r.gamma ?? null, x: r.meanAvg, f, estimate: decode(r.meanAvg) };
};

// Start 2: option B's arena-like stopping (every encounter stops, strong crowding), slow walking, long rests.
const START2: Record<string, number> = { ...S2018_START, encounterStop: 1, restCrowdExp: 1.2, 'nurse.restToActive': 0.05, 'forager.restToActive': 0.1, 'nurse.nestSpeedFactor': 0.04, 'forager.nestSpeedFactor': 0.05, 'nurse.nestPauseFactor': 5, 'forager.nestPauseFactor': 5 };
const t0 = Date.now();
console.log(`Stroeymeyt 2018 in-nest motion: k = ${S2018_FREE.length}, ${targets.length} rows, ${colonies.length} colonies per evaluation, window ${WARMUP} + ${OBS} s, dt ${DT}, outRate ${OUT_RATE.toPrecision(3)}, ${pool.size} workers`);
const runs: Awaited<ReturnType<typeof one>>[] = [];
for (const [k, s] of [S2018_START, START2].entries()) if (RUNS.includes(k)) runs.push(await one(`start ${k}`, encode(s), undefined, k));
const lambda0 = 4 + Math.floor(3 * Math.log(S2018_FREE.length));
const best0 = runs.reduce((a, b) => (b.f < a.f ? b : a));
if (RESTART) runs.push(await one('restart 1', best0.x, lambda0 * 2, 2));
const best = runs.reduce((a, b) => (b.f < a.f ? b : a));
const free = decode(best.x);
const nest = s2018Params(free, OUT_RATE).nest;
const atBound = s2018AtBound(nest);
console.log(`best selection-batch loss ${best.f.toFixed(2)} (runs ${runs.map((r) => r.f.toFixed(1)).join(', ')})`);
console.log(Object.entries(s2018Values(nest)).map(([k, v]) => `${k} = ${v.toPrecision(3)}`).join(', '));
if (atBound.length) console.log(`at a bound: ${atBound.join(', ')}`);
writeJson(OUT, {
  experiment: 'Step 4b: in-nest motion, Stroeymeyt et al. 2018 fit colonies (main experiment, PreTreatment)',
  fittedOn: targets.map((t) => t.id),
  window: { warmup: WARMUP, obs: OBS, dt: DT },
  outRate: OUT_RATE,
  exploreGiveUp: EXPLORE,
  optimizer: { method: 'CMA-ES', starts: RUNS, restarts: RESTART ? 1 : 0, maxGenerations: GENS, tolX: TOLX, averageLast: AVERAGE_LAST, boundHandling: `Mod-BCH, box [0, ${BOX}], tolUpSigma 20` },
  evals,
  seconds: (Date.now() - t0) / 1000,
  selectionLoss: best.f,
  runs: runs.map((r) => r.f),
  runDetails: runs,
  seeds: { scheme: `seedFor(2018, purpose, 0x${TAG_KEY.toString(16)}, ...keys): fit (run, generation, colony), cmaes (run), probe (run, colony), select (colony × 3)` },
  provenance: PROVENANCE,
  k: S2018_FREE.length,
  free,
  atBound,
  nest,
});
console.log(`wrote ${OUT}`);
pool.close();
