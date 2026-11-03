import assert from 'node:assert/strict';
import { colonyStats, observeContacts, scansToEvents, type ContactInterval, type ObserverRule, type Scan } from '../../src/sim/analysis/trophallaxis';
import type { ShareBout } from '../../src/sim/experiments/colonyBles';
import { mouthContact } from '../../src/sim/physics/contacts';
import type { World } from '../../src/sim/world/world';

export interface MouthEpisode {
  a: number;
  b: number;
  start: number;
  end: number;
}

const EPS = 1e-7;
const pairKey = (a: number, b: number) => `${Math.min(a, b)}:${Math.max(a, b)}`;

/** Endpoint sampling: a positive post-step sample represents [t, t + dt).
 * It only changes the geometry function's derived head-position caches.
 */
export class MouthRecorder {
  readonly episodes: MouthEpisode[] = [];
  private readonly open = new Map<string, MouthEpisode>();

  sample(w: World, outside: readonly boolean[], t: number, dt: number): void {
    const seen = new Set<string>();
    for (let i = 0; i < w.ants.length; i++) {
      if (outside[i] || !w.ants[i].body.alive) continue;
      for (let j = i + 1; j < w.ants.length; j++) {
        if (outside[j] || !w.ants[j].body.alive || !mouthContact(w.ants[i].body, w.ants[j].body)) continue;
        const key = pairKey(i, j);
        seen.add(key);
        const old = this.open.get(key);
        if (old) old.end = t + dt;
        else this.open.set(key, { a: i, b: j, start: t, end: t + dt });
      }
    }
    for (const [key, episode] of this.open) {
      if (seen.has(key)) continue;
      this.episodes.push(episode);
      this.open.delete(key);
    }
  }

  finish(): MouthEpisode[] {
    return [...this.episodes, ...this.open.values()].map((e) => ({ ...e }))
      .sort((a, b) => a.start - b.start || a.a - b.a || a.b - b.b);
  }
}

export function summary(values: number[]) {
  assert(values.every(Number.isFinite), 'summary received a non-finite value');
  const a = [...values].sort((x, y) => x - y);
  if (!a.length) return { n: 0, mean: null, min: null, median: null, p90: null, p95: null, p99: null, max: null, atLeast60: 0 };
  const q = (p: number) => {
    const h = (a.length - 1) * p;
    return a[Math.floor(h)] + (a[Math.ceil(h)] - a[Math.floor(h)]) * (h - Math.floor(h));
  };
  return { n: a.length, mean: a.reduce((s, x) => s + x, 0) / a.length,
    min: a[0], median: q(0.5), p90: q(0.9), p95: q(0.95), p99: q(0.99), max: a.at(-1)!,
    atLeast60: a.filter((x) => x >= 60 - EPS).length };
}

/** Do not assign a donor from geometry. Only episodes whose flow gives one
 * direction can enter the paired directed observer comparison. Empty and
 * reversing episodes remain explicit unresolved categories.
 */
export function matchBouts(bouts: ShareBout[], episodes: MouthEpisode[], foodTime: number, runEnd: number) {
  const byPair = new Map<string, number[]>();
  episodes.forEach((e, i) => {
    const key = pairKey(e.a, e.b);
    const indices = byPair.get(key) ?? [];
    indices.push(i);
    byPair.set(key, indices);
  });
  const matched: { bout: number; episode: number; pre: number; post: number; padding: number; flow: number; mouth: number; leftCensored: boolean; rightCensored: boolean }[] = [];
  const unmatched: number[] = [];
  const contained = new Map<number, number[]>();
  bouts.forEach((b, i) => {
    const candidates = (byPair.get(pairKey(b.donor, b.receiver)) ?? [])
      .filter((j) => episodes[j].start <= b.start + EPS && episodes[j].end >= b.end - EPS);
    if (candidates.length !== 1) { unmatched.push(i); return; }
    const j = candidates[0];
    const e = episodes[j];
    const pre = Math.max(0, b.start - e.start);
    const post = Math.max(0, e.end - b.end);
    matched.push({ bout: i, episode: j, pre, post, padding: pre + post, flow: b.end - b.start,
      mouth: e.end - e.start, leftCensored: e.start <= EPS, rightCensored: e.end >= runEnd - EPS });
    const indices = contained.get(j) ?? [];
    indices.push(i);
    contained.set(j, indices);
  });
  const flow: ContactInterval[] = [];
  const mouth: ContactInterval[] = [];
  const reversing: number[] = [];
  const noFlow: number[] = [];
  const incomplete: number[] = [];
  const nonFlow: number[] = [];
  episodes.forEach((e, j) => {
    if (e.end <= foodTime) return;
    const indices = contained.get(j) ?? [];
    // A partially overlapping unmatched bout must not silently turn into a
    // shorter or direction-identifiable mouth episode.
    const overlapsUnmatched = unmatched.some((i) => {
      const b = bouts[i];
      return pairKey(b.donor, b.receiver) === pairKey(e.a, e.b) && b.start < e.end - EPS && b.end > e.start + EPS;
    });
    if (overlapsUnmatched) { incomplete.push(j); return; }
    if (!indices.length) { noFlow.push(j); return; }
    const dirs = new Set(indices.map((i) => `${bouts[i].donor}>${bouts[i].receiver}`));
    if (dirs.size !== 1) { reversing.push(j); return; }
    const first = bouts[indices[0]];
    const interval = (b: ShareBout): ContactInterval => ({ donor: b.donor, receiver: b.receiver, start: b.start - foodTime, end: b.end - foodTime });
    flow.push(...indices.map((i) => interval(bouts[i])));
    mouth.push({ donor: first.donor, receiver: first.receiver, start: e.start - foodTime, end: e.end - foodTime });
    nonFlow.push(e.end - e.start - indices.reduce((s, i) => s + bouts[i].end - bouts[i].start, 0));
  });
  return { matched, unmatched, reversing, noFlow, incomplete, flow, mouth, nonFlow };
}

