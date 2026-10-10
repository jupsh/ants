import { binomialSE, blockEstimate, combinedZ, fitZ, logSdZ, olsFit, spearman, type BlockEstimate, type Comparison } from '../analysis/compare';
import { runScout, type LasiusParams, type ScoutOptions, type ScoutResult } from './e2Mailleux';

/**
 * E2 targets from Mailleux et al. 1999 and 2009, with their role in model
 * building. One definition shared by the fit script, tests and the UI.
 */
/** Evidence roles (docs/STATUS.md): fitted, or inspected while choosing model structure. */
export type Role = 'fit' | 'development' | 'heldout';

export interface Target {
  id: string;
  label: string;
  role: Role;
  /** Data mean (or proportion), its standard error and sample size. */
  value: number;
  se: number;
  n: number;
  unit: string;
  /** Data SD between ants, if reported (compared separately from the mean). */
  sd?: number;
  source: string;
}

/** Apparatus and observer settings shared by all conditions. */
export interface E2Setup {
  /** Fraction of a micropipette drop that can be imbibed. */
  accessible: number;
  /** SD (µL) of the experimenter's volume estimates. */
  volumeSd: number;
}

export interface Condition {
  id: string;
  label: string;
  /** The scout trips of this condition (seeds seed0 … seed0 + n − 1). */
  options: (n: number, seed0: number, setup: E2Setup, dt: number) => ScoutOptions[];
  /**
   * Per-scout values for each target id (proportions as 0/1 indicators).
   * Statistics of a whole sample (e.g. a regression slope) are returned as a
   * one-element array, so seed blocks give their replicate SE.
   */
  metrics: (rs: ScoutResult[]) => Record<string, number[]>;
}

const ind = (rs: ScoutResult[], f: (r: ScoutResult) => boolean) => rs.map((r) => (f(r) ? 1 : 0));
/** Mean ± SD target from a paper's summary. */
const m = (id: string, label: string, role: Role, value: number, sd: number, n: number, unit: string, source: string): Target => ({ id, label, role, value, sd, n, se: sd / Math.sqrt(n), unit, source });
/** Proportion target with its binomial SE. */
const pr = (id: string, label: string, role: Role, value: number, n: number, source: string): Target => ({ id, label, role, value, n, se: binomialSE(value, n), unit: '', source });

export const E2_TARGETS: Target[] = [
  m('d1.drink', '3 µL drop, 1 day starved: drinking time', 'fit', 65, 21, 63, 's', 'mailleux1999'),
  pr('d1.trail', '3 µL drop, 1 day starved: scouts laying trail', 'fit', 0.85, 67, 'mailleux1999'),
  m('d4.drink', '3 µL drop, 4 days starved: drinking time', 'fit', 88, 24, 135, 's', 'mailleux1999'),
  pr('d4.trail', '3 µL drop, 4 days starved: scouts laying trail', 'fit', 0.94, 141, 'mailleux1999'),
  m('d8.drink', '3 µL drop, 8 days starved: drinking time', 'fit', 93, 23, 92, 's', 'mailleux1999'),
  pr('d8.trail', '3 µL drop, 8 days starved: scouts laying trail', 'fit', 0.88, 97, 'mailleux1999'),
  m('two.ul1', 'Two drops: intake at drop 1', 'fit', 0.47, 0.25, 63, 'µL', 'mailleux2009'),
  m('two.t1', 'Two drops: drinking time at drop 1', 'fit', 51, 12, 63, 's', 'mailleux2009'),
  pr('two.tl1', 'Two drops: laying trail after drop 1', 'fit', 0.38, 63, 'mailleux2009'),
  pr('two.trail', 'Two drops: laying trail overall', 'development', 0.84, 63, 'mailleux2009'),
  m('two.ul2', 'Two drops: intake at drop 2', 'fit', 0.28, 0.2, 63, 'µL', 'mailleux2009'),
  m('two.t2', 'Two drops: drinking time at drop 2', 'fit', 23, 11, 63, 's', 'mailleux2009'),
  m('two.ulTot', 'Two drops: total intake', 'development', 0.75, 0.3, 63, 'µL', 'mailleux2009'),
  m('two.betweenTL1', 'Two drops: time between drops, trail layers', 'fit', 58, 33, 24, 's', 'mailleux2009'),
  m('two.betweenNTL1', 'Two drops: time between drops, non-layers', 'fit', 134, 87, 39, 's', 'mailleux2009'),
  m('two.total', 'Two drops: total time (drink 1 + between + drink 2)', 'development', 178, 83, 63, 's', 'mailleux2009'),
  // Volume–time relation pooled over both drops (2009, N = 126): identifies the
  // between-ant intake-rate SD and the volume measurement error (docs/STATUS.md,
  // step-3 pre-registration). SEs from large-sample formulas: slope
  // b·√((1 − r²)/(r²(N − 2))), correlation (1 − r²)/√(N − 3).
  { id: 'two.vtSlope', label: 'Two drops: volume vs drinking time, regression slope', role: 'fit', value: 0.006, se: 0.006 * Math.sqrt((1 - 0.46 ** 2) / (0.46 ** 2 * 124)), n: 126, unit: 'µL/s', source: 'mailleux2009' },
  { id: 'two.vtRs', label: 'Two drops: volume vs drinking time, Spearman r', role: 'fit', value: 0.46, se: (1 - 0.46 ** 2) / Math.sqrt(123), n: 126, unit: 'r', source: 'mailleux2009' },
];

