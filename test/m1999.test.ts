import { describe, expect, it } from 'vitest';
import { runColony } from '../src/sim/experiments/colonyBles';
import { M1999_TARGETS, recruiterLoad, runRecruiter1999 } from '../src/sim/experiments/colonyMailleux1999';
import { LASIUS_NEST, LASIUS_PARAMS, MAILLEUX_SETUP } from '../src/sim/species/lasiusM1';

const P = { ...LASIUS_PARAMS, nest: LASIUS_NEST };
const base = { starvationDays: 4 as const, density: 1, pipetteAccessible: MAILLEUX_SETUP.accessible, warmup: 60 };

describe('Mailleux 1999 recruiter (mechanics)', () => {
  it('has the 15 Table 2a fit rows', () => {
    expect(M1999_TARGETS).toHaveLength(15);
    expect(M1999_TARGETS.every((t) => t.role === 'fit' && t.n >= 23 && t.sd > 0)).toBe(true);
  });

  it('the recruiter carries an E2 scout load into the nest, and sugar is conserved', () => {
    const load = recruiterLoad(P, { ...base, seed: 5 });
    expect(load.cropUl).toBeGreaterThan(0.2);
    expect(load.ingested).toBeGreaterThan(0);
    let entered = false;
    const res = runColony(P, { seed: 5, ants: 20, minutes: 4, foodMinute: Infinity, recruiter: { enterAt: 60, ...load } }, (w) => {
      if (w.ants.length === 21) entered = true;
      return false;
    });
    expect(entered).toBe(true);
    expect(Math.abs(res.world.ledger.total('sugar'))).toBeLessThan(1e-9);
    const crops = res.world.ants.reduce((s, a) => s + a.body.cropSugar, 0);
    expect(crops).toBeCloseTo(res.world.ledger.get('sugar', 'crop'), 9);
  });

  it('is deterministic', () => {
    const a = runRecruiter1999(P, { ...base, seed: 9 });
    const b = runRecruiter1999(P, { ...base, seed: 9 });
    expect(a).toEqual(b);
  });

  it('an unloaded recruiter returns to the source; it stays when the return rate is 0', () => {
    const fast = { ...P, nest: { ...LASIUS_NEST, returnRate: 1, giveFrac: 0.95 } };
    const r = runRecruiter1999(fast, { ...base, seed: 3 });
    expect(r.left).toBe(true);
    expect(r.timeInNest).toBeLessThan(30);
    const never = { ...P, nest: { ...LASIUS_NEST, returnRate: 0, giveFrac: 0.95 } };
    expect(runRecruiter1999(never, { ...base, seed: 3 }).left).toBe(false);
  });

  it('the nest speed factor slows walking inside the nest', () => {
    const slow = { ...P, nest: { ...LASIUS_NEST, nestSpeedFactor: 0.1, returnRate: 0, giveFrac: 0.95 } };
    const fast = { ...P, nest: { ...LASIUS_NEST, nestSpeedFactor: 1, returnRate: 0, giveFrac: 0.95 } };
    const ds = runRecruiter1999(slow, { ...base, seed: 4 }).distance;
    const df = runRecruiter1999(fast, { ...base, seed: 4 }).distance;
    expect(ds).toBeGreaterThan(0);
    expect(ds).toBeLessThan(0.3 * df);
  });
});
