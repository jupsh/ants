// Scratch (not committed): T060 Stage 0, the event-table reader (D243 amendment 1, approved in D244; the lead's dated
// block of 2026-11-03 ≈ 01:04 UTC governs where it is more specific). One exported function, `readStage0`, takes the
// colonies' event tables (events.ts) and returns one JSON-serialisable result; the same code reads Scope A's synthetic
// tables (scopeA.ts) and, later, the tables extracted from the tracks. Stage 1 (ΔA, Δ3) is deferred: nothing of it is
// built here except the matching, which Stage 0 needs.
//
// Fixed by the design (P153–P161):
// - PDC = proximity-defined contact (P155). An interval or bout with an unknown history is never complete (P153);
//   unknowns are counted by cause beside the labels.
// - Triplets: I1, I2, I3 consecutive intervals of one ant, I1 starting at or after 06:00, each ending in an observed
//   onset before 18:00, none with an unknown history, both bouts between them complete. Contact triplet: no PDC in I1
//   or I3, exactly one in I2 (near approaches allowed). Reference triplet: no PDC in I1, I2 or I3 and exactly one near
//   approach in I2. B = frames from I2's first still frame to the PDC (or near approach); A = frames from it to I2's
//   onset (≥ 1 by construction). Whole frames throughout (point 5).
// - Matching cell: role; zone at I2's first still frame (unassigned its own category); 4-h light block of the PDC or
//   near-approach frame; I1 quintile and B quintile (per colony, from the pooled contact and reference triplets, fixed
//   before matching); activity level tertile and slope class from H6's frozen `context` at that frame (none → the
//   triplet is unmatched). Contact triplets in a random order fixed by seed, each taking up to 5 references from its
//   cell, without replacement, never one sharing an interval with it.
// - 0a: a colony counts with ≥ 20 contact triplets having ≥ 1 matched reference; 0a passes with ≥ 15 such colonies.
// - 0b: E = interval − 120 frames, entering at 120 frames if those frames hold no PDC and no unknown history; censored
//   at the first PDC after entry, the history becoming unknown, or 18:00. Per colony a censored Weibull likelihood with
//   one shape k_c and a scale per ant × 4-h block (the entry frame's), fitted on the ants supplying the matched contact
//   triplets, each ant weighted by its share of them; the scale profiled out, (Σ E^k / d)^(1/k); cells with no
//   uncensored interval drop out; k_c maximises the profile over [0.05, 20]. A colony enters with ≥ 10 supplying ants
//   and ≥ 100 uncensored intervals among them; k̄ = exp(mean log k_c) over ≥ 15 entering colonies (else "not
//   established", reason "support"); 2,000-draw colony bootstrap of the k_c.
// - 0b's memoryless reference and reading (D243 amendment 2, D262; P175): the same likelihood with k = 1 on the same
//   ants, weights and cells; 1,000 draws redraw each entering interval's excess as exponential at its cell's rate,
//   censored as the data (data-censored intervals keep their time; onset-ended ones draw one from the colony's weighted
//   reverse Kaplan–Meier conditional on exceeding E, none if its mass beyond E is spent), each fitted exactly as the
//   data; m0 = median of the draws' k̄*. "Established for this comparison" iff the bootstrap lower bound of k̄ divided
//   by m0 exceeds 1.5. The same reference is run on the two descriptive fits, without labels.
// - Stage 0 says "identifiable" only if 0a and 0b both pass.
import { RNG } from '../../../src/sim/core/rng';
import { context, qSorted, median } from '../../frozen/h6/scripts/scratch/h6-next/reader';
import { CAUSES, validateColony, type Ant, type Cause, type ColonyEvents, type Interval } from './events';

export const SEED = 6243;
/** 60 s in frames: every interval's entry time in 0b. */
export const ENTRY = 120;
/** A 4-h light block in frames. */
export const BLOCK = 28800;
export const MAX_REFS = 5;
export const MIN_MATCHED = 20;
export const MIN_COLONIES = 15;
export const MIN_ANTS_0B = 10;
export const MIN_UNCENSORED_0B = 100;
export const K_MIN = 0.05;
export const K_MAX = 20;
export const K_THRESHOLD = 1.5;
export const BOOT = 2000;
/** RNG purposes (keys after SEED and the caller's keys). */
const P_CONTACT_ORDER = 1, P_REF_ORDER = 2, P_BOOT = 3;

export const LABEL_ESTABLISHED = 'established for this comparison';
export const LABEL_NOT_ESTABLISHED = 'a characteristic interval was not established for this comparison';
export const ASSUMPTION_0B = 'Censoring is assumed independent of the ant\'s timing state given ant and block; that cannot be checked here.';

// ------------------------------------------------------------------------------------------------------------- helpers
const blockOf = (c: ColonyEvents, f: number): number => Math.floor((f - c.lightStart) / BLOCK);
const zoneName = (z: number | null): string => (z === null ? 'U' : z === 0 ? 'L' : z === 1 ? 'H' : `Z${z}`);
// EDGE: an onset on frame lightEnd (18:00:00 exactly) or later is not observed in the light phase: the interval is
// censored at 18:00 (0b) and cannot be part of a triplet.
const observedOnset = (c: ColonyEvents, v: Interval): boolean => v.onset !== null && v.onset < c.lightEnd;
/** Events observed before the history became unknown (all of them if it never did). */
const before = (arr: number[], v: Interval): number[] => (v.unknownFrame === null ? arr : arr.filter((f) => f < v.unknownFrame!));

