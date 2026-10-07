import { describe, expect, it } from 'vitest';
import { summarize } from '../src/sim/analysis/trajectory';
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

  it('drinking and trail decisions converge when the time step is reduced fourfold', () => {
    const run = (dt: number) => Array.from({ length: 300 }, (_, i) => runScout(P, { seed: 500 + i, drop1: { ul: 3, molar: 0.6 }, pipetteAccessible: 0.75, starvationDays: 4, dt })).filter((r) => r.drinks.length);
    const coarse = run(0.1);
    const fine = run(0.025);
    const dc = summarize(coarse.map((r) => r.drinks[0].time));
    const df = summarize(fine.map((r) => r.drinks[0].time));
    // Means agree within ~3 standard errors.
    expect(Math.abs(dc.mean - df.mean)).toBeLessThan(3 * Math.hypot(dc.sd / Math.sqrt(dc.n), df.sd / Math.sqrt(df.n)));
    const tc = coarse.filter((r) => r.laidTrail).length / coarse.length;
    const tf = fine.filter((r) => r.laidTrail).length / fine.length;
    expect(Math.abs(tc - tf)).toBeLessThan(3 * Math.sqrt((tc * (1 - tc)) / coarse.length + (tf * (1 - tf)) / fine.length));
  });
});
