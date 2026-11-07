// Scratch (not committed): the S2 audit (T032; design D136, amended D145, D146, D147). One file per process.
// S2 = C(band): Σ dev_i·dev_j / √(Σ dev_i² · Σ dev_j²) over a band's pair-bins, dev = an ant's moving fraction in a
// 1-min bin minus its own block mean (as ydistAgg.ts, pairs in ant-index order, i < j). L = C(< 10) − C(≥ 40).
// Support (D146, D147 item 1): complete 240-bin blocks; the gate uses light-phase blocks (data 06–18 UTC with blocks
// from 02 UTC; simulated files are light-phase runs). `full` (every bin, every phase, as built) is the D122 continuity
// check; `allPhase` (complete blocks, both phases) is the descriptive data profile.
// Nulls, per draw: each ant's series rotated within each complete block by τ = 30 + U{0..180} bins,
// RNG.stream(0x52a0, set, file, draw, ant, block). J rotates deviations, positions and both masks; A rotates
// deviations and the activity mask only, positions and the position mask stay at the true bin (same τ as J).
// Reference classing on matched support: each ant's position pooled over the detections in bins k − 15 … k − 6 of the
// same block (≥ 5 of the 10 bins detected, no wrap); pair-bins where both ants have one, classed by same-bin
// positions (`same`) and by reference positions (`ref`). Block-mean classing (`blockMean`) is descriptive.
//   one file per process: s2AuditFile.ts
import fs from 'node:fs';
import { RNG } from '../../src/sim/core/rng';

export const BLOCK = 240;
export const TAU_MIN = 30;
export const TAU_N = 181; // τ ∈ 30 … 210
export const SEED_NULL = 0x52a0;
export const REF_FROM = 15; // window k − 15 … k − 6
export const REF_LEN = 10;
export const REF_MIN = 5;
export const NB = 5; // bands < 5, 5–10, 10–20, 20–40, ≥ 40 mm
export const NEAR = 5; // pooled < 10
export const FAR = 4;
export const NCLS = 6;
export const KINDS = ['all', 'nurse–nurse', 'forager–nurse', 'forager–forager'];
export const NK = KINDS.length;
export const ACC_LEN = NK * NCLS * 4; // kind × class × [Σ xy, Σ x², Σ y², pair-bins]
export const MIN_PAIRBINS = 100;
const EDGES = [5, 10, 20, 40];
const EDGES2 = EDGES.map((e) => e * e);

export interface Ant { role?: string; mv: number[]; st: number[]; sx: number[]; sy: number[]; np: number[] }
export interface YFile { colony: string; binS: number; b0: number; blockOrigin: number; ants: Ant[] }
export interface Segment { k0: number; len: number; block: number; hour: number }

/** The file's blocks (by the clock of `blockOrigin`), with the UTC hour each starts at (data; simulations: from 0). */
export function segments(f: YFile): Segment[] {
  const len = Math.max(...f.ants.map((a) => a.np.length));
  const out: Segment[] = [];
  for (let k = 0; k < len; k++) {
    const b = Math.floor(((f.b0 + k) * f.binS - f.blockOrigin) / (4 * 3600));
    if (!out.length || out[out.length - 1].block !== b)
      out.push({ k0: k, len: 0, block: b, hour: (((f.blockOrigin / 3600 + 4 * b) % 24) + 24) % 24 });
    out[out.length - 1].len++;
  }
  return out;
}

export const complete = (s: Segment) => s.len === BLOCK;
export const lightHour = (s: Segment) => s.hour >= 6 && s.hour < 18;

/** Per-ant series over the chosen segments, concatenated: dev (NaN where no steps), positions (NaN where undetected). */
export interface Prep {
  segs: Segment[];
  off: number[]; // start of each segment in the concatenated series
  T: number;
  n: number;
  role: Int8Array; // 0 nurse, 1 forager, −1 other
  dev: Float64Array[];
  px: Float64Array[];
  py: Float64Array[];
  sx: Float64Array[];
  sy: Float64Array[];
  np: Float64Array[];
  nDet: number[]; // detected bins (np > 0)
  nAct: number[]; // bins with steps (st > 0)
}

