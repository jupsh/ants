/**
 * Step 4b dt diagnosis (STATUS 2026-10-11, encounter detection): how often
 * in-nest ants meet a nestmate "anew" (a contact id not in contact last
 * step, the nest policy's encounter) at each dt, how many of those are
 * re-contacts with an ant lost only moments before (flicker at the edge of
 * antennal reach), and the onset rates of candidate dt-robust episode
 * rules. Start point, encounter stops off (so motion is the same process
 * at every dt), one Stroeymeyt colony.
 *
 *   npx vite-node scripts/diagDtEncounter.ts [--colony 0] [--dts 0.1,0.05,0.025] [--warmup 600] [--obs 1200] [--seeds 3]
 *
 * --sub n,...: instead, one run per seed at the first of --dts, with
 * contacts read on every n-th step only (detection at dt × n on the same
 * trajectories: the detection error alone, without the sampling noise of
 * separate runs).
 */
import { ColonySim } from '../src/sim/experiments/colonyBles';
import { stroeymeytRoles } from '../src/sim/experiments/colonyStroeymeyt';
import { stroeymeytApparatus } from '../src/sim/world/apparatus';
import { arg, numArg, seedFor } from './lib';
import { colonyFromData, loadS2018, S2018_START, s2018Params } from './s2018Lib';

const c = colonyFromData(loadS2018().colonies[numArg('--colony', 0)]);
const DTS = arg('--dts', '0.1,0.05,0.025').split(',').map(Number);
const SUB = arg('--sub', '').split(',').filter(Boolean).map(Number);
const WARMUP = numArg('--warmup', 600);
const OBS = numArg('--obs', 1200);
const SEEDS = numArg('--seeds', 3);
const P = s2018Params({ ...S2018_START, encounterStop: 0 }, 1 / 3500);
const roles = stroeymeytRoles(c);
const GAPS = [0.25, 0.5, 1, 2];
// Candidate dt-robust definitions: an episode with a nestmate counts as an encounter once its estimated duration
// (span between first and latest sighting + dt) reaches tOn; it ends once the estimated gap (time unseen − dt) exceeds tGap.
const RULES = [0, 0.2, 0.3, 0.5].flatMap((tOn) => [0, 0.5, 1].map((tGap) => ({ tOn, tGap })));

/** Contact statistics as read every `stride` steps of a run. */
class Counter {
  onsets = 0;
  antS = 0;
  regain = GAPS.map(() => 0);
  durs: number[] = [];
  ruleN = RULES.map(() => 0);
  private last = roles.map(() => new Map<number, number>()); // id → contact start
  private lost = roles.map(() => new Map<number, number>()); // id → time contact was lost
  private eps = RULES.map(() => roles.map(() => new Map<number, { first: number; seen: number; counted: boolean }>()));
  constructor(
    readonly dt: number,
    readonly stride: number,
  ) {}
  /** Fresh per-ant state for a new run (totals kept). */
  reset() {
    this.last = roles.map(() => new Map());
    this.lost = roles.map(() => new Map());
    this.eps = RULES.map(() => roles.map(() => new Map()));
  }
  read(i: number, t: number, ids: Set<number>) {
    const dt = this.dt;
    const obs = t >= WARMUP;
    if (obs) this.antS += dt;
    RULES.forEach((r, k) => {
      const m = this.eps[k][i];
      for (const [id, e] of m) if (!ids.has(id) && t - e.seen - dt > r.tGap + 1e-9) m.delete(id);
      for (const id of ids) {
        let e = m.get(id);
        if (!e) m.set(id, (e = { first: t, seen: t, counted: false }));
        e.seen = t;
        if (!e.counted && t - e.first + dt >= r.tOn - 1e-9) {
          e.counted = true;
          if (obs) this.ruleN[k]++;
        }
      }
    });
    const last = this.last[i];
    for (const id of ids)
      if (!last.has(id)) {
        last.set(id, t);
        if (obs) {
          this.onsets++;
          const l = this.lost[i].get(id);
          if (l !== undefined) GAPS.forEach((g, k) => t - l <= g + 1e-9 && this.regain[k]++);
        }
      }
    for (const [id, t0] of last)
      if (!ids.has(id)) {
        last.delete(id);
        this.lost[i].set(id, t);
        if (obs) this.durs.push(t - t0);
      }
  }
  report(label: string) {
    const durs = this.durs.sort((a, b) => a - b);
    const q = (p: number) => durs[Math.floor(p * (durs.length - 1))];
    console.log(
      `${label}: ${(this.onsets / this.antS).toFixed(4)} onsets per ant-s; re-contacts within ${GAPS.map((g, k) => `${g} s ${((100 * this.regain[k]) / this.onsets).toFixed(1)} %`).join(', ')}; contact duration median ${q(0.5).toFixed(2)} s, P10 ${q(0.1).toFixed(2)} s, ≤ 1 step ${((100 * durs.filter((d) => d <= this.dt + 1e-9).length) / durs.length).toFixed(1)} %`,
    );
    console.log(`  rules (per ant-s): ${RULES.map((r, k) => `on ${r.tOn} gap ${r.tGap}: ${(this.ruleN[k] / this.antS).toFixed(4)}`).join('; ')}`);
  }
}

/** Run each seed at `simDt`, feeding every counter its every-`stride`-th step. */
function run(simDt: number, counters: Counter[]) {
  for (let s = 0; s < SEEDS; s++) {
    const sim = new ColonySim(P, { seed: seedFor(2018, 'converge', 0xe4c, s), ants: roles.length, roles, setup: stroeymeytApparatus(), dt: simDt, minutes: (WARMUP + OBS) / 60, foodMinute: Infinity, exploreGiveUp: 1000, exploreOutside: true, starvationDays: 0, walkSpeedFactor: 1, tempC: 26 });
    for (const k of counters) k.reset();
    while (sim.stepIndex < sim.steps) {
      const step = sim.stepIndex;
      sim.step((_, info) =>
        info.per.forEach((per, i) => {
          if (!per || !per.inNest || roles[i] === 'queen') return;
          const ids = new Set(per.contacts.map((x) => x.id));
          for (const k of counters) if (step % k.stride === 0) k.read(i, info.t, ids);
        }),
      );
    }
  }
}

if (SUB.length) {
  const counters = SUB.map((n) => new Counter(DTS[0] * n, n));
  run(DTS[0], counters);
  for (const k of counters) k.report(`dt ${DTS[0]} read every ${k.stride} (detection at ${+k.dt.toFixed(4)})`);
} else
  for (const dt of DTS) {
    const k = new Counter(dt, 1);
    run(dt, [k]);
    k.report(`dt ${dt}`);
  }
