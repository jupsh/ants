import { clamp } from '../core/math';
import type { Species } from '../species';

export const enum Stage {
  Egg = 0,
  Larva = 1,
  Pupa = 2,
}

export interface Brood {
  id: number;
  stage: Stage;
  /** Development progress within the current stage, 0..1. */
  progress: number;
  /** Adult body length this individual will have (set when it becomes a larva). */
  targetLen: number;
  /** Protein received (mg) and required (mg) — larvae only. */
  fed: number;
  need: number;
  /** Seconds since last fed (larvae). */
  hunger: number;
  /** Nest voxel where it lies. */
  voxel: number;
  carried: boolean;
  queenBrood: boolean;
}

/**
 * Degree-day development: rate ∝ (T − T0) above the lower threshold,
 * declining linearly to zero between the upper threshold and CTmax.
 * Stage durations are given at the reference temperature.
 */
export function developmentRate(sp: Species, stage: Stage, temp: number): number {
  const d = sp.development;
  const days = stage === Stage.Egg ? d.egg : stage === Stage.Larva ? d.larva : d.pupa;
  const ddRequired = days * (d.refTemp - d.lowerThreshold); // degree-days
  let eff = temp - d.lowerThreshold;
  if (temp > d.upperThreshold) {
    const peak = d.upperThreshold - d.lowerThreshold;
    eff = peak * clamp(1 - (temp - d.upperThreshold) / Math.max(1, sp.locomotion.tempMax - d.upperThreshold), 0, 1);
  }
  if (eff <= 0) return 0;
  return eff / ddRequired / 86400; // progress per second
}
