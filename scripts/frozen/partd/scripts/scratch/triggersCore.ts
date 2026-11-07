// Scratch (not committed): Part D Part 2 item 1(b), forager nest entries and queen movement onsets against in-nest
// activity (D212 as amended by its amendment 1, D213; T035). The per-colony part: one pass over a colony's frames in
// stream order (fed by `streamColony`, or by the synthetic checks in `triggersSyn.ts` through the same class), one 4-h
// clock block held at a time (per ant and frame, plus a margin of the frames before it for the look-back of the event
// rules), each block analysed when it ends. Statistics across colonies are in `triggersStats.ts`.
//
// Definitions (amendment 1 governs where it differs from D212):
// - Step rule: `StepRule` from `activitySeries.ts` (imported): two in-nest detections ≤ 3 frames apart, moving if
//   ≥ 0.6 mm/frame. The per-frame read of an ant is the read the step rule ends the frame with (its first read, or the
//   second when the first was outside the nest, as `ActivitySeries` does).
// - Activity A over [a, b): moving steps / steps of the in-nest nurses and foragers in [a, b), the event ant excluded
//   (at the event and at each of its candidate and control times). The queen is never in the activity set.
// - Observed over [a, b): with P the ant's last detection at or before a, P and its detections in (a, b) are at most
//   10 s apart in sequence, and the last of them is at most 10 s before b (b itself may be the event's detection).
// - Forager entry at f: a forager's in-nest detection at f with every detection in [f − absence, f) outside the nest,
//   observed. Sensitivity: + residence (no outside detection in [f, f + 30 s), observed).
// - Queen onset at f: a moving queen step at f; over [f − S, f) every queen detection in the nest, observed, at least
//   ceil(S / 2 frames) steps and none moving. Sensitivity: + at least 3 moving queen steps in [f, f + 30 s).
// - Blocks: 4-h clock blocks from 06:00 UTC keyed by day and start hour (day × 100 + hour, as `syncStats.ts`); light =
//   blocks starting at 06, 10, 14 UTC (06-18, `STROEYMEYT_CFG`).
// - An event is dropped if [f − max(W, 1 min), f + W) leaves its block (edge) or contains a frame of a recording gap
//   > 30 s (gap), or if one of its A values has no step (empty; not expected).
// - Candidates: frames on a 5-s grid (every 10 frames) of the block with the same window rule and no event of the same
//   type (same definition) in [c − W, c + W). L = A[t − 1 min, t), R = A[t − 30 s, t) − A[t − 1 min, t − 30 s); SD_L,
//   SD_R over the block's candidates with all ants (sample SD, scale only). Acceptable if |ΔL| ≤ 0.2 SD_L and
//   |ΔR| ≤ 0.2 SD_R (event ant excluded at the candidate); the K = 5 nearest in SD units; none → unmatched.
// - Amendment 2 (D216): descriptive rows `*-ctrl5min`, the primary settings except that a candidate must be at least
//   5 min from every same-type event (no event g with |g − c| < 5 min) instead of outside [c − W, c + W). Events are
//   known only within the block, so such a candidate also needs [c − 5 min, c + 5 min) inside the block; its SD_L,
//   SD_R are over its own candidates.
// - Per event: DiD = (A_post − A_pre)_event − mean over its controls of (A_post − A_pre), A_pre = A[f − W, f),
//   A_post = A[f, f + W).
// Every duration is given in seconds and converted to frames once with `fr` (2 fps, `STROEYMEYT_CFG.frameDt`).
import { phaseOf, STROEYMEYT_CFG, type AntRole } from '../../src/sim/analysis/inNest';
import { ActivitySeries, StepRule } from './activitySeries';

export const DT = STROEYMEYT_CFG.frameDt;
/** Seconds → frames (2 fps). Every window and threshold goes through this. */
export const fr = (s: number): number => Math.round(s / DT);

/** Durations in seconds (D212 amendment 1). */
export const SEC = {
  cover: 10, // coverage: detections at most 10 s apart
  gap: 30, // a recording gap longer than this drops a window
  grid: 5, // candidate grid: every 10 frames
  level: 60, // L window
  half: 30, // R halves
  w: 60, // primary W
  absence: 30, // primary forager absence
  still: 120, // primary queen stillness
  residence: 30, // sensitivity: residence after entry
  steps3: 30, // sensitivity: 3 moving queen steps within 30 s
  tc: 300, // time course ± 5 min
  tcBin: 10, // 10-s bins
  riseFrom: 300, // pre-event rise window [f − 5 min, f − 1 min)
  riseTo: 60,
  sameWithin: 60, // overlap: another same-type event within ± 1 min
  margin: 360, // look-back kept before each block (≥ longest stillness + coverage)
  ctrl5min: 300, // amendment 2 descriptive row: candidates at least 5 min from any same-type event
} as const;
export const K = 5;
export const TOL = 0.2;
export const STEPS3_N = 3;
export const BANDS_MM = [20, 40];
const BLOCK_S = 4 * 3600;

