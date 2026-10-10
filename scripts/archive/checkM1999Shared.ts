/**
 * Design-equivalence check for shared warm-ups (STATUS 2026-10-10, criterion
 * fixed before results): at the two fit start points of fitM1999.ts, 3 days
 * × 240 recruiters per design (independent; shared with 8 per nest), z of
 * the difference of means per fit row (SE from recruiters in the
 * independent design, from nests in the shared design). Pass: Σz² over the
 * 30 rows < 50.9 (χ²₃₀, p 0.01) and no |z| > 3.5. Rows degenerate in both
 * designs: see the amendment in the loop (threshold then χ² at p 0.01 for the
 * rows scored). The designs are compared
 * with each other only; nothing here is compared with the 1999 data, and
 * the means are not printed.
 *
 * Usage: npx vite-node scripts/checkM1999Shared.ts
 */
import { blockEstimate, meanSd } from '../../src/sim/analysis/compare';
import type { ColonyParams } from '../../src/sim/experiments/colonyBles';
import { M1999_DAYS, M1999_TARGETS, type M1999Day, type M1999Recruiter } from '../../src/sim/experiments/colonyMailleux1999';
import { LASIUS_NEST, LASIUS_PARAMS, MAILLEUX_SETUP } from '../../src/sim/species/lasiusM1';
import { SimPool } from '../pool';

const N = 240;
const PER_NEST = 8;
const WARMUP = 300;
const P0: ColonyParams = { ...LASIUS_PARAMS, nest: LASIUS_NEST };
// The two start points of fitM1999.ts (main layer).
const POINTS: { label: string; P: ColonyParams; density: number }[] = [
  { label: 'start 1', P: P0, density: 1 },
  { label: 'start 2', P: { ...P0, nest: { ...P0.nest, nestSpeedFactor: 0.2, returnRate: 1 / 30, shareEnd: 1 / 30 } }, density: 2.3 },
];

const pool = await SimPool.create();
let sumZ2 = 0;
let maxZ = 0;
let rows = 0;
for (const pt of POINTS) {
  const o = (day: M1999Day, seed: number) => ({ seed, starvationDays: day, density: pt.density, pipetteAccessible: MAILLEUX_SETUP.accessible, warmup: WARMUP });
  let t0 = Date.now();
  const ind = Object.fromEntries(await Promise.all(M1999_DAYS.map(async (d) => [d, await pool.m1999(pt.P, o(d, 8_100_000_000), N)] as const))) as Record<M1999Day, M1999Recruiter[]>;
  const tInd = (Date.now() - t0) / 1000;
  t0 = Date.now();
  const sh = Object.fromEntries(await Promise.all(M1999_DAYS.map(async (d) => [d, await pool.m1999Shared(pt.P, o(d, 8_200_000_000), N, PER_NEST)] as const))) as Record<M1999Day, M1999Recruiter[]>;
  const tSh = (Date.now() - t0) / 1000;
  console.log(`${pt.label}: independent ${tInd.toFixed(0)} s, shared ${tSh.toFixed(0)} s (wall, ${3 * N} recruiters each; speed-up ${(tInd / tSh).toFixed(2)}×)`);
  for (const t of M1999_TARGETS) {
    const a = ind[t.day].map((x) => x[t.stat]);
    const sa = meanSd(a);
    const seA = sa.sd / Math.sqrt(sa.n);
    const b = sh[t.day].map((x) => x[t.stat]);
    const nests = Array.from({ length: N / PER_NEST }, (_, j) => b.slice(j * PER_NEST, (j + 1) * PER_NEST));
    const eb = blockEstimate(nests);
    // Rows degenerate in both designs (amended after the first run, STATUS 2026-10-10): no finite value in
    // either → excluded and listed; the same constant in both (zero spread) → exact agreement, z = 0.
    if (!sa.n && !Number.isFinite(eb.mean)) {
      console.log(`  (no value in either design)  ${t.id}`);
      continue;
    }
    const z = sa.sd === 0 && eb.sd === 0 && sa.mean === eb.mean ? 0 : (eb.mean - sa.mean) / Math.hypot(seA, eb.se);
    sumZ2 += z * z;
    maxZ = Math.max(maxZ, Math.abs(z));
    rows++;
    console.log(`  z=${z.toFixed(2).padStart(6)}  ${t.id}`);
  }
}
pool.close();
// χ² 1 % points for the row counts that can occur (26–30).
const CHI2_99: Record<number, number> = { 26: 45.64, 27: 46.96, 28: 48.28, 29: 49.59, 30: 50.89 };
const limit = CHI2_99[rows] ?? NaN;
const pass = sumZ2 < limit && maxZ <= 3.5;
console.log(`Σz² = ${sumZ2.toFixed(1)} over ${rows} rows (pass < ${limit}), max |z| = ${maxZ.toFixed(2)} (pass ≤ 3.5): ${pass ? 'PASS' : 'FAIL'}`);
