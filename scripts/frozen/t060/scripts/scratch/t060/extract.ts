// Scratch (not committed): T060 Stage 0, brief 2: the extraction of per-colony event tables (events.ts `ColonyEvents`)
// from frames, one code path for the Stroeymeyt tracks and Scope B's synthetic tracks (scopeB.ts). D243 amendments 1 and
// 2; the lead's dated blocks of 2026-11-03 ≈ 01:04 and ≈ 06:51 UTC govern (the 06:51 block where it is more specific).
//
//   npx vite-node scripts/scratch/t060/extract.ts --colony i --out <dir>
//       → <dir>/c<i>.json (primary) and <dir>/c<i>.<variant>.json (v10, bridge, plain, nodeath). `--out` is required.
//   npx vite-node scripts/scratch/t060/extract.ts --colony i --repro --out logs/t060-repro
//       → logs/t060-repro/repro-c<i>.json only: the same pass with the reproduction side-objects. The event tables are
//       built in memory (so the code path runs on the data) and are neither written nor summarised (P164).
//
// Terms (P155): a PDC is a proximity-defined contact: ContactOnset's crossing (contactOnset.ts lines 97-130; mirrored as in
// H6Pass1): the pair crosses into 4.1 mm (far again only beyond 5.1 mm; a joint gap > 3 frames forgets the pair) while
// the partner moves (consecutive-frame in-nest step >= 0.6 mm, code 2) and the focal is still (code 1). Touches are
// unverified. A near approach is a proximity-defined near approach: the focal still (code 1) and the partner moving
// (code 2) when the pair enters 8 mm from farther (far again only beyond 9 mm, same pair bookkeeping); it is a near
// approach if no PDC between the two occurs before the pair is beyond 9 mm again; its frame is the entry. Every tag on
// the colony's list is a possible partner.
//
// Rules (06:51 block):
// - The colony's list: every tag of the PreTreatment tag file, any final status, the queen included as a partner; focal
//   ants are the nurses and foragers of `roles()`. A tag's `death` frame (tracking clock) shows it absent from that frame
//   on if it has no read at or after it in the file; a tag read after its recorded death keeps no death record (counted).
// - Steps follow the onset step rule (`StepRule`: two in-nest reads at most 3 frames apart, moving if >= 0.6 mm/frame;
//   an out-of-nest read or a longer gap is a break). A still run starts at the read that ends a moving step; a run whose
//   start follows a break (a gap of more than 3 frames, an out-of-nest read, the recording's start) is not recorded and
//   the bout around it is incomplete. Onset candidate: a moving step after >= 20 still frames.
// - Sustained-onset rule: a candidate is accepted if the focal's read at +4 (else its nearest read in +3 ... +6, the
//   earlier on a tie) is >= 1 mm from its last still position (the read before the step); otherwise it is an absorbed
//   excursion: the run continues and every moving step in +1 ... +6 belongs to it. No read in +3 ... +6: the onset
//   status is unknown, the interval unknown from the candidate's frame (`onsetStatus`), the next bout incomplete.
// - Inactive interval: a still run that reaches 120 frames, first still frame at or after 06:00; censored at 18:00.
//   A break inside it makes it unknown from the first unread frame (`focalGap`) or the out-of-nest read (`exit`).
//   A complete bout: accepted onset, then read in the nest with no gap of more than 3 frames to the next start.
// - Blind frames of a pair (focal i, partner j) within a span: j or i unread; either ant's read follows an unread frame
//   (code 3); j read outside the nest; i makes a moving step the sustained-onset rule absorbs. A run of them is a blind
//   contact opportunity if (i) j is read on a frame of it within 4.1 mm of the focal's still position q, (ii) j has
//   unread frames in it and D252's `reachable` (frozen extract.ts) holds for them (j's bracketing reads, r = 4.1 mm,
//   v = 20 mm/s, the span as the window), or (iii) j's unread run is not bracketed by reads within the light phase.
//   Unknown from: (i), (iii) the run's first frame; (ii) floor(a); never before the span's start. Causes `partnerBlind`
//   ((i), (ii)) and `partnerUnbracketed` ((iii)). Near approaches never make a history unknown.
// - Sensitivities (unlabelled): v10 (v = 10 mm/s); bridge (P154: a focal unread run of at most 60 frames inside an
//   interval with < 1 mm displacement across it is still and known; its frames are blind for every pair); plain (the
//   plain onset: every candidate accepted); nodeath (no death record).
// - Zones: frozen `buildZones` on this pass's grid (nurses' and foragers' light in-nest reads, 2-mm cells), at the
//   focal's read at the interval's start. Bins: H6Pass1's 10-frame moving-fraction bins (nurses and foragers, StepRule).
//
// EDGE cases (P161: where no text settles a case, the reading that makes fewer histories complete and fewer intervals
// or triplets usable) are marked `// EDGE:` below.
import { ARGV } from './argvGuard';
import fs from 'node:fs';
import { buildZones, cellOf, type Grid } from '../../frozen/h6/scripts/scratch/h6-next/reader';
import { StepRule } from '../../frozen/h6/scripts/scratch/activitySeries';
import { CAUSES, validateColony, type Ant, type Bins, type Bout, type Cause, type ColonyEvents, type Interval, type Role } from './events';

// The frozen H6 extractor runs its own main when argv holds '--colony'; argvGuard (imported above, so evaluated first)
// has renamed it. Checked again before the dynamic import.
if (process.argv.includes('--colony')) throw new Error('argvGuard did not rename --colony before the frozen H6 extractor was loaded');
const H6X = await import('../../frozen/h6/scripts/scratch/h6-next/extract');
export const reachable = H6X.reachable;
export const isLight = H6X.isLight;

// ------------------------------------------------------------------------------------------------------------ constants
export const VARIANTS = ['primary', 'v10', 'bridge', 'plain', 'nodeath'] as const;
export type Variant = (typeof VARIANTS)[number];
export const R_PDC = 4.1, R_PDC_OUT = 5.1, BOX_PDC = 8; // ContactOnset's crossing
export const R_NEAR = 8, R_NEAR_OUT = 9, BOX_NEAR = 9; // near approach (wider box for the 9-mm hysteresis)
// EDGE: a break is a gap of more than 3 frames between reads (3 or more unread frames), the onset step rule's own
// tolerance (the rule resets the still count there), also where the 06:51 block says "an unread run of more than 3 frames".
export const MOVE_MM = 0.6, ONSET_STILL = 20, INTERVAL_MIN = 120, GAP_MAX = 3, SUSTAIN_MM = 1;
export const R_REACH = 4.1, V_PRIMARY = 20, V_SENS = 10; // mm, mm/s
export const BRIDGE_MAX_UNREAD = 60, BRIDGE_MM = 1;
export const SPEED_BOUND = 20; // mm/s (P165)
/** The focal machines run DELAY frames behind the stream (the sustained-onset check reads up to +6). */
const DELAY = 7, RING = 16, PRE = 8, TAIL = 72;
const IN = 1, OUT = 2, OUTFIRST = 4;
const BROKEN = 0, MOVING = 1, STILL = 2;
const ACCEPT = 0, ABSORB = 1, UNKNOWN = 2;
const NEG = -1e9;

export type ListRole = Role | 'queen' | 'other';
/** `retagged`: added from retagged_ants.txt, not in the tag file (the colony-237 flag, D266). */
export interface ListTag { tag: number; role: ListRole; focal: boolean; death: number | null; retagged?: boolean }
export interface ColonyList { label: string; tags: ListTag[] }

