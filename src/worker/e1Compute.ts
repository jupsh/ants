import fit from '../../data/fits/e1-walk.json';
import { parseKhuongCsv } from '../sim/analysis/khuongData';
import type { Track, WalkStats } from '../sim/analysis/trajectory';
import { compareE1, referenceFor, sampleFor, scalarSE, type E1Comparison, type E1Reference } from '../sim/experiments/e1Compare';
import { runE1 } from '../sim/experiments/e1Exploration';
import { walkParams, type WalkParams } from '../sim/models/walk';
import { khuongTracking } from '../sim/species/lasiusM1';

/**
 * The E1 page's computation, shared by its worker and by
 * scripts/precompute.ts (which runs it at build time for the page's default
 * settings, so the page can show a result immediately).
 */
export const E1_INCLINE_RAD = [0, Math.PI / 9, Math.PI / 6, Math.PI / 4, Math.PI / 3];

export interface E1Request {
  /** Incline index 0…4 (Khuong et al. incline k = index + 1). */
  inclineIndex: number;
  incline: number;
  ants: number;
  seed: number;
  dt: number;
  params: WalkParams;
  /** Tracking observer calibrated on the recorded tracks of this incline. */
  tracking: { sx: number; sy: number };
}

/** The request the page sends for an incline, ant count and seed. */
export function e1Request(inclineIndex: number, ants: number, seed: number): E1Request {
  return {
    inclineIndex,
    incline: E1_INCLINE_RAD[inclineIndex],
    ants,
    seed,
    dt: 0.02,
    params: walkParams(fit.params as Partial<WalkParams>),
    tracking: khuongTracking(inclineIndex + 1),
  };
}

export interface PlainTrack {
  t: number[];
  x: number[];
  y: number[];
}

export interface E1Response {
  data: { stats: WalkStats; tracks: PlainTrack[] };
  sim: { stats: WalkStats; tracks: PlainTrack[] };
  /** Combined-SE comparison (docs/STATUS.md, Evidence policy § Criteria). */
  loss: number;
  rows: E1Comparison['rows'];
  ms: number;
}

export interface E1Data {
  tracks: Track[];
  ref: E1Reference;
}

export function e1Data(csv: string): E1Data {
  const tracks = parseKhuongCsv(csv);
  return { tracks, ref: referenceFor(tracks) };
}

const r2 = (v: number) => Math.round(v * 100) / 100;

/** Thin a track for drawing (every k-th sample, 0.01 mm / 0.01 s). */
function thin(t: Track, k: number): PlainTrack {
  const out: PlainTrack = { t: [], x: [], y: [] };
  for (let i = 0; i < t.t.length; i += k) {
    out.t.push(r2(t.t[i]));
    out.x.push(r2(t.x[i]));
    out.y.push(r2(t.y[i]));
  }
  return out;
}

/**
 * What the page draws: the speed distribution as 1001 quantiles (its median
 * is the exact sample median), per-sample arrays the page never shows left
 * empty. The comparison itself (loss, rows) uses the full statistics.
 */
function forDisplay(s: WalkStats): WalkStats {
  const a = s.speeds.filter((v) => Number.isFinite(v)).sort((p, q) => p - q);
  // Same rule as summarize(), so the page's quantiles are the sample's.
  const q = (p: number) => a[Math.round(p * (a.length - 1))];
  return { ...s, speeds: a.length ? Array.from({ length: 1001 }, (_, i) => q(i / 1000)) : [], turnIncrements: [], straightness: [] };
}

export function computeE1(r: E1Request, data: E1Data): E1Response {
  const t0 = performance.now();
  const simTracks = runE1(r.params, { incline: r.incline, ants: r.ants, seed: r.seed, dt: r.dt, tracking: r.tracking });
  const sim = sampleFor(simTracks);
  const { loss, rows } = compareE1(sim, data.ref, scalarSE(sim));
  return {
    data: { stats: forDisplay(data.ref.sample.stats), tracks: data.tracks.map((t) => thin(t, 3)) },
    sim: { stats: forDisplay(sim.stats), tracks: simTracks.slice(0, 69).map((t) => thin(t, 3)) },
    loss,
    rows,
    ms: performance.now() - t0,
  };
}
