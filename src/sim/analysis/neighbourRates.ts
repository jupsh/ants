/**
 * Neighbour-conditioned rest summaries on observed tracks (D083 Part B, amended D083 / D084), one code path for
 * recorded tracks and simulated observers. B018's families 3a / 3b / survival, recorded as counts:
 *
 * - steps as D043: consecutive in-nest detections ≤ 3 frames apart; still = < 0.6 mm per frame; a gap ≥ 4 frames,
 *   or a detection outside the nest, breaks the chain;
 * - neighbours of an ant at a frame: other ants (workers or the queen) whose step ending at that frame is still, within
 *   `NB_RADIUS_MM` (4.1 mm), among the ants detected in that frame;
 * - stop hazard: a worker whose step ending at frame f0 is moving, with N still neighbours at f0, is exposed for the
 *   next interval (g frames to its next chained step); event = that step is still. Leaving hazard: the same for a still
 *   step, by A = 1 + N, event = the next step is moving. Exposure in frames;
 * - rest episodes: start at a still step that follows a moving step (bounded start), at the still step's first frame
 *   f0, binned by A at f0 + g (the first still frame's end); duration in frames to the last still frame; censored
 *   at a chain break or when the window ends. Kept as event / censoring counts per duration up to `survMaxFrames`
 *   (longer ones lumped in the last slot), enough for Kaplan–Meier to `survMaxFrames`.
 * - per 2-mm cell (`NB_CELL_W` × `NB_CELL_H`, position at f0) the stop and leave counts again, for a site-field
 *   stratification applied afterwards.
 *
 * Only workers are focal; the queen counts as a neighbour. Transitions and episode starts count only while
 * `active(t)` holds (t of the frame that closes the interval / starts the episode); an episode open when `active`
 * turns false is censored there.
 */

export const NB_RADIUS_MM = 4.1;
/** N = 0 … 5, 6+. */
export const N_BINS = 7;
/** A = 1 … 8, 9+. */
export const A_BINS = 9;
/** Rest-episode A bins at start: 1, 2, 3–4, 5–8, ≥ 9. */
export const SURV_BINS = 5;
export const survBin = (A: number) => (A === 1 ? 0 : A === 2 ? 1 : A <= 4 ? 2 : A <= 8 ? 3 : 4);
export const NB_CELL_W = 36;
export const NB_CELL_H = 24;
export const NB_CELLS = NB_CELL_W * NB_CELL_H;
export const nbCell = (x: number, y: number) =>
  Math.max(0, Math.min(NB_CELL_H - 1, Math.floor(y / 2))) * NB_CELL_W + Math.max(0, Math.min(NB_CELL_W - 1, Math.floor(x / 2)));

const STILL_MM = 0.6;
const BRIDGE = 3;
const NONE = -1;
const MOVING = 0;
const STILL = 1;

/** One group's counts (frames). Cell tables: index bin * NB_CELLS + cell. */
export interface NbGroupTables {
  stopExp: number[];
  stopEv: number[];
  leaveExp: number[];
  leaveEv: number[];
  stopCellExp: Float32Array;
  stopCellEv: Float32Array;
  leaveCellExp: Float32Array;
  leaveCellEv: Float32Array;
  /** Episodes started per survival bin, and per bin × duration (frames 0 … survMaxFrames, then ≥ survMaxFrames + 1) the events and censorings. */
  starts: number[];
  survEv: number[][];
  survCens: number[][];
}

export interface NbTables {
  frameDt: number;
  survMaxFrames: number;
  groups: NbGroupTables[];
}

const newGroup = (survMax: number): NbGroupTables => ({
  stopExp: new Array(N_BINS).fill(0),
  stopEv: new Array(N_BINS).fill(0),
  leaveExp: new Array(A_BINS).fill(0),
  leaveEv: new Array(A_BINS).fill(0),
  stopCellExp: new Float32Array(N_BINS * NB_CELLS),
  stopCellEv: new Float32Array(N_BINS * NB_CELLS),
  leaveCellExp: new Float32Array(A_BINS * NB_CELLS),
  leaveCellEv: new Float32Array(A_BINS * NB_CELLS),
  starts: new Array(SURV_BINS).fill(0),
  survEv: Array.from({ length: SURV_BINS }, () => new Array(survMax + 2).fill(0)),
  survCens: Array.from({ length: SURV_BINS }, () => new Array(survMax + 2).fill(0)),
});

export class NeighbourStats {
  private readonly n: number;
  private readonly lastFrame: Int32Array;
  private readonly x: Float64Array;
  private readonly y: Float64Array;
  private readonly inNest: Uint8Array;
  /** State of the step ending at lastFrame (NONE if no chained step ends there), N there, and that frame's cell. */
  private readonly state: Int8Array;
  private readonly nAt: Int32Array;
  private readonly cellAt: Int32Array;
  /** Open rest episode: its start frame (−1: none) and survival bin. */
  private readonly epStart: Int32Array;
  private readonly epBin: Int8Array;
  readonly tables: NbTables;
  // Per-frame scratch.
  private readonly newState: Int8Array;
  private readonly seenAt: Int32Array;

