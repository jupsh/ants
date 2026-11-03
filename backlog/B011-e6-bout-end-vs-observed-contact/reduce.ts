/** Preserve detailed local output in out/; emit a small, stamped results file. */
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson, writeJson } from '../../scripts/lib';
import { hashPaths, stamp } from '../_lib/stamp';
import { summary } from './analyse';

const ITEM = path.dirname(fileURLToPath(import.meta.url));
const provenance = stamp(ITEM);
const sources = [0, 1, 2].map((i) => {
  const small = path.join(ITEM, 'results', `colony-${i}.json`);
  const detailed = path.join(ITEM, 'out', `colony-${i}.json`);
  const file = fs.existsSync(small) ? small : detailed;
  const data = readJson<any>(file);
  assert.equal(data.inputs.index, i);
  assert.equal(data.provenance.simHash, provenance.simHash, 'source simulation inputs are stale');
  assert.deepEqual(data.provenance.depends, hashPaths(Object.keys(data.provenance.depends)), 'source method inputs are stale');
  const sha256 = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  return { file, detailed, data, sha256 };
});
assert.equal(sources[0].data.recorderIdentity, true, 'missing successful recorder-neutrality control');
const matched = sources.flatMap((s) => s.data.matched);
const byPhase = sources.flatMap((s) => s.data.observed);
const boutPhases = sources.flatMap((s) => s.data.perBout.flatMap((p: any) => p.rows));
const hist = (values: number[]) => {
  const counts = new Map<number, number>();
  for (const v of values) {
    const rounded = Math.round(v * 1e6) / 1e6;
    counts.set(rounded, (counts.get(rounded) ?? 0) + 1);
  }
  return [...counts].sort(([a], [b]) => a - b).map(([seconds, count]) => ({ seconds, count }));
};
const sum = (key: string) => sources.reduce((n, s) => n + s.data.counts[key], 0);
const result = {
  provenance,
  method: 'Three diagnostic colonies; 20 paired random phases per colony. Pooled bout summaries are descriptive; phases reuse the same colony and are not independent colony replicates.',
  counts: { colonies: sources.length, colonyPhases: byPhase.length, flowBouts: sum('flowBouts'), matchedBouts: sum('matchedBouts'),
    uncensoredBouts: sum('uncensoredBouts'), noFlowMouthEpisodes: sum('noFlowMouthEpisodes'), boutPhasePairs: boutPhases.length,
    alteredBoutPhasePairs: boutPhases.filter((p: any) => p.flowScans !== p.mouthScans).length,
    alteredColonyPhases: byPhase.filter((p: any) => p.addedScans || p.lostScans).length },
  pooledRawSeconds: Object.fromEntries(['flow', 'mouth', 'pre', 'post', 'padding'].map((k) => [k, summary(matched.map((m: any) => m[k]))])),
  rawPaddingHistogram: hist(matched.map((m: any) => m.padding)),
  observedBinDifferenceHistogram: hist(boutPhases.map((p: any) => p.occupiedBinDifferenceSeconds)),
  eventDifference: summary(byPhase.map((p: any) => p.eventDifference)),
  changedCases: sources.flatMap((s) => s.data.perBout.flatMap((p: any) => p.rows.filter((r: any) => r.flowScans !== r.mouthScans)
    .map((r: any) => ({ index: s.data.inputs.index, phase: p.phase, ...r, raw: s.data.matched.find((m: any) => m.bout === r.bout) })))),
  colonies: sources.map((s) => ({ ...Object.fromEntries(Object.entries(s.data).filter(([key]) => !['matched', 'perBout'].includes(key))),
    details: path.relative(ITEM, s.detailed), detailsSha256: s.sha256 })),
};
// Only move source files after every input has passed the provenance checks.
fs.mkdirSync(path.join(ITEM, 'out'), { recursive: true });
for (const s of sources) if (s.file !== s.detailed) {
  assert(!fs.existsSync(s.detailed), `refusing to overwrite ${s.detailed}`);
  fs.renameSync(s.file, s.detailed);
}
writeJson(path.join(ITEM, 'results', 'summary.json'), result);
console.log(JSON.stringify({ counts: result.counts, pooledRawSeconds: result.pooledRawSeconds,
  rawPaddingHistogram: result.rawPaddingHistogram, observedBinDifferenceHistogram: result.observedBinDifferenceHistogram,
  eventDifference: result.eventDifference, changedCases: result.changedCases }, null, 2));
