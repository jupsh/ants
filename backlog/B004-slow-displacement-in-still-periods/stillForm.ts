/**
 * B004: the form of the slow displacement in long still periods. One accumulator for recorded tracks (with the
 * tag angle) and for simulated colonies seen through the frozen tracker (no angle).
 *
 * Unit: a bounded still run >= MIN_FRAMES frames: consecutive in-nest detections <= 3 frames apart, every step
 * < 0.6 mm/frame, flanked by a moving step on both sides (the check-B / MSD selection, scratch/diagShort.ts).
 * Statistics are sums, so colonies add up; ratios are formed in the aggregation.
 */
import { RNG } from '../../src/sim/core/rng';

export const LAGS = [1, 2, 3, 5, 10, 20, 30, 45, 60, 90, 120];
export const MIN_FRAMES = 120;
export const BLOCKS = [10, 60];
export const STILL_MM = 0.6;
const HISTLAGS = [1, 10, 60];
export const D_EDGES = Array.from({ length: 49 }, (_, i) => 0.002 * Math.pow(0.6 / 0.002, i / 48)); // 0.002 … 0.6 mm
export const ANG_EDGES = [0, 0.5, 1, 2, 4, 8, 16, 32, 64, 181];
const SHUFFLES = 20;
const CORE = 160; // frames (80 s) from either end of a run: past the decay after the stop and before the next move
/** Block start (frames since the run began) and block end (frames before it ended): lower edges. */
export const T_EDGES = [0, 10, 20, 40, 80, 160, 320, 640, 1280];

const binOf = (edges: number[], v: number): number => {
  let b = 0;
  while (b + 1 < edges.length && v >= edges[b + 1]) b++;
  return b; // 0 = below the first edge … last bin open
};
const wrap = (d: number): number => ((((d + 180) % 360) + 360) % 360) - 180;

interface Run { f: number[]; x: number[]; y: number[]; a: number[]; bounded: boolean }
interface AntSt {
  lastFrame: number; lastX: number; lastY: number; lastA: number; lastIn: boolean; prevMove: boolean; run: Run;
  win: Record<number, number[]>; // per block length: bx, by, th0, th1 (deg) of every block with both angles
  core: Record<number, number[]>; // the same for blocks >= CORE frames from both ends of their run
}
const newRun = (): Run => ({ f: [], x: [], y: [], a: [], bounded: false });
const zeros = (n: number) => new Array(n).fill(0);

export class StillForm {
  readonly thr: number; // 3x the noise of a displacement: 3 * sqrt2 * sigma
  nRuns = 0;
  runFrames = 0;
  runsShort = 0; // bounded still runs of 20 … 119 frames (not analysed; for context)
  readonly msd = Object.fromEntries(LAGS.map((k) => [k, { sum: 0, pairs: 0, runs: 0 }]));
  /** MSD of pairs whose both ends are >= CORE frames from the run's ends (the steady state, past the decay after the stop). */
  readonly msdCore = Object.fromEntries(LAGS.map((k) => [k, { sum: 0, pairs: 0, runs: 0 }]));
  readonly hist = Object.fromEntries(HISTLAGS.map((k) => [k, { n: zeros(D_EDGES.length), sumsq: zeros(D_EDGES.length) }]));
  readonly mom = Object.fromEntries(HISTLAGS.map((k) => [k, { s2: 0, s4: 0, n: 0 }]));
  readonly lag1 = { dot: 0, sq: 0, n: 0 };
  readonly angle1 = { ss: 0, n: 0, hist: zeros(ANG_EDGES.length) };
  readonly blocks = Object.fromEntries(BLOCKS.map((k) => [k, { n: 0, active: 0, sumsq: 0, sumsqActive: 0, cons: 0, prevActive: 0, actAct: 0, cosN: 0, cosSum: 0 }]));
  readonly byStart = Object.fromEntries(BLOCKS.map((k) => [k, { n: zeros(T_EDGES.length), active: zeros(T_EDGES.length), sumsq: zeros(T_EDGES.length) }]));
  readonly byEnd = Object.fromEntries(BLOCKS.map((k) => [k, { n: zeros(T_EDGES.length), active: zeros(T_EDGES.length), sumsq: zeros(T_EDGES.length) }]));
  readonly angBins = Object.fromEntries(BLOCKS.map((k) => [k, { n: zeros(ANG_EDGES.length), sumsq: zeros(ANG_EDGES.length) }]));
  readonly offset: Record<string, { expl: number; tot: number; nullExpl: number[]; nAnts: number; nWin: number; oMag: number[] }> = {};
  private readonly ants: AntSt[];

