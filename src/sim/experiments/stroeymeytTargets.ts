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
  /**
   * The data colonies behind the target (those with a finite value; STATUS 2026-10-18, colony-set correction): a
   * simulation averages exactly these colonies, and a missing simulated value for one of them is never dropped.
   */
  colonies: string[];
}

/** Per-colony data rows, as in the reference files' `colonies`. */
export type DataColonyRows = { colony: string; rows: Record<string, number> }[];

const colonySet = (id: string, perColony: DataColonyRows, n: number): string[] => {
  const set = perColony.filter((c) => Number.isFinite(c.rows[id])).map((c) => c.colony);
  if (set.length !== n) throw new Error(`Stroeymeyt target ${id}: ${set.length} colonies with a value, the estimate says ${n}`);
  return set;
};

/** Fit targets from the across-colony estimates of `data/reference/stroeymeyt2018-fit-rows.json` and its per-colony rows. */
export function s2018Targets(across: Record<string, RowEstimate>, perColony: DataColonyRows): S2018Target[] {
  const out: S2018Target[] = [];
  for (const s of S2018_ROW_STATS)
    for (const g of GROUPS)
      for (const p of PHASES) {
        const id = `${s}.${g}.${p}`;
        const e = across[id];
        if (!e || !Number.isFinite(e.mean) || !(e.se > 0)) throw new Error(`Stroeymeyt target ${id} missing`);
        out.push({ id, simId: `${s}.${g}.light`, mean: e.mean, se: e.se, colonies: colonySet(id, perColony, e.n) });
      }
  return out;
}

type MotionKey = 'nestSpeedFactor' | 'activeToRest' | 'restToActive' | 'nestPauseFactor' | 'driveSd';

export interface S2018Free {
  key: string;
  lo: number;
  hi: number;
  log: boolean;
  get: (n: NestParams) => number;
  set: (n: NestParams, v: number) => NestParams;
}

const perGroup = (g: Group, k: MotionKey, lo: number, hi: number, log = true): S2018Free =>
  g === 'nurse'
    ? { key: `nurse.${k}`, lo, hi, log, get: (n) => n[k], set: (n, v) => ({ ...n, [k]: v }) }
    : { key: `forager.${k}`, lo, hi, log, get: (n) => n.forager?.[k] ?? n[k], set: (n, v) => ({ ...n, forager: { ...n.forager, [k]: v } }) };

/** The free set, k = 11 (bounds logged 2026-10-11; restShape 2026-10-15). */
export const S2018_FREE: S2018Free[] = [
  ...GROUPS.flatMap((g) => [
    perGroup(g, 'nestSpeedFactor', 0.005, 0.5),
    perGroup(g, 'activeToRest', 0.01, 10),
    perGroup(g, 'restToActive', 0.001, 10),
    perGroup(g, 'nestPauseFactor', 0.01, 100),
  ]),
  { key: 'encounterStop', lo: 0, hi: 1, log: false, get: (n) => n.encounterStop, set: (n, v) => ({ ...n, encounterStop: v }) },
  // Upper bound 3 → 1.25 (STATUS 2026-10-15: above it colonies condensed; a provisional search boundary, not a stability limit).
  { key: 'restCrowdExp', lo: 0, hi: 1.25, log: false, get: (n) => n.restCrowdExp, set: (n, v) => ({ ...n, restCrowdExp: v }) },
  // Rest depth, one shape for both groups (STATUS 2026-10-15).
  { key: 'restShape', lo: 0.2, hi: 50, log: true, get: (n) => n.restShape, set: (n, v) => ({ ...n, restShape: v }) },
];

/**
 * Candidate C2 (user decisions D1–D6, STATUS 2026-10-18 ≈ 01:43), k = 13: C1's free set with restShape bounded
 * below at 1.001 (finite-mean baseline rests; a modelling constraint, log scale and the 5 % rule kept), plus the
 * latent drive's SD per role on [0, 2] (linear). Fixed model choices in `S2018_C2_FIXED`.
 */
export const S2018_FREE_C2: S2018Free[] = [
  ...S2018_FREE.map((f) => (f.key === 'restShape' ? { ...f, lo: 1.001 } : f)),
  ...GROUPS.map((g) => perGroup(g, 'driveSd', 0, 2, false)),
];

