/**
 * Loss surface scan for the E1 walking model: evaluate the fit objective
 * (SE_data-only z, observer on) on a grid of two parameters, all others held
 * at a fit file's values. A diagnostic for optimiser problems; writes nothing.
 *
 * Usage: npx vite-node scripts/scanE1.ts --fit data/fits/e1-B.json --incline 1
 *          --x turnRateTime=0.3,1,2,4 --y meanFreePath=10,15,20 [--ants 160]
 */
import { compareE1, referenceFor } from '../src/sim/experiments/e1Compare';
import { walkParams, type WalkParams } from '../src/sim/models/walk';
import { khuongTracking } from '../src/sim/species/lasiusM1';
import { arg, INCLINES, loadKhuong, numArg, readJson } from './lib';
import { SimPool } from './pool';

const p0 = walkParams(readJson<any>(arg('--fit', 'data/fits/e1-walk.json')).params);
const k = numArg('--incline', 1);
const ANTS = numArg('--ants', 160);
const axis = (s: string) => {
  const [key, vals] = s.split('=');
  return { key: key as keyof WalkParams, vals: vals.split(',').map(Number) };
};
const X = axis(arg('--x', 'turnRateTime=0.3'));
const Y = axis(arg('--y', 'meanFreePath=10'));
const ref = referenceFor(loadKhuong(k));
const pool = await SimPool.create();
console.log(`incline ${k}; rows ${Y.key}, columns ${X.key}`);
console.log(''.padStart(10) + X.vals.map((v) => String(v).padStart(9)).join(''));
for (const y of Y.vals) {
  const row: string[] = [];
  for (const x of X.vals) {
    const p = { ...p0, [X.key]: x, [Y.key]: y };
    const sim = await pool.e1Sample(p, { incline: INCLINES[k - 1], ants: ANTS, seed: 20131105 + k - 1, dt: 0.02, tracking: khuongTracking(k) });
    row.push(compareE1(sim, ref).loss.toFixed(1).padStart(9));
  }
  console.log(String(y).padStart(10) + row.join(''));
}
pool.close();
