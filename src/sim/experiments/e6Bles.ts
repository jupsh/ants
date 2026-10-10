import { blockEstimate, meanSd, pToZ, smallSampleZ, varianceRatioZ, type Comparison } from '../analysis/compare';
import { colonyStats, observeContacts, parseScans, scansToEvents, type ContactInterval, type ObserverRule, type TrophEvent } from '../analysis/trophallaxis';
import { RNG } from '../core/rng';

/**
 * E6 — food sharing in the nest (Bles et al. 2022). Colony-level outcomes
 * from n = 5 colonies; every simulated colony goes through the same scan
 * observer and the same statistics code as the data (docs/STATUS.md,
 * Evidence policy § Criteria: simulate ≥ 50 colonies, compare the mean with
 * SE = SD_data/√5 combined with SE_sim, and the between-colony SD
 * separately). SE_data rests on 5 colonies, so z is the normal equivalent
 * of a t with 4 df (Welch–Satterthwaite reported beside it; STATUS
 * 2026-10-09, step 4). Simulate ≥ 200 colonies so SE_sim stays small.
 * Development benchmark, not untouched: the TEC comparisons have informed
 * the spatial model's expectations.
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
  /** Events given / received per ant, split by forager status (simulation only). */
  perAnt?: PerAntCounts;
}

/** Per-ant event counts (minutes 30–90), one value per ant, zeros included. */
export interface PerAntCounts {
  fGive: number[];
  fRecv: number[];
  nfGive: number[];
  nfRecv: number[];
}

export type PerAntGroup = keyof PerAntCounts;

export const PER_ANT_GROUPS: { id: PerAntGroup; label: string }[] = [
  { id: 'fGive', label: 'Events given per forager (Fig. 3B)' },
  { id: 'fRecv', label: 'Events received per forager (Fig. 3C)' },
  { id: 'nfGive', label: 'Events given per non-forager (Fig. 3D)' },
  { id: 'nfRecv', label: 'Events received per non-forager (Fig. 3E)' },
];

/**
 * Bles et al. 2022 Fig. 3B–E: number of ants with k = 0, 1, 2, … events,
 * pooled over the 5 colonies (61 foragers, 206 non-foragers). Hard-coded in
 * the authors' script (Zenodo, CC BY 4.0; docs/research/bles-tec-spec.md
 * §4.2); forager identities are not in the raw scan file. Consistent with
 * the pair counts (forager donations 301 = FF + FNF, non-forager 194).
 */
export const E6_PER_ANT_HIST: Record<PerAntGroup, number[]> = {
  fGive: [4, 2, 5, 6, 10, 11, 7, 5, 5, 4, 1, 0, 0, 1],
  fRecv: [22, 15, 12, 4, 5, 3],
  nfGive: [105, 55, 23, 12, 6, 2, 1, 1, 0, 0, 1],
  nfRecv: [53, 39, 42, 37, 17, 10, 4, 2, 0, 1, 1],
};

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
    const give = new Array<number>(forager.length).fill(0);
    const recv = new Array<number>(forager.length).fill(0);
    for (const e of ev) {
      give[e.donor]++;
      recv[e.receiver]++;
    }
    const pick = (v: number[], f: boolean) => v.filter((_, i) => forager[i] === f);
    m.perAnt = { fGive: pick(give, true), fRecv: pick(recv, true), nfGive: pick(give, false), nfRecv: pick(recv, false) };
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
 * per-colony metrics (observer rule 'after' unless given).
 */
