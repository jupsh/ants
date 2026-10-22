/**
 * B014: profile workload for the design (stepped code, as is). The largest Stroeymeyt fit colony (colony122) at
 * C2's start 0 (drive SD 1.0 both roles), light phase, dt 0.05, 30 min warm-up + 1 h observed: the D048 set-up.
 * Also counts, over all steps, the share of living in-nest ants that start a step resting (what the event-driven
 * scheme could skip). Run from the repository root:
 *   node --cpu-prof --cpu-prof-dir backlog/B014-event-driven-resting-ants-in-the-colony/out \
 *     node_modules/.bin/vite-node backlog/B014-event-driven-resting-ants-in-the-colony/profile.ts [--drive 1|0.3|0] [--colony colony122]
 */
import { RNG } from '../../src/sim/core/rng';
import { simulateStroeymeyt } from '../../src/sim/experiments/colonyStroeymeyt';
import { ColonySim } from '../../src/sim/experiments/colonyBles';
import { arg, numArg, seedFor } from '../../scripts/lib';
import { mergeResult } from './merge';
import { C2_DRIVE_START, colonyFromData, loadS2018, loadTrips, s2018Params, S2018_START } from '../../scripts/s2018Lib';

const label = arg('--colony', 'colony122');
const drive = numArg('--drive', 1);
const trips = loadTrips();
const d = loadS2018().colonies.find((c) => c.colony === label);
if (!d) throw new Error(`no colony ${label}`);
const P = s2018Params({ ...S2018_START, ...C2_DRIVE_START[0], 'nurse.driveSd': drive, 'forager.driveSd': drive }, trips.outRate, 'C2');
const c = colonyFromData(d);

// Count resting in-nest ants at the start of each step (the fast path's `resting` set) by wrapping step().
let restSteps = 0;
let nestSteps = 0;
const step = ColonySim.prototype.step;
ColonySim.prototype.step = function (this: ColonySim, onStep) {
  this.w.ants.forEach((a, i) => {
    if (!a.body.alive || this.outside[i]) return;
    nestSteps++;
    if (a.mind.mode === 'rest') restSteps++;
  });
  return step.call(this, onStep);
};

// --prealloc N (diagnostic): allocate and drop N small objects first, shifting where garbage collections fall
// relative to the step cycle (B014's test of the stepped runs' bimodal timing).
const pre = numArg('--prealloc', 0);
let sink = 0;
for (let k = 0; k < pre; k++) sink += [k, { k }].length;
if (sink < 0) console.log(sink);
// --retain N (diagnostic): keep N small objects alive for the whole run (a larger retained heap, as more loaded code gives).
const kept = Array.from({ length: numArg('--retain', 0) }, (_, k) => ({ k, v: [k] }));
const t0 = performance.now();
// --lazy (B014 worktree only): lazy resting ants, the switch under test.
const lazy = process.argv.includes('--lazy');
const r = simulateStroeymeyt(P, c, { seed: RNG.stream(seedFor(2018, 'diag', 0xb014), 1).int(2 ** 31), phase: 'light', warmupS: 1800, obsS: 3600, dt: 0.05, exploreGiveUp: trips.exploreGiveUp, exploreGiveUpSd: trips.exploreGiveUpSd, ...(lazy ? { lazyRest: {} } : {}) });
const ms = performance.now() - t0;
const res = { colony: label, ants: c.nurses + c.foragers + 1, drive, lazy, prealloc: pre, retain: kept.length, ms: Math.round(ms), restShare: restSteps / nestSteps, foragersIn: r.foragersIn };
console.log(JSON.stringify(res));
if (kept.length < 0) console.log(kept.length);
// With --out f --name k: merged into the stamped results file (run without --cpu-prof for the timing).
if (arg('--out', '')) mergeResult(arg('--out', ''), arg('--name', 'unnamed'), { run: res, cpuProf: process.execArgv.includes('--cpu-prof') });
