/**
 * Judge the current E2 fit against Mailleux et al. 1999/2009 with the
 * combined-SE criteria (docs/STATUS.md, Evidence policy § Criteria).
 * Writes nothing.
 *
 * --walk f: replace the E1 walk parameters by those of fit file f (E2
 * sensitivity to plausible walkers, the E1 stopping condition; STATUS
 * 2026-10-08). The E2 parameters stay as adopted (no refit).
 *
 * Usage: npx vite-node scripts/reportE2.ts [--alt] [--out f.json] [--n 150] [--blocks 10] [--walk data/fits/e1-A0.json] [--seed 7000000]
 */
import { e2Compare, e2Table, simulateE2Async } from '../src/sim/experiments/e2Targets';
import { LASIUS_PARAMS, LASIUS_PARAMS_E2_ALT, MAILLEUX_SETUP, MAILLEUX_SETUP_E2_ALT } from '../src/sim/species/lasiusM1';
import { walkParams } from '../src/sim/models/walk';
import { arg, numArg, readJson, writeJson } from './lib';
import { SimPool } from './pool';

const t0 = Date.now();
const WALK = arg('--walk', '');
// --alt: the alternative E2 layer (L0S1) instead of the main one (L0S1c).
const ALT = process.argv.includes('--alt');
const base = ALT ? LASIUS_PARAMS_E2_ALT : LASIUS_PARAMS;
const params = WALK ? { ...base, walk: walkParams(readJson<any>(WALK).params) } : LASIUS_PARAMS;
if (WALK) console.log(`walk parameters from ${WALK}`);
const pool = await SimPool.create();
const sim = await simulateE2Async(params, numArg('--n', 150), ALT ? MAILLEUX_SETUP_E2_ALT : MAILLEUX_SETUP, 0.1, numArg('--seed', 7_000_000), numArg('--blocks', 10), pool.scouts.bind(pool));
pool.close();
const rows = e2Compare(sim);
console.log(e2Table(rows));
// --out f: the comparison rows as JSON (before/after checks).
if (arg('--out', '')) writeJson(arg('--out', ''), rows);
console.log(`found both drops: ${(sim['two.foundBoth'].mean * 100).toFixed(0)}%  [${((Date.now() - t0) / 1000).toFixed(0)} s]`);
