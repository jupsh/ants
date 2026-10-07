import { arrhenius } from '../core/math';
import type { ForagerAction } from '../behavior/lasiusForager';
import type { Body } from '../agent/body';
import type { WalkParams } from '../models/walk';
import { walkStep } from '../models/walk';
import type { SurfacePercept } from '../perception/types';
import type { Agent, World } from '../world/world';

/**
 * Physical capabilities of the species' workers (not decisions).
 */
export interface PhysParams {
  /** Ingestion rate of 0.6 M sucrose (µL/s) at the reference temperature. */
  intakeRate: number;
  /** Resting metabolic rate (mg sucrose-equivalent per hour per mg^0.75) at 25 °C, and the factor while walking. */
  metabolic: number;
  activeFactor: number;
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
 * Execute a forager's action for one step: walking with obstacle edges,
 * path-integration update (self-motion sense with compass error), trail
 * deposition, drinking, metabolism and water loss. All mass flows go
 * through the ledger.
 */
export function applyForagerAction(w: World, a: Agent, act: ForagerAction, per: SurfacePercept, walkP: WalkParams, phys: PhysParams, dt: number): void {
  const b = a.body;
  const m = a.mind;
  b.gasterDown = act.gasterDown;
  b.stepLen = 0;
  let walked = 0;
  if (!act.stand) {
    walked = walkStep(
      walkP,
      m.walk,
      per,
      b.rng,
      1,
      m.pi,
      (dx, dy, len) => {
        const nx = b.x + dx;
        const ny = b.y + dy;
        if (!w.apparatus.inside(nx, ny)) {
          // Edge of the surface: the ant turns along it (smallest turn that stays on the surface).
          for (let k = 1; k <= 12; k++)
            for (const sgn of [1, -1]) {
              const h = m.walk.heading + sgn * k * 0.26;
              if (w.apparatus.inside(b.x + Math.cos(h) * len, b.y + Math.sin(h) * len)) {
                m.walk.heading = h;
                return;
              }
            }
          m.walk.heading += Math.PI;
          return;
        }
        if (b.gasterDown && w.trail) {
          // Deposit along the segment in ≤ 1 mm pieces.
          const pieces = Math.max(1, Math.ceil(len));
          for (let i = 0; i < pieces; i++) {
            const f = (i + 0.5) / pieces;
            w.trail.deposit(b.x + dx * f, b.y + dy * f, phys.depositPerMm, len / pieces);
          }
        }
        b.x = nx;
        b.y = ny;
        b.heading = Math.atan2(dy, dx);
        b.stepLen += len;
        b.gait += len / (b.morph.len * 0.8);
        // Path integration: true self-motion read through a biased, noisy compass.
        const he = b.heading + m.piBias + Math.sqrt(phys.compassNoise * len) * b.rng.gauss();
        m.pi.x += Math.cos(he) * len * m.piGain;
        m.pi.y += Math.sin(he) * len * m.piGain;
      },
      act.motor,
    );
  }
  if (act.drinkFrom >= 0) drink(w, b, act.drinkFrom, phys, dt);
  metabolise(w, b, phys, walked > 0, dt);
  if (act.enterNest) a.inactive = true;
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
  const ul = Math.min(phys.intakeRate * dt * temp / visc, f.accessibleUl(), b.morph.cropCapacity - b.cropUl);
  if (ul <= 0) return;
  const s = ul * f.sugarPerUl();
  const wa = ul * f.waterPerUl();
  f.volumeUl -= ul;
  b.cropUl += ul;
  b.cropSugar += s;
  b.cropWater += wa;
  w.ledger.move('sugar', 'food', 'crop', s);
  w.ledger.move('water', 'food', 'crop', wa);
}

/**
 * Metabolism burns sugar (crop contents are absorbed first, then the
 * reserve); oxidation yields metabolic water (0.579 mg H2O per mg sucrose).
 * Cuticular water loss follows the vapour pressure deficit.
 */
function metabolise(w: World, b: Body, phys: PhysParams, active: boolean, dt: number): void {
  const rate = (phys.metabolic * Math.pow(b.morph.mass, 0.75) * arrhenius(w.tempC, 25, 0.65) * (active ? phys.activeFactor : 1)) / 3600; // mg/s
  let need = rate * dt;
  // Absorb crop sugar into the reserve when the reserve is not full.
  const room = Math.max(0, b.reserveMax - b.reserve);
  const absorb = Math.min(b.cropSugar, need + room * 0.001 * dt);
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
  const vpd = satVapourMmHg(w.tempC) * (1 - w.rh / 100);
  const loss = Math.min(b.water, ((phys.permeability * (phys.surfaceArea / 100) * vpd) / 1000 / 3600) * dt); // mg
  b.water -= loss;
  w.ledger.move('water', 'reserve', 'evaporated', loss);
  if (b.reserve <= 0 || b.water < b.waterMax * 0.6) b.alive = false;
}
