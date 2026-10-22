/**
 * D083 Part B (amendment 1, D084): neighbour-conditioned rates and survival from `NeighbourStats` tables, the
 * symmetric composition / within split of a model − data gap, support rules, the paired bootstrap and the fixed
 * readings. Pure; scripts only (outside simHash).
 */
import { A_BINS, NB_CELLS, N_BINS, SURV_BINS, type NbGroupTables, type NbTables } from '../src/sim/analysis/neighbourRates';
import { REST_W } from '../src/sim/analysis/activity';
import { RNG } from '../src/sim/core/rng';

export type Quantity = 'leave' | 'stop' | 'surv10';
export const QUANTITIES: Quantity[] = ['leave', 'stop', 'surv10'];

/** Sum of tables (same frameDt and survival length). */
export function poolTables(ts: NbTables[]): NbTables {
  const f = ts[0];
  const sum = (a: ArrayLike<number>[], n: number) => {
    const out = new Array<number>(n).fill(0);
    for (const v of a) for (let k = 0; k < n; k++) out[k] += v[k] ?? 0;
    return out;
  };
  const groups = [0, 1].map((g) => {
    const gs = ts.map((t) => t.groups[g]);
    // Tables saved without cell arrays (the data reference) pool to empty cell arrays.
    const cell = (k: keyof NbGroupTables, n: number) => (gs.every((x) => (x[k] as ArrayLike<number> | undefined)?.length) ? Float32Array.from(sum(gs.map((x) => x[k] as Float32Array), n)) : new Float32Array(0));
    return {
      stopExp: sum(gs.map((x) => x.stopExp), N_BINS),
      stopEv: sum(gs.map((x) => x.stopEv), N_BINS),
      leaveExp: sum(gs.map((x) => x.leaveExp), A_BINS),
      leaveEv: sum(gs.map((x) => x.leaveEv), A_BINS),
      stopCellExp: cell('stopCellExp', N_BINS * NB_CELLS),
      stopCellEv: cell('stopCellEv', N_BINS * NB_CELLS),
      leaveCellExp: cell('leaveCellExp', A_BINS * NB_CELLS),
      leaveCellEv: cell('leaveCellEv', A_BINS * NB_CELLS),
      starts: sum(gs.map((x) => x.starts), SURV_BINS),
      survEv: Array.from({ length: SURV_BINS }, (_, b) => sum(gs.map((x) => x.survEv[b]), f.survMaxFrames + 2)),
      survCens: Array.from({ length: SURV_BINS }, (_, b) => sum(gs.map((x) => x.survCens[b]), f.survMaxFrames + 2)),
    };
  });
  return { frameDt: f.frameDt, survMaxFrames: f.survMaxFrames, groups };
}

/** Kaplan–Meier P(duration ≥ T frames) from event / censoring counts by duration; NaN if nobody is at risk at T − 1. */
export function kmAtLeast(ev: number[], cens: number[], T: number): number {
  const L = ev.length;
  const atRisk = new Array<number>(L + 1).fill(0);
  for (let d = L - 1; d >= 0; d--) atRisk[d] = atRisk[d + 1] + ev[d] + cens[d];
  if (T <= 1) return atRisk[1] + ev[0] + cens[0] > 0 ? 1 : NaN;
  if (T - 1 >= L || atRisk[T - 1] <= 0) return NaN;
  let S = 1;
  for (let d = 1; d < T; d++) if (atRisk[d] > 0) S *= 1 - ev[d] / atRisk[d];
  return S;
}

/** Weights and conditional values per bin for one quantity of one group (NaN = not estimable in that bin). */
export function binned(t: NbTables, g: number, q: Quantity): { w: number[]; r: number[] } {
  const G = t.groups[g];
  if (q === 'surv10') {
    const T = Math.round(10 / t.frameDt);
    const tot = G.starts.reduce((a, b) => a + b, 0);
    return { w: G.starts.map((s) => (tot > 0 ? s / tot : NaN)), r: G.survEv.map((ev, b) => kmAtLeast(ev, G.survCens[b], T)) };
  }
  const exp = q === 'leave' ? G.leaveExp : G.stopExp;
  const ev = q === 'leave' ? G.leaveEv : G.stopEv;
  const tot = exp.reduce((a, b) => a + b, 0);
  // Rates per second.
  return { w: exp.map((e) => (tot > 0 ? e / tot : NaN)), r: exp.map((e, b) => (e > 0 ? ev[b] / (e * t.frameDt) : NaN)) };
}

