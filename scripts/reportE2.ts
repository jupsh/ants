/**
 * Judge the current E2 fit against Mailleux et al. 1999/2009 with the
 * combined-SE criteria (docs/STATUS.md, Evidence policy § Criteria).
 * Writes nothing.
 *
 * Usage: npx vite-node scripts/reportE2.ts [--n 150] [--blocks 10]
 */
import { e2Compare, e2Table, simulateE2 } from '../src/sim/experiments/e2Targets';
import { LASIUS_PARAMS, MAILLEUX_PIPETTE_ACCESSIBLE } from '../src/sim/species/lasiusM1';

const arg = (k: string, d: number) => {
  const i = process.argv.indexOf(k);
  return i >= 0 ? Number(process.argv[i + 1]) : d;
};
const t0 = Date.now();
const sim = simulateE2(LASIUS_PARAMS, arg('--n', 150), MAILLEUX_PIPETTE_ACCESSIBLE, 0.1, 7_000_000, arg('--blocks', 10));
console.log(e2Table(e2Compare(sim)));
console.log(`found both drops: ${(sim['two.foundBoth'].mean * 100).toFixed(0)}%  [${((Date.now() - t0) / 1000).toFixed(0)} s]`);