export function shuffle<T>(xs: T[], rng: RNG): T[] {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}
/** Quintile cuts of a pooled sample (qSorted at 0.2 … 0.8, as H6's tertiles) and the class of a value. */
export function quintileCuts(v: number[]): number[] {
  const s = v.slice().sort((a, b) => a - b);
  return [0.2, 0.4, 0.6, 0.8].map((p) => qSorted(s, p));
}
export const classOf = (cuts: number[], x: number): number => { let k = 0; while (k < cuts.length && x >= cuts[k]) k++; return k; };

class Tally {
  readonly m: Record<string, number> = {};
  add(k: string, n = 1): void { this.m[k] = (this.m[k] ?? 0) + n; }
}

// ------------------------------------------------------------------------------------------------------------ triplets
export type Kind = 'contact' | 'reference';
export interface Triplet {
  kind: Kind;
  /** Index of the ant in the colony's `ants`, and of I1 in its intervals (I2 = j + 1, I3 = j + 2). */
  ant: number;
  j: number;
  /** The PDC (contact) or near-approach (reference) frame in I2. */
  f: number;
  I1: number;
  B: number;
  A: number;
  role: string;
  zone: string;
  block: number;
  /** H6's frozen context at f, or null (the triplet is then unmatched). */
  level: number | null;
  slope: number | null;
}

/** Why a candidate (three consecutive intervals, I1 starting in the light phase) is not a triplet, or 'complete'. */
type Status = 'complete' | 'noOnset' | Cause;

function candidateStatus(c: ColonyEvents, a: Ant, j: number): Status {
  // The earliest unknown element in time order (I1, bout, I2, bout, I3) gives the cause.
  for (let q = 0; q < 3; q++) {
    const v = a.intervals[j + q];
    if (v.unknownFrame !== null) return v.cause!;
    if (q < 2 && !a.bouts[j + q].complete) return a.bouts[j + q].cause!;
  }
  for (let q = 0; q < 3; q++) if (!observedOnset(c, a.intervals[j + q])) return 'noOnset';
  return 'complete';
}
/** The pattern of the observed events: a contact or reference pattern, or neither. */
function pattern(a: Ant, j: number): { kind: Kind; f: number } | null {
  const [i1, i2, i3] = [a.intervals[j], a.intervals[j + 1], a.intervals[j + 2]];
  const p1 = before(i1.pdc, i1), p2 = before(i2.pdc, i2), p3 = before(i3.pdc, i3);
  if (p1.length || p3.length) return null;
  if (p2.length === 1) return { kind: 'contact', f: p2[0] };
  const n2 = before(i2.near, i2);
  if (p2.length === 0 && n2.length === 1) return { kind: 'reference', f: n2[0] };
  return null;
}

export interface ColonyTriplets {
  triplets: Triplet[];
  /** Candidates with a contact or reference pattern of observed events, by status (complete = a triplet). */
  candidates: Record<Kind, Record<string, number>>;
}
export function buildTriplets(c: ColonyEvents, ctx: ReturnType<typeof context>): ColonyTriplets {
  const triplets: Triplet[] = [];
  const candidates: Record<Kind, Tally> = { contact: new Tally(), reference: new Tally() };
  c.ants.forEach((a, ai) => {
    for (let j = 0; j + 2 < a.intervals.length; j++) {
      const i1 = a.intervals[j], i2 = a.intervals[j + 1];
      if (i1.start < c.lightStart || i1.start >= c.lightEnd) continue;
      const p = pattern(a, j);
      if (!p) continue;
      const st = candidateStatus(c, a, j);
      candidates[p.kind].add(st);
      if (st !== 'complete') continue;
      const cx = ctx(p.f);
      triplets.push({
        kind: p.kind, ant: ai, j, f: p.f, I1: i1.onset! - i1.start, B: p.f - i2.start, A: i2.onset! - p.f,
        role: a.role, zone: zoneName(i2.zone), block: blockOf(c, p.f), level: cx ? cx.level : null, slope: cx ? cx.slope : null,
      });
    }
  });
  return { triplets, candidates: { contact: candidates.contact.m, reference: candidates.reference.m } };
}

// ------------------------------------------------------------------------------------------------------------ matching
export interface Matching {
  /** Quintile cuts (fixed before matching) of I1 and B, from the pooled contact and reference triplets. */
  cutsI1: number[];
  cutsB: number[];
  /** Per contact triplet (index into the triplet list), the reference triplets matched to it (indices), in the order
   * taken. */
  matches: Map<number, number[]>;
  /** Contact triplets left unmatched because their frame has no activity context. */
  noContext: number;
}
export const cellKey = (t: Triplet, cutsI1: number[], cutsB: number[]): string | null =>
  t.level === null || t.slope === null ? null : `${t.role}|${t.zone}|${t.block}|${classOf(cutsI1, t.I1)}|${classOf(cutsB, t.B)}|${t.level}|${t.slope}`;
const shareInterval = (x: Triplet, y: Triplet): boolean => x.ant === y.ant && Math.abs(x.j - y.j) <= 2;

/** Matching as amendment 1 point 5: contact triplets in a seeded random order, each taking up to 5 unused references
 * of its cell that share no interval with it. */
