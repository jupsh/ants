/**
 * Colony time-step convergence on the Mailleux 1999 fit rows (STATUS
 * 2026-10-10, criterion fixed before results): dt 0.1 (used everywhere),
 * 0.05 and 0.025 at the two fit start points of fitM1999.ts, independent
 * design, 3 days × 240 recruiters per dt (seeds 8.5e9 + 1e7 per dt, so the
 * samples are independent). Criterion, dt 0.1 vs 0.025: Σz² over the 30
 * rows below the χ² 1 % point for the rows scored (30 → 50.9) and no
 * |z| > 3.5; rows degenerate in both handled as in checkM1999Shared.ts.
 * Also reported: each difference in units of the row's SE_data (± its
 * Monte Carlo SE), and dt 0.05. Not compared with the 1999 data; the
 * recruiter's load (an E2 scout) keeps E2's dt.
 *
 * --vary warmup (STATUS 2026-10-10, item 2): warm-up 300 (used), 600 and
 * 900 s instead, compared 300 vs 900 with the same criterion (seeds 8.6e9 +
 * 1e7 per level). --fit f: test at that fit's optimum instead of the start
 * points (pre-registered repeat at each refit optimum).
 *
 * Usage: npx vite-node scripts/convergeM1999.ts [--vary dt|warmup] [--fit data/fits/colony-m1999-<layer>-shared.json] [--n 240]
 */
import { meanSd } from '../src/sim/analysis/compare';
import { M1999_DAYS, M1999_TARGETS, type M1999Day, type M1999Recruiter } from '../src/sim/experiments/colonyMailleux1999';
import { arg, numArg, seedFor } from './lib';
import { m1999Points } from './m1999Points';
import { SimPool } from './pool';

const N = numArg('--n', 240);
const VARY = arg('--vary', 'dt');
if (VARY !== 'dt' && VARY !== 'warmup') throw new Error('--vary dt|warmup');
// Levels: the value in use first, the reference last.
const LEVELS = VARY === 'dt' ? [0.1, 0.05, 0.025] : [300, 600, 900];
// Seeds: the 'converge' namespace, keyed by the knob and the level (STATUS 2026-10-10; were 8.5e9 / 8.6e9 + 1e7 · k).
const seedOf = (k: number) => seedFor(1999, 'converge', VARY === 'dt' ? 0 : 1, k);
const POINTS = m1999Points(arg('--fit', ''));
const CHI2_99: Record<number, number> = { 12: 26.22, 13: 27.69, 14: 29.14, 15: 30.58, 26: 45.64, 27: 46.96, 28: 48.28, 29: 49.59, 30: 50.89 };

const pool = await SimPool.create();
let sumZ2 = 0;
let maxZ = 0;
let rows = 0;
for (const pt of POINTS) {
  const runs: Record<M1999Day, M1999Recruiter[]>[] = [];
  for (const [k, level] of LEVELS.entries()) {
    const t0 = Date.now();
    const knob = VARY === 'dt' ? { warmup: 300, dt: level } : { warmup: level, dt: 0.1 };
    runs.push(Object.fromEntries(await Promise.all(M1999_DAYS.map(async (d) => [d, await pool.m1999(pt.P, { seed: seedOf(k), starvationDays: d, density: pt.density, pipetteAccessible: pt.accessible, ...knob }, N)] as const))) as Record<M1999Day, M1999Recruiter[]>);
    console.log(`${pt.label}, ${VARY} ${level}: ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  console.log(`${pt.label}: z (${VARY} ${LEVELS[0]} vs ${LEVELS[2]}), and differences in SE_data units (± MC SE) for ${LEVELS[0]} and ${LEVELS[1]} vs ${LEVELS[2]}`);
  for (const t of M1999_TARGETS) {
    const s = runs.map((r) => meanSd(r[t.day].map((x) => x[t.stat])));
    const [a, b, c] = s;
    const se = (x: { sd: number; n: number }) => x.sd / Math.sqrt(x.n);
    const seData = t.sd / Math.sqrt(t.n);
    if (!a.n && !c.n) {
      console.log(`  (no value at either level)  ${t.id}`);
      continue;
    }
    const z = a.sd === 0 && c.sd === 0 && a.mean === c.mean ? 0 : (a.mean - c.mean) / Math.hypot(se(a), se(c));
    sumZ2 += z * z;
    maxZ = Math.max(maxZ, Math.abs(z));
    rows++;
    const u = (x: typeof a) => `${((x.mean - c.mean) / seData).toFixed(2)} ± ${(Math.hypot(se(x), se(c)) / seData).toFixed(2)}`;
    console.log(`  z=${z.toFixed(2).padStart(6)}  Δ${LEVELS[0]} ${u(a).padStart(13)}  Δ${LEVELS[1]} ${u(b).padStart(13)}  ${t.id}`);
  }
}
pool.close();
const limit = CHI2_99[rows] ?? NaN;
const pass = sumZ2 < limit && maxZ <= 3.5;
console.log(`Σz² = ${sumZ2.toFixed(1)} over ${rows} rows (pass < ${limit}), max |z| = ${maxZ.toFixed(2)} (pass ≤ 3.5): ${pass ? 'CONVERGED at the resolution of the test' : 'NOT CONVERGED'}`);
