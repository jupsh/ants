import { ACT_MIN_ANTS, ACT_MIN_PER_H, ACT_WINDOW_H, REST_H, REST_W, spearman, type AntHours, type AntRest } from './activity';

/**
 * Per-ant activity vs rest position (pre-registration D076, approved D077): how much of the persistence row (D043)
 * an ant's rest position carries. One code path for recorded tracks and simulated observers; the activity rows
 * themselves are unchanged (`activity.ts`).
 *
 * - Site field E (B018's definition): still-worker occupancy on the 1-mm grid (`restCell`), 5 × 5-mm box sum, over
 *   its mean on the nest rectangle; the focal ant's own still steps left out. Its source is chosen by the caller:
 *   the data's other (dark) phase, or the same colony's other simulated runs.
 * - Rest position R_i: median of E over ant i's observed still steps in the window; NaN below
 *   `REST_MIN_STILL_F` observed still step-frames in the window.
 * - Per window: zFull = D043's persistence on the ants with an R; zPart = the partial Spearman of the two halves'
 *   moving fractions given R (Pearson partial correlation of average ranks); zE = Spearman of R vs the 6-h moving
 *   fraction on the spread-eligible ants with an R. All Fisher z, r clipped at ±0.999, ≥ `ACT_MIN_ANTS` ants.
 */

export const REST_G = REST_W * REST_H;
/** Observed still step-frames an ant needs in the window for a rest position (D076). */
export const REST_MIN_STILL_F = 600;

/** A nest rectangle (mm) on which E is normalised. */
export interface Rect {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}
/** The data's nest rectangle (B018 geometry: pooled ant-centre extent of the 22 fit colonies). */
export const DATA_NEST: Rect = { x0: 0.5, x1: 68.75, y0: 1.25, y1: 42.25 };
/** The model's nest chamber (`stroeymeytApparatus`). */
export const MODEL_NEST: Rect = { x0: 0, x1: 70, y0: 0, y1: 40 };

/** Dense still counts of one ant over the hours accepted by `keep`. */
export function restCounts(a: AntRest, keep: (h: number) => boolean): Float64Array {
  const g = new Float64Array(REST_G);
  for (const [h, cells] of Object.entries(a)) {
    if (!keep(Number(h))) continue;
    for (const [q, n] of Object.entries(cells)) g[Number(q)] += n;
  }
  return g;
}

/** 5 × 5 box sum on the grid (cells outside the grid count as empty). */
export function boxSum(g: ArrayLike<number>): Float64Array {
  const out = new Float64Array(REST_G);
  for (let y = 0; y < REST_H; y++)
    for (let x = 0; x < REST_W; x++) {
      let s = 0;
      for (let dy = -2; dy <= 2; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= REST_H) continue;
        for (let dx = -2; dx <= 2; dx++) {
          const xx = x + dx;
          if (xx >= 0 && xx < REST_W) s += g[yy * REST_W + xx];
        }
      }
      out[y * REST_W + x] = s;
    }
  return out;
}

/** Cells whose centre lies inside the rectangle. */
export function rectCells(r: Rect): number[] {
  const out: number[] = [];
  for (let y = 0; y < REST_H; y++) for (let x = 0; x < REST_W; x++) if (x + 0.5 > r.x0 && x + 0.5 < r.x1 && y + 0.5 > r.y0 && y + 0.5 < r.y1) out.push(y * REST_W + x);
  return out;
}

/**
 * A site-field source: the summed still counts of every contributing ant. `field(own)` gives E with `own` (the
 * focal ant's counts in the same source, or null when the ant is not in it) left out; NaN everywhere if nothing
 * is left.
 */
