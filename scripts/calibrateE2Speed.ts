/**
 * Derives the E2 context factor on the walker's speed (STATUS 2026-10-09
 * amendment "walking speed in E2"): bisection on f so that the model's
 * homebound mid-bridge speed — mean over scouts of 2.5 cm ÷ each scout's
 * time over the 2.5 cm at mid-bridge, as Mailleux et al. 2000/2006 report
 * it — equals 1.6 cm/s (3 µL drop, 4 d starved). Model: the adopted E2
 * parameters with loadSlowdown 0; common seeds at every f. Not fitted to
 * any E2 target. Also reports the SD (data 0.6 cm/s) and, at the chosen f,
 * the speed at 0.3 / 0.7 / 1 µL drops (2000: 1.9 / 1.9 / 1.5 cm/s; not used).
 * Writes nothing; the value goes into lasiusM1.ts (E2_CONTEXT_DEF).
 *
 * Usage: npx vite-node scripts/calibrateE2Speed.ts [--n 1000]
 */
import type { ScoutResult } from '../src/sim/experiments/e2Mailleux';
import { LASIUS_PARAMS, MAILLEUX_SETUP } from '../src/sim/species/lasiusM1';
import { numArg } from './lib';
import { SimPool } from './pool';

const N = numArg('--n', 1000);
const TARGET = 16; // mm/s
const SEED = 4_280_000_000; // disjoint from fits, profiles, selection, synthetic data, regE2Drops and recovery
const P = { ...LASIUS_PARAMS, forager: { ...LASIUS_PARAMS.forager, loadSlowdown: 0 } };
const pool = await SimPool.create();
const speed = async (f: number, ul = 3) => {
  const opts = Array.from({ length: N }, (_, i) => ({ seed: SEED + i, drop1: { ul, molar: 0.6 }, pipetteAccessible: MAILLEUX_SETUP.accessible, volumeSd: MAILLEUX_SETUP.volumeSd, starvationDays: 4, dt: 0.1, maxTime: 900, walkSpeedFactor: f }));
  const v = ((await pool.scouts(P, opts)) as ScoutResult[]).filter((r) => r.drinks.length).map((r) => r.homeSpeedMidBridge).filter(Number.isFinite);
  const m = v.reduce((a, x) => a + x, 0) / v.length;
  return { m, sd: Math.sqrt(v.reduce((a, x) => a + (x - m) ** 2, 0) / (v.length - 1)), n: v.length };
};
const at1 = await speed(1);
console.log(`f = 1: ${(at1.m / 10).toFixed(2)} ± ${(at1.sd / 10).toFixed(2)} cm/s (n ${at1.n})   [data 1.6 ± 0.6 cm/s]`);
let lo = 0.1;
let hi = 1;
let cur = at1;
let f = 1;
while (Math.abs(cur.m - TARGET) > 0.1 && hi - lo > 1e-4) {
  f = (lo + hi) / 2;
  cur = await speed(f);
  if (cur.m > TARGET) hi = f;
  else lo = f;
  console.log(`  f = ${f.toFixed(4)}: ${(cur.m / 10).toFixed(3)} cm/s`);
}
console.log(`→ f = ${f.toFixed(3)}: ${(cur.m / 10).toFixed(2)} ± ${(cur.sd / 10).toFixed(2)} cm/s (n ${cur.n})   [data 1.6 ± 0.6]`);
for (const ul of [0.3, 0.7, 1]) {
  const s = await speed(f, ul);
  console.log(`  at ${ul} µL: ${(s.m / 10).toFixed(2)} ± ${(s.sd / 10).toFixed(2)} cm/s (n ${s.n})   [2000: ${{ 0.3: '1.9 ± 0.7', 0.7: '1.9 ± 1.1', 1: '1.5 ± 0.7' }[ul]}; reported, not used]`);
}
pool.close();
