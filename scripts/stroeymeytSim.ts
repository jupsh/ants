/**
 * One simulated Stroeymeyt fit colony (step 4a, STATUS 2026-10-11): rows
 * of the provisional model beside the colony's own data rows, and the run
 * time (the step-4 cost check).
 *
 *   npx vite-node scripts/stroeymeytSim.ts [--colony 122] [--phase light] [--warmup 1200] [--obs 3600] [--dt 0.1] [--seed 1] [--out f]
 */
import fs from 'node:fs';
import type { Phase } from '../src/sim/analysis/inNest';
import { simulateStroeymeyt, type StroeymeytColony } from '../src/sim/experiments/colonyStroeymeyt';
import { LASIUS_NEST, LASIUS_PARAMS } from '../src/sim/species/lasiusM1';
import { arg, writeJson } from './lib';

const ROWS = 'data/reference/stroeymeyt2018-fit-rows.json';

interface DataColony {
  colony: string;
  ants: { nurse: number; forager: number; queen: number };
  rows: Record<string, number>;
}

export function colonyFromData(c: DataColony): StroeymeytColony {
  return {
    label: c.colony,
    nurses: c.ants.nurse,
    foragers: c.ants.forager,
    noiseSd: Math.sqrt((c.rows['noise.x'] ** 2 + c.rows['noise.y'] ** 2) / 2),
    detection: c.rows['detection'],
  };
}

function main() {
  const data = JSON.parse(fs.readFileSync(ROWS, 'utf8')) as { colonies: DataColony[] };
  const label = `colony${arg('--colony', '122').padStart(3, '0')}`;
  const dc = data.colonies.find((c) => c.colony === label);
  if (!dc) throw new Error(`${label} is not a fit colony`);
  const phase = arg('--phase', 'light') as Phase;
  const P = { ...LASIUS_PARAMS, nest: { ...LASIUS_NEST, returnRate: 0, forager: { outRate: Number(arg('--outRate', String(1 / 300))) } } };
  const col = colonyFromData(dc);
  const t0 = Date.now();
  const run = simulateStroeymeyt(P, col, {
    seed: Number(arg('--seed', '1')),
    phase,
    warmupS: Number(arg('--warmup', '1200')),
    obsS: Number(arg('--obs', '3600')),
    dt: Number(arg('--dt', '0.1')),
  });
  const secs = (Date.now() - t0) / 1000;
  const simH = (Number(arg('--warmup', '1200')) + Number(arg('--obs', '3600'))) / 3600;
  console.log(`${label} ${phase}: ${col.nurses} nurses, ${col.foragers} foragers + queen; ${secs.toFixed(1)} s wall for ${simH.toFixed(2)} simulated h (${(secs / simH).toFixed(1)} s per colony-hour); foragers in nest ${run.foragersIn.toFixed(2)}`);
  const keys = ['speed', 'speedMove', 'still', 'runStill.median', 'runStill.mean', 'runStill.P60', 'runMove.median', 'runMove.mean', 'antSd.still'];
  for (const g of ['forager', 'nurse'])
    for (const k of keys) {
      const key = `${k}.${g}.${phase}`;
      console.log(`  ${key.padEnd(30)} model ${run.rows[key]?.toFixed(3).padStart(8)}   data ${dc.rows[key]?.toFixed(3).padStart(8)}`);
    }
  for (const k of [`stay.n.${phase}`, `stay.median.${phase}`, `staySpeed.300.${phase}`, `density.${phase}`])
    console.log(`  ${k.padEnd(30)} model ${run.rows[k]?.toFixed(3).padStart(8)}   data ${dc.rows[k]?.toFixed(3).padStart(8)}`);
  const out = arg('--out', '');
  if (out) writeJson(out, { colony: label, phase, secs, rows: run.rows });
}

main();
