// Scratch (not committed): H6 initiation test, the reader (T059; D241 with amendments 1 and 2 and the lead's details, D242, D246).
// This one file holds every statistic of the test, so that its SHA-256 freezes them (P151). It reads the extractor's
// intermediates (logs/h6-work/c<i>.json) and an initiator assignment; the same code scores synthetic and real data.
//
//   Synthetic (the generator, synth.ts): imports `skeleton`, `scorePrimary`, `s2Colony`/`s2Summary` and calls them in
//     process with its own assignments; the real first-onset assignment is never formed on that path.
//   Empirical (only after the freeze, the lead): npx vite-node scripts/scratch/h6/reader.ts --h6-read --empirical
//     --assign real --out <path> [--parts primary,s1,s2,s3] [--draws 1000] [--boot 2000]
//
// Fixed by D241 amendment 1 and amendment 2 (D246; it governs where they differ) and the lead's details:
// - Zones: 2 × 2 mm cells; forager-visit share = forager / (forager + nurse) light-phase detection-frames (queen
//   excluded); cells with < 600 such frames unassigned; the colony median of the assigned cells' shares splits them into
//   the low-forager-visit zone L (at or below) and the high-forager-visit zone H (above) (P143: named so, not "nurse
//   side" / "entrance side"). An onset's zone is its cell's; unassigned onsets are counted and excluded from zone uses.
// - Episodes: light-phase onsets in time order (ties by ant, x, y, as spreadAgg.py), ended by a gap > G frames, with at
//   least N distinct ants, each ant's first onset; primary N = 3, G = 10; sensitivities N = 5; G = 20; both; strict
//   tracking (onsets with 20 detected frames before them). Initiators (empirical): the onsets on the episode's first
//   frame, sharing its initiation 1/k.
// - Primary, R̄ (point 4): per colony and half (06–12, 12–18 UTC, by the episode's first onset), per ant O = initiation
//   shares, E = Σ over episodes where it is a candidate of 1 / #candidates, z = (O − E) / √E; colony statistic the
//   Spearman correlation of z between halves over ants with E ≥ 1 in both; a colony enters with ≥ 8 such ants; R̄ = mean
//   over ≥ 15 entering colonies, else unresolved. Reference draws (1,000): the k initiators of each episode redrawn
//   without replacement among its candidates (null 1: all participants, i.e. onset times permuted with ties kept; null
//   3: the eligible observed participants in the initiator's zone), R̄ recomputed on the same ants and colonies.
//   Label: R̄ > the draws' 97.5th percentile and the 2,000-draw colony-bootstrap 95 % interval of R̄ minus the reference
//   median has its lower bound above 0 (both recomputed on each bootstrap draw's colonies); null 1 → "initiation
//   heterogeneous beyond participation", null 3 with its support met → "heterogeneous beyond location"; otherwise
//   "unresolved". These are the only decision labels (P149).
// - Null 3 (point 1): the initiator's zone at its onset is kept; candidates are participants whose onset in the episode
//   lies in that zone, detected on the episode's first frame and on ≥ 90 % of the 20 frames before it, still throughout
//   them (the extractor's eligibility): point 1's three conditions only (D241 amendment 2, D246; ELIG_RULE). The
//   coverage rule (its neighbour clause included) does not enter null 3's eligibility; it classes onsets and S1's
//   at-risk times only. Uninformative (excluded, counted): an initiator in an unassigned cell; tied initiators in
//   different zones; an initiator not itself meeting the same three conditions (amendment 2; see ELIG_INITIATOR);
//   no eligible alternative. Support: ≥ 15 colonies each with ≥ 30 informative episodes in each half, else
//   "unresolved" whatever the statistic (P146).
// - Everything else is descriptive, estimates with colony-bootstrap 95 % intervals and no labels (P149): role and zone
//   shares against the references' expectations, dispersion of z, S1, S2, S3, the sensitivities (P144: all reported,
//   none selected; a disagreement with the primary is reported as one), unknown fractions (P148).
// - "No observed preceding contact" (P134) is an observational class: no contact with a moving ant observed in the W
//   window, with the coverage rule met; failing coverage it is "unknown". Rules: unknowns excluded (primary), counted as
//   contact, counted as no observed contact (point 3; neither is called conservative).
// - S2 (point 2): per colony and membership (current location; each ant's modal zone), the 1-min moving-fraction series
//   of L and H within the 4-h clock blocks 06–10, 10–14, 14–18 UTC; each contiguous piece of a block (both series
//   defined, ≥ S2_MIN_LEN minutes) detrended by its own line; linear Granger F tests both ways at lag 2 (lags 1–5
//   sensitivity); ΔF = F(L→H) − F(H→L) and the significant-test difference; pieces weighted by length within a block,
//   blocks equally. References: L circularly shifted within its piece by a uniform lag in [20, n − 20] minutes (1,000
//   draws); the fixed membership; L of one colony against H of another, on the minutes both record (actual UTC), block
//   by block. Complete series; nothing concatenated (P147).
// - S3: arrivals into a zone (crossing from the other zone; entry from the arena) and the receiving zone's moving
//   fraction by current location, the arriving ant excluded, 5 min before against 5 min after, minus the same at up to
//   5 control times matched on that zone's level (1 min) and trend (30 s), D212's matching (same 4-h block, 5-s grid,
//   tolerance 0.2 SD, nearest 5, no same-type event within the windows); DiD per direction, colonies equally weighted.
// - S1: onsets' share with no observed preceding contact against the same share among S1's at-risk still ant-times,
//   by colony activity level (tertile of the 60-s colony moving fraction before) × 1-min slope (tertile of that minus the
//   minute before: falling, flat, rising); quiet start = lowest level third and not rising.
import fs from 'node:fs';
import { RNG } from '../../../src/sim/core/rng';

export const SEED = 6241;
export const CELL_MM = 2;
export const ZONE_MIN_FRAMES = 600;
export const L = 0;
export const H = 1;
export const MIN_ANTS = 8;
export const MIN_COLONIES = 15;
export const NULL3_MIN_EPS = 30;
export const S2_MIN_LEN = 60;
export const S2_MIN_SHIFT = 20;
/** Null 3: the observed initiator must itself meet the eligibility, or the episode is excluded, counted (amendment 2). */
export const ELIG_INITIATOR = true;
/** Null-3 eligibility: point 1's three conditions only (D241 amendment 2, D246), the one rule. The extractor's elig
 * records still carry a W = 10 s coverage bit per ant; the reader never uses it. */
export const ELIG_RULE = 'basic' as const;
export const F_COV10 = 1, F_COV60 = 2, F_CON10 = 4, F_CON60 = 8, F_STRICT = 16;

export const cellOf = (x: number, y: number): number => Math.floor(x / CELL_MM) * 100000 + Math.floor(y / CELL_MM);

