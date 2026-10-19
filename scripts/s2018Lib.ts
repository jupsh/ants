/**
 * Shared pieces of the step-4 scripts (Stroeymeyt 2018 in-nest motion,
 * STATUS 2026-10-11): the fit colonies as simulation inputs, the targets,
 * the base parameters and one evaluation over all colonies on the pool.
 */
import fs from 'node:fs';
import type { RowEstimate } from '../src/sim/analysis/inNest';
import type { ColonyParams } from '../src/sim/experiments/colonyBles';
import type { DetectionTracker } from '../src/sim/analysis/detection';
import type { StroeymeytColony, StroeymeytRunOptions } from '../src/sim/experiments/colonyStroeymeyt';
import { s2018ActivityTargets, s2018Apply, s2018Base, s2018Targets, S2018_C2_FIXED, S2018_WATER } from '../src/sim/experiments/stroeymeytTargets';
import { LASIUS_NEST_B, LASIUS_PARAMS } from '../src/sim/species/lasiusM1';
import type { SimPool } from './pool';

export const S2018_ROWS = 'data/reference/stroeymeyt2018-fit-rows.json';
/** C2's activity rows on the fit colonies (`scripts/stroeymeytActivityRows.ts`; STATUS 2026-10-18 ≈ 01:46). */
export const S2018_ACTIVITY = 'data/reference/stroeymeyt2018-activity-rows.json';
export const S2018_TRIPS = 'data/fits/s2018-trips.json';
/** The frozen detection tracker (STATUS 2026-10-15 late evening; its `meta` records conditioning, estimator and validation). */
export const S2018_TRACKER = 'data/fits/s2018-tracker.json';

/** The trip-process inputs (scripts/calibTrips.ts; `exploreGiveUpSd` 0 in files from before v2: a fixed give-up time). */
export function loadTrips(): { exploreGiveUp: number; exploreGiveUpSd: number; outRate: number } {
  if (!fs.existsSync(S2018_TRIPS)) throw new Error(`${S2018_TRIPS} missing: run scripts/calibTrips.ts first`);
  const t = JSON.parse(fs.readFileSync(S2018_TRIPS, 'utf8'));
  return { exploreGiveUp: t.exploreGiveUp, exploreGiveUpSd: t.exploreGiveUpSd ?? 0, outRate: t.outRate };
}

/** Per colony label, the frozen tracker of each role (`StroeymeytColony.tracker`). */
export function loadTracker(path = S2018_TRACKER): Record<string, { nurse: DetectionTracker; forager: DetectionTracker }> {
  const t = JSON.parse(fs.readFileSync(path, 'utf8'));
  return t.colonies ?? t;
}

export interface DataColony {
  colony: string;
  ants: { nurse: number; forager: number; queen: number };
  rows: Record<string, number>;
}

export function loadS2018(): { colonies: DataColony[]; across: Record<string, RowEstimate> } {
  return JSON.parse(fs.readFileSync(S2018_ROWS, 'utf8'));
}

let frozenTracker: ReturnType<typeof loadTracker> | undefined;

/**
 * A fit colony as a simulation input. Observed through the frozen detection
 * tracker (STATUS 2026-10-15 late evening; in the nest; the arena keeps
 * independent misses at the colony rate), or with `observer` 'iid'
 * independent misses everywhere (the earlier observer, for comparisons).
 */
/**
 * Observer sensitivity variants from the command line (STATUS 2026-10-17 ≈
 * 01:30 UTC): `--obsVariant tag|rest:sd:tau` (slow position offset per ant)
 * and `--pxRound mm` (pixel rounding), and the oracle colony-coupling diagnostic `--oracle coupled:kappa:tauC|placebo:sd:tauC[:unit]|const:factor`.
 * None given: the colony unchanged.
 */
