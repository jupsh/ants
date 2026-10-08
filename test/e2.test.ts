import { describe, expect, it } from 'vitest';
import { runScout, runScoutWorld } from '../src/sim/experiments/e2Mailleux';
import { QUANTITIES } from '../src/sim/physics/ledger';
import { LASIUS_PARAMS } from '../src/sim/species/lasiusM1';

const P = LASIUS_PARAMS;

describe('E2 conservation', () => {
  it('ledger accounts equal entity holdings after a two-drop scout trip', () => {
    const { world } = runScoutWorld(P, { seed: 3, drop1: { ul: 0.7, molar: 0.6 }, drop2: { ul: 0.7, molar: 0.6 }, pipetteAccessible: 0.75, starvationDays: 4, dt: 0.05 });
    const held = world.entityTotals();
    for (const [k, v] of Object.entries(held)) {
      const [q, acc] = k.split(':') as ['sugar' | 'water', 'food' | 'crop' | 'reserve'];
      expect(world.ledger.get(q, acc), k).toBeCloseTo(v, 9);
    }
    for (const q of QUANTITIES) expect(Math.abs(world.ledger.total(q))).toBeLessThan(1e-9);
    // Something was actually drunk and respired.
    expect(world.ledger.get('sugar', 'crop')).toBeGreaterThan(0);
    expect(world.ledger.get('sugar', 'respired')).toBeGreaterThan(0);
  });
});

describe('E2 numerics', () => {
  it('is deterministic for a given seed', () => {
    const a = runScout(P, { seed: 11, drop1: { ul: 3, molar: 0.6 }, pipetteAccessible: 0.75, starvationDays: 4 });
    const b = runScout(P, { seed: 11, drop1: { ul: 3, molar: 0.6 }, pipetteAccessible: 0.75, starvationDays: 4 });
    expect(a).toEqual(b);
  });
});