  constructor(readonly track: boolean[], readonly noiseSd: number, readonly seed = 1) {
    this.thr = 3 * Math.SQRT2 * noiseSd;
    this.ants = track.map(() => ({ lastFrame: -1e9, lastX: 0, lastY: 0, lastA: NaN, lastIn: false, prevMove: false, run: newRun(), win: Object.fromEntries(BLOCKS.map((k) => [k, [] as number[]])), core: Object.fromEntries(BLOCKS.map((k) => [k, [] as number[]])) }));
  }

  frame(f: number, ids: number[], xs: number[], ys: number[], ins: boolean[], angs?: number[]): void {
    for (let j = 0; j < ids.length; j++) {
      const i = ids[j];
      if (!this.track[i]) continue;
      const a = this.ants[i];
      if (f === a.lastFrame) continue;
      const g = f - a.lastFrame;
      const ang = angs ? angs[j] : NaN;
      if (!ins[j] || !a.lastIn || g > 3) {
        a.run = newRun();
        a.prevMove = false;
      } else {
        const d = Math.hypot(xs[j] - a.lastX, ys[j] - a.lastY) / g;
        const r = a.run;
        if (d < STILL_MM) {
          if (!r.f.length) {
            r.bounded = a.prevMove;
            r.f.push(a.lastFrame); r.x.push(a.lastX); r.y.push(a.lastY); r.a.push(a.lastA);
          }
          r.f.push(f); r.x.push(xs[j]); r.y.push(ys[j]); r.a.push(ang);
        } else {
          if (r.f.length && r.bounded) this.close(a, r);
          a.run = newRun();
          a.prevMove = true;
        }
      }
      a.lastFrame = f; a.lastX = xs[j]; a.lastY = ys[j]; a.lastA = ang; a.lastIn = ins[j];
    }
  }

  private close(ant: AntSt, r: Run): void {
    const m = r.f.length;
    const f0 = r.f[0];
    const span = r.f[m - 1] - f0;
    if (span < MIN_FRAMES) {
      if (span >= 20) this.runsShort++;
      return;
    }
    this.nRuns++;
    this.runFrames += span;
    const at = new Int32Array(span + 1).fill(-1);
    for (let j = 0; j < m; j++) at[r.f[j] - f0] = j;
    const coreAny: Record<number, boolean> = {};
    for (const k of LAGS) {
      let any = false;
      for (let j = 0; j < m; j++) {
        const t = r.f[j] - f0 + k;
        if (t > span) break;
        const j2 = at[t];
        if (j2 < 0) continue;
        const dx = r.x[j2] - r.x[j], dy = r.y[j2] - r.y[j];
        const r2 = dx * dx + dy * dy;
        const s = this.msd[k];
        s.sum += r2; s.pairs++; any = true;
        if (r.f[j] - f0 >= CORE && span - t >= CORE) { const c = this.msdCore[k]; c.sum += r2; c.pairs++; if (!coreAny[k]) { coreAny[k] = true; c.runs++; } }
        const h = this.hist[k];
        if (h) {
          const b = binOf(D_EDGES, Math.sqrt(r2));
          h.n[b]++; h.sumsq[b] += r2;
          const mo = this.mom[k];
          mo.s2 += dx * dx + dy * dy; mo.s4 += dx ** 4 + dy ** 4; mo.n += 2;
        }
        if (k === 1) {
          const j3 = at[t + 1] ?? -1;
          if (t + 1 <= span && j3 >= 0) {
            const ex = r.x[j3] - r.x[j2], ey = r.y[j3] - r.y[j2];
            this.lag1.dot += dx * ex + dy * ey; this.lag1.sq += (r2 + ex * ex + ey * ey) / 2; this.lag1.n++;
          }
          const da = Math.abs(wrap(r.a[j2] - r.a[j]));
          if (Number.isFinite(da)) { this.angle1.ss += da * da; this.angle1.n++; this.angle1.hist[binOf(ANG_EDGES, da)]++; }
        }
      }
      if (any) this.msd[k].runs++;
    }
    for (const k of BLOCKS) {
      const B = this.blocks[k];
      let prev: { act: boolean; bx: number; by: number } | null = null;
      for (let s = 0; s + k <= span; s += k) {
        const j = at[s], j2 = at[s + k];
        if (j < 0 || j2 < 0) { prev = null; continue; }
        const bx = r.x[j2] - r.x[j], by = r.y[j2] - r.y[j];
        const r2 = bx * bx + by * by;
        const act = Math.sqrt(r2) > this.thr;
        B.n++; B.sumsq += r2;
        if (act) { B.active++; B.sumsqActive += r2; }
        if (prev) {
          B.cons++;
          if (prev.act) { B.prevActive++; if (act) B.actAct++; }
          if (prev.act && act) {
            const c = (prev.bx * bx + prev.by * by) / Math.sqrt((prev.bx ** 2 + prev.by ** 2) * r2);
            B.cosSum += c; B.cosN++;
          }
        }
        prev = { act, bx, by };
        for (const [T, t] of [[this.byStart[k], s], [this.byEnd[k], span - s - k]] as const) {
          const b = binOf(T_EDGES, t);
          T.n[b]++; T.sumsq[b] += r2; if (act) T.active[b]++;
        }
        const t0 = r.a[j], t1 = r.a[j2];
        if (Number.isFinite(t0) && Number.isFinite(t1)) {
          ant.win[k].push(bx, by, t0, t1);
          if (s >= CORE && span - s - k >= CORE) ant.core[k].push(bx, by, t0, t1);
          const ab = this.angBins[k], b = binOf(ANG_EDGES, Math.abs(wrap(t1 - t0)));
          ab.n[b]++; ab.sumsq[b] += r2;
        }
      }
    }
  }

