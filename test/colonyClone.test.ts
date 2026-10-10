import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { deepClone } from '../src/sim/core/clone';
import { RNG } from '../src/sim/core/rng';
import { ColonySim, runColony } from '../src/sim/experiments/colonyBles';
import { LASIUS_NEST, LASIUS_PARAMS } from '../src/sim/species/lasiusM1';

const P = { ...LASIUS_PARAMS, nest: LASIUS_NEST };
const opts = { seed: 21, ants: 20, minutes: 6, foodMinute: 2 };

/** Hash of everything observable: bouts, and every ant's position, crop, reserve and mode. */
function stateHash(sim: ColonySim): string {
  const r = sim.result();
  const ants = sim.w.ants.map((a) => [a.body.x, a.body.y, a.body.heading, a.body.cropUl, a.body.reserve, a.mind.mode, sim.outside[a.body.id]]);
  return createHash('sha256').update(JSON.stringify([r.bouts, ants, sim.w.ledger.total('sugar')])).digest('hex');
}

describe('copyable colony state (shared warm-ups)', () => {
  it('runColony and stepping a ColonySim give the same run', () => {
    const sim = new ColonySim(P, opts);
    while (sim.stepIndex < sim.steps) sim.step();
    const r = runColony(P, opts);
    expect(JSON.stringify(sim.result().bouts)).toBe(JSON.stringify(r.bouts));
  });

  it('an unkeyed clone continues exactly as the original', () => {
    const a = new ColonySim(P, opts);
    for (let i = 0; i < 1500; i++) a.step(); // past food introduction (120 s)
    const b = a.clone();
    expect(b.w).not.toBe(a.w);
    expect(b.w.ants[0].body).not.toBe(a.w.ants[0].body);
    expect(b.w.apparatus).toBe(a.w.apparatus); // immutable geometry is shared
    while (a.stepIndex < a.steps) a.step();
    while (b.stepIndex < b.steps) b.step();
    expect(stateHash(b)).toBe(stateHash(a));
  });

  it('stepping a clone leaves the original untouched', () => {
    const a = new ColonySim(P, opts);
    for (let i = 0; i < 500; i++) a.step();
    const before = stateHash(a);
    const b = a.clone(3);
    for (let i = 0; i < 500; i++) b.step();
    expect(stateHash(a)).toBe(before);
  });

  it('keyed clones are reproducible and differ from each other', () => {
    const a = new ColonySim(P, opts);
    for (let i = 0; i < 1500; i++) a.step();
    const run = (key: number) => {
      const c = a.clone(key);
      while (c.stepIndex < c.steps) c.step();
      return stateHash(c);
    };
    expect(run(1)).toBe(run(1));
    expect(run(1)).not.toBe(run(2));
  });

  it('deepClone preserves prototypes, sharing and cycles; rekey forks every RNG', () => {
    const r = RNG.stream(5, 1);
    const shared = { v: 1 };
    const o: any = { r, list: [shared, shared], m: new Map([[1, shared]]), t: new Float64Array([1, 2]) };
    o.self = o;
    const c = deepClone(o);
    expect(c.r).toBeInstanceOf(RNG);
    expect(c.r).not.toBe(r);
    expect(c.r.next()).toBe(RNG.stream(5, 1).next()); // an exact copy of the (unadvanced) stream
    expect(c.list[0]).toBe(c.list[1]);
    expect(c.m.get(1)).toBe(c.list[0]);
    expect(c.self).toBe(c);
    expect(c.t).not.toBe(o.t);
    const k = deepClone(o, { rekey: 7 });
    expect(k.r.getState()).not.toBe(r.getState());
  });
});