interface MachineOpts { sustained: boolean; bridge: boolean }
const MACHINES: Record<'primary' | 'plain' | 'bridge', MachineOpts> = { primary: { sustained: true, bridge: false }, plain: { sustained: false, bridge: false }, bridge: { sustained: true, bridge: true } };
const VARIANT_SPEC: Record<Variant, { machine: keyof typeof MACHINES; v: number; death: boolean }> = {
  primary: { machine: 'primary', v: V_PRIMARY, death: true },
  v10: { machine: 'primary', v: V_SENS, death: true },
  bridge: { machine: 'bridge', v: V_PRIMARY, death: true },
  plain: { machine: 'plain', v: V_PRIMARY, death: true },
  nodeath: { machine: 'primary', v: V_PRIMARY, death: false },
};

// ------------------------------------------------------------------------------------------------------- focal machine
interface Rec {
  start: number; onset: number | null; end: number; unknown: number | null; cause: Cause | null; x: number; y: number;
  /** Frames of absorbed moving steps of the run (shared with the run; filtered to the span when read). */
  absorbed: number[];
  /** Absorbed excursions: [candidate frame, 1 if another tag was read within 4.1 mm of the still position] pairs. */
  exc: number[];
  bridged: number;
}
interface FS {
  lastF: number; lastX: number; lastY: number;
  mode: number; S: number; runStart: number; bounded: boolean; runX: number; runY: number; counted: boolean;
  /** The last accepted candidate's frame. */
  lastOnset: number;
  exUntil: number; absorbed: number[]; exc: number[];
  open: Rec | null; recs: Rec[]; bouts: Bout[]; boutCause: Cause | null; done: boolean;
}

/** The focal ants' still-run / interval / bout state machine for one variant, run on frame g with reads up to g + 6. */
class FocalMachine {
  readonly s: FS[] = [];
  readonly cnt = { afterBreak: 0, beforeLight: 0, atOnset: 0, light: [0, 0, 0], bridged: 0 };
  /** Plain machine only: light candidates as OnsetStats' events [f, ant, x, y, still] (list indices; repro check). */
  readonly candidates: number[] | null;
  constructor(readonly p: ExtractPass, readonly o: MachineOpts, keepCandidates: boolean) {
    for (let i = 0; i < p.n; i++) this.s.push({ lastF: NEG, lastX: 0, lastY: 0, mode: BROKEN, S: 0, runStart: -1, bounded: false, lastOnset: NEG, runX: 0, runY: 0, counted: false, exUntil: -1, absorbed: [], exc: [], open: null, recs: [], bouts: [], boutCause: null, done: !p.focal[i] });
    this.candidates = keepCandidates ? [] : null;
  }
  private close(st: FS, k: number, cause: Cause | null): void {
    const r = st.open;
    if (r) {
      st.open = null;
      // EDGE: an onset, break or unknown status at or after 18:00 censors the interval at 18:00 (onset not observed).
      if (!(k < this.p.L1)) { r.end = this.p.L1; st.done = true; return; }
      r.end = k;
      if (cause === null) { r.onset = k; st.boutCause = null; } else { r.unknown = k; r.cause = cause; st.boutCause = cause; }
      return;
    }
    if (cause !== null && st.recs.length && st.boutCause === null) st.boutCause = cause;
  }
  private brk(st: FS, k: number, cause: Cause): void { this.close(st, k, cause); st.mode = BROKEN; st.S = 0; st.exUntil = -1; }
  private checkRecord(st: FS, g: number): void {
    if (st.counted || st.S < INTERVAL_MIN) return;
    st.counted = true;
    // EDGE: a still run reaching 120 frames only at or after 18:00 is not recorded (it cannot be observed in the light
    // phase; it can be nobody's I1, I2 or I3).
    if (!(g < this.p.L1)) return;
    if (!(st.runStart >= this.p.lightStart)) { if (st.bounded) this.cnt.beforeLight++; return; }
    if (!st.bounded) { this.cnt.afterBreak++; return; }
    // EDGE: a run whose start is the accepted onset's own read (the moving step that ended the previous interval is
    // followed directly by still steps, e.g. a misread at +4 accepted the onset) would leave a bout of no frames, which
    // the event table cannot hold: the run is not recorded, and the bout around it is incomplete (`onsetStatus`).
    if (st.runStart === st.lastOnset) { this.cnt.atOnset++; if (st.recs.length && st.boutCause === null) st.boutCause = 'onsetStatus'; return; }
    if (st.recs.length) st.bouts.push({ complete: st.boutCause === null, cause: st.boutCause });
    const r: Rec = { start: st.runStart, onset: null, end: NaN, unknown: null, cause: null, x: st.runX, y: st.runY, absorbed: st.absorbed, exc: st.exc, bridged: 0 };
    st.open = r;
    st.recs.push(r);
  }
  private still(st: FS, g: number, w: number): void {
    if (st.mode === STILL) st.S += w;
    else {
      st.bounded = st.mode === MOVING;
      st.mode = STILL; st.S = w; st.runStart = st.lastF; st.runX = st.lastX; st.runY = st.lastY; st.counted = false;
      st.exUntil = -1; st.absorbed = []; st.exc = [];
    }
    this.checkRecord(st, g);
  }
  private moving(st: FS, i: number, g: number, gap: number): void {
    if (st.mode === STILL && g <= st.exUntil) { st.absorbed.push(g); st.S += gap; return; } // within an absorbed excursion
    if (st.mode === STILL && st.S >= ONSET_STILL) {
      const inLight = g >= this.p.lightStart && g < this.p.L1;
      if (this.candidates && inLight) this.candidates.push(g, i, st.lastX, st.lastY, st.S);
      const out = this.o.sustained ? this.p.sustainedCheck(i, g, st.lastX, st.lastY) : ACCEPT;
      if (inLight) this.cnt.light[out]++;
      if (out === ACCEPT) { this.close(st, g, null); st.mode = MOVING; st.S = 0; st.lastOnset = g; return; }
      if (out === ABSORB) { st.exUntil = g + 6; st.absorbed.push(g); st.exc.push(g, this.p.partnerNear(i, g, st.lastX, st.lastY) ? 1 : 0); st.S += gap; return; }
      // unknown onset status: the interval is unknown from the candidate; the run ends there. EDGE: a candidate of unknown
      // status inside a bout (a run shorter than 120 frames) makes that bout incomplete too.
      this.close(st, g, 'onsetStatus');
      st.mode = BROKEN; st.S = 0; st.exUntil = -1;
      return;
    }
    st.mode = MOVING; st.S = 0;
  }
  /** Frame g (its reads and those up to g + 6 are in the ring). */
  step(g: number): void {
    const p = this.p, n = p.n, k = (g & (RING - 1)) * n;
    if (p.ringF[g & (RING - 1)] !== g) throw new Error(`ring slot for frame ${g} missing`);
    for (let i = 0; i < n; i++) {
      const st = this.s[i];
      if (st.done) continue;
      const fl = p.rFl[k + i];
      if (fl & OUT && (!(fl & IN) || fl & OUTFIRST)) {
        // the step rule sees an out-of-nest read first: a break (a longer gap before it is the earlier break)
        if (st.mode !== BROKEN) { if (st.lastF > NEG && g - st.lastF > GAP_MAX) this.brk(st, st.lastF + 1, 'focalGap'); else this.brk(st, g, 'exit'); }
        st.lastF = NEG;
        if (fl & IN) { st.lastF = g; st.lastX = p.rX[k + i]; st.lastY = p.rY[k + i]; }
        continue;
      }
      if (fl & IN) {
        const x = p.rX[k + i], y = p.rY[k + i];
        const gap = g - st.lastF;
        if (gap > GAP_MAX) {
          if (this.o.bridge && st.mode === STILL && st.lastF > NEG && gap - 1 <= BRIDGE_MAX_UNREAD && Math.hypot(x - st.lastX, y - st.lastY) < BRIDGE_MM) {
            this.still(st, g, gap);
            if (st.open) st.open.bridged++;
            this.cnt.bridged++;
          } else if (st.mode !== BROKEN && st.lastF > NEG) this.brk(st, st.lastF + 1, 'focalGap');
        } else if (Math.hypot(x - st.lastX, y - st.lastY) / gap >= MOVE_MM) this.moving(st, i, g, gap);
        else this.still(st, g, gap);
        st.lastF = g; st.lastX = x; st.lastY = y;
        continue;
      }
      // unread: the gap is a break as soon as it is longer than the rule allows (the bridge waits up to 60 frames)
      if (st.mode !== BROKEN && st.lastF > NEG && g - st.lastF >= (this.o.bridge && st.mode === STILL ? BRIDGE_MAX_UNREAD + 1 : GAP_MAX)) this.brk(st, st.lastF + 1, 'focalGap');
    }
  }
  finish(): void { for (const st of this.s) if (st.open) this.close(st, Infinity, 'focalGap'); }
}

