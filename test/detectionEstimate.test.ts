import { describe, expect, it } from 'vitest';
import { DET_D_EDGES, DET_NCELL, DET_TSB_EDGES, detectionCell } from '../src/sim/analysis/detection';
import { estimateTracker, jointOnset, kmBinProbs, pooledHazard } from '../src/sim/analysis/detectionEstimate';
import { TrackerStats, type AntBlock } from '../src/sim/analysis/detectionStats';
import { RNG } from '../src/sim/core/rng';

const NB = DET_D_EDGES.length - 1;
const NT = DET_TSB_EDGES.length;
const empty = (): AntBlock => ({ opp: new Array(DET_NCELL).fill(0), gap: new Array(DET_NCELL).fill(0), ge4: new Array(DET_NCELL).fill(0), dEvents: new Array(NB).fill(0), dCens: new Array(NB).fill(0), dEvT: new Array(NT * NB).fill(0), dCeT: new Array(NT * NB).fill(0), det: 0 });

describe('detection statistics (STATUS 2026-10-15)', () => {
  it('counts opportunities, a gap, its length and the run break; the first detection after it is fresh', () => {
    const s = new TrackerStats([true], 1, () => 0, () => Infinity);
    // Detected still in the nest at frames 0–9, missed 10–14 (5 frames), detected again 15–19.
    for (let f = 0; f < 20; f++) if (f < 10 || f >= 15) s.frame(f, f / 2, [0], [10], [10], [true]);
    s.finish(19);
    const a = s.trackedAnts()[0][0];
    expect(a.det).toBe(15);
    // Every detection but the last opens an opportunity; one of them is followed by a gap of 5 (≥ 4: a break).
    expect(a.opp.reduce((x, y) => x + y, 0)).toBe(14);
    expect(a.gap.reduce((x, y) => x + y, 0)).toBe(1);
    expect(a.ge4.reduce((x, y) => x + y, 0)).toBe(1);
    expect(a.dEvents[DET_D_EDGES.findIndex((e, k) => 5 >= e && 5 < DET_D_EDGES[k + 1])]).toBe(1);
    // The first detection and the one at frame 15 are fresh (class 5) with 0 s since detection resumed.
    expect(a.opp[detectionCell(1, 0, 0)]).toBe(2);
  });
});

describe('tracker estimation (STATUS 2026-10-15)', () => {
  it('Kaplan–Meier bins: without censoring, the histogram; probabilities sum to 1', () => {
    const ev = new Array(NB).fill(0);
    ev[0] = 6;
    ev[3] = 3;
    ev[10] = 1;
    const p = kmBinProbs(ev, new Array(NB).fill(0));
    expect(p[0]).toBeCloseTo(0.6, 12);
    expect(p[3]).toBeCloseTo(0.3, 12);
    expect(p[10]).toBeCloseTo(0.1, 12);
    expect(p.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 12);
  });

  it('joint onset recovers known baseline hazards and per-ant multipliers (pooled rates are biased)', () => {
    const rng = new RNG(31);
    const cells = [0, 7, 14, 21, 28, 33];
    const h = [0.3, 0.1, 0.03, 0.01, 0.05, 0.2];
    const nAnts = 60;
    const logm = Array.from({ length: nAnts }, () => rng.normal(0, 0.4));
    const mean = logm.reduce((a, b) => a + b, 0) / nAnts;
    const m = logm.map((x) => Math.exp(x - mean));
    const ants: AntBlock[][] = m.map((mi, i) => {
      const a = empty();
      cells.forEach((c, k) => {
        // Uneven exposure: low-multiplier ants spend more opportunities in the low-hazard cells (selection).
        const n = Math.round(3000 * (k >= 2 && k <= 3 ? 1 / mi : 1));
        const q = 1 - Math.exp(-mi * h[k]);
        let g = 0;
        for (let j = 0; j < n; j++) if (rng.chance(q)) g++;
        a.opp[c] = n;
        a.gap[c] = g;
      });
      a.dEvT[0] = 10 + i;
      return [a];
    });
    const fit = jointOnset(ants, 0, new Array(DET_NCELL).fill(0));
    cells.forEach((c, k) => expect(Math.abs(fit.h[c] / h[k] - 1)).toBeLessThan(0.05));
    const err = fit.m.map((x, i) => Math.abs(Math.log(x / m[i])));
    expect(err.reduce((a, b) => a + b, 0) / nAnts).toBeLessThan(0.06);
    // The pooled rate of a selected cell is biased low (it is what the joint estimate corrects).
    const pooled = pooledHazard(ants, 0);
    expect(pooled[21] / h[3]).toBeLessThan(0.95);
    // Exported: p = 1 − exp(−h), the listed multipliers, a duration distribution per time-since-resumed bin.
    const t = estimateTracker(ants, pooled, 0);
    expect(t.p[0]).toBeCloseTo(1 - Math.exp(-fit.h[0]), 12);
    expect(t.mult).toHaveLength(nAnts);
    expect(t.dProb).toHaveLength(NT);
    // Bins with too few gaps borrow the next shorter bin's distribution.
    expect(t.dProb[5]).toEqual(t.dProb[0]);
  });
});
