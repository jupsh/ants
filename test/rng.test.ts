import { describe, expect, it } from 'vitest';
import { RNG } from '../src/sim/core/rng';

describe('RNG.gamma', () => {
  it('has mean shape × scale and variance shape × scale², also for shape < 1', () => {
    for (const [shape, scale] of [[0.4, 2], [1, 1], [3, 0.5]]) {
      const rng = new RNG(7);
      const n = 200_000;
      let s = 0;
      let s2 = 0;
      for (let i = 0; i < n; i++) {
        const x = rng.gamma(shape, scale);
        expect(x).toBeGreaterThanOrEqual(0);
        s += x;
        s2 += x * x;
      }
      const m = s / n;
      const v = s2 / n - m * m;
      // Mean within 4 SE; variance within 5 %.
      expect(Math.abs(m - shape * scale)).toBeLessThan(4 * Math.sqrt((shape * scale * scale) / n));
      expect(v / (shape * scale * scale)).toBeGreaterThan(0.95);
      expect(v / (shape * scale * scale)).toBeLessThan(1.05);
    }
  });

  it('is reproducible from the seed', () => {
    const a = new RNG(3);
    const b = new RNG(3);
    for (let i = 0; i < 100; i++) expect(a.gamma(0.7, 1)).toBe(b.gamma(0.7, 1));
  });
});
