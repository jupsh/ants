import { describe, expect, it } from 'vitest';
import { simulateStroeymeyt, type StroeymeytColony } from '../src/sim/experiments/colonyStroeymeyt';
import { s2018Base } from '../src/sim/experiments/stroeymeytTargets';
import { driverLocalTable, driverPerimeterTable, esFloorMean, perimeterPoint, waveWeight } from '../src/sim/experiments/colonyBles';
import { RNG } from '../src/sim/core/rng';
import { LASIUS_NEST_B, LASIUS_PARAMS } from '../src/sim/species/lasiusM1';

// Part D Stages 1–3 build (D126 amendment 1, D158, D159): mapping M, the relay, travelling fronts and Es. Off or
// neutral = bit-identical; the normalisations hold by Monte Carlo.
const P = s2018Base({ ...LASIUS_PARAMS, nest: { ...LASIUS_NEST_B, forager: { activeToRest: 1.07, restToActive: 0.6 } } }, 1 / 300);
const base: StroeymeytColony = { label: 'test', nurses: 10, foragers: 4, noiseSd: 0, detection: 0.9 };
const o = { seed: 7, phase: 'light' as const, warmupS: 60, obsS: 900, exploreGiveUp: 60 };
const o2 = { ...o, obsS: 600 };
const rows = (c: StroeymeytColony, opt = o) => JSON.stringify(simulateStroeymeyt(P, c, opt).rows);
const nest = { x0: 0, x1: 70, y0: 0, y1: 40 };

describe('Part D: strength 0 and the switches off', () => {
  const none = rows(base);
  it('strength 0 under M leaves every new member bit-identical to base', () => {
    expect(rows({ ...base, oracle: { kind: 'local', kappa: 0, r: 10, tauC: 5, mapM: true } })).toBe(none);
    expect(rows({ ...base, oracle: { kind: 'driverShared', amp: 0, tau: 60, mapM: true } })).toBe(none);
    expect(rows({ ...base, oracle: { kind: 'driverLocal', amp: 0, sigma: 20, mapM: true } })).toBe(none);
    expect(rows({ ...base, oracle: { kind: 'driverWave', amp: 0, sigma: 20, v: 5, origin: 'uniform', mapM: true } })).toBe(none);
    expect(rows({ ...base, oracle: { kind: 'driverWave', amp: 0, sigma: Infinity, v: 5, origin: 'perimeter', mapM: true } })).toBe(none);
    expect(rows({ ...base, oracle: { kind: 'driverSpatial', amp: 0, tau: 60, lambda: 20, mapM: true } })).toBe(none);
  });
  it('with the stop channel off the relay is `local`; on, it changes the run', () => {
    const local = rows({ ...base, oracle: { kind: 'local', kappa: 1, r: 10, tauC: 5 } });
    expect(rows({ ...base, oracle: { kind: 'local', kappa: 1, r: 10, tauC: 5, mapM: false } })).toBe(local);
    expect(rows({ ...base, oracle: { kind: 'local', kappa: 1, r: 10, tauC: 5, mapM: true } })).not.toBe(local);
  });
  it('the relay resets an isolated ant: with a vanishing range nothing changes', () => {
    const r = simulateStroeymeyt(P, { ...base, oracle: { kind: 'local', kappa: 2, r: 1e-6, tauC: 5, mapM: true }, oracleTrace: { every: 10 } }, o2);
    expect(JSON.stringify(r.rows)).toBe(JSON.stringify(simulateStroeymeyt(P, base, o2).rows));
    expect(r.oracleG!.sumPost).toBe(r.oracleG!.n);
  });
});

