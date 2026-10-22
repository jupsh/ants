/**
 * B014: self time per function (and per source file) from a V8 .cpuprofile; with `--out f --name k`, also merges
 * the top functions (share of sampled time) into results file f under workload k. Run from the repository root:
 *   npx vite-node backlog/B014-event-driven-resting-ants-in-the-colony/sumProfile.ts <file.cpuprofile> [--top 30] [--out f --name k]
 */
import fs from 'node:fs';
import { arg, numArg } from '../../scripts/lib';
import { mergeResult } from './merge';

interface Node {
  id: number;
  callFrame: { functionName: string; url: string; lineNumber: number };
}

const file = process.argv[2];
const top = numArg('--top', 30);
const prof = JSON.parse(fs.readFileSync(file, 'utf8')) as { nodes: Node[]; samples: number[]; timeDeltas: number[] };
const byId = new Map(prof.nodes.map((n) => [n.id, n]));
const fn = new Map<string, number>();
const files = new Map<string, number>();
let total = 0;
prof.samples.forEach((id, k) => {
  const cf = byId.get(id)!.callFrame;
  const us = prof.timeDeltas[k] ?? 0;
  // Transpiled line numbers (vite-node), not source lines.
  const src = cf.url.split('/').slice(-2).join('/') || '(native)';
  const key = `${cf.functionName || '(anonymous)'}  ${src}:${cf.lineNumber + 1}`;
  fn.set(key, (fn.get(key) ?? 0) + us);
  files.set(src, (files.get(src) ?? 0) + us);
  total += us;
});
const sorted = (m: Map<string, number>, n: number) => [...m].sort((a, b) => b[1] - a[1]).slice(0, n);
const show = (m: Map<string, number>, n: number) => sorted(m, n).map(([k, us]) => `${((100 * us) / total).toFixed(1).padStart(5)} %  ${(us / 1e3).toFixed(0).padStart(6)} ms  ${k}`).join('\n');
console.log(`total ${(total / 1e6).toFixed(2)} s\n\n-- functions --\n${show(fn, top)}\n\n-- files --\n${show(files, 15)}`);
const out = arg('--out', '');
if (out) {
  const share = (m: Map<string, number>, n: number) => Object.fromEntries(sorted(m, n).map(([k, us]) => [k, +((100 * us) / total).toFixed(2)]));
  mergeResult(out, arg('--name', 'unnamed'), { profile: { file: file.split('/').slice(-2).join('/'), sampledS: +(total / 1e6).toFixed(2), topFunctionsPct: share(fn, top), filesPct: share(files, 15) } });
}
