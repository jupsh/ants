/**
 * Implementation check of option B's stops in the colony runner (STATUS
 * 2026-10-10 night; not a test of the model — the sources are read). In the
 * nest chamber with 20 workers (half with the forager trait), no food, no
 * hunger and no leaving: the maximum-likelihood walk-on hazard from a stop
 * with k stopped nestmates in contact (transitions ÷ time at risk) should
 * equal a·(1 + k)^−b, and the stop rate of walking ants not meeting anyone
 * should equal activeToRest (in the nest region; outside it the ant heads
 * back and does not stop). Also reports the time stopped and the encounter
 * rate (described, not compared with anything). At dt 0.025 the per-step
 * estimate of a hazard r reads (1 − e^(−r·dt))/dt (3.9 /s → 3.72).
 *
 * Usage: npx vite-node scripts/checkStopsB.ts [--minutes 60] [--runs 8]
 */
import { ColonySim } from '../src/sim/experiments/colonyBles';
import { LASIUS_NEST_B, LASIUS_PARAMS } from '../src/sim/species/lasiusM1';
import { numArg } from './lib';

const MINUTES = numArg('--minutes', 60);
const RUNS = numArg('--runs', 8);
const P = { ...LASIUS_PARAMS, nest: { ...LASIUS_NEST_B, leaveRate: 0, foragerFrac: 0.5 } };
type Acc = { events: number; time: number };
const acc = (): Acc => ({ events: 0, time: 0 });
const walkOn: Record<'forager' | 'nurse', Acc[]> = { forager: [0, 1, 2, 3].map(acc), nurse: [0, 1, 2, 3].map(acc) };
const spont: Record<'forager' | 'nurse', Acc> = { forager: acc(), nurse: acc() };
let stopped = 0;
let total = 0;
let encounters = 0;
for (let r = 0; r < RUNS; r++) {
  const sim = new ColonySim(P, { seed: 0x5709 + r, ants: 20, dt: 0.025, minutes: MINUTES, foodMinute: Infinity, starvationDays: 0 });
  const prev = sim.w.ants.map((a) => ({ mode: a.mind.mode, contacts: new Set<number>() }));
  while (sim.stepIndex < sim.steps)
    sim.step((w, info) => {
      w.ants.forEach((a, i) => {
        const per = info.per[i]!;
        const caste = a.mind.traits.forager ? 'forager' : 'nurse';
        const q = prev[i];
        // The state this step's decision was taken in (percept of this step, mode before it).
        const k = per.contacts.filter((c) => !c.moving).length;
        const newContact = per.contacts.some((c) => !q.contacts.has(c.id));
        if (q.mode === 'rest' && k < 4) {
          walkOn[caste][k].time += info.t > 0 ? sim.dt : 0;
          if (a.mind.mode === 'active') walkOn[caste][k].events++;
        }
        if (q.mode === 'active' && !newContact && per.inNest) {
          spont[caste].time += sim.dt;
          if (a.mind.mode === 'rest') spont[caste].events++;
        }
        if (q.mode === 'active' && newContact) encounters++;
        stopped += a.mind.mode === 'rest' ? 1 : 0;
        total++;
        prev[i] = { mode: a.mind.mode, contacts: new Set(per.contacts.map((c) => c.id)) };
      });
    });
}
const exp = { forager: P.nest.forager!, nurse: P.nest };
for (const caste of ['nurse', 'forager'] as const) {
  const e = exp[caste];
  const a = e.restToActive!;
  const b = e.restCrowdExp!;
  console.log(`${caste}: spontaneous stop ${(spont[caste].events / spont[caste].time).toFixed(3)} /s (input ${e.activeToRest}; ${spont[caste].events} stops)`);
  walkOn[caste].forEach((x, k) => {
    const est = x.events / x.time;
    const se = Math.sqrt(x.events) / x.time;
    console.log(`  walk-on, ${k} stopped nestmates: ${est.toFixed(3)} ± ${se.toFixed(3)} /s (input a·N^−b ${(a * Math.pow(1 + k, -b)).toFixed(3)}; ${x.events} events, ${x.time.toFixed(0)} s)`);
  });
}
console.log(`time stopped ${((100 * stopped) / total).toFixed(0)} %; walking ants meet a new nestmate on ${encounters} steps (described, not compared)`);
