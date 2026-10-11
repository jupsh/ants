import { GROUPS, PHASES, type Group, type RowEstimate } from '../analysis/inNest';
import type { NestParams } from '../behavior/lasiusNestWorker';
import type { ColonyParams } from './colonyBles';

/**
 * Step 4b (STATUS 2026-10-11): in-nest motion fitted to the Stroeymeyt et
 * al. 2018 fit colonies. Rows, free parameters and bounds are defined here
 * once for the fit, the checks and the tests.
 */

/** Per group × phase (32 fit rows); medians left out (0.5 s steps, flat for an optimiser). */
export const S2018_ROW_STATS = ['still', 'speedMove', 'runStill.mean', 'runStill.P2', 'runStill.P10', 'runStill.P60', 'runMove.mean', 'runMove.P2'] as const;

export interface S2018Target {
  /** Data row id, e.g. `still.nurse.dark`. */
  id: string;
  /** Row id in a simulated run: the model has no phase dependence in the nest, so one simulated window (labelled light) serves both phases. */
  simId: string;
  mean: number;
  se: number;
}

/** Fit targets from the across-colony estimates of `data/reference/stroeymeyt2018-fit-rows.json`. */
export function s2018Targets(across: Record<string, RowEstimate>): S2018Target[] {
  const out: S2018Target[] = [];
  for (const s of S2018_ROW_STATS)
    for (const g of GROUPS)
      for (const p of PHASES) {
        const id = `${s}.${g}.${p}`;
        const e = across[id];
        if (!e || !Number.isFinite(e.mean) || !(e.se > 0)) throw new Error(`Stroeymeyt target ${id} missing`);
        out.push({ id, simId: `${s}.${g}.light`, mean: e.mean, se: e.se });
      }
  return out;
}

type MotionKey = 'nestSpeedFactor' | 'activeToRest' | 'restToActive' | 'nestPauseFactor';

export interface S2018Free {
  key: string;
  lo: number;
  hi: number;
  log: boolean;
  get: (n: NestParams) => number;
  set: (n: NestParams, v: number) => NestParams;
}

const perGroup = (g: Group, k: MotionKey, lo: number, hi: number): S2018Free =>
  g === 'nurse'
    ? { key: `nurse.${k}`, lo, hi, log: true, get: (n) => n[k], set: (n, v) => ({ ...n, [k]: v }) }
    : { key: `forager.${k}`, lo, hi, log: true, get: (n) => n.forager?.[k] ?? n[k], set: (n, v) => ({ ...n, forager: { ...n.forager, [k]: v } }) };

/** The free set, k = 10 (bounds logged 2026-10-11). */
export const S2018_FREE: S2018Free[] = [
  ...GROUPS.flatMap((g) => [
    perGroup(g, 'nestSpeedFactor', 0.005, 0.5),
    perGroup(g, 'activeToRest', 0.01, 10),
    perGroup(g, 'restToActive', 0.001, 10),
    perGroup(g, 'nestPauseFactor', 0.01, 100),
  ]),
  { key: 'encounterStop', lo: 0, hi: 1, log: false, get: (n) => n.encounterStop, set: (n, v) => ({ ...n, encounterStop: v }) },
  { key: 'restCrowdExp', lo: 0, hi: 3, log: false, get: (n) => n.restCrowdExp, set: (n, v) => ({ ...n, restCrowdExp: v }) },
];

/** Nest parameters of the Stroeymeyt set-up around a base: no recruitment loop, no random caste draw, foragers' trip rate. */
export function s2018Base(P: ColonyParams, outRate: number): ColonyParams {
  return { ...P, nest: { ...P.nest, returnRate: 0, foragerFrac: 0, forager: { ...P.nest.forager, outRate } } };
}

export const s2018Values = (n: NestParams): Record<string, number> => Object.fromEntries(S2018_FREE.map((f) => [f.key, f.get(n)]));

export function s2018Apply(P: ColonyParams, values: Record<string, number>): ColonyParams {
  let nest = P.nest;
  for (const f of S2018_FREE) if (f.key in values) nest = f.set(nest, values[f.key]);
  return { ...P, nest };
}

/** Free parameters within 5 % of a box end (adoption rule), in box units (log where log-scaled). */
export function s2018AtBound(n: NestParams): string[] {
  return S2018_FREE.filter((f) => {
    const v = f.get(n);
    const u = f.log ? Math.log(v / f.lo) / Math.log(f.hi / f.lo) : (v - f.lo) / (f.hi - f.lo);
    return u < 0.05 || u > 0.95;
  }).map((f) => f.key);
}

/**
 * Fit loss: Σ over targets of the debiased squared z, ((m − μ)² − Var(m)) /
 * SE², with m the mean over simulated colonies and Var(m) its sampling
 * variance (SD across colonies / n). Rows a simulation cannot estimate make
 * the loss infinite (unjudgeable, ranked last).
 */
export function s2018Loss(sims: Record<string, number>[], targets: S2018Target[]): number {
  let loss = 0;
  for (const t of targets) {
    const v = sims.map((r) => r[t.simId]).filter(Number.isFinite);
    if (v.length < 2) return Infinity;
    const m = v.reduce((a, b) => a + b, 0) / v.length;
    const varM = v.reduce((a, b) => a + (b - m) ** 2, 0) / (v.length - 1) / v.length;
    loss += ((m - t.mean) ** 2 - varM) / t.se ** 2;
  }
  return loss;
}