export function prep(f: YFile, segs: Segment[]): Prep {
  const off: number[] = [];
  let T = 0;
  for (const s of segs) { off.push(T); T += s.len; }
  const P: Prep = {
    segs, off, T, n: f.ants.length,
    role: Int8Array.from(f.ants.map((a) => (a.role === 'nurse' ? 0 : a.role === 'forager' ? 1 : -1))),
    dev: [], px: [], py: [], sx: [], sy: [], np: [], nDet: [], nAct: [],
  };
  for (const a of f.ants) {
    const dev = new Float64Array(T).fill(NaN);
    const px = new Float64Array(T).fill(NaN);
    const py = new Float64Array(T).fill(NaN);
    const sx = new Float64Array(T);
    const sy = new Float64Array(T);
    const np = new Float64Array(T);
    let nDet = 0;
    let nAct = 0;
    segs.forEach((s, u) => {
      let sum = 0;
      let cnt = 0;
      for (let q = 0; q < s.len; q++) {
        const k = s.k0 + q;
        if (k < a.st.length && a.st[k] > 0) { sum += a.mv[k] / a.st[k]; cnt++; }
      }
      for (let q = 0; q < s.len; q++) {
        const k = s.k0 + q;
        const t = off[u] + q;
        if (k < a.st.length && a.st[k] > 0) { dev[t] = a.mv[k] / a.st[k] - sum / cnt; nAct++; }
        if (k < a.np.length && a.np[k] > 0) {
          px[t] = a.sx[k] / a.np[k];
          py[t] = a.sy[k] / a.np[k];
          sx[t] = a.sx[k];
          sy[t] = a.sy[k];
          np[t] = a.np[k];
          nDet++;
        }
      }
    });
    P.dev.push(dev); P.px.push(px); P.py.push(py); P.sx.push(sx); P.sy.push(sy); P.np.push(np);
    P.nDet.push(nDet); P.nAct.push(nAct);
  }
  return P;
}

/** Band of a pair at squared distance d2 (the as-built `Math.hypot` decides values within rounding of an edge). */
function band(dx: number, dy: number): number {
  const d2 = dx * dx + dy * dy;
  for (let m = 0; m < 4; m++) {
    if (d2 < EDGES2[m] * (1 - 1e-12)) return m;
    if (d2 <= EDGES2[m] * (1 + 1e-12)) return Math.hypot(dx, dy) < EDGES[m] ? m : m + 1;
  }
  return 4;
}

/**
 * Accumulates every pair-bin where both ants have a finite deviation and a finite classing position. `kinds` false
 * accumulates only 'all' (the synthetic checks).
 */
export function accumulate(P: Prep, dev: Float64Array[], cx: Float64Array[], cy: Float64Array[], kinds = true): Float64Array {
  const acc = new Float64Array(ACC_LEN);
  const n = P.n;
  const ld = new Float64Array(n);
  const lx = new Float64Array(n);
  const ly = new Float64Array(n);
  const lr = new Int8Array(n);
  for (let t = 0; t < P.T; t++) {
    let m = 0;
    for (let i = 0; i < n; i++) {
      const d = dev[i][t];
      const x = cx[i][t];
      if (d === d && x === x) { ld[m] = d; lx[m] = x; ly[m] = cy[i][t]; lr[m] = P.role[i]; m++; }
    }
    for (let p = 0; p < m; p++) {
      const x = ld[p];
      for (let q = p + 1; q < m; q++) {
        const y = ld[q];
        const cls = band(lx[p] - lx[q], ly[p] - ly[q]);
        const xy = x * y;
        const xx = x * x;
        const yy = y * y;
        let o = cls * 4;
        acc[o] += xy; acc[o + 1] += xx; acc[o + 2] += yy; acc[o + 3]++;
        if (cls < 2) { o = NEAR * 4; acc[o] += xy; acc[o + 1] += xx; acc[o + 2] += yy; acc[o + 3]++; }
        if (kinds && lr[p] >= 0 && lr[q] >= 0) {
          const kd = lr[p] + lr[q] + 1; // nurse–nurse 1, forager–nurse 2, forager–forager 3
          o = (kd * NCLS + cls) * 4;
          acc[o] += xy; acc[o + 1] += xx; acc[o + 2] += yy; acc[o + 3]++;
          if (cls < 2) { o = (kd * NCLS + NEAR) * 4; acc[o] += xy; acc[o + 1] += xx; acc[o + 2] += yy; acc[o + 3]++; }
        }
      }
    }
  }
  return acc;
}

export const at = (acc: ArrayLike<number>, kd: number, cls: number, j: number) => acc[(kd * NCLS + cls) * 4 + j];
export function C(acc: ArrayLike<number>, kd: number, cls: number): number {
  const xx = at(acc, kd, cls, 1);
  const yy = at(acc, kd, cls, 2);
  return at(acc, kd, cls, 3) ? at(acc, kd, cls, 0) / Math.sqrt(xx * yy) : NaN;
}
export const L = (acc: ArrayLike<number>, kd = 0) => C(acc, kd, NEAR) - C(acc, kd, FAR);
/** D145 item 5 / D146: every band ≥ 100 pair-bins with finite, positive Σx² and Σy². */
export function estimable(acc: ArrayLike<number>, kd = 0): boolean {
  for (let m = 0; m < NB; m++) {
    const xx = at(acc, kd, m, 1);
    const yy = at(acc, kd, m, 2);
    if (!(at(acc, kd, m, 3) >= MIN_PAIRBINS && xx > 0 && yy > 0 && Number.isFinite(xx) && Number.isFinite(yy))) return false;
  }
  return Number.isFinite(L(acc, kd));
}
export function addInto(a: Float64Array, b: ArrayLike<number>): Float64Array {
  for (let i = 0; i < a.length; i++) a[i] += b[i];
  return a;
}

