import { describe, expect, it } from 'vitest';
import { cmaes, trimmedMedian } from '../src/sim/analysis/cmaes';

/** The bounded test problems of Sakamoto & Akimoto 2017 (§3·1): optimum on the boundary in even coordinates. */
const n = 10;
const lo = Array.from({ length: n }, (_, i) => (i % 2 ? 0.1 : -0.1));
const hi = lo.map((v) => v + 5);
const xStar = Array.from({ length: n }, (_, i) => (i % 2 ? 0.1 : 0));
const m0 = Array.from({ length: n }, (_, i) => (i % 2 ? 2.6 : 2.4));
const fsph = (x: number[]) => x.reduce((s, v) => s + v * v, 0);
const fexp = (x: number[]) => x.reduce((s, v) => s + (v > 1 ? Math.exp(20 * (v - 1)) : v * v), 0);

describe('CMA-ES with Mod-BCH box constraints (STATUS 2026-10-10 night)', () => {
  for (const [name, f] of [['sphere', fsph], ['exponential', fexp]] as const)
    it(`finds the boundary optimum of the bounded ${name} and only evaluates feasible points`, async () => {
      let infeasible = 0;
      const r = await cmaes(
        (x) => {
          if (x.some((v, i) => v < lo[i] - 1e-15 || v > hi[i] + 1e-15)) infeasible++;
          return f(x);
        },
        m0,
        { sigma: 1.25, maxGenerations: 3000, tolX: 1e-9, seed: 3, bounds: { lo, hi } },
      );
      expect(infeasible).toBe(0);
      expect(r.stopReason).toBe('tolX');
      for (let i = 0; i < n; i++) expect(Math.abs(r.mean[i] - xStar[i])).toBeLessThan(1e-4);
    });

  it('stops on divergence (an unbounded linear slope) with tolUpSigma', async () => {
    const r = await cmaes((x) => x[0], [0, 0, 0], { sigma: 1, maxGenerations: 5000, tolUpSigma: 1e3, seed: 1 });
    expect(r.stopReason).toBe('tolUpSigma');
  });

  it('trimmed median uses the recent stretch within ln 5 of the newest three', () => {
    expect(trimmedMedian([1, 2, 3])).toBe(2);
    // Newest first: the last three are ~1, then a jump to 100 is excluded.
    expect(trimmedMedian([1, 1.2, 0.9, 1.1, 100, 100, 100])).toBeCloseTo(1.05, 10);
  });
});
