import { describe, expect, it } from 'vitest';
import { simulateStroeymeyt, type StroeymeytColony } from '../src/sim/experiments/colonyStroeymeyt';
import { s2018Base } from '../src/sim/experiments/stroeymeytTargets';
import { LASIUS_NEST_B, LASIUS_PARAMS } from '../src/sim/species/lasiusM1';

// Comparison Q switches (STATUS 2026-10-17 ≈ 16:19 UTC): absent or neutral = bit-identical; on changes the run; the
// shared stop rates (nurse and the forager overlay) are restored after every policy call.
const P = s2018Base({ ...LASIUS_PARAMS, nest: { ...LASIUS_NEST_B, forager: { activeToRest: 1.07, restToActive: 0.6 } } }, 1 / 300);
const base: StroeymeytColony = { label: 'test', nurses: 10, foragers: 4, noiseSd: 0, detection: 0.9 };
const o = { seed: 7, phase: 'light' as const, warmupS: 60, obsS: 900, exploreGiveUp: 60 };
const rows = (c: StroeymeytColony) => JSON.stringify(simulateStroeymeyt(P, c, o).rows);
const map = (v: number) => ({ x0: -10, y0: -10, nx: 200, ny: 200, w: new Array(200 * 200).fill(v) });

describe('comparison Q switches', () => {
  const none = rows(base);
  it('k = 0 (aggregation, site) leaves the run bit-identical', () => {
    expect(rows({ ...base, aggregate: { k: 0, r: 8 } })).toBe(none);
    expect(rows({ ...base, site: { k: 0, ...map(1) } })).toBe(none);
    expect(rows({ ...base, site: { k: 3, ...map(0) } })).toBe(none);
  });
  it('the wall, aggregation and site switches change the run', () => {
    expect(rows({ ...base, wall: 'inward' })).not.toBe(none);
    expect(rows({ ...base, aggregate: { k: 1, r: 8 } })).not.toBe(none);
    expect(rows({ ...base, site: { k: 3, ...map(1) } })).not.toBe(none);
  });
  it('restores the nurse and forager stop rates', () => {
    const a = P.nest.activeToRest;
    const f = P.nest.forager!.activeToRest;
    simulateStroeymeyt(P, { ...base, aggregate: { k: 1, r: 8 }, site: { k: 3, ...map(1) } }, o);
    expect(P.nest.activeToRest).toBe(a);
    expect(P.nest.forager!.activeToRest).toBe(f);
  });
  it('a uniform site scales foragers too: same as a forager-only overlay change would not be', () => {
    // A uniform map with k = 1 doubles every stop rate, which must equal doubling the nurse and forager values directly.
    const P2 = { ...P, nest: { ...P.nest, activeToRest: P.nest.activeToRest * 2, forager: { ...P.nest.forager!, activeToRest: P.nest.forager!.activeToRest! * 2 } } };
    const doubled = JSON.stringify(simulateStroeymeyt(P2, base, o).rows);
    expect(rows({ ...base, site: { k: 1, ...map(1) } })).toBe(doubled);
  });
});
