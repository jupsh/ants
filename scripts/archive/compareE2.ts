/**
 * Step 3: compare the fitted E2 variants (data/fits/e2-<id>.json) on the same
 * fresh seeds with the combined-SE criteria.
 *   - fit: Σz² on the fit targets (the fit's own objective, re-evaluated on
 *     fresh seeds) and loss + 2k (AIC-like; Σz² is −2 log L up to a constant
 *     under normal errors);
 *   - development: Σz² over the inspected 2009 rows (not fitted);
 *   - pre-registered checks: between-ant SD of drinking time at the 3 µL
 *     drop (1/4/8 days), never fitted.
 *
 * Usage: npx vite-node scripts/compareE2.ts [--blocks 10]
 */
import fs from 'node:fs';
import { e2Compare, e2Table, simulateE2Async } from '../../src/sim/experiments/e2Targets';
import { E2_VARIANTS } from '../../src/sim/experiments/e2Variants';
import { E2_LEGACY_FORAGER, LASIUS_MORPH, E2_LEGACY_PHYS, LASIUS_WALK } from '../../src/sim/species/lasiusM1';
import { numArg, readJson } from '../lib';
import { SimPool } from '../pool';

const BLOCKS = numArg('--blocks', 10);
const CHECKS = ['d1.drink', 'd4.drink', 'd8.drink'];
const pool = await SimPool.create();
const summary: string[] = [];
for (const v of E2_VARIANTS) {
  const file = `data/fits/e2-${v.id}.json`;
  if (!fs.existsSync(file)) continue;
  const fit = readJson<any>(file);
  const P = { walk: LASIUS_WALK, forager: { ...E2_LEGACY_FORAGER, ...fit.forager }, phys: { ...E2_LEGACY_PHYS, ...fit.phys }, morph: LASIUS_MORPH };
  const rows = e2Compare(await simulateE2Async(P, 150, { accessible: fit.pipetteAccessible, volumeSd: fit.observer.volumeSd }, 0.1, 8_000_000, BLOCKS, pool.scouts.bind(pool)));
  const sum = (f: (r: (typeof rows)[0]) => number | undefined) => rows.reduce((s, r) => s + (f(r) ?? 0), 0);
  const fitLoss = sum((r) => (r.target.role === 'fit' ? r.mean.z ** 2 : 0));
  const devLoss = sum((r) => (r.target.role === 'development' ? r.mean.z ** 2 : 0));
  const checks = rows.filter((r) => CHECKS.includes(r.target.id)).map((r) => r.spread!.z);
  const worstFit = rows.filter((r) => r.target.role === 'fit').reduce((a, r) => (Math.abs(r.mean.z) > Math.abs(a.mean.z) ? r : a));
  console.log(`\n=== ${v.label}: k = ${fit.k}, fit loss (optimiser) ${fit.loss.toFixed(1)}`);
  console.log(Object.entries(fit.free as Record<string, number>).map(([k, x]) => `${k} = ${x.toPrecision(3)}`).join(', '));
  console.log(e2Table(rows));
  summary.push(
    `${v.label.padEnd(30)} k=${String(fit.k).padStart(2)}  fit Σz² ${fitLoss.toFixed(1).padStart(6)}  +2k ${(fitLoss + 2 * fit.k).toFixed(1).padStart(6)}  dev Σz² ${devLoss.toFixed(1).padStart(6)}  drink-SD z ${checks.map((z) => z.toFixed(1)).join('/')}  worst fit row ${worstFit.target.id} z=${worstFit.mean.z.toFixed(1)}`,
  );
}
console.log('\n=== Summary (fresh seeds, combined SE)');
console.log(summary.join('\n'));
pool.close();
