import { RNG } from '../core/rng';

/**
 * CMA-ES, the standard (μ/μ_w, λ) evolution strategy with cumulative
 * step-size adaptation and rank-one plus rank-μ covariance updates
 * (Hansen 2016, "The CMA Evolution Strategy: A Tutorial", arXiv:1604.00772,
 * default strategy parameters).
 *
 * For simulation fits: the objective receives the generation index, so the
 * caller can use fresh random numbers in every generation and the same ones
 * for every candidate of a generation (candidates are ranked on common random
 * numbers, seed luck does not accumulate across generations). The whole
 * population of a generation is evaluated concurrently. The returned
 * estimate is the final distribution mean, which averages over noise,
 * rather than the best point seen, which would be biased towards lucky
 * evaluations.
 */
export interface CmaOptions {
  /** Initial step size (same units as x). */
  sigma: number;
  /**
   * Initial per-coordinate scales (the initial covariance is σ²·diag(stds²));
   * for badly scaled objectives, so the first generations are not wasted on
   * steps far too large in the sensitive coordinates. Default all 1.
   */
  stds?: number[];
  /** Population size (default 4 + ⌊3 ln n⌋). */
  lambda?: number;
  maxGenerations: number;
  /** Stop when σ times the largest axis of the distribution falls below this. */
  tolX?: number;
  seed?: number;
  /**
   * Also return the average of the distribution means over the last
   * min(averageLast, ⌊generations run / 2⌋) generations (noise handling; a
   * run that stops early is not pulled towards its first positions).
   */
  averageLast?: number;
  log?: (g: CmaGeneration) => void;
}

export interface CmaGeneration {
  generation: number;
  evals: number;
  sigma: number;
  /** Objective values of this generation, best first. */
  fs: number[];
  mean: number[];
}

export interface CmaResult {
  /** Final distribution mean. */
  mean: number[];
  /** Average of the means over the averaging window (see `averageLast`; the final mean if not requested). */
  meanAvg: number[];
  /** Change of the mean across the averaging window (last − first window mean; zeros if not requested). */
  meanDrift: number[];
  /** Generations in the averaging window. */
  avgWindow: number;
  sigma: number;
  /** Best point seen and its (noisy) value: for diagnostics only. */
  best: { x: number[]; f: number };
  generations: number;
  evals: number;
}

