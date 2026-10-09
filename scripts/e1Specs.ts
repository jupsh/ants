/**
 * Bounded parameter specs of the E1 fits (moved unchanged from fitE1.ts,
 * STATUS 2026-10-09, so the reachability sweep samples exactly the fit's
 * ranges). `log`: lo·(hi/lo)^u, `lin`: lo + (hi − lo)·u, with u = sigm(x).
 */
import type { WalkParams } from '../src/sim/models/walk';

export const logit = (p: number) => Math.log(p / (1 - p));
export const sigm = (x: number) => 1 / (1 + Math.exp(-x));

export type Spec = [keyof WalkParams, 'log' | 'lin', number, number];

/** Stage-1 (flat) and stage-2 (slope) parameters fitted for a variant (A0, B, T). */
export function specsFor(VARIANT: string): { S1: Spec[]; S2: Spec[] } {
  const TIME_TURNING = VARIANT === 'B' || VARIANT === 'T';
  const S1: Spec[] = [
    ['speed', 'log', 10, 150], // mm/s
    ['speedSdBetween', 'log', 0.01, 1.5],
    ['speedSdWithin', 'log', 0.01, 1.5],
    ['speedTau', 'log', 0.05, 20], // s
    ['pauseRate', 'log', 1e-3, 2], // 1/s
    ['pauseMean', 'log', 0.05, 10], // s
    ['meanFreePath', 'log', 1, 500], // mm
    ['jitter', 'log', 1e-5, 0.05], // rad²/mm
    ['homeRange', 'log', 10, 1000], // mm
    ['homeRunBias', 'lin', -3, 3],
    ['g', 'lin', 0, 1],
    ['homeHeadingPull', 'lin', 0, 1],
    ...(TIME_TURNING
      ? ([
          ['jitterTime', 'log', 1e-3, 5], // rad²/s
          ['turnRateTime', 'log', 0.01, 30], // 1/s
        ] as Spec[])
      : []),
    ...(VARIANT === 'T'
      ? ([
          ['turnDipTau', 'log', 0.02, 5], // s
          ['turnDip', 'lin', 0, 0.99],
          ['stopTurnG', 'lin', 0, 1],
          ['stopHomePull', 'lin', 0, 1],
        ] as Spec[])
      : []),
  ];
  const S2: Spec[] = [
    ['slopeSpeedK', 'log', 0.01, 0.9], // 1/rad; speed factor max(0.05, 1 − kθ) reaches its floor at 60° for k ≈ 0.91
    ['geoRunGain', 'log', 1e-4, 3], // 1/rad
    ['geoHeadingPull', 'lin', 0, 1],
    ['slopePauseK', 'lin', -3, 4], // 1/rad, rate × exp(kθ)
    ['slopeSpeedSdK', 'lin', -2, 2], // 1/rad, SD × exp(kθ): at most ×8 at 60°
    ...(VARIANT === 'A0' ? ([['slopeJitterK', 'lin', -3, 4]] as Spec[]) : []),
  ];
  return { S1, S2 };
}

export const encode = (specs: Spec[]) => (q: WalkParams) =>
  specs.map(([k, kind, lo, hi]) => {
    const u = kind === 'log' ? Math.log(q[k] / lo) / Math.log(hi / lo) : (q[k] - lo) / (hi - lo);
    return logit(Math.min(0.999, Math.max(1e-3, u)));
  });
export const decode =
  (specs: Spec[]) =>
  (x: number[], base: WalkParams): WalkParams => {
    const q = { ...base };
    specs.forEach(([k, kind, lo, hi], i) => {
      const u = sigm(x[i]);
      q[k] = kind === 'log' ? lo * (hi / lo) ** u : lo + (hi - lo) * u;
    });
    return q;
  };
/** Parameters within 1 % of a limit (log scale for `log`). */
export const atLimit = (specs: Spec[], q: WalkParams) =>
  specs.filter(([k, kind, lo, hi]) => {
    const u = kind === 'log' ? Math.log(q[k] / lo) / Math.log(hi / lo) : (q[k] - lo) / (hi - lo);
    return u < 0.01 || u > 0.99;
  }).map(([k]) => k);
