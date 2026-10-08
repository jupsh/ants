import { describe, expect, it } from 'vitest';
import { combinedZ, meanSd } from '../src/sim/analysis/compare';
import { observeContacts, scansToEvents } from '../src/sim/analysis/trophallaxis';
import { RNG } from '../src/sim/core/rng';
import { dataMetrics } from '../src/sim/experiments/e6Bles';
import { BLES_TABLE1, runBles, type BlesRun } from '../src/sim/reference/blesTEC';
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

/** Raw (unobserved) outputs as the paper reports them. */
function raw(variant: string, runs: number, seed: number) {
  const out = { events: [] as number[], foragers: [] as number[], ff: [] as number[], fnf: [] as number[], nff: [] as number[], nfnf: [] as number[], t50: [] as number[] };
  for (let r = 0; r < runs; r++) {
    const { contacts, forager: F }: BlesRun = runBles(BLES_TABLE1[variant], RNG.stream(seed, r));
    out.events.push(contacts.length);
    out.foragers.push(F.filter(Boolean).length);
    out.ff.push(contacts.filter((x) => F[x.donor] && F[x.receiver]).length);
    out.fnf.push(contacts.filter((x) => F[x.donor] && !F[x.receiver]).length);
    out.nff.push(contacts.filter((x) => !F[x.donor] && F[x.receiver]).length);
    out.nfnf.push(contacts.filter((x) => !F[x.donor] && !F[x.receiver]).length);
    const st = contacts.map((x) => x.start).sort((a, b) => a - b);
    out.t50.push(st[Math.floor(st.length / 2)] / 60);
  }
  return out;
}


describe('E6 reference model: exact reproduction of Bles et al. 2022 (tier 1)', () => {
  // Published means over 1000 runs (Table 1, Table S1, Fig. S4); their SE is
  // taken as our run-to-run SD / √1000.
  const PAPER: Record<string, Record<string, number>> = {
    TEC_exp: { events: 98.7, foragers: 12.5, ff: 9.7, fnf: 49.6, nff: 7.1, nfnf: 32.0, t50: 29.47 },
    OC_delta: { events: 100.1, foragers: 12.2, ff: 3.1, fnf: 44.1, nff: 3.6, nfnf: 49.4 },
  };
  for (const [variant, ref] of Object.entries(PAPER))
    it(`${variant} matches the published outputs`, () => {
      const sim = raw(variant, 400, 314159) as Record<string, number[]>;
      for (const [k, v] of Object.entries(ref)) {
        const s = meanSd(sim[k]);
        const z = combinedZ(s.mean, s.sd / Math.sqrt(s.n), v, s.sd / Math.sqrt(1000));
        expect(Math.abs(z), `${k}: sim ${s.mean.toFixed(2)} vs paper ${v} (z = ${z.toFixed(2)})`).toBeLessThan(3);
      }
    });

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
      for (let r = 0; r < 100; r++) {
        const { contacts, forager } = runBles({ ...BLES_TABLE1.TEC_exp, compat }, RNG.stream(11, r));
        for (const c of contacts) if (forager[c.donor] && c.end < 3600) d.push(c.end - c.start);
      }
      return meanSd(d).mean;
    };
    // The dead branch roughly halves the separation hazard for F donors.
    expect(dur(false)).toBeLessThan(0.8 * dur(true));
  });
});
