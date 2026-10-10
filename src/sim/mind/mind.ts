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
  /** In-nest workers: individual propensity to leave the nest to forage (multiplies the base rate). */
  forageDrive?: number;
}

/** Forager policy modes (outside the nest); `inNest` is the end of a trip, handed to the nest policy. */
export type ForagerMode = 'explore' | 'drink' | 'search' | 'return' | 'inNest';
/** Nest worker policy modes. */
export type NestMode = 'rest' | 'active' | 'give' | 'receive' | 'leave';
export type Mode = ForagerMode | NestMode;

/**
 * State of one foraging trip (STATUS 2026-10-10, state by lifetime):
 * replaced whole when a trip starts (`startTrip`), so nothing carries over
 * from the previous trip by accident. Between trips it is the last trip's
 * record (the nest policy reads `ingested`: did it feed on its last trip).
 */
export interface Trip {
  /** Per-trip compass bias (rad) and odometer gain. */
  piBias: number;
  piGain: number;
  /** Volume ingested on this trip (µL) and the desired volume for this trip. */
  ingested: number;
  desired: number;
  satisfied: boolean;
  /** Whether laying trail on the way home, and whether the gaster tip is down (the laying on/off process). */
  laying: boolean;
  gasterDown: boolean;
  /** Remaining area-restricted search time (s). */
  ars: number;
  /** Food being drunk on this trip (−1: none yet): the ant does not drink again at a drop it left on this trip. */
  foodId: number;
}

/** One trophallaxis bout as this ant sees it. */
export interface Bout {
  partner: number;
  /** Seconds since food last flowed. */
  stall: number;
  /** The partner has been seen sharing with this ant. */
  joined: boolean;
}

/**
 * State of one stay in the nest: replaced whole when the ant enters the
 * nest (`enterNest`), so no bout or partner memory survives a trip.
 */
export interface Stay {
  /** Current bout (modes give / receive), else null. */
  bout: Bout | null;
  /**
   * Former partners this ant has parted from and is still in antennal
   * contact with: none is shared with again until contact with it has been
   * lost (each is dropped individually; STATUS 2026-10-10).
   */
  parted: number[];
  /** Seconds since this ant last passed food to a nestmate (or since it entered). */
  sinceGive: number;
}

/** Everything an ant knows and intends. Never contains world truth. */
export interface Mind {
  traits: Traits;
  mode: Mode;
  /** Seconds spent in the current mode. */
  modeTime: number;
  walk: WalkState;
  /** Path integrator: estimated position relative to the nest entrance (mm). */
  pi: { x: number; y: number };
  /** Food site memory in PI coordinates (kept across trips). */
  site: { x: number; y: number } | null;
  /** The current (or, in the nest, the last) foraging trip. */
  trip: Trip;
  /** The current stay in the nest (meaningful in the nest modes). */
  stay: Stay;
  /** Event counters for experiments (observational, not used by behaviour). */
  log: { foundFoodAt?: number; drinkStart?: number; drinkEnd?: number; drinks: { id: number; start: number; end: number; ul: number; satisfiedAfter: boolean }[]; layingFrom?: number };
}

export function newTrip(): Trip {
  return { piBias: 0, piGain: 1, ingested: 0, desired: 1, satisfied: false, laying: false, gasterDown: false, ars: 0, foodId: -1 };
}

export function newStay(): Stay {
  return { bout: null, parted: [], sinceGive: 0 };
}

export function newMind(traits: Traits, walkP: WalkParams, rng: RNG): Mind {
  return {
    traits,
    mode: 'explore',
    modeTime: 0,
    walk: initWalkState(walkP, rng),
    pi: { x: 0, y: 0 },
    site: null,
    trip: newTrip(),
    stay: newStay(),
    log: { drinks: [] },
  };
}

/**
 * Switch mode (the clock restarts on a change). Policies call it only from
 * their mode entry functions, which set everything the mode needs.
 */
export function setMode(m: Mind, mode: Mode): void {
  if (m.mode !== mode) {
    m.mode = mode;
    m.modeTime = 0;
  }
}
