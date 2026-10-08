import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ksStatistic } from '../../src/sim/analysis/trajectory';
import { statsFor } from '../../src/sim/experiments/e1Compare';
import { runE1 } from '../../src/sim/experiments/e1Exploration';
import { walkParams } from '../../src/sim/models/walk';

const FIT = 'data/fits/e1-walk.json';
const params = walkParams(fs.existsSync(FIT) ? JSON.parse(fs.readFileSync(FIT, 'utf8')).params : undefined);

describe('E1 numerics (slow)', () => {
  it('statistics converge when the time step is reduced eightfold', () => {
    // 1200 ants per condition; KS critical value at α = 0.001 is ≈ 0.08.
    const run = (dt: number) => statsFor([1, 2, 3].flatMap((seed) => runE1(params, { incline: Math.PI / 6, ants: 400, seed, dt })));
    const coarse = run(0.04);
    const fine = run(0.005);
    expect(ksStatistic(coarse.speeds, fine.speeds)).toBeLessThan(0.05);
    for (let i = 1; i < 6; i++) expect(Math.abs(coarse.headingCorrPath[i] - fine.headingCorrPath[i])).toBeLessThan(0.03);
    expect(ksStatistic(coarse.exitTimes, fine.exitTimes)).toBeLessThan(0.08);
    expect(Math.abs(coarse.alignY - fine.alignY)).toBeLessThan(0.03);
  });
});
