/**
 * Tier-2 E6 baseline: refit the Bles et al. TEC-exp give/receive
 * propensities (θF, θW, ϒF, ϒW) so that the model's output *as seen by the
 * scan observer* matches the targets the authors fitted to: number of
 * foragers and the four pair-type event counts (which sum to the event
 * count). Everything else in their model (code quirks included) is kept.
 * The result is a reference fitted to E6, not a test of our model.
 *
 * Objective: Σ z² with SE_data = SD/√5 only (fit weights). Common random
 * numbers: the same colony seeds at every evaluation.
 *
 * Usage: npx vite-node scripts/fitE6TEC.ts [--colonies 120]
 */
import fs from 'node:fs';
import { fitZ } from '../src/sim/analysis/compare';
import { nelderMead } from '../src/sim/analysis/optimize';
import { e6Compare, e6Table, e6Targets, simulateColonies, type E6Metrics } from '../src/sim/experiments/e6Bles';
import { BLES_TABLE1, runBles, type BlesParams } from '../src/sim/reference/blesTEC';

const i = process.argv.indexOf('--colonies');
const COLONIES = i >= 0 ? Number(process.argv[i + 1]) : 120;
const base: BlesParams = { ...BLES_TABLE1.TEC_exp, T: 3660 };
const targets = e6Targets(fs.readFileSync('data/bles2022/trophallaxis_scans.csv', 'utf8'));
const FIT: (keyof E6Metrics)[] = ['foragers', 'ff', 'fnf', 'nff', 'nfnf'];
const keys = ['thetaF', 'thetaW', 'upsF', 'upsW'] as const;

const dec = (x: number[]): BlesParams => ({ ...base, ...Object.fromEntries(keys.map((k, j) => [k, Math.exp(x[j])])) });
const mean = (sim: E6Metrics[], k: keyof E6Metrics) => sim.reduce((s, m) => s + (m[k] as number), 0) / sim.length;
const loss = (P: BlesParams) => {
  const sim = simulateColonies((rng) => runBles(P, rng), COLONIES, 6_100_000);
  let l = 0;
  for (const t of targets) if (FIT.includes(t.id)) l += fitZ(mean(sim, t.id), t.mean, t.sd / Math.sqrt(t.n)) ** 2;
  return l;
};

const t0 = Date.now();
console.log('published Table 1 loss', loss(base).toFixed(3));
const r = nelderMead((x) => loss(dec(x)), keys.map((k) => Math.log(base[k])), 0.3, 200, 1e-4, (s) => console.log(`eval ${s.evals} loss ${s.f.toFixed(3)}`));
const P = dec(r.x);
const params = Object.fromEntries(keys.map((k) => [k, P[k]]));
console.log('refit (as 1/x):', keys.map((k) => `${k}=1/${(1 / P[k]).toFixed(1)}`).join(' '), 'loss', r.f.toFixed(3));
// Judge on fresh colonies (different seeds) with the combined-SE criteria.
console.log(e6Table(e6Compare(simulateColonies((rng) => runBles(P, rng), 400, 6_200_000), targets)));
fs.mkdirSync('data/fits', { recursive: true });
fs.writeFileSync(
  'data/fits/e6-tec.json',
  JSON.stringify({ experiment: 'E6 reference: Bles et al. 2022 TEC-exp refitted through the 60-s scan observer', fittedOn: ['foragers', 'pair-type event counts FF/FNF/NFF/NFNF (Bles et al. Table S1)'], published: Object.fromEntries(keys.map((k) => [k, base[k]])), params, loss: r.f, coloniesPerEval: COLONIES, seconds: (Date.now() - t0) / 1000 }, null, 2),
);
console.log('wrote data/fits/e6-tec.json');
