import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { blockEstimate, combinedZ, ksTest, normalCdf, normalQuantile, pToZ } from '../src/sim/analysis/compare';
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
