import { fbm, smoothstep } from '../core/math';

/**
 * Surface heightmap (mm). Holds the natural relief plus mounds and spoil
 * heaps deposited by the colony. Excavated pellets dropped on the surface are
 * relaxed towards the angle of repose of dry soil (~34°), which produces the
 * familiar crater/cone around nest entrances.
 */
export class Terrain {
  readonly hgt: Float32Array;
  /** Incremented whenever heights change (renderer re-uploads). */
  version = 0;
  dirty: [number, number, number, number] | null = null; // x0,y0,x1,y1 cell bounds
  private static readonly REPOSE = Math.tan((34 * Math.PI) / 180);

  constructor(
    readonly w: number,
    readonly h: number,
    readonly cell: number,
  ) {
    this.hgt = new Float32Array(w * h);
  }

  generate(seed: number, relief: number, flatX: number, flatY: number, flatR: number): void {
    const scale = 1 / Math.max(80, (this.w * this.cell) / 6);
    for (let j = 0; j < this.h; j++)
      for (let i = 0; i < this.w; i++) {
        const x = (i + 0.5) * this.cell;
        const y = (j + 0.5) * this.cell;
        let z = (fbm(x * scale, y * scale, seed, 5) - 0.5) * 2 * relief;
        const d = Math.hypot(x - flatX, y - flatY);
        z *= smoothstep(flatR * 0.5, flatR * 1.5, d);
        this.hgt[j * this.w + i] = z;
      }
    // Re-zero so the nest entrance sits at z = 0.
    const z0 = this.heightAt(flatX, flatY);
    for (let k = 0; k < this.hgt.length; k++) this.hgt[k] -= z0;
    this.version++;
  }

  /** Add a smooth dome (e.g. mound) of height `height` and radius `r`. */
  addDome(cx: number, cy: number, r: number, height: number): void {
    const c = this.cell;
    for (let j = Math.max(0, Math.floor((cy - r) / c)); j <= Math.min(this.h - 1, Math.ceil((cy + r) / c)); j++)
      for (let i = Math.max(0, Math.floor((cx - r) / c)); i <= Math.min(this.w - 1, Math.ceil((cx + r) / c)); i++) {
        const d = Math.hypot((i + 0.5) * c - cx, (j + 0.5) * c - cy) / r;
        if (d < 1) this.hgt[j * this.w + i] += height * (1 - d * d) ** 1.5;
      }
    this.version++;
  }

  heightAt(x: number, y: number): number {
    const gx = x / this.cell - 0.5;
    const gy = y / this.cell - 0.5;
    let ix = Math.floor(gx);
    let iy = Math.floor(gy);
    if (ix < 0) ix = 0;
    if (iy < 0) iy = 0;
    if (ix > this.w - 2) ix = this.w - 2;
    if (iy > this.h - 2) iy = this.h - 2;
    const fx = Math.min(1, Math.max(0, gx - ix));
    const fy = Math.min(1, Math.max(0, gy - iy));
    const i = iy * this.w + ix;
    const d = this.hgt;
    const a = d[i] + (d[i + 1] - d[i]) * fx;
    const b = d[i + this.w] + (d[i + this.w + 1] - d[i + this.w]) * fx;
    return a + (b - a) * fy;
  }

  /** Surface gradient (dz/dx, dz/dy). */
  slope(x: number, y: number): [number, number] {
    const e = this.cell;
    return [(this.heightAt(x + e, y) - this.heightAt(x - e, y)) / (2 * e), (this.heightAt(x, y + e) - this.heightAt(x, y - e)) / (2 * e)];
  }

  /** Deposit a volume (mm³) of loose soil at (x, y) and let it avalanche. */
  depositSoil(x: number, y: number, volume: number): void {
    const c = this.cell;
    let i = Math.floor(x / c);
    let j = Math.floor(y / c);
    if (i < 1 || j < 1 || i >= this.w - 1 || j >= this.h - 1) return;
    this.hgt[j * this.w + i] += volume / (c * c);
    // Local avalanche relaxation towards the angle of repose.
    const maxDrop = Terrain.REPOSE * c;
    for (let iter = 0; iter < 24; iter++) {
      const k = j * this.w + i;
      let best = -1;
      let bestDrop = maxDrop;
      for (const [di, dj] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const ni = i + di;
        const nj = j + dj;
        if (ni < 1 || nj < 1 || ni >= this.w - 1 || nj >= this.h - 1) continue;
        const drop = this.hgt[k] - this.hgt[nj * this.w + ni];
        if (drop > bestDrop) {
          bestDrop = drop;
          best = nj * this.w + ni;
        }
      }
      if (best < 0) break;
      const move = (bestDrop - maxDrop) / 2;
      this.hgt[k] -= move;
      this.hgt[best] += move;
      i = best % this.w;
      j = Math.floor(best / this.w);
    }
    this.markDirty(i, j);
  }

  private markDirty(i: number, j: number): void {
    const r = 3;
    if (!this.dirty) this.dirty = [i - r, j - r, i + r, j + r];
    else {
      this.dirty[0] = Math.min(this.dirty[0], i - r);
      this.dirty[1] = Math.min(this.dirty[1], j - r);
      this.dirty[2] = Math.max(this.dirty[2], i + r);
      this.dirty[3] = Math.max(this.dirty[3], j + r);
    }
    this.version++;
  }
}
