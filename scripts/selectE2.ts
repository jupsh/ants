/**
 * Step 3c judging (frozen pre-registration, docs/STATUS.md 2026-10-09).
 * Writes nothing.
 *
 *   - Fit Σz² on 5 fresh batches of 300 scouts per condition, the same
 *     seeds for every candidate, + 2k (heuristic penalty). The ± is
 *     simulation noise only (not sampling of the real ants); "2 SE" is a
 *     numerical stability requirement, not confirmation of a mechanism.
 *   - Selection: lowest penalised loss wins provisionally; the simplest
 *     candidate within 2 paired SE of it is chosen (parsimony); among equal
 *     k, the lower one if separated by > 2 SE, else unresolved.
 *   - Adequacy, separately: no fit row with combined |z| > 3, at most two
 *     with 2 < |z| ≤ 3, and ≥ 90 % of scouts finding both drops. Group
 *     fractions and the development rows (2009 rest, TL1/TL2/nTL2 split,
 *     2003 six pipettes) are reported, never used for the choice; so are
 *     the trail-laying group rows (scripts/e2Groups.ts, STATUS 2026-10-09)
 *     and the search time against the independent giving-up measurement
 *     (Mailleux 2003: Pl = 1/85 s from the 2000 data; STATUS 2026-10-09).
 *   - A candidate that cannot estimate a fit row is unjudgeable.
 *
 * Usage: npx vite-node scripts/selectE2.ts [--fits S0I0,S1I0,S2I0,S1I1,S2I1] [--prefix data/fits/e2-3c-]
 */
import { olsFit, spearman } from '../src/sim/analysis/compare';
import { e2Compare, e2Loss, simulateE2Async, E2_CONDITIONS, E2_TARGETS } from '../src/sim/experiments/e2Targets';
import { SIX_TARGETS, sixPipetteCondition } from '../src/sim/experiments/e2SixPipettes';
import type { ScoutResult } from '../src/sim/experiments/e2Mailleux';
import { groupRows } from './e2Groups';
import { modelOf } from './e2Synthetic';
import { arg, readJson } from './lib';
import { SimPool } from './pool';

const IDS = arg('--fits', 'S0I0,S1I0,S2I0,S1I1,S2I1').split(',');
const PREFIX = arg('--prefix', 'data/fits/e2-3c-');
const BATCHES = 5;
const N = 300;
// Seeds from 4.0e9: out of the fits' reach (< 3.1e9; STATUS 2026-10-09, seed collisions).
const SEED = 4_000_000_000;
const pool = await SimPool.create();
const run = pool.scouts.bind(pool);
const fitRows = E2_TARGETS.filter((t) => t.role === 'fit');

