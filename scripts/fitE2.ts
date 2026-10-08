/**
 * Fit an E2 model variant (src/sim/experiments/e2Variants.ts) to the
 * Mailleux et al. targets marked "fit" in e2Targets.ts:
 *   - 1999: drinking time and % trail at a 3 µL drop after 1, 4, 8 days;
 *   - 2009: drop-1 intake, drinking time and trail fraction; the pooled
 *     volume–time regression (slope, Spearman r).
 * Development rows and the between-ant SDs are reported, never fitted.
 *
 * Objective: Σ z² with SE_data only; 150 scouts per condition; common random
 * numbers; 160 Nelder–Mead evaluations (the step-3 budget, same for all
 * variants).
 *
 * Usage: npx vite-node scripts/fitE2.ts --variant Ma|Mb|Mc|Mc0|Md
 * Writes data/fits/e2-<variant>.json.
 */
import fs from 'node:fs';
import { nelderMead } from '../src/sim/analysis/optimize';
import { e2Compare, e2Loss, e2Table, simulateE2Async, E2_TARGETS } from '../src/sim/experiments/e2Targets';
import { decode, encode, freeValues, E2_VARIANTS, type E2Model } from '../src/sim/experiments/e2Variants';
import { LASIUS_FORAGER, LASIUS_MORPH, LASIUS_PHYS, LASIUS_WALK } from '../src/sim/species/lasiusM1';
import { arg, readJson } from './lib';
import { SimPool } from './pool';

const N = 150;
const DT = 0.1;
const BUDGET = 160;
const variant = E2_VARIANTS.find((v) => v.id === arg('--variant', 'Ma'));
if (!variant) throw new Error(`unknown variant; use one of ${E2_VARIANTS.map((v) => v.id).join(', ')}`);

// Starting points: the session-1 M_a fit for the M_a family; published values for M_b.
const prev = readJson<any>('data/fits/e2-drinking.json');
const base: E2Model = {
  P: { walk: LASIUS_WALK, forager: { ...LASIUS_FORAGER, ...prev.forager }, phys: { ...LASIUS_PHYS, intakeSd: 0.2 }, morph: LASIUS_MORPH },
  setup: { accessible: prev.pipetteAccessible ?? 0.75, volumeSd: 0.2 },
};
const start = variant.id === 'Mb' ? { ...base, P: { ...base.P, forager: { ...base.P.forager, desiredFed: 0.57, desiredHungry: 0.88, stopEta: 4.3 } } } : base;

const pool = await SimPool.create();
const run = pool.scouts.bind(pool);
const loss = async (m: E2Model) => e2Loss(await simulateE2Async(m.P, N, m.setup, DT, 0, 1, run), 'fit');
const t0 = Date.now();
const x0 = encode(variant, variant.fix(start));
console.log(`${variant.label}: ${variant.free.length} free parameters; start loss ${(await loss(decode(variant, start, x0))).toFixed(2)}`);
const r = await nelderMead((x) => loss(decode(variant, start, x)), x0, 0.25, BUDGET, 1e-4, (s) => console.log(`eval ${s.evals} loss ${s.f.toFixed(2)}`));
const best = decode(variant, start, r.x);
const k = variant.free.length;
console.log(`\nfinal fit loss ${r.f.toFixed(2)}, k = ${k}, loss + 2k = ${(r.f + 2 * k).toFixed(2)}`);
console.log(Object.entries(freeValues(variant, best)).map(([key, v]) => `${key} = ${v.toPrecision(3)}`).join(', '));
// Judge on fresh seeds (10 blocks) with the combined-SE criteria.
console.log(e2Table(e2Compare(await simulateE2Async(best.P, N, best.setup, DT, 7_000_000, 10, run))));
fs.mkdirSync('data/fits', { recursive: true });
fs.writeFileSync(
  `data/fits/e2-${variant.id}.json`,
  JSON.stringify(
    {
      experiment: 'E2 drinking & trail-laying decision (Mailleux et al. 1999, 2009)',
      variant: variant.id,
      label: variant.label,
      description: variant.description,
      fittedOn: E2_TARGETS.filter((t) => t.role === 'fit').map((t) => t.id),
      dt: DT,
      scoutsPerCondition: N,
      evals: r.evals,
      seconds: (Date.now() - t0) / 1000,
      loss: r.f,
      k,
      free: freeValues(variant, best),
      forager: best.P.forager,
      phys: { intakeSd: best.P.phys.intakeSd },
      pipetteAccessible: best.setup.accessible,
      observer: { volumeSd: best.setup.volumeSd },
    },
    null,
    2,
  ),
);
console.log(`wrote data/fits/e2-${variant.id}.json`);
pool.close();
