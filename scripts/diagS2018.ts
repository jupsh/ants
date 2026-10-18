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
 * `--set k=v,…` overrides free (or S2018_EXTRA) parameters (e.g. `restShape=1` at a
 * checkpoint from before restShape existed; a free parameter the checkpoint
 * lacks and `--set` does not give keeps its base value, i.e. off).
 *
 * C2 (STATUS 2026-10-18): `--candidate C2` uses C2's model and free set;
 * `--rows 36` adds the four activity rows (default for C2; C1 on the same
 * 36 definitions with `--candidate C1 --rows 36`); `--fit f` takes the point
 * from a fit file's `free`; `--seeds judge` uses the judging purpose (fresh
 * seeds, used by no fit or diagnostic) instead of 'diag'.
 *
 *   npx vite-node scripts/diagS2018.ts [--candidate C1|C2] [--rows 32|36] [--fit f] [--seeds diag|judge] [--ckpt f] [--at mean|best|start]
 *     [--set k=v,…] [--dt 0.05] [--warmup 7200] [--obs 21600] [--reps 1] [--out f] [--masks f] [--observer tracker|iid]
 */
import fs from 'node:fs';
import zlib from 'node:zlib';
import { S2018_SETTABLE, s2018AtBound, s2018Free, s2018Loss, s2018Missing, s2018TargetValues } from '../src/sim/experiments/stroeymeytTargets';
import { arg, numArg, provenance, seedFor, writeJson } from './lib';
import { SimPool } from './pool';
import { C2_DRIVE_START, colonyFromData, loadS2018, loadTrips, s2018RunExtras, S2018_START, s2018Params, s2018TargetsFor, simulateAll, S2018_WATER_KEYS, withObsVariant } from './s2018Lib';

const CAND = arg('--candidate', 'C1') as 'C1' | 'C2';
if (CAND !== 'C1' && CAND !== 'C2') throw new Error(`--candidate ${CAND}: C1 or C2`);
const ROWS = arg('--rows', CAND === 'C2' ? '36' : '32');
if (ROWS !== '32' && ROWS !== '36') throw new Error(`--rows ${ROWS}: 32 or 36`);
const S2018_FREE = s2018Free(CAND);
const FIT = arg('--fit', '');
const SEEDS = arg('--seeds', 'diag');
if (SEEDS !== 'diag' && SEEDS !== 'judge') throw new Error(`--seeds ${SEEDS}: diag or judge`);

const CKPT = arg('--ckpt', 'logs/box-2026-10-15/logs/fitS2018-s0.ckpt.json');
const AT = arg('--at', 'mean');
const DT = numArg('--dt', 0.05);
const WARMUP = numArg('--warmup', 7200);
const OBS = numArg('--obs', 21600);
const REPS = numArg('--reps', 1);
const SET = Object.fromEntries((arg('--set', '') as string).split(',').filter(Boolean).map((kv) => [kv.split('=')[0], Number(kv.split('=')[1])]));
const OUT = arg('--out', `logs/diagS2018-${AT}.json`);
// Box and decoding as in fitS2018.ts.
const BOX = 4;

const ofUnit = (u: number, lo: number, hi: number, log: boolean) => (log ? lo * (hi / lo) ** u : lo + (hi - lo) * u);
// Checkpoints from before a free parameter was added hold fewer coordinates: decode those they have.
const decode = (x: number[]) => Object.fromEntries(S2018_FREE.slice(0, x.length).map((f, i) => [f.key, ofUnit(Math.min(1, Math.max(0, x[i] / BOX)), f.lo, f.hi, f.log)]));

let values: Record<string, number>;
let source: string;
if (FIT) {
  values = JSON.parse(fs.readFileSync(FIT, 'utf8')).free;
  source = `${FIT} (free)`;
} else if (AT === 'start') {
  values = CAND === 'C2' ? { ...S2018_START, ...C2_DRIVE_START[0] } : S2018_START;
  source = CAND === 'C2' ? 'S2018_START + C2_DRIVE_START[0]' : 'S2018_START';
} else {
  const c = JSON.parse(fs.readFileSync(CKPT, 'utf8'));
  const cma = c.state.current?.cma;
  if (!cma) throw new Error(`${CKPT}: no CMA-ES state`);
  const x = AT === 'best' ? cma.best.x : cma.m;
  values = decode(x);
  source = `${CKPT} (${AT}, generation ${cma.generation}, simHash ${c.key.simHash}${AT === 'best' ? `, logged f ${cma.best.f.toFixed(1)}` : ''})`;
}

for (const k of Object.keys(SET)) if (!S2018_SETTABLE.some((f) => f.key === k) && !S2018_WATER_KEYS.includes(k)) throw new Error(`--set ${k}: not a settable parameter`);
values = { ...values, ...SET };
if (Object.keys(SET).length) source += `, set ${Object.entries(SET).map(([k, v]) => `${k}=${v}`).join(', ')}`;

