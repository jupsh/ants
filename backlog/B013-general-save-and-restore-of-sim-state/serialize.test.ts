import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { ColonySim } from '../../src/sim/experiments/colonyBles';
import { LASIUS_NEST, LASIUS_PARAMS } from '../../src/sim/species/lasiusM1';
import { restoreSim, serializeSim } from './serialize';

const P = { ...LASIUS_PARAMS, nest: LASIUS_NEST };
const opts = { seed: 21, ants: 20, minutes: 6, foodMinute: 2 };

function hash(sim: ColonySim): string {
  const ants = sim.w.ants.map((a) => [a.body.x, a.body.y, a.body.heading, a.body.cropUl, a.body.reserve, a.mind.mode]);
  return createHash('sha256').update(JSON.stringify([sim.result().bouts, ants, sim.stepIndex])).digest('hex');
}

describe('B013 serialize/restore prototype', () => {
  it('a restored colony continues bit-identically', () => {
    const a = new ColonySim(P, opts);
    for (let i = 0; i < 1500; i++) a.step();
    const b = restoreSim(serializeSim(a));
    expect(b).toBeInstanceOf(ColonySim);
    expect(b.w.ants[0].body).not.toBe(a.w.ants[0].body);
    while (a.stepIndex < a.steps) a.step();
    while (b.stepIndex < b.steps) b.step();
    expect(hash(b)).toBe(hash(a));
    // Stronger: the whole final state serialises to the same bytes.
    expect(serializeSim(b)).toBe(serializeSim(a));
  });

  it('diagnostic-switch state (drive, oracle, slow episodes) survives the round trip', () => {
    const Pd = { ...LASIUS_PARAMS, nest: { ...LASIUS_NEST, driveSd: 0.3 } };
    const a = new ColonySim(Pd, { ...opts, oracle: { kind: 'placebo', sd: 0.5, tauC: 60, meanOne: true }, slowEp: { rate: 0.01, dur: 30, factor: 0.5 } });
    for (let i = 0; i < 1500; i++) a.step();
    const b = restoreSim(serializeSim(a));
    while (a.stepIndex < a.steps) a.step();
    while (b.stepIndex < b.steps) b.step();
    expect(serializeSim(b)).toBe(serializeSim(a));
  });

  it('structuredClone cannot carry a colony (inventory evidence)', () => {
    const a = new ColonySim(P, opts);
    // The stored motor is a function: structured clone throws on it, and
    // would drop every class prototype even without it.
    expect(() => structuredClone(a)).toThrow();
  });

  it('fails closed on an unregistered function', () => {
    const a = new ColonySim(P, { ...opts, motor: (() => 0) as never });
    expect(() => serializeSim(a)).toThrow(/unsupported function/);
  });
});