describe('Part D: mapping M', () => {
  it('divides the stop rate by g: a small shared driver under M differs from walk-on only, and the rates are restored', () => {
    // A = 0.3 keeps |log g| below log 4 in practice, so M changes the run only through the stop channel.
    const walkOnly = rows({ ...base, oracle: { kind: 'driverShared', amp: 0.3, tau: 60 } });
    const before = [P.nest.restToActive, P.nest.activeToRest, P.nest.forager!.restToActive, P.nest.forager!.activeToRest];
    const m = rows({ ...base, oracle: { kind: 'driverShared', amp: 0.3, tau: 60, mapM: true } });
    expect(m).not.toBe(walkOnly);
    expect([P.nest.restToActive, P.nest.activeToRest, P.nest.forager!.restToActive, P.nest.forager!.activeToRest]).toEqual(before);
    // The comparison-Q stop multiplier combines with M's: aggregation of strength 0 changes nothing.
    expect(rows({ ...base, aggregate: { k: 0, r: 8 }, oracle: { kind: 'driverShared', amp: 0.3, tau: 60, mapM: true } })).toBe(m);
  });
  it('records g before and after clipping (P21): a strong relay clips, and the realised means are kept apart', () => {
    const r = simulateStroeymeyt(P, { ...base, oracle: { kind: 'local', kappa: 4, r: 20, tauC: 5, mapM: true }, oracleTrace: { every: 10 } }, o2);
    const g = r.oracleG!;
    expect(g.n).toBeGreaterThan(50);
    expect(g.clipped).toBeGreaterThan(0);
    expect(g.sumPre).not.toBe(g.sumPost);
    expect(g.sumPost / g.n).toBeLessThanOrEqual(4);
    expect(g.sumInvPost / g.n).toBeLessThanOrEqual(4);
    // The trace holds the clipped (applied) value.
    const s = r.oracleStats!;
    expect(s.sumG).toBeCloseTo(g.sumPost, 6);
    // No oracleG without a trace.
    expect(simulateStroeymeyt(P, { ...base, oracle: { kind: 'local', kappa: 4, r: 20, tauC: 5, mapM: true } }, o2).oracleG).toBeUndefined();
  });
});

describe('Part D: travelling fronts (driverWave)', () => {
  it('v = ∞ with uniform origins is `driverLocal`, with and without M', () => {
    for (const mapM of [false, true]) {
      const a = simulateStroeymeyt(P, { ...base, oracle: { kind: 'driverWave', amp: 1, sigma: 20, v: Infinity, origin: 'uniform', mapM }, oracleTrace: { every: 10 } }, o2);
      const b = simulateStroeymeyt(P, { ...base, oracle: { kind: 'driverLocal', amp: 1, sigma: 20, mapM }, oracleTrace: { every: 10 } }, o2);
      expect(JSON.stringify(a.rows)).toBe(JSON.stringify(b.rows));
      expect(a.oracleStats).toEqual(b.oracleStats);
    }
  });
  it('finite fronts and perimeter origins change the run', () => {
    const local = rows({ ...base, oracle: { kind: 'driverLocal', amp: 1, sigma: 20, mapM: true } });
    const ed5 = rows({ ...base, oracle: { kind: 'driverWave', amp: 1, sigma: 20, v: 5, origin: 'uniform', mapM: true } });
    expect(ed5).not.toBe(local);
    expect(rows({ ...base, oracle: { kind: 'driverWave', amp: 1, sigma: Infinity, v: 5, origin: 'perimeter', mapM: true } })).not.toBe(ed5);
  });
  it('front timing on a fixed event: exposed from d / v for dur, with weight exp(−d² / 2σ²)', () => {
    const s2 = 2 * 20 * 20;
    const w = Math.exp(-100 / s2);
    // d = 10 mm (6, 8), v = 5 mm/s: the front arrives at 2 s and passes at 62 s.
    expect(waveWeight(6, 8, 1.999, 5, 60, s2)).toBe(0);
    expect(waveWeight(6, 8, 2, 5, 60, s2)).toBe(w);
    expect(waveWeight(6, 8, 61.999, 5, 60, s2)).toBe(w);
    expect(waveWeight(6, 8, 62, 5, 60, s2)).toBe(0);
    expect(waveWeight(6, 8, 30, 5, 60, Infinity)).toBe(1);
  });
  it('perimeter points walk the nest boundary', () => {
    expect(perimeterPoint(nest, 0)).toEqual([0, 0]);
    expect(perimeterPoint(nest, 70)).toEqual([70, 0]);
    expect(perimeterPoint(nest, 100)).toEqual([70, 30]);
    expect(perimeterPoint(nest, 150)).toEqual([30, 40]);
    expect(perimeterPoint(nest, 200)).toEqual([0, 20]);
  });
  it('E[g | x] = 1 for both origin kinds under the stationary front process (Monte Carlo)', () => {
    const A = 1.2;
    const sigma = 20;
    const v = 5;
    const dur = 60;
    const life = dur + Math.hypot(70, 40) / v;
    const s2 = 2 * sigma * sigma;
    const rng = RNG.stream(99, 2);
    for (const origin of ['uniform', 'perimeter'] as const) {
      const c = origin === 'uniform' ? driverLocalTable(nest, A, sigma, 1) : driverPerimeterTable(nest, A, sigma, 1);
      for (const [cx, cy] of [[35, 20], [2, 2], [60, 38]]) {
        let sum = 0;
        const N = 40000;
        for (let k = 0; k < N; k++) {
          let S = 0;
          // Events that arrived in the last `life` s (Poisson, rate 1 / dur); origins as the tables integrate.
          for (let e = rng.poisson(life / dur); e > 0; e--) {
            const since = rng.range(0, life);
            const [ex, ey] = origin === 'uniform' ? [rng.int(70), rng.int(40)] : perimeterPoint(nest, rng.range(0, 220));
            S += waveWeight(cx - ex, cy - ey, since, v, dur, s2);
          }
          sum += Math.exp(A * S - c[cy * 70 + cx]);
        }
        expect(sum / N).toBeCloseTo(1, 1.5);
      }
    }
  });
});

