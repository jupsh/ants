/**
 * Colony convergence on the Mailleux 1999 fit rows, by equivalence
 * (STATUS 2026-10-10, adopted; replaces the χ² significance version before
 * any of its results was used): the setting in use vs a reference — dt 0.1
 * vs 0.025, or warm-up 300 vs 900 s (--vary) — at the two fit start points
 * (or at a fit's optimum, --fit), independent design, 1600 recruiters per
 * day per level with **paired seeds** (the same nest and recruiter streams at
 * both levels).
 *
 * Per fit row: Δ = (mean_used − mean_ref) / SE_data, with a 90 % percentile
 * bootstrap CI (2000 resamples of recruiter indices per day, rows and both
 * levels resampled jointly, so within-recruiter and pairing dependence are
 * kept). Pass: every row's CI inside ±0.5 (intersection–union: overall 5 %
 * without a multiplicity correction). Rows estimable at neither level are
 * listed and excluded; a row estimable at one level only fails. Also
 * printed: the no-bout fraction at each level. Not compared with the 1999
 * data (only SE_data is used, as the unit); the means are not printed.
 *
 * Usage: npx vite-node scripts/convergeM1999.ts [--vary dt|warmup] [--fit data/fits/colony-m1999-<layer>-shared.json] [--n 1600]
 */
import { RNG } from '../src/sim/core/rng';
import { M1999_DAYS, M1999_TARGETS, m1999NoBout, type M1999Day, type M1999Recruiter, type M1999Stat } from '../src/sim/experiments/colonyMailleux1999';
import { arg, numArg, seedFor } from './lib';
import { m1999Points } from './m1999Points';
import { SimPool } from './pool';

const N = numArg('--n', 1600);
const VARY = arg('--vary', 'dt');
if (VARY !== 'dt' && VARY !== 'warmup') throw new Error('--vary dt|warmup');
// The value in use first, the reference second.
const LEVELS = arg('--levels', '') ? arg('--levels', '').split(',').map(Number) : VARY === 'dt' ? [0.1, 0.025] : [300, 900];
const TOL = 0.5;
// --contactGap g: merge contact episodes separated by ≤ g s (diagnostic, STATUS 2026-10-10 night).
const GAP = numArg('--contactGap', 0);
const B = 2000;
const POINTS = m1999Points(arg('--fit', ''));
// Paired: one seed per point for both levels ('converge' namespace, keyed by the knob and the point).
const seedOf = (p: number) => seedFor(1999, 'converge', VARY === 'dt' ? 10 : 11, p);

function mean(xs: M1999Recruiter[], idx: number[], stat: M1999Stat): number {
  let s = 0;
  let k = 0;
  for (const i of idx) {
    const v = xs[i][stat];
    if (Number.isFinite(v)) {
      s += v;
      k++;
    }
  }
  return k ? s / k : NaN;
}

const pool = await SimPool.create();
let pass = true;
for (const [p, pt] of POINTS.entries()) {
  const runs: Record<M1999Day, M1999Recruiter[]>[] = [];
  for (const level of LEVELS) {
    const t0 = Date.now();
    const knob = VARY === 'dt' ? { warmup: 300, dt: level } : { warmup: level, dt: 0.1 };
    runs.push(Object.fromEntries(await Promise.all(M1999_DAYS.map(async (d) => [d, await pool.m1999(pt.P, { seed: seedOf(p), starvationDays: d, density: pt.density, pipetteAccessible: pt.accessible, contactGap: GAP, ...knob }, N)] as const))) as Record<M1999Day, M1999Recruiter[]>);
    console.log(`${pt.label}, ${VARY} ${level}: ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  const [a, c] = runs;
  console.log(`${pt.label}: no-bout fraction ${M1999_DAYS.map((d) => `${d} d ${(100 * m1999NoBout(a[d])).toFixed(1)} / ${(100 * m1999NoBout(c[d])).toFixed(1)} %`).join(', ')} (${LEVELS[0]} / ${LEVELS[1]})`);
  // Bootstrap resamples of recruiter indices, one set per day, shared by all rows and both levels.
  const rng = RNG.stream(seedFor(1999, 'converge', 99, p));
  const all = Array.from({ length: N }, (_, i) => i);
  const resamples = Object.fromEntries(M1999_DAYS.map((d) => [d, Array.from({ length: B }, () => Array.from({ length: N }, () => rng.int(N)))])) as Record<M1999Day, number[][]>;
  console.log(`${pt.label}: Δ (${VARY} ${LEVELS[0]} − ${LEVELS[1]}) in SE_data units, 90 % bootstrap CI; pass if inside ±${TOL}`);
  for (const t of M1999_TARGETS) {
    const seData = t.sd / Math.sqrt(t.n);
    const ma = mean(a[t.day], all, t.stat);
    const mc = mean(c[t.day], all, t.stat);
    if (!Number.isFinite(ma) && !Number.isFinite(mc)) {
      console.log(`  (estimable at neither level)  ${t.id}`);
      continue;
    }
    if (!Number.isFinite(ma) || !Number.isFinite(mc)) {
      pass = false;
      console.log(`  FAIL (estimable at one level only)  ${t.id}`);
      continue;
    }
    const ds = resamples[t.day].map((idx) => (mean(a[t.day], idx, t.stat) - mean(c[t.day], idx, t.stat)) / seData).filter(Number.isFinite).sort((x, y) => x - y);
    const lo = ds[Math.floor(0.05 * (ds.length - 1))];
    const hi = ds[Math.ceil(0.95 * (ds.length - 1))];
    const ok = lo > -TOL && hi < TOL;
    if (!ok) pass = false;
    console.log(`  ${ok ? 'ok  ' : 'FAIL'} Δ ${((ma - mc) / seData).toFixed(2).padStart(6)}  CI [${lo.toFixed(2)}, ${hi.toFixed(2)}]  ${t.id}`);
  }
}
pool.close();
console.log(`${VARY}: ${pass ? 'EQUIVALENT within ±0.5 SE_data on every row (converged at this tolerance)' : 'NOT SHOWN EQUIVALENT'}`);
