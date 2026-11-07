// Scratch (not committed): Part D Part 2 item 1(b), statistics across colonies (D212 as amended by its amendment 1,
// D213; T035). Input: the per-colony results of `triggersCore.ts`. Colonies weighted equally; a colony contributes if
// it has >= 10 matched events; an event type needs >= 11 contributing colonies. 2,000-draw colony bootstrap (RNG
// stream, same draws for every row), percentile 95 % intervals (linear interpolation between order statistics).
// δ_b = 0.10 × the colony-weighted mean event L in each draw; DiD − δ read beside DiD. Balance: the colony-weighted mean
// event − control difference in L and in R divided by the pooled SD_L, SD_R (pooled within blocks over the contributing
// colonies: Σ (n − 1) SD² / Σ (n − 1)); |value| <= 0.1 required. The class is computed for the two primary rows only;
// every other row is descriptive (P90).
// Amendment 2 (D216, P100): the rise label of a primary type is applied only if the synthetic no-rise calibration
// (`triggersSyn.ts --null-seeds`, >= 100 seeds, same triggersCore / triggersStats) gives a false-positive rate (share of
// seeds whose rise interval lies above 0) of at most 0.05; above it the rise is reported as uncalibrated, the class
// unchanged (`calibrationRates`, `applyCalibration`). The `*-ctrl5min` rows are descriptive, written beside the
// isolated rows.
import crypto from 'node:crypto';
import fs from 'node:fs';
import { RNG } from '../../src/sim/core/rng';
import { DT, type ColonyResult, type EventRow, type SettingResult } from './triggersCore';

/** The scripts whose md5 goes in every output's meta; the first four are this analysis. */
export const SCRIPTS = [
  'scripts/scratch/triggers.ts', 'scripts/scratch/triggersCore.ts', 'scripts/scratch/triggersStats.ts', 'scripts/scratch/triggersAgg.ts',
  'scripts/scratch/activitySeries.ts', 'scripts/stroeymeytTracks.ts',
];
/** Scripts that determine a per-colony file (checked by the aggregator). */
export const PER_COLONY = ['scripts/scratch/triggersCore.ts', 'scripts/scratch/activitySeries.ts', 'scripts/stroeymeytTracks.ts'];
export const md5Of = (paths: readonly string[]): Record<string, string> => Object.fromEntries(paths.map((p) => [p, fs.existsSync(p) ? crypto.createHash('md5').update(fs.readFileSync(p)).digest('hex') : 'missing']));
export const md5s = (): Record<string, string> => md5Of(SCRIPTS);
export const DESIGN = ['D212', 'D212 amendment 1', 'D213', 'D212 amendment 2', 'D216'];

export const MIN_EVENTS = 10;
export const MIN_COLONIES = 11;
export const DELTA_FRAC = 0.1;
export const BALANCE_MAX = 0.1;
export const DRAWS = 2000;
export const SEED = 0x1b212;
export const LABELS = {
  exceeds: 'exceeds',
  exceedsSmall: 'exceeds: a positive association smaller than the chosen margin',
  small: 'an association smaller than the chosen margin',
  unresolved: 'unresolved',
  rise: 'preceded by a rise: an ongoing association, not evidence of triggering',
} as const;
/** Amendment 2 (P100): the text reported in place of the rise label when the null false-positive rate is above FP_MAX. */
export const uncalibratedLabel = (rate: number): string => `pre-event rise: uncalibrated (null false-positive rate ${Number(rate.toPrecision(6))})`;
export const FP_MAX = 0.05;
export const CAL_MIN_SEEDS = 100;
/** Scripts whose md5 must match between the calibration file and the aggregator's code. */
export const CAL_MUST_MATCH = ['scripts/scratch/triggersCore.ts', 'scripts/scratch/triggersStats.ts'];
/** Scripts whose md5 the calibration file records. */
export const CAL_SCRIPTS = [...CAL_MUST_MATCH, 'scripts/scratch/activitySeries.ts', 'scripts/scratch/triggersSyn.ts'];
export const PRIMARY = ['forager', 'queen'] as const;