// ---------------------------------------------------------------------------------------------------------- small stats
export const mean = (v: number[]): number => { let s = 0, n = 0; for (const x of v) if (Number.isFinite(x)) { s += x; n++; } return n ? s / n : NaN; };
export function ranks(v: number[]): number[] {
  const o = v.map((_, i) => i).sort((a, b) => v[a] - v[b]);
  const r = new Array(v.length).fill(0);
  let i = 0;
  while (i < o.length) {
    let j = i;
    while (j + 1 < o.length && v[o[j + 1]] === v[o[i]]) j++;
    for (let k = i; k <= j; k++) r[o[k]] = (i + j) / 2;
    i = j + 1;
  }
  return r;
}
export function pearson(a: number[], b: number[]): number {
  const n = a.length;
  if (n < 2) return NaN;
  let ma = 0, mb = 0;
  for (let i = 0; i < n; i++) { ma += a[i]; mb += b[i]; }
  ma /= n; mb /= n;
  let sab = 0, saa = 0, sbb = 0;
  for (let i = 0; i < n; i++) { const x = a[i] - ma, y = b[i] - mb; sab += x * y; saa += x * x; sbb += y * y; }
  return saa > 0 && sbb > 0 ? sab / Math.sqrt(saa * sbb) : NaN;
}
export const spearman = (a: number[], b: number[]): number => pearson(ranks(a), ranks(b));
/** p-quantile of a sorted array as spreadAgg.py reads it: sorted[floor(p n)]. */
export const qSorted = (s: number[], p: number): number => (s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : NaN);
export const median = (v: number[]): number => { const s = v.filter(Number.isFinite).sort((a, b) => a - b); const n = s.length; return n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : NaN; };
/** Colony bootstrap of a colony-weighted mean: [estimate, lo, hi] (95 % percentile). */
export function boot(v: number[], rng: RNG, B = 2000): [number, number, number] {
  const x = v.filter(Number.isFinite);
  if (x.length < 2) return [mean(x), NaN, NaN];
  const bs: number[] = [];
  for (let b = 0; b < B; b++) { let s = 0; for (let k = 0; k < x.length; k++) s += x[rng.int(x.length)]; bs.push(s / x.length); }
  bs.sort((a, b) => a - b);
  return [mean(x), qSorted(bs, 0.025), qSorted(bs, 0.975)];
}

// ---------------------------------------------------------------------------------------------------------------- zones
export interface Grid { cells: number[]; forager: number[]; nurse: number[] }
export interface Zones { zoneOf: Map<number, number>; median: number; nL: number; nH: number; nU: number }
export function buildZones(g: Grid): Zones {
  const share: [number, number][] = [];
  let nU = 0;
  g.cells.forEach((c, k) => { const v = g.forager[k] + g.nurse[k]; if (v >= ZONE_MIN_FRAMES) share.push([c, g.forager[k] / v]); else nU++; });
  const med = median(share.map((s) => s[1]));
  const zoneOf = new Map<number, number>();
  let nL = 0, nH = 0;
  for (const [c, s] of share) { const z = s <= med ? L : H; zoneOf.set(c, z); if (z === L) nL++; else nH++; }
  return { zoneOf, median: med, nL, nH, nU };
}

// ------------------------------------------------------------------------------------------------------------- episodes
export interface Onset { f: number; a: number; x: number; y: number; cell: number; still: number; flags: number; t: number }
export function parseOnsets(flat: number[]): Onset[] {
  const o: Onset[] = [];
  for (let k = 0; k < flat.length; k += 8) o.push({ f: flat[k], a: flat[k + 1], x: flat[k + 2], y: flat[k + 3], cell: flat[k + 4], still: flat[k + 5], flags: flat[k + 6], t: flat[k + 7] });
  return o;
}
export interface Episode { f0: number; t0: number; parts: Onset[] }
/** Episodes as spreadAgg.py's `episodes` (sort by frame, ant, x, y; a gap > `gap` ends one; ≥ `minAnts` distinct ants;
 * each ant's first onset). */
export function buildEpisodes(on: Onset[], minAnts: number, gap: number): Episode[] {
  const E = [...on].sort((p, q) => p.f - q.f || p.a - q.a || p.x - q.x || p.y - q.y);
  const out: Episode[] = [];
  let cur: Onset[] = [];
  const close = () => {
    const first = new Map<number, Onset>();
    for (const e of cur) if (!first.has(e.a)) first.set(e.a, e);
    if (first.size >= minAnts) {
      const parts = [...first.values()].sort((p, q) => p.f - q.f || p.a - q.a || p.x - q.x || p.y - q.y);
      out.push({ f0: parts[0].f, t0: parts[0].t, parts });
    }
  };
  for (const e of E) {
    if (cur.length && e.f - cur[cur.length - 1].f > gap) { close(); cur = []; }
    cur.push(e);
  }
  if (cur.length) close();
  return out;
}
export const halfOf = (t: number): number => ((((t / 3600) % 24) + 24) % 24 < 12 ? 0 : 1);

// ------------------------------------------------------------------------------------------- skeletons and assignments
/** An episode as the primary statistic sees it: who took part (ants, their onset zones, null-3 eligibility at the
 * episode's first frame) and which of them initiate (indices). Onset times are not carried. */
export interface PEp { half: number; ants: number[]; zone: number[]; elig: boolean[]; init: number[]; role?: string[]; cls10?: number[]; cls60?: number[]; quiet?: boolean }
export interface PCol { label: string; nAnts: number; eps: PEp[] }
/** Skeleton episode: a PEp without initiators, plus the participants' onset frames (used only by the empirical
 * assignment `realInitiators`, never by the generator). */
export interface SkEp extends Omit<PEp, 'init'> { f0: number; frames: number[] }
export const CLS_NOOBS = 0, CLS_CONTACT = 1, CLS_UNKNOWN = 2;
/** Observational class of an onset or at-risk time from its flags (P134). */
export const classOf = (flags: number, w: 10 | 60): number => ((flags & (w === 10 ? F_CON10 : F_CON60)) ? CLS_CONTACT : (flags & (w === 10 ? F_COV10 : F_COV60)) ? CLS_NOOBS : CLS_UNKNOWN);
export interface SkInput { onsets: number[]; elig: number[][]; roles: string[] }
export function eligMap(elig: number[][]): Map<number, Map<number, number>> {
  const m = new Map<number, Map<number, number>>();
  for (const E of elig) { const s = new Map<number, number>(); for (let k = 1; k < E.length; k += 2) s.set(E[k], E[k + 1]); m.set(E[0], s); }
  return m;
}
/** Null-3 eligibility of a participant: listed in the elig record of the episode's first frame (ELIG_RULE 'basic';
 * the record's coverage bit is not read). */
export function skeleton(d: SkInput, zones: Zones, minAnts: number, gap: number, strict = false, quietAt?: (f: number) => boolean | undefined): SkEp[] {
  let on = parseOnsets(d.onsets);
  if (strict) on = on.filter((o) => o.flags & F_STRICT);
  const em = eligMap(d.elig);
  return buildEpisodes(on, minAnts, gap).map((ep) => {
    const e = em.get(ep.f0) ?? new Map<number, number>();
    return {
      f0: ep.f0,
      half: halfOf(ep.t0),
      ants: ep.parts.map((p) => p.a),
      frames: ep.parts.map((p) => p.f),
      zone: ep.parts.map((p) => zones.zoneOf.get(p.cell) ?? -1),
      elig: ep.parts.map((p) => e.has(p.a)),
      role: ep.parts.map((p) => d.roles[p.a]),
      cls10: ep.parts.map((p) => classOf(p.flags, 10)),
      cls60: ep.parts.map((p) => classOf(p.flags, 60)),
      quiet: quietAt ? quietAt(ep.f0) : undefined,
    };
  });
}
/** A skeleton episode as the synthetic generator gets it: participants in ant-id order and no onset frames, so neither
 * the generator nor the reader can see who started the real episode. */
export const blind = (ep: SkEp): SkEp => {
  const o = ep.ants.map((_, k) => k).sort((p, q) => ep.ants[p] - ep.ants[q]);
  const by = <T>(v: T[] | undefined): T[] | undefined => (v ? o.map((k) => v[k]) : undefined);
  return { f0: -1, frames: [], half: ep.half, ants: by(ep.ants)!, zone: by(ep.zone)!, elig: by(ep.elig)!, role: by(ep.role), cls10: by(ep.cls10), cls60: by(ep.cls60), quiet: ep.quiet };
};
/** The empirical assignment: the participants on the episode's first frame (ties share 1/k). */
export const realInitiators = (ep: SkEp): number[] => ep.frames.map((f, k) => (f === ep.f0 ? k : -1)).filter((k) => k >= 0);
export const withInit = (ep: SkEp, init: number[]): PEp => ({ half: ep.half, ants: ep.ants, zone: ep.zone, elig: ep.elig, init, role: ep.role, cls10: ep.cls10, cls60: ep.cls60, quiet: ep.quiet });

