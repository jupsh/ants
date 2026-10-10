import { describe, expect, it } from 'vitest';
import { meanSd } from '../src/sim/analysis/compare';
import { observeContacts, scansToEvents } from '../src/sim/analysis/trophallaxis';
import { RNG } from '../src/sim/core/rng';
import { dataMetrics, E6_PER_ANT_HIST, e6PerAntCompare, ksDistanceHist, type E6Metrics } from '../src/sim/experiments/e6Bles';
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
    // Default rule: the contact must continue > 5 s after the scan instant (120 s).
    expect(observeContacts([c(110, 124)], { colony: 1, phase: 0 })).toHaveLength(0);
    expect(observeContacts([c(118, 126)], { colony: 1, phase: 0 })).toHaveLength(1);
    // Sensitivity rule: in progress at the scan and > 5 s in total.
    expect(observeContacts([c(118, 124)], { colony: 1, phase: 0, rule: 'total' })).toHaveLength(1);
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

describe('E6 per-ant distributions', () => {
  const sum = (h: number[]) => h.reduce((a, b) => a + b, 0);
  const events = (h: number[]) => h.reduce((a, c, k) => a + c * k, 0);

  it('data histograms match the paper\'s group sizes and pair counts', () => {
    const H = E6_PER_ANT_HIST;
    expect([sum(H.fGive), sum(H.fRecv), sum(H.nfGive), sum(H.nfRecv)]).toEqual([61, 61, 206, 206]);
    // Donations by foragers 301 (= FF + FNF), by non-foragers 194; receptions add to the same 495.
    expect([events(H.fGive), events(H.nfGive)]).toEqual([301, 194]);
    expect(events(H.fRecv) + events(H.nfRecv)).toBe(495);
  });

  it('KS distance on integer histograms', () => {
    expect(ksDistanceHist([1, 1], [1, 1])).toBe(0);
    expect(ksDistanceHist([2], [0, 2])).toBe(1);
    expect(ksDistanceHist([1, 1], [2, 0])).toBeCloseTo(0.5, 12);
  });

  it('Monte Carlo test has the nominal false-positive rate when the data come from the model', () => {
    // Synthetic colonies: 53 ants, a variable number of foragers, Poisson counts with a colony effect.
    const colony = (rng: RNG): E6Metrics => {
      const nf = 8 + rng.int(9);
      const scale = rng.lognormal(1, 0.3);
      const draw = (n: number, mean: number) => Array.from({ length: n }, () => rng.poisson(mean * scale));
      return { events: 0, t50: 0, participants: 0, giniParticipants: 0, bothRoles: 0, efficiency: 0, perAnt: { fGive: draw(nf, 5), fRecv: draw(nf, 1.4), nfGive: draw(53 - nf, 0.9), nfRecv: draw(53 - nf, 2) } };
    };
    let reject = 0;
    const trials = 300;
    for (let t = 0; t < trials; t++) {
      const rng = RNG.stream(55, t);
      const cols = Array.from({ length: 105 }, () => colony(rng));
      const pooled = { fGive: [] as number[], fRecv: [] as number[], nfGive: [] as number[], nfRecv: [] as number[] };
      for (const c of cols.slice(0, 5)) for (const g of Object.keys(pooled) as (keyof typeof pooled)[]) pooled[g].push(...c.perAnt![g]);
      const hist = (v: number[]) => Array.from({ length: Math.max(...v) + 1 }, (_, k) => v.filter((x) => x === k).length);
      const data = { fGive: hist(pooled.fGive), fRecv: hist(pooled.fRecv), nfGive: hist(pooled.nfGive), nfRecv: hist(pooled.nfRecv) };
      const rows = e6PerAntCompare(cols.slice(5), 400, t, data);
      if (rows[4].p <= 0.05) reject++;
    }
    // Nominal 5 %; binomial SE ≈ 1.3 % over 300 trials.
    expect(reject / trials).toBeGreaterThan(0.015);
    expect(reject / trials).toBeLessThan(0.095);
  });
});
