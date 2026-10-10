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
  /** Crop fill (fraction of capacity) at which the crop is sensed as full (stretch); one definition for every policy. */
  cropFullFrac: number;
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
  /** Head-point cache (physics/contacts.ts), valid while x, y and heading equal the key. */
  headX = 0;
  headY = 0;
  headKeyX = NaN;
  headKeyY = NaN;
  headKeyH = NaN;
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
  /** Offering food to nestmates (set from the ant's action; sensed by nestmates in antennal contact). */
  offering = false;
  /** Soliciting food from nestmates (set from the ant's action; sensed by nestmates in antennal contact). */
  soliciting = false;
  /** Nestmate this ant is sharing food with, or −1 (set from the ant's action; sensed by nestmates in antennal contact). */
  sharingWith = -1;
  /** Path walked this step (for rendering/odometry). */
  stepLen = 0;
  /** Accumulated gait phase (strides). */
  gait = 0;
  /**
   * Liquid that passed the mouthparts this step (µL; + taken in by drinking
   * or receiving, − given away). Physics sets it; interoception reports it.
   */
  mouthFlow = 0;
  /** Individual intake-rate multiplier (pharyngeal pumping differs between workers; Mailleux et al. 2009). */
  intakeFactor = 1;
  /** Volume taken in during the current drinking bout (µL; 0 when not drinking). */
  boutUl = 0;

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
