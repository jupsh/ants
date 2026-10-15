/**
 * Shared pieces of the step-4 scripts (Stroeymeyt 2018 in-nest motion,
 * STATUS 2026-10-11): the fit colonies as simulation inputs, the targets,
 * the base parameters and one evaluation over all colonies on the pool.
 */
import fs from 'node:fs';
import type { RowEstimate } from '../src/sim/analysis/inNest';
import type { ColonyParams } from '../src/sim/experiments/colonyBles';
import type { StroeymeytColony, StroeymeytRunOptions } from '../src/sim/experiments/colonyStroeymeyt';
import { s2018Apply, s2018Base, s2018Targets } from '../src/sim/experiments/stroeymeytTargets';
import { LASIUS_NEST_B, LASIUS_PARAMS } from '../src/sim/species/lasiusM1';
import type { SimPool } from './pool';

export const S2018_ROWS = 'data/reference/stroeymeyt2018-fit-rows.json';
export const S2018_TRIPS = 'data/fits/s2018-trips.json';

/** The trip-process inputs (scripts/calibTrips.ts). */
export function loadTrips(): { exploreGiveUp: number; outRate: number } {
  if (!fs.existsSync(S2018_TRIPS)) throw new Error(`${S2018_TRIPS} missing: run scripts/calibTrips.ts first`);
  const t = JSON.parse(fs.readFileSync(S2018_TRIPS, 'utf8'));
  return { exploreGiveUp: t.exploreGiveUp, outRate: t.outRate };
}

export interface DataColony {
  colony: string;
  ants: { nurse: number; forager: number; queen: number };
  rows: Record<string, number>;
}

export function loadS2018(): { colonies: DataColony[]; across: Record<string, RowEstimate> } {
  return JSON.parse(fs.readFileSync(S2018_ROWS, 'utf8'));
}

export function colonyFromData(c: DataColony): StroeymeytColony {
  return {
    label: c.colony,
    nurses: c.ants.nurse,
    foragers: c.ants.forager,
    noiseSd: Math.sqrt((c.rows['noise.x'] ** 2 + c.rows['noise.y'] ** 2) / 2),
    detection: c.rows['detection'],
  };
}

export const s2018TargetsFromData = () => s2018Targets(loadS2018().across);

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
 */
export const S2018_START: Record<string, number> = {
  'nurse.nestSpeedFactor': 0.055,
  'nurse.activeToRest': 1.9,
  'nurse.restToActive': 1.15,
  'nurse.nestPauseFactor': 0.03,
  'forager.nestSpeedFactor': 0.087,
  'forager.activeToRest': 1.07,
  'forager.restToActive': 2,
  'forager.nestPauseFactor': 5,
  encounterStop: 0.7,
  restCrowdExp: 1.88,
  restShape: 1.4,
};

/** Base: option B's nest model (encounter stops, crowd-dependent walk-on, walker pauses off are overridden by the free set). */
export function s2018Params(values: Record<string, number>, outRate: number): ColonyParams {
  const base = s2018Base({ ...LASIUS_PARAMS, nest: { ...LASIUS_NEST_B, forager: {} } }, outRate);
  return s2018Apply(base, values);
}

/**
 * All fit colonies, one task each, results in data order; `ms`: each task's
 * time in its worker. Submitted largest colony first (faster-fit.md §1.2),
 * so with fewer workers than tasks the slowest start first; seeds stay
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
