/**
 * Fit the exploratory-walk model to the Khuong et al. (2013) L. niger data.
 *
 *   Stage 1 (flat ground, incline 0): speed process, run structure, homing bias.
 *   Stage 2 (inclines π/6, π/3):      slope speed factor and geomenotaxis.
 *   Development (reported, never fitted; inspected, so not held out): π/9, π/4.
 *
 * Simulated tracks go through the tracking observer (model A) before the
 * statistics, as the recorded ones did. Common random numbers (fixed seeds)
 * make the objective deterministic. The objective weights each statistic by
 * its data SE only (bootstrap over recorded ants); the final report uses the
 * combined-SE criteria.
 *
 * Variants (step 5, docs/STATUS.md Decisions 2026-10-08):
 *   A0  the session-2 structure (per-distance turning, slopeJitterK free)
 *   B   + time-based heading diffusion and reorientation (jitterTime,
 *         turnRateTime), slopeJitterK fixed at 0
 *   T   B + turn-linked slowing (turnDip, turnDipTau) + heading reset at
 *         pause onset (stopTurnG, stopHomePull)
 * Search (amendment of 2026-10-08): 640 ants per evaluation (objective SD
 * ≈ ±3 on flat ground, vs ±15 at 160); each stage runs Nelder–Mead from two
 * starts, then restarts the simplex from the best point until a restart
 * gains < 0.5 (≤ 3 restarts). The flat-ground decision quantity is the loss
 * on 5 fresh batches of 1000 ants (mean ± SE, per-batch values kept for
 * paired comparison between variants); "+ 2k" is a heuristic penalty.
 * Output: data/fits/e1-<variant>.json (candidates; data/fits/e1-walk.json is
 * the adopted fit and is never overwritten here).
 *
 * Optimiser (2026-10-08, fitting machinery step 2): `--optimizer cma`
 * (default) runs CMA-ES per stage (initial step per coordinate from the local
 * curvature at the start, `probe` in `stage`) with
 * fresh seeds in every generation, shared by its candidates; the estimate is
 * the final distribution mean. After the first recovery cell failed: every
 * parameter is bounded to a wide range (S1, S2), a candidate with an
 * inestimable statistic ranks last, and each stage runs from both starts
 * plus `--restarts` IPOP restarts, keeping the best on a common batch.
 * That batch is selection data: the fitted model is judged only on batches
 * with other seeds (flatFresh, report), never on it.
 * Each run's estimate is the average of its last `--averageLast` (50)
 * generation means (the final mean wanders along flat, noisy directions);
 * acceptance is by prediction recovery (scripts/recoverE1.ts).
 * `--optimizer nm` is the earlier multi-start Nelder–Mead on fixed seeds.
 * Diagnostics: `--start f` (start from fit f only), `--stages 1`.
 *
 * Strategy (STATUS 2026-10-08, staged vs joint): `--strategy staged`
 * (default; the two stages above) or `joint` (one CMA-ES over all stage-1
 * and stage-2 parameters, loss = mean of the 0°, 30° and 60° losses).
 *
 * Parameter recovery: `--recover truth.json --rep r [--recoverAnts n]`
 * replaces the Khuong data by n ants per incline (default 69, the real
 * sample size) simulated from the parameters in truth.json (seeds depend on
 * r). With n > 69 the reference is scored as 69 ants (`scaleReference`), so
 * only its sampling error changes. Writes
 * data/fits/recover/e1-<variant>-<strategy>-n<n>-rep<r>.json; prediction
 * recovery is judged by scripts/recoverE1.ts.
 *
 * Usage: npx vite-node scripts/fitE1.ts --variant A0|B|T [--quick]
 *          [--optimizer cma|nm] [--strategy staged|joint] [--gens1 150]
 *          [--gens2 120] [--gensJ 250] [--recover f --rep r [--recoverAnts n]]
 */
import { cmaes } from '../src/sim/analysis/cmaes';
import { nelderMead } from '../src/sim/analysis/optimize';
import { compareE1, referenceFor, scalarSE, scaleReference, type E1Reference } from '../src/sim/experiments/e1Compare';
import { walkParams, type WalkParams } from '../src/sim/models/walk';
import { khuongTracking } from '../src/sim/species/lasiusM1';
import { arg, flag, INCLINES, loadKhuong, numArg, readJson, writeJson } from './lib';
import { SimPool } from './pool';

