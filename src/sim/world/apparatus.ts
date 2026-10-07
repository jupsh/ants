/**
 * Planar laboratory apparatus: a union of rectangular regions (nest
 * chambers, bridges, foraging arenas) on a horizontal surface. Ants can walk
 * anywhere inside the union; the outer boundary is a wall/edge they cannot
 * cross. Coordinates in mm.
 */
export type RegionKind = 'nest' | 'bridge' | 'arena';

export interface Region {
  name: string;
  kind: RegionKind;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  /** Covered regions are dark (e.g. a nest under red glass). */
  covered: boolean;
}

export class Apparatus {
  readonly regions: Region[];
  readonly bounds: { x0: number; y0: number; x1: number; y1: number };

  constructor(regions: Region[]) {
    this.regions = regions;
    this.bounds = {
      x0: Math.min(...regions.map((r) => r.x0)),
      y0: Math.min(...regions.map((r) => r.y0)),
      x1: Math.max(...regions.map((r) => r.x1)),
      y1: Math.max(...regions.map((r) => r.y1)),
    };
  }

  regionAt(x: number, y: number): Region | null {
    for (const r of this.regions) if (x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1) return r;
    return null;
  }

  inside(x: number, y: number): boolean {
    return this.regionAt(x, y) !== null;
  }

  /** Distance from (x, y) to the nearest boundary of the walkable union (0 outside). */
  edgeDistance(x: number, y: number): number {
    if (!this.inside(x, y)) return 0;
    // Probe outwards in 16 directions (adequate for rectangle unions).
    let best = Infinity;
    for (let k = 0; k < 16; k++) {
      const a = (k / 16) * Math.PI * 2;
      const c = Math.cos(a);
      const s = Math.sin(a);
      let lo = 0;
      let hi = 400;
      if (this.inside(x + c * hi, y + s * hi)) continue;
      for (let it = 0; it < 18; it++) {
        const mid = (lo + hi) / 2;
        if (this.inside(x + c * mid, y + s * mid)) lo = mid;
        else hi = mid;
      }
      best = Math.min(best, lo);
    }
    return best;
  }
}

/**
 * Mailleux et al. (2000, 2009) set-up: plaster nest (20 × 25 cm, 0.5 cm
 * high, covered) connected by a bridge to a 6 × 6 cm foraging area. The
 * bridge length is not stated; with the second droplet "in the middle of the
 * bridge, 9 cm from the first" (area centre), the bridge is ≈ 12 cm long.
 * Bridge width (not stated) is taken as 5 mm: with a 1 cm bridge only ~40 %
 * of simulated scouts touched the mid-bridge drop, whereas > 95 % of real
 * scouts found it.
 */
export function mailleuxApparatus(): { app: Apparatus; entrance: [number, number]; feeder1: [number, number]; feeder2: [number, number] } {
  const nest: Region = { name: 'nest', kind: 'nest', x0: -250, y0: -100, x1: 0, y1: 100, covered: true };
  const bridge: Region = { name: 'bridge', kind: 'bridge', x0: 0, y0: -2.5, x1: 120, y1: 2.5, covered: false };
  const area: Region = { name: 'area', kind: 'arena', x0: 120, y0: -30, x1: 180, y1: 30, covered: false };
  return { app: new Apparatus([nest, bridge, area]), entrance: [0, 0], feeder1: [150, 0], feeder2: [60, 0] };
}