export function matchColony(ts: Triplet[], keys: number[], colony: number): Matching {
  const cutsI1 = quintileCuts(ts.map((t) => t.I1)), cutsB = quintileCuts(ts.map((t) => t.B));
  const cIdx: number[] = [], rIdx: number[] = [];
  ts.forEach((t, k) => (t.kind === 'contact' ? cIdx : rIdx).push(k));
  const cOrder = shuffle(cIdx, RNG.stream(SEED, P_CONTACT_ORDER, ...keys, colony));
  // EDGE: neither text says which references a contact triplet takes when its cell holds more than 5 eligible ones;
  // here they are taken in a second seeded random order (one per colony, fixed before matching).
  const rOrder = shuffle(rIdx, RNG.stream(SEED, P_REF_ORDER, ...keys, colony));
  const byCell = new Map<string, number[]>();
  for (const k of rOrder) {
    const key = cellKey(ts[k], cutsI1, cutsB);
    if (key === null) continue;
    let l = byCell.get(key);
    if (!l) byCell.set(key, (l = []));
    l.push(k);
  }
  const used = new Set<number>();
  const matches = new Map<number, number[]>();
  let noContext = 0;
  for (const k of cOrder) {
    const key = cellKey(ts[k], cutsI1, cutsB);
    if (key === null) { noContext++; continue; }
    const got: number[] = [];
    for (const r of byCell.get(key) ?? []) {
      if (got.length >= MAX_REFS) break;
      if (used.has(r) || shareInterval(ts[k], ts[r])) continue;
      used.add(r);
      got.push(r);
    }
    if (got.length) matches.set(k, got);
  }
  return { cutsI1, cutsB, matches, noContext };
}

// -------------------------------------------------------------------------------------------------------- Weibull fit
/** One ant × block cell's excesses (frames): `logE` of all of them (> 0), `m` their maximum, `d` the number
 * uncensored, `sumLogE` over those, `sumE` over all. */
export interface Cell { w: number; logE: Float64Array; m: number; d: number; sumLogE: number; sumE: number }
/** Builds a cell from (E, uncensored) records; censored records of length 0 add nothing and are dropped. */
export function makeCell(w: number, recs: [number, boolean][]): Cell {
  const L: number[] = [];
  let d = 0, sumLogE = 0, sumE = 0, m = -Infinity;
  for (const [e, u] of recs) {
    if (u) { if (!(e > 0)) throw new Error('uncensored excess must be > 0'); d++; sumLogE += Math.log(e); }
    if (e > 0) { const l = Math.log(e); L.push(l); sumE += e; if (l > m) m = l; }
  }
  return { w, logE: Float64Array.from(L), m, d, sumLogE, sumE };
}
/** Cells with at least one uncensored interval, flattened (one code path for the data's fit and the reference's):
 * cell q's log excesses are L[off[q] .. off[q + 1]), with weight w, d uncensored, S = Σ log E over those, m = max log E. */
export interface Flat { n: number; off: Int32Array; w: Float64Array; d: Float64Array; S: Float64Array; m: Float64Array; L: Float64Array }
export function newFlat(cells: number, recs: number): Flat {
  return { n: 0, off: new Int32Array(cells + 1), w: new Float64Array(cells), d: new Float64Array(cells), S: new Float64Array(cells), m: new Float64Array(cells), L: new Float64Array(recs) };
}
export function flatOf(cells: Cell[]): Flat {
  const live = cells.filter((c) => c.d > 0);
  const f = newFlat(live.length, live.reduce((s, c) => s + c.logE.length, 0));
  let o = 0;
  live.forEach((c, q) => { f.w[q] = c.w; f.d[q] = c.d; f.S[q] = c.sumLogE; f.m[q] = c.m; f.L.set(c.logE, o); o += c.logE.length; f.off[q + 1] = o; });
  f.n = live.length;
  return f;
}
/** Weighted profile log-likelihood over k (the scale profiled out per cell) and its first and second derivatives in k. */
export function profileFlat(f: Flat, k: number, withLL: boolean): { ll: number; dll: number; d2ll: number } {
  let ll = 0, dll = 0, d2ll = 0;
  const L = f.L;
  for (let c = 0; c < f.n; c++) {
    const m = f.m[c], d = f.d[c], w = f.w[c];
    let T = 0, TL = 0, TLL = 0;
    for (let q = f.off[c], e = f.off[c + 1]; q < e; q++) { const l = L[q] - m; const x = Math.exp(k * l); T += x; TL += x * l; TLL += x * l * l; }
    // moments of log E about its maximum m (numerically stable); the weighted mean log E under E^k is m + TL / T
    const mu = TL / T, v = Math.max(0, TLL / T - mu * mu);
    if (withLL) ll += w * (d * Math.log(k) - d * (k * m + Math.log(T) - Math.log(d)) + (k - 1) * f.S[c] - d);
    dll += w * (d / k - d * (m + mu) + f.S[c]);
    d2ll += w * (-d / (k * k) - d * v);
  }
  return { ll, dll, d2ll };
}
export const profile = (cells: Cell[], k: number) => profileFlat(flatOf(cells), k, true);
/** The weighted profile MLE of k on [K_MIN, K_MAX]. The profile is concave in k, so its derivative falls with k: a
 * Newton iteration kept inside a shrinking bracket (bisection in log k when a step leaves it), from k = 1. */
export function fitFlat(f: Flat, withLL = true): { k: number; ll: number; ll1: number; atBound: boolean } {
  if (!f.n) return { k: NaN, ll: NaN, ll1: NaN, atBound: false };
  const uMin = Math.log(K_MIN), uMax = Math.log(K_MAX);
  let lo = uMin, hi = uMax, u = 0;
  for (let it = 0; it < 200; it++) {
    const k = Math.exp(u);
    const p = profileFlat(f, k, false);
    if (p.dll > 0) lo = u; else hi = u;
    const kn = p.d2ll < 0 ? k - p.dll / p.d2ll : NaN;
    let un = kn > 0 ? Math.log(kn) : NaN;
    // converged: the Newton step is below 1e-10 in log k (checked before the bracket, which a step this small may touch)
    if (Math.abs(un - u) < 1e-10) { u = un; break; }
    if (!(un > lo && un < hi)) un = (lo + hi) / 2;
    const done = hi - lo < 1e-10;
    u = un;
    if (done) break;
  }
  let k = Math.exp(u), atBound = false;
  if (hi - u < 1e-6 && hi === uMax && profileFlat(f, K_MAX, false).dll >= 0) { k = K_MAX; atBound = true; }
  else if (u - lo < 1e-6 && lo === uMin && profileFlat(f, K_MIN, false).dll <= 0) { k = K_MIN; atBound = true; }
  return { k, ll: withLL ? profileFlat(f, k, true).ll : NaN, ll1: withLL ? profileFlat(f, 1, true).ll : NaN, atBound };
}
export const fitShape = (cells: Cell[], withLL = true) => fitFlat(flatOf(cells), withLL);

