import { RNG } from '../core/rng';
import { hypot, TAU } from '../core/math';
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
 *  - turn-linked slowing: each reorientation slows the ant in proportion to
 *    the turn (a reversal nearly halts it), recovering exponentially in
 *    time; and a heading reset, with a homeward pull, when a pause starts;
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
  /**
   * Turn-linked slowing: a reorientation by Δ sets the dip state
   * u ← max(u, turnDip·(1 − cos Δ)/2); speed is v·(1 − u), and u decays with
   * time constant turnDipTau (s). turnDip ∈ [0, 0.99].
   */
  turnDip: number;
  turnDipTau: number;
  /** Heading reset when a pause starts: wrapped-Cauchy persistence (1 = no reset) and homeward pull (× homing weight). */
  stopTurnG: number;
  stopHomePull: number;
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
  turnDip: 0,
  turnDipTau: 0.25,
  stopTurnG: 1,
  stopHomePull: 0,
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
  /** Turn-linked slowing state u (speed factor 1 − u). */
  dip: number;
  /** Per-purpose random streams (see initWalkState). */
  r: WalkStreams;
}

/**
 * One stream per kind of random draw, derived per ant. A parameter change
 * that alters how many draws one process uses (more turns, more pauses)
 * leaves the other streams aligned, and the k-th turn keeps its angle, so
 * fits with common random numbers compare like with like.
 */
export interface WalkStreams {
  speed: RNG;
  distClock: RNG;
  timeClock: RNG;
  angle: RNG;
  jitter: RNG;
  pause: RNG;
  reset: RNG;
}

export function initWalkState(p: WalkParams, rng: RNG): WalkState {
  // A fixed number of draws whatever the parameters, so individual traits
  // and the stream seeds stay aligned across parameter values (common
  // random numbers): standard normals are scaled by the parameters.
  const heading = rng.angle();
  const zIndiv = rng.gauss();
  const zOu = rng.gauss();
  const zSlope = rng.gauss();
  const base = Math.floor(rng.next() * 4294967296);
  return {
    heading,
    indiv: Math.exp(p.speedSdBetween * zIndiv),
    ou: p.speedSdWithin * zOu,
    pause: 0,
    pauseClock: 0,
    slopeK: Math.exp(p.slopeSpeedKSd * zSlope - p.slopeSpeedKSd ** 2 / 2),
    dip: 0,
    r: walkStreams(base),
  };
}

function walkStreams(base: number): WalkStreams {
  const st = (k: number) => RNG.stream(base, k);
  return { speed: st(1), distClock: st(2), timeClock: st(3), angle: st(4), jitter: st(5), pause: st(6), reset: st(7) };
}

/**
 * Single-entry memos of per-step factors that are usually constant over a
 * run (slope terms at a fixed incline, the OU decay at a fixed step): the
 * same expression on the same inputs, so values are bit-identical to
 * computing them every step. Module-level, hence per worker; correctness
 * never depends on hits.
 */
