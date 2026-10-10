/**
 * Local identifiability of a fitted E2 variant (step 3): finite-difference
 * Hessian H of the fit loss (Σz², ≈ −2 log L) at the optimum, in the
 * optimiser's transformed coordinates, with common random numbers.
 * Approximate covariance = 2·H⁻¹ → standard errors and correlations.
 * Flags |correlation| > 0.9 (parameters the data cannot separate) and
 * non-positive curvature (flat or not a minimum).
 *
 * Usage: npx vite-node scripts/identifyE2.ts --variant Ma [--h 0.15]
 */
import { e2Loss, simulateE2Async } from '../src/sim/experiments/e2Targets';
import { decode, encode, E2_VARIANTS, type E2Model } from '../src/sim/experiments/e2Variants';
import { E2_LEGACY_FORAGER, LASIUS_MORPH, E2_LEGACY_PHYS, LASIUS_WALK } from '../src/sim/species/lasiusM1';
import { arg, readJson } from './lib';
import { SimPool } from './pool';

const variant = E2_VARIANTS.find((v) => v.id === arg('--variant', 'Ma'))!;
const h = Number(arg('--h', '0.15'));
const fit = readJson<any>(`data/fits/e2-${variant.id}.json`);
const best: E2Model = {
  P: { walk: LASIUS_WALK, forager: { ...E2_LEGACY_FORAGER, ...fit.forager }, phys: { ...E2_LEGACY_PHYS, ...fit.phys }, morph: LASIUS_MORPH },
  setup: { accessible: fit.pipetteAccessible, volumeSd: fit.observer.volumeSd },
};
const pool = await SimPool.create();
const f = async (x: number[]) => {
  const m = decode(variant, best, x);
  return e2Loss(await simulateE2Async(m.P, fit.scoutsPerCondition, m.setup, fit.dt, 0, 1, pool.scouts.bind(pool)), 'fit');
};
const x0 = encode(variant, best);
const k = x0.length;
const f0 = (await f(x0));
const H: number[][] = Array.from({ length: k }, () => new Array<number>(k).fill(0));
const shift = (i: number, a: number, j = -1, b = 0) => x0.map((v, q) => v + (q === i ? a : 0) + (q === j ? b : 0));
for (let i = 0; i < k; i++) {
  H[i][i] = ((await f(shift(i, h))) - 2 * f0 + (await f(shift(i, -h)))) / (h * h);
  for (let j = 0; j < i; j++) {
    const v = ((await f(shift(i, h, j, h))) - (await f(shift(i, h, j, -h))) - (await f(shift(i, -h, j, h))) + (await f(shift(i, -h, j, -h)))) / (4 * h * h);
    H[i][j] = H[j][i] = v;
  }
}
// Invert H (Gauss–Jordan).
const A = H.map((r, i) => [...r, ...r.map((_, j) => (i === j ? 1 : 0))]);
for (let c = 0; c < k; c++) {
  let p = c;
  for (let r = c + 1; r < k; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
  [A[c], A[p]] = [A[p], A[c]];
  const d = A[c][c];
  for (let q = 0; q < 2 * k; q++) A[c][q] /= d;
  for (let r = 0; r < k; r++) if (r !== c) {
    const m = A[r][c];
    for (let q = 0; q < 2 * k; q++) A[r][q] -= m * A[c][q];
  }
}
const cov = A.map((r) => r.slice(k).map((v) => 2 * v));
const names = variant.free.map((p) => p.key.split('.')[1]);
console.log(`${variant.label}: loss at optimum ${f0.toFixed(2)} (h = ${h} in transformed units)`);
console.log('curvature (diag H):', names.map((n, i) => `${n}=${H[i][i].toFixed(1)}`).join(' '));
console.log('approx. SE (transformed units):', names.map((n, i) => `${n}=${cov[i][i] > 0 ? Math.sqrt(cov[i][i]).toFixed(2) : 'n/a'}`).join(' '));
console.log('correlations:');
for (let i = 0; i < k; i++) console.log(`  ${names[i].padEnd(20)} ${names.map((_, j) => (cov[i][i] > 0 && cov[j][j] > 0 ? (cov[i][j] / Math.sqrt(cov[i][i] * cov[j][j])).toFixed(2) : ' n/a').padStart(6)).join('')}`);
const flags: string[] = [];
for (let i = 0; i < k; i++) {
  if (!(cov[i][i] > 0)) flags.push(`${names[i]}: non-positive variance (flat or saddle)`);
  for (let j = 0; j < i; j++) {
    const c = cov[i][j] / Math.sqrt(cov[i][i] * cov[j][j]);
    if (Math.abs(c) > 0.9) flags.push(`${names[i]} ~ ${names[j]}: correlation ${c.toFixed(2)}`);
  }
}
pool.close();
console.log(flags.length ? `FLAGS:\n  ${flags.join('\n  ')}` : 'no flags');
