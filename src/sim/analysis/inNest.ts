import { hypot } from '../core/math';
import { meanSd } from './compare';

/**
 * In-nest motion statistics for the Stroeymeyt et al. 2018 rows (STATUS,
 * "operational definitions", 2026-10-10). One accumulator per colony is fed
 * frame by frame with the detections of that frame, so recorded colonies
 * (streamed from the tracking files) and simulated ones (through the same
 * frame observer, missed detections included) go through identical code.
 * Units: mm, s; frames are numbered consecutively on a fixed grid.
 */
export interface InNestConfig {
  /** Frame interval (s). */
  frameDt: number;
  /** Largest frame gap that still makes a step (missing frames bridged = bridge − 1). */
  bridge: number;
  /** Stillness thresholds (mm per frame); index 0 is the primary one. */
  stillMm: number[];
  /** Detections a new zone must hold before an entry or exit counts; one stay set per value. */
  debounce: number[];
  /** An ant counts as in the nest for density if last seen there within this many frames. */
  densityHold: number;
  /** Nest floor area (cm²). */
  nestAreaCm2: number;
  /** Light phase [start, end) in UTC hours. */
  lightStartH: number;
  lightEndH: number;
  /** Durations (s) at which run survival P(run ≥ D) is reported. */
  runD: number[];
  /** Stillness window for the noise estimate: 4-frame span under this (mm). */
  noiseStillMm: number;
  /** Reads of one tag in one frame within this distance (mm) are one detection; farther apart, all are dropped. */
  dupTolMm: number;
  /** Short-stay speed (Σ path / Σ duration) over complete forager stays up to each of these durations (s); all stays too. */
  stayCutS: number[];
  /** Fewer such stays in a colony × phase than this → the short-stay speed is missing. */
  stayMinN: number;
  /** Per-ant spreads use ants with at least this much in-nest step time in the phase (s). */
  antMinS: number;
}

export const STROEYMEYT_CFG: InNestConfig = {
  frameDt: 0.5,
  bridge: 3,
  stillMm: [0.6, 0.14],
  debounce: [2, 1],
  densityHold: 20,
  nestAreaCm2: 28,
  lightStartH: 6,
  lightEndH: 18,
  runD: [1, 2, 5, 10, 30, 60, 300],
  noiseStillMm: 0.6,
  dupTolMm: 0.12,
  stayCutS: [300, 1200],
  stayMinN: 5,
  antMinS: 1800,
};

export type Group = 'nurse' | 'forager';
export type Phase = 'light' | 'dark';
export const GROUPS: Group[] = ['nurse', 'forager'];
export const PHASES: Phase[] = ['light', 'dark'];

/** Who each tracked individual is; `queen` counts for density only. */
export type AntRole = Group | 'queen';

/** Counts of complete runs by length in frames (index = frames). */
export type RunHist = number[];

export interface MotionCell {
  /** Σ step durations (s) and Σ displacements (mm). */
  time: number;
  path: number;
  /** Σ durations and Σ displacements of still steps (s, mm), per threshold. */
  stillTime: number[];
  stillPath: number[];
  /** Complete still and moving runs, per threshold. */
  runsStill: RunHist[];
  runsMove: RunHist[];
}

export interface StayCell {
  /** Complete forager stays: duration (s) and in-nest path (mm). */
  dur: number[];
  path: number[];
}

export interface InNestColony {
  motion: Record<`${Group}.${Phase}`, MotionCell>;
  /** One record per debounce value, in config order. */
  stays: Record<Phase, StayCell>[];
  density: Record<Phase, { sum: number; frames: number }>;
  /** Second- and first-difference sums of near-still positions (noise estimate). */
  noise: { n: number; d1x: number; d1y: number; d2x: number; d2y: number };
  /** Detections and detection opportunities (frames from first to last detection), workers. */
  detection: { det: number; span: number };
  /** Per ant with at least `antMinS` of in-nest steps in the phase: still fraction (primary threshold) and path speed (mm/s). */
  perAnt: Record<`${Group}.${Phase}`, { still: number[]; speed: number[] }>;
}

const NONE = 0;
const STILL = 1;
const MOVE = 2;

