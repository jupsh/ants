// Scratch (not committed): H6 initiation test, data side (T059; D241 with amendments 1 and 2 and the lead's details, D242, D246, D247).
// One fit colony per process, streamed with `streamColony`; nothing here computes an H6 statistic (the reader does).
//
//   npx vite-node scripts/scratch/h6-next/extract.ts --colony i         → logs/h6-work-next/c<i>.json (queen included)
//   npx vite-node scripts/scratch/h6-next/extract.ts --colony i --repro → logs/h6-work-next/repro-c<i>.json (nurses and foragers
//       only, as contactData.ts / contactOnsetData.ts: the rebuilt onset events, OnsetStats' risk tables for spreadAgg.py,
//       and ContactOnset's Test B output from the same pass)
//   npx vite-node scripts/scratch/h6-next/extract.ts --colony i --delete a:b [--out-dir logs/h6-synth/V4/work]
//       → <out-dir>/k<k>-c<i>.json for data sets k = a … b − 1, in one pass over the file: V4's rebuilt skeleton (synthetic, D241 amendment 1 point 5): a further 10 % of the light-phase in-nest
//       detections deleted, twice as often in high- as in low-forager-visit cells (zones from c<i>.json), then onsets and
//       null-3 eligibility rebuilt from what is left. Written only under logs/h6-synth/.
//
// Definitions (reused, not changed):
// - Onset: `OnsetStats` (onsetStats.ts lines 1–66), mirrored read for read in `H6Pass1.frame` (the repro mode checks the
//   events equal logs/contacts/data-c<i>.json's): a step of ≥ 0.6 mm/frame from the last in-nest detection ≤ 3 frames
//   back, after ≥ 20 still frames (gaps ≤ 3 frames allowed; an out-of-nest read or a longer gap restarts the count).
//   Position: the detection before the step. Light phase: the frame's UTC hour in [6, 18).
// - Contact: `ContactOnset`'s crossing (contactOnset.ts lines 1–8, 97–130): the pair crosses into 4.1 mm (far again
//   only beyond 5.1 mm; a joint gap > 3 frames forgets the pair) while the partner moves (consecutive-frame step
//   ≥ 0.6 mm, code 2) and the focal is still (code 1). The repro mode checks it against ContactOnset's own contacts.
// - "Observed contact with a moving ant within W" (P134: observational, never "spontaneous"): a contact with the ant as
//   focal on a frame in [f − W, f − 1]; W = 10 s (20 frames) and 60 s (120 frames).
// - Coverage rule (D241 amendment 1 point 3, its neighbour clause replaced by D252's reachability clause; brief
//   20261102-1605-h6-reach): a window [f − W, f) is covered unless the focal ant is detected in the nest on < 90 % of
//   its frames (unchanged), or another tracked ant j has an unread run with more than 4 unread frames (2 s) inside the
//   window from which it could have reached contact with the focal inside the window: with t1, p1 j's last read before
//   the run, t2, p2 its first read after it, x the focal's position (its in-nest read at the run's first unread frame,
//   or the nearest one in the ring, earlier on a tie), r = 4.1 mm and v = V_REACH, a = t1 + max(0, |p1 − x| − r) / v,
//   b = t2 − max(0, |x − p2| − r) / v, the run counts iff max(a, f − W) ≤ min(b, f); b = f for a run with no read
//   before f. Times in seconds (frames / 2). Which neighbours enter: NEIGHBOUR_SEEN ('ring', D255). "Read" = any read, in
//   or out of the nest. Failing it, a "no observed contact" would be "unknown" (the reader classes; the flags are stored
//   here). Used for onsets and S1's at-risk rows alike (P148), and for the elig records' coverage bit (never read).
// - Null-3 eligibility at an onset frame f (amendment 1 point 1): detected in the nest at f, on ≥ 18 of the 20 frames
//   f − 20 … f − 1, and no moving step (onset step rule) at f − 19 … f − 1, i.e. still for the onset rule's 20 frames
//   (a step at f − 20 moves the ant into the window; an onset itself allows it). Stored for every ant at every light
//   frame with an onset (each such frame can start an episode), with the W = 10 s coverage bit beside it (kept in the
//   format, never read: null 3's eligibility is these three conditions only, D241 amendment 2, D246).
// - Strict tracking (sensitivity): detected in the nest on every frame f − 20 … f − 1.
// - S1's at-risk sample (lead): every 20th frame (frame % 20 = 0), every ant still for ≥ 20 frames under the onset
//   rule (OnsetStats' `eligible`), with the same flags as the onsets.
// - Zone grid (amendment 1, lead): 2 × 2 mm cells; per cell the light-phase in-nest detection-frames of foragers and of
//   nurses (one per ant and frame; queen excluded). Zones are built by the reader's `buildZones` (one function, used
//   here for pass 2 and V4).
// - Activity (S1 context, quiet start, S2, S3): `StepRule` steps of the in-nest nurses and foragers (queen excluded, as
//   in every earlier activity series), moving fraction = moving steps / steps. Per 10-frame bin (colony, and per zone by
//   current location) and per UTC minute (per zone, by current location and by each ant's modal zone).
// - Arrivals (S3): a zone crossing is an in-nest read in an assigned cell whose ant's previous assigned-cell read, with
//   no out-of-nest read and no in-nest gap > 3 frames since, was in the other zone; an entry from the arena is an
//   in-nest read at f satisfying D212 amendment 1's observed absence (any role; D241 amendment 2, D247), as
//   `absenceAt` in triggersCore.ts: every detection of the ant in [f − 60, f) outside the nest and, with P its last
//   detection at or before f − 60, P and its detections in (f − 60, f) at most 20 frames (10 s) apart in sequence, the
//   last at most 20 frames before f. A detection is a frame with a read of the ant (code in-nest if any in-nest read,
//   else outside: StepRule's read order, as triggersCore's per-frame code). `observedAbsence` below.
import fs from 'node:fs';
import { arg, flag, numArg, readJson } from '../../lib';
import { colonies, roles, streamColony } from '../../stroeymeytTracks';
import { RNG } from '../../../src/sim/core/rng';
import { ContactOnset } from '../contactOnset';
import { ContactStats } from '../contactStats';
import { OnsetStats } from '../onsetStats';
import { buildZones, cellOf, H, L, SEED, type Grid } from './reader';

