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
 *  - turning generated per unit time (heading diffusion and reorientation
 *    events at constant rates in time, also while paused), so slow ants
 *    turn more per mm walked and reorient at stops;
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
  /** Continuous heading diffusion per unit time (rad²/s), also while paused. */
  jitterTime: number;
  /** Reorientation events per unit time (1/s), on top of the per-distance ones; also while paused. */
  turnRateTime: number;
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
  /**
   * Continuous geomenotaxis per mm walked, scaled by sin(incline): an axial
   * torque towards the nearest end of the steepest line (rad/mm at sin θ = 1),
   * dψ/ds = −geoTorque·sin θ·sin 2ψ, and a polar torque towards downhill,
   * dψ/ds = −geoPolar·sin θ·sin ψ, with ψ the heading relative to downhill.
   */
  geoTorque: number;
  geoPolar: number;
  /** Between-individual SD of log slope sensitivity (individual slopeSpeedK = slopeSpeedK·lognormal). */
  slopeSpeedKSd: number;
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
  jitterTime: 0,
  turnRateTime: 0,
  pauseRate: 0.05,
  pauseMean: 1,
  slopeSpeedK: 0.68,
  slopePauseK: 0.8,
  slopeJitterK: 1,
  slopeSpeedSdK: 0.3,
  geoRunGain: 0.5,
  geoHeadingPull: 0.3,
  geoTorque: 0,
  geoPolar: 0,
  slopeSpeedKSd: 0,
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
  /** Remaining unit-rate exposure until the next pause starts (0 = draw a new one). */
  pauseClock: number;
  /** Individual multiplier of the slope speed loss (1 = population value). */
  slopeK: number;
}

