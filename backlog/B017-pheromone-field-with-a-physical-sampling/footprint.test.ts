import { describe, expect, it } from 'vitest';
import { Body } from '../../src/sim/agent/body';
import { newMind } from '../../src/sim/mind/mind';
import { DEFAULT_WALK } from '../../src/sim/models/walk';
import { basicPercept } from '../../src/sim/perception/types';
import { Apparatus } from '../../src/sim/world/apparatus';
import { walkAnt, type PhysParams } from './antPhysics';
import { PheromoneField, PROVISIONAL_TRAIL_SAMPLING_SIGMA } from './field';
import { World } from './world';

const SIGMA = PROVISIONAL_TRAIL_SAMPLING_SIGMA.v;
const phys: PhysParams = { intakeRate: 0, intakeSd: 0, metabolic: 0, activeFactor: 1,
  permeability: 0, surfaceArea: 1, depositPerMm: 1, compassNoise: 0 };

function fixture(cell: number, sigma?: number) {
  const app = new Apparatus([{ name: 'synthetic', kind: 'arena', x0: 0, x1: 100, y0: 0, y1: 60, covered: false }]);
  const world = new World(app, [0, 0], 19, 25, 50);
  const field = new PheromoneField(Math.ceil(100 / cell), Math.ceil(60 / cell), cell, 100, sigma);
  world.trail = field;
  const body = new Body(0, 19, { len: 4, mass: 2, cropCapacity: 2, antennaReach: 2.6, cropFullFrac: 0.98 }, 0.5, 1);
  body.x = 20;
  body.y = 30.37;
  body.gasterDown = true;
  const agent = { body, mind: newMind({ desiredVolumeFactor: 1, neverLays: false, layIntensity: 1 }, DEFAULT_WALK, body.rng), inactive: false };
  world.ants.push(agent);
  return { world, field, agent };
}

function layTrail(cell: number, y: number, sigma = SIGMA) {
  const f = new PheromoneField(Math.ceil(100 / cell), Math.ceil(60 / cell), cell, 100, sigma);
  const step = cell / 2;
  for (let x = 20; x < 80 - step / 2; x += step) f.deposit(x + step / 2, y, 1, step);
  return f;
}

describe('optional physical pheromone sampling footprint', () => {
  it('rejects negative or non-finite widths and marks the demonstration value provisional', () => {
    for (const sigma of [-1, NaN, Infinity]) expect(() => new PheromoneField(10, 10, 1, 100, sigma)).toThrow(RangeError);
    expect(PROVISIONAL_TRAIL_SAMPLING_SIGMA.conf).toBe('estimated');
    expect(PROVISIONAL_TRAIL_SAMPLING_SIGMA.note).toContain('not adopted');
  });

  it('keeps omitted and zero footprint exactly identical for deposits, samples and walking', () => {
    const a = fixture(0.125);
    const b = fixture(0.125, 0);
    for (const f of [a, b]) {
      for (const t of [0, 50, 3100]) {
        f.field.setTime(t);
        walkAnt(f.world, f.agent, basicPercept(0.1, 0, 0, 25), DEFAULT_WALK, phys, {}, (_p, _s, _per, _k, _pi, move) => {
          move(3.7, 0.9, Math.hypot(3.7, 0.9));
          return Math.hypot(3.7, 0.9);
        });
      }
    }
    expect(a.field.data).toEqual(b.field.data);
    expect(a.field.sample(25.3, 31.1)).toBe(b.field.sample(25.3, 31.1));
    expect(a.agent).toEqual(b.agent);
    expect(a.field.samplingSigmaMm).toBe(0);
  });

  it('converges to the analytic straight-trail profile at all four sub-cell phases', () => {
    for (const phase of [0, 0.25, 0.5, 0.75]) {
      const coarseY = 30.37 + phase * 0.25;
      const fineY = 30.37 + phase * 0.125;
      const coarse = layTrail(0.25, coarseY);
      const fine = layTrail(0.125, fineY);
      for (const offset of [0, 0.5]) {
        const a = coarse.sample(50.5, coarseY + offset);
        const b = fine.sample(50.5, fineY + offset);
        expect(Math.abs(b - a)).toBeLessThan(Math.max(0.01, 0.1 * a));
        expect(Math.abs(b - Math.exp(-offset * offset / (2 * SIGMA * SIGMA)))).toBeLessThan(0.02);
      }
    }
  });

  it('preserves deposited mass and exponential decay in footprint mode', () => {
    const f = layTrail(0.125, 30.37);
    const mass = () => f.data.reduce((sum, _v, i) => sum + f.cellValue(i) * f.cell, 0);
    expect(mass()).toBeCloseTo(60, 4);
    const c0 = f.sample(50, 30.87);
    for (const t of [25, 100, 400]) {
      f.setTime(t);
      expect(f.sample(50, 30.87) / c0).toBeCloseTo(Math.exp(-t / 100), 10);
      expect(mass()).toBeCloseTo(60 * Math.exp(-t / 100), 4);
    }
  });

  it('has no longitudinal gaps when the real walkAnt deposition uses a fine grid', () => {
    const { world, field, agent } = fixture(0.125, SIGMA);
    const lengths: number[] = [];
    const deposit = field.deposit.bind(field);
    field.deposit = (x, y, amount, length) => { lengths.push(length); deposit(x, y, amount, length); };
    walkAnt(world, agent, basicPercept(0.1, 0, 0, 25), DEFAULT_WALK, phys, {}, (_p, _s, _per, _k, _pi, move) => {
      move(60, 0, 60);
      return 60;
    });
    expect(lengths.length).toBe(960);
    expect(Math.max(...lengths)).toBeLessThanOrEqual(field.cell / 2);
    expect(lengths.reduce((a, b) => a + b, 0)).toBeCloseTo(60, 10);
    expect(field.data.reduce((a, b) => a + b * field.cell, 0)).toBeCloseTo(60, 4);
    for (let x = 40; x <= 60; x += 0.03125) expect(field.sample(x, 30.37)).toBeGreaterThan(0.95);
    expect(agent.body.x).toBe(80);
    expect(agent.body.stepLen).toBe(60);
  });

  it('zero-pads boundaries instead of amplifying the footprint near an edge', () => {
    const f = new PheromoneField(100, 100, 0.125, 100, SIGMA);
    f.deposit(0.5625, 6.0625, 1, 1); // exactly at a stored cell centre
    const c = f.sample(0.5625, 6.0625);
    expect(c).toBeCloseTo(1 / (Math.sqrt(2 * Math.PI) * SIGMA), 10);
    expect(f.sample(-1, 6.0625) / c).toBeCloseTo(Math.exp(-(1.5625 ** 2) / (2 * SIGMA ** 2)), 10);
    expect(f.sample(-10, -10)).toBe(0);
  });
});
