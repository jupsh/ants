/** 32-bit mix (splitmix-style) for deriving independent stream seeds. */
function mix32(h: number): number {
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return (h ^ (h >>> 16)) >>> 0;
}

/**
 * Seeded pseudo-random generator (mulberry32). All stochasticity in the
 * simulation must come from an instance of this class so runs are reproducible.
 */
export class RNG {
  /**
   * Independent stream derived from a base seed and integer keys (e.g. an
   * agent id). Giving every agent its own stream makes each agent's random
   * draws independent of the order in which agents are updated.
   */
  static stream(seed: number, ...keys: number[]): RNG {
    let h = mix32(seed ^ 0x9e3779b9);
    for (const k of keys) h = mix32(h ^ mix32(k + 0x7f4a7c15));
    return new RNG(h || 1);
  }

  private s: number;
  private spare: number | null = null;

  constructor(seed = 1) {
    this.s = seed >>> 0 || 1;
  }

  /** Uniform in [0, 1). */
  next(): number {
    let t = (this.s = (this.s + 0x6d2b79f5) >>> 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  range(a: number, b: number): number {
    return a + (b - a) * this.next();
  }

  int(n: number): number {
    return Math.floor(this.next() * n);
  }

  chance(p: number): boolean {
    return this.next() < p;
  }

  /** Standard normal deviate (Marsaglia polar method). */
  gauss(): number {
    if (this.spare !== null) {
      const g = this.spare;
      this.spare = null;
      return g;
    }
    let u: number, v: number, s: number;
    do {
      u = this.next() * 2 - 1;
      v = this.next() * 2 - 1;
      s = u * u + v * v;
    } while (s >= 1 || s === 0);
    const m = Math.sqrt((-2 * Math.log(s)) / s);
    this.spare = v * m;
    return u * m;
  }

  normal(mean: number, sd: number): number {
    return mean + sd * this.gauss();
  }

  /** Exponential deviate with the given mean. */
  exp(mean: number): number {
    return -Math.log(1 - this.next()) * mean;
  }

  lognormal(median: number, sigma: number): number {
    return median * Math.exp(sigma * this.gauss());
  }

  /** Poisson deviate (Knuth for small means, normal approximation otherwise). */
  poisson(mean: number): number {
    if (mean <= 0) return 0;
    if (mean > 30) return Math.max(0, Math.round(this.normal(mean, Math.sqrt(mean))));
    const L = Math.exp(-mean);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= this.next();
    } while (p > L);
    return k - 1;
  }

  /** Probability that an event with constant hazard `rate` (1/s) occurs within dt. */
  hazard(rate: number, dt: number): boolean {
    return this.next() < 1 - Math.exp(-rate * dt);
  }

  /** Wrapped Cauchy deviate centred on 0 with mean resultant length rho (= ⟨cos θ⟩). */
  wrappedCauchy(rho: number): number {
    if (rho <= 0) return (this.next() * 2 - 1) * Math.PI;
    if (rho >= 1) return 0;
    const u = this.next();
    return 2 * Math.atan(((1 - rho) / (1 + rho)) * Math.tan(Math.PI * (u - 0.5)));
  }

  pick<T>(arr: readonly T[]): T {
    return arr[this.int(arr.length)];
  }

  /** Random unit angle in radians. */
  angle(): number {
    return this.next() * Math.PI * 2;
  }

  /**
   * A new, independent stream derived from this one's current state and
   * `key` (this stream is not advanced). Used when a simulation is copied,
   * so that copies keyed differently do not replay the same draws.
   */
  fork(key: number): RNG {
    return RNG.stream(this.s, key, this.spare === null ? 0 : 1);
  }

  getState(): number {
    return this.s;
  }

  setState(s: number): void {
    this.s = s >>> 0;
    this.spare = null;
  }
}
