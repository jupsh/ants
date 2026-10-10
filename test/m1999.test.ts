import { describe, expect, it } from 'vitest';
import { RNG } from '../src/sim/core/rng';
import { runColony } from '../src/sim/experiments/colonyBles';
import { M1999_DAYS, M1999_NO_BOUT_MAX, M1999_TARGETS, m1999FitLoss, m1999NoBout, recruiterLoad, runRecruiter1999, type M1999Day, type M1999Recruiter } from '../src/sim/experiments/colonyMailleux1999';
import { LASIUS_NEST, LASIUS_PARAMS, MAILLEUX_SETUP } from '../src/sim/species/lasiusM1';

const P = { ...LASIUS_PARAMS, nest: LASIUS_NEST };
const base = { starvationDays: 4 as const, density: 1, pipetteAccessible: MAILLEUX_SETUP.accessible, warmup: 60 };

describe('Mailleux 1999 recruiter (mechanics)', () => {
  it('has the 15 Table 2a fit rows', () => {
    expect(M1999_TARGETS).toHaveLength(15);
    expect(M1999_TARGETS.every((t) => t.role === 'fit' && t.n >= 23 && t.sd > 0)).toBe(true);
  });

  it('the recruiter carries an E2 scout load into the nest, and sugar is conserved', () => {
    const load = recruiterLoad(P, { ...base, seed: 5 });
    expect(load.cropUl).toBeGreaterThan(0.2);
    expect(load.ingested).toBeGreaterThan(0);
    let entered = false;
    const res = runColony(P, { seed: 5, ants: 20, minutes: 4, foodMinute: Infinity, recruiter: { enterAt: 60, ...load } }, (w) => {
      if (w.ants.length === 21) entered = true;
      return false;
    });
    expect(entered).toBe(true);
    expect(Math.abs(res.world.ledger.total('sugar'))).toBeLessThan(1e-9);
    const crops = res.world.ants.reduce((s, a) => s + a.body.cropSugar, 0);
    expect(crops).toBeCloseTo(res.world.ledger.get('sugar', 'crop'), 9);
  });

  it('is deterministic', () => {
    const a = runRecruiter1999(P, { ...base, seed: 9 });
    const b = runRecruiter1999(P, { ...base, seed: 9 });
    expect(a).toEqual(b);
  });

  it('an unloaded recruiter returns to the source; it stays when the return rate is 0', () => {
    const fast = { ...P, nest: { ...LASIUS_NEST, returnRate: 1, giveFrac: 0.95 } };
    const r = runRecruiter1999(fast, { ...base, seed: 3 });
    expect(r.left).toBe(true);
    expect(r.timeInNest).toBeLessThan(30);
    const never = { ...P, nest: { ...LASIUS_NEST, returnRate: 0, giveFrac: 0.95 } };
    expect(runRecruiter1999(never, { ...base, seed: 3 }).left).toBe(false);
  });

  it('the nest speed factor slows walking inside the nest', () => {
    const slow = { ...P, nest: { ...LASIUS_NEST, nestSpeedFactor: 0.1, returnRate: 0, giveFrac: 0.95 } };
    const fast = { ...P, nest: { ...LASIUS_NEST, nestSpeedFactor: 1, returnRate: 0, giveFrac: 0.95 } };
    const ds = runRecruiter1999(slow, { ...base, seed: 4 }).distance;
    const df = runRecruiter1999(fast, { ...base, seed: 4 }).distance;
    expect(ds).toBeGreaterThan(0);
    expect(ds).toBeLessThan(0.3 * df);
  });

  it('following nestmates (Table 2b) leaves the five fit statistics unchanged, incl. a bout spanning the 20-min censoring', () => {
    // The recruiter never leaves, and shares slowly in long bouts down to an almost empty crop with nestmates that
    // stay hungry; with these seeds it is in a bout at 20 min (the old observer counted such a bout to its end).
    const P2 = { ...P, nest: { ...LASIUS_NEST, returnRate: 0, leaveRate: 0, shareRate: 0.002, shareEnd: 1 / 1200, receiveReserve: 1, giveFrac: 0.01 } };
    const stats = ({ timeInNest, left, distance, contacts, trophTotal, contactsBefore, cropAtExit }: ReturnType<typeof runRecruiter1999>) => ({ timeInNest, left, distance, contacts, trophTotal, contactsBefore, cropAtExit });
    for (const seed of [1, 3]) {
      const o = { ...base, seed, starvationDays: 8 as const };
      const fit = runRecruiter1999(P2, o);
      expect(fit.left).toBe(false);
      expect(stats(runRecruiter1999(P2, { ...o, followNestmates: true }))).toEqual(stats(fit));
    }
  });

  it('half the recruiters without a bout cannot pass on the 15 rows alone (no-bout penalty)', () => {
    // Every recruiter hits each row's mean exactly, except that half have no bout and the other half twice the trophallaxis.
    const rec = (day: M1999Day, i: number): M1999Recruiter => {
      const v = (stat: string) => M1999_TARGETS.find((t) => t.day === day && t.stat === stat)!.mean;
      const none = i % 2 === 0;
      return { timeInNest: v('timeInNest'), left: true, distance: v('distance'), contacts: v('contacts'), trophTotal: none ? 0 : 2 * v('trophTotal'), contactsBefore: none ? NaN : v('contactsBefore'), cropAtEntry: 1, cropAtExit: 0.2, troph: { n: 0, left: 0 }, other: { n: 0, left: 0 } };
    };
    const sim = Object.fromEntries(M1999_DAYS.map((d) => [d, Array.from({ length: 100 }, (_, i) => rec(d, i))])) as Record<M1999Day, M1999Recruiter[]>;
    expect(m1999NoBout(sim[1])).toBe(0.5);
    expect(M1999_NO_BOUT_MAX).toBeCloseTo(0.109, 3);
    expect(m1999FitLoss(sim)).toBeGreaterThan(100);
    const all = Object.fromEntries(M1999_DAYS.map((d) => [d, sim[d].map((x) => ({ ...x, trophTotal: M1999_TARGETS.find((t) => t.day === d && t.stat === 'trophTotal')!.mean, contactsBefore: M1999_TARGETS.find((t) => t.day === d && t.stat === 'contactsBefore')!.mean }))])) as Record<M1999Day, M1999Recruiter[]>;
    expect(m1999FitLoss(all)).toBeCloseTo(0, 9);
  });

  it('the fit objective is debiased: a noisy sample centred on the targets scores ≈ 0 on average', () => {
    // Recruiters drawn around each row's mean with the data's SD: E[fitZ²] = Var(m)/SE² > 0, the debiased loss ≈ 0.
    let raw = 0;
    let deb = 0;
    for (let rep = 0; rep < 40; rep++) {
      const rng = new RNG(100 + rep);
      const rec = (day: M1999Day): M1999Recruiter => {
        const v = (stat: string) => {
          const t = M1999_TARGETS.find((x) => x.day === day && x.stat === stat)!;
          return t.mean + t.sd * rng.normal(0, 1);
        };
        return { timeInNest: v('timeInNest'), left: true, distance: v('distance'), contacts: v('contacts'), trophTotal: Math.max(1, v('trophTotal')), contactsBefore: v('contactsBefore'), cropAtEntry: 1, cropAtExit: 0.2, troph: { n: 0, left: 0 }, other: { n: 0, left: 0 } };
      };
      const sim = Object.fromEntries(M1999_DAYS.map((d) => [d, Array.from({ length: 30 }, () => rec(d))])) as Record<M1999Day, M1999Recruiter[]>;
      deb += m1999FitLoss(sim) / 40;
      raw += M1999_TARGETS.reduce((s, t) => {
        const m = sim[t.day].reduce((a, x) => a + x[t.stat], 0) / 30;
        return s + ((m - t.mean) / (t.sd / Math.sqrt(t.n))) ** 2;
      }, 0) / 40;
    }
    expect(raw).toBeGreaterThan(8); // ≈ 15 × 26/30
    expect(Math.abs(deb)).toBeLessThan(3);
  });

  it('observed contacts count only episodes of at least the minimum duration', () => {
    const o = { ...base, seed: 9 };
    const all = runRecruiter1999(P, { ...o, contactMin: 0 });
    const obs = runRecruiter1999(P, o);
    expect(all.contacts).toBeGreaterThan(obs.contacts);
    const none = runRecruiter1999(P, { ...o, contactMin: 1e9 });
    expect(none.contacts).toBe(0);
    expect(none.timeInNest).toBe(obs.timeInNest);
  });

  it('a recruiter holding 0.2–0.4 µL unloads and leaves (the deadlock fixed 2026-10-10)', () => {
    const full = recruiterLoad(P, { ...base, seed: 5 });
    const f = 0.3 / full.cropUl;
    const load = { cropUl: 0.3, cropSugar: full.cropSugar * f, cropWater: full.cropWater * f, ingested: full.ingested };
    const nest = { ...LASIUS_NEST, receiveReserve: 1, returnRate: 1, shareEnd: 1 / 600 };
    let leftAt = NaN;
    runColony({ ...P, nest }, { seed: 6, ants: 40, minutes: 22, foodMinute: Infinity, recruiter: { enterAt: 60, ...load } }, (_w, info) => {
      if (info.outside[40] && Number.isNaN(leftAt)) leftAt = info.t;
      return !Number.isNaN(leftAt);
    });
    expect(leftAt).toBeLessThan(60 + 20 * 60);
  });
});
