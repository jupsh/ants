/**
 * Step 4b checks before the fit (STATUS 2026-10-11, step-4 cost rule), at
 * the start point or a fit (--fit), all 22 fit colonies, by the gate's
 * rule: per fit row, the 90 % bootstrap CI (over colonies) of the mean
 * paired difference inside ±0.5 SE_data (the smaller of the light and dark
 * SEs).
 *
 *   --mode window: --reps runs per colony (default 1), warm-up then 12 h observed; the rows
 *     of the first 30 min and 2 h against the full 12 h (prefix windows).
 *   --mode dt: dt 0.1 against 0.05 (--dts a,b) at --obs (default 1800 s), --reps seeds
 *     per colony.
 *
 *   --candidate C2 (STATUS 2026-10-18): C2's model and its 36 rows. Window mode: the 32 motion rows as above; the
 *     four activity rows keep their 6-h definition, comparing the 6-h window right after the warm-up with the
 *     next 6 h of the same run (equivalent windows at different elapsed times). Dt mode: the activity rows only
 *     when --obs ≥ 6 h (each run's first 6 h); with a shorter --obs only the motion rows are compared.
 *
 *   npx vite-node scripts/checkS2018Window.ts --mode window|dt [--candidate C1|C2] [--fit f] [--set k=v,...] [--tag t] [--warmup 1200] [--dt 0.1] [--windows 1800,7200] (window) [--obs 1800] [--reps 2] [--only motion|activity]
 * Trip inputs from data/fits/s2018-trips.json (scripts/calibTrips.ts), or --explore s --outRate r.
 */
import fs from 'node:fs';
import { RNG } from '../src/sim/core/rng';
import { arg, numArg, provenance, seedFor, writeJson } from './lib';
import { SimPool } from './pool';
import { S2018_ACTIVITY_ROWS } from '../src/sim/experiments/stroeymeytTargets';
import { C2_DRIVE_START, colonyFromData, loadS2018, loadTrips, S2018_START, s2018Params, s2018TargetsFor, simulateAll } from './s2018Lib';

const MODE = arg('--mode', 'window');
const CAND = arg('--candidate', 'C1') as 'C1' | 'C2';
if (CAND !== 'C1' && CAND !== 'C2') throw new Error(`--candidate ${CAND}: C1 or C2`);
const C2 = CAND === 'C2';
const ONLY = arg('--only', '');
const fit = arg('--fit', '');
// --set k=v,...: overrides of free-parameter values (diagnostics, e.g. a mechanism switched off).
const SET = Object.fromEntries(arg('--set', '').split(',').filter(Boolean).map((kv) => [kv.split('=')[0], Number(kv.split('=')[1])]));
// C2's gate point without --fit: start 0 (C1's start with the drive SD 1.0 per role).
const values = { ...(fit ? JSON.parse(fs.readFileSync(fit, 'utf8')).free : C2 ? { ...S2018_START, ...C2_DRIVE_START[0] } : S2018_START), ...SET };
// Trip inputs from the calibration, or provisional values given explicitly (--explore, --outRate; disclosed in STATUS).
const trips = arg('--explore', '') ? { exploreGiveUp: numArg('--explore', NaN), exploreGiveUpSd: numArg('--exploreSd', 0), outRate: numArg('--outRate', NaN) } : loadTrips();
const outRate = trips.outRate;
const exploreGiveUp = trips.exploreGiveUp;
const exploreGiveUpSd = trips.exploreGiveUpSd;
const P = s2018Params(values, outRate, CAND);
const data = loadS2018();
const colonies = data.colonies.map((c) => colonyFromData(c));
const targets = s2018TargetsFor(CAND);
const isAct = (id: string) => S2018_ACTIVITY_ROWS.includes(id);
// One SE per simulated row: the smaller of its light and dark targets.
const se = new Map<string, number>();
for (const t of targets) se.set(t.simId, Math.min(se.get(t.simId) ?? Infinity, t.se));
const WARMUP = numArg('--warmup', 1200);
const WDT = numArg('--dt', 0.1); // window mode only
const WINDOWS = (arg('--windows', '1800,7200') as string).split(',').map(Number); // window mode: prefix lengths, s
const pool = await SimPool.create();
const t0 = Date.now();

/** Per row: mean paired difference (a − b) over units, 90 % bootstrap CI, verdict against ±0.5 SE. */
/** Colony of each run (runs are colonies × reps in data order). */
const labelOf = (i: number) => colonies[i % colonies.length].label;
// Colony sets per simulated row (STATUS 2026-10-18 colony-set correction): the target's data colonies (light target for motion rows).
const setOf = new Map<string, Set<string>>();
for (const t of targets) if (!setOf.has(t.simId) || t.id.endsWith('.light')) setOf.set(t.simId, new Set(t.colonies));