export class SiteField {
  private readonly tot: Float64Array;
  private readonly cells: number[];
  private readonly totMean: number;
  constructor(total: ArrayLike<number>, rect: Rect) {
    this.tot = boxSum(total);
    this.cells = rectCells(rect);
    this.totMean = this.mean(this.tot);
  }
  private mean(g: ArrayLike<number>): number {
    let s = 0;
    for (const q of this.cells) s += g[q];
    return s / this.cells.length;
  }
  field(own: ArrayLike<number> | null): Float64Array {
    const out = new Float64Array(REST_G);
    const o = own ? boxSum(own) : null;
    const m = this.totMean - (o ? this.mean(o) : 0);
    for (let q = 0; q < REST_G; q++) out[q] = m > 0 ? (this.tot[q] - (o ? o[q] : 0)) / m : NaN;
    return out;
  }
}

/** Sum of dense count grids. */
export function sumCounts(gs: ArrayLike<number>[]): Float64Array {
  const s = new Float64Array(REST_G);
  for (const g of gs) for (let q = 0; q < REST_G; q++) s[q] += g[q];
  return s;
}

/** Median of E over the still steps in `counts` (each step weighted once; mean of the two middle steps when even). */
export function weightedMedian(E: ArrayLike<number>, counts: ArrayLike<number>): number {
  const v: [number, number][] = [];
  let n = 0;
  for (let q = 0; q < REST_G; q++)
    if (counts[q] > 0) {
      v.push([E[q], counts[q]]);
      n += counts[q];
    }
  if (!n || v.some(([e]) => !Number.isFinite(e))) return NaN;
  v.sort((a, b) => a[0] - b[0]);
  const at = (k: number) => {
    let c = 0;
    for (const [e, w] of v) {
      c += w;
      if (k < c) return e;
    }
    return v[v.length - 1][0];
  };
  return n % 2 ? at((n - 1) / 2) : (at(n / 2 - 1) + at(n / 2)) / 2;
}

/** Observed still step-frames of an ant over the hours (stepF − moveF). */
export function stillFrames(a: AntHours, hours: number[]): number {
  let s = 0;
  for (const h of hours) {
    const r = a[h];
    if (r) s += r[3] - r[4];
  }
  return s;
}

/** Rest position of an ant in a window: median E over its still steps there; NaN below `REST_MIN_STILL_F`. */
export function restPosition(a: AntHours, rest: AntRest, hours: number[], E: ArrayLike<number>): number {
  if (stillFrames(a, hours) < REST_MIN_STILL_F) return NaN;
  const set = new Set(hours);
  return weightedMedian(E, restCounts(rest, (h) => set.has(h)));
}

const fisher = (r: number) => (Number.isFinite(r) ? Math.atanh(Math.max(-0.999, Math.min(0.999, r))) : NaN);

/** Partial Spearman of x and y given c: Pearson partial correlation of the average ranks; NaN if undefined. */
export function partialSpearman(x: number[], y: number[], c: number[]): number {
  const rxy = spearman(x, y);
  const rxc = spearman(x, c);
  const ryc = spearman(y, c);
  const d = (1 - rxc * rxc) * (1 - ryc * ryc);
  return Number.isFinite(rxy) && Number.isFinite(rxc) && Number.isFinite(ryc) && d > 0 ? (rxy - rxc * ryc) / Math.sqrt(d) : NaN;
}

export interface RestWindow {
  zFull: number;
  zPart: number;
  /** Persistence-eligible ants with a rest position (weights n − 3 for zFull, n − 4 for zPart). */
  nZ: number;
  /** Persistence-eligible ants without one (dropped from this analysis). */
  nZNoR: number;
  zE: number;
  /** Spread-eligible ants with a rest position (weight n − 3), and without one. */
  nE: number;
  nENoR: number;
}

