import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildPools, runSectored, sectorOf, trackRows, type SectorPools } from '../src/sim/reference/sectoredWalker';

describe('sectored walker (Khuong / Bonavita reference)', () => {
  it('bins angles into the authors\' 8 sectors', () => {
    expect(sectorOf(0)).toBe(4); // E
    expect(sectorOf(Math.PI / 2)).toBe(6); // N
    expect(sectorOf(-Math.PI / 2)).toBe(2); // S
    expect(sectorOf(-Math.PI)).toBe(0); // W
    expect(sectorOf(Math.PI - 0.1)).toBe(0); // W (last interval merged with the first)
    expect(sectorOf(Math.PI)).toBe(-1); // NA in R
  });

  it('keys rows by the incoming heading; in the start frame, heading home is sector S', () => {
    // Out along +x to (100, 0), then straight back towards the start.
    const t = [0, 1, 2, 3], x = [0, 50, 100, 60], y = [0, 0, 0, 0];
    const xy = trackRows(t, x, y, 'xy');
    expect(xy.map((r) => r.sector)).toEqual([4, 4]);
    expect(xy[1].row).toMatchObject({ l: 40, dt: 1 });
    expect(xy[1].row.omega).toBeCloseTo(Math.PI);
    // Moving away from the start = opposite of home (N in Φu); the incoming heading at vertex 2 is still "away".
    expect(trackRows(t, x, y, 'start').map((r) => r.sector)).toEqual([6, 6]);
    // Out to (100, 0), then home along −x: incoming headings away (N), then home (S).
    const back = trackRows([0, 1, 2, 3, 4], [0, 100, 60, 20, 10], [0, 0, 0, 0, 5], 'start');
    expect(back.map((r) => r.sector)).toEqual([6, 2, 2]);
  });

  it('walks until it leaves dMax, at the drawn segment speeds', () => {
    const one = { l: 7, omega: 0, dt: 0.4 };
    const pools: SectorPools = { frame: 'xy', rows: Array.from({ length: 8 }, () => [one]) };
    for (const compat of [true, false]) {
      const [tr] = runSectored(pools, { ants: 1, seed: 3, compat });
      const n = tr.t.length;
      expect(tr.t[n - 1]).toBeCloseTo(11.6, 6); // 29 segments of 0.4 s reach r = 203 > 200
      expect(Math.hypot(tr.x[n - 1], tr.y[n - 1])).toBeCloseTo(203, 6);
      expect(tr.t[1]).toBeCloseTo(0.04);
      expect(Math.hypot(tr.x[1], tr.y[1])).toBeCloseTo(0.7, 6); // 17.5 mm/s
    }
  });

  it('is deterministic per ant, whatever the chunking', () => {
    const fx = JSON.parse(fs.readFileSync('test/fixtures/khuong-segmentation-cpp.json', 'utf8'));
    // Segments from the authors' C++ output (vertex times) stored in the fixture.
    const segs = fx.tracks.map((tr: { t: number[]; x: number[]; y: number[]; cppVertexTimes: number[] }) => {
      const v = tr.cppVertexTimes.map((time) => tr.t.reduce((best, tt, i) => (Math.abs(tt - time) < Math.abs(tr.t[best] - time) ? i : best), 0));
      return { t: v.map((i) => tr.t[i]), x: v.map((i) => tr.x[i]), y: v.map((i) => tr.y[i]) };
    });
    for (const frame of ['xy', 'start'] as const) {
      const pools = buildPools(segs, frame);
      expect(pools.rows.every((r) => r.length > 0)).toBe(true);
      const all = runSectored(pools, { ants: 4, seed: 9 });
      const tail = runSectored(pools, { ants: 2, seed: 9, firstAnt: 2 });
      expect(Array.from(tail[1].x)).toEqual(Array.from(all[3].x));
    }
  });
});
