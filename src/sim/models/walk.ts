import type { RNG } from '../core/rng';
import { TAU } from '../core/math';
import type { SurfacePercept } from '../perception/types';

/**
 * Exploratory walking motor program for an ant on a surface.
 *
 * Structure follows the Boltzmann-walker description of Lasius niger
 * (Khuong et al. 2013): straight-ish runs interrupted by reorientation events
 * that occur per distance walked (mean free path λ), with the new heading
 * drawn from a heavy-tailed phase function of mean cosine g. Added terms:
 *  - small continuous heading jitter per distance walked;
 *  - speed: per-individual mean (log-normal between ants) × an
 *    Ornstein–Uhlenbeck fluctuation within the individual, plus pauses;
 *  - substrate inclination: speed factor (independent of walking direction,
 *    as found by Khuong et al.) and geomenotaxis (longer runs and preferred
 *    new headings along the line of steepest slope);
 *  - homing bias towards the path-integration origin (Bonavita et al. 2026):
 *    runs heading away from home are shorter and new headings lean homewards.
 *
 * All stochastic terms are defined per unit distance or as continuous-time
 * processes, so statistics are independent of the integration time step.
 */
export interface WalkParams {
  /** Population median walking speed on flat ground at the reference temperature (mm/s). */
  speed: number;
  /** Between-individual SD of log speed. */
  speedSdBetween: number;
  /** Within-individual SD of log speed (stationary OU). */
  speedSdWithin: number;
  /** Correlation time of within-individual speed fluctuations (s). */
  speedTau: number;
  /** Mean free path between reorientations on flat ground (mm). */
  meanFreePath: number;
  /** Mean cosine of reorientation angles (wrapped Cauchy ρ). */
  g: number;
  /** Continuous heading diffusion (rad² per mm). */
  jitter: number;
  /** Pause rate (1/s) and mean pause duration (s). */
  pauseRate: number;
  pauseMean: number;
  /** Speed loss per radian of inclination (factor = max(floor, 1 − k·θ)). */
  slopeSpeedK: number;
  /** Log-scale increase per radian of inclination of: pause rate, fine-scale jitter, within-individual speed variability. */
  slopePauseK: number;
  slopeJitterK: number;
  slopeSpeedSdK: number;
  /** Geomenotaxis: run-length gain and new-heading pull towards the steepest line, per radian of inclination. */
  geoRunGain: number;
  geoHeadingPull: number;
  /** Homing bias: run-length modulation and new-heading pull towards the PI origin. */
  homeRunBias: number;
  homeHeadingPull: number;
  /** Distance scale (mm) over which the homing bias fades (search around the start). */
  homeRange: number;
}

/**
 * Starting values before fitting (and fallbacks for parameters added after a
 * fit was saved). Fitted values live in data/fits/e1-walk.json.
 */
export const DEFAULT_WALK: WalkParams = {
  speed: 45,
  speedSdBetween: 0.3,
  speedSdWithin: 0.4,
  speedTau: 1,
  meanFreePath: 10,
  g: 0.6,
  jitter: 0.002,
  pauseRate: 0.05,
  pauseMean: 1,
  slopeSpeedK: 0.68,
  slopePauseK: 0.8,
  slopeJitterK: 1,
  slopeSpeedSdK: 0.3,
  geoRunGain: 0.5,
  geoHeadingPull: 0.3,
  homeRunBias: 0.3,
  homeHeadingPull: 0.1,
  homeRange: 60,
};

/** Merge stored (possibly older) parameters onto the defaults. */
export function walkParams(stored: Partial<WalkParams> | undefined): WalkParams {
  return { ...DEFAULT_WALK, ...(stored ?? {}) };
}

/** Per-individual walking state kept in the ant's mind. */
export interface WalkState {
  heading: number;
  /** Individual speed multiplier (log-normal). */
  indiv: number;
  /** OU state of log-speed fluctuation. */
  ou: number;
  /** Remaining pause time (s). */
  pause: number;
}

export function initWalkState(p: WalkParams, rng: RNG): WalkState {
  return {
    heading: rng.angle(),
    indiv: Math.exp(rng.normal(0, p.speedSdBetween)),
    ou: rng.normal(0, p.speedSdWithin),
    pause: 0,
  };
}

/** Receives each straight sub-segment walked (in-surface displacement and length). */
export type MoveSink = (dx: number, dy: number, len: number) => void;

/**
 * Optional modulation of the motor program by higher-level behaviour:
 * continuous steering towards a goal heading (e.g. the home vector), a run
 * length multiplier (straighter or more tortuous walking), a speed factor,
 * and switching the exploratory homing bias off.
 */
