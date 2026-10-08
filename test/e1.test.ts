import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ksStatistic } from '../src/sim/analysis/trajectory';
import { verdict } from '../src/sim/analysis/compare';
import { compareE1, referenceFor, sampleFor, scalarSE, statsFor } from '../src/sim/experiments/e1Compare';
import { runE1 } from '../src/sim/experiments/e1Exploration';
import { walkParams } from '../src/sim/models/walk';
import { INCLINES, loadKhuong } from '../scripts/lib';

const FIT = 'data/fits/e1-walk.json';
const params = walkParams(fs.existsSync(FIT) ? JSON.parse(fs.readFileSync(FIT, 'utf8')).params : undefined);
const data = (k: number) => referenceFor(loadKhuong(k));

describe('E1 numerics', () => {
  it('is deterministic for a given seed', () => {
    const a = runE1(params, { incline: 0, ants: 3, seed: 5, dt: 0.02 });
    const b = runE1(params, { incline: 0, ants: 3, seed: 5, dt: 0.02 });
    expect(Array.from(a[2].x)).toEqual(Array.from(b[2].x));
  });

  it('gives each ant its own random stream (results independent of how many ants run)', () => {
    const a = runE1(params, { incline: 0, ants: 3, seed: 9, dt: 0.02 });
    const b = runE1(params, { incline: 0, ants: 6, seed: 9, dt: 0.02 });
    for (let i = 0; i < 3; i++) expect(Array.from(a[i].y)).toEqual(Array.from(b[i].y));
  });

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

function validate(k: number): void {
  const sim = sampleFor(runE1(params, { incline: INCLINES[k - 1], ants: 300, seed: 777 + k, dt: 0.02 }));
  const { rows } = compareE1(sim, data(k), scalarSE(sim));
  // Combined-SE criteria (docs/STATUS.md): no statistic may be clearly off
  // (|z| > 3), and with ~24 statistics at most a couple may be marginal.
  for (const r of rows) expect(verdict(r.z), `${r.label}: z = ${r.z.toFixed(2)}`).not.toBe('off');
  expect(rows.filter((r) => verdict(r.z) !== 'ok').length).toBeLessThanOrEqual(2);
}

describe('E1 agreement with Khuong et al. 2013 (development inclines, combined-SE criteria)', () => {
  // Known gaps (docs/STATUS.md): under the combined-SE criteria the current fit
  // misses the slow tail of moving speeds, short-scale heading correlation and
  // drift near the release point even at 20°; on steep slopes the speed
  // distribution and turning are not captured. Remove `.fails` when these pass.
  it.fails('incline 2 (20°) is consistent with the data [known gap]', () => validate(2));
  it.fails('incline 4 (45°) is consistent with the data [known gap]', () => validate(4));
});
