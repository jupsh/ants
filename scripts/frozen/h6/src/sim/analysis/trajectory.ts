import { hypot } from '../core/math';
/**
 * Trajectory statistics. The same functions are applied to recorded ant
 * tracks and to simulated ones, so model–data comparisons are like for like.
 * Units: mm, s, rad.
 */
export interface Track {
  id: string;
  t: Float64Array;
  x: Float64Array;
  y: Float64Array;
  /**
   * How a simulated track ended: left the arena or hit the time limit
   * (censoring audit, STATUS 2026-10-09). Undefined for recorded tracks
   * (every Khuong track ends with an exit).
   */
  end?: 'exit' | 'timeout';
}

export interface TrackPrepOptions {
  /** Resampling interval (s). */
  dt: number;
  /** Moving-average window in samples (tracking-noise suppression). */
  smooth: number;
  /** Discard the start until the ant is this far from its first point (mm). */
  startRadius: number;
  /** Truncate when the ant first leaves this radius around its first point (mm). */
  endRadius: number;
}

export const KHUONG_PREP: TrackPrepOptions = { dt: 0.04, smooth: 3, startRadius: 10, endRadius: 200 };

/** Resample (linear), smooth, and trim a track as in Khuong et al. 2013. */
export function prepareTrack(tr: Track, o: TrackPrepOptions): Track | null {
  const n = tr.t.length;
  if (n < 4) return null;
  const t0 = tr.t[0];
  const t1 = tr.t[n - 1];
  const m = Math.floor((t1 - t0) / o.dt) + 1;
  if (m < 4) return null;
  const rt = new Float64Array(m);
  const rx = new Float64Array(m);
  const ry = new Float64Array(m);
  let j = 0;
  for (let i = 0; i < m; i++) {
    const t = t0 + i * o.dt;
    while (j < n - 2 && tr.t[j + 1] < t) j++;
    const span = tr.t[j + 1] - tr.t[j] || 1;
    const f = Math.min(1, Math.max(0, (t - tr.t[j]) / span));
    rt[i] = t;
    rx[i] = tr.x[j] + (tr.x[j + 1] - tr.x[j]) * f;
    ry[i] = tr.y[j] + (tr.y[j + 1] - tr.y[j]) * f;
  }
  // Centred moving average.
  const w = Math.max(1, o.smooth | 0);
  const h = Math.floor(w / 2);
  const sx = new Float64Array(m);
  const sy = new Float64Array(m);
  for (let i = 0; i < m; i++) {
    let ax = 0;
    let ay = 0;
    let c = 0;
    for (let k = Math.max(0, i - h); k <= Math.min(m - 1, i + h); k++) {
      ax += rx[k];
      ay += ry[k];
      c++;
    }
    sx[i] = ax / c;
    sy[i] = ay / c;
  }
  const ox = sx[0];
  const oy = sy[0];
  let start = 0;
  while (start < m && hypot(sx[start] - ox, sy[start] - oy) < o.startRadius) start++;
  let end = start;
  while (end < m && hypot(sx[end] - ox, sy[end] - oy) <= o.endRadius) end++;
  if (end - start < 4) return null;
  return {
    id: tr.id,
    t: rt.slice(start, end),
    x: sx.slice(start, end).map((v) => v - ox),
    y: sy.slice(start, end).map((v) => v - oy),
  };
}

export interface Summary {
  n: number;
  mean: number;
  sd: number;
  q10: number;
  q50: number;
  q90: number;
}

export function summarize(values: ArrayLike<number>): Summary {
  const a = Array.from(values).filter((v) => Number.isFinite(v)).sort((p, q) => p - q);
  const n = a.length;
  if (!n) return { n: 0, mean: NaN, sd: NaN, q10: NaN, q50: NaN, q90: NaN };
  const mean = a.reduce((s, v) => s + v, 0) / n;
  const sd = Math.sqrt(a.reduce((s, v) => s + (v - mean) ** 2, 0) / Math.max(1, n - 1));
  const q = (p: number) => a[Math.min(n - 1, Math.max(0, Math.round(p * (n - 1))))];
  return { n, mean, sd, q10: q(0.1), q50: q(0.5), q90: q(0.9) };
}

