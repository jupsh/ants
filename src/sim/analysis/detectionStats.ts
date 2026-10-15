/**
 * Detection-process statistics of the Stroeymeyt tracker (STATUS
 * 2026-10-15): one code path for recorded tracks and simulated observers.
 * Frames are fed in order (the observer's detections only); `blockOf(t)`
 * assigns each opportunity to a block (data: even / odd UTC hours, the
 * tracker's estimation and validation blocks; simulations: one block).
 *
 * - Opportunity: a detection of a tracked ant in the nest whose next frame
 *   lies in the same block; its cell is `ObservedState.cell()`.
 * - Gap start: the next frame is missed. Duration D: missed frames until the
 *   next detection (any region), censored at the end of the opportunity's
 *   block or of the stream.
 * - With `exitsExcluded` (foragers), an opportunity whose next detection is
 *   outside the nest is dropped: an exit into the hole, which the simulated
 *   apparatus hides geometrically.
 */
import { DET_D_EDGES, DET_NCELL, DET_TSB_EDGES, ObservedState } from './detection';

const NT = DET_TSB_EDGES.length;
const NB = DET_D_EDGES.length - 1;

/** One ant's counts in one block. */
export interface AntBlock {
  /** Per cell: opportunities, gap starts, gaps of ≥ 4 frames (a run break). */
  opp: number[];
  gap: number[];
  ge4: number[];
  /** Per duration bin: complete and censored gaps. */
  dEvents: number[];
  dCens: number[];
  /** The same per time-since-resumed bin of the onset × duration bin (index tsbBin × NB + bin). */
  dEvT: number[];
  dCeT: number[];
  /** In-nest detections. */
  det: number;
}

const newAntBlock = (): AntBlock => ({
  opp: new Array(DET_NCELL).fill(0),
  gap: new Array(DET_NCELL).fill(0),
  ge4: new Array(DET_NCELL).fill(0),
  dEvents: new Array(NB).fill(0),
  dCens: new Array(NB).fill(0),
  dEvT: new Array(NT * NB).fill(0),
  dCeT: new Array(NT * NB).fill(0),
  det: 0,
});
const dBin = (d: number) => DET_D_EDGES.findIndex((e, k) => d >= e && d < DET_D_EDGES[k + 1]);

export class TrackerStats {
  /** [ant][block] (all ants; untracked ones stay empty). */
  readonly ants: AntBlock[][];
  private readonly obs: ObservedState[];
  private readonly pending: { cell: number; block: number; frame: number; blockEnd: number }[];

  constructor(
    readonly tracked: boolean[],
    readonly nBlocks: number,
    readonly blockOf: (t: number) => number,
    /** The last frame of the block holding a detection at `frame`, time `t`. */
    readonly blockEndFrame: (frame: number, t: number) => number,
    readonly exitsExcluded = false,
  ) {
    this.ants = tracked.map(() => Array.from({ length: nBlocks }, newAntBlock));
    this.obs = tracked.map(() => new ObservedState());
    this.pending = tracked.map(() => ({ cell: -1, block: -1, frame: -1, blockEnd: -1 }));
  }

  /** One frame's detections (any region); only in-nest detections open opportunities, any detection ends a gap. */
  frame(frame: number, t: number, ids: number[], xs: number[], ys: number[], ins: boolean[]): void {
    for (let k = 0; k < ids.length; k++) {
      const i = ids[k];
      if (!this.tracked[i]) continue;
      const o = this.obs[i];
      if (frame === o.lastFrame) continue;
      const pd = this.pending[i];
      if (pd.cell >= 0) {
        if (this.exitsExcluded && !ins[k]) pd.cell = -1;
        else this.close(i, frame);
      }
      if (!ins[k]) {
        pd.cell = -1;
        o.lastFrame = frame;
        o.x = xs[k];
        o.y = ys[k];
        continue;
      }
      o.update(frame, xs[k], ys[k]);
      const b = this.blockOf(t);
      this.ants[i][b].det++;
      const end = this.blockEndFrame(frame, t);
      if (frame + 1 <= end) Object.assign(pd, { cell: o.cell(), block: b, frame, blockEnd: end });
      else pd.cell = -1;
    }
  }

  /** Close open opportunities at the stream's last frame (censored). */
  finish(lastFrame: number): void {
    for (let i = 0; i < this.tracked.length; i++) if (this.pending[i].cell >= 0 && lastFrame > this.pending[i].frame + 1) this.close(i, lastFrame, true);
  }

  /** The tracked ants' blocks, in ant order. */
  trackedAnts(): AntBlock[][] {
    return this.ants.filter((_, i) => this.tracked[i]);
  }

  /** The opportunity opened at the ant's last detection ends with a detection at `frame` (or the stream end). */
  private close(i: number, frame: number, end = false): void {
    const pd = this.pending[i];
    const A = this.ants[i][pd.block];
    A.opp[pd.cell]++;
    const missed = frame - pd.frame - 1;
    const room = pd.blockEnd - pd.frame; // frames after the detection up to the block's last frame
    if (missed >= 1 || end) {
      if (missed >= 1) A.gap[pd.cell]++;
      if (missed >= 3 && room >= 3) A.ge4[pd.cell]++;
      const t = (pd.cell % NT) * NB;
      if (end || missed > room) {
        const k = dBin(Math.max(1, Math.min(missed, room)));
        A.dCens[k]++;
        A.dCeT[t + k]++;
      } else {
        A.dEvents[dBin(missed)]++;
        A.dEvT[t + dBin(missed)]++;
      }
    }
    pd.cell = -1;
  }
}
