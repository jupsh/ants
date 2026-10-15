import { describe, expect, it } from 'vitest';
import { lasiusForager, startTrip } from '../src/sim/behavior/lasiusForager';
import { drawNestTraits, enterNest, lasiusNestWorker } from '../src/sim/behavior/lasiusNestWorker';
import { RNG } from '../src/sim/core/rng';
import { newMind, setMode, type Mind } from '../src/sim/mind/mind';
import { basicPercept, type ContactPercept, type Interoception } from '../src/sim/perception/types';
import { LASIUS_NEST, LASIUS_PARAMS } from '../src/sim/species/lasiusM1';

const P = LASIUS_PARAMS;
const traits = { desiredVolumeFactor: 1, neverLays: false, layIntensity: 0.13 };
/** A nestmate in contact (soliciting unless offering, by default); `with`: whom it is sharing with (−1 none; 0 = the ant under test). */
const contact = (id: number, o: { offering?: boolean; soliciting?: boolean; with?: number } = {}): ContactPercept => ({ id, bearing: 0, dist: id, layingTrail: false, offering: !!o.offering, soliciting: o.soliciting ?? !o.offering, mouthContact: true, sharing: (o.with ?? -1) >= 0, sharingWithMe: o.with === 0, moving: false });
const inNest = (contacts: ContactPercept[]) => ({ ...basicPercept(0.1, 0, 0, 22, 0), inNest: true, contacts });
const io = (cropUl: number, mouthFlow = 0, reserve = 0.9): Interoception => ({ reserve, cropUl, cropCapacity: 2, water: 1, bodyMass: 2, mouthFlow, cropFull: cropUl >= 1.96 });

/** A loaded ant (crop 1.5 µL) in the nest, in an established bout giving to nestmate 5 (seen sharing with it). */
function giver(shareEnd: number): { m: Mind; rng: RNG; p: typeof LASIUS_NEST } {
  const rng = new RNG(1);
  const m = newMind(traits, P.walk, rng);
  enterNest(m);
  const p = { ...LASIUS_NEST, shareEnd: 0 };
  // Start the bout through the policy: 5 is the only nestmate in contact.
  expect(lasiusNestWorker(inNest([contact(5)]), io(1.5), m, p, rng).give).toBe(5);
  expect(lasiusNestWorker(inNest([contact(5, { with: 0 })]), io(1.5, -0.01), m, p, rng).give).toBe(5);
  expect(m.stay.bout?.joined).toBe(true);
  return { m, rng, p: { ...p, shareEnd } };
}

