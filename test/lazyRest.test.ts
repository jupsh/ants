import { describe, expect, it } from 'vitest';
import { restRecord, restTick, type LazyRest } from '../src/sim/behavior/lasiusNestRest';
import { enterNest, lasiusNestWorker, nestParamsOf, type NestAction, type NestParams } from '../src/sim/behavior/lasiusNestWorker';
import { Body } from '../src/sim/agent/body';
import { interoceptInto } from '../src/sim/perception/lazyPerception';
import { interocept } from '../src/sim/perception/perceive';
import { deepClone } from '../src/sim/core/clone';
import { RNG } from '../src/sim/core/rng';
import { stepDrive } from '../src/sim/mind/drive';
import { newMind, type Mind } from '../src/sim/mind/mind';
import type { ContactPercept, Interoception, SurfacePercept } from '../src/sim/perception/types';
import { LASIUS_NEST_B, LASIUS_PARAMS } from '../src/sim/species/lasiusM1';
import { blesCase, mailleuxCase, refusals, stroeymeytCase } from './lazyRestRuns';

/**
 * Lazy resting ants (backlog B014, DESIGN rev 2): `restTick` must do exactly what the original
 * `lasiusNestWorker` does on every step it completes, and nothing on a step it hands back; whole runs with
 * `lazyRest` must equal the stepped runs bit for bit. Every comparison is against the original stepped policy.
 */

const contact = (id: number, o: Partial<ContactPercept> = {}): ContactPercept => ({ id, bearing: 0.3, dist: 1 + id / 10, layingTrail: false, offering: false, soliciting: false, mouthContact: false, sharing: false, sharingWithMe: false, moving: false, ...o });
const percept = (dt: number, contacts: ContactPercept[]): SurfacePercept => ({ dt, incline: 0, downhill: 0, bodyTemp: 25, light: 0, inNest: true, nestCue: null, exitCue: null, edge: null, trailL: 0, trailR: 0, food: null, contacts });
const intero = (o: Partial<Interoception> = {}): Interoception => ({ reserve: 0.9, cropUl: 0, cropCapacity: 1, water: 0.9, bodyMass: 1, mouthFlow: 0, cropFull: false, ...o });

/** C2-like nest values: crowding, rest depth, encounter stops, the drive (no forager overlay unless a test adds one). */
const NEST: NestParams = { ...LASIUS_NEST_B, forager: undefined, restToActive: 0.3, activeToRest: 1.5, restCrowdExp: 1, encounterStop: 0.7, restShape: 1.4, driveSd: 1, driveTau: 60, outRate: 0, returnRate: 0, thirstFrac: 0 };
/** A long, plain rest: no depth, no drive, no crowding, a tiny walk-on rate. */
const STILL: NestParams = { ...NEST, restToActive: 1e-9, restCrowdExp: 0, restShape: 0, restDeepFrac: 0, driveSd: 0 };

function ant(seed: number, o: { rest?: boolean; forager?: boolean } = {}): { m: Mind; rng: RNG } {
  const rng = RNG.stream(seed, 0xb014);
  const m = newMind({ desiredVolumeFactor: 1, neverLays: false, layIntensity: 0.5, forageDrive: 1, forager: o.forager }, LASIUS_PARAMS.walk, rng);
  enterNest(m, o.rest ?? true);
  return { m, rng };
}

type Schedule = (k: number) => { per: SurfacePercept; io: Interoception };
const ACT = ['stand', 'give', 'receive', 'leaveNest', 'offer', 'solicit', 'walkFrac'] as const;
const actOf = (a: NestAction) => Object.fromEntries(ACT.map((k) => [k, a[k]]));
/** What the runner compares between steps: the contact set and every non-geometric percept flag. */
const sig = (cs: ContactPercept[]) => cs.map((c) => [c.id, c.offering, c.soliciting, c.sharing, c.sharingWithMe, c.moving, c.layingTrail].join()).join(';');

/**
 * One ant over `steps` steps of a schedule, as the runner drives it: the original policy every step (`lazy` false),
 * or the rest tick wherever the runner would allow it (a record, and the same contacts and flags as last step).
 * With `lazy`, every tick is checked against the original policy run on a copy of the same state (bit for bit:
 * mind, random stream, action), and every hand-back is checked to have changed nothing.
 */
