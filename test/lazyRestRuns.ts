import { expect } from 'vitest';
import { runColony } from '../src/sim/experiments/colonyBles';
import { LazyColonySim, newColonySim } from '../src/sim/experiments/colonyLazy';
import { runNest1999, runRecruiter1999 } from '../src/sim/experiments/colonyMailleux1999';
import { simulateStroeymeyt } from '../src/sim/experiments/colonyStroeymeyt';
import { LASIUS_NEST, LASIUS_PARAMS } from '../src/sim/species/lasiusM1';
import { m1999Points } from '../scripts/m1999Points';
import { C2_DRIVE_START, loadTrips, s2018Params, S2018_START } from '../scripts/s2018Lib';

/** Whole-run cases for lazy resting ants (backlog B014): each runs stepped and with `lazyRest` and requires identical output. */

export function refusals(): void {
  const P = { ...LASIUS_PARAMS, nest: LASIUS_NEST };
  expect(() => newColonySim(P, { seed: 1, lazyRest: {}, oracle: { kind: 'const', factor: 1 } })).toThrow(/lazyRest/);
  expect(() => newColonySim(P, { seed: 1, lazyRest: {}, fastPath: false })).toThrow(/lazyRest/);
  expect(newColonySim(P, { seed: 1, lazyRest: {} })).toBeInstanceOf(LazyColonySim);
  expect(newColonySim(P, { seed: 1 })).not.toBeInstanceOf(LazyColonySim);
  // A copy keeps its class (shared warm-ups clone the warmed run).
  expect(newColonySim(P, { seed: 1, ants: 3, lazyRest: {} }).clone(1)).toBeInstanceOf(LazyColonySim);
}

/** A Bles colony fed at minute 3 (sharing, offering and soliciting signals): every frame, every bout, the ledger. */
export function blesCase(ants: number, minutes: number): void {
  const P = { ...LASIUS_PARAMS, nest: LASIUS_NEST };
  const o = { seed: 77, ants, minutes, foodMinute: 3, frameEvery: 2 };
  const a = runColony(P, o);
  const sim = newColonySim(P, { ...o, lazyRest: {} });
  expect(sim).toBeInstanceOf(LazyColonySim);
  while (sim.stepIndex < sim.steps) sim.step();
  const b = sim.result();
  expect(b.bouts.length).toBeGreaterThan(0);
  expect(JSON.stringify(b.frames)).toBe(JSON.stringify(a.frames));
  expect(JSON.stringify(b.bouts)).toBe(JSON.stringify(a.bouts));
  expect(b.world.ledger.total('sugar')).toBe(a.world.ledger.total('sugar'));
}

/** A C2 Stroeymeyt colony at start 0 (drive, crowding, rest depth, trips, water): `s` s warm-up and observed; verification on `v` + `v` s. */
export function stroeymeytCase(s: number, v: number): void {
  const trips = loadTrips();
  const P = s2018Params({ ...S2018_START, ...C2_DRIVE_START[0] }, trips.outRate, 'C2');
  const c = { label: 'test', nurses: 24, foragers: 10, noiseSd: 0.1, detection: 0.9 };
  const o = { seed: 4242, phase: 'light' as const, warmupS: s, obsS: s, dt: 0.05, exploreGiveUp: trips.exploreGiveUp, exploreGiveUpSd: trips.exploreGiveUpSd };
  expect(JSON.stringify(simulateStroeymeyt(P, c, { ...o, lazyRest: {} }))).toBe(JSON.stringify(simulateStroeymeyt(P, c, o)));
  const ov = { ...o, warmupS: v, obsS: v };
  expect(JSON.stringify(simulateStroeymeyt(P, c, { ...ov, lazyRest: { verify: true } }))).toBe(JSON.stringify(simulateStroeymeyt(P, c, ov)));
}

/** Mailleux 1999 at the pilot start 2: a shared warm-up nest (two clones keyed apart) with decomposition; with `full`, followed nestmates (5 min more) and a recruiter in its own nest too. */
export function mailleuxCase(warmup: number, full: boolean): void {
  const pt = m1999Points('')[1];
  const o = { seed: 99, starvationDays: 8 as const, density: pt.density, pipetteAccessible: pt.accessible, warmup, dt: 0.1, followNestmates: full, decompose: true };
  expect(JSON.stringify(runNest1999(pt.P, { ...o, lazyRest: {} }, 0, 2))).toBe(JSON.stringify(runNest1999(pt.P, o, 0, 2)));
  if (full) expect(JSON.stringify(runRecruiter1999(pt.P, { ...o, lazyRest: {} }))).toBe(JSON.stringify(runRecruiter1999(pt.P, o)));
}