describe('nest worker: bouts (STATUS 2026-10-10)', () => {
  it('an ended bout does not restart with the same partner while they are still in contact', () => {
    const { m, rng, p } = giver(1e9);
    const a = lasiusNestWorker(inNest([contact(5, { with: 0 })]), io(1.5, -0.01), m, p, rng);
    expect(a.give).toBe(-1);
    expect(m.mode).toBe('active');
    expect(m.stay.bout).toBeNull();
    expect(lasiusNestWorker(inNest([contact(5)]), io(1.5), m, { ...p, shareEnd: 0 }, rng).give).not.toBe(5);
  });

  it('ending: no new partner that step; another nestmate next step; the old partner after contact was lost', () => {
    const { m, rng, p } = giver(1e9);
    expect(lasiusNestWorker(inNest([contact(5, { with: 0 }), contact(6)]), io(1.5, -0.01), m, p, rng).give).toBe(-1);
    const q = { ...p, shareEnd: 0 };
    expect(lasiusNestWorker(inNest([contact(5), contact(6)]), io(1.5), m, q, rng).give).toBe(6);
    const r = giver(1e9);
    lasiusNestWorker(inNest([contact(5, { with: 0 })]), io(1.5, -0.01), r.m, r.p, r.rng);
    lasiusNestWorker(inNest([]), io(1.5), r.m, q, r.rng);
    expect(lasiusNestWorker(inNest([contact(5)]), io(1.5), r.m, q, r.rng).give).toBe(5);
  });

  it('every former partner stays excluded while in contact (B → C → B is not allowed)', () => {
    const { m, rng, p } = giver(1e9); // in a bout with 5 (B)
    const q = { ...p, shareEnd: 0 };
    // Ends with B; next step it starts with 6 (C), which joins; that bout ends too. B and C stay in contact throughout.
    lasiusNestWorker(inNest([contact(5, { with: 0 }), contact(6)]), io(1.5, -0.01), m, p, rng);
    expect(lasiusNestWorker(inNest([contact(5), contact(6)]), io(1.5), m, q, rng).give).toBe(6);
    lasiusNestWorker(inNest([contact(5), contact(6, { with: 0 })]), io(1.5, -0.01), m, q, rng);
    lasiusNestWorker(inNest([contact(5), contact(6, { with: 0 })]), io(1.5, -0.01), m, p, rng);
    expect(m.stay.bout).toBeNull();
    expect(m.stay.parted.map((q) => q.id).sort()).toEqual([5, 6]);
    expect(lasiusNestWorker(inNest([contact(5), contact(6)]), io(1.5), m, q, rng).give).toBe(-1);
    // Contact with B lost (C still touching): B is eligible again, C is not.
    lasiusNestWorker(inNest([contact(6)]), io(1.5), m, q, rng);
    expect(lasiusNestWorker(inNest([contact(5), contact(6)]), io(1.5), m, q, rng).give).toBe(5);
  });

  it('the partner ending the bout ends it on this side at the next step (not after stallTime)', () => {
    const { m, rng, p } = giver(0);
    const a = lasiusNestWorker(inNest([contact(5)]), io(1.5), m, p, rng);
    expect(a.give).toBe(-1);
    expect(m.stay.bout).toBeNull();
  });

  it('an invitation waits for the partner to join (signals are a step late)', () => {
    const rng = new RNG(3);
    const m = newMind(traits, P.walk, rng);
    enterNest(m);
    const p = { ...LASIUS_NEST, shareEnd: 0 };
    expect(lasiusNestWorker(inNest([contact(5)]), io(1.5), m, p, rng).give).toBe(5);
    // 5 has not answered yet: the giver keeps offering (until the stall timeout).
    expect(lasiusNestWorker(inNest([contact(5)]), io(1.5), m, p, rng).give).toBe(5);
    expect(m.stay.bout?.joined).toBe(false);
  });

  it('nobody picks a nestmate that is sharing with another ant', () => {
    const rng = new RNG(4);
    const m = newMind(traits, P.walk, rng);
    enterNest(m);
    const p = { ...LASIUS_NEST, shareEnd: 0 };
    expect(lasiusNestWorker(inNest([contact(5, { with: 9 })]), io(1.5), m, p, rng).give).toBe(-1);
    const hungry = newMind(traits, P.walk, rng);
    enterNest(hungry);
    expect(lasiusNestWorker(inNest([contact(5, { offering: true, with: 9 })]), io(0, 0, 0.3), hungry, p, rng).receive).toBe(-1);
    expect(lasiusNestWorker(inNest([contact(5, { offering: true })]), io(0, 0, 0.3), hungry, p, rng).receive).toBe(5);
  });

  it('donors offer only to soliciting nestmates; hungry ants solicit, carrying or sated ones do not', () => {
    const rng = new RNG(5);
    const m = newMind(traits, P.walk, rng);
    enterNest(m);
    const p = { ...LASIUS_NEST, shareEnd: 0 };
    expect(lasiusNestWorker(inNest([contact(5, { soliciting: false })]), io(1.5), m, p, rng).give).toBe(-1);
    expect(lasiusNestWorker(inNest([contact(5, { soliciting: false }), contact(6)]), io(1.5), m, p, rng).give).toBe(6);
    const h = newMind(traits, P.walk, rng);
    enterNest(h);
    expect(lasiusNestWorker(inNest([]), io(0, 0, 0.3), h, p, rng).solicit).toBe(true);
    expect(lasiusNestWorker(inNest([]), io(1.5, 0, 0.3), h, p, rng).solicit).toBe(false); // carrying: a donor
    expect(lasiusNestWorker(inNest([]), io(0, 0, 0.95), h, p, rng).solicit).toBe(false); // sated
  });

  it('thirsty ants (body water below thirstFrac) solicit like hungry ones; thirst is off by default', () => {
    const rng = new RNG(5);
    const h = newMind(traits, P.walk, rng);
    enterNest(h);
    const dry = { ...io(0, 0, 0.95), water: 0.85 }; // sated, but dry
    expect(lasiusNestWorker(inNest([]), dry, h, { ...LASIUS_NEST, thirstFrac: 0.9 }, rng).solicit).toBe(true);
    expect(lasiusNestWorker(inNest([]), { ...dry, water: 0.95 }, h, { ...LASIUS_NEST, thirstFrac: 0.9 }, rng).solicit).toBe(false);
    expect(lasiusNestWorker(inNest([]), dry, h, LASIUS_NEST, rng).solicit).toBe(false);
  });

  it('thirst does not send an ant out to forage; reserve hunger does', () => {
    const p = { ...LASIUS_NEST, thirstFrac: 0.9, leaveRate: 1e6, outRate: 0, activeToRest: 0 };
    for (const [reserve, leaves] of [[0.95, false], [0.3, true]] as const) {
      const rng = new RNG(6);
      const m = newMind(traits, P.walk, rng);
      enterNest(m);
      lasiusNestWorker(inNest([]), { ...io(0, 0, reserve), water: 0.85 }, m, p, rng);
      expect(m.mode === 'leave').toBe(leaves);
    }
  });

  it('with drinkOnlyWithRoom a forager with a full crop does not start drinking; without it, it does', () => {
    const per = { ...basicPercept(0.1, 0, 0, 22), food: { id: 1, kind: 'sugar' as const, molar: 0, available: true } };
    const full = { ...io(1.98, 0, 0.95), cropFull: true };
    for (const flag of [true, false]) {
      const rng = new RNG(8);
      const m = newMind(traits, P.walk, rng);
      startTrip(m, P.forager, full, rng);
      setMode(m, 'explore');
      lasiusForager(per, full, m, { ...P.forager, exploreGiveUp: 1000, drinkOnlyWithRoom: flag }, rng);
      // Without the flag it starts a drink at the source (and, crop full, leaves satiated at once: the E2/E6 rule).
      expect(m.trip.foodId === 1).toBe(!flag);
      if (flag) expect(m.mode).toBe('explore');
    }
  });

  it('with drinkPausesTrip a drink pauses the explore clock and the ant explores on; without it, it goes home', () => {
    const per = { ...basicPercept(0.1, 0, 0, 22), food: { id: 1, kind: 'sugar' as const, molar: 0, available: true } };
    for (const flag of [true, false]) {
      const rng = new RNG(9);
      const m = newMind(traits, P.walk, rng);
      startTrip(m, P.forager, io(0), rng);
      setMode(m, 'explore');
      m.modeTime = 100;
      const p = { ...P.forager, exploreGiveUp: 1000, drinkOnlyWithRoom: true, drinkPausesTrip: flag };
      lasiusForager(per, io(0), m, p, rng); // touches the source: drinks
      expect(m.mode).toBe('drink');
      lasiusForager(per, { ...io(1.98), cropFull: true }, m, p, rng); // crop full: the drink ends
      expect(m.mode).toBe(flag ? 'explore' : 'return');
      if (flag) expect(m.modeTime).toBeCloseTo(100.1, 6);
    }
  });

  it('a former partner still in contact becomes eligible again after partRefractory (STATUS 2026-10-10 night)', () => {
    const { m, rng, p } = giver(1e9); // in a bout with 5
    const q = { ...p, shareEnd: 0, partRefractory: 0.25 };
    lasiusNestWorker(inNest([contact(5, { with: 0 })]), io(1.5, -0.01), m, p, rng); // ends at random
    expect(m.stay.bout).toBeNull();
    // Still touching 5: excluded until 0.25 s have passed (steps of 0.1 s), then eligible though contact was never lost.
    expect(lasiusNestWorker(inNest([contact(5)]), io(1.5), m, q, rng).give).toBe(-1);
    expect(lasiusNestWorker(inNest([contact(5)]), io(1.5), m, q, rng).give).toBe(-1);
    expect(lasiusNestWorker(inNest([contact(5)]), io(1.5), m, q, rng).give).toBe(5);
  });

  it('entering the nest gives a fresh stay record', () => {
    const { m } = giver(0);
    m.stay.parted = [{ id: 7, since: 0 }];
    enterNest(m);
    expect(m.stay).toEqual({ bout: null, parted: [], sinceGive: 0, met: [], spell: 0, restMult: NaN });
    expect(m.mode).toBe('active');
  });
});

