/**
 * Dense 3D voxel grid for the nest volume. Only air voxels take part in
 * navigation; they are kept in a compact index so that breadth-first distance
 * fields cost O(air voxels), not O(volume).
 */
export const enum Mat {
  Air = 0,
  Soil = 1,
  Rock = 2,
  Thatch = 3,
  Sky = 4,
  Wall = 5,
}

/** 26-neighbourhood offsets. */
const OFFSETS: [number, number, number][] = [];
for (let dz = -1; dz <= 1; dz++) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (dx || dy || dz) OFFSETS.push([dx, dy, dz]);
const FACE_OFFSETS: [number, number, number][] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

export const UNREACHABLE = 0xffff;

export class NestGrid {
  readonly mat: Uint8Array;
  /** Compact id for air voxels, -1 otherwise. */
  readonly airId: Int32Array;
  /** Voxel index of each compact air id. */
  airList: Int32Array;
  airCount = 0;
  /** Bumped on every structural change. */
  version = 0;
  readonly sx: number;
  readonly sy: number;

  constructor(
    readonly nx: number,
    readonly ny: number,
    readonly nz: number,
    readonly voxel: number,
    /** World coordinates of the voxel-grid corner (min x, min y, min z). */
    readonly ox: number,
    readonly oy: number,
    readonly oz: number,
  ) {
    const n = nx * ny * nz;
    this.mat = new Uint8Array(n).fill(Mat.Soil);
    this.airId = new Int32Array(n).fill(-1);
    this.airList = new Int32Array(1024);
    this.sx = nx;
    this.sy = nx * ny;
  }

  get size(): number {
    return this.nx * this.ny * this.nz;
  }

  idx(i: number, j: number, k: number): number {
    return k * this.sy + j * this.sx + i;
  }

  inBounds(i: number, j: number, k: number): boolean {
    return i >= 0 && j >= 0 && k >= 0 && i < this.nx && j < this.ny && k < this.nz;
  }

  coords(v: number): [number, number, number] {
    const k = Math.floor(v / this.sy);
    const r = v - k * this.sy;
    const j = Math.floor(r / this.sx);
    return [r - j * this.sx, j, k];
  }

  /** World-space centre of voxel v. */
  center(v: number): [number, number, number] {
    const [i, j, k] = this.coords(v);
    return [this.ox + (i + 0.5) * this.voxel, this.oy + (j + 0.5) * this.voxel, this.oz + (k + 0.5) * this.voxel];
  }

  voxelAt(x: number, y: number, z: number): number {
    const i = Math.floor((x - this.ox) / this.voxel);
    const j = Math.floor((y - this.oy) / this.voxel);
    const k = Math.floor((z - this.oz) / this.voxel);
    if (!this.inBounds(i, j, k)) return -1;
    return this.idx(i, j, k);
  }

  isAir(v: number): boolean {
    return v >= 0 && this.mat[v] === Mat.Air;
  }

  /** Set material without updating the air index (bulk generation). */
  setRaw(v: number, m: Mat): void {
    this.mat[v] = m;
  }

  /** Rebuild the compact air index from scratch. */
  reindex(): void {
    this.airId.fill(-1);
    let count = 0;
    for (let v = 0; v < this.mat.length; v++) if (this.mat[v] === Mat.Air) count++;
    this.airList = new Int32Array(Math.max(1024, count * 2));
    this.airCount = 0;
    for (let v = 0; v < this.mat.length; v++)
      if (this.mat[v] === Mat.Air) {
        this.airId[v] = this.airCount;
        this.airList[this.airCount++] = v;
      }
    this.version++;
  }

  /** Turn a solid voxel into air (excavation). */
  excavate(v: number): void {
    if (this.mat[v] === Mat.Air) return;
    this.mat[v] = Mat.Air;
    if (this.airCount >= this.airList.length) {
      const grown = new Int32Array(this.airList.length * 2);
      grown.set(this.airList);
      this.airList = grown;
    }
    this.airId[v] = this.airCount;
    this.airList[this.airCount++] = v;
    this.version++;
  }

  /** Turn an air voxel solid (construction). Swap-removes from the air index. */
  fill(v: number, m: Mat): void {
    if (this.mat[v] !== Mat.Air) return;
    this.mat[v] = m;
    const id = this.airId[v];
    const last = this.airList[this.airCount - 1];
    this.airList[id] = last;
    this.airId[last] = id;
    this.airId[v] = -1;
    this.airCount--;
    this.version++;
  }

  /** Visit air neighbours of v that can be walked to (no corner cutting through solid). */
  forNeighbours(v: number, visit: (n: number) => void): void {
    const [i, j, k] = this.coords(v);
    for (const [dx, dy, dz] of OFFSETS) {
      const a = i + dx;
      const b = j + dy;
      const c = k + dz;
      if (!this.inBounds(a, b, c)) continue;
      const n = this.idx(a, b, c);
      if (this.mat[n] !== Mat.Air) continue;
      const diag = (dx !== 0 ? 1 : 0) + (dy !== 0 ? 1 : 0) + (dz !== 0 ? 1 : 0);
      if (diag > 1) {
        // Require at least one face-adjacent intermediate to be open.
        let ok = false;
        if (dx && this.mat[this.idx(i + dx, j, k)] === Mat.Air) ok = true;
        else if (dy && this.mat[this.idx(i, j + dy, k)] === Mat.Air) ok = true;
        else if (dz && this.mat[this.idx(i, j, k + dz)] === Mat.Air) ok = true;
        if (!ok) continue;
      }
      visit(n);
    }
  }

  /** Visit solid face-neighbours of an air voxel (diggable faces). */
  forFaceNeighbours(v: number, visit: (n: number, dx: number, dy: number, dz: number) => void): void {
    const [i, j, k] = this.coords(v);
    for (const [dx, dy, dz] of FACE_OFFSETS) {
      const a = i + dx;
      const b = j + dy;
      const c = k + dz;
      if (!this.inBounds(a, b, c)) continue;
      visit(this.idx(a, b, c), dx, dy, dz);
    }
  }

  /** Number of air voxels among the 26 neighbours (openness). */
  openness(v: number): number {
    const [i, j, k] = this.coords(v);
    let n = 0;
    for (const [dx, dy, dz] of OFFSETS) {
      const a = i + dx;
      const b = j + dy;
      const c = k + dz;
      if (this.inBounds(a, b, c) && this.mat[this.idx(a, b, c)] === Mat.Air) n++;
    }
    return n;
  }

  /** True if the voxel directly below v is solid (v is a floor voxel). */
  onFloor(v: number): boolean {
    const [i, j, k] = this.coords(v);
    if (k === 0) return true;
    return this.mat[this.idx(i, j, k - 1)] !== Mat.Air;
  }

  /** Breadth-first distance (in steps) from a set of air voxels, over air voxels. */
  distanceField(sources: Iterable<number>, out?: Uint16Array): Uint16Array {
    const n = this.airCount;
    const field = out && out.length >= n ? out : new Uint16Array(Math.max(n, 16));
    field.fill(UNREACHABLE);
    const queue = new Int32Array(n);
    let head = 0;
    let tail = 0;
    for (const v of sources) {
      const id = this.airId[v];
      if (id < 0 || field[id] === 0) continue;
      field[id] = 0;
      queue[tail++] = v;
    }
    while (head < tail) {
      const v = queue[head++];
      const d = field[this.airId[v]] + 1;
      this.forNeighbours(v, (nb) => {
        const id = this.airId[nb];
        if (field[id] > d) {
          field[id] = d;
          queue[tail++] = nb;
        }
      });
    }
    return field;
  }
}