// ----------------------------------------------------------------------------------------------------------------- 0b
// EDGE: in the descriptive fit "with PDCs not censoring" (`noPdc`) PDCs neither censor E nor block entry; only the
// unknown history and 18:00 censor.
export type Mode = 'primary' | 'noPdc';
export interface Excess { E: number; uncensored: boolean; block: number }
export interface EntryCounts { light: number; entered: number; pdcBeforeEntry: number; unknownBeforeEntry: number; tooLate: number; zeroExcess: number }
/** An interval's excess record, or the reason it does not enter. `noPdc`: PDCs neither block entry nor censor. */
export function excessOf(c: ColonyEvents, v: Interval, mode: Mode): Excess | keyof EntryCounts {
  const entry = v.start + ENTRY;
  // EDGE: an interval whose entry frame is at or after 18:00 does not enter (it would add a zero-length censored excess).
  if (entry >= c.lightEnd) return 'tooLate';
  if (v.unknownFrame !== null && v.unknownFrame < entry) return 'unknownBeforeEntry';
  if (mode === 'primary' && v.pdc.some((f) => f < entry)) return 'pdcBeforeEntry';
  // EDGE: an onset exactly at 120 frames (E = 0, the ant no longer still at the entry frame) does not enter: an
  // uncensored excess of 0 has no Weibull density. Scope A's generator never makes one (E ≥ 1 frame).
  if (v.onset !== null && v.onset <= entry) return 'zeroExcess';
  let end = c.lightEnd, event = false;
  if (v.onset !== null && v.onset < end) { end = v.onset; event = true; }
  if (mode === 'primary') { const p = v.pdc.find((f) => f >= entry); if (p !== undefined && p < end) { end = p; event = false; } }
  if (v.unknownFrame !== null && v.unknownFrame < end) { end = v.unknownFrame; event = false; }
  return { E: end - entry, uncensored: event, block: blockOf(c, entry) };
}

export interface ColonyFit {
  label: string;
  supplyingAnts: number;
  uncensored: number;
  intervals: number;
  enters: boolean;
  k: number;
  atBound: boolean;
  /** Weighted log-likelihood at k_c and at k = 1 (the memoryless reference, P157). */
  logLik: number;
  logLik1: number;
  cells: number;
  droppedCells: number;
  /** Uncensored intervals per kept cell: median, and the share of cells with at most 2 (descriptive: the shape's profile
   * MLE with a scale per cell is biased upward when cells are small). */
  dPerCell: { median: number; shareAtMost2: number };
  /** The memoryless reference's per ant × block rates (per s), with d and exposure (s); primary fit only. */
  rates?: { ant: number; block: number; d: number; exposureS: number; ratePerS: number }[];
}
/** One ant × block cell of a 0b fit: the ant's weight and its (E frames, uncensored) records, in entry order. */
export interface FitCell { ant: number; block: number; w: number; recs: [number, boolean][] }
/** What a colony's 0b fit (and its memoryless reference) runs on: the kept cells (≥ 1 uncensored interval each). */
export interface FitInput { label: string; supplyingAnts: number; uncensored: number; intervals: number; droppedCells: number; cells: FitCell[] }
/** A colony's 0b fit input on the given ants (index → count of matched triplets supplied; weights are the shares). */
export function fitInputOf(c: ColonyEvents, supply: Map<number, number>, mode: Mode): FitInput {
  let total = 0;
  for (const n of supply.values()) total += n;
  const cells: FitCell[] = [];
  let uncensored = 0, intervals = 0, dropped = 0;
  for (const [ai, n] of [...supply.entries()].sort((x, y) => x[0] - y[0])) {
    const a = c.ants[ai];
    const byBlock = new Map<number, [number, boolean][]>();
    for (const v of a.intervals) {
      if (v.start < c.lightStart || v.start >= c.lightEnd) continue;
      const x = excessOf(c, v, mode);
      if (typeof x === 'string') continue;
      intervals++;
      if (x.uncensored) uncensored++;
      let l = byBlock.get(x.block);
      if (!l) byBlock.set(x.block, (l = []));
      l.push([x.E, x.uncensored]);
    }
    for (const [b, recs] of [...byBlock.entries()].sort((x, y) => x[0] - y[0])) {
      if (!recs.some((r) => r[1])) { dropped++; continue; }
      cells.push({ ant: a.id, block: b, w: n / total, recs });
    }
  }
  return { label: c.label, supplyingAnts: supply.size, uncensored, intervals, droppedCells: dropped, cells };
}
/** The fit on a colony's input: k_c, the entry rule, the log-likelihoods at k_c and k = 1, cell sizes, rates. */
export function fitFromInput(inp: FitInput, withRates: boolean): ColonyFit {
  const cells = inp.cells.map((x) => makeCell(x.w, x.recs));
  const enters = inp.supplyingAnts >= MIN_ANTS_0B && inp.uncensored >= MIN_UNCENSORED_0B;
  const fit = fitShape(cells);
  const out: ColonyFit = { label: inp.label, supplyingAnts: inp.supplyingAnts, uncensored: inp.uncensored, intervals: inp.intervals, enters, k: fit.k, atBound: fit.atBound, logLik: fit.ll, logLik1: fit.ll1, cells: cells.length, droppedCells: inp.droppedCells, dPerCell: { median: median(cells.map((x) => x.d)), shareAtMost2: cells.length ? cells.filter((x) => x.d <= 2).length / cells.length : NaN } };
  if (withRates) out.rates = cells.map((cl, q) => { const ex = cl.sumE / 2; return { ant: inp.cells[q].ant, block: inp.cells[q].block, d: cl.d, exposureS: ex, ratePerS: cl.d / ex }; });
  return out;
}
/** One colony's 0b fit on the given ants (index → count of matched triplets supplied). */
export const fitColony = (c: ColonyEvents, supply: Map<number, number>, mode: Mode, withRates: boolean): ColonyFit => fitFromInput(fitInputOf(c, supply, mode), withRates);

