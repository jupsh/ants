import { describe, expect, it } from 'vitest';
import { simulateStroeymeyt, type StroeymeytColony } from '../src/sim/experiments/colonyStroeymeyt';
import { s2018Base } from '../src/sim/experiments/stroeymeytTargets';
import { LASIUS_NEST_B, LASIUS_PARAMS } from '../src/sim/species/lasiusM1';

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