const single = (days: number): Condition => ({
  id: `d${days}`,
  label: `Mailleux 1999: 3 µL drop, ${days} day${days > 1 ? 's' : ''} starved`,
  options: (n, seed0, su, dt) => Array.from({ length: n }, (_, i) => ({ seed: seed0 + i, drop1: { ul: 3, molar: 0.6 }, pipetteAccessible: su.accessible, volumeSd: su.volumeSd, starvationDays: days, dt, maxTime: 900 })),
  metrics: (rs) => ({ [`d${days}.drink`]: rs.map((r) => r.drinks[0].time), [`d${days}.trail`]: ind(rs, (r) => r.laidTrail) }),
});

export const E2_CONDITIONS: Condition[] = [
  single(1),
  single(4),
  single(8),
  {
    id: 'two',
    label: 'Mailleux 2009: two 0.7 µL drops, 4 days starved',
    options: (n, seed0, su, dt) =>
      Array.from({ length: n }, (_, i) => ({ seed: seed0 + i, drop1: { ul: 0.7, molar: 0.6 }, drop2: { ul: 0.7, molar: 0.6 }, pipetteAccessible: su.accessible, volumeSd: su.volumeSd, starvationDays: 4, dt, maxTime: 900 })),
    metrics: (rs) => {
      const both = rs.filter((r) => r.drinks.length >= 2);
      return {
        // Drop-1 rows over the scouts that found both drops, as in the data (Mailleux 2009: n = 63).
        'two.ul1': both.map((r) => r.drinks[0].ul),
        'two.t1': both.map((r) => r.drinks[0].time),
        'two.tl1': ind(both, (r) => r.laidSection1),
        'two.trail': ind(both, (r) => r.laidTrail),
        'two.ul2': both.map((r) => r.drinks[1].ul),
        'two.t2': both.map((r) => r.drinks[1].time),
        'two.ulTot': both.map((r) => r.drinks[0].ul + r.drinks[1].ul),
        'two.betweenTL1': both.filter((r) => r.laidSection1).map((r) => r.betweenTime),
        'two.betweenNTL1': both.filter((r) => !r.laidSection1).map((r) => r.betweenTime),
        // 2009 Table 2 "Total" = drinking at drop 1 + between drops + drinking at drop 2 (not time in the area).
        'two.total': both.map((r) => r.drinks[0].time + r.betweenTime + r.drinks[1].time),
        'two.foundBoth': ind(rs, (r) => r.drinks.length >= 2),
        ...volumeTime(both),
      };
    },
  },
];

function volumeTime(both: ScoutResult[]): Record<string, number[]> {
  const t = both.flatMap((r) => [r.drinks[0].time, r.drinks[1].time]);
  const v = both.flatMap((r) => [r.drinks[0].ul, r.drinks[1].ul]);
  if (t.length < 10) return { 'two.vtSlope': [NaN], 'two.vtRs': [NaN] };
  return { 'two.vtSlope': [olsFit(t, v).slope], 'two.vtRs': [spearman(t, v)] };
}

export type E2Sim = Record<string, BlockEstimate>;

/** Runs a batch of scout trips (serially here; scripts/pool.ts runs them across cores). */
export type ScoutRunner = (P: LasiusParams, opts: ScoutOptions[]) => ScoutResult[] | Promise<ScoutResult[]>;

const serialRunner: ScoutRunner = (P, opts) => opts.map((o) => runScout(P, o));

/** Only scouts that found and drank from the first drop are observed. */
const observed = (rs: ScoutResult[]) => rs.filter((r) => r.drinks.length);

/** Run one condition (as the experimenters observed it). */
export function runCondition(c: Condition, P: LasiusParams, n: number, seed0: number, setup: E2Setup, dt: number): ScoutResult[] {
  return observed(serialRunner(P, c.options(n, seed0, setup, dt)) as ScoutResult[]);
}

