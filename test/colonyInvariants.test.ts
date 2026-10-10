import { describe, expect, it } from 'vitest';
import { runColony, type ColonyOptions, type ColonyParams } from '../src/sim/experiments/colonyBles';
import { recruiterLoad } from '../src/sim/experiments/colonyMailleux1999';
import { newStay, newTrip, type ForagerMode, type NestMode } from '../src/sim/mind/mind';
import { LASIUS_NEST, LASIUS_PARAMS, MAILLEUX_SETUP } from '../src/sim/species/lasiusM1';

/**
 * Behaviour invariants checked on every step of colony runs (STATUS
 * 2026-10-10, refactor item 4; the gate for colony fitting):
 *   1. modes belong to the policy in charge (forager outside, nest inside);
 *   2. an established bout is mutual: an ant whose partner has joined is
 *      not left pointing at a partner that is not in a bout with it for
 *      more than one step;
 *   3. no bout restarts with the same partner while their antennal contact
 *      has persisted since it ended;
 *   4. nobody waits in a bout longer than stallTime (+ one step) without flow;
 *   5. a trip starts with a fresh trip record; a nest entry with a fresh
 *      stay record;
 *   6. food is transferred only between two ants in matching bouts.
 * Each run also counts the events, so the checks are not vacuous.
 */
const FORAGER_MODES: ForagerMode[] = ['explore', 'drink', 'search', 'return', 'inNest'];
const NEST_MODES: NestMode[] = ['rest', 'active', 'give', 'receive', 'leave'];

interface Counts {
  steps: number;
  boutsStarted: number;
  boutsEnded: number;
  tripsStarted: number;
  entries: number;
  repeatDrinks: number;
}

function checkRun(P: ColonyParams, o: ColonyOptions, recruiterLeft?: { at: number }): Counts {
  const nest = P.nest;
  const counts: Counts = { steps: 0, boutsStarted: 0, boutsEnded: 0, tripsStarted: 0, entries: 0, repeatDrinks: 0 };
  const fail = (msg: string) => {
    throw new Error(`invariant broken at t = ${counts.steps * (o.dt ?? 0.1)} s: ${msg}`);
  };
  let prevOutside: boolean[] = [];
  let prevBout: (number | null)[] = [];
  let prevMode: string[] = [];
  let unmatched: number[] = [];
  // Pair (i, j) whose bout ended and who have stayed in contact since: a new bout between them is a violation.
  const parted = new Set<string>();
  const drankAt = new Map<number, Set<number>>();
  let prevCrop: number[] = [];
  runColony(P, o, (w, info) => {
    counts.steps++;
    const ants = w.ants;
    const bout = ants.map((a) => a.mind.stay.bout?.partner ?? null);
    for (let i = 0; i < ants.length; i++) {
      const m = ants[i].mind;
      const out = info.outside[i];
      // 1. Modes belong to the policy in charge.
      if (out && !(FORAGER_MODES as string[]).includes(m.mode)) fail(`ant ${i} outside in nest mode ${m.mode}`);
      if (!out && !(NEST_MODES as string[]).includes(m.mode)) fail(`ant ${i} inside in forager mode ${m.mode}`);
      if ((m.mode === 'give' || m.mode === 'receive') !== (m.stay.bout !== null)) fail(`ant ${i} mode ${m.mode} with bout ${JSON.stringify(m.stay.bout)}`);
      // 5. Fresh records at trip start and nest entry.
      if (out && prevOutside[i] === false) {
        counts.tripsStarted++;
        const fresh = { ...newTrip(), piBias: m.trip.piBias, desired: m.trip.desired };
        // The first step of the trip has run already: only the per-step parts may have moved.
        const { ingested, foodId, ...rest } = m.trip;
        const { ingested: _i, foodId: _f, ...freshRest } = fresh;
        if (m.mode === 'explore' && JSON.stringify(rest) !== JSON.stringify(freshRest)) fail(`ant ${i} trip not fresh: ${JSON.stringify(m.trip)}`);
        if (m.mode === 'explore' && (ingested !== 0 || foodId !== -1)) fail(`ant ${i} trip carries ingested/foodId: ${JSON.stringify(m.trip)}`);
      }
      if (!out && prevOutside[i] === true) {
        counts.entries++;
        if (JSON.stringify(m.stay) !== JSON.stringify(newStay())) fail(`ant ${i} stay not fresh on entry: ${JSON.stringify(m.stay)}`);
      }
      // 2. Mutual bouts: a joined bout whose partner is not in a bout with this ant ends within one step.
      const j = bout[i];
      if (j !== null && m.stay.bout!.joined && bout[j] !== i) {
        unmatched[i] = (unmatched[i] ?? 0) + 1;
        if (unmatched[i] > 1) fail(`ant ${i} still in a bout with ${j}, which is in a bout with ${bout[j]}`);
      } else unmatched[i] = 0;
      // 4. Stall timeout.
      if (m.stay.bout && m.stay.bout.stall > nest.stallTime + (o.dt ?? 0.1) + 1e-9) fail(`ant ${i} stalled ${m.stay.bout.stall} s`);
      // 3. No restart with the same partner while in contact since the bout ended.
      const contacts = new Set((info.per[i]?.contacts ?? []).map((c) => c.id));
      for (const key of [...parted]) {
        const [a, b] = key.split('>').map(Number);
        if (a === i && !contacts.has(b)) parted.delete(key);
      }
      if (prevBout[i] != null && j !== prevBout[i]) {
        counts.boutsEnded++;
        parted.add(`${i}>${prevBout[i]}`);
      }
      if (j !== null && prevBout[i] !== j) {
        counts.boutsStarted++;
        if (parted.has(`${i}>${j}`)) fail(`ant ${i} restarted a bout with ${j} while still in contact since the last one`);
      }
      // 6. Transfer only within matching bouts: crop changes from sharing need the pair in each other's bout.
      const body = ants[i].body;
      if (!out && prevCrop[i] !== undefined && body.mouthFlow !== 0) {
        if (j === null || bout[j] !== i) fail(`ant ${i} transferred food (flow ${body.mouthFlow}) outside a matching bout`);
      }
      // Count drinks at a feeder visited on an earlier trip (the repeat-provisioning path).
      if (out && m.mode === 'drink' && prevMode[i] !== 'drink') {
        const seen = drankAt.get(i) ?? new Set<number>();
        if (seen.has(m.trip.foodId)) counts.repeatDrinks++;
        seen.add(m.trip.foodId);
        drankAt.set(i, seen);
      }
    }
    if (recruiterLeft && o.ants !== undefined && info.outside[o.ants] && Number.isNaN(recruiterLeft.at)) recruiterLeft.at = info.t;
    prevOutside = [...info.outside];
    prevBout = bout;
    prevMode = ants.map((a) => a.mind.mode);
    prevCrop = ants.map((a) => a.body.cropUl);
    unmatched = unmatched.slice(0, ants.length);
    return false;
  });
  return counts;
}