export function withObsVariant(c: StroeymeytColony, argv = process.argv): StroeymeytColony {
  const at = (f: string) => (argv.includes(f) ? argv[argv.indexOf(f) + 1] : undefined);
  const v = at('--obsVariant');
  const px = at('--pxRound');
  let out = c;
  if (v) {
    const [kind, sd, tau] = v.split(':');
    if (kind !== 'tag' && kind !== 'rest') throw new Error(`--obsVariant ${v}: kind must be tag or rest`);
    out = { ...out, posDrift: { kind, sd: Number(sd), tau: Number(tau) } };
  }
  if (px) out = { ...out, pxRound: Number(px) };
  // Oracle colony coupling (STATUS 2026-10-17 ≈ 05:11 UTC): `--oracle coupled:kappa:tauC` or `placebo:sd:tauC`.
  const orc = at('--oracle');
  if (orc) {
    // ≈ 13:15 UTC: `const:factor` and `placebo:sd:tauC:unit` (mean-one multiplier) for the mean-matched comparison.
    const [kind, v, tauC, mode] = orc.split(':');
    if (kind === 'const') out = { ...out, oracle: { kind, factor: Number(v) } };
    else if (kind === 'coupled') out = { ...out, oracle: { kind, kappa: Number(v), tauC: Number(tauC) } };
    else if (kind === 'placebo') out = { ...out, oracle: mode === 'unit' ? { kind, sd: Number(v), tauC: Number(tauC), meanOne: true } : { kind, sd: Number(v), tauC: Number(tauC) } };
    else throw new Error(`--oracle ${orc}: kind must be coupled, placebo or const`);
  }
  // `--oracleNurseOnly`: the pre-fix oracle (nurses only; STATUS 2026-10-17 ≈ 16:18 / 21:17 UTC), to reproduce earlier runs.
  if (argv.includes('--oracleNurseOnly')) out = { ...out, oracleNurseOnly: true };
  // Slow-episode what-if (STATUS 2026-10-17, overnight): `--slowEp rate:dur:factor`.
  const se = at('--slowEp');
  if (se) {
    const [rate, dur, factor] = se.split(':').map(Number);
    out = { ...out, slowEp: { rate, dur, factor } };
  }
  // Comparison Q (STATUS 2026-10-17 ≈ 16:19 UTC): `--wall inward|specular` (specular: comparison WR, ≈ 21:31), `--agg k:r` (the site map is phase-specific: set by
  // the caller, e.g. `tmpShortSim --site k`).
  const wall = at('--wall');
  if (wall) {
    if (wall !== 'inward' && wall !== 'specular') throw new Error(`--wall ${wall}: 'inward' or 'specular'`);
    out = { ...out, wall };
  }
  // Comparison T (≈ 22:59): `--taxis gain:r`.
  const tx = at('--taxis');
  if (tx) {
    const [gain, r] = tx.split(':').map(Number);
    out = { ...out, taxis: { gain, r } };
  }
  const ag = at('--agg');
  if (ag) {
    const [k, r] = ag.split(':').map(Number);
    out = { ...out, aggregate: { k, r } };
  }
  return out;
}

export function colonyFromData(c: DataColony, observer: 'tracker' | 'iid' = 'tracker'): StroeymeytColony {
  const col: StroeymeytColony = {
    label: c.colony,
    nurses: c.ants.nurse,
    foragers: c.ants.forager,
    noiseSd: Math.sqrt((c.rows['noise.x'] ** 2 + c.rows['noise.y'] ** 2) / 2),
    detection: c.rows['detection'],
  };
  if (observer === 'iid') return col;
  frozenTracker ??= loadTracker();
  const t = frozenTracker[c.colony];
  if (!t) throw new Error(`${S2018_TRACKER}: no tracker for ${c.colony}`);
  return { ...col, tracker: t };
}

export const s2018TargetsFromData = () => {
  const d = loadS2018();
  return s2018Targets(d.across, d.colonies);
};

/** A candidate's targets: C1 the 32 motion rows; C2 those plus the four activity rows (36, user D5 2026-10-18). */
export const s2018TargetsFor = (candidate: 'C1' | 'C2') =>
  candidate === 'C2' ? [...s2018TargetsFromData(), ...activityTargets()] : s2018TargetsFromData();
const activityTargets = () => {
  const a = JSON.parse(fs.readFileSync(S2018_ACTIVITY, 'utf8'));
  return s2018ActivityTargets(a.across, a.colonies);
};

/** Observation settings a candidate needs: C2's activity rows from the 6-h window starting at the end of the warm-up. */
export const s2018RunExtras = (candidate: 'C1' | 'C2'): Partial<StroeymeytRunOptions> => (candidate === 'C2' ? { activityHours: [0] } : {});

/**
 * C2's probe scale (D070): the probe's SDs rescaled so the largest equals the cap, keeping their ratios; unchanged
 * when the largest is already at the cap (all three of C1's probes). The axis switch and tolX assume that scale.
 */
