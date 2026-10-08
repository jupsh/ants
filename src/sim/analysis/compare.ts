import { RNG } from '../core/rng';

/**
 * Model–data comparison statistics (docs/STATUS.md, Evidence policy §
 * Criteria). Every comparison is reduced to a z-like score so that |z| ≤ 2
 * means "consistent with sampling uncertainty on both sides":
 *
 *   - means and proportions: z = (m_sim − m_data) / √(SE_data² + SE_sim²),
 *     with SE_sim estimated from replicates (seed blocks or resampled ants);
 *   - spread: z of the log SD ratio, reported separately from the mean;
 *   - distributions: two-sample KS with the actual sample sizes, expressed
 *     as the two-sided normal quantile of its p-value.
 *
 * For *fitting*, use `fitZ` (SE_data only): letting SE_sim into the
 * objective would reward the optimiser for making the simulation noisier.
 */

export type CompareKind = 'mean' | 'proportion' | 'spread' | 'distribution';

export interface Comparison {
  id: string;
  label: string;
  kind: CompareKind;
  data: number;
  sim: number;
  /** Standard errors of the two estimates (NaN where not applicable, e.g. KS). */
  seData: number;
  seSim: number;
  z: number;
}

export type Verdict = 'ok' | 'marginal' | 'off';

/** |z| ≤ 2 consistent; ≤ 3 marginal; otherwise inconsistent. Non-finite z is "off". */
export function verdict(z: number): Verdict {
  const a = Math.abs(z);
  return a <= 2 ? 'ok' : a <= 3 ? 'marginal' : 'off';
}

/** z for judging consistency: both sampling errors. */
export function combinedZ(sim: number, seSim: number, data: number, seData: number): number {
  return (sim - data) / Math.sqrt(seData * seData + seSim * seSim);
}

/** z for fitting: data sampling error only (fixed weights). */
export function fitZ(sim: number, data: number, seData: number): number {
  return (sim - data) / seData;
}

/** Binomial standard error of a proportion. */
export function binomialSE(p: number, n: number): number {
  return Math.sqrt((p * (1 - p)) / n);
}

/**
 * z of log(SD_sim / SD_data), using SE(log s) ≈ 1/√(2(n − 1)). This is exact
 * only for normal samples; heavier tails make it anticonservative, so use a
 * bootstrap SE (`logSdZFromSE`) where raw data exist.
 */
export function logSdZ(sdSim: number, nSim: number, sdData: number, nData: number): number {
  return Math.log(sdSim / sdData) / Math.sqrt(1 / (2 * (nSim - 1)) + 1 / (2 * (nData - 1)));
}

/** z of log(SD_sim / SD_data) given standard errors of the two log SDs. */
export function logSdZFromSE(sdSim: number, seLogSim: number, sdData: number, seLogData: number): number {
  return Math.log(sdSim / sdData) / Math.hypot(seLogSim, seLogData);
}

/** Standard normal CDF (Abramowitz–Stegun 7.1.26 via erf; |error| < 1.5e-7). */
export function normalCdf(z: number): number {
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const erf = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return z >= 0 ? 0.5 * (1 + erf) : 0.5 * (1 - erf);
}

/** Inverse standard normal CDF (Acklam's rational approximation, rel. error < 1.2e-9). */
export function normalQuantile(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const lo = 0.02425;
  if (p < lo) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p > 1 - lo) return -normalQuantile(1 - p);
  const q = p - 0.5;
  const r = q * q;
  return ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

/** Two-sided p-value expressed as an equivalent |z| (capped at 8). */
export function pToZ(p: number): number {
  return Math.min(8, normalQuantile(1 - Math.max(p, 1e-15) / 2));
}

export interface KSResult {
  d: number;
  n: number;
  m: number;
  p: number;
  /** Equivalent two-sided |z| of p (≥ 0). */
  z: number;
}

/**
 * Two-sample Kolmogorov–Smirnov test with the asymptotic Kolmogorov
 * distribution and Stephens' small-sample correction. Samples must be
 * independent units (e.g. one value per ant), not autocorrelated samples
 * from within tracks.
 */
export function ksTest(a: ArrayLike<number>, b: ArrayLike<number>, mEff?: number): KSResult {
  const x = Array.from(a).sort((p, q) => p - q);
  const y = Array.from(b).sort((p, q) => p - q);
  const n = x.length;
  const m = y.length;
  let i = 0;
  let j = 0;
  let d = 0;
  while (i < n && j < m) {
    const v = Math.min(x[i], y[j]);
    while (i < n && x[i] <= v) i++;
    while (j < m && y[j] <= v) j++;
    d = Math.max(d, Math.abs(i / n - j / m));
  }
  // mEff: score b as if it had that many values (synthetic references scaled to a real sample size).
  const mm = mEff ?? m;
  const ne = Math.sqrt((n * mm) / (n + mm));
  const p = kolmogorovQ((ne + 0.12 + 0.11 / ne) * d);
  return { d, n, m, p, z: pToZ(p) };
}

