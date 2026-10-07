import { clamp, hill, wrapAngle } from '../core/math';
import type { Ant } from '../agent/ant';
import { loadFactor, tempSpeedFactor } from '../agent/physiology';
import type { Sim } from '../simulation';

/** Desired turning rate (rad/s) towards an absolute angle, with a proportional gain. */
export function steer(a: Ant, angle: number, gain: number): number {
  return gain * wrapAngle(angle - a.heading);
}

export interface TrailReading {
  /** Turning rate suggested by bilateral comparison (rad/s). */
  turn: number;
  /** Mean normalised trail signal at the antennae (0 = none, 1 = threshold). */
  presence: number;
}

/**
 * Osmotropotaxis (Hangartner 1967): sample attractive minus repellent trail
 * signal at the two antenna tips and turn towards the stronger side. The
 * difference is Weber-normalised by the total, so steering depends on the
 * relative, not absolute, difference.
 */
export function senseTrail(w: Sim, a: Ant): TrailReading {
  if (w.trailChannels.length === 0) return { turn: 0, presence: 0 };
  const sp = w.sp;
  const reach = a.len * (0.45 + sp.senses.antennaRatio);
  const ang = sp.senses.antennaAngle;
  const lx = a.x + Math.cos(a.heading + ang) * reach;
  const ly = a.y + Math.sin(a.heading + ang) * reach;
  const rx = a.x + Math.cos(a.heading - ang) * reach;
  const ry = a.y + Math.sin(a.heading - ang) * reach;
  // Repellent channels have negative weight and subtract on the side sensed.
  let sL = 0;
  let sR = 0;
  for (const ch of w.trailChannels) {
    sL += (ch.weight * ch.field.sample(lx, ly)) / ch.threshold;
    sR += (ch.weight * ch.field.sample(rx, ry)) / ch.threshold;
  }
  const pL = Math.max(0, sL);
  const pR = Math.max(0, sR);
  const turn = sp.senses.trailGain * ((pL - pR) / (pL + pR + 0.15)) * 2;
  return { turn, presence: (pL + pR) * 0.5 };
}

/** Probability-like strength of trail following given the trail signal. */
export function followStrength(presence: number): number {
  return hill(presence, 1, 2);
}

/**
 * Advance an ant along its heading. Applies the turn rate plus rotational
 * noise (correlated random walk), speed factors, obstacle avoidance and arena
 * bounds, updates the path integrator (with compass and odometer error), lays
 * pheromone, and advances the gait phase. Returns the distance walked.
 */
export function walk(w: Sim, a: Ant, dt: number, turn: number, noiseScale: number, speedScale = 1): number {
  const sp = w.sp;
  const temp = w.env.bodyTemp(a.bodyHeight);
  const vT = tempSpeedFactor(sp, temp);
  if (vT <= 0) return 0;
  a.heading = wrapAngle(a.heading + turn * dt + sp.locomotion.turnNoise * noiseScale * Math.sqrt(dt) * w.rng.gauss());

  let v = a.speed28 * vT * loadFactor(sp, a) * speedScale;
  // Slope: uphill slows, downhill slightly faster.
  const [gx, gy] = w.terrain.slope(a.x, a.y);
  const along = gx * Math.cos(a.heading) + gy * Math.sin(a.heading);
  v *= along > 0 ? 1 / (1 + 2.5 * along * (a.load ? 1.6 : 1)) : 1 + Math.min(0.15, -along * 0.5);
  // Cleared trunk trails (Atta) let ants walk faster.
  if (w.clearedField) v *= 1 + 0.35 * hill(w.clearedField.sample(a.x, a.y), w.clearedThreshold, 2);

  const step = v * dt;
  let nx = a.x + Math.cos(a.heading) * step;
  let ny = a.y + Math.sin(a.heading) * step;
  if (w.blocked(nx, ny)) {
    // Follow the obstacle edge: try turning either way.
    const side = w.rng.chance(0.5) ? 1 : -1;
    let ok = false;
    for (let k = 1; k <= 6 && !ok; k++)
      for (const s of [side, -side]) {
        const h = a.heading + s * k * 0.45;
        const tx = a.x + Math.cos(h) * step;
        const ty = a.y + Math.sin(h) * step;
        if (!w.blocked(tx, ty)) {
          a.heading = wrapAngle(h);
          nx = tx;
          ny = ty;
          ok = true;
          break;
        }
      }
    if (!ok) {
      a.heading = wrapAngle(a.heading + Math.PI * w.rng.range(0.6, 1.4));
      return 0;
    }
  }
  const m = 1;
  if (nx < m || ny < m || nx > w.width - m || ny > w.height - m) {
    // Arena edge: turn back inwards.
    nx = clamp(nx, m, w.width - m);
    ny = clamp(ny, m, w.height - m);
    a.heading = wrapAngle(Math.atan2(w.height / 2 - ny, w.width / 2 - nx) + w.rng.normal(0, 0.8));
  }
  const dx = nx - a.x;
  const dy = ny - a.y;
  const dist = Math.hypot(dx, dy);
  a.x = nx;
  a.y = ny;
  a.z = w.terrain.heightAt(nx, ny);

  // Path integration: heading read with compass bias + noise, distance with odometer gain.
  if (dist > 0) {
    const he = Math.atan2(dy, dx) + a.bias + w.rng.normal(0, sp.navigation.compassNoise);
    const de = dist * a.odo;
    a.pix += Math.cos(he) * de;
    a.piy += Math.sin(he) * de;
  }
  a.gait += dist / a.strideLen;
  a.distFromFood += dist;
  w.layPheromones(a, dist);
  return dist;
}

/** True distance and angle from ant to the nest entrance. */
export function toEntrance(w: Sim, a: Ant): [number, number] {
  const dx = w.ex - a.x;
  const dy = w.ey - a.y;
  return [Math.hypot(dx, dy), Math.atan2(dy, dx)];
}