export interface Interval { est: number; lo: number; hi: number; draws: number }
const mean = (v: number[]): number => (v.length ? v.reduce((s, x) => s + x, 0) / v.length : NaN);
const meanFinite = (v: number[]): number => mean(v.filter(Number.isFinite));
export function quantile(sorted: number[], p: number): number {
  if (!sorted.length) return NaN;
  const h = (sorted.length - 1) * p;
  const i = Math.floor(h);
  return i + 1 < sorted.length ? sorted[i] + (h - i) * (sorted[i + 1] - sorted[i]) : sorted[i];
}
const interval = (est: number, draws: number[]): Interval => {
  const s = draws.filter(Number.isFinite).sort((a, b) => a - b);
  return { est, lo: quantile(s, 0.025), hi: quantile(s, 0.975), draws: s.length };
};

/** Bootstrap index draws for n colonies (the same stream for every row). */
export function bootDraws(n: number, draws = DRAWS, seed = SEED): Int32Array[] {
  const r = RNG.stream(seed, 1);
  return Array.from({ length: draws }, () => Int32Array.from({ length: n }, () => r.int(n)));
}

interface ColonyMeans {
  colony: string; matched: number; contributing: boolean;
  did: number; pp: number; L: number; dL: number; dR: number; dLz: number; dRz: number;
  rise: number; riseEvents: number; nurse: number; forager: number; bands: number[];
}
function colonyMeans(colony: string, s: SettingResult): ColonyMeans {
  const ev = s.events as EventRow[];
  const f = (g: (e: EventRow) => number) => meanFinite(ev.map(g));
  const rises = ev.map((e) => e.rise).filter((x): x is number => typeof x === 'number' && Number.isFinite(x));
  return {
    colony, matched: ev.length, contributing: ev.length >= MIN_EVENTS,
    did: f((e) => e.did), pp: f((e) => e.pp), L: f((e) => e.L), dL: f((e) => e.dL), dR: f((e) => e.dR), dLz: f((e) => e.dLz), dRz: f((e) => e.dRz),
    rise: mean(rises), riseEvents: rises.length,
    nurse: f((e) => e.roles?.nurse ?? NaN), forager: f((e) => e.roles?.forager ?? NaN),
    bands: [0, 1, 2].map((j) => f((e) => e.bands?.[j] ?? NaN)),
  };
}

export interface RowResult {
  name: string; phase: string; type: string; wS: number; isolated: boolean; primary: boolean; ctrlExclS?: number;
  counts: { found: number; edge: number; gap: number; empty: number; unmatched: number; matched: number; nCtrl: number[] };
  perColony: { colony: string; found: number; edge: number; gap: number; empty: number; unmatched: number; matched: number; contributing: boolean; nCtrl: number[] }[];
  overlap: { found: { same1m: number; otherW: number; n: number }; matched: { same1m: number; otherW: number; n: number } };
  contributing: number;
  support: boolean;
  balance: { L: number; R: number; pooledSdL: number; pooledSdR: number; L_perBlockSd: number; R_perBlockSd: number; ok: boolean };
  did: Interval; pp: Interval; delta: Interval; didMinusDelta: Interval;
  rise?: Interval & { colonies: number; events: number };
  roles?: { nurse: Interval; forager: Interval };
  bands?: { band: string; did: Interval }[];
  timeCourse?: { bins: number[]; ev: number[]; ctrl: number[]; diff: number[]; colonies: number[] };
  reading?: Reading;
}
export interface Reading { class: string; reason: string; riseLabel: string | null; label: string; riseFpRate?: number; riseCalibrated?: boolean }