const scanKey = (s: Scan) => `${s.minute}:${s.donor}>${s.receiver}`;
const eventSpan = (e: { start: number; end: number }) => (e.end - e.start) * 60;
function counts(scans: Scan[], n: number) {
  const events = scansToEvents(scans);
  const give = Array<number>(n).fill(0);
  const recv = Array<number>(n).fill(0);
  for (const e of events) { give[e.donor]++; recv[e.receiver]++; }
  return { give, recv, events };
}
function histogram(values: number[]) {
  const out = Array<number>(Math.max(0, ...values) + 1).fill(0);
  for (const v of values) out[v]++;
  return out;
}

export function compareObserved(flow: ContactInterval[], mouth: ContactInterval[], forager: boolean[], phase: number, rule: ObserverRule = 'after') {
  const o = { colony: 1, phase, rule };
  const a = observeContacts(flow, o);
  const b = observeContacts(mouth, o);
  const ka = new Set(a.map(scanKey));
  const kb = new Set(b.map(scanKey));
  const ca = counts(a, forager.length);
  const cb = counts(b, forager.length);
  const sa = colonyStats(ca.events, 1, 30, forager.length);
  const sb = colonyStats(cb.events, 1, 30, forager.length);
  const perAnt: Record<string, { n: number; changed: number; maxAbsChange: number; flowHistogram: number[]; mouthHistogram: number[] }> = {};
  for (const isForager of [true, false]) for (const side of ['give', 'recv'] as const) {
    const ids = forager.flatMap((f, i) => f === isForager ? [i] : []);
    const av = ids.map((i) => ca[side][i]);
    const bv = ids.map((i) => cb[side][i]);
    perAnt[`${isForager ? 'f' : 'nf'}${side === 'give' ? 'Give' : 'Recv'}`] = {
      n: ids.length, changed: av.filter((v, i) => v !== bv[i]).length,
      maxAbsChange: Math.max(0, ...av.map((v, i) => Math.abs(v - bv[i]))),
      flowHistogram: histogram(av), mouthHistogram: histogram(bv),
    };
  }
  return { phase, rule, flowScans: a.length, mouthScans: b.length,
    addedScans: [...kb].filter((k) => !ka.has(k)).length, lostScans: [...ka].filter((k) => !kb.has(k)).length,
    flowEvents: ca.events.length, mouthEvents: cb.events.length,
    eventDifference: cb.events.length - ca.events.length,
    flowSpanSeconds: ca.events.map(eventSpan), mouthSpanSeconds: cb.events.map(eventSpan),
    flowStats: sa, mouthStats: sb, perAnt };
}

/** Single-bout padding uses an enclosing mouth episode. This comparison is
 * before merging across bouts; unique episodes are used for colony totals.
 */
export function perBoutObserved(bouts: ShareBout[], episodes: MouthEpisode[], matched: ReturnType<typeof matchBouts>['matched'], foodTime: number, phase: number) {
  return matched.map((m) => {
    const b = bouts[m.bout];
    const e = episodes[m.episode];
    const c = (start: number, end: number): ContactInterval => ({ donor: b.donor, receiver: b.receiver, start: start - foodTime, end: end - foodTime });
    const nf = observeContacts([c(b.start, b.end)], { colony: 1, phase }).length;
    const nm = observeContacts([c(e.start, e.end)], { colony: 1, phase }).length;
    assert(nm >= nf, 'enclosing mouth interval lost a scan');
    return { bout: m.bout, flowScans: nf, mouthScans: nm, occupiedBinDifferenceSeconds: (nm - nf) * 60 };
  });
}