export const ONSET_STILL = 20;
export const W10 = 20;
export const W60 = 120;
export const COVER_GAP = 4;
export const REACH_R = 4.1; // mm: ContactOnset's contact radius (D252's r)
/** D252's v (P174), mm/s: the 99th percentile (nearest rank, 0.001 mm/frame bins, bin midpoint) of light-phase in-nest
 * moving step speeds under the onset step rule, all ants, the 22 fit colonies pooled; computed once by
 * scripts/scratch/h6-next/vSpeed.ts on 2026-11-02 (brief 20261102-1605-h6-reach, item 2), before any rebuilt
 * intermediate existed. Its line: "v99 in-nest moving step speed, light, all ants, 22 fit colonies: 9.427 mm/s
 * (n = 3778783)". */
export const V_REACH = 9.427;
/** Which neighbours enter the clause: 'ring' (D255, the user's answer to Q35; why: D254): ant j enters only if it has a
 * read (any, in or out of the nest) in [f − RH, f − 1], the 128 s before f; a read inside the window counts. The other
 * options are kept for the tests only: 'ever' (the first build's code: every ant read at least once before f) and
 * 'ringBeforeWindow' (a read in [f − RH, f − W − 1]). */
export type Seen = 'ever' | 'ring' | 'ringBeforeWindow';
export const NEIGHBOUR_SEEN: Seen = 'ring';
/** D252's reachability test of one unread run (times in s, positions in mm): j last read at t1 at p1, next read at t2 at
 * p2 (`open`: no read before the window's end w1, so b = w1); focal at x; window [w0, w1]. */
export function reachable(t1: number, x1: number, y1: number, t2: number, x2: number, y2: number, open: boolean, fx: number, fy: number, w0: number, w1: number, v = V_REACH, r = REACH_R): boolean {
  const a = t1 + Math.max(0, Math.hypot(x1 - fx, y1 - fy) - r) / v;
  const b = open ? w1 : t2 - Math.max(0, Math.hypot(fx - x2, fy - y2) - r) / v;
  return Math.max(a, w0) <= Math.min(b, w1);
}
import { F_CON10, F_CON60, F_COV10, F_COV60, F_STRICT } from './reader';
export { F_CON10, F_CON60, F_COV10, F_COV60, F_STRICT };
export const RH = 256; // ring length in frames (> W60 + margin)

export const ABSENCE = 60; // D212 primary absence, 30 s
export const COVER_OBS = 20; // D212 amendment 1 "observed": detections at most 10 s apart
/** D212 amendment 1's observed absence before an in-nest detection at g (`absenceAt` in triggersCore.ts on a sparse
 * detection list): `detF` the ant's detection frames in increasing order (one per frame), `detIn` whether each was in
 * the nest. Detections at or after g are ignored. Needs the detections back to g − A − C (older ones cannot change it). */
export function observedAbsence(detF: ArrayLike<number>, detIn: ArrayLike<boolean | number>, g: number, A = ABSENCE, C = COVER_OBS): boolean {
  const a = g - A;
  let prev = g;
  for (let q = detF.length - 1; q >= 0; q--) {
    const h = detF[q];
    if (h >= g) continue;
    if (prev - h > C) return false;
    if (h >= a && detIn[q]) return false;
    if (h <= a) return true;
    prev = h;
  }
  return false;
}

export const isLight = (t: number): boolean => { const h = (((t / 3600) % 24) + 24) % 24; return h >= 6 && h < 18; };

