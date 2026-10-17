import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { ColonySim } from '../src/sim/experiments/colonyBles';
import type { WalkParams } from '../src/sim/models/walk';
import { LASIUS_NEST_B, LASIUS_PARAMS } from '../src/sim/species/lasiusM1';
import { stroeymeytApparatus } from '../src/sim/world/apparatus';

type Nest = typeof LASIUS_NEST_B;
const roles = [...Array(30).fill('nurse'), ...Array(10).fill('forager'), 'queen'] as ('nurse' | 'forager' | 'queen')[];
const opts = { seed: 3, ants: roles.length, roles, setup: stroeymeytApparatus(), minutes: 2, foodMinute: 0, foodUl: 500, molar: 0.3, starvationDays: 0, walkSpeedFactor: 1 };
const params = (nest: Partial<Nest>, base: Partial<Nest> = LASIUS_NEST_B) => ({ ...LASIUS_PARAMS, nest: { ...base, returnRate: 0, ...nest, forager: { ...LASIUS_NEST_B.forager, outRate: 1 / 60, ...nest.forager } } as Nest });
const walks = (sim: ColonySim) => sim as unknown as { walkP: WalkParams; walkNestP: WalkParams; walkNestForagerP: WalkParams };

function run(nest: Partial<Nest>, base?: Partial<Nest>): string {
  const sim = new ColonySim(params(nest, base), opts);
  while (sim.stepIndex < sim.steps) sim.step();
  const ants = sim.w.ants.map((a) => [a.body.x, a.body.y, a.body.heading, a.mind.mode]);
  return createHash('sha256').update(JSON.stringify(ants)).digest('hex');
}

describe('in-nest speed fluctuation (STATUS 2026-10-16 night, under test)', () => {
  it('factors 1 are the walker as before: the same run as without them', () => {
    const { nestSpeedSdFactor, nestSpeedTauFactor, ...without } = LASIUS_NEST_B;
    expect([nestSpeedSdFactor, nestSpeedTauFactor]).toEqual([1, 1]);
    expect('nestSpeedSdFactor' in params({}, without).nest).toBe(false);
    expect(run({ nestSpeedSdFactor: 1, nestSpeedTauFactor: 1 })).toBe(run({}, without));
    expect(run({ nestSpeedSdFactor: 2 })).not.toBe(run({}));
  });

  it("scale the walker's SD and τ inside the nest only; foragers take their own values, else everyone's", () => {
    const w = walks(new ColonySim(params({ nestSpeedSdFactor: 2, nestSpeedTauFactor: 4 }), opts));
    expect(w.walkNestP.speedSdWithin).toBe(w.walkP.speedSdWithin * 2);
    expect(w.walkNestP.speedTau).toBe(w.walkP.speedTau * 4);
    expect(w.walkNestForagerP.speedSdWithin).toBe(w.walkP.speedSdWithin * 2);
    expect(w.walkP.speedSdWithin).toBe(LASIUS_PARAMS.walk.speedSdWithin);
    const f = walks(new ColonySim(params({ nestSpeedSdFactor: 2, forager: { nestSpeedSdFactor: 3 } as unknown as Nest['forager'] }), opts));
    expect(f.walkNestP.speedSdWithin).toBe(f.walkP.speedSdWithin * 2);
    expect(f.walkNestForagerP.speedSdWithin).toBe(f.walkP.speedSdWithin * 3);
    expect(f.walkNestForagerP.speedTau).toBe(f.walkP.speedTau);
  });
});