export interface BlockId { key: number; startHour: number; phase: 'light' | 'dark' }
/** 4-h clock block from 06:00 UTC of UTC time t (s): key day × 100 + start hour (as `syncStats.ts`). */
export function blockOf(t: number): BlockId {
  const k = Math.floor((t / 3600 - 6) / 4);
  const sh = k * 4 + 6; // start, hours since the epoch
  const day = Math.floor(sh / 24);
  const startHour = ((sh % 24) + 24) % 24;
  return { key: day * 100 + startHour, startHour, phase: phaseOf(startHour, STROEYMEYT_CFG) };
}

export interface EventDef { type: 'forager' | 'queen'; absence?: number; residence?: boolean; still?: number; steps3?: boolean }
/** `ctrlExcl` (s, amendment 2): candidates at least this far from every same-type event (default: outside ± W). */
export interface Setting { name: string; phase: 'light' | 'dark'; def: EventDef; w: number; isolated: boolean; full: boolean; ctrlExcl?: number }
const F0: EventDef = { type: 'forager', absence: SEC.absence };
const Q0: EventDef = { type: 'queen', still: SEC.still };
/** Primary settings first (read with the frozen rule); every other row is descriptive (P90). */
export const SETTINGS: Setting[] = [
  { name: 'forager', phase: 'light', def: F0, w: SEC.w, isolated: false, full: true },
  { name: 'queen', phase: 'light', def: Q0, w: SEC.w, isolated: false, full: true },
  { name: 'forager-isolated', phase: 'light', def: F0, w: SEC.w, isolated: true, full: false },
  { name: 'queen-isolated', phase: 'light', def: Q0, w: SEC.w, isolated: true, full: false },
  { name: 'forager-ctrl5min', phase: 'light', def: F0, w: SEC.w, isolated: false, full: true, ctrlExcl: SEC.ctrl5min },
  { name: 'queen-ctrl5min', phase: 'light', def: Q0, w: SEC.w, isolated: false, full: true, ctrlExcl: SEC.ctrl5min },
  { name: 'forager-W20s', phase: 'light', def: F0, w: 20, isolated: false, full: false },
  { name: 'forager-W5min', phase: 'light', def: F0, w: 300, isolated: false, full: false },
  { name: 'queen-W20s', phase: 'light', def: Q0, w: 20, isolated: false, full: false },
  { name: 'queen-W5min', phase: 'light', def: Q0, w: 300, isolated: false, full: false },
  { name: 'forager-absence10s', phase: 'light', def: { type: 'forager', absence: 10 }, w: SEC.w, isolated: false, full: false },
  { name: 'forager-absence2min', phase: 'light', def: { type: 'forager', absence: 120 }, w: SEC.w, isolated: false, full: false },
  { name: 'forager-residence30s', phase: 'light', def: { ...F0, residence: true }, w: SEC.w, isolated: false, full: false },
  { name: 'queen-still1min', phase: 'light', def: { type: 'queen', still: 60 }, w: SEC.w, isolated: false, full: false },
  { name: 'queen-still5min', phase: 'light', def: { type: 'queen', still: 300 }, w: SEC.w, isolated: false, full: false },
  { name: 'queen-3steps', phase: 'light', def: { ...Q0, steps3: true }, w: SEC.w, isolated: false, full: false },
  { name: 'forager-dark', phase: 'dark', def: F0, w: SEC.w, isolated: false, full: false },
  { name: 'queen-dark', phase: 'dark', def: Q0, w: SEC.w, isolated: false, full: false },
];
const defKey = (d: EventDef): string => `${d.type}|${d.absence ?? ''}|${d.residence ? 1 : 0}|${d.still ?? ''}|${d.steps3 ? 1 : 0}`;