export async function cmaes(f: (x: number[], generation: number) => number | Promise<number>, x0: number[], o: CmaOptions): Promise<CmaResult> {
  const n = x0.length;
  const lambda = o.lambda ?? 4 + Math.floor(3 * Math.log(n));
  const mu = Math.floor(lambda / 2);
  const wRaw = Array.from({ length: mu }, (_, i) => Math.log(mu + 0.5) - Math.log(i + 1));
  const wSum = wRaw.reduce((a, v) => a + v, 0);
  const w = wRaw.map((v) => v / wSum);
  const muEff = 1 / w.reduce((a, v) => a + v * v, 0);
  const cc = (4 + muEff / n) / (n + 4 + (2 * muEff) / n);
  const cs = (muEff + 2) / (n + muEff + 5);
  const c1 = 2 / ((n + 1.3) ** 2 + muEff);
  const cmu = Math.min(1 - c1, (2 * (muEff - 2 + 1 / muEff)) / ((n + 2) ** 2 + muEff));
  const ds = 1 + 2 * Math.max(0, Math.sqrt((muEff - 1) / (n + 1)) - 1) + cs;
  const chiN = Math.sqrt(n) * (1 - 1 / (4 * n) + 1 / (21 * n * n));

  const rng = RNG.stream(o.seed ?? 1, n, lambda);
  let m = x0.slice();
  let sigma = o.sigma;
  const pc = new Array(n).fill(0);
  const ps = new Array(n).fill(0);
  const s0 = o.stds ?? new Array(n).fill(1);
  let C = identity(n).map((r, i) => r.map((v) => v * s0[i] * s0[i]));
  let B = identity(n);
  let D = s0.slice();
  let best = { x: m.slice(), f: Infinity };
  let evals = 0;
  let g = 0;
  const recent: number[][] = [];
  for (; g < o.maxGenerations; g++) {
    // Sample: y = B·D·z, x = m + σ·y.
    const ys: number[][] = [];
    const xs: number[][] = [];
    for (let k = 0; k < lambda; k++) {
      const z = Array.from({ length: n }, () => rng.gauss());
      const y = matVec(B, z.map((v, i) => D[i] * v));
      ys.push(y);
      xs.push(m.map((mi, i) => mi + sigma * y[i]));
    }
    const fs = await Promise.all(xs.map((x) => f(x, g)));
    evals += lambda;
    const order = fs.map((_, k) => k).sort((a, b) => fs[a] - fs[b]);
    if (fs[order[0]] < best.f) best = { x: xs[order[0]].slice(), f: fs[order[0]] };
    // Recombination.
    const yw = new Array(n).fill(0);
    for (let i = 0; i < mu; i++) for (let j = 0; j < n; j++) yw[j] += w[i] * ys[order[i]][j];
    m = m.map((mi, j) => mi + sigma * yw[j]);
    if (o.averageLast) {
      recent.push(m.slice());
      if (recent.length > o.averageLast) recent.shift();
    }
    // Step-size path: C^{-1/2}·yw = B·D^{-1}·Bᵀ·yw.
    const bty = matTVec(B, yw);
    const cInvHalfYw = matVec(B, bty.map((v, i) => v / D[i]));
    const kS = Math.sqrt(cs * (2 - cs) * muEff);
    for (let j = 0; j < n; j++) ps[j] = (1 - cs) * ps[j] + kS * cInvHalfYw[j];
    const psNorm = Math.hypot(...ps);
    const hs = psNorm / Math.sqrt(1 - (1 - cs) ** (2 * (g + 1))) < (1.4 + 2 / (n + 1)) * chiN ? 1 : 0;
    const kC = Math.sqrt(cc * (2 - cc) * muEff);
    for (let j = 0; j < n; j++) pc[j] = (1 - cc) * pc[j] + hs * kC * yw[j];
    // Covariance: rank-one and rank-μ updates.
    const dh = (1 - hs) * cc * (2 - cc);
    const Cn = identity(n).map((r) => r.fill(0));
    for (let a = 0; a < n; a++)
      for (let b = 0; b <= a; b++) {
        let rankMu = 0;
        for (let i = 0; i < mu; i++) rankMu += w[i] * ys[order[i]][a] * ys[order[i]][b];
        const v = (1 - c1 - cmu) * C[a][b] + c1 * (pc[a] * pc[b] + dh * C[a][b]) + cmu * rankMu;
        Cn[a][b] = v;
        Cn[b][a] = v;
      }
    C = Cn;
    sigma *= Math.exp((cs / ds) * (psNorm / chiN - 1));
    ({ B, D } = eigenDecomposition(C));
    o.log?.({ generation: g, evals, sigma, fs: order.map((k) => fs[k]), mean: m.slice() });
    if (o.tolX !== undefined && sigma * Math.max(...D) < o.tolX) {
      g++;
      break;
    }
  }
  const win = recent.slice(recent.length - Math.max(1, Math.min(recent.length, Math.floor(g / 2))));
  const meanAvg = recent.length ? m.map((_, j) => win.reduce((s, r) => s + r[j], 0) / win.length) : m.slice();
  const meanDrift = recent.length ? m.map((_, j) => win[win.length - 1][j] - win[0][j]) : m.map(() => 0);
  return { mean: m, meanAvg, meanDrift, avgWindow: recent.length ? win.length : 0, sigma, best, generations: g, evals };
}

function identity(n: number): number[][] {
  return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
}

function matVec(A: number[][], v: number[]): number[] {
  return A.map((row) => row.reduce((s, a, j) => s + a * v[j], 0));
}

function matTVec(A: number[][], v: number[]): number[] {
  const out = new Array(A[0].length).fill(0);
  for (let i = 0; i < A.length; i++) for (let j = 0; j < out.length; j++) out[j] += A[i][j] * v[i];
  return out;
}

/**
 * Symmetric eigendecomposition by cyclic Jacobi rotations: C = B·diag(D²)·Bᵀ,
 * returned as B (eigenvectors in columns) and D (square roots of the
 * eigenvalues, floored at a tiny positive value).
 */
export function eigenDecomposition(C: number[][]): { B: number[][]; D: number[] } {
  const n = C.length;
  const A = C.map((r) => r.slice());
  const V = identity(n);
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-300) continue;
        const theta = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = A[k][p];
          const akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A[p][k];
          const aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
        for (let k = 0; k < n; k++) {
          const vkp = V[k][p];
          const vkq = V[k][q];
          V[k][p] = c * vkp - s * vkq;
          V[k][q] = s * vkp + c * vkq;
        }
      }
  }
  return { B: V, D: A.map((r, i) => Math.sqrt(Math.max(1e-300, r[i]))) };
}
