/**
 * Step 4b fit (STATUS 2026-10-11; two phases 2026-10-15): in-nest motion on
 * the Stroeymeyt et al. 2018 fit colonies. k = 11 (S2018_FREE: per group
 * speed factor, stop and walk-on rates, the walker's pause factor; shared
 * encounter stop, crowd exponent and rest-depth shape), 32 fit rows
 * (s2018Targets), loss Σ debiased fitZ².
 *
 * Optimiser as the 1999 pilots: CMA-ES in box coordinates [0, 4] per
 * parameter (log-linear where log-scaled), Mod-BCH bounds, tolUpSigma 20,
 * per-coordinate initial SDs from a curvature probe, common random numbers
 * within a generation. Every evaluation simulates all 22 fit colonies (one
 * window each). Two phases (rule approved 2026-10-15, STATUS):
 *   1. Search only, at cheap settings (dt 0.1, 2 h + 2 h): both starts, run
 *      side by side; a start ends at the first of generation-best loss
 *      < 300, largest axis σ·max(D) < 0.25, 40 generations, tolX. Estimate
 *      = mean of its last 5 generation means, scored at full settings on
 *      the selection batch. Never reported as fit quality (pilot conditions).
 *   2. The fit, at full settings (dt 0.05, 2 h + 6 h): from the better
 *      estimate, σ 0.5, SDs from a full-settings probe there, at most 60
 *      generations, tolX 0.03, estimate = mean of the last 20 generation
 *      means, scored on the selection batch. Also from the other start if
 *      its phase-1 selection loss is within 20 % and its estimate differs
 *      by more than 0.5 box units in some coordinate.
 * No IPOP restart. Checkpointed every generation (rerun the same command to
 * resume).
 *
 *   npx vite-node scripts/fitS2018.ts [--gens 60] [--warmup 7200] [--obs 21600] [--dt 0.05]
 *     [--cheap-dt 0.1] [--cheap-warmup 7200] [--cheap-obs 7200] [--cheap-loss 300] [--cheap-gens 40]
 *     [--runs 0,1] [--tag t] [--name n]
 * Trip inputs from data/fits/s2018-trips.json (scripts/calibTrips.ts).
 * Writes data/fits/s2018-motion[-name].json.
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { cmaes, type CmaState } from '../src/sim/analysis/cmaes';
import type { StroeymeytRunOptions } from '../src/sim/experiments/colonyStroeymeyt';
import { S2018_FREE, s2018AtBound, s2018Loss, s2018Values, type S2018Free } from '../src/sim/experiments/stroeymeytTargets';
import { arg, loadCheckpoint, numArg, provenance, saveCheckpoint, seedFor, writeJson } from './lib';
import { SimPool } from './pool';
import { colonyFromData, loadS2018, loadTrips, S2018_START, S2018_TRACKER, s2018Params, s2018TargetsFromData, simulateAll } from './s2018Lib';

// Phase 2 (the fit): the gated settings.
const GENS = numArg('--gens', 60);
const WARMUP = numArg('--warmup', 7200);
const OBS = numArg('--obs', 21600);
const DT = numArg('--dt', 0.05);
// Phase 1 (search only; STATUS 2026-10-15).
const C_DT = numArg('--cheap-dt', 0.1);
const C_WARMUP = numArg('--cheap-warmup', 7200);
const C_OBS = numArg('--cheap-obs', 7200);
const C_LOSS = numArg('--cheap-loss', 300);
const C_GENS = numArg('--cheap-gens', 40);
const C_AXIS = 0.25;
const C_AVERAGE = 5;
const P2_SIGMA = 0.5;
const SECOND_WITHIN = 0.2;
const SECOND_DIST = 0.5;
// Trip-process inputs (scripts/calibTrips.ts; STATUS 2026-10-11).
const { outRate: OUT_RATE, exploreGiveUp: EXPLORE, exploreGiveUpSd: EXPLORE_SD } = loadTrips();
const TAG = arg('--tag', '');
// Which starts to run (seeds are keyed by start index).
const RUNS = (arg('--runs', '0,1') as string).split(',').map(Number);
const NAME = arg('--name', TAG) as string;
const OUT = `data/fits/s2018-motion${NAME ? `-${NAME}` : ''}.json`;
const TAG_KEY = [...TAG].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 0x5018);
const sf = (p: Parameters<typeof seedFor>[1], ...k: number[]) => seedFor(2018, p, TAG_KEY, ...k);
const TOLX = 0.03;
const AVERAGE_LAST = 20;
const BOX = 4;

const colonies = loadS2018().colonies.map((c) => colonyFromData(c));
const targets = s2018TargetsFromData();
const unit = (v: number, f: S2018Free) => (f.log ? Math.log(v / f.lo) / Math.log(f.hi / f.lo) : (v - f.lo) / (f.hi - f.lo));
const ofUnit = (u: number, f: S2018Free) => (f.log ? f.lo * (f.hi / f.lo) ** u : f.lo + (f.hi - f.lo) * u);
const encode = (v: Record<string, number>) => S2018_FREE.map((f) => BOX * unit(v[f.key], f));
const decode = (x: number[]) => Object.fromEntries(S2018_FREE.map((f, i) => [f.key, ofUnit(Math.min(1, Math.max(0, x[i] / BOX)), f)]));

type Settings = Omit<StroeymeytRunOptions, 'seed'>;
const FULL: Settings = { phase: 'light', warmupS: WARMUP, obsS: OBS, dt: DT, exploreGiveUp: EXPLORE, exploreGiveUpSd: EXPLORE_SD };
const CHEAP: Settings = { phase: 'light', warmupS: C_WARMUP, obsS: C_OBS, dt: C_DT, exploreGiveUp: EXPLORE, exploreGiveUpSd: EXPLORE_SD };

const PROVENANCE = provenance();
const CKPT = `logs/fitS2018${NAME ? `-${NAME}` : ''}.ckpt.json`;
// The observer (frozen tracker file) is part of the key: simHash covers src/sim only.
const TRACKER_SHA = createHash('sha256').update(fs.readFileSync(S2018_TRACKER)).digest('hex');
const CKPT_KEY = { simHash: PROVENANCE.simHash, tracker: TRACKER_SHA, design: 'two-phase 2026-10-15', GENS, WARMUP, OBS, DT, C_DT, C_WARMUP, C_OBS, C_LOSS, C_GENS, OUT_RATE, EXPLORE, EXPLORE_SD, RUNS, TAG };
interface Run { key: string; label: string; phase: 1 | 2; start: number; x0: number[]; initialSds: number[]; sigma0: number; generations: number; evals: number; finalSigma: number; avgWindow: number; meanDrift: number[]; stopReason: string; converged: boolean; gamma: number[] | null; x: number[]; f: number; estimate: Record<string, number> }
interface Ckpt { done: Run[]; current: Record<string, { stds: number[]; cma: CmaState | null }>; evals: number; seconds: number }
const ck: Ckpt = loadCheckpoint<Ckpt>(CKPT, CKPT_KEY) ?? { done: [], current: {}, evals: 0, seconds: 0 };
const save = () => saveCheckpoint(CKPT, CKPT_KEY, { ...ck, evals, seconds: ck.seconds + (Date.now() - t0) / 1000 });
const pool = await SimPool.create();
/** One evaluation: all colonies at the given settings; `reps` seeds each (the selection batch uses 3). */
const evalAt = async (v: Record<string, number>, o: Settings, seed: (i: number) => number, reps = 1) => {
  const cols = Array.from({ length: reps }, () => colonies).flat();
  const runs = await simulateAll(pool, s2018Params(v, OUT_RATE), cols, o, seed);
  return s2018Loss(runs.map((r) => r.rows), targets);
};

