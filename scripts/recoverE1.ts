/**
 * Prediction and parameter recovery of E1 recovery fits (STATUS decisions log
 * 2026-10-08, "Review notes on the next phase": staged vs joint fitting on
 * synthetic data). Writes nothing.
 *
 * For each recovery fit (fitE1.ts --recover) and each incline, including the
 * never-fitted 20° and 45°:
 *   - reference: 2000 ants simulated from the true parameters, scored as 69
 *     ants (scaleReference: SEs at the real-data scale);
 *   - recovered and true parameters each simulated afresh (2000 ants, the
 *     same seeds for both, different from the reference's) and scored with
 *     the fit loss;
 *   - excess = recovered − true, per family (mean z² of the family).
 * Recovered: mean excess per family ≤ 0.25 and no family > 1 (≈ within 1
 * data SE); failed: mean > 1 or a family > 4 (> 2 data SE); else approximate.
 * Then the fitted parameters, true vs recovered.
 *
 * Usage: npx vite-node scripts/recoverE1.ts [--fits a.json,b.json] [--ants 2000]
 *   (default: every file in data/fits/recover/)
 */
import fs from 'node:fs';
import { compareE1, referenceFor, scaleReference, type E1Comparison, type E1Reference } from '../src/sim/experiments/e1Compare';
import { walkParams, type WalkParams } from '../src/sim/models/walk';
import { khuongTracking } from '../src/sim/species/lasiusM1';
import { arg, INCLINES, numArg, readJson } from './lib';
import { SimPool } from './pool';

const DIR = 'data/fits/recover';
const FILES = arg('--fits', '')
  ? arg('--fits', '').split(',')
  : fs
      .readdirSync(DIR)
      .filter((f) => f.endsWith('.json'))
      .sort()
      .map((f) => `${DIR}/${f}`);
const ANTS = numArg('--ants', 2000);
const REF_SEED = 31000;
const SIM_SEED = 32000;

const pool = await SimPool.create();
const opts = (k: number, seed: number) => ({ incline: INCLINES[k - 1], ants: ANTS, seed: seed + k, dt: 0.02, tracking: khuongTracking(k) });
/**
 * Mean z² per family. A family with a statistic the reference estimates but
 * the simulation cannot is unjudgeable: +∞, so it fails (STATUS 2026-10-09;
 * it used to be charged a fixed 100 per row, below the misfit of poor fits).
 */
const families = (c: E1Comparison) => {
  const m = new Map<string, number[]>();
  for (const r of c.rows) m.set(r.family, [...(m.get(r.family) ?? []), c.missing.includes(r.id) ? Infinity : Number.isFinite(r.z) ? r.z * r.z : 100]);
  return new Map([...m].map(([f, zs]) => [f, zs.reduce((a, v) => a + v, 0) / zs.length]));
};

/** Per truth file: the 2000-ant reference and the truth's own fresh scores, per incline. */
const truthCache = new Map<string, { refs: E1Reference[]; floor: Map<string, number>[] }>();
async function truthSide(file: string, truth: WalkParams) {
  if (!truthCache.has(file)) {
    const refs: E1Reference[] = [];
    const floor: Map<string, number>[] = [];
    for (let k = 1; k <= 5; k++) {
      refs.push(scaleReference(referenceFor(await pool.e1(truth, opts(k, REF_SEED))), 69));
      floor.push(families(compareE1(await pool.e1Sample(truth, opts(k, SIM_SEED)), refs[k - 1])));
    }
    truthCache.set(file, { refs, floor });
  }
  return truthCache.get(file)!;
}

const ROLE = ['fit', 'dev', 'fit', 'dev', 'fit'];
for (const file of FILES) {
  const fit = readJson<any>(file);
  if (!fit.recovery) {
    console.log(`${file}: not a recovery fit, skipped`);
    continue;
  }
  const truth = walkParams(readJson<any>(fit.recovery.truth).params);
  const rec = walkParams(fit.params);
  const { refs, floor } = await truthSide(fit.recovery.truth, truth);
  console.log(`\n${file}: variant ${fit.variant}, ${fit.strategy ?? 'staged'}, reference ${fit.recovery.antsPerIncline} ants, rep ${fit.recovery.rep}`);
  console.log(`  prediction excess over the truth (${ANTS} ants each, data-SE units², per family):`);
  for (let k = 1; k <= 5; k++) {
    const fam = families(compareE1(await pool.e1Sample(rec, opts(k, SIM_SEED)), refs[k - 1]));
    const ex = [...fam].map(([f, v]) => [f, v - (floor[k - 1].get(f) ?? 0)] as [string, number]);
    const mean = ex.reduce((a, [, v]) => a + v, 0) / ex.length;
    const worst = ex.reduce((a, b) => (b[1] > a[1] ? b : a));
    const verdict = mean <= 0.25 && worst[1] <= 1 ? 'recovered' : mean > 1 || worst[1] > 4 ? 'FAILED' : 'approximate';
    const top = ex
      .filter(([, v]) => v > 1)
      .sort((a, b) => b[1] - a[1])
      .map(([f, v]) => `${f} ${Number.isFinite(v) ? v.toFixed(1) : 'unjudgeable (missing statistic)'}`)
      .join(', ');
    console.log(`    incline ${k} (${ROLE[k - 1]}): mean ${mean.toFixed(2)}, worst ${worst[0]} ${worst[1].toFixed(2)} → ${verdict}${top ? `   [> 1: ${top}]` : ''}`);
  }
  console.log('  parameters (true → recovered):');
  for (const key of Object.keys(truth) as (keyof WalkParams)[]) {
    const a = truth[key];
    const b = rec[key];
    if (typeof a !== 'number' || typeof b !== 'number' || a === b) continue;
    console.log(`    ${String(key).padEnd(18)} ${a.toPrecision(4).padStart(10)} → ${b.toPrecision(4).padStart(10)}${a !== 0 && a * b > 0 ? `  (×${(b / a).toFixed(2)})` : ''}`);
  }
}
pool.close();