// ------------------------------------------------------------------------------------------------------------- the pass
export interface PassOptions {
  /** Reproduction side-objects: plain-onset events, still runs (diagShort `seq`), the plain machine's candidates. */
  repro?: boolean;
}
export interface ReproSide {
  /** Light plain onsets of nurses and foragers (H6Pass1 / OnsetStats mirror): [f, list index, x, y, still]. */
  events: number[];
  /** Per list index: bounded still runs >= 20 frames starting in the light phase (diagShort's seq convention). */
  seq: number[][];
  /** The plain machine's light candidates [f, list index, x, y, still] (frames in [lightStart, lightEnd)). */
  machineCandidates: number[];
}
export interface PassResult {
  tables: Record<Variant, ColonyEvents>;
  grid: Grid;
  bins: Bins;
  speed: { steps: number; moving: number; fast: number; fastMoving: number };
  death: { tags: number; withDeathRecord: number; readAtOrAfterDeath: number; deathBeforeFirstFrame: number; deathWithinRecording: number; deathAfterLastFrame: number };
  repro?: ReproSide;
  seconds: { stream: number; resolve: number };
}

export class ExtractPass {
  readonly n: number;
  readonly focal: boolean[];
  readonly nf: boolean[]; // nurse or forager (grid, bins)
  lightStart = NaN;
  lightEnd = NaN;
  /** 18:00 once seen (Infinity before: the machines run behind the stream, so it is known before they reach it). */
  get L1(): number { return Number.isNaN(this.lightEnd) ? Infinity : this.lightEnd; }
  // ring of the last RING frames: per tag flags and the frame's position (first in-nest read, else first read)
  readonly ringF = new Int32Array(RING).fill(NEG);
  readonly rFl: Uint8Array;
  readonly rX: Float64Array;
  readonly rY: Float64Array;
  private cur = NaN; // last frame written to the ring
  private proc = NaN; // last frame the focal machines have run
  // light-window store [S0, S0 + WN)
  private S0 = NaN;
  private readonly WN = 86400 + PRE + 64;
  private sFl: Uint8Array[] = [];
  private sX: Float64Array[] = [];
  private sY: Float64Array[] = [];
  // whole stream
  private readonly firstRead: Float64Array;
  private readonly lastRead: Float64Array;
  private firstFrame = NaN;
  // pairs (ContactOnset bookkeeping)
  /** The last frame each pair was examined (both read in the nest and within the 9-mm box). */
  private readonly lastExam: Int32Array;
  private readonly st4: Uint8Array;
  private readonly st8: Uint8Array;
  private readonly pend: Int32Array;
  private readonly codeBuf: Uint8Array;
  private readonly nearPend: { f: number; i: number; j: number; pdc: boolean }[] = [];
  /** PDCs as [frame, focal, partner] (list indices) and near approaches as [entry frame, focal, partner]. */
  readonly pdcs: number[] = [];
  readonly nears: number[] = [];
  /** This frame's PDCs as [focal, partner] pairs (repro check). */
  readonly framePdc: number[] = [];
  // plain mirror (StepRule) for bins, grid, plain events, still runs and the speed check
  private readonly rule: StepRule;
  private readonly mF: Float64Array;
  private readonly mX: Float64Array;
  private readonly mY: Float64Array;
  private readonly mT: Float64Array;
  private readonly still: Int32Array;
  private readonly runFrames: Int32Array;
  private readonly runStart: Float64Array;
  private readonly runT: Float64Array;
  private readonly runBounded: Uint8Array;
  private readonly prevMove: Uint8Array;
  private readonly grid = new Map<number, [number, number]>();
  private readonly bins = new Map<number, number[]>();
  readonly speed = { steps: 0, moving: 0, fast: 0, fastMoving: 0 };
  private readonly side: ReproSide | null;
  // focal machines
  private readonly machines: Record<keyof typeof MACHINES, FocalMachine>;
  private t0 = Date.now();

  constructor(readonly list: ColonyList, readonly o: PassOptions = {}) {
    const n = (this.n = list.tags.length);
    this.focal = list.tags.map((t) => t.focal);
    this.nf = list.tags.map((t) => t.role === 'nurse' || t.role === 'forager');
    this.rFl = new Uint8Array(n * RING);
    this.rX = new Float64Array(n * RING);
    this.rY = new Float64Array(n * RING);
    this.firstRead = new Float64Array(n).fill(NaN);
    this.lastRead = new Float64Array(n).fill(NaN);
    this.lastExam = new Int32Array(n * n).fill(NEG);
    this.st4 = new Uint8Array(n * n);
    this.st8 = new Uint8Array(n * n);
    this.pend = new Int32Array(n * n).fill(-1);
    this.codeBuf = new Uint8Array(n);
    this.rule = new StepRule(n);
    this.mF = new Float64Array(n).fill(NEG);
    this.mX = new Float64Array(n);
    this.mY = new Float64Array(n);
    this.mT = new Float64Array(n);
    this.still = new Int32Array(n);
    this.runFrames = new Int32Array(n);
    this.runStart = new Float64Array(n);
    this.runT = new Float64Array(n);
    this.runBounded = new Uint8Array(n);
    this.prevMove = new Uint8Array(n);
    this.side = o.repro ? { events: [], seq: list.tags.map(() => []), machineCandidates: [] } : null;
    this.machines = { primary: new FocalMachine(this, MACHINES.primary, false), plain: new FocalMachine(this, MACHINES.plain, !!o.repro), bridge: new FocalMachine(this, MACHINES.bridge, false) };
  }

