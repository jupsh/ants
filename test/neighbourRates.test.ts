import { describe, expect, it } from 'vitest';
import { NeighbourStats, type NbTables } from '../src/sim/analysis/neighbourRates';
import { RNG } from '../src/sim/core/rng';
import { binned, decompose, kmAtLeast, readSplit, split, type Split } from '../scripts/nbDecomp';

// D083 Part B (amendment 1, D084): observer check and synthetic reconstruction check.
const DT = 0.5;

/**
 * Synthetic colony: two isolated focal nurses (A = 1 when still, N = 0 when moving), one focal nurse beside two
 * always-still anchors with the queen role (A = 3, N = 2), per-frame leave / stop probabilities known. A moving ant
 * toggles 1 mm about its spot (a moving step every frame); a still ant stays put. Ant 0 misses 5 frames every 1000.
 */
function synthetic(frames: number, p: { leave1: number; stop1: number; leave3: number; stop3: number }, seed = 1, active?: (t: number) => boolean): NbTables {
  const home = [[10, 10], [60, 10], [30.5, 31], [30, 30], [31, 30]];
  const role = [0, 0, 0, 2, 2];
  const rng = new RNG(seed);
  const st = new NeighbourStats(role, DT, active);
  const still = [true, true, true, true, true];
  const off = [0, 0, 0, 0, 0];
  for (let f = 0; f < frames; f++) {
    for (let i = 0; i < 3; i++) {
      const lv = i === 2 ? p.leave3 : p.leave1;
      const sp = i === 2 ? p.stop3 : p.stop1;
      if (still[i]) still[i] = !rng.chance(lv);
      else still[i] = rng.chance(sp);
      if (!still[i]) off[i] = off[i] ? 0 : 1;
    }
    const ids: number[] = [];
    const xs: number[] = [];
    const ys: number[] = [];
    const ins: boolean[] = [];
    for (let i = 0; i < 5; i++) {
      if (i === 0 && f % 1000 < 5) continue;
      ids.push(i);
      xs.push(home[i][0] + off[i]);
      ys.push(home[i][1]);
      ins.push(true);
    }
    st.frame(f, f * DT, ids, xs, ys, ins);
  }
  return st.finish();
}

describe('NeighbourStats (observer check)', () => {
  const p = { leave1: 0.05, stop1: 0.2, leave3: 0.01, stop3: 0.5 };
  const t = synthetic(200_000, p);
  const G = t.groups[0];
  it('recovers the leave and stop hazards by neighbour count', () => {
    expect(G.leaveEv[0] / G.leaveExp[0]).toBeCloseTo(p.leave1, 2); // A = 1
    expect(G.leaveEv[2] / G.leaveExp[2]).toBeCloseTo(p.leave3, 3); // A = 3
    expect(G.stopEv[0] / G.stopExp[0]).toBeCloseTo(p.stop1, 1); // N = 0
    expect(G.stopEv[2] / G.stopExp[2]).toBeCloseTo(p.stop3, 1); // N = 2
    // No other bins are occupied.
    for (const b of [1, 3, 4, 5, 6, 7, 8]) expect(G.leaveExp[b]).toBe(0);
    expect(t.groups[1].leaveExp.reduce((a, b) => a + b, 0)).toBe(0);
  });
  it('recovers geometric rest survival per A bin, censoring at detection gaps', () => {
    const T = Math.round(10 / DT);
    expect(kmAtLeast(G.survEv[0], G.survCens[0], T)).toBeCloseTo((1 - p.leave1) ** (T - 1), 1);
    expect(kmAtLeast(G.survEv[2], G.survCens[2], T)).toBeCloseTo((1 - p.leave3) ** (T - 1), 1);
    expect(G.survCens[0].reduce((a, b) => a + b, 0)).toBeGreaterThan(0); // ant 0's gaps censor episodes
  });
  it('counts nothing outside the active window', () => {
    const none = synthetic(5000, p, 2, () => false);
    expect(none.groups[0].leaveExp.reduce((a, b) => a + b, 0)).toBe(0);
    expect(none.groups[0].starts.reduce((a, b) => a + b, 0)).toBe(0);
  });
});

