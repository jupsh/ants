import type { Body } from '../agent/body';
import type { World } from '../world/world';
import { insertSorted, pairGeometry, type ContactPairCache } from './contactPairs';
import type { ContactPercept, Interoception } from './types';

/**
 * Perception for lazy resting ants (backlog B014; the colony runner's `LazyColonySim`): the contact cache's pair
 * upkeep with change marks, percepts built per ant on demand, and a reusable interoception. Each repeats the
 * operations of its stepped counterpart (`senseIncremental`, `interocept`) exactly; kept in its own module so the
 * stepped modules are unchanged (B014 Progress, 2026-10-19).
 */

/**
 * Lazy resting ants (B014): `senseIncremental`'s pair upkeep without the percepts, the same operations in the same
 * order (each ant's partners in `cache.adj`, ascending), so the cache ends as `senseIncremental` leaves it. Kept
 * apart so the stepped path's code is unchanged. With `marks` and `watch`, sets marks[i] for every watched ant whose
 * position, heading or life changed, or whose partner set differs from before the update (compared as sets: a pair
 * recomputed with the same result does not count). Unwatched ants are not marked.
 */
export function updateAdjacency(w: World, cache: ContactPairCache, marks?: Uint8Array, watch?: readonly boolean[]): void {
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
  // Partner lists of watched ants as they were before this update, for every such list the update touches.
  const before = marks ? new Map<number, number[]>() : null;
  const touch = (k: number) => {
    if (watch![k] && !before!.has(k)) before!.set(k, adj[k].slice());
  };
  // Drop the changed ants' contacts on both sides, then recompute their pairs.
  for (const i of changed) {
    if (before) touch(i);
    for (const p of adj[i]) {
      const q = adj[p];
      if (before) touch(p);
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
      if (before) {
        touch(lo);
        touch(hi);
      }
      insertSorted(adj[lo], hi);
      insertSorted(adj[hi], lo);
    }
  }
  if (marks) {
    for (const i of changed) if (watch![i]) marks[i] = 1;
    for (const [k, old] of before!) {
      const now = adj[k];
      let same = old.length === now.length;
      for (let m = 0; same && m < old.length; m++) same = old[m] === now[m];
      if (!same) marks[k] = 1;
    }
  }
}

/** Ant i's contact percepts from the cache after `updateAdjacency`, as `senseIncremental` builds them, reading the partners' signals now (dead ants: none). */
export function contactPercepts(w: World, cache: ContactPairCache, i: number): ContactPercept[] {
  const ants = w.ants;
  const { entries, adj } = cache;
  const list = adj[i];
  const a = ants[i].body;
  const o: ContactPercept[] = [];
  if (a.alive && list)
    for (const p of list) {
      const b = ants[p].body;
      const g = entries[i < p ? (p * (p - 1)) / 2 + i : (i * (i - 1)) / 2 + p]!;
      o.push({ id: b.id, bearing: i < p ? g.bearingA : g.bearingB, dist: g.dist, layingTrail: b.gasterDown, offering: b.offering, soliciting: b.soliciting, mouthContact: g.mouth, sharing: b.sharingWith >= 0, sharingWithMe: b.sharingWith === a.id, moving: b.stepLen > 0 });
    }
  return o;
}

/** `interocept` written into `out`, the same expressions (a test checks the two agree). */
export function interoceptInto(b: Body, out: Interoception): Interoception {
  out.reserve = b.reserve / b.reserveMax;
  out.cropUl = b.cropUl;
  out.cropCapacity = b.morph.cropCapacity;
  out.water = b.water / b.waterMax;
  out.bodyMass = b.morph.mass;
  out.mouthFlow = b.mouthFlow;
  out.cropFull = b.cropUl >= b.morph.cropCapacity * b.morph.cropFullFrac;
  return out;
}
