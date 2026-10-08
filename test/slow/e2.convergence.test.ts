import { describe, expect, it } from 'vitest';
import { summarize } from '../../src/sim/analysis/trajectory';
import { runScout } from '../../src/sim/experiments/e2Mailleux';
import { LASIUS_PARAMS } from '../../src/sim/species/lasiusM1';

const P = LASIUS_PARAMS;

describe('E2 numerics (slow)', () => {
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
