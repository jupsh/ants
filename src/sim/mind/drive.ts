import type { RNG } from '../core/rng';
import type { Mind } from './mind';

/**
 * Latent activity drive (STATUS 2026-10-18 ≈ 01:43 / 01:46, candidate C2;
 * design `docs/research/latent-activity-design.md`, stage 1). Each ant
 * carries a unit-variance Ornstein–Uhlenbeck state z (`m.drive`) with
 * correlation time τ; its role's walk-on rate is multiplied by
 * exp(σ z − σ²/2), stationary mean one. The unit process does not depend on
 * σ, so a fit varying σ keeps common random numbers.
 */

/**
 * Advance the drive by dt (exact OU update, k = e^(−dt/τ)); the first call
 * draws z from the stationary distribution. Called once per step by the
 * runner for every ant, wherever it is, with the ant's own drive stream.
 */
export function stepDrive(m: Mind, tau: number, dt: number, rng: RNG): void {
  if (m.drive === undefined) {
    m.drive = rng.normal(0, 1);
    return;
  }
  const k = Math.exp(-dt / tau);
  m.drive = m.drive * k + Math.sqrt(1 - k * k) * rng.normal(0, 1);
}

/** Walk-on multiplier of the drive at SD `sd` (1 when off or not started). */
export const driveFactor = (m: Mind, sd: number): number => (sd > 0 && m.drive !== undefined ? Math.exp(sd * m.drive - (sd * sd) / 2) : 1);