export function simulateColonies(run: (rng: RNG) => ColonyRun, colonies: number, seed: number, first = 0, rule?: ObserverRule): E6Metrics[] {
  return Array.from({ length: colonies }, (_, i) => {
    const c = first + i;
    const rng = RNG.stream(seed, c);
    const r = run(rng);
    const phase = RNG.stream(seed, c, 1).range(0, 60);
    const events = scansToEvents(observeContacts(r.contacts, { colony: 1, phase, rule }));
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
 * Judge simulated colonies. Mean: t = Δ / √(SE_data² + SE_sim²), SE_data =
 * SD/√5 (4 df), SE_sim from 10 blocks of colonies (9 df), reported as the
 * normal-equivalent z through Student's t with df = min(4, 9) = 4 (and with
 * the Welch–Satterthwaite df as `zWelch`).
 * Spread: variance-ratio F test, also as a normal-equivalent z (normal
 * colony values assumed; with 5 colonies indicative only).
 */
export function e6Compare(sim: E6Metrics[], targets: E6Target[], blocks = 10): E6Row[] {
  return targets.map((t) => {
    const v = sim.map((m) => m[t.id] as number);
    const per = Math.ceil(v.length / blocks);
    const est = blockEstimate(Array.from({ length: blocks }, (_, b) => v.slice(b * per, (b + 1) * per)));
    const seData = t.sd / Math.sqrt(t.n);
    const s = smallSampleZ(est.mean, est.se, est.blocks - 1, t.mean, seData, t.n - 1);
    return {
      target: t,
      simMean: est.mean,
      simSd: est.sd,
      mean: { id: t.id, label: t.label, kind: 'mean', data: t.mean, sim: est.mean, seData, seSim: est.se, ...s },
      spread: { id: `${t.id}.sd`, label: `${t.label} (SD between colonies)`, kind: 'spread', data: t.sd, sim: est.sd, seData: NaN, seSim: NaN, z: varianceRatioZ(est.sd, est.n, t.sd, t.n) },
    };
  });
}

/** Histogram (count of ants with k events) of non-negative integer values. */
function histogram(values: number[]): number[] {
  const h: number[] = [];
  for (const v of values) h[v] = (h[v] ?? 0) + 1;
  return Array.from(h, (c) => c ?? 0);
}

/** KS distance between two histograms on the integers 0, 1, … (ties handled exactly). */
export function ksDistanceHist(a: number[], b: number[]): number {
  const na = a.reduce((s, c) => s + c, 0);
  const nb = b.reduce((s, c) => s + c, 0);
  let ca = 0;
  let cb = 0;
  let d = 0;
  for (let k = 0; k < Math.max(a.length, b.length); k++) {
    ca += a[k] ?? 0;
    cb += b[k] ?? 0;
    d = Math.max(d, Math.abs(ca / na - cb / nb));
  }
  return d;
}

const addHist = (into: number[], h: number[], sign: 1 | -1) => h.forEach((c, k) => (into[k] = (into[k] ?? 0) + sign * c));
const histMean = (h: number[]) => h.reduce((s, c, k) => s + c * k, 0) / h.reduce((s, c) => s + c, 0);
const histZero = (h: number[]) => (h[0] ?? 0) / h.reduce((s, c) => s + c, 0);

export interface PerAntRow {
  id: PerAntGroup | 'total';
  label: string;
  /** KS distance of the data from the pooled simulated distribution (sum over groups for 'total'). */
  d: number;
  /** Monte Carlo p: share of pseudo-data sets (5 simulated colonies) at least as far from the rest. */
  p: number;
  /** Two-sided normal equivalent of p; `capped` when no pseudo-data set reached d (z ≥ the value shown). */
  z: number;
  capped: boolean;
  data: { n: number; mean: number; zero: number };
  sim: { n: number; mean: number; zero: number };
}

/**
 * Per-ant distributions (Bles et al. Fig. 3B–E) by a Monte Carlo
 * goodness-of-fit test that matches how the data were pooled: the data are
 * 5 colonies' ants pooled, so the null distribution of the KS distance is
 * built by drawing 5 simulated colonies, pooling their ants (the forager
 * count varies as it does in the data) and scoring them against the pooled
 * remaining colonies. This handles tied integer counts, ants clustered in
 * colonies and the variable group sizes, which the asymptotic KS p-value
 * does not. 'total' (Σ D over the four groups, the authors' D_total) uses
 * the same draws.
 */
export function e6PerAntCompare(sim: E6Metrics[], reps = 10_000, seed = 6_300_000, data = E6_PER_ANT_HIST): PerAntRow[] {
  const cols = sim.filter((m) => m.perAnt);
  if (cols.length < 10) throw new Error('e6PerAntCompare: needs ≥ 10 simulated colonies with per-ant counts');
  const hists = cols.map((m) => Object.fromEntries(PER_ANT_GROUPS.map((g) => [g.id, histogram(m.perAnt![g.id])])) as Record<PerAntGroup, number[]>);
  const all = {} as Record<PerAntGroup, number[]>;
  for (const g of PER_ANT_GROUPS) {
    all[g.id] = [];
    for (const h of hists) addHist(all[g.id], h[g.id], 1);
  }
  const dData = PER_ANT_GROUPS.map((g) => ksDistanceHist(data[g.id], all[g.id]));
  const exceed = new Array<number>(PER_ANT_GROUPS.length + 1).fill(0);
  const total = dData.reduce((s, d) => s + d, 0);
  const rng = RNG.stream(seed, cols.length);
  for (let r = 0; r < reps; r++) {
    const pickIdx: number[] = [];
    while (pickIdx.length < 5) {
      const i = rng.int(cols.length);
      if (!pickIdx.includes(i)) pickIdx.push(i);
    }
    let sumD = 0;
    PER_ANT_GROUPS.forEach((g, j) => {
      const pseudo: number[] = [];
      const rest = all[g.id].slice();
      for (const i of pickIdx) {
        addHist(pseudo, hists[i][g.id], 1);
        addHist(rest, hists[i][g.id], -1);
      }
      // A pseudo-data set with no ant in a group (no forager drawn) cannot be scored: D = 1.
      const d = pseudo.some((c) => c > 0) ? ksDistanceHist(pseudo, rest) : 1;
      sumD += d;
      if (d >= dData[j] - 1e-12) exceed[j]++;
    });
    if (sumD >= total - 1e-12) exceed[PER_ANT_GROUPS.length]++;
  }
  const row = (id: PerAntGroup | 'total', label: string, d: number, k: number, dh: number[], sh: number[]): PerAntRow => {
    const p = (k + 1) / (reps + 1);
    const stat = (h: number[]) => ({ n: h.reduce((s, c) => s + c, 0), mean: histMean(h), zero: histZero(h) });
    return { id, label, d, p, z: pToZ(p), capped: k === 0, data: stat(dh), sim: stat(sh) };
  };
  const rows = PER_ANT_GROUPS.map((g, j) => row(g.id, g.label, dData[j], exceed[j], data[g.id], all[g.id]));
  rows.push(row('total', 'All four (Σ D, the authors\' D_total)', total, exceed[PER_ANT_GROUPS.length], [], []));
  return rows;
}

export function e6PerAntTable(rows: PerAntRow[]): string {
  return rows
    .map((r) => {
      const z = `${r.capped ? '≥' : ' '}${r.z.toFixed(1)}`.padStart(5);
      const desc = r.id === 'total' ? '' : `  data n ${r.data.n} mean ${r.data.mean.toFixed(2)} zero ${r.data.zero.toFixed(2)} | sim n ${r.sim.n} mean ${r.sim.mean.toFixed(2)} zero ${r.sim.zero.toFixed(2)}`;
      return `per-ant  z=${z}  D=${r.d.toFixed(3)} p=${r.p.toFixed(4)}  ${r.label}${desc}`;
    })
    .join('\n');
}

export function e6Table(rows: E6Row[]): string {
  const f = (v: number) => (Math.abs(v) < 1 ? v.toFixed(3) : v.toFixed(1));
  return rows
    .map((r) => `${r.target.family.padEnd(8)} z=${r.mean.z.toFixed(1).padStart(5)} (t=${r.mean.t!.toFixed(1).padStart(5)}, zWS=${r.mean.zWelch!.toFixed(1).padStart(5)} df ${r.mean.dfWelch!.toFixed(1).padStart(4)})  zSD=${r.spread.z.toFixed(1).padStart(5)}  ${r.target.label}: data ${f(r.target.mean)}±${f(r.target.sd)} (${r.target.source}), sim ${f(r.simMean)}±${f(r.simSd)}`)
    .join('\n');
}
