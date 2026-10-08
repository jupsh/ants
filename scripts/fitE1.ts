/**
 * Fit the exploratory-walk model to the Khuong et al. (2013) L. niger data.
 *
 *   Stage 1 (flat ground, incline 0): speed process, run structure, homing bias.
 *   Stage 2 (inclines π/6, π/3):      slope speed factor and geomenotaxis.
 *   Development (reported, never fitted; inspected, so not held out): π/9, π/4.
 *
 * Common random numbers (fixed seeds) make the objective deterministic.
 * The objective weights each statistic by its data SE only (bootstrap over
 * recorded ants); the final report uses the combined-SE criteria.
 * Output: data/fits/e1-walk.json (parameters + fit diagnostics).
 *
 * Usage: npx vite-node scripts/fitE1.ts [--quick]
 */
import fs from 'node:fs';
import zlib from 'node:zlib';
import { parseKhuongCsv } from '../src/sim/analysis/khuongData';
import { nelderMead } from '../src/sim/analysis/optimize';
import { compareE1, referenceFor, sampleFor, scalarSE, type E1Reference } from '../src/sim/experiments/e1Compare';
import { runE1 } from '../src/sim/experiments/e1Exploration';
import { DEFAULT_WALK, type WalkParams } from '../src/sim/models/walk';

const quick = process.argv.includes('--quick');
const ANTS = quick ? 80 : 160;
const DT = 0.02;
const SEED = 20131105;

const data: E1Reference[] = [];
for (let k = 1; k <= 5; k++) data.push(referenceFor(parseKhuongCsv(zlib.gunzipSync(fs.readFileSync(`data/khuong2013/incline${k}.csv.gz`)).toString('utf8'))));
const INCLINES = [0, Math.PI / 9, Math.PI / 6, Math.PI / 4, Math.PI / 3];

const logit = (p: number) => Math.log(p / (1 - p));
const sigm = (x: number) => 1 / (1 + Math.exp(-x));

let p: WalkParams = { ...DEFAULT_WALK };

// Warm start from a previous fit if present.
if (fs.existsSync('data/fits/e1-walk.json') && !process.argv.includes('--cold')) p = { ...p, ...JSON.parse(fs.readFileSync('data/fits/e1-walk.json', 'utf8')).params };

function evalAt(par: WalkParams, idx: number[]): number {
  let loss = 0;
  for (const i of idx) {
    const sim = sampleFor(runE1(par, { incline: INCLINES[i], ants: ANTS, seed: SEED + i, dt: DT }));
    loss += compareE1(sim, data[i]).loss;
  }
  return loss / idx.length;
}

// ---- Stage 1: flat ground
const s1Keys = ['speed', 'speedSdBetween', 'speedSdWithin', 'speedTau', 'pauseRate', 'pauseMean', 'meanFreePath', 'jitter', 'homeRunBias', 'homeRange'] as const;
const enc1 = (q: WalkParams) => [...s1Keys.map((k) => (k === 'homeRunBias' ? q[k] : Math.log(q[k]))), logit(q.g), logit(Math.max(1e-3, q.homeHeadingPull))];
const dec1 = (x: number[], base: WalkParams): WalkParams => {
  const q = { ...base };
  s1Keys.forEach((k, i) => (q[k] = k === 'homeRunBias' ? x[i] : Math.exp(x[i])));
  q.g = sigm(x[s1Keys.length]);
  q.homeHeadingPull = sigm(x[s1Keys.length + 1]);
  return q;
};
const t0 = Date.now();
const r1 = nelderMead((x) => evalAt(dec1(x, p), [0]), enc1(p), 0.3, quick ? 150 : 500, 1e-4, (r) => console.log(`stage1 eval ${r.evals} loss ${r.f.toFixed(3)}`));
p = dec1(r1.x, p);
console.log('stage 1 done', r1.f.toFixed(3), JSON.stringify(p));

// ---- Stage 2: slopes
const enc2 = (q: WalkParams) => [Math.log(q.slopeSpeedK), Math.log(q.geoRunGain), logit(Math.min(0.999, q.geoHeadingPull)), q.slopePauseK, q.slopeJitterK, q.slopeSpeedSdK];
const dec2 = (x: number[], base: WalkParams): WalkParams => ({ ...base, slopeSpeedK: Math.exp(x[0]), geoRunGain: Math.exp(x[1]), geoHeadingPull: sigm(x[2]), slopePauseK: x[3], slopeJitterK: x[4], slopeSpeedSdK: x[5] });
const r2 = nelderMead((x) => evalAt(dec2(x, p), [2, 4]), enc2(p), 0.3, quick ? 120 : 400, 1e-4, (r) => console.log(`stage2 eval ${r.evals} loss ${r.f.toFixed(3)}`));
p = dec2(r2.x, p);
console.log('stage 2 done', r2.f.toFixed(3), JSON.stringify(p));

// ---- Report all inclines (1 and 3 are withheld validation conditions)
const report: Record<string, unknown> = {};
for (let i = 0; i < 5; i++) {
  const sim = sampleFor(runE1(p, { incline: INCLINES[i], ants: 300, seed: SEED + 1000 + i, dt: DT }));
  const c = compareE1(sim, data[i], scalarSE(sim));
  const role = i === 1 || i === 3 ? 'development' : 'fit';
  report[`incline${i + 1}`] = { role, loss: c.loss, z: Object.fromEntries(c.rows.map((r) => [r.id, r.z])) };
  console.log(`incline ${i + 1} (${role}): loss ${c.loss.toFixed(2)}`, c.rows.map((r) => `${r.id}=${r.z.toFixed(1)}`).join(' '));
}
fs.mkdirSync('data/fits', { recursive: true });
fs.writeFileSync(
  'data/fits/e1-walk.json',
  JSON.stringify(
    {
      experiment: 'E1 exploratory walking (Khuong et al. 2013)',
      fittedOn: ['incline1 (0)', 'incline3 (π/6)', 'incline5 (π/3)'],
      validatedOn: ['incline2 (π/9)', 'incline4 (π/4)'],
      conditions: '26 °C, 50% RH',
      dt: DT,
      antsPerEval: ANTS,
      seconds: (Date.now() - t0) / 1000,
      params: p,
      report,
    },
    null,
    2,
  ),
);
console.log('wrote data/fits/e1-walk.json');
