import { estimated } from '../core/param';

/** Numerical demonstration only; choosing a biological footprint needs the user. */
export const PROVISIONAL_TRAIL_SAMPLING_SIGMA = estimated(
  0.5, 'mm',
  'Provisional Gaussian antenna-sampling sigma for the B017 convergence check, chosen to resolve a fixed physical footprint on the tested grids. No biological measurement; not adopted and never enabled by default.',
);

/**
 * A pheromone field on the surface grid with exponential decay
 * C(t) = C0·exp(−(t − t0)/τ).
 *
 * Decay is applied lazily: values are stored scaled by exp(+(t_dep − base)/τ),
 * so the true concentration everywhere is `stored · exp(−(now − base)/τ)` — a
 * single global factor. The grid is renormalised when that factor gets small,
 * so cost per step is O(1) regardless of grid size.
 */
export class PheromoneField {
  readonly data: Float32Array;
  private base = 0;
  private now = 0;
  private scale = 1; // exp(-(now-base)/tau)
  private readonly invTau: number;
  /** Concentration units are "per mm of trail": deposits are divided by cell size. */
  constructor(
    readonly w: number,
    readonly h: number,
    readonly cell: number,
    readonly tau: number,
    /** Gaussian sampling sigma in mm; 0 preserves the legacy point sampler. */
    readonly samplingSigmaMm = 0,
  ) {
    if (!Number.isFinite(samplingSigmaMm) || samplingSigmaMm < 0)
      throw new RangeError('samplingSigmaMm must be finite and non-negative');
    this.data = new Float32Array(w * h);
    this.invTau = 1 / tau;
  }

  setTime(t: number): void {
    this.now = t;
    const age = (t - this.base) * this.invTau;
    if (age > 30) this.renormalise();
    this.scale = Math.exp(-(this.now - this.base) * this.invTau);
  }

  private renormalise(): void {
    const f = Math.exp(-(this.now - this.base) * this.invTau);
    const d = this.data;
    for (let i = 0; i < d.length; i++) {
      const v = d[i] * f;
      d[i] = v < 1e-6 ? 0 : v;
    }
    this.base = this.now;
  }

  /** Current signal at (x, y) in mm; the physical footprint is opt-in. */
  sample(x: number, y: number): number {
    if (this.samplingSigmaMm > 0) return this.sampleFootprint(x, y);
    const gx = x / this.cell - 0.5;
    const gy = y / this.cell - 0.5;
    let ix = Math.floor(gx);
    let iy = Math.floor(gy);
    const fx = gx - ix;
    const fy = gy - iy;
    const w = this.w;
    const h = this.h;
    if (ix < 0 || iy < 0 || ix >= w - 1 || iy >= h - 1) {
      ix = ix < 0 ? 0 : ix >= w ? w - 1 : ix;
      iy = iy < 0 ? 0 : iy >= h ? h - 1 : iy;
      return this.data[iy * w + ix] * this.scale;
    }
    const i = iy * w + ix;
    const d = this.data;
    const a = d[i] + (d[i + 1] - d[i]) * fx;
    const b = d[i + w] + (d[i + w + 1] - d[i + w]) * fx;
    return (a + (b - a) * fy) * this.scale;
  }

  /**
   * Integrate deposited amount against a Gaussian footprint. Stored cell
   * values times cell size are amounts, so this is independent of grid size
   * in the refinement limit. The kernel is exp(-r²/(2σ²))/(sqrt(2π)σ):
   * a straight infinite trail laid at 1 unit/mm tends to centreline signal 1.
   * Thus the signal retains the legacy units/mm convention, rather than
   * silently turning trailThreshold into an areal-density threshold.
   *
   * Truncate each axis at 4σ (omits <0.013% of the 2-D Gaussian integral).
   * The domain is zero-padded, without renormalising at its edges. Neither
   * boundary deposition nor the existing late-decay cutoff is changed.
   */
  private sampleFootprint(x: number, y: number): number {
    const sigma = this.samplingSigmaMm;
    const radius = 4 * sigma;
    const c = this.cell;
    const x0 = Math.max(0, Math.ceil((x - radius) / c - 0.5));
    const x1 = Math.min(this.w - 1, Math.floor((x + radius) / c - 0.5));
    const y0 = Math.max(0, Math.ceil((y - radius) / c - 0.5));
    const y1 = Math.min(this.h - 1, Math.floor((y + radius) / c - 0.5));
    const inv2s2 = 1 / (2 * sigma * sigma);
    let sum = 0;
    for (let j = y0; j <= y1; j++) {
      const dy = (j + 0.5) * c - y;
      const wy = Math.exp(-dy * dy * inv2s2);
      for (let i = x0; i <= x1; i++) {
        const dx = (i + 0.5) * c - x;
        sum += this.data[j * this.w + i] * wy * Math.exp(-dx * dx * inv2s2);
      }
    }
    return sum * this.scale * c / (Math.sqrt(2 * Math.PI) * sigma);
  }

  /** Add `amount` (units per mm of trail) at (x, y), split bilinearly. */
  deposit(x: number, y: number, amountPerMm: number, lengthMm: number): void {
    const gx = x / this.cell - 0.5;
    const gy = y / this.cell - 0.5;
    const ix = Math.floor(gx);
    const iy = Math.floor(gy);
    if (ix < 0 || iy < 0 || ix >= this.w - 1 || iy >= this.h - 1) return;
    const fx = gx - ix;
    const fy = gy - iy;
    // Concentration over a cell = deposited trail length × amount / cell size.
    const q = ((amountPerMm * lengthMm) / this.cell) / this.scale;
    const i = iy * this.w + ix;
    const d = this.data;
    d[i] += q * (1 - fx) * (1 - fy);
    d[i + 1] += q * fx * (1 - fy);
    d[i + this.w] += q * (1 - fx) * fy;
    d[i + this.w + 1] += q * fx * fy;
  }

  /** Current concentration of cell index i (for rendering). */
  cellValue(i: number): number {
    return this.data[i] * this.scale;
  }

  get currentScale(): number {
    return this.scale;
  }

  clearDisc(x: number, y: number, r: number): void {
    const c = this.cell;
    const x0 = Math.max(0, Math.floor((x - r) / c));
    const x1 = Math.min(this.w - 1, Math.ceil((x + r) / c));
    const y0 = Math.max(0, Math.floor((y - r) / c));
    const y1 = Math.min(this.h - 1, Math.ceil((y + r) / c));
    for (let j = y0; j <= y1; j++)
      for (let i = x0; i <= x1; i++) {
        const dx = (i + 0.5) * c - x;
        const dy = (j + 0.5) * c - y;
        if (dx * dx + dy * dy <= r * r) this.data[j * this.w + i] = 0;
      }
  }
}
