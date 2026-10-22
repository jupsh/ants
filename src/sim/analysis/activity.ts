import { DET_TSB_EDGES, ObservedState } from './detection';
import { GROUPS, type Group } from './inNest';

/**
 * Per-ant activity by hour and the four activity rows of candidate C2
 * (STATUS 2026-10-18 ≈ 01:46, definitions fixed before any recomputation;
 * promoted from `scripts/scratch/activityStats.ts`, unchanged definitions).
 * One code path for recorded tracks and simulated observers.
 *
 * Observed history only (`ObservedState`: still = step < 0.6 mm per frame,
 * gaps ≤ 3 frames bridged, a gap ≥ 4 is a break). Per ant and hour key, five
 * counts:
 *   det    in-nest detections
 *   known  detections whose observed class has a known still age (classes 0–3)
 *   near   detections moving or in a still run < 60 s begun at an observed moving step (classes 0–1)
 *   stepF  frames covered by in-nest steps (consecutive in-nest detections ≤ 3 frames apart)
 *   moveF  frames of those steps that are moving (≥ 0.6 mm per frame)
 */
export class ActivityStats {
  readonly ants: Map<number, number[]>[];
  /** With `recordRest`: per ant and hour key, observed still in-nest steps per 1-mm cell (`restCell`; D076). */
  readonly rest: Map<number, Map<number, number>>[] | null;
  private readonly obs: ObservedState[];
  private readonly prevIn: boolean[];
  constructor(
    readonly tracked: boolean[],
    readonly hourOf: (t: number) => number,
    recordRest = false,
  ) {
    this.ants = tracked.map(() => new Map());
    this.rest = recordRest ? tracked.map(() => new Map()) : null;
    this.obs = tracked.map(() => new ObservedState());
    this.prevIn = tracked.map(() => false);
  }
  frame(frame: number, t: number, ids: number[], xs: number[], ys: number[], ins: boolean[]): void {
    const NT = DET_TSB_EDGES.length;
    for (let k = 0; k < ids.length; k++) {
      const i = ids[k];
      if (!this.tracked[i]) continue;
      const o = this.obs[i];
      if (frame === o.lastFrame) continue;
      if (!ins[k]) {
        o.lastFrame = frame;
        o.x = xs[k];
        o.y = ys[k];
        this.prevIn[i] = false;
        continue;
      }
      const g = o.lastFrame >= 0 ? frame - o.lastFrame : Infinity;
      const stepIn = this.prevIn[i] && g <= 3;
      o.update(frame, xs[k], ys[k]);
      this.prevIn[i] = true;
      const h = this.hourOf(t);
      let r = this.ants[i].get(h);
      if (!r) this.ants[i].set(h, (r = [0, 0, 0, 0, 0]));
      const cls = Math.floor(o.cell() / NT);
      r[0]++;
      if (cls <= 3) r[1]++;
      if (cls <= 1) r[2]++;
      if (stepIn) {
        r[3] += g;
        if (o.state === 0) r[4] += g;
        else if (this.rest) {
          let m = this.rest[i].get(h);
          if (!m) this.rest[i].set(h, (m = new Map()));
          const q = restCell(xs[k], ys[k]);
          m.set(q, (m.get(q) ?? 0) + 1);
        }
      }
    }
  }
  /** Tracked ants only, as { hourKey: [det, known, near, stepF, moveF] }. */
  out(): Record<number, number[]>[] {
    return this.ants.filter((_, i) => this.tracked[i]).map((m) => Object.fromEntries(m));
  }
  /** With `recordRest`: tracked ants only (same order as `out()`), as { hourKey: { cell: still steps } }. */
  restOut(): AntRest[] {
    if (!this.rest) throw new Error('ActivityStats: constructed without recordRest');
    return this.rest.filter((_, i) => this.tracked[i]).map((m) => Object.fromEntries([...m].map(([h, c]) => [h, Object.fromEntries(c)])));
  }
}

/** Rest-position grid (D076, B018's): 1-mm cells over x 0–72, y 0–48 mm, positions clamped to the grid. */
export const REST_W = 72;
export const REST_H = 48;
export const restCell = (x: number, y: number): number =>
  Math.max(0, Math.min(REST_H - 1, Math.floor(y))) * REST_W + Math.max(0, Math.min(REST_W - 1, Math.floor(x)));

/** Per-ant still cells by hour ({ hourKey: { cell: observed still in-nest steps } }), as `ActivityStats.restOut()`. */
export type AntRest = Record<number, Record<number, number>>;

/** Per-ant hourly records ({ hourKey: [det, known, near, stepF, moveF] }), as `ActivityStats.out()`. */
export type AntHours = Record<number, number[]>;

/** Step-frames per hour an ant needs to enter (the persistence diagnostic's 1800, 2026-10-15). */
export const ACT_MIN_PER_H = 1800;
/** Eligible ants a window needs. */
export const ACT_MIN_ANTS = 8;
/** Window length and half length (h). */
export const ACT_WINDOW_H = 6;

const steps = (a: AntHours, hours: number[]): [number, number] => {
  let s = 0;
  let m = 0;
  for (const h of hours) {
    const r = a[h];
    if (r) {
      s += r[3];
      m += r[4];
    }
  }
  return [s, m];
};