  /** Per-ant tag-offset model (displacement = (R(φ1) − R(φ0)) o, φ = ±θ) against a within-ant shuffle of the angle pairs. */
  finish(): void {
    for (const k of BLOCKS) {
      for (const [h, which] of [[1, 'win'], [-1, 'win'], [1, 'core'], [-1, 'core']] as const) {
        const key = `${k}:${h > 0 ? '+' : '-'}${which === 'core' ? ':core' : ''}`;
        const o = { expl: 0, tot: 0, nullExpl: zeros(SHUFFLES), nAnts: 0, nWin: 0, oMag: [] as number[] };
        this.offset[key] = o;
        this.ants.forEach((a, i) => {
          const w = a[which][k];
          const n = w.length / 4;
          if (!this.track[i] || n < 30) return;
          o.nAnts++; o.nWin += n;
          const u = new Float64Array(n), v = new Float64Array(n);
          let tot = 0;
          for (let q = 0; q < n; q++) {
            const p0 = (h * w[4 * q + 2] * Math.PI) / 180, p1 = (h * w[4 * q + 3] * Math.PI) / 180;
            u[q] = Math.cos(p1) - Math.cos(p0); v[q] = Math.sin(p1) - Math.sin(p0);
            tot += w[4 * q] ** 2 + w[4 * q + 1] ** 2;
          }
          const expl = (perm: Int32Array | null): number => {
            let W = 0, ax = 0, ay = 0;
            for (let q = 0; q < n; q++) {
              const p = perm ? perm[q] : q;
              const bx = w[4 * q], by = w[4 * q + 1];
              W += u[p] * u[p] + v[p] * v[p];
              ax += u[p] * bx + v[p] * by;
              ay += -v[p] * bx + u[p] * by;
            }
            return W > 0 ? (ax * ax + ay * ay) / W : 0;
          };
          const mag = (): number => {
            let W = 0, ax = 0, ay = 0;
            for (let q = 0; q < n; q++) { W += u[q] * u[q] + v[q] * v[q]; ax += u[q] * w[4 * q] + v[q] * w[4 * q + 1]; ay += -v[q] * w[4 * q] + u[q] * w[4 * q + 1]; }
            return W > 0 ? Math.hypot(ax, ay) / W : 0;
          };
          o.oMag.push(mag());
          o.tot += tot;
          o.expl += expl(null);
          const rng = RNG.stream(this.seed, 0xb004, k, h > 0 ? 1 : 2, i);
          for (let s = 0; s < SHUFFLES; s++) {
            const perm = Int32Array.from({ length: n }, (_, q) => q);
            for (let q = n - 1; q > 0; q--) { const p = Math.floor(rng.next() * (q + 1)); [perm[q], perm[p]] = [perm[p], perm[q]]; }
            o.nullExpl[s] += expl(perm);
          }
        });
      }
    }
  }

  out(): unknown {
    return { thr: this.thr, noiseSd: this.noiseSd, nRuns: this.nRuns, runFrames: this.runFrames, runsShort: this.runsShort, msd: this.msd, msdCore: this.msdCore, hist: this.hist, mom: this.mom, lag1: this.lag1, angle1: this.angle1, blocks: this.blocks, byStart: this.byStart, byEnd: this.byEnd, angBins: this.angBins, offset: this.offset };
  }
}