  // ---------------------------------------------------------------------------------------------------------- helpers
  private slotOf(g: number): number { return this.ringF[g & (RING - 1)] === g ? (g & (RING - 1)) * this.n : -1; }
  /** The sustained-onset check of a candidate at c (reference: the read before the step). */
  sustainedCheck(i: number, c: number, rx: number, ry: number): number {
    for (const off of [4, 3, 5, 6]) {
      const k = this.slotOf(c + off);
      if (k < 0) continue;
      const fl = this.rFl[k + i];
      // EDGE: any read counts for the position at +3 ... +6 (an out-of-nest read included; its position is used).
      if (fl & (IN | OUT)) return Math.hypot(this.rX[k + i] - rx, this.rY[k + i] - ry) >= SUSTAIN_MM ? ACCEPT : ABSORB;
    }
    return UNKNOWN;
  }
  /** Whether another tag is read at frame c within 4.1 mm of (x, y) (the absorbed-excursion split; descriptive). */
  partnerNear(i: number, c: number, x: number, y: number): boolean {
    const k = this.slotOf(c);
    if (k < 0) return false;
    for (let j = 0; j < this.n; j++) if (j !== i && this.rFl[k + j] & (IN | OUT) && Math.hypot(this.rX[k + j] - x, this.rY[k + j] - y) <= R_PDC) return true;
    return false;
  }
  private startLight(f: number, t: number): void {
    const day06 = Math.floor(t / 86400) * 86400 + 6 * 3600;
    this.lightStart = f - Math.max(0, Math.floor((t - day06) * 2));
    this.S0 = this.lightStart - PRE;
    for (let i = 0; i < this.n; i++) { this.sFl.push(new Uint8Array(this.WN)); this.sX.push(new Float64Array(this.WN)); this.sY.push(new Float64Array(this.WN)); }
    // frames S0 ... f - 1 already in the ring
    for (let g = Math.max(this.S0, f - RING + 1); g < f; g++) { const k = this.slotOf(g); if (k >= 0) this.toStore(g, k); }
  }
  private toStore(g: number, k: number): void {
    const w = g - this.S0;
    if (w < 0 || w >= this.WN) return;
    for (let i = 0; i < this.n; i++) { const fl = this.rFl[k + i]; if (fl) { this.sFl[i][w] = fl; this.sX[i][w] = this.rX[k + i]; this.sY[i][w] = this.rY[k + i]; } }
  }
  private writeSlot(g: number): number {
    const s = g & (RING - 1), k = s * this.n;
    this.ringF[s] = g;
    this.rFl.fill(0, k, k + this.n);
    return k;
  }
  private runMachines(upTo: number): void {
    const stop = Number.isNaN(this.lightEnd) ? upTo : Math.min(upTo, this.lightEnd + TAIL);
    if (Number.isNaN(this.proc)) this.proc = this.firstFrame - 1;
    while (this.proc < stop) {
      this.proc++;
      for (const m of Object.values(this.machines)) m.step(this.proc);
    }
  }

  // ------------------------------------------------------------------------------------------------------- per frame
  frame(f: number, t: number, ids: number[], xs: number[], ys: number[], ins: boolean[]): void {
    if (Number.isNaN(this.firstFrame)) { this.firstFrame = f; this.cur = f - 1; }
    if (!(f > this.cur)) throw new Error(`frame ${f} out of order`);
    const light = isLight(t);
    if (light && Number.isNaN(this.lightStart)) { this.startLight(f, t); }
    else if (!light && !Number.isNaN(this.lightStart) && Number.isNaN(this.lightEnd)) this.lightEnd = f;
    // frames the stream skipped: nobody read
    for (let g = this.cur + 1; g < f; g++) { this.writeSlot(g); this.runMachines(g - DELAY); }
    this.cur = f;
    const k = this.writeSlot(f);
    for (let q = 0; q < ids.length; q++) {
      const i = ids[q], fl = this.rFl[k + i];
      if (ins[q]) {
        if (!(fl & IN)) { this.rFl[k + i] = fl | IN | (fl & OUT ? OUTFIRST : 0); this.rX[k + i] = xs[q]; this.rY[k + i] = ys[q]; }
      } else {
        if (!(fl & (IN | OUT))) { this.rX[k + i] = xs[q]; this.rY[k + i] = ys[q]; }
        this.rFl[k + i] |= OUT;
      }
      if (Number.isNaN(this.firstRead[i])) this.firstRead[i] = f;
      this.lastRead[i] = f;
    }
    if (!Number.isNaN(this.S0)) this.toStore(f, k);
    this.plainMirror(f, t, light, ids, xs, ys, ins);
    this.pairs(f, k);
    this.runMachines(f - DELAY);
  }

  /** H6Pass1's OnsetStats mirror through StepRule: bins, grid, plain events, still runs, the speed check. */
  private plainMirror(f: number, t: number, light: boolean, ids: number[], xs: number[], ys: number[], ins: boolean[]): void {
    let B: number[] | undefined;
    if (light) {
      const bin = Math.floor(f / 10);
      B = this.bins.get(bin);
      if (!B) this.bins.set(bin, (B = [t, 0, 0, 0]));
      B[3]++;
    }
    for (let q = 0; q < ids.length; q++) {
      const i = ids[q];
      const g = f - this.mF[i], px = this.mX[i], py = this.mY[i], pt = this.mT[i];
      const r = this.rule.read(i, f, xs[q], ys[q], ins[q]);
      if (r === -1) continue;
      this.mF[i] = ins[q] ? f : NEG;
      this.mX[i] = xs[q];
      this.mY[i] = ys[q];
      this.mT[i] = t;
      const len = r > 0 ? Math.hypot(xs[q] - px, ys[q] - py) : 0;
      if (light && r > 0) {
        this.speed.steps++;
        if (r === 2) this.speed.moving++;
        if ((len / g) * 2 > SPEED_BOUND) { this.speed.fast++; if (r === 2) this.speed.fastMoving++; }
      }
      // plain onset (OnsetStats): moving after >= 20 still frames; position the read before the step
      if (r === 2) {
        if (this.still[i] >= ONSET_STILL && light && this.side && this.nf[i]) this.side.events.push(f, i, px, py, this.still[i]);
        this.still[i] = 0;
      } else if (r === 1) this.still[i] += g;
      else this.still[i] = 0;
      // diagShort's bounded still runs (seq): a break resets; a still step opens a run at the read before it
      if (this.side && this.nf[i]) {
        if (r === 0) { this.runFrames[i] = 0; this.prevMove[i] = 0; }
        else if (r === 1) {
          if (!this.runFrames[i]) { this.runStart[i] = f - g; this.runT[i] = pt; this.runBounded[i] = this.prevMove[i]; }
          this.runFrames[i] += g;
        } else {
          if (this.runFrames[i] >= ONSET_STILL && this.runBounded[i] && isLight(this.runT[i])) this.side.seq[i].push(this.runStart[i], this.runFrames[i]);
          this.runFrames[i] = 0;
          this.prevMove[i] = 1;
        }
      }
      if (light && this.nf[i] && ins[q]) {
        if (r > 0) { B![2]++; if (r === 2) B![1]++; }
        const c = cellOf(xs[q], ys[q]);
        let G = this.grid.get(c);
        if (!G) this.grid.set(c, (G = [0, 0]));
        if (this.list.tags[i].role === 'forager') G[0]++;
        else G[1]++;
      }
    }
  }

