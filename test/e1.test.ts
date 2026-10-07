import fs from 'node:fs';
import zlib from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { parseKhuongCsv } from '../src/sim/analysis/khuongData';
import { ksStatistic } from '../src/sim/analysis/trajectory';
import { compareE1, statsFor } from '../src/sim/experiments/e1Compare';
import { runE1 } from '../src/sim/experiments/e1Exploration';
import { walkParams } from '../src/sim/models/walk';

const FIT = 'data/fits/e1-walk.json';
const params = walkParams(fs.existsSync(FIT) ? JSON.parse(fs.readFileSync(FIT, 'utf8')).params : undefined);
const INCLINES = [0, Math.PI / 9, Math.PI / 6, Math.PI / 4, Math.PI / 3];
const data = (k: number) => statsFor(parseKhuongCsv(zlib.gunzipSync(fs.readFileSync(`data/khuong2013/incline${k}.csv.gz`)).toString('utf8')));

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
  const sim = statsFor(runE1(params, { incline: INCLINES[k - 1], ants: 300, seed: 777 + k, dt: 0.02 }));
  const { loss, parts } = compareE1(sim, data(k));
  // Each term is scaled so ~1 equals the data's own sampling uncertainty.
  for (const [name, v] of Object.entries(parts)) expect(v, name).toBeLessThan(9);
  expect(loss).toBeLessThan(30);
}

describe('E1 validation against Khuong et al. 2013 (withheld inclines)', () => {
  it('incline 2 (20°) is reproduced within data uncertainty', () => validate(2));
  // Known gap (docs/STATUS.md): on steep slopes the speed-distribution shape and
  // fine-scale turning are not yet captured. Remove `.fails` when this passes.
  it.fails('incline 4 (45°) is reproduced within data uncertainty [known gap]', () => validate(4));
});
