// Scratch (not committed): Part D Part 2 item 1(b), per-colony run (D212 as amended by its amendment 1, D213; T035).
// Streams each listed fit colony's PreTreatment tracks once with `streamColony` (one colony at a time), runs
// `ColonyTriggers`, writes <out>/<colony>.json, and prints only the self-check, counts, run time and peak RSS (no
// event-aligned value).
//   npx vite-node scripts/scratch/triggers.ts --colonies colony265,colony224 --out logs/partd2/triggers-smoke
//   npx vite-node scripts/scratch/triggers.ts --colonies all --out logs/partd2/triggers [--skip-existing]
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { arg, flag, writeJson } from '../lib';
import { colonies, roles, streamColony } from '../stroeymeytTracks';
import { ColonyTriggers } from './triggersCore';
import { DESIGN, md5s } from './triggersStats';

const commit = (): string => { try { return execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { return 'unknown'; } };

const out = arg('--out', 'logs/partd2/triggers');
const list = arg('--colonies', '');
if (!list) throw new Error('--colonies a,b,… or all');
const all = colonies();
const chosen = list === 'all' ? all : list.split(',').map((l) => {
  const c = all.find((x) => x.label === l) ?? all[Number(l)];
  if (!c) throw new Error(`unknown colony ${l}`);
  return c;
});
const meta = { design: DESIGN, md5: md5s(), command: `npx vite-node scripts/scratch/triggers.ts ${process.argv.slice(2).join(' ')}`, commit: commit(), node: process.version };
const t00 = Date.now();
for (const col of chosen) {
  const path = `${out}/${col.label}.json`;
  if (flag('--skip-existing') && fs.existsSync(path)) { console.log(`${col.label}: exists, skipped`); continue; }
  const t0 = Date.now();
  const roleOf = roles(col);
  const tags = [...roleOf.keys()];
  const index = new Map(tags.map((t, i) => [t, i]));
  const ct = new ColonyTriggers(col.label, tags.map((t) => roleOf.get(t)), tags);
  const stream = await streamColony(col, index, (f, t, ids, xs, ys, ins) => ct.frame(f, t, ids, xs, ys, ins));
  const res = ct.finish();
  const sec = (Date.now() - t0) / 1000;
  writeJson(path, { meta: { ...meta, date: new Date().toISOString(), runSeconds: sec }, stream, ...res });
  // Printed: self-check first, then counts only.
  const sc = res.selfCheck;
  console.log(`${col.label} self-check ${sc.equal ? 'PASS' : 'FAIL'}: light mv ${sc.triggers.light.mv}/${sc.activitySeries.light.mv} st ${sc.triggers.light.st}/${sc.activitySeries.light.st}; dark mv ${sc.triggers.dark.mv}/${sc.activitySeries.dark.mv} st ${sc.triggers.dark.st}/${sc.activitySeries.dark.st} (triggers/ActivitySeries)`);
  console.log(`${col.label} ants: ${res.ants.nurse} nurses, ${res.ants.forager} foragers, ${res.ants.queen} queen; frames ${stream.frames}, reordered ${stream.reordered}, late ${stream.late}; blocks ${res.blocks.map((b) => `${b.key}${b.phase[0]}`).join(' ')}; t regressions ${res.tRegress}`);
  for (const s of res.settings) {
    if (!['forager', 'queen', 'forager-ctrl5min', 'queen-ctrl5min'].includes(s.name)) continue; // primary, then the amendment 2 rows (counts only)
    const c = s.counts;
    console.log(`${col.label} ${s.name}: found ${c.found}, dropped edge ${c.edge}, gap ${c.gap}, empty ${c.empty}, unmatched ${c.unmatched}, matched ${c.matched} (controls 1-5: ${c.nCtrl.slice(1).join(' ')}), contributing ${c.matched >= 10 ? 'yes' : 'no'}`);
  }
  const rss = process.resourceUsage().maxRSS / 1024;
  console.log(`${col.label} time ${sec.toFixed(1)} s, peak RSS so far ${rss.toFixed(0)} MB`);
}
console.log(`total ${((Date.now() - t00) / 1000).toFixed(1)} s, peak RSS ${(process.resourceUsage().maxRSS / 1024).toFixed(0)} MB`);
