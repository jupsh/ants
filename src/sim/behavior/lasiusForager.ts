import type { RNG } from '../core/rng';
import { newTrip, setMode, type Mind, type Traits } from '../mind/mind';
import type { MotorMod } from '../models/walk';
import type { Interoception, SurfacePercept } from '../perception/types';

/**
 * Lasius niger forager policy (scout → drink → decide → return).
 *
 * Drinking and the trail-laying decision follow Mailleux et al.
 * (2000, 2005, 2009): each forager has an individual desired volume; the
 * per-second probability of leaving the food rises steeply as the ingested
 * volume approaches it (response-threshold function). An ant that leaves
 * because it is satiated lays a recruitment trail on the way home (unless it
 * is one of the ~10–14 % that never lay); an ant that leaves because the food
 * ran out before it reached its desired volume searches nearby for more and
 * goes home without laying trail, but starts laying as soon as further food
 * brings it to its desired volume. An ant that has reached its desired volume
 * when the food runs out counts as satiated.
 * The desired volume grows with the ant's hunger (Mailleux et al. 1999:
 * drinking times 65 → 88 → 93 s after 1 → 4 → 8 days of starvation).
 */
export interface ForagerParams {
  /** Population median desired volume (µL) for a fed ant and for a strongly starved ant. */
  desiredFed: number;
  desiredHungry: number;
  /** Reserve deficit (1 − reserve fraction) at which the hungry value is reached. */
  hungerScale: number;
  /** SD of log desired volume between individuals. */
  desiredSd: number;
  /** Maximum leaving hazard (1/s) and its steepness around the desired volume (1/µL). */
  stopHazard: number;
  stopEta: number;
  /**
   * 0: leaving hazard per second, stopHazard·σ(η(V − Vd)) (model M_a).
   * 1: leaving hazard per µL ingested, η·σ(η(V − Vd)) (Mailleux et al.'s
   * response-threshold rule, model M_b; stopHazard unused). Equivalent to the
   * published per-second form ηΔV·σ(…) at a fixed intake rate ΔV, and keeps
   * logistic-distributed stopping volumes when intake rates differ.
   */
  stopPerVolume: number;
  /**
   * 0: the satiation signal is the volume ingested (M_a, M_b).
   * 1: it grows by nominalIntake·dt for each step of successful ingestion,
   * i.e. it measures drinking time (M_d), in µL-equivalents.
   */
  satiationOnTime: number;
  /** Population mean intake rate (µL/s) used to express M_d's signal in µL-equivalents. */
  nominalIntake: number;
  /** Seconds without liquid at the mouthparts before giving up on a drop. */
  emptyPatience: number;
  /** Fraction of foragers that never lay trail. */
  neverLayFraction: number;
  /** Probability of laying trail after leaving an exhausted source before reaching the desired volume. */
  unsatisfiedLayProb: number;
  /**
   * Laying decision of an unsatisfied ant leaving an exhausted drop (step 3d,
   * STATUS 2026-10-09). 0 (unset): constant `unsatisfiedLayProb`. 1: graded
   * by how close it came to its desired volume, P = 1 / (1 + e^(−layKappa ·
   * (ingested / desired − layRatio50))).
   */
  layRule?: number;
  layKappa?: number;
  layRatio50?: number;
  /** Gaster-contact fraction while laying: population mean and SD (between individuals). */
  layIntensity: number;
  layIntensitySd: number;
  /** Mean duration of one gaster contact (s). */
  gasterBout: number;
  /** Mean duration of area-restricted search after an unsatisfying drop (s), and its tortuosity (run-length factor). */
  arsMean: number;
  arsRunScale: number;
  /**
   * Who searches after leaving an exhausted drop unsatisfied (step 3c,
   * STATUS 2026-10-09). 0 (unset): ants that decided to lay go home at once
   * (the adopted model). 1: they search too, then lay on the way home; one
   * mean. 2: as 1, with mean arsMeanLay for laying ants.
   */
  searchMode?: number;
  arsMeanLay?: number;
  /** Homing: steering gain towards the home vector (1/s) and run-length factor while homing. */
  homeGain: number;
  homeRunScale: number;
  /** Per-trip compass bias SD (rad). */
  compassBias: number;
  /** Speed loss of laden ants per unit crop load relative to body mass (speed × 1/(1 + k·load/mass)). */
  loadSlowdown: number;
  /**
   * Scouts that find nothing head home after this long exploring (s);
   * unset: never (E2, where every scout finds the drop). Provisional, used by
   * the colony runner (step 4).
   */
  exploreGiveUp?: number;
}

