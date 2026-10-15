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
 * Start point (2026-10-11, set by two hand-tried runs on colony209 before
 * any fit; development look at fit data): walking ≈ 2.7 mm/s (0.06 × 45),
 * short walks, rests of 4–7 s, the walker's own pauses as in E1, option B's
 * crowding at half strength.
 */
export const S2018_START: Record<string, number> = {
  'nurse.nestSpeedFactor': 0.06,
  'nurse.activeToRest': 3,
  'nurse.restToActive': 0.15,
  'nurse.nestPauseFactor': 1,
  'forager.nestSpeedFactor': 0.06,
  'forager.activeToRest': 2,
  'forager.restToActive': 0.25,
  'forager.nestPauseFactor': 1,
  encounterStop: 0.5,
  restCrowdExp: 0.5,
  // Rest depth (STATUS 2026-10-15): the data's Lomax shape from 2 s, α ≈ 1.
  restShape: 1,
};

/** Base: option B's nest model (encounter stops, crowd-dependent walk-on, walker pauses off are overridden by the free set). */
export function s2018Params(values: Record<string, number>, outRate: number): ColonyParams {
  const base = s2018Base({ ...LASIUS_PARAMS, nest: { ...LASIUS_NEST_B, forager: {} } }, outRate);
  return s2018Apply(base, values);
}

/** All fit colonies, one task each, in data order. */
export async function simulateAll(pool: SimPool, P: ColonyParams, colonies: StroeymeytColony[], o: Omit<StroeymeytRunOptions, 'seed'>, seed: (i: number) => number) {
  return pool.map(
    's2018Colony',
    colonies.map((c, i) => [P, c, { ...o, seed: seed(i) }]),
  );
}
