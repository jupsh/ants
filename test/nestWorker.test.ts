import { describe, expect, it } from 'vitest';
import { lasiusForager, startTrip } from '../src/sim/behavior/lasiusForager';
import { enterNest, lasiusNestWorker } from '../src/sim/behavior/lasiusNestWorker';
import { RNG } from '../src/sim/core/rng';
import { newMind, type Mind } from '../src/sim/mind/mind';
import { basicPercept, type ContactPercept, type Interoception } from '../src/sim/perception/types';
import { LASIUS_NEST, LASIUS_PARAMS } from '../src/sim/species/lasiusM1';

const P = LASIUS_PARAMS;
const traits = { desiredVolumeFactor: 1, neverLays: false, layIntensity: 0.13 };
/** A nestmate in contact (soliciting unless offering, by default); `with`: whom it is sharing with (−1 none; 0 = the ant under test). */
const contact = (id: number, o: { offering?: boolean; soliciting?: boolean; with?: number } = {}): ContactPercept => ({ id, bearing: 0, dist: id, layingTrail: false, offering: !!o.offering, soliciting: o.soliciting ?? !o.offering, mouthContact: true, sharing: (o.with ?? -1) >= 0, sharingWithMe: o.with === 0 });
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
    expect(m.stay.parted.sort()).toEqual([5, 6]);
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

  it('entering the nest gives a fresh stay record', () => {
    const { m } = giver(0);
    m.stay.parted = [7];
    enterNest(m);
    expect(m.stay).toEqual({ bout: null, parted: [] });
    expect(m.mode).toBe('active');
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
});
