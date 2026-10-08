/**
 * Judge E6 reference models against Bles et al. 2022 through the scan
 * observer (docs/STATUS.md, step 2). Writes nothing.
 *
 * Usage: npx vite-node scripts/reportE6.ts [--colonies 200] [--variant TEC_exp] [--fit]
 *   --fit  use the observer-consistent refit in data/fits/e6-tec.json
 */
import { e6Compare, e6Table, e6Targets } from '../src/sim/experiments/e6Bles';
import { BLES_TABLE1, type BlesParams } from '../src/sim/reference/blesTEC';
import { arg, BLES_SCANS, flag, readJson } from './lib';
import { SimPool } from './pool';

const colonies = Number(arg('--colonies', '200'));
const variant = arg('--variant', 'TEC_exp');
let P: BlesParams = { ...BLES_TABLE1[variant], T: 3660 };
if (flag('--fit')) P = { ...P, ...readJson<any>('data/fits/e6-tec.json').params };
const targets = e6Targets(BLES_SCANS());
const t0 = Date.now();
const pool = await SimPool.create();
const sim = await pool.blesColonies(P, colonies, 6_000_000);
pool.close();
console.log(`${variant}${flag('--fit') ? ' (refit)' : ' (published Table 1)'}: ${colonies} colonies through the 60-s scan observer [${((Date.now() - t0) / 1000).toFixed(0)} s]`);
console.log(e6Table(e6Compare(sim, targets)));
