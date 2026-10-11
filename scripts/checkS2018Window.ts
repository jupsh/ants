/**
 * Step 4b checks before the fit (STATUS 2026-10-11, step-4 cost rule), at
 * the start point or a fit (--fit), all 22 fit colonies, by the gate's
 * rule: per fit row, the 90 % bootstrap CI (over colonies) of the mean
 * paired difference inside ±0.5 SE_data (the smaller of the light and dark
 * SEs).
 *
 *   --mode window: one run per colony, warm-up then 12 h observed; the rows
 *     of the first 30 min and 2 h against the full 12 h (prefix windows).
 *   --mode dt: dt 0.1 against 0.05 at --obs (default 1800 s), --reps seeds
 *     per colony.
 *
 *   npx vite-node scripts/checkS2018Window.ts --mode window|dt [--fit f] [--set k=v,...] [--tag t] [--warmup 1200] [--obs 1800] [--reps 2]
 * Trip inputs from data/fits/s2018-trips.json (scripts/calibTrips.ts), or --explore s --outRate r.
 */
import fs from 'node:fs';
import { RNG } from '../src/sim/core/rng';
import { arg, numArg, provenance, seedFor, writeJson } from './lib';
import { SimPool } from './pool';
import { colonyFromData, loadS2018, loadTrips, S2018_START, s2018Params, s2018TargetsFromData, simulateAll } from './s2018Lib';

const MODE = arg('--mode', 'window');
const fit = arg('--fit', '');
// --set k=v,...: overrides of free-parameter values (diagnostics, e.g. a mechanism switched off).
const SET = Object.fromEntries(arg('--set', '').split(',').filter(Boolean).map((kv) => [kv.split('=')[0], Number(kv.split('=')[1])]));
const values = { ...(fit ? JSON.parse(fs.readFileSync(fit, 'utf8')).free : S2018_START), ...SET };
// Trip inputs from the calibration, or provisional values given explicitly (--explore, --outRate; disclosed in STATUS).
const trips = arg('--explore', '') ? { exploreGiveUp: numArg('--explore', NaN), outRate: numArg('--outRate', NaN) } : loadTrips();
const outRate = trips.outRate;
const exploreGiveUp = trips.exploreGiveUp;
const P = s2018Params(values, outRate);
const data = loadS2018();
const colonies = data.colonies.map(colonyFromData);
const targets = s2018TargetsFromData();
// One SE per simulated row: the smaller of its light and dark targets.
const se = new Map<string, number>();
for (const t of targets) se.set(t.simId, Math.min(se.get(t.simId) ?? Infinity, t.se));
const WARMUP = numArg('--warmup', 1200);
const pool = await SimPool.create();
const t0 = Date.now();

/** Per row: mean paired difference (a − b) over units, 90 % bootstrap CI, verdict against ±0.5 SE. */
function compare(a: Record<string, number>[], b: Record<string, number>[], label: string) {
  const rng = new RNG(seedFor(2018, 'converge', 0xb007));
  const out: Record<string, unknown>[] = [];
  let fails = 0;
  for (const [id, s] of se) {
    const d = a.map((r, i) => r[id] - b[i][id]).filter(Number.isFinite);
    if (d.length < 5) {
      out.push({ id, n: d.length, verdict: 'missing' });
      fails++;
      continue;
    }
    const mean = d.reduce((x, y) => x + y, 0) / d.length;
    const boots: number[] = [];
    for (let k = 0; k < 2000; k++) {
      let sum = 0;
      for (let j = 0; j < d.length; j++) sum += d[rng.int(d.length)];
      boots.push(sum / d.length);
    }
    boots.sort((x, y) => x - y);
    const lo = boots[100];
    const hi = boots[1899];
    const ok = lo > -0.5 * s && hi < 0.5 * s;
    if (!ok) fails++;
    out.push({ id, n: d.length, meanSe: mean / s, ciSe: [lo / s, hi / s], ok });
    console.log(`  ${label} ${id.padEnd(28)} diff ${(mean / s).toFixed(2).padStart(6)} SE, 90% CI [${(lo / s).toFixed(2)}, ${(hi / s).toFixed(2)}] ${ok ? 'ok' : 'FAIL'}`);
  }
  console.log(`${label}: ${fails} of ${se.size} rows not shown equivalent`);
  return { rows: out, fails };
}

const result: Record<string, unknown> = { mode: MODE, values, outRate, exploreGiveUp, warmup: WARMUP, provenance: provenance() };
if (MODE === 'window') {
  const FULL = 12 * 3600;
  const runs = await simulateAll(pool, P, colonies, { phase: 'light', warmupS: WARMUP, obsS: FULL, dt: 0.1, windows: [1800, 7200], exploreGiveUp }, (i) => seedFor(2018, 'converge', 0x3d, i));
  const full = runs.map((r) => r.rows);
  result.w30 = compare(runs.map((r) => r.windowRows[0]), full, '30 min vs 12 h');
  result.w120 = compare(runs.map((r) => r.windowRows[1]), full, '2 h vs 12 h');
} else if (MODE === 'dt') {
  const REPS = numArg('--reps', 2);
  const OBS = numArg('--obs', 1800);
  const seeds = (i: number) => seedFor(2018, 'converge', 0xd7, i % colonies.length, Math.floor(i / colonies.length));
  const cols = Array.from({ length: REPS }, () => colonies).flat();
  const o = { phase: 'light' as const, warmupS: WARMUP, obsS: OBS, exploreGiveUp };
  const [a, b] = await Promise.all([simulateAll(pool, P, cols, { ...o, dt: 0.1 }, seeds), simulateAll(pool, P, cols, { ...o, dt: 0.05 }, seeds)]);
  result.dt = compare(a.map((r) => r.rows), b.map((r) => r.rows), 'dt 0.1 vs 0.05');
} else throw new Error('--mode window|dt');
result.seconds = (Date.now() - t0) / 1000;
const out = `logs/checkS2018-${MODE}${fit ? '-fit' : ''}${arg('--tag', '') ? `-${arg('--tag', '')}` : ''}.json`;
writeJson(out, result);
console.log(`wrote ${out} (${(result.seconds as number).toFixed(0)} s)`);
pool.close();
