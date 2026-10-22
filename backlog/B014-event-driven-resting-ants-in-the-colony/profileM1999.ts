/**
 * B014: Mailleux 1999 profile workload for the design (stepped code, as is). B008's workload (largest pilot nest:
 * start 2, density 2.3, 53 nestmates, day 1, 4 independent recruiters, 300 s warm-up, dt 0.1), with
 * `--motion pilot` (as B008: the pilot nest motion) or `--motion c2` (a PROXY for step 5: C2's start-0 in-nest
 * motion keys copied onto the same nest; not a step-5 model, only a cost-representative one). Counts the share of
 * living in-nest ants that start a step resting. Run from the repository root:
 *   node --cpu-prof --cpu-prof-dir backlog/B014-event-driven-resting-ants-in-the-colony/out \
 *     node_modules/.bin/vite-node backlog/B014-event-driven-resting-ants-in-the-colony/profileM1999.ts [--motion pilot|c2] [--dt 0.1] [--warmup 300] [--n 4] [--density d]
 */
import { RNG } from '../../src/sim/core/rng';
import { ColonySim, type ColonyParams } from '../../src/sim/experiments/colonyBles';
import { runRecruiter1999 } from '../../src/sim/experiments/colonyMailleux1999';
import { arg, numArg, seedFor } from '../../scripts/lib';
import { mergeResult } from './merge';
import { m1999Workload } from './m1999Proxy';

const motion = arg('--motion', 'pilot');
const dt = numArg('--dt', 0.1);
const warmup = numArg('--warmup', 300);
const nRec = numArg('--n', 4);
const density = numArg('--density', NaN);
const pt = m1999Workload(motion);
const P: ColonyParams = pt.P;

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

// --lazy (B014 worktree only): lazy resting ants, the switch under test.
const lazy = process.argv.includes('--lazy');
const BASE = seedFor(1999, 'diag', 0xb014);
const t0 = performance.now();
const stays: number[] = [];
for (let k = 0; k < nRec; k++) {
  const r = runRecruiter1999(P, { seed: RNG.stream(BASE, 1, k).int(2 ** 31), starvationDays: 1, density: Number.isNaN(density) ? pt.density : density, pipetteAccessible: pt.accessible, warmup, dt, ...(lazy ? { lazyRest: {} } : {}) });
  stays.push(Math.round(r.timeInNest));
}
const ms = performance.now() - t0;
const res = { motion, lazy, dt, warmup, recruiters: nRec, density: Number.isNaN(density) ? pt.density : density, ms: Math.round(ms), restShare: restSteps / nestSteps, stays };
console.log(JSON.stringify(res));
// With --out f --name k: merged into the stamped results file (run without --cpu-prof for the timing).
if (arg('--out', '')) mergeResult(arg('--out', ''), arg('--name', 'unnamed'), { run: res, cpuProf: process.execArgv.includes('--cpu-prof') });
