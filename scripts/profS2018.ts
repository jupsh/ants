/**
 * One Stroeymeyt colony in this process (no pool), for CPU profiles at a
 * step-4b point (faster-fit.md §1.1):
 *
 *   node --cpu-prof --cpu-prof-dir logs/prof node_modules/.bin/vite-node scripts/profS2018.ts
 *     [--colony colony201] [--set k=v,…] [--dt 0.05] [--warmup 1800] [--obs 3600]
 *
 * Values: S2018_START with `--set` overrides. Prints the wall time.
 */
import { simulateStroeymeyt } from '../src/sim/experiments/colonyStroeymeyt';
import { arg, numArg, seedFor } from './lib';
import { colonyFromData, loadS2018, loadTrips, S2018_START, s2018Params } from './s2018Lib';

const LABEL = arg('--colony', 'colony201');
const SET = Object.fromEntries((arg('--set', '') as string).split(',').filter(Boolean).map((kv) => [kv.split('=')[0], Number(kv.split('=')[1])]));
const { outRate, exploreGiveUp, exploreGiveUpSd } = loadTrips();
const data = loadS2018().colonies;
const i = data.findIndex((c) => c.colony === LABEL);
if (i < 0) throw new Error(`no colony ${LABEL}`);
const t0 = Date.now();
const r = simulateStroeymeyt(s2018Params({ ...S2018_START, ...SET }, outRate), colonyFromData(data[i]), {
  seed: seedFor(2018, 'diag', 0xd1a9, i),
  phase: 'light',
  warmupS: numArg('--warmup', 1800),
  obsS: numArg('--obs', 3600),
  dt: numArg('--dt', 0.05),
  exploreGiveUp,
  exploreGiveUpSd,
});
console.log(`${LABEL}: ${((Date.now() - t0) / 1000).toFixed(1)} s, still nurse ${r.rows['still.nurse.light'].toFixed(3)}, forager ${r.rows['still.forager.light'].toFixed(3)}`);