/** Two-sample Kolmogorov–Smirnov statistic D. */
export function ksStatistic(a: ArrayLike<number>, b: ArrayLike<number>): number {
  const x = Array.from(a).sort((p, q) => p - q);
  const y = Array.from(b).sort((p, q) => p - q);
  let i = 0;
  let j = 0;
  let d = 0;
  while (i < x.length && j < y.length) {
    const v = Math.min(x[i], y[j]);
    while (i < x.length && x[i] <= v) i++;
    while (j < y.length && y[j] <= v) j++;
    d = Math.max(d, Math.abs(i / x.length - j / y.length));
  }
  return d;
}

export interface WalkStats {
  tracks: number;
  /** Instantaneous speeds over `lag` while moving (mm/s). */
  speeds: number[];
  /** Fraction of samples with speed below the stop threshold. */
  stoppedFraction: number;
  /** Lags (s) and mean cos of heading change ⟨cos Δθ(τ)⟩ (moving samples only). */
  lags: number[];
  headingCorr: number[];
  /** Same, but lag expressed as path length walked (mm). */
  pathLags: number[];
  headingCorrPath: number[];
  /** Heading increments over the shortest lag (rad). */
  turnIncrements: number[];
  /** Mean squared displacement vs lag. */
  msdLags: number[];
  msd: number[];
  /** Time (s) from start radius to end radius, per track that reached it. */
  exitTimes: number[];
  /** Net/total path ratio over 50 mm path windows. */
  straightness: number[];
  /** Mean radial velocity (mm/s; + = away from start) binned by distance. */
  radialBins: number[];
  radialVelocity: number[];
  /** Per-track mean moving speed (mm/s): between-individual variation. */
  trackSpeeds: number[];
  /** Axial alignment with the y axis, −⟨cos 2θ⟩ over moving samples (0 = isotropic, 1 = all along y). */
  alignY: number;
}

export interface WalkStatsOptions {
  /** Lag used for speed and headings (s). */
  lag: number;
  /** Speed below which the ant is considered stopped (mm/s). */
  stopSpeed: number;
  maxLag: number;
  exitRadius: number;
}

export const DEFAULT_WALK_OPTS: WalkStatsOptions = { lag: 0.2, stopSpeed: 2, maxLag: 20, exitRadius: 200 };

const LAGS = [0.2, 0.4, 0.8, 1.2, 2, 3, 5, 8, 12, 20];
const PATH_LAGS = [2, 5, 10, 20, 30, 50, 80, 120];
const MSD_LAGS = [0.5, 1, 2, 5, 10, 20, 40];
const RADIAL_BINS = [20, 40, 60, 80, 100, 120, 140, 160, 180, 200];

/**
 * Per-track sums and samples behind `WalkStats`. Tracks are the independent
 * units (one ant each), so combining a resampled list of these gives a cheap
 * cluster bootstrap of every statistic.
 */
export interface TrackStats {
  speeds: number[];
  stopped: number;
  samples: number;
  turnIncrements: number[];
  straightness: number[];
  exitTime: number | null;
  trackSpeed: number | null;
  corrSum: number[];
  corrN: number[];
  pcSum: number[];
  pcN: number[];
  msdSum: number[];
  msdN: number[];
  radSum: number[];
  radN: number[];
  alignSum: number;
  alignN: number;
}

/**
 * `full = false` skips the parts that no fit uses (heading correlation by
 * time lag, mean squared displacement), leaving them at zero; everything
 * else is identical.
 */
