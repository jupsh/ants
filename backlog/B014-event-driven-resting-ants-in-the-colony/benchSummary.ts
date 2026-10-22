/** B014: medians per workload and arm from results/bench.json, and the speed-ups (main / on, off / on, main / off, main-np / on-np), merged back under `summary`. */
import fs from 'node:fs';
import { mergeResult } from './merge';

const file = process.argv[2];
const runs = JSON.parse(fs.readFileSync(file, 'utf8')).workloads as Record<string, { run: { ms: number } }>;
const ms = new Map<string, number[]>();
for (const [name, v] of Object.entries(runs)) {
  const [w, arm] = name.split('|');
  if (!arm) continue;
  const k = `${w}|${arm}`;
  ms.set(k, [...(ms.get(k) ?? []), v.run.ms]);
}
const median = (x: number[]) => [...x].sort((a, b) => a - b)[Math.floor((x.length - 1) / 2)];
const workloads = [...new Set([...ms.keys()].map((k) => k.split('|')[0]))];
const summary = Object.fromEntries(
  workloads.map((w) => {
    const m = (arm: string) => median(ms.get(`${w}|${arm}`) ?? [NaN]);
    const r = (x: number) => +x.toFixed(3);
    const arms = ['main', 'off', 'on', 'main-np', 'on-np'];
    return [w, { msMedian: Object.fromEntries(arms.map((a) => [a, m(a)])), runs: Object.fromEntries(arms.map((a) => [a, ms.get(`${w}|${a}`)])), speedup: { mainOverOn: r(m('main') / m('on')), offOverOn: r(m('off') / m('on')), mainOverOff: r(m('main') / m('off')), mainNpOverOnNp: r(m('main-np') / m('on-np')) } }];
  }),
);
console.log(JSON.stringify(summary, null, 2));
mergeResult(file, 'summary', summary);
