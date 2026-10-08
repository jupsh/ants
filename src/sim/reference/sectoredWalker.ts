import { RNG } from '../core/rng';
import type { Track } from '../analysis/trajectory';
import { OBSERVER_KEY } from '../experiments/e1Exploration';

/**
 * Reference models for E1: the non-parametric sectored Boltzmann walkers of
 * Khuong et al. (2013, PLoS ONE 8:e76531, Algorithm 3) and Bonavita et al.
 * (2026, PLoS ONE 21:e0327957), ported from the authors' R scripts
 * `2-K_compute_boltzmann_variables.R` and `5-K_np_simulations.R` (Zenodo
 * doi:10.5281/zenodo.19203503, CC BY 4.0). Segments come from Khuong's
 * segmentation (`data/reference/khuong-segments.json`; the port that wrote
 * it derives from CeCILL code and is kept out of the repository, see
 * NOTICE.md). These are *their* models, used as baselines; they are not part
 * of our ant and do not use the perception boundary.
 *
 * Every interior vertex of a segmented recorded track gives one row: the
 * turn ω at the vertex, and the length l and duration of the segment that
 * leaves it. Rows are pooled by the sector (8 sectors of π/4 centred on 0,
 * π/4, …) of the heading of the segment that *enters* the vertex, measured
 *   - `xy`: from the arena's +x axis (on slopes the sectors are up, down,
 *     horizontal and diagonal, as in Khuong's Algorithm 3);
 *   - `start`: Bonavita's Φu, relative to the direction back to the track's
 *     first point (sector 2, "S", points home).
 * The walker starts at the origin with a uniform heading and repeatedly
 * draws a row from the pool of its current sector until it is more than
 * `dMax` from the origin.
 *
 * `compat: true` reproduces the authors' simulation exactly:
 *   - the walker walks the drawn l on its current heading and then turns by
 *     the drawn ω, although in the data l belongs to the segment *after* ω;
 *   - in the `start` frame, the first step uses the `xy` sector.
 * `compat: false` fixes both: it turns by ω first and then walks l, and uses
 * the `start` sector from the first step (the heading home from the origin is
 * undefined there, so the first step uses the sector of a uniform direction).
 */

export type SectorFrame = 'xy' | 'start';

export interface SectorRow {
  /** Length of the outgoing segment (mm). */
  l: number;
  /** Turn at the vertex (rad). */
  omega: number;
  /** Duration of the outgoing segment (s). */
  dt: number;
}

export interface SectorPools {
  frame: SectorFrame;
  /** Rows per sector, sector k centred on (k − 4)·π/4 (sector 0: W, 2: S, 4: E, 6: N). */
  rows: SectorRow[][];
}

/** Turning angle at P2 from P1→P2 to P2→P3, as the authors' `getAngles` (unnormalised zero vectors give 0). */
export function turnAngle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): number {
  let ux = x2 - x1, uy = y2 - y1;
  let vx = x3 - x2, vy = y3 - y2;
  const nu = Math.sqrt(ux * ux + uy * uy);
  const nv = Math.sqrt(vx * vx + vy * vy);
  if (nu > 0) {
    ux /= nu;
    uy /= nu;
  }
  if (nv > 0) {
    vx /= nv;
    vy /= nv;
  }
  return Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
}