interface RunState {
  state: number;
  frames: number;
  /** Began at a change of state (not after a break), so its start is observed. */
  bounded: boolean;
  cell: MotionCell | null;
}

interface StayTracker {
  confirmed: number; // NONE, 1 = in, 2 = out
  cand: number;
  candCount: number;
  candFrame: number;
  candPhase: Phase;
  candCum: number;
  inside: boolean; // a stay with an observed entry is open
  entryFrame: number;
  entryPhase: Phase;
  entryCum: number;
}

interface AntState {
  role: AntRole;
  lastFrame: number;
  lastX: number;
  lastY: number;
  lastIn: boolean;
  firstFrame: number;
  det: number;
  cumPath: number;
  runs: RunState[];
  stays: StayTracker[];
  /** Recent consecutive in-nest positions for the noise estimate (frame, x, y). */
  hist: number[];
  /** Own in-nest step time, path and still time (primary threshold), per phase. */
  own: Record<Phase, { time: number; path: number; still: number }>;
}

function motionCell(k: number): MotionCell {
  return {
    time: 0,
    path: 0,
    stillTime: new Array(k).fill(0),
    stillPath: new Array(k).fill(0),
    runsStill: Array.from({ length: k }, () => []),
    runsMove: Array.from({ length: k }, () => []),
  };
}

function bump(h: RunHist, frames: number): void {
  while (h.length <= frames) h.push(0);
  h[frames]++;
}

export function phaseOf(utcHour: number, cfg: InNestConfig): Phase {
  const h = ((utcHour % 24) + 24) % 24;
  return h >= cfg.lightStartH && h < cfg.lightEndH ? 'light' : 'dark';
}

export class InNestAccumulator {
  private readonly ants: AntState[];
  private readonly out: InNestColony;
  /** Per ant in the current frame: index of its first read, and whether its reads disagree. */
  private readonly first: Int32Array;
  private readonly conflict: Uint8Array;
  /** Repeated reads: `merged` = reads beyond the first of a tag in a frame; `dropped` = tag-frames dropped because their reads disagree. */
  duplicates = { merged: 0, dropped: 0 };

  constructor(roles: AntRole[], private readonly cfg: InNestConfig = STROEYMEYT_CFG) {
    const k = cfg.stillMm.length;
    this.first = new Int32Array(roles.length).fill(-1);
    this.conflict = new Uint8Array(roles.length);
    this.ants = roles.map((role) => ({
      role,
      lastFrame: -Infinity,
      lastX: 0,
      lastY: 0,
      lastIn: false,
      firstFrame: -1,
      det: 0,
      cumPath: 0,
      runs: cfg.stillMm.map(() => ({ state: NONE, frames: 0, bounded: false, cell: null })),
      stays: cfg.debounce.map(() => ({
        confirmed: NONE, cand: NONE, candCount: 0, candFrame: 0, candPhase: 'light' as Phase, candCum: 0,
        inside: false, entryFrame: 0, entryPhase: 'light' as Phase, entryCum: 0,
      })),
      hist: [],
      own: { light: { time: 0, path: 0, still: 0 }, dark: { time: 0, path: 0, still: 0 } },
    }));
    const motion = {} as InNestColony['motion'];
    for (const g of GROUPS) for (const p of PHASES) motion[`${g}.${p}`] = motionCell(k);
    this.out = {
      motion,
      stays: cfg.debounce.map(() => ({ light: { dur: [], path: [] }, dark: { dur: [], path: [] } })),
      density: { light: { sum: 0, frames: 0 }, dark: { sum: 0, frames: 0 } },
      noise: { n: 0, d1x: 0, d1y: 0, d2x: 0, d2y: 0 },
      detection: { det: 0, span: 0 },
      perAnt: { 'nurse.light': { still: [], speed: [] }, 'nurse.dark': { still: [], speed: [] }, 'forager.light': { still: [], speed: [] }, 'forager.dark': { still: [], speed: [] } },
    };
  }

