import { describe, expect, it } from 'vitest';
import { cmaes, eigenDecomposition } from '../src/sim/analysis/cmaes';
import { RNG } from '../src/sim/core/rng';

describe('CMA-ES', () => {
  it('eigendecomposition reconstructs a symmetric positive-definite matrix', () => {
    const r = new RNG(3);
    const n = 6;
    const A = Array.from({ length: n }, () => Array.from({ length: n }, () => r.gauss()));
    const C = A.map((_, i) => A.map((_, j) => A[i].reduce((s, v, k) => s + v * A[j][k], 0) + (i === j ? 0.1 : 0)));
    const { B, D } = eigenDecomposition(C);
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) expect(B[i].reduce((s, b, k) => s + b * D[k] * D[k] * B[j][k], 0)).toBeCloseTo(C[i][j], 9);
  });

  it('converges on the sphere and on Rosenbrock', async () => {
    const sphere = await cmaes((x) => x.reduce((s, v) => s + v * v, 0), new Array(10).fill(3), { sigma: 1, maxGenerations: 1000, tolX: 1e-10 });
    expect(Math.max(...sphere.mean.map(Math.abs))).toBeLessThan(1e-6);
    const rosen = (x: number[]) => x.slice(0, -1).reduce((s, v, i) => s + 100 * (x[i + 1] - v * v) ** 2 + (1 - v) ** 2, 0);
    const r = await cmaes(rosen, new Array(6).fill(-1), { sigma: 0.5, maxGenerations: 3000, tolX: 1e-10 });
    for (const v of r.mean) expect(v).toBeCloseTo(1, 4);
  });

  it('averages over noise redrawn every generation: the final mean lands near the optimum', async () => {
    // Noise SD 0.5 on a sphere with minimum 0 at x = 1 (n = 8); fresh noise per generation and candidate.
    let k = 0;
    const f = (x: number[], g: number) => x.reduce((s, v) => s + (v - 1) ** 2, 0) + RNG.stream(99, g, k++).normal(0, 0.5);
    const r = await cmaes(f, new Array(8).fill(-2), { sigma: 1, maxGenerations: 400, seed: 5 });
    const err = Math.sqrt(r.mean.reduce((s, v) => s + (v - 1) ** 2, 0));
    expect(err).toBeLessThan(0.3);
  });
});