/** C2's fixed choices: τ of the drive 60 s (D1); specular walls (D4, a diagnostic selection, not a validated wall response). */
export const S2018_C2_FIXED: Pick<NestParams, 'driveTau' | 'wallRule'> = { driveTau: 60, wallRule: 'specular' };

/** The free set of a candidate. */
export const s2018Free = (candidate: 'C1' | 'C2'): S2018Free[] => (candidate === 'C2' ? S2018_FREE_C2 : S2018_FREE);

/** The four activity rows of C2 (STATUS 2026-10-18 ≈ 01:46; light only, weight 1 like every row). */
export const S2018_ACTIVITY_ROWS = GROUPS.flatMap((g) => [`persist.${g}.light`, `top20.${g}.light`]);

/** Activity targets from `data/reference/stroeymeyt2018-activity-rows.json`'s across-colony estimates. */
export function s2018ActivityTargets(across: Record<string, RowEstimate>, perColony: DataColonyRows): S2018Target[] {
  return S2018_ACTIVITY_ROWS.map((id) => {
    const e = across[id];
    if (!e || !Number.isFinite(e.mean) || !(e.se > 0)) throw new Error(`Stroeymeyt activity target ${id} missing`);
    return { id, simId: id, mean: e.mean, se: e.se, colonies: colonySet(id, perColony, e.n) };
  });
}

/** Thirst threshold and crop-water uptake of the Stroeymeyt set-up (estimated, user-approved 2026-10-15; sensitivity 0.8 / 0.95 and ×0.2 / ×5). */
export const S2018_WATER = { thirstFrac: 0.9, cropWaterRate: 1 / 300 };

/**
 * SD of log of the per-ant walk-on factor in the Stroeymeyt set-up (STATUS
 * 2026-10-15 late evening): selected from the activity diagnostics, the
 * one level of 0 / 0.4 / 0.7 / 1.0 that improved persistence, spread and
 * concentration of per-ant activity together through the frozen tracker.
 * Fixed, not free in the optimizer, but a data-informed model choice beside
 * its 11 parameters; sensitivity 0.7.
 */
export const S2018_WALK_ON_SD = 0.4;

/**
 * Parameters of the Stroeymeyt set-up around a base: no recruitment loop, no
 * random caste draw, foragers' trip rate; water (STATUS 2026-10-15): thirsty
 * ants accept food, crop water reaches the body, a forager with a full crop
 * does not stop to drink, and a drink pauses a trip instead of ending it;
 * each ant has its own persistent walk-on factor (`S2018_WALK_ON_SD`).
 */
export function s2018Base(P: ColonyParams, outRate: number, water = S2018_WATER): ColonyParams {
  return {
    ...P,
    phys: { ...P.phys, cropWaterRate: water.cropWaterRate },
    forager: { ...P.forager, drinkOnlyWithRoom: true, drinkPausesTrip: true },
    nest: { ...P.nest, returnRate: 0, foragerFrac: 0, thirstFrac: water.thirstFrac, walkOnSd: S2018_WALK_ON_SD, forager: { ...P.nest.forager, outRate } },
  };
}

export const s2018Values = (n: NestParams, free: S2018Free[] = S2018_FREE): Record<string, number> => Object.fromEntries(free.map((f) => [f.key, f.get(n)]));

/**
 * Settable by diagnostics (`--set`), not free in the fit: two-state rests
 * (mix2, under test), the per-ant walk-on factor (sensitivity runs;
 * STATUS 2026-10-15) and in-nest speed fluctuation (STATUS 2026-10-16 night).
 */
export const S2018_EXTRA: S2018Free[] = [
  { key: 'restDeepFrac', lo: 0, hi: 1, log: false, get: (n) => n.restDeepFrac, set: (n, v) => ({ ...n, restDeepFrac: v }) },
  { key: 'restDeepRatio', lo: 1, hi: 1000, log: true, get: (n) => n.restDeepRatio, set: (n, v) => ({ ...n, restDeepRatio: v }) },
  // Persistent per-ant walk-on factor (STATUS 2026-10-15 late evening); fixed at S2018_WALK_ON_SD in s2018Base.
  { key: 'walkOnSd', lo: 0, hi: 3, log: false, get: (n) => n.walkOnSd, set: (n, v) => ({ ...n, walkOnSd: v }) },
  // In-nest speed fluctuation (STATUS 2026-10-16 night, targeted comparison): factors on the walker's SD and τ, both groups.
  { key: 'nestSpeedSdFactor', lo: 0, hi: 10, log: false, get: (n) => n.nestSpeedSdFactor, set: (n, v) => ({ ...n, nestSpeedSdFactor: v }) },
  { key: 'nestSpeedTauFactor', lo: 0.01, hi: 100, log: true, get: (n) => n.nestSpeedTauFactor, set: (n, v) => ({ ...n, nestSpeedTauFactor: v }) },
];
export const S2018_SETTABLE: S2018Free[] = [...S2018_FREE, ...S2018_EXTRA, ...S2018_FREE_C2.filter((f) => f.key.endsWith('.driveSd'))];

