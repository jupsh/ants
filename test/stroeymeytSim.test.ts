import { describe, expect, it } from 'vitest';
import { simulateStroeymeyt } from '../src/sim/experiments/colonyStroeymeyt';
import { LASIUS_NEST, LASIUS_PARAMS } from '../src/sim/species/lasiusM1';

const P = { ...LASIUS_PARAMS, nest: { ...LASIUS_NEST, returnRate: 0, forager: { outRate: 1 / 30 } } };
const col = { label: 'test', nurses: 6, foragers: 6, noiseSd: 0.02, detection: 0.8 };

describe('Stroeymeyt set-up (step 4a)', () => {
  it('is deterministic, observes the nest, and only foragers leave', () => {
    const o = { seed: 3, phase: 'light' as const, warmupS: 60, obsS: 300 };
    const a = simulateStroeymeyt(P, col, o);
    const b = simulateStroeymeyt(P, col, o);
    expect(a.rows).toEqual(b.rows);
    expect(a.rows['speed.nurse.light']).toBeGreaterThan(0);
    // 0.8 detection, 600 frames: about 0.8 × 13 ants per frame on average.
    expect(a.rows['detection']).toBeGreaterThan(0.7);
    expect(a.foragersIn).toBeLessThan(1);
    // Nurses are always in the nest, so they are never missing from density for long.
    expect(a.rows['density.light'] * 28).toBeGreaterThanOrEqual(6);
  });
});
