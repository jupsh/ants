/**
 * Per-drop volume–time regressions of a fitted E2 model in the 2009 two-drop
 * protocol, with bootstrap SEs of each drop's slope and intercept and of
 * their differences (development check; STATUS 2026-10-09). Mailleux et al.
 * 2009: no difference in slope (F(1,122) = 0.01) or intercept (F = 0.26).
 * Also the power of their test at their sample size: the fraction of
 * random 63-scout subsamples in which an ANCOVA (volume ~ drop + time +
 * time × drop, df 122) finds a slope difference, and (volume ~ drop + time)
 * an intercept difference, at p < 0.05. The 126 volume–time pairs are
 * treated as independent, as in the authors' F(1,122), which is right for
 * reproducing their test; they are not (each scout gives one pair per drop).
 * Writes nothing.
 *
 * Usage: npx vite-node scripts/regE2Drops.ts [--fit data/fits/e2-drinking.json] [--n 3000] [--seed s]
 */
import { bootstrapDraws, olsFit } from '../src/sim/analysis/compare';
import type { ScoutResult } from '../src/sim/experiments/e2Mailleux';
import { RNG } from '../src/sim/core/rng';
import { E2_CONDITIONS } from '../src/sim/experiments/e2Targets';
import { modelOf } from './e2Synthetic';
import { arg, numArg, readJson } from './lib';
import { SimPool } from './pool';

const { P, setup } = modelOf(readJson<any>(arg('--fit', 'data/fits/e2-drinking.json')));
const N = numArg('--n', 3000);
const pool = await SimPool.create();
const two = E2_CONDITIONS.find((c) => c.id === 'two')!;
const both = ((await pool.scouts(P, two.options(N, numArg('--seed', 4_200_000_000), setup, 0.1))) as ScoutResult[]).filter((r) => r.drinks.length >= 2);
const reg = (rs: ScoutResult[], j: number) => olsFit(rs.map((r) => r.drinks[j].time), rs.map((r) => r.drinks[j].ul));
const stat = (rs: ScoutResult[]) => {
  const [a, b] = [reg(rs, 0), reg(rs, 1)];
  return [a.slope, a.intercept, b.slope, b.intercept, b.slope - a.slope, b.intercept - a.intercept];
};
const v = stat(both);
const draws = bootstrapDraws(both.length, (idx) => stat(idx.map((i) => both[i])), 400, 7);
const se = v.map((_, k) => {
  const xs = draws.map((d) => d[k]);
  const m = xs.reduce((a, x) => a + x, 0) / xs.length;
  return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1));
});
const names = ['drop 1 slope', 'drop 1 intercept', 'drop 2 slope', 'drop 2 intercept', 'slope 2 − 1', 'intercept 2 − 1'];
console.log(`${both.length} scouts drank at both drops`);
names.forEach((n, k) => console.log(`  ${n}: ${v[k].toFixed(4)} ± ${se[k].toFixed(4)}${k >= 4 ? ` (z ${(v[k] / se[k]).toFixed(1)})` : ''}`));

/** OLS t-statistic of coefficient k (columns of X, response y). */
function tStat(X: number[][], y: number[], k: number): number {
  const p = X[0].length;
  const A = Array.from({ length: p }, (_, i) => Array.from({ length: p }, (_, j) => X.reduce((s, r) => s + r[i] * r[j], 0)));
  const b = Array.from({ length: p }, (_, i) => X.reduce((s, r, n) => s + r[i] * y[n], 0));
  // Inverse of A by Gauss–Jordan.
  const M = A.map((r, i) => [...r, ...Array.from({ length: p }, (_, j) => (i === j ? 1 : 0))]);
  for (let c = 0; c < p; c++) {
    let piv = c;
    for (let r = c + 1; r < p; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    [M[c], M[piv]] = [M[piv], M[c]];
    const d = M[c][c];
    for (let j = 0; j < 2 * p; j++) M[c][j] /= d;
    for (let r = 0; r < p; r++) if (r !== c) { const f = M[r][c]; for (let j = 0; j < 2 * p; j++) M[r][j] -= f * M[c][j]; }
  }
  const inv = M.map((r) => r.slice(p));
  const beta = inv.map((r) => r.reduce((s, v, j) => s + v * b[j], 0));
  const rss = X.reduce((s, r, n) => s + (y[n] - r.reduce((a, v, j) => a + v * beta[j], 0)) ** 2, 0);
  const s2 = rss / (X.length - p);
  return beta[k] / Math.sqrt(s2 * inv[k][k]);
}
const SUB = 63;
const TRIALS = 2000;
const rng = new RNG(4_300_000_000);
let slopeHits = 0;
let interHits = 0;
for (let k = 0; k < TRIALS; k++) {
  const idx = new Set<number>();
  while (idx.size < SUB) idx.add(rng.int(both.length));
  const rs = [...idx].map((i) => both[i]);
  const rows = rs.flatMap((r) => [0, 1].map((d) => ({ d, t: r.drinks[d].time, v: r.drinks[d].ul })));
  const y = rows.map((r) => r.v);
  if (Math.abs(tStat(rows.map((r) => [1, r.d, r.t, r.t * r.d]), y, 3)) > 1.98) slopeHits++;
  if (Math.abs(tStat(rows.map((r) => [1, r.d, r.t]), y, 1)) > 1.98) interHits++;
}
console.log(`  power at n = ${SUB} (${TRIALS} subsamples, p < 0.05): slope difference detected ${((100 * slopeHits) / TRIALS).toFixed(0)} %, intercept difference (common slope) ${((100 * interHits) / TRIALS).toFixed(0)} %  [data: neither]`);
pool.close();
