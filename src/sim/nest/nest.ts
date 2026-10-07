import { RNG } from '../core/rng';
import type { Species } from '../species';
import { Mat, NestGrid, UNREACHABLE } from './grid';
import { buildPlan, type NestPlan } from './plan';

export interface Chamber {
  id: number;
  voxels: number[];
  floor: number[];
  cx: number;
  cy: number;
  cz: number;
  volume: number; // mm³
}

/** Minimum openness (air among 26 neighbours) for a voxel to count as chamber space. */
const CHAMBER_OPENNESS = 14;

/**
 * The nest: voxel grid + excavation plan + derived structures (chambers,
 * navigation fields, dig frontier).
 */
export class Nest {
  readonly grid: NestGrid;
  readonly plan: NestPlan;
  readonly entrance: number;
  chambers: Chamber[] = [];
  /** voxel -> chamber id (only for chamber voxels). */
  chamberOf = new Map<number, number>();
  private chambersVersion = -1;

  /** Solid planned voxels adjacent to air: candidate dig sites. */
  readonly frontier = new Set<number>();
  /** Pellets left before a frontier voxel opens. */
  readonly pellets = new Map<number, number>();
  /** Time of last excavation near a voxel (stigmergic digging cue). */
  readonly recentDig = new Map<number, number>();
  readonly pelletsPerVoxel: number;
  /** Excavated pellets awaiting removal (dropped inside if diggers die). */
  totalExcavated = 0;

  private fields = new Map<string, { field: Uint16Array; version: number; time: number }>();

  constructor(
    readonly sp: Species,
    rng: RNG,
    cx: number,
    cy: number,
    surface: (x: number, y: number) => number,
    initialWorkers: number,
  ) {
    const n = sp.nest;
    const v = n.voxel;
    const lateral = Math.max(n.radius, n.moundRadius) * 1.15 + v * 4;
    const nx = Math.ceil((2 * lateral) / v);
    const top = Math.max(n.moundHeight, 0) + v * 4 + (n.architecture === 'crevice' ? 4 : 0);
    const bottom = n.depth * 1.25 + v * 4;
    const nz = Math.ceil((top + bottom) / v);
    this.grid = new NestGrid(nx, nx, nz, v, cx - lateral, cy - lateral, -bottom);
    this.plan = buildPlan(sp, this.grid, rng, cx, cy, surface);
    for (const vx of this.plan.preOpen) this.grid.setRaw(vx, Mat.Air);
    this.grid.reindex();
    this.entrance = this.plan.entranceVoxel;
    this.pelletsPerVoxel = Math.max(1, Math.round((v * v * v) / n.pelletVolume));
    this.initialExcavation(initialWorkers * sp.colony.volumePerWorker);
    this.rebuildFrontier();
  }

  get voxelVolume(): number {
    return this.grid.voxel ** 3;
  }

  /** Current open nest volume (mm³). */
  get volume(): number {
    return this.grid.airCount * this.voxelVolume;
  }

  /**
   * Instantly excavate the plan in priority order up to `targetVolume`
   * (represents the colony's history before the simulation starts).
   */
  private initialExcavation(targetVolume: number): void {
    const g = this.grid;
    const target = targetVolume / this.voxelVolume;
    // Best-first growth from the open voxels, always at the air frontier —
    // the same constraint live diggers obey.
    const heap = new MinHeap();
    const queued = new Set<number>();
    const push = (v: number) => {
      if (queued.has(v) || g.mat[v] === Mat.Air) return;
      const k = this.plan.key.get(v);
      if (k === undefined) return;
      queued.add(v);
      heap.push(v, k);
    };
    for (let a = 0; a < g.airCount; a++) g.forFaceNeighbours(g.airList[a], (nb) => push(nb));
    while (g.airCount < target && heap.size > 0) {
      const v = heap.pop();
      g.excavate(v);
      g.forFaceNeighbours(v, (nb) => push(nb));
    }
  }

  rebuildFrontier(): void {
    this.frontier.clear();
    const g = this.grid;
    for (const v of this.plan.key.keys()) {
      if (g.mat[v] === Mat.Air) continue;
      let adj = false;
      g.forFaceNeighbours(v, (nb) => {
        if (g.mat[nb] === Mat.Air) adj = true;
      });
      if (adj) this.frontier.add(v);
    }
  }

  /** Material hardness multiplier for pellet removal time. */
  hardness(v: number): number {
    const m = this.grid.mat[v];
    if (m === Mat.Thatch) return 0.5;
    const z = this.grid.center(v)[2];
    // Compaction / clay content increases with depth.
    return 1 + Math.max(0, -z) / 600;
  }

  /** Remove one pellet from a frontier voxel; returns true if the voxel opened. */
  removePellet(v: number, now: number): boolean {
    if (!this.frontier.has(v)) return false;
    const left = (this.pellets.get(v) ?? this.pelletsPerVoxel) - 1;
    this.totalExcavated++;
    if (left > 0) {
      this.pellets.set(v, left);
      return false;
    }
    this.pellets.delete(v);
    this.frontier.delete(v);
    const g = this.grid;
    g.excavate(v);
    this.recentDig.set(v, now);
    g.forFaceNeighbours(v, (nb) => {
      if (g.mat[nb] !== Mat.Air && this.plan.key.has(nb)) this.frontier.add(nb);
    });
    return true;
  }

  /** Air voxel adjacent to a frontier voxel (where a digger stands). */
  digStandpoint(v: number): number {
    let best = -1;
    this.grid.forFaceNeighbours(v, (nb) => {
      if (best < 0 && this.grid.mat[nb] === Mat.Air) best = nb;
    });
    return best;
  }

