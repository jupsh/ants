import { describe, expect, it } from 'vitest';
import { simulateStroeymeyt, type StroeymeytColony } from '../src/sim/experiments/colonyStroeymeyt';
import { s2018Base } from '../src/sim/experiments/stroeymeytTargets';
import { combineOracleStats, oracleStats, oracleSummary } from '../src/sim/analysis/oracleStats';
import { ColonySim, driverLocalTable } from '../src/sim/experiments/colonyBles';
import { RNG } from '../src/sim/core/rng';
import { runNest1999 } from '../src/sim/experiments/colonyMailleux1999';
import { LASIUS_NEST_B, LASIUS_PARAMS, MAILLEUX_SETUP } from '../src/sim/species/lasiusM1';

// Oracle colony-coupling diagnostic (STATUS 2026-10-17 ≈ 05:11 UTC) and slow-episode what-if (overnight): off or neutral =
// bit-identical; on changes the run.
const P = s2018Base({ ...LASIUS_PARAMS, nest: { ...LASIUS_NEST_B, forager: {} } }, 1 / 300);
const base: StroeymeytColony = { label: 'test', nurses: 10, foragers: 4, noiseSd: 0, detection: 0.9 };
const o = { seed: 7, phase: 'light' as const, warmupS: 60, obsS: 900, exploreGiveUp: 60 };
const rows = (c: StroeymeytColony) => JSON.stringify(simulateStroeymeyt(P, c, o).rows);

describe('oracle colony coupling', () => {
  const none = rows(base);
  it('κ = 0 and a placebo of SD 0 leave the run bit-identical', () => {
    expect(rows({ ...base, oracle: { kind: 'coupled', kappa: 0, tauC: 60 } })).toBe(none);
    expect(rows({ ...base, oracle: { kind: 'placebo', sd: 0, tauC: 60 } })).toBe(none);
    expect(rows({ ...base, oracle: { kind: 'placebo', sd: 0, tauC: 60, meanOne: true } })).toBe(none);
    expect(rows({ ...base, oracle: { kind: 'const', factor: 1 } })).toBe(none);
  });
  it('a constant factor and a mean-one placebo change the run; mean-one differs from the raw placebo', () => {
    expect(rows({ ...base, oracle: { kind: 'const', factor: 1.65 } })).not.toBe(none);
    const raw = rows({ ...base, oracle: { kind: 'placebo', sd: 1, tauC: 60 } });
    const unit = rows({ ...base, oracle: { kind: 'placebo', sd: 1, tauC: 60, meanOne: true } });
    expect(unit).not.toBe(none);
    expect(unit).not.toBe(raw);
  });
  it('coupling and placebo change the run, and the shared parameter is restored', () => {
    const before = P.nest.restToActive;
    const r = simulateStroeymeyt(P, { ...base, oracle: { kind: 'coupled', kappa: 1, tauC: 60 } }, o);
    expect(JSON.stringify(r.rows)).not.toBe(none);
    expect(rows({ ...base, oracle: { kind: 'placebo', sd: 0.5, tauC: 60 } })).not.toBe(none);
    expect(P.nest.restToActive).toBe(before);
  });
  it('the coupled arm reports a positive SD of log g once the slow signal has run 30 min', () => {
    const r = simulateStroeymeyt(P, { ...base, oracle: { kind: 'coupled', kappa: 1, tauC: 60 } }, { ...o, warmupS: 1800 });
    expect(r.oracleLogSd!).toBeGreaterThan(0);
    expect(r.oracleLogSd!).toBeLessThan(1.5);
  });
});

describe('slow-episode what-if', () => {
  const none = rows(base);
  it('rate 0 or factor 1 leaves the run bit-identical', () => {
    expect(rows({ ...base, slowEp: { rate: 0, dur: 1, factor: 0.4 } })).toBe(none);
    expect(rows({ ...base, slowEp: { rate: 1, dur: 1, factor: 1 } })).toBe(none);
  });
  it('episodes slow the walking ants (lower moving speed)', () => {
    const a = simulateStroeymeyt(P, base, o).rows;
    const b = simulateStroeymeyt(P, { ...base, slowEp: { rate: 2, dur: 1, factor: 0.3 } }, o).rows;
    expect(JSON.stringify(b)).not.toBe(none);
    expect(b['speedMove.nurse.light']).toBeLessThan(a['speedMove.nurse.light']);
  });
});