const VARIANT = arg('--variant', '');
if (!['A0', 'B', 'T'].includes(VARIANT)) throw new Error('--variant A0|B|T required');
const TIME_TURNING = VARIANT === 'B' || VARIANT === 'T';
const quick = flag('--quick');
const ANTS = quick ? 160 : 640;
const DT = 0.02;
const SEED = 20131105;
const OPT = arg('--optimizer', 'cma');
if (!['cma', 'nm'].includes(OPT)) throw new Error('--optimizer cma|nm');
const GENS1 = numArg('--gens1', quick ? 40 : 400);
const GENS2 = numArg('--gens2', quick ? 30 : 300);
const GENSJ = numArg('--gensJ', quick ? 60 : 600);
const STRATEGY = arg('--strategy', 'staged');
if (!['staged', 'joint'].includes(STRATEGY)) throw new Error('--strategy staged|joint');
if (STRATEGY === 'joint' && OPT !== 'cma') throw new Error('--strategy joint needs --optimizer cma');
const RECOVER = arg('--recover', '');
const REP = numArg('--rep', 0);
const REC_N = numArg('--recoverAnts', 69);
/** Diagnostics: start from the parameters of a fit file; run stage 1 only. */
const START = arg('--start', '');
const STAGES = numArg('--stages', 2);
/**
 * Reuse a finished stage 1 (same variant, data, seeds and code, e.g. a
 * `--stages 1` run): its stage-1 parameters replace the warm start's and
 * stage 1 is skipped. The run is deterministic, so this equals rerunning it.
 */
const STAGE1_FROM = arg('--stage1From', '');
const OUT = RECOVER
  ? `data/fits/recover/e1-${VARIANT}-${STRATEGY}-n${REC_N}-rep${REP}${START ? '-from-' + START.replace(/.*\//, '').replace(/\.json$/, '') : ''}${STAGES < 2 ? '-stage1' : ''}${quick ? '-quick' : ''}.json`
  : `data/fits/e1-${VARIANT}${STRATEGY === 'joint' ? '-joint' : ''}${OPT === 'nm' ? '-nm' : ''}${quick ? '-quick' : ''}.json`;

const pool = await SimPool.create();
const runOpts = (i: number, ants: number, seed: number) => ({ incline: INCLINES[i], ants, seed, dt: DT, tracking: khuongTracking(i + 1) });

// Reference data: the Khuong tracks, or (recovery test) REC_N ants per incline simulated from known parameters.
const truth = RECOVER ? walkParams(readJson<any>(RECOVER).params) : null;
const data: E1Reference[] = [];
for (let k = 1; k <= 5; k++) {
  if (!truth) data.push(referenceFor(loadKhuong(k)));
  else {
    const ref = referenceFor(await pool.e1(truth, runOpts(k - 1, REC_N, 777000 + 10 * REP + k)));
    data.push(REC_N > 69 ? scaleReference(ref, 69) : ref);
  }
}

const logit = (p: number) => Math.log(p / (1 - p));
const sigm = (x: number) => 1 / (1 + Math.exp(-x));

// Warm start from the adopted (session-2) fit; the second start is set per variant.
let p: WalkParams = walkParams(readJson<any>('data/fits/e1-walk.json').params);
if (TIME_TURNING) p = { ...p, slopeJitterK: 0, jitterTime: 0.05, turnRateTime: 0.3 };
if (VARIANT === 'T') p = { ...p, turnDip: 0.6, turnDipTau: 0.25, stopTurnG: 0.2, stopHomePull: 0.3 };
if (START) p = walkParams(readJson<any>(START).params);
const second: Partial<WalkParams> = TIME_TURNING ? { meanFreePath: 50, turnRateTime: 4, jitterTime: 0.2 } : { meanFreePath: 20, g: 0.75 };

