import { arrhenius } from '../core/math';
import type { ForagerAction } from '../behavior/lasiusForager';
import type { Body } from '../agent/body';
import type { MotorMod, WalkParams } from '../models/walk';
import { walkStep } from '../models/walk';
import type { SurfacePercept } from '../perception/types';
import type { Agent, World } from '../world/world';

/**
 * Physical capabilities of the species' workers (not decisions).
 */
export interface PhysParams {
  /** Ingestion rate of 0.6 M sucrose (µL/s) at the reference temperature. */
  intakeRate: number;
  /** SD of log individual intake rate (mean-preserving log-normal multiplier). */
  intakeSd: number;
  /**
   * Fast initial uptake (step 3c candidate I1, STATUS 2026-10-09): the first
   * boutFastUl µL of each drinking bout are taken in at boutFastRate (µL/s),
   * then the ant's own rate. Unset or 0: constant rate (the adopted model).
   */
  boutFastUl?: number;
  boutFastRate?: number;
  /** Resting metabolic rate (mg sucrose-equivalent per hour per mg^0.75) at 25 °C, and the factor while walking. */
  metabolic: number;
  activeFactor: number;
  /**
   * Crop → reserve transfer beyond the metabolic need: first-order emptying,
   * fraction of the crop's sugar per s, limited by the reserve room. One rule
   * everywhere, in and out of the nest. Unset: 0.
   */
  cropAbsorption?: number;
  /** Cuticular water permeability (µg cm⁻² h⁻¹ mmHg⁻¹) and body surface area (mm²). */
  permeability: number;
  surfaceArea: number;
  /** Trail pheromone deposited per mm of gaster contact (units/mm). */
  depositPerMm: number;
  /** PI noise: heading-reading variance per mm walked (rad²/mm). */
  compassNoise: number;
}

/** Saturation vapour pressure (mmHg) at T °C (Magnus–Tetens). */
export function satVapourMmHg(t: number): number {
  return 4.5808 * Math.exp((17.27 * t) / (t + 237.3));
}

/**
 * The motor program that turns an intended movement into a path. The
 * adopted E1 walker (`walkStep`) by default; replaceable (step 4 uses the
 * walker provisionally, STATUS 2026-10-08), same signature as walkStep.
 */
export type MotorFn = typeof walkStep;

/**
 * Execute a forager's action for one step: walking with obstacle edges,
 * path-integration update (self-motion sense with compass error), trail
 * deposition, drinking, metabolism and water loss. All mass flows go
 * through the ledger.
 */
export function applyForagerAction(w: World, a: Agent, act: ForagerAction, per: SurfacePercept, walkP: WalkParams, phys: PhysParams, dt: number, motor: MotorFn = walkStep): void {
  const b = a.body;
  b.gasterDown = act.gasterDown;
  b.stepLen = 0;
  b.mouthFlow = 0;
  const walked = act.stand ? 0 : walkAnt(w, a, per, walkP, phys, act.motor, motor);
  if (act.drinkFrom >= 0) drink(w, b, act.drinkFrom, phys, dt);
  else b.boutUl = 0;
  metabolise(w, b, phys, walked > 0, dt);
  if (act.enterNest) a.inactive = true;
}

/**
 * Walk one step with the motor program: edges of the surface turn the ant
 * along them, trail is deposited where the gaster touches, and path
 * integration reads the true self-motion through a biased, noisy compass.
 * Returns the path length walked (mm).
 */
export function walkAnt(w: World, a: Agent, per: SurfacePercept, walkP: WalkParams, phys: PhysParams, mod: MotorMod, motor: MotorFn = walkStep): number {
  const b = a.body;
  const m = a.mind;
  return motor(
    walkP,
    m.walk,
    per,
    1,
    m.pi,
    (dx0, dy0, len0) => {
      // Walk the segment in ≤ 0.5 mm pieces, up to the edge of the surface:
      // checking only the end point let long steps jump the 4 mm wall
      // between the Bles nest and its foraging area, or cut corners. At an
      // edge the ant turns along it and walks the rest of the segment on the
      // new heading (STATUS 2026-10-10 night: dropping the rest made the
      // speed near walls depend on dt).
      let dx = dx0;
      let dy = dy0;
      let len = len0;
      for (let turns = 0; len > 1e-12 && turns <= 8; turns++) {
        const x0 = b.x;
        const y0 = b.y;
        const pieces = Math.max(1, Math.ceil(len / 0.5));
        let done = 0;
        while (done < pieces && w.apparatus.inside(x0 + (dx * (done + 1)) / pieces, y0 + (dy * (done + 1)) / pieces)) done++;
        const f = done / pieces;
        const walked = len * f;
        if (walked > 0) {
          if (b.gasterDown && w.trail) {
            // Deposit along the walked part in ≤ 1 mm pieces.
            const n = Math.max(1, Math.ceil(walked));
            for (let i = 0; i < n; i++) {
              const g = ((i + 0.5) / n) * f;
              w.trail.deposit(x0 + dx * g, y0 + dy * g, phys.depositPerMm, walked / n);
            }
          }
          b.x = x0 + dx * f;
          b.y = y0 + dy * f;
          b.heading = Math.atan2(dy, dx);
          b.stepLen += walked;
          b.gait += walked / (b.morph.len * 0.8);
          // Path integration: true self-motion read through a biased, noisy compass.
          const he = b.heading + m.trip.piBias + Math.sqrt(phys.compassNoise * walked) * b.rng.gauss();
          m.pi.x += Math.cos(he) * walked * m.trip.piGain;
          m.pi.y += Math.sin(he) * walked * m.trip.piGain;
        }
        if (done === pieces) return;
        // Edge of the surface: the ant turns along it (smallest turn whose next 0.5 mm stays on the surface).
        len -= walked;
        let turned = false;
        for (let k = 1; k <= 12 && !turned; k++)
          for (const sgn of [1, -1]) {
            const h = m.walk.heading + sgn * k * 0.26;
            if (w.apparatus.inside(b.x + Math.cos(h) * 0.5, b.y + Math.sin(h) * 0.5)) {
              m.walk.heading = h;
              turned = true;
              break;
            }
          }
        if (!turned) m.walk.heading += Math.PI;
        dx = Math.cos(m.walk.heading) * len;
        dy = Math.sin(m.walk.heading) * len;
      }
    },
    mod,
  );
}

