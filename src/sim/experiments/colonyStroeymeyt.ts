import { colonyRows, InNestAccumulator, STROEYMEYT_CFG, type AntRole, type InNestColony, type Phase } from '../analysis/inNest';
import { RNG } from '../core/rng';
import { stroeymeytApparatus } from '../world/apparatus';
import { ColonySim, type ColonyParams } from './colonyBles';

/**
 * A Stroeymeyt et al. (2018) fit colony in its tracking box (step 4a,
 * STATUS 2026-10-11): the colony's own nurses and foragers plus the queen,
 * a fed colony, one phase (light 26 °C or dark 22 °C) at a time. No sugar
 * drop (STATUS 2026-10-11: feeding does not reach the in-nest rows of a fed
 * colony without sharing, and the drop cut trips short): a forager's trip
 * is `exploreGiveUp` s of exploring the foraging area, then homing. Observed like the recorded colonies: every 0.5 s each
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
  /** Seconds a forager explores the foraging area on a trip before heading home (an input, STATUS 2026-10-11). */
  exploreGiveUp: number;
}

export interface StroeymeytRun {
  rows: Record<string, number>;
  colony: InNestColony;
  /** Mean share of foragers in the nest over the observed frames (true positions). */
  foragersIn: number;
  /** Rows of the first w observed seconds, per `windows` entry. */
  windowRows: Record<string, number>[];
}

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
    // No food in this set-up (never added within the run).
    foodMinute: Infinity,
    exploreGiveUp: o.exploreGiveUp,
    exploreOutside: true,
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
  const onStep = () => {
    // Positions after this step are at time (stepIndex × dt).
    const t = sim.stepIndex * dt;
    if (t < next - 1e-9) return;
    next += frameDt;
    ids.length = xs.length = ys.length = ins.length = 0;
    sim.w.ants.forEach((a, i) => {
      if (!a.body.alive) return;
      const r = app.regionAt(a.body.x, a.body.y);
      // The wall hides the hole: nothing is detected in the passage.
      if (!r || r.kind === 'bridge') return;
      const rng = obs[i];
      const nx = rng.normal(0, c.noiseSd);
      const ny = rng.normal(0, c.noiseSd);
      if (!rng.chance(c.detection)) return;
      ids.push(i);
      xs.push(a.body.x + nx);
      ys.push(a.body.y + ny);
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
  return { rows: colonyRows(colony, STROEYMEYT_CFG), colony, foragersIn: fN ? fIn / fN : NaN, windowRows: wins.map((w) => colonyRows(w.acc.result(), STROEYMEYT_CFG)) };
}