export function row(cols: ColonyResult[], name: string, draws = DRAWS, seed = SEED): RowResult {
  const S = cols.map((c) => ({ colony: c.colony, s: c.settings.find((x) => x.name === name)! })).filter((x) => x.s);
  const first = S[0].s;
  const primary = (PRIMARY as readonly string[]).includes(name);
  const counts = { found: 0, edge: 0, gap: 0, empty: 0, unmatched: 0, matched: 0, nCtrl: new Array(first.counts.nCtrl.length).fill(0) };
  for (const { s } of S) {
    for (const k of ['found', 'edge', 'gap', 'empty', 'unmatched', 'matched'] as const) counts[k] += s.counts[k];
    s.counts.nCtrl.forEach((v, j) => (counts.nCtrl[j] += v));
  }
  const means = S.map(({ colony, s }) => colonyMeans(colony, s));
  const perColony = S.map(({ colony, s }, i) => ({ colony, ...s.counts, contributing: means[i].contributing }));
  // Overlaps: shares among all found events (matched + dropped) and among matched events.
  let fS = 0, fO = 0, fN = 0, mS = 0, mO = 0, mN = 0;
  for (const { s } of S) {
    for (const e of s.events as EventRow[]) { mN++; fN++; if (e.same1m) { mS++; fS++; } if (e.otherW) { mO++; fO++; } }
    for (const e of s.dropped) { fN++; if (e.same1m) fS++; if (e.otherW) fO++; }
  }
  const overlap = { found: { same1m: fS / fN, otherW: fO / fN, n: fN }, matched: { same1m: mS / mN, otherW: mO / mN, n: mN } };
  const ci = means.map((_m, i) => i).filter((i) => means[i].contributing);
  const M = ci.map((i) => means[i]);
  const n = M.length;
  // Pooled SD over the contributing colonies' blocks.
  let wl = 0, wr = 0, vl = 0, vr = 0;
  for (const i of ci) for (const b of S[i].s.blocks) {
    if (b.cands < 2) continue;
    if (Number.isFinite(b.sdL)) { vl += (b.cands - 1) * b.sdL * b.sdL; wl += b.cands - 1; }
    if (Number.isFinite(b.sdR)) { vr += (b.cands - 1) * b.sdR * b.sdR; wr += b.cands - 1; }
  }
  const pooledSdL = Math.sqrt(vl / wl);
  const pooledSdR = Math.sqrt(vr / wr);
  const balL = mean(M.map((m) => m.dL)) / pooledSdL;
  const balR = mean(M.map((m) => m.dR)) / pooledSdR;
  const balance = {
    L: balL, R: balR, pooledSdL, pooledSdR,
    L_perBlockSd: mean(M.map((m) => m.dLz)), R_perBlockSd: mean(M.map((m) => m.dRz)),
    ok: Math.abs(balL) <= BALANCE_MAX && Math.abs(balR) <= BALANCE_MAX,
  };
  // Bootstrap over the contributing colonies.
  const D = n > 0 ? bootDraws(n, draws, seed) : [];
  const boot = (g: (m: ColonyMeans) => number): number[] => D.map((idx) => meanFinite(Array.from(idx, (j) => g(M[j]))));
  const est = (g: (m: ColonyMeans) => number) => meanFinite(M.map(g));
  const didB = boot((m) => m.did);
  const LB = boot((m) => m.L);
  const deltaB = LB.map((l) => DELTA_FRAC * l);
  const delta = DELTA_FRAC * est((m) => m.L);
  const did = interval(est((m) => m.did), didB);
  const pp = interval(est((m) => m.pp), boot((m) => m.pp));
  const didMinusDelta = interval(did.est - delta, didB.map((d, b) => d - deltaB[b]));
  const out: RowResult = {
    name, phase: first.phase, type: first.type, wS: first.wS, isolated: first.isolated, primary, ctrlExclS: first.ctrlExclS,
    counts, perColony, overlap, contributing: n, support: n >= MIN_COLONIES, balance,
    did, pp, delta: interval(delta, deltaB), didMinusDelta,
  };
  if (first.full) {
    const riseC = M.filter((m) => Number.isFinite(m.rise));
    out.rise = { ...interval(est((m) => m.rise), boot((m) => m.rise)), colonies: riseC.length, events: riseC.reduce((t, m) => t + m.riseEvents, 0) };
    out.roles = { nurse: interval(est((m) => m.nurse), boot((m) => m.nurse)), forager: interval(est((m) => m.forager), boot((m) => m.forager)) };
    out.bands = ['0-20 mm', '20-40 mm', '> 40 mm'].map((band, j) => ({ band, did: interval(est((m) => m.bands[j]), boot((m) => m.bands[j])) }));
    const tcs = ci.map((i) => S[i].s.tc!).filter(Boolean);
    if (tcs.length) {
      const nb = tcs[0].bins.length;
      const per = (k: 'ev' | 'ctrl' | 'diff') => Array.from({ length: nb }, (_, j) => meanFinite(tcs.map((t) => t[k][j])));
      out.timeCourse = { bins: tcs[0].bins, ev: per('ev'), ctrl: per('ctrl'), diff: per('diff'), colonies: Array.from({ length: nb }, (_, j) => tcs.filter((t) => Number.isFinite(t.diff[j])).length) };
    }
  }
  if (primary) out.reading = read(out);
  return out;
}

