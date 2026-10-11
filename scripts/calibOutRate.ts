/**
 * Step 4b input (STATUS 2026-10-11): the foragers' trip rate `outRate`,
 * set so that the simulated share of foragers whose latest detection is in
 * the nest (`foragerIn`, the same observer as the data) matches the data's
 * mean over colonies and phases. Bisection in log rate on all 22 fit
 * colonies at the given motion values (default: the start point).
 *
 *   npx vite-node scripts/calibOutRate.ts [--fit data/fits/s2018-motion.json] [--warmup 1200] [--obs 3600] [--iters 8]
 */
import fs from 'node:fs';
import { arg, numArg, seedFor } from './lib';
import { SimPool } from './pool';
import { colonyFromData, loadS2018, S2018_START, s2018Params, simulateAll } from './s2018Lib';

const data = loadS2018();
const target = (data.across['foragerIn.light'].mean + data.across['foragerIn.dark'].mean) / 2;
const fit = arg('--fit', '');
const values = fit ? JSON.parse(fs.readFileSync(fit, 'utf8')).free : S2018_START;
const colonies = data.colonies.map(colonyFromData);
const o = { phase: 'light' as const, warmupS: numArg('--warmup', 1200), obsS: numArg('--obs', 3600), dt: 0.1 };
const pool = await SimPool.create();
const share = async (rate: number) => {
  const runs = await simulateAll(pool, s2018Params(values, rate), colonies, o, (i) => seedFor(2018, 'probe', 0x0a7e, i));
  const v = runs.map((r) => r.rows['foragerIn.light']).filter(Number.isFinite);
  return v.reduce((a, b) => a + b, 0) / v.length;
};
console.log(`target foragerIn ${target.toFixed(3)} (light ${data.across['foragerIn.light'].mean.toFixed(3)}, dark ${data.across['foragerIn.dark'].mean.toFixed(3)})`);
// The share falls as the rate rises; bracket in log rate.
let lo = Math.log(1 / 20000);
let hi = Math.log(1 / 20);
for (let k = 0; k < numArg('--iters', 8); k++) {
  const mid = (lo + hi) / 2;
  const s = await share(Math.exp(mid));
  console.log(`outRate 1/${(1 / Math.exp(mid)).toFixed(0)} s: foragerIn ${s.toFixed(3)}`);
  if (s > target) lo = mid;
  else hi = mid;
}
console.log(`outRate ≈ ${Math.exp((lo + hi) / 2).toPrecision(3)} /s (1/${(1 / Math.exp((lo + hi) / 2)).toFixed(0)} s)`);
pool.close();