/** A control: [absolute frame, L, R, A_pre, A_post] (event ant excluded). */
export type Ctrl = [number, number, number, number, number];
export interface EventRow {
  f: number; ant: number; block: number;
  L: number; R: number; pre: number; post: number; did: number; pp: number; nC: number;
  dL: number; dR: number; dLz: number; dRz: number; same1m: boolean; otherW: boolean;
  ctrl: Ctrl[] | number[];
  roles?: { nurse: number; forager: number };
  bands?: number[];
  rise?: number | null;
}
export interface DropRow { f: number; ant: number; block: number; reason: 'edge' | 'gap' | 'empty' | 'unmatched'; same1m: boolean; otherW: boolean }
export interface Counts { found: number; edge: number; gap: number; empty: number; unmatched: number; matched: number; nCtrl: number[] }
export interface BlockSd { key: number; cands: number; sdL: number; sdR: number }
export interface TimeCourse { bins: number[]; ev: number[]; ctrl: number[]; diff: number[]; nEv: number[]; nCtrl: number[]; nDiff: number[] }
export interface SettingResult {
  name: string; phase: 'light' | 'dark'; type: 'forager' | 'queen'; def: EventDef; wS: number; isolated: boolean; full: boolean; ctrlExclS?: number;
  counts: Counts; blocks: BlockSd[]; events: EventRow[]; dropped: DropRow[]; tc?: TimeCourse;
}
export interface SelfCheck {
  activitySeries: { light: { mv: number; st: number }; dark: { mv: number; st: number } };
  triggers: { light: { mv: number; st: number }; dark: { mv: number; st: number } };
  equal: boolean;
}
export interface BlockInfo { key: number; phase: 'light' | 'dark'; first: number; last: number; present: number; longGapFrames: number; found: Record<string, number> }
export interface ColonyResult {
  colony: string;
  selfCheck: SelfCheck;
  ants: { nurse: number; forager: number; queen: number };
  blocks: BlockInfo[];
  tRegress: number;
  settings: SettingResult[];
}

interface Prefix { mv: Int32Array; st: Int32Array }
interface Ev { g: number; ant: number }
const ROLE_SETS = ['all', 'nurse', 'forager'] as const;
type RoleSet = (typeof ROLE_SETS)[number];

const sampleSd = (v: number[]): number => {
  if (v.length < 2) return NaN;
  const m = v.reduce((s, x) => s + x, 0) / v.length;
  return Math.sqrt(v.reduce((s, x) => s + (x - m) * (x - m), 0) / (v.length - 1));
};
const meanFinite = (v: number[]): number => {
  let s = 0;
  let n = 0;
  for (const x of v) if (Number.isFinite(x)) { s += x; n++; }
  return n > 0 ? s / n : NaN;
};

/**
 * One colony, fed frame by frame in stream order. `roles[i]` is the role of ant index i (as `roles()` maps tags),
 * `tags[i]` its tag (written to the outputs).
 */
export class ColonyTriggers {
  private readonly n: number;
  private readonly act: Uint8Array;
  private readonly isForager: Uint8Array;
  private readonly queens: number[];
  private readonly foragers: number[];
  private readonly rule: StepRule;
  private readonly series: ActivitySeries;
  private readonly asTally = { light: { mv: 0, st: 0 }, dark: { mv: 0, st: 0 } };
  private readonly myTally = { light: { mv: 0, st: 0 }, dark: { mv: 0, st: 0 } };
  // Block buffers (one block at a time, plus the margin before it).
  private cap = 0;
  private present = new Uint8Array(0);
  private longGap = new Uint8Array(0);
  private det: Int8Array[] = [];
  private step: Int8Array[] = [];
  private px: Float32Array[] = [];
  private py: Float32Array[] = [];
  private blk: (BlockId & { origin: number; first: number; last: number }) | null = null;
  private prevF = -1;
  private tRegress = 0;
  private readonly blocks: BlockInfo[] = [];
  private readonly results: SettingResult[];
  private readonly tcAcc = new Map<string, { sE: Float64Array; nE: Int32Array; sC: Float64Array; nC: Int32Array; sD: Float64Array; nD: Int32Array }>();
  // Frames, from seconds once.
  private readonly COVER = fr(SEC.cover);
  private readonly LONGGAP = fr(SEC.gap);
  private readonly GRID = fr(SEC.grid);
  private readonly LEVEL = fr(SEC.level);
  private readonly HALF = fr(SEC.half);
  private readonly MARGIN = fr(SEC.margin);
  private readonly TC = fr(SEC.tc);
  private readonly TCB = fr(SEC.tcBin);
  private readonly SAME = fr(SEC.sameWithin);