/** Nelder–Mead from several starts, then restarts from the best point. */
async function search(name: string, f: (x: number[]) => Promise<number>, starts: number[][], evals: number) {
  let best = { x: starts[0], f: Infinity, evals: 0 };
  let total = 0;
  for (const [i, x0] of starts.entries()) {
    const r = await nelderMead(f, x0, 0.3, evals, 1e-4, (r) => r.evals % 50 === 0 && console.log(`${name} start ${i} eval ${r.evals} loss ${r.f.toFixed(3)}`));
    total += r.evals;
    console.log(`${name} start ${i}: loss ${r.f.toFixed(3)} after ${r.evals} evaluations`);
    if (r.f < best.f) best = r;
  }
  for (let k = 0; k < 3; k++) {
    const r = await nelderMead(f, best.x, 0.15, evals, 1e-4);
    total += r.evals;
    const gain = best.f - r.f;
    console.log(`${name} restart ${k}: loss ${r.f.toFixed(3)} (gain ${gain.toFixed(3)})`);
    if (r.f < best.f) best = r;
    if (gain < 0.5) break;
  }
  return { x: best.x, f: best.f, evals: total };
}

/**
 * Fit objective: mean loss over the inclines `idx`. A candidate whose
 * simulation leaves any statistic inestimable (NaN) ranks below every
 * candidate that estimates all of them, then by how many (2026-10-08: the
 * judging loss's fixed 100 per family was below the real misfit of most
 * candidates, so degenerate walkers were preferred).
 */
const DEGENERATE = 1e7;
async function evalAt(par: WalkParams, idx: number[], seedBase = SEED, ants = ANTS): Promise<number> {
  const samples = await Promise.all(idx.map((i) => pool.e1Sample(par, runOpts(i, ants, seedBase + i))));
  return (
    idx.reduce((s, i, k) => {
      const c = compareE1(samples[k], data[i]);
      const bad = c.rows.filter((r) => !Number.isFinite(r.z)).length;
      return s + c.loss + DEGENERATE * bad;
    }, 0) / idx.length
  );
}

/**
 * One stage: CMA-ES (fresh seeds per generation; estimate = final mean) from
 * every start, then RESTARTS restarts from the best mean with doubled
 * population (IPOP-CMA-ES, Auger & Hansen 2005); each run stops at `gens`
 * generations or when converged (σ·max axis < TOLX). The final means are
 * compared on a fixed common batch (3 × ANTS ants, the same seeds for all
 * runs) and the best is kept. Or Nelder–Mead (`--optimizer nm`).
 */
