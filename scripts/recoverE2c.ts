/**
 * Prediction recovery of a step-3c recovery fit (frozen pre-registration,
 * STATUS 2026-10-09 "Recovery (a local numerical check, one replicate)";
 * this script is the scoring step, written and frozen before any candidate
 * result). Writes nothing.
 *
 *   - reference: 2000 scouts per condition simulated from the true
 *     parameters (the selected candidate's fit), each fit row summarised
 *     as the data are, with SEs at the real sample sizes (E2_TARGETS n:
 *     SD/√n for means, binomial for proportions, the targets' own SE for
 *     the per-drop rs on the Fisher-z scale);
 *   - the true and the recovered parameters each simulated afresh (2000
 *     scouts per condition, the same seeds for both, different from the
 *     reference's) and scored per fit row with the fit z (reference SE
 *     only, as in fitting);
 *   - excess = z²(recovered) − z²(truth), per fit row.
 * Recovered: mean excess ≤ 0.25 and no row > 1; failed: mean > 1 or a row
 * > 4 (a row the recovered model cannot estimate is +∞, so it fails);
 * approximate otherwise. One replicate shows only that the procedure can
 * recover this one data set. Then the free parameters, true vs recovered.
 *
 * Usage: npx vite-node scripts/recoverE2c.ts --fit data/fits/recover/e2-3c-<id>-rep0.json [--n 2000]
 */
import { binomialSE, fitZ } from '../src/sim/analysis/compare';
import { simulateE2Async, E2_TARGETS, type E2Sim, type Target } from '../src/sim/experiments/e2Targets';
import { freeValues, variant3 } from '../src/sim/experiments/e2Variants';
import { modelOf } from './e2Synthetic';
import { arg, numArg, readJson } from './lib';
import { SimPool } from './pool';

const fit = readJson<any>(arg('--fit', ''));
if (!fit.recovery) throw new Error('--fit must be a recovery fit (fitE2c.ts --recover)');
const truthFit = readJson<any>(fit.recovery.truth);
const N = numArg('--n', 2000);
// Seeds 4.25e9 and 4.27e9: disjoint from the fits (< 3.1e9), profiles (3.5e9–3.9e9), selection (4.0e9),
// synthetic data (4.1e9) and regE2Drops (4.2e9); all below 2³².
const REF_SEED = 4_250_000_000;
const SIM_SEED = 4_270_000_000;
const fitRows = E2_TARGETS.filter((t) => t.role === 'fit');

const pool = await SimPool.create();
const run = pool.scouts.bind(pool);
const truth = modelOf(truthFit);
const rec = modelOf(fit);
const sim = (m: ReturnType<typeof modelOf>, seed: number) => simulateE2Async(m.P, N, m.setup, 0.1, seed, 1, run);

// Reference: the truth's large sample, scored with SEs at the real sample sizes.
const refSim = await sim(truth, REF_SEED);
const ref: Target[] = fitRows.map((t) => {
  const s = refSim[t.id];
  if (t.id === 'two.vtRs1' || t.id === 'two.vtRs2') return { ...t, value: s.mean };
  if (t.sd === undefined) return { ...t, value: s.mean, se: binomialSE(s.mean, t.n) };
  return { ...t, value: s.mean, sd: s.sd, se: s.sd / Math.sqrt(t.n) };
});
const z2 = (s: E2Sim) => ref.map((t) => (Number.isFinite(s[t.id]?.mean) ? fitZ(s[t.id].mean, t.value, t.se) ** 2 : Infinity));
const floor = z2(await sim(truth, SIM_SEED));
const got = z2(await sim(rec, SIM_SEED));
const ex = ref.map((t, i) => ({ id: t.id, v: got[i] - floor[i] }));
const mean = ex.reduce((a, r) => a + r.v, 0) / ex.length;
const worst = ex.reduce((a, b) => (b.v > a.v ? b : a));
const verdict = mean <= 0.25 && worst.v <= 1 ? 'RECOVERED' : mean > 1 || worst.v > 4 ? 'FAILED' : 'APPROXIMATE';

console.log(`${arg('--fit', '')}: variant ${fit.variant}, truth ${fit.recovery.truth}, rep ${fit.recovery.rep}; ${N} scouts per condition`);
console.log('  prediction excess over the truth per fit row (z², reference SEs at the real n):');
for (const r of ex) console.log(`    ${r.id.padEnd(16)} ${Number.isFinite(r.v) ? r.v.toFixed(2).padStart(7) : 'unjudgeable (row not estimable)'}`);
console.log(`  mean ${mean.toFixed(2)}, worst ${worst.id} ${Number.isFinite(worst.v) ? worst.v.toFixed(2) : '∞'} → ${verdict}  [recovered: mean ≤ 0.25 and no row > 1; failed: mean > 1 or a row > 4]`);
const variant = variant3(fit.variant)!;
const a = freeValues(variant, truth);
const b = freeValues(variant, rec);
console.log('  free parameters (true → recovered):');
for (const k of Object.keys(a)) console.log(`    ${k.padEnd(28)} ${a[k].toPrecision(4).padStart(10)} → ${b[k].toPrecision(4).padStart(10)}${a[k] !== 0 && a[k] * b[k] > 0 ? `  (×${(b[k] / a[k]).toFixed(2)})` : ''}`);
pool.close();