describe('nest worker: stops (Plan 4 option B, STATUS 2026-10-10 night)', () => {
  /** A nestmate in contact showing no signal (no bout can start with it). */
  const quiet = (id: number, moving = false): ContactPercept => ({ ...contact(id, { soliciting: false }), moving });
  /** A walking ant that neither carries nor is hungry (reserve 0.99). */
  function walker(p = LASIUS_NEST) {
    const rng = new RNG(3);
    const m = newMind(traits, P.walk, rng);
    enterNest(m);
    const q = { ...p, activeToRest: 0, leaveRate: 0, restToActive: 0 };
    return { m, rng, step: (cs: ContactPercept[], pp = q) => lasiusNestWorker(inNest(cs), io(0, 0, 0.99), m, pp, rng) };
  }

  it('off by default: an encounter does not stop a walking ant', () => {
    const w = walker();
    expect(w.step([quiet(4, true)]).stand).toBe(false);
    expect(w.m.mode).toBe('active');
  });

  it('an encounter with encounterMin 0 (contact onset) stops a walking ant at once; a contact already present does not', () => {
    const w = walker({ ...LASIUS_NEST, encounterStop: 1, encounterMin: 0 });
    expect(w.step([]).stand).toBe(false);
    expect(w.step([quiet(4, true)]).stand).toBe(true);
    expect(w.m.mode).toBe('rest');
    // Walking on while still touching 4: no new encounter, no stop; a new nestmate is one.
    w.m.mode = 'active';
    expect(w.step([quiet(4, true)]).stand).toBe(false);
    expect(w.step([quiet(4, true), quiet(6, true)]).stand).toBe(true);
  });

  it('an encounter is a contact episode that has lasted encounterMin (0.2 s: the second step at dt 0.1), counted once', () => {
    const w = walker({ ...LASIUS_NEST, encounterStop: 1, encounterMin: 0.2, encounterGap: 0 });
    // A contact seen on one step only (≈ 0.1 s) is no encounter.
    expect(w.step([quiet(4, true)]).stand).toBe(false);
    expect(w.step([]).stand).toBe(false);
    expect(w.step([]).stand).toBe(false);
    // Episode with 6: stop on its second step.
    expect(w.step([quiet(6, true)]).stand).toBe(false);
    expect(w.step([quiet(6, true)]).stand).toBe(true);
    w.m.mode = 'active';
    // Lost for one step (estimated gap 0, not > encounterGap): the same episode, not a new encounter.
    expect(w.step([]).stand).toBe(false);
    expect(w.step([quiet(6, true)]).stand).toBe(false);
    expect(w.step([quiet(6, true)]).stand).toBe(false);
    // Lost for two steps: the episode has ended; contact again is a new episode, an encounter once it has lasted 0.2 s.
    expect(w.step([]).stand).toBe(false);
    expect(w.step([]).stand).toBe(false);
    expect(w.step([quiet(6, true)]).stand).toBe(false);
    expect(w.step([quiet(6, true)]).stand).toBe(true);
  });

  it('an ant heading out does not stop at encounters', () => {
    const w = walker({ ...LASIUS_NEST, encounterStop: 1 });
    w.m.mode = 'leave';
    expect(w.step([quiet(4, true)]).stand).toBe(false);
    expect(w.m.mode).toBe('leave');
  });

  it('walk-on rate a·N^−b with N = 1 + stopped nestmates in contact; the forager trait takes the forager values', () => {
    const a = 0.4;
    const b = 1.16;
    const p = { ...LASIUS_NEST, restToActive: a, restCrowdExp: b, activeToRest: 0, leaveRate: 0, forager: { restToActive: 3.9, restCrowdExp: 1.36 } };
    // Mean stop duration over many stops, with one walking and `k` stopped nestmates in contact.
    const meanStop = (k: number, forager: boolean) => {
      const rng = new RNG(11 + k);
      const m = newMind({ ...traits, forager }, P.walk, rng);
      const cs = [quiet(20, true), ...Array.from({ length: k }, (_, i) => quiet(30 + i))];
      let total = 0;
      const reps = 4000;
      for (let r = 0; r < reps; r++) {
        enterNest(m, true);
        let t = 0;
        while (m.mode === 'rest') {
          lasiusNestWorker({ ...inNest(cs), dt: 0.01 }, io(0, 0, 0.99), m, p, rng);
          t += 0.01;
        }
        total += t;
      }
      return total / reps;
    };
    for (const k of [0, 2]) expect(meanStop(k, false)).toBeCloseTo(1 / (a * Math.pow(1 + k, -b)), 0);
    expect(meanStop(1, true) / (1 / (3.9 * Math.pow(2, -1.36)))).toBeGreaterThan(0.95);
    expect(meanStop(1, true) / (1 / (3.9 * Math.pow(2, -1.36)))).toBeLessThan(1.05);
  });
});