/** The frozen reading per event type (D212 amendment 1); with `fpRate` (amendment 2, P100) the rise label is applied
 * only if fpRate <= FP_MAX, otherwise the rise is reported as uncalibrated whatever its interval; the class is never
 * affected. Without `fpRate`: the uncalibrated reading (the calibration itself and the synthetic checks). */
export function read(r: RowResult, fpRate?: number): Reading {
  let cls: string;
  let reason: string;
  if (!r.support) { cls = LABELS.unresolved; reason = `support: ${r.contributing} contributing colonies < ${MIN_COLONIES}`; }
  else if (!r.balance.ok) { cls = LABELS.unresolved; reason = `balance: |L| ${Math.abs(r.balance.L).toFixed(4)}, |R| ${Math.abs(r.balance.R).toFixed(4)} (max ${BALANCE_MAX})`; }
  else if (r.did.lo > 0 && r.pp.lo > 0) { cls = r.didMinusDelta.hi < 0 ? LABELS.exceedsSmall : LABELS.exceeds; reason = 'DiD and post − pre intervals above 0'; }
  else if (r.didMinusDelta.hi < 0 && !(r.did.lo > 0)) { cls = LABELS.small; reason = 'DiD − δ interval below 0, DiD interval not above 0'; }
  else { cls = LABELS.unresolved; reason = 'intervals'; }
  const calibrated = fpRate === undefined ? undefined : fpRate <= FP_MAX;
  const riseLabel = calibrated === false ? uncalibratedLabel(fpRate!) : r.rise && r.rise.lo > 0 ? LABELS.rise : null;
  const out: Reading = { class: cls, reason, riseLabel, label: riseLabel ? `${riseLabel} (class: ${cls})` : cls };
  if (fpRate !== undefined) { out.riseFpRate = fpRate; out.riseCalibrated = calibrated; }
  return out;
}

/** Calibration file written by `triggersSyn.ts --null-seeds a-b --out <file>` (amendment 2). */
export interface CalSeedType { rise: { est: number; lo: number; hi: number }; riseAbove0: boolean; did: { est: number; lo: number; hi: number }; class: string }
export interface Calibration {
  meta: { design: string[]; md5: Record<string, string>; seeds: number[]; command: string; commit: string; date: string; draws: number; seed: number };
  complete: boolean;
  n: number;
  seeds: ({ seed: number } & Record<string, CalSeedType | number>)[];
  positives: Record<string, number>;
  falsePositiveRate: Record<string, number>;
}
/** Per-type false-positive rate from the per-seed records: share of seeds whose rise interval lies above 0. */
export function fpRates(seeds: Calibration['seeds']): { positives: Record<string, number>; rates: Record<string, number> } {
  const positives: Record<string, number> = {};
  const rates: Record<string, number> = {};
  for (const k of PRIMARY) {
    positives[k] = seeds.filter((s) => (s[k] as CalSeedType).riseAbove0).length;
    rates[k] = seeds.length ? positives[k] / seeds.length : NaN;
  }
  return { positives, rates };
}
/** Checks a calibration file against the current code (P100) and returns the per-type rates; throws if it does not
 * qualify: md5 of triggersCore.ts or triggersStats.ts differs, fewer than 100 distinct seeds, incomplete, or stored
 * rates not those of its per-seed records. */