/** Pass 1: everything that needs no zone. `full` off (V4): onsets and eligibility only. */
export class H6Pass1 {
  private readonly n: number;
  // OnsetStats mirror
  private readonly lastF: Int32Array;
  private readonly lastX: Float64Array;
  private readonly lastY: Float64Array;
  private readonly still: Int32Array;
  // rings: frame stamps of in-nest detections and of moving steps (onset rule)
  private readonly stIn: Int32Array[];
  private readonly stMov: Int32Array[];
  private readonly posX: Float64Array[];
  private readonly posY: Float64Array[];
  // any read (coverage): first and last read, and closed unread runs [start, end, x1, y1, x2, y2] (p1: the last read
  // before the run, p2: the first read after it; the first read of the ant in each frame)
  private readonly firstAny: Int32Array;
  private readonly lastAny: Int32Array;
  private readonly lastAnyX: Float64Array;
  private readonly lastAnyY: Float64Array;
  private readonly gaps: number[][];
  // ContactOnset mirror (codes, pair states)
  private readonly coLastF: Int32Array;
  private readonly coPX: Float64Array;
  private readonly coPY: Float64Array;
  private readonly coPF: Int32Array;
  private readonly st4: Uint8Array;
  private readonly lastJoint: Int32Array;
  private readonly contactsAt: number[][]; // per ant, recent contact frames as focal
  /** Contacts found this frame as [focal, partner] (for the repro check). */
  readonly frameContacts: number[] = [];
  // outputs
  readonly onsets: number[] = []; // [f, ant, x, y, cell, still, flags, t]
  readonly elig: number[][] = []; // per light onset frame: [f, ant, cov10bit, ant, cov10bit, …]
  readonly atRisk: number[] = []; // [f, ant, cell, flags]
  readonly grid = new Map<number, [number, number]>(); // cell → [forager, nurse] detection-frames
  readonly bins = new Map<number, number[]>(); // 10-frame bin → [t, moving, steps, frames]
  readonly antMin = new Map<number, Int32Array>(); // UTC minute → per ant [moving, steps] (non-queen)
  readonly antCells: Map<number, number>[]; // per ant: cell → in-nest light detection-frames (non-queen)
  readonly events: number[] = []; // light onsets as OnsetStats' events [f, ant, x, y, still]
  constructor(readonly track: boolean[], readonly role: string[], readonly full = true, readonly v = V_REACH, readonly seen: Seen = NEIGHBOUR_SEEN) {
    const n = (this.n = track.length);
    this.lastF = new Int32Array(n).fill(-1e9);
    this.lastX = new Float64Array(n);
    this.lastY = new Float64Array(n);
    this.still = new Int32Array(n);
    this.stIn = Array.from({ length: n }, () => new Int32Array(RH).fill(-1e9));
    this.stMov = Array.from({ length: n }, () => new Int32Array(RH).fill(-1e9));
    this.posX = Array.from({ length: n }, () => new Float64Array(RH));
    this.posY = Array.from({ length: n }, () => new Float64Array(RH));
    this.firstAny = new Int32Array(n).fill(-1e9);
    this.lastAny = new Int32Array(n).fill(-1e9);
    this.lastAnyX = new Float64Array(n);
    this.lastAnyY = new Float64Array(n);
    this.gaps = Array.from({ length: n }, () => []);
    this.coLastF = new Int32Array(n).fill(-1e9);
    this.coPX = new Float64Array(n);
    this.coPY = new Float64Array(n);
    this.coPF = new Int32Array(n).fill(-1e9);
    this.st4 = new Uint8Array(n * n);
    this.lastJoint = new Int32Array(n * n).fill(-1e9);
    this.contactsAt = Array.from({ length: n }, () => []);
    this.antCells = Array.from({ length: n }, () => new Map());
  }

  private inAt(i: number, g: number): boolean { return this.stIn[i][((g % RH) + RH) % RH] === g; }
  private movAt(i: number, g: number): boolean { return this.stMov[i][((g % RH) + RH) % RH] === g; }
  private detCount(i: number, a: number, b: number): number { let c = 0; for (let g = a; g <= b; g++) if (this.inAt(i, g)) c++; return c; }

