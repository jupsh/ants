/**
 * Synthetic E2 data for the step-3c recovery check (STATUS 2026-10-09,
 * frozen pre-registration): whole simulated scouts from a fitted candidate,
 * through the same protocol and observer (paired drops, drop-2 timing,
 * volume-estimate noise, only scouts that drank are observed), at the real
 * sample sizes per condition; each target is recomputed from them with the
 * data's own summary (mean ± SD/√n, binomial proportion, regression slope
 * and Spearman r with the same SE formulas). Seeds from 4.1e9, out of the
 * fits' reach (< 3.1e9; STATUS 2026-10-09, seed collisions).
 */
import { binomialSE } from '../src/sim/analysis/compare';
import type { LasiusParams, ScoutResult } from '../src/sim/experiments/e2Mailleux';
import { E2_CONDITIONS, E2_TARGETS, type ScoutRunner, type Target } from '../src/sim/experiments/e2Targets';
import { E2_LEGACY_FORAGER, LASIUS_MORPH, E2_LEGACY_PHYS, LASIUS_WALK } from '../src/sim/species/lasiusM1';

/** Scouts per condition in the data (largest n among its targets; two drops: 63 found both of > 95 %, so 66 tested). */
const DATA_N: Record<string, number> = { d1: 67, d4: 141, d8: 97, two: 66 };

/** The model of a step-3c fit file. */
export function modelOf(fit: any): { P: LasiusParams; setup: { accessible: number; volumeSd: number; desiredScale2009?: number } } {
  return {
    P: { walk: LASIUS_WALK, forager: { ...E2_LEGACY_FORAGER, ...fit.forager }, phys: { ...E2_LEGACY_PHYS, ...fit.phys }, morph: LASIUS_MORPH },
    setup: { accessible: fit.pipetteAccessible, volumeSd: fit.observer.volumeSd, ...(fit.desiredScale2009 !== undefined ? { desiredScale2009: fit.desiredScale2009 } : {}) },
  };
}

export async function syntheticTargets(fit: any, rep: number, run: ScoutRunner, n: Record<string, number> = DATA_N, seed0 = 4_100_000_000): Promise<Target[]> {
  const { P, setup } = modelOf(fit);
  const values: Record<string, number[]> = {};
  for (const [i, c] of E2_CONDITIONS.entries()) {
    const rs = ((await run(P, c.options(n[c.id], seed0 + 1_000_000 * rep + 100_000 * i, setup, 0.1))) as ScoutResult[]).filter((r) => r.drinks.length);
    Object.assign(values, c.metrics(rs));
  }
  const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const sd = (xs: number[]) => Math.sqrt(xs.reduce((a, x) => a + (x - mean(xs)) ** 2, 0) / Math.max(1, xs.length - 1));
  const vtN = 2 * (values['two.ul2']?.length ?? 0);
  return E2_TARGETS.map((t): Target => {
    const xs = values[t.id] ?? [];
    if (t.id === 'two.vtRs1' || t.id === 'two.vtRs2') return { ...t, value: xs[0], se: Math.sqrt(1.06 / (vtN / 2 - 3)), n: vtN / 2 };
    if (t.id === 'two.vtSlope' || t.id === 'two.vtRs') {
      const r = values['two.vtRs'][0];
      const v = xs[0];
      const se = t.id === 'two.vtSlope' ? Math.abs(v) * Math.sqrt((1 - r * r) / (r * r * (vtN - 2))) : (1 - r * r) / Math.sqrt(vtN - 3);
      return { ...t, value: v, se, n: vtN };
    }
    if (t.sd === undefined) {
      const p = mean(xs);
      return { ...t, value: p, se: binomialSE(p, xs.length), n: xs.length };
    }
    return { ...t, value: mean(xs), sd: sd(xs), se: sd(xs) / Math.sqrt(xs.length), n: xs.length };
  });
}