export function calibrationRates(cal: Calibration, cur: Record<string, string> = md5Of(CAL_MUST_MATCH)): Record<string, number> {
  const bad = CAL_MUST_MATCH.filter((p) => !cal.meta?.md5?.[p] || cal.meta.md5[p] !== cur[p]);
  if (bad.length) throw new Error(`calibration made with other code: md5 differs for ${bad.join(', ')}`);
  const distinct = new Set(cal.seeds.map((s) => s.seed)).size;
  if (distinct < CAL_MIN_SEEDS || cal.seeds.length !== distinct) throw new Error(`calibration has ${distinct} distinct seeds in ${cal.seeds.length} records, needs >= ${CAL_MIN_SEEDS}`);
  if (!cal.complete) throw new Error('calibration file is incomplete');
  const { rates } = fpRates(cal.seeds);
  for (const k of PRIMARY) if (cal.falsePositiveRate?.[k] !== rates[k]) throw new Error(`calibration rate for ${k} (${cal.falsePositiveRate?.[k]}) is not that of its seeds (${rates[k]})`);
  return rates;
}
/** Applies the amendment 2 rule to the primary readings (classes unchanged). */
export function applyCalibration(agg: Aggregate, rates: Record<string, number>): Aggregate {
  for (const k of PRIMARY) if (agg.primary[k]) agg.primary[k].reading = read(agg.primary[k], rates[k]);
  return agg;
}

export interface Aggregate {
  selfCheck: { colony: string; equal: boolean; light: unknown; dark: unknown }[];
  colonies: string[];
  primary: Record<string, RowResult>;
  isolated: Record<string, RowResult>;
  ctrl5min: Record<string, RowResult>;
  descriptive: Record<string, RowResult>;
  rates: { perColony: { colony: string; blocks: { key: number; hours: number; found: Record<string, number> }[] }[]; byStartHour: Record<string, Record<string, { meanRatePerHour: number; colonies: number }>> };
}

export function aggregate(cols: ColonyResult[], draws = DRAWS, seed = SEED): Aggregate {
  const selfCheck = cols.map((c) => ({ colony: c.colony, equal: c.selfCheck.equal, light: { as: c.selfCheck.activitySeries.light, tr: c.selfCheck.triggers.light }, dark: { as: c.selfCheck.activitySeries.dark, tr: c.selfCheck.triggers.dark } }));
  const bad = selfCheck.filter((s) => !s.equal);
  if (bad.length) throw new Error(`self-check failed for ${bad.map((b) => b.colony).join(', ')}: nothing computed`);
  const names = cols[0].settings.map((s) => s.name);
  const primary: Record<string, RowResult> = {};
  const isolated: Record<string, RowResult> = {};
  const ctrl5min: Record<string, RowResult> = {};
  const descriptive: Record<string, RowResult> = {};
  for (const nm of names) {
    const r = row(cols, nm, draws, seed);
    if (r.primary) primary[nm] = r;
    else if (r.isolated) isolated[nm] = r;
    else if (r.ctrlExclS !== undefined) ctrl5min[nm] = r;
    else descriptive[nm] = r;
  }
  // Event rates per light block (keyed by day and start hour; summed per colony over days by start hour, never merged).
  const perColony = cols.map((c) => ({ colony: c.colony, blocks: c.blocks.filter((b) => b.phase === 'light').map((b) => ({ key: b.key, hours: (b.present * DT) / 3600, found: b.found })) }));
  const byStartHour: Record<string, Record<string, { meanRatePerHour: number; colonies: number }>> = {};
  for (const h of [6, 10, 14]) {
    const lab = `${String(h).padStart(2, '0')}-${String(h + 4).padStart(2, '0')}`;
    byStartHour[lab] = {};
    for (const nm of ['forager', 'queen']) {
      const rates = perColony.map((pc) => {
        const bl = pc.blocks.filter((b) => b.key % 100 === h);
        const hours = bl.reduce((t, b) => t + b.hours, 0);
        return hours > 0 ? bl.reduce((t, b) => t + (b.found[nm] ?? 0), 0) / hours : NaN;
      });
      byStartHour[lab][nm] = { meanRatePerHour: meanFinite(rates), colonies: rates.filter(Number.isFinite).length };
    }
  }
  return { selfCheck, colonies: cols.map((c) => c.colony), primary, isolated, ctrl5min, descriptive, rates: { perColony, byStartHour } };
}