function compare(a: Record<string, number>[], b: Record<string, number>[], label: string, ids: (id: string) => boolean = () => true) {
  const rng = new RNG(seedFor(2018, 'converge', 0xb007));
  const out: Record<string, unknown>[] = [];
  let fails = 0;
  let compared = 0;
  for (const [id, s] of se) {
    if (!ids(id)) continue;
    compared++;
    // Runs of the row's data colonies only; a missing value on either side is listed and the row is not passed.
    const set = setOf.get(id)!;
    const units = a.map((_, i) => i).filter((i) => set.has(labelOf(i)));
    const miss = units.filter((i) => !Number.isFinite(a[i][id]) || !Number.isFinite(b[i][id])).map((i) => `${labelOf(i)} (run ${i})`);
    const d = units.filter((i) => Number.isFinite(a[i][id]) && Number.isFinite(b[i][id])).map((i) => a[i][id] - b[i][id]);
    if (miss.length || d.length < 5) {
      out.push({ id, n: d.length, verdict: 'missing', missing: miss });
      console.log(`  ${label} ${id.padEnd(28)} MISSING values on the colony set: ${miss.join(', ') || `only ${d.length} pairs`}`);
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
  console.log(`${label}: ${fails} of ${compared} rows not shown equivalent`);
  return { rows: out, fails };
}

const result: Record<string, unknown> = { mode: MODE, candidate: CAND, values, outRate, exploreGiveUp, exploreGiveUpSd, warmup: WARMUP, dt: MODE === 'window' ? WDT : undefined, provenance: provenance() };
if (MODE === 'window') {
  const FULL = 12 * 3600;
  // --reps r: r runs per colony (STATUS 2026-10-16); rep 0 keeps the original seeds, later reps add the rep as a key.
  const REPS = numArg('--reps', 1);
  const n = colonies.length;
  const cols = Array.from({ length: REPS }, () => colonies).flat();
  const seedOf = (i: number) => (i < n ? seedFor(2018, 'converge', 0x3d, i) : seedFor(2018, 'converge', 0x3d, i % n, Math.floor(i / n)));
  const runs = await simulateAll(pool, P, cols, { phase: 'light', warmupS: WARMUP, obsS: FULL, dt: WDT, windows: WINDOWS, exploreGiveUp, exploreGiveUpSd, ...(C2 ? { activityHours: [0, 6] } : {}) }, seedOf);
  result.reps = REPS;
  result.fullRows = runs.map((r) => r.rows);
  result.windowRows = runs.map((r) => r.windowRows);
  const full = runs.map((r) => r.rows);
  WINDOWS.forEach((w, k) => {
    const label = w < 3600 ? `${w / 60} min` : `${w / 3600} h`;
    result[`w${w / 60}`] = compare(runs.map((r) => r.windowRows[k]), full, `${label} vs 12 h`, (id) => !isAct(id));
  });
  // C2's activity rows: the 6-h window right after the warm-up vs the next 6 h (never a 12-h or other-lag version).
  if (C2) {
    result.activityWindowRows = runs.map((r) => r.activityWindowRows);
    result.activity = compare(runs.map((r) => r.activityWindowRows[0]), runs.map((r) => r.activityWindowRows[1]), 'activity 6 h after warm-up vs the next 6 h', isAct);
  }
} else if (MODE === 'dt') {
  const REPS = numArg('--reps', 2);
  const OBS = numArg('--obs', 1800);
  const seeds = (i: number) => seedFor(2018, 'converge', 0xd7, i % colonies.length, Math.floor(i / colonies.length));
  const cols = Array.from({ length: REPS }, () => colonies).flat();
  const withAct = C2 && OBS >= 6 * 3600;
  const o = { phase: 'light' as const, warmupS: WARMUP, obsS: OBS, exploreGiveUp, exploreGiveUpSd, ...(withAct ? { activityHours: [0] } : {}) };
  const rowsIn = (id: string) => (isAct(id) ? withAct && ONLY !== 'motion' : ONLY !== 'activity');
  // --dts coarse,fine (default 0.1,0.05; then 0.05,0.025 if the first fails, as the gate's order).
  const [d1, d2] = arg('--dts', '0.1,0.05').split(',').map(Number);
  const [a, b] = await Promise.all([simulateAll(pool, P, cols, { ...o, dt: d1 }, seeds), simulateAll(pool, P, cols, { ...o, dt: d2 }, seeds)]);
  result.dts = [d1, d2];
  // Raw rows kept, so the comparison can be re-aggregated.
  result.rowsA = a.map((r) => r.rows);
  result.rowsB = b.map((r) => r.rows);
  result.dt = compare(a.map((r) => r.rows), b.map((r) => r.rows), `dt ${d1} vs ${d2}`, rowsIn);
} else throw new Error('--mode window|dt');
result.seconds = (Date.now() - t0) / 1000;
const out = `logs/checkS2018-${MODE}${C2 ? '-c2' : ''}${fit ? '-fit' : ''}${arg('--tag', '') ? `-${arg('--tag', '')}` : ''}.json`;
writeJson(out, result);
console.log(`wrote ${out} (${(result.seconds as number).toFixed(0)} s)`);
pool.close();