export interface Split {
  gap: number;
  C: number;
  W: number;
  /** Bins occupied on either side where a value is missing on either side. */
  unsupported: number[];
}

/** Symmetric split (amendment 1): C = Σ (w_m − w_d)(r_m + r_d)/2, W = Σ (w_m + w_d)/2 · (r_m − r_d); C + W = gap. */
export function split(m: { w: number[]; r: number[] }, d: { w: number[]; r: number[] }): Split {
  let C = 0;
  let W = 0;
  let M = 0;
  let D = 0;
  const unsupported: number[] = [];
  for (let b = 0; b < m.w.length; b++) {
    const wm = Number.isFinite(m.w[b]) ? m.w[b] : 0;
    const wd = Number.isFinite(d.w[b]) ? d.w[b] : 0;
    if (wm === 0 && wd === 0) continue;
    if (!Number.isFinite(m.r[b]) || !Number.isFinite(d.r[b])) {
      unsupported.push(b);
      continue;
    }
    C += (wm - wd) * (m.r[b] + d.r[b]) / 2;
    W += ((wm + wd) / 2) * (m.r[b] - d.r[b]);
    M += wm * m.r[b];
    D += wd * d.r[b];
  }
  if (unsupported.length) return { gap: NaN, C: NaN, W: NaN, unsupported };
  return { gap: M - D, C, W, unsupported };
}

export interface Interval {
  est: number;
  lo: number;
  hi: number;
}

export interface Reading {
  gap: Interval;
  C: Interval;
  W: Interval;
  shareW: Interval;
  shareC: Interval;
  unsupportedDraws: number;
  draws: number;
  unsupported: number[];
  reading: string;
}

const pct = (v: number[], p: number) => v[Math.min(v.length - 1, Math.floor(p * v.length))];
const interval = (est: number, v: number[]): Interval => {
  const s = v.filter(Number.isFinite).sort((a, b) => a - b);
  return { est, lo: s.length ? pct(s, 0.025) : NaN, hi: s.length ? pct(s, 0.975) : NaN };
};

/** The amended reading from a point split and its draws. */
export function readSplit(point: Split, draws: Split[]): Reading {
  const ok = draws.filter((s) => !s.unsupported.length);
  const bad = draws.length - ok.length;
  const base = { unsupportedDraws: bad, draws: draws.length, unsupported: point.unsupported };
  const nan: Interval = { est: NaN, lo: NaN, hi: NaN };
  if (point.unsupported.length || bad > 0.05 * draws.length) {
    const bins = [...new Set([...point.unsupported, ...draws.flatMap((s) => s.unsupported)])].sort((a, b) => a - b);
    return { ...base, gap: nan, C: nan, W: nan, shareW: nan, shareC: nan, reading: `unestimable (missing support in bins ${bins.join(', ')})` };
  }
  const gap = interval(point.gap, ok.map((s) => s.gap));
  const C = interval(point.C, ok.map((s) => s.C));
  const W = interval(point.W, ok.map((s) => s.W));
  const shareW = interval(point.W / point.gap, ok.map((s) => s.W / s.gap));
  const shareC = interval(point.C / point.gap, ok.map((s) => s.C / s.gap));
  let reading: string;
  if (gap.lo <= 0 && gap.hi >= 0) reading = 'no resolved aggregate gap';
  else if (Math.sign(point.C) !== Math.sign(point.W) && point.C !== 0 && point.W !== 0) reading = 'counteracting components';
  else if (shareW.est >= 2 / 3 && shareW.lo > 1 / 3) reading = 'gap dominated by conditional rates / survival';
  else if (shareC.est >= 2 / 3 && shareC.lo > 1 / 3) reading = 'gap dominated by neighbourhood composition';
  else reading = 'both contribute';
  return { ...base, gap, C, W, shareW, shareC, reading };
}