  /** ContactOnset's codes and 4.1-mm crossings (H6Pass1's mirror), with the 8 / 9-mm near approach on the same pairs.
   * Pairs farther apart than 9 mm on an axis are not visited (an x-sweep); ContactOnset's joint-gap bookkeeping is kept
   * exactly by looking back at the ring: J = the pair's last joint in-nest frame in f − 3 ... f − 1. No J: the pair is
   * forgotten (state 0). J not the last frame the pair was visited: at J the pair was outside the box, which sets both
   * states far (1), as ContactOnset's box branch does. Otherwise the stored states hold. */
  private pairs(f: number, k: number): void {
    this.framePdc.length = 0;
    const n = this.n, kp = this.slotOf(f - 1), k2 = this.slotOf(f - 2), k3 = this.slotOf(f - 3);
    const seen: number[] = [];
    const code = this.codeBuf;
    for (let i = 0; i < n; i++) {
      if (!(this.rFl[k + i] & IN)) continue;
      seen.push(i);
      code[i] = kp >= 0 && this.rFl[kp + i] & IN ? (Math.hypot(this.rX[k + i] - this.rX[kp + i], this.rY[k + i] - this.rY[kp + i]) >= MOVE_MM ? 2 : 1) : 3;
    }
    const X = this.rX, Y = this.rY, F = this.rFl;
    seen.sort((a, b) => X[k + a] - X[k + b] || a - b);
    for (let a = 0; a < seen.length; a++) {
      const ia = seen[a], xa = X[k + ia], ya = Y[k + ia];
      for (let b = a + 1; b < seen.length; b++) {
        const ib = seen[b];
        const dxs = X[k + ib] - xa;
        if (dxs > BOX_NEAR) break;
        if (Math.abs(Y[k + ib] - ya) > BOX_NEAR) continue;
        const i = ia < ib ? ia : ib, j = ia < ib ? ib : ia;
        const p = i * n + j;
        const J = kp >= 0 && F[kp + i] & IN && F[kp + j] & IN ? f - 1 : k2 >= 0 && F[k2 + i] & IN && F[k2 + j] & IN ? f - 2 : k3 >= 0 && F[k3 + i] & IN && F[k3 + j] & IN ? f - 3 : NEG;
        if (J === NEG) { this.st4[p] = 0; this.endNear(p); this.st8[p] = 0; }
        else if (this.lastExam[p] !== J) { this.st4[p] = 1; this.endNear(p); this.st8[p] = 1; }
        this.lastExam[p] = f;
        const ci = code[i], cj = code[j];
        const dx = X[k + i] - X[k + j], dy = Y[k + i] - Y[k + j];
        const d = Math.hypot(dx, dy);
        // near approach (8 mm in, 9 mm out)
        if (d < R_NEAR) {
          if (this.st8[p] === 1) {
            if (ci === 1 && cj === 2) this.openNear(p, f, i, j);
            else if (cj === 1 && ci === 2) this.openNear(p, f, j, i);
          }
          this.st8[p] = 2;
        } else if (d > R_NEAR_OUT || this.st8[p] === 0) { this.endNear(p); this.st8[p] = 1; }
        // PDC: ContactOnset's crossing, unchanged (its 8-mm box)
        if (Math.abs(dx) > BOX_PDC || Math.abs(dy) > BOX_PDC) { this.st4[p] = 1; continue; }
        if (d < R_PDC) {
          if (this.st4[p] === 1) {
            if (ci === 1 && cj === 2) this.addPdc(p, f, i, j);
            if (cj === 1 && ci === 2) this.addPdc(p, f, j, i);
          }
          this.st4[p] = 2;
        } else if (d > R_PDC_OUT || this.st4[p] === 0) this.st4[p] = 1;
      }
    }
  }
  private openNear(p: number, f: number, focal: number, partner: number): void {
    this.endNear(p);
    this.pend[p] = this.nearPend.length;
    this.nearPend.push({ f, i: focal, j: partner, pdc: false });
  }
  /** The approach ends (beyond 9 mm, or the pair forgotten after a joint gap > 3 frames). EDGE: an approach ended by a
   * joint gap, or still open when the recording ends, is a near approach if no PDC occurred in it; a PDC in either
   * direction between the two disqualifies it. */
  private endNear(p: number): void {
    const q = this.pend[p];
    if (q < 0) return;
    const e = this.nearPend[q];
    if (!e.pdc) this.nears.push(e.f, e.i, e.j);
    this.pend[p] = -1;
  }
  private addPdc(p: number, f: number, focal: number, partner: number): void {
    this.pdcs.push(f, focal, partner);
    this.framePdc.push(focal, partner);
    if (this.pend[p] >= 0) this.nearPend[this.pend[p]].pdc = true;
  }

  // ---------------------------------------------------------------------------------------------------------- finish
  finish(): PassResult {
    const tStream = (Date.now() - this.t0) / 1000;
    const t1 = Date.now();
    if (Number.isNaN(this.lightStart)) throw new Error(`${this.list.label}: no light-phase frame`);
    if (Number.isNaN(this.lightEnd)) this.lightEnd = this.cur + 1;
    if (this.lightEnd - this.S0 > this.WN) throw new Error(`${this.list.label}: light phase longer than the store`);
    // flush the machines: frames after the stream's end are unread
    for (let g = this.cur + 1; g <= this.cur + DELAY + 1; g++) { this.writeSlot(g); this.runMachines(g - DELAY); }
    for (const m of Object.values(this.machines)) m.finish();
    for (let p = 0; p < this.pend.length; p++) this.endNear(p);
    // grid, zones, bins
    const cells = [...this.grid.keys()].sort((a, b) => a - b);
    const grid: Grid = { cells, forager: cells.map((c) => this.grid.get(c)![0]), nurse: cells.map((c) => this.grid.get(c)![1]) };
    const Z = buildZones(grid);
    const bk = [...this.bins.keys()].sort((a, b) => a - b);
    const bins: Bins = { bin: bk, t: bk.map((b) => this.bins.get(b)![0]), moving: bk.map((b) => this.bins.get(b)![1]), steps: bk.map((b) => this.bins.get(b)![2]), frames: bk.map((b) => this.bins.get(b)![3]) };
    // death records (the whole file)
    const deathValid: (number | null)[] = this.list.tags.map((tg, i) => (tg.death !== null && tg.death > 0 && !(this.lastRead[i] >= tg.death) ? tg.death : null));
    const withRec = this.list.tags.filter((tg) => tg.death !== null && tg.death > 0);
    const death = {
      tags: this.n,
      withDeathRecord: withRec.length,
      readAtOrAfterDeath: this.list.tags.filter((tg, i) => tg.death !== null && tg.death > 0 && this.lastRead[i] >= tg.death).length,
      deathBeforeFirstFrame: withRec.filter((tg) => tg.death! < this.firstFrame).length,
      deathWithinRecording: withRec.filter((tg) => tg.death! >= this.firstFrame && tg.death! <= this.cur).length,
      deathAfterLastFrame: withRec.filter((tg) => tg.death! > this.cur).length,
    };
    const R = new Resolver(this, deathValid, Z.zoneOf);
    const tables = {} as Record<Variant, ColonyEvents>;
    for (const v of VARIANTS) {
      const sp = VARIANT_SPEC[v];
      const { ants, desc } = R.resolve(this.machines[sp.machine], sp.v, sp.death);
      const c: ColonyEvents = { label: this.list.label, lightStart: this.lightStart, lightEnd: this.lightEnd, ants, bins, extraction: { variant: v, v: sp.v, deathRecord: sp.death, machine: sp.machine, ...desc, deathRecords: death, sensitivity: v !== 'primary' } };
      validateColony(c);
      tables[v] = c;
    }
    // intervals made unknown only by unseen tags without the death record, beside the primary's (with it)
    (tables.primary.extraction as Record<string, unknown>).unknownOnlyByUnseenTagsWithoutDeathRecord = (tables.nodeath.extraction as Record<string, unknown>).unknownOnlyByUnseenTags;
    // the colony-237 flag (D266, P181): per tag added from retagged_ants.txt (not in the tag file), its light-phase reads,
    // the frames in [lightStart, lightEnd) on which it is read, in or out of the nest (as the resolver's "seen")
    (tables.primary.extraction as Record<string, unknown>).retaggedPartners = this.list.tags.flatMap((tg, i) => {
      if (!tg.retagged) return [];
      let lightReads = 0;
      for (let w = this.lightStart - this.S0; w < this.lightEnd - this.S0; w++) if (this.sFl[i][w]) lightReads++;
      return [{ tag: tg.tag, lightReads }];
    });
    const res: PassResult = { tables, grid, bins, speed: { ...this.speed }, death, seconds: { stream: tStream, resolve: (Date.now() - t1) / 1000 } };
    if (this.side) { this.side.machineCandidates = this.machines.plain.candidates!; res.repro = this.side; }
    // free the store
    this.sFl = []; this.sX = []; this.sY = [];
    return res;
  }