// Regression (STATUS 2026-10-17 ≈ 16:18 defect, fixed ≈ 21:17): with the foragers' own walk-on value in the overlay, as
// at the start point, the oracle must scale it too; `oracleNurseOnly` keeps the pre-fix behaviour.
describe('oracle reaches foragers with their own walk-on value', () => {
  const PF = s2018Base({ ...LASIUS_PARAMS, nest: { ...LASIUS_NEST_B, forager: { activeToRest: 1.07, restToActive: 0.6 } } }, 1 / 300);
  const scaled = (nurse: number, forager: number) => ({ ...PF, nest: { ...PF.nest, restToActive: PF.nest.restToActive * nurse, forager: { ...PF.nest.forager!, restToActive: PF.nest.forager!.restToActive! * forager } } });
  const run = (P2: typeof PF, c: StroeymeytColony) => JSON.stringify(simulateStroeymeyt(P2, c, o).rows);
  it('a constant factor 2 equals doubling both role values', () => {
    expect(run(PF, { ...base, oracle: { kind: 'const', factor: 2 } })).toBe(run(scaled(2, 2), base));
  });
  it('with oracleNurseOnly it equals doubling the nurse value only (the pre-fix behaviour)', () => {
    expect(run(PF, { ...base, oracle: { kind: 'const', factor: 2 }, oracleNurseOnly: true })).toBe(run(scaled(2, 1), base));
  });
  it('restores both values', () => {
    const r = PF.nest.restToActive;
    const f = PF.nest.forager!.restToActive;
    simulateStroeymeyt(PF, { ...base, oracle: { kind: 'coupled', kappa: 1, tauC: 60 } }, o);
    expect(PF.nest.restToActive).toBe(r);
    expect(PF.nest.forager!.restToActive).toBe(f);
  });
});

// Step-5 synchrony gate (D104): the oracle in the 1999 protocol, where the recruiter joins after the first step.
describe('oracle in the Mailleux 1999 runner', () => {
  const P99 = { ...LASIUS_PARAMS, nest: { ...LASIUS_NEST_B, forager: {} } };
  const o99 = { seed: 11, starvationDays: 4 as const, density: 2, pipetteAccessible: MAILLEUX_SETUP.accessible, warmup: 120, dt: 0.1, contactMin: 0.04 };
  const run = (extra: object = {}) => JSON.stringify(runNest1999(P99, { ...o99, ...extra }, 0, 2));
  const none = run();
  it('a placebo of SD 0 leaves the run bit-identical; a placebo gives the late recruiter a finite multiplier', () => {
    expect(run({ oracle: { kind: 'placebo', sd: 0, tauC: 60 } })).toBe(none);
    const r = runNest1999(P99, { ...o99, oracle: { kind: 'placebo', sd: 0.53, tauC: 60 } }, 0, 2);
    expect(r.every((x) => Number.isFinite(x.timeInNest) && Number.isFinite(x.distance))).toBe(true);
    expect(JSON.stringify(r)).not.toBe(none);
  });
  it('the coupled arm changes the run and reports its log-g sums after 30 min', () => {
    const r = runNest1999(P99, { ...o99, warmup: 1800, oracle: { kind: 'coupled', kappa: 1, tauC: 60 } }, 0, 2);
    expect(r[0].oracleLog!.n).toBeGreaterThan(0);
    expect(none).not.toContain('oracleLog');
  });
  it('lazy rests refuse the oracle', () => {
    expect(() => run({ lazyRest: {}, oracle: { kind: 'placebo', sd: 0.5, tauC: 60 } })).toThrow();
  });
});

// D108 amendment 1: the matched placebo's log shift and the realised-signal recorder.
describe('oracle placebo shift and signal recorder', () => {
  const none = rows(base);
  it('shift 0 reproduces the raw placebo; shift −sd²/2 reproduces the mean-one placebo; a shift changes the run', () => {
    const raw = rows({ ...base, oracle: { kind: 'placebo', sd: 0.6, tauC: 60 } });
    expect(rows({ ...base, oracle: { kind: 'placebo', sd: 0.6, tauC: 60, shift: 0 } })).toBe(raw);
    expect(rows({ ...base, oracle: { kind: 'placebo', sd: 0.6, tauC: 60, shift: -0.18 } })).toBe(rows({ ...base, oracle: { kind: 'placebo', sd: 0.6, tauC: 60, meanOne: true } }));
    expect(rows({ ...base, oracle: { kind: 'placebo', sd: 0.6, tauC: 60, shift: 0.3 } })).not.toBe(raw);
    expect(none).not.toBe(raw);
  });
  it('the recorder is observation only and records after 30 min: one series coupled, one per ant placebo', () => {
    const o2 = { ...o, warmupS: 1800, obsS: 600 };
    for (const oracle of [{ kind: 'coupled', kappa: 1, tauC: 60 } as const, { kind: 'placebo', sd: 0.5, tauC: 60, shift: 0.1 } as const]) {
      const plain = simulateStroeymeyt(P, { ...base, oracle }, o2);
      const traced = simulateStroeymeyt(P, { ...base, oracle, oracleTrace: { every: 10 } }, o2);
      expect(JSON.stringify(traced.rows)).toBe(JSON.stringify(plain.rows));
      expect(plain.oracleStats).toBeUndefined();
      const s = oracleSummary(traced.oracleStats!);
      expect(s.n).toBeGreaterThan(oracle.kind === 'coupled' ? 50 : 50 * 10);
      expect(Number.isFinite(s.sdLog) && Number.isFinite(s.acf[6])).toBe(true);
    }
  });
});

