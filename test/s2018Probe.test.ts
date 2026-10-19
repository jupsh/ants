import { describe, expect, it } from 'vitest';
import { scaleProbeToCap } from '../scripts/s2018Lib';

describe('C2 probe scale (D070)', () => {
  it('is the identity when the largest SD is at the cap (C1 phase 1 start 0)', () => {
    const c1 = [0.04, 0.04, 0.02, 0.05, 0.5, 0.02, 0.02, 0.5, 0.5, 0.5, 0.02];
    expect(scaleProbeToCap(c1, 0.5)).toBe(c1);
  });
  it('scales the largest SD to the cap and keeps the ratios', () => {
    const s = scaleProbeToCap([0.068, 0.034, 0.017], 0.5);
    expect(s[0]).toBe(0.5);
    expect(s[1] / s[0]).toBeCloseTo(0.5, 12);
    expect(s[2] / s[0]).toBeCloseTo(0.25, 12);
  });
});
