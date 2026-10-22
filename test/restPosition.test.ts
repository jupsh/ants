import { describe, expect, it } from 'vitest';
import { ActivityStats, REST_W, restCell, spearman, type AntHours } from '../src/sim/analysis/activity';
import {
  boxSum,
  partialSpearman,
  REST_G,
  restColony,
  restPosition,
  restWindow,
  shareSpatial,
  SiteField,
  weightedMedian,
  type RestWindow,
} from '../src/sim/analysis/restPosition';

// Per-ant activity vs rest position (D076, approved D077).
const H = [0, 1, 2, 3, 4, 5];
const ant = (f1: number, f2: number, s = 1800): AntHours => Object.fromEntries(H.map((h) => [h, [0, 0, 0, s, (h < 3 ? f1 : f2) * s]]));

describe('rest position statistics', () => {
  it('partial Spearman matches the closed form on ranks and is 0 when c explains both', () => {
    const x = [1, 2, 3, 4, 5, 6, 7, 8];
    const y = [2, 1, 4, 3, 6, 5, 8, 7];
    const c = [1, 3, 2, 5, 4, 7, 6, 8];
    const rxy = spearman(x, y), rxc = spearman(x, c), ryc = spearman(y, c);
    expect(partialSpearman(x, y, c)).toBeCloseTo((rxy - rxc * ryc) / Math.sqrt((1 - rxc ** 2) * (1 - ryc ** 2)), 12);
    // x and y are both monotone in c → ranks identical → partial undefined (no residual variance).
    expect(partialSpearman(x, x, x)).toBeNaN();
    // A constant covariate leaves the plain Spearman.
    expect(partialSpearman(x, y, x.map(() => 1))).toBeNaN();
  });
  it('weighted median over still steps (mean of the two middle steps when even)', () => {
    const E = new Float64Array(REST_G);
    const n = new Float64Array(REST_G);
    E[0] = 1; E[1] = 2; E[2] = 3;
    n[0] = 1; n[1] = 1; n[2] = 2; // steps: 1, 2, 3, 3 → (2 + 3) / 2
    expect(weightedMedian(E, n)).toBe(2.5);
    n[0] = 2; // 1, 1, 2, 3, 3 → 2
    expect(weightedMedian(E, n)).toBe(2);
    expect(weightedMedian(E, new Float64Array(REST_G))).toBeNaN();
  });
  it('site field: 5 × 5 box sum over its rectangle mean, the focal ant left out', () => {
    const a = new Float64Array(REST_G);
    const b = new Float64Array(REST_G);
    a[restCell(10.5, 10.5)] = 4;
    b[restCell(30.5, 20.5)] = 6;
    const tot = Float64Array.from(a, (v, q) => v + b[q]);
    const rect = { x0: 0, x1: 70, y0: 0, y1: 40 };
    const F = new SiteField(tot, rect);
    const Ea = F.field(a); // only b remains
    const Fb = new SiteField(b, rect).field(null);
    for (let q = 0; q < REST_G; q++) expect(Ea[q]).toBeCloseTo(Fb[q], 12);
    // Mean over the rectangle's cells is 1 by construction.
    const cells = 70 * 40;
    let s = 0;
    for (let y = 0; y < 40; y++) for (let x = 0; x < 70; x++) s += Fb[y * REST_W + x];
    expect(s / cells).toBeCloseTo(1, 12);
    expect(boxSum(b)[restCell(32.5, 22.5)]).toBe(6);
    expect(boxSum(b)[restCell(33.5, 22.5)]).toBe(0);
    // Nothing left after removing the only contributor → NaN.
    expect(new SiteField(a, rect).field(a)[0]).toBeNaN();
  });
  it('rest position needs 600 observed still step-frames in the window', () => {
    const E = new Float64Array(REST_G).fill(2);
    const rest = { 0: { [restCell(5, 5)]: 10 } };
    expect(restPosition(ant(0.9, 0.9, 1000), rest, H, E)).toBe(2); // 6 × 100 still frames
    expect(restPosition(ant(0.9, 0.9, 999), rest, H, E)).toBeNaN();
  });
  it('window: D043 eligibility, ants without R dropped and counted; zPart removes what R carries', () => {
    // Activity is a function of R (plus a within-R order that flips between halves): persistence is all spatial.
    const ants: AntHours[] = [];
    const R: number[] = [];
    for (let i = 0; i < 12; i++) {
      const base = Math.floor(i / 2) / 10;
      ants.push(ant(base + (i % 2) * 0.01, base + ((i + 1) % 2) * 0.01));
      R.push(Math.floor(i / 2));
    }
    ants.push(ant(0.5, 0.5));
    R.push(NaN);
    const w = restWindow(ants, R, H);
    expect(w.nZ).toBe(12);
    expect(w.nZNoR).toBe(1);
    expect(w.zFull).toBeGreaterThan(1.5);
    // Within R the order flips exactly between halves: the partial correlation is −1 (clipped).
    expect(w.zPart).toBeCloseTo(Math.atanh(-0.999), 12);
    expect(w.zE).toBeGreaterThan(1.5);
    // Seven ants with R are too few.
    expect(restWindow(ants.slice(0, 7), R.slice(0, 7), H).zFull).toBeNaN();
  });
  it('colony value: weighted means over valid windows; S as a ratio of means', () => {
    const w = (zFull: number, zPart: number, n: number): RestWindow => ({ zFull, zPart, nZ: n, nZNoR: 0, zE: 0.1, nE: n, nENoR: 1 });
    const c = restColony([w(1, 0.5, 13), w(0.5, 0, 23), w(NaN, NaN, 9)]);
    expect(c.zFull).toBeCloseTo((10 * 1 + 20 * 0.5) / 30, 12);
    expect(c.zPart).toBeCloseTo((9 * 0.5 + 19 * 0) / 28, 12);
    expect(c.wZ).toBe(2);
    expect(c.nENoR).toBe(3);
    expect(shareSpatial([{ zFull: 1, zPart: 0.25 }, { zFull: 0.6, zPart: 0.15 }, { zFull: NaN, zPart: 1 }])).toBeCloseTo(1 - 0.2 / 0.8, 12);
  });
});

describe('ActivityStats rest recorder', () => {
  // A short synthetic track: ant 0 alternates still and moving, ant 1 untracked.
  const frames = Array.from({ length: 400 }, (_, f) => ({ x: 10 + (Math.floor(f / 50) % 2 ? f * 0.8 : 0) % 50, y: 20 }));
  const run = (rec: boolean) => {
    const s = new ActivityStats([true, false], (t) => Math.floor(t / 100), rec);
    frames.forEach((p, f) => s.frame(f, f * 0.5, [0, 1], [p.x, 5], [p.y, 5], [true, true]));
    return s;
  };
  it('is off by default and leaves the hourly counts unchanged when on', () => {
    expect(run(false).rest).toBeNull();
    expect(() => run(false).restOut()).toThrow();
    expect(run(true).out()).toEqual(run(false).out());
  });
  it('counts one entry per observed still step, in the step’s hour, tracked ants only', () => {
    const s = run(true);
    const out = s.out();
    const rest = s.restOut();
    expect(rest.length).toBe(1);
    for (const [h, r] of Object.entries(out[0])) {
      const still = Object.values(rest[0][Number(h)] ?? {}).reduce((a, b) => a + b, 0);
      // Every step here is 1 frame long, so still steps = still step-frames.
      expect(still).toBe(r[3] - r[4]);
    }
  });
});