// -------------------------------------------------------------------------------------------------------------- primary
export type Ref = 'null1' | 'null3';
export type Reason = 'initiatorUnassigned' | 'tiedZonesDiffer' | 'initiatorIneligible' | 'noEligibleAlternative';
/** Candidates of an episode under a reference (indices into ep.ants), or the reason it is uninformative. */
/** `eligInitiator` defaults to ELIG_INITIATOR; another value is a diagnostic only. */
export function candidates(ep: PEp, ref: Ref, eligInitiator = ELIG_INITIATOR): number[] | Reason {
  if (ref === 'null1') return ep.ants.map((_, k) => k);
  const z = ep.zone[ep.init[0]];
  if (ep.init.some((k) => ep.zone[k] !== z)) return 'tiedZonesDiffer';
  if (z < 0) return 'initiatorUnassigned';
  if (eligInitiator && ep.init.some((k) => !ep.elig[k])) return 'initiatorIneligible';
  const c = ep.ants.map((_, k) => k).filter((k) => ep.zone[k] === z && (ep.elig[k] || ep.init.includes(k)));
  if (c.length <= ep.init.length) return 'noEligibleAlternative';
  return c;
}
export interface Tally { O: Float64Array[]; E: Float64Array[]; cand: (number[] | null)[]; informative: number[]; reasons: Record<string, number> }
export function tally(col: PCol, ref: Ref, eligInitiator = ELIG_INITIATOR): Tally {
  const O = [new Float64Array(col.nAnts), new Float64Array(col.nAnts)];
  const E = [new Float64Array(col.nAnts), new Float64Array(col.nAnts)];
  const reasons: Record<string, number> = {};
  const informative = [0, 0];
  const cand = col.eps.map((ep) => {
    const c = candidates(ep, ref, eligInitiator);
    if (typeof c === 'string') { reasons[c] = (reasons[c] ?? 0) + 1; return null; }
    informative[ep.half]++;
    for (const k of ep.init) O[ep.half][ep.ants[k]] += 1 / ep.init.length;
    for (const k of c) E[ep.half][ep.ants[k]] += 1 / c.length;
    return c;
  });
  return { O, E, cand, informative, reasons };
}
export const zOf = (O: Float64Array, E: Float64Array, ants: number[]): number[] => ants.map((a) => (O[a] - E[a]) / Math.sqrt(E[a]));
/** One draw of initiators under the reference: per episode k of its candidates without replacement, each 1/k. */
export function drawO(col: PCol, T: Tally, rng: RNG, O: Float64Array[], tmp: number[]): void {
  O[0].fill(0);
  O[1].fill(0);
  col.eps.forEach((ep, e) => {
    const c = T.cand[e];
    if (!c) return;
    const k = ep.init.length;
    tmp.length = 0;
    for (const v of c) tmp.push(v);
    for (let j = 0; j < k; j++) {
      const r = j + rng.int(tmp.length - j);
      const s = tmp[j]; tmp[j] = tmp[r]; tmp[r] = s;
      O[ep.half][ep.ants[tmp[j]]] += 1 / k;
    }
  });
}
/** The reading (point 4): R̄ above the reference draws' 97.5th percentile and the bootstrap lower bound of R̄ minus the
 * reference median above 0. `sortedNull`: the draws' R̄, sorted. */
export const decisionRule = (Rbar: number, sortedNull: number[], diffLower: number): boolean => Rbar > qSorted(sortedNull, 0.975) && diffLower > 0;
export interface PrimaryOpts { draws: number; boot: number; key: number; listAnts?: boolean; descriptive?: boolean; /** diagnostic only */ eligInitiator?: boolean }
export interface PrimaryResult {
  ref: Ref; label: string; ruleMet: boolean; reason?: string;
  Rbar: number; threshold975: number; referenceMedian: number; diffCI: [number, number];
  entered: string[]; excluded: { colony: string; reason: string; ants: number }[];
  antsExcluded?: Record<string, number[]>;
  null3Support?: { met: boolean; coloniesMeeting: number; informative: Record<string, number[]>; uninformative: Record<string, Record<string, number>> };
  dispersion?: { estimate: number; ci: [number, number] };
}
export function primary(cols: PCol[], ref: Ref, o: PrimaryOpts): PrimaryResult {
  const T = cols.map((c) => tally(c, ref, o.eligInitiator ?? ELIG_INITIATOR));
  const excluded: { colony: string; reason: string; ants: number }[] = [];
  const antsExcluded: Record<string, number[]> = {};
  const enter: { c: number; S: number[]; r: number }[] = [];
  cols.forEach((col, c) => {
    const { O, E } = T[c];
    const S: number[] = [];
    const out: number[] = [];
    for (let a = 0; a < col.nAnts; a++) { if (E[0][a] >= 1 && E[1][a] >= 1) S.push(a); else if (E[0][a] > 0 || E[1][a] > 0) out.push(a); }
    if (o.listAnts) antsExcluded[col.label] = out;
    if (S.length < MIN_ANTS) { excluded.push({ colony: col.label, reason: `fewer than ${MIN_ANTS} ants with E ≥ 1 in both halves`, ants: S.length }); return; }
    const r = spearman(zOf(O[0], E[0], S), zOf(O[1], E[1], S));
    if (!Number.isFinite(r)) { excluded.push({ colony: col.label, reason: 'no variance in z', ants: S.length }); return; }
    enter.push({ c, S, r });
  });
  let null3Support: PrimaryResult['null3Support'];
  if (ref === 'null3') {
    const informative: Record<string, number[]> = {};
    const uninformative: Record<string, Record<string, number>> = {};
    let meeting = 0;
    cols.forEach((col, c) => { informative[col.label] = T[c].informative; uninformative[col.label] = T[c].reasons; if (T[c].informative[0] >= NULL3_MIN_EPS && T[c].informative[1] >= NULL3_MIN_EPS) meeting++; });
    null3Support = { met: meeting >= MIN_COLONIES, coloniesMeeting: meeting, informative, uninformative };
  }
  const base = { ref, entered: enter.map((e) => cols[e.c].label), excluded, antsExcluded: o.listAnts ? antsExcluded : undefined, null3Support };
  const failLabel = 'unresolved';
  if (enter.length < MIN_COLONIES) return { ...base, label: failLabel, ruleMet: false, reason: `fewer than ${MIN_COLONIES} colonies enter`, Rbar: NaN, threshold975: NaN, referenceMedian: NaN, diffCI: [NaN, NaN] };
  // reference draws
  const D = o.draws;
  const rNull = enter.map(() => new Float64Array(D));
  const dispObs: number[] = [];
  const dispNull = enter.map(() => new Float64Array(D));
  const tmp: number[] = [];
  enter.forEach((e, m) => {
    const col = cols[e.c];
    const t = T[e.c];
    const rng = RNG.stream(SEED, o.key, ref === 'null1' ? 1 : 3, e.c);
    const O = [new Float64Array(col.nAnts), new Float64Array(col.nAnts)];
    const full = (OO: Float64Array[]) => {
      const Sf: number[] = [];
      for (let a = 0; a < col.nAnts; a++) if (t.E[0][a] + t.E[1][a] >= 1) Sf.push(a);
      const z = Sf.map((a) => (OO[0][a] + OO[1][a] - t.E[0][a] - t.E[1][a]) / Math.sqrt(t.E[0][a] + t.E[1][a]));
      const mz = mean(z);
      return z.reduce((s, v) => s + (v - mz) ** 2, 0) / Math.max(1, z.length - 1);
    };
    if (o.descriptive) dispObs.push(full(t.O));
    for (let d = 0; d < D; d++) {
      drawO(col, t, rng, O, tmp);
      rNull[m][d] = spearman(zOf(O[0], t.E[0], e.S), zOf(O[1], t.E[1], e.S));
      if (o.descriptive) dispNull[m][d] = full(O);
    }
  });
  const rObs = enter.map((e) => e.r);
  const Rbar = mean(rObs);
  const nullR: number[] = [];
  for (let d = 0; d < D; d++) nullR.push(mean(enter.map((_, m) => rNull[m][d])));
  const sortedNull = nullR.filter(Number.isFinite).sort((a, b) => a - b);
  const threshold975 = qSorted(sortedNull, 0.975);
  const referenceMedian = median(nullR);
  // colony bootstrap of R̄ − reference median, both recomputed on the drawn colonies
  const rb = RNG.stream(SEED, o.key, ref === 'null1' ? 101 : 103);
  const M = enter.length;
  const diffs: number[] = [];
  const w = new Int32Array(M);
  const per = new Array<number>(D);
  for (let b = 0; b < o.boot; b++) {
    w.fill(0);
    for (let k = 0; k < M; k++) w[rb.int(M)]++;
    let so = 0;
    for (let m = 0; m < M; m++) so += w[m] * rObs[m];
    for (let d = 0; d < D; d++) {
      let s = 0, n = 0;
      for (let m = 0; m < M; m++) if (w[m] && Number.isFinite(rNull[m][d])) { s += w[m] * rNull[m][d]; n += w[m]; }
      per[d] = n ? s / n : NaN;
    }
    diffs.push(so / M - median(per));
  }
  diffs.sort((a, b) => a - b);
  const diffCI: [number, number] = [qSorted(diffs, 0.025), qSorted(diffs, 0.975)];
  const ruleMet = decisionRule(Rbar, sortedNull, diffCI[0]);
  let label = ruleMet ? (ref === 'null1' ? 'initiation heterogeneous beyond participation' : 'heterogeneous beyond location') : failLabel;
  let reason: string | undefined;
  if (ref === 'null3' && !null3Support!.met) { label = failLabel; reason = 'null-3 support not met (identity heterogeneity beyond location unresolved, P146)'; }
  let dispersion: PrimaryResult['dispersion'];
  if (o.descriptive) {
    const dv = enter.map((_, m) => dispObs[m] - mean([...dispNull[m]]));
    const [est, lo, hi] = boot(dv, RNG.stream(SEED, o.key, ref === 'null1' ? 201 : 203));
    dispersion = { estimate: est, ci: [lo, hi] };
  }
  return { ...base, label, ruleMet, reason, Rbar, threshold975, referenceMedian, diffCI, dispersion };
}