const RESTARTS = numArg('--restarts', 1);
const TOLX = numArg('--tolX', 0.03);
const AVERAGE_LAST = numArg('--averageLast', 50);
async function stage(name: string, idx: number[], dec: (x: number[]) => WalkParams, starts: number[][], nmEvals: number, gens: number, offset: number) {
  if (OPT === 'nm') return search(name, (x) => evalAt(dec(x), idx), starts, nmEvals);
  let evals = 0;
  const score = (x: number[]) => evalAt(dec(x), idx, SEED + offset + 77, 3 * ANTS);
  /**
   * Initial per-coordinate SDs from the local curvature at x0 (common seeds):
   * a 1-SD step raises the loss by ≈ PROBE_DELTA (2026-10-08, after the
   * truth-start diagnostic showed σ = 0.5 steps 40–250× too costly).
   */
  const PROBE_H = 0.2;
  const PROBE_DELTA = 10;
  const PROBE_CAP = 0.3;
  const probe = async (x0: number[], off: number) => {
    const seed = SEED + off + 3;
    const shifted = (i: number, d: number) => x0.map((v, j) => (j === i ? v + d : v));
    const [f0, ...fs] = await Promise.all([evalAt(dec(x0), idx, seed), ...x0.flatMap((_, i) => [evalAt(dec(shifted(i, PROBE_H)), idx, seed), evalAt(dec(shifted(i, -PROBE_H)), idx, seed)])]);
    evals += fs.length + 1;
    return x0.map((_, i) => {
      const c = (fs[2 * i] + fs[2 * i + 1] - 2 * f0) / PROBE_H ** 2;
      return c > 0 && f0 < DEGENERATE ? Math.min(PROBE_CAP, Math.max(0.02, Math.sqrt(PROBE_DELTA / c))) : PROBE_CAP;
    });
  };
  const one = async (label: string, x0: number[], lambda: number | undefined, off: number) => {
    const stds = await probe(x0, off);
    console.log(`${label}: initial SDs ${stds.map((v) => v.toFixed(2)).join(' ')}`);
    const r = await cmaes((x, g) => evalAt(dec(x), idx, SEED + off + 1009 * (g + 1)), x0, {
      sigma: 1,
      stds,
      lambda,
      maxGenerations: gens,
      tolX: TOLX,
      seed: SEED + off,
      averageLast: AVERAGE_LAST,
      log: (g) => g.generation % 10 === 0 && console.log(`${label} gen ${g.generation} evals ${g.evals} best ${g.fs[0].toFixed(2)} median ${g.fs[g.fs.length >> 1].toFixed(2)} σ ${g.sigma.toFixed(3)}`),
    });
    evals += r.evals;
    // The estimate: the average of the last AVERAGE_LAST generation means (2026-10-08, user decision).
    const f = await score(r.meanAvg);
    console.log(`${label}: λ ${lambda ?? 'default'}, ${r.generations} generations, ${r.evals} evaluations, final σ ${r.sigma.toFixed(3)}; common-batch loss ${f.toFixed(3)}`);
    return { x: r.meanAvg, f };
  };
  const runs: { x: number[]; f: number }[] = [];
  for (const [k, x0] of starts.entries()) runs.push(await one(`${name} start ${k}`, x0, undefined, offset + 10000 * k));
  const lambda0 = 4 + Math.floor(3 * Math.log(starts[0].length));
  for (let r = 1; r <= RESTARTS; r++) {
    const best = runs.reduce((a, b) => (b.f < a.f ? b : a));
    runs.push(await one(`${name} restart ${r}`, best.x, lambda0 * 2 ** r, offset + 50000 + 10000 * r));
  }
  const best = runs.reduce((a, b) => (b.f < a.f ? b : a));
  console.log(`${name}: best common-batch loss ${best.f.toFixed(3)} (runs ${runs.map((r) => r.f.toFixed(1)).join(', ')}; selection data, judge on the fresh batches)`);
  return { x: best.x, f: best.f, evals, runs: runs.map((r) => r.f) };
}

/**
 * Fitted parameters and their ranges (2026-10-08, after the first recovery
 * cell): wide plausibility limits, never meant to bind; a fit at a limit is
 * reported. `log`: lo·(hi/lo)^u, `lin`: lo + (hi − lo)·u, with u = sigm(x),
 * so the optimiser cannot leave the range (degenerate walkers, e.g. a
 * slope-speed SD that leaves no usable track at 60°, were the second failure).
 */
type Spec = [keyof WalkParams, 'log' | 'lin', number, number];
const S1: Spec[] = [
  ['speed', 'log', 10, 150], // mm/s
  ['speedSdBetween', 'log', 0.01, 1.5],
  ['speedSdWithin', 'log', 0.01, 1.5],
  ['speedTau', 'log', 0.05, 20], // s
  ['pauseRate', 'log', 1e-3, 2], // 1/s
  ['pauseMean', 'log', 0.05, 10], // s
  ['meanFreePath', 'log', 1, 500], // mm
  ['jitter', 'log', 1e-5, 0.05], // rad²/mm
  ['homeRange', 'log', 10, 1000], // mm
  ['homeRunBias', 'lin', -3, 3],
  ['g', 'lin', 0, 1],
  ['homeHeadingPull', 'lin', 0, 1],
  ...(TIME_TURNING
    ? ([
        ['jitterTime', 'log', 1e-3, 5], // rad²/s
        ['turnRateTime', 'log', 0.01, 30], // 1/s
      ] as Spec[])
    : []),
  ...(VARIANT === 'T'
    ? ([
        ['turnDipTau', 'log', 0.02, 5], // s
        ['turnDip', 'lin', 0, 0.99],
        ['stopTurnG', 'lin', 0, 1],
        ['stopHomePull', 'lin', 0, 1],
      ] as Spec[])
    : []),
];
const S2: Spec[] = [
  ['slopeSpeedK', 'log', 0.01, 0.9], // 1/rad; speed factor max(0.05, 1 − kθ) reaches its floor at 60° for k ≈ 0.91
  ['geoRunGain', 'log', 1e-4, 3], // 1/rad
  ['geoHeadingPull', 'lin', 0, 1],
  ['slopePauseK', 'lin', -3, 4], // 1/rad, rate × exp(kθ)
  ['slopeSpeedSdK', 'lin', -2, 2], // 1/rad, SD × exp(kθ): at most ×8 at 60°
  ...(VARIANT === 'A0' ? ([['slopeJitterK', 'lin', -3, 4]] as Spec[]) : []),
];
const encode = (specs: Spec[]) => (q: WalkParams) =>
  specs.map(([k, kind, lo, hi]) => {
    const u = kind === 'log' ? Math.log(q[k] / lo) / Math.log(hi / lo) : (q[k] - lo) / (hi - lo);
    return logit(Math.min(0.999, Math.max(1e-3, u)));
  });
