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
  /**
   * Incremental sensing (STATUS 2026-10-18, speed-up): each ant's position, heading and life at its last
   * recomputation, and its current contact partners in ascending index. Only pairs with an ant that changed are
   * recomputed (by the same geometry code); a pair of two unchanged ants keeps its recorded result.
   */
  readonly last: (number[] | undefined)[] = [];
  readonly adj: number[][] = [];
}

/** Insert v into the ascending array a (no duplicates). */
function insertSorted(a: number[], v: number): void {
  let k = a.length;
  while (k > 0 && a[k - 1] > v) k--;
  if (a[k - 1] !== v) a.splice(k, 0, v);
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
  return cache ? senseIncremental(w, cache) : senseFull(w);
}

/** The geometry of pair (i, j), i < j, as recorded for bodies a (ant i) and b (ant j). */
function pairGeometry(a: World['ants'][number]['body'], b: World['ants'][number]['body'], g?: PairGeometry): PairGeometry {
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
  return g;
}

/**
 * The cached path: the same contacts, geometry and order as `senseFull`. An ant counts as changed when its
 * position, heading or life differs bit for bit from its last recomputation; its old contacts are dropped and
 * its pairs with every candidate (the grid's 3 × 3 cells, symmetric) recomputed. Pairs of two unchanged ants
 * cannot have changed, nor left each other's candidate cells. Percepts are built fresh from the partner lists,
 * reading the signals now.
 */
function senseIncremental(w: World, cache: ContactPairCache): ContactPercept[][] {
  const ants = w.ants;
  const n = ants.length;
  const grid = w.contactGrid;
  const { entries, last, adj } = cache;
  const moved = new Uint8Array(n);
  const changed: number[] = [];
  for (let i = 0; i < n; i++) {
    const b = ants[i].body;
    const l = last[i];
    const alive = b.alive ? 1 : 0;
    if (l && l[0] === b.x && l[1] === b.y && l[2] === b.heading && l[3] === alive) continue;
    moved[i] = 1;
    changed.push(i);
    last[i] = [b.x, b.y, b.heading, alive];
    adj[i] ??= [];
  }
  // Drop the changed ants' contacts on both sides, then recompute their pairs.
  for (const i of changed) {
    for (const p of adj[i]) {
      const q = adj[p];
      // A changed partner's list may already be empty.
      const k = q.indexOf(i);
      if (k >= 0) q.splice(k, 1);
    }
    adj[i].length = 0;
  }
  for (const i of changed) {
    const a = ants[i].body;
    if (!a.alive) continue;
    const near = grid ? grid.near(a.x, a.y) : null;
    const count = near ? near.length : n;
    for (let k = 0; k < count; k++) {
      const j = near ? near[k] : k;
      // A pair of two changed ants once, from its lower index.
      if (j === i || (moved[j] && j < i)) continue;
      if (!ants[j].body.alive) continue;
      const lo = i < j ? i : j;
      const hi = i < j ? j : i;
      const key = (hi * (hi - 1)) / 2 + lo;
      const g = pairGeometry(ants[lo].body, ants[hi].body, entries[key]);
      entries[key] = g;
      if (!g.contact) continue;
      insertSorted(adj[lo], hi);
      insertSorted(adj[hi], lo);
    }
  }
  const out: ContactPercept[][] = new Array(n);
  for (let i = 0; i < n; i++) {
    const list = adj[i];
    const a = ants[i].body;
    const o: ContactPercept[] = [];
    if (a.alive && list)
      for (const p of list) {
        const b = ants[p].body;
        const g = entries[i < p ? (p * (p - 1)) / 2 + i : (i * (i - 1)) / 2 + p]!;
        o.push({ id: b.id, bearing: i < p ? g.bearingA : g.bearingB, dist: g.dist, layingTrail: b.gasterDown, offering: b.offering, soliciting: b.soliciting, mouthContact: g.mouth, sharing: b.sharingWith >= 0, sharingWithMe: b.sharingWith === a.id, moving: b.stepLen > 0 });
      }
    out[i] = o;
  }
  return out;
}

/** Every pair recomputed each step (the reference path; no cache). */
function senseFull(w: World): ContactPercept[][] {
  const ants = w.ants;
  const out: ContactPercept[][] = ants.map(() => []);
  const grid = w.contactGrid;
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
      const g = pairGeometry(a, b);
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
