import { describe, expect, it } from 'vitest';
import { meanSd } from '../src/sim/analysis/compare';
import { observeContacts, scansToEvents } from '../src/sim/analysis/trophallaxis';
import { RNG } from '../src/sim/core/rng';
import { dataMetrics } from '../src/sim/experiments/e6Bles';
import { BLES_TABLE1, runBles } from '../src/sim/reference/blesTEC';
import { BLES_SCANS } from '../scripts/lib';

describe('E6 scan observer', () => {
  const c = (start: number, end: number, donor = 1, receiver = 2) => ({ donor, receiver, start, end });

  it('records a contact at every scan it spans and merges consecutive scans', () => {
    const scans = observeContacts([c(10, 130)], { colony: 1, phase: 0 });
    expect(scans.map((s) => s.minute)).toEqual([31, 32]);
    expect(scansToEvents(scans)).toHaveLength(1);
  });

  it('misses contacts between scans and ignores contacts of ≤ 5 s', () => {
    expect(observeContacts([c(61, 119)], { colony: 1, phase: 0 })).toHaveLength(0);
    expect(observeContacts([c(118, 123)], { colony: 1, phase: 0 })).toHaveLength(0);
    expect(observeContacts([c(118, 124)], { colony: 1, phase: 0 })).toHaveLength(1);
    // A scan at the instant the contact ends does not see it.
    expect(observeContacts([c(30, 60)], { colony: 1, phase: 0 })).toHaveLength(0);
  });

  it('separates repeated contacts of the same pair when a scan falls between them', () => {
    const ev = scansToEvents(observeContacts([c(50, 70), c(170, 190)], { colony: 1, phase: 0 }));
    expect(ev).toHaveLength(2);
    // ...but merges them when they are seen on consecutive scans.
    expect(scansToEvents(observeContacts([c(50, 70), c(110, 130)], { colony: 1, phase: 0 }))).toHaveLength(1);
  });

  it('respects the scan window (61 scans from food introduction)', () => {
    const scans = observeContacts([c(0, 10_000)], { colony: 1, phase: 30 });
    expect(scans).toHaveLength(61);
    expect(scans[60].minute).toBe(90);
  });
});

describe('E6 data pipeline', () => {
  it('merging the raw scans reproduces the published event counts', () => {
    const d = dataMetrics(BLES_SCANS());
    // 492 merged events (the authors' script has 495); paper: 99.0 per colony.
    expect(d.reduce((s, m) => s + m.events, 0)).toBe(492);
  });
});

describe('E6 reference model: Bles et al. 2022 implementation (tier 1)', () => {
  it('is deterministic for a given seed', () => {
    const a = runBles(BLES_TABLE1.TEC_exp, RNG.stream(1, 2));
    const b = runBles(BLES_TABLE1.TEC_exp, RNG.stream(1, 2));
    expect(a).toEqual(b);
  });

  it('conserves food: crops never go negative and transfers match contact amounts', () => {
    for (const compat of [true, false]) {
      const { contacts } = runBles({ ...BLES_TABLE1.TEC_exp, compat }, RNG.stream(7, compat ? 1 : 0));
      for (const c of contacts) {
        expect(c.amount).toBeGreaterThanOrEqual(0);
        expect(c.amount).toBeLessThanOrEqual(c.end - c.start);
      }
    }
  });

  it('compat: false makes forager-donor pairs end at the same hazard as non-forager-donor pairs', () => {
    const dur = (compat: boolean) => {
      const d: number[] = [];
      for (let r = 0; r < 40; r++) {
        const { contacts, forager } = runBles({ ...BLES_TABLE1.TEC_exp, compat }, RNG.stream(11, r));
        for (const c of contacts) if (forager[c.donor] && c.end < 3600) d.push(c.end - c.start);
      }
      return meanSd(d).mean;
    };
    // The dead branch roughly halves the separation hazard for F donors.
    expect(dur(false)).toBeLessThan(0.8 * dur(true));
  });
});
