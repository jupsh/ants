import type { RNG } from '../core/rng';
import { setMode, type Mind, type Traits } from '../mind/mind';
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
 * ran out searches nearby for more and goes home without laying trail, but
 * starts laying as soon as further food brings it to its desired volume.
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

/** Start a foraging trip (leaving the nest entrance). */
export function startTrip(m: Mind, p: ForagerParams, io: Interoception, rng: RNG): void {
  m.pi.x = 0;
  m.pi.y = 0;
  m.piBias = rng.normal(0, p.compassBias);
  m.piGain = 1;
  m.ingested = 0;
  m.satisfied = false;
  m.laying = false;
  m.desired = desiredVolume(p, m.traits, io.reserve);
  setMode(m, 'explore');
}

const NONE: ForagerAction = { motor: {}, stand: false, drinkFrom: -1, gasterDown: false, enterNest: false };

export function lasiusForager(per: SurfacePercept, io: Interoception, m: Mind, p: ForagerParams, rng: RNG): ForagerAction {
  m.modeTime += per.dt;
  const homeHeading = Math.atan2(-m.pi.y, -m.pi.x);
  const piDist = Math.hypot(m.pi.x, m.pi.y);

  // Food touched while not already drinking: start drinking (scouts and homing ants alike).
  if (per.food && per.food.available && m.mode !== 'drink' && m.foodId !== per.food.id) {
    m.foodId = per.food.id;
    m.lastCropUl = io.cropUl;
    setMode(m, 'drink');
  }

  switch (m.mode) {
    case 'explore':
      if (p.exploreGiveUp !== undefined && m.modeTime > p.exploreGiveUp) {
        m.site = null;
        setMode(m, 'return');
        return { ...NONE };
      }
      // Outbound scouts explore without the release-point bias seen in isolated ants.
      return { ...NONE, motor: { noHomeBias: true } };

    case 'drink': {
      const dV = Math.max(0, io.cropUl - m.lastCropUl);
      m.ingested += p.satiationOnTime ? (dV > 0 ? p.nominalIntake * per.dt : 0) : dV;
      m.lastCropUl = io.cropUl;
      const available = !!per.food && per.food.available && per.food.id === m.foodId;
      // Leaving hazard: response-threshold function of the volume ingested.
      const threshold = 1 / (1 + Math.exp(-p.stopEta * (m.ingested - m.desired)));
      const hazard = p.stopPerVolume ? (p.stopEta * threshold * dV) / per.dt : p.stopHazard * threshold;
      // (In M_d, m.ingested is the time-based signal; actual crop volume still caps intake.)
      const cropFull = io.cropUl >= io.cropCapacity * 0.98;
      if (cropFull || rng.hazard(hazard, per.dt)) {
        // Satiated departure.
        m.satisfied = true;
        m.site = { x: m.pi.x, y: m.pi.y };
        m.laying = !m.traits.neverLays;
        setMode(m, 'return');
        return { ...NONE };
      }
      if (!available) {
        if (m.modeTime > p.emptyPatience || !per.food) {
          m.site = { x: m.pi.x, y: m.pi.y };
          if (m.satisfied) setMode(m, 'return');
          else {
            // Some unsatisfied ants still lay trail (Mailleux et al. 2009: trail layers and
            // non-layers drank the same volume at a 0.7 µL drop).
            if (!m.laying && !m.traits.neverLays && rng.chance(p.unsatisfiedLayProb)) m.laying = true;
            m.ars = rng.exp(p.searchMode === 2 && m.laying ? (p.arsMeanLay ?? p.arsMean) : p.arsMean);
            setMode(m, 'search');
          }
        }
        return { ...NONE, stand: true };
      }
      return { ...NONE, stand: true, drinkFrom: m.foodId };
    }

    case 'search': {
      // Unsatisfied: tortuous search around the last food site, then go home.
      // Ants that decided to recruit head home straight away.
      m.ars -= per.dt;
      if (m.ars <= 0 || (m.laying && !p.searchMode)) setMode(m, 'return');
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
        setMode(m, 'inNest');
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
      if (m.laying) {
        const on = m.traits.layIntensity;
        const rateOn = on / ((1 - on) * p.gasterBout);
        const rateOff = 1 / p.gasterBout;
        if (m.gasterDown ? rng.hazard(rateOff, per.dt) : rng.hazard(rateOn, per.dt)) m.gasterDown = !m.gasterDown;
        gaster = m.gasterDown;
      }
      // Laden ants walk more slowly (crop load sensed via interoception; ~1.13 mg per µL of 0.6 M sucrose).
      const load = io.cropUl * 1.08;
      const speedScale = 1 / (1 + (p.loadSlowdown * load) / io.bodyMass);
      return { ...NONE, motor: { goal, goalGain: gain, runScale: p.homeRunScale, noHomeBias: true, speedScale }, gasterDown: gaster };
    }

    default:
      return { ...NONE, stand: true };
  }
}