describe('Part D: Es (driverSpatial)', () => {
  it('λ = ∞ under M is the shared driver under M (Eu-M), rows and realised signal', () => {
    const a = simulateStroeymeyt(P, { ...base, oracle: { kind: 'driverSpatial', amp: 1, tau: 60, lambda: Infinity, mapM: true }, oracleTrace: { every: 10 } }, o2);
    const b = simulateStroeymeyt(P, { ...base, oracle: { kind: 'driverShared', amp: 1, tau: 60, mapM: true }, oracleTrace: { every: 10 } }, o2);
    expect(JSON.stringify(a.rows)).toBe(JSON.stringify(b.rows));
    expect(a.oracleStats).toEqual(b.oracleStats);
    expect(rows({ ...base, oracle: { kind: 'driverSpatial', amp: 1, tau: 60, lambda: 20, mapM: true } })).not.toBe(JSON.stringify(b.rows));
  });
  it('the response map averages 1 over the nest floor and is strongest at the entrance', () => {
    const lambda = 20;
    const norm = 1 / esFloorMean(nest, 35, 40, lambda);
    // A finer, offset grid than the normaliser's.
    let sum = 0;
    let n = 0;
    for (let y = 0.0125; y < 40; y += 0.025)
      for (let x = 0.0125; x < 70; x += 0.025) {
        sum += Math.exp(-Math.hypot(x - 35, y - 40) / lambda) * norm;
        n++;
      }
    expect(Math.abs(sum / n - 1)).toBeLessThan(1e-3);
    const beta = (x: number, y: number) => Math.exp(-Math.hypot(x - 35, y - 40) / lambda) * norm;
    expect(beta(35, 39)).toBeGreaterThan(1);
    expect(beta(1, 1)).toBeLessThan(1);
  });
  it('E[g | x] = 1 at fixed positions before clipping, under the stationary signal (Monte Carlo)', () => {
    // A small A keeps the lognormal's tail within reach of the sample (β ≈ 3 by the entrance); bound: 3 SE.
    const A = 0.3;
    const lambda = 20;
    const norm = 1 / esFloorMean(nest, 35, 40, lambda);
    const rng = RNG.stream(99, 3);
    for (const [x, y] of [[35, 39], [10, 5], [65, 20]]) {
      const a = A * (Math.exp(-Math.hypot(x - 35, y - 40) / lambda) * norm);
      let sum = 0;
      let sq = 0;
      const N = 200000;
      for (let k = 0; k < N; k++) {
        const g = Math.exp(a * rng.gauss() - (a * a) / 2);
        sum += g;
        sq += g * g;
      }
      const m = sum / N;
      expect(Math.abs(m - 1)).toBeLessThan(3 * Math.sqrt((sq / N - m * m) / N));
    }
  });
});
