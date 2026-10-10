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
 * Usage: npx vite-node scripts/fitM1999.ts --layer main|alt [--gens 120] [--n 80] [--perNest 8] [--dt 0.1] [--warmup 300] [--tag pilot] [--bch] [--fix shareEnd]
 * Writes data/fits/colony-m1999-<layer>.json (with --perNest: colony-m1999-<layer>-shared.json).
 */
import { cmaes } from '../src/sim/analysis/cmaes';
import type { ColonyParams } from '../src/sim/experiments/colonyBles';
import { M1999_DAYS, M1999_DEGENERATE, M1999_FREE, M1999_NO_BOUT_MAX, M1999_TARGETS, m1999AtBound, m1999FitLoss, m1999Values, type M1999Day, type M1999Model, type M1999Recruiter } from '../src/sim/experiments/colonyMailleux1999';
import { fromX, toX } from '../src/sim/experiments/e2Variants';
import { LASIUS_NEST, LASIUS_PARAMS, LASIUS_PARAMS_E2_ALT, MAILLEUX_SETUP, MAILLEUX_SETUP_E2_ALT } from '../src/sim/species/lasiusM1';
import { arg, flag, numArg, provenance, seedFor, writeJson } from './lib';
import { SimPool } from './pool';

const LAYER = arg('--layer', '');
if (LAYER !== 'main' && LAYER !== 'alt') throw new Error('--layer main|alt required');
const N = numArg('--n', 80);
const GENS = numArg('--gens', 120);
const TOLX = 0.03;
const AVERAGE_LAST = 30;
const RESTARTS = 1;
// --warmup: seconds before the recruiter enters (default 300; the pilot uses 900, STATUS 2026-10-10 night, condition 2).
const WARMUP = numArg('--warmup', 300);
// Random streams: namespaced by purpose and run (seedFor; STATUS 2026-10-10), not offsets from one seed.
const STUDY = 1999;
// Shared warm-ups, 4 recruiters per nest by default (STATUS 2026-10-10); --perNest 0 = independent design.
const PER_NEST = numArg('--perNest', 4);
// --dt: simulation step (default 0.1); --tag t: a separate run (pilot, STATUS 2026-10-10 night): output name and seed namespace.
const DT = numArg('--dt', 0.1);
const TAG = arg('--tag', '');
const OUT = `data/fits/colony-m1999-${LAYER}${PER_NEST ? '-shared' : ''}${TAG ? `-${TAG}` : ''}.json`;
// A tagged run takes its own seeds: a leading key after the purpose, 0x9170 for 'pilot' (as run), else a hash of the tag.
const TAG_KEY = TAG === 'pilot' ? 0x9170 : [...TAG].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 0x9171);
const sf = (p: Parameters<typeof seedFor>[1], ...k: number[]) => (TAG ? seedFor(STUDY, p, TAG_KEY, ...k) : seedFor(STUDY, p, ...k));

const P0: ColonyParams = { ...(LAYER === 'main' ? LASIUS_PARAMS : LASIUS_PARAMS_E2_ALT), nest: LASIUS_NEST };
const ACCESSIBLE = (LAYER === 'main' ? MAILLEUX_SETUP : MAILLEUX_SETUP_E2_ALT).accessible;

// --fix a,b: parameters left out of the free set at their species values (e.g. shareEnd from Buffin 2011; STATUS
// 2026-10-10 night). --bch: box coordinates with Mod-BCH bound handling instead of the logistic transform (each free
// parameter mapped linearly, in log for log-scaled ones, onto [0, BOX]; BOX = 4 matches the logistic's slope at the
// centre, so the probe step, initial SDs and tolX keep their meaning).
const FIX = arg('--fix', '').split(',').filter(Boolean);
const BCH = flag('--bch');
const BOX = 4;
const FREE = M1999_FREE.filter((f) => !FIX.includes(f.key) && !FIX.includes(f.key.replace('nest.', '')));
if (FREE.length + FIX.length !== M1999_FREE.length) throw new Error(`--fix ${FIX.join(',')}: unknown parameter`);
const unitOf = (v: number, tf: { lo: number; hi: number; log?: boolean }) => (tf.log ? Math.log(v / tf.lo) / Math.log(tf.hi / tf.lo) : (v - tf.lo) / (tf.hi - tf.lo));
const ofUnit = (u: number, tf: { lo: number; hi: number; log?: boolean }) => (tf.log ? tf.lo * (tf.hi / tf.lo) ** u : tf.lo + (tf.hi - tf.lo) * u);
const encode = (m: M1999Model) => FREE.map((f) => (BCH ? BOX * unitOf(f.get(m), f.tf as any) : toX(f.get(m), f.tf)));
const decode = (x: number[]): M1999Model => FREE.reduce((m, f, i) => f.set(m, BCH ? ofUnit(Math.min(1, Math.max(0, x[i] / BOX)), f.tf as any) : fromX(x[i], f.tf)), { P: P0, density: 1 } as M1999Model);
const values = (m: M1999Model) => m1999Values(m);
const atBound = (m: M1999Model) => m1999AtBound(m).filter((k) => FREE.some((f) => f.key === k));
type Model = M1999Model;