  // accessors for the resolver
  get store() { return { S0: this.S0, fl: this.sFl, x: this.sX, y: this.sY }; }
}

// ------------------------------------------------------------------------------------------------------------ resolver
/** Sorted run list [a0, b0, a1, b1, ...] of frames in [from, to) where `pred(w)` holds (w = frame − S0). */
function runsOf(from: number, to: number, S0: number, pred: (w: number) => boolean): Int32Array {
  const out: number[] = [];
  let a = -1;
  for (let g = from; g < to; g++) {
    const b = pred(g - S0);
    if (b && a < 0) a = g;
    else if (!b && a >= 0) { out.push(a, g - 1); a = -1; }
  }
  if (a >= 0) out.push(a, to - 1);
  return Int32Array.from(out);
}
/** First run index whose end is >= g. */
function lowerRun(r: Int32Array, g: number): number {
  let lo = 0, hi = r.length / 2;
  while (lo < hi) { const m = (lo + hi) >> 1; if (r[2 * m + 1] < g) lo = m + 1; else hi = m; }
  return lo;
}

class Resolver {
  private readonly L0: number;
  private readonly L1: number;
  private readonly S0: number;
  private readonly unread: Int32Array[] = [];
  private readonly blind: Int32Array[] = [];
  private readonly unseen: boolean[] = [];
  private readonly pdcBy: number[][];
  private readonly nearBy: number[][];
  constructor(readonly p: ExtractPass, readonly deathValid: (number | null)[], readonly zoneOf: Map<number, number>) {
    this.L0 = p.lightStart; this.L1 = p.lightEnd;
    const { S0, fl } = p.store;
    this.S0 = S0;
    for (let j = 0; j < p.n; j++) {
      const F = fl[j];
      this.unread.push(runsOf(S0, this.L1, S0, (w) => F[w] === 0));
      // partner blind frames: unread, code 3 (an in-nest read with no in-nest read on the frame before), out of the nest
      this.blind.push(runsOf(S0, this.L1, S0, (w) => F[w] === 0 || (F[w] & OUT) !== 0 || w === 0 || !(F[w - 1] & IN)));
      let seen = false;
      for (let w = this.L0 - S0; w < this.L1 - S0 && !seen; w++) if (F[w]) seen = true;
      this.unseen.push(!seen);
    }
    this.pdcBy = p.list.tags.map(() => []);
    this.nearBy = p.list.tags.map(() => []);
    for (let q = 0; q < p.pdcs.length; q += 3) this.pdcBy[p.pdcs[q + 1]].push(p.pdcs[q]);
    for (let q = 0; q < p.nears.length; q += 3) this.nearBy[p.nears[q + 1]].push(p.nears[q]);
    for (const a of this.pdcBy) a.sort((x, y) => x - y);
    for (const a of this.nearBy) a.sort((x, y) => x - y);
  }

  resolve(m: FocalMachine, v: number, useDeath: boolean): { ants: Ant[]; desc: Record<string, unknown> } {
    const p = this.p, { fl, x: SX, y: SY } = p.store, S0 = this.S0;
    const byCause: Record<string, number> = {};
    let nIv = 0, onlyUnseen = 0, excNear = 0, excFar = 0, accepted = 0, absorbed = 0, unknownStatus = 0, bridgedIv = 0;
    const ants: Ant[] = [];
    for (let i = 0; i < p.n; i++) {
      if (!p.focal[i]) continue;
      const st = m.s[i];
      const F = fl[i];
      const intervals: Interval[] = [];
      for (const r of st.recs) {
        const s = r.start, e = r.end;
        nIv++;
        // focal blind runs within [s, e): unread, code 3, out of the nest, absorbed moving steps
        const abs = new Set(r.absorbed.filter((g) => g >= s && g < e));
        // EDGE: a focal frame with an out-of-nest read after an in-nest one (no break under the step rule) is blind.
        const Fr = runsOf(s, e, S0, (w) => F[w] === 0 || (F[w] & OUT) !== 0 || !(F[w - 1] & IN) || abs.has(w + S0));
        // EDGE: q is the focal's last in-nest read at or before the run's first frame that is not an absorbed moving
        // step (the still position, not a misread).
        const qOf = (A: number): [number, number] => {
          for (let g = A; g >= s; g--) { const w = g - S0; if (F[w] & IN && !abs.has(g)) return [SX[i][w], SY[i][w]]; }
          return [r.x, r.y];
        };
        let bestSeen = Infinity, causeSeen: Cause | null = null, bestUnseen = Infinity;
        for (let j = 0; j < p.n; j++) {
          if (j === i) continue;
          const d = useDeath ? this.deathValid[j] : null;
          const eJ = d === null ? e : Math.min(e, d);
          if (eJ <= s) continue;
          const lim = Math.min(eJ, this.unseen[j] ? bestUnseen : bestSeen);
          if (lim <= s) continue;
          const h = this.pairHit(j, s, eJ, lim, Fr, qOf, v);
          if (h === null) continue;
          if (this.unseen[j]) { if (h[0] < bestUnseen) bestUnseen = h[0]; }
          else if (h[0] < bestSeen || (h[0] === bestSeen && CAUSES.indexOf(h[1]) < CAUSES.indexOf(causeSeen!))) { bestSeen = h[0]; causeSeen = h[1]; }
        }
        // the earliest unknown frame; ties by CAUSES order (EDGE)
        let uf: number | null = r.unknown, uc: Cause | null = r.cause;
        const cand: [number, Cause][] = [];
        if (bestSeen < Infinity) cand.push([bestSeen, causeSeen!]);
        if (bestUnseen < Infinity) cand.push([bestUnseen, 'partnerUnbracketed']);
        if (uf !== null) cand.push([uf, uc!]);
        cand.sort((a, b) => a[0] - b[0] || CAUSES.indexOf(a[1]) - CAUSES.indexOf(b[1]));
        if (cand.length) { uf = cand[0][0]; uc = cand[0][1]; }
        if (uf !== null) byCause[uc!] = (byCause[uc!] ?? 0) + 1;
        if (r.unknown === null && bestSeen === Infinity && bestUnseen < Infinity) onlyUnseen++;
        if (r.onset !== null) accepted++;
        if (r.cause === 'onsetStatus') unknownStatus++;
        for (let q = 0; q < r.exc.length; q += 2) if (r.exc[q] >= s && r.exc[q] < e) { absorbed++; if (r.exc[q + 1]) excNear++; else excFar++; }
        if (r.bridged) bridgedIv++;
        const within = (a: number[]) => a.filter((g) => g >= s && g < e);
        intervals.push({ start: s, onset: r.onset, pdc: within(this.pdcBy[i]), near: within(this.nearBy[i]), unknownFrame: uf, cause: uf === null ? null : uc, zone: this.zoneOf.get(cellOf(r.x, r.y)) ?? null });
      }
      ants.push({ id: p.list.tags[i].tag, role: p.list.tags[i].role as Role, intervals, bouts: st.bouts.slice(0, Math.max(0, intervals.length - 1)) });
    }
    return {
      ants,
      desc: {
        intervals: nIv,
        unknownByCause: byCause,
        unknownOnlyByUnseenTags: onlyUnseen,
        startsNotRecordedAfterBreak: m.cnt.afterBreak,
        runsStartingBefore0600: m.cnt.beforeLight,
        runsStartingAtAnOnsetNotRecorded: m.cnt.atOnset,
        absorbedExcursions: { partnerWithin4_1mm: excNear, noPartnerWithin4_1mm: excFar },
        sustainedOutcomes: { inIntervals: { accepted, absorbed, unknownStatus }, lightCandidates: { accepted: m.cnt.light[ACCEPT], absorbed: m.cnt.light[ABSORB], unknownStatus: m.cnt.light[UNKNOWN] } },
        bridgedGaps: m.cnt.bridged,
        intervalsWithABridgedGap: bridgedIv,
        tags: { list: p.n, focal: p.focal.filter(Boolean).length, unseenInLightPhase: this.unseen.filter(Boolean).length },
      },
    };
  }