const decode =
  (specs: Spec[]) =>
  (x: number[], base: WalkParams): WalkParams => {
    const q = { ...base };
    specs.forEach(([k, kind, lo, hi], i) => {
      const u = sigm(x[i]);
      q[k] = kind === 'log' ? lo * (hi / lo) ** u : lo + (hi - lo) * u;
    });
    return q;
  };
/** Parameters within 1 % of a limit (log scale for `log`). */
const atLimit = (specs: Spec[], q: WalkParams) =>
  specs.filter(([k, kind, lo, hi]) => {
    const u = kind === 'log' ? Math.log(q[k] / lo) / Math.log(hi / lo) : (q[k] - lo) / (hi - lo);
    return u < 0.01 || u > 0.99;
  }).map(([k]) => k);
const enc1 = encode(S1);
const dec1 = decode(S1);
const enc2 = encode(S2);
const dec2 = decode(S2);
const t0 = Date.now();

// ---- Stage 2: slopes
const second2: Partial<WalkParams> = { geoRunGain: 0.3, geoHeadingPull: 0.3, slopeSpeedSdK: 0 };
let fitLoss: Record<string, unknown>;
if (STRATEGY === 'staged') {
  const prior = STAGE1_FROM ? readJson<any>(STAGE1_FROM) : null;
  if (prior) {
    if (prior.variant !== VARIANT || prior.recovery?.antsPerIncline !== (RECOVER ? REC_N : undefined) || (prior.recovery?.rep ?? REP) !== REP) throw new Error('--stage1From: different variant or data');
    for (const [k] of S1) p = { ...p, [k]: prior.params[k] };
  }
  const r1 = prior ? { x: enc1(p), f: (prior.selectionLoss ?? prior.fitLoss).stage1 as number, evals: 0 } : await stage('stage1', [0], (x) => dec1(x, p), START ? [enc1(p)] : [enc1(p), enc1({ ...p, ...second })], quick ? 150 : 500, GENS1, 100000);
  // A reused stage 1 keeps its stored parameters exactly (decode(encode(p)) can move them by an ulp).
  if (!prior) p = dec1(r1.x, p);
  console.log('stage 1 done', r1.f.toFixed(3), JSON.stringify(p));
  const r2 = STAGES < 2 ? null : await stage('stage2', [2, 4], (x) => dec2(x, p), START ? [enc2(p)] : [enc2(p), enc2({ ...p, ...second2 })], quick ? 120 : 400, GENS2, 200000);
  if (r2) {
    p = dec2(r2.x, p);
    console.log('stage 2 done', r2.f.toFixed(3), JSON.stringify(p));
  }
  fitLoss = { stage1: r1.f, stage2: r2?.f ?? null, evals: [r1.evals, r2?.evals ?? 0], ...(STAGE1_FROM ? { stage1From: STAGE1_FROM } : {}) };
} else {
  // ---- Joint: all parameters at once on the three fit inclines.
  const n1 = enc1(p).length;
  const encJ = (q: WalkParams) => [...enc1(q), ...enc2(q)];
  const decJ = (x: number[], base: WalkParams) => dec2(x.slice(n1), dec1(x.slice(0, n1), base));
  const base = p;
  const rj = await stage('joint', [0, 2, 4], (x) => decJ(x, base), START ? [encJ(p)] : [encJ(p), encJ({ ...p, ...second, ...second2 })], 0, GENSJ, 300000);
  p = decJ(rj.x, base);
  console.log('joint done', rj.f.toFixed(3), JSON.stringify(p));
  fitLoss = { joint: rj.f, evals: [rj.evals] };
}

