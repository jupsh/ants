import { describe, expect, it } from 'vitest';
import { REST_W } from '../../src/sim/analysis/activity';
import { simulateStroeymeyt, type StroeymeytColony } from '../../src/sim/experiments/colonyStroeymeyt';
import { s2018Base } from '../../src/sim/experiments/stroeymeytTargets';
import { LASIUS_NEST_B, LASIUS_PARAMS } from '../../src/sim/species/lasiusM1';
import { modelRestWindows, summariseSim } from '../../scripts/restLib';

// Per-ant activity vs rest position (D076): the runner's `restMaps` is observation only.
const P = s2018Base({ ...LASIUS_PARAMS, nest: { ...LASIUS_NEST_B, forager: { activeToRest: 1.07, restToActive: 0.6 } } }, 1 / 300);
const c: StroeymeytColony = { label: 'test', nurses: 8, foragers: 3, noiseSd: 0, detection: 0.9 };
const o = { seed: 11, phase: 'light' as const, warmupS: 60, obsS: 6 * 3600, dt: 0.1, exploreGiveUp: 60, activityHours: [0] };

describe('restMaps (D076)', () => {
  const off = simulateStroeymeyt(P, c, o);
  const on = simulateStroeymeyt(P, c, { ...o, restMaps: true });
  it('leaves every row bit-identical', () => {
    expect(JSON.stringify(on.rows)).toBe(JSON.stringify(off.rows));
    expect(JSON.stringify(on.activityWindowRows)).toBe(JSON.stringify(off.activityWindowRows));
    expect(off.restWindows).toBeUndefined();
  });
  it('returns per ant the window hours and still steps inside the model nest', () => {
    const w = on.restWindows![0];
    expect(w.hours).toEqual([0, 1, 2, 3, 4, 5]);
    expect(w.groups.nurse.length).toBe(8);
    expect(w.groups.forager.length).toBe(3);
    let still = 0;
    for (const a of [...w.groups.nurse, ...w.groups.forager]) {
      for (const h of Object.keys(a.act).map(Number)) expect(w.hours).toContain(h);
      for (const [q, n] of Object.entries(a.rest)) {
        const x = Number(q) % REST_W, y = Math.floor(Number(q) / REST_W);
        expect(x).toBeLessThan(71);
        expect(y).toBeLessThan(41);
        still += n;
      }
    }
    expect(still).toBeGreaterThan(0);
  });
});

describe('model side (D076): site field from the same colony\'s other runs', () => {
  const c2: StroeymeytColony = { label: 'b', nurses: 12, foragers: 2, noiseSd: 0, detection: 0.9 };
  const runs = [1, 2, 3].map((seed) => simulateStroeymeyt(P, c2, { ...o, seed, restMaps: true }));
  const per = modelRestWindows(runs, ['b', 'b', 'b']);
  it('gives one window per run, with rest positions for the eligible ants', () => {
    expect(per.length).toBe(1);
    expect(per[0].runs.length).toBe(3);
    for (const r of per[0].runs) {
      expect(r.nurse.nZNoR + r.nurse.nZ).toBeGreaterThan(0);
      expect(r.forager.nZ).toBeLessThan(8); // two foragers: never a valid window
      expect(r.forager.zFull).toBeNaN();
    }
  });
  it('summarises with run-bootstrap SEs, reproducibly', () => {
    const a = summariseSim(per.map((c) => c.runs.map((r) => r.nurse)), 76, 200);
    const b = summariseSim(per.map((c) => c.runs.map((r) => r.nurse)), 76, 200);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    if (Number.isFinite(a.zFull.est)) expect(a.zFull.se).toBeGreaterThanOrEqual(0);
  });
  it('refuses runs made without restMaps', () => {
    const plain = simulateStroeymeyt(P, c2, o);
    expect(() => modelRestWindows([plain, plain], ['b', 'b'])).toThrow();
  });
});

describe('neighbourStats (D083 Part B): observation only', () => {
  const o2 = { seed: 5, phase: 'light' as const, warmupS: 60, obsS: 1800, dt: 0.1, exploreGiveUp: 60 };
  const off = simulateStroeymeyt(P, c, o2);
  const on = simulateStroeymeyt(P, c, { ...o2, neighbourStats: true });
  it('leaves every row bit-identical and returns tables', () => {
    expect(JSON.stringify(on.rows)).toBe(JSON.stringify(off.rows));
    expect(off.nbTables).toBeUndefined();
    const G = on.nbTables!.groups[0];
    expect(G.leaveExp.reduce((a, b) => a + b, 0) + G.stopExp.reduce((a, b) => a + b, 0)).toBeGreaterThan(0);
  });
});
