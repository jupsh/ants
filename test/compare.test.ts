import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { betaInc, blockEstimate, combinedZ, judgedSumZ2, ksTest, normalCdf, normalQuantile, pToZ, smallSampleZ, tToZ, tUpper, varianceRatioZ, welchDf } from '../src/sim/analysis/compare';
import { RNG } from '../src/sim/core/rng';
import { compareE1, referenceFor, sampleFor, scalarSE } from '../src/sim/experiments/e1Compare';
import { runE1 } from '../src/sim/experiments/e1Exploration';
import { walkParams } from '../src/sim/models/walk';

describe('comparison statistics', () => {
  it('normal CDF and quantile are accurate and inverse', () => {
    expect(normalCdf(1.959964)).toBeCloseTo(0.975, 6);
    expect(normalQuantile(0.975)).toBeCloseTo(1.959964, 5);
    expect(normalQuantile(0.001)).toBeCloseTo(-3.090232, 5);
    for (const p of [0.01, 0.2, 0.5, 0.9, 0.999]) expect(normalCdf(normalQuantile(p))).toBeCloseTo(p, 6);
    expect(pToZ(0.05)).toBeCloseTo(1.96, 2);
  });

  it('t and F distributions match tables', () => {
    expect(2 * tUpper(2, 4)).toBeCloseTo(0.11612, 5);
    expect(2 * tUpper(3, 4)).toBeCloseTo(0.03994, 5);
    expect(tUpper(2.776, 4)).toBeCloseTo(0.025, 4);
    expect(tUpper(-2.776, 4)).toBeCloseTo(0.975, 4);
    // F(4, 9) upper 5 % point 3.633.
    expect(betaInc((4 * 3.633) / (4 * 3.633 + 9), 2, 4.5)).toBeCloseTo(0.95, 4);
    expect(tToZ(3, 4)).toBeCloseTo(2.0543, 3);
    expect(tToZ(-2, 4)).toBeCloseTo(-1.5713, 3);
    expect(tToZ(2, 1e7)).toBeCloseTo(2, 4);
    expect(Number.isFinite(tToZ(1e4, 4))).toBe(true);
    expect(welchDf(1, 4, 0, 9)).toBeCloseTo(4, 10);
    expect(welchDf(1, 4, 1, 9)).toBeCloseTo(4 / (1 / 4 + 1 / 9), 10);
  });

  it('small-sample z has the nominal tail rates when SE_data comes from 5 units', () => {
    // Null model: 5 data colonies and 200 simulated colonies (10 blocks) from the same normal.
    const rng = RNG.stream(77, 1);
    let raw3 = 0;
    let z2 = 0;
    let z3 = 0;
    let ws2 = 0;
    let ws3 = 0;
    let sd2 = 0;
    const R = 20000;
    for (let r = 0; r < R; r++) {
      const d = Array.from({ length: 5 }, () => rng.gauss());
      const dm = d.reduce((a, b) => a + b, 0) / 5;
      const dsd = Math.sqrt(d.reduce((a, b) => a + (b - dm) ** 2, 0) / 4);
      const est = blockEstimate(Array.from({ length: 10 }, () => Array.from({ length: 20 }, () => rng.gauss())));
      const s = smallSampleZ(est.mean, est.se, est.blocks - 1, dm, dsd / Math.sqrt(5), 4);
      if (Math.abs(s.t) > 3) raw3++;
      if (Math.abs(s.z) > 2) z2++;
      if (Math.abs(s.z) > 3) z3++;
      if (Math.abs(s.zWelch) > 2) ws2++;
      if (Math.abs(s.zWelch) > 3) ws3++;
      if (Math.abs(varianceRatioZ(est.sd, est.n, dsd, 5)) > 2) sd2++;
    }
    // Uncorrected z: ≈ 4 % beyond 3 (review). Fixed df 4 (primary): ≈ 4.1 % / 0.15 % beyond 2 / 3
    // (nominal 4.55 / 0.27). Welch–Satterthwaite: ≈ 4.8 % / 0.55 %: its df is estimated from the
    // same 5 colonies, so it rises exactly when SE_data comes out small (STATUS 2026-10-09).
    expect(raw3 / R).toBeGreaterThan(0.03);
    expect(z2 / R).toBeGreaterThan(0.035);
    expect(z2 / R).toBeLessThan(0.0455);
    expect(z3 / R).toBeLessThan(0.0035);
    expect(ws2 / R).toBeGreaterThan(0.04);
    expect(ws3 / R).toBeLessThan(0.008);
    expect(sd2 / R).toBeCloseTo(0.0455, 2);
  });

  it('KS p-values match reference values', () => {
    // Identical samples: D = 0, p = 1.
    const a = Array.from({ length: 50 }, (_, i) => i);
    expect(ksTest(a, a).p).toBe(1);
    // Disjoint samples of 20 and 20: D = 1, p ≈ 1.4e-8 (asymptotic with Stephens' correction).
    const b = a.slice(0, 20);
    const c = b.map((v) => v + 100);
    const r = ksTest(b, c);
    expect(r.d).toBe(1);
    expect(r.p).toBeLessThan(1e-6);
  });

  it('KS test has the nominal false-positive rate on same-distribution samples', () => {
    const rng = new RNG(7);
    let rejects = 0;
    const trials = 400;
    for (let t = 0; t < trials; t++) {
      const x = Array.from({ length: 69 }, () => rng.gauss());
      const y = Array.from({ length: 300 }, () => rng.gauss());
      if (ksTest(x, y).p < 0.05) rejects++;
    }
    // Nominal 5 %; the asymptotic test is slightly conservative.
    expect(rejects / trials).toBeGreaterThan(0.02);
    expect(rejects / trials).toBeLessThan(0.08);
  });

  it('block-estimate SE matches the analytic SE of a mean', () => {
    const rng = new RNG(3);
    const blocks = Array.from({ length: 40 }, () => Array.from({ length: 50 }, () => 10 + 2 * rng.gauss()));
    const e = blockEstimate(blocks);
    expect(e.n).toBe(2000);
    expect(e.sd).toBeCloseTo(2, 1);
    // Analytic SE = 2/√2000 ≈ 0.0447; the 40-block estimate is within ~25 %.
    expect(e.se / (2 / Math.sqrt(2000))).toBeGreaterThan(0.75);
    expect(e.se / (2 / Math.sqrt(2000))).toBeLessThan(1.25);
  });

  it('combined z uses both standard errors', () => {
    expect(combinedZ(13, 3, 9, 4)).toBeCloseTo(0.8, 12);
  });
});