interface Cand {
  id: string;
  k: number;
  batch: number[];
  missing: number;
  P: number;
}
const cands: Cand[] = [];
for (const id of IDS) {
  const fit = readJson<any>(`${PREFIX}${id}.json`);
  const { P, setup } = modelOf(fit);
  const batch: number[] = [];
  let missing = 0;
  for (let b = 0; b < BATCHES; b++) {
    const sim = await simulateE2Async(P, N, setup, 0.1, SEED + 1_000_000 * b, 1, run);
    missing += fitRows.filter((t) => !Number.isFinite(sim[t.id]?.mean)).length;
    batch.push(e2Loss(sim, 'fit'));
  }
  const mean = batch.reduce((a, v) => a + v, 0) / BATCHES;
  cands.push({ id, k: fit.k, batch, missing, P: mean + 2 * fit.k });

  // Adequacy and reports on all five batches pooled (1500 scouts per condition).
  const pooled = await simulateE2Async(P, N * BATCHES, setup, 0.1, SEED + 50_000_000, 1, run);
  const rows = e2Compare(pooled);
  const fz = rows.filter((r) => r.target.role === 'fit').map((r) => r.mean.z);
  const off = fz.filter((z) => !Number.isFinite(z) || Math.abs(z) > 3).length;
  const marg = fz.filter((z) => Math.abs(z) > 2 && Math.abs(z) <= 3).length;
  // The two-drop condition again, scout by scout, for the groups.
  const two = E2_CONDITIONS.find((c) => c.id === 'two')!;
  const rs = ((await run(P, two.options(N * BATCHES, SEED + 60_000_000, setup, 0.1))) as ScoutResult[]).filter((r) => r.drinks.length);
  const both = rs.filter((r) => r.drinks.length >= 2);
  const found = both.length / rs.length;
  const g = (f: (r: ScoutResult) => boolean) => both.filter(f);
  const groups: [string, ScoutResult[], string][] = [
    ['TL1', g((r) => r.laidSection1), '38 %, 58 ± 33 s'],
    ['TL2', g((r) => !r.laidSection1 && r.laidTrail), '46 %, 141 ± 89 s'],
    ['nTL2', g((r) => !r.laidTrail), '16 %, 114 ± 83 s'],
  ];
  const ms = (xs: number[]) => {
    const m = xs.reduce((a, v) => a + v, 0) / Math.max(1, xs.length);
    return `${m.toFixed(0)} ± ${Math.sqrt(xs.reduce((a, v) => a + (v - m) ** 2, 0) / Math.max(1, xs.length - 1)).toFixed(0)} s`;
  };
  const adequate = off === 0 && marg <= 2 && found >= 0.9;
  console.log(`\n=== ${id} (k ${fit.k}${fit.atBound?.length ? `; at a bound: ${fit.atBound.join(', ')}` : ''})`);
  console.log(`  fit loss per batch ${batch.map((v) => v.toFixed(1)).join(', ')}; mean ${mean.toFixed(2)}, + 2k = ${(mean + 2 * fit.k).toFixed(2)}${missing ? `; UNJUDGEABLE (${missing} missing fit rows)` : ''}`);
  console.log(`  adequacy: ${off} fit rows |z| > 3, ${marg} with 2 < |z| ≤ 3; found both drops ${(100 * found).toFixed(1)} % (data > 95 %) → ${adequate ? 'ADEQUATE' : 'not adequate'}`);
  console.log(`  rows: ${rows.map((r) => `${r.target.id}${r.target.role === 'fit' ? '' : '(dev)'} ${r.mean.z.toFixed(1)}`).join(', ')}`);
  console.log(`  groups (development; TL1 is the fitted between-drop row, TL2/nTL2 subdivide the fitted non-layer row): ${groups.map(([n, xs, d]) => `${n} ${((100 * xs.length) / both.length).toFixed(0)} %, ${ms(xs.map((r) => r.betweenTime))} [data ${d}]`).join('; ')}`);
  // Per-drop volume–time regressions (development check, STATUS 2026-10-09 correction): the data
  // show equal slopes and intercepts at the two drops (F-tests NS), rs 0.22 / 0.31, pooled 0.006·t + 0.15.
  const reg = (j: number) => {
    const t = both.map((r) => r.drinks[j].time);
    const v = both.map((r) => r.drinks[j].ul);
    const f = olsFit(t, v);
    return `slope ${f.slope.toFixed(4)}, intercept ${f.intercept.toFixed(3)}, rs ${spearman(t, v).toFixed(2)}`;
  };
  console.log(`  per-drop volume–time regressions (development): drop 1 ${reg(0)}; drop 2 ${reg(1)}  [data: equal slopes and intercepts, rs 0.22 / 0.31; pooled 0.006, 0.15]`);
  console.log(`  trail-laying groups (development, reported only):\n${groupRows(both).map((l) => `    ${l}`).join('\n')}`);
  // Search time vs the independent measurement (development): fitted means, and like for like the giving-up
  // time (end of drinking → mid-bridge on the way back) at a single 0.3 µL drop, 4 days starved.
  const f = fit.forager;
  const means = f.searchMode === 2 ? `arsMean ${f.arsMean.toFixed(0)} s, arsMeanLay ${f.arsMeanLay.toFixed(0)} s` : `arsMean ${f.arsMean.toFixed(0)} s${f.searchMode === 1 ? ' (layers too)' : ' (non-layers only)'}`;
  const single = Array.from({ length: N }, (_, i) => ({ seed: SEED + 80_000_000 + i, drop1: { ul: 0.3, molar: 0.6 }, pipetteAccessible: setup.accessible, volumeSd: setup.volumeSd, starvationDays: 4, dt: 0.1, maxTime: 900 }));
  const gu = ((await run(P, single)) as ScoutResult[]).filter((r) => r.drinks.length);
  // Giving-up time for all scouts that drank and, like for like with Pl (the leaving rate of
  // *unsatisfied* ants), for the non-layers only (review 2026-10-09; which scouts the 2000 n = 35 covers is not stated).
  const giveUp = (rs: ScoutResult[]) => {
    const gt = rs.map((r) => r.givingUpTime).filter(Number.isFinite);
    const gm = gt.reduce((a, v) => a + v, 0) / Math.max(1, gt.length);
    const gsd = Math.sqrt(gt.reduce((a, v) => a + (v - gm) ** 2, 0) / Math.max(1, gt.length - 1));
    const gmed = [...gt].sort((a, b) => a - b)[gt.length >> 1];
    return `${gm.toFixed(0)} ± ${gsd.toFixed(0)} s, median ${gmed?.toFixed(0)} (${gt.length} of ${rs.length} crossed mid-bridge)`;
  };
  console.log(`  search time (development): fitted ${means} [Pl: 85 ± 14 s]; giving-up time at one 0.3 µL drop, 4 d: all scouts ${giveUp(gu)}, ${((100 * gu.filter((r) => r.laidTrail).length) / Math.max(1, gu.length)).toFixed(0)} % laid; non-layers ${giveUp(gu.filter((r) => !r.laidTrail))} [2000: 85 ± 14 s, exponential, n 35; 2006 4 d: 86 ± 68 s, n 23, 17 % laid]`);
  for (const days of [4]) {
    const six = e2Compare(await simulateE2Async(P, N, setup, 0.1, SEED + 70_000_000, 5, run, [sixPipetteCondition(days)]), SIX_TARGETS);
    console.log(`  2003 six pipettes, ${days} d (development check, not independent): ${six.map((r) => `${r.target.id} ${r.mean.z.toFixed(1)}`).join(', ')}`);
  }
}

