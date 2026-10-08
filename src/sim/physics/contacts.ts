import type { Body } from '../agent/body';
import { SpatialHash } from '../world/spatialHash';

/**
 * Contact geometry between ants (step 4, STATUS 2026-10-08; provisional
 * definitions, no calibration yet).
 *
 *   - Head point: 0.4 body lengths ahead of the body centre.
 *   - Antennal contact: one ant's head is within its antennal reach of the
 *     other's head or body centre (either way round).
 *   - Mouth contact: heads within 0.3 body lengths of each other and
 *     headings roughly opposed (cos Δ < −0.5), the posture of trophallaxis.
 */
export const HEAD_OFFSET = 0.4;
export const MOUTH_GAP = 0.3;

export function headPoint(b: Body): [number, number] {
  const r = HEAD_OFFSET * b.morph.len;
  return [b.x + Math.cos(b.heading) * r, b.y + Math.sin(b.heading) * r];
}

export function antennalContact(a: Body, b: Body): boolean {
  const [ax, ay] = headPoint(a);
  const [bx, by] = headPoint(b);
  const ra = a.morph.antennaReach;
  const rb = b.morph.antennaReach;
  return Math.hypot(ax - bx, ay - by) <= Math.max(ra, rb) || Math.hypot(ax - b.x, ay - b.y) <= ra || Math.hypot(bx - a.x, by - a.y) <= rb;
}

export function mouthContact(a: Body, b: Body): boolean {
  const [ax, ay] = headPoint(a);
  const [bx, by] = headPoint(b);
  return Math.hypot(ax - bx, ay - by) <= MOUTH_GAP * Math.min(a.morph.len, b.morph.len) && Math.cos(a.heading - b.heading) < -0.5;
}

/**
 * Place b face to face with a (heads MOUTH_GAP/2 body lengths apart along the
 * line between the centres), as both stand to share food. Returns false (and
 * moves nothing) if b's new position would leave the walkable surface.
 */
export function alignFaceToFace(a: Body, b: Body, inside: (x: number, y: number) => boolean): boolean {
  let dx = b.x - a.x;
  let dy = b.y - a.y;
  let d = Math.hypot(dx, dy);
  if (d < 1e-9) {
    dx = Math.cos(a.heading);
    dy = Math.sin(a.heading);
    d = 1;
  }
  const ux = dx / d;
  const uy = dy / d;
  const sep = HEAD_OFFSET * (a.morph.len + b.morph.len) + 0.5 * MOUTH_GAP * Math.min(a.morph.len, b.morph.len);
  const nx = a.x + ux * sep;
  const ny = a.y + uy * sep;
  if (!inside(nx, ny)) return false;
  a.heading = Math.atan2(uy, ux);
  b.x = nx;
  b.y = ny;
  b.heading = Math.atan2(-uy, -ux);
  return true;
}

export interface ContactPair {
  /** Indices into the body list, a < b. */
  a: number;
  b: number;
  mouth: boolean;
}

/**
 * All antennal contacts among living bodies, with a flag for mouth contact.
 * Spatial hash over the given bounds; pairs in a fixed order (by a, then b),
 * so the result does not depend on hash internals.
 */
export function detectContacts(bodies: Body[], bounds: { x0: number; y0: number; x1: number; y1: number }): ContactPair[] {
  const maxReach = Math.max(1e-6, ...bodies.map((b) => b.morph.antennaReach + b.morph.len));
  const hash = new SpatialHash(bounds.x1 - bounds.x0, bounds.y1 - bounds.y0, maxReach, bodies.length);
  const xs = bodies.map((b) => b.x - bounds.x0);
  const ys = bodies.map((b) => b.y - bounds.y0);
  hash.build(
    xs,
    ys,
    bodies.map((_, i) => i),
    bodies.length,
  );
  const out: ContactPair[] = [];
  bodies.forEach((a, i) => {
    if (!a.alive) return;
    const near: number[] = [];
    hash.query(xs[i], ys[i], maxReach, (j) => {
      if (j > i && bodies[j].alive) near.push(j);
    });
    near.sort((p, q) => p - q);
    for (const j of near) if (antennalContact(a, bodies[j])) out.push({ a: i, b: j, mouth: mouthContact(a, bodies[j]) });
  });
  return out;
}