export interface ForagerAction {
  motor: MotorMod;
  /** Stand still this step (drinking). */
  stand: boolean;
  /** Drink from this food item. */
  drinkFrom: number;
  /** Gaster tip touching the substrate (marks trail). */
  gasterDown: boolean;
  /** Enter the nest (end of trip). */
  enterNest: boolean;
}

function logNormalMeanSd(rng: RNG, mean: number, sd: number): number {
  const s2 = Math.log(1 + (sd * sd) / (mean * mean));
  return mean * Math.exp(rng.normal(0, Math.sqrt(s2)) - s2 / 2);
}

export function drawTraits(p: ForagerParams, rng: RNG): Traits {
  return {
    desiredVolumeFactor: Math.exp(rng.normal(0, p.desiredSd)),
    neverLays: rng.chance(p.neverLayFraction),
    // Log-normal with the measured mean and SD (gaster-contact fractions are positive and right-skewed).
    layIntensity: Math.min(0.95, logNormalMeanSd(rng, p.layIntensity, p.layIntensitySd)),
  };
}

/** Population median desired volume for the ant's current hunger (interoceptive reserve level). */
export function desiredVolume(p: ForagerParams, traits: Traits, reserve: number): number {
  const h = Math.min(1, Math.max(0, (1 - reserve) / p.hungerScale));
  return (p.desiredFed + (p.desiredHungry - p.desiredFed) * h) * traits.desiredVolumeFactor;
}

// Mode entry functions (STATUS 2026-10-10): every forager transition goes through one of these.

/**
 * Start a foraging trip at the nest entrance: a fresh trip record (nothing
 * from the last trip carries over; the food site memory does), the path
 * integrator at `at` relative to the entrance (default the entrance itself),
 * exploring.
 */
export function startTrip(m: Mind, p: ForagerParams, io: Interoception, rng: RNG, at = { x: 0, y: 0 }): void {
  m.pi.x = at.x;
  m.pi.y = at.y;
  const piBias = rng.normal(0, p.compassBias);
  m.trip = { ...newTrip(), piBias, desired: desiredVolume(p, m.traits, io.reserve) };
  setMode(m, 'explore');
}

function toDrink(m: Mind, foodId: number): void {
  m.trip.foodId = foodId;
  setMode(m, 'drink');
}

function toSearch(m: Mind, ars: number): void {
  m.trip.ars = ars;
  setMode(m, 'search');
}

function toReturn(m: Mind): void {
  setMode(m, 'return');
}

/** Trip over: the ant is in the nest (the runner hands it to the nest policy via `enterNest`). */
function toInNest(m: Mind): void {
  setMode(m, 'inNest');
}

/**
 * Crop load mass per µL used by the load slowdown (E2's `loadSlowdown` was
 * fitted with it). Open (STATUS 2026-10-10): the old comment said ~1.13 mg
 * per µL of 0.6 M sucrose, the code has always used 1.08; the value is kept
 * so E2 stays as fitted.
 */
const LOAD_MG_PER_UL = 1.08;

const NONE: ForagerAction = { motor: {}, stand: false, drinkFrom: -1, gasterDown: false, enterNest: false };

