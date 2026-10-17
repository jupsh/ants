import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InNestAccumulator } from '../src/sim/analysis/inNest';
import { ColonySim } from '../src/sim/experiments/colonyBles';
import { simulateStroeymeyt, type StroeymeytColony } from '../src/sim/experiments/colonyStroeymeyt';
import { s2018Base } from '../src/sim/experiments/stroeymeytTargets';
import { LASIUS_NEST_B, LASIUS_PARAMS } from '../src/sim/species/lasiusM1';

// Observer sensitivity variants (STATUS 2026-10-17 ≈ 01:30 UTC): slow position offset per ant, pixel rounding.
const P = s2018Base({ ...LASIUS_PARAMS, nest: { ...LASIUS_NEST_B, forager: {} } }, 1 / 300);
const base: StroeymeytColony = { label: 'test', nurses: 8, foragers: 4, noiseSd: 0, detection: 0.9 };
const o = { seed: 5, phase: 'light' as const, warmupS: 60, obsS: 600, exploreGiveUp: 60 };

interface Frame { ids: number[]; dx: number[]; dy: number[]; xs: number[]; ys: number[]; rest: boolean[] }
let frames: Frame[] = [];
let sim: ColonySim | null = null;
const stepFn = ColonySim.prototype.step;
const frameFn = InNestAccumulator.prototype.frame;
const first = new Set<InNestAccumulator>();

beforeEach(() => {
  ColonySim.prototype.step = function (this: ColonySim, ...a: Parameters<typeof stepFn>) {
    sim = this;
    return stepFn.apply(this, a);
  } as typeof stepFn;
  InNestAccumulator.prototype.frame = function (this: InNestAccumulator, f: number, hour: number, n: number, ids: number[], xs: number[], ys: number[], ins: boolean[]) {
    if (!first.size) first.add(this);
    if (first.has(this)) {
      const b = ids.map((i) => sim!.w.ants[i].body);
      frames.push({ ids: [...ids], xs: [...xs], ys: [...ys], dx: xs.map((x, k) => x - b[k].x), dy: ys.map((y, k) => y - b[k].y), rest: ids.map((i) => sim!.w.ants[i].mind.mode === 'rest') });
    }
    return frameFn.call(this, f, hour, n, ids, xs, ys, ins);
  } as typeof frameFn;
});
afterEach(() => {
  ColonySim.prototype.step = stepFn;
  InNestAccumulator.prototype.frame = frameFn;
  frames = [];
  first.clear();
});

const run = (c: StroeymeytColony) => {
  frames = [];
  first.clear();
  const r = simulateStroeymeyt(P, c, o);
  return { r, frames };
};

describe('observer variants (STATUS 2026-10-17 ≈ 01:30 UTC)', () => {
  it('leave the ants and the detections unchanged; pixel rounding puts every coordinate on the grid', () => {
    const off = run(base);
    const on = run({ ...base, posDrift: { kind: 'tag', sd: 0.3, tau: 20 }, pxRound: 0.023 });
    expect(on.frames.map((f) => f.ids)).toEqual(off.frames.map((f) => f.ids));
    // True positions agree frame by frame: observed − offset differs only by the drift and rounding.
    expect(off.frames.every((f) => f.dx.every((d) => d === 0))).toBe(true);
    for (const f of on.frames) for (const x of [...f.xs, ...f.ys]) expect(Math.abs(x / 0.023 - Math.round(x / 0.023))).toBeLessThan(1e-6);
  });

  it("'tag': a stationary OU offset of SD sd, correlated over tau", () => {
    const { frames: F } = run({ ...base, posDrift: { kind: 'tag', sd: 0.3, tau: 20 } });
    const all = F.flatMap((f) => f.dx);
    const sd = Math.sqrt(all.reduce((s, d) => s + d * d, 0) / all.length);
    expect(sd).toBeGreaterThan(0.2);
    expect(sd).toBeLessThan(0.4);
    // Lag-1 frame correlation of one ant's offset: exp(−0.5 / 20) ≈ 0.975.
    const by = new Map<number, number[]>();
    F.forEach((f) => f.ids.forEach((i, k) => by.set(i, [...(by.get(i) ?? []), f.dx[k]])));
    let num = 0;
    let den = 0;
    for (const v of by.values()) for (let k = 1; k < v.length; k++) { num += v[k] * v[k - 1]; den += v[k - 1] ** 2; }
    expect(num / den).toBeGreaterThan(0.9);
  });

  it("'rest': the offset moves only while the ant rests, and is kept afterwards", () => {
    const { frames: F } = run({ ...base, posDrift: { kind: 'rest', sd: 0.3, tau: 20 } });
    let still = 0;
    let moved = 0;
    for (let t = 1; t < F.length; t++)
      F[t].ids.forEach((i, k) => {
        const j = F[t - 1].ids.indexOf(i);
        if (j < 0 || t - 1 < 0) return;
        const change = Math.hypot(F[t].dx[k] - F[t - 1].dx[j], F[t].dy[k] - F[t - 1].dy[j]);
        if (!F[t].rest[k]) { expect(change).toBeLessThan(1e-9); still++; } else if (change > 0) moved++;
      });
    expect(still).toBeGreaterThan(0);
    expect(moved).toBeGreaterThan(0);
  });
});