function run(lazy: boolean, a0: { m: Mind; rng: RNG }, p0: NestParams, steps: number, sch: Schedule, drive?: RNG) {
  const m = deepClone(a0.m);
  const rng = deepClone(a0.rng);
  const drv = drive && deepClone(drive);
  const p = nestParamsOf(p0, m.traits.forager);
  let rec: LazyRest | undefined;
  let last: NestAction | undefined;
  let prev = '';
  const kinds: ('tick' | 'full')[] = [];
  const acts: Record<string, unknown>[] = [];
  const draws: number[] = [];
  for (let k = 1; k <= steps; k++) {
    const { per, io } = sch(k);
    if (drv) stepDrive(m, p0.driveTau, per.dt, drv);
    const s = sig(per.contacts);
    const before = rng.snapshot().s;
    if (lazy && rec && s === prev) {
      const mA = deepClone(m);
      const rA = deepClone(rng);
      const actA = lasiusNestWorker(per, io, mA, p0, rA);
      const m0 = deepClone(m);
      const r0 = rng.snapshot();
      if (restTick(io, m, p, rng, per.dt, rec)) {
        expect(m).toStrictEqual(mA);
        expect(rng.snapshot()).toStrictEqual(rA.snapshot());
        expect(actOf(actA)).toStrictEqual(actOf(last!));
        kinds.push('tick');
        acts.push(actOf(last!));
        draws.push(rng.snapshot().s === before ? 0 : 1);
        continue;
      }
      expect(m).toStrictEqual(m0);
      expect(rng.snapshot()).toStrictEqual(r0);
    }
    const act = lasiusNestWorker(per, io, m, p0, rng);
    rec = lazy ? restRecord(per, io, m, p0, act) : undefined;
    last = act;
    prev = s;
    kinds.push('full');
    acts.push(actOf(act));
    draws.push(rng.snapshot().s === before ? 0 : 1);
  }
  return { m, rng: rng.snapshot(), kinds, acts, draws };
}

/** The original policy alone and the lazy run must end in the same state with the same actions on every step. */
function both(a0: { m: Mind; rng: RNG }, p0: NestParams, steps: number, sch: Schedule, drive?: RNG) {
  const orig = run(false, a0, p0, steps, sch, drive);
  const lazy = run(true, a0, p0, steps, sch, drive);
  expect(lazy.m).toStrictEqual(orig.m);
  expect(lazy.rng).toStrictEqual(orig.rng);
  expect(lazy.acts).toStrictEqual(orig.acts);
  expect(lazy.draws).toStrictEqual(orig.draws);
  return lazy;
}

const fixed =
  (dt: number, contacts: ContactPercept[], io = intero()): Schedule =>
  () => ({ per: percept(dt, contacts), io });

