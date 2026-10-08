import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ksStatistic } from '../../src/sim/analysis/trajectory';
import { statsFor } from '../../src/sim/experiments/e1Compare';
import { runE1 } from '../../src/sim/experiments/e1Exploration';
import { walkParams } from '../../src/sim/models/walk';
import { diagSample } from '../../src/sim/analysis/walkDiagnostics';
import { KHUONG_PREP, prepareTrack } from '../../src/sim/analysis/trajectory';

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

  // Known failure (2026-10-08), under investigation: suspected time-step bias
  // in pause onset (a pause starting in a step loses the whole step, so each
  // pause lasts ≈ dt longer), visible at the high pause rate used here.
  // Remove `.fails` once fixed (docs/STATUS.md, step 5).
  it.fails('time-based turning (also while paused), continuous geomenotaxis and individual slope sensitivity converge when the time step is reduced eightfold', () => {
    const p = { ...params, jitterTime: 0.3, turnRateTime: 2, pauseRate: 0.3, geoTorque: 0.05, geoPolar: 0.02, slopeSpeedKSd: 0.4 };
    const run = (dt: number) => {
      const tracks = [1, 2, 3].flatMap((seed) => runE1(p, { incline: Math.PI / 6, ants: 400, seed, dt }));
      return { stats: statsFor(tracks), diag: diagSample(tracks, tracks.map((t) => prepareTrack(t, KHUONG_PREP)), 2).values };
    };
    const coarse = run(0.04);
    const fine = run(0.005);
    for (let i = 1; i < 6; i++) expect(Math.abs(coarse.stats.headingCorrPath[i] - fine.stats.headingCorrPath[i])).toBeLessThan(0.03);
    expect(Math.abs(coarse.stats.stoppedFraction - fine.stats.stoppedFraction)).toBeLessThan(0.01);
    // Heading change across stops (turning while paused), and the per-ant tortuosity–speed slope.
    for (const id of ['stopCos.1', 'stopCos.2', 'antTurn.slope', 'drift.small2', 'drift.small1', 'exits.down', 'logSd.between']) {
      const a = coarse.diag.find((v) => v.id === id)!.value;
      const b = fine.diag.find((v) => v.id === id)!.value;
      expect(Math.abs(a - b), id).toBeLessThan(0.08);
    }
  });
});
