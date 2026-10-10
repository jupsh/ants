/**
 * Step 3b held-out test (pre-registered, docs/STATUS.md): run the fitted E2
 * models once on the Mailleux et al. 2003 six-pipette experiment.
 * After this run the 2003 data are development evidence.
 *
 * Usage: npx vite-node scripts/testE2Heldout.ts --fits Ma,Md
 */
import { e2Compare, e2Table, simulateE2Async } from '../../src/sim/experiments/e2Targets';
import { SIX_PRIMARY, SIX_TARGETS, sixPipetteCondition } from '../../src/sim/experiments/e2SixPipettes';
import { E2_LEGACY_FORAGER, LASIUS_MORPH, E2_LEGACY_PHYS, LASIUS_WALK } from '../../src/sim/species/lasiusM1';
import { arg, readJson } from '../lib';
import { SimPool } from '../pool';

const pool = await SimPool.create();
const summary: string[] = [];
for (const id of arg('--fits', 'Ma,Md').split(',')) {
  const fit = readJson<any>(`data/fits/e2-${id}.json`);
  const P = { walk: LASIUS_WALK, forager: { ...E2_LEGACY_FORAGER, ...fit.forager }, phys: { ...E2_LEGACY_PHYS, ...fit.phys }, morph: LASIUS_MORPH };
  const setup = { accessible: fit.pipetteAccessible, volumeSd: fit.observer.volumeSd };
  for (const days of [4, 1, 8]) {
    const sim = await simulateE2Async(P, 150, setup, 0.1, 9_000_000, 10, pool.scouts.bind(pool), [sixPipetteCondition(days)]);
    const rows = e2Compare(sim, SIX_TARGETS);
    const primary = rows.filter((r) => SIX_PRIMARY.includes(r.target.id)).reduce((s, r) => s + r.mean.z ** 2, 0);
    console.log(`\n=== ${fit.label}, ${days} days starved${days === 4 ? ' (primary)' : ' (sensitivity)'}: primary Σz² = ${primary.toFixed(1)}`);
    console.log(e2Table(rows));
    summary.push(`${String(fit.label).padEnd(28)} ${days} d  primary Σz² ${primary.toFixed(1).padStart(6)}  (${rows.filter((r) => SIX_PRIMARY.includes(r.target.id)).map((r) => `${r.target.id.slice(4)} ${r.mean.z.toFixed(1)}`).join(', ')})`);
  }
}
pool.close();
console.log('\n=== Summary\n' + summary.join('\n'));
