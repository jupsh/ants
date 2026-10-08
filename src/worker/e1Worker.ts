/// <reference lib="webworker" />
import { parseKhuongCsv } from '../sim/analysis/khuongData';
import type { Track, WalkStats } from '../sim/analysis/trajectory';
import { compareE1, referenceFor, sampleFor, scalarSE, type E1Comparison, type E1Reference } from '../sim/experiments/e1Compare';
import { runE1 } from '../sim/experiments/e1Exploration';
import type { WalkParams } from '../sim/models/walk';

export interface E1Request {
  dataUrl: string;
  incline: number;
  ants: number;
  seed: number;
  dt: number;
  params: WalkParams;
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

const dataCache = new Map<string, { tracks: Track[]; ref: E1Reference }>();

async function loadData(url: string): Promise<{ tracks: Track[]; ref: E1Reference }> {
  const hit = dataCache.get(url);
  if (hit) return hit;
  const res = await fetch(url);
  const buf = new Uint8Array(await res.arrayBuffer());
  // Some servers send .gz with Content-Encoding: gzip (already decoded by the
  // browser); only decompress if the gzip magic bytes are still present.
  const text =
    buf[0] === 0x1f && buf[1] === 0x8b
      ? await new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'))).text()
      : new TextDecoder().decode(buf);
  const tracks = parseKhuongCsv(text);
  const entry = { tracks, ref: referenceFor(tracks) };
  dataCache.set(url, entry);
  return entry;
}

/** Thin a track for drawing (every k-th sample). */
function thin(t: Track, k: number): PlainTrack {
  const out: PlainTrack = { t: [], x: [], y: [] };
  for (let i = 0; i < t.t.length; i += k) {
    out.t.push(t.t[i]);
    out.x.push(t.x[i]);
    out.y.push(t.y[i]);
  }
  return out;
}

self.onmessage = async (ev: MessageEvent<E1Request>) => {
  const r = ev.data;
  const t0 = performance.now();
  const { tracks: dataTracks, ref } = await loadData(r.dataUrl);
  const simTracks = runE1(r.params, { incline: r.incline, ants: r.ants, seed: r.seed, dt: r.dt });
  const sim = sampleFor(simTracks);
  const { loss, rows } = compareE1(sim, ref, scalarSE(sim));
  const res: E1Response = {
    data: { stats: ref.sample.stats, tracks: dataTracks.map((t) => thin(t, 3)) },
    sim: { stats: sim.stats, tracks: simTracks.slice(0, 69).map((t) => thin(t, 3)) },
    loss,
    rows,
    ms: performance.now() - t0,
  };
  (self as unknown as Worker).postMessage(res);
};
