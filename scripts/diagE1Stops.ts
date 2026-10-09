/**
 * E1 stop and speed–turning diagnostics (STATUS decisions log 2026-10-08,
 * "Two exploratory E1 checks"). Same code on the Khuong et al. 2013 data and
 * on simulated tracks (through the tracking observer), cluster-bootstrap SEs
 * over ants, combined-SE z. Writes nothing.
 *
 *   1. Heading in vs out of a stop by stop duration (stop episodes as in
 *      walkDiagnostics.diagTrack), and alignment with downhill and with the
 *      direction to the release point before and after stops.
 *   2. Slope of log(1 − ⟨cos⟩ at 10 mm) on log speed between ants vs within
 *      ants (ant fixed effects over within-ant terciles of segment speed;
 *      speed from arc length / moving time, and from displacement).
 *
 * Usage: npx vite-node scripts/diagE1Stops.ts [--ants 600] [--incline k] [--clean]
 *          [--fits A0=data/fits/e1-walk.json,B=data/fits/e1-B-loss11.json]
 *   --clean  leave out 10 mm segments within 0.4 s of a stop in the
 *            speed–turning slopes (are coupling and stop resets separate?)
 */
import fs from 'node:fs';
import { combinedZ } from '../src/sim/analysis/compare';
import { STOP_LABELS as LABELS, stopCheckSample } from '../src/sim/analysis/e1StopChecks';
import { walkParams } from '../src/sim/models/walk';
import { khuongTracking } from '../src/sim/species/lasiusM1';
import { arg, INCLINES, loadKhuong, numArg, readJson } from './lib';
import { SimPool } from './pool';

const ANTS = numArg('--ants', 600);
const ONLY = numArg('--incline', 0);
const CLEAN = process.argv.includes('--clean');
const sample = (tracks: Parameters<typeof stopCheckSample>[0]) => stopCheckSample(tracks, CLEAN);

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
  for (const [, file] of MODELS) {
    const p = walkParams(readJson<any>(file).params);
    sims.push(sample(await pool.e1(p, { incline: INCLINES[k - 1], ants: ANTS, seed: 20261008 + k, dt: 0.02, tracking: khuongTracking(k) })));
  }
  const counts = MODELS.map(([name], m) => `, ${name} ${sims[m].counts.join('/')}`).join('');
  console.log(`\nincline ${k} (${((INCLINES[k - 1] * 180) / Math.PI).toFixed(0)}°)  stops per duration bin: data ${data.counts.join('/')}${counts}`);
  console.log(`  ${'statistic'.padEnd(52)}${'data'.padStart(8)}${'±'.padStart(8)}${MODELS.map(([name]) => name.padStart(8) + 'z'.padStart(7)).join('')}`);
  LABELS.forEach((lab, i) => {
    const cols = sims.map((sim) => f(sim.v[i]) + f(combinedZ(sim.v[i], sim.se[i], data.v[i], data.se[i]), 1).slice(1)).join('');
    console.log(`  ${lab.padEnd(52)}${f(data.v[i])}${f(data.se[i])}${cols}`);
  });
}
pool.close();
