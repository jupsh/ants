import { colonyRows, InNestAccumulator, STROEYMEYT_CFG, type AntRole, type InNestColony, type Phase } from '../analysis/inNest';
import { RNG } from '../core/rng';
import { DET_D_EDGES, DET_TSB_EDGES, ObservedState, type DetectionTracker } from '../analysis/detection';
import { stroeymeytApparatus } from '../world/apparatus';
import { ColonySim, type ColonyOptions, type ColonyParams } from './colonyBles';
import { S2018_WATER } from './stroeymeytTargets';

/**
 * A Stroeymeyt et al. (2018) fit colony in its tracking box (step 4a,
 * STATUS 2026-10-11): the colony's own nurses and foragers plus the queen,
 * a fed colony, one phase (light 26 °C or dark 22 °C) at a time. Water and
 * sugar water ad libitum (STATUS 2026-10-15; removed 2026-10-11, when the
 * colony starved of water at ≈ 14.5 h); a forager's trip is
 * `exploreGiveUp` s of exploring the foraging area (drinking at a source it
 * touches with room in its crop), then homing. Observed like the recorded colonies: every 0.5 s each
 * ant's position plus white tracking noise, each detection missed
 * independently at the colony's rate, nothing seen in the hole through the
 * wall; the frames go through the same `InNestAccumulator` as the data.
 */
export interface StroeymeytColony {
  label: string;
  nurses: number;
  foragers: number;
  /** Tracking noise SD per axis (mm) and detection probability per frame, the colony's own estimates. */
  noiseSd: number;
  detection: number;
  /**
   * Recorded detection masks (observer diagnostic, STATUS 2026-10-15): per
   * ant in role order, a bitset over observed frames (bit f set: detected in
   * frame f), replacing the independent draws; frames past the end fall back
   * to them. Unset: independent misses at `detection`.
   */
  masks?: Uint8Array[];
  /**
   * Estimated detection tracker (STATUS 2026-10-15; under validation): in the
   * nest, after each detection a gap starts with probability 1 − (1 −
   * p[cell])^m (cell: the observed history, `ObservedState`; m: the ant's
   * multiplier, drawn from `mult`), lasting a duration drawn from `dProb` of
   * the onset's time-since-resumed bin;
   * outside the nest detection stays independent at `detection`. Unset:
   * independent misses everywhere. Per role (the queen uses the nurse tracker).
   */
  tracker?: { nurse: DetectionTracker; forager: DetectionTracker };
  /**
   * Sensitivity variants (STATUS 2026-10-17 ≈ 01:30 UTC): a slowly varying
   * position offset per ant, OU per axis with stationary SD `sd` (mm) and
   * correlation time `tau` (s), from its own stream (drawn only when set).
   * 'tag': at all times (a per-tag measurement error); 'rest': evolves only
   * while the ant is in rest mode, from 0 at each rest, and is kept after
   * (creep during rest, as an observed offset). Unset: none.
   */
  posDrift?: { kind: 'tag' | 'rest'; sd: number; tau: number };
  /** Observed coordinates rounded to this pixel size (mm), as the recorded positions are. Unset: not rounded. */
  pxRound?: number;
  /** Oracle colony-coupling diagnostic (STATUS 2026-10-17 ≈ 05:11 UTC; see `ColonyOptions.oracle`). Unset: none. */
  oracle?: ColonyOptions['oracle'];
  /** Pre-fix oracle behaviour, nurses only (see `ColonyOptions.oracleNurseOnly`). */
  oracleNurseOnly?: boolean;
  /** Slow-episode what-if (STATUS 2026-10-17, overnight; see `ColonyOptions.slowEp`). Unset: none. */
  slowEp?: ColonyOptions['slowEp'];
  /** Comparison Q switches (STATUS 2026-10-17 ≈ 16:19 UTC; see `ColonyOptions.wall` / `aggregate` / `site`). Unset: none. */
  wall?: ColonyOptions['wall'];
  aggregate?: ColonyOptions['aggregate'];
  site?: ColonyOptions['site'];
  /** Comparison T taxis (STATUS 2026-10-17 ≈ 22:59 UTC; see `ColonyOptions.taxis`). Unset: none. */
  taxis?: ColonyOptions['taxis'];
}

export interface StroeymeytRunOptions {
  seed: number;
  phase: Phase;
  /** Unobserved warm-up and observed time (s). */
  warmupS: number;
  obsS: number;
  dt?: number;
  /** Also report rows for the first w seconds of the observed time, for each w here (window check; each ≤ obsS). */
  windows?: number[];
  /** Seconds a forager explores the foraging area on a trip before heading home (an input, STATUS 2026-10-11); with `exploreGiveUpSd` the median of a per-trip lognormal (STATUS 2026-10-15). */
  exploreGiveUp: number;
  exploreGiveUpSd?: number;
}