/** Shares of initiations by a per-participant attribute against the reference's expectation (descriptive). */
export function shares(cols: PCol[], ref: Ref, attr: (ep: PEp, k: number) => string | number, levels: (string | number)[], key: number): Record<string, { observed: [number, number, number]; expected: [number, number, number]; difference: [number, number, number] }> {
  const res: Record<string, { observed: [number, number, number]; expected: [number, number, number]; difference: [number, number, number] }> = {};
  levels.forEach((lev, li) => {
    const ob: number[] = [], ex: number[] = [], df: number[] = [];
    for (const col of cols) {
      let O = 0, E = 0, n = 0;
      for (const ep of col.eps) {
        const c = candidates(ep, ref);
        if (typeof c === 'string') continue;
        n++;
        for (const k of ep.init) if (attr(ep, k) === lev) O += 1 / ep.init.length;
        for (const k of c) if (attr(ep, k) === lev) E += 1 / c.length;
      }
      if (!n) continue;
      ob.push(O / n); ex.push(E / n); df.push((O - E) / n);
    }
    res[String(lev)] = { observed: boot(ob, RNG.stream(SEED, key, 300 + li)), expected: boot(ex, RNG.stream(SEED, key, 400 + li)), difference: boot(df, RNG.stream(SEED, key, 500 + li)) };
  });
  return res;
}

/** The two primary labels (and the null-3 support share) for one data set; used unchanged for synthetic data. */
export function scorePrimary(cols: PCol[], o: PrimaryOpts): { null1: PrimaryResult; null3: PrimaryResult } {
  return { null1: primary(cols, 'null1', o), null3: primary(cols, 'null3', o) };
}

// ---------------------------------------------------------------------------------------------------- activity context
export interface Bins { bin: number[]; t: number[]; moving: number[]; steps: number[]; frames: number[] }
/** Colony activity context per 10-frame bin: level = moving fraction over the 12 bins (60 s) before, slope = level minus
 * the 12 bins before those; classes by the colony's tertiles over its light bins. */
export function context(b: Bins): (f: number) => { level: number; slope: number; quiet: boolean } | undefined {
  const idx = new Map(b.bin.map((x, k) => [x, k]));
  const pm = [0], ps = [0];
  for (let k = 0; k < b.bin.length; k++) { pm.push(pm[k] + b.moving[k]); ps.push(ps[k] + b.steps[k]); }
  const raw = (B: number): [number, number] | undefined => {
    const k = idx.get(B);
    if (k === undefined || k < 24 || b.bin[k - 24] !== B - 24) return undefined;
    const s1 = ps[k] - ps[k - 12], s0 = ps[k - 12] - ps[k - 24];
    if (!s1 || !s0) return undefined;
    const l1 = (pm[k] - pm[k - 12]) / s1, l0 = (pm[k - 12] - pm[k - 24]) / s0;
    return [l1, l1 - l0];
  };
  const all = b.bin.map(raw).filter((x): x is [number, number] => !!x);
  const lv = all.map((x) => x[0]).sort((p, q) => p - q), sl = all.map((x) => x[1]).sort((p, q) => p - q);
  const [l1, l2, s1, s2] = [qSorted(lv, 1 / 3), qSorted(lv, 2 / 3), qSorted(sl, 1 / 3), qSorted(sl, 2 / 3)];
  return (f: number) => {
    const r = raw(Math.floor(f / 10));
    if (!r) return undefined;
    const level = r[0] < l1 ? 0 : r[0] < l2 ? 1 : 2;
    const slope = r[1] < s1 ? 0 : r[1] < s2 ? 1 : 2;
    return { level, slope, quiet: level === 0 && slope !== 2 };
  };
}

