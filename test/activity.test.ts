import { describe, expect, it } from 'vitest';
import { activityRows, activityWindow, lightWindows, spearman, type AntHours } from '../src/sim/analysis/activity';

// Activity rows of candidate C2 (STATUS 2026-10-18 ≈ 01:46): definitions as logged.
const H = [0, 1, 2, 3, 4, 5];
/** An ant with `s` step-frames per hour and moving fractions f1 (hours 0–2) and f2 (hours 3–5). */
const ant = (f1: number, f2: number, s = 1800): AntHours => Object.fromEntries(H.map((h) => [h, [0, 0, 0, s, (h < 3 ? f1 : f2) * s]]));

describe('activity rows', () => {
  it('Spearman uses average ranks for ties; undefined without rank variance', () => {
    expect(spearman([1, 2, 3, 4], [1, 2, 3, 4])).toBeCloseTo(1, 12);
    expect(spearman([1, 2, 2, 3], [1, 3, 2, 4])).toBeCloseTo(4.5 / Math.sqrt(22.5), 12);
    expect(spearman([1, 1, 1], [1, 2, 3])).toBeNaN();
  });
  it('persistence: Fisher z across eligible ants, r clipped at ±0.999, ≥ 8 ants', () => {
    const ants = Array.from({ length: 10 }, (_, i) => ant(i / 100, i / 100));
    expect(activityWindow(ants, H).z).toBeCloseTo(Math.atanh(0.999), 12);
    expect(activityWindow(ants, H).nZ).toBe(10);
    // Seven ants are too few; an ant below 5400 step-frames in a half is not eligible.
    expect(activityWindow(ants.slice(0, 7), H).z).toBeNaN();
    const thin = [...ants.slice(0, 7), ant(0.5, 0.5, 1799)];
    expect(activityWindow(thin, H).nZ).toBe(7);
    expect(activityWindow(thin, H).z).toBeNaN();
  });
  it('spread: share of the summed moving fraction carried by the top round(0.2 n) ants', () => {
    // 10 ants: two at 0.4, eight at 0.05 → (0.8) / (0.8 + 0.4) = 2/3.
    const ants = [ant(0.4, 0.4), ant(0.4, 0.4), ...Array.from({ length: 8 }, () => ant(0.05, 0.05))];
    expect(activityWindow(ants, H).top20).toBeCloseTo(2 / 3, 12);
    const still = Array.from({ length: 10 }, () => ant(0, 0));
    expect(activityWindow(still, H).top20).toBeNaN();
  });
  it('colony rows: (n − 3)-weighted z over valid windows, mean spread, counts beside', () => {
    const a = Array.from({ length: 10 }, (_, i) => ant(i / 100, (9 - i) / 100));
    const r = activityRows({ nurse: a, forager: a.slice(0, 3) }, [H]);
    expect(r['persist.nurse.light']).toBeCloseTo(Math.atanh(-0.999), 12);
    expect(r['persist.forager.light']).toBeNaN();
    expect(r['top20.nurse.n']).toBe(10);
  });
  it('data windows: complete 6-h windows from the start of the longest light block', () => {
    const light = (h: number) => h >= 6 && h < 18;
    const day = (d: number, from = 0, to = 24) => Array.from({ length: to - from }, (_, k) => 24 * d + from + k);
    expect(lightWindows([...day(0), ...day(1, 0, 10)], light)).toEqual([day(0, 6, 12), day(0, 12, 18)]);
    // An 11-h block gives one window.
    expect(lightWindows(day(2, 7, 24), light)).toEqual([day(2, 7, 13)]);
  });
});

// Colony-set correction (STATUS 2026-10-18): a target averages exactly its data colonies; a missing value is never dropped.
import { s2018Loss, s2018Missing, type S2018Target } from '../src/sim/experiments/stroeymeytTargets';
describe('target colony sets', () => {
  const t: S2018Target = { id: 'persist.forager.light', simId: 'persist.forager.light', mean: 0.7, se: 0.1, colonies: ['a', 'b'] };
  it('uses only the runs of the colonies in the set', () => {
    const sims = [{ 'persist.forager.light': 0.7 }, { 'persist.forager.light': 0.9 }, { 'persist.forager.light': 5 }];
    const both = s2018Loss(sims.slice(0, 2), [t], ['a', 'b']);
    expect(s2018Loss(sims, [t], ['a', 'b', 'c'])).toBe(both);
  });
  it('a missing value on the set makes the loss infinite and is listed', () => {
    const sims = [{ 'persist.forager.light': 0.7 }, { 'persist.forager.light': NaN }, { 'persist.forager.light': 0.8 }];
    expect(s2018Loss(sims, [t], ['a', 'b', 'a'])).toBe(Infinity);
    expect(s2018Missing(sims, ['a', 'b', 'a'], [t])).toEqual([{ id: t.id, cases: ['b (run 1)'] }]);
    // A colony of the set without any run is missing too; a missing value outside the set is not.
    expect(s2018Missing([{ 'persist.forager.light': 0.7 }, { 'persist.forager.light': NaN }], ['a', 'c'], [t])).toEqual([{ id: t.id, cases: ['b (no run)'] }]);
  });
});
