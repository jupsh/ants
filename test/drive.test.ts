import { describe, expect, it } from 'vitest';
import { enterNest, lasiusNestWorker, nestParamsOf } from '../src/sim/behavior/lasiusNestWorker';
import { RNG } from '../src/sim/core/rng';
import { simulateStroeymeyt, type StroeymeytColony } from '../src/sim/experiments/colonyStroeymeyt';
import { s2018Base } from '../src/sim/experiments/stroeymeytTargets';
import { driveFactor, stepDrive } from '../src/sim/mind/drive';
import { newMind, setMode, type Mind } from '../src/sim/mind/mind';
import { basicPercept } from '../src/sim/perception/types';
import { LASIUS_NEST, LASIUS_NEST_B, LASIUS_PARAMS } from '../src/sim/species/lasiusM1';

// Candidate C2 (STATUS 2026-10-18 ≈ 01:43 / 01:46): latent activity drive and the wall-rule parameter.
const traits = { desiredVolumeFactor: 1, neverLays: false, layIntensity: 0.13 };
const P = s2018Base({ ...LASIUS_PARAMS, nest: { ...LASIUS_NEST_B, forager: { activeToRest: 1.07, restToActive: 0.6 } } }, 1 / 300);
const base: StroeymeytColony = { label: 'test', nurses: 10, foragers: 4, noiseSd: 0, detection: 0.9 };
const o = { seed: 7, phase: 'light' as const, warmupS: 60, obsS: 900, exploreGiveUp: 60 };
const rows = (Q: typeof P, c: StroeymeytColony = base) => JSON.stringify(simulateStroeymeyt(Q, c, o).rows);
const withNest = (n: Partial<typeof P.nest>) => ({ ...P, nest: { ...P.nest, ...n } });

describe('latent activity drive', () => {
  const none = rows(P);
  it('σ = 0 leaves the run bit-identical (whatever τ)', () => {
    expect(rows(withNest({ driveSd: 0, driveTau: 5 }))).toBe(none);
  });
  it('a positive σ changes the run, for either role alone', () => {
    expect(rows(withNest({ driveSd: 1 }))).not.toBe(none);
    expect(rows(withNest({ forager: { ...P.nest.forager, driveSd: 1 } }))).not.toBe(none);
  });
  it('is stationary with unit variance, correlation e^(−lag/τ) and a mean-one multiplier', () => {
    const tau = 60;
    const dt = 0.1;
    const n = 400;
    const minds = Array.from({ length: n }, () => ({ drive: undefined }) as unknown as Mind);
    const rngs = minds.map((_, i) => RNG.stream(3, 0xd21e, i));
    let sum = 0;
    let sq = 0;
    let lag = 0;
    let f = 0;
    let k = 0;
    const lagSteps = Math.round(tau / dt);
    const z0: number[] = [];
    for (let s = 0; s < 4 * lagSteps; s++) {
      minds.forEach((m, i) => stepDrive(m, tau, dt, rngs[i]));
      if (s === 2 * lagSteps) minds.forEach((m) => z0.push(m.drive!));
      if (s === 3 * lagSteps) minds.forEach((m, i) => (lag += z0[i] * m.drive!));
      if (s % 50 === 0)
        for (const m of minds) {
          sum += m.drive!;
          sq += m.drive! * m.drive!;
          f += driveFactor(m, 1);
          k++;
        }
    }
    expect(Math.abs(sum / k)).toBeLessThan(0.1);
    expect(Math.abs(sq / k - 1)).toBeLessThan(0.1);
    expect(Math.abs(lag / n - Math.exp(-1))).toBeLessThan(0.12);
    expect(Math.abs(f / k - 1)).toBeLessThan(0.1);
  });
  it('reaches each role through its own σ (forager overlay)', () => {
    const p = { ...LASIUS_NEST, driveSd: 0, forager: { driveSd: 1.5 } };
    expect(nestParamsOf(p, true).driveSd).toBe(1.5);
    expect(nestParamsOf(p, false).driveSd).toBe(0);
    // A resting ant with drive z = 1 wakes at exp(σ − σ²/2) times the plain rate: mean rest length ratio.
    const meanRest = (forager: boolean, z: number | undefined) => {
      const rng = new RNG(11);
      const m = newMind({ ...traits, forager }, LASIUS_PARAMS.walk, rng);
      enterNest(m, true);
      m.drive = z;
      const q = { ...p, restToActive: 0.5, activeToRest: 1e-9, restShape: 0, restCrowdExp: 0, encounterStop: 0, outRate: 0 };
      const per = { ...basicPercept(0.1, 0, 0, 22, 0), inNest: true, contacts: [] };
      const io = { reserve: 0.9, cropUl: 0, cropCapacity: 2, water: 1, bodyMass: 2, mouthFlow: 0, cropFull: false };
      let rests = 0;
      let time = 0;
      for (let s = 0; s < 200000; s++) {
        const a = lasiusNestWorker(per, io, m, q, rng);
        time += a.stand ? 0.1 : a.walkFrac !== undefined ? (1 - a.walkFrac) * 0.1 : 0;
        if (m.mode === 'active') {
          rests++;
          setMode(m, 'rest');
          m.stay.restMult = NaN;
        }
      }
      return time / rests;
    };
    const plain = meanRest(true, undefined);
    expect(meanRest(false, 1) / plain).toBeCloseTo(1, 1);
    expect(plain / meanRest(true, 1)).toBeCloseTo(Math.exp(1.5 - 1.125), 1);
  });
});

describe('wall-rule parameter', () => {
  it("'follow' is the default and 'specular' equals the diagnostic switch", () => {
    expect(P.nest.wallRule).toBe('follow');
    expect(rows(withNest({ wallRule: 'specular' }))).toBe(rows(P, { ...base, wall: 'specular' }));
    expect(rows(withNest({ wallRule: 'specular' }))).not.toBe(rows(P));
  });
});