function drink(w: World, b: Body, foodId: number, phys: PhysParams, dt: number): void {
  const f = w.food.find((x) => x.id === foodId);
  if (!f) return;
  // The ant keeps its mouthparts on the drop surface as the drop shrinks.
  const dx = b.x - f.x;
  const dy = b.y - f.y;
  const d = Math.hypot(dx, dy) || 1;
  const stand = f.radius() + b.morph.len * 0.35;
  if (d > stand) {
    b.x = f.x + (dx / d) * stand;
    b.y = f.y + (dy / d) * stand;
  }
  // Intake scales inversely with viscosity relative to 0.6 M (sucrose viscosity rises ~exponentially with concentration).
  const visc = Math.exp(1.05 * (f.molar - 0.6));
  const temp = arrhenius(w.tempC, 22, 0.3);
  let want = phys.intakeRate * b.intakeFactor * dt * temp / visc;
  const fast = phys.boutFastUl ?? 0;
  if (fast > 0 && b.boutUl < fast) {
    // Fast phase up to boutFastUl, then the ant's own rate for the rest of the step.
    const fastRate = (phys.boutFastRate ?? 0.05) * temp / visc;
    const tFast = Math.min(dt, (fast - b.boutUl) / fastRate);
    want = fastRate * tFast + phys.intakeRate * b.intakeFactor * (dt - tFast) * temp / visc;
  }
  const ul = Math.min(want, f.accessibleUl(), b.morph.cropCapacity - b.cropUl);
  if (ul <= 0) return;
  b.boutUl += ul;
  const s = ul * f.sugarPerUl();
  const wa = ul * f.waterPerUl();
  f.volumeUl -= ul;
  b.cropUl += ul;
  b.cropSugar += s;
  b.cropWater += wa;
  b.mouthFlow += ul;
  w.ledger.move('sugar', 'food', 'crop', s);
  w.ledger.move('water', 'food', 'crop', wa);
}

/**
 * Metabolism burns sugar (crop contents are absorbed first, then the
 * reserve); oxidation yields metabolic water (0.579 mg H2O per mg sucrose).
 * Cuticular water loss follows the vapour pressure deficit.
 */
/** Per-(mass, temperature, humidity) constants of metabolism; recomputed only when they change. */
const metaCache = { mass: NaN, tempC: NaN, rh: NaN, massTemp: 0, vpd: 0 };

export function metabolise(w: World, b: Body, phys: PhysParams, active: boolean, dt: number): void {
  const c = metaCache;
  if (c.mass !== b.morph.mass || c.tempC !== w.tempC || c.rh !== w.rh) {
    c.mass = b.morph.mass;
    c.tempC = w.tempC;
    c.rh = w.rh;
    c.massTemp = Math.pow(b.morph.mass, 0.75) * arrhenius(w.tempC, 25, 0.65);
    c.vpd = satVapourMmHg(w.tempC) * (1 - w.rh / 100);
  }
  const rate = (phys.metabolic * c.massTemp * (active ? phys.activeFactor : 1)) / 3600; // mg/s
  let need = rate * dt;
  // Crop → reserve: the metabolic need, plus first-order emptying of the crop (cropAbsorption × crop contents) up to the reserve room.
  const room = Math.max(0, b.reserveMax - b.reserve);
  const absorb = Math.min(b.cropSugar, need + Math.min(room, b.cropSugar * (phys.cropAbsorption ?? 0) * dt));
  if (absorb > 0) {
    const frac = absorb / b.cropSugar;
    const wa = b.cropWater * frac;
    b.cropSugar -= absorb;
    b.cropWater -= wa;
    b.cropUl -= b.cropUl * frac;
    b.reserve += absorb;
    b.water += wa;
    w.ledger.move('sugar', 'crop', 'reserve', absorb);
    w.ledger.move('water', 'crop', 'reserve', wa);
  }
  need = Math.min(need, b.reserve);
  b.reserve -= need;
  w.ledger.move('sugar', 'reserve', 'respired', need);
  const metabolicWater = need * 0.579;
  b.water += metabolicWater;
  w.ledger.move('water', 'external', 'reserve', metabolicWater);
  // Evaporation.
  const vpd = c.vpd;
  const loss = Math.min(b.water, ((phys.permeability * (phys.surfaceArea / 100) * vpd) / 1000 / 3600) * dt); // mg
  b.water -= loss;
  w.ledger.move('water', 'reserve', 'evaporated', loss);
  if (b.reserve <= 0 || b.water < b.waterMax * 0.6) b.alive = false;
}
