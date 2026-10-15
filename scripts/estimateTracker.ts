/**
 * The Stroeymeyt detection tracker per fit colony and role from the
 * detection counts of `trackerData.ts` (even hours; STATUS 2026-10-15,
 * frozen 2026-10-15 late evening). `--check` (default) compares with the
 * frozen file and writes nothing; `--write` replaces its `colonies` and
 * keeps its `meta`.
 *   npx vite-node scripts/estimateTracker.ts [--data logs/tracker-data.json] [--check | --write]
 */
import fs from 'node:fs';
import type { AntBlock } from '../src/sim/analysis/detectionStats';
import { estimateTracker, pooledHazard } from '../src/sim/analysis/detectionEstimate';
import type { DetectionTracker } from '../src/sim/analysis/detection';
import { arg, readJson, writeJson } from './lib';
import { S2018_TRACKER } from './s2018Lib';

const data = readJson<Record<string, { nurses: AntBlock[][]; foragers: AntBlock[][] }>>(arg('--data', 'logs/tracker-data.json'));
const out: Record<string, Record<string, DetectionTracker>> = {};
for (const role of ['nurses', 'foragers'] as const) {
  const pooled = pooledHazard(Object.values(data).flatMap((c) => c[role]), 0);
  for (const [label, c] of Object.entries(data)) {
    if (!c[role].length) continue;
    (out[label] ??= {})[role.slice(0, -1)] = estimateTracker(c[role], pooled, 0);
  }
}

const frozen = JSON.parse(fs.readFileSync(S2018_TRACKER, 'utf8'));
if (process.argv.includes('--write')) {
  writeJson(S2018_TRACKER, { meta: frozen.meta, colonies: out });
  console.log(`wrote ${S2018_TRACKER}`);
} else {
  // Largest relative difference over every number, and any structural difference.
  let worst = 0;
  let where = '';
  const cmp = (a: unknown, b: unknown, path: string) => {
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) throw new Error(`${path}: length ${a.length} vs ${b.length}`);
      a.forEach((x, i) => cmp(x, b[i], `${path}[${i}]`));
    } else if (typeof a === 'number' && typeof b === 'number') {
      const d = a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b));
      if (d > worst) [worst, where] = [d, path];
    } else if (a && b && typeof a === 'object' && typeof b === 'object') {
      const ka = Object.keys(a).sort();
      const kb = Object.keys(b).sort();
      if (ka.join() !== kb.join()) throw new Error(`${path}: keys ${ka} vs ${kb}`);
      for (const k of ka) cmp((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], `${path}.${k}`);
    } else throw new Error(`${path}: ${typeof a} vs ${typeof b}`);
  };
  cmp(out, frozen.colonies, 'colonies');
  console.log(`largest relative difference from ${S2018_TRACKER}: ${worst.toExponential(2)}${where ? ` (${where})` : ''}`);
}
