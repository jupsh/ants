import { runScoutWorld } from '../sim/experiments/e2Mailleux';
import { e2Compare, simulateE2, type E2Row } from '../sim/experiments/e2Targets';
import { LASIUS_PARAMS, MAILLEUX_PIPETTE_ACCESSIBLE, MAILLEUX_SETUP } from '../sim/species/lasiusM1';

/**
 * The E2 page's computation, shared by its worker and by
 * scripts/precompute.ts. The comparison table depends only on the scout
 * count and seed; the animated example trips also on the condition shown.
 */
export interface E2Request {
  /** Scouts per condition, split into `BLOCKS` seed blocks for SE_sim. */
  scouts: number;
  seed: number;
  /** Condition id whose example trips should be recorded for animation. */
  showCondition: string;
}

export interface TripFrame {
  t: number;
  x: number;
  y: number;
  heading: number;
  mode: string;
  gaster: boolean;
  crop: number;
}

export type E2Trip = { frames: TripFrame[]; drops: { x: number; y: number; ul: number }[] };

export interface E2Response {
  rows: E2Row[];
  /** Fraction of 2009-protocol scouts that found both drops. */
  foundBoth: number;
  trips: E2Trip[];
  ms: number;
}

const BLOCKS = 10;

export function computeE2Table(scouts: number, seed: number): { rows: E2Row[]; foundBoth: number } {
  const sim = simulateE2(LASIUS_PARAMS, Math.ceil(scouts / BLOCKS), MAILLEUX_SETUP, 0.1, seed, BLOCKS);
  return { rows: e2Compare(sim), foundBoth: sim['two.foundBoth'].mean };
}

/** A few example trips for the animation. */
export function computeE2Trips(seed: number, showCondition: string): E2Trip[] {
  const trips: E2Trip[] = [];
  const two = showCondition === 'two';
  for (let k = 0; k < 6; k++) {
    const frames: TripFrame[] = [];
    let last = -1;
    const { world } = runScoutWorld(
      LASIUS_PARAMS,
      { seed: seed + 777 + k, drop1: { ul: two ? 0.7 : 3, molar: 0.6 }, drop2: two ? { ul: 0.7, molar: 0.6 } : undefined, pipetteAccessible: MAILLEUX_PIPETTE_ACCESSIBLE, desiredScale: two ? MAILLEUX_SETUP.desiredScale2009 : undefined, starvationDays: two ? 4 : Number(showCondition.slice(1)), dt: 0.05, maxTime: 600 },
      (w) => {
        if (w.time - last < 0.2) return;
        last = w.time;
        const a = w.ants[0];
        frames.push({ t: w.time, x: a.body.x, y: a.body.y, heading: a.body.heading, mode: a.mind.mode, gaster: a.body.gasterDown, crop: a.body.cropUl });
      },
    );
    trips.push({ frames, drops: world.food.map((f) => ({ x: f.x, y: f.y, ul: f.initialUl })) });
  }
  return trips;
}

export function computeE2(r: E2Request): E2Response {
  const t0 = performance.now();
  const table = computeE2Table(r.scouts, r.seed);
  return { ...table, trips: computeE2Trips(r.seed, r.showCondition), ms: performance.now() - t0 };
}
