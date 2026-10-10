/**
 * Colony calibration on Mailleux et al. 1999 (the first recruiter inside
 * the nest; Table 2a at 1 / 4 / 8 d): protocol approved 2026-10-09
 * (docs/STATUS.md); implementation details logged there before any run.
 *
 * Free (k = 7, M1999_FREE): nest.nestSpeedFactor, nest.returnRate,
 * nest.shareRate, nest.shareEnd, nest.receiveReserve, nest.reserveSd
 * (added 2026-10-10), and the 1999-only nestmate density.
 * The recruiter's crop comes from the E2 layer: --layer main (L0S1c) or alt
 * (L0S1).
 *
 * Optimiser (as fitE2c): CMA-ES on Σ fitZ² (SE_data only), per-coordinate
 * initial SDs from a curvature probe, common random numbers within a
 * generation, two starts plus one IPOP restart, estimate = mean of the last
 * generation means; runs compared on one common selection batch (judge
 * separately on fresh seeds).
 *
 * --perNest K: shared warm-ups (STATUS 2026-10-10), K recruiters per warmed
 * nest; default 0 = the independent design logged for the first fits.
 *
 * Usage: npx vite-node scripts/fitM1999.ts --layer main|alt [--gens 120] [--n 80] [--perNest 8]
 * Writes data/fits/colony-m1999-<layer>.json (with --perNest: colony-m1999-<layer>-shared.json).
 */
import { cmaes } from '../src/sim/analysis/cmaes';
import type { ColonyParams } from '../src/sim/experiments/colonyBles';
import { M1999_DAYS, M1999_DEGENERATE, M1999_FREE, M1999_NO_BOUT_MAX, M1999_TARGETS, m1999AtBound, m1999Decode, m1999Encode, m1999FitLoss, m1999Values, type M1999Day, type M1999Model, type M1999Recruiter } from '../src/sim/experiments/colonyMailleux1999';
import { LASIUS_NEST, LASIUS_PARAMS, LASIUS_PARAMS_E2_ALT, MAILLEUX_SETUP, MAILLEUX_SETUP_E2_ALT } from '../src/sim/species/lasiusM1';
import { arg, numArg, provenance, seedFor, writeJson } from './lib';
import { SimPool } from './pool';

const LAYER = arg('--layer', '');
if (LAYER !== 'main' && LAYER !== 'alt') throw new Error('--layer main|alt required');
const N = numArg('--n', 80);
const GENS = numArg('--gens', 120);
const TOLX = 0.03;
const AVERAGE_LAST = 30;
const RESTARTS = 1;
const WARMUP = 300;
// Random streams: namespaced by purpose and run (seedFor; STATUS 2026-10-10), not offsets from one seed.
const STUDY = 1999;
// Shared warm-ups, 4 recruiters per nest by default (STATUS 2026-10-10); --perNest 0 = independent design.
const PER_NEST = numArg('--perNest', 4);
const OUT = `data/fits/colony-m1999-${LAYER}${PER_NEST ? '-shared' : ''}.json`;

const P0: ColonyParams = { ...(LAYER === 'main' ? LASIUS_PARAMS : LASIUS_PARAMS_E2_ALT), nest: LASIUS_NEST };
const ACCESSIBLE = (LAYER === 'main' ? MAILLEUX_SETUP : MAILLEUX_SETUP_E2_ALT).accessible;

const encode = (m: M1999Model) => m1999Encode(m);
const decode = (x: number[]): M1999Model => m1999Decode(x, P0);
const values = (m: M1999Model) => m1999Values(m);
const atBound = (m: M1999Model) => m1999AtBound(m);
const FREE = M1999_FREE;
type Model = M1999Model;

// Start 1: the provisional values at density 1 / cm². Start 2: E6 density, a slow nest walker, faster return and bout ending.
const start1: Model = { P: P0, density: 1 };
const start2: Model = { P: { ...P0, nest: { ...P0.nest, nestSpeedFactor: 0.2, returnRate: 1 / 30, shareEnd: 1 / 30 } }, density: 2.3 };

const pool = await SimPool.create();
const simulate = async (m: Model, seed: number, n = N): Promise<Record<M1999Day, M1999Recruiter[]>> => {
  const run = (day: M1999Day) => {
    const o = { seed, starvationDays: day, density: m.density, pipetteAccessible: ACCESSIBLE, warmup: WARMUP };
    return PER_NEST ? pool.m1999Shared(m.P, o, n, PER_NEST) : pool.m1999(m.P, o, n);
  };
  const per = await Promise.all(M1999_DAYS.map(run));
  return Object.fromEntries(M1999_DAYS.map((d, i) => [d, per[i]])) as Record<M1999Day, M1999Recruiter[]>;
};
const evalAt = async (m: Model, seed: number, n = N) => m1999FitLoss(await simulate(m, seed, n), M1999_TARGETS, PER_NEST);