export interface Kbar { entering: number; kbar: number; lo: number; hi: number; support: boolean }
/** k̄ = exp(mean log k_c) over the entering colonies and its 2,000-draw colony-bootstrap 95 % interval (support: ≥ 15
 * entering colonies, else NaN). */
export function kbarOf(fits: ColonyFit[], rng: RNG, B = BOOT): Kbar {
  const lk = fits.filter((f) => f.enters && Number.isFinite(f.k)).map((f) => Math.log(f.k));
  const n = lk.length;
  if (n < MIN_COLONIES) return { entering: n, kbar: NaN, lo: NaN, hi: NaN, support: false };
  const bs: number[] = [];
  for (let b = 0; b < B; b++) { let s = 0; for (let q = 0; q < n; q++) s += lk[rng.int(n)]; bs.push(Math.exp(s / n)); }
  bs.sort((x, y) => x - y);
  return { entering: n, kbar: Math.exp(lk.reduce((s, x) => s + x, 0) / n), lo: qSorted(bs, 0.025), hi: qSorted(bs, 0.975), support: true };
}

// --------------------------------------------------------------------------------- 0b's memoryless reference (D262)
/** A weighted reverse Kaplan–Meier estimate of the censoring distribution (censorings as events, onsets as censored;
 * at a tied time the onsets stay at risk, as a censored record does in the ordinary estimator): the censoring times
 * `t` (ascending) with their probability masses, `cum[j]` = Σ masses before j, and `left` = the mass beyond the last
 * censoring time (positive when the longest record ended in an onset). */
export interface ReverseKM {
  t: Float64Array; mass: Float64Array; cum: Float64Array; left: number;
  /** Bucket index: bi[g] = the first j with cum[j + 1] > g / NB (a faster start for the same search). */
  bi: Int32Array;
}
const NB = 4096;
export function reverseKM(recs: { E: number; uncensored: boolean; w: number }[]): ReverseKM {
  const r = recs.slice().sort((x, y) => x.E - y.E);
  let atRisk = r.reduce((s, x) => s + x.w, 0);
  let G = 1;
  const t: number[] = [], mass: number[] = [], cum: number[] = [0];
  for (let i = 0; i < r.length;) {
    let j = i, cens = 0, all = 0;
    while (j < r.length && r[j].E === r[i].E) { all += r[j].w; if (!r[j].uncensored) cens += r[j].w; j++; }
    if (cens > 0 && atRisk > 0) {
      const G1 = G * (1 - cens / atRisk);
      t.push(r[i].E); mass.push(G - G1); cum.push(cum[cum.length - 1] + G - G1);
      G = G1;
    }
    atRisk -= all;
    i = j;
  }
  const C = Float64Array.from(cum), n = t.length, bi = new Int32Array(NB + 1);
  for (let g = 0, j = 0; g <= NB; g++) { while (j < n && C[j + 1] <= g / NB) j++; bi[g] = j; }
  return { t: Float64Array.from(t), mass: Float64Array.from(mass), cum: C, left: Math.max(0, G), bi };
}
/** The first reverse-KM index with t > E, and the mass beyond E (censoring times after E plus the mass left beyond the
 * last one). */
export function beyondOf(km: ReverseKM, E: number): [number, number] {
  let lo = 0, hi = km.t.length;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (km.t[mid] > E) hi = mid; else lo = mid + 1; }
  return [lo, km.cum[km.t.length] - km.cum[lo] + km.left];
}
/** The censoring time for uniform u, given beyondOf(E) = [j0, beyond]: Infinity when that mass is spent or u falls in
 * the mass beyond the last censoring time. */
export function censorAt(km: ReverseKM, j0: number, beyond: number, u: number): number {
  if (!(beyond > 1e-12)) return Infinity;
  const target = km.cum[j0] + u * beyond, n = km.t.length, cum = km.cum;
  // the first j ≥ j0 with cum[j + 1] > target; every j below bi[g] has cum[j + 1] ≤ g / NB ≤ target
  let a = Math.max(j0, km.bi[Math.min(NB, Math.floor(target * NB))]);
  while (a < n && cum[a + 1] <= target) a++;
  return a < n ? km.t[a] : Infinity;
}
/** A censoring time drawn from the reverse Kaplan–Meier conditional on exceeding E (Efron's conditional scheme), or
 * Infinity (no censoring) when the draw falls in the mass beyond the last censoring time or that mass is spent. */
