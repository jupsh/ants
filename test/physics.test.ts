import { describe, expect, it } from 'vitest';
import { RNG } from '../src/sim/core/rng';
import { SoilColumn } from '../src/sim/env/soilHeat';
import { PheromoneField } from '../src/sim/world/field';
import { AlarmField } from '../src/sim/world/plumes';

describe('RNG', () => {
  it('wrapped Cauchy has mean cosine rho', () => {
    const r = new RNG(7);
    for (const rho of [0.2, 0.6, 0.9]) {
      let s = 0;
      const n = 200_000;
      for (let i = 0; i < n; i++) s += Math.cos(r.wrappedCauchy(rho));
      expect(s / n).toBeCloseTo(rho, 2);
    }
  });

  it('derived streams are reproducible and distinct', () => {
    const a = RNG.stream(1, 5).next();
    expect(RNG.stream(1, 5).next()).toBe(a);
    expect(RNG.stream(1, 6).next()).not.toBe(a);
    expect(RNG.stream(2, 5).next()).not.toBe(a);
  });

  it('hazard events follow the exponential law independent of dt', () => {
    const rate = 0.5;
    for (const dt of [0.01, 0.1]) {
      const r = new RNG(3);
      let sum = 0;
      const n = 20000;
      for (let i = 0; i < n; i++) {
        let t = 0;
        while (!r.hazard(rate, dt)) t += dt;
        sum += t + dt;
      }
      expect(sum / n).toBeGreaterThan((1 / rate) * 0.95);
      expect(sum / n).toBeLessThan((1 / rate) * 1.05 + dt);
    }
  });
});

describe('soil heat conduction', () => {
  it('matches the analytic damping and lag of a sinusoidal surface wave', () => {
    const kappa = 0.5; // mm²/s
    const omega = (2 * Math.PI) / 86400;
    const D = Math.sqrt((2 * kappa) / omega); // damping depth
    const col = new SoilColumn(1500, kappa, 20, 5);
    const A = 10;
    // Spin up 8 days.
    for (let t = 0; t < 8 * 86400; t += 60) col.step(60, 20 + A * Math.sin(omega * t), 20);
    // Sample amplitude at depth D over one more day.
    let max = -Infinity;
    let min = Infinity;
    let tMax = 0;
    for (let t = 8 * 86400; t < 9 * 86400; t += 60) {
      col.step(60, 20 + A * Math.sin(omega * t), 20);
      const v = col.at(D);
      if (v > max) {
        max = v;
        tMax = t;
      }
      min = Math.min(min, v);
    }
    const amp = (max - min) / 2;
    expect(amp / A).toBeCloseTo(Math.exp(-1), 1); // e^{-z/D} at z = D
    // Phase lag z/D radians = 1 rad ≈ 3.82 h after the surface maximum.
    const surfacePeak = 8 * 86400 + 86400 / 4;
    const lagH = (((tMax - surfacePeak) % 86400) + 86400) % 86400 / 3600;
    expect(lagH).toBeGreaterThan(3.3);
    expect(lagH).toBeLessThan(4.4);
  });
});

describe('pheromone field', () => {
  it('decays exponentially with the specified lifetime, across renormalisations', () => {
    const tau = 100;
    const f = new PheromoneField(10, 10, 1, tau);
    f.setTime(0);
    f.deposit(5, 5, 1, 1);
    const c0 = f.sample(5, 5);
    for (const t of [50, 100, 400, 3000, 3100]) {
      f.setTime(t);
      const expected = c0 * Math.exp(-t / tau);
      if (expected < 1e-6 * c0) continue;
      expect(f.sample(5, 5) / expected).toBeCloseTo(1, 3);
    }
  });

  it('deposits are additive and conserved per unit length', () => {
    const f = new PheromoneField(50, 50, 2, 1e9);
    f.setTime(0);
    // Walk 40 mm along x depositing 1 unit/mm in 0.5 mm steps.
    for (let x = 10; x < 50; x += 0.5) f.deposit(x, 20.3, 1, 0.5);
    let total = 0;
    for (let i = 0; i < 2500; i++) total += f.cellValue(i);
    // Cell values are per mm of trail: total × cell size = deposited amount.
    expect(total * 2).toBeCloseTo(40, 4); // float32 storage
  });
});

describe('alarm plume (Bossert & Wilson 1963)', () => {
  it('has the calibrated maximum active-space radius and fade time', () => {
    const R = 60;
    const fade = 35;
    const a = new AlarmField(R, fade);
    a.release(0, 0, 0, 0);
    let maxR = 0;
    for (let t = 0.5; t < 40; t += 0.25)
      for (let r = 0; r < 120; r += 0.5) if (a.at(r, 0, 0, t) >= 1) maxR = Math.max(maxR, r);
    expect(maxR).toBeGreaterThan(R * 0.95);
    expect(maxR).toBeLessThan(R * 1.05);
    expect(a.at(0, 0, 0, fade * 0.98)).toBeGreaterThan(1);
    expect(a.at(0, 0, 0, fade * 1.02)).toBeLessThan(1);
  });
});
