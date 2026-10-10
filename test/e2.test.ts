import { describe, expect, it } from 'vitest';
import { lasiusForager } from '../src/sim/behavior/lasiusForager';
import { RNG } from '../src/sim/core/rng';
import { runScout, runScoutWorld } from '../src/sim/experiments/e2Mailleux';
import { newMind, setMode } from '../src/sim/mind/mind';
import { basicPercept } from '../src/sim/perception/types';
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

describe('E2 observation', () => {
  it('the recorded intake is what left the drops (crop absorption does not hide it)', () => {
    // Absorption switched on (well above any sourced rate) to show that it does not reduce the record.
    const Pa = { ...P, phys: { ...P.phys, cropAbsorption: 0.01 } };
    for (const seed of [3, 4, 5, 6]) {
      const { result, world } = runScoutWorld(Pa, { seed, drop1: { ul: 0.7, molar: 0.6 }, drop2: { ul: 0.7, molar: 0.6 }, pipetteAccessible: 0.75, starvationDays: 8, dt: 0.1, maxTime: 900 });
      const removed = world.food.reduce((s, f) => s + (f.initialUl - f.volumeUl), 0);
      expect(result.drinks.reduce((s, d) => s + d.trueUl, 0)).toBeCloseTo(removed, 9);
    }
  });
});

describe('E2 decision rules', () => {
  // A drop that runs out: the ant is past its patience at an empty drop.
  const atEmptyDrop = (ingested: number) => {
    const p = { ...P.forager, stopHazard: 0 }; // isolate the exhaustion branch from the leaving hazard
    const rng = new RNG(1);
    const m = newMind({ desiredVolumeFactor: 1, neverLays: false, layIntensity: 0.13 }, P.walk, rng);
    setMode(m, 'drink');
    m.foodId = 1;
    m.desired = 0.8;
    m.ingested = ingested;
    m.modeTime = 10;
    const per = { ...basicPercept(0.1, 0, 0, 22), food: { id: 1, kind: 'sugar' as const, molar: 0.6, available: false } };
    lasiusForager(per, { reserve: 0.7, cropUl: ingested, cropCapacity: 2, water: 1, bodyMass: 2, mouthFlow: 0 }, m, p, rng);
    return m;
  };
  it('an ant that reached its desired volume as the drop ran out leaves satiated and lays trail', () => {
    const m = atEmptyDrop(0.85);
    expect(m.satisfied).toBe(true);
    expect(m.laying).toBe(true);
    expect(m.mode).toBe('return');
  });
  it('an ant below its desired volume at an exhausted drop leaves unsatisfied and searches', () => {
    const m = atEmptyDrop(0.5);
    expect(m.satisfied).toBe(false);
    expect(m.mode).toBe('search');
  });
});
