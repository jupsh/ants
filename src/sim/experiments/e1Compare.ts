import { bootstrapSE, combinedZ, fitZ, ksTest, type Comparison, type CompareKind } from '../analysis/compare';
import { combineWalkStats, KHUONG_PREP, prepareTrack, summarize, trackStats, type Track, type TrackStats, type WalkStats } from '../analysis/trajectory';

/**
 * Comparison of simulated and recorded exploratory walks (E1), following the
 * evidence policy in docs/STATUS.md:
 *
 *   - scalar statistics are compared as z = (sim − data) / √(SE_data² + SE_sim²);
 *     both SEs come from a cluster bootstrap over ants (each recorded ant and
 *     each simulated ant, with its own seed stream, is an independent unit);
 *   - between-ant spread (SD of per-ant mean speed) is compared on the log
 *     scale, separately from the means;
 *   - per-ant distributions (mean speed, exit time) use two-sample KS with the
 *     actual numbers of ants. Instantaneous speeds are autocorrelated within
 *     tracks, so their distribution is compared through quantiles instead.
 *
 * Correlated statistics (heading correlation at several lags, radial
 * velocity in several bins) form families; the scalar loss averages z²
 * within a family so a family counts once.
 */

/**
 * Per-ant sufficient statistics for the scalar comparisons. Resampling ants
 * only sums these, which keeps the bootstrap cheap, and they are small
 * enough to compute in pool workers and send back instead of tracks. Speed
 * quantiles come from a 0.05 mm/s histogram (linear within a bin), applied
 * identically to data and simulation; per ant it is stored sparsely.
 */
export interface Acc {
  /** Occupied histogram bins and their counts. */
  speedIdx: Uint16Array;
  speedCnt: Float64Array;
  speedN: number;
  stopped: number;
  samples: number;
  pcSum: number[];
  pcN: number[];
  /** Σ1, Σx, Σx², Σx³, Σx⁴ of turn increments. */
  turn: number[];
  radSum: number[];
  radN: number[];
  alignSum: number;
  alignN: number;
  straightSum: number;
  straightN: number;
  trackSpeeds: number[];
  exitTimes: number[];
}

/** Totals over ants: as `Acc`, with a dense speed histogram. */
interface Total extends Omit<Acc, 'speedIdx' | 'speedCnt'> {
  speedHist: Float64Array;
}

const BIN = 0.05;
const NBIN = 6000; // 0–300 mm/s; faster samples go in the last bin

function accFor(t: TrackStats): Acc {
  const counts = new Map<number, number>();
  for (const v of t.speeds) {
    const b = Math.min(NBIN - 1, Math.floor(v / BIN));
    counts.set(b, (counts.get(b) ?? 0) + 1);
  }
  const bins = [...counts.keys()].sort((a, b) => a - b);
  const turn = [0, 0, 0, 0, 0];
  for (const x of t.turnIncrements) {
    const x2 = x * x;
    turn[0]++;
    turn[1] += x;
    turn[2] += x2;
    turn[3] += x2 * x;
    turn[4] += x2 * x2;
  }
  return {
    speedIdx: Uint16Array.from(bins),
    speedCnt: Float64Array.from(bins, (b) => counts.get(b)!),
    speedN: t.speeds.length,
    stopped: t.stopped,
    samples: t.samples,
    pcSum: t.pcSum,
    pcN: t.pcN,
    turn,
    radSum: t.radSum,
    radN: t.radN,
    alignSum: t.alignSum,
    alignN: t.alignN,
    straightSum: t.straightness.reduce((a, v) => a + v, 0),
    straightN: t.straightness.length,
    trackSpeeds: t.trackSpeed === null ? [] : [t.trackSpeed],
    exitTimes: t.exitTime === null ? [] : [t.exitTime],
  };
}

/** Per-ant summary of one raw track (prepared as the Khuong data were), or null if too short. */
export function summarizeTrack(t: Track): Acc | null {
  const prep = prepareTrack(t, KHUONG_PREP);
  const ts = prep ? trackStats(prep) : null;
  return ts ? accFor(ts) : null;
}