describe('forager: successive trips', () => {
  it('a trip starts with a fresh trip record: drinks again at its previous feeder; gaster up', () => {
    const rng = new RNG(2);
    const m = newMind(traits, P.walk, rng);
    m.trip.foodId = 7; // drank at feeder 7 on the last trip
    m.trip.gasterDown = true;
    m.trip.ars = 12;
    m.site = { x: 3, y: 4 };
    startTrip(m, P.forager, io(0, 0, 0.7), rng);
    expect(m.trip.foodId).toBe(-1);
    expect(m.trip.gasterDown).toBe(false);
    expect(m.trip.ars).toBe(0);
    expect(m.site).toEqual({ x: 3, y: 4 }); // food site memory is kept across trips
    const per = { ...basicPercept(0.1, 0, 0, 22), food: { id: 7, kind: 'sugar' as const, molar: 0.6, available: true } };
    lasiusForager(per, io(0, 0, 0.7), m, P.forager, rng);
    expect(m.mode).toBe('drink');
  });

  it('per-trip give-up time (STATUS 2026-10-15): off, no draw and the fixed time; on, lognormal with median exploreGiveUp', () => {
    const off = { ...P.forager, exploreGiveUp: 100 };
    const on = { ...off, exploreGiveUpSd: 1.5 };
    // Off: no draw (the stream continues as before) and the trip uses the fixed time.
    const r1 = new RNG(8);
    const r2 = new RNG(8);
    const m1 = newMind(traits, P.walk, r1);
    newMind(traits, P.walk, r2);
    startTrip(m1, off, io(0, 0, 0.7), r1);
    r2.normal(0, P.forager.compassBias);
    expect(Number.isNaN(m1.trip.giveUp)).toBe(true);
    expect(r1.next()).toBe(r2.next());
    // On: log give-up times have mean log 100 and SD 1.5.
    const rng = new RNG(9);
    const m = newMind(traits, P.walk, rng);
    const logs: number[] = [];
    for (let k = 0; k < 20_000; k++) {
      startTrip(m, on, io(0, 0, 0.7), rng);
      logs.push(Math.log(m.trip.giveUp));
    }
    const mu = logs.reduce((a, b) => a + b, 0) / logs.length;
    const sd = Math.sqrt(logs.reduce((a, b) => a + (b - mu) ** 2, 0) / (logs.length - 1));
    expect(Math.abs(mu - Math.log(100))).toBeLessThan((4 * 1.5) / Math.sqrt(logs.length));
    expect(sd).toBeCloseTo(1.5, 1);
    // The explore clock gives up at this trip's own time.
    startTrip(m, { ...on, exploreGiveUpSd: 1e-9 }, io(0, 0, 0.7), rng);
    m.trip.giveUp = 5;
    const per = basicPercept(0.1, 0, 0, 22);
    for (let t = 0; t < 49; t++) lasiusForager(per, io(0, 0, 0.7), m, on, rng);
    expect(m.mode).toBe('explore');
    for (let t = 0; t < 3; t++) lasiusForager(per, io(0, 0, 0.7), m, on, rng);
    expect(m.mode).toBe('return');
  });
});