// ---- Decision quantity: flat-ground loss (fit-z, as the objective) on 5
// independent fresh batches of 1000 ants. Batch seeds are the same for every
// variant, so variants can be compared batch by batch (paired differences).
const BATCHES = 5;
const flatBatches: number[] = [];
for (let b = 0; b < BATCHES; b++) flatBatches.push(compareE1(await pool.e1Sample(p, runOpts(0, 1000, SEED + 5000 + b)), data[0]).loss);
const flatMean = flatBatches.reduce((a, v) => a + v, 0) / BATCHES;
const flatSe = Math.sqrt(flatBatches.reduce((a, v) => a + (v - flatMean) ** 2, 0) / (BATCHES - 1) / BATCHES);
const k1 = enc1(p).length;
console.log(`flat fresh loss ${flatMean.toFixed(2)} ± ${flatSe.toFixed(2)} (batches ${flatBatches.map((v) => v.toFixed(1)).join(', ')}); k1 ${k1}`);

// ---- Report all inclines on fresh seeds (π/9 and π/4 are development conditions)
const k = enc1(p).length + enc2(p).length;
const report: Record<string, unknown> = {};
// Recovery test: the true parameters' own losses on the same batches are the noise floor.
const truthFloor: Record<string, number> = {};
if (truth) {
  const tb: number[] = [];
  for (let b = 0; b < BATCHES; b++) tb.push(compareE1(await pool.e1Sample(truth, runOpts(0, 1000, SEED + 5000 + b)), data[0]).loss);
  truthFloor.flatFresh = tb.reduce((a, v) => a + v, 0) / BATCHES;
  for (let i = 0; i < 5; i++) {
    const sim = await pool.e1Sample(truth, runOpts(i, 300, SEED + 1000 + i));
    truthFloor[`incline${i + 1}`] = compareE1(sim, data[i], scalarSE(sim)).loss;
  }
  console.log('truth (noise floor):', JSON.stringify(truthFloor));
}
for (let i = 0; i < 5; i++) {
  const sim = await pool.e1Sample(p, runOpts(i, 300, SEED + 1000 + i));
  const c = compareE1(sim, data[i], scalarSE(sim));
  const role = i === 1 || i === 3 ? 'development' : 'fit';
  report[`incline${i + 1}`] = { role, loss: c.loss, z: Object.fromEntries(c.rows.map((r) => [r.id, r.z])) };
  console.log(`incline ${i + 1} (${role}): loss ${c.loss.toFixed(2)}`, c.rows.map((r) => `${r.id}=${r.z.toFixed(1)}`).join(' '));
}
writeJson(OUT, {
  experiment: 'E1 exploratory walking (Khuong et al. 2013)',
  variant: VARIANT,
  fittedOn: ['incline1 (0)', 'incline3 (π/6)', 'incline5 (π/3)'],
  developmentOn: ['incline2 (π/9)', 'incline4 (π/4)'],
  conditions: '26 °C, 50% RH',
  observer: 'tracking noise (khuongTracking, src/sim/species/lasiusM1.ts)',
  dt: DT,
  antsPerEval: ANTS,
  k,
  optimizer: OPT,
  strategy: STRATEGY,
  restarts: RESTARTS,
  atLimit: [...atLimit(S1, p), ...atLimit(S2, p)],
  ...(RECOVER ? { recovery: { truth: RECOVER, rep: REP, antsPerIncline: REC_N, scoredAs: Math.min(REC_N, 69), truthFloor } } : {}),
  // Losses on the batch that chose among optimiser runs: selection data, not
  // an estimate of fit quality (use flatFresh and report, on other seeds).
  selectionLoss: fitLoss,
  flatFresh: { batches: flatBatches, mean: flatMean, se: flatSe, k1, penalised: flatMean + 2 * k1, antsPerBatch: 1000 },
  seconds: (Date.now() - t0) / 1000,
  params: p,
  report,
});
console.log(`wrote ${OUT}`);
pool.close();
