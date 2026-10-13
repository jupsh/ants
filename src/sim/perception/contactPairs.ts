import { antennalBound, antennalContact, mouthContact } from '../physics/contacts';
import type { World } from '../world/world';
import type { ContactPercept } from './types';

/** One pair's geometry, valid while both bodies keep the recorded positions and headings. */
interface PairGeometry {
  ax: number;
  ay: number;
  ah: number;
  bx: number;
  by: number;
  bh: number;
  contact: boolean;
  mouth: boolean;
  dist: number;
  bearingA: number;
  bearingB: number;
}

/**
 * Geometry of candidate pairs from earlier steps (most nest ants stand still
 * for long spells), keyed by the pair's ant indices. An entry is reused only
 * when both bodies' positions and headings are bit-for-bit unchanged, so a
 * stale entry is never read; signals are always read fresh.
 */
export class ContactPairCache {
  readonly entries: (PairGeometry | undefined)[] = [];
}

/**
 * Every ant's contact percepts at once, checking each nearby pair once
 * (colony-fastpath side project, STATUS 2026-10-12). Gives the same contacts
 * in the same order as `senseContacts` for each ant: the contact tests are
 * symmetric in the two bodies, IEEE subtraction is exactly antisymmetric,
 * and an ant's list fills in ascending partner index (partners below it
 * while their own rows are scanned, then those above it in its own row).
 * Dead ants get an empty list.
 */
export function senseAllContacts(w: World, cache?: ContactPairCache): ContactPercept[][] {
  const ants = w.ants;
  const out: ContactPercept[][] = ants.map(() => []);
  const grid = w.contactGrid;
  const entries = cache?.entries;
  for (let i = 0; i < ants.length; i++) {
    const a = ants[i].body;
    if (!a.alive) continue;
    const near = grid ? grid.near(a.x, a.y) : null;
    const count = near ? near.length : ants.length;
    for (let k = 0; k < count; k++) {
      const j = near ? near[k] : k;
      if (j <= i) continue;
      const b = ants[j].body;
      if (!b.alive) continue;
      const key = (j * (j - 1)) / 2 + i;
      let g = entries?.[key];
      if (!g || g.ax !== a.x || g.ay !== a.y || g.ah !== a.heading || g.bx !== b.x || g.by !== b.y || g.bh !== b.heading) {
        const ox = b.x - a.x;
        const oy = b.y - a.y;
        // Cheap bound first: no antennal contact beyond the larger reach plus both head offsets.
        const bound = antennalBound(a, b);
        const contact = ox * ox + oy * oy <= bound * bound && antennalContact(a, b);
        g ??= {} as PairGeometry;
        g.ax = a.x;
        g.ay = a.y;
        g.ah = a.heading;
        g.bx = b.x;
        g.by = b.y;
        g.bh = b.heading;
        g.contact = contact;
        g.mouth = contact && mouthContact(a, b);
        g.dist = contact ? Math.hypot(ox, oy) : 0;
        g.bearingA = contact ? wrap(Math.atan2(oy, ox) - a.heading) : 0;
        g.bearingB = contact ? wrap(Math.atan2(-oy, -ox) - b.heading) : 0;
        if (entries) entries[key] = g;
      }
      if (!g.contact) continue;
      out[i].push({ id: b.id, bearing: g.bearingA, dist: g.dist, layingTrail: b.gasterDown, offering: b.offering, soliciting: b.soliciting, mouthContact: g.mouth, sharing: b.sharingWith >= 0, sharingWithMe: b.sharingWith === a.id, moving: b.stepLen > 0 });
      out[j].push({ id: a.id, bearing: g.bearingB, dist: g.dist, layingTrail: a.gasterDown, offering: a.offering, soliciting: a.soliciting, mouthContact: g.mouth, sharing: a.sharingWith >= 0, sharingWithMe: a.sharingWith === b.id, moving: a.stepLen > 0 });
    }
  }
  return out;
}

function wrap(a: number): number {
  a = (a + Math.PI) % (2 * Math.PI);
  if (a < 0) a += 2 * Math.PI;
  return a - Math.PI;
}
