import type { RNG } from '../core/rng';
import { initWalkState, type WalkParams, type WalkState } from '../models/walk';

/**
 * Individual traits: fixed for life, drawn at birth from population
 * distributions (e.g. each Lasius niger forager has its own desired crop
 * volume, constant across trips — Mailleux et al. 2005).
 */
export interface Traits {
  /** Relative desired volume (multiplies the hunger-dependent population threshold). */
  desiredVolumeFactor: number;
  /** This individual never lays trail (Mailleux et al. 2005: ~14 % of foragers). */
  neverLays: boolean;
  /** Mean fraction of time the gaster touches the ground while laying trail. */
  layIntensity: number;
}

/** Everything an ant knows and intends. Never contains world truth. */
export interface Mind {
  traits: Traits;
  mode: string;
  /** Seconds spent in the current mode. */
  modeTime: number;
  walk: WalkState;
  /** Path integrator: estimated position relative to the nest entrance (mm). */
  pi: { x: number; y: number };
  /** Per-trip compass bias (rad) and odometer gain. */
  piBias: number;
  piGain: number;
  /** Volume ingested on this trip (µL) and the desired volume for this trip. */
  ingested: number;
  desired: number;
  satisfied: boolean;
  /** Whether currently laying trail on the way home. */
  laying: boolean;
  /** Food site memory in PI coordinates. */
  site: { x: number; y: number } | null;
  /** Remaining area-restricted search time (s). */
  ars: number;
  /** Food currently being drunk, and crop volume when last checked (to sense intake). */
  foodId: number;
  lastCropUl: number;
  /** Gaster tip currently lowered for marking. */
  gasterDown: boolean;
  /** Event counters for experiments (observational, not used by behaviour). */
  log: { foundFoodAt?: number; drinkStart?: number; drinkEnd?: number; drinks: { id: number; start: number; end: number; ul: number; satisfiedAfter: boolean }[]; layingFrom?: number };
}

export function newMind(traits: Traits, walkP: WalkParams, rng: RNG): Mind {
  return {
    traits,
    mode: 'explore',
    modeTime: 0,
    walk: initWalkState(walkP, rng),
    pi: { x: 0, y: 0 },
    piBias: 0,
    piGain: 1,
    ingested: 0,
    desired: 1,
    satisfied: false,
    laying: false,
    site: null,
    ars: 0,
    foodId: -1,
    lastCropUl: 0,
    gasterDown: false,
    log: { drinks: [] },
  };
}

export function setMode(m: Mind, mode: string): void {
  if (m.mode !== mode) {
    m.mode = mode;
    m.modeTime = 0;
  }
}