export interface StroeymeytRun {
  rows: Record<string, number>;
  colony: InNestColony;
  /** Mean share of foragers in the nest over the observed frames (true positions). */
  foragersIn: number;
  /** Rows of the first w observed seconds, per `windows` entry. */
  windowRows: Record<string, number>[];
  /** Oracle (coupled): SD of the log multiplier over the steps after 30 min, NaN if none. */
  oracleLogSd?: number;
}

/**
 * Water and 10 % sugar water (≈ 0.3 M), ad libitum, at the centres of the
 * zones mapped from the authors' plume files (STATUS 2026-10-11: water x
 * 47–61, y 84–99; sugar x 9–23, y 82–99 mm). 50 µL each (radius ≈ 2.9 mm;
 * the feeders' size is not reported: estimated).
 */
export const STROEYMEYT_SOURCES = [
  { x: 54, y: 91.5, ul: 50, molar: 0, adLib: true },
  { x: 16, y: 90.5, ul: 50, molar: 0.3, adLib: true },
];

/**
 * Initial water state near the steady state of the water runs (STATUS
 * 2026-10-15, late windows, model output): foragers full with crops
 * ≈ 1.4–2.0 µL, nurses just above the thirst threshold, crops empty.
 */
export const STROEYMEYT_WATER_INIT = (thirst: number) => ({
  nurse: [thirst, thirst + 0.06] as [number, number],
  forager: [1, 1] as [number, number],
  foragerCrop: [1.4, 2.0] as [number, number],
});

/** Temperature per phase (Stroeymeyt et al. 2018: 12 h light at 26 °C, 12 h dark at 22 °C). */
export const STROEYMEYT_TEMP: Record<Phase, number> = { light: 26, dark: 22 };
/** UTC hour handed to the accumulator so the frames fall in the wanted phase. */
const PHASE_HOUR: Record<Phase, number> = { light: 12, dark: 0 };

/** Roles in index order: nurses, foragers, then the queen. */
export function stroeymeytRoles(c: StroeymeytColony): AntRole[] {
  return [...Array<AntRole>(c.nurses).fill('nurse'), ...Array<AntRole>(c.foragers).fill('forager'), 'queen'];
}

