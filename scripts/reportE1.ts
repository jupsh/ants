/**
 * Judge the current E1 fit against Khuong et al. 2013 at every incline with
 * the combined-SE criteria (docs/STATUS.md, Evidence policy § Criteria).
 * Prints one table per incline and writes nothing.
 *
 * Usage: npx vite-node scripts/reportE1.ts [--ants 300]
 */
import { verdict } from '../src/sim/analysis/compare';
import { compareE1, referenceFor, sampleFor, scalarSE } from '../src/sim/experiments/e1Compare';
import { walkParams } from '../src/sim/models/walk';
import { INCLINES, loadKhuong, numArg, readJson } from './lib';
import { SimPool } from './pool';

const ANTS = numArg('--ants', 300);
const fit = readJson<any>('data/fits/e1-walk.json');
const params = walkParams(fit.params);
const ROLE = ['fit', 'development', 'fit', 'development', 'fit'];

const pool = await SimPool.create();
for (let k = 1; k <= 5; k++) {
  const t0 = Date.now();
  const ref = referenceFor(loadKhuong(k));
  const sim = sampleFor(await pool.e1(params, { incline: INCLINES[k - 1], ants: ANTS, seed: 20260000 + k, dt: 0.02 }));
  const c = compareE1(sim, ref, scalarSE(sim));
  console.log(`\nincline ${k} (${((INCLINES[k - 1] * 180) / Math.PI).toFixed(0)}°, ${ROLE[k - 1]}): loss ${c.loss.toFixed(1)} over ${new Set(c.rows.map((r) => r.family)).size} families  [${((Date.now() - t0) / 1000).toFixed(1)} s]`);
  for (const r of c.rows) {
    const se = Number.isFinite(r.seData) ? ` ±${r.seData.toPrecision(2)} / ±${r.seSim.toPrecision(2)}` : '';
    console.log(`  ${verdict(r.z).padEnd(8)} z=${r.z.toFixed(2).padStart(6)}  ${r.label}: data ${r.data.toPrecision(3)}, sim ${r.sim.toPrecision(3)}${se}`);
  }
}
pool.close();
