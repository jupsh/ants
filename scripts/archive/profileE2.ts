/**
 * Profile likelihoods for a fitted E2 variant: for each listed parameter,
 * pin it at grid values around the optimum (in the optimiser's transformed
 * coordinates) and re-fit all other free parameters. A profile that rises
 * by ≥ 3.84 (χ²₁, 95 %) on both sides means the parameter is identified;
 * a flat profile means the data cannot pin it down.
 *
 * Usage: npx vite-node scripts/profileE2.ts --variant Ma --params setup.volumeSd,forager.unsatisfiedLayProb [--evals 80]
 */
import { nelderMead } from '../../src/sim/analysis/optimize';
import { e2Loss, simulateE2Async } from '../../src/sim/experiments/e2Targets';
import { decode, encode, E2_VARIANTS, type E2Model } from '../../src/sim/experiments/e2Variants';
import { E2_LEGACY_FORAGER, LASIUS_MORPH, E2_LEGACY_PHYS, LASIUS_WALK } from '../../src/sim/species/lasiusM1';
import { arg, numArg, readJson } from '../lib';
import { SimPool } from '../pool';

const variant = E2_VARIANTS.find((v) => v.id === arg('--variant', 'Ma'))!;
const fit = readJson<any>(`data/fits/e2-${variant.id}.json`);
const best: E2Model = {
  P: { walk: LASIUS_WALK, forager: { ...E2_LEGACY_FORAGER, ...fit.forager }, phys: { ...E2_LEGACY_PHYS, ...fit.phys }, morph: LASIUS_MORPH },
  setup: { accessible: fit.pipetteAccessible, volumeSd: fit.observer.volumeSd },
};
const EVALS = numArg('--evals', 80);
const GRID = [-1, -0.5, 0, 0.5, 1];
const pool = await SimPool.create();
const loss = async (x: number[]) => {
  const m = decode(variant, best, x);
  return e2Loss(await simulateE2Async(m.P, fit.scoutsPerCondition, m.setup, fit.dt, 0, 1, pool.scouts.bind(pool)), 'fit');
};
const x0 = encode(variant, best);
const f0 = await loss(x0);
console.log(`${variant.label}: loss at optimum ${f0.toFixed(2)}; grid offsets ${GRID.join(', ')} (transformed units); ${EVALS} evaluations per re-fit`);
for (const key of arg('--params', variant.free.map((p) => p.key).join(',')).split(',')) {
  const i = variant.free.findIndex((p) => p.key === key);
  if (i < 0) throw new Error(`${key} is not free in ${variant.id}`);
  const row: string[] = [];
  for (const g of GRID) {
    const pinned = x0[i] + g;
    const others = x0.filter((_, j) => j !== i);
    const full = (y: number[]) => [...y.slice(0, i), pinned, ...y.slice(i)];
    const r = g === 0 ? { f: f0, x: others } : await nelderMead((y) => loss(full(y)), others, 0.2, EVALS, 1e-4);
    const value = decode(variant, best, full(r.x));
    const v = key.startsWith('setup.') ? value.setup[key.slice(6) as 'volumeSd'] : (value.P as any)[key.split('.')[0]][key.split('.')[1]];
    row.push(`${Number(v).toPrecision(3)}: Δ${(r.f - f0).toFixed(1)}`);
  }
  console.log(`${key.padEnd(28)} ${row.join('  |  ')}`);
}
pool.close();