  /**
   * @param role per ant index: 0 nurse, 1 forager (focal groups), 2 queen (neighbour only), −1 ignored.
   * @param survMaxSeconds Kaplan–Meier is kept to this duration (default 60 s).
   */
  constructor(
    readonly role: number[],
    readonly frameDt: number,
    readonly active: (t: number) => boolean = () => true,
    survMaxSeconds = 60,
  ) {
    const n = (this.n = role.length);
    this.lastFrame = new Int32Array(n).fill(-1e9);
    this.x = new Float64Array(n);
    this.y = new Float64Array(n);
    this.inNest = new Uint8Array(n);
    this.state = new Int8Array(n).fill(NONE);
    this.nAt = new Int32Array(n);
    this.cellAt = new Int32Array(n);
    this.epStart = new Int32Array(n).fill(-1);
    this.epBin = new Int8Array(n);
    this.newState = new Int8Array(n).fill(NONE);
    this.seenAt = new Int32Array(n).fill(-1e9);
    const survMax = Math.ceil(survMaxSeconds / frameDt - 1e-9);
    this.tables = { frameDt, survMaxFrames: survMax, groups: [newGroup(survMax), newGroup(survMax)] };
  }

  private censor(i: number): void {
    if (this.epStart[i] >= 0) {
      const g = this.tables.groups[this.role[i]];
      const d = Math.min(this.lastFrame[i] - this.epStart[i], this.tables.survMaxFrames + 1);
      g.survCens[this.epBin[i]][d]++;
    }
    this.epStart[i] = -1;
  }

  frame(frame: number, t: number, ids: number[], xs: number[], ys: number[], ins: boolean[]): void {
    const act = this.active(t);
    // (a) This frame's step per detected ant (first read of a tag in a frame only, as ActivityStats).
    const det: number[] = [];
    const px: number[] = [];
    const py: number[] = [];
    const pin: boolean[] = [];
    for (let k = 0; k < ids.length; k++) {
      const i = ids[k];
      if (this.role[i] < 0 || this.seenAt[i] === frame) continue;
      this.seenAt[i] = frame;
      let s = NONE;
      if (ins[k]) {
        const g = frame - this.lastFrame[i];
        if (this.inNest[i] && g <= BRIDGE) s = Math.hypot(xs[k] - this.x[i], ys[k] - this.y[i]) / g < STILL_MM ? STILL : MOVING;
      }
      this.newState[i] = s;
      det.push(i);
      px.push(xs[k]);
      py.push(ys[k]);
      pin.push(ins[k]);
    }
    // (b) Still ants this frame on a 4.1-mm grid.
    const R = NB_RADIUS_MM;
    const grid = new Map<number, number[]>();
    const key = (cx: number, cy: number) => cx * 4096 + cy;
    det.forEach((i, j) => {
      if (this.newState[i] !== STILL) return;
      const k = key(Math.floor(px[j] / R), Math.floor(py[j] / R));
      const b = grid.get(k);
      if (b) b.push(j);
      else grid.set(k, [j]);
    });
    // (c) Transitions over the interval that ends now, then this frame's N, state and episode bookkeeping.
    det.forEach((i, j) => {
      const r = this.role[i];
      const s = this.newState[i];
      const focal = r === 0 || r === 1;
      let N = 0;
      if (focal && s !== NONE) {
        const cx = Math.floor(px[j] / R);
        const cy = Math.floor(py[j] / R);
        for (let dx = -1; dx <= 1; dx++)
          for (let dy = -1; dy <= 1; dy++) {
            const b = grid.get(key(cx + dx, cy + dy));
            if (b) for (const o of b) if (o !== j && Math.hypot(px[o] - px[j], py[o] - py[j]) < R) N++;
          }
      }
      if (focal) {
        const G = this.tables.groups[r];
        const prev = this.state[i];
        const g = frame - this.lastFrame[i];
        if (s === NONE) {
          // Chain broken (gap, fresh or outside the nest): close any open episode at the last still frame.
          this.censor(i);
        } else {
          if (prev !== NONE && act) {
            if (prev === MOVING) {
              const b = Math.min(this.nAt[i], N_BINS - 1);
              G.stopExp[b] += g;
              G.stopCellExp[b * NB_CELLS + this.cellAt[i]] += g;
              if (s === STILL) {
                G.stopEv[b]++;
                G.stopCellEv[b * NB_CELLS + this.cellAt[i]]++;
              }
            } else {
              const b = Math.min(this.nAt[i], A_BINS - 1); // A − 1 = N
              G.leaveExp[b] += g;
              G.leaveCellExp[b * NB_CELLS + this.cellAt[i]] += g;
              if (s === MOVING) {
                G.leaveEv[b]++;
                G.leaveCellEv[b * NB_CELLS + this.cellAt[i]]++;
              }
            }
          }
          // Episodes.
          if (this.epStart[i] >= 0 && !act) this.censor(i);
          if (s === MOVING && this.epStart[i] >= 0) {
            const d = Math.min(this.lastFrame[i] - this.epStart[i], this.tables.survMaxFrames + 1);
            G.survEv[this.epBin[i]][d]++;
            this.epStart[i] = -1;
          }
          if (s === STILL && prev === MOVING && act && this.epStart[i] < 0) {
            // Bounded start: stillness begins at the last moving step's end; binned by A now.
            this.epStart[i] = this.lastFrame[i];
            this.epBin[i] = survBin(1 + N);
            G.starts[this.epBin[i]]++;
          }
        }
      }
      this.state[i] = s;
      this.nAt[i] = N;
      this.cellAt[i] = nbCell(px[j], py[j]);
      this.lastFrame[i] = frame;
      this.x[i] = px[j];
      this.y[i] = py[j];
      this.inNest[i] = pin[j] ? 1 : 0;
    });
  }

  /** Censors every open episode (end of the window). */
  finish(): NbTables {
    for (let i = 0; i < this.n; i++) if (this.role[i] === 0 || this.role[i] === 1) this.censor(i);
    return this.tables;
  }
}