/** Rotation by τ within each segment: out[t] = src[(t − τ) mod len]. Every segment rotated must be complete. */
export function rotate(P: Prep, src: Float64Array, tau: Int32Array): Float64Array {
  const out = new Float64Array(P.T);
  P.segs.forEach((s, u) => {
    const o = P.off[u];
    const tu = ((tau[u] % s.len) + s.len) % s.len;
    for (let q = 0; q < s.len; q++) out[o + q] = src[o + ((q - tu + s.len) % s.len)];
  });
  return out;
}

/** τ for every ant and segment of one draw (zero for draw −1: the identity check, V4). */
export function taus(P: Prep, setIdx: number, fileKey: number, draw: number): Int32Array[] {
  return Array.from({ length: P.n }, (_, i) =>
    Int32Array.from(P.segs, (s) => (draw < 0 ? 0 : TAU_MIN + RNG.stream(SEED_NULL, setIdx, fileKey, draw, i, s.block).int(TAU_N))));
}

export function nullJ(P: Prep, tau: Int32Array[], kinds = true): Float64Array {
  return accumulate(P, P.dev.map((d, i) => rotate(P, d, tau[i])), P.px.map((x, i) => rotate(P, x, tau[i])), P.py.map((y, i) => rotate(P, y, tau[i])), kinds);
}
export function nullA(P: Prep, tau: Int32Array[], kinds = true): Float64Array {
  return accumulate(P, P.dev.map((d, i) => rotate(P, d, tau[i])), P.px, P.py, kinds);
}

/** Reference positions: detections pooled over bins k − 15 … k − 6 of the same segment, ≥ 5 bins detected. */
export function refPositions(P: Prep): { rx: Float64Array[]; ry: Float64Array[] } {
  const rx: Float64Array[] = [];
  const ry: Float64Array[] = [];
  for (let i = 0; i < P.n; i++) {
    const x = new Float64Array(P.T).fill(NaN);
    const y = new Float64Array(P.T).fill(NaN);
    P.segs.forEach((s, u) => {
      const o = P.off[u];
      for (let q = REF_FROM; q < s.len; q++) {
        let sx = 0;
        let sy = 0;
        let np = 0;
        let bins = 0;
        for (let w = q - REF_FROM; w < q - REF_FROM + REF_LEN; w++) {
          const v = P.np[i][o + w];
          if (v > 0) { sx += P.sx[i][o + w]; sy += P.sy[i][o + w]; np += v; bins++; }
        }
        if (bins >= REF_MIN) { x[o + q] = sx / np; y[o + q] = sy / np; }
      }
    });
    rx.push(x); ry.push(y);
  }
  return { rx, ry };
}

/** Matched support: same-bin and reference classing on the pair-bins where both ants have a reference position. */
export function refClassing(P: Prep, kinds = true): { same: Float64Array; ref: Float64Array } {
  const { rx, ry } = refPositions(P);
  const devM = P.dev.map((d, i) => d.map((v, t) => (rx[i][t] === rx[i][t] ? v : NaN)));
  return { same: accumulate(P, devM, P.px, P.py, kinds), ref: accumulate(P, devM, rx, ry, kinds) };
}

/** Each ant's detection-weighted mean position over each segment (descriptive classing). */
export function blockMeanClassing(P: Prep, kinds = true): Float64Array {
  const bx: Float64Array[] = [];
  const by: Float64Array[] = [];
  for (let i = 0; i < P.n; i++) {
    const x = new Float64Array(P.T).fill(NaN);
    const y = new Float64Array(P.T).fill(NaN);
    P.segs.forEach((s, u) => {
      const o = P.off[u];
      let sx = 0;
      let sy = 0;
      let np = 0;
      for (let q = 0; q < s.len; q++) { sx += P.sx[i][o + q]; sy += P.sy[i][o + q]; np += P.np[i][o + q]; }
      if (np > 0) x.fill(sx / np, o, o + s.len), y.fill(sy / np, o, o + s.len);
    });
    bx.push(x); by.push(y);
  }
  return accumulate(P, P.dev, bx, by, kinds);
}

/** Loads a data file (`logs/ydist/data-c*.json`) or a Part C file (its `ydist`), with its phase. */
export function loadFile(path: string): { file: YFile; sim: boolean; phase?: string } {
  const j = JSON.parse(fs.readFileSync(path, 'utf8'));
  if (j.ydist) return { file: { ...j.ydist, colony: j.colony }, sim: true, phase: j.phase }; // the file's label wins
  return { file: j, sim: false };
}

/** The gate's segments: complete light-phase blocks (simulated files: complete blocks of a light-phase run). */
export function gateSegments(f: YFile, sim: boolean, phase?: string): Segment[] {
  const s = segments(f).filter(complete);
  if (sim) { if (phase !== 'light') throw new Error(`simulated file not light-phase: ${phase}`); return s; }
  return s.filter(lightHour);
}
