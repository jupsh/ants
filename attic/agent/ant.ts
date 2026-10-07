import type { RNG } from '../core/rng';
import { clamp } from '../core/math';
import type { Species } from '../species';

export const enum Loc {
  Surface = 0,
  Nest = 1,
}

export type Task = 'idle' | 'forage' | 'nurse' | 'dig' | 'midden' | 'garden' | 'build' | 'patrol' | 'defend' | 'queen';
export const TASKS: Task[] = ['forage', 'nurse', 'dig', 'midden', 'garden', 'build'];

/** What an ant holds in its mandibles. */
export interface Load {
  kind: 'insect' | 'seed' | 'leaf' | 'pellet' | 'grit' | 'corpse' | 'brood' | 'protein' | 'refuse';
  mass: number; // mg
  /** Item id (surface items) or brood id. */
  ref: number;
  /** Leaf fragment area (mm²) for rendering. */
  area?: number;
}

export interface SiteMemory {
  /** Site position in the ant's path-integration frame (mm from entrance). */
  x: number;
  y: number;
  kind: string;
  fails: number;
  quality: number;
}

/**
 * A single ant. Plain mutable data; behaviour lives in src/sim/behavior.
 * Units: mm, s, mg, µL.
 */
export class Ant {
  // --- identity & morphology
  readonly id: number;
  readonly queen: boolean;
  readonly len: number; // body length, mm
  readonly mass: number; // fresh mass, mg
  /** 0..1 position in the species size range (polymorphism). */
  readonly sizeClass: number;
  readonly headScale: number; // head width relative to an isometric worker
  readonly bodyHeight: number; // mm, height of body above ground
  readonly speed28: number; // mm/s at 28 °C, unladen
  readonly carryMax: number; // mg
  readonly cropCap: number; // µL
  readonly born: number; // s
  readonly strideLen: number; // mm per gait cycle

  // --- physiology
  alive = true;
  /** Sim time at which this ant dies of old age (drawn at birth). */
  diesAt = Infinity;
  reserve: number; // mg sugar-equivalent fat body
  readonly reserveMax: number;
  cropVol = 0; // µL
  cropSugar = 0; // mg
  queenProtein = 0; // mg protein buffer (queens only)

  // --- location
  loc: Loc = Loc.Nest;
  x = 0;
  y = 0;
  z = 0;
  heading = 0;
  /** Current nest voxel. */
  voxel = -1;
  /** Voxel being walked to. */
  nextVoxel = -1;
  /** Sub-voxel offset so ants in the same voxel don't overlap. */
  jx = 0;
  jy = 0;

  // --- behaviour
  task: Task = 'idle';
  mode = 'rest';
  timer = 0;
  pause = 0;
  /** Generic target: voxel, item id, ant id or brood id depending on mode. */
  target = -1;
  /** Mode to switch to when a nest 'goto' arrives. */
  after = '';
  /** Auxiliary per-mode slot (e.g. the soil face being dug). */
  aux = -1;
  /** Mode to adopt on reaching the surface. */
  outMode = '';
  decideAt = 0;
  tripStart = 0;
  lastFoodTime = -1e9;
  load: Load | null = null;

  // --- navigation
  /** Path-integration estimate of position relative to the entrance (mm). */
  pix = 0;
  piy = 0;
  /** Per-trip systematic compass bias (rad) and odometer gain. */
  bias = 0;
  odo = 1;
  mem: SiteMemory | null = null;
  /** Systematic-search state. */
  searchPhase = 0;
  searchGamma = 0;
  searchAngle = 0;
  /** Search origin in PI frame. */
  sox = 0;
  soy = 0;
  /** Seconds remaining of area-restricted (intensified) search. */
  ars = 0;
  exploreR = 0;
  /** True while searching around a remembered site (for forgetting unrewarding sites). */
  siteVisit = false;

  // --- recruitment / communication
  recruited = false;
  /** Trail-laying intensity multiplier (0 = not laying). */
  laying = 0;
  layRepel = 0;
  distFromFood = 0;
  foodDist = 0; // distance of the source from the nest (mm)
  lostTrail = 0;
  partner = -1; // tandem partner
  riding = -1; // id of ant carrying this hitchhiker
  rider = -1; // id of hitchhiker on this ant's load
  alarm = 0; // arousal 0..1

  // --- division of labour
  /** Response thresholds per task (Bonabeau et al. 1996). */
  readonly th: Record<string, number> = {};
  tasksDone = 0;

  // --- rendering
  gait = 0;

  constructor(id: number, sp: Species, rng: RNG, born: number, len: number, queen = false) {
    this.id = id;
    this.queen = queen;
    this.born = born;
    const m = sp.morphology;
    this.len = len;
    this.sizeClass = m.lengthMax > m.lengthMin ? clamp((len - m.lengthMin) / (m.lengthMax - m.lengthMin), 0, 1) : 0.5;
    this.mass = m.massCoef * len ** 3 * (queen ? 1.6 : 1);
    const lref = (m.lengthMin + m.lengthMax) / 2;
    this.headScale = Math.pow(len / lref, m.headAllometry);
    this.bodyHeight = len * m.rideHeight;
    const lo = sp.locomotion;
    this.speed28 = lo.v28 * Math.pow(this.mass / lo.refMass, lo.massExponent) * (queen ? 0.4 : 1);
    this.carryMax = sp.foraging.carryCapacity * this.mass;
    // Crop volume scales with body volume relative to the reference worker.
    const refMass = lo.refMass;
    this.cropCap = sp.foraging.cropVolume * (this.mass / refMass) * (queen ? 2 : 1);
    this.strideLen = len * m.legRatio * 0.9;
    // Fat-body reserve: enough to survive `reserveDays` at resting metabolism.
    const restRate = (sp.physiology.metabolicRate * Math.pow(this.mass, 0.75)) / 1000 / 3600; // mg/s
    this.reserveMax = restRate * sp.physiology.reserveDays * 86400;
    this.reserve = this.reserveMax * rng.range(0.5, 0.9);
    this.jx = rng.range(-0.35, 0.35);
    this.jy = rng.range(-0.35, 0.35);
  }

  ageDays(now: number): number {
    return (now - this.born) / 86400;
  }

  get cropFill(): number {
    return this.cropCap > 0 ? this.cropVol / this.cropCap : 0;
  }

  /** Start a new foraging trip: reset PI and draw trip-level navigation errors. */
  startTrip(sp: Species, rng: RNG, now: number): void {
    this.pix = 0;
    this.piy = 0;
    this.bias = rng.normal(0, sp.navigation.compassBias);
    this.odo = Math.max(0.5, rng.normal(1, sp.navigation.odometerError));
    this.tripStart = now;
    this.lostTrail = 0;
    this.ars = 0;
    this.exploreR = rng.exp(sp.foraging.exploreRadius);
  }
}
