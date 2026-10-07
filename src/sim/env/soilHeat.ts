/**
 * One-dimensional soil heat conduction, dT/dt = κ d²T/dz², forced at the
 * surface by the diel surface temperature and held at the daily-mean
 * temperature at the bottom boundary. Produces the exponential damping and
 * phase lag of temperature waves with depth (damping depth √(2κ/ω) ≈ 10–13 cm
 * for typical soils).
 */
export class SoilColumn {
  readonly dz: number;
  readonly n: number;
  readonly T: Float64Array;
  private readonly tmp: Float64Array;

  constructor(
    readonly depth: number, // mm
    readonly kappa: number, // mm²/s
    initial: number,
    dz = 5,
  ) {
    this.dz = dz;
    this.n = Math.ceil(depth / dz) + 1;
    this.T = new Float64Array(this.n).fill(initial);
    this.tmp = new Float64Array(this.n);
  }

  /** Advance by dt seconds with surface temperature `surface` and bottom `bottom`. */
  step(dt: number, surface: number, bottom: number): void {
    const maxDt = (0.45 * this.dz * this.dz) / this.kappa;
    const sub = Math.max(1, Math.ceil(dt / maxDt));
    const h = dt / sub;
    const r = (this.kappa * h) / (this.dz * this.dz);
    const T = this.T;
    const U = this.tmp;
    for (let s = 0; s < sub; s++) {
      T[0] = surface;
      T[this.n - 1] = bottom;
      for (let i = 1; i < this.n - 1; i++) U[i] = T[i] + r * (T[i - 1] - 2 * T[i] + T[i + 1]);
      for (let i = 1; i < this.n - 1; i++) T[i] = U[i];
    }
  }

  /** Temperature at depth z (mm below surface), linear interpolation. */
  at(z: number): number {
    if (z <= 0) return this.T[0];
    const f = z / this.dz;
    const i = Math.floor(f);
    if (i >= this.n - 1) return this.T[this.n - 1];
    const w = f - i;
    return this.T[i] * (1 - w) + this.T[i + 1] * w;
  }
}
