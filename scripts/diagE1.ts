/**
 * E1 structure diagnostics (step 5): the research note's checks
 * (docs/research/slope-walking.md) computed by the TS pipeline on the
 * Khuong et al. 2013 data and on the current walking model, with
 * cluster-bootstrap SEs and combined-SE z. The "note" column is the note's
 * Python value [C], for the reproduction check. Writes nothing.
 *
 * Usage: npx vite-node scripts/diagE1.ts [--ants 300] [--fit file] [--incline k] [--noise | --clean]
 *   default  simulated tracks pass through the tracking observer (model A,
 *            khuongTracking in lasiusM1.ts)
 *   --noise  re-derive the observer SDs: the data's estimate minus the part
 *            that slow movement of the noise-free model contributes to the
 *            same estimator, σ² = σ_data² − σ_moving² (how khuongTracking
 *            was obtained)
 *   --clean  no tracking noise
 */
import { combinedZ, verdict } from '../src/sim/analysis/compare';
import { KHUONG_PREP, prepareTrack } from '../src/sim/analysis/trajectory';
import { diagSample } from '../src/sim/analysis/walkDiagnostics';
import { walkParams } from '../src/sim/models/walk';
import { khuongTracking } from '../src/sim/species/lasiusM1';
import { arg, flag, INCLINES, loadKhuong, numArg, readJson } from './lib';
import { SimPool } from './pool';

const ANTS = numArg('--ants', 300);
const ONLY = numArg('--incline', 0);
const NOISE = flag('--noise');
const CLEAN = flag('--clean');
const FIT = arg('--fit', 'data/fits/e1-walk.json');
const params = walkParams(readJson<any>(FIT).params);
console.log(`fit: ${FIT}`);

// Research-note values [C] per incline (0, 20, 30, 45, 60°).
const NOTE: Record<string, number[]> = {
  'noise.x': [0.176, 0.16, 0.153, 0.146, 0.137],
  'noise.y': [0.194, 0.179, 0.199, 0.237, 0.359],
  'antMedian.q25': [43, 27, 24, 14, 9.4],
  'antMedian.q50': [53, 41, 30, 20, 14.2],
  'antMedian.q75': [64, 53, 37, 26, 20.7],
  'logSd.between': [0.31, 0.44, 0.41, 0.47, 0.56],
  'logSd.within': [0.68, 0.72, 0.65, 0.69, 0.62],
  'exits.down': [35 / 69, 50 / 69, 46 / 69, 57 / 69, 48 / 69],
  'vr.0': [-3.47, -2.24, -0.65, -0.12, -0.15],
  'vr.1': [-2.21, -1.27, 1.49, 1.91, 1.59],
  'vr.2': [0.12, 1.15, 4.01, 3.24, 2.78],
  backIn: [0.68, 0.68, 0.55, 0.53, 0.56],
  'cos5.0': [0.23, 0.32, 0.46, 0.56, 0.56],
  'cos5.1': [0.19, 0.33, 0.5, 0.58, 0.64],
  'cos5.2': [0.4, 0.51, 0.62, 0.72, 0.78],
  'cos5.3': [0.81, 0.87, 0.9, 0.93, 0.92],
  'cos5.4': [0.95, 0.96, 0.97, 0.98, 0.97],
  'cos50.0': [0.01, 0.0, 0.08, 0.09, 0.11],
  'cos50.1': [-0.05, -0.02, 0.09, 0.11, 0.19],
  'cos50.2': [-0.06, -0.06, 0.07, 0.13, 0.22],
  'cos50.3': [-0.02, 0.04, 0.13, 0.23, 0.23],
  'cos50.4': [0.17, 0.17, 0.25, 0.31, 0.16],
  'kurt.0': [2.5, 2.8, 3.3, 4.3, 4.4],
  'kurt.1': [2.7, 3.2, 4.0, 4.7, 5.7],
  'kurt.2': [5.0, 5.8, 6.2, 7.3, 7.3],
  'kurt.3': [7.7, 7.4, 6.3, 5.5, 5.6],
  'kurt.4': [10.5, 11.1, 7.0, 6.7, 5.8],
  'align.0': [-0.006, NaN, NaN, NaN, NaN],
  'align.1': [-0.003, NaN, NaN, NaN, NaN],
  'align.2': [0.017, NaN, NaN, NaN, NaN],
  'align.3': [0.031, NaN, NaN, NaN, NaN],
  'align.4': [0.029, NaN, NaN, NaN, NaN],
  'align.5': [0.038, NaN, NaN, NaN, NaN],
};

const fmt = (v: number, d = 3) => (Number.isFinite(v) ? v.toFixed(d) : '—').padStart(8);
const prep = (tracks: ReturnType<typeof loadKhuong>) => tracks.map((t) => prepareTrack(t, KHUONG_PREP));

const pool = await SimPool.create();
for (let k = 1; k <= 5; k++) {
  if (ONLY && k !== ONLY) continue;
  const raw = loadKhuong(k);
  const data = diagSample(raw, prep(raw));
  const value = (id: string) => data.values.find((v) => v.id === id)!.value;
  const run = { incline: INCLINES[k - 1], ants: ANTS, seed: 20260000 + k, dt: 0.02 };
  let tracking = CLEAN ? undefined : khuongTracking(k);
  if (NOISE) {
    const clean = await pool.e1(params, run);
    const mv = diagSample(clean, prep(clean), 2).values;
    const deconv = (id: string) => Math.sqrt(Math.max(0, value(id) ** 2 - mv.find((v) => v.id === id)!.value ** 2));
    tracking = { sx: deconv('noise.x'), sy: deconv('noise.y') };
  }
  const simRaw = await pool.e1(params, { ...run, tracking });
  const sim = diagSample(simRaw, prep(simRaw));
  console.log(`\nincline ${k} (${((INCLINES[k - 1] * 180) / Math.PI).toFixed(0)}°)${tracking ? `, sim tracking noise σx ${tracking.sx.toFixed(3)} σy ${tracking.sy.toFixed(3)} mm` : ''}`);
  console.log(`  ${'statistic'.padEnd(58)}${'note'.padStart(8)}${'data'.padStart(8)}${'±'.padStart(8)}${'sim'.padStart(8)}${'±'.padStart(8)}${'z'.padStart(8)}`);
  data.values.forEach((d, i) => {
    const s = sim.values[i];
    const z = d.id.startsWith('alignAxis') ? NaN : combinedZ(s.value, sim.se[i], d.value, data.se[i]);
    const note = NOTE[d.id]?.[k - 1] ?? NaN;
    console.log(`  ${d.label.padEnd(58)}${fmt(note)}${fmt(d.value)}${fmt(data.se[i])}${fmt(s.value)}${fmt(sim.se[i])}${fmt(z, 1)} ${Number.isFinite(z) ? verdict(z) : ''}`);
  });
}
pool.close();
