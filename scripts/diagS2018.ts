/**
 * Step-4b diagnosis (STATUS 2026-10-14): where the Stroeymeyt 2018 loss
 * sits at one parameter point. Simulates all 22 fit colonies at the fit's
 * settings and prints every row's data (light, dark), simulated mean and
 * spread across colonies, z per phase and its share of the loss, largest
 * first. The point comes from a fitS2018 checkpoint (`--at mean`, the CMA-ES
 * mean; `--at best`, its best single evaluation) or `--at start`.
 * Seeds use their own purpose ('diag'), never the fit's, selection's or
 * judging's.
 *
 *   npx vite-node scripts/diagS2018.ts [--ckpt f] [--at mean|best|start]
 *     [--dt 0.05] [--warmup 7200] [--obs 21600] [--reps 1] [--out f]
 */
import fs from 'node:fs';
import { S2018_FREE, s2018AtBound, s2018Loss } from '../src/sim/experiments/stroeymeytTargets';
import { arg, numArg, provenance, seedFor, writeJson } from './lib';
import { SimPool } from './pool';
import { colonyFromData, loadS2018, loadTrips, S2018_START, s2018Params, s2018TargetsFromData, simulateAll } from './s2018Lib';

const CKPT = arg('--ckpt', 'logs/box-2026-10-15/logs/fitS2018-s0.ckpt.json');
const AT = arg('--at', 'mean');
const DT = numArg('--dt', 0.05);
const WARMUP = numArg('--warmup', 7200);
const OBS = numArg('--obs', 21600);
const REPS = numArg('--reps', 1);
const OUT = arg('--out', `logs/diagS2018-${AT}.json`);
// Box and decoding as in fitS2018.ts.
const BOX = 4;

const ofUnit = (u: number, lo: number, hi: number, log: boolean) => (log ? lo * (hi / lo) ** u : lo + (hi - lo) * u);
const decode = (x: number[]) => Object.fromEntries(S2018_FREE.map((f, i) => [f.key, ofUnit(Math.min(1, Math.max(0, x[i] / BOX)), f.lo, f.hi, f.log)]));

let values: Record<string, number>;
let source: string;
if (AT === 'start') {
  values = S2018_START;
  source = 'S2018_START';
} else {
  const c = JSON.parse(fs.readFileSync(CKPT, 'utf8'));
  const cma = c.state.current?.cma;
  if (!cma) throw new Error(`${CKPT}: no CMA-ES state`);
  const x = AT === 'best' ? cma.best.x : cma.m;
  values = decode(x);
  source = `${CKPT} (${AT}, generation ${cma.generation}, simHash ${c.key.simHash}${AT === 'best' ? `, logged f ${cma.best.f.toFixed(1)}` : ''})`;
}

const { outRate, exploreGiveUp } = loadTrips();
const colonies = loadS2018().colonies.map(colonyFromData);
const targets = s2018TargetsFromData();
const P = s2018Params(values, outRate);
const pool = await SimPool.create();
const t0 = Date.now();
console.log(`diagS2018 at ${source}`);
console.log(Object.entries(values).map(([k, v]) => `${k} ${v.toPrecision(3)}`).join(', '));
const atBound = s2018AtBound(P.nest);
if (atBound.length) console.log(`at a bound: ${atBound.join(', ')}`);
console.log(`${colonies.length} colonies × ${REPS}, window ${WARMUP} + ${OBS} s, dt ${DT}, ${pool.size} workers`);

const cols = Array.from({ length: REPS }, () => colonies).flat();
const runs = await simulateAll(pool, P, cols, { phase: 'light', warmupS: WARMUP, obsS: OBS, dt: DT, exploreGiveUp }, (i) => seedFor(2018, 'diag', 0xd1a9, i));
pool.close();
const sims = runs.map((r) => r.rows);
const loss = s2018Loss(sims, targets);

// Per simulated row: both phases' data against one simulated mean (the model has no phase dependence).
const bySim = new Map<string, typeof targets>();
for (const t of targets) bySim.set(t.simId, [...(bySim.get(t.simId) ?? []), t]);
const rows = [...bySim].map(([simId, ts]) => {
  const v = sims.map((r) => r[simId]).filter(Number.isFinite);
  const m = v.reduce((a, b) => a + b, 0) / v.length;
  const sd = Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / (v.length - 1));
  const z = ts.map((t) => (m - t.mean) / t.se);
  const part = ts.reduce((a, t) => a + ((m - t.mean) ** 2 - sd ** 2 / v.length) / t.se ** 2, 0);
  const light = ts.find((t) => t.id.endsWith('.light'))!;
  const dark = ts.find((t) => t.id.endsWith('.dark'))!;
  return { row: simId.replace(/\.light$/, ''), dataLight: light.mean, seLight: light.se, dataDark: dark.mean, seDark: dark.se, sim: m, simSd: sd, n: v.length, zLight: z[0], zDark: z[1], loss: part };
});
rows.sort((a, b) => b.loss - a.loss);

const p = (x: number) => (Math.abs(x) >= 100 ? x.toFixed(0) : x.toPrecision(3));
console.log(`\nloss ${loss.toFixed(1)} over ${targets.length} rows (${((Date.now() - t0) / 60000).toFixed(1)} min)`);
console.log(['row', 'data L ± SE', 'data D ± SE', 'sim (SD)', 'z L', 'z D', 'loss', 'cum %'].join('\t'));
let cum = 0;
for (const r of rows) {
  cum += r.loss;
  console.log([r.row.padEnd(22), `${p(r.dataLight)} ± ${p(r.seLight)}`, `${p(r.dataDark)} ± ${p(r.seDark)}`, `${p(r.sim)} (${p(r.simSd)})`, r.zLight.toFixed(1), r.zDark.toFixed(1), r.loss.toFixed(1), ((100 * cum) / loss).toFixed(0)].join('\t'));
}

writeJson(OUT, {
  study: 'Step 4b diagnosis: per-row loss at one point (STATUS 2026-10-14)',
  source,
  values,
  atBound,
  window: { warmup: WARMUP, obs: OBS, dt: DT },
  reps: REPS,
  loss,
  rows,
  perColony: runs.map((r, i) => ({ colony: cols[i].label, rows: r.rows, foragersIn: r.foragersIn })),
  seeds: "seedFor(2018, 'diag', 0xd1a9, colony index)",
  seconds: (Date.now() - t0) / 1000,
  provenance: provenance(),
});
console.log(`wrote ${OUT}`);