// ------------------------------------------------------------------------------------------------------------------- S1
export type UnknownRule = 'exclude' | 'asContact' | 'asNoObservedContact';
/** Share with no observed preceding contact under an unknown rule, from [noObs, contact, unknown] counts. */
export function noObsShare(c: number[], rule: UnknownRule): number {
  const [a, b, u] = c;
  if (rule === 'exclude') return a + b ? a / (a + b) : NaN;
  if (rule === 'asContact') return a + b + u ? a / (a + b + u) : NaN;
  return a + b + u ? (a + u) / (a + b + u) : NaN;
}
export interface S1Col { onsets: { f: number; flags: number }[]; atRisk: { f: number; flags: number }[]; ctx: (f: number) => { level: number; slope: number; quiet: boolean } | undefined }
export const S1_MIN = 10;
/** S1 per stratum (9 level × slope, 'quiet', 'all'): colony-weighted onset share, at-risk share and excess. */
export function s1(cols: S1Col[], w: 10 | 60, rule: UnknownRule, key: number): Record<string, { onsets: [number, number, number]; atRisk: [number, number, number]; excess: [number, number, number]; colonies: number }> {
  const strata = [...Array.from({ length: 9 }, (_, k) => `level${Math.floor(k / 3)}-slope${k % 3}`), 'quiet', 'all'];
  const per = cols.map((c) => {
    const cnt = (xs: { f: number; flags: number }[]) => {
      const m = new Map<string, number[]>(strata.map((s) => [s, [0, 0, 0]]));
      for (const x of xs) {
        const cx = c.ctx(x.f);
        if (!cx) continue;
        const cl = classOf(x.flags, w);
        m.get(`level${cx.level}-slope${cx.slope}`)![cl]++;
        if (cx.quiet) m.get('quiet')![cl]++;
        m.get('all')![cl]++;
      }
      return m;
    };
    return { on: cnt(c.onsets), ar: cnt(c.atRisk) };
  });
  const res: Record<string, { onsets: [number, number, number]; atRisk: [number, number, number]; excess: [number, number, number]; colonies: number }> = {};
  const known = (v: number[]) => (rule === 'exclude' ? v[0] + v[1] : v[0] + v[1] + v[2]);
  strata.forEach((s, si) => {
    const a: number[] = [], b: number[] = [], d: number[] = [];
    for (const p of per) {
      const on = p.on.get(s)!, ar = p.ar.get(s)!;
      if (known(on) < S1_MIN || known(ar) < S1_MIN) continue;
      const x = noObsShare(on, rule), y = noObsShare(ar, rule);
      a.push(x); b.push(y); d.push(x - y);
    }
    res[s] = { onsets: boot(a, RNG.stream(SEED, key, 600 + si)), atRisk: boot(b, RNG.stream(SEED, key, 700 + si)), excess: boot(d, RNG.stream(SEED, key, 800 + si)), colonies: d.length };
  });
  return res;
}
/** Unknown fractions (P148) by a grouping, colony-weighted. */
export function unknownFractions<T>(cols: T[][], group: (x: T) => string | undefined, cls: (x: T) => number, key: number): Record<string, [number, number, number]> {
  const per = cols.map((xs) => { const m = new Map<string, [number, number]>(); for (const x of xs) { const g = group(x); if (g === undefined) continue; const v = m.get(g) ?? [0, 0]; v[1]++; if (cls(x) === CLS_UNKNOWN) v[0]++; m.set(g, v); } return m; });
  const groups = [...new Set(per.flatMap((m) => [...m.keys()]))].sort();
  const res: Record<string, [number, number, number]> = {};
  groups.forEach((g, gi) => { res[g] = boot(per.map((m) => { const v = m.get(g); return v && v[1] ? v[0] / v[1] : NaN; }), RNG.stream(SEED, key, 900 + gi)); });
  return res;
}

// ------------------------------------------------------------------------------------------------------------------- S2
/** Regularised incomplete beta I_x(a, b) (continued fraction, Numerical Recipes). */
function lgamma(x: number): number {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x;
  const tmp = x + 5.5 - (x + 0.5) * Math.log(x + 5.5);
  let ser = 1.000000000190015;
  for (const v of c) ser += v / ++y;
  return -tmp + Math.log((2.5066282746310005 * ser) / x);
}
function betacf(a: number, b: number, x: number): number {
  const qab = a + b, qap = a + 1, qam = a - 1;
  let c = 1, d = 1 - (qab * x) / qap;
  if (Math.abs(d) < 1e-300) d = 1e-300;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= 300; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = 1 + aa / c; if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d; h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = 1 + aa / c; if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-12) break;
  }
  return h;
}
export function ibeta(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b;
}
/** Upper tail P(F > f) for F(d1, d2). */
export const fPval = (f: number, d1: number, d2: number): number => (f > 0 ? ibeta(d2 / (d2 + d1 * f), d2 / 2, d1 / 2) : 1);
/** Residual sum of squares of y on the columns of X (with intercept), by Cholesky on the normal equations. */
function rss(y: number[], X: number[][]): number {
  const n = y.length, k = X.length + 1;
  const col = (j: number, t: number) => (j === 0 ? 1 : X[j - 1][t]);
  const A = Array.from({ length: k }, () => new Float64Array(k));
  const bv = new Float64Array(k);
  for (let t = 0; t < n; t++) for (let i = 0; i < k; i++) { const ci = col(i, t); bv[i] += ci * y[t]; for (let j = 0; j <= i; j++) A[i][j] += ci * col(j, t); }
  for (let i = 0; i < k; i++) for (let j = 0; j < i; j++) A[j][i] = A[i][j];
  // Cholesky with a tiny ridge for safety
  const Lm = Array.from({ length: k }, () => new Float64Array(k));
  for (let i = 0; i < k; i++) {
    for (let j = 0; j <= i; j++) {
      let s = A[i][j];
      for (let q = 0; q < j; q++) s -= Lm[i][q] * Lm[j][q];
      if (i === j) Lm[i][i] = Math.sqrt(Math.max(s, 1e-12 * (A[i][i] || 1)));
      else Lm[i][j] = s / Lm[j][j];
    }
  }
  const z = new Float64Array(k);
  for (let i = 0; i < k; i++) { let s = bv[i]; for (let q = 0; q < i; q++) s -= Lm[i][q] * z[q]; z[i] = s / Lm[i][i]; }
  const beta = new Float64Array(k);
  for (let i = k - 1; i >= 0; i--) { let s = z[i]; for (let q = i + 1; q < k; q++) s -= Lm[q][i] * beta[q]; beta[i] = s / Lm[i][i]; }
  let r = 0;
  for (let t = 0; t < n; t++) { let p = 0; for (let i = 0; i < k; i++) p += beta[i] * col(i, t); r += (y[t] - p) ** 2; }
  return r;
}
/** Linear Granger test of x → y at lag p: F and its p-value. */
export function granger(y: number[], x: number[], p: number): { F: number; pval: number } {
  const n = y.length;
  const Y = y.slice(p);
  const lagsY = Array.from({ length: p }, (_, l) => y.slice(p - 1 - l, n - 1 - l));
  const lagsX = Array.from({ length: p }, (_, l) => x.slice(p - 1 - l, n - 1 - l));
  const r0 = rss(Y, lagsY), r1 = rss(Y, [...lagsY, ...lagsX]);
  const d2 = Y.length - 2 * p - 1;
  const F = r1 > 0 && d2 > 0 ? ((r0 - r1) / p) / (r1 / d2) : NaN;
  return { F, pval: Number.isFinite(F) ? fPval(F, p, d2) : NaN };
}
export function detrend(v: number[]): number[] {
  const n = v.length, mt = (n - 1) / 2, mv = mean(v);
  let sxy = 0, sxx = 0;
  for (let t = 0; t < n; t++) { sxy += (t - mt) * (v[t] - mv); sxx += (t - mt) ** 2; }
  const b = sxx ? sxy / sxx : 0;
  return v.map((x, t) => x - mv - b * (t - mt));
}
/** 4-h clock block of a UTC minute: start hour (6, 10, 14) or −1 outside the light phase; the key adds the day. */
export const blockHour = (minute: number): number => { const h = Math.floor((((minute * 60) % 86400) + 86400) % 86400 / 3600); return h >= 6 && h < 18 ? 6 + 4 * Math.floor((h - 6) / 4) : -1; };
export const blockKey = (minute: number): number => Math.floor((minute * 60) / 86400) * 100 + blockHour(minute);
export interface Piece { block: number; hour: number; minutes: number[]; x: number[]; y: number[] }
/** Contiguous runs of minutes inside one block with both series finite, ≥ S2_MIN_LEN long. `x`, `y` keyed by minute. */
export function pieces(x: Map<number, number>, y: Map<number, number>, minLen = S2_MIN_LEN): Piece[] {
  const ms = [...x.keys()].filter((m) => y.has(m) && Number.isFinite(x.get(m)!) && Number.isFinite(y.get(m)!) && blockHour(m) >= 0).sort((a, b) => a - b);
  const out: Piece[] = [];
  let cur: number[] = [];
  const close = () => { if (cur.length >= minLen) out.push({ block: blockKey(cur[0]), hour: blockHour(cur[0]), minutes: cur, x: cur.map((m) => x.get(m)!), y: cur.map((m) => y.get(m)!) }); };
  for (const m of ms) {
    if (cur.length && (m !== cur[cur.length - 1] + 1 || blockKey(m) !== blockKey(cur[0]))) { close(); cur = []; }
    cur.push(m);
  }
  if (cur.length) close();
  return out;
}
/** Circular shift of a piece's x by s (within the piece, hence within its block). */
export const shiftWithin = (v: number[], s: number): number[] => v.map((_, t) => v[(t + s) % v.length]);
/** S2 value of a set of pieces at lag p: ΔF = F(x→y) − F(y→x) and sig(x→y) − sig(y→x), pieces length-weighted within a
 * block hour, block hours equally. x is L, y is H. */
