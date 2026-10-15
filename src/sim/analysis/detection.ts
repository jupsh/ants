/**
 * Detection process of the Stroeymeyt tracker (STATUS 2026-10-15): the
 * observed history of one tracked ant, shared by the statistics computed on
 * recorded tracks and by the simulated observer, so both classify the same
 * way. Observed history only: a step is still below 0.6 mm per frame, gaps of
 * up to 3 frames are bridged, a gap of 4 or more frames is a break (the true
 * state during a gap is unknown).
 *
 * A detection opens an opportunity for a gap at the next frame; its cell is the
 * observed class × the time since detection resumed:
 * - classes: moving or still for < 10 s since an observed moving step; still
 *   10–60 s; still 60–300 s; still ≥ 300 s; still since a break (age
 *   unknown); fresh (first detection after a break);
 * - time since detection resumed: < 2, 2–10, 10–60, 60–300, 300–1200,
 *   ≥ 1200 s.
 */
export const DET_TSB_EDGES = [4, 20, 120, 600, 2400, Infinity];
export const DET_CLASSES = ['moving / still < 10 s', 'still 10–60 s', 'still 60–300 s', 'still ≥ 300 s', 'still after a break', 'fresh'];
export const DET_NCELL = DET_CLASSES.length * DET_TSB_EDGES.length;
/** Gap-duration bins (missed frames), [e_k, e_{k+1}). */
export const DET_D_EDGES = [1, 2, 3, 4, 6, 9, 14, 20, 30, 40, 60, 90, 120, 180, 300, 600, 1200, 2400, 7200, Infinity];

const MOVING = 0;
const FRESH = 1;
const BOUNDED = 2;
const AFTER = 3;

export function detectionCell(state: number, age: number, since: number): number {
  const cls = state === FRESH ? 5 : state === AFTER ? 4 : state === MOVING || age < 20 ? 0 : age < 120 ? 1 : age < 600 ? 2 : 3;
  return cls * DET_TSB_EDGES.length + DET_TSB_EDGES.findIndex((hi) => since < hi);
}

/** Observed history of one ant, advanced detection by detection. */
export class ObservedState {
  state = FRESH;
  age = 0;
  since = 0;
  lastFrame = -1;
  x = NaN;
  y = NaN;

  /** The cell of the current detection (after `update`). */
  cell(): number {
    return detectionCell(this.state, this.age, this.since);
  }

  /** A detection at `frame` at (x, y), mm: advances the history over the interval since the last one. */
  update(frame: number, x: number, y: number): void {
    if (this.lastFrame >= 0) {
      const g = frame - this.lastFrame;
      if (g >= 4) {
        this.state = FRESH;
        this.age = 0;
        this.since = 0;
      } else {
        this.since += g;
        if (Math.hypot(x - this.x, y - this.y) / g < 0.6) {
          if (this.state === MOVING) {
            this.state = BOUNDED;
            this.age = g;
          } else if (this.state === FRESH) {
            this.state = AFTER;
            this.age = g;
          } else this.age += g;
        } else {
          this.state = MOVING;
          this.age = 0;
        }
      }
    }
    this.lastFrame = frame;
    this.x = x;
    this.y = y;
  }
}

/**
 * A colony's estimated tracker: gap-onset probability per cell, per-ant onset
 * multipliers to draw from, gap-duration bin probabilities per
 * time-since-resumed bin of the onset (gaps right after an outage are long,
 * isolated misses in a well-detected stretch are short).
 */
export interface DetectionTracker {
  p: number[];
  mult: number[];
  dProb: number[][];
}