const wrap = (a: number) => ((((a + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;

/**
 * Sector of an angle as R's `findInterval` on (−π, −7π/8, …, 7π/8, π); the
 * last interval [7π/8, π) is merged with the first (both "W"). An angle of
 * exactly π falls outside every interval (NA in R) and gives −1.
 */
export function sectorOf(phi: number): number {
  if (!(phi >= -Math.PI && phi < Math.PI)) return -1;
  const k = Math.floor((phi + Math.PI + Math.PI / 8) / (Math.PI / 4));
  return k === 8 ? 0 : k;
}

/** Heading of B→H relative to the perpendicular of A→B, as `phi_start_real` (Φu frame, A = start). */
function phiStart(ax: number, ay: number, bx: number, by: number, hx: number, hy: number): number {
  const abx = bx - ax, aby = by - ay;
  return turnAngle(bx - aby, by + abx, bx, by, hx, hy);
}

/** Rows of one segmented track (vertex positions in mm, times in s), as `2-K_compute_boltzmann_variables.R`. */
export function trackRows(t: ArrayLike<number>, x: ArrayLike<number>, y: ArrayLike<number>, frame: SectorFrame): { sector: number; row: SectorRow }[] {
  const out: { sector: number; row: SectorRow }[] = [];
  for (let w = 1; w + 1 < x.length; w++) {
    const l = Math.hypot(x[w + 1] - x[w], y[w + 1] - y[w]);
    const dtSeg = t[w + 1] - t[w];
    // R: v = l / dt, then dt = l / v, which is NaN (row dropped) when l = 0.
    if (!(l > 0)) continue;
    const omega = turnAngle(x[w - 1], y[w - 1], x[w], y[w], x[w + 1], y[w + 1]);
    const out_ = frame === 'xy' ? wrap(turnAngle(x[w] - 1, y[w], x[w], y[w], x[w + 1], y[w + 1])) : phiStart(x[0], y[0], x[w], y[w], x[w + 1], y[w + 1]);
    const sector = sectorOf(wrap(out_ - omega));
    if (sector >= 0) out.push({ sector, row: { l, omega, dt: (l / (l / dtSeg)) } });
  }
  return out;
}

/** Pool the rows of several segmented tracks. */
export function buildPools(tracks: { t: ArrayLike<number>; x: ArrayLike<number>; y: ArrayLike<number> }[], frame: SectorFrame): SectorPools {
  const rows: SectorRow[][] = Array.from({ length: 8 }, () => []);
  for (const tr of tracks) for (const { sector, row } of trackRows(tr.t, tr.x, tr.y, frame)) rows[sector].push(row);
  return { frame, rows };
}

export interface SectoredOptions {
  ants: number;
  seed: number;
  /** Index of the first ant (stream RNG.stream(seed, index)), for splitting runs across workers. */
  firstAnt?: number;
  compat?: boolean;
  /** Stop once farther than this from the origin (mm); the authors use 200. */
  dMax?: number;
  /** Recording interval (s). */
  sampleDt?: number;
  /** Tracking observer, as in E1Options (same per-ant observer stream key). */
  tracking?: { sx: number; sy: number };
}

/** Simulate ants and record them every `sampleDt` along their segments. */
export function runSectored(pools: SectorPools, o: SectoredOptions): Track[] {
  const compat = o.compat ?? true;
  const dMax = o.dMax ?? 200;
  const sampleDt = o.sampleDt ?? 0.04;
  const first = o.firstAnt ?? 0;
  const tracks: Track[] = [];
  for (let a = first; a < first + o.ants; a++) {
    const rng = RNG.stream(o.seed, a);
    let x = 0, y = 0, time = 0;
    let h = rng.range(-Math.PI, Math.PI);
    const vt = [0], vx = [0], vy = [0];
    let step = 0;
    while (Math.hypot(x, y) <= dMax) {
      let sector: number;
      if (pools.frame === 'start' && (compat ? time !== 0 : step > 0)) sector = sectorOf(phiStart(0, 0, x, y, x + Math.cos(h), y + Math.sin(h)));
      else sector = sectorOf(compat ? h : pools.frame === 'start' ? rng.range(-Math.PI, Math.PI) : h);
      const pool = pools.rows[sector];
      const r = pool[rng.int(pool.length)];
      if (!compat) h = wrap(h + r.omega);
      x += r.l * Math.cos(h);
      y += r.l * Math.sin(h);
      time += r.dt;
      if (compat) h = wrap(h + r.omega);
      vt.push(time);
      vx.push(x);
      vy.push(y);
      step++;
    }
    // Sample at k·sampleDt along the piecewise-linear, constant-speed path.
    const t: number[] = [], xs: number[] = [], ys: number[] = [];
    let seg = 0;
    for (let k = 0; k * sampleDt <= time + 1e-9; k++) {
      const s = k * sampleDt;
      while (seg + 2 < vt.length && vt[seg + 1] < s) seg++;
      const f = vt[seg + 1] > vt[seg] ? Math.min(1, (s - vt[seg]) / (vt[seg + 1] - vt[seg])) : 1;
      t.push(s);
      xs.push(vx[seg] + f * (vx[seg + 1] - vx[seg]));
      ys.push(vy[seg] + f * (vy[seg + 1] - vy[seg]));
    }
    if (o.tracking) {
      const obs = RNG.stream(o.seed, a, OBSERVER_KEY);
      for (let i = 0; i < xs.length; i++) {
        xs[i] += obs.normal(0, o.tracking.sx);
        ys[i] += obs.normal(0, o.tracking.sy);
      }
    }
    tracks.push({ id: `ref-${a}`, t: Float64Array.from(t), x: Float64Array.from(xs), y: Float64Array.from(ys) });
  }
  return tracks;
}