function aggregate(accs: (Acc | null)[], idx?: number[]): Total {
  const sel = idx ? idx.map((i) => accs[i]) : accs;
  const g: Total = { speedHist: new Float64Array(NBIN), speedN: 0, stopped: 0, samples: 0, pcSum: [], pcN: [], turn: [0, 0, 0, 0, 0], radSum: [], radN: [], alignSum: 0, alignN: 0, straightSum: 0, straightN: 0, trackSpeeds: [], exitTimes: [] };
  const add = (a: number[], b: number[]) => b.forEach((v, i) => (a[i] = (a[i] ?? 0) + v));
  for (const a of sel) {
    if (!a) continue;
    for (let i = 0; i < a.speedIdx.length; i++) g.speedHist[a.speedIdx[i]] += a.speedCnt[i];
    g.speedN += a.speedN;
    g.stopped += a.stopped;
    g.samples += a.samples;
    add(g.pcSum, a.pcSum);
    add(g.pcN, a.pcN);
    add(g.turn, a.turn);
    add(g.radSum, a.radSum);
    add(g.radN, a.radN);
    g.alignSum += a.alignSum;
    g.alignN += a.alignN;
    g.straightSum += a.straightSum;
    g.straightN += a.straightN;
    for (const v of a.trackSpeeds) g.trackSpeeds.push(v);
    for (const v of a.exitTimes) g.exitTimes.push(v);
  }
  return g;
}

function histQuantile(g: Total, p: number): number {
  if (!g.speedN) return NaN;
  const target = p * g.speedN;
  let cum = 0;
  for (let i = 0; i < NBIN; i++) {
    const c = g.speedHist[i];
    if (cum + c >= target && c > 0) return (i + (target - cum) / c) * BIN;
    cum += c;
  }
  return NBIN * BIN;
}

function turnMoments(g: Total): { sd: number; kurt: number } {
  const [n, s1, s2, s3, s4] = g.turn;
  const m = s1 / n;
  const m2 = s2 / n - m * m;
  const m4 = (s4 - 4 * m * s3 + 6 * m * m * s2) / n - 3 * m ** 4;
  return { sd: Math.sqrt((m2 * n) / (n - 1)), kurt: m4 / (m2 * m2) - 3 };
}

const ratio = (a: number[], b: number[], i: number) => (b[i] ? a[i] / b[i] : NaN);

interface Scalar {
  id: string;
  label: string;
  family: string;
  kind: CompareKind;
  f: (g: Total) => number;
}

const quantile = (xs: number[], p: number) => {
  const a = Float64Array.from(xs).sort();
  return a.length ? a[Math.min(a.length - 1, Math.round(p * (a.length - 1)))] : NaN;
};

const PATH_LAG_IDX = [1, 2, 3, 4, 5]; // 5, 10, 20, 30, 50 mm
const RADIAL_IDX = [0, 1, 2, 3, 4, 5, 6, 7]; // 0–160 mm

export const SCALARS: Scalar[] = [
  { id: 'speed.q10', label: 'Moving speed, 10th percentile (mm/s)', family: 'speed', kind: 'mean', f: (g) => histQuantile(g, 0.1) },
  { id: 'speed.q50', label: 'Moving speed, median (mm/s)', family: 'speed', kind: 'mean', f: (g) => histQuantile(g, 0.5) },
  { id: 'speed.q90', label: 'Moving speed, 90th percentile (mm/s)', family: 'speed', kind: 'mean', f: (g) => histQuantile(g, 0.9) },
  { id: 'stopped', label: 'Fraction of time stopped', family: 'stopped', kind: 'proportion', f: (g) => (g.samples ? g.stopped / g.samples : NaN) },
  ...PATH_LAG_IDX.map((i): Scalar => ({ id: `hc.${i}`, label: `Heading correlation after ${[2, 5, 10, 20, 30, 50, 80, 120][i]} mm`, family: 'headingCorr', kind: 'mean', f: (g) => ratio(g.pcSum, g.pcN, i) })),
  { id: 'turn.sd', label: 'Turn increments, SD (rad)', family: 'turnSd', kind: 'spread', f: (g) => turnMoments(g).sd },
  { id: 'turn.kurt', label: 'Turn increments, excess kurtosis', family: 'turnKurtosis', kind: 'mean', f: (g) => turnMoments(g).kurt },
  ...RADIAL_IDX.map((i): Scalar => ({ id: `radial.${i}`, label: `Radial velocity at ${i * 20}–${i * 20 + 20} mm (mm/s)`, family: 'radial', kind: 'mean', f: (g) => ratio(g.radSum, g.radN, i) })),
  { id: 'alignY', label: 'Alignment with the slope axis', family: 'align', kind: 'mean', f: (g) => (g.alignN ? g.alignSum / g.alignN : NaN) },
  { id: 'straightness', label: 'Straightness over 50 mm of path', family: 'straightness', kind: 'mean', f: (g) => g.straightSum / g.straightN },
  // Spread between ants, on the log scale (SE from the same bootstrap).
  { id: 'trackSpeed.logSd', label: 'Between-ant SD of mean speed (log)', family: 'trackSpeedSpread', kind: 'spread', f: (g) => Math.log(summarize(g.trackSpeeds).sd) },
];