export function s2Value(ps: Piece[], p: number, shift?: (n: number) => number): { dF: number; dSig: number } {
  const byHour = new Map<number, { w: number; dF: number; dSig: number }>();
  for (const pc of ps) {
    let x = detrend(pc.x);
    const y = detrend(pc.y);
    if (shift) x = shiftWithin(x, shift(x.length));
    const a = granger(y, x, p), b = granger(x, y, p);
    if (!Number.isFinite(a.F) || !Number.isFinite(b.F)) continue;
    const v = byHour.get(pc.hour) ?? { w: 0, dF: 0, dSig: 0 };
    const n = pc.x.length;
    v.w += n;
    v.dF += n * (a.F - b.F);
    v.dSig += n * ((a.pval < 0.05 ? 1 : 0) - (b.pval < 0.05 ? 1 : 0));
    byHour.set(pc.hour, v);
  }
  const vs = [...byHour.values()];
  return { dF: mean(vs.map((v) => v.dF / v.w)), dSig: mean(vs.map((v) => v.dSig / v.w)) };
}
export interface S2Series { label: string; L: Map<number, number>; H: Map<number, number> }
export function seriesFrom(label: string, minute: number[], rows: number[][]): S2Series {
  const Lm = new Map<number, number>(), Hm = new Map<number, number>();
  minute.forEach((m, k) => { const r = rows[k]; Lm.set(m, r[1] ? r[0] / r[1] : NaN); Hm.set(m, r[3] ? r[2] / r[3] : NaN); });
  return { label, L: Lm, H: Hm };
}
/** Per colony: observed values and the within-block shift reference (draws). */
export function s2Colony(s: S2Series, p: number, draws: number, rng: RNG): { obs: { dF: number; dSig: number }; shift: { dF: number[]; dSig: number[] } } {
  const ps = pieces(s.L, s.H);
  const obs = s2Value(ps, p);
  const dF: number[] = [], dSig: number[] = [];
  for (let d = 0; d < draws; d++) {
    const v = s2Value(ps, p, (n) => S2_MIN_SHIFT + rng.int(n - 2 * S2_MIN_SHIFT + 1));
    dF.push(v.dF); dSig.push(v.dSig);
  }
  return { obs, shift: { dF, dSig } };
}
/** Cross-colony value for an ordered pair: L of a against H of b on the minutes both record (actual UTC). */
export function s2Cross(a: S2Series, b: S2Series, p: number): { dF: number; dSig: number; minutes: number } | undefined {
  const ps = pieces(a.L, b.H);
  if (!ps.length) return undefined;
  return { ...s2Value(ps, p), minutes: ps.reduce((s, q) => s + q.minutes.length, 0) };
}
export function s2Summary(series: S2Series[], p: number, draws: number, key: number): Record<string, unknown> {
  const per = series.map((s, c) => ({ label: s.label, ...s2Colony(s, p, draws, RNG.stream(SEED, key, 1000 + p, c)) }));
  const obsF = per.map((x) => x.obs.dF), obsS = per.map((x) => x.obs.dSig);
  const shF = per.map((x) => mean(x.shift.dF)), shS = per.map((x) => mean(x.shift.dSig));
  const cross: { a: string; b: string; dF: number; dSig: number; minutes: number }[] = [];
  for (let i = 0; i < series.length; i++) for (let j = 0; j < series.length; j++) {
    if (i === j) continue;
    const v = s2Cross(series[i], series[j], p);
    if (v) cross.push({ a: series[i].label, b: series[j].label, ...v });
  }
  const cf = cross.map((c) => c.dF).sort((x, y) => x - y), cs = cross.map((c) => c.dSig).sort((x, y) => x - y);
  return {
    lag: p,
    colonies: per.filter((x) => Number.isFinite(x.obs.dF)).length,
    deltaF: boot(obsF, RNG.stream(SEED, key, 1100 + p)),
    deltaSig: boot(obsS, RNG.stream(SEED, key, 1200 + p)),
    shiftReference: { deltaF: boot(shF, RNG.stream(SEED, key, 1300 + p)), deltaSig: boot(shS, RNG.stream(SEED, key, 1400 + p)), observedMinusShift: boot(obsF.map((v, k) => v - shF[k]), RNG.stream(SEED, key, 1500 + p)), observedMinusShiftSig: boot(obsS.map((v, k) => v - shS[k]), RNG.stream(SEED, key, 1600 + p)) },
    crossColony: { pairs: cross.length, deltaF: { mean: mean(cf), q025: qSorted(cf, 0.025), q975: qSorted(cf, 0.975) }, deltaSig: { mean: mean(cs), q025: qSorted(cs, 0.025), q975: qSorted(cs, 0.975) } },
  };
}