  /**
   * One frame. `ids[j]` indexes the roles given to the constructor; ants
   * not detected in this frame are simply absent. Frames must be fed in
   * increasing order; skipped frame numbers are frames nobody was seen in.
   * A tag read more than once in a frame at (nearly) the same place is one
   * detection (the tracker double-reports); reads farther apart than
   * `dupTolMm` are a misread of another tag, and all of that tag's reads in
   * the frame are dropped, as if undetected.
   */
  frame(frame: number, utcHour: number, n: number, ids: ArrayLike<number>, x: ArrayLike<number>, y: ArrayLike<number>, inNest: ArrayLike<number | boolean>): void {
    const phase = phaseOf(utcHour, this.cfg);
    const { first, conflict } = this;
    const tol = this.cfg.dupTolMm;
    for (let j = 0; j < n; j++) {
      const i = ids[j];
      const k = first[i];
      if (k < 0) first[i] = j;
      else {
        this.duplicates.merged++;
        if (hypot(x[j] - x[k], y[j] - y[k]) > tol) conflict[i] = 1;
      }
    }
    for (let j = 0; j < n; j++) {
      const i = ids[j];
      if (first[i] !== j) continue;
      if (conflict[i]) this.duplicates.dropped++;
      else this.detect(i, frame, phase, x[j], y[j], !!inNest[j]);
    }
    for (let j = 0; j < n; j++) {
      first[ids[j]] = -1;
      conflict[ids[j]] = 0;
    }
    // Density: ants last seen in the nest within the hold window (queen included).
    let count = 0;
    for (const a of this.ants) if (a.lastIn && frame - a.lastFrame <= this.cfg.densityHold) count++;
    const d = this.out.density[phase];
    d.sum += count / this.cfg.nestAreaCm2;
    d.frames++;
  }

  private detect(i: number, f: number, phase: Phase, x: number, y: number, inside: boolean): void {
    const a = this.ants[i];
    if (a.firstFrame < 0) a.firstFrame = f;
    a.det++;
    if (a.role !== 'queen') {
      const g = f - a.lastFrame;
      const step = g <= this.cfg.bridge && a.lastIn && inside;
      if (step) {
        const d = hypot(x - a.lastX, y - a.lastY);
        a.cumPath += d;
        const cell = this.out.motion[`${a.role}.${phase}`];
        const dt = g * this.cfg.frameDt;
        cell.time += dt;
        cell.path += d;
        const own = a.own[phase];
        own.time += dt;
        own.path += d;
        for (let k = 0; k < this.cfg.stillMm.length; k++) {
          const s = d / g < this.cfg.stillMm[k] ? STILL : MOVE;
          if (s === STILL) {
            cell.stillTime[k] += dt;
            cell.stillPath[k] += d;
            if (k === 0) own.still += dt;
          }
          this.runStep(a.runs[k], s, g, cell, k);
        }
      } else {
        for (const r of a.runs) this.runBreak(r);
      }
      this.noiseSample(a, f, x, y, inside);
      if (a.role === 'forager') this.staySample(a, f, phase, inside);
    }
    a.lastFrame = f;
    a.lastX = x;
    a.lastY = y;
    a.lastIn = inside;
  }

  private runStep(r: RunState, s: number, g: number, cell: MotionCell, k: number): void {
    if (r.state === s) {
      r.frames += g;
      return;
    }
    if (r.state !== NONE && r.bounded && r.cell) bump(r.state === STILL ? r.cell.runsStill[k] : r.cell.runsMove[k], r.frames);
    r.bounded = r.state !== NONE;
    r.state = s;
    r.frames = g;
    r.cell = cell;
  }

  private runBreak(r: RunState): void {
    r.state = NONE;
    r.frames = 0;
    r.bounded = false;
    r.cell = null;
  }