export function trackStats(tr: Track, o: WalkStatsOptions = DEFAULT_WALK_OPTS, full = true): TrackStats | null {
  const lags = LAGS.filter((l) => l <= o.maxLag);
  const n = tr.t.length;
  if (n < 3) return null;
  const dt = (tr.t[n - 1] - tr.t[0]) / (n - 1);
  const k = Math.max(1, Math.round(o.lag / dt));
  // Velocity & heading at each sample from displacement over k samples.
  const m = n - k;
  if (m < 2) return null;
  const ts: TrackStats = {
    speeds: [],
    stopped: 0,
    samples: 0,
    turnIncrements: [],
    straightness: [],
    exitTime: null,
    trackSpeed: null,
    corrSum: lags.map(() => 0),
    corrN: lags.map(() => 0),
    pcSum: PATH_LAGS.map(() => 0),
    pcN: PATH_LAGS.map(() => 0),
    msdSum: MSD_LAGS.map(() => 0),
    msdN: MSD_LAGS.map(() => 0),
    radSum: RADIAL_BINS.map(() => 0),
    radN: RADIAL_BINS.map(() => 0),
    alignSum: 0,
    alignN: 0,
  };
  const hd = new Float64Array(m);
  const sp = new Float64Array(m);
  const mv = new Uint8Array(m);
  const cum = new Float64Array(n); // cumulative path length
  for (let i = 1; i < n; i++) cum[i] = cum[i - 1] + hypot(tr.x[i] - tr.x[i - 1], tr.y[i] - tr.y[i - 1]);
  for (let i = 0; i < m; i++) {
    const dx = tr.x[i + k] - tr.x[i];
    const dy = tr.y[i + k] - tr.y[i];
    const v = hypot(dx, dy) / (k * dt);
    sp[i] = v;
    hd[i] = Math.atan2(dy, dx);
    mv[i] = v >= o.stopSpeed ? 1 : 0;
    ts.samples++;
    if (mv[i]) ts.speeds.push(v);
    else ts.stopped++;
    // radial velocity
    const r = hypot(tr.x[i], tr.y[i]);
    if (r > 1) {
      const vr = (dx * tr.x[i] + dy * tr.y[i]) / r / (k * dt);
      let b = 0;
      while (b < RADIAL_BINS.length && !(r < RADIAL_BINS[b])) b++;
      if (b < RADIAL_BINS.length) {
        ts.radSum[b] += vr;
        ts.radN[b]++;
      }
    }
  }
  for (let i = 0; i + k < m; i += k) if (mv[i] && mv[i + k]) ts.turnIncrements.push(wrap(hd[i + k] - hd[i]));
  let tsum = 0;
  let tn = 0;
  for (let i = 0; i < m; i++)
    if (mv[i]) {
      tsum += sp[i];
      tn++;
      ts.alignSum -= Math.cos(2 * hd[i]);
      ts.alignN++;
    }
  if (tn > 10) ts.trackSpeed = tsum / tn;
  if (full) lags.forEach((l, li) => {
    const s = Math.round(l / dt);
    for (let i = 0; i + s < m; i += Math.max(1, Math.floor(k / 2)))
      if (mv[i] && mv[i + s]) {
        ts.corrSum[li] += Math.cos(hd[i + s] - hd[i]);
        ts.corrN[li]++;
      }
  });
  // Path-length lags.
  PATH_LAGS.forEach((L, li) => {
    let jx = 0;
    for (let i = 0; i < m; i += Math.max(1, Math.floor(k / 2))) {
      if (!mv[i]) continue;
      if (jx < i) jx = i;
      while (jx < m && cum[jx] - cum[i] < L) jx++;
      if (jx >= m) break;
      if (!mv[jx]) continue;
      ts.pcSum[li] += Math.cos(hd[jx] - hd[i]);
      ts.pcN[li]++;
    }
  });
  if (full) MSD_LAGS.forEach((l, li) => {
    const s = Math.round(l / dt);
    for (let i = 0; i + s < n; i += Math.max(1, Math.floor(s / 4))) {
      ts.msdSum[li] += (tr.x[i + s] - tr.x[i]) ** 2 + (tr.y[i + s] - tr.y[i]) ** 2;
      ts.msdN[li]++;
    }
  });
  // Straightness over 50 mm windows of path.
  let a = 0;
  for (let b = 0; b < n; b++) {
    if (cum[b] - cum[a] >= 50) {
      ts.straightness.push(hypot(tr.x[b] - tr.x[a], tr.y[b] - tr.y[a]) / (cum[b] - cum[a]));
      a = b;
    }
  }
  const rEnd = hypot(tr.x[n - 1], tr.y[n - 1]);
  if (rEnd >= o.exitRadius * 0.97) ts.exitTime = tr.t[n - 1] - tr.t[0];
  return ts;
}