/**
 * Run every condition in `blocks` independent seed blocks of `n` scouts and
 * return, per target id, the pooled estimate with a replicate-based SE.
 * Block 0 uses the same seeds as a single-block run. With an asynchronous
 * `runner` (a worker pool) all blocks run concurrently; results are
 * identical to the serial run.
 */
export async function simulateE2Async(P: LasiusParams, n: number, setup: E2Setup, dt = 0.1, seedBase = 0, blocks = 1, runner: ScoutRunner = serialRunner, conditions: Condition[] = E2_CONDITIONS): Promise<E2Sim> {
  const jobs = conditions.flatMap((c, i) => Array.from({ length: blocks }, (_, b) => ({ c, opts: c.options(n, seedBase + 100000 * (i + 1) + b * n, setup, dt) })));
  const results = await Promise.all(jobs.map((j) => runner(P, j.opts)));
  const per: Record<string, number[][]> = {};
  jobs.forEach((j, k) => {
    for (const [id, v] of Object.entries(j.c.metrics(observed(results[k])))) (per[id] ??= []).push(v);
  });
  return Object.fromEntries(Object.entries(per).map(([id, bl]) => [id, blockEstimate(bl)]));
}

/** Serial version of `simulateE2Async` (tests, browser worker). */
export function simulateE2(P: LasiusParams, n: number, setup: E2Setup, dt = 0.1, seedBase = 0, blocks = 1): E2Sim {
  const per: Record<string, number[][]> = {};
  E2_CONDITIONS.forEach((c, i) => {
    for (let b = 0; b < blocks; b++)
      for (const [id, v] of Object.entries(c.metrics(runCondition(c, P, n, seedBase + 100000 * (i + 1) + b * n, setup, dt)))) (per[id] ??= []).push(v);
  });
  return Object.fromEntries(Object.entries(per).map(([id, bl]) => [id, blockEstimate(bl)]));
}

/**
 * Fitting objective: Σ z² over targets with the given role, z using SE_data
 * only (so the optimiser cannot gain by making the simulation noisier).
 */
export function e2Loss(sim: E2Sim, role: Role, targets: Target[] = E2_TARGETS): number {
  let l = 0;
  for (const t of targets) if (t.role === role) l += Number.isFinite(sim[t.id]?.mean) ? fitZ(sim[t.id].mean, t.value, t.se) ** 2 : 100;
  return l;
}

export interface E2Row {
  target: Target;
  sim: BlockEstimate;
  /** Mean (or proportion): combined-SE z. */
  mean: Comparison;
  /** Spread between ants (log SD ratio), where the data SD is reported. */
  spread?: Comparison;
}

/** Judge simulated results against every target with the combined-SE criteria. */
export function e2Compare(sim: E2Sim, targets: Target[] = E2_TARGETS): E2Row[] {
  return targets.map((t) => {
    const s = sim[t.id] ?? blockEstimate([]);
    const mean: Comparison = { id: t.id, label: t.label, kind: t.unit === '' ? 'proportion' : 'mean', data: t.value, sim: s.mean, seData: t.se, seSim: s.se, z: combinedZ(s.mean, s.se, t.value, t.se) };
    // SE(log s) ≈ 1/√(2(n−1)) assumes normality; drinking and travel times are
    // right-skewed, so read spread z as indicative.
    const spread: Comparison | undefined =
      t.sd === undefined ? undefined : { id: `${t.id}.sd`, label: `${t.label} (SD between ants)`, kind: 'spread', data: t.sd, sim: s.sd, seData: NaN, seSim: NaN, z: logSdZ(s.sd, s.n, t.sd, t.n) };
    return { target: t, sim: s, mean, spread };
  });
}

/** Plain-text table of `e2Compare` rows (scripts and logs). */
export function e2Table(rows: E2Row[]): string {
  const f = (v: number, unit: string) => (unit === '' ? `${(v * 100).toFixed(0)}%` : unit === 'µL/s' ? v.toFixed(4) : v.toFixed(unit === 'µL' || unit === 'r' || unit === 'n' ? 2 : 0));
  return rows
    .map(({ target: t, sim, mean, spread }) => {
      const sd = (x: number | undefined) => (t.sd !== undefined && x !== undefined ? `±${f(x, t.unit)}` : '');
      const zs = spread ? `  zSD=${spread.z.toFixed(1)}` : '';
      return `${t.role.padEnd(11)} z=${mean.z.toFixed(1).padStart(5)}${zs.padEnd(11)} ${t.label}: data ${f(t.value, t.unit)}${sd(t.sd)} (n=${t.n}), sim ${f(sim.mean, t.unit)}${sd(sim.sd)} ±SE ${sim.se.toPrecision(2)} (n=${sim.n})`;
    })
    .join('\n');
}
