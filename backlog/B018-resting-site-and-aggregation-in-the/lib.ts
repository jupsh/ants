/**
 * B018 shared reading of the Stroeymeyt 2018 fit colonies (main experiment, PreTreatment). Wraps `streamColony`
 * (frame order restored with a window of 8; tags of `roles()`: nurses and foragers alive or lost_tag, the queen) and
 * applies the in-nest accumulator's repeated-read rule (`STROEYMEYT_CFG.dupTolMm`): reads of one tag in one frame
 * within 0.12 mm of its first read are one detection, otherwise all of that tag's reads in the frame are dropped.
 * A lost_tag ant simply stops being detected after its last read.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { STROEYMEYT_CFG } from '../../src/sim/analysis/inNest';
import { RNG } from '../../src/sim/core/rng';
import { colonies, roles, streamColony, type ColonyInfo } from '../../scripts/stroeymeytTracks';

export const ITEM = path.dirname(fileURLToPath(import.meta.url));
export const FRAME_DT = STROEYMEYT_CFG.frameDt;
export const STILL_MM = STROEYMEYT_CFG.stillMm[0];
export const BRIDGE = STROEYMEYT_CFG.bridge;
export const NURSE = 0;
export const FORAGER = 1;
export const QUEEN = 2;

export interface Colony {
  info: ColonyInfo;
  /** Per ant index: NURSE, FORAGER or QUEEN. */
  role: number[];
  tags: number[];
}

export function colony(i: number): Colony {
  const info = colonies()[i];
  const roleOf = roles(info);
  const tags = [...roleOf.keys()];
  const role = tags.map((t) => (roleOf.get(t) === 'nurse' ? NURSE : roleOf.get(t) === 'forager' ? FORAGER : QUEEN));
  return { info, role, tags };
}

export function isLight(t: number): boolean {
  const h = (((t / 3600) % 24) + 24) % 24;
  return h >= STROEYMEYT_CFG.lightStartH && h < STROEYMEYT_CFG.lightEndH;
}

/** Streams the colony with repeated reads resolved; `onFrame` gets one detection per ant at most (arrays reused). */
export async function stream(
  c: Colony,
  onFrame: (frame: number, t: number, ids: number[], xs: number[], ys: number[], ins: boolean[]) => void,
) {
  const index = new Map(c.tags.map((t, i) => [t, i]));
  const first = new Int32Array(c.tags.length).fill(-1);
  const bad = new Uint8Array(c.tags.length);
  const I: number[] = [];
  const X: number[] = [];
  const Y: number[] = [];
  const N: boolean[] = [];
  const dup = { merged: 0, dropped: 0 };
  const tol = STROEYMEYT_CFG.dupTolMm;
  const s = await streamColony(c.info, index, (frame, t, ids, xs, ys, ins) => {
    for (let j = 0; j < ids.length; j++) {
      const k = first[ids[j]];
      if (k < 0) first[ids[j]] = j;
      else {
        dup.merged++;
        if (Math.hypot(xs[j] - xs[k], ys[j] - ys[k]) > tol) bad[ids[j]] = 1;
      }
    }
    I.length = X.length = Y.length = N.length = 0;
    for (let j = 0; j < ids.length; j++) {
      const i = ids[j];
      if (first[i] !== j) continue;
      if (bad[i]) {
        dup.dropped++;
        continue;
      }
      I.push(i);
      X.push(xs[j]);
      Y.push(ys[j]);
      N.push(ins[j]);
    }
    for (let j = 0; j < ids.length; j++) {
      first[ids[j]] = -1;
      bad[ids[j]] = 0;
    }
    onFrame(frame, t, I, X, Y, N);
  });
  return { ...s, dup };
}

/** Percentile (0–1) of a sorted copy. */
export function quantile(v: ArrayLike<number>, p: number): number {
  const s = Float64Array.from(v).sort();
  if (!s.length) return NaN;
  const k = (s.length - 1) * p;
  const a = Math.floor(k);
  return s[a] + (s[Math.min(a + 1, s.length - 1)] - s[a]) * (k - a);
}

/** Nest frame from the pooled ant-centre extent (Progress, geometry): edges (mm), entrance centre. */
export const NEST = { x0: 0.5, x1: 68.75, y0: 1.25, y1: 42.25 };
export const ENTRANCE = { x: 35.5, y: 42.25 };
export const WALL_MM = 3;
export function wallDist(x: number, y: number): number {
  return Math.min(x - NEST.x0, NEST.x1 - x, y - NEST.y0, NEST.y1 - y);
}

/** Colony bootstrap (2000) of a statistic of per-colony values (default: mean); seeded, so reruns agree. */
export function boot<T>(per: T[], stat: (s: T[]) => number, B = 2000, seed = 18): { est: number; lo: number; hi: number; n: number } {
  const rng = new RNG(seed);
  const est = stat(per);
  const v: number[] = [];
  for (let b = 0; b < B; b++) {
    const s = per.map(() => per[rng.int(per.length)]);
    const x = stat(s);
    if (Number.isFinite(x)) v.push(x);
  }
  v.sort((a, b) => a - b);
  return { est, lo: v[Math.floor(0.025 * v.length)], hi: v[Math.floor(0.975 * v.length)], n: per.length };
}
export const mean = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
export const median = (v: number[]) => quantile(v, 0.5);