  /** The earliest frame < lim at which pair (i, j) has a blind contact opportunity in [s, eJ), with its cause. */
  private pairHit(j: number, s: number, eJ: number, lim: number, Fr: Int32Array, qOf: (A: number) => [number, number], v: number): [number, Cause] | null {
    const S0 = this.S0, { fl, x: SX, y: SY } = this.p.store;
    const Fj = fl[j], Xj = SX[j], Yj = SY[j];
    const Bj = this.blind[j], Uj = this.unread[j];
    const nF = Fr.length / 2, nP = Bj.length / 2, nU = Uj.length / 2;
    let fi = lowerRun(Fr, s), pj = lowerRun(Bj, s), u = lowerRun(Uj, s);
    for (;;) {
      // the next run of the pair's blind frames: the union of the focal's runs and j's, clipped to [s, eJ)
      const fa = fi < nF ? Fr[2 * fi] : Infinity, pa = pj < nP ? Bj[2 * pj] : Infinity;
      if (fa === Infinity && pa === Infinity) return null;
      const A = Math.max(s, Math.min(fa, pa));
      if (A >= lim || A >= eJ) return null;
      let B: number;
      if (fa <= pa) { B = Fr[2 * fi + 1]; fi++; } else { B = Bj[2 * pj + 1]; pj++; }
      for (;;) {
        if (fi < nF && Fr[2 * fi] <= B + 1) { B = Math.max(B, Fr[2 * fi + 1]); fi++; continue; }
        if (pj < nP && Bj[2 * pj] <= B + 1) { B = Math.max(B, Bj[2 * pj + 1]); pj++; continue; }
        break;
      }
      B = Math.min(B, eJ - 1);
      const [qx, qy] = qOf(A);
      let hit = Infinity, cause: Cause = 'partnerBlind';
      const take = (h: number, c: Cause) => { if (h < hit || (h === hit && CAUSES.indexOf(c) < CAUSES.indexOf(cause))) { hit = h; cause = c; } };
      while (u < nU && Uj[2 * u + 1] < A) u++;
      let g = A, uu = u;
      while (g <= B) {
        if (uu < nU && Uj[2 * uu] <= g) {
          // j unread on [ua, ub]: (iii) unbracketed by light-phase reads, else (ii) D252's reachability over the span
          const ua = Uj[2 * uu], ub = Uj[2 * uu + 1];
          const prev = ua - 1, next = ub + 1;
          if (!(prev >= this.L0 && next < this.L1)) take(A, 'partnerUnbracketed');
          else {
            const wp = prev - S0, wn = next - S0;
            if (reachable(prev / 2, Xj[wp], Yj[wp], next / 2, Xj[wn], Yj[wn], false, qx, qy, s / 2, eJ / 2, v, R_REACH)) {
              // EDGE: unknown from floor(a) in frames (a in s, as `reachable`), clamped to the span [s, eJ − 1].
              const a = prev / 2 + Math.max(0, Math.hypot(Xj[wp] - qx, Yj[wp] - qy) - R_REACH) / v;
              take(Math.min(Math.max(s, Math.floor(2 * a)), eJ - 1), 'partnerBlind');
            }
          }
          g = ub + 1;
          uu++;
          continue;
        }
        // (i) j read (in or out of the nest) on a blind frame within 4.1 mm of q (EDGE: distance <= 4.1 mm)
        const w = g - S0;
        if (Fj[w] && Math.hypot(Xj[w] - qx, Yj[w] - qy) <= R_PDC) take(A, 'partnerBlind');
        g++;
      }
      if (hit < Infinity) return [hit, cause];
    }
  }
}

// ------------------------------------------------------------------------------------------------------------ the list
/** The colony's list (06:51 block): the PreTreatment tag file's tags with their death records; focal = roles()'s nurses
 * and foragers; the queen a partner. EDGE: the retagged ant's tags (retagged_ants.txt) not in the tag file are added as
 * partners (unseen unless read). */
export async function colonyList(ci: number): Promise<ColonyList> {
  const { colonies, roles, ROOT } = await import('../../frozen/h6/scripts/stroeymeytTracks');
  const col = colonies()[ci];
  const rl = roles(col);
  const lines = fs.readFileSync(`${ROOT}/tag_files/${col.label}_${col.treatment}.tags`, 'utf8').split('\n');
  const head = lines.find((l) => l.startsWith('#tag'))!.slice(1).split(',');
  const iTag = head.indexOf('tag'), iDeath = head.indexOf('death');
  const tags: ListTag[] = [];
  for (const l of lines) {
    if (!l || l.startsWith('#') || l.startsWith('$')) continue;
    const f = l.split(',');
    const tag = Number(f[iTag]);
    const death = Number(f[iDeath]);
    const r = rl.get(tag);
    const role: ListRole = r === 'nurse' || r === 'forager' || r === 'queen' ? r : 'other';
    tags.push({ tag, role, focal: role === 'nurse' || role === 'forager', death: Number.isFinite(death) && death > 0 ? death : null });
  }
  const num = Number(col.label.replace('colony', ''));
  for (const row of fs.readFileSync(`${ROOT}/retagged_ants/retagged_ants.txt`, 'utf8').trim().split('\n').slice(1)) {
    const [c, t] = row.trim().split(/\s+/).map(Number);
    if (c === num && !tags.some((x) => x.tag === t)) tags.push({ tag: t, role: 'other', focal: false, death: null, retagged: true });
  }
  return { label: col.label, tags };
}

/** Writes a pass's event tables: <dir>/<base>.json (primary) and <dir>/<base>.<variant>.json. */
export function writeTables(dir: string, base: string, tables: Record<Variant, ColonyEvents>): string[] {
  fs.mkdirSync(dir, { recursive: true });
  const out: string[] = [];
  for (const v of VARIANTS) { const path = `${dir}/${base}${v === 'primary' ? '' : `.${v}`}.json`; fs.writeFileSync(path, JSON.stringify(tables[v])); out.push(path); }
  return out;
}