  constructor(readonly colony: string, readonly roles: (AntRole | undefined)[], readonly tags: number[], readonly settings: Setting[] = SETTINGS) {
    this.n = roles.length;
    this.act = Uint8Array.from(roles, (r) => (r === 'nurse' || r === 'forager' ? 1 : 0));
    this.isForager = Uint8Array.from(roles, (r) => (r === 'forager' ? 1 : 0));
    this.queens = roles.flatMap((r, i) => (r === 'queen' ? [i] : []));
    this.foragers = roles.flatMap((r, i) => (r === 'forager' ? [i] : []));
    this.rule = new StepRule(this.n);
    this.series = new ActivitySeries(Array.from(this.act, (a) => a === 1), 1);
    this.results = settings.map((s) => ({
      name: s.name, phase: s.phase, type: s.def.type, def: s.def, wS: s.w, isolated: s.isolated, full: s.full, ctrlExclS: s.ctrlExcl,
      counts: { found: 0, edge: 0, gap: 0, empty: 0, unmatched: 0, matched: 0, nCtrl: new Array(K + 1).fill(0) }, blocks: [], events: [], dropped: [],
    }));
    const nb = 2 * (this.TC / this.TCB);
    for (const s of settings) if (s.full) this.tcAcc.set(s.name, { sE: new Float64Array(nb), nE: new Int32Array(nb), sC: new Float64Array(nb), nC: new Int32Array(nb), sD: new Float64Array(nb), nD: new Int32Array(nb) });
  }

  frame(f: number, t: number, ids: number[], xs: number[], ys: number[], ins: boolean[]): void {
    // Self-check side: an ActivitySeries pass over the same frames (1-frame bins, phase from the frame's own clock hour).
    this.series.frame(f, ids, xs, ys, ins, t);
    const bin = this.series.bins.pop()!;
    const asPh = this.asTally[phaseOf(Math.floor(t / 3600), STROEYMEYT_CFG)];
    asPh.mv += bin[2];
    asPh.st += bin[3];

    const bk = blockOf(t);
    if (this.blk === null || bk.key > this.blk.key) {
      if (this.blk) this.finishBlock();
      this.startBlock(bk, f);
    } else if (bk.key < this.blk.key) this.tRegress++;
    const B = this.blk!;
    const idx = f - B.origin;
    this.ensureCap(idx + 1);
    if (this.prevF >= 0 && f - this.prevF > this.LONGGAP) for (let k = Math.max(0, this.prevF + 1 - B.origin); k < idx; k++) this.longGap[k] = 1;
    this.present[idx] = 1;
    B.last = f;
    for (let q = 0; q < ids.length; q++) {
      const i = ids[q];
      const r = this.rule.read(i, f, xs[q], ys[q], ins[q]);
      if (r < 0) continue;
      this.det[i][idx] = ins[q] ? 2 : 1;
      this.step[i][idx] = r;
      this.px[i][idx] = xs[q];
      this.py[i][idx] = ys[q];
    }
    this.prevF = f;
  }

  finish(): ColonyResult {
    if (this.blk) this.finishBlock();
    this.blk = null;
    for (const r of this.results) {
      const acc = this.tcAcc.get(r.name);
      if (!acc) continue;
      const nb = acc.sE.length;
      const half = nb / 2;
      r.tc = {
        bins: Array.from({ length: nb }, (_, k) => (k - half) * SEC.tcBin),
        ev: Array.from(acc.sE, (s, k) => (acc.nE[k] ? s / acc.nE[k] : NaN)),
        ctrl: Array.from(acc.sC, (s, k) => (acc.nC[k] ? s / acc.nC[k] : NaN)),
        diff: Array.from(acc.sD, (s, k) => (acc.nD[k] ? s / acc.nD[k] : NaN)),
        nEv: Array.from(acc.nE), nCtrl: Array.from(acc.nC), nDiff: Array.from(acc.nD),
      };
    }
    const a = this.asTally;
    const m = this.myTally;
    return {
      colony: this.colony,
      selfCheck: {
        activitySeries: { light: { ...a.light }, dark: { ...a.dark } },
        triggers: { light: { ...m.light }, dark: { ...m.dark } },
        equal: a.light.mv === m.light.mv && a.light.st === m.light.st && a.dark.mv === m.dark.mv && a.dark.st === m.dark.st,
      },
      ants: { nurse: this.roles.filter((r) => r === 'nurse').length, forager: this.foragers.length, queen: this.queens.length },
      blocks: this.blocks,
      tRegress: this.tRegress,
      settings: this.results,
    };
  }

