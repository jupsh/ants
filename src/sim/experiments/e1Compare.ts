import { bootstrapSE, combinedZ, fitZ, ksTest, type Comparison, type CompareKind } from '../analysis/compare';
import { combineWalkStats, KHUONG_PREP, prepareTrack, summarize, trackStats, type Track, type TrackStats, type WalkStats } from '../analysis/trajectory';
import { diagTrack, diagValues, SPEED_BINS, type DiagTrack } from '../analysis/walkDiagnostics';

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
  /** Structure diagnostics of the same prepared track (speed-resolved turning etc.). */
  diag: DiagTrack;
}

/** Totals over ants: as `Acc`, with a dense speed histogram. */
interface Total extends Omit<Acc, 'speedIdx' | 'speedCnt' | 'diag'> {
  speedHist: Float64Array;
}

const BIN = 0.05;
const NBIN = 6000; // 0–300 mm/s; faster samples go in the last bin

function accFor(t: TrackStats, diag: DiagTrack): Acc {
  // Occupied bins in increasing order, and their counts.
  const all = new Uint16Array(t.speeds.length);
  for (let i = 0; i < all.length; i++) all[i] = Math.min(NBIN - 1, Math.floor(t.speeds[i] / BIN));
  all.sort();
  const bins: number[] = [];
  const cnt: number[] = [];
  for (let i = 0; i < all.length; i++) {
    if (i && all[i] === all[i - 1]) cnt[cnt.length - 1]++;
    else {
      bins.push(all[i]);
      cnt.push(1);
    }
  }
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
    speedCnt: Float64Array.from(cnt),
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
    diag,
  };
}

