// Part D capability rule (Stage 3b; D174 Part A as amended by D175; D126 amendment 1's edge rules). Pure functions of
// per-colony values, so one code path serves the simulated datasets, the synthetic nulls and the tests (D175 item 3):
//   colony: c0, c3 = C(< 5), C(20–40) (raw); j0, j3 = the same minus Ê_J (S2-J); s32 = S3₂ (Stage 0 audit). NaN = not
//     estimable; a dataset uses its estimable colonies, at least CAP_MIN_COLONIES of 22 (D175 item 5).
//   dataset: θ = (R, S3₂, R_J), R = mean c3 / mean c0 and R_J = mean j3 / mean j0 (ratios of colony means), recomputed
//     in each of CAP_BOOT colony-bootstrap draws; draws with a denominator ≤ DEN_MIN are counted, and more than
//     DEN_SHARE of them makes the dataset not evaluable (D126). Covariance from the remaining draws.
//   pair: M² of θA − θB under covA + covB; a condition number above COND_MAX falls back to the per-coordinate screen
//     (D175 item 4): separated if any coordinate's (1 − α) percentile CI of the difference (draws paired by index,
//     datasets resampled independently) excludes 0, i.e. its two-sided bootstrap p < α; α from FALLBACK_ALPHAS, the
//     first whose false-positive rate on the nulls is ≤ 5 %.
import { RNG } from '../src/sim/core/rng';

export const CAP_BOOT = 2000;
export const CAP_MIN_COLONIES = 18;
export const DEN_MIN = 0.01;
export const DEN_SHARE = 0.01;
export const COND_MAX = 1e8;
export const FALLBACK_ALPHAS = [0.05 / 3, 0.025 / 3, 0.01 / 3, 0.005 / 3, 0.001 / 3];
export const FP_MAX = 0.05;
export const C_QUANTILE = 0.95;
export const SAME_ALARM = 0.1; // the check fails if more than 10 % of same-member pairs exceed c (14 of 135)
export const CROSS_SHARE = 0.75; // a T–D pair is distinguished if ≥ 75 % of its comparisons exceed (27 of 36)
export const MIN_DATASETS = 4;

export interface ColonyCap { colony: number; c0: number; c3: number; j0: number; j3: number; s32: number }
export const colonyEstimable = (c: ColonyCap) => [c.c0, c.c3, c.j0, c.j3, c.s32].every(Number.isFinite);

export interface DatasetCap {
  n: number; evaluable: boolean; why?: string; theta: number[]; cov: number[][];
  draws: Float64Array[]; badR: number; badRJ: number;
}

function thetaOf(cols: ColonyCap[], idx: ArrayLike<number>): { t: number[]; d0: number; dj: number } {
  let c0 = 0, c3 = 0, j0 = 0, j3 = 0, s = 0;
  for (let i = 0; i < idx.length; i++) { const c = cols[idx[i]]; c0 += c.c0; c3 += c.c3; j0 += c.j0; j3 += c.j3; s += c.s32; }
  const n = idx.length;
  return { t: [c3 / c0, s / n, j3 / j0], d0: c0 / n, dj: j0 / n };
}

export function datasetCap(all: ColonyCap[], rng: RNG, B = CAP_BOOT): DatasetCap {
  const cols = all.filter(colonyEstimable);
  const n = cols.length;
  const draws = [0, 1, 2].map(() => new Float64Array(B).fill(NaN));
  const out: DatasetCap = { n, evaluable: false, theta: [NaN, NaN, NaN], cov: [], draws, badR: 0, badRJ: 0 };
  if (n < CAP_MIN_COLONIES) return { ...out, why: `${n} estimable colonies < ${CAP_MIN_COLONIES}` };
  const full = thetaOf(cols, Array.from({ length: n }, (_, i) => i));
  out.theta = full.t;
  if (full.d0 <= DEN_MIN || full.dj <= DEN_MIN) return { ...out, why: 'denominator ≤ 0.01 on the full sample' };
  const idx = new Int32Array(n);
  for (let b = 0; b < B; b++) {
    for (let i = 0; i < n; i++) idx[i] = rng.int(n);
    const { t, d0, dj } = thetaOf(cols, idx);
    if (d0 <= DEN_MIN) out.badR++;
    if (dj <= DEN_MIN) out.badRJ++;
    draws[0][b] = d0 > DEN_MIN ? t[0] : NaN;
    draws[1][b] = t[1];
    draws[2][b] = dj > DEN_MIN ? t[2] : NaN;
  }
  if (out.badR > DEN_SHARE * B) return { ...out, why: `R: ${out.badR} of ${B} draws with denominator ≤ 0.01` };
  if (out.badRJ > DEN_SHARE * B) return { ...out, why: `R_J: ${out.badRJ} of ${B} draws with denominator ≤ 0.01` };
  out.cov = covariance(draws);
  out.evaluable = true;
  return out;
}