// ------------------------------------------------------------------------------------------------------------------- S3
export const S3_W = 60; // bins of 10 frames: 5 min
export const S3_LEVEL = 12; // 1 min
export const S3_TREND = 6; // 30 s
export const S3_K = 5;
export const S3_TOL = 0.2;
export const S3_MIN_EVENTS = 10;
export interface S3Col { bin: number[]; t: number[]; zb: Int32Array; ab: Uint8Array; nAnts: number; arrivals: number[] }
export const S3_TYPES = [
  { name: 'crossing L→H', kind: 0, from: L, to: H },
  { name: 'crossing H→L', kind: 0, from: H, to: L },
  { name: 'entry→L', kind: 1, from: -2, to: L },
  { name: 'entry→H', kind: 1, from: -2, to: H },
];
/** Per colony and arrival type: the matched events' DiD and own post − pre, and the balance in L and R (SD units). */
export function s3Colony(c: S3Col, excludeNear = true): Record<string, { did: number[]; own: number[]; balL: number[]; balR: number[]; found: number; dropped: number; unmatched: number }> {
  const nb = c.bin.length;
  const idx = new Map(c.bin.map((b, k) => [b, k]));
  const P = [0, 1, 2, 3].map((j) => { const p = new Float64Array(nb + 1); for (let k = 0; k < nb; k++) p[k + 1] = p[k] + c.zb[4 * k + j]; return p; });
  const AP = new Map<number, Int32Array>(); // per ant prefix, lazily
  const antP = (a: number) => {
    let p = AP.get(a);
    if (!p) { p = new Int32Array((nb + 1) * 4); for (let k = 0; k < nb; k++) for (let j = 0; j < 4; j++) p[(k + 1) * 4 + j] = p[k * 4 + j] + c.ab[(a * nb + k) * 4 + j]; AP.set(a, p); }
    return p;
  };
  const blockOfK = (k: number) => blockKey(Math.floor(c.t[k] / 60));
  /** Moving fraction of zone z over bins [k1, k2), ant a excluded (a < 0: none). */
  const A = (z: number, k1: number, k2: number, a: number) => {
    let m = P[2 * z][k2] - P[2 * z][k1], s = P[2 * z + 1][k2] - P[2 * z + 1][k1];
    if (a >= 0) { const p = antP(a); m -= p[k2 * 4 + 2 * z] - p[k1 * 4 + 2 * z]; s -= p[k2 * 4 + 2 * z + 1] - p[k1 * 4 + 2 * z + 1]; }
    return s > 0 ? m / s : NaN;
  };
  /** Window rule: bins [k − W, k + W) present without a missing bin and inside k's block. */
  const okWin = (k: number) => k - S3_W >= 0 && k + S3_W <= nb && c.bin[k + S3_W - 1] - c.bin[k - S3_W] === 2 * S3_W - 1 && blockOfK(k - S3_W) === blockOfK(k) && blockOfK(k + S3_W - 1) === blockOfK(k);
  const LR = (z: number, k: number, a: number) => { const l = A(z, k - S3_LEVEL, k, a); return [l, A(z, k - S3_TREND, k, a) - A(z, k - S3_LEVEL, k - S3_TREND, a)]; };
  const out: ReturnType<typeof s3Colony> = {};
  for (const ty of S3_TYPES) {
    const ev: { k: number; a: number }[] = [];
    let found = 0, dropped = 0, unmatched = 0;
    for (let q = 0; q < c.arrivals.length; q += 6) {
      if (c.arrivals[q + 2] !== ty.kind || c.arrivals[q + 3] !== ty.from || c.arrivals[q + 4] !== ty.to) continue;
      found++;
      const k = idx.get(Math.floor(c.arrivals[q] / 10));
      if (k === undefined || !okWin(k)) { dropped++; continue; }
      ev.push({ k, a: c.arrivals[q + 1] });
    }
    const evBins = new Set<number>();
    for (let q = 0; q < c.arrivals.length; q += 6) if (c.arrivals[q + 2] === ty.kind && c.arrivals[q + 3] === ty.from && c.arrivals[q + 4] === ty.to) evBins.add(Math.floor(c.arrivals[q] / 10));
    const near = (k: number) => { if (!excludeNear) return false; for (let j = -S3_W; j < S3_W; j++) if (evBins.has(c.bin[k] + j)) return true; return false; };
    const z = ty.to;
    const byBlock = new Map<number, number[]>();
    for (let k = 0; k < nb; k++) if (okWin(k) && !near(k)) { const b = blockOfK(k); const v = byBlock.get(b) ?? []; v.push(k); byBlock.set(b, v); }
    const sd = new Map<number, [number, number]>();
    for (const [b, ks] of byBlock) {
      const ls = ks.map((k) => LR(z, k, -1));
      const sdv = (v: number[]) => { const f = v.filter(Number.isFinite); const m = mean(f); return Math.sqrt(f.reduce((s, x) => s + (x - m) ** 2, 0) / Math.max(1, f.length - 1)); };
      sd.set(b, [sdv(ls.map((x) => x[0])), sdv(ls.map((x) => x[1]))]);
    }
    const did: number[] = [], own: number[] = [], balL: number[] = [], balR: number[] = [];
    for (const e of ev) {
      const b = blockOfK(e.k);
      const ks = byBlock.get(b) ?? [];
      const [sL, sR] = sd.get(b) ?? [NaN, NaN];
      const [le, re] = LR(z, e.k, e.a);
      const de = A(z, e.k, e.k + S3_W, e.a) - A(z, e.k - S3_W, e.k, e.a);
      if (!Number.isFinite(le) || !Number.isFinite(re) || !Number.isFinite(de) || !(sL > 0) || !(sR > 0)) { dropped++; continue; }
      const acc: { d: number; k: number; l: number; r: number }[] = [];
      for (const k of ks) {
        const [lc, rc] = LR(z, k, e.a);
        if (Math.abs(lc - le) <= S3_TOL * sL && Math.abs(rc - re) <= S3_TOL * sR) acc.push({ d: Math.hypot((lc - le) / sL, (rc - re) / sR), k, l: lc, r: rc });
      }
      if (!acc.length) { unmatched++; continue; }
      acc.sort((p, q) => p.d - q.d);
      const use = acc.slice(0, S3_K);
      const dc = mean(use.map((u) => A(z, u.k, u.k + S3_W, e.a) - A(z, u.k - S3_W, u.k, e.a)));
      if (!Number.isFinite(dc)) { unmatched++; continue; }
      did.push(de - dc);
      own.push(de);
      balL.push((le - mean(use.map((u) => u.l))) / sL);
      balR.push((re - mean(use.map((u) => u.r))) / sR);
    }
    out[ty.name] = { did, own, balL, balR, found, dropped, unmatched };
  }
  return out;
}
export function s3Summary(per: ReturnType<typeof s3Colony>[], key: number): Record<string, unknown> {
  const res: Record<string, unknown> = {};
  const colMean = (name: string, f: 'did' | 'own' | 'balL' | 'balR') => per.map((p) => (p[name].did.length >= S3_MIN_EVENTS ? mean(p[name][f]) : NaN));
  S3_TYPES.forEach((ty, i) => {
    res[ty.name] = {
      coloniesContributing: per.filter((p) => p[ty.name].did.length >= S3_MIN_EVENTS).length,
      did: boot(colMean(ty.name, 'did'), RNG.stream(SEED, key, 1700 + i)),
      ownPostMinusPre: boot(colMean(ty.name, 'own'), RNG.stream(SEED, key, 1800 + i)),
      balance: { level: mean(colMean(ty.name, 'balL')), trend: mean(colMean(ty.name, 'balR')) },
      events: { found: per.reduce((s, p) => s + p[ty.name].found, 0), dropped: per.reduce((s, p) => s + p[ty.name].dropped, 0), unmatched: per.reduce((s, p) => s + p[ty.name].unmatched, 0), matched: per.reduce((s, p) => s + p[ty.name].did.length, 0) },
    };
  });
  const diff = (a: string, b: string, k: number) => boot(per.map((_, c) => colMean(a, 'did')[c] - colMean(b, 'did')[c]), RNG.stream(SEED, key, k));
  res['direction: crossing into H minus into L'] = diff('crossing L→H', 'crossing H→L', 1900);
  res['direction: entry into H minus into L'] = diff('entry→H', 'entry→L', 1901);
  return res;
}

