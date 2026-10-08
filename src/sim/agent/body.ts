import { RNG } from '../core/rng';

/**
 * The physical ant: position, morphology, and contents. This is world truth —
 * behaviour code never reads it directly, only through percepts and
 * interoception.
 */
export interface Morphology {
  len: number; // mm
  mass: number; // mg fresh mass (empty crop)
  cropCapacity: number; // µL
  antennaReach: number; // mm, from body centre to antenna tips
}

export class Body {
  readonly id: number;
  readonly rng: RNG;
  readonly morph: Morphology;
  alive = true;
  /** In-surface position (mm) and heading (rad). */
  x = 0;
  y = 0;
  heading = 0;
  /** Crop (social stomach) contents. */
  cropUl = 0;
  cropSugar = 0; // mg
  cropWater = 0; // mg
  /** Body energy reserve (mg sucrose-equivalent) and body water (mg). */
  reserve: number;
  reserveMax: number;
  water: number;
  waterMax: number;
  /** Whether the gaster tip is currently touching the substrate (trail marking). */
  gasterDown = false;
  /** Path walked this step (for rendering/odometry). */
  stepLen = 0;
  /** Accumulated gait phase (strides). */
  gait = 0;
  /** Individual intake-rate multiplier (pharyngeal pumping differs between workers; Mailleux et al. 2009). */
  intakeFactor = 1;

  constructor(id: number, seed: number, morph: Morphology, reserveFrac: number, reserveMax: number) {
    this.id = id;
    this.rng = RNG.stream(seed, id);
    this.morph = morph;
    this.reserveMax = reserveMax;
    this.reserve = reserveMax * reserveFrac;
    this.waterMax = morph.mass * 0.7;
    this.water = this.waterMax;
  }
}