export interface E1Sample {
  /** Per-ant summaries, in ant order (null for unusable tracks). */
  acc: (Acc | null)[];
  /** Full pooled statistics, when built from tracks (for display). */
  stats?: WalkStats;
}

export interface E1Reference {
  sample: E1Sample & { stats: WalkStats };
  /** Values and bootstrap SEs of the scalar statistics, in `SCALARS` order. */
  values: number[];
  se: number[];
}

export function sampleFor(tracks: Track[]): E1Sample & { stats: WalkStats } {
  const parts = tracks.map((t) => prepareTrack(t, KHUONG_PREP)).map((t) => (t ? trackStats(t) : null));
  return { stats: combineWalkStats(parts), acc: parts.map((p) => (p ? accFor(p) : null)) };
}

export function statsFor(tracks: Track[]): WalkStats {
  return sampleFor(tracks).stats;
}

const scalarValues = (g: Total) => SCALARS.map((c) => c.f(g));

/** Bootstrap SEs of the scalar statistics (resampling ants). */
export function scalarSE(sample: E1Sample, reps = 200, seed = 1): number[] {
  return bootstrapSE(sample.acc.length, (idx) => scalarValues(aggregate(sample.acc, idx)), reps, seed);
}

/** Precompute the data side once: values plus bootstrap SEs. */
export function referenceFor(tracks: Track[], reps = 200): E1Reference {
  const sample = sampleFor(tracks);
  return { sample, values: scalarValues(aggregate(sample.acc)), se: scalarSE(sample, reps) };
}

export interface E1Comparison {
  /** Σ over families of the mean z² in that family (a family counts once). */
  loss: number;
  rows: (Comparison & { family: string })[];
}

/**
 * Compare a simulated sample with the data reference.
 *   - `simSE` given (judging): combined-SE z, as required for "reproduced".
 *   - `simSE` omitted (fitting): z uses SE_data only, so the optimiser
 *     cannot lower the loss by making the simulation noisier.
 */
export function compareE1(sim: E1Sample, ref: E1Reference, simSE?: number[]): E1Comparison {
  const simTotal = aggregate(sim.acc);
  const refTotal = aggregate(ref.sample.acc);
  const sv = scalarValues(simTotal);
  const rows: E1Comparison['rows'] = SCALARS.map((c, i) => {
    const seSim = simSE ? simSE[i] : NaN;
    const z = simSE ? combinedZ(sv[i], seSim, ref.values[i], ref.se[i]) : fitZ(sv[i], ref.values[i], ref.se[i]);
    return { id: c.id, label: c.label, family: c.family, kind: c.kind, data: ref.values[i], sim: sv[i], seData: ref.se[i], seSim, z };
  });
  const ks = (id: string, label: string, family: string, a: number[], b: number[]) => {
    const r = ksTest(a, b);
    // Signed by the direction of the median difference, for readability.
    const sign = Math.sign(quantile(a, 0.5) - quantile(b, 0.5)) || 1;
    rows.push({ id, label: `${label} (KS D = ${r.d.toFixed(2)}, n = ${r.n}/${r.m})`, family, kind: 'distribution', data: quantile(b, 0.5), sim: quantile(a, 0.5), seData: NaN, seSim: NaN, z: sign * r.z });
  };
  ks('trackSpeed.ks', 'Per-ant mean speed distribution', 'trackSpeedKS', simTotal.trackSpeeds, refTotal.trackSpeeds);
  ks('exit.ks', 'Exit-time distribution', 'exitKS', simTotal.exitTimes, refTotal.exitTimes);
  const fam = new Map<string, number[]>();
  for (const r of rows) fam.set(r.family, [...(fam.get(r.family) ?? []), Number.isFinite(r.z) ? r.z * r.z : 100]);
  let loss = 0;
  for (const zs of fam.values()) loss += zs.reduce((s, v) => s + v, 0) / zs.length;
  return { loss, rows };
}