  // ---- block buffers ----
  private alloc(cap: number): void {
    const grow = <T extends Int8Array | Uint8Array | Float32Array>(old: T, mk: (n: number) => T): T => {
      const a = mk(cap);
      a.set(old.subarray(0, Math.min(old.length, cap)) as never);
      return a;
    };
    this.present = grow(this.present, (n) => new Uint8Array(n));
    this.longGap = grow(this.longGap, (n) => new Uint8Array(n));
    for (let i = 0; i < this.n; i++) {
      this.det[i] = grow(this.det[i] ?? new Int8Array(0), (k) => new Int8Array(k));
      this.step[i] = grow(this.step[i] ?? new Int8Array(0), (k) => new Int8Array(k));
      this.px[i] = grow(this.px[i] ?? new Float32Array(0), (k) => new Float32Array(k));
      this.py[i] = grow(this.py[i] ?? new Float32Array(0), (k) => new Float32Array(k));
    }
    this.cap = cap;
  }
  private ensureCap(n: number): void {
    if (n > this.cap) this.alloc(Math.max(n, Math.ceil(this.cap * 1.25)));
  }
  private startBlock(bk: BlockId, f: number): void {
    const origin = f - this.MARGIN;
    if (!this.blk) {
      this.alloc(this.MARGIN + fr(BLOCK_S) + 400);
    } else {
      // Keep the frames [f − margin, f) of the previous arrays as the new margin; clear the rest.
      const s = origin - this.blk.origin;
      if (s < 0) throw new Error(`${this.colony}: block start before the previous block`);
      const vlen = this.blk.last - this.blk.origin + 1;
      const end = Math.min(vlen, s + this.MARGIN);
      const shift = (a: Int8Array | Uint8Array | Float32Array) => {
        if (end > s) a.copyWithin(0, s, end);
        a.fill(0, Math.max(0, end - s));
      };
      shift(this.present);
      shift(this.longGap);
      for (let i = 0; i < this.n; i++) { shift(this.det[i]); shift(this.step[i]); shift(this.px[i]); shift(this.py[i]); }
    }
    this.blk = { ...bk, origin, first: f, last: f };
  }