  /** The focal's in-nest read at frame g, or the nearest one in the ring (frames f − RH + 1 … f − 1; the earlier on a
   * tie); null if there is none. */
  focalAt(i: number, g: number, f: number): [number, number] | null {
    const lo = f - RH + 1, hi = f - 1;
    const g0 = Math.min(Math.max(g, lo), hi);
    for (let d = 0; g0 - d >= lo || g0 + d <= hi; d++) {
      if (g0 - d >= lo && this.inAt(i, g0 - d)) { const k = (((g0 - d) % RH) + RH) % RH; return [this.posX[i][k], this.posY[i][k]]; }
      if (d > 0 && g0 + d <= hi && this.inAt(i, g0 + d)) { const k = (((g0 + d) % RH) + RH) % RH; return [this.posX[i][k], this.posY[i][k]]; }
    }
    return null;
  }
  /** Whether ant j has any read (in or out of the nest) at a frame in [A, B] (A ≥ f − RH at the current frame f). */
  hasRead(j: number, A: number, B: number): boolean {
    if (this.lastAny[j] < A || this.firstAny[j] < -1e8 || this.firstAny[j] > B) return false;
    const a = Math.max(A, this.firstAny[j]), b = Math.min(B, this.lastAny[j]);
    // reads cover [firstAny, lastAny] except the closed runs, which are disjoint: [a, b] is unread iff one run covers it
    const r = this.gaps[j];
    for (let k = 0; k < r.length; k += 6) if (r[k] <= a && r[k + 1] >= b) return false;
    return true;
  }
  /** Coverage of ant i at frame f for windows W10 and W60: [cov10, cov60]. (px, py): the focal's position at f, used for
   * x only if the focal has no in-nest read in the ring (it always has one when it passes the 90 % clause). */
  coverage(i: number, f: number, px: number, py: number): [boolean, boolean] {
    let ok10 = this.detCount(i, f - W10, f - 1) >= 0.9 * W10;
    let ok60 = this.detCount(i, f - W60, f - 1) >= 0.9 * W60;
    if (!ok10 && !ok60) return [false, false];
    const w1 = f / 2;
    for (let j = 0; j < this.n && (ok10 || ok60); j++) {
      if (j === i || !this.track[j]) continue;
      let in10 = true, in60 = true; // j enters the clause for W10 / W60
      if (this.seen === 'ring') in10 = in60 = this.hasRead(j, f - RH, f - 1);
      else if (this.seen === 'ringBeforeWindow') { in10 = this.hasRead(j, f - RH, f - W10 - 1); in60 = this.hasRead(j, f - RH, f - W60 - 1); }
      if (!in10 && !in60) continue;
      const check = (s: number, e: number, x1: number, y1: number, x2: number, y2: number, open: boolean) => {
        const e1 = Math.min(e, f - 1);
        const long10 = ok10 && in10 && e1 - Math.max(s, f - W10) + 1 > COVER_GAP;
        const long60 = ok60 && in60 && e1 - Math.max(s, f - W60) + 1 > COVER_GAP;
        if (!long10 && !long60) return;
        const x = this.focalAt(i, s, f) ?? [px, py];
        const t1 = (s - 1) / 2, t2 = (e + 1) / 2;
        const op = open || e + 1 >= f; // no read before f
        if (long10 && reachable(t1, x1, y1, t2, x2, y2, op, x[0], x[1], (f - W10) / 2, w1, this.v)) ok10 = false;
        if (long60 && reachable(t1, x1, y1, t2, x2, y2, op, x[0], x[1], (f - W60) / 2, w1, this.v)) ok60 = false;
      };
      const runs = this.gaps[j];
      for (let k = 0; k < runs.length; k += 6) check(runs[k], runs[k + 1], runs[k + 2], runs[k + 3], runs[k + 4], runs[k + 5], false);
      if (this.lastAny[j] > -1e8 && this.lastAny[j] < f) check(this.lastAny[j] + 1, f, this.lastAnyX[j], this.lastAnyY[j], NaN, NaN, true);
    }
    return [ok10, ok60];
  }
  private contactIn(i: number, a: number, b: number): boolean { for (const g of this.contactsAt[i]) if (g >= a && g <= b) return true; return false; }
  private flagsAt(i: number, f: number, px: number, py: number): number {
    const [c10, c60] = this.coverage(i, f, px, py);
    let fl = (c10 ? F_COV10 : 0) | (c60 ? F_COV60 : 0);
    if (this.contactIn(i, f - W10, f - 1)) fl |= F_CON10;
    if (this.contactIn(i, f - W60, f - 1)) fl |= F_CON60;
    if (this.detCount(i, f - ONSET_STILL, f - 1) === ONSET_STILL) fl |= F_STRICT;
    return fl;
  }

