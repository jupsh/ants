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
 * Search (amendment of 2026-10-08): 640 ants per evaluation (objective SD
 * ≈ ±3 on flat ground, vs ±15 at 160); each stage runs Nelder–Mead from two
 * starts, then restarts the simplex from the best point until a restart
 * gains < 0.5 (≤ 3 restarts). The flat-ground decision quantity is the loss
 * on 5 fresh batches of 1000 ants (mean ± SE, per-batch values kept for
 * paired comparison between variants); "+ 2k" is a heuristic penalty.
 * Output: data/fits/e1-<variant>.json (candidates; data/fits/e1-walk.json is
 * the adopted fit and is never overwritten here).
 *
 * Usage: npx vite-node scripts/fitE1.ts --variant A0|B [--quick]
 */
import { nelderMead } from '../src/sim/analysis/optimize';
import { compareE1, referenceFor, scalarSE, type E1Reference } from '../src/sim/experiments/e1Compare';
import { walkParams, type WalkParams } from '../src/sim/models/walk';
import { khuongTracking } from '../src/sim/species/lasiusM1';
import { arg, flag, INCLINES, loadKhuong, readJson, writeJson } from './lib';
import { SimPool } from './pool';

const VARIANT = arg('--variant', '');
if (!['A0', 'B'].includes(VARIANT)) throw new Error('--variant A0|B required');
const quick = flag('--quick');
const ANTS = quick ? 160 : 640;
const DT = 0.02;
const SEED = 20131105;
const OUT = `data/fits/e1-${VARIANT}${quick ? '-quick' : ''}.json`;

const data: E1Reference[] = [];
for (let k = 1; k <= 5; k++) data.push(referenceFor(loadKhuong(k)));

const logit = (p: number) => Math.log(p / (1 - p));
const sigm = (x: number) => 1 / (1 + Math.exp(-x));

// Warm start from the adopted (session-2) fit; the second start is set per variant.
let p: WalkParams = walkParams(readJson<any>('data/fits/e1-walk.json').params);
if (VARIANT === 'B') p = { ...p, slopeJitterK: 0, jitterTime: 0.05, turnRateTime: 0.3 };
const second: Partial<WalkParams> = VARIANT === 'B' ? { meanFreePath: 50, turnRateTime: 4, jitterTime: 0.2 } : { meanFreePath: 20, g: 0.75 };

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

const pool = await SimPool.create();
const runOpts = (i: number, ants: number, seed: number) => ({ incline: INCLINES[i], ants, seed, dt: DT, tracking: khuongTracking(i + 1) });

async function evalAt(par: WalkParams, idx: number[]): Promise<number> {
  const samples = await Promise.all(idx.map((i) => pool.e1Sample(par, runOpts(i, ANTS, SEED + i))));
  return idx.reduce((s, i, k) => s + compareE1(samples[k], data[i]).loss, 0) / idx.length;
}

// ---- Stage 1: flat ground (positive parameters on the log scale)
const s1Keys: (keyof WalkParams)[] = ['speed', 'speedSdBetween', 'speedSdWithin', 'speedTau', 'pauseRate', 'pauseMean', 'meanFreePath', 'jitter', 'homeRange'];
if (VARIANT === 'B') s1Keys.push('jitterTime', 'turnRateTime');
const enc1 = (q: WalkParams) => [...s1Keys.map((k) => Math.log(q[k])), q.homeRunBias, logit(q.g), logit(Math.max(1e-3, q.homeHeadingPull))];
const dec1 = (x: number[], base: WalkParams): WalkParams => {
  const q = { ...base };
  s1Keys.forEach((k, i) => (q[k] = Math.exp(x[i])));
  const n = s1Keys.length;
  q.homeRunBias = x[n];
  q.g = sigm(x[n + 1]);
  q.homeHeadingPull = sigm(x[n + 2]);
  return q;
};
const t0 = Date.now();
const r1 = await search('stage1', (x) => evalAt(dec1(x, p), [0]), [enc1(p), enc1({ ...p, ...second })], quick ? 150 : 500);
p = dec1(r1.x, p);
console.log('stage 1 done', r1.f.toFixed(3), JSON.stringify(p));

// ---- Stage 2: slopes
const enc2 = (q: WalkParams) => [Math.log(q.slopeSpeedK), Math.log(q.geoRunGain), logit(Math.min(0.999, q.geoHeadingPull)), q.slopePauseK, q.slopeSpeedSdK, ...(VARIANT === 'A0' ? [q.slopeJitterK] : [])];
const dec2 = (x: number[], base: WalkParams): WalkParams => ({
  ...base,
  slopeSpeedK: Math.exp(x[0]),
  geoRunGain: Math.exp(x[1]),
  geoHeadingPull: sigm(x[2]),
  slopePauseK: x[3],
  slopeSpeedSdK: x[4],
  ...(VARIANT === 'A0' ? { slopeJitterK: x[5] } : {}),
});
const r2 = await search('stage2', (x) => evalAt(dec2(x, p), [2, 4]), [enc2(p), enc2({ ...p, geoRunGain: 0.3, geoHeadingPull: 0.3, slopeSpeedSdK: 0 })], quick ? 120 : 400);
p = dec2(r2.x, p);
console.log('stage 2 done', r2.f.toFixed(3), JSON.stringify(p));

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
  fitLoss: { stage1: r1.f, stage2: r2.f, evals: [r1.evals, r2.evals] },
  flatFresh: { batches: flatBatches, mean: flatMean, se: flatSe, k1, penalised: flatMean + 2 * k1, antsPerBatch: 1000 },
  seconds: (Date.now() - t0) / 1000,
  params: p,
  report,
});
console.log(`wrote ${OUT}`);
pool.close();