describe('nest worker: rest/walk switching in continuous time (STATUS 2026-10-11)', () => {
  /** Fraction of time walked by a lone ant switching at rates `off` (walk → rest) and `on` (rest → walk), at step dt. */
  function walkedFraction(dt: number, off: number, on: number, steps: number) {
    const rng = new RNG(5);
    const m = newMind(traits, P.walk, rng);
    enterNest(m);
    const p = { ...LASIUS_NEST, activeToRest: off, restToActive: on, leaveRate: 0 };
    const per = { ...basicPercept(dt, 0, 0, 22, 0), inNest: true, contacts: [] };
    let walked = 0;
    for (let k = 0; k < steps; k++) {
      const a = lasiusNestWorker(per, io(0, 0, 0.99), m, p, rng);
      if (!a.stand) walked += a.walkFrac ?? 1;
    }
    return walked / steps;
  }

  it('the walked fraction is on / (on + off) at any step, also when spells are shorter than a step', () => {
    // Walking spells of 1/3 s, rests of 2 s: expected 1/7.
    for (const dt of [0.025, 0.1, 0.5]) expect(walkedFraction(dt, 3, 0.5, Math.round(40000 / dt))).toBeCloseTo(1 / 7, 2);
  });
});

describe('nest worker: rest depth (STATUS 2026-10-15)', () => {
  /** Durations of `reps` rests of a lone ant (no contacts, no crowding) at step dt; rests longer than `cap` are cut there. */
  function rests(p: typeof LASIUS_NEST, reps: number, dt: number, cap: number): number[] {
    const rng = new RNG(17);
    const m = newMind(traits, P.walk, rng);
    const per = { ...inNest([]), dt };
    const out: number[] = [];
    for (let r = 0; r < reps; r++) {
      enterNest(m, true);
      let t = 0;
      while (m.mode === 'rest' && t < cap) {
        const a = lasiusNestWorker(per, io(0, 0, 0.99), m, p, rng);
        // The step's resting part: all of it, or the part before walking on.
        t += a.stand ? dt : dt * (1 - (a.walkFrac ?? 1));
      }
      out.push(t);
    }
    return out;
  }

  it('each rest draws its own depth: lone rests are Lomax, S(t) = (1 + r t / α)^−α', () => {
    const r = 2;
    const alpha = 2;
    const p = { ...LASIUS_NEST, restToActive: r, restShape: alpha, activeToRest: 0, leaveRate: 0, restCrowdExp: 0 };
    const n = 20_000;
    const d = rests(p, n, 0.05, 200);
    for (const t of [0.25, 1, 3, 10, 30]) {
      const s = (1 + (r * t) / alpha) ** -alpha;
      const obs = d.filter((x) => x >= t).length / n;
      // Within 4 binomial SE (plus a little for the step grid).
      expect(Math.abs(obs - s)).toBeLessThan(4 * Math.sqrt((s * (1 - s)) / n) + 0.002);
    }
  });

  it('two-state rests (mix2): lone rests are S(t) = q e^(−r t / D) + (1 − q) e^(−r t)', () => {
    const r = 2;
    const q = 0.2;
    const D = 20;
    const p = { ...LASIUS_NEST, restToActive: r, restShape: 0, restDeepFrac: q, restDeepRatio: D, activeToRest: 0, leaveRate: 0, restCrowdExp: 0 };
    const n = 20_000;
    const d = rests(p, n, 0.05, 200);
    for (const t of [0.25, 1, 3, 10, 30]) {
      const s = q * Math.exp((-r * t) / D) + (1 - q) * Math.exp(-r * t);
      const obs = d.filter((x) => x >= t).length / n;
      expect(Math.abs(obs - s)).toBeLessThan(4 * Math.sqrt((s * (1 - s)) / n) + 0.002);
    }
  });

  it('off (restShape 0, restDeepFrac 0): exponential rests, and no depth drawn', () => {
    const p = { ...LASIUS_NEST, restToActive: 2, restShape: 0, activeToRest: 0, leaveRate: 0, restCrowdExp: 0 };
    const d = rests(p, 20_000, 0.05, 200);
    expect(d.filter((x) => x >= 1).length / d.length).toBeCloseTo(Math.exp(-2), 2);
    // No depth is ever drawn (existing results stay bit-identical; the row-hash tests check whole runs).
    const rng = new RNG(4);
    const m = newMind(traits, P.walk, rng);
    enterNest(m, true);
    for (let k = 0; k < 500; k++) {
      lasiusNestWorker({ ...inNest([]), dt: 0.05 }, io(0, 0, 0.99), m, p, rng);
      if (m.mode !== 'rest') enterNest(m, true);
      expect(Number.isNaN(m.stay.restMult)).toBe(true);
    }
  });
});