/** Average ranks (ties share the mean of their positions). */
function ranks(v: number[]): number[] {
  const o = v.map((_, i) => i).sort((a, b) => v[a] - v[b]);
  const r = new Array<number>(v.length);
  for (let i = 0; i < o.length; ) {
    let j = i;
    while (j + 1 < o.length && v[o[j + 1]] === v[o[i]]) j++;
    for (let k = i; k <= j; k++) r[o[k]] = (i + j) / 2;
    i = j + 1;
  }
  return r;
}

/** Spearman correlation with average ranks; NaN if either side has no rank variance. */
export function spearman(x: number[], y: number[]): number {
  const rx = ranks(x);
  const ry = ranks(y);
  const n = x.length;
  const mx = rx.reduce((a, b) => a + b, 0) / n;
  const my = ry.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (rx[i] - mx) * (ry[i] - my);
    sxx += (rx[i] - mx) ** 2;
    syy += (ry[i] - my) ** 2;
  }
  return sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : NaN;
}

/**
 * One 6-h window (6 consecutive hour keys) of one group: persistence (Fisher
 * z of the Spearman correlation across ants of the moving fraction, first vs
 * second 3 h; ants with ≥ 3 × 1800 step-frames in each half) and spread (share
 * of the summed per-ant moving fraction carried by the top max(1, round(0.2
 * n)) ants; ants with ≥ 6 × 1800 step-frames). NaN where fewer than 8 ants
 * are eligible or the statistic is undefined.
 */
export function activityWindow(ants: AntHours[], hours: number[]): { z: number; nZ: number; top20: number; nTop: number } {
  if (hours.length !== ACT_WINDOW_H) throw new Error(`activity window needs ${ACT_WINDOW_H} hours`);
  const h1 = hours.slice(0, ACT_WINDOW_H / 2);
  const h2 = hours.slice(ACT_WINDOW_H / 2);
  const halfMin = (ACT_WINDOW_H / 2) * ACT_MIN_PER_H;
  const x: number[] = [];
  const y: number[] = [];
  const f: number[] = [];
  for (const a of ants) {
    const [s1, m1] = steps(a, h1);
    const [s2, m2] = steps(a, h2);
    if (s1 >= halfMin && s2 >= halfMin) {
      x.push(m1 / s1);
      y.push(m2 / s2);
    }
    if (s1 + s2 >= ACT_WINDOW_H * ACT_MIN_PER_H) f.push((m1 + m2) / (s1 + s2));
  }
  let z = NaN;
  if (x.length >= ACT_MIN_ANTS) {
    const r = spearman(x, y);
    if (Number.isFinite(r)) z = Math.atanh(Math.max(-0.999, Math.min(0.999, r)));
  }
  let top20 = NaN;
  if (f.length >= ACT_MIN_ANTS) {
    const tot = f.reduce((a, b) => a + b, 0);
    const k = Math.max(1, Math.round(0.2 * f.length));
    if (tot > 0) top20 = [...f].sort((a, b) => b - a).slice(0, k).reduce((a, b) => a + b, 0) / tot;
  }
  return { z, nZ: x.length, top20, nTop: f.length };
}

/**
 * The colony's activity rows over its windows (each a list of 6 hour keys):
 * `persist.<group>.light` = the (n − 3)-weighted mean Fisher z over valid
 * windows, `top20.<group>.light` = the mean spread over valid windows (NaN:
 * no valid window), with the eligible-ant counts beside (`…n`).
 */
export function activityRows(byGroup: Record<Group, AntHours[]>, windows: number[][]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const g of GROUPS) {
    let zw = 0;
    let w = 0;
    let ts = 0;
    let tn = 0;
    let nZ = 0;
    let nT = 0;
    for (const hours of windows) {
      const r = activityWindow(byGroup[g], hours);
      if (Number.isFinite(r.z)) {
        zw += (r.nZ - 3) * r.z;
        w += r.nZ - 3;
        nZ += r.nZ;
      }
      if (Number.isFinite(r.top20)) {
        ts += r.top20;
        tn++;
        nT += r.nTop;
      }
    }
    out[`persist.${g}.light`] = w > 0 ? zw / w : NaN;
    out[`top20.${g}.light`] = tn > 0 ? ts / tn : NaN;
    out[`persist.${g}.n`] = nZ;
    out[`top20.${g}.n`] = nT;
  }
  return out;
}

/**
 * Data windows (STATUS 2026-10-18 ≈ 01:46): the colony's longest contiguous
 * run of light hours (UTC hour keys since the epoch, light 06–18), split
 * from its start into consecutive complete 6-h windows.
 */
export function lightWindows(hourKeys: number[], isLight: (utcHour: number) => boolean): number[][] {
  const hs = [...new Set(hourKeys)].filter((h) => isLight(((h % 24) + 24) % 24)).sort((a, b) => a - b);
  let best: number[] = [];
  let cur: number[] = [];
  for (const h of hs) {
    if (cur.length && h !== cur[cur.length - 1] + 1) cur = [];
    cur.push(h);
    if (cur.length > best.length) best = [...cur];
  }
  const out: number[][] = [];
  for (let i = 0; i + ACT_WINDOW_H <= best.length; i += ACT_WINDOW_H) out.push(best.slice(i, i + ACT_WINDOW_H));
  return out;
}