export function scaleProbeToCap(sds: number[], cap: number): number[] {
  const m = Math.max(...sds);
  return m >= cap ? sds : sds.map((v) => (v * cap) / m);
}

/**
 * C2's start points (STATUS 2026-10-18): C1's two starts (restShape 1.4 is inside C2's (1.001, 50] box) with the
 * drive SD per role at 1.0 (start 0; comparison L's level) and 0.3 (start 1), a strong and a weak drive.
 */
export const C2_DRIVE_START = [
  { 'nurse.driveSd': 1.0, 'forager.driveSd': 1.0 },
  { 'nurse.driveSd': 0.3, 'forager.driveSd': 0.3 },
];

/**
 * Start point, revised 2026-10-15 for the rest-depth model (STATUS
 * 2026-10-15, short-end check points A–D; development looks at fit data):
 * between C and D. Nurse walks ≈ 0.5 s (C 0.27 s too short, D 1 s too
 * long), walk-on rates between the gen-57 mean (tails over) and C (under),
 * restShape between 1 (over) and 2 (under); speed factors scaled to the
 * data's moving speeds; forager pauses cut from 35 (foragers always too
 * still). Other values from start 0's gen-57 mean. The 2026-10-11 start
 * (exponential rests): nurse 0.06 / 3 / 0.15 / 1, forager 0.06 / 2 / 0.25
 * / 1, encounterStop 0.5, restCrowdExp 0.5.
 * Revised again 2026-10-15 evening (water in the set-up; crowding
 * condensation): restCrowdExp 1.88 → 1.0 (provisional; box upper bound
 * 1.25) and both restToActive × 0.3 (were 1.15 / 2), from probes at
 * b 1.0 that put the still fractions near the data.
 */
export const S2018_START: Record<string, number> = {
  'nurse.nestSpeedFactor': 0.055,
  'nurse.activeToRest': 1.9,
  'nurse.restToActive': 0.345,
  'nurse.nestPauseFactor': 0.03,
  'forager.nestSpeedFactor': 0.087,
  'forager.activeToRest': 1.07,
  'forager.restToActive': 0.6,
  'forager.nestPauseFactor': 5,
  encounterStop: 0.7,
  restCrowdExp: 1.0,
  restShape: 1.4,
};

/** Water keys settable by `--set` (sensitivity checks, STATUS 2026-10-15): `water.thirstFrac`, `water.cropWaterRate`. */
export const S2018_WATER_KEYS = ['water.thirstFrac', 'water.cropWaterRate'];

/** Base: option B's nest model (encounter stops, crowd-dependent walk-on, walker pauses off are overridden by the free set); water from S2018_WATER unless `values` override it. */
export function s2018Params(values: Record<string, number>, outRate: number, candidate: 'C1' | 'C2' = 'C1'): ColonyParams {
  const water = { thirstFrac: values['water.thirstFrac'] ?? S2018_WATER.thirstFrac, cropWaterRate: values['water.cropWaterRate'] ?? S2018_WATER.cropWaterRate };
  const base = s2018Base({ ...LASIUS_PARAMS, nest: { ...LASIUS_NEST_B, forager: {} } }, outRate, water);
  // C2's fixed choices (τ 60 s, specular walls; user D1 / D4, 2026-10-18).
  return s2018Apply(candidate === 'C2' ? { ...base, nest: { ...base.nest, ...S2018_C2_FIXED } } : base, values);
}

/**
 * All fit colonies, one task each, results in data order; `ms`: each task's
 * time in its worker. Submitted largest colony first (fit-speed survey
 * §1.2, Stroeymeyt archive 2026-10-15), so with fewer workers than tasks
 * the slowest start first; seeds stay
 * keyed by data index, so results do not depend on the order.
 */
export async function simulateAll(pool: SimPool, P: ColonyParams, colonies: StroeymeytColony[], o: Omit<StroeymeytRunOptions, 'seed'>, seed: (i: number) => number) {
  const order = colonies.map((_, i) => i).sort((a, b) => colonies[b].nurses + colonies[b].foragers - (colonies[a].nurses + colonies[a].foragers) || a - b);
  const out = await pool.mapTimed(
    's2018Colony',
    order.map((i) => [P, colonies[i], { ...o, seed: seed(i) }]),
  );
  const res = new Array<(typeof out)[number]['result'] & { ms: number }>(colonies.length);
  order.forEach((i, k) => (res[i] = { ...out[k].result, ms: out[k].ms }));
  return res;
}