  /**
   * Choose a dig site: soft-min over plan priority with a stigmergic bonus for
   * sites near recent excavation (diggers cluster where digging is ongoing).
   */
  chooseDigSite(rng: RNG, now: number): number {
    if (this.frontier.size === 0) return -1;
    let minKey = Infinity;
    for (const v of this.frontier) minKey = Math.min(minKey, this.plan.key.get(v)!);
    const T = 0.06;
    let total = 0;
    const cands: number[] = [];
    const weights: number[] = [];
    for (const v of this.frontier) {
      const k = this.plan.key.get(v)!;
      if (k - minKey > T * 8) continue;
      let w = Math.exp(-(k - minKey) / T);
      if (this.pellets.has(v)) w *= 3; // partly dug
      const g = this.grid;
      g.forFaceNeighbours(v, (nb) => {
        const t = this.recentDig.get(nb);
        if (t !== undefined && now - t < 3600) w *= 2;
      });
      cands.push(v);
      weights.push(w);
      total += w;
    }
    let r = rng.next() * total;
    for (let i = 0; i < cands.length; i++) {
      r -= weights[i];
      if (r <= 0) return cands[i];
    }
    return cands[cands.length - 1];
  }

  /** Distance field to named sources, recomputed when the nest changed. */
  field(name: string, sources: () => Iterable<number>, now: number, maxAge = 10): Uint16Array {
    const f = this.fields.get(name);
    if (f && (f.version === this.grid.version || now - f.time < maxAge) && f.field.length >= this.grid.airCount) return f.field;
    const field = this.grid.distanceField(sources(), f?.field);
    this.fields.set(name, { field, version: this.grid.version, time: now });
    if (this.fields.size > 96) {
      const first = this.fields.keys().next().value!;
      if (first !== name) this.fields.delete(first);
    }
    return field;
  }

  /** Distance field to a single voxel. */
  fieldTo(v: number, now: number): Uint16Array {
    return this.field(`v${v}`, () => [v], now, 30);
  }

  /** Distance to entrance. */
  exitField(now: number): Uint16Array {
    return this.field('exit', () => [this.entrance], now, 5);
  }

  dist(field: Uint16Array, v: number): number {
    const id = this.grid.airId[v];
    if (id < 0 || id >= field.length) return UNREACHABLE;
    return field[id];
  }

  /** Detect chambers as connected components of open voxels. */
  updateChambers(): void {
    const g = this.grid;
    if (this.chambersVersion === g.version) return;
    this.chambersVersion = g.version;
    const open = new Set<number>();
    for (let a = 0; a < g.airCount; a++) {
      const v = g.airList[a];
      if (g.openness(v) >= CHAMBER_OPENNESS) open.add(v);
    }
    const seen = new Set<number>();
    const chambers: Chamber[] = [];
    this.chamberOf.clear();
    for (const s of open) {
      if (seen.has(s)) continue;
      const comp: number[] = [];
      const stack = [s];
      seen.add(s);
      while (stack.length) {
        const v = stack.pop()!;
        comp.push(v);
        g.forNeighbours(v, (nb) => {
          if (open.has(nb) && !seen.has(nb)) {
            seen.add(nb);
            stack.push(nb);
          }
        });
      }
      if (comp.length < 6) continue;
      let sx = 0;
      let sy = 0;
      let sz = 0;
      for (const v of comp) {
        const [x, y, z] = g.center(v);
        sx += x;
        sy += y;
        sz += z;
      }
      const id = chambers.length;
      const floor = comp.filter((v) => g.onFloor(v));
      chambers.push({ id, voxels: comp, floor: floor.length ? floor : comp, cx: sx / comp.length, cy: sy / comp.length, cz: sz / comp.length, volume: comp.length * this.voxelVolume });
      for (const v of comp) this.chamberOf.set(v, id);
    }
    // Stable order: shallow to deep.
    chambers.sort((a, b) => b.cz - a.cz);
    this.chamberOf.clear();
    chambers.forEach((c, i) => {
      c.id = i;
      for (const v of c.voxels) this.chamberOf.set(v, i);
    });
    this.chambers = chambers;
  }

  /** Nearest floor voxel of a chamber to its centroid. */
  chamberCentreVoxel(c: Chamber): number {
    let best = c.floor[0];
    let bd = Infinity;
    for (const v of c.floor) {
      const [x, y, z] = this.grid.center(v);
      const d = (x - c.cx) ** 2 + (y - c.cy) ** 2 + (z - c.cz) ** 2;
      if (d < bd) {
        bd = d;
        best = v;
      }
    }
    return best;
  }
}

/** Binary min-heap of (voxel, key). */
class MinHeap {
  private ids: number[] = [];
  private keys: number[] = [];

  get size(): number {
    return this.ids.length;
  }

  push(id: number, key: number): void {
    const ids = this.ids;
    const keys = this.keys;
    let i = ids.length;
    ids.push(id);
    keys.push(key);
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (keys[p] <= key) break;
      ids[i] = ids[p];
      keys[i] = keys[p];
      i = p;
    }
    ids[i] = id;
    keys[i] = key;
  }

  pop(): number {
    const ids = this.ids;
    const keys = this.keys;
    const top = ids[0];
    const lastId = ids.pop()!;
    const lastKey = keys.pop()!;
    const n = ids.length;
    if (n > 0) {
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        if (l >= n) break;
        const r = l + 1;
        const c = r < n && keys[r] < keys[l] ? r : l;
        if (keys[c] >= lastKey) break;
        ids[i] = ids[c];
        keys[i] = keys[c];
        i = c;
      }
      ids[i] = lastId;
      keys[i] = lastKey;
    }
    return top;
  }
}
