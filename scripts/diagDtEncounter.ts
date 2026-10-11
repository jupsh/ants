/**
 * Step 4b dt diagnosis (STATUS 2026-10-11, encounter detection): how often
 * in-nest ants meet a nestmate "anew" (a contact id not in contact last
 * step, the nest policy's encounter) at each dt, and how many of those are
 * re-contacts with an ant lost only moments before (flicker at the edge of
 * antennal reach). Start point, encounter stops off (so motion is the same
 * process at every dt), one Stroeymeyt colony.
 *
 *   npx vite-node scripts/diagDtEncounter.ts [--colony 0] [--dts 0.1,0.05,0.025] [--warmup 600] [--obs 1200] [--seeds 3]
 */
import { ColonySim } from '../src/sim/experiments/colonyBles';
import { stroeymeytApparatus } from '../src/sim/world/apparatus';
import { stroeymeytRoles } from '../src/sim/experiments/colonyStroeymeyt';
import { arg, numArg, seedFor } from './lib';
import { colonyFromData, loadS2018, S2018_START, s2018Params } from './s2018Lib';

const c = colonyFromData(loadS2018().colonies[numArg('--colony', 0)]);
const DTS = arg('--dts', '0.1,0.05,0.025').split(',').map(Number);
const WARMUP = numArg('--warmup', 600);
const OBS = numArg('--obs', 1200);
const SEEDS = numArg('--seeds', 3);
const P = s2018Params({ ...S2018_START, encounterStop: 0 }, 1 / 3500);
const roles = stroeymeytRoles(c);
const GAPS = [0.25, 0.5, 1, 2];
// Candidate dt-robust definitions: an episode with a nestmate counts as an encounter once its estimated duration
// (span between first and latest sighting + dt) reaches tOn; it ends once the estimated gap (time unseen − dt) exceeds tGap.
const RULES = [0, 0.2, 0.3, 0.5].flatMap((tOn) => [0, 0.5, 1].map((tGap) => ({ tOn, tGap })));

for (const dt of DTS) {
  let onsets = 0;
  let antS = 0;
  const regain = GAPS.map(() => 0);
  const durs: number[] = [];
  const ruleN = RULES.map(() => 0);
  for (let s = 0; s < SEEDS; s++) {
    const sim = new ColonySim(P, { seed: seedFor(2018, 'diag', 0xe4c, s), ants: roles.length, roles, setup: stroeymeytApparatus(), dt, minutes: (WARMUP + OBS) / 60, foodMinute: Infinity, exploreGiveUp: 1000, exploreOutside: true, starvationDays: 0, walkSpeedFactor: 1, tempC: 26 });
    const last = roles.map(() => new Map<number, number>()); // id → contact start
    const lost = roles.map(() => new Map<number, number>()); // id → time contact was lost
    // Per rule, per ant: id → episode (first and latest sighting, counted).
    const eps = RULES.map(() => roles.map(() => new Map<number, { first: number; seen: number; counted: boolean }>()));
    while (sim.stepIndex < sim.steps)
      sim.step((_, info) => {
        const t = info.t;
        info.per.forEach((per, i) => {
          if (!per || !per.inNest || roles[i] === 'queen') return;
          const now = new Set(per.contacts.map((x) => x.id));
          const obs = t >= WARMUP;
          if (obs) antS += dt;
          RULES.forEach((r, k) => {
            const m = eps[k][i];
            for (const [id, e] of m) if (!now.has(id) && t - e.seen - dt > r.tGap + 1e-9) m.delete(id);
            for (const id of now) {
              let e = m.get(id);
              if (!e) m.set(id, (e = { first: t, seen: t, counted: false }));
              e.seen = t;
              if (!e.counted && t - e.first + dt >= r.tOn - 1e-9) {
                e.counted = true;
                if (obs) ruleN[k]++;
              }
            }
          });
          for (const id of now)
            if (!last[i].has(id)) {
              last[i].set(id, t);
              if (obs) {
                onsets++;
                const l = lost[i].get(id);
                if (l !== undefined) GAPS.forEach((g, k) => t - l <= g + 1e-9 && regain[k]++);
              }
            }
          for (const [id, t0] of last[i])
            if (!now.has(id)) {
              last[i].delete(id);
              lost[i].set(id, t);
              if (obs) durs.push(t - t0);
            }
        });
      });
  }
  durs.sort((a, b) => a - b);
  const q = (p: number) => durs[Math.floor(p * (durs.length - 1))];
  console.log(
    `dt ${dt}: ${(onsets / antS).toFixed(4)} onsets per ant-s; re-contacts within ${GAPS.map((g, k) => `${g} s ${((100 * regain[k]) / onsets).toFixed(1)} %`).join(', ')}; contact duration median ${q(0.5).toFixed(2)} s, P10 ${q(0.1).toFixed(2)} s, ≤ 1 step ${((100 * durs.filter((d) => d <= dt + 1e-9).length) / durs.length).toFixed(1)} %`,
  );
  console.log(`  rules (per ant-s): ${RULES.map((r, k) => `on ${r.tOn} gap ${r.tGap}: ${(ruleN[k] / antS).toFixed(4)}`).join('; ')}`);
}
