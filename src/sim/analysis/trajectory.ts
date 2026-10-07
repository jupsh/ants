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
  while (start < m && Math.hypot(sx[start] - ox, sy[start] - oy) < o.startRadius) start++;
  let end = start;
  while (end < m && Math.hypot(sx[end] - ox, sy[end] - oy) <= o.endRadius) end++;
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

export function walkStats(tracks: Track[], o: WalkStatsOptions = DEFAULT_WALK_OPTS): WalkStats {
  const lags = [0.2, 0.4, 0.8, 1.2, 2, 3, 5, 8, 12, 20].filter((l) => l <= o.maxLag);
  const pathLags = [2, 5, 10, 20, 30, 50, 80, 120];
  const msdLags = [0.5, 1, 2, 5, 10, 20, 40];
  const radialBins = [20, 40, 60, 80, 100, 120, 140, 160, 180, 200];
  const speeds: number[] = [];
  const turnIncrements: number[] = [];
  const straightness: number[] = [];
  const exitTimes: number[] = [];
  const corrSum = lags.map(() => 0);
  const corrN = lags.map(() => 0);
  const pcSum = pathLags.map(() => 0);
  const pcN = pathLags.map(() => 0);
  const msdSum = msdLags.map(() => 0);
  const msdN = msdLags.map(() => 0);
  const radSum = radialBins.map(() => 0);
  const radN = radialBins.map(() => 0);
  const trackSpeeds: number[] = [];
  let alignSum = 0;
  let alignN = 0;
  let stopped = 0;
  let samples = 0;

  for (const tr of tracks) {
    const n = tr.t.length;
    if (n < 3) continue;
    const dt = (tr.t[n - 1] - tr.t[0]) / (n - 1);
    const k = Math.max(1, Math.round(o.lag / dt));
    // Velocity & heading at each sample from displacement over k samples.
    const m = n - k;
    if (m < 2) continue;
    const hd = new Float64Array(m);
    const sp = new Float64Array(m);
    const mv = new Uint8Array(m);
    const cum = new Float64Array(n); // cumulative path length
    for (let i = 1; i < n; i++) cum[i] = cum[i - 1] + Math.hypot(tr.x[i] - tr.x[i - 1], tr.y[i] - tr.y[i - 1]);
    for (let i = 0; i < m; i++) {
      const dx = tr.x[i + k] - tr.x[i];
      const dy = tr.y[i + k] - tr.y[i];
      const v = Math.hypot(dx, dy) / (k * dt);
      sp[i] = v;
      hd[i] = Math.atan2(dy, dx);
      mv[i] = v >= o.stopSpeed ? 1 : 0;
      samples++;
      if (mv[i]) speeds.push(v);
      else stopped++;
      // radial velocity
      const r = Math.hypot(tr.x[i], tr.y[i]);
      if (r > 1) {
        const vr = (dx * tr.x[i] + dy * tr.y[i]) / r / (k * dt);
        const b = radialBins.findIndex((e) => r < e);
        if (b >= 0) {
          radSum[b] += vr;
          radN[b]++;
        }
      }
    }
    for (let i = 0; i + k < m; i += k) if (mv[i] && mv[i + k]) turnIncrements.push(wrap(hd[i + k] - hd[i]));
    let tsum = 0;
    let tn = 0;
    for (let i = 0; i < m; i++)
      if (mv[i]) {
        tsum += sp[i];
        tn++;
        alignSum -= Math.cos(2 * hd[i]);
        alignN++;
      }
    if (tn > 10) trackSpeeds.push(tsum / tn);
    lags.forEach((l, li) => {
      const s = Math.round(l / dt);
      for (let i = 0; i + s < m; i += Math.max(1, Math.floor(k / 2)))
        if (mv[i] && mv[i + s]) {
          corrSum[li] += Math.cos(hd[i + s] - hd[i]);
          corrN[li]++;
        }
    });
    // Path-length lags.
    pathLags.forEach((L, li) => {
      let jx = 0;
      for (let i = 0; i < m; i += Math.max(1, Math.floor(k / 2))) {
        if (!mv[i]) continue;
        if (jx < i) jx = i;
        while (jx < m && cum[jx] - cum[i] < L) jx++;
        if (jx >= m) break;
        if (!mv[jx]) continue;
        pcSum[li] += Math.cos(hd[jx] - hd[i]);
        pcN[li]++;
      }
    });
    msdLags.forEach((l, li) => {
      const s = Math.round(l / dt);
      for (let i = 0; i + s < n; i += Math.max(1, Math.floor(s / 4))) {
        msdSum[li] += (tr.x[i + s] - tr.x[i]) ** 2 + (tr.y[i + s] - tr.y[i]) ** 2;
        msdN[li]++;
      }
    });
    // Straightness over 50 mm windows of path.
    let a = 0;
    for (let b = 0; b < n; b++) {
      if (cum[b] - cum[a] >= 50) {
        straightness.push(Math.hypot(tr.x[b] - tr.x[a], tr.y[b] - tr.y[a]) / (cum[b] - cum[a]));
        a = b;
      }
    }
    const rEnd = Math.hypot(tr.x[n - 1], tr.y[n - 1]);
    if (rEnd >= o.exitRadius * 0.97) exitTimes.push(tr.t[n - 1] - tr.t[0]);
  }
  return {
    tracks: tracks.length,
    speeds,
    stoppedFraction: samples ? stopped / samples : NaN,
    lags,
    headingCorr: corrSum.map((s, i) => (corrN[i] ? s / corrN[i] : NaN)),
    pathLags,
    headingCorrPath: pcSum.map((s, i) => (pcN[i] ? s / pcN[i] : NaN)),
    turnIncrements,
    msdLags,
    msd: msdSum.map((s, i) => (msdN[i] ? s / msdN[i] : NaN)),
    exitTimes,
    straightness,
    radialBins,
    radialVelocity: radSum.map((s, i) => (radN[i] ? s / radN[i] : NaN)),
    trackSpeeds,
    alignY: alignN ? alignSum / alignN : NaN,
  };
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
