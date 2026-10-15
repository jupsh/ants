/**
 * Estimation of a colony's detection tracker from detection counts (STATUS
 * 2026-10-15; frozen version: `data/fits/s2018-tracker.json`). Ported from
 * the session's Python estimator (est3 joint onset, exportTracker2
 * durations), with the same arithmetic order so it reproduces the frozen
 * file.
 *
 * - Onset: ant i in cell c starts a gap with 1 − exp(−m_i h_c); the m = 1
 *   baseline p_c = 1 − exp(−h_c). Estimated jointly by alternating moment
 *   matching, Σ_i n_ic (1 − exp(−m_i h_c)) = g_c per cell and Σ_c n_ic
 *   (1 − exp(−m_i h_c)) = g_i per ant, with the geometric mean of the
 *   estimated m fixed at 1: pooled rates would count twice the selection of
 *   low-multiplier ants into long visible stretches, which the simulated
 *   tracker applies again through each ant's multiplier. Ants with few
 *   opportunities keep m = 1; cells with few opportunities or no gaps take
 *   the pooled hazard over all colonies.
 * - Multipliers to draw from: the ants with at least `minList`
 *   opportunities ([1] if fewer than `minMult` such ants).
 * - Durations: Kaplan–Meier bin probabilities per time-since-resumed bin of
 *   the onset (the last bin takes the mass left); a bin with fewer than
 *   `minGaps` gaps borrows the next shorter bin's distribution.
 */
import { DET_D_EDGES, DET_NCELL, DET_TSB_EDGES, type DetectionTracker } from './detection';
import type { AntBlock } from './detectionStats';

const NT = DET_TSB_EDGES.length;
const NB = DET_D_EDGES.length - 1;

export const TRACKER_EST = {
  /** A cell's own hazard needs this many opportunities (and 0 < gaps < opportunities). */
  minCell: 200,
  /** An ant's multiplier is estimated with this many opportunities (else 1). */
  minAnt: 200,
  /** Ants listed as multipliers to draw from, and how many are needed. */
  minList: 2000,
  minMult: 5,
  /** Gaps (complete + censored) for a time-since-resumed bin's own duration distribution. */
  minGaps: 300,
  /** Alternation rounds. */
  rounds: 40,
};

const sum = (v: number[]) => v.reduce((a, b) => a + b, 0);

/** Sum of `key` over ants in block `b`, element by element. */
export function sumBlock(ants: AntBlock[][], b: number, key: 'opp' | 'gap' | 'dEvT' | 'dCeT'): number[] {
  const out = new Array(ants[0][b][key].length).fill(0);
  for (const a of ants) for (let j = 0; j < out.length; j++) out[j] += a[b][key][j];
  return out;
}

/** Pooled hazard per cell, −log(1 − gaps / opportunities) (0 without opportunities or with every one a gap). */
export function pooledHazard(ants: AntBlock[][], b: number): number[] {
  const po = sumBlock(ants, b, 'opp');
  const pg = sumBlock(ants, b, 'gap');
  return po.map((o, c) => (o && pg[c] < o ? -Math.log(1 - pg[c] / o) : 0));
}

/** Root of an increasing f by bisection in log space on [lo, hi] (the end if f has no sign change). */
function solve(f: (x: number) => number, lo = 1e-9, hi = 50): number {
  if (f(hi) < 0) return hi;
  if (f(lo) > 0) return lo;
  for (let k = 0; k < 80; k++) {
    const mid = Math.sqrt(lo * hi);
    if (f(mid) < 0) lo = mid;
    else hi = mid;
  }
  return Math.sqrt(lo * hi);
}

/** Joint baseline hazards h (per cell) and multipliers m (per ant) in block `b`; `est`: the ant's m was estimated. */
export function jointOnset(ants: AntBlock[][], b: number, pooledH: number[], E = TRACKER_EST): { h: number[]; m: number[]; est: boolean[] } {
  const n = ants.map((a) => a[b].opp);
  const g = ants.map((a) => a[b].gap);
  const nc = sumBlock(ants, b, 'opp');
  const gc = sumBlock(ants, b, 'gap');
  const est = n.map((x) => sum(x) >= E.minAnt);
  const own = nc.map((o, c) => o >= E.minCell && gc[c] > 0 && gc[c] < o);
  let m = ants.map(() => 1);
  let h = nc.map((o, c) => (own[c] ? -Math.log(1 - gc[c] / o) : pooledH[c]));
  for (let it = 0; it < E.rounds; it++) {
    for (let c = 0; c < DET_NCELL; c++) {
      if (!own[c]) continue;
      h[c] = solve((x) => {
        let s = 0;
        for (let i = 0; i < n.length; i++) if (n[i][c]) s += n[i][c] * (1 - Math.exp(-m[i] * x));
        return s - gc[c];
      });
    }
    for (let i = 0; i < n.length; i++) {
      if (!est[i]) continue;
      const gi = sum(g[i]);
      m[i] = solve(
        (x) => {
          let s = 0;
          for (let c = 0; c < DET_NCELL; c++) if (n[i][c]) s += n[i][c] * (1 - Math.exp(-x * h[c]));
          return s - gi;
        },
        1e-4,
        100,
      );
    }
    const lg: number[] = [];
    for (let i = 0; i < n.length; i++) if (est[i] && m[i] > 1e-4) lg.push(Math.log(m[i]));
    const s = lg.length ? Math.exp(sum(lg) / lg.length) : 1;
    m = m.map((x, i) => (est[i] ? x / s : 1));
    h = h.map((x, c) => (own[c] ? x * s : x));
  }
  return { h, m, est };
}

/** Kaplan–Meier probabilities of the duration bins (the last bin takes the mass left), normalized. */
export function kmBinProbs(ev: number[], ce: number[]): number[] {
  let risk = sum(ev) + sum(ce);
  let s = 1;
  const S = [1];
  for (let k = 0; k < NB; k++) {
    if (risk > 0) s *= 1 - ev[k] / risk;
    S.push(s);
    risk -= ev[k] + ce[k];
  }
  const probs = [...Array.from({ length: NB - 1 }, (_, k) => S[k] - S[k + 1]), S[NB - 1]];
  const tot = sum(probs);
  return probs.map((x) => x / tot);
}

/** A colony's tracker for one role from its ants' counts in block `b` (the even hours). */
export function estimateTracker(ants: AntBlock[][], pooledH: number[], b = 0, E = TRACKER_EST): DetectionTracker {
  const { h, m, est } = jointOnset(ants, b, pooledH, E);
  const ms = m.filter((_, i) => est[i] && sum(ants[i][b].opp) >= E.minList);
  const ev = sumBlock(ants, b, 'dEvT');
  const ce = sumBlock(ants, b, 'dCeT');
  const dProb: number[][] = [];
  for (let t = 0; t < NT; t++) {
    const e = ev.slice(t * NB, (t + 1) * NB);
    const c = ce.slice(t * NB, (t + 1) * NB);
    dProb.push(sum(e) + sum(c) >= E.minGaps || t === 0 ? kmBinProbs(e, c) : dProb[t - 1]);
  }
  return { p: h.map((x) => 1 - Math.exp(-x)), mult: ms.length >= E.minMult ? ms : [1], dProb };
}