// Start 1: the provisional values at density 1 / cm². Start 2: E6 density, a slow nest walker, faster return and bout ending.
const start1: Model = { P: P0, density: 1 };
const start2: Model = { P: { ...P0, nest: { ...P0.nest, nestSpeedFactor: 0.2, returnRate: 1 / 30, shareEnd: 1 / 30 } }, density: 2.3 };

// Provenance taken at launch (code and commit the run actually used; the sources may change before the fit ends).
const PROVENANCE = provenance();
const pool = await SimPool.create();
const simulate = async (m: Model, seed: number, n = N): Promise<Record<M1999Day, M1999Recruiter[]>> => {
  const run = (day: M1999Day) => {
    const o = { seed, starvationDays: day, density: m.density, pipetteAccessible: ACCESSIBLE, warmup: WARMUP, dt: DT };
    return PER_NEST ? pool.m1999Shared(m.P, o, n, PER_NEST) : pool.m1999(m.P, o, n);
  };
  const per = await Promise.all(M1999_DAYS.map(run));
  return Object.fromEntries(M1999_DAYS.map((d, i) => [d, per[i]])) as Record<M1999Day, M1999Recruiter[]>;
};
const evalAt = async (m: Model, seed: number, n = N) => m1999FitLoss(await simulate(m, seed, n), M1999_TARGETS, PER_NEST);

let evals = 0;
const score = (x: number[]) => evalAt(decode(x), sf('select'), 3 * N);
const PROBE_H = 0.2;
const PROBE_DELTA = 10;
const PROBE_CAP = 0.3;
const probe = async (x0: number[], run: number) => {
  const seed = sf('probe', run);
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
  const r = await cmaes((x, g) => evalAt(decode(x), sf('fit', run, g)), x0, {
    sigma: 1,
    stds,
    lambda,
    maxGenerations: GENS,
    tolX: TOLX,
    seed: sf('cmaes', run),
    averageLast: AVERAGE_LAST,
    ...(BCH ? { bounds: { lo: FREE.map(() => 0), hi: FREE.map(() => BOX) }, tolUpSigma: 20 } : {}),
    log: (g) => g.generation % 10 === 0 && console.log(`${label} gen ${g.generation} evals ${g.evals} best ${g.fs[0].toFixed(2)} median ${g.fs[g.fs.length >> 1].toFixed(2)} σ ${g.sigma.toFixed(3)}`),
  });
  evals += r.evals;
  const f = await score(r.meanAvg);
  console.log(`${label}: λ ${lambda ?? 'default'}, ${r.generations} generations, ${r.evals} evaluations, final σ ${r.sigma.toFixed(3)}; mean averaged over the last ${r.avgWindow} generations, drift (encoded units) ${r.meanDrift.map((v) => v.toFixed(2)).join(' ')}; selection-batch loss ${f.toFixed(3)}`);
  console.log(`${label}: stop ${r.stopReason}${r.gamma ? `, γ ${r.gamma.map((v) => v.toPrecision(2)).join(' ')}` : ''}`);
  return { label, run, x0, initialSds: stds, lambda: lambda ?? null, generations: r.generations, evals: r.evals, finalSigma: r.sigma, avgWindow: r.avgWindow, meanDrift: r.meanDrift, stopReason: r.stopReason, converged: r.stopReason === 'tolX', gamma: r.gamma ?? null, x: r.meanAvg, f, estimate: values(decode(r.meanAvg)) };
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
  dt: DT,
  tag: TAG || null,
  optimizer: { method: 'CMA-ES', starts: 2, restarts: RESTARTS, maxGenerations: GENS, tolX: TOLX, averageLast: AVERAGE_LAST, boundHandling: BCH ? `Mod-BCH (Sakamoto & Akimoto 2017), box [0, ${BOX}], tolUpSigma 20` : 'logistic transform' },
  fixed: Object.fromEntries(M1999_FREE.filter((f) => !FREE.includes(f)).map((f) => [f.key, f.get({ P: P0, density: 1 })])),
  evals,
  seconds: (Date.now() - t0) / 1000,
  selectionLoss: best.f,
  runs: runs.map((r) => r.f),
  // Per run: start, generations actually run, final σ, drift over the averaging window, estimate (STATUS 2026-10-10).
  runDetails: runs,
  seeds: { scheme: `seedFor(1999, purpose, ${TAG ? `0x${TAG_KEY.toString(16)}, ` : ''}...keys): fit (run, generation), cmaes (run), probe (run), select`, study: STUDY },
  noBoutBound: M1999_NO_BOUT_MAX,
  provenance: PROVENANCE,
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