class ExpMemo {
  private k = NaN;
  private x = NaN;
  private v = NaN;
  /** Math.exp(k · x). */
  at(k: number, x: number): number {
    if (k !== this.k || x !== this.x) {
      this.k = k;
      this.x = x;
      this.v = Math.exp(k * x);
    }
    return this.v;
  }
}
const pauseSlope = new ExpMemo();
const sdSlope = new ExpMemo();
const jitterSlope = new ExpMemo();
let ouT = NaN;
let ouTau = NaN;
let ouA = NaN;
let ouS = NaN;
/** OU decay over t and its innovation factor: a = e^{−t/τ}, √(1 − a²). */
function ouDecay(t: number, tau: number): void {
  if (t !== ouT || tau !== ouTau) {
    ouT = t;
    ouTau = tau;
    ouA = Math.exp(-t / tau);
    ouS = Math.sqrt(1 - ouA * ouA);
  }
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
export function walkStep(p: WalkParams, s: WalkState, per: SurfacePercept, speedScale: number, pi: { x: number; y: number }, move: MoveSink, mod?: MotorMod): number {
  // Pauses: Poisson onset and exponential duration, both placed exactly in
  // continuous time, so a pause can start and end anywhere inside a step.
  // The onset uses a unit-rate exposure clock, which stays exact if the rate
  // changes between steps. Time-based turning goes on while paused.
  const rate = p.pauseRate > 0 ? p.pauseRate * pauseSlope.at(p.slopePauseK, per.incline) : 0;
  let left = per.dt;
  let total = 0;
  while (left > 1e-12) {
    if (s.pause > 0) {
      const t = Math.min(s.pause, left);
      s.pause -= t;
      left -= t;
      turnInPlace(p, s, per, pi, t, mod);
      continue;
    }
    let t = left;
    let onset = false;
    if (rate > 0) {
      if (!(s.pauseClock > 0)) s.pauseClock = s.r.pause.exp(1);
      const untilPause = s.pauseClock / rate;
      if (untilPause < left) {
        t = untilPause;
        s.pauseClock = 0;
        onset = true;
      } else s.pauseClock -= rate * left;
    }
    total += walkFor(p, s, per, speedScale, pi, move, t, mod);
    left -= t;
    if (onset) {
      s.pause = s.r.pause.exp(p.pauseMean);
      if (p.stopTurnG < 1) resetAtStop(p, s, pi, mod);
    }
  }
  s.heading = normHeading(s.heading);
  return total;
}

/**
 * Walk without pausing for `t` seconds: speed process, steering, turning.
 * Reorientations come from a distance clock (mean free path λ) and a time
 * clock (rate turnRateTime), both scaled by the run-length modulation; with
 * turn-linked slowing the speed decays back from v(1 − u) during the
 * interval, and event positions in time and space are exact for that speed
 * course. Returns the distance walked.
 */
function walkFor(p: WalkParams, s: WalkState, per: SurfacePercept, speedScale: number, pi: { x: number; y: number }, move: MoveSink, t: number, mod?: MotorMod): number {
  // Within-individual speed fluctuation: exact OU update (the process runs while walking).
  const sdW = p.speedSdWithin * sdSlope.at(p.slopeSpeedSdK, per.incline);
  if (p.speedTau > 0) {
    ouDecay(t, p.speedTau);
    s.ou = s.ou * ouA + sdW * ouS * s.r.speed.gauss();
  }
  const slopeF = Math.max(0.05, 1 - p.slopeSpeedK * s.slopeK * per.incline);
  const v = p.speed * s.indiv * Math.exp(s.ou - (sdW * sdW) / 2) * slopeF * speedScale * (mod?.speedScale ?? 1);
  // Continuous steering towards a goal heading (first-order, exact for constant goal).
  if (mod?.goal !== undefined && mod.goalGain) {
    const err = angleDiff(mod.goal, s.heading);
    s.heading += err * (1 - Math.exp(-mod.goalGain * t));
  }
  const jitterD = p.jitter * jitterSlope.at(p.slopeJitterK, per.incline);
  const tau = p.turnDipTau;
  let left = t;
  let total = 0;
  while (left > 1e-12) {
    // Run-length modulation (geomenotaxis, homing) scales both event clocks.
    const homeW = homeWeight(p, pi, mod);
    const homeDir = homeW > 0 ? Math.atan2(-pi.y, -pi.x) : 0;
    const lambda = runLength(p, p.meanFreePath, s.heading, per, homeW, homeDir, mod);
    const toDist = s.r.distClock.exp(lambda);
    const toTime = p.turnRateTime > 0 ? s.r.timeClock.exp(lambda / p.meanFreePath / p.turnRateTime) : Infinity;
    // Distance walked x seconds into the interval, with the dip decaying from u0.
    const u0 = s.dip;
    const dist = (x: number) => (u0 > 0 ? v * (x - u0 * tau * (1 - Math.exp(-x / tau))) : v * x);
    let dt = Math.min(left, toTime);
    let event = toTime < left;
    let seg = dist(dt);
    if (toDist < seg) {
      dt = timeToWalk(v, u0, tau, toDist);
      seg = toDist;
      event = true;
    }
    // Continuous heading diffusion: per mm walked and per second.
    const jv = jitterD * seg + p.jitterTime * dt;
    if (jv > 0) s.heading += Math.sqrt(jv) * s.r.jitter.gauss();
    if (per.incline > 0 && (p.geoTorque > 0 || p.geoPolar > 0)) s.heading = geoSteer(p, s.heading, per, seg);
    move(Math.cos(s.heading) * seg, Math.sin(s.heading) * seg, seg);
    total += seg;
    left -= dt;
    if (u0 > 0) s.dip = u0 * Math.exp(-dt / tau);
    if (event) turnWithDip(p, s, reorient(p, s.heading, per, s.r.angle, homeW, homeDir));
  }
  return total;
}

/** Time needed to walk distance d at speed v(1 − u0·e^{−x/τ}) (Newton; the distance is convex in time). */
function timeToWalk(v: number, u0: number, tau: number, d: number): number {
  if (!(u0 > 0)) return d / v;
  let x = d / v;
  for (let i = 0; i < 30; i++) {
    const e = Math.exp(-x / tau);
    const step = (v * (x - u0 * tau * (1 - e)) - d) / (v * (1 - u0 * e));
    x -= step;
    if (Math.abs(step) < 1e-12 * (1 + x)) break;
  }
  return x;
}

/** Set a new heading; with turn-linked slowing the dip deepens with the size of the turn. */
function turnWithDip(p: WalkParams, s: WalkState, h: number): void {
  if (p.turnDip > 0) s.dip = Math.max(s.dip, Math.min(0.99, p.turnDip) * (1 - Math.cos(h - s.heading)) / 2);
  s.heading = h;
}

/** Heading reset when a pause starts: persistence stopTurnG, then a homeward pull. */
function resetAtStop(p: WalkParams, s: WalkState, pi: { x: number; y: number }, mod?: MotorMod): void {
  let h = s.heading + s.r.reset.wrappedCauchy(p.stopTurnG);
  const homeW = homeWeight(p, pi, mod);
  if (homeW > 0 && p.stopHomePull > 0) h += angleDiff(Math.atan2(-pi.y, -pi.x), h) * Math.min(1, p.stopHomePull * homeW);
  turnWithDip(p, s, h);
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
  const r = hypot(pi.x, pi.y);
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
 * Poisson reorientation events.
 */
function turnInPlace(p: WalkParams, s: WalkState, per: SurfacePercept, pi: { x: number; y: number }, t: number, mod?: MotorMod): void {
  // The dip decays in time; reorientations at their exact times deepen it.
  const decay = (x: number) => {
    if (s.dip > 0) s.dip *= Math.exp(-x / p.turnDipTau);
  };
  let now = 0;
  if (p.turnRateTime > 0) {
    const homeW = homeWeight(p, pi, mod);
    const homeDir = homeW > 0 ? Math.atan2(-pi.y, -pi.x) : 0;
    for (let u = s.r.timeClock.exp(1 / p.turnRateTime); u < t; u += s.r.timeClock.exp(1 / p.turnRateTime)) {
      decay(u - now);
      now = u;
      turnWithDip(p, s, reorient(p, s.heading, per, s.r.angle, homeW, homeDir));
    }
  }
  decay(t - now);
  if (p.jitterTime > 0) s.heading += Math.sqrt(p.jitterTime * t) * s.r.jitter.gauss();
}

/**
 * ((h % τ) + τ) % τ, bit for bit, without the two fmod calls in the usual
 * case 0 ≤ h < τ: there h % τ = h, and x = h + τ lies in [τ, 2τ], where
 * fmod(x, τ) = x − τ exactly (Sterbenz) unless x rounds to 2τ.
 */
function normHeading(h: number): number {
  if (h >= 0 && h < TAU) {
    const x = h + TAU;
    if (x < 2 * TAU) return x - TAU;
  }
  return ((h % TAU) + TAU) % TAU;
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