  private staySample(a: AntState, f: number, phase: Phase, inside: boolean): void {
    const z = inside ? 1 : 2;
    for (let k = 0; k < a.stays.length; k++) {
      const t = a.stays[k];
      if (z === t.confirmed) {
        t.cand = NONE;
        t.candCount = 0;
        continue;
      }
      if (z === t.cand) t.candCount++;
      else {
        t.cand = z;
        t.candCount = 1;
        t.candFrame = f;
        t.candPhase = phase;
        t.candCum = a.cumPath;
      }
      if (t.candCount < this.cfg.debounce[k]) continue;
      const prev = t.confirmed;
      t.confirmed = z;
      t.cand = NONE;
      t.candCount = 0;
      if (z === 1) {
        // Entry: observed only if the ant was seen outside before.
        t.inside = prev === 2;
        t.entryFrame = t.candFrame;
        t.entryPhase = t.candPhase;
        t.entryCum = t.candCum;
      } else if (t.inside) {
        const cell = this.out.stays[k][t.entryPhase];
        cell.dur.push((t.candFrame - t.entryFrame) * this.cfg.frameDt);
        cell.path.push(t.candCum - t.entryCum);
        t.inside = false;
      }
    }
  }

  private noiseSample(a: AntState, f: number, x: number, y: number, inside: boolean): void {
    const h = a.hist;
    if (!inside || (h.length && f - h[h.length - 3] !== 1)) h.length = 0;
    if (!inside) return;
    h.push(f, x, y);
    if (h.length > 15) h.splice(0, 3);
    if (h.length < 15) return;
    // Five consecutive frames, span under the stillness bound: the middle
    // three give one second difference and two first differences.
    const span = hypot(h[13] - h[1], h[14] - h[2]);
    if (span >= this.cfg.noiseStillMm) return;
    const n = this.out.noise;
    const x1 = h[4], y1 = h[5], x2 = h[7], y2 = h[8], x3 = h[10], y3 = h[11];
    n.n++;
    n.d2x += (x3 - 2 * x2 + x1) ** 2;
    n.d2y += (y3 - 2 * y2 + y1) ** 2;
    n.d1x += (x2 - x1) ** 2;
    n.d1y += (y2 - y1) ** 2;
  }

  result(): InNestColony {
    const det = this.out.detection;
    det.det = 0;
    det.span = 0;
    for (const v of Object.values(this.out.perAnt)) v.still.length = v.speed.length = 0;
    for (const a of this.ants) {
      if (a.role === 'queen' || a.firstFrame < 0) continue;
      det.det += a.det;
      det.span += a.lastFrame - a.firstFrame + 1;
      for (const p of PHASES) {
        const o = a.own[p];
        if (o.time < this.cfg.antMinS) continue;
        const v = this.out.perAnt[`${a.role}.${p}`];
        v.still.push(o.still / o.time);
        v.speed.push(o.path / o.time);
      }
    }
    return this.out;
  }
}

/** Mean, median and survival P(run ≥ D) of a run-length histogram (frames → s). */
export function runSummary(h: RunHist, frameDt: number, D: number[]): { n: number; mean: number; median: number; surv: number[] } {
  let n = 0;
  let sum = 0;
  for (let f = 0; f < h.length; f++) {
    n += h[f] || 0;
    sum += (h[f] || 0) * f;
  }
  if (!n) return { n: 0, mean: NaN, median: NaN, surv: D.map(() => NaN) };
  let acc = 0;
  let median = NaN;
  for (let f = 0; f < h.length; f++) {
    acc += h[f] || 0;
    if (acc >= n / 2) {
      median = f * frameDt;
      break;
    }
  }
  const surv = D.map((d) => {
    const fmin = Math.ceil(d / frameDt - 1e-9);
    let c = 0;
    for (let f = fmin; f < h.length; f++) c += h[f] || 0;
    return c / n;
  });
  return { n, mean: (sum / n) * frameDt, median, surv };
}