/** Per-ant summary of one raw track (prepared as the Khuong data were), or null if too short. */
export function summarizeTrack(t: Track): Acc | null {
  const prep = prepareTrack(t, KHUONG_PREP);
  const ts = prep ? trackStats(prep, undefined, false) : null;
  const d = prep ? diagTrack(prep, undefined, false) : null;
  return ts && d ? accFor(ts, d) : null;
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

/**
 * Speed-resolved turning statistics from walkDiagnostics that are fitted
 * (step 5, docs/STATUS.md Decisions 2026-10-08); the other diagnostics stay
 * never-fitted checks.
 */
interface DiagScalar {
  id: string;
  label: string;
  family: string;
}
const speedTag = (b: number) => `${SPEED_BINS[b][0]}–${SPEED_BINS[b][1]} mm/s`;
export const DIAG_SCALARS: DiagScalar[] = [
  ...SPEED_BINS.map((_, b): DiagScalar => ({ id: `turnBig.${b}`, label: `P(|turn| > 0.5 rad) per 2.5 mm chord, ${speedTag(b)}`, family: 'turnBig' })),
  ...SPEED_BINS.map((_, b): DiagScalar => ({ id: `turnMed.${b}`, label: `Median |turn| per 2.5 mm chord (rad), ${speedTag(b)}`, family: 'turnMed' })),
  { id: 'antTurn.slope', label: 'Per-ant slope of log(1 − ⟨cos⟩ at 10 mm) on log median speed', family: 'antTurnSlope' },
  { id: 'stopCos.0', label: 'Heading into vs out of stops < 0.4 s, ⟨cos⟩', family: 'stopTurn' },
  { id: 'stopCos.1', label: 'Heading into vs out of stops 0.4–1.2 s, ⟨cos⟩', family: 'stopTurn' },
];

export interface E1Sample {
  /** Per-ant summaries, in ant order (null for unusable tracks). */
  acc: (Acc | null)[];
  /** Full pooled statistics, when built from tracks (for display). */
  stats?: WalkStats;
}

export interface E1Reference {
  sample: E1Sample & { stats: WalkStats };
  /** Values and bootstrap SEs of the scalar statistics, in `SCALARS` then `DIAG_SCALARS` order. */
  values: number[];
  se: number[];
  /**
   * Synthetic reference scaled to a smaller real sample (`scaleReference`):
   * the number of ants its SEs and KS rows stand for.
   */
  nEff?: number;
}

export function sampleFor(tracks: Track[]): E1Sample & { stats: WalkStats } {
  const prepared = tracks.map((t) => prepareTrack(t, KHUONG_PREP));
  const parts = prepared.map((t) => (t ? trackStats(t) : null));
  const diags = prepared.map((t) => (t ? diagTrack(t) : null));
  return { stats: combineWalkStats(parts), acc: parts.map((p, i) => (p && diags[i] ? accFor(p, diags[i]!) : null)) };
}

export function statsFor(tracks: Track[]): WalkStats {
  return sampleFor(tracks).stats;
}

/** Values of SCALARS then DIAG_SCALARS for a sample (optionally a resample of its ants). */
function statValues(sample: E1Sample, idx?: number[]): number[] {
  const g = aggregate(sample.acc, idx);
  const diags = (idx ? idx.map((i) => sample.acc[i]) : sample.acc).map((a) => (a ? a.diag : null));
  const dv = new Map(diagValues(diags, []).map((v) => [v.id, v.value]));
  return [...SCALARS.map((c) => c.f(g)), ...DIAG_SCALARS.map((c) => dv.get(c.id) ?? NaN)];
}

/** Bootstrap SEs of the scalar statistics (resampling ants). */
export function scalarSE(sample: E1Sample, reps = 200, seed = 1): number[] {
  return bootstrapSE(sample.acc.length, (idx) => statValues(sample, idx), reps, seed);
}

/** Precompute the data side once: values plus bootstrap SEs. */
export function referenceFor(tracks: Track[], reps = 200): E1Reference {
  const sample = sampleFor(tracks);
  return { sample, values: statValues(sample), se: scalarSE(sample, reps) };
}

/**
 * A large synthetic reference scored as if it had `nEff` ants: SEs scaled by
 * √(n/nEff) and KS rows with an effective reference size, so the loss keeps
 * the weights and scale of a fit to nEff real ants while the reference values
 * carry almost no sampling error (parameter-recovery tests, STATUS
 * 2026-10-08).
 */
export function scaleReference(ref: E1Reference, nEff: number): E1Reference {
  const n = ref.sample.acc.filter((a) => a !== null).length;
  return { ...ref, se: ref.se.map((v) => v * Math.sqrt(n / nEff)), nEff };
}

export interface E1Comparison {
  /** Σ over families of the mean z² in that family (a family counts once). */
  loss: number;
  rows: (Comparison & { family: string })[];
  /**
   * Ids of rows the reference can estimate but the simulation cannot (z not
   * finite). `loss` charges them a fixed 100, fine as a fitting fallback
   * (fitE1 ranks such candidates last anyway) but not for judging: a
   * candidate with missing rows is unjudgeable there and cannot win or pass
   * (STATUS 2026-10-09).
   */
  missing: string[];
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
  const sv = statValues(sim);
  const meta = [...SCALARS.map((c) => ({ id: c.id, label: c.label, family: c.family, kind: c.kind })), ...DIAG_SCALARS.map((c) => ({ ...c, kind: 'mean' as CompareKind }))];
  const rows: E1Comparison['rows'] = [];
  meta.forEach((c, i) => {
    // A statistic the data cannot estimate at this incline is left out.
    if (!Number.isFinite(ref.values[i]) || !(ref.se[i] > 0)) return;
    const seSim = simSE ? simSE[i] : NaN;
    const z = simSE ? combinedZ(sv[i], seSim, ref.values[i], ref.se[i]) : fitZ(sv[i], ref.values[i], ref.se[i]);
    rows.push({ ...c, data: ref.values[i], sim: sv[i], seData: ref.se[i], seSim, z });
  });
  const noRef = new Set<string>();
  const ks = (id: string, label: string, family: string, a: number[], b: number[]) => {
    if (!b.length) noRef.add(id);
    const r = ksTest(a, b, ref.nEff ? (b.length * ref.nEff) / ref.sample.acc.filter((x) => x !== null).length : undefined);
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
  return { loss, rows, missing: rows.filter((r) => !Number.isFinite(r.z) && !noRef.has(r.id)).map((r) => r.id) };
}
