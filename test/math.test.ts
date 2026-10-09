import { describe, expect, it } from 'vitest';
import { hypot } from '../src/sim/core/math';
import { RNG } from '../src/sim/core/rng';

describe('hypot', () => {
  it('is bit-identical to Math.hypot for two arguments', () => {
    const r = new RNG(1);
    const draw = () => {
      const k = r.next();
      return k < 0.4 ? r.range(-400, 400) : k < 0.7 ? r.range(-1e-3, 1e-3) : k < 0.9 ? r.range(-1, 1) * 10 ** r.range(-300, 300) : Math.round(r.range(-50, 50)) / 4;
    };
    let diff = 0;
    for (let i = 0; i < 200000; i++) {
      const x = draw();
      const y = draw();
      if (!Object.is(hypot(x, y), Math.hypot(x, y))) diff++;
    }
    expect(diff).toBe(0);
    for (const [x, y] of [
      [0, 0],
      [-0, 0],
      [NaN, 1],
      [Infinity, NaN],
      [NaN, -Infinity],
      [1e308, 1e308],
      [5e-324, 5e-324],
      [3, 4],
      [-3, 4],
      [0, -7],
    ])
      expect(Object.is(hypot(x, y), Math.hypot(x, y))).toBe(true);
  });
});
