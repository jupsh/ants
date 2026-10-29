import { describe, expect, it } from 'vitest';
import { RNG } from '../src/sim/core/rng';
import { seedFor } from '../scripts/lib';
import {
  type ColonyCap, comparePair, conditionNumber, crossPair, type DatasetCap, datasetCap, eigenSym, mahalanobis2,
  nullPairs, sameMemberCheck, separated, threshold,
} from '../scripts/capability';
import { capSeed } from '../scripts/capSeeds';

// Part D capability rule (D174 Part A as amended by D175): synthetic values only; no simulation is run here.
const colony = (r: RNG, k: number, shift = 0): ColonyCap => ({
  colony: k, c0: 0.1 + 0.02 * r.gauss(), c3: 0.014 + shift + 0.01 * r.gauss(), j0: 0.088 + 0.02 * r.gauss(), j3: 0.017 + shift + 0.01 * r.gauss(), s32: 0.2 + 1.0 * r.gauss(),
});
const dataset = (seed: number, shift = 0, n = 22) => { const r = RNG.stream(seed, 1); return Array.from({ length: n }, (_, k) => colony(r, k, shift)); };
const cap = (cols: ColonyCap[], seed: number) => datasetCap(cols, RNG.stream(seed, 2), 500);

describe('capability: linear algebra', () => {
  it('M² on a known case: diagonal covariance gives Σ d² / σ²', () => {
    expect(mahalanobis2([1, 2, 3], [[1, 0, 0], [0, 4, 0], [0, 0, 9]])).toBeCloseTo(3, 12);
    expect(mahalanobis2([1, 1], [[2, 1], [1, 2]])).toBeCloseTo(2 / 3, 12);
  });
  it('eigenvalues and the condition number', () => {
    expect(eigenSym([[2, 1], [1, 2]]).sort()).toEqual([expect.closeTo(1, 10), expect.closeTo(3, 10)]);
    expect(conditionNumber([[1, 0, 0], [0, 1e-9, 0], [0, 0, 1]])).toBeGreaterThan(1e8);
    expect(conditionNumber([[1, 0.99, 0], [0.99, 1, 0], [0, 0, 1]])).toBeCloseTo(199, 6);
  });
});

describe('capability: one dataset', () => {
  it('θ is ratios of colony means and the S3₂ mean, on estimable colonies only', () => {
    const cols = dataset(1);
    cols[3] = { ...cols[3], s32: NaN };
    const d = cap(cols, 1);
    const ok = cols.filter((_, k) => k !== 3);
    const m = (f: (c: ColonyCap) => number) => ok.reduce((a, c) => a + f(c), 0) / ok.length;
    expect(d.n).toBe(21);
    expect(d.evaluable).toBe(true);
    expect(d.theta[0]).toBeCloseTo(m((c) => c.c3) / m((c) => c.c0), 12);
    expect(d.theta[1]).toBeCloseTo(m((c) => c.s32), 12);
    expect(d.theta[2]).toBeCloseTo(m((c) => c.j3) / m((c) => c.j0), 12);
  });
  it('fewer than 18 estimable colonies: not evaluable', () => {
    const cols = dataset(2).map((c, k) => (k < 5 ? { ...c, j0: NaN } : c));
    expect(cap(cols, 2)).toMatchObject({ n: 17, evaluable: false });
  });
  it("D126's edge rule: more than 1 % of draws with a denominator ≤ 0.01 makes R not evaluable", () => {
    const cols = dataset(3).map((c, k) => ({ ...c, c0: k < 2 ? 0.2 : 0.0001 }));
    const d = cap(cols, 3);
    expect(d.evaluable).toBe(false);
    expect(d.why).toMatch(/^R: /);
    expect(d.badR).toBeGreaterThan(5);
  });
  it('the bootstrap is reproducible from its stream', () => {
    expect(Array.from(cap(dataset(4), 9).draws[0])).toEqual(Array.from(cap(dataset(4), 9).draws[0]));
  });
});