  frame(f: number, t: number, ids: number[], xs: number[], ys: number[], ins: boolean[]): void {
    const light = isLight(t);
    const k = ((f % RH) + RH) % RH;
    const now: number[] = []; // onset ants this frame (indices into onsets via position)
    const eligible: number[] = [];
    const queen = (i: number) => this.role[i] === 'queen';
    const bin = Math.floor(f / 10);
    let B: number[] | undefined;
    if (light && this.full) {
      B = this.bins.get(bin);
      if (!B) this.bins.set(bin, (B = [t, 0, 0, 0]));
      B[3]++;
    }
    const minute = Math.floor(t / 60);
    let AM: Int32Array | undefined;
    if (light && this.full) {
      AM = this.antMin.get(minute);
      if (!AM) this.antMin.set(minute, (AM = new Int32Array(2 * this.n)));
    }
    // any reads (coverage)
    for (let q = 0; q < ids.length; q++) {
      const i = ids[q];
      if (!this.track[i] || this.lastAny[i] === f) continue;
      if (this.lastAny[i] > -1e8 && f - this.lastAny[i] > 1) this.gaps[i].push(this.lastAny[i] + 1, f - 1, this.lastAnyX[i], this.lastAnyY[i], xs[q], ys[q]);
      if (this.firstAny[i] < -1e8) this.firstAny[i] = f;
      this.lastAny[i] = f;
      this.lastAnyX[i] = xs[q];
      this.lastAnyY[i] = ys[q];
    }
    // OnsetStats mirror (read for read)
    for (let q = 0; q < ids.length; q++) {
      const i = ids[q];
      if (!this.track[i] || this.lastF[i] === f) continue;
      if (!ins[q]) {
        this.lastF[i] = -1e9;
        continue;
      }
      const g = f - this.lastF[i];
      let step = 0; // 0 none, 1 still, 2 moving
      if (g > 3) this.still[i] = 0;
      else if (Math.hypot(xs[q] - this.lastX[i], ys[q] - this.lastY[i]) / g >= 0.6) {
        step = 2;
        if (this.still[i] >= ONSET_STILL) {
          if (light) {
            this.events.push(f, i, this.lastX[i], this.lastY[i], this.still[i]);
            now.push(i, this.lastX[i], this.lastY[i], this.still[i]);
          }
        }
        this.still[i] = 0;
      } else {
        step = 1;
        this.still[i] += g;
      }
      this.stIn[i][k] = f;
      this.posX[i][k] = xs[q];
      this.posY[i][k] = ys[q];
      if (step === 2) this.stMov[i][k] = f;
      this.lastF[i] = f;
      this.lastX[i] = xs[q];
      this.lastY[i] = ys[q];
      if (this.still[i] >= ONSET_STILL) eligible.push(i);
      if (light && this.full && !queen(i)) {
        if (step > 0) { B![2]++; AM![2 * i + 1]++; if (step === 2) { B![1]++; AM![2 * i]++; } }
        const c = cellOf(xs[q], ys[q]);
        const r = this.role[i];
        let G = this.grid.get(c);
        if (!G) this.grid.set(c, (G = [0, 0]));
        if (r === 'forager') G[0]++;
        else if (r === 'nurse') G[1]++;
        this.antCells[i].set(c, (this.antCells[i].get(c) ?? 0) + 1);
      }
    }
    // ContactOnset mirror: codes and 4.1-mm crossings (in-nest reads only; out-of-nest reads skipped, as there)
    this.frameContacts.length = 0;
    if (this.full) {
      const seen: number[] = [];
      const code = new Map<number, number>();
      for (let q = 0; q < ids.length; q++) {
        const i = ids[q];
        if (!this.track[i] || !ins[q] || this.coLastF[i] === f) continue;
        const g = f - this.coLastF[i];
        code.set(i, g === 1 && this.coPF[i] === f - 1 ? (Math.hypot(xs[q] - this.coPX[i], ys[q] - this.coPY[i]) >= 0.6 ? 2 : 1) : 3);
        this.coPX[i] = xs[q];
        this.coPY[i] = ys[q];
        this.coPF[i] = f;
        this.coLastF[i] = f;
        seen.push(i);
      }
      for (let a = 0; a < seen.length; a++) {
        for (let b = a + 1; b < seen.length; b++) {
          const [i, j] = seen[a] < seen[b] ? [seen[a], seen[b]] : [seen[b], seen[a]];
          const p = i * this.n + j;
          const dx = this.coPX[i] - this.coPX[j];
          const dy = this.coPY[i] - this.coPY[j];
          const fresh = f - this.lastJoint[p] <= 3;
          this.lastJoint[p] = f;
          if (!fresh) this.st4[p] = 0;
          if (Math.abs(dx) > 8 || Math.abs(dy) > 8) { this.st4[p] = 1; continue; }
          const d = Math.hypot(dx, dy);
          if (d < 4.1) {
            if (this.st4[p] === 1) {
              const ci = code.get(i), cj = code.get(j);
              if (ci === 1 && cj === 2) { this.contactsAt[i].push(f); this.frameContacts.push(i, j); }
              if (cj === 1 && ci === 2) { this.contactsAt[j].push(f); this.frameContacts.push(j, i); }
            }
            this.st4[p] = 2;
          } else if (d > 5.1 || this.st4[p] === 0) this.st4[p] = 1;
        }
      }
    }
    if (light) {
      // onsets of this frame with their flags (windows end at f − 1: the frame's contacts do not enter)
      for (let m = 0; m < now.length; m += 4) {
        const i = now[m], x = now[m + 1], y = now[m + 2];
        const fl = this.full ? this.flagsAt(i, f, x, y) : 0;
        this.onsets.push(f, i, x, y, cellOf(x, y), now[m + 3], fl, t);
      }
      // null-3 eligibility at onset frames
      if (now.length) {
        const E: number[] = [f];
        for (let i = 0; i < this.n; i++) {
          if (!this.track[i] || !this.inAt(i, f)) continue;
          if (this.detCount(i, f - 20, f - 1) < 18) continue;
          let mv = false;
          for (let g = f - 19; g <= f - 1 && !mv; g++) if (this.movAt(i, g)) mv = true;
          if (mv) continue;
          const [c10] = this.coverage(i, f, this.posX[i][k], this.posY[i][k]);
          E.push(i, c10 ? 1 : 0);
        }
        this.elig.push(E);
      }
      // S1's at-risk sample
      if (this.full && f % 20 === 0) for (const i of eligible) this.atRisk.push(f, i, cellOf(this.lastX[i], this.lastY[i]), this.flagsAt(i, f, this.lastX[i], this.lastY[i]));
    }
    // prune
    if (f % 64 === 0) {
      for (let i = 0; i < this.n; i++) {
        const r = this.gaps[i];
        let w = 0;
        for (let q = 0; q < r.length; q += 6) if (r[q + 1] >= f - RH) for (let u = 0; u < 6; u++) r[w++] = r[q + u];
        r.length = w;
        const c = this.contactsAt[i];
        let u = 0;
        for (const g of c) if (g >= f - RH) c[u++] = g;
        c.length = u;
      }
    }
  }
}

