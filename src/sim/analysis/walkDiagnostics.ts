import { bootstrapSE, olsFit } from './compare';
import type { Track } from './trajectory';

/**
 * Diagnostics behind the E1 structure revisit (docs/research/slope-walking.md,
 * step 5 in docs/STATUS.md). They reproduce the research note's Python
 * checks (docs/research/scripts/khuong-slope/) in the TS pipeline and, like
 * the other trajectory statistics, are applied identically to recorded and
 * simulated tracks.
 *
 * Every statistic is accumulated per track and then combined, so a list of
 * resampled tracks gives a cluster bootstrap (ants are the units).
 *
 * Input conventions: `prepared` tracks come from `prepareTrack` (25 Hz,
 * smoothed, trimmed, origin at the release point); `raw` tracks are the
 * recorded or observed positions before preparation (tracking noise).
 * Units: mm, s, rad.
 */

/** Speed bins (mm/s) of the speed-binned persistence and turn statistics. */
export const SPEED_BINS: [number, number][] = [
  [2, 8],
  [8, 15],
  [15, 25],
  [25, 40],
  [40, 80],
];
/** Displacement-length bins (mm) of the axial alignment statistic. */
export const DISP_BINS: [number, number][] = [
  [0.4, 1],
  [1, 2],
  [2, 4],
  [4, 8],
  [8, 16],
  [16, 40],
];
/** Distance-from-release bins (mm) of the radial velocity. */
export const RADIAL_BINS: [number, number][] = [
  [10, 40],
  [40, 70],
  [70, 100],
  [100, 150],
  [150, 200],
];

/** |turn| histogram resolution (rad) and the threshold of a "big" turn (rad). */
const TURN_BIN = 0.005;
const TURN_NBIN = Math.ceil(Math.PI / TURN_BIN) + 1;
export const BIG_TURN = 0.5;

/** Stop-episode duration bins (s) for the heading change across stops. */
export const STOP_BINS: [number, number][] = [
  [0, 0.4],
  [0.4, 1.2],
  [1.2, 4],
  [4, Infinity],
];

export interface DiagOptions {
  /** Sampling interval of the prepared tracks (s). */
  dt: number;
  /** Lag for speed and heading (s). */
  lag: number;
  /** Below this speed the ant is stopped (mm/s). */
  stopSpeed: number;
  /** Arc-length resampling step (mm); chords are `chord` steps long. */
  arcStep: number;
  chord: number;
  /** Heading-correlation lags in resampled steps (5 mm, 50 mm). */
  shortLag: number;
  longLag: number;
  /** Radius beyond which an ant has "left" for the return statistic (mm). */
  returnRadius: number;
  /** Downhill heading in track coordinates (rad); Khuong data and E1 sims: −y. */
  downhill: number;
  /** Turns per 5 mm below this (rad) count as "small" in the steering-drift statistic. */
  smallTurn: number;
}

export const DIAG_OPTS: DiagOptions = { dt: 0.04, lag: 0.2, stopSpeed: 2, arcStep: 0.5, chord: 5, shortLag: 10, longLag: 100, returnRadius: 100, downhill: -Math.PI / 2, smallTurn: 0.3 };

/** Per-track sums. Moment arrays hold [n, Σx, Σx², Σx³, Σx⁴]. */
export interface DiagTrack {
  /** Recording session (colony + date for the Khuong data; one session for simulations). */
  session: string;
  binN: number[];
  cosShort: number[];
  cosLong: number[];
  turn: number[][];
  /** Per speed bin: histogram of |turn| (TURN_BIN rad bins, sparse: occupied bins and counts) and count of turns above BIG_TURN. */
  turnHist: { idx: Uint16Array; cnt: Float64Array }[];
  bigTurn: number[];
  /** ⟨cos⟩ of chord headings 10 mm apart along the moving path, all speeds (sum, n). */
  cos10Sum: number;
  cos10N: number;
  /** Per stop-duration bin: Σ cos(heading after − heading before), n. */
  stopCos: number[];
  stopN: number[];
  /**
   * Steering drift relative to the slope: over 5 mm of path, Σ Δh·sin 2φ,
   * Σ Δh·sin φ and n, separately for small turns (|Δh| < smallTurn) and
   * large ones, where φ is the heading relative to downhill. A continuous
   * axial torque gives a negative sin 2φ term in small turns; an event-based
   * pull shows up only in large ones; a downhill (polar) bias gives a
   * negative sin φ term.
   */
  driftSmall: number[];
  driftLarge: number[];
  /** Log of the track's median moving speed (null if ≤ 10 moving samples). */
  logMedian: number | null;
  /** Σ (log v − log median)² and count over the track's moving samples. */
  logResidSq: number;
  logResidN: number;
  /** Per displacement bin: Σ −cos 2h, Σ −sin 2h, n. */
  align: number[][];
  /** y of the last prepared point (+y = uphill), or null. */
  finalY: number | null;
  radSum: number[];
  radN: number[];
  /** Samples after first passing `returnRadius`, and how many of them are back inside. */
  afterOut: number;
  backIn: number;
}

