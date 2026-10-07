/**
 * Counting-sort spatial hash over 2D points, rebuilt every step. Used for
 * encounters between ants (antennation, trophallaxis, recruitment contacts).
 */
export class SpatialHash {
  private cellStart: Int32Array;
  private cellCount: Int32Array;
  private entries: Int32Array;
  private keys: Int32Array;
  readonly cols: number;
  readonly rows: number;
  private n = 0;

  constructor(
    readonly width: number,
    readonly height: number,
    readonly cell: number,
    capacity = 1024,
  ) {
    this.cols = Math.max(1, Math.ceil(width / cell));
    this.rows = Math.max(1, Math.ceil(height / cell));
    this.cellStart = new Int32Array(this.cols * this.rows + 1);
    this.cellCount = new Int32Array(this.cols * this.rows);
    this.entries = new Int32Array(capacity);
    this.keys = new Int32Array(capacity);
  }

  private key(x: number, y: number): number {
    let cx = Math.floor(x / this.cell);
    let cy = Math.floor(y / this.cell);
    if (cx < 0) cx = 0;
    else if (cx >= this.cols) cx = this.cols - 1;
    if (cy < 0) cy = 0;
    else if (cy >= this.rows) cy = this.rows - 1;
    return cy * this.cols + cx;
  }

  /** Rebuild from `count` points; ids are indices into xs/ys. */
  build(xs: ArrayLike<number>, ys: ArrayLike<number>, ids: ArrayLike<number>, count: number): void {
    if (count > this.entries.length) {
      this.entries = new Int32Array(count * 2);
      this.keys = new Int32Array(count * 2);
    }
    this.n = count;
    this.cellCount.fill(0);
    for (let i = 0; i < count; i++) {
      const k = this.key(xs[i], ys[i]);
      this.keys[i] = k;
      this.cellCount[k]++;
    }
    let acc = 0;
    for (let c = 0; c < this.cellCount.length; c++) {
      this.cellStart[c] = acc;
      acc += this.cellCount[c];
    }
    this.cellStart[this.cellCount.length] = acc;
    const fill = this.cellCount;
    fill.fill(0);
    for (let i = 0; i < count; i++) {
      const k = this.keys[i];
      this.entries[this.cellStart[k] + fill[k]++] = ids[i];
    }
  }

  /** Visit ids in cells overlapping the square of half-size r around (x, y). */
  query(x: number, y: number, r: number, visit: (id: number) => void): void {
    if (this.n === 0) return;
    const cx0 = Math.max(0, Math.floor((x - r) / this.cell));
    const cx1 = Math.min(this.cols - 1, Math.floor((x + r) / this.cell));
    const cy0 = Math.max(0, Math.floor((y - r) / this.cell));
    const cy1 = Math.min(this.rows - 1, Math.floor((y + r) / this.cell));
    for (let cy = cy0; cy <= cy1; cy++)
      for (let cx = cx0; cx <= cx1; cx++) {
        const c = cy * this.cols + cx;
        for (let e = this.cellStart[c]; e < this.cellStart[c + 1]; e++) visit(this.entries[e]);
      }
  }
}