/** Survival function of the Kolmogorov distribution, Q(λ) = 2 Σ (−1)^{k−1} e^{−2k²λ²}. */
function kolmogorovQ(lambda: number): number {
  if (lambda < 0.2) return 1;
  let s = 0;
  for (let k = 1; k <= 100; k++) {
    const term = 2 * (k % 2 ? 1 : -1) * Math.exp(-2 * k * k * lambda * lambda);
    s += term;
    if (Math.abs(term) < 1e-12) break;
  }
  return Math.min(1, Math.max(0, s));
}

export interface BlockEstimate {
  /** Pooled mean over all individual values. */
  mean: number;
  /** SD between individuals (pooled). */
  sd: number;
  n: number;
  /** Standard error of the pooled mean from the spread of block means. */
  se: number;
  blocks: number;
}

/**
 * Pooled estimate and replicate-based standard error from independent
 * simulation blocks (different seed blocks). Blocks may differ in size
 * (e.g. after filtering), so the SE is the batch-means ratio estimator:
 * SE² = Σ (n_b/n̄)² (m_b − m)² / (R (R − 1)).
 */
export function blockEstimate(blocks: number[][]): BlockEstimate {
  const vals = blocks.flat().filter(Number.isFinite);
  const n = vals.length;
  const mean = n ? vals.reduce((s, v) => s + v, 0) / n : NaN;
  const sd = n > 1 ? Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1)) : NaN;
  const used = blocks.map((b) => b.filter(Number.isFinite)).filter((b) => b.length);
  const R = used.length;
  let se = NaN;
  if (R >= 2) {
    const nbar = n / R;
    let s = 0;
    for (const b of used) {
      const mb = b.reduce((a, v) => a + v, 0) / b.length;
      s += (b.length / nbar) ** 2 * (mb - mean) ** 2;
    }
    se = Math.sqrt(s / (R * (R - 1)));
  }
  return { mean, sd, n, se, blocks: R };
}

/**
 * Cluster bootstrap: resample `n` independent units (ants) with replacement
 * and return the SD of each component of `stat` across `reps` resamples.
 * Non-finite replicate values are ignored.
 */
export function bootstrapSE(n: number, stat: (idx: number[]) => number[], reps = 200, seed = 1): number[] {
  const rng = RNG.stream(seed, n);
  const draws: number[][] = [];
  for (let r = 0; r < reps; r++) {
    const idx = Array.from({ length: n }, () => rng.int(n));
    draws.push(stat(idx));
  }
  const k = draws[0]?.length ?? 0;
  return Array.from({ length: k }, (_, c) => {
    const v = draws.map((d) => d[c]).filter(Number.isFinite);
    if (v.length < 2) return NaN;
    const m = v.reduce((s, x) => s + x, 0) / v.length;
    return Math.sqrt(v.reduce((s, x) => s + (x - m) ** 2, 0) / (v.length - 1));
  });
}

/** Ordinary least-squares slope and intercept of y on x. */
export function olsFit(x: number[], y: number[]): { slope: number; intercept: number } {
  const n = x.length;
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (x[i] - mx) * (y[i] - my);
    sxx += (x[i] - mx) ** 2;
  }
  const slope = sxy / sxx;
  return { slope, intercept: my - slope * mx };
}

/** Average ranks (ties share the mean rank). */
function ranks(v: number[]): number[] {
  const idx = v.map((x, i) => [x, i] as const).sort((a, b) => a[0] - b[0]);
  const r = new Array<number>(v.length);
  for (let i = 0; i < idx.length; ) {
    let j = i;
    while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++;
    for (let k = i; k <= j; k++) r[idx[k][1]] = (i + j) / 2 + 1;
    i = j + 1;
  }
  return r;
}

/** Spearman rank correlation. */
export function spearman(x: number[], y: number[]): number {
  const rx = ranks(x);
  const ry = ranks(y);
  const n = x.length;
  const m = (n + 1) / 2;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (rx[i] - m) * (ry[i] - m);
    sxx += (rx[i] - m) ** 2;
    syy += (ry[i] - m) ** 2;
  }
  return sxy / Math.sqrt(sxx * syy);
}

/** Mean and sample SD (n − 1) of finite values. */
export function meanSd(values: number[]): { mean: number; sd: number; n: number } {
  const v = values.filter(Number.isFinite);
  const n = v.length;
  const mean = n ? v.reduce((a, b) => a + b, 0) / n : NaN;
  const sd = n > 1 ? Math.sqrt(v.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1)) : NaN;
  return { mean, sd, n };
}
