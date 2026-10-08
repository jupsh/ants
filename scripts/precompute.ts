/**
 * Precompute the pages' results for their default settings, so each page
 * shows a result at once (src/ui/precomputed.ts); "Run" still simulates live.
 * Writes public/precomputed/*.json (not committed; `npm run build` runs this
 * first, so a deployed site always matches its code). Each file carries the
 * request and the simulation hash (scripts/simHash.ts); a page ignores a file
 * that does not match.
 *
 * Usage: npx vite-node scripts/precompute.ts   (or npm run precompute)
 */
import fs from 'node:fs';
import zlib from 'node:zlib';
import { precomputedKey } from '../src/ui/precomputed';
import { COLONY_DEFAULTS, E1_DEFAULTS, E2_DEFAULTS, E2_CONDITIONS, E6_DEFAULTS } from '../src/ui/pageDefaults';
import { colonyToJson, computeColony } from '../src/worker/colonyCompute';
import { computeE1, e1Data, e1Request } from '../src/worker/e1Compute';
import { computeE2Table, computeE2Trips } from '../src/worker/e2Compute';
import { computeE6, E6_MODELS } from '../src/worker/e6Compute';
import { simHash } from './simHash';

const OUT = 'public/precomputed';
const sim = simHash();
// Overwrite in place and remove only stale files at the end: deleting the
// folder makes a running dev server stop serving it (Vite's public-file watch).
fs.mkdirSync(OUT, { recursive: true });
const written = new Set<string>();
/** Six significant digits are far below anything the pages display. */
const round = (_: string, v: unknown) => (typeof v === 'number' && !Number.isInteger(v) ? Number(v.toPrecision(6)) : ArrayBuffer.isView(v) ? Array.from(v as unknown as ArrayLike<number>) : v);
const write = (name: string, req: unknown, result: unknown) => {
  const file = `${OUT}/${name}.json`;
  written.add(`${name}.json`);
  fs.writeFileSync(file, JSON.stringify({ key: precomputedKey(req, sim), result }, round));
  console.log(`${file}: ${(fs.statSync(file).size / 1e6).toFixed(1)} MB`);
};
const t0 = performance.now();

for (let i = 0; i < 5; i++) {
  const req = e1Request(i, E1_DEFAULTS.ants, E1_DEFAULTS.seed);
  const data = e1Data(zlib.gunzipSync(fs.readFileSync(`data/khuong2013/incline${i + 1}.csv.gz`)).toString('utf8'));
  write(`e1-${i}`, req, computeE1(req, data));
}

const t2 = performance.now();
const table = computeE2Table(E2_DEFAULTS.scouts, E2_DEFAULTS.seed);
const tableMs = performance.now() - t2;
for (const c of E2_CONDITIONS) {
  const req = { scouts: E2_DEFAULTS.scouts, seed: E2_DEFAULTS.seed, showCondition: c.id };
  const t = performance.now();
  write(`e2-${c.id}`, req, { ...table, trips: computeE2Trips(req.seed, c.id), ms: tableMs + performance.now() - t });
}

for (const m of E6_MODELS) {
  const req = { params: m.params(), colonies: E6_DEFAULTS.colonies, seed: E6_DEFAULTS.seed };
  write(`e6-${m.id}`, req, computeE6(req));
}
// Colony (provisional): typed arrays as base64, not rounded.
{
  const req = { ...COLONY_DEFAULTS };
  const file = `${OUT}/colony.json`;
  written.add('colony.json');
  fs.writeFileSync(file, JSON.stringify({ key: precomputedKey(req, sim), result: colonyToJson(computeColony(req)) }));
  console.log(`${file}: ${(fs.statSync(file).size / 1e6).toFixed(1)} MB`);
}
for (const f of fs.readdirSync(OUT)) if (!written.has(f)) fs.rmSync(`${OUT}/${f}`);
console.log(`precomputed in ${((performance.now() - t0) / 1000).toFixed(0)} s (simulation hash ${sim})`);
