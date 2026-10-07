/**
 * Alarm pheromone as instantaneous point releases diffusing in a half-space
 * (Bossert & Wilson 1963):
 *   C(r, t) = 2Q / (4πDt)^{3/2} · exp(−r² / 4Dt)
 * Calibrated per species from two observables, the maximum radius of the
 * active space (C ≥ K) and the fade-out time:
 *   D   = e·R² / (6·t_fade)
 *   Q/K = (4πD·t_fade)^{3/2} / 2
 * Concentrations returned are normalised by the response threshold K, so a
 * value ≥ 1 means "inside the active space".
 */
export interface Plume {
  x: number;
  y: number;
  z: number;
  t0: number;
  strength: number; // multiples of the calibrated release
}

export class AlarmField {
  readonly D: number;
  readonly QoverK: number;
  readonly fade: number;
  plumes: Plume[] = [];

  constructor(radius: number, fade: number) {
    this.fade = fade;
    this.D = (Math.E * radius * radius) / (6 * fade);
    this.QoverK = Math.pow(4 * Math.PI * this.D * fade, 1.5) / 2;
  }

  release(x: number, y: number, z: number, t: number, strength = 1): void {
    this.plumes.push({ x, y, z, t0: t, strength });
  }

  prune(now: number): void {
    // A release of strength s fades at t_fade · s^{2/3}.
    this.plumes = this.plumes.filter((p) => now - p.t0 < this.fade * Math.pow(p.strength, 2 / 3) * 1.05);
  }

  /** Normalised concentration C/K at a point. */
  at(x: number, y: number, z: number, now: number): number {
    let c = 0;
    for (const p of this.plumes) {
      const t = now - p.t0;
      if (t <= 0.05) continue;
      const dx = x - p.x;
      const dy = y - p.y;
      const dz = z - p.z;
      const r2 = dx * dx + dy * dy + dz * dz;
      const fourDt = 4 * this.D * t;
      if (r2 > fourDt * 12) continue;
      c += (2 * this.QoverK * p.strength) / Math.pow(Math.PI * fourDt, 1.5) * Math.exp(-r2 / fourDt);
    }
    return c;
  }

  /** Gradient direction (unnormalised) of concentration at a point. */
  gradient(x: number, y: number, z: number, now: number): [number, number] {
    let gx = 0;
    let gy = 0;
    for (const p of this.plumes) {
      const t = now - p.t0;
      if (t <= 0.05) continue;
      const dx = x - p.x;
      const dy = y - p.y;
      const dz = z - p.z;
      const r2 = dx * dx + dy * dy + dz * dz;
      const fourDt = 4 * this.D * t;
      if (r2 > fourDt * 12) continue;
      const c = (2 * this.QoverK * p.strength) / Math.pow(Math.PI * fourDt, 1.5) * Math.exp(-r2 / fourDt);
      gx += (-2 * dx * c) / fourDt;
      gy += (-2 * dy * c) / fourDt;
    }
    return [gx, gy];
  }
}
