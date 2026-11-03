/** Deterministic controls for interval attribution and the existing observer. */
import assert from 'node:assert/strict';
import { compareObserved, matchBouts, perBoutObserved, summary } from './analyse';

const bouts = [
  { donor: 0, receiver: 1, start: 65, end: 70, ul: 1 },
  { donor: 0, receiver: 1, start: 115, end: 130, ul: 1 },
];
const mouths = [{ a: 0, b: 1, start: 50, end: 135 }];
const m = matchBouts(bouts, mouths, 0, 200);
assert.deepEqual(m.matched.map((r) => [r.pre, r.post, r.padding]), [[15, 65, 80], [65, 5, 70]]);
assert.equal(m.flow.length, 2);
assert.equal(m.mouth.length, 1, 'one mouth episode must not be counted once per flow bout');
assert.deepEqual(m.nonFlow, [65]);
const p = perBoutObserved(bouts, mouths, m.matched, 0, 0);
assert.deepEqual(p.map((r) => [r.flowScans, r.mouthScans, r.occupiedBinDifferenceSeconds]), [[0, 2, 120], [1, 2, 60]]);
const observed = compareObserved(m.flow, m.mouth, [true, false], 0);
assert.equal(observed.flowEvents, 1);
assert.equal(observed.mouthEvents, 1);
assert.equal(observed.addedScans, 1);
assert.equal(observed.lostScans, 0);
assert.deepEqual(observed.mouthSpanSeconds, [60]);
const reversed = matchBouts([bouts[0], { ...bouts[1], donor: 1, receiver: 0 }], mouths, 0, 200);
assert.deepEqual(reversed.reversing, [0]);
assert.equal(reversed.mouth.length, 0, 'do not invent a direction for a reversing mouth episode');
assert.equal(reversed.matched.length, 2, 'retain raw per-bout measurements despite direction ambiguity');
const unmatched = matchBouts([{ ...bouts[0], start: 40 }], mouths, 0, 200);
assert.deepEqual(unmatched.unmatched, [0]);
assert.deepEqual(unmatched.incomplete, [0]);
assert.equal(unmatched.mouth.length, 0);
const noFlow = matchBouts([], mouths, 0, 200);
assert.deepEqual(noFlow.noFlow, [0]);
assert.equal(noFlow.mouth.length, 0, 'incidental mouth geometry supplies no donor identity');
const identity = compareObserved(m.flow, m.flow, [true, false], 0);
assert.equal(identity.addedScans + identity.lostScans + identity.eventDifference, 0);
const splitFlow = [{ donor: 0, receiver: 1, start: 50, end: 70 }, { donor: 0, receiver: 1, start: 230, end: 250 }];
const joinedMouth = [{ donor: 0, receiver: 1, start: 50, end: 250 }];
assert.equal(compareObserved(splitFlow, joinedMouth, [true, false], 0).eventDifference, -1,
  'extra mouth scans can merge flow events and lower event counts');
assert.equal(summary([]).mean, null);
assert.equal(summary([0, 60, 120]).atLeast60, 2);
console.log('B011 controls passed: padding, deduplication, strict >5-s threshold, scan boundaries, direction reversal, missing coverage, no-flow ambiguity, identity and event coalescing.');