/** Linearly interpolated quantile (as numpy's default). */
function quantile(sorted: ArrayLike<number>, p: number): number {
  const n = sorted.length;
  if (!n) return NaN;
  const k = (n - 1) * p;
  const f = Math.floor(k);
  const c = Math.min(f + 1, n - 1);
  return sorted[f] + (sorted[c] - sorted[f]) * (k - f);
}

const wrap = (a: number) => {
  a = (a + Math.PI) % (2 * Math.PI);
  if (a < 0) a += 2 * Math.PI;
  return a - Math.PI;
};

function addMoments(m: number[], x: number): void {
  const x2 = x * x;
  m[0]++;
  m[1] += x;
  m[2] += x2;
  m[3] += x2 * x;
  m[4] += x2 * x2;
}

/**
 * Diagnostics of one prepared track. `full = false` skips the parts that no
 * fit uses (alignment by displacement, steering drift, radial velocity and
 * returns), leaving them at zero; everything else is identical.
 */
export function diagTrack(tr: Track, o: DiagOptions = DIAG_OPTS, full = true): DiagTrack | null {
  const { x, y } = tr;
  const n = x.length;
  const nb = SPEED_BINS.length;
  const d: DiagTrack = {
    session: tr.id.includes('-') ? tr.id.slice(0, tr.id.lastIndexOf('-')) : tr.id,
    binN: new Array(nb).fill(0),
    cosShort: new Array(nb).fill(0),
    cosLong: new Array(nb).fill(0),
    turn: SPEED_BINS.map(() => [0, 0, 0, 0, 0]),
    turnHist: SPEED_BINS.map(() => ({ idx: new Uint16Array(0), cnt: new Float64Array(0) })),
    bigTurn: new Array(nb).fill(0),
    cos10Sum: 0,
    cos10N: 0,
    stopCos: new Array(STOP_BINS.length).fill(0),
    stopN: new Array(STOP_BINS.length).fill(0),
    driftSmall: [0, 0, 0],
    driftLarge: [0, 0, 0],
    logMedian: null,
    logResidSq: 0,
    logResidN: 0,
    align: DISP_BINS.map(() => [0, 0, 0]),
    finalY: n ? y[n - 1] : null,
    radSum: new Array(RADIAL_BINS.length).fill(0),
    radN: new Array(RADIAL_BINS.length).fill(0),
    afterOut: 0,
    backIn: 0,
  };
  if (n < 10) return d;
  const k = Math.max(1, Math.round(o.lag / o.dt));
  // Speed at every sample over the next k samples (truncated at the end).
  const sp = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const j = Math.min(i + k, n - 1);
    sp[i] = Math.hypot(x[j] - x[i], y[j] - y[i]) / o.lag;
  }

  // Log-speed decomposition (moving samples with a full window).
  const moving: number[] = [];
  for (let i = 0; i + k < n; i++) if (sp[i] >= o.stopSpeed) moving.push(sp[i]);
  if (moving.length > 10) {
    const lm = Math.log(quantile(Float64Array.from(moving).sort(), 0.5));
    d.logMedian = lm;
    for (const v of moving) d.logResidSq += (Math.log(v) - lm) ** 2;
    d.logResidN = moving.length;
  }

  // Axial alignment by displacement length, over several sample windows.
  if (full) for (const w of [2, 5, 10, 20, 40]) {
    for (let i = 0; i + w < n; i++) {
      const dx = x[i + w] - x[i];
      const dy = y[i + w] - y[i];
      const len = Math.hypot(dx, dy);
      if (len / (w * o.dt) < o.stopSpeed) continue;
      const b = DISP_BINS.findIndex(([lo, hi]) => len >= lo && len < hi);
      if (b < 0) continue;
      const h = Math.atan2(dy, dx);
      d.align[b][0] -= Math.cos(2 * h);
      d.align[b][1] -= Math.sin(2 * h);
      d.align[b][2]++;
    }
  }

  // Arc-length resampling of the moving part of the path; each point carries
  // the speed of the sample it was created in. Stopped samples are skipped.
  const px = [x[0]];
  const py = [y[0]];
  const pv = [sp[0]];
  let acc = 0;
  for (let i = 1; i < n; i++) {
    if (sp[i] < o.stopSpeed) continue;
    const seg = Math.hypot(x[i] - x[i - 1], y[i] - y[i - 1]);
    acc += seg;
    while (acc >= o.arcStep) {
      const f = seg > 0 ? 1 - (acc - o.arcStep) / seg : 1;
      px.push(x[i - 1] + (x[i] - x[i - 1]) * f);
      py.push(y[i - 1] + (y[i] - y[i - 1]) * f);
      pv.push(sp[i]);
      acc -= o.arcStep;
    }
  }
  const m = px.length;
  const H = new Float64Array(Math.max(0, m - o.chord));
  for (let j = 0; j + o.chord < m; j++) H[j] = Math.atan2(py[j + o.chord] - py[j], px[j + o.chord] - px[j]);
  const hist = SPEED_BINS.map(() => new Float64Array(TURN_NBIN));
  const lag10 = 2 * o.shortLag;
  for (let j = 0; j + lag10 < H.length; j += 2) {
    d.cos10Sum += Math.cos(H[j + lag10] - H[j]);
    d.cos10N++;
  }
  if (full) for (let j = 0; j + o.shortLag < H.length; j += 2) {
    const dh = wrap(H[j + o.shortLag] - H[j]);
    const phi = H[j] - o.downhill;
    const acc3 = Math.abs(dh) < o.smallTurn ? d.driftSmall : d.driftLarge;
    acc3[0] += dh * Math.sin(2 * phi);
    acc3[1] += dh * Math.sin(phi);
    acc3[2]++;
  }
  for (let j = 0; j < H.length - o.longLag; j += 2) {
    const b = SPEED_BINS.findIndex(([lo, hi]) => pv[j] >= lo && pv[j] < hi);
    if (b < 0) continue;
    d.binN[b]++;
    d.cosShort[b] += Math.cos(H[j + o.shortLag] - H[j]);
    d.cosLong[b] += Math.cos(H[j + o.longLag] - H[j]);
    const dh = wrap(H[j + o.chord] - H[j]);
    addMoments(d.turn[b], dh);
    hist[b][Math.floor(Math.abs(dh) / TURN_BIN)]++;
    if (Math.abs(dh) > BIG_TURN) d.bigTurn[b]++;
  }

  // Heading change across stop episodes (runs of samples whose forward
  // window is below the stop speed): motion into the stop vs out of it.
  const minDisp = o.stopSpeed * o.lag;
  for (let a = k; a < n; a++) {
    if (sp[a] >= o.stopSpeed || sp[a - 1] < o.stopSpeed) continue;
    let b = a;
    while (b + 1 < n && sp[b + 1] < o.stopSpeed) b++;
    if (b + 2 * k >= n) break;
    const bx = x[a] - x[a - k];
    const by = y[a] - y[a - k];
    const ax = x[b + 2 * k] - x[b + k];
    const ay = y[b + 2 * k] - y[b + k];
    if (Math.hypot(bx, by) >= minDisp && Math.hypot(ax, ay) >= minDisp) {
      const dur = (b - a + 1) * o.dt;
      const sb = STOP_BINS.findIndex(([lo, hi]) => dur >= lo && dur < hi);
      d.stopCos[sb] += Math.cos(Math.atan2(ay, ax) - Math.atan2(by, bx));
      d.stopN[sb]++;
    }
    a = b;
  }

  // Radial velocity (moving samples) and returns inside `returnRadius`.
  let out = false;
  if (full) for (let i = 0; i + k < n; i++) {
    const r = Math.hypot(x[i], y[i]);
    if (r > o.returnRadius) out = true;
    if (out) {
      d.afterOut++;
      if (r < o.returnRadius) d.backIn++;
    }
    if (r < 1 || sp[i] < o.stopSpeed) continue;
    const vr = ((x[i + k] - x[i]) * x[i] + (y[i + k] - y[i]) * y[i]) / r / o.lag;
    const b = RADIAL_BINS.findIndex(([lo, hi]) => r >= lo && r < hi);
    if (b >= 0) {
      d.radSum[b] += vr;
      d.radN[b]++;
    }
  }
  d.turnHist = hist.map((h) => {
    const idx: number[] = [];
    for (let c = 0; c < h.length; c++) if (h[c]) idx.push(c);
    return { idx: Uint16Array.from(idx), cnt: Float64Array.from(idx, (c) => h[c]) };
  });
  return d;
}