/** Combine per-track statistics (optionally a resample, given by indices). */
export function combineWalkStats(parts: (TrackStats | null)[], o: WalkStatsOptions = DEFAULT_WALK_OPTS, idx?: number[]): WalkStats {
  const lags = LAGS.filter((l) => l <= o.maxLag);
  const sel = idx ? idx.map((i) => parts[i]) : parts;
  const sum = (a: number[], b: number[]) => b.forEach((v, i) => (a[i] += v));
  const corrSum = lags.map(() => 0);
  const corrN = lags.map(() => 0);
  const pcSum = PATH_LAGS.map(() => 0);
  const pcN = PATH_LAGS.map(() => 0);
  const msdSum = MSD_LAGS.map(() => 0);
  const msdN = MSD_LAGS.map(() => 0);
  const radSum = RADIAL_BINS.map(() => 0);
  const radN = RADIAL_BINS.map(() => 0);
  const speeds: number[] = [];
  const turnIncrements: number[] = [];
  const straightness: number[] = [];
  const exitTimes: number[] = [];
  const trackSpeeds: number[] = [];
  let stopped = 0;
  let samples = 0;
  let alignSum = 0;
  let alignN = 0;
  for (const p of sel) {
    if (!p) continue;
    for (const v of p.speeds) speeds.push(v);
    for (const v of p.turnIncrements) turnIncrements.push(v);
    for (const v of p.straightness) straightness.push(v);
    if (p.exitTime !== null) exitTimes.push(p.exitTime);
    if (p.trackSpeed !== null) trackSpeeds.push(p.trackSpeed);
    stopped += p.stopped;
    samples += p.samples;
    alignSum += p.alignSum;
    alignN += p.alignN;
    sum(corrSum, p.corrSum);
    sum(corrN, p.corrN);
    sum(pcSum, p.pcSum);
    sum(pcN, p.pcN);
    sum(msdSum, p.msdSum);
    sum(msdN, p.msdN);
    sum(radSum, p.radSum);
    sum(radN, p.radN);
  }
  return {
    tracks: sel.length,
    speeds,
    stoppedFraction: samples ? stopped / samples : NaN,
    lags,
    headingCorr: corrSum.map((s, i) => (corrN[i] ? s / corrN[i] : NaN)),
    pathLags: PATH_LAGS.slice(),
    headingCorrPath: pcSum.map((s, i) => (pcN[i] ? s / pcN[i] : NaN)),
    turnIncrements,
    msdLags: MSD_LAGS.slice(),
    msd: msdSum.map((s, i) => (msdN[i] ? s / msdN[i] : NaN)),
    exitTimes,
    straightness,
    radialBins: RADIAL_BINS.slice(),
    radialVelocity: radSum.map((s, i) => (radN[i] ? s / radN[i] : NaN)),
    trackSpeeds,
    alignY: alignN ? alignSum / alignN : NaN,
  };
}

export function walkStats(tracks: Track[], o: WalkStatsOptions = DEFAULT_WALK_OPTS): WalkStats {
  return combineWalkStats(tracks.map((t) => trackStats(t, o)), o);
}

function wrap(a: number): number {
  a = (a + Math.PI) % (2 * Math.PI);
  if (a < 0) a += 2 * Math.PI;
  return a - Math.PI;
}

/** Excess kurtosis of a sample (0 for a Gaussian). */
export function excessKurtosis(values: ArrayLike<number>): number {
  const a = Array.from(values);
  const n = a.length;
  const mean = a.reduce((s, v) => s + v, 0) / n;
  let m2 = 0;
  let m4 = 0;
  for (const v of a) {
    const d = v - mean;
    m2 += d * d;
    m4 += d * d * d * d;
  }
  m2 /= n;
  m4 /= n;
  return m4 / (m2 * m2) - 3;
}