describe('oracle signal statistics', () => {
  it('moments, clipping, NaN gaps and pooled autocorrelation', () => {
    const s = oracleSummary(oracleStats([[0, Math.log(4), NaN, -Math.log(4)], [1, 1]], [1]));
    expect(s.n).toBe(5);
    expect(s.meanG).toBeCloseTo((1 + 4 + 0.25 + 2 * Math.E) / 5, 12);
    expect(s.clippedFrac).toBeCloseTo(2 / 5, 12);
    // Series 2 is constant (no variance); series 1's lag-1 pairs span the NaN only once (0, log 4).
    expect(s.acf[1]).toBeCloseTo((0 * Math.log(4)) / (2 * Math.log(4) ** 2), 12);
    const a = oracleStats([[0.1, 0.4, -0.2]], [1]);
    const b = oracleStats([[0.3, -0.1]], [1]);
    expect(combineOracleStats([a, b])).toEqual(oracleStats([[0.1, 0.4, -0.2], [0.3, -0.1]], [1]));
  });
});

// Part C (D115 amendment 1, D117): propagation and within-system driver diagnostics.
describe('Part C oracle kinds', () => {
  const none = rows(base);
  const o2 = { ...o, warmupS: 1800, obsS: 600 };
  it('strength 0 leaves every kind bit-identical', () => {
    expect(rows({ ...base, oracle: { kind: 'coupledX', kappa: 0, tauC: 60 } })).toBe(none);
    expect(rows({ ...base, oracle: { kind: 'local', kappa: 0, r: 10, tauC: 60 } })).toBe(none);
    expect(rows({ ...base, oracle: { kind: 'driverShared', amp: 0, tau: 60 } })).toBe(none);
    expect(rows({ ...base, oracle: { kind: 'driverLocal', amp: 0, sigma: 10 } })).toBe(none);
  });
  it('local with r = ∞ equals the focal-excluded global coupling, rows and realised signal', () => {
    const a = simulateStroeymeyt(P, { ...base, oracle: { kind: 'local', kappa: 1, r: Infinity, tauC: 60 }, oracleTrace: { every: 10 } }, o2);
    const b = simulateStroeymeyt(P, { ...base, oracle: { kind: 'coupledX', kappa: 1, tauC: 60 }, oracleTrace: { every: 10 } }, o2);
    expect(JSON.stringify(a.rows)).toBe(JSON.stringify(b.rows));
    expect(a.oracleStats).toEqual(b.oracleStats);
    expect(JSON.stringify(a.rows)).not.toBe(none);
  });
  it('isolated ants get g = 1 at once: with a vanishing range nothing changes', () => {
    const r = simulateStroeymeyt(P, { ...base, oracle: { kind: 'local', kappa: 2, r: 1e-6, tauC: 60 }, oracleTrace: { every: 10 } }, o2);
    expect(JSON.stringify(r.rows)).toBe(JSON.stringify(simulateStroeymeyt(P, base, o2).rows));
    expect(oracleSummary(r.oracleStats!).sdLog).toBe(0);
  });
  it('the drivers change the run; the shared driver gives every in-nest ant the same g', () => {
    expect(rows({ ...base, oracle: { kind: 'driverShared', amp: 1, tau: 60 } })).not.toBe(none);
    expect(rows({ ...base, oracle: { kind: 'driverLocal', amp: 1, sigma: 10 } })).not.toBe(none);
    expect(rows({ ...base, oracle: { kind: 'local', kappa: 1, r: 10, tauC: 60 } })).not.toBe(none);
    const before = [P.nest.restToActive, P.nest.forager?.restToActive];
    let sim: any = null;
    const step = ColonySim.prototype.step;
    ColonySim.prototype.step = function (this: any, ...a: any[]) {
      sim = this;
      return step.apply(this, a as any);
    } as any;
    try {
      simulateStroeymeyt(P, { ...base, oracle: { kind: 'driverShared', amp: 0.8, tau: 60 }, oracleTrace: { every: 10 } }, o2);
    } finally {
      ColonySim.prototype.step = step;
    }
    const tr: number[][] = sim.oracleTrace;
    const t0 = tr.map((x) => x[0]).filter(Number.isFinite);
    expect(t0.length).toBeGreaterThan(5);
    expect(new Set(t0).size).toBe(1);
    expect([P.nest.restToActive, P.nest.forager?.restToActive]).toEqual(before);
  });
  it("the local driver's normalisation gives E[g | x] = 1 under the prescribed process (Monte Carlo)", () => {
    const nest = { x0: 0, x1: 70, y0: 0, y1: 40 };
    const A = 1.2;
    const sigma = 10;
    const c = driverLocalTable(nest, A, sigma, 1);
    const rng = RNG.stream(99, 1);
    for (const [cx, cy] of [[35, 20], [2, 2], [60, 30]]) {
      let sum = 0;
      const N = 60000;
      for (let k = 0; k < N; k++) {
        let S = 0;
        for (let e = rng.poisson(1); e > 0; e--) {
          // Event positions on the table's 1-mm cell grid, as the table integrates.
          const ex = rng.int(70);
          const ey = rng.int(40);
          S += Math.exp(-((cx - ex) ** 2 + (cy - ey) ** 2) / (2 * sigma * sigma));
        }
        sum += Math.exp(A * S - c[cy * 70 + cx]);
      }
      expect(sum / N).toBeCloseTo(1, 1.5);
    }
  });
});