function median(v: number[]): number {
  if (!v.length) return NaN;
  const s = [...v].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/**
 * Row values of one colony, keyed by row id. Speeds in mm/s, durations in s,
 * paths in mm, density in ants/cm², noise σ in mm. Besides the frozen rows
 * (STATUS 2026-10-10 night): moving-only speed, short-stay speed, the
 * noise-floor speed and per-ant spreads (STATUS 2026-10-11).
 */
export function colonyRows(c: InNestColony, cfg: InNestConfig = STROEYMEYT_CFG): Record<string, number> {
  const r: Record<string, number> = {};
  for (const g of GROUPS) {
    for (const p of PHASES) {
      const m = c.motion[`${g}.${p}`];
      const key = `${g}.${p}`;
      r[`speed.${key}`] = m.time ? m.path / m.time : NaN;
      const ants = c.perAnt[`${g}.${p}`];
      r[`antN.${key}`] = ants.still.length;
      r[`antSd.still.${key}`] = meanSd(ants.still).sd;
      r[`antSd.speed.${key}`] = meanSd(ants.speed).sd;
      cfg.stillMm.forEach((thr, k) => {
        const tag = k === 0 ? '' : `@${thr}`;
        r[`still${tag}.${key}`] = m.time ? m.stillTime[k] / m.time : NaN;
        const moveTime = m.time - m.stillTime[k];
        r[`speedMove${tag}.${key}`] = moveTime > 0 ? (m.path - m.stillPath[k]) / moveTime : NaN;
        for (const [name, h] of [['runStill', m.runsStill[k]], ['runMove', m.runsMove[k]]] as const) {
          const s = runSummary(h, cfg.frameDt, cfg.runD);
          r[`${name}${tag}.n.${key}`] = s.n;
          r[`${name}${tag}.mean.${key}`] = s.mean;
          r[`${name}${tag}.median.${key}`] = s.median;
          cfg.runD.forEach((d, i) => (r[`${name}${tag}.P${d}.${key}`] = s.surv[i]));
        }
      });
    }
  }
  cfg.debounce.forEach((db, k) => {
    const tag = k === 0 ? '' : `@db${db}`;
    for (const p of PHASES) {
      const s = c.stays[k][p];
      r[`stay${tag}.n.${p}`] = s.dur.length;
      r[`stay${tag}.mean.${p}`] = s.dur.length ? s.dur.reduce((a, b) => a + b, 0) / s.dur.length : NaN;
      r[`stay${tag}.median.${p}`] = median(s.dur);
      r[`stay${tag}.path.${p}`] = s.path.length ? s.path.reduce((a, b) => a + b, 0) / s.path.length : NaN;
      for (const cut of [...cfg.stayCutS, Infinity]) {
        const name = `staySpeed${tag}.${cut === Infinity ? 'all' : cut}`;
        let n = 0;
        let dur = 0;
        let path = 0;
        s.dur.forEach((d, i) => {
          if (d > cut) return;
          n++;
          dur += d;
          path += s.path[i];
        });
        r[`${name}.n.${p}`] = n;
        r[`${name}.${p}`] = n >= cfg.stayMinN ? path / dur : NaN;
      }
    }
  });
  for (const p of PHASES) r[`density.${p}`] = c.density[p].frames ? c.density[p].sum / c.density[p].frames : NaN;
  const n = c.noise;
  r['noise.x'] = n.n ? Math.sqrt(n.d2x / n.n / 6) : NaN;
  r['noise.y'] = n.n ? Math.sqrt(n.d2y / n.n / 6) : NaN;
  r['noise.white'] = n.n ? (n.d1x + n.d1y) / 2 / ((n.d2x + n.d2y) / 6) : NaN;
  // Path speed of a perfectly still ant under white noise: one step's
  // displacement has per-axis SD σ√2, so its mean length is σ√π (rms σ
  // over the two axes; exact when they are equal).
  r['noise.floorSpeed'] = n.n ? (Math.sqrt(Math.PI * (r['noise.x'] ** 2 + r['noise.y'] ** 2) / 2)) / cfg.frameDt : NaN;
  r['detection'] = c.detection.span ? c.detection.det / c.detection.span : NaN;
  return r;
}

export interface RowEstimate {
  mean: number;
  se: number;
  sd: number;
  /** Colonies with a finite value. */
  n: number;
}

/** Across colonies: mean, SD and SE = SD/√n per row (colony blocks), skipping non-finite values. */
export function acrossColonies(rows: Record<string, number>[]): Record<string, RowEstimate> {
  const out: Record<string, RowEstimate> = {};
  const keys = new Set(rows.flatMap((r) => Object.keys(r)));
  for (const k of keys) {
    const v = rows.map((r) => r[k]).filter((x) => Number.isFinite(x));
    const { mean, sd, n } = meanSd(v);
    out[k] = { mean, sd, n, se: n > 1 ? sd / Math.sqrt(n) : NaN };
  }
  return out;
}
