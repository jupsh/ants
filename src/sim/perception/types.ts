/**
 * Percepts: everything a behaviour policy is allowed to know about the world.
 *
 * The perception boundary: modules under src/sim/behavior/, src/sim/models/
 * and src/sim/mind/ may read Percepts, the ant's own Mind (memory, internal
 * state, traits) and its Interoception (physiology), but never the World.
 * This is enforced by test/architecture.test.ts.
 */
export interface SurfacePercept {
  /** Simulation time step this percept covers (s). */
  dt: number;
  /** Gravity sense: substrate inclination and in-surface downhill heading. */
  incline: number;
  downhill: number;
  /** Body temperature (°C), from the boundary-layer microclimate. */
  bodyTemp: number;
  /** Ambient light level 0..1 (0 inside a covered nest). */
  light: number;
  /** Covered, nest-odour-saturated space (inside the nest). */
  inNest: boolean;
  /**
   * Nest odour/CO2 plume near the entrance: bearing relative to the ant's
   * heading (rad) and normalised strength (≥ 1 = clearly detectable), or
   * null if below threshold.
   */
  nestCue: { bearing: number; strength: number } | null;
  /** Inside the nest: bearing (rel. to heading) towards the way out, where the world provides such a cue; else null. */
  exitCue: { bearing: number } | null;
  /** Edge of the walkable surface sensed by the antennae ahead (bearing rel. to heading), or null. */
  edge: { bearing: number } | null;
  /** Trail pheromone at the left and right antenna tips (normalised to detection threshold). */
  trailL: number;
  trailR: number;
  /** Food touched with the antennae/mouthparts (taste), or null. */
  food: FoodContact | null;
  /** Nestmates within antennal reach. */
  contacts: ContactPercept[];
}

export interface FoodContact {
  id: number;
  kind: 'sugar';
  /** Sweetness (sucrose molarity sensed by gustatory receptors). */
  molar: number;
  /** Whether liquid can still be imbibed at the mouthparts. */
  available: boolean;
}

export interface ContactPercept {
  id: number;
  /** Bearing of the nestmate relative to own heading (rad) and distance (mm). */
  bearing: number;
  dist: number;
  /** Observable cues on antennation. */
  layingTrail: boolean;
  /** The nestmate is offering food (its offering posture; STATUS 2026-10-10). */
  offering: boolean;
  /** The nestmate is soliciting food (STATUS 2026-10-10: donors offer only to soliciting ants). */
  soliciting: boolean;
  /** Heads touching face to face (the posture of trophallaxis). */
  mouthContact: boolean;
  /** The nestmate is engaged in food sharing (its trophallactic posture), and whether with me (STATUS 2026-10-10). */
  sharing: boolean;
  sharingWithMe: boolean;
}

/** The ant's sense of its own body state. */
export interface Interoception {
  /** Fat-body reserve relative to its maximum (0..1). */
  reserve: number;
  /** Crop fill (µL) and capacity (µL). */
  cropUl: number;
  cropCapacity: number;
  /** Body water relative to its maximum. */
  water: number;
  /** Own body mass (mg), as sensed through effort. */
  bodyMass: number;
  /** Liquid through the mouthparts in the last step (µL; + in, − out). */
  mouthFlow: number;
  /** Crop sensed as full (stretch; morphology `cropFullFrac`). */
  cropFull: boolean;
}

/** A percept with only the self-referential senses (open arena, no objects). */
export function basicPercept(dt: number, incline: number, downhill: number, bodyTemp: number, light = 1): SurfacePercept {
  return { dt, incline, downhill, bodyTemp, light, inNest: false, nestCue: null, exitCue: null, edge: null, trailL: 0, trailR: 0, food: null, contacts: [] };
}
