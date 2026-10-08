/**
 * Judge E6 reference models against Bles et al. 2022 through the scan
 * observer (docs/STATUS.md, step 2). Writes nothing.
 *
 * Usage: npx vite-node scripts/reportE6.ts [--colonies 200] [--variant TEC_exp] [--fit]
 *   --fit  use the observer-consistent refit in data/fits/e6-tec.json
 */
import fs from 'node:fs';
import { e6Compare, e6Table, e6Targets, simulateColonies } from '../src/sim/experiments/e6Bles';
import { BLES_TABLE1, runBles, type BlesParams } from '../src/sim/reference/blesTEC';

const arg = (k: string, d: string) => {
  const i = process.argv.indexOf(k);
  return i >= 0 ? process.argv[i + 1] : d;
};
const colonies = Number(arg('--colonies', '200'));
const variant = arg('--variant', 'TEC_exp');
let P: BlesParams = { ...BLES_TABLE1[variant], T: 3660 };
if (process.argv.includes('--fit')) P = { ...P, ...JSON.parse(fs.readFileSync('data/fits/e6-tec.json', 'utf8')).params };
const targets = e6Targets(fs.readFileSync('data/bles2022/trophallaxis_scans.csv', 'utf8'));
const t0 = Date.now();
const sim = simulateColonies((rng) => runBles(P, rng), colonies, 6_000_000);
console.log(`${variant}${process.argv.includes('--fit') ? ' (refit)' : ' (published Table 1)'}: ${colonies} colonies through the 60-s scan observer [${((Date.now() - t0) / 1000).toFixed(0)} s]`);
console.log(e6Table(e6Compare(sim, targets)));