// ---- Selection rule
const pairSE = (a: Cand, b: Cand) => {
  const d = a.batch.map((v, i) => v - b.batch[i]);
  const m = d.reduce((s, v) => s + v, 0) / d.length;
  return Math.sqrt(d.reduce((s, v) => s + (v - m) ** 2, 0) / (d.length - 1) / d.length);
};
const ok = cands.filter((c) => !c.missing);
console.log('\n=== Selection (penalised loss P̄ = mean batch loss + 2k; ± = simulation noise only)');
for (const c of [...cands].sort((a, b) => a.P - b.P)) console.log(`  ${c.id.padEnd(5)} k ${c.k}  P̄ ${c.P.toFixed(2)}${c.missing ? '  UNJUDGEABLE' : ''}`);
if (!ok.length) console.log('  no judgeable candidate');
else {
  const w = ok.reduce((a, b) => (b.P < a.P ? b : a));
  const within = ok.filter((c) => c === w || c.P - w.P < 2 * pairSE(c, w));
  console.log(`  provisional winner ${w.id}; within 2 paired SE of it: ${within.map((c) => `${c.id} (Δ ${(c.P - w.P).toFixed(2)} ± ${pairSE(c, w).toFixed(2)})`).join(', ')}`);
  const kmin = Math.min(...within.map((c) => c.k));
  const simplest = within.filter((c) => c.k === kmin);
  let chosen: Cand | null = null;
  if (simplest.length === 1) chosen = simplest[0];
  else {
    const best = simplest.reduce((a, b) => (b.P < a.P ? b : a));
    if (simplest.every((c) => c === best || c.P - best.P > 2 * pairSE(c, best))) chosen = best;
  }
  console.log(chosen ? `  → selected: ${chosen.id}` : `  → UNRESOLVED between ${simplest.map((c) => c.id).join(' and ')} (equal k, within 2 SE): the choice goes to the user`);
}
pool.close();
