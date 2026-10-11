/**
 * One simulated Stroeymeyt fit colony (step 4, STATUS 2026-10-11): rows
 * at the step-4b start point (or --set overrides) beside the colony's own
 * data rows, and the run time.
 *
 *   npx vite-node scripts/stroeymeytSim.ts [--colony 122] [--phase light] [--warmup 1200] [--obs 3600] [--dt 0.1] [--seed 1] [--outRate r] [--set k=v,...] [--out f]
 */
import type { Phase } from '../src/sim/analysis/inNest';
import { simulateStroeymeyt } from '../src/sim/experiments/colonyStroeymeyt';
import { arg, writeJson } from './lib';
import { colonyFromData, loadS2018, S2018_START, s2018Params } from './s2018Lib';

function main() {
  const data = loadS2018();
  const label = `colony${arg('--colony', '122').padStart(3, '0')}`;
  const dc = data.colonies.find((c) => c.colony === label);
  if (!dc) throw new Error(`${label} is not a fit colony`);
  const phase = arg('--phase', 'light') as Phase;
  // The step-4b start point, with --set k=v,... overrides (free-parameter keys, STATUS 2026-10-11).
  const set = Object.fromEntries(arg('--set', '').split(',').filter(Boolean).map((kv) => [kv.split('=')[0], Number(kv.split('=')[1])]));
  const P = s2018Params({ ...S2018_START, ...set }, Number(arg('--outRate', String(1 / 300))));
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
  const keys = ['speed', 'speedMove', 'still', 'runStill.mean', 'runStill.P2', 'runStill.P10', 'runStill.P60', 'runMove.mean', 'runMove.P2', 'antSd.still'];
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