describe('capability: pairs, nulls and the decision rules', () => {
  const rule = { c: 7.81, alpha: 0.05 / 3 };
  it('a large shift in R and R_J separates; the same mechanism mostly does not', () => {
    expect(separated(comparePair(cap(dataset(10), 10), cap(dataset(11, 0.03), 11)), rule)).toBe(true);
    const same = Array.from({ length: 20 }, (_, i) => separated(comparePair(cap(dataset(20 + 2 * i), 1), cap(dataset(21 + 2 * i), 2)), rule));
    expect(same.filter(Boolean).length).toBeLessThanOrEqual(4);
  });
  it('null pairs use distinct runs per side and colony, and give a threshold near χ²₃ for iid colonies', () => {
    const r = RNG.stream(30, 0);
    const pools = Array.from({ length: 22 }, (_, k) => Array.from({ length: 8 }, (_, run) => ({ run, v: colony(r, k) })));
    const seen: number[][] = [];
    const avg = (runs: { run: number; v: ColonyCap }[], k: number): ColonyCap => {
      seen.push(runs.map((x) => x.run));
      const m = (f: (c: ColonyCap) => number) => runs.reduce((a, x) => a + f(x.v), 0) / runs.length;
      return { colony: k, c0: m((c) => c.c0), c3: m((c) => c.c3), j0: m((c) => c.j0), j3: m((c) => c.j3), s32: m((c) => c.s32) };
    };
    const nulls = nullPairs(pools, avg, 200, 31, 2, 400);
    for (let i = 0; i < seen.length; i += 2) expect(new Set([...seen[i], ...seen[i + 1]]).size).toBe(4);
    const t = threshold(nulls.map((n) => n.pair));
    expect(t.nEvaluable).toBe(200);
    // Bootstrap covariances at 22 colonies run a little narrow: c sits above χ²₃'s 7.81 and the uncalibrated
    // Bonferroni screen above 5 % (≈ 8.5 and ≈ 7 % on 1,000 independent pairs), which is why both are set on nulls.
    expect(t.c).toBeGreaterThan(6);
    expect(t.c).toBeLessThan(14);
    expect(t.alpha).not.toBeNull();
    expect(t.fallbackFp.find((f) => f.alpha === t.alpha)!.fp).toBeLessThanOrEqual(0.05);
    expect(t.ruleFp).toBeLessThanOrEqual(0.1);
  });
  it('same-member check: 13 of 135 passes, 14 fails (more than 10 %)', () => {
    const fake = (exceed: boolean): DatasetCap => ({ n: 22, evaluable: true, theta: [exceed ? 1 : 0, 0, 0], cov: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], draws: [], badR: 0, badRJ: 0 });
    // A member with k outlier datasets among six has k · (6 − k) exceeding pairs (M² = 1 / 2 = 0.5 > c = 0.4):
    // k = 1 → 5, 2 → 8, 3 → 9. Nine members, 15 pairs each.
    const member = (k: number) => Array.from({ length: 6 }, (_, i) => fake(i < k));
    const r = { c: 0.4, alpha: 0.01 };
    const ms = (ks: number[]) => Object.fromEntries(Array.from({ length: 9 }, (_, i) => [`m${i}`, member(ks[i] ?? 0)]));
    expect(sameMemberCheck(ms([1, 2]), r)).toMatchObject({ pairs: 135, exceed: 13, pass: true });
    expect(sameMemberCheck(ms([1, 3]), r)).toMatchObject({ pairs: 135, exceed: 14, pass: false });
  });
  it('cross pair: ≥ 27 of 36 distinguishes; fewer than 4 evaluable datasets on a side is not evaluable', () => {
    const at = (x: number): DatasetCap => ({ n: 22, evaluable: true, theta: [x, 0, 0], cov: [[0.5, 0, 0], [0, 1, 0], [0, 0, 1]], draws: [], badR: 0, badRJ: 0 });
    const T = Array.from({ length: 6 }, () => at(0));
    const D = (far: number) => Array.from({ length: 6 }, (_, i) => at(i < far ? 10 : 0));
    const r = { c: 7.81, alpha: 0.01 };
    expect(crossPair(T, D(5), r)).toMatchObject({ comparisons: 36, exceed: 30, distinguished: true });
    expect(crossPair(T, D(4), r)).toMatchObject({ comparisons: 36, exceed: 24, distinguished: false });
    const bad = { ...at(0), evaluable: false };
    expect(crossPair([bad, bad, bad, at(0), at(0), at(0)], D(6), r)).toMatchObject({ evaluable: false });
  });
});

describe('capability: seed streams (D174: cap 0xc4b3 apart from diag, judge and probe)', () => {
  it('every cap seed (11 members × 12 runs, the base pool × 16, 22 colonies) is distinct and unused by Stage 2a/2b', () => {
    const cap = new Set<number>();
    for (let arm = 0; arm <= 11; arm++) for (let run = 0; run < 16; run++) for (let c = 0; c < 22; c++) cap.add(capSeed(arm, run, c));
    expect(cap.size).toBe(12 * 16 * 22);
    const old = new Set<number>();
    for (let i = 0; i < 22; i++) old.add(seedFor(2018, 'diag', 0xc4b0, i));
    for (const key of [0xc4b1, 0xc4b2]) for (let i = 0; i < 44; i++) old.add(seedFor(2018, 'judge', key, i));
    for (const s of cap) expect(old.has(s)).toBe(false);
  });
});