let evals = ck.evals;
/** Selection batch: full settings, 3 seeds per colony, the same seeds for every point scored. */
const score = (x: number[]) => evalAt(decode(x), FULL, (i) => sf('select', i), 3);
const PROBE_H = 0.2;
const PROBE_DELTA = 10;
const PROBE_CAP = 0.5;
const probe = async (x0: number[], o: Settings, seed: (i: number) => number) => {
  const shifted = (i: number, d: number) => x0.map((v, j) => (j === i ? v + d : v));
  const [f0, ...fs] = await Promise.all([evalAt(decode(x0), o, seed), ...x0.flatMap((_, i) => [evalAt(decode(shifted(i, PROBE_H)), o, seed), evalAt(decode(shifted(i, -PROBE_H)), o, seed)])]);
  evals += fs.length + 1;
  return x0.map((_, i) => {
    const c = (fs[2 * i] + fs[2 * i + 1] - 2 * f0) / PROBE_H ** 2;
    return c > 0 && Number.isFinite(f0) ? Math.min(PROBE_CAP, Math.max(0.02, Math.sqrt(PROBE_DELTA / c))) : PROBE_CAP;
  });
};

/** One CMA-ES run (resumable). Phase 1 at cheap settings with the switching rule; phase 2 at full settings. */
const one = async (phase: 1 | 2, start: number, x0: number[]): Promise<Run> => {
  const key = `p${phase}-s${start}`;
  const label = `phase ${phase} start ${start}`;
  const done = ck.done.find((d) => d.key === key);
  if (done) {
    console.log(`${label}: done before (checkpoint), selection-batch loss ${done.f.toFixed(2)}`);
    return done;
  }
  const o = phase === 1 ? CHEAP : FULL;
  const cur = ck.current[key];
  const stds = cur?.stds ?? (await probe(x0, o, (i) => sf('probe', phase, start, i)));
  if (!cur) {
    ck.current[key] = { stds, cma: null };
    save();
  }
  const sigma0 = phase === 1 ? 1 : P2_SIGMA;
  console.log(`${label}: initial SDs ${stds.map((v) => v.toFixed(2)).join(' ')}, σ ${sigma0}${cur ? ` (checkpoint; resuming at generation ${cur.cma?.generation ?? 0})` : ''}`);
  let tg = Date.now();
  const r = await cmaes((x, g) => evalAt(decode(x), o, (i) => sf('fit', phase, start, g, i)), x0, {
    sigma: sigma0,
    stds,
    maxGenerations: phase === 1 ? C_GENS : GENS,
    tolX: TOLX,
    seed: sf('cmaes', phase, start),
    averageLast: phase === 1 ? C_AVERAGE : AVERAGE_LAST,
    bounds: { lo: S2018_FREE.map(() => 0), hi: S2018_FREE.map(() => BOX) },
    tolUpSigma: 20,
    stop: phase === 1 ? (g, axis) => g.fs[0] < C_LOSS || axis < C_AXIS : undefined,
    resume: cur?.cma ?? undefined,
    checkpoint: (st) => {
      ck.current[key].cma = st;
      save();
    },
    log: (g) => {
      console.log(`${label} gen ${g.generation} evals ${g.evals} best ${g.fs[0].toFixed(1)} median ${g.fs[g.fs.length >> 1].toFixed(1)} σ ${g.sigma.toFixed(3)} (${((Date.now() - tg) / 60000).toFixed(1)} min this gen, ${((Date.now() - t0) / 60000).toFixed(1)} min this session) ${new Date().toISOString().slice(5, 16)}`);
      if (g.generation % 5 === 0) console.log(`${label} gen ${g.generation} mean ${Object.entries(decode(g.mean)).map(([k, v]) => `${k} ${v.toPrecision(3)}`).join(', ')}`);
      tg = Date.now();
    },
  });
  evals += r.evals;
  const f = await score(r.meanAvg);
  console.log(`${label}: ${r.generations} generations, ${r.evals} evaluations, stop ${r.stopReason}, final σ ${r.sigma.toFixed(3)}; selection-batch loss ${f.toFixed(2)}`);
  const out: Run = { key, label, phase, start, x0, initialSds: stds, sigma0, generations: r.generations, evals: r.evals, finalSigma: r.sigma, avgWindow: r.avgWindow, meanDrift: r.meanDrift, stopReason: r.stopReason, converged: r.stopReason === 'tolX', gamma: r.gamma ?? null, x: r.meanAvg, f, estimate: decode(r.meanAvg) };
  ck.done.push(out);
  delete ck.current[key];
  save();
  return out;
};