export function simulateStroeymeyt(P: ColonyParams, c: StroeymeytColony, o: StroeymeytRunOptions): StroeymeytRun {
  const roles = stroeymeytRoles(c);
  const dt = o.dt ?? 0.1;
  const sim = new ColonySim(P, {
    seed: o.seed,
    ants: roles.length,
    roles,
    setup: stroeymeytApparatus(),
    dt,
    minutes: (o.warmupS + o.obsS) / 60,
    // No timed food; the experiment's ad-libitum water and 10 % sugar water from the start (STATUS 2026-10-15).
    foodMinute: Infinity,
    sources: STROEYMEYT_SOURCES,
    // Near the water economy's steady state (STATUS 2026-10-15: from full, empty-crop starts it took ≈ 8–14 h to settle).
    // With thirst off, the same initial state at the default threshold, so paired runs start matched.
    waterInit: STROEYMEYT_WATER_INIT(P.nest.thirstFrac > 0 ? P.nest.thirstFrac : S2018_WATER.thirstFrac),
    exploreGiveUp: o.exploreGiveUp,
    exploreGiveUpSd: o.exploreGiveUpSd,
    exploreOutside: true,
    oracle: c.oracle,
    oracleNurseOnly: c.oracleNurseOnly,
    slowEp: c.slowEp,
    wall: c.wall,
    aggregate: c.aggregate,
    site: c.site,
    taxis: c.taxis,
    starvationDays: 0,
    walkSpeedFactor: 1,
    tempC: STROEYMEYT_TEMP[o.phase],
  });
  const acc = new InNestAccumulator(roles, STROEYMEYT_CFG);
  const wins = (o.windows ?? []).map((w) => ({ end: w, acc: new InNestAccumulator(roles, STROEYMEYT_CFG) }));
  const obs = roles.map((_, i) => RNG.stream(o.seed, 0x0b5e, i));
  const frameDt = STROEYMEYT_CFG.frameDt;
  const app = sim.w.apparatus;
  const ids: number[] = [];
  const xs: number[] = [];
  const ys: number[] = [];
  const ins: boolean[] = [];
  let frame = 0;
  let next = o.warmupS;
  let fIn = 0;
  let fN = 0;
  const foragers = roles.map((r, i) => (r === 'forager' ? i : -1)).filter((i) => i >= 0);
  // Tracker state per ant: missed frames left in the current gap, observed history, onset multiplier, own stream.
  const T = c.tracker;
  const trk = T ? roles.map((_, i) => RNG.stream(o.seed, 0x0b60, i)) : [];
  const D = c.posDrift;
  const drift = D ? roles.map((_, i) => RNG.stream(o.seed, 0x0d21, i)) : [];
  const dA = D ? Math.exp(-frameDt / D.tau) : 0;
  const dS = D ? D.sd * Math.sqrt(1 - dA * dA) : 0;
  const off = D ? drift.map((g) => (D.kind === 'tag' ? [g.normal(0, D.sd), g.normal(0, D.sd)] : [0, 0])) : [];
  const dev = D ? roles.map(() => [0, 0]) : [];
  const px = c.pxRound;
  const quant = (v: number) => (px ? Math.round(v / px) * px : v);
  const gapLeft = roles.map(() => 0);
  const seenState = T ? roles.map(() => new ObservedState()) : [];
  const roleTracker = (i: number) => (roles[i] === 'forager' ? T!.forager : T!.nurse);
  const mult = T ? trk.map((r, i) => roleTracker(i).mult[r.int(roleTracker(i).mult.length)]) : [];
  const drawGap = (r: RNG, dProb: number[]) => {
    let u = r.range(0, 1);
    let k = 0;
    while (k < dProb.length - 1 && u >= dProb[k]) u -= dProb[k++];
    const lo = DET_D_EDGES[k];
    const hi = Number.isFinite(DET_D_EDGES[k + 1]) ? DET_D_EDGES[k + 1] : 2 * lo;
    return lo + r.int(hi - lo);
  };
  const onStep = () => {
    // Positions after this step are at time (stepIndex × dt).
    const t = sim.stepIndex * dt;
    if (t < next - 1e-9) return;
    next += frameDt;
    ids.length = xs.length = ys.length = ins.length = 0;
    sim.w.ants.forEach((a, i) => {
      if (!a.body.alive) return;
      // The position offset evolves every frame, seen or not.
      let ox = 0;
      let oy = 0;
      if (D) {
        const u = off[i];
        const g = drift[i];
        if (D.kind === 'tag') {
          u[0] = u[0] * dA + dS * g.normal(0, 1);
          u[1] = u[1] * dA + dS * g.normal(0, 1);
        } else if (a.mind.mode === 'rest') {
          const d = dev[i];
          const n0 = d[0] * dA + dS * g.normal(0, 1);
          const n1 = d[1] * dA + dS * g.normal(0, 1);
          u[0] += n0 - d[0];
          u[1] += n1 - d[1];
          d[0] = n0;
          d[1] = n1;
        } else dev[i][0] = dev[i][1] = 0;
        [ox, oy] = u;
      }
      // A tracker gap runs on in time wherever the ant is.
      const hidden = T ? gapLeft[i] > 0 : false;
      if (hidden) gapLeft[i]--;
      const r = app.regionAt(a.body.x, a.body.y);
      // The wall hides the hole: nothing is detected in the passage.
      if (!r || r.kind === 'bridge') return;
      const rng = obs[i];
      const nx = rng.normal(0, c.noiseSd);
      const ny = rng.normal(0, c.noiseSd);
      // The draw is made either way, so the noise streams stay aligned with and without masks.
      const drawn = rng.chance(c.detection);
      const m = c.masks?.[i];
      const inNest = r.kind === 'nest';
      const seen = m && frame < m.length * 8 ? ((m[frame >> 3] >> (frame & 7)) & 1) === 1 : T && inNest ? !hidden : drawn;
      if (!seen) return;
      const X = quant(a.body.x + nx + ox);
      const Y = quant(a.body.y + ny + oy);
      if (T) {
        // As in the statistics on recorded tracks: in-nest detections advance the observed history; one outside only ends a gap.
        const s = seenState[i];
        if (inNest) {
          s.update(frame, X, Y);
          const R = roleTracker(i);
          if (trk[i].chance(1 - Math.pow(1 - R.p[s.cell()], mult[i]))) gapLeft[i] = drawGap(trk[i], R.dProb[s.cell() % DET_TSB_EDGES.length]);
        } else {
          s.lastFrame = frame;
          s.x = X;
          s.y = Y;
        }
      }
      ids.push(i);
      xs.push(X);
      ys.push(Y);
      ins.push(r.kind === 'nest');
    });
    acc.frame(frame, PHASE_HOUR[o.phase], ids.length, ids, xs, ys, ins);
    for (const w of wins) if (frame * frameDt < w.end - 1e-9) w.acc.frame(frame, PHASE_HOUR[o.phase], ids.length, ids, xs, ys, ins);
    frame++;
    for (const i of foragers) {
      const r = app.regionAt(sim.w.ants[i].body.x, sim.w.ants[i].body.y);
      if (r?.kind === 'nest') fIn++;
      fN++;
    }
  };
  while (sim.stepIndex < sim.steps) sim.step(onStep);
  const colony = acc.result();
  const res: StroeymeytRun = { rows: colonyRows(colony, STROEYMEYT_CFG), colony, foragersIn: fN ? fIn / fN : NaN, windowRows: wins.map((w) => colonyRows(w.acc.result(), STROEYMEYT_CFG)) };
  if (c.oracle?.kind === 'coupled') {
    const m = sim.oracleLogSum / sim.oracleLogN;
    res.oracleLogSd = sim.oracleLogN ? Math.sqrt(sim.oracleLogSq / sim.oracleLogN - m * m) : NaN;
  }
  return res;
}