/**
 * Paired bootstrap: data colonies resampled with replacement, model runs resampled within each colony; each draw
 * pools both sides and splits. Seeded.
 */
export function decompose(data: NbTables[], model: NbTables[][], g: number, q: Quantity, B = 2000, seed = 83): Reading {
  const point = split(binned(poolTables(model.flat()), g, q), binned(poolTables(data), g, q));
  const rng = new RNG(seed);
  const draws: Split[] = [];
  for (let b = 0; b < B; b++) {
    const d = data.map(() => data[rng.int(data.length)]);
    const m = model.flatMap((runs) => runs.map(() => runs[rng.int(runs.length)]));
    draws.push(split(binned(poolTables(m), g, q), binned(poolTables(d), g, q)));
  }
  return readSplit(point, draws);
}

/** B018's site-field bins: E < 0.5, 0.5–1, 1–2, 2–4, ≥ 4. */
const E_EDGES = [0.5, 1, 2, 4];
const eBin = (e: number) => {
  let k = 0;
  while (k < E_EDGES.length && e >= E_EDGES[k]) k++;
  return k;
};

/** E of each 2-mm cell: the mean of its four 1-mm cells of a site field on the rest grid. */
export function cellField(E: ArrayLike<number>): number[] {
  const out = new Array<number>(NB_CELLS);
  for (let c = 0; c < NB_CELLS; c++) {
    const cx = c % 36;
    const cy = Math.floor(c / 36);
    let s = 0;
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) s += E[(2 * cy + dy) * REST_W + 2 * cx + dx];
    out[c] = s / 4;
  }
  return out;
}

/** Descriptive: exposure (frames) and events by bin × E bin (rows: N or A bins; columns: E bins), from cell tables and a cell field. */
export function eCounts(t: NbTables, g: number, q: 'leave' | 'stop', cellE: number[]): { exp: number[][]; ev: number[][] } {
  const G = t.groups[g];
  const nb = q === 'leave' ? A_BINS : N_BINS;
  const ex = q === 'leave' ? G.leaveCellExp : G.stopCellExp;
  const ev = q === 'leave' ? G.leaveCellEv : G.stopCellEv;
  const exp = Array.from({ length: nb }, () => new Array(5).fill(0));
  const evs = Array.from({ length: nb }, () => new Array(5).fill(0));
  for (let b = 0; b < nb; b++)
    for (let c = 0; c < NB_CELLS; c++) {
      const e = ex[b * NB_CELLS + c];
      if (!e || !Number.isFinite(cellE[c])) continue;
      const k = eBin(cellE[c]);
      exp[b][k] += e;
      evs[b][k] += ev[b * NB_CELLS + c];
    }
  return { exp, ev: evs };
}

/** Sum of E-binned counts, and rates per second. */
export function eRates(cs: { exp: number[][]; ev: number[][] }[], frameDt: number): { exp: number[][]; rate: number[][] } {
  const exp = cs[0].exp.map((row, b) => row.map((_, k) => cs.reduce((a, c) => a + c.exp[b][k], 0)));
  const ev = cs[0].ev.map((row, b) => row.map((_, k) => cs.reduce((a, c) => a + c.ev[b][k], 0)));
  return { exp, rate: exp.map((row, b) => row.map((e, k) => (e > 0 ? ev[b][k] / (e * frameDt) : NaN))) };
}

/** Per-bin values of a quantity, for the descriptive tables (rates per second; survival at 2 / 10 / 60 s). */
export function binTable(t: NbTables, g: number): { leave: { w: number[]; r: number[] }; stop: { w: number[]; r: number[] }; surv: { w: number[]; s2: number[]; s10: number[]; s60: number[] } } {
  const G = t.groups[g];
  const tot = G.starts.reduce((a, b) => a + b, 0);
  const at = (sec: number) => G.survEv.map((ev, b) => kmAtLeast(ev, G.survCens[b], Math.round(sec / t.frameDt)));
  return { leave: binned(t, g, 'leave'), stop: binned(t, g, 'stop'), surv: { w: G.starts.map((s) => s / tot), s2: at(2), s10: at(10), s60: at(60) } };
}
