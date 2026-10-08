import { blockEstimate, combinedZ, logSdZ, meanSd, type Comparison } from '../analysis/compare';
import { colonyStats, observeContacts, parseScans, scansToEvents, type ContactInterval, type TrophEvent } from '../analysis/trophallaxis';
import { RNG } from '../core/rng';

/**
 * E6 — food sharing in the nest (Bles et al. 2022). Colony-level outcomes
 * from n = 5 colonies; every simulated colony goes through the same scan
 * observer and the same statistics code as the data (docs/STATUS.md,
 * Evidence policy § Criteria: simulate ≥ 50 colonies, compare the mean with
 * SE = SD_data/√5 combined with SE_sim, and the between-colony SD
 * separately).
 */

export const FOOD_MINUTE = 30;

/** What a model must provide for one simulated colony. */
export interface ColonyRun {
  contacts: ContactInterval[];
  /** Final forager status per ant (visited the food source). */
  forager: boolean[];
}

export interface E6Metrics {
  events: number;
  t50: number;
  participants: number;
  giniParticipants: number;
  bothRoles: number;
  efficiency: number;
  /** Requires forager identities (simulation only; data from the paper). */
  foragers?: number;
  ff?: number;
  fnf?: number;
  nff?: number;
  nfnf?: number;
  /** Share of donation events made by non-foragers. */
  nfDonorShare?: number;
}

export type E6Family = 'primary' | 'network';

export interface E6Target {
  id: keyof E6Metrics;
  label: string;
  family: E6Family;
  mean: number;
  /** Between-colony SD (sample, n − 1) and number of colonies. */
  sd: number;
  n: number;
  source: 'raw data' | 'paper';
}

function metricsFromEvents(events: TrophEvent[], colony: number, forager?: boolean[]): E6Metrics {
  const s = colonyStats(events, colony, FOOD_MINUTE, forager?.length ?? 50);
  const m: E6Metrics = { events: s.events, t50: s.t50, participants: s.participants, giniParticipants: s.giniParticipants, bothRoles: s.bothRoles, efficiency: s.efficiency };
  if (forager) {
    const ev = events.filter((e) => e.colony === colony && e.start >= FOOD_MINUTE);
    const F = (i: number) => forager[i];
    m.foragers = forager.filter(Boolean).length;
    m.ff = ev.filter((e) => F(e.donor) && F(e.receiver)).length;
    m.fnf = ev.filter((e) => F(e.donor) && !F(e.receiver)).length;
    m.nff = ev.filter((e) => !F(e.donor) && F(e.receiver)).length;
    m.nfnf = ev.filter((e) => !F(e.donor) && !F(e.receiver)).length;
    m.nfDonorShare = ev.length ? (m.nff + m.nfnf) / ev.length : NaN;
  }
  return m;
}

/** Per-colony metrics of the Bles et al. raw scans. */
export function dataMetrics(csv: string): E6Metrics[] {
  const events = scansToEvents(parseScans(csv));
  return [1, 2, 3, 4, 5].map((c) => metricsFromEvents(events, c));
}

/**
 * Targets: raw-data metrics computed by our pipeline, plus forager-based
 * numbers from the paper (forager identities are not in the raw file).
 * Pair-type SDs are sample SDs over the 5 colonies (Table S1); the NF donor
 * share is the per-colony mean ± SD of event shares (bles-tec-spec.md §4.1).
 */
export function e6Targets(csv: string): E6Target[] {
  const d = dataMetrics(csv);
  const raw = (id: keyof E6Metrics, label: string, family: E6Family): E6Target => ({ id, label, family, ...meanSd(d.map((x) => x[id] as number)), n: 5, source: 'raw data' });
  const paper = (id: keyof E6Metrics, label: string, mean: number, sd: number): E6Target => ({ id, label, family: 'primary', mean, sd, n: 5, source: 'paper' });
  return [
    raw('events', 'Trophallactic events (minutes 30–90)', 'primary'),
    raw('t50', 'T50: minutes until half the events had started', 'primary'),
    raw('participants', 'Ants involved in ≥ 1 event', 'primary'),
    raw('giniParticipants', 'Gini of events per participant', 'primary'),
    paper('foragers', 'Foragers', 12.2, 1.9),
    paper('nfDonorShare', 'Share of donation events by non-foragers', 0.395, 0.087),
    paper('ff', 'Events forager → forager', 10.2, 8.2),
    paper('fnf', 'Events forager → non-forager', 50.0, 10.1),
    paper('nff', 'Events non-forager → forager', 7.0, 2.6),
    paper('nfnf', 'Events non-forager → non-forager', 31.8, 7.9),
    raw('bothRoles', 'Participants that both gave and received', 'network'),
    raw('efficiency', 'Network global efficiency', 'network'),
  ];
}

/**
 * Simulate `colonies` independent colonies (one RNG stream each), observe
 * each with a scan phase drawn uniformly over one period, and return
 * per-colony metrics.
 */
export function simulateColonies(run: (rng: RNG) => ColonyRun, colonies: number, seed: number, first = 0): E6Metrics[] {
  return Array.from({ length: colonies }, (_, i) => {
    const c = first + i;
    const rng = RNG.stream(seed, c);
    const r = run(rng);
    const phase = RNG.stream(seed, c, 1).range(0, 60);
    const events = scansToEvents(observeContacts(r.contacts, { colony: 1, phase }));
    return metricsFromEvents(events, 1, r.forager);
  });
}

export interface E6Row {
  target: E6Target;
  simMean: number;
  simSd: number;
  mean: Comparison;
  spread: Comparison;
}

/**
 * Judge simulated colonies: mean with SE_data = SD/√5 combined with SE_sim
 * (from 10 blocks of colonies), and the between-colony SD separately
 * (log-SD z with n = 5: weak, indicative only).
 */
export function e6Compare(sim: E6Metrics[], targets: E6Target[], blocks = 10): E6Row[] {
  return targets.map((t) => {
    const v = sim.map((m) => m[t.id] as number);
    const per = Math.ceil(v.length / blocks);
    const est = blockEstimate(Array.from({ length: blocks }, (_, b) => v.slice(b * per, (b + 1) * per)));
    const seData = t.sd / Math.sqrt(t.n);
    return {
      target: t,
      simMean: est.mean,
      simSd: est.sd,
      mean: { id: t.id, label: t.label, kind: 'mean', data: t.mean, sim: est.mean, seData, seSim: est.se, z: combinedZ(est.mean, est.se, t.mean, seData) },
      spread: { id: `${t.id}.sd`, label: `${t.label} (SD between colonies)`, kind: 'spread', data: t.sd, sim: est.sd, seData: NaN, seSim: NaN, z: logSdZ(est.sd, est.n, t.sd, t.n) },
    };
  });
}

export function e6Table(rows: E6Row[]): string {
  const f = (v: number) => (Math.abs(v) < 1 ? v.toFixed(3) : v.toFixed(1));
  return rows
    .map((r) => `${r.target.family.padEnd(8)} z=${r.mean.z.toFixed(1).padStart(5)}  zSD=${r.spread.z.toFixed(1).padStart(5)}  ${r.target.label}: data ${f(r.target.mean)}±${f(r.target.sd)} (${r.target.source}), sim ${f(r.simMean)}±${f(r.simSd)}`)
    .join('\n');
}