export function lasiusForager(per: SurfacePercept, io: Interoception, m: Mind, p: ForagerParams, rng: RNG): ForagerAction {
  m.modeTime += per.dt;
  const homeHeading = Math.atan2(-m.pi.y, -m.pi.x);
  const piDist = Math.hypot(m.pi.x, m.pi.y);

  // Food touched while not already drinking: start drinking (scouts and homing ants alike).
  if (per.food && per.food.available && m.mode !== 'drink' && m.trip.foodId !== per.food.id) {
    toDrink(m, per.food.id);
  }

  switch (m.mode) {
    case 'explore':
      if (p.exploreGiveUp !== undefined && m.modeTime > p.exploreGiveUp) {
        m.site = null;
        toReturn(m);
        return { ...NONE };
      }
      // Outbound scouts explore without the release-point bias seen in isolated ants.
      return { ...NONE, motor: { noHomeBias: true } };

    case 'drink': {
      // Intake sensed at the mouthparts (not the net crop change, which crop absorption would reduce).
      const dV = Math.max(0, io.mouthFlow);
      m.trip.ingested += p.satiationOnTime ? (dV > 0 ? p.nominalIntake * per.dt : 0) : dV;
      const available = !!per.food && per.food.available && per.food.id === m.trip.foodId;
      // Leaving hazard: response-threshold function of the volume ingested.
      const threshold = 1 / (1 + Math.exp(-p.stopEta * (m.trip.ingested - m.trip.desired)));
      const hazard = p.stopPerVolume ? (p.stopEta * threshold * dV) / per.dt : p.stopHazard * threshold;
      // (In M_d, m.trip.ingested is the time-based signal; actual crop volume still caps intake.)
      const cropFull = io.cropFull;
      if (cropFull || rng.hazard(hazard, per.dt)) {
        // Satiated departure.
        m.trip.satisfied = true;
        m.site = { x: m.pi.x, y: m.pi.y };
        m.trip.laying = !m.traits.neverLays;
        toReturn(m);
        return { ...NONE };
      }
      if (!available) {
        if (m.modeTime > p.emptyPatience || !per.food) {
          m.site = { x: m.pi.x, y: m.pi.y };
          if (!m.trip.satisfied && m.trip.ingested >= m.trip.desired) {
            // Reached its desired volume just as the drop ran out: a satiated departure
            // (the documented rule; STATUS 2026-10-09 review, item 6).
            m.trip.satisfied = true;
            m.trip.laying = !m.traits.neverLays;
          }
          if (m.trip.satisfied) toReturn(m);
          else {
            // Some unsatisfied ants still lay trail (Mailleux et al. 2009: trail layers and
            // non-layers drank the same volume at a 0.7 µL drop).
            const pLay = p.layRule === 1 ? 1 / (1 + Math.exp(-(p.layKappa ?? 10) * (m.trip.ingested / m.trip.desired - (p.layRatio50 ?? 0.7)))) : p.unsatisfiedLayProb;
            if (!m.trip.laying && !m.traits.neverLays && rng.chance(pLay)) m.trip.laying = true;
            toSearch(m, rng.exp(p.searchMode === 2 && m.trip.laying ? (p.arsMeanLay ?? p.arsMean) : p.arsMean));
          }
        }
        return { ...NONE, stand: true };
      }
      return { ...NONE, stand: true, drinkFrom: m.trip.foodId };
    }

    case 'search': {
      // Unsatisfied: tortuous search around the last food site, then go home.
      // Ants that decided to recruit head home straight away.
      m.trip.ars -= per.dt;
      if (m.trip.ars <= 0 || (m.trip.laying && !p.searchMode)) toReturn(m);
      let goal: number | undefined;
      if (m.site) {
        const sx = m.site.x - m.pi.x;
        const sy = m.site.y - m.pi.y;
        if (Math.hypot(sx, sy) > 15) goal = Math.atan2(sy, sx);
      }
      return { ...NONE, motor: { runScale: p.arsRunScale, noHomeBias: true, goal, goalGain: goal !== undefined ? 1.5 : 0 } };
    }

    case 'return': {
      if (per.inNest) {
        toInNest(m);
        return { ...NONE, enterNest: true };
      }
      let goal = homeHeading;
      let gain = p.homeGain;
      if (per.nestCue && per.nestCue.strength >= 1) {
        goal = m.walk.heading + per.nestCue.bearing;
        gain = p.homeGain * 2;
      }
      if (piDist < 5 && !per.nestCue) gain = 0;
      // Gaster contacts: two-state process with mean on-duration gasterBout and duty cycle layIntensity.
      let gaster = false;
      if (m.trip.laying) {
        const on = m.traits.layIntensity;
        const rateOn = on / ((1 - on) * p.gasterBout);
        const rateOff = 1 / p.gasterBout;
        if (m.trip.gasterDown ? rng.hazard(rateOff, per.dt) : rng.hazard(rateOn, per.dt)) m.trip.gasterDown = !m.trip.gasterDown;
        gaster = m.trip.gasterDown;
      }
      // Laden ants walk more slowly (crop load sensed via interoception).
      const load = io.cropUl * LOAD_MG_PER_UL;
      const speedScale = 1 / (1 + (p.loadSlowdown * load) / io.bodyMass);
      return { ...NONE, motor: { goal, goalGain: gain, runScale: p.homeRunScale, noHomeBias: true, speedScale }, gasterDown: gaster };
    }

    default:
      return { ...NONE, stand: true };
  }
}