export function drawCensor(km: ReverseKM, E: number, rng: RNG): number {
  const [j0, bey] = beyondOf(km, E);
  return censorAt(km, j0, bey, rng.next());
}
export const REF_DRAWS = 1000;
const P_REF = 4;
/** The memoryless reference's k̄* draws: for each colony entering 0b, k fixed at 1 on the fit's ants, weights and cells
 * (λ = d / ΣE per cell); each draw keeps every interval's entry and redraws its excess as exponential at its cell's λ,
 * observed up to a censoring time (a data-censored interval keeps its own; an onset-ended one draws one from the
 * colony's weighted reverse Kaplan–Meier conditional on exceeding its E, none if that mass is spent), then fits it
 * exactly as the data. k̄* = exp(mean over the entering colonies of log k_c*). */
export function referenceDraws(inputs: FitInput[], enters: boolean[], keys: number[], purpose: number, draws = REF_DRAWS): number[] {
  const sums = new Float64Array(draws), ns = new Int32Array(draws);
  inputs.forEach((inp, ci) => {
    if (!enters[ci]) return;
    const km = reverseKM(inp.cells.flatMap((c) => c.recs.map(([E, u]) => ({ E, uncensored: u, w: c.w }))));
    const nC = inp.cells.length;
    const nRec = inp.cells.reduce((s, c) => s + c.recs.length, 0);
    // per record: E, uncensored, and (onset-ended) the first reverse-KM index beyond E and the mass beyond E
    const E = new Float64Array(nRec), U = new Uint8Array(nRec), J0 = new Int32Array(nRec), BEY = new Float64Array(nRec);
    const lam = new Float64Array(nC), cOff = new Int32Array(nC + 1);
    let r = 0;
    inp.cells.forEach((c, q) => {
      let d = 0, S = 0;
      for (const [e, u] of c.recs) {
        E[r] = e; U[r] = u ? 1 : 0; S += e; if (u) d++;
        if (u) { const [j0, bey] = beyondOf(km, e); J0[r] = j0; BEY[r] = bey; }
        r++;
      }
      lam[q] = d / S; cOff[q + 1] = r;
    });
    const f = newFlat(nC, nRec);
    for (let b = 0; b < draws; b++) {
      const rng = RNG.stream(SEED, P_REF, ...keys, purpose, ci, b);
      let n = 0, o = 0;
      for (let q = 0; q < nC; q++) {
        let d = 0, S = 0, m = -Infinity;
        const o0 = o, il = 1 / lam[q];
        for (let i = cOff[q]; i < cOff[q + 1]; i++) {
          // the censoring time: the data's for a censored interval; for an onset-ended one a draw from the reverse
          // Kaplan–Meier conditional on exceeding E (Infinity when that mass is spent or the draw falls beyond the last
          // censoring time); the same draw as `drawCensor`, with the search start precomputed
          let C = E[i];
          if (U[i]) C = censorAt(km, J0[i], BEY[i], rng.next());
          // EDGE: the redrawn excess takes whole frames, at least 1, as the data's (round, as Scope A's generator); it
          // is an onset only if it falls before the censoring frame (an onset on the censoring frame is censored, as in
          // the data, where a censoring PDC, unknown frame or 18:00 always precedes the onset).
          const X = Math.max(1, Math.round(-Math.log(1 - rng.next()) * il));
          if (X < C) { d++; const l = Math.log(X); S += l; f.L[o++] = l; if (l > m) m = l; }
          else if (C > 0) { const l = Math.log(C); f.L[o++] = l; if (l > m) m = l; }
        }
        if (!d) { o = o0; continue; } // a cell with no uncensored interval drops out, as in the data's fit
        f.w[n] = inp.cells[q].w; f.d[n] = d; f.S[n] = S; f.m[n] = m; f.off[n + 1] = o; n++;
      }
      f.n = n;
      const fit = fitFlat(f, false);
      // EDGE: the colonies are those entering 0b on the data; a draw does not re-apply the entry rule, and a colony
      // whose draw has no uncensored interval at all (never seen) would be left out of that draw's mean.
      if (Number.isFinite(fit.k)) { sums[b] += Math.log(fit.k); ns[b]++; }
    }
  });
  return Array.from(sums, (s, b) => Math.exp(s / ns[b]));
}

export interface Read0b extends Kbar {
  /** The memoryless reference: m0 = median of the k̄* draws, their 2.5th and 97.5th percentiles, and the draws used. */
  m0: number; refP025: number; refP975: number; draws: number;
  /** k̄ / m0 and its interval (the colony-bootstrap bounds of k̄ divided by m0). */
  ratio: number; ratioLo: number; ratioHi: number;
  colonies: ColonyFit[];
  dPerCellByColony: { label: string; median: number; shareAtMost2: number }[];
}
export interface Label0b { label: string; reason: string | null; pass: boolean }
/** 0b on fit inputs: the fits, k̄ with its bootstrap, the memoryless reference (only with support), and the reading. */
export function read0b(inputs: FitInput[], o: { keys: number[]; purpose: number; boot?: number; draws?: number; withRates?: boolean }): Read0b {
  const fits = inputs.map((inp) => fitFromInput(inp, !!o.withRates));
  const kb = kbarOf(fits, RNG.stream(SEED, P_BOOT, ...o.keys, o.purpose), o.boot ?? BOOT);
  const draws = o.draws ?? REF_DRAWS;
  let m0 = NaN, p025 = NaN, p975 = NaN;
  if (kb.support) {
    const ks = referenceDraws(inputs, fits.map((f) => f.enters && Number.isFinite(f.k)), o.keys, o.purpose, draws).sort((x, y) => x - y);
    m0 = median(ks); p025 = qSorted(ks, 0.025); p975 = qSorted(ks, 0.975);
  }
  return {
    ...kb, m0, refP025: p025, refP975: p975, draws: kb.support ? draws : 0, ratio: kb.kbar / m0, ratioLo: kb.lo / m0, ratioHi: kb.hi / m0, colonies: fits,
    dPerCellByColony: fits.map((f) => ({ label: f.label, ...f.dPerCell })),
  };
}
/** The reading (D262): established iff the lower bound of k̄'s colony-bootstrap interval, divided by m0, exceeds 1.5. */
export function label0b(r: Read0b): Label0b {
  const pass = r.support && r.ratioLo > K_THRESHOLD;
  return { label: pass ? LABEL_ESTABLISHED : LABEL_NOT_ESTABLISHED, reason: pass ? null : !r.support ? 'support' : 'lower bound / m0 not above 1.5', pass };
}