export interface MotorMod {
  /** Absolute goal heading (rad) and steering gain (1/s). */
  goal?: number;
  goalGain?: number;
  /** Multiplies the mean free path (>1 straighter, <1 more tortuous). */
  runScale?: number;
  speedScale?: number;
  /** Disable the exploration homing bias (when other navigation is active). */
  noHomeBias?: boolean;
}

/**
 * Advance the motor program by dt and walk. Reorientation events are placed
 * exactly along the path (memoryless exponential distances), so the process
 * does not depend on the integration step. `pi` is the ant's
 * path-integration estimate of its position relative to its origin; it is
 * read here (homing bias) and updated by the caller through `move`.
 * Returns the distance walked.
 */
export function walkStep(p: WalkParams, s: WalkState, per: SurfacePercept, rng: RNG, speedScale: number, pi: { x: number; y: number }, move: MoveSink, mod?: MotorMod): number {
  const dt = per.dt;
  // Pauses (Poisson onset, exponential duration) — exact in continuous time.
  let active = dt;
  if (s.pause > 0) {
    if (s.pause >= dt) {
      s.pause -= dt;
      return 0;
    }
    active = dt - s.pause;
    s.pause = 0;
  } else if (p.pauseRate > 0 && rng.hazard(p.pauseRate * Math.exp(p.slopePauseK * per.incline), dt)) {
    s.pause = rng.exp(p.pauseMean);
    return 0;
  }
  // Within-individual speed fluctuation: exact OU update.
  const sdW = p.speedSdWithin * Math.exp(p.slopeSpeedSdK * per.incline);
  if (p.speedTau > 0) {
    const a = Math.exp(-dt / p.speedTau);
    s.ou = s.ou * a + sdW * Math.sqrt(1 - a * a) * rng.gauss();
  }
  const slopeF = Math.max(0.05, 1 - p.slopeSpeedK * per.incline);
  const v = p.speed * s.indiv * Math.exp(s.ou - (sdW * sdW) / 2) * slopeF * speedScale * (mod?.speedScale ?? 1);
  // Continuous steering towards a goal heading (first-order, exact for constant goal).
  if (mod?.goal !== undefined && mod.goalGain) {
    const err = angleDiff(mod.goal, s.heading);
    s.heading += err * (1 - Math.exp(-mod.goalGain * active));
  }
  const jitter = p.jitter * Math.exp(p.slopeJitterK * per.incline);
  let remaining = v * active;
  const total = remaining;
  while (remaining > 1e-9) {
    // Run-length modulation: geomenotaxis and homing bias.
    let lambda = p.meanFreePath * (mod?.runScale ?? 1);
    if (per.incline > 0) lambda *= Math.exp(p.geoRunGain * per.incline * Math.cos(2 * (s.heading - per.downhill)));
    const r = Math.hypot(pi.x, pi.y);
    const homeW = r > 1e-6 && !mod?.noHomeBias ? Math.exp(-r / p.homeRange) : 0;
    const homeDir = homeW > 0 ? Math.atan2(-pi.y, -pi.x) : 0;
    if (homeW > 0 && p.homeRunBias !== 0) lambda *= Math.exp(p.homeRunBias * homeW * Math.cos(s.heading - homeDir));
    const toEvent = rng.exp(lambda);
    const seg = Math.min(toEvent, remaining);
    // Continuous jitter, variance proportional to distance.
    if (jitter > 0) s.heading += Math.sqrt(jitter * seg) * rng.gauss();
    move(Math.cos(s.heading) * seg, Math.sin(s.heading) * seg, seg);
    remaining -= seg;
    if (toEvent <= seg) {
      let h = s.heading + rng.wrappedCauchy(p.g);
      if (per.incline > 0 && p.geoHeadingPull > 0) h += angleDiff(nearestAxis(h, per.downhill), h) * Math.min(1, p.geoHeadingPull * per.incline);
      if (homeW > 0 && p.homeHeadingPull > 0) h += angleDiff(homeDir, h) * Math.min(1, p.homeHeadingPull * homeW);
      s.heading = h;
    }
  }
  s.heading = ((s.heading % TAU) + TAU) % TAU;
  return total;
}

function angleDiff(a: number, b: number): number {
  let d = (a - b) % TAU;
  if (d > Math.PI) d -= TAU;
  if (d < -Math.PI) d += TAU;
  return d;
}

function nearestAxis(h: number, downhill: number): number {
  return Math.cos(h - downhill) >= 0 ? downhill : downhill + Math.PI;
}
