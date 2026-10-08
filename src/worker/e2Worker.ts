/// <reference lib="webworker" />
import { runScoutWorld } from '../sim/experiments/e2Mailleux';
import { e2Compare, simulateE2, type E2Row } from '../sim/experiments/e2Targets';
import { LASIUS_PARAMS, MAILLEUX_PIPETTE_ACCESSIBLE, MAILLEUX_SETUP } from '../sim/species/lasiusM1';

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

export interface E2Response {
  rows: E2Row[];
  /** Fraction of 2009-protocol scouts that found both drops. */
  foundBoth: number;
  trips: { frames: TripFrame[]; drops: { x: number; y: number; ul: number }[] }[];
  ms: number;
}

self.onmessage = (ev: MessageEvent<E2Request>) => {
  const r = ev.data;
  const t0 = performance.now();
  const BLOCKS = 10;
  const sim = simulateE2(LASIUS_PARAMS, Math.ceil(r.scouts / BLOCKS), MAILLEUX_SETUP, 0.1, r.seed, BLOCKS);
  // Record a few example trips for the animation.
  const trips: E2Response['trips'] = [];
  const two = r.showCondition === 'two';
  for (let k = 0; k < 6; k++) {
    const frames: TripFrame[] = [];
    let last = -1;
    const { world } = runScoutWorld(
      LASIUS_PARAMS,
      { seed: r.seed + 777 + k, drop1: { ul: two ? 0.7 : 3, molar: 0.6 }, drop2: two ? { ul: 0.7, molar: 0.6 } : undefined, pipetteAccessible: MAILLEUX_PIPETTE_ACCESSIBLE, starvationDays: two ? 4 : Number(r.showCondition.slice(1)), dt: 0.05, maxTime: 600 },
      (w) => {
        if (w.time - last < 0.2) return;
        last = w.time;
        const a = w.ants[0];
        frames.push({ t: w.time, x: a.body.x, y: a.body.y, heading: a.body.heading, mode: a.mind.mode, gaster: a.body.gasterDown, crop: a.body.cropUl });
      },
    );
    trips.push({ frames, drops: world.food.map((f) => ({ x: f.x, y: f.y, ul: f.initialUl })) });
  }
  const res: E2Response = { rows: e2Compare(sim), foundBoth: sim['two.foundBoth'].mean, trips, ms: performance.now() - t0 };
  (self as unknown as Worker).postMessage(res);
};