// ------------------------------------------------------------------------------------------------------------- reader
export interface ReadOptions {
  /** Keys after SEED for the matching and bootstrap streams (a synthetic data set's (case, set); none for real data). */
  keys?: number[];
  boot?: number;
  /** The memoryless reference's draws (1,000 in the design; fewer only in tests). */
  draws?: number;
}

const ctxName = (cx: { level: number; slope: number } | undefined | null): string => (cx ? `L${cx.level}S${cx.slope}` : 'none');

/** Stage 0 on the colonies' event tables: 0a, 0b, the overall label and the descriptives (JSON-serialisable). */
export function readStage0(cols: ColonyEvents[], o: ReadOptions = {}) {
  const keys = o.keys ?? [];
  const B = o.boot ?? BOOT;
  for (const c of cols) validateColony(c);
  const perColony = cols.map((c, ci) => {
    const ctx = context(c.bins);
    const { triplets, candidates } = buildTriplets(c, ctx);
    const m = matchColony(triplets, keys, ci);
    const supplyC = new Map<number, number>(), supplyR = new Map<number, number>();
    for (const [k, refs] of m.matches) {
      supplyC.set(triplets[k].ant, (supplyC.get(triplets[k].ant) ?? 0) + 1);
      for (const r of refs) supplyR.set(triplets[r].ant, (supplyR.get(triplets[r].ant) ?? 0) + 1);
    }
    // ---- descriptives: intervals, bouts, triplets by role, zone and context; unknowns by cause
    const iv = { all: { role: new Tally(), zone: new Tally(), context: new Tally() }, complete: { role: new Tally(), zone: new Tally(), context: new Tally() } };
    const ivUnknown = new Tally(), boutUnknown = new Tally();
    let nIv = 0, nBout = 0, nIvComplete = 0;
    const entry: Record<Mode, EntryCounts> = { primary: { light: 0, entered: 0, pdcBeforeEntry: 0, unknownBeforeEntry: 0, tooLate: 0, zeroExcess: 0 }, noPdc: { light: 0, entered: 0, pdcBeforeEntry: 0, unknownBeforeEntry: 0, tooLate: 0, zeroExcess: 0 } };
    for (const a of c.ants) {
      a.intervals.forEach((v, j) => {
        if (v.start < c.lightStart || v.start >= c.lightEnd) return;
        nIv++;
        const cxs = ctxName(ctx(v.start));
        iv.all.role.add(a.role); iv.all.zone.add(zoneName(v.zone)); iv.all.context.add(cxs);
        if (v.unknownFrame !== null) ivUnknown.add(v.cause!);
        else if (observedOnset(c, v)) { nIvComplete++; iv.complete.role.add(a.role); iv.complete.zone.add(zoneName(v.zone)); iv.complete.context.add(cxs); }
        for (const md of ['primary', 'noPdc'] as Mode[]) { const x = excessOf(c, v, md); entry[md].light++; if (typeof x === 'string') entry[md][x]++; else entry[md].entered++; }
        if (j < a.bouts.length && observedOnset(c, v)) { nBout++; if (!a.bouts[j].complete) boutUnknown.add(a.bouts[j].cause!); }
      });
    }
    const trip = { contact: { role: new Tally(), zone: new Tally(), context: new Tally() }, reference: { role: new Tally(), zone: new Tally(), context: new Tally() }, matchedContact: { role: new Tally(), zone: new Tally(), context: new Tally() }, matchedReference: { role: new Tally(), zone: new Tally(), context: new Tally() } };
    const put = (t: (typeof trip)['contact'], x: Triplet) => { t.role.add(x.role); t.zone.add(x.zone); t.context.add(x.level === null ? 'none' : `L${x.level}S${x.slope}`); };
    triplets.forEach((x) => put(trip[x.kind], x));
    for (const [k, refs] of m.matches) { put(trip.matchedContact, triplets[k]); for (const r of refs) put(trip.matchedReference, triplets[r]); }
    const tab = (t: (typeof trip)['contact']) => ({ role: t.role.m, zone: t.zone.m, context: t.context.m });
    const nContact = triplets.filter((t) => t.kind === 'contact').length;
    let nRefsUsed = 0;
    for (const refs of m.matches.values()) nRefsUsed += refs.length;
    return {
      c, triplets, m, supplyC, supplyR,
      summary: {
        label: c.label,
        ants: c.ants.length,
        contactTriplets: nContact,
        referenceTriplets: triplets.length - nContact,
        matchedContactTriplets: m.matches.size,
        matchedReferences: nRefsUsed,
        contactNoContext: m.noContext,
        counts0a: m.matches.size >= MIN_MATCHED,
        quintiles: { I1: m.cutsI1, B: m.cutsB },
      },
      descriptives: {
        label: c.label,
        intervals: { light: nIv, complete: nIvComplete, byRole: iv.all.role.m, byZone: iv.all.zone.m, byContext: iv.all.context.m, completeByRole: iv.complete.role.m, completeByZone: iv.complete.zone.m, completeByContext: iv.complete.context.m, unknownByCause: ivUnknown.m },
        bouts: { afterLightIntervals: nBout, unknownByCause: boutUnknown.m },
        entry0b: entry,
        triplets: { contact: tab(trip.contact), reference: tab(trip.reference), matchedContact: tab(trip.matchedContact), matchedReference: tab(trip.matchedReference) },
        candidates,
      },
    };
  });

  // ---- 0a
  const nCounting = perColony.filter((p) => p.summary.counts0a).length;
  const s0a = {
    coloniesCounting: nCounting,
    pass: nCounting >= MIN_COLONIES,
    matchedContactTriplets: perColony.map((p) => p.summary.matchedContactTriplets),
    rule: `a colony counts with >= ${MIN_MATCHED} contact triplets having >= 1 matched reference; 0a passes with >= ${MIN_COLONIES} such colonies`,
  };

  // ---- 0b
  // EDGE: the descriptive fit on the ants supplying the matched references weights each by its share of the colony's
  // matched (used) references, as the primary weights by matched contact triplets.
  const fitAll = (which: 'contact' | 'reference', mode: Mode, purpose: number) =>
    read0b(perColony.map((p) => fitInputOf(p.c, which === 'contact' ? p.supplyC : p.supplyR, mode)), { keys, purpose, boot: B, draws: o.draws, withRates: which === 'contact' && mode === 'primary' });
  const primary = fitAll('contact', 'primary', 0);
  const lab = label0b(primary);
  const s0b = {
    ...lab,
    kbar: primary.kbar,
    lo: primary.lo,
    hi: primary.hi,
    m0: primary.m0,
    refP025: primary.refP025,
    refP975: primary.refP975,
    ratio: primary.ratio,
    ratioLo: primary.ratioLo,
    ratioHi: primary.ratioHi,
    entering: primary.entering,
    kByColony: primary.colonies.map((f) => ({ label: f.label, k: f.k, enters: f.enters, supplyingAnts: f.supplyingAnts, uncensored: f.uncensored })),
    dPerCellByColony: primary.dPerCellByColony,
    reading: 'established iff the lower bound of the colony-bootstrap 95 % interval of k̄, divided by m0 (the median k̄* of the memoryless reference), exceeds 1.5 (D262)',
    assumption: ASSUMPTION_0B,
    primary,
    descriptive: {
      note: 'the same fit and memoryless reference, reported without labels',
      referenceSupplyingAnts: fitAll('reference', 'primary', 1),
      pdcNotCensoring: fitAll('contact', 'noPdc', 2),
    },
  };
  const reasons: string[] = [];
  if (!s0a.pass) reasons.push('0a: support');
  if (!s0b.pass) reasons.push(`0b: ${LABEL_NOT_ESTABLISHED}${s0b.reason === 'support' ? ' (support)' : ''}`);
  const sum = (f: (d: (typeof perColony)[number]['descriptives']) => Record<string, number>) => {
    const t = new Tally();
    for (const p of perColony) for (const [k, n] of Object.entries(f(p.descriptives))) t.add(k, n);
    return t.m;
  };
  const tot = (f: (d: (typeof perColony)[number]['descriptives']) => number) => perColony.reduce((s, p) => s + f(p.descriptives), 0);
  const nLight = tot((d) => d.intervals.light), nBouts = tot((d) => d.bouts.afterLightIntervals);
  const frac = (m: Record<string, number>, n: number) => Object.fromEntries(CAUSES.filter((k) => m[k]).map((k) => [k, m[k] / n]));
  const cand = (kind: Kind) => {
    const m = sum((d) => d.candidates[kind]);
    const n = Object.values(m).reduce((s, x) => s + x, 0);
    return { candidates: n, byStatus: m, unknownFractionByCause: n ? frac(m, n) : {} };
  };
  return {
    terms: 'PDC = proximity-defined contact (a moving partner crossing to within 4.1 mm while the focal ant is still; touches unverified); near approach = proximity-defined near approach (4.1-8 mm, no PDC)',
    constants: { SEED, ENTRY, BLOCK, MAX_REFS, MIN_MATCHED, MIN_COLONIES, MIN_ANTS_0B, MIN_UNCENSORED_0B, K_MIN, K_MAX, K_THRESHOLD, BOOT: B, keys },
    stage0: { label: s0a.pass && s0b.pass ? 'identifiable' : 'not identifiable', reasons },
    stage0a: s0a,
    stage0b: s0b,
    colonies: perColony.map((p) => p.summary),
    descriptives: {
      unknown: {
        note: 'unknown histories are never treated as complete (P153); fractions by cause',
        intervals: { light: nLight, byCause: sum((d) => d.intervals.unknownByCause), fractionByCause: frac(sum((d) => d.intervals.unknownByCause), nLight) },
        bouts: { n: nBouts, byCause: sum((d) => d.bouts.unknownByCause), fractionByCause: frac(sum((d) => d.bouts.unknownByCause), nBouts) },
        contactPattern: cand('contact'),
        referencePattern: cand('reference'),
      },
      matchedContactTripletsPerColony: { median: median(s0a.matchedContactTriplets), min: Math.min(...s0a.matchedContactTriplets), max: Math.max(...s0a.matchedContactTriplets) },
      colonies: perColony.map((p) => p.descriptives),
    },
  };
}
export type Stage0Result = ReturnType<typeof readStage0>;