/** Pass 2 (zones known): per zone activity by current location (UTC minute and 10-frame bin), per-ant bin counts by
 * zone, and arrivals. Steps by the onset/StepRule step; non-queen ants for activity, every ant for arrivals. */
export class H6Pass2 {
  private readonly lastF: Int32Array;
  private readonly lastX: Float64Array;
  private readonly lastY: Float64Array;
  private readonly lastZone: Int8Array;
  private readonly lastInF: Int32Array;
  private readonly detF: number[][]; // per ant recent detection frames (one per frame), back to f − ABSENCE − COVER_OBS
  private readonly detIn: boolean[][]; // … and whether each was in the nest
  readonly minutes = new Map<number, number[]>(); // UTC minute → [Lmov, Lsteps, Hmov, Hsteps] current location
  readonly binIndex: Map<number, number>;
  readonly zb: Int32Array; // per light bin [Lmov, Lsteps, Hmov, Hsteps]
  readonly ab: Uint8Array; // per ant, per light bin [Lmov, Lsteps, Hmov, Hsteps]
  readonly arrivals: number[] = []; // [f, ant, kind (0 crossing, 1 entry), from (L/H, or −2 arena), to (L/H/−1), t]
  constructor(readonly track: boolean[], readonly role: string[], readonly zoneOf: Map<number, number>, bins: number[]) {
    const n = track.length;
    this.lastF = new Int32Array(n).fill(-1e9);
    this.lastX = new Float64Array(n);
    this.lastY = new Float64Array(n);
    this.lastZone = new Int8Array(n).fill(-1);
    this.lastInF = new Int32Array(n).fill(-1e9);
    this.detF = Array.from({ length: n }, () => []);
    this.detIn = Array.from({ length: n }, () => []);
    this.binIndex = new Map(bins.map((b, k) => [b, k]));
    this.zb = new Int32Array(bins.length * 4);
    this.ab = new Uint8Array(n * bins.length * 4);
  }
  frame(f: number, t: number, ids: number[], xs: number[], ys: number[], ins: boolean[]): void {
    const light = isLight(t);
    const bk = this.binIndex.get(Math.floor(f / 10));
    const minute = Math.floor(t / 60);
    let M: number[] | undefined;
    if (light) { M = this.minutes.get(minute); if (!M) this.minutes.set(minute, (M = [0, 0, 0, 0])); }
    const nb = this.binIndex.size;
    for (let q = 0; q < ids.length; q++) {
      const i = ids[q];
      // StepRule's read order: an in-nest read already this frame skips the read; an out-of-nest read resets
      if (!this.track[i] || this.lastF[i] === f) continue;
      // observed-absence check for an entry at this in-nest read (detections before f only), then record the detection
      const dF = this.detF[i], dI = this.detIn[i];
      const entry = light && ins[q] && observedAbsence(dF, dI, f);
      if (dF.length && dF[dF.length - 1] === f) { if (ins[q]) dI[dI.length - 1] = true; }
      else { dF.push(f); dI.push(ins[q]); }
      while (dF[0] < f - ABSENCE - COVER_OBS) { dF.shift(); dI.shift(); }
      if (!ins[q]) {
        this.lastZone[i] = -1;
        this.lastF[i] = -1e9;
        continue;
      }
      const c = cellOf(xs[q], ys[q]);
      const z = this.zoneOf.get(c) ?? -1;
      if (light) {
        // entry from the arena: D212's observed absence (observedAbsence); otherwise a possible zone crossing
        if (entry) this.arrivals.push(f, i, 1, -2, z, t);
        else if (z >= 0 && this.lastZone[i] >= 0 && this.lastZone[i] !== z && f - this.lastInF[i] <= 3) this.arrivals.push(f, i, 0, this.lastZone[i], z, t);
      }
      if (f - this.lastInF[i] > 3) this.lastZone[i] = -1;
      if (z >= 0) this.lastZone[i] = z;
      this.lastInF[i] = f;
      // steps (StepRule) for activity, non-queen
      const g = f - this.lastF[i];
      let step = 0;
      if (g <= 3) step = Math.hypot(xs[q] - this.lastX[i], ys[q] - this.lastY[i]) / g >= 0.6 ? 2 : 1;
      this.lastF[i] = f;
      this.lastX[i] = xs[q];
      this.lastY[i] = ys[q];
      if (!light || step === 0 || this.role[i] === 'queen' || z < 0) continue;
      const off = 2 * z;
      M![off + 1]++;
      if (step === 2) M![off]++;
      if (bk !== undefined) {
        this.zb[4 * bk + off + 1]++;
        if (step === 2) this.zb[4 * bk + off]++;
        const a = (i * nb + bk) * 4 + off;
        this.ab[a + 1]++;
        if (step === 2) this.ab[a]++;
      }
    }
  }
}