describe('restTick against the original policy, step by step', () => {
  it('long rests with the drive, crowding, rest depth and contacts coming and going', () => {
    const a = ant(1, { rest: false });
    // Contact 5 (moving) comes and goes every 37 steps; contact 3 stays: full calls on changes, ticks between.
    const sch: Schedule = (k) => ({ per: percept(0.05, Math.floor(k / 37) % 2 ? [contact(3), contact(5, { moving: true })] : [contact(3)]), io: intero() });
    const r = both(a, NEST, 6000, sch, RNG.stream(1, 0xd21e));
    expect(r.kinds.filter((x) => x === 'tick').length).toBeGreaterThan(3000);
  });

  it('a rest that starts partway through a step, and the first rest step after an encounter stop', () => {
    const a = ant(2, { rest: false });
    // No contact for 50 steps, then nestmate 4 stays in contact: an encounter (encounterStop 1) stops the walking ant.
    const sch: Schedule = (k) => ({ per: percept(0.05, k <= 50 ? [] : [contact(4)]), io: intero() });
    const r = both(a, { ...NEST, encounterStop: 1, activeToRest: 0.01 }, 3000, sch, RNG.stream(2, 0xd21e));
    expect(r.kinds.includes('tick')).toBe(true);
  });

  // The accumulated sum crosses the threshold one step later than k × dt in each of these cases (DESIGN rev 2, § 6).
  it.each([
    [0.05, 5, 101],
    [0.1, 5, 51],
    [0.1, 10, 101],
    [0.025, 2, 81],
  ])('a former partner comes off its refractory period at dt %s, %s s: step %s', (dt, refr, step) => {
    expect(Math.ceil(refr / dt - 1e-12)).toBe(step - 1);
    const a = ant(3);
    a.m.stay.spell = 1e6;
    a.m.stay.parted = [{ id: 7, since: 0 }];
    // Hungry, and nestmate 7 offers: once 7 is no longer excluded, the ant accepts from it.
    const r = both(a, { ...STILL, partRefractory: refr }, step + 5, fixed(dt, [contact(7, { offering: true })], intero({ reserve: 0 })));
    expect(r.kinds.slice(1, step - 1).every((x) => x === 'tick')).toBe(true);
    expect(r.kinds[step - 1]).toBe('full');
    expect(r.acts[step - 2].receive).toBe(-1);
    expect(r.acts[step - 1].receive).toBe(7);
  });

  it.each([
    [0.05, 2401],
    [0.1, 1201],
  ])('give-up time 120 s at dt %s: the return hazard is first drawn at step %s, and fires there when certain', (dt, step) => {
    const a = ant(4);
    a.m.stay.spell = 1e6;
    a.m.trip.ingested = 1;
    const carrying = intero({ cropUl: 0.99 });
    const quiet = both(a, { ...STILL, returnRate: 1e-12, giveUpTime: 120 }, step + 3, fixed(dt, [], carrying));
    expect(quiet.draws.indexOf(1) + 1).toBe(step);
    expect(quiet.kinds[step - 1]).toBe('tick');
    const sure = both(a, { ...STILL, returnRate: 1e12, giveUpTime: 120 }, step, fixed(dt, [], carrying));
    expect(sure.kinds.slice(1, step - 1).every((x) => x === 'tick')).toBe(true);
    expect(sure.kinds[step - 1]).toBe('full');
    expect(sure.m.mode).toBe('leave');
  });

  // An episode with nestmate 3 is lost for L steps and found again; nestmate 9 stays in contact throughout (its
  // episode matures during ticks). The first step of the gap and the step of the return are full calls.
  for (const dt of [0.025, 0.05, 0.1])
    for (const gap of [0, 1, 2])
      it(`encounter episodes at dt ${dt}, encounterGap ${gap} × dt: lost for 1–4 steps, then found again`, () => {
        for (const L of [1, 2, 3, 4]) {
          const a = ant(10 + L);
          a.m.stay.spell = 1e6;
          const sch: Schedule = (k) => ({ per: percept(dt, k <= 2 || (k > 2 + L && k <= 2 + L + 12) ? [contact(3), contact(9)] : [contact(9)]), io: intero() });
          const r = both(a, { ...STILL, encounterGap: gap * dt, encounterMin: 0.2 }, 2 + L + 20, sch);
          if (L >= 2) expect(r.kinds[3]).toBe('tick');
        }
      });

  it('need equal to dt: the rest continues; a spell left at exactly 0 is redrawn by the original, not the tick', () => {
    const a = ant(5);
    a.m.stay.spell = 0.1;
    const p = { ...STILL, restToActive: 1 };
    const r = both(a, p, 3, fixed(0.05, []));
    expect(r.kinds).toEqual(['full', 'tick', 'full']);
    const two = run(true, a, p, 2, fixed(0.05, []));
    expect(two.m.stay.spell).toBe(0);
    expect(two.m.mode).toBe('rest');
  });

  it('a zero walk-on rate: every step after the first is a tick', () => {
    const r = both(ant(6), { ...STILL, restToActive: 0 }, 500, fixed(0.05, [contact(2)]));
    expect(r.kinds.slice(1).every((x) => x === 'tick')).toBe(true);
  });

  it('a forager leaving on a trip from a tick step: the hand-back restores the stream and the original draws the same number', () => {
    const a = ant(7, { forager: true });
    a.m.stay.spell = 1e6;
    const r = both(a, { ...STILL, forager: { outRate: 0.5 } }, 400, fixed(0.05, []));
    const left = r.acts.findIndex((x) => x.stand === false);
    expect(left).toBeGreaterThan(1);
    expect(r.kinds[left]).toBe('full');
    expect(r.kinds[left - 1]).toBe('tick');
  });
});

describe('interoceptInto', () => {
  it('equals interocept field for field, bit for bit', () => {
    const m = LASIUS_PARAMS.morph;
    const out = {} as Interoception;
    for (let k = 0; k < 50; k++) {
      const r = RNG.stream(9, k);
      const b = new Body(k, 9, { len: m.len, mass: m.mass, cropCapacity: m.cropCapacity, antennaReach: m.antennaReach, cropFullFrac: m.cropFullFrac }, r.range(0.02, 1), 0.1);
      b.water = b.waterMax * r.range(0, 1);
      b.cropUl = m.cropCapacity * r.range(0, 1.1);
      b.mouthFlow = r.range(-0.01, 0.01);
      expect(interoceptInto(b, out)).toStrictEqual(interocept(b));
    }
  });
});

describe('lazyRest runs equal the stepped runs bit for bit (short; full sizes in test/slow/lazyRest.slow.test.ts)', () => {
  it('refuses the per-call rate diagnostics', refusals);
  it('a Bles colony with food: frames, bouts and the ledger', () => blesCase(20, 12));
  it('a C2 Stroeymeyt colony (drive, crowding, trips), with and without the per-step verification', () => stroeymeytCase(60, 10));
  it('Mailleux 1999: a shared warm-up nest (clone) with decomposition', () => mailleuxCase(60, false));
});
