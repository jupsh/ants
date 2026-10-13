import type { Agent } from './world';

/**
 * Living ants binned by position once per step (STATUS 2026-10-11, step
 * 4b cost): with cells at least as wide as the largest antennal-contact
 * distance, every possible contact partner of an ant lies in the 3 × 3
 * cells around it. `near` returns those candidates in index order, so a
 * contact search over them gives the same contacts in the same order as a
 * search over all ants. Dense cells over the apparatus bounds (positions
 * outside are clamped to the border cells, which only adds candidates).
 * Incremental (colony-fastpath side project, STATUS 2026-10-12): `build`
 * moves only the ants that changed cell, and a cell's merged neighbourhood
 * list is kept until an ant enters or leaves one of its 3 × 3 cells.
 */
export class ContactGrid {
  private readonly nx: number;
  private readonly ny: number;
  private readonly cells: number[][];
  private readonly hood: (Int32Array | undefined)[];
  /** Cell of each ant at the last build (−1: dead or not yet binned). */
  private readonly antCell: number[] = [];

  constructor(
    readonly size: number,
    private readonly bounds: { x0: number; y0: number; x1: number; y1: number },
  ) {
    this.nx = Math.max(1, Math.ceil((bounds.x1 - bounds.x0) / size));
    this.ny = Math.max(1, Math.ceil((bounds.y1 - bounds.y0) / size));
    this.cells = Array.from({ length: this.nx * this.ny }, () => []);
    this.hood = new Array(this.nx * this.ny);
  }

  private cell(x: number, y: number): number {
    const cx = Math.min(this.nx - 1, Math.max(0, Math.floor((x - this.bounds.x0) / this.size)));
    const cy = Math.min(this.ny - 1, Math.max(0, Math.floor((y - this.bounds.y0) / this.size)));
    return cx + cy * this.nx;
  }

  /** Forget the merged lists of the 3 × 3 cells around cell k. */
  private invalidate(k: number): void {
    const cx = k % this.nx;
    const cy = (k - cx) / this.nx;
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x >= 0 && x < this.nx && y >= 0 && y < this.ny) this.hood[x + y * this.nx] = undefined;
      }
  }

  build(ants: readonly Agent[]): void {
    for (let i = 0; i < ants.length; i++) {
      const b = ants[i].body;
      const next = b.alive ? this.cell(b.x, b.y) : -1;
      const prev = this.antCell[i] ?? -1;
      if (prev === next) continue;
      if (prev >= 0) {
        const c = this.cells[prev];
        c.splice(c.indexOf(i), 1);
        this.invalidate(prev);
      }
      if (next >= 0) {
        this.cells[next].push(i);
        this.invalidate(next);
      }
      this.antCell[i] = next;
    }
  }

  /** Indices of the ants binned in the 3 × 3 cells around (x, y), ascending (shared until the next build; do not modify). */
  near(x: number, y: number): Int32Array {
    const k = this.cell(x, y);
    const kept = this.hood[k];
    if (kept) return kept;
    const cx = k % this.nx;
    const cy = (k - cx) / this.nx;
    let n = 0;
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x >= 0 && x < this.nx && y >= 0 && y < this.ny) n += this.cells[x + y * this.nx].length;
      }
    const out = new Int32Array(n);
    n = 0;
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x >= 0 && x < this.nx && y >= 0 && y < this.ny) for (const i of this.cells[x + y * this.nx]) out[n++] = i;
      }
    out.sort();
    this.hood[k] = out;
    return out;
  }
}