/** Compact JSON (the intermediates are large; `writeJson` indents). */
const writeCompact = (path: string, v: unknown): void => { fs.mkdirSync(path.replace(/\/[^/]*$/, ''), { recursive: true }); fs.writeFileSync(path, JSON.stringify(v)); };
const b64 = (a: Uint8Array | Int32Array): string => Buffer.from(a.buffer, a.byteOffset, a.byteLength).toString('base64');

async function main(): Promise<void> {
  const ci = numArg('--colony', 0);
  const col = colonies()[ci];
  const roleOf = roles(col);
  const tags = [...roleOf.keys()];
  const index = new Map(tags.map((t, i) => [t, i]));
  const R = tags.map((t) => roleOf.get(t)!);
  const repro = flag('--repro');
  const del = arg('--delete', '');
  const t0 = Date.now();
  if (!repro && !(V_REACH > 0)) throw new Error('V_REACH is not set');
  if (repro) {
    const track = R.map((r) => r === 'nurse' || r === 'forager');
    const p1 = new H6Pass1(track, R);
    const cs = new ContactStats(track);
    const os = new OnsetStats(track);
    const co = new ContactOnset(track);
    let contactMismatch = 0;
    let contactsMine = 0;
    await streamColony(col, index, (f, t, ids, xs, ys, ins) => {
      p1.frame(f, t, ids, xs, ys, ins);
      os.frame(f, ids, xs, ys, ins, t, cs.frame(f, ids, xs, ys, ins, t));
      co.frame(f, ids, xs, ys, ins, t);
      // ContactOnset's own contacts at f (private ring, read for the check only)
      const ring = (co as unknown as { contacts: { f: number; i: number }[][] }).contacts[f % 64];
      const theirs = ring.filter((e) => e.f === f).map((e) => e.i).sort((a, b) => a - b);
      const mine: number[] = [];
      for (let k = 0; k < p1.frameContacts.length; k += 2) mine.push(p1.frameContacts[k]);
      mine.sort((a, b) => a - b);
      contactsMine += mine.length;
      if (mine.length !== theirs.length || mine.some((v, k) => v !== theirs[k])) contactMismatch++;
    });
    const ev = os.out.light?.events ?? [];
    const same = ev.length === p1.events.length && ev.every((v, k) => v === p1.events[k]);
    writeCompact(`logs/h6-work-next/repro-c${ci}.json`, { colony: col.label, onsets: { light: { events: p1.events, risk: os.out.light?.risk } }, tb: co.out, check: { eventsEqualOnsetStats: same, contactFramesMismatched: contactMismatch, contacts: contactsMine } });
    console.log(`${col.label} repro done (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
    return;
  }
  const track = R.map(() => true);
  if (del !== '') {
    // V4: deletion before onsets and eligibility are rebuilt (zones from the intact data). `--delete a:b` builds data
    // sets a … b − 1 in one pass over the file (one deletion stream and one rebuilt state per set).
    const [k0, k1] = del.includes(':') ? del.split(':').map(Number) : [Number(del), Number(del) + 1];
    const outDir = arg('--out-dir', 'logs/h6-synth/V4/work');
    if (!outDir.startsWith('logs/h6-synth/')) throw new Error('V4 output must be under logs/h6-synth/');
    const base = readJson<{ grid: Grid }>(`logs/h6-work/c${ci}.json`);
    const Z = buildZones(base.grid);
    let nL = 0, nH = 0, nU = 0;
    base.grid.cells.forEach((c, k) => { const v = base.grid.forager[k] + base.grid.nurse[k]; const z = Z.zoneOf.get(c); if (z === L) nL += v; else if (z === H) nH += v; else nU += v; });
    // expected deletions pL·(L + unassigned) + 2 pL·H = 10 % of the in-nest detections (grid counts; the queen's reads
    // are deleted at the same rates)
    const pL = (0.1 * (nL + nH + nU)) / (nL + 2 * nH + nU);
    const sets = Array.from({ length: k1 - k0 }, (_, q) => ({ k: k0 + q, rng: RNG.stream(SEED, 4, k0 + q, ci), p1: new H6Pass1(track, R, false), seen: 0, dropped: 0 }));
    const kI: number[] = [], kX: number[] = [], kY: number[] = [];
    const kB: boolean[] = [];
    await streamColony(col, index, (f, t, ids, xs, ys, ins) => {
      if (!isLight(t)) { for (const S of sets) S.p1.frame(f, t, ids, xs, ys, ins); return; }
      const zq = ids.map((_, q) => (ins[q] ? (Z.zoneOf.get(cellOf(xs[q], ys[q])) === H ? 2 * pL : pL) : 0));
      for (const S of sets) {
        kI.length = kX.length = kY.length = kB.length = 0;
        for (let q = 0; q < ids.length; q++) {
          if (ins[q]) {
            S.seen++;
            if (S.rng.next() < zq[q]) { S.dropped++; continue; }
          }
          kI.push(ids[q]); kX.push(xs[q]); kY.push(ys[q]); kB.push(ins[q]);
        }
        S.p1.frame(f, t, kI, kX, kY, kB);
      }
    });
    for (const S of sets) writeCompact(`${outDir}/k${S.k}-c${ci}.json`, { colony: col.label, deleteSet: S.k, pL, deletedShare: S.dropped / S.seen, onsets: S.p1.onsets, elig: S.p1.elig });
    console.log(`${col.label} V4 sets ${k0}–${k1 - 1} done (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
    return;
  }
  const p1 = new H6Pass1(track, R);
  const s1 = await streamColony(col, index, (f, t, ids, xs, ys, ins) => p1.frame(f, t, ids, xs, ys, ins));
  const cells = [...p1.grid.keys()].sort((a, b) => a - b);
  const grid: Grid = { cells, forager: cells.map((c) => p1.grid.get(c)![0]), nurse: cells.map((c) => p1.grid.get(c)![1]) };
  const Z = buildZones(grid);
  // modal zone per ant (light in-nest detection-frames in assigned cells; ties and none → −1)
  const modal = R.map((_, i) => {
    let a = 0, b = 0;
    for (const [c, v] of p1.antCells[i]) { const z = Z.zoneOf.get(c); if (z === L) a += v; else if (z === H) b += v; }
    return a > b ? L : b > a ? H : -1;
  });
  const bins = [...p1.bins.keys()].sort((a, b) => a - b);
  const p2 = new H6Pass2(track, R, Z.zoneOf, bins);
  await streamColony(col, index, (f, t, ids, xs, ys, ins) => p2.frame(f, t, ids, xs, ys, ins));
  const minutes = [...p1.antMin.keys()].sort((a, b) => a - b);
  const fix = minutes.map((m) => {
    const A = p1.antMin.get(m)!;
    const o = [0, 0, 0, 0];
    for (let i = 0; i < R.length; i++) if (modal[i] >= 0) { o[2 * modal[i]] += A[2 * i]; o[2 * modal[i] + 1] += A[2 * i + 1]; }
    return o;
  });
  const cur = minutes.map((m) => p2.minutes.get(m) ?? [0, 0, 0, 0]);
  writeCompact(`logs/h6-work-next/c${ci}.json`, {
    colony: col.label,
    note: 'H6 intermediates (D241 amendment 1): not to be summarised; read only by the reader and the synthetic generator.',
    tags,
    roles: R,
    stream: s1,
    onsetFields: ['frame', 'ant', 'x', 'y', 'cell', 'stillBefore', 'flags', 't'],
    flagBits: { coverage10s: F_COV10, coverage60s: F_COV60, observedContact10s: F_CON10, observedContact60s: F_CON60, strictTracking: F_STRICT },
    onsets: p1.onsets,
    elig: p1.elig,
    atRiskFields: ['frame', 'ant', 'cell', 'flags'],
    atRisk: p1.atRisk,
    grid,
    zoneCheck: { median: Z.median, nL: Z.nL, nH: Z.nH, nUnassigned: Z.nU },
    modalZone: modal,
    bins: { bin: bins, t: bins.map((b) => p1.bins.get(b)![0]), moving: bins.map((b) => p1.bins.get(b)![1]), steps: bins.map((b) => p1.bins.get(b)![2]), frames: bins.map((b) => p1.bins.get(b)![3]) },
    zoneBins: b64(p2.zb),
    antBins: b64(p2.ab),
    minutes: { minute: minutes, cur, fix },
    arrivalFields: ['frame', 'ant', 'kind', 'from', 'to', 't'],
    arrivals: p2.arrivals,
  });
  console.log(`${col.label} done (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
}

if (process.argv.includes('--colony')) await main();
