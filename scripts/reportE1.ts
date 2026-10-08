/**
 * Judge the current E1 fit against Khuong et al. 2013 at every incline with
 * the combined-SE criteria (docs/STATUS.md, Evidence policy § Criteria).
 * Prints one table per incline and writes nothing.
 *
 * Usage: npx vite-node scripts/reportE1.ts [--ants 300]
 */
import fs from 'node:fs';
import zlib from 'node:zlib';
import { verdict } from '../src/sim/analysis/compare';
import { parseKhuongCsv } from '../src/sim/analysis/khuongData';
import { compareE1, referenceFor, sampleFor, scalarSE } from '../src/sim/experiments/e1Compare';
import { runE1 } from '../src/sim/experiments/e1Exploration';
import { walkParams } from '../src/sim/models/walk';

const arg = (k: string, d: number) => {
  const i = process.argv.indexOf(k);
  return i >= 0 ? Number(process.argv[i + 1]) : d;
};
const ANTS = arg('--ants', 300);
const fit = JSON.parse(fs.readFileSync('data/fits/e1-walk.json', 'utf8'));
const params = walkParams(fit.params);
const INCLINES = [0, Math.PI / 9, Math.PI / 6, Math.PI / 4, Math.PI / 3];
const ROLE = ['fit', 'development', 'fit', 'development', 'fit'];

for (let k = 1; k <= 5; k++) {
  const t0 = Date.now();
  const ref = referenceFor(parseKhuongCsv(zlib.gunzipSync(fs.readFileSync(`data/khuong2013/incline${k}.csv.gz`)).toString('utf8')));
  const sim = sampleFor(runE1(params, { incline: INCLINES[k - 1], ants: ANTS, seed: 20260000 + k, dt: 0.02 }));
  const c = compareE1(sim, ref, scalarSE(sim));
  console.log(`\nincline ${k} (${((INCLINES[k - 1] * 180) / Math.PI).toFixed(0)}°, ${ROLE[k - 1]}): loss ${c.loss.toFixed(1)} over ${new Set(c.rows.map((r) => r.family)).size} families  [${((Date.now() - t0) / 1000).toFixed(1)} s]`);
  for (const r of c.rows) {
    const se = Number.isFinite(r.seData) ? ` ±${r.seData.toPrecision(2)} / ±${r.seSim.toPrecision(2)}` : '';
    console.log(`  ${verdict(r.z).padEnd(8)} z=${r.z.toFixed(2).padStart(6)}  ${r.label}: data ${r.data.toPrecision(3)}, sim ${r.sim.toPrecision(3)}${se}`);
  }
}
