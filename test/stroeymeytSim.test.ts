import { describe, expect, it } from 'vitest';
import { ColonySim } from '../src/sim/experiments/colonyBles';
import { simulateStroeymeyt, STROEYMEYT_SOURCES } from '../src/sim/experiments/colonyStroeymeyt';
import { s2018Base } from '../src/sim/experiments/stroeymeytTargets';
import { LASIUS_NEST, LASIUS_NEST_B, LASIUS_PARAMS } from '../src/sim/species/lasiusM1';
import { stroeymeytApparatus } from '../src/sim/world/apparatus';

const P = { ...LASIUS_PARAMS, nest: { ...LASIUS_NEST, returnRate: 0, forager: { outRate: 1 / 30 } } };
const col = { label: 'test', nurses: 6, foragers: 6, noiseSd: 0.02, detection: 0.8 };

describe('Stroeymeyt set-up (step 4a)', () => {
  it('is deterministic, observes the nest, and only foragers leave', () => {
    const o = { seed: 3, phase: 'light' as const, warmupS: 60, obsS: 300, exploreGiveUp: 30 };
    const a = simulateStroeymeyt(P, col, o);
    const b = simulateStroeymeyt(P, col, o);
    expect(a.rows).toEqual(b.rows);
    expect(a.rows['speed.nurse.light']).toBeGreaterThan(0);
    // 0.8 detection, 600 frames: about 0.8 × 13 ants per frame on average.
    expect(a.rows['detection']).toBeGreaterThan(0.7);
    expect(a.foragersIn).toBeLessThan(1);
    // Nurses are always in the nest, so they are never missing from density for long.
    expect(a.rows['density.light'] * 28).toBeGreaterThanOrEqual(6);
  });
});

describe('Stroeymeyt set-up: water (STATUS 2026-10-15)', () => {
  const W = s2018Base({ ...LASIUS_PARAMS, nest: { ...LASIUS_NEST_B, forager: {} } }, 1 / 30);
  const roles = [...Array(6).fill('nurse'), ...Array(6).fill('forager'), 'queen'] as ('nurse' | 'forager' | 'queen')[];
  // Nurses start just below the thirst threshold, so water must reach them by trophallaxis within the run.
  const o = { seed: 7, ants: roles.length, roles, setup: stroeymeytApparatus(), dt: 0.1, minutes: 40, foodMinute: Infinity, exploreGiveUp: 120, exploreOutside: true, starvationDays: 0, walkSpeedFactor: 1, tempC: 26, sources: STROEYMEYT_SOURCES, waterInit: { nurse: [0.85, 0.88] as [number, number], forager: [1, 1] as [number, number], foragerCrop: [1.4, 2] as [number, number] } };

  it('conserves sugar and water with ad-libitum sources; nurses receive water and rehydrate; nobody dies', () => {
    const sim = new ColonySim(W, o);
    // Each ant has its own persistent walk-on factor in this set-up (S2018_WALK_ON_SD; STATUS 2026-10-15 late evening).
    const f = sim.w.ants.map((a) => a.mind.traits.walkOnFactor);
    expect(f.every((x) => x !== undefined && x > 0)).toBe(true);
    expect(new Set(f).size).toBe(f.length);
    const start = sim.w.ants.map((a) => a.body.water / a.body.waterMax);
    while (sim.stepIndex < sim.steps) sim.step();
    const r = sim.result();
    const w = r.world;
    const e = w.entityTotals();
    for (const q of ['sugar', 'water'] as const) {
      const scale = Math.abs(w.ledger.get(q, 'external'));
      expect(Math.abs(w.ledger.total(q))).toBeLessThan(1e-9 * scale);
      for (const a of ['food', 'crop', 'reserve'] as const) expect(Math.abs(w.ledger.get(q, a) - e[`${q}:${a}`])).toBeLessThan(1e-9 * scale);
    }
    // Sources stay at their volume (ad libitum).
    expect(w.food.map((f) => f.volumeUl)).toEqual(STROEYMEYT_SOURCES.map((s) => s.ul));
    expect(w.ants.every((a) => a.body.alive && a.body.water <= a.body.waterMax)).toBe(true);
    const nurse = (i: number) => roles[i] === 'nurse';
    expect(r.bouts.some((b) => nurse(b.receiver) && b.ul > 0)).toBe(true);
    // Without water a nurse loses ≈ 0.02 of its maximum in 40 min; at least one ends above where it started.
    expect(w.ants.some((a, i) => nurse(i) && a.body.water / a.body.waterMax > start[i] + 0.01)).toBe(true);
  });
});