  // ---- per-block analysis ----
  private finishBlock(): void {
    const B = this.blk!;
    const bs = B.first - B.origin;
    const be = B.last - B.origin;
    const nF = be + 2;
    // Prefix sums of steps and moving steps per role set (activity set only).
    const mk = (): Prefix => ({ mv: new Int32Array(nF), st: new Int32Array(nF) });
    const P: Record<RoleSet, Prefix> = { all: mk(), nurse: mk(), forager: mk() };
    for (let i = 0; i < this.n; i++) {
      if (!this.act[i]) continue;
      const rs: RoleSet = this.isForager[i] ? 'forager' : 'nurse';
      const s = this.step[i];
      for (let k = 0; k <= be; k++) {
        const c = s[k];
        if (c === 0) continue;
        P.all.st[k + 1]++;
        P[rs].st[k + 1]++;
        if (c === 2) { P.all.mv[k + 1]++; P[rs].mv[k + 1]++; }
      }
    }
    for (const rs of ROLE_SETS) for (let k = 1; k < nF; k++) { P[rs].mv[k] += P[rs].mv[k - 1]; P[rs].st[k] += P[rs].st[k - 1]; }
    const LG = new Int32Array(nF);
    let present = 0;
    let lgFrames = 0;
    for (let k = 0; k <= be; k++) {
      LG[k + 1] = LG[k] + this.longGap[k];
      if (k >= bs) { present += this.present[k]; lgFrames += this.longGap[k]; }
    }
    // Self-check tally: the block's own frames.
    const T = this.myTally[B.phase];
    T.mv += P.all.mv[be + 1] - P.all.mv[bs];
    T.st += P.all.st[be + 1] - P.all.st[bs];

    const antPrefix = new Map<number, Prefix>();
    const exOf = (ant: number): Prefix | null => {
      if (!this.act[ant]) return null;
      let p = antPrefix.get(ant);
      if (!p) {
        p = mk();
        const s = this.step[ant];
        for (let k = 0; k <= be; k++) { p.mv[k + 1] = p.mv[k] + (s[k] === 2 ? 1 : 0); p.st[k + 1] = p.st[k] + (s[k] > 0 ? 1 : 0); }
        antPrefix.set(ant, p);
      }
      return p;
    };
    const win = (Q: Prefix, a: number, b: number, ex: Prefix | null): number => {
      const m = Q.mv[b] - Q.mv[a] - (ex ? ex.mv[b] - ex.mv[a] : 0);
      const s = Q.st[b] - Q.st[a] - (ex ? ex.st[b] - ex.st[a] : 0);
      return s > 0 ? m / s : NaN;
    };
    const LV = this.LEVEL;
    const HF = this.HALF;
    const Lof = (t: number, ex: Prefix | null) => win(P.all, t - LV, t, ex);
    const Rof = (t: number, ex: Prefix | null) => win(P.all, t - HF, t, ex) - win(P.all, t - LV, t - HF, ex);

    // Events per definition (found in the block's own frames), cached.
    const evCache = new Map<string, Ev[]>();
    const eventsOf = (d: EventDef): Ev[] => {
      const key = defKey(d);
      let e = evCache.get(key);
      if (!e) {
        e = d.type === 'forager' ? this.findEntries(d, bs, be) : this.findOnsets(d, bs, be);
        e.sort((p, q) => p.g - q.g || p.ant - q.ant);
        evCache.set(key, e);
      }
      return e;
    };
    const found: Record<string, number> = {};
    for (const s of this.settings) if (!s.isolated && s.ctrlExcl === undefined && s.w === SEC.w && s.phase === B.phase) found[s.name] = eventsOf(s.def).length;
    this.blocks.push({ key: B.key, phase: B.phase, first: B.first, last: B.last, present, longGapFrames: lgFrames, found });

    const candCache = new Map<string, { c: number[]; Lall: number[]; Rall: number[]; sdL: number; sdR: number }>();
    const evPrefix = (ev: Ev[]): Int32Array => {
      const a = new Int32Array(nF);
      for (const e of ev) a[e.g + 1]++;
      for (let k = 1; k < nF; k++) a[k] += a[k - 1];
      return a;
    };
    const tc0 = (2 * this.TC) / this.TCB / 2;

    this.settings.forEach((s, si) => {
      if (s.phase !== B.phase) return;
      const res = this.results[si];
      const Wf = fr(s.w);
      const lw = Math.max(Wf, LV);
      const all = eventsOf(s.def);
      const other = eventsOf(s.def.type === 'forager' ? Q0 : F0);
      // Candidates and their all-ant L, R (scale).
      const Ef = s.ctrlExcl === undefined ? -1 : fr(s.ctrlExcl);
      const ck = `${defKey(s.def)}|${Wf}|${Ef}`;
      let C = candCache.get(ck);
      if (!C) {
        const EV = evPrefix(all);
        const c: number[] = [];
        const Lall: number[] = [];
        const Rall: number[] = [];
        let c0 = bs + lw;
        c0 += (((-(c0 + B.origin)) % this.GRID) + this.GRID) % this.GRID;
        for (let x = c0; x + Wf <= be + 1; x += this.GRID) {
          if (LG[x + Wf] - LG[x - lw] > 0) continue;
          if (Ef < 0) {
            if (EV[x + Wf] - EV[x - Wf] > 0) continue;
          } else {
            // Amendment 2: no same-type event g with |g − x| < 5 min, the whole ± 5 min inside the block.
            if (x - Ef < bs || x + Ef > be + 1) continue;
            if (EV[x + Ef] - EV[x - Ef + 1] > 0) continue;
          }
          const l = Lof(x, null);
          const r = Rof(x, null);
          if (!Number.isFinite(l) || !Number.isFinite(r)) continue;
          c.push(x);
          Lall.push(l);
          Rall.push(r);
        }
        C = { c, Lall, Rall, sdL: sampleSd(Lall), sdR: sampleSd(Rall) };
        candCache.set(ck, C);
      }
      res.blocks.push({ key: B.key, cands: C.c.length, sdL: C.sdL, sdR: C.sdR });
      const { sdL, sdR } = C;
      const z = (d: number, sd: number) => (sd > 0 ? d / sd : d === 0 ? 0 : Infinity);
      const acc = this.tcAcc.get(s.name);

      const near = (g: number, list: Ev[], lo: number, hi: number, self: number): boolean => {
        // Any event of `list` (other than index `self`) with lo <= g' − g < hi.
        for (let j = 0; j < list.length; j++) {
          if (j === self) continue;
          const d = list[j].g - g;
          if (d >= lo && d < hi) return true;
          if (d >= hi) break;
        }
        return false;
      };

      all.forEach((e, ei) => {
        const { g, ant } = e;
        if (s.isolated && near(g, all, -Wf + 1, Wf, ei)) return;
        res.counts.found++;
        const same1m = near(g, all, -this.SAME + 1, this.SAME, ei);
        const otherW = near(g, other, -Wf, Wf, -1);
        const drop = (reason: DropRow['reason']) => { res.counts[reason]++; res.dropped.push({ f: g + B.origin, ant: this.tags[ant], block: B.key, reason, same1m, otherW }); };
        if (g - lw < bs || g + Wf > be + 1) return drop('edge');
        if (LG[g + Wf] - LG[g - lw] > 0) return drop('gap');
        const ex = exOf(ant);
        const Le = Lof(g, ex);
        const Re = Rof(g, ex);
        const pre = win(P.all, g - Wf, g, ex);
        const post = win(P.all, g, g + Wf, ex);
        if (![Le, Re, pre, post].every(Number.isFinite)) return drop('empty');
        // Matching: acceptable candidates, K nearest (ties: earlier candidate).
        const best: { d: number; k: number; L: number; R: number; pre: number; post: number }[] = [];
        if (Number.isFinite(sdL) && Number.isFinite(sdR)) {
          for (let k = 0; k < C.c.length; k++) {
            const x = C.c[k];
            const Lc = Lof(x, ex);
            const zl = z(Lc - Le, sdL);
            if (!(Math.abs(zl) <= TOL)) continue;
            const Rc = Rof(x, ex);
            const zr = z(Rc - Re, sdR);
            if (!(Math.abs(zr) <= TOL)) continue;
            const d = Math.hypot(zl, zr);
            if (best.length === K && !(d < best[K - 1].d)) continue;
            const pc = win(P.all, x - Wf, x, ex);
            const qc = win(P.all, x, x + Wf, ex);
            if (!Number.isFinite(pc) || !Number.isFinite(qc)) continue;
            let j = best.length;
            while (j > 0 && best[j - 1].d > d) j--;
            best.splice(j, 0, { d, k: x, L: Lc, R: Rc, pre: pc, post: qc });
            if (best.length > K) best.pop();
          }
        }
        if (best.length === 0) return drop('unmatched');
        res.counts.matched++;
        res.counts.nCtrl[best.length]++;
        const mC = (f: (b: (typeof best)[number]) => number) => best.reduce((t, b) => t + f(b), 0) / best.length;
        const pp = post - pre;
        const dL = Le - mC((b) => b.L);
        const dR = Re - mC((b) => b.R);
        const row: EventRow = {
          f: g + B.origin, ant: this.tags[ant], block: B.key, L: Le, R: Re, pre, post, did: pp - mC((b) => b.post - b.pre), pp, nC: best.length,
          dL, dR, dLz: z(dL, sdL), dRz: z(dR, sdR), same1m, otherW,
          ctrl: s.full ? best.map((b): Ctrl => [b.k + B.origin, b.L, b.R, b.pre, b.post]) : best.map((b) => b.k + B.origin),
        };
        if (s.full) {
          // Nurses and foragers separately (same controls).
          const roleDid = (rs: RoleSet): number => {
            const exr = rs === 'all' || (rs === 'forager') === (this.isForager[ant] === 1) ? ex : null;
            const de = win(P[rs], g, g + Wf, exr) - win(P[rs], g - Wf, g, exr);
            const dc = meanFinite(best.map((b) => win(P[rs], b.k, b.k + Wf, exr) - win(P[rs], b.k - Wf, b.k, exr)));
            return de - dc;
          };
          row.roles = { nurse: roleDid('nurse'), forager: roleDid('forager') };
          // Distance bands from the event ant's position at the event (its read at f), same controls.
          const ex0 = this.px[ant][g];
          const ey0 = this.py[ant][g];
          const be0 = this.bandPP(g, Wf, ex0, ey0, ant);
          const bc = best.map((b) => this.bandPP(b.k, Wf, ex0, ey0, ant));
          row.bands = be0.map((v, j) => v - meanFinite(bc.map((x) => x[j])));
          // Time course and pre-event rise, on events and controls whose ± 5 min lie inside the block.
          row.rise = null;
          if (acc && g - this.TC >= bs && g + this.TC <= be + 1) {
            const okC = best.filter((b) => b.k - this.TC >= bs && b.k + this.TC <= be + 1);
            for (let j = 0; j < 2 * tc0; j++) {
              const a = g + (j - tc0) * this.TCB;
              const ve = win(P.all, a, a + this.TCB, ex);
              const vc = meanFinite(okC.map((b) => win(P.all, b.k + (j - tc0) * this.TCB, b.k + (j - tc0 + 1) * this.TCB, ex)));
              if (Number.isFinite(ve)) { acc.sE[j] += ve; acc.nE[j]++; }
              if (Number.isFinite(vc)) { acc.sC[j] += vc; acc.nC[j]++; }
              if (Number.isFinite(ve) && Number.isFinite(vc)) { acc.sD[j] += ve - vc; acc.nD[j]++; }
            }
            const rf = fr(SEC.riseFrom);
            const rt = fr(SEC.riseTo);
            const re = win(P.all, g - rf, g - rt, ex);
            const rc = meanFinite(okC.map((b) => win(P.all, b.k - rf, b.k - rt, ex)));
            if (Number.isFinite(re) && Number.isFinite(rc)) row.rise = re - rc;
          }
        }
        res.events.push(row);
      });
    });
  }

