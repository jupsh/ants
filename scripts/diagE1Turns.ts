/**
 * E1 stop-duration and turn-linked speed diagnostics (STATUS decisions log
 * 2026-10-08, "Two more exploratory E1 checks"). Same code on the Khuong et
 * al. 2013 data and on simulated tracks (through the tracking observer),
 * cluster-bootstrap SEs over ants, combined-SE z. Writes nothing.
 *
 *   1. Stop episodes (forward 0.2 s speed < 2 mm/s, as in diagTrack) per
 *      minute of track, by duration.
 *   2. Speed around big turns: turn = angle > 1 rad between the 0.2 s
 *      displacements before and after a sample (local maxima within ±0.2 s);
 *      3-point speed divided by the ant's median moving speed, averaged at
 *      lags from the turn and divided by the same average over all samples.
 *      Plus the coefficient of variation of the time between big turns.
 *
 * Usage: npx vite-node scripts/diagE1Turns.ts [--ants 600] [--incline k]
 *          [--fits A0=data/fits/e1-walk.json,B=data/fits/e1-B-loss11.json]
 */
import fs from 'node:fs';
import { combinedZ } from '../src/sim/analysis/compare';
import { TURN_LABELS as LABELS, turnCheckSample as sample } from '../src/sim/analysis/e1TurnChecks';
import { walkParams } from '../src/sim/models/walk';
import { khuongTracking } from '../src/sim/species/lasiusM1';
import { arg, INCLINES, loadKhuong, numArg, readJson } from './lib';
import { SimPool } from './pool';

const ANTS = numArg('--ants', 600);
const ONLY = numArg('--incline', 0);

const MODELS = arg('--fits', 'A0=data/fits/e1-walk.json,B=data/fits/e1-B-loss11.json')
  .split(',')
  .map((m) => m.split('=') as [string, string])
  .filter(([name, file]) => fs.existsSync(file) || (console.log(`skipping ${name}: ${file} not found`), false));
const f = (v: number, d = 3) => (Number.isFinite(v) ? v.toFixed(d) : '—').padStart(8);
const pool = await SimPool.create();
for (let k = 1; k <= 5; k++) {
  if (ONLY && k !== ONLY) continue;
  const data = sample(loadKhuong(k));
  const sims: ReturnType<typeof sample>[] = [];
  for (const [, file] of MODELS) sims.push(sample(await pool.e1(walkParams(readJson<any>(file).params), { incline: INCLINES[k - 1], ants: ANTS, seed: 20261009 + k, dt: 0.02, tracking: khuongTracking(k) })));
  console.log(`\nincline ${k} (${((INCLINES[k - 1] * 180) / Math.PI).toFixed(0)}°)`);
  console.log(`  ${'statistic'.padEnd(46)}${'data'.padStart(8)}${'±'.padStart(8)}${MODELS.map(([name]) => name.padStart(8) + 'z'.padStart(7)).join('')}`);
  LABELS.forEach((lab, i) => {
    const cols = sims.map((sim) => f(sim.v[i]) + f(combinedZ(sim.v[i], sim.se[i], data.v[i], data.se[i]), 1).slice(1)).join('');
    console.log(`  ${lab.padEnd(46)}${f(data.v[i])}${f(data.se[i])}${cols}`);
  });
}
pool.close();