describe('colony behaviour invariants (STATUS 2026-10-10; gate for colony fitting)', () => {
  it('hold in a foraging colony (food at 1 min, repeat trips, sharing)', () => {
    const P = { ...LASIUS_PARAMS, nest: { ...LASIUS_NEST, returnRate: 1 / 20, shareEnd: 1 / 10 } };
    const c = checkRun(P, { seed: 21, ants: 30, minutes: 14, foodMinute: 1, exploreGiveUp: 120 });
    expect(c.boutsStarted).toBeGreaterThan(20);
    expect(c.boutsEnded).toBeGreaterThan(20);
    expect(c.tripsStarted).toBeGreaterThan(5);
    expect(c.entries).toBeGreaterThan(5);
    expect(c.repeatDrinks).toBeGreaterThan(0);
  });

  it('hold for a Mailleux 1999 recruiter entering a starved nest', () => {
    const P = { ...LASIUS_PARAMS, nest: { ...LASIUS_NEST, shareEnd: 1 / 10 } };
    const load = recruiterLoad(P, { seed: 5, starvationDays: 4, density: 1, pipetteAccessible: MAILLEUX_SETUP.accessible });
    const c = checkRun(P, { seed: 22, ants: 40, minutes: 12, foodMinute: Infinity, starvationDays: 4, recruiter: { enterAt: 60, ...load } });
    expect(c.boutsStarted).toBeGreaterThan(3);
    expect(c.tripsStarted).toBeGreaterThan(0);
  });

  // A well-fed nest (1 d, defaults): few nestmates accept food.
  const wellFed = (nestOver: Partial<ColonyParams['nest']> = {}) => {
    const P = { ...LASIUS_PARAMS, nest: { ...LASIUS_NEST, ...nestOver } };
    const load = recruiterLoad(P, { seed: 5, starvationDays: 1, density: 1, pipetteAccessible: MAILLEUX_SETUP.accessible });
    const left = { at: NaN };
    const c = checkRun(P, { seed: 23, ants: 23, minutes: 22, foodMinute: Infinity, starvationDays: 1, recruiter: { enterAt: 60, ...load } }, left);
    return { c, left };
  };

  it('hold in a well-fed nest (1 d)', () => {
    expect(wellFed().c.steps).toBeGreaterThan(10_000);
  });

  // Liveness (STATUS 2026-10-10, giveUpTime): in a nest where nobody accepts food at all, the recruiter still leaves
  // within 20 min (Mailleux 1999: all did), with its load, after giveUpTime without passing food.
  it('liveness: a recruiter whose food nobody accepts leaves with it after giveUpTime', () => {
    const { c, left } = wellFed({ receiveReserve: 0.2, reserveSd: 0.05 });
    expect(c.boutsStarted).toBe(0);
    expect(left.at).toBeGreaterThan(60 + LASIUS_NEST.giveUpTime);
    expect(left.at).toBeLessThan(60 + 20 * 60);
  });
});