/**
 * Tracking-noise sums of one raw track: raw first and second differences of
 * position while the ant is nearly still (speed over `lag` of a 5-sample
 * moving average below `slowSpeed`). For white noise of SD σ per axis,
 * E[Δ²] = 2σ² and E[Δ²²] = 6σ²; real slow movement adds to both, so the
 * estimates are upper bounds. The ratio of the two estimates checks whether
 * the noise is white (1 if so; > 1 if errors are correlated between frames).
 */
export interface NoiseTrack {
  n: number;
  d1x: number;
  d1y: number;
  d2x: number;
  d2y: number;
}

export function noiseTrack(tr: Track, slowSpeed = 3, lag = 0.2): NoiseTrack {
  const { x, y } = tr;
  const n = x.length;
  const s: NoiseTrack = { n: 0, d1x: 0, d1y: 0, d2x: 0, d2y: 0 };
  if (n < 8) return s;
  const dt = (tr.t[n - 1] - tr.t[0]) / (n - 1);
  const k = Math.max(1, Math.round(lag / dt));
  const sm = (a: Float64Array) => {
    const out = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const lo = Math.max(0, i - 2);
      const hi = Math.min(n - 1, i + 2);
      let sum = 0;
      for (let j = lo; j <= hi; j++) sum += a[j];
      out[i] = sum / (hi - lo + 1);
    }
    return out;
  };
  const xs = sm(x);
  const ys = sm(y);
  const back = Math.floor(k / 2);
  for (let i = 3; i < n - 3; i++) {
    if (i - back < 0 || i - back + k >= n) continue;
    const v = Math.hypot(xs[i - back + k] - xs[i - back], ys[i - back + k] - ys[i - back]) / lag;
    if (v >= slowSpeed) continue;
    s.n++;
    s.d1x += (x[i + 1] - x[i]) ** 2;
    s.d1y += (y[i + 1] - y[i]) ** 2;
    s.d2x += (x[i + 1] - 2 * x[i] + x[i - 1]) ** 2;
    s.d2y += (y[i + 1] - 2 * y[i] + y[i - 1]) ** 2;
  }
  return s;
}

