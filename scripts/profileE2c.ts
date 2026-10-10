/**
 * Profile of one parameter of a step-3c fit (STATUS 2026-10-09 amendment 2:
 * σ_m = setup.volumeSd and σ_r = phys.intakeSd, reported for the selected
 * candidate beside the recovery check). At each grid value the parameter is
 * pinned and every other free parameter is re-fitted (short CMA-ES warm-
 * started at the fit, the same seed sequence at every grid value), then
 * scored on one common batch. Loss is Σz² ≈ −2 log L, so the values within
 * 3.84 of the minimum form an approximate 95 % profile interval; a profile
 * within 3.84 of the minimum at both ends of the grid is reported as "not
 * identified", not read as an estimate. Writes nothing.
 *
 * Usage: npx vite-node scripts/profileE2c.ts --fit data/fits/e2-3c-<id>.json --param setup.volumeSd|phys.intakeSd [--grid 0,0.1,…] [--gens 60]
 */
import { cmaes } from '../src/sim/analysis/cmaes';
import { e2Loss, simulateE2Async, E2_TARGETS } from '../src/sim/experiments/e2Targets';
import { encode, decode, get, set, E2_VARIANTS_3C, type E2Model } from '../src/sim/experiments/e2Variants';
import { LASIUS_FORAGER, LASIUS_MORPH, LASIUS_PHYS, LASIUS_WALK } from '../src/sim/species/lasiusM1';
import { arg, numArg, readJson } from './lib';
import { SimPool } from './pool';

const fit = readJson<any>(arg('--fit', ''));
const KEY = arg('--param', 'setup.volumeSd');
const DEFAULT_GRID: Record<string, string> = { 'setup.volumeSd': '0,0.1,0.2,0.3,0.4,0.5', 'phys.intakeSd': '0,0.2,0.4,0.6,0.8,1' };
const GRID = arg('--grid', DEFAULT_GRID[KEY] ?? '').split(',').map(Number);
const GENS = numArg('--gens', 60);
const N = 150;
const DT = 0.1;
// Seeds 3.5e9–3.9e9: disjoint from the fits (< 3.1e9), selection (4.0e9) and synthetic data (4.1e9).
const SEED = 3_500_000_000;
const SCORE_SEED = 3_900_000_000;
const variant = E2_VARIANTS_3C.find((v) => v.id === fit.variant);
if (!variant || !variant.free.some((f) => f.key === KEY)) throw new Error(`--fit must be a step-3c fit and --param one of its free parameters`);
const reduced = { ...variant, free: variant.free.filter((f) => f.key !== KEY) };
const best: E2Model = {
  P: { walk: LASIUS_WALK, forager: { ...LASIUS_FORAGER, ...fit.forager }, phys: { ...LASIUS_PHYS, ...fit.phys }, morph: LASIUS_MORPH },
  setup: { accessible: fit.pipetteAccessible, volumeSd: fit.observer.volumeSd },
};
const fitRows = E2_TARGETS.filter((t) => t.role === 'fit');
const pool = await SimPool.create();
const run = pool.scouts.bind(pool);
const lossOf = async (m: E2Model, seed: number, n = N) => {
  const sim = await simulateE2Async(m.P, n, m.setup, DT, seed, 1, run);
  return fitRows.some((t) => !Number.isFinite(sim[t.id]?.mean)) ? Infinity : e2Loss(sim, 'fit');
};

console.log(`${variant.label}: profile of ${KEY} (fitted ${get(best, KEY).toPrecision(3)}); ${reduced.free.length} parameters re-fitted per grid value, ${GENS} generations`);
const atFit = await lossOf(best, SCORE_SEED, 3 * N);
const rows: { v: number; loss: number }[] = [];
for (const v of GRID) {
  const pinned = set(best, KEY, v);
  const r = await cmaes((x, g) => lossOf(decode(reduced, pinned, x), SEED + 1_000_000 * (g + 1)), encode(reduced, pinned), {
    sigma: 1,
    stds: reduced.free.map(() => 0.1),
    maxGenerations: GENS,
    seed: SEED,
    averageLast: 20,
  });
  const loss = await lossOf(decode(reduced, pinned, r.meanAvg), SCORE_SEED, 3 * N);
  rows.push({ v, loss });
  console.log(`  ${KEY} = ${v}: loss ${loss.toFixed(2)} (window ${r.avgWindow}, max |drift| ${Math.max(...r.meanDrift.map(Math.abs)).toFixed(2)})`);
}
const min = Math.min(atFit, ...rows.map((r) => r.loss));
console.log(`at the fit: ${atFit.toFixed(2)}`);
for (const r of rows) console.log(`  ${String(r.v).padStart(5)}  Δloss ${(r.loss - min).toFixed(2)}${r.loss - min <= 3.84 ? '  (within 3.84)' : ''}`);
const inside = rows.filter((r) => r.loss - min <= 3.84);
const flat = rows.length > 1 && rows[0].loss - min <= 3.84 && rows[rows.length - 1].loss - min <= 3.84;
console.log(flat ? `→ NOT IDENTIFIED on [${GRID[0]}, ${GRID[GRID.length - 1]}]` : inside.length ? `→ approx. 95 % profile interval [${inside[0].v}, ${inside[inside.length - 1].v}] (grid resolution)` : '→ every grid value worse than the fit by > 3.84');
pool.close();