// Start 1: option B's arena-like stopping (every encounter stops, strong crowding), slow walking, long rests.
const START2: Record<string, number> = { ...S2018_START, encounterStop: 1, restCrowdExp: 1.2, 'nurse.restToActive': 0.05, 'forager.restToActive': 0.1, 'nurse.nestSpeedFactor': 0.04, 'forager.nestSpeedFactor': 0.05, 'nurse.nestPauseFactor': 5, 'forager.nestPauseFactor': 5 };
const t0 = Date.now();
console.log(`Stroeymeyt 2018 in-nest motion: k = ${S2018_FREE.length}, ${targets.length} rows, ${colonies.length} colonies per evaluation; phase 1 ${C_WARMUP} + ${C_OBS} s at dt ${C_DT}, phase 2 ${WARMUP} + ${OBS} s at dt ${DT}; outRate ${OUT_RATE.toPrecision(3)}, ${pool.size} workers`);
if (ck.done.length || Object.keys(ck.current).length) console.log(`resuming from ${CKPT}: done ${ck.done.map((d) => d.key).join(', ') || 'none'}; running ${Object.keys(ck.current).join(', ') || 'none'}`);

// Phase 1: the starts side by side.
const starts = [S2018_START, START2];
const p1 = await Promise.all(RUNS.map((k) => one(1, k, encode(starts[k]))));
const order = [...p1].sort((a, b) => a.f - b.f);
const lead = order[0];
// Phase 2: from the better phase-1 estimate; also from the other if close in loss but far in parameters.
const p2: Run[] = [await one(2, lead.start, lead.x)];
const other = order[1];
if (other) {
  const close = other.f <= lead.f * (1 + SECOND_WITHIN);
  const far = other.x.some((v, i) => Math.abs(v - lead.x[i]) > SECOND_DIST);
  console.log(`phase 2 from start ${other.start} too: ${close && far ? 'yes' : 'no'} (selection loss ${other.f.toFixed(1)} vs ${lead.f.toFixed(1)}, max coordinate distance ${Math.max(...other.x.map((v, i) => Math.abs(v - lead.x[i]))).toFixed(2)})`);
  if (close && far) p2.push(await one(2, other.start, other.x));
}
const best = p2.reduce((a, b) => (b.f < a.f ? b : a));
const free = decode(best.x);
const nest = s2018Params(free, OUT_RATE).nest;
const atBound = s2018AtBound(nest);
console.log(`best selection-batch loss ${best.f.toFixed(2)} (phase 2 runs ${p2.map((r) => r.f.toFixed(1)).join(', ')})`);
console.log(Object.entries(s2018Values(nest)).map(([k, v]) => `${k} = ${v.toPrecision(3)}`).join(', '));
if (atBound.length) console.log(`at a bound: ${atBound.join(', ')}`);
writeJson(OUT, {
  experiment: 'Step 4b: in-nest motion, Stroeymeyt et al. 2018 fit colonies (main experiment, PreTreatment)',
  fittedOn: targets.map((t) => t.id),
  window: { warmup: WARMUP, obs: OBS, dt: DT },
  outRate: OUT_RATE,
  exploreGiveUp: EXPLORE,
  exploreGiveUpSd: EXPLORE_SD,
  optimizer: {
    method: 'CMA-ES, two phases (STATUS 2026-10-15)',
    phase1: { window: { warmup: C_WARMUP, obs: C_OBS, dt: C_DT }, stop: `best < ${C_LOSS}, largest axis < ${C_AXIS}, ${C_GENS} generations or tolX`, averageLast: C_AVERAGE, starts: RUNS, note: 'search only; never reported as fit quality' },
    phase2: { sigma: P2_SIGMA, maxGenerations: GENS, tolX: TOLX, averageLast: AVERAGE_LAST, second: `other start if selection loss within ${SECOND_WITHIN * 100} % and > ${SECOND_DIST} box units apart` },
    boundHandling: `Mod-BCH, box [0, ${BOX}], tolUpSigma 20`,
  },
  evals,
  seconds: ck.seconds + (Date.now() - t0) / 1000,
  selectionLoss: best.f,
  runs: p2.map((r) => r.f),
  runDetails: [...p1, ...p2],
  seeds: { scheme: `seedFor(2018, purpose, 0x${TAG_KEY.toString(16)}, ...keys): fit (phase, start, generation, colony), cmaes (phase, start), probe (phase, start, colony), select (colony × 3)` },
  provenance: PROVENANCE,
  k: S2018_FREE.length,
  free,
  atBound,
  nest,
});
console.log(`wrote ${OUT}`);
pool.close();
