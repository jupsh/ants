import type { Body } from '../agent/body';
import type { World } from '../world/world';
import type { ContactPercept, FoodContact, Interoception, SurfacePercept } from './types';

/**
 * Build what one ant can sense right now. This module is the only bridge
 * from world truth to behaviour.
 */
export function perceive(w: World, b: Body, dt: number): SurfacePercept {
  const reach = b.morph.antennaReach;
  const region = w.apparatus.regionAt(b.x, b.y);
  const slope = w.surface.slopeAt(b.x, b.y);
  // Antenna tips ~35° either side of the body axis.
  const aL = b.heading + 0.6;
  const aR = b.heading - 0.6;
  const lx = b.x + Math.cos(aL) * reach;
  const ly = b.y + Math.sin(aL) * reach;
  const rx = b.x + Math.cos(aR) * reach;
  const ry = b.y + Math.sin(aR) * reach;
  let trailL = 0;
  let trailR = 0;
  if (w.trail) {
    trailL = w.trail.sample(lx, ly) / w.trailThreshold;
    trailR = w.trail.sample(rx, ry) / w.trailThreshold;
  }
  // Edge of the walkable surface within antennal reach.
  let edge: { bearing: number } | null = null;
  for (const rel of [0, 0.6, -0.6]) {
    const px = b.x + Math.cos(b.heading + rel) * reach;
    const py = b.y + Math.sin(b.heading + rel) * reach;
    if (!w.apparatus.inside(px, py)) {
      edge = { bearing: rel };
      break;
    }
  }
  // Food touched (sucrose is not volatile: detection is by contact/taste).
  let food: FoodContact | null = null;
  for (const f of w.food) {
    const d = Math.hypot(f.x - b.x, f.y - b.y);
    if (d <= f.radius() + reach) {
      food = { id: f.id, kind: 'sugar', molar: f.molar, available: f.accessibleUl() > 1e-6 };
      break;
    }
  }
  // Nest odour near the entrance.
  let nestCue: SurfacePercept['nestCue'] = null;
  const dx = w.entrance[0] - b.x;
  const dy = w.entrance[1] - b.y;
  const de = Math.hypot(dx, dy);
  if (de < w.nestCueRadius) nestCue = { bearing: wrap(Math.atan2(dy, dx) - b.heading), strength: w.nestCueRadius / Math.max(de, 1) };
  const contacts: ContactPercept[] = [];
  for (const o of w.ants) {
    if (o.body === b || !o.body.alive) continue;
    const ox = o.body.x - b.x;
    const oy = o.body.y - b.y;
    const d = Math.hypot(ox, oy);
    if (d <= 2 * reach) contacts.push({ id: o.body.id, bearing: wrap(Math.atan2(oy, ox) - b.heading), dist: d, layingTrail: o.body.gasterDown, carrying: o.body.cropUl > 0.2 * o.body.morph.cropCapacity });
  }
  return {
    dt,
    incline: slope.incline,
    downhill: slope.downhill,
    bodyTemp: w.tempC,
    light: region?.covered ? 0 : w.light,
    inNest: region?.kind === 'nest',
    nestCue,
    edge,
    trailL,
    trailR,
    food,
    contacts,
  };
}

export function interocept(b: Body): Interoception {
  return { reserve: b.reserve / b.reserveMax, cropUl: b.cropUl, cropCapacity: b.morph.cropCapacity, water: b.water / b.waterMax, bodyMass: b.morph.mass };
}

function wrap(a: number): number {
  a = (a + Math.PI) % (2 * Math.PI);
  if (a < 0) a += 2 * Math.PI;
  return a - Math.PI;
}
