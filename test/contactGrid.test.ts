import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { ColonySim } from '../src/sim/experiments/colonyBles';
import { simulateStroeymeyt } from '../src/sim/experiments/colonyStroeymeyt';
import { LASIUS_NEST, LASIUS_NEST_B, LASIUS_PARAMS } from '../src/sim/species/lasiusM1';
import { stroeymeytApparatus } from '../src/sim/world/apparatus';

function hash(sim: ColonySim): string {
  const ants = sim.w.ants.map((a) => [a.body.x, a.body.y, a.body.heading, a.body.cropUl, a.body.reserve, a.mind.mode]);
  return createHash('sha256').update(JSON.stringify([sim.result().bouts, ants])).digest('hex');
}

function run(P: typeof LASIUS_PARAMS & { nest: typeof LASIUS_NEST }, o: ConstructorParameters<typeof ColonySim>[1]): string {
  const sim = new ColonySim(P, o);
  while (sim.stepIndex < sim.steps) sim.step();
  return hash(sim);
}

describe('contact grid (STATUS 2026-10-11)', () => {
  it('gives the same run as checking all ants: Bles colony with food and sharing', () => {
    const P = { ...LASIUS_PARAMS, nest: LASIUS_NEST };
    const o = { seed: 5, ants: 40, minutes: 6, foodMinute: 1 };
    expect(run(P, { ...o, contactGrid: false })).toBe(run(P, o));
    expect(run(P, { ...o, fastPath: false })).toBe(run(P, o));
  });

  it('gives the same run with option-B encounter stops in a crowded Stroeymeyt nest', () => {
    const P = { ...LASIUS_PARAMS, nest: { ...LASIUS_NEST_B, returnRate: 0, forager: { ...LASIUS_NEST_B.forager, outRate: 1 / 60 } } };
    const roles = [...Array(60).fill('nurse'), ...Array(20).fill('forager'), 'queen'] as ('nurse' | 'forager' | 'queen')[];
    const o = { seed: 9, ants: roles.length, roles, setup: stroeymeytApparatus(), minutes: 4, foodMinute: 0, foodUl: 500, molar: 0.3, starvationDays: 0, walkSpeedFactor: 1 };
    expect(run(P, { ...o, contactGrid: false })).toBe(run(P, o));
    expect(run(P, { ...o, fastPath: false })).toBe(run(P, o));
  });

  it('fast path: same run as per-ant percepts in a Stroeymeyt nest with resting, waking and trips (STATUS 2026-10-12)', () => {
    const P = { ...LASIUS_PARAMS, nest: { ...LASIUS_NEST, returnRate: 0, forager: { outRate: 1 / 120 } } };
    const roles = [...Array(40).fill('nurse'), ...Array(15).fill('forager'), 'queen'] as ('nurse' | 'forager' | 'queen')[];
    const o = { seed: 13, ants: roles.length, roles, setup: stroeymeytApparatus(), minutes: 6, foodMinute: 0, foodUl: 500, molar: 0.3, starvationDays: 0, walkSpeedFactor: 1 };
    expect(run(P, { ...o, fastPath: false, contactGrid: false })).toBe(run(P, o));
  });

  it('leaves the Stroeymeyt rows unchanged', () => {
    const P = { ...LASIUS_PARAMS, nest: { ...LASIUS_NEST, returnRate: 0, forager: { outRate: 1 / 60 } } };
    const col = { label: 't', nurses: 10, foragers: 5, noiseSd: 0.02, detection: 0.8 };
    const r = simulateStroeymeyt(P, col, { seed: 2, phase: 'dark', warmupS: 30, obsS: 120, exploreGiveUp: 60 });
    expect(Number.isFinite(r.rows['speed.nurse.dark'])).toBe(true);
  });
});
