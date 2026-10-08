import type { Apparatus, Region } from './apparatus';

/**
 * A cue that spreads along the walkable surface (step 4, provisional): the
 * path distance from every walkable cell to a set of source regions, on a
 * square grid, by Dijkstra over 8-neighbour moves. An ant senses the
 * direction in which this distance falls, so the cue leads through passages
 * rather than straight at a wall (a straight-line bearing to the entrance
 * kept ants pressed against the wall beside the 3 mm passage of the Bles
 * nest). Used as nest odour (sources: the nest, sensed outside it) and as
 * the exit cue (sources: everything outside the nest, sensed inside it).
 */
export class PathField {
  readonly cols: number;
  readonly rows: number;
  readonly dist: Float64Array;

  constructor(
    readonly app: Apparatus,
    isSource: (r: Region) => boolean,
    readonly cell = 0.5,
  ) {
    const { x0, y0, x1, y1 } = app.bounds;
    this.cols = Math.ceil((x1 - x0) / cell) + 1;
    this.rows = Math.ceil((y1 - y0) / cell) + 1;
    // Float64: a float32 store rounds some distances up, so the same value kept "improving" (endless re-queueing).
    this.dist = new Float64Array(this.cols * this.rows).fill(Infinity);
    const walk = new Uint8Array(this.cols * this.rows);
    const heap: [number, number][] = [];
    for (let r = 0; r < this.rows; r++)
      for (let c = 0; c < this.cols; c++) {
        const reg = app.regionAt(x0 + c * cell, y0 + r * cell);
        if (!reg) continue;
        walk[r * this.cols + c] = 1;
        if (isSource(reg)) {
          this.dist[r * this.cols + c] = 0;
          heap.push([0, r * this.cols + c]);
        }
      }
    // Dijkstra with a binary heap.
    const push = (d: number, i: number) => {
      heap.push([d, i]);
      let k = heap.length - 1;
      while (k > 0) {
        const p = (k - 1) >> 1;
        if (heap[p][0] <= heap[k][0]) break;
        [heap[p], heap[k]] = [heap[k], heap[p]];
        k = p;
      }
    };
    const pop = (): [number, number] => {
      const top = heap[0];
      const last = heap.pop()!;
      if (heap.length) {
        heap[0] = last;
        let k = 0;
        for (;;) {
          const l = 2 * k + 1;
          const r = l + 1;
          let m = k;
          if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
          if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
          if (m === k) break;
          [heap[m], heap[k]] = [heap[k], heap[m]];
          k = m;
        }
      }
      return top;
    };
    heap.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const steps = [
      [1, 0, 1],
      [-1, 0, 1],
      [0, 1, 1],
      [0, -1, 1],
      [1, 1, Math.SQRT2],
      [1, -1, Math.SQRT2],
      [-1, 1, Math.SQRT2],
      [-1, -1, Math.SQRT2],
    ];
    while (heap.length) {
      const [d, i] = pop();
      if (d > this.dist[i]) continue;
      const r = Math.floor(i / this.cols);
      const c = i - r * this.cols;
      for (const [dc, dr, w] of steps) {
        const cc = c + dc;
        const rr = r + dr;
        if (cc < 0 || rr < 0 || cc >= this.cols || rr >= this.rows) continue;
        const j = rr * this.cols + cc;
        // Diagonal moves only between walkable cells on both sides (no corner cutting).
        if (!walk[j] || (dc && dr && (!walk[r * this.cols + cc] || !walk[rr * this.cols + c]))) continue;
        const nd = d + w * cell;
        if (nd < this.dist[j]) {
          this.dist[j] = nd;
          push(nd, j);
        }
      }
    }
  }

  private index(x: number, y: number): number {
    const c = Math.min(this.cols - 1, Math.max(0, Math.round((x - this.app.bounds.x0) / this.cell)));
    const r = Math.min(this.rows - 1, Math.max(0, Math.round((y - this.app.bounds.y0) / this.cell)));
    return r * this.cols + c;
  }

  /** Path distance to the sources (mm; Infinity off the surface). */
  distanceAt(x: number, y: number): number {
    return this.dist[this.index(x, y)];
  }

  /** Absolute direction (rad) of fastest descent per mm of the path distance at (x, y), or null at a minimum. */
  descentAt(x: number, y: number): number | null {
    const i = this.index(x, y);
    const r = Math.floor(i / this.cols);
    const c = i - r * this.cols;
    const d0 = this.dist[i];
    let best = 0;
    let dir: number | null = null;
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const cc = c + dc;
        const rr = r + dr;
        if (cc < 0 || rr < 0 || cc >= this.cols || rr >= this.rows) continue;
        const rate = (d0 - this.dist[rr * this.cols + cc]) / Math.hypot(dr, dc);
        if (rate > best + 1e-9) {
          best = rate;
          dir = Math.atan2(dr, dc);
        }
      }
    return dir;
  }
}