export function initWalkState(p: WalkParams, rng: RNG): WalkState {
  return {
    heading: rng.angle(),
    indiv: Math.exp(rng.normal(0, p.speedSdBetween)),
    ou: rng.normal(0, p.speedSdWithin),
    pause: 0,
    pauseClock: 0,
    // Drawn only when used, so models without it keep their random sequence.
    slopeK: p.slopeSpeedKSd > 0 ? Math.exp(rng.normal(-(p.slopeSpeedKSd ** 2) / 2, p.slopeSpeedKSd)) : 1,
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
 * exactly along the path (memoryless exponential distances) and pauses
 * exactly in time, so the process does not depend on the integration step
 * beyond the speed being held constant within a walking interval. `pi` is the ant's
 * path-integration estimate of its position relative to its origin; it is
 * read here (homing bias) and updated by the caller through `move`.
 * Returns the distance walked.
 */
export function walkStep(p: WalkParams, s: WalkState, per: SurfacePercept, rng: RNG, speedScale: number, pi: { x: number; y: number }, move: MoveSink, mod?: MotorMod): number {
  // Pauses: Poisson onset and exponential duration, both placed exactly in
  // continuous time, so a pause can start and end anywhere inside a step.
  // The onset uses a unit-rate exposure clock, which stays exact if the rate
  // changes between steps. Time-based turning goes on while paused.
  const rate = p.pauseRate > 0 ? p.pauseRate * Math.exp(p.slopePauseK * per.incline) : 0;
  let left = per.dt;
  let total = 0;
  while (left > 1e-12) {
    if (s.pause > 0) {
      const t = Math.min(s.pause, left);
      s.pause -= t;
      left -= t;
      turnInPlace(p, s, per, rng, pi, t, mod);
      continue;
    }
    let t = left;
    let onset = false;
    if (rate > 0) {
      if (!(s.pauseClock > 0)) s.pauseClock = rng.exp(1);
      const untilPause = s.pauseClock / rate;
      if (untilPause < left) {
        t = untilPause;
        s.pauseClock = 0;
        onset = true;
      } else s.pauseClock -= rate * left;
    }
    total += walkFor(p, s, per, rng, speedScale, pi, move, t, mod);
    left -= t;
    if (onset) s.pause = rng.exp(p.pauseMean);
  }
  s.heading = ((s.heading % TAU) + TAU) % TAU;
  return total;
}

/** Walk without pausing for `t` seconds: speed process, steering, turning. Returns the distance walked. */
function walkFor(p: WalkParams, s: WalkState, per: SurfacePercept, rng: RNG, speedScale: number, pi: { x: number; y: number }, move: MoveSink, t: number, mod?: MotorMod): number {
  // Within-individual speed fluctuation: exact OU update (the process runs while walking).
  const sdW = p.speedSdWithin * Math.exp(p.slopeSpeedSdK * per.incline);
  if (p.speedTau > 0) {
    const a = Math.exp(-t / p.speedTau);
    s.ou = s.ou * a + sdW * Math.sqrt(1 - a * a) * rng.gauss();
  }
  const slopeF = Math.max(0.05, 1 - p.slopeSpeedK * s.slopeK * per.incline);
  const v = p.speed * s.indiv * Math.exp(s.ou - (sdW * sdW) / 2) * slopeF * speedScale * (mod?.speedScale ?? 1);
  // Continuous steering towards a goal heading (first-order, exact for constant goal).
  if (mod?.goal !== undefined && mod.goalGain) {
    const err = angleDiff(mod.goal, s.heading);
    s.heading += err * (1 - Math.exp(-mod.goalGain * t));
  }
  // Heading diffusion and reorientation rate per mm: per-distance terms plus
  // per-time terms converted at the current speed.
  const jitter = p.jitter * Math.exp(p.slopeJitterK * per.incline) + (v > 0 ? p.jitterTime / v : 0);
  const timeRate = v > 0 ? p.turnRateTime / v : 0;
  let remaining = v * t;
  const total = remaining;
  while (remaining > 1e-9) {
    // Run-length modulation (geomenotaxis, homing) scales the whole event rate.
    const homeW = homeWeight(p, pi, mod);
    const homeDir = homeW > 0 ? Math.atan2(-pi.y, -pi.x) : 0;
    const lambda = runLength(p, timeRate > 0 ? 1 / (1 / p.meanFreePath + timeRate) : p.meanFreePath, s.heading, per, homeW, homeDir, mod);
    const toEvent = rng.exp(lambda);
    const seg = Math.min(toEvent, remaining);
    // Continuous jitter, variance proportional to distance.
    if (jitter > 0) s.heading += Math.sqrt(jitter * seg) * rng.gauss();
    if (per.incline > 0 && (p.geoTorque > 0 || p.geoPolar > 0)) s.heading = geoSteer(p, s.heading, per, seg);
    move(Math.cos(s.heading) * seg, Math.sin(s.heading) * seg, seg);
    remaining -= seg;
    if (toEvent <= seg) s.heading = reorient(p, s.heading, per, rng, homeW, homeDir);
  }
  return total;
}

/**
 * Continuous geomenotaxis over `seg` mm, integrated exactly for each torque
 * (operator splitting): the axial term moves tan ψ by e^{−2a·seg}, the polar
 * term moves tan(ψ/2) by e^{−b·seg}.
 */
export function geoSteer(p: WalkParams, heading: number, per: SurfacePercept, seg: number): number {
  const sinI = Math.sin(per.incline);
  let psi = angleDiff(heading, per.downhill);
  if (p.geoTorque > 0) {
    // Fold onto (−π/2, π/2] around the nearest axis end, relax towards it, unfold.
    const up = Math.abs(psi) > Math.PI / 2;
    const q = up ? angleDiff(psi, Math.PI) : psi;
    const r = Math.atan(Math.tan(q) * Math.exp(-2 * p.geoTorque * sinI * seg));
    psi = up ? r + Math.PI : r;
  }
  if (p.geoPolar > 0) psi = 2 * Math.atan(Math.tan(psi / 2) * Math.exp(-p.geoPolar * sinI * seg));
  return per.downhill + psi;
}

/** Weight of the exploration homing bias at the current PI position (0 when off). */
function homeWeight(p: WalkParams, pi: { x: number; y: number }, mod?: MotorMod): number {
  const r = Math.hypot(pi.x, pi.y);
  return r > 1e-6 && !mod?.noHomeBias ? Math.exp(-r / p.homeRange) : 0;
}

/** Mean free path `base` modulated by runScale, geomenotaxis and the homing bias. */
function runLength(p: WalkParams, base: number, heading: number, per: SurfacePercept, homeW: number, homeDir: number, mod?: MotorMod): number {
  let lambda = base * (mod?.runScale ?? 1);
  if (per.incline > 0) lambda *= Math.exp(p.geoRunGain * per.incline * Math.cos(2 * (heading - per.downhill)));
  if (homeW > 0 && p.homeRunBias !== 0) lambda *= Math.exp(p.homeRunBias * homeW * Math.cos(heading - homeDir));
  return lambda;
}

/** One reorientation event: heavy-tailed turn, then the geomenotaxis and homing pulls. */
function reorient(p: WalkParams, heading: number, per: SurfacePercept, rng: RNG, homeW: number, homeDir: number): number {
  let h = heading + rng.wrappedCauchy(p.g);
  if (per.incline > 0 && p.geoHeadingPull > 0) h += angleDiff(nearestAxis(h, per.downhill), h) * Math.min(1, p.geoHeadingPull * per.incline);
  if (homeW > 0 && p.homeHeadingPull > 0) h += angleDiff(homeDir, h) * Math.min(1, p.homeHeadingPull * homeW);
  return h;
}

/**
 * Time-based turning while stationary for `t` seconds: heading diffusion and
 * Poisson reorientation events. Draws nothing when both rates are zero, so
 * models without time-based turning keep their random-number sequence.
 */
function turnInPlace(p: WalkParams, s: WalkState, per: SurfacePercept, rng: RNG, pi: { x: number; y: number }, t: number, mod?: MotorMod): void {
  if (p.turnRateTime > 0) {
    const homeW = homeWeight(p, pi, mod);
    const homeDir = homeW > 0 ? Math.atan2(-pi.y, -pi.x) : 0;
    for (let u = rng.exp(1 / p.turnRateTime); u < t; u += rng.exp(1 / p.turnRateTime)) s.heading = reorient(p, s.heading, per, rng, homeW, homeDir);
  }
  if (p.jitterTime > 0) s.heading += Math.sqrt(p.jitterTime * t) * rng.gauss();
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