// ------------------------------------------------------------------------------------------------------------------ CLI
const argOf = (name: string): string | null => { const i = ARGV.indexOf(name); return i >= 0 && i + 1 < ARGV.length ? ARGV[i + 1] : null; };
/** Flat [f, ant, x, y, still] records sorted by frame, then ant (the machines visit ants in index order, OnsetStats in
 * read order). */
const byFrameAnt = (ev: number[]): number[] => {
  const r: number[][] = [];
  for (let k = 0; k < ev.length; k += 5) r.push(ev.slice(k, k + 5));
  r.sort((x, y) => x[0] - y[0] || x[1] - y[1]);
  return r.flat();
};
const sameArr = (a: ArrayLike<number>, b: ArrayLike<number>): boolean => { if (a.length !== b.length) return false; for (let k = 0; k < a.length; k++) if (a[k] !== b[k]) return false; return true; };

async function main(): Promise<void> {
  const ci = Number(argOf('--colony'));
  const out = argOf('--out');
  if (!Number.isInteger(ci) || ci < 0 || ci > 21) throw new Error('--colony 0 ... 21');
  if (!out) throw new Error('--out <dir> is required (no default)');
  const dir = out.replace(/\/$/, '');
  const repro = ARGV.includes('--repro');
  const { colonies, roles, streamColony } = await import('../../frozen/h6/scripts/stroeymeytTracks');
  const col = colonies()[ci];
  const list = await colonyList(ci);
  const index = new Map(list.tags.map((t, i) => [t.tag, i]));
  const t0 = Date.now();
  if (!repro) {
    const pass = new ExtractPass(list);
    await streamColony(col, index, (f, t, ids, xs, ys, ins) => pass.frame(f, t, ids, xs, ys, ins));
    const res = pass.finish();
    writeTables(dir, `c${ci}`, res.tables);
    console.log(`${col.label}: event tables written (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
    return;
  }
  // Reproduction mode: the same pass, with OnsetStats, ContactStats and ContactOnset fed the nurses' and foragers' reads
  // (roles() indices, as H6's --repro); the event tables are built in memory only.
  const { OnsetStats } = await import('../../frozen/h6/scripts/scratch/onsetStats');
  const { ContactStats } = await import('../../frozen/h6/scripts/scratch/contactStats');
  const { ContactOnset } = await import('../../frozen/h6/scripts/scratch/contactOnset');
  const rl = roles(col);
  const rTags = [...rl.keys()];
  const rIndex = new Map(rTags.map((t, i) => [t, i]));
  const trackR = rTags.map((t) => rl.get(t) === 'nurse' || rl.get(t) === 'forager');
  const fromList = list.tags.map((t) => rIndex.get(t.tag) ?? -1);
  const pass = new ExtractPass(list, { repro: true });
  const cs = new ContactStats(trackR), os = new OnsetStats(trackR), co = new ContactOnset(trackR);
  let pdcMismatchFrames = 0, pdcFramesCompared = 0;
  const rI: number[] = [], rX: number[] = [], rY: number[] = [], rB: boolean[] = [];
  const stream = await streamColony(col, index, (f, t, ids, xs, ys, ins) => {
    pass.frame(f, t, ids, xs, ys, ins);
    rI.length = rX.length = rY.length = rB.length = 0;
    for (let q = 0; q < ids.length; q++) { const r = fromList[ids[q]]; if (r >= 0) { rI.push(r); rX.push(xs[q]); rY.push(ys[q]); rB.push(ins[q]); } }
    os.frame(f, rI, rX, rY, rB, t, cs.frame(f, rI, rX, rY, rB, t));
    co.frame(f, rI, rX, rY, rB, t);
    // ContactOnset's own contacts at f (its private ring, read for the check only, as H6's repro)
    const ring = (co as unknown as { contacts: { f: number; i: number }[][] }).contacts[f % 64];
    const theirs = ring.filter((e) => e.f === f).map((e) => e.i).sort((a, b) => a - b);
    const mine: number[] = [];
    for (let k = 0; k < pass.framePdc.length; k += 2) { const a = fromList[pass.framePdc[k]], b = fromList[pass.framePdc[k + 1]]; if (a >= 0 && b >= 0 && trackR[a] && trackR[b]) mine.push(a); }
    mine.sort((a, b) => a - b);
    pdcFramesCompared++;
    if (!sameArr(mine, theirs)) pdcMismatchFrames++;
  });
  let res: PassResult | null;
  try { res = pass.finish(); } catch (e) {
    // the message could name an ant or interval of a real event table (P164): withheld
    console.error(`${col.label}: building the event tables failed (${(e as Error).message.startsWith('event table') ? 'validation' : 'error'}; details withheld in the reproduction mode)`);
    process.exit(1);
  }
  const L0 = pass.lightStart, L1 = pass.lightEnd;
  const side = res.repro!;
  const toR = (ev: number[]) => { const o = ev.slice(); for (let k = 0; k < o.length; k += 5) o[k + 1] = fromList[o[k + 1]]; return o; };
  const plainEvents = toR(side.events);
  const machine = toR(side.machineCandidates);
  const osEvents = os.out.light?.events ?? [];
  const osWindow: number[] = [];
  for (let k = 0; k < osEvents.length; k += 5) if (osEvents[k] >= L0 && osEvents[k] < L1) for (let u = 0; u < 5; u++) osWindow.push(osEvents[k + u]);
  const seqOf = (g: Role) => list.tags.map((t, i) => (t.role === g ? side.seq[i] : null)).filter((x): x is number[] => x !== null);
  const { grid, bins, speed, death } = res;
  res = null; // the event tables are dropped unread
  const h6 = JSON.parse(fs.readFileSync(`logs/h6-work-next/c${ci}.json`, 'utf8')) as { grid: Grid; bins: Bins; stream: typeof stream };
  const gridEqual = sameArr(grid.cells, h6.grid.cells) && sameArr(grid.forager, h6.grid.forager) && sameArr(grid.nurse, h6.grid.nurse);
  const binsEqual = (['bin', 't', 'moving', 'steps', 'frames'] as const).every((k) => sameArr(bins[k], h6.bins[k]));
  const streamEqual = (['frames', 'first', 'last', 'reordered', 'late'] as const).every((k) => stream[k] === h6.stream[k]);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}/repro-c${ci}.json`, JSON.stringify({
    colony: col.label,
    note: 'T060 reproduction (brief 2): only the reproduction values; the event tables were built in memory and not written (P164)',
    onsets: { light: { events: plainEvents } },
    onsetStats: { light: { events: osEvents } },
    tb: co.out,
    nurse: { seq: seqOf('nurse') },
    forager: { seq: seqOf('forager') },
    check: {
      eventsEqualOnsetStats: sameArr(plainEvents, osEvents),
      machinePlainCandidatesEqualOnsetStatsInLightPhase: sameArr(byFrameAnt(machine), byFrameAnt(osWindow)),
      pdcFramesMismatchedWithContactOnset: pdcMismatchFrames,
      pdcFramesCompared,
      gridEqualH6: gridEqual,
      binsEqualH6: binsEqual,
      streamEqualH6: streamEqual,
    },
    speed,
    death,
  }));
  console.log(`${col.label} repro written (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
}

// support.ts (the T060 support audit, D266) takes `--colony` too and imports this module dynamically after setting
// T060_SUPPORT_AUDIT, so that only its own main runs.
if (ARGV.includes('--colony') && !process.env.VITEST && !process.env.T060_SUPPORT_AUDIT) await main();