let evals = 0;
const score = (x: number[]) => evalAt(decode(x), seedFor(STUDY, 'select'), 3 * N);
const PROBE_H = 0.2;
const PROBE_DELTA = 10;
const PROBE_CAP = 0.3;
const probe = async (x0: number[], run: number) => {
  const seed = seedFor(STUDY, 'probe', run);
  const shifted = (i: number, d: number) => x0.map((v, j) => (j === i ? v + d : v));
  const [f0, ...fs] = await Promise.all([evalAt(decode(x0), seed), ...x0.flatMap((_, i) => [evalAt(decode(shifted(i, PROBE_H)), seed), evalAt(decode(shifted(i, -PROBE_H)), seed)])]);
  evals += fs.length + 1;
  return x0.map((_, i) => {
    const c = (fs[2 * i] + fs[2 * i + 1] - 2 * f0) / PROBE_H ** 2;
    return c > 0 && f0 < M1999_DEGENERATE ? Math.min(PROBE_CAP, Math.max(0.02, Math.sqrt(PROBE_DELTA / c))) : PROBE_CAP;
  });
};
const one = async (label: string, x0: number[], lambda: number | undefined, run: number) => {
  const stds = await probe(x0, run);
  console.log(`${label}: initial SDs ${stds.map((v) => v.toFixed(2)).join(' ')}`);
  const r = await cmaes((x, g) => evalAt(decode(x), seedFor(STUDY, 'fit', run, g)), x0, {
    sigma: 1,
    stds,
    lambda,
    maxGenerations: GENS,
    tolX: TOLX,
    seed: seedFor(STUDY, 'cmaes', run),
    averageLast: AVERAGE_LAST,
    log: (g) => g.generation % 10 === 0 && console.log(`${label} gen ${g.generation} evals ${g.evals} best ${g.fs[0].toFixed(2)} median ${g.fs[g.fs.length >> 1].toFixed(2)} σ ${g.sigma.toFixed(3)}`),
  });
  evals += r.evals;
  const f = await score(r.meanAvg);
  console.log(`${label}: λ ${lambda ?? 'default'}, ${r.generations} generations, ${r.evals} evaluations, final σ ${r.sigma.toFixed(3)}; mean averaged over the last ${r.avgWindow} generations, drift (encoded units) ${r.meanDrift.map((v) => v.toFixed(2)).join(' ')}; selection-batch loss ${f.toFixed(3)}`);
  return { label, run, x0, initialSds: stds, lambda: lambda ?? null, generations: r.generations, evals: r.evals, finalSigma: r.sigma, avgWindow: r.avgWindow, meanDrift: r.meanDrift, x: r.meanAvg, f, estimate: values(decode(r.meanAvg)) };
};

const t0 = Date.now();
console.log(`Mailleux 1999 colony calibration, E2 layer ${LAYER}: ${FREE.length} free parameters, ${M1999_TARGETS.length} fit rows, ${N} recruiters per day per evaluation`);
const runs: Awaited<ReturnType<typeof one>>[] = [];
for (const [k, s] of [start1, start2].entries()) runs.push(await one(`start ${k}`, encode(s), undefined, k));
const lambda0 = 4 + Math.floor(3 * Math.log(FREE.length));
for (let r = 1; r <= RESTARTS; r++) {
  const best = runs.reduce((a, b) => (b.f < a.f ? b : a));
  runs.push(await one(`restart ${r}`, best.x, lambda0 * 2 ** r, 1 + r));
}
const best = runs.reduce((a, b) => (b.f < a.f ? b : a));
const m = decode(best.x);
console.log(`best selection-batch loss ${best.f.toFixed(3)} (runs ${runs.map((r) => r.f.toFixed(1)).join(', ')})`);
console.log(Object.entries(values(m)).map(([k, v]) => `${k} = ${v.toPrecision(3)}`).join(', '));
const bound = atBound(m);
if (bound.length) console.log(`at a bound: ${bound.join(', ')}`);
writeJson(OUT, {
  experiment: 'Colony calibration: Mailleux et al. 1999 first recruiter in the nest (Table 2a, 1 / 4 / 8 d)',
  layer: LAYER === 'main' ? 'L0S1c (e2-3d-L0S1c.json)' : 'L0S1 (e2-3d-L0S1.json)',
  fittedOn: M1999_TARGETS.map((t) => t.id),
  recruitersPerDay: N,
  design: PER_NEST ? { sharedWarmup: true, recruitersPerNest: PER_NEST } : { sharedWarmup: false },
  warmup: WARMUP,
  optimizer: { method: 'CMA-ES', starts: 2, restarts: RESTARTS, maxGenerations: GENS, tolX: TOLX, averageLast: AVERAGE_LAST },
  evals,
  seconds: (Date.now() - t0) / 1000,
  selectionLoss: best.f,
  runs: runs.map((r) => r.f),
  // Per run: start, generations actually run, final σ, drift over the averaging window, estimate (STATUS 2026-10-10).
  runDetails: runs,
  seeds: { scheme: 'seedFor(1999, purpose, ...keys): fit (run, generation), cmaes (run), probe (run), select', study: STUDY },
  noBoutBound: M1999_NO_BOUT_MAX,
  provenance: provenance(),
  k: FREE.length,
  free: values(m),
  atBound: bound,
  nest: m.P.nest,
  density1999: m.density,
  // The complete parameter set used (upstream layers included), so the fit is judged as it was fitted.
  params: m.P,
});
console.log(`wrote ${OUT}`);
pool.close();