export function s2018Apply(P: ColonyParams, values: Record<string, number>): ColonyParams {
  let nest = P.nest;
  for (const f of S2018_SETTABLE) if (f.key in values) nest = f.set(nest, values[f.key]);
  return { ...P, nest };
}

const boxUnit = (f: S2018Free, v: number) => (f.log ? Math.log(v / f.lo) / Math.log(f.hi / f.lo) : (v - f.lo) / (f.hi - f.lo));

/** Free parameters within 5 % of a box end (adoption rule), in box units (log where log-scaled). */
export function s2018AtBound(n: NestParams, free: S2018Free[] = S2018_FREE): string[] {
  return free.filter((f) => {
    const u = boxUnit(f, f.get(n));
    return u < 0.05 || u > 0.95;
  }).map((f) => f.key);
}

/**
 * C2's bound reading (user, 2026-10-18 ≈ 01:43): a drive SD in the lower 5 % of its box is not a bound failure,
 * reported as "little or no drive required for this role by this fit"; every other parameter, and a drive SD in
 * the upper 5 %, keeps the adoption rule.
 */
export function s2018BoundReading(n: NestParams, free: S2018Free[]): { failures: string[]; littleDrive: string[] } {
  const at = s2018AtBound(n, free);
  const low = (k: string) => k.endsWith('.driveSd') && boxUnit(free.find((f) => f.key === k)!, free.find((f) => f.key === k)!.get(n)) < 0.05;
  return { failures: at.filter((k) => !low(k)), littleDrive: at.filter(low) };
}

/**
 * A target's simulated values over its colony set (STATUS 2026-10-18 colony-set correction): the runs of the
 * target's data colonies (`labels[i]` = colony of run i), and the missing cases among them (a run with a
 * non-finite value, or a colony of the set with no run). Runs of other colonies are left out.
 */
export function s2018TargetValues(sims: Record<string, number>[], labels: string[], t: S2018Target): { values: number[]; missing: string[] } {
  if (labels.length !== sims.length) throw new Error('s2018TargetValues: one colony label per run');
  const set = new Set(t.colonies);
  const values: number[] = [];
  const missing: string[] = [];
  sims.forEach((r, i) => {
    if (!set.has(labels[i])) return;
    if (Number.isFinite(r[t.simId])) values.push(r[t.simId]);
    else missing.push(`${labels[i]} (run ${i})`);
  });
  for (const c of t.colonies) if (!labels.includes(c)) missing.push(`${c} (no run)`);
  return { values, missing };
}

/** Every missing case of every target (empty: all estimable on the targets' colony sets). */
export const s2018Missing = (sims: Record<string, number>[], labels: string[], targets: S2018Target[]): { id: string; cases: string[] }[] =>
  targets.map((t) => ({ id: t.id, cases: s2018TargetValues(sims, labels, t).missing })).filter((m) => m.cases.length);

/**
 * Fit loss: Σ over targets of the debiased squared z, ((m − μ)² − Var(m)) /
 * SE², with m the mean over the simulated runs of the target's data colonies
 * and Var(m) its sampling variance (SD across runs / n). A missing simulated
 * value for any colony of a target's set makes the loss infinite
 * (unjudgeable, ranked last; STATUS 2026-10-18: never a smaller set).
 */
export function s2018Loss(sims: Record<string, number>[], targets: S2018Target[], labels: string[]): number {
  let loss = 0;
  for (const t of targets) {
    const { values: v, missing } = s2018TargetValues(sims, labels, t);
    if (missing.length || v.length < 2) return Infinity;
    const m = v.reduce((a, b) => a + b, 0) / v.length;
    const varM = v.reduce((a, b) => a + (b - m) ** 2, 0) / (v.length - 1) / v.length;
    loss += ((m - t.mean) ** 2 - varM) / t.se ** 2;
  }
  return loss;
}