/** Sample covariance over the draws where every coordinate is finite. */
export function covariance(draws: Float64Array[]): number[][] {
  const k = draws.length;
  const ok: number[] = [];
  for (let b = 0; b < draws[0].length; b++) if (draws.every((d) => Number.isFinite(d[b]))) ok.push(b);
  const m = draws.map((d) => ok.reduce((a, b) => a + d[b], 0) / ok.length);
  return Array.from({ length: k }, (_, i) => Array.from({ length: k }, (_, j) => ok.reduce((a, b) => a + (draws[i][b] - m[i]) * (draws[j][b] - m[j]), 0) / (ok.length - 1)));
}

/** Eigenvalues of a symmetric matrix (cyclic Jacobi). */
export function eigenSym(M: number[][]): number[] {
  const n = M.length;
  const a = M.map((r) => [...r]);
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += a[p][q] ** 2;
    if (off < 1e-30 * Math.max(1e-300, a.reduce((s, r, i) => s + r[i] ** 2, 0))) break;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) {
        if (a[p][q] === 0) continue;
        const th = (a[q][q] - a[p][p]) / (2 * a[p][q]);
        const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) { const akp = a[k][p], akq = a[k][q]; a[k][p] = c * akp - s * akq; a[k][q] = s * akp + c * akq; }
        for (let k = 0; k < n; k++) { const apk = a[p][k], aqk = a[q][k]; a[p][k] = c * apk - s * aqk; a[q][k] = s * apk + c * aqk; }
      }
  }
  return a.map((r, i) => r[i]);
}

export function conditionNumber(M: number[][]): number {
  const ev = eigenSym(M);
  const lo = Math.min(...ev);
  return lo > 0 ? Math.max(...ev) / lo : Infinity;
}

/** dᵀ M⁻¹ d by Gaussian elimination with partial pivoting. */
export function mahalanobis2(d: number[], M: number[][]): number {
  const n = d.length;
  const a = M.map((r, i) => [...r, d[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(a[r][c]) > Math.abs(a[p][c])) p = r;
    [a[c], a[p]] = [a[p], a[c]];
    for (let r = c + 1; r < n; r++) { const f = a[r][c] / a[c][c]; for (let k = c; k <= n; k++) a[r][k] -= f * a[c][k]; }
  }
  const x = new Array<number>(n).fill(0);
  for (let r = n - 1; r >= 0; r--) { let s = a[r][n]; for (let k = r + 1; k < n; k++) s -= a[r][k] * x[k]; x[r] = s / a[r][r]; }
  return d.reduce((s, di, i) => s + di * x[i], 0);
}

export interface PairCap { evaluable: boolean; m2: number; cond: number; fallback: boolean; p: number[] }

/** Per-coordinate two-sided bootstrap p of the difference: 2 · min(share ≤ 0, share ≥ 0), over draws finite on both sides. */
function coordP(a: Float64Array, b: Float64Array): number {
  let le = 0, ge = 0, m = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    if (!Number.isFinite(d)) continue;
    m++;
    if (d <= 0) le++;
    if (d >= 0) ge++;
  }
  return m ? Math.min(1, (2 * Math.min(le, ge)) / m) : NaN;
}

export function comparePair(A: DatasetCap, B: DatasetCap): PairCap {
  if (!A.evaluable || !B.evaluable) return { evaluable: false, m2: NaN, cond: NaN, fallback: false, p: [] };
  const S = A.cov.map((r, i) => r.map((v, j) => v + B.cov[i][j]));
  const d = A.theta.map((t, i) => t - B.theta[i]);
  const cond = conditionNumber(S);
  const fallback = !(cond <= COND_MAX);
  return { evaluable: true, m2: fallback ? NaN : mahalanobis2(d, S), cond, fallback, p: A.draws.map((a, k) => coordP(a, B.draws[k])) };
}

export interface Rule { c: number; alpha: number }
/** Separated under the frozen rule: M² > c, or under the fallback any coordinate's p < α. */
export const fallbackSeparated = (p: number[], alpha: number) => p.some((x) => x < alpha);
export const separated = (pc: PairCap, r: Rule) => pc.evaluable && (pc.fallback ? fallbackSeparated(pc.p, r.alpha) : pc.m2 > r.c);

export const quantile = (v: number[], q: number) => { const w = [...v].sort((a, b) => a - b); return w[Math.floor(q * (w.length - 1))]; };

/**
 * Null pairs (D175 item 3): for pair i, in every colony draw 2 · per distinct runs from that colony's pool (base arm),
 * the first `per` pooled into dataset A, the rest into B; both processed by datasetCap and comparePair. `pool` turns a
 * colony's runs into its ColonyCap (the same pooling as a member dataset's).
 */
