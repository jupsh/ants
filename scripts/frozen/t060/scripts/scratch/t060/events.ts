// Scratch (not committed): T060 Stage 0, the event table (D243 amendment 1 and the lead's dated block of 2026-11-03
// ≈ 01:04 UTC). This is the interface between the extraction (from tracks, brief 2; or the Scope A generator, scopeA.ts)
// and the reader (reader.ts). The reader reads nothing else.
//
// Terms (P155): a PDC is a proximity-defined contact, a moving partner crossing to within 4.1 mm while the focal ant is
// still (touches are unverified); a near approach is a proximity-defined near approach (a moving partner entering 8 mm,
// the focal still, with no PDC with that partner before the pair is beyond 9 mm again; its frame is the entry into 8 mm).
//
// Frames are 0.5 s, whole numbers. An inactive interval runs from its first still frame `start` to its onset frame
// `onset` (the frame of the first moving step; the ant is still on frames start … onset − 1), so its length is
// onset − start frames. The bout after it runs from `onset` to the next interval's `start`.
import type { Bins } from '../../frozen/h6/scripts/scratch/h6-next/reader';

export type { Bins };

/** Why a history became unknown (P153: an unknown history is never treated as complete; counts are reported by cause).
 * The first five are the extraction's (dated block); `synthetic` is Scope A's loss of complete history. */
export const CAUSES = ['focalGap', 'partnerBlind', 'partnerUnbracketed', 'exit', 'onsetStatus', 'synthetic'] as const;
export type Cause = (typeof CAUSES)[number];

export type Role = 'nurse' | 'forager';

export interface Interval {
  /** First still frame. */
  start: number;
  /** Onset frame ending the interval, or null if no onset was observed (the interval runs past the recording's end, or
   * its onset status is unknown; then `unknownFrame` must say so unless the interval runs to the end of the light
   * phase). */
  onset: number | null;
  /** PDC frames within [start, onset), ascending (observed ones only; none needed after `unknownFrame`). */
  pdc: number[];
  /** Near-approach frames (entry into 8 mm) within [start, onset), ascending. */
  near: number[];
  /** The frame from which the interval's history is unknown (it stays unknown to the interval's end), or null. */
  unknownFrame: number | null;
  /** Its cause, when `unknownFrame` is set. */
  cause: Cause | null;
  /** H6's zone (frozen `buildZones`: 0 = L, 1 = H) at the focal's position at `start`; null = unassigned cell. */
  zone: number | null;
}

export interface Bout {
  /** Whether the bout's history is complete. */
  complete: boolean;
  /** The cause when it is not. */
  cause: Cause | null;
}

export interface Ant {
  id: number;
  role: Role;
  /** The ant's inactive intervals in time order (consecutive: no other inactive interval of the ant between two
   * neighbours; a stretch where one may have been missed makes the bout between them incomplete). */
  intervals: Interval[];
  /** bouts[j] lies between intervals[j] and intervals[j + 1] (length intervals.length − 1, or 0). */
  bouts: Bout[];
}

export interface ColonyEvents {
  label: string;
  /** Frame of 06:00 UTC and of 18:00 UTC (one light phase per colony; the light phase is [lightStart, lightEnd)). */
  lightStart: number;
  lightEnd: number;
  ants: Ant[];
  /** The colony's 10-frame moving-fraction bins over its light phase, as H6's `Bins` (bin = floor(frame / 10), t in s,
   * moving and steps counts of nurses' and foragers' steps), read by H6's frozen `context`. */
  bins: Bins;
  /** The extraction's own descriptive counts (brief 2; extract.ts). Never read by the reader. */
  extraction?: Record<string, unknown>;
}

/** Structural checks on an event table; throws on the first violation (an inconsistent table is never read). */
export function validateColony(c: ColonyEvents): void {
  const bad = (m: string) => { throw new Error(`event table ${c.label}: ${m}`); };
  if (!(c.lightEnd > c.lightStart)) bad('light phase');
  for (const a of c.ants) {
    if (a.role !== 'nurse' && a.role !== 'forager') bad(`ant ${a.id} role ${a.role}`);
    if (a.bouts.length !== Math.max(0, a.intervals.length - 1)) bad(`ant ${a.id} bouts`);
    for (let j = 0; j < a.intervals.length; j++) {
      const v = a.intervals[j];
      const end = v.onset ?? Infinity;
      if (!Number.isInteger(v.start) || (v.onset !== null && (!Number.isInteger(v.onset) || v.onset <= v.start))) bad(`ant ${a.id} interval ${j} frames`);
      if (j + 1 < a.intervals.length) {
        const next = a.intervals[j + 1].start;
        // Brief 2 (dated block of 2026-11-03 ≈ 06:51 UTC): an interval with no observed onset may be followed by a later
        // interval only when its history is unknown; the bout between them must then be incomplete, and the interval's
        // unknown frame and events lie before the next interval's start.
        if (v.onset === null) {
          if (v.unknownFrame === null) bad(`ant ${a.id} interval ${j}: no onset but a later interval`);
          else if (a.bouts[j].complete) bad(`ant ${a.id} interval ${j}: no onset, a later interval and a complete bout`);
          else if (next <= v.unknownFrame || [...v.pdc, ...v.near].some((f) => f >= next)) bad(`ant ${a.id} interval ${j + 1} overlaps`);
        } else if (next <= v.onset) bad(`ant ${a.id} interval ${j + 1} overlaps`);
      }
      for (const arr of [v.pdc, v.near]) for (let q = 0; q < arr.length; q++) if (!Number.isInteger(arr[q]) || arr[q] < v.start || arr[q] >= end || (q && arr[q] < arr[q - 1])) bad(`ant ${a.id} interval ${j} event frames`);
      if ((v.unknownFrame === null) !== (v.cause === null)) bad(`ant ${a.id} interval ${j} unknown without cause`);
      if (v.unknownFrame !== null && (v.unknownFrame < v.start || v.unknownFrame >= end)) bad(`ant ${a.id} interval ${j} unknown frame`);
    }
    for (const b of a.bouts) if (b.complete === (b.cause !== null)) bad(`ant ${a.id} bout cause`);
  }
}
