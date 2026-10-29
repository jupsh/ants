// B004, simulation side: one colony at C2's fitted settings through the frozen tracker → out/sim-c<i>.json.
// Set-up as scripts/scratch/tmpShortSim.ts with --candidate C2 --fit data/fits/s2018-motion-c2.json --trips (no activity recorder, observation only; 4 h after a
// 2 h warm-up, light phase, dt 0.05); only the recorder differs. No tag angle in the model.
//   nice -n 10 npx vite-node backlog/B004-slow-displacement-in-still-periods/stillSim.ts --colony i [--obs 14400] [--seed k]
import fs from 'node:fs';
import { InNestAccumulator } from '../../src/sim/analysis/inNest';
import { simulateStroeymeyt, stroeymeytRoles } from '../../src/sim/experiments/colonyStroeymeyt';
import { numArg, readJson, seedFor, writeJson } from '../../scripts/lib';
import { colonyFromData, loadS2018, loadTrips, s2018Params, withObsVariant } from '../../scripts/s2018Lib';
import { StillForm } from './stillForm';

const ci = numArg('--colony', 0);
const SEED = seedFor(2018, 'diag', 0xb004, ci, numArg('--seed', 0));
const c = withObsVariant(colonyFromData(loadS2018().colonies[ci]));
const TRIPS = loadTrips();
const fit = readJson<{ free: Record<string, number> }>('data/fits/s2018-motion-c2.json');
const P = s2018Params(fit.free, TRIPS.outRate, 'C2');
const roles = stroeymeytRoles(c);
const nurse = new StillForm(roles.map((r) => r === 'nurse'), c.noiseSd, 1 + ci);
const forager = new StillForm(roles.map((r) => r === 'forager'), c.noiseSd, 1 + ci);
const made: InNestAccumulator[] = [];
const frameFn = InNestAccumulator.prototype.frame;
InNestAccumulator.prototype.frame = function (this: InNestAccumulator, f: number, hour: number, n: number, ids: number[], xs: number[], ys: number[], ins: boolean[]) {
  if (!made.includes(this)) made.push(this);
  if (this === made[0]) {
    nurse.frame(f, ids, xs, ys, ins);
    forager.frame(f, ids, xs, ys, ins);
  }
  return frameFn.call(this, f, hour, n, ids, xs, ys, ins);
} as typeof frameFn;
const obs = numArg('--obs', 14400);
simulateStroeymeyt(P, c, { seed: SEED, phase: 'light', warmupS: 7200, obsS: obs, dt: 0.05, exploreGiveUp: TRIPS.exploreGiveUp, exploreGiveUpSd: TRIPS.exploreGiveUpSd });
nurse.finish();
forager.finish();
fs.mkdirSync('backlog/B004-slow-displacement-in-still-periods/out', { recursive: true });
writeJson(`backlog/B004-slow-displacement-in-still-periods/out/sim-c${ci}.json`, { colony: c.label, hours: obs / 3600, seed: SEED, nurse: nurse.out(), forager: forager.out() });
console.log(`${c.label} done: nurse runs ${nurse.nRuns}, forager runs ${forager.nRuns}`);