describe('E1 comparison is calibrated (model vs itself)', () => {
  // A 69-ant "pseudo-data" sample and a 300-ant sample from the same model
  // with different seeds. If the bootstrap SEs are right, z ~ N(0, 1), so
  // |z| > 2 occurs ~5 % of the time and |z| > 3 almost never.
  it('false-positive rate of the scalar z-scores is near nominal', () => {
    const FIT = 'data/fits/e1-walk.json';
    const p = walkParams(fs.existsSync(FIT) ? JSON.parse(fs.readFileSync(FIT, 'utf8')).params : undefined);
    const zs: number[] = [];
    for (let rep = 0; rep < 6; rep++) {
      const incline = [0, Math.PI / 6][rep % 2];
      const ref = referenceFor(runE1(p, { incline, ants: 69, seed: 9000 + rep, dt: 0.02 }));
      const sim = sampleFor(runE1(p, { incline, ants: 300, seed: 9100 + rep, dt: 0.02 }));
      for (const r of compareE1(sim, ref, scalarSE(sim)).rows) if (Number.isFinite(r.z)) zs.push(r.z);
    }
    const over2 = zs.filter((z) => Math.abs(z) > 2).length / zs.length;
    const over3 = zs.filter((z) => Math.abs(z) > 3).length / zs.length;
    // ~140 correlated z-scores: allow generous sampling slack around 5 %.
    expect(over2).toBeLessThan(0.12);
    expect(over3).toBeLessThan(0.03);
  });
});

describe('judging with missing statistics (STATUS 2026-10-09)', () => {
  it('a missing eligible statistic is counted, not dropped from the sum', () => {
    const j = judgedSumZ2([
      { z: 2, eligible: true },
      { z: NaN, eligible: true },
      { z: NaN, eligible: false },
      { z: 5, eligible: false },
    ]);
    expect(j).toEqual({ sum: 4, missing: 1 });
  });

  it('compareE1 lists rows the reference estimates but the simulation cannot', () => {
    const p = walkParams(undefined);
    const ref = referenceFor(runE1(p, { incline: 0, ants: 30, seed: 5, dt: 0.02 }), 20);
    const good = compareE1(sampleFor(runE1(p, { incline: 0, ants: 30, seed: 6, dt: 0.02 })), ref);
    expect(good.missing).toEqual([]);
    // No usable track: every statistic is missing, so the candidate is unjudgeable.
    const empty = compareE1({ acc: [null, null] }, ref);
    expect(empty.missing.length).toBe(empty.rows.length);
    expect(empty.missing.length).toBeGreaterThan(20);
  });
});
