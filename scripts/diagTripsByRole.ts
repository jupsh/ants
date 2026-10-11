/**
 * Step 4b trip-calibration diagnosis (STATUS 2026-10-11): who makes the
 * trips the observer counts? Per role, completed exits from the nest
 * chamber to the foraging area and back (true positions every 0.5 s; the
 * passage keeps the last region), with their durations, at a few trip
 * rates. One Stroeymeyt colony, start point.
 *
 *   npx vite-node scripts/diagTripsByRole.ts [--colony 0] [--explore 1412] [--rates 2000,32000] [--warmup 1200] [--obs 14400] [--seeds 2]
 */
import { ColonySim } from '../src/sim/experiments/colonyBles';
import { stroeymeytRoles } from '../src/sim/experiments/colonyStroeymeyt';
import { stroeymeytApparatus } from '../src/sim/world/apparatus';
import { arg, numArg, seedFor } from './lib';
import { colonyFromData, loadS2018, S2018_START, s2018Params } from './s2018Lib';

const c = colonyFromData(loadS2018().colonies[numArg('--colony', 0)]);
const EXPLORE = numArg('--explore', 1412);
const RATES = arg('--rates', '2000,32000').split(',').map((s) => 1 / Number(s));
const WARMUP = numArg('--warmup', 1200);
const OBS = numArg('--obs', 4 * 3600);
const SEEDS = numArg('--seeds', 2);
const roles = stroeymeytRoles(c);
const DT = 0.1;
const FRAME = 5; // steps per 0.5 s frame

for (const rate of RATES) {
  const trips: Record<string, number[]> = { nurse: [], forager: [] };
  for (let s = 0; s < SEEDS; s++) {
    const sim = new ColonySim(s2018Params(S2018_START, rate), { seed: seedFor(2018, 'probe', 0x7219, 99, s), ants: roles.length, roles, setup: stroeymeytApparatus(), dt: DT, minutes: (WARMUP + OBS) / 60, foodMinute: Infinity, exploreGiveUp: EXPLORE, exploreOutside: true, starvationDays: 0, walkSpeedFactor: 1, tempC: 26 });
    const app = sim.w.apparatus;
    const where = roles.map(() => 'nest');
    const exitAt = roles.map(() => NaN);
    while (sim.stepIndex < sim.steps) {
      sim.step();
      if (sim.stepIndex % FRAME) continue;
      const t = sim.stepIndex * DT;
      sim.w.ants.forEach((a, i) => {
        if (roles[i] === 'queen') return;
        const k = app.regionAt(a.body.x, a.body.y)?.kind;
        const now = k === 'nest' ? 'nest' : k === 'arena' ? 'area' : where[i];
        if (now === where[i]) return;
        if (now === 'area') exitAt[i] = t;
        else if (Number.isFinite(exitAt[i]) && exitAt[i] >= WARMUP) trips[roles[i]].push(t - exitAt[i]);
        where[i] = now;
      });
    }
  }
  const n = { nurse: roles.filter((r) => r === 'nurse').length, forager: roles.filter((r) => r === 'forager').length };
  for (const g of ['nurse', 'forager'] as const) {
    const d = trips[g].sort((a, b) => a - b);
    const mean = d.reduce((a, b) => a + b, 0) / d.length;
    console.log(`outRate 1/${(1 / rate).toFixed(0)} s, ${g}s (${n[g]}): ${d.length} trips (${((d.length / n[g] / SEEDS / OBS) * 3600).toFixed(2)} per ant-h), mean ${mean.toFixed(0)} s, median ${(d[d.length >> 1] ?? NaN).toFixed(0)} s, < 60 s ${d.filter((x) => x < 60).length}`);
  }
}