describe('nest worker: persistent walk-on factor (STATUS 2026-10-15 late evening, under test)', () => {
  it('off (walkOnSd 0): no factor drawn; on: lognormal with mean 1 and SD of log walkOnSd, drawn last', () => {
    const p0 = { ...LASIUS_NEST, foragerFrac: 0.3, walkOnSd: 0 };
    const p1 = { ...p0, walkOnSd: 0.8 };
    const n = 20_000;
    const f: number[] = [];
    for (let i = 0; i < n; i++) {
      const off = drawNestTraits(p0, RNG.stream(9, i));
      const on = drawNestTraits(p1, RNG.stream(9, i));
      expect('walkOnFactor' in off).toBe(false);
      // The earlier draws are unchanged by switching it on.
      expect(on.forageDrive).toBe(off.forageDrive);
      expect(on.forager).toBe(off.forager);
      f.push(on.walkOnFactor!);
    }
    const mean = f.reduce((a, b) => a + b, 0) / n;
    expect(Math.abs(mean - 1)).toBeLessThan((4 * Math.sqrt(Math.exp(0.64) - 1)) / Math.sqrt(n));
    const logs = f.map(Math.log);
    const lm = logs.reduce((a, b) => a + b, 0) / n;
    const sd = Math.sqrt(logs.reduce((a, b) => a + (b - lm) ** 2, 0) / (n - 1));
    expect(sd).toBeCloseTo(0.8, 1);
  });

  it("an ant's factor multiplies its walk-on rate: lone rests are exponential at restToActive × factor", () => {
    const r = 0.5;
    const k = 3;
    const p = { ...LASIUS_NEST, restToActive: r, restShape: 0, activeToRest: 0, leaveRate: 0, restCrowdExp: 0 };
    const rng = new RNG(23);
    const m = newMind({ ...traits, walkOnFactor: k }, P.walk, rng);
    const per = { ...inNest([]), dt: 0.05 };
    const n = 10_000;
    let long = 0;
    for (let i = 0; i < n; i++) {
      enterNest(m, true);
      let t = 0;
      while (m.mode === 'rest' && t < 1) {
        const a = lasiusNestWorker(per, io(0, 0, 0.99), m, p, rng);
        t += a.stand ? per.dt : per.dt * (1 - (a.walkFrac ?? 1));
      }
      if (t >= 1 - 1e-9) long++;
    }
    const s = Math.exp(-r * k);
    expect(Math.abs(long / n - s)).toBeLessThan(4 * Math.sqrt((s * (1 - s)) / n) + 0.002);
  });
});
