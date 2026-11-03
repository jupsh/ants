/** Run from the repository root; outputs stay in B011. No empirical input is loaded. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { arg, flag, numArg, seedFor, writeJson } from '../../scripts/lib';
import { stamp } from '../_lib/stamp';
import { RNG } from '../../src/sim/core/rng';
import { runColony, type ColonyOptions } from '../../src/sim/experiments/colonyBles';
import { LASIUS_NEST, LASIUS_PARAMS } from '../../src/sim/species/lasiusM1';
import { compareObserved, matchBouts, MouthRecorder, perBoutObserved, summary } from './analyse';

const ITEM = path.dirname(fileURLToPath(import.meta.url));
const index = numArg('--index', 0);
const dt = numArg('--dt', 0.1);
const minutes = numArg('--minutes', 90 + 65 / 60);
const foodMinute = numArg('--food-minute', 30);
const nPhases = numArg('--phases', 20);
assert(Number.isInteger(index) && index >= 0 && index < 3, 'diagnostic index must be 0, 1 or 2');
assert(dt > 0 && minutes > foodMinute && Number.isInteger(nPhases) && nPhases > 0);
const seed = seedFor(11_011, 'diag', index);
const o: ColonyOptions = { seed, ants: 53, dt, minutes, foodMinute, starvationDays: 4, frameEvery: 0 };
const provenance = stamp(ITEM);
const P = { ...LASIUS_PARAMS, nest: LASIUS_NEST };
const recorder = new MouthRecorder();
const t0 = performance.now();
const r = runColony(P, o, (w, info) => { recorder.sample(w, info.outside, info.t, dt); });
const simulationSeconds = (performance.now() - t0) / 1000;
const episodes = recorder.finish();
const bouts = r.bouts.filter((b) => b.end > r.foodTime);
const runEnd = Math.round(minutes * 60 / dt) * dt;
const match = matchBouts(bouts, episodes, r.foodTime, runEnd);
const phases = Array.from({ length: nPhases }, (_, i) => RNG.stream(seed, 0x0b5, i).range(0, 60));
const observed = phases.map((phase) => compareObserved(match.flow, match.mouth, r.forager, phase));
const perBout = phases.map((phase) => ({ phase, rows: perBoutObserved(bouts, episodes, match.matched, r.foodTime, phase) }));
const matchedUncensored = match.matched.filter((m) => !m.leftCensored && !m.rightCensored);
const complete = (v: number[]) => summary(v);
const observationChecks = { unmatchedBouts: match.unmatched.length, incompleteEpisodes: match.incomplete.length,
  reversingEpisodes: match.reversing.length, lostScans: observed.reduce((s, p) => s + p.lostScans, 0) };
let recorderIdentity: boolean | null = null;
if (flag('--verify-recorder')) {
  const control = runColony(P, o);
  assert.deepEqual(r.bouts, control.bouts, 'recorder changed flow bouts');
  assert.deepEqual(r.forager, control.forager, 'recorder changed forager identities');
  const caches = new Set(['headX', 'headY', 'headKeyX', 'headKeyY', 'headKeyH']);
  const state = (x: typeof r) => JSON.stringify(x.world.ants.map((a) => ({ body: a.body, mind: a.mind, inactive: a.inactive })),
    (key, value) => caches.has(key) ? undefined : value);
  // Derived geometry caches can legitimately be refreshed by a read. All
  // remaining body/mind fields, including RNG state, must be identical.
  assert.equal(state(r), state(control), 'recorder changed body or mind state');
  assert.deepEqual(r.world.entityTotals(), control.world.entityTotals(), 'recorder changed conserved quantities');
  recorderIdentity = true;
}
const observedPerBout = perBout.flatMap((p) => p.rows);
const result = {
  provenance, inputs: { parameters: P, options: o, index, phases, observer: { period: 60, minContact: 5, rule: 'after', scans: 61, foodMinute: 30 },
    geometry: 'post-step in-nest mouthContact, uninterrupted, sampled at dt; no gap merging',
    direction: 'only one flow direction in the whole mouth episode; no-flow, reversing or incomplete episodes excluded and counted',
    duration: 'raw mouth episode minus flow bout; observed occupied scan bins = scan count * 60 s; event span = (last - first scan minute) * 60 s' },
  runtime: { simulationSeconds, totalSeconds: (performance.now() - t0) / 1000 },
  observationChecks, recorderIdentity,
  counts: { flowBouts: bouts.length, matchedBouts: match.matched.length, uniqueMatchedMouthEpisodes: new Set(match.matched.map((m) => m.episode)).size,
    directionIdentifiableEpisodes: match.mouth.length, noFlowMouthEpisodes: match.noFlow.length, uncensoredBouts: matchedUncensored.length,
    leftCensoredBouts: match.matched.filter((m) => m.leftCensored).length, rightCensoredBouts: match.matched.filter((m) => m.rightCensored).length },
  rawSeconds: { flow: complete(match.matched.map((m) => m.flow)), mouth: complete(match.matched.map((m) => m.mouth)),
    pre: complete(match.matched.map((m) => m.pre)), post: complete(match.matched.map((m) => m.post)),
    padding: complete(match.matched.map((m) => m.padding)), uncensoredPadding: complete(matchedUncensored.map((m) => m.padding)),
    nonFlowPerUniqueDirectedEpisode: complete(match.nonFlow) },
  observedSummary: { occupiedBinDifferenceSeconds: summary(observedPerBout.map((p) => p.occupiedBinDifferenceSeconds)),
    boutPhasePairs: observedPerBout.length, extraSeenBoutPhasePairs: observedPerBout.filter((p) => p.flowScans === 0 && p.mouthScans > 0).length,
    alteredBoutPhasePairs: observedPerBout.filter((p) => p.flowScans !== p.mouthScans).length,
    eventDifference: summary(observed.map((p) => p.eventDifference)),
    flowEventSpanSeconds: summary(observed.flatMap((p) => p.flowSpanSeconds)), mouthEventSpanSeconds: summary(observed.flatMap((p) => p.mouthSpanSeconds)) },
  observed, perBout, matched: match.matched, unmatched: match.unmatched, reversing: match.reversing, incomplete: match.incomplete,
};
const current = stamp(ITEM);
assert.equal(current.simHash, provenance.simHash, 'simulation inputs changed during the run');
assert.deepEqual(current.depends, provenance.depends, 'audit dependencies changed during the run');
const out = path.resolve(arg('--out', path.join(ITEM, 'results', `colony-${index}.json`)));
assert(out.startsWith(ITEM + path.sep), 'output must stay inside B011');
fs.mkdirSync(path.dirname(out), { recursive: true });
writeJson(out, result);
console.log(JSON.stringify({ out, seed, runtime: result.runtime, counts: result.counts, observationChecks,
  recorderIdentity, rawSeconds: result.rawSeconds, observedSummary: result.observedSummary }, null, 2));
