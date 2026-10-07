/** Objects lying on the surface: food, plants, obstacles, building material, corpses. */

interface Base {
  id: number;
  x: number;
  y: number;
  /** Footprint radius in mm. */
  r: number;
}

/** Sucrose solution droplet. 1 M sucrose = 0.342 mg sugar per µL. */
export interface SugarDrop extends Base {
  kind: 'sugar';
  volume: number; // µL
  conc: number; // mol/L
}

/** A colony of aphids on a plant stem producing honeydew. */
export interface AphidColony extends Base {
  kind: 'aphids';
  aphids: number;
  honeydew: number; // µL available
  conc: number; // sugar concentration equivalent (M)
  rate: number; // µL/s per aphid
  cap: number; // µL per aphid that can accumulate
}

/** Dead arthropod: protein source; may need cutting up or cooperative transport. */
export interface Insect extends Base {
  kind: 'insect';
  mass: number; // mg remaining
  len: number; // mm body length (rendering)
  heading: number;
  carriers: number[]; // ant ids currently pulling
  /** Ant id currently carrying alone, or -1. */
  carriedBy: number;
}

export interface Seed extends Base {
  kind: 'seed';
  mass: number; // mg
  carriedBy: number;
}

export interface Plant extends Base {
  kind: 'plant';
  leafArea: number; // mm² of cuttable leaf within ant reach
  maxLeafArea: number;
  palatability: number; // 0..1, governs Atta recruitment strength
  height: number; // mm (rendering)
  regrowth: number; // mm²/s
}

export interface Stone extends Base {
  kind: 'stone';
  height: number;
}

export interface Grit extends Base {
  kind: 'grit';
  carriedBy: number;
}

export interface Corpse extends Base {
  kind: 'corpse';
  died: number; // sim time of death
  len: number;
  sizeClass: number;
  carriedBy: number;
}

export type Item = SugarDrop | AphidColony | Insect | Seed | Plant | Stone | Grit | Corpse;
export type ItemKind = Item['kind'];

/** Uniform bucket grid for proximity queries over items. */
export class ItemIndex {
  private buckets: Map<number, Item[]> = new Map();
  private dirty = true;
  readonly bucket: number;
  private readonly cols: number;

  constructor(
    private readonly items: Map<number, Item>,
    readonly width: number,
    readonly height: number,
  ) {
    this.bucket = Math.max(20, Math.min(width, height) / 40);
    this.cols = Math.ceil(width / this.bucket) + 1;
  }

  markDirty(): void {
    this.dirty = true;
  }

  private rebuild(): void {
    this.buckets.clear();
    for (const it of this.items.values()) {
      const bx0 = Math.floor((it.x - it.r) / this.bucket);
      const bx1 = Math.floor((it.x + it.r) / this.bucket);
      const by0 = Math.floor((it.y - it.r) / this.bucket);
      const by1 = Math.floor((it.y + it.r) / this.bucket);
      for (let by = by0; by <= by1; by++)
        for (let bx = bx0; bx <= bx1; bx++) {
          const k = by * this.cols + bx;
          let arr = this.buckets.get(k);
          if (!arr) this.buckets.set(k, (arr = []));
          arr.push(it);
        }
    }
    this.dirty = false;
  }

  /** Visit items whose footprint lies within `radius` of (x, y). */
  query(x: number, y: number, radius: number, visit: (it: Item, dist: number) => void): void {
    if (this.dirty) this.rebuild();
    const bx0 = Math.floor((x - radius) / this.bucket);
    const bx1 = Math.floor((x + radius) / this.bucket);
    const by0 = Math.floor((y - radius) / this.bucket);
    const by1 = Math.floor((y + radius) / this.bucket);
    const seen = bx1 > bx0 || by1 > by0 ? new Set<number>() : null;
    for (let by = by0; by <= by1; by++)
      for (let bx = bx0; bx <= bx1; bx++) {
        const arr = this.buckets.get(by * this.cols + bx);
        if (!arr) continue;
        for (const it of arr) {
          if (seen) {
            if (seen.has(it.id)) continue;
            seen.add(it.id);
          }
          const d = Math.hypot(it.x - x, it.y - y) - it.r;
          if (d <= radius) visit(it, Math.max(0, d));
        }
      }
  }
}