/** One 6-h window of one group; `R[i]` is ant i's rest position in this window (NaN: none). Eligibility as D043. */
export function restWindow(ants: AntHours[], R: number[], hours: number[]): RestWindow {
  if (hours.length !== ACT_WINDOW_H) throw new Error(`rest window needs ${ACT_WINDOW_H} hours`);
  const h1 = hours.slice(0, ACT_WINDOW_H / 2);
  const h2 = hours.slice(ACT_WINDOW_H / 2);
  const halfMin = (ACT_WINDOW_H / 2) * ACT_MIN_PER_H;
  const x: number[] = [];
  const y: number[] = [];
  const c: number[] = [];
  const f: number[] = [];
  const cf: number[] = [];
  let nZNoR = 0;
  let nENoR = 0;
  ants.forEach((a, i) => {
    let s1 = 0, m1 = 0, s2 = 0, m2 = 0;
    for (const h of h1) if (a[h]) { s1 += a[h][3]; m1 += a[h][4]; }
    for (const h of h2) if (a[h]) { s2 += a[h][3]; m2 += a[h][4]; }
    const has = Number.isFinite(R[i]);
    if (s1 >= halfMin && s2 >= halfMin) {
      if (has) {
        x.push(m1 / s1);
        y.push(m2 / s2);
        c.push(R[i]);
      } else nZNoR++;
    }
    if (s1 + s2 >= ACT_WINDOW_H * ACT_MIN_PER_H) {
      if (has) {
        f.push((m1 + m2) / (s1 + s2));
        cf.push(R[i]);
      } else nENoR++;
    }
  });
  const okZ = x.length >= ACT_MIN_ANTS;
  const okE = f.length >= ACT_MIN_ANTS;
  return {
    zFull: okZ ? fisher(spearman(x, y)) : NaN,
    zPart: okZ ? fisher(partialSpearman(x, y, c)) : NaN,
    nZ: x.length,
    nZNoR,
    zE: okE ? fisher(spearman(cf, f)) : NaN,
    nE: f.length,
    nENoR,
  };
}

export interface RestColony {
  zFull: number;
  zPart: number;
  zE: number;
  /** Valid windows and summed ant counts behind each value. */
  wZ: number;
  wE: number;
  nZ: number;
  nZNoR: number;
  nE: number;
  nENoR: number;
}

/**
 * Colony value over its windows: (n − 3)-weighted zFull and zE, (n − 4)-weighted zPart, over the windows where the
 * value is defined; zFull and zPart only from windows where both are (so S is paired within the colony).
 */
export function restColony(ws: RestWindow[]): RestColony {
  let zf = 0, zp = 0, wf = 0, wp = 0, ze = 0, we = 0, wZ = 0, wE = 0, nZ = 0, nZNoR = 0, nE = 0, nENoR = 0;
  for (const w of ws) {
    nZNoR += w.nZNoR;
    nENoR += w.nENoR;
    if (Number.isFinite(w.zFull) && Number.isFinite(w.zPart)) {
      zf += (w.nZ - 3) * w.zFull;
      wf += w.nZ - 3;
      zp += (w.nZ - 4) * w.zPart;
      wp += w.nZ - 4;
      wZ++;
      nZ += w.nZ;
    }
    if (Number.isFinite(w.zE)) {
      ze += (w.nE - 3) * w.zE;
      we += w.nE - 3;
      wE++;
      nE += w.nE;
    }
  }
  return { zFull: wf > 0 ? zf / wf : NaN, zPart: wp > 0 ? zp / wp : NaN, zE: we > 0 ? ze / we : NaN, wZ, wE, nZ, nZNoR, nE, nENoR };
}

/** S = 1 − mean zPart / mean zFull over the colonies where both are defined (ratio of means). */
export function shareSpatial(cols: { zFull: number; zPart: number }[]): number {
  const ok = cols.filter((c) => Number.isFinite(c.zFull) && Number.isFinite(c.zPart));
  if (!ok.length) return NaN;
  const f = ok.reduce((a, c) => a + c.zFull, 0) / ok.length;
  const p = ok.reduce((a, c) => a + c.zPart, 0) / ok.length;
  return 1 - p / f;
}