export interface DiagValue {
  id: string;
  label: string;
  value: number;
}

const kurtosisRaw = (m: number[]) => {
  const [n, s1, s2, s3, s4] = m;
  if (n < 20) return NaN;
  const mu = s1 / n;
  const m2 = s2 / n - mu * mu;
  const m4 = (s4 - 4 * mu * s3 + 6 * mu * mu * s2) / n - 3 * mu ** 4;
  return m4 / (m2 * m2);
};

function histMedian(h: Float64Array, n: number): number {
  let cum = 0;
  for (let i = 0; i < h.length; i++) {
    if (cum + h[i] >= n / 2 && h[i] > 0) return (i + (n / 2 - cum) / h[i]) * TURN_BIN;
    cum += h[i];
  }
  return NaN;
}

/** Combine per-track diagnostics (optionally a resample, given by indices) into named values. */
export function diagValues(parts: (DiagTrack | null)[], noise: NoiseTrack[], idx?: number[]): DiagValue[] {
  const sel = idx ? idx.map((i) => parts[i]) : parts;
  const nsel = idx ? idx.map((i) => noise[i]).filter(Boolean) : noise;
  const nb = SPEED_BINS.length;
  const binN = new Array(nb).fill(0);
  const cs = new Array(nb).fill(0);
  const cl = new Array(nb).fill(0);
  const turn = SPEED_BINS.map(() => [0, 0, 0, 0, 0]);
  const turnHist = SPEED_BINS.map(() => new Float64Array(TURN_NBIN));
  const big = new Array(nb).fill(0);
  const stopCos = new Array(STOP_BINS.length).fill(0);
  const stopN = new Array(STOP_BINS.length).fill(0);
  const driftS = [0, 0, 0];
  const driftL = [0, 0, 0];
  const bySession = new Map<string, number[]>();
  const antX: number[] = [];
  const antY: number[] = [];
  const align = DISP_BINS.map(() => [0, 0, 0]);
  const radSum = new Array(RADIAL_BINS.length).fill(0);
  const radN = new Array(RADIAL_BINS.length).fill(0);
  const logMedians: number[] = [];
  let residSq = 0;
  let residN = 0;
  let afterOut = 0;
  let backIn = 0;
  let exits = 0;
  let downhill = 0;
  for (const p of sel) {
    if (!p) continue;
    for (let b = 0; b < nb; b++) {
      binN[b] += p.binN[b];
      cs[b] += p.cosShort[b];
      cl[b] += p.cosLong[b];
      for (let c = 0; c < 5; c++) turn[b][c] += p.turn[b][c];
      const h = p.turnHist[b];
      for (let c = 0; c < h.idx.length; c++) turnHist[b][h.idx[c]] += h.cnt[c];
      big[b] += p.bigTurn[b];
    }
    p.align.forEach((a, b) => a.forEach((v, c) => (align[b][c] += v)));
    p.radSum.forEach((v, b) => (radSum[b] += v));
    p.radN.forEach((v, b) => (radN[b] += v));
    if (p.logMedian !== null) {
      logMedians.push(p.logMedian);
      bySession.set(p.session, [...(bySession.get(p.session) ?? []), p.logMedian]);
    }
    p.driftSmall.forEach((v, c) => (driftS[c] += v));
    p.driftLarge.forEach((v, c) => (driftL[c] += v));
    p.stopCos.forEach((v, b) => (stopCos[b] += v));
    p.stopN.forEach((v, b) => (stopN[b] += v));
    if (p.logMedian !== null && p.cos10N >= 20 && p.cos10Sum / p.cos10N < 1) {
      antX.push(p.logMedian);
      antY.push(Math.log(1 - p.cos10Sum / p.cos10N));
    }
    residSq += p.logResidSq;
    residN += p.logResidN;
    afterOut += p.afterOut;
    backIn += p.backIn;
    if (p.finalY !== null) {
      exits++;
      if (p.finalY < 0) downhill++;
    }
  }
  const out: DiagValue[] = [];
  const push = (id: string, label: string, value: number) => out.push({ id, label, value });
  SPEED_BINS.forEach(([lo, hi], b) => {
    const tag = `${lo}–${hi} mm/s`;
    push(`cos5.${b}`, `⟨cos⟩ at 5 mm, ${tag}`, binN[b] > 50 ? cs[b] / binN[b] : NaN);
    push(`cos50.${b}`, `⟨cos⟩ at 50 mm, ${tag}`, binN[b] > 50 ? cl[b] / binN[b] : NaN);
    push(`kurt.${b}`, `Kurtosis of 2.5 mm-chord turns (raw), ${tag}`, binN[b] > 50 ? kurtosisRaw(turn[b]) : NaN);
    push(`turnMed.${b}`, `Median |turn| per 2.5 mm chord (rad), ${tag}`, binN[b] > 50 ? histMedian(turnHist[b], binN[b]) : NaN);
    push(`turnBig.${b}`, `P(|turn| > ${BIG_TURN} rad) per 2.5 mm chord, ${tag}`, binN[b] > 50 ? big[b] / binN[b] : NaN);
  });
  push('antTurn.slope', 'Per-ant slope of log(1 − ⟨cos⟩ at 10 mm) on log median speed', antX.length > 5 ? olsFit(antX, antY).slope : NaN);
  STOP_BINS.forEach(([lo, hi], b) => push(`stopCos.${b}`, `⟨cos⟩ heading in vs out of a stop, ${lo}–${Number.isFinite(hi) ? hi : '∞'} s`, stopN[b] >= 10 ? stopCos[b] / stopN[b] : NaN));
  const lmSorted = Float64Array.from(logMedians).sort();
  const lmMean = logMedians.reduce((s, v) => s + v, 0) / logMedians.length;
  push('antMedian.q25', 'Per-ant median moving speed, q25 (mm/s)', Math.exp(quantile(lmSorted, 0.25)));
  push('antMedian.q50', 'Per-ant median moving speed, q50 (mm/s)', Math.exp(quantile(lmSorted, 0.5)));
  push('antMedian.q75', 'Per-ant median moving speed, q75 (mm/s)', Math.exp(quantile(lmSorted, 0.75)));
  push('logSd.between', 'Between-ant SD of log median speed', Math.sqrt(logMedians.reduce((s, v) => s + (v - lmMean) ** 2, 0) / Math.max(1, logMedians.length - 1)));
  push('logSd.within', 'Within-ant SD of log speed', residN ? Math.sqrt(residSq / residN) : NaN);
  let ssW = 0;
  let dfW = 0;
  for (const xs of bySession.values()) {
    const mu = xs.reduce((a, v) => a + v, 0) / xs.length;
    ssW += xs.reduce((a, v) => a + (v - mu) ** 2, 0);
    dfW += xs.length - 1;
  }
  push('logSd.betweenInSession', 'Between-ant SD of log median speed within sessions', dfW > 0 ? Math.sqrt(ssW / dfW) : NaN);
  push('drift.small2', 'Small-turn steering ⟨Δh·sin 2φ⟩ per 5 mm (rad)', driftS[2] ? driftS[0] / driftS[2] : NaN);
  push('drift.small1', 'Small-turn steering ⟨Δh·sin φ⟩ per 5 mm (rad)', driftS[2] ? driftS[1] / driftS[2] : NaN);
  push('drift.large2', 'Large-turn steering ⟨Δh·sin 2φ⟩ per 5 mm (rad)', driftL[2] ? driftL[0] / driftL[2] : NaN);
  push('drift.large1', 'Large-turn steering ⟨Δh·sin φ⟩ per 5 mm (rad)', driftL[2] ? driftL[1] / driftL[2] : NaN);
  DISP_BINS.forEach(([lo, hi], b) => {
    const [c, s, k] = align[b];
    push(`align.${b}`, `Alignment −⟨cos 2h⟩, displacement ${lo}–${hi} mm`, k ? c / k : NaN);
    push(`alignAxis.${b}`, `Alignment axis from y (deg), displacement ${lo}–${hi} mm`, k ? (90 * Math.atan2(s, c)) / Math.PI : NaN);
  });
  push('exits.down', 'Fraction of exits downhill (final y < 0)', exits ? downhill / exits : NaN);
  RADIAL_BINS.forEach(([lo, hi], b) => push(`vr.${b}`, `Radial velocity at ${lo}–${hi} mm (mm/s)`, radN[b] ? radSum[b] / radN[b] : NaN));
  push('backIn', `Samples back inside 100 mm after first leaving`, afterOut ? backIn / afterOut : NaN);
  let nn = 0;
  let d1x = 0;
  let d1y = 0;
  let d2x = 0;
  let d2y = 0;
  for (const s of nsel) {
    nn += s.n;
    d1x += s.d1x;
    d1y += s.d1y;
    d2x += s.d2x;
    d2y += s.d2y;
  }
  push('noise.x', 'Tracking noise σx from 2nd differences (mm)', nn ? Math.sqrt(d2x / nn / 6) : NaN);
  push('noise.y', 'Tracking noise σy from 2nd differences (mm)', nn ? Math.sqrt(d2y / nn / 6) : NaN);
  push('noise.whiteX', 'σx² from 1st / from 2nd differences (1 = white)', nn ? d1x / 2 / (d2x / 6) : NaN);
  push('noise.whiteY', 'σy² from 1st / from 2nd differences (1 = white)', nn ? d1y / 2 / (d2y / 6) : NaN);
  return out;
}

export interface DiagSample {
  parts: (DiagTrack | null)[];
  noise: NoiseTrack[];
  values: DiagValue[];
  se: number[];
}

/** Diagnostics with cluster-bootstrap SEs. `raw[i]` and `prepared[i]` must be the same ant. */
export function diagSample(raw: Track[], prepared: (Track | null)[], reps = 200, seed = 1): DiagSample {
  const parts = prepared.map((t) => (t ? diagTrack(t) : null));
  const noise = raw.map((t) => noiseTrack(t));
  const values = diagValues(parts, noise);
  const se = bootstrapSE(parts.length, (idx) => diagValues(parts, noise, idx).map((v) => v.value), reps, seed);
  return { parts, noise, values, se };
}