// ------------------------------------------------------------------------------------------------------- empirical CLI
interface ColJson {
  colony: string; roles: string[]; onsets: number[]; elig: number[][]; atRisk: number[]; grid: Grid; bins: Bins;
  zoneBins: string; antBins: string; minutes: { minute: number[]; cur: number[][]; fix: number[][] }; arrivals: number[];
}
const fromB64 = <T extends Int32Array | Uint8Array>(s: string, C: { new (b: ArrayBuffer): T }): T => { const b = Buffer.from(s, 'base64'); const ab = new ArrayBuffer(b.length); new Uint8Array(ab).set(b); return new C(ab); };
export const EPISODE_SETS: { name: string; minAnts: number; gap: number; strict: boolean }[] = [
  { name: 'primary (3 ants, 5-s gap)', minAnts: 3, gap: 10, strict: false },
  { name: '5 ants', minAnts: 5, gap: 10, strict: false },
  { name: '10-s gap', minAnts: 3, gap: 20, strict: false },
  { name: '5 ants and 10-s gap', minAnts: 5, gap: 20, strict: false },
  { name: 'strict uninterrupted tracking', minAnts: 3, gap: 10, strict: true },
];
async function main(): Promise<void> {
  const args = process.argv;
  const opt = (n: string, d: string) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
  if (opt('--assign', '') !== 'real' || !args.includes('--empirical')) throw new Error('the empirical reader needs --empirical --assign real (only after the freeze, P151)');
  const out = opt('--out', '');
  if (!out) throw new Error('--out <path> required');
  const work = opt('--work', 'logs/h6-work');
  const parts = opt('--parts', 'primary,s1,s2,s3').split(',');
  const draws = Number(opt('--draws', '1000')), B = Number(opt('--boot', '2000'));
  const files = fs.readdirSync(work).filter((f) => /^c\d+\.json$/.test(f)).sort((a, b) => Number(a.slice(1, -5)) - Number(b.slice(1, -5)));
  const data: ColJson[] = files.map((f) => JSON.parse(fs.readFileSync(`${work}/${f}`, 'utf8')) as ColJson);
  const zones = data.map((d) => buildZones(d.grid));
  const ctx = data.map((d) => context(d.bins));
  const res: Record<string, unknown> = { reader: 'scripts/scratch/h6/reader.ts', colonies: data.map((d) => d.colony), zones: zones.map((z) => ({ nL: z.nL, nH: z.nH, nUnassigned: z.nU })), options: { draws, boot: B, ELIG_INITIATOR, ELIG_RULE } };
  if (parts.includes('primary')) {
    const sets: Record<string, unknown> = {};
    EPISODE_SETS.forEach((es, si) => {
      const cols: PCol[] = data.map((d, c) => ({ label: d.colony, nAnts: d.roles.length, eps: skeleton(d, zones[c], es.minAnts, es.gap, es.strict, (f) => ctx[c](f)?.quiet).map((ep) => withInit(ep, realInitiators(ep))) }));
      const key = 10 + si;
      const P = { draws, boot: B, key, listAnts: si === 0, descriptive: true };
      const r: Record<string, unknown> = { episodes: cols.map((c) => c.eps.length), ...scorePrimary(cols, P) };
      const quiet = cols.map((c) => ({ ...c, eps: c.eps.filter((e) => e.quiet) }));
      r['quiet-start episodes'] = scorePrimary(quiet, { ...P, key: key + 100, listAnts: false });
      for (const ref of ['null1', 'null3'] as Ref[]) {
        r[`shares ${ref}`] = {
          role: shares(cols, ref, (ep, k) => ep.role![k], ['nurse', 'forager', 'queen'], key * 10 + (ref === 'null1' ? 1 : 3)),
          zone: ref === 'null1' ? shares(cols, ref, (ep, k) => ep.zone[k], [L, H, -1], key * 10 + 5) : 'kept by the reference',
          'contact class 10 s': shares(cols, ref, (ep, k) => ep.cls10![k], [CLS_NOOBS, CLS_CONTACT, CLS_UNKNOWN], key * 10 + 6 + (ref === 'null1' ? 0 : 2)),
          'contact class 60 s': shares(cols, ref, (ep, k) => ep.cls60![k], [CLS_NOOBS, CLS_CONTACT, CLS_UNKNOWN], key * 10 + 7 + (ref === 'null1' ? 0 : 2)),
        };
      }
      sets[es.name] = r;
    });
    const prim = sets[EPISODE_SETS[0].name] as { null1: PrimaryResult; null3: PrimaryResult };
    const disagreements: string[] = [];
    for (const [n, v] of Object.entries(sets)) for (const ref of ['null1', 'null3'] as const) if ((v as { null1: PrimaryResult; null3: PrimaryResult })[ref].label !== prim[ref].label) disagreements.push(`${n}, ${ref}: ${(v as { null1: PrimaryResult; null3: PrimaryResult })[ref].label} (primary: ${prim[ref].label})`);
    res.primary = { decision: { null1: prim.null1.label, null3: prim.null3.label }, note: 'the two decision labels are the primary set\'s; every other set is a sensitivity and cannot overturn them (P144, P149)', disagreements, sets };
  }
  if (parts.includes('s1')) {
    const s: Record<string, unknown> = {};
    const S1cols: S1Col[] = data.map((d, c) => {
      const on = parseOnsets(d.onsets).map((o) => ({ f: o.f, flags: o.flags }));
      const ar: { f: number; flags: number }[] = [];
      for (let k = 0; k < d.atRisk.length; k += 4) ar.push({ f: d.atRisk[k], flags: d.atRisk[k + 3] });
      return { onsets: on, atRisk: ar, ctx: ctx[c] };
    });
    for (const w of [10, 60] as const) for (const rule of ['exclude', 'asContact', 'asNoObservedContact'] as UnknownRule[]) s[`W ${w} s, unknowns ${rule}`] = s1(S1cols, w, rule, 3000 + w + (rule === 'exclude' ? 0 : rule === 'asContact' ? 1 : 2));
    const uf: Record<string, unknown> = {};
    for (const w of [10, 60] as const) {
      const onsetRows = data.map((d) => parseOnsets(d.onsets));
      const riskRows = data.map((d) => { const r: { a: number; cell: number; f: number; flags: number }[] = []; for (let k = 0; k < d.atRisk.length; k += 4) r.push({ f: d.atRisk[k], a: d.atRisk[k + 1], cell: d.atRisk[k + 2], flags: d.atRisk[k + 3] }); return r; });
      const rows = (which: 'onsets' | 'atRisk') => (which === 'onsets' ? onsetRows : riskRows).map((xs, c) => xs.map((x) => ({ c, a: x.a, cell: x.cell, f: x.f, flags: x.flags })));
      for (const which of ['onsets', 'atRisk'] as const) {
        const R = rows(which);
        uf[`W ${w} s, ${which}, by role`] = unknownFractions(R, (x) => data[x.c].roles[x.a], (x) => classOf(x.flags, w), 4000 + w);
        uf[`W ${w} s, ${which}, by zone`] = unknownFractions(R, (x) => { const z = zones[x.c].zoneOf.get(x.cell); return z === L ? 'L' : z === H ? 'H' : 'unassigned'; }, (x) => classOf(x.flags, w), 4100 + w);
        uf[`W ${w} s, ${which}, by activity context`] = unknownFractions(R, (x) => { const cx = ctx[x.c](x.f); return cx ? `level${cx.level}-slope${cx.slope}` : undefined; }, (x) => classOf(x.flags, w), 4200 + w);
      }
    }
    res.s1 = { strata: s, unknownFractions: uf };
  }
  if (parts.includes('s2')) {
    const s: Record<string, unknown> = {};
    for (const mem of ['cur', 'fix'] as const) {
      const series = data.map((d) => seriesFrom(d.colony, d.minutes.minute, d.minutes[mem]));
      for (let p = 1; p <= 5; p++) s[`${mem === 'cur' ? 'current location' : 'fixed membership (modal zone)'}, lag ${p}`] = s2Summary(series, p, draws, 5000 + (mem === 'cur' ? 0 : 10));
    }
    res.s2 = s;
  }
  if (parts.includes('s3')) {
    const per = data.map((d) => s3Colony({ bin: d.bins.bin, t: d.bins.t, zb: fromB64(d.zoneBins, Int32Array), ab: fromB64(d.antBins, Uint8Array), nAnts: d.roles.length, arrivals: d.arrivals }));
    res.s3 = s3Summary(per, 6000);
  }
  fs.mkdirSync(out.replace(/\/[^/]*$/, ''), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(res, (_, v) => (typeof v === 'number' && !Number.isFinite(v) ? null : v), 1));
  console.log(`reader: wrote ${out}`);
}
if (process.argv.includes('--h6-read')) await main();