export function nullPairs<T>(pools: T[][], pool: (runs: T[], colony: number) => ColonyCap, nPairs: number, seed: number, per = 2, B = CAP_BOOT): { pair: PairCap; thetaA: number[]; thetaB: number[]; nA: number; nB: number }[] {
  const out = [];
  for (let i = 0; i < nPairs; i++) {
    const r = RNG.stream(seed, 0, i);
    const A: ColonyCap[] = [];
    const Bs: ColonyCap[] = [];
    pools.forEach((runs, colony) => {
      if (runs.length < 2 * per) throw new Error(`colony ${colony}: pool of ${runs.length} runs < ${2 * per}`);
      const ix = runs.map((_, k) => k);
      for (let k = 0; k < 2 * per; k++) { const j = k + r.int(ix.length - k); [ix[k], ix[j]] = [ix[j], ix[k]]; }
      A.push(pool(ix.slice(0, per).map((k) => runs[k]), colony));
      Bs.push(pool(ix.slice(per, 2 * per).map((k) => runs[k]), colony));
    });
    const dA = datasetCap(A, RNG.stream(seed, 1, i, 0), B);
    const dB = datasetCap(Bs, RNG.stream(seed, 1, i, 1), B);
    out.push({ pair: comparePair(dA, dB), thetaA: dA.theta, thetaB: dB.theta, nA: dA.n, nB: dB.n });
  }
  return out;
}

export interface Threshold { c: number; alpha: number | null; nNull: number; nEvaluable: number; nFallback: number; fallbackFp: { alpha: number; fp: number }[]; ruleFp: number }
/** c = the nulls' 95th percentile of M² (pairs with M² defined); α = the first FALLBACK_ALPHAS level with null FP ≤ 5 %. */
export function threshold(nulls: PairCap[]): Threshold {
  const ev = nulls.filter((p) => p.evaluable);
  const m2 = ev.filter((p) => !p.fallback).map((p) => p.m2);
  const c = m2.length ? quantile(m2, C_QUANTILE) : NaN;
  const fallbackFp = FALLBACK_ALPHAS.map((alpha) => ({ alpha, fp: ev.filter((p) => fallbackSeparated(p.p, alpha)).length / ev.length }));
  const alpha = fallbackFp.find((f) => f.fp <= FP_MAX)?.alpha ?? null;
  const ruleFp = alpha === null ? NaN : ev.filter((p) => separated(p, { c, alpha })).length / ev.length;
  return { c, alpha, nNull: nulls.length, nEvaluable: ev.length, nFallback: ev.length - m2.length, fallbackFp, ruleFp };
}

/** Same-member check (D175 item 2): every pair of a member's evaluable datasets; fails if more than 10 % exceed. */
export function sameMemberCheck(members: Record<string, DatasetCap[]>, rule: Rule) {
  const per: Record<string, { pairs: number; exceed: number; notEvaluable: number }> = {};
  for (const [id, ds] of Object.entries(members)) {
    const s = { pairs: 0, exceed: 0, notEvaluable: 0 };
    for (let i = 0; i < ds.length; i++)
      for (let j = i + 1; j < ds.length; j++) {
        const pc = comparePair(ds[i], ds[j]);
        if (!pc.evaluable) { s.notEvaluable++; continue; }
        s.pairs++;
        if (separated(pc, rule)) s.exceed++;
      }
    per[id] = s;
  }
  const pairs = Object.values(per).reduce((a, s) => a + s.pairs, 0);
  const exceed = Object.values(per).reduce((a, s) => a + s.exceed, 0);
  return { pairs, exceed, rate: exceed / pairs, pass: pairs > 0 && exceed <= SAME_ALARM * pairs, perMember: per };
}

/** One T–D pair (D175 items 1, 5): not evaluable with fewer than 4 evaluable datasets on a side; else distinguished if ≥ 75 % of the cross-dataset comparisons exceed. */
export function crossPair(T: DatasetCap[], D: DatasetCap[], rule: Rule) {
  const t = T.filter((d) => d.evaluable);
  const d = D.filter((x) => x.evaluable);
  if (t.length < MIN_DATASETS || d.length < MIN_DATASETS) return { evaluable: false, comparisons: 0, exceed: 0, power: NaN, distinguished: false, why: `evaluable datasets T ${t.length}, D ${d.length}` };
  let exceed = 0;
  for (const a of t) for (const b of d) if (separated(comparePair(a, b), rule)) exceed++;
  const comparisons = t.length * d.length;
  return { evaluable: true, comparisons, exceed, power: exceed / comparisons, distinguished: exceed >= Math.ceil(CROSS_SHARE * comparisons - 1e-9) };
}