const { outRate, exploreGiveUp, exploreGiveUpSd } = loadTrips();
// --masks f: recorded detection masks per colony (observer diagnostic, STATUS 2026-10-15; scratch extractor output).
const MASKS = arg('--masks', '');
const maskData = MASKS ? JSON.parse(zlib.gunzipSync(fs.readFileSync(MASKS)).toString()) : null;
// --observer: the frozen tracker (default) or independent misses ('iid', the earlier observer); masks replace both.
const OBSERVER = maskData ? 'iid' : (arg('--observer', 'tracker') as 'tracker' | 'iid');
const colonies = loadS2018().colonies.map((c) => withObsVariant(colonyFromData(c, OBSERVER))).map((c) => (maskData ? { ...c, masks: (maskData[c.label].ants as string[]).map((b) => new Uint8Array(Buffer.from(b, 'base64'))) } : c));
const VARIANT = { posDrift: colonies[0].posDrift ?? null, pxRound: colonies[0].pxRound ?? null };
console.log(`observer: ${maskData ? 'recorded masks' : OBSERVER === 'tracker' ? 'frozen tracker' : 'independent misses'}${VARIANT.posDrift || VARIANT.pxRound ? `, variant ${JSON.stringify(VARIANT)}` : ''}`);
if (maskData) console.log(`detection: recorded masks from ${MASKS}`);
// The 36 rows are the same definitions whatever the model (C1 and C2 judged alike; user 2026-10-18).
const targets = s2018TargetsFor(ROWS === '36' ? 'C2' : 'C1');
const P = s2018Params(values, outRate, CAND);
const pool = await SimPool.create();
const t0 = Date.now();
console.log(`diagS2018 (${CAND} model, ${targets.length} rows, ${SEEDS} seeds) at ${source}`);
console.log(Object.entries(values).map(([k, v]) => `${k} ${v.toPrecision(3)}`).join(', '));
const atBound = s2018AtBound(P.nest, S2018_FREE);
if (atBound.length) console.log(`at a bound: ${atBound.join(', ')}`);
console.log(`${colonies.length} colonies × ${REPS}, window ${WARMUP} + ${OBS} s, dt ${DT}, ${pool.size} workers`);

const cols = Array.from({ length: REPS }, () => colonies).flat();
const seedOf = (i: number) => (SEEDS === 'judge' ? seedFor(2018, 'judge', 0x1d6e, i) : seedFor(2018, 'diag', 0xd1a9, i));
const runs = await simulateAll(pool, P, cols, { phase: 'light', warmupS: WARMUP, obsS: OBS, dt: DT, exploreGiveUp, exploreGiveUpSd, ...s2018RunExtras(ROWS === '36' ? 'C2' : 'C1') }, seedOf);
pool.close();
const sims = runs.map((r) => r.rows);
const labels = cols.map((c) => c.label);
const loss = s2018Loss(sims, targets, labels);
// Missing simulated values on the targets' colony sets (STATUS 2026-10-18): listed, never dropped.
const missing = s2018Missing(sims, labels, targets);
if (missing.length) console.log(`MISSING simulated values (loss infinite): ${missing.map((m) => `${m.id}: ${m.cases.join(', ')}`).join('; ')}`);

// Per simulated row: both phases' data against one simulated mean (the model has no phase dependence).
const bySim = new Map<string, typeof targets>();
for (const t of targets) bySim.set(t.simId, [...(bySim.get(t.simId) ?? []), t]);
const rows = [...bySim].map(([simId, ts]) => {
  // The light target's colony set (the motion rows' light and dark sets are the same 22 colonies).
  const v = s2018TargetValues(sims, labels, ts.find((t) => t.id.endsWith('.light'))!).values;
  const m = v.reduce((a, b) => a + b, 0) / v.length;
  const sd = Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / (v.length - 1));
  const part = ts.reduce((a, t) => a + ((m - t.mean) ** 2 - sd ** 2 / v.length) / t.se ** 2, 0);
  const light = ts.find((t) => t.id.endsWith('.light'))!;
  // Activity rows are light only (no dark target).
  const dark = ts.find((t) => t.id.endsWith('.dark'));
  return { row: simId.replace(/\.light$/, ''), dataLight: light.mean, seLight: light.se, dataDark: dark?.mean ?? NaN, seDark: dark?.se ?? NaN, sim: m, simSd: sd, n: v.length, zLight: (m - light.mean) / light.se, zDark: dark ? (m - dark.mean) / dark.se : NaN, loss: part };
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

// Cost per colony (time in its worker), largest first: what bounds a generation on a box with a core per task.
const byTime = runs.map((r, i) => ({ colony: cols[i].label, ants: cols[i].nurses + cols[i].foragers, min: r.ms / 60000 })).sort((a, b) => b.min - a.min);
const sumMin = byTime.reduce((a, b) => a + b.min, 0);
console.log(`\nper-colony time (min, in worker): total ${sumMin.toFixed(1)}, slowest ${byTime[0].min.toFixed(1)} (${byTime[0].colony}, ${byTime[0].ants} ants), median ${byTime[byTime.length >> 1].min.toFixed(1)}`);
console.log(byTime.map((b) => `${b.colony} ${b.ants} ${b.min.toFixed(1)}`).join(' · '));

writeJson(OUT, {
  ...(VARIANT.posDrift || VARIANT.pxRound ? { observerVariant: VARIANT } : {}),
  study: 'Step 4b diagnosis: per-row loss at one point (STATUS 2026-10-14)',
  candidate: CAND,
  rowSet: ROWS,
  source,
  values,
  atBound,
  window: { warmup: WARMUP, obs: OBS, dt: DT },
  reps: REPS,
  loss,
  missing,
  rows,
  perColony: runs.map((r, i) => ({ colony: cols[i].label, ants: cols[i].nurses + cols[i].foragers, ms: r.ms, rows: r.rows, foragersIn: r.foragersIn })),
  seeds: SEEDS === 'judge' ? "seedFor(2018, 'judge', 0x1d6e, colony index)" : "seedFor(2018, 'diag', 0xd1a9, colony index)",
  seconds: (Date.now() - t0) / 1000,
  provenance: provenance(),
});
console.log(`wrote ${OUT}`);
