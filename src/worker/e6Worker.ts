/// <reference lib="webworker" />
import scansCsv from '../../data/bles2022/trophallaxis_scans.csv?raw';
import { observeContacts, parseScans, scansToEvents } from '../sim/analysis/trophallaxis';
import { RNG } from '../sim/core/rng';
import { e6Compare, e6Targets, FOOD_MINUTE, simulateColonies, type E6Row } from '../sim/experiments/e6Bles';
import { blesActivity, runBles, type BlesParams } from '../sim/reference/blesTEC';

export interface E6Request {
  params: BlesParams;
  colonies: number;
  seed: number;
}

/** One recorded colony for animation, sampled every `FRAME_DT` s. */
export interface E6Frame {
  t: number;
  /** Per ant: activity code (0 nest, 1 source, 2 giving, 3 receiving), crop, partner, forager. */
  act: Uint8Array;
  crop: Float32Array;
  partner: Int16Array;
  forager: Uint8Array;
}

export interface E6Response {
  rows: E6Row[];
  /** Mean cumulative observed events per minute after food (index = minute). */
  cumData: number[];
  cumDataColonies: number[][];
  cumSim: number[];
  frames: E6Frame[];
  /** Start times (s) of every true contact in the recorded colony, and of every observed event. */
  trueStarts: number[];
  observed: { minute: number; donor: number; receiver: number }[];
  scanPhase: number;
  ms: number;
}

export const FRAME_DT = 2;
const ACT = { nest: 0, source: 1, giving: 2, receiving: 3 } as const;

function cumulative(starts: number[]): number[] {
  const c = new Array<number>(61).fill(0);
  for (const s of starts) for (let m = Math.max(0, s - FOOD_MINUTE); m <= 60; m++) c[m]++;
  return c;
}

self.onmessage = (ev: MessageEvent<E6Request>) => {
  const r = ev.data;
  const t0 = performance.now();
  const P = r.params;
  // Comparison over many colonies.
  const sim = simulateColonies((rng) => runBles(P, rng), r.colonies, r.seed);
  const rows = e6Compare(sim, e6Targets(scansCsv));
  // Cumulative event curves: data per colony, simulation mean.
  const dataEv = scansToEvents(parseScans(scansCsv)).filter((e) => e.start >= FOOD_MINUTE);
  const cumDataColonies = [1, 2, 3, 4, 5].map((c) => cumulative(dataEv.filter((e) => e.colony === c).map((e) => e.start)));
  const cumData = cumDataColonies[0].map((_, m) => cumDataColonies.reduce((s, c) => s + c[m], 0) / 5);
  const cumSim = new Array<number>(61).fill(0);
  const nCurve = Math.min(r.colonies, 100);
  for (let c = 0; c < nCurve; c++) {
    const run = runBles(P, RNG.stream(r.seed + 1, c));
    const evs = scansToEvents(observeContacts(run.contacts, { colony: 1, phase: RNG.stream(r.seed + 1, c, 1).range(0, 60) }));
    cumulative(evs.map((e) => e.start)).forEach((v, m) => (cumSim[m] += v / nCurve));
  }
  // One colony recorded for animation.
  const frames: E6Frame[] = [];
  const rec = runBles(P, RNG.stream(r.seed + 2, 0), (v) => {
    if (v.t % FRAME_DT) return;
    frames.push({
      t: v.t,
      act: Uint8Array.from(v.state, (s) => ACT[blesActivity(s)]),
      crop: Float32Array.from(v.crop),
      partner: Int16Array.from(v.partner),
      forager: Uint8Array.from(v.forager, (f) => (f ? 1 : 0)),
    });
  });
  const scanPhase = RNG.stream(r.seed + 2, 0, 1).range(0, 60);
  const observed = scansToEvents(observeContacts(rec.contacts, { colony: 1, phase: scanPhase })).map((e) => ({ minute: e.start, donor: e.donor, receiver: e.receiver }));
  const res: E6Response = { rows, cumData, cumDataColonies, cumSim, frames, trueStarts: rec.contacts.map((c) => c.start), observed, scanPhase, ms: performance.now() - t0 };
  (self as unknown as Worker).postMessage(res);
};