describe('symmetric split and readings (reconstruction check)', () => {
  const d = { w: [0.5, 0.5, 0], r: [1, 3, NaN] };
  it('composition only: W = 0, C = gap', () => {
    const s = split({ w: [0.25, 0.75, 0], r: [1, 3, NaN] }, d);
    expect(s.W).toBeCloseTo(0, 12);
    expect(s.C).toBeCloseTo(s.gap, 12);
    expect(s.gap).toBeCloseTo(0.25 + 2.25 - 2, 12);
  });
  it('within only: C = 0, W = gap', () => {
    const s = split({ w: [0.5, 0.5, 0], r: [2, 4, NaN] }, d);
    expect(s.C).toBeCloseTo(0, 12);
    expect(s.W).toBeCloseTo(1, 12);
  });
  it('components always sum to the gap', () => {
    const s = split({ w: [0.2, 0.7, 0.1], r: [0.5, 2, 9] }, { w: [0.6, 0.3, 0.1], r: [1, 3, 8] });
    expect(s.C + s.W).toBeCloseTo(s.gap, 12);
  });
  it('missing support: a bin occupied on one side with no value on the other is unestimable, never dropped', () => {
    const s = split({ w: [0.4, 0.4, 0.2], r: [1, 3, 5] }, d);
    expect(s.unsupported).toEqual([2]);
    expect(s.gap).toBeNaN();
    const r = readSplit(s, [s]);
    expect(r.reading).toMatch(/^unestimable/);
  });
  const draws = (f: (k: number) => Split) => Array.from({ length: 200 }, (_, k) => f(k));
  const jit = (k: number) => ((k % 21) - 10) / 1000;
  it('readings: dominated by composition / by conditional rates', () => {
    const comp = { gap: 1, C: 0.9, W: 0.1, unsupported: [] };
    expect(readSplit(comp, draws((k) => ({ gap: 1 + jit(k), C: 0.9 + jit(k), W: 0.1, unsupported: [] }))).reading).toBe('gap dominated by neighbourhood composition');
    const within = { gap: 1, C: 0.1, W: 0.9, unsupported: [] };
    expect(readSplit(within, draws((k) => ({ gap: 1 + jit(k), C: 0.1, W: 0.9 + jit(k), unsupported: [] }))).reading).toBe('gap dominated by conditional rates / survival');
    const both = { gap: 1, C: 0.5, W: 0.5, unsupported: [] };
    expect(readSplit(both, draws(() => both)).reading).toBe('both contribute');
  });
  it('readings: cancellation is "counteracting", an unresolved gap is "no resolved aggregate gap"', () => {
    const counter = { gap: 0.2, C: 1.2, W: -1.0, unsupported: [] };
    expect(readSplit(counter, draws((k) => ({ gap: 0.2 + jit(k), C: 1.2, W: -1.0 + jit(k), unsupported: [] }))).reading).toBe('counteracting components');
    const zero = { gap: 0, C: 1, W: -1, unsupported: [] };
    expect(readSplit(zero, draws((k) => ({ gap: jit(k), C: 1, W: -1 + jit(k), unsupported: [] }))).reading).toBe('no resolved aggregate gap');
  });
  it('more than 5 % of draws without support makes the reading unestimable', () => {
    const ok = { gap: 1, C: 0.1, W: 0.9, unsupported: [] };
    const ds = draws((k) => (k < 15 ? { gap: NaN, C: NaN, W: NaN, unsupported: [4] } : ok));
    expect(readSplit(ok, ds).reading).toBe('unestimable (missing support in bins 4)');
  });
});

describe('decomposition on recorder tables', () => {
  // Model and data from the same generator: identical conditional rates, different composition (the model's
  // clustered ant leaves less often, so it spends more time at A = 3).
  const data = [1, 2, 3, 4].map((s) => synthetic(40_000, { leave1: 0.05, stop1: 0.2, leave3: 0.01, stop3: 0.5 }, s));
  const model = [[5, 6], [7, 8], [9, 10], [11, 12]].map((ss) => ss.map((s) => synthetic(40_000, { leave1: 0.05, stop1: 0.2, leave3: 0.01, stop3: 0.5 }, s)));
  it('the survival quantity is the episode-weighted mixture of conditional Kaplan–Meier estimates', () => {
    const b = binned(data[0], 0, 'surv10');
    const G = data[0].groups[0];
    const T = Math.round(10 / DT);
    const mix = G.starts.reduce((a, s, k) => (s ? a + (s / G.starts.reduce((x, y) => x + y, 0)) * kmAtLeast(G.survEv[k], G.survCens[k], T) : a), 0);
    expect(b.w.reduce((a, w, k) => (w ? a + w * b.r[k] : a), 0)).toBeCloseTo(mix, 12);
  });
  it('same generator on both sides: no resolved aggregate gap for the leaving hazard', () => {
    const r = decompose(data, model, 0, 'leave', 300);
    expect(r.reading).toBe('no resolved aggregate gap');
    expect(r.gap.lo).toBeLessThan(0);
    expect(r.gap.hi).toBeGreaterThan(0);
  });
});