  /** Post − pre moving fraction per distance band around (x0, y0), activity set without `ex`: [band0, band1, band2]. */
  private bandPP(t: number, Wf: number, x0: number, y0: number, ex: number): number[] {
    const nb = BANDS_MM.length + 1;
    const cnt = new Float64Array(4 * nb); // [mvPre, stPre, mvPost, stPost] per band
    for (let i = 0; i < this.n; i++) {
      if (!this.act[i] || i === ex) continue;
      const s = this.step[i];
      const X = this.px[i];
      const Y = this.py[i];
      for (let k = t - Wf; k < t + Wf; k++) {
        const c = s[k];
        if (c === 0) continue;
        const d = Math.hypot(X[k] - x0, Y[k] - y0);
        let b = 0;
        while (b < BANDS_MM.length && d >= BANDS_MM[b]) b++;
        const o = 4 * b + (k < t ? 0 : 2);
        cnt[o + 1]++;
        if (c === 2) cnt[o]++;
      }
    }
    return Array.from({ length: nb }, (_, b) => {
      const pre = cnt[4 * b + 1] > 0 ? cnt[4 * b] / cnt[4 * b + 1] : NaN;
      const post = cnt[4 * b + 3] > 0 ? cnt[4 * b + 2] / cnt[4 * b + 3] : NaN;
      return post - pre;
    });
  }

  // ---- event rules (block-local indices; look-back may use the margin) ----
  /** Observed absence of `A` frames before an in-nest detection at g: every detection in [g − A, g) outside, observed. */
  absenceAt(d: Int8Array, g: number, A: number): boolean {
    const a = g - A;
    let prev = g;
    for (let h = g - 1; h >= 0; h--) {
      const v = d[h];
      if (prev - h > this.COVER) return false;
      if (v === 0) continue;
      if (h >= a && v === 2) return false;
      if (h <= a) return true;
      prev = h;
    }
    return false;
  }
  /** Observed residence over [g, g + R): no outside detection, detections ≤ COVER apart, the last ≤ COVER before the end. */
  private residenceAt(d: Int8Array, g: number, R: number): boolean {
    let prev = g;
    for (let h = g + 1; h < g + R; h++) {
      const v = d[h];
      if (v === 0) continue;
      if (v === 1) return false;
      if (h - prev > this.COVER) return false;
      prev = h;
    }
    return g + R - prev <= this.COVER;
  }
  /** Observed stillness of S frames before g: queen detections in the nest, observed, ≥ ceil(S/2) steps, none moving. */
  stillAt(d: Int8Array, st: Int8Array, g: number, S: number): boolean {
    const a = g - S;
    let prev = g;
    let steps = 0;
    for (let h = g - 1; h >= 0; h--) {
      if (prev - h > this.COVER) return false;
      if (h >= a) {
        if (st[h] === 2) return false;
        if (st[h] === 1) steps++;
      }
      const v = d[h];
      if (v === 0) continue;
      if (h >= a && v === 1) return false;
      if (h <= a) return steps >= Math.ceil(S / 2);
      prev = h;
    }
    return false;
  }
  private findEntries(d: EventDef, bs: number, be: number): Ev[] {
    const A = fr(d.absence!);
    const R = fr(SEC.residence);
    const out: Ev[] = [];
    for (const i of this.foragers) {
      const det = this.det[i];
      for (let g = bs; g <= be; g++) {
        if (det[g] !== 2 || !this.absenceAt(det, g, A)) continue;
        // Residence look-ahead beyond the block: kept (the event is then dropped at the block edge).
        if (d.residence && g + R - 1 <= be && !this.residenceAt(det, g, R)) continue;
        out.push({ g, ant: i });
      }
    }
    return out;
  }
  private findOnsets(d: EventDef, bs: number, be: number): Ev[] {
    const S = fr(d.still!);
    const W3 = fr(SEC.steps3);
    const out: Ev[] = [];
    for (const q of this.queens) {
      const det = this.det[q];
      const st = this.step[q];
      for (let g = bs; g <= be; g++) {
        if (st[g] !== 2 || !this.stillAt(det, st, g, S)) continue;
        if (d.steps3 && g + W3 - 1 <= be) {
          let m = 0;
          for (let h = g; h < g + W3; h++) if (st[h] === 2) m++;
          if (m < STEPS3_N) continue;
        }
        out.push({ g, ant: q });
      }
    }
    return out;
  }
}
