/**
 * Pilot condition 4 (STATUS 2026-10-10 night): is the pilot optimum usable
 * as a gate point? Yes only if the 1-d no-bout fraction is ≤ 2 ×
 * M1999_NO_BOUT_MAX and no fit row has |fitZ| > 5. The pilot is not judged
 * (condition 1): its own seed namespace (the pilot's key 0x9170, a batch
 * distinct from its selection batch), its design, dt and warm-up; only the
 * condition's quantities are printed (no-bout fractions; ids of rows
 * beyond |fitZ| 5), no row values or loss.
 *
 * Usage: npx vite-node scripts/checkPilotM1999.ts [--fit data/fits/colony-m1999-main-shared-pilot.json] [--n 240]
 */
import { M1999_DAYS, M1999_NO_BOUT_MAX, M1999_TARGETS, m1999NoBout, type M1999Day, type M1999Recruiter } from '../src/sim/experiments/colonyMailleux1999';
import { MAILLEUX_SETUP, MAILLEUX_SETUP_E2_ALT } from '../src/sim/species/lasiusM1';
import { arg, numArg, readJson, seedFor } from './lib';
import { SimPool } from './pool';

const FIT = arg('--fit', 'data/fits/colony-m1999-main-shared-pilot.json');
const N = numArg('--n', 240);
const fit = readJson<any>(FIT);
if (fit.tag !== 'pilot') throw new Error(`${FIT} is not a pilot fit`);
const alt = String(fit.layer).startsWith('L0S1 ');
const accessible = (alt ? MAILLEUX_SETUP_E2_ALT : MAILLEUX_SETUP).accessible;
const perNest = fit.design?.recruitersPerNest ?? 4;
const seed = seedFor(1999, 'select', 0x9170, 1);
const pool = await SimPool.create();
const sim = Object.fromEntries(
  await Promise.all(M1999_DAYS.map(async (d) => [d, await pool.m1999Shared(fit.params, { seed, starvationDays: d, density: fit.density1999, pipetteAccessible: accessible, warmup: fit.warmup, dt: fit.dt }, N, perNest)] as const)),
) as Record<M1999Day, M1999Recruiter[]>;
pool.close();
const noBout = M1999_DAYS.map((d) => m1999NoBout(sim[d]));
const beyond = M1999_TARGETS.filter((t) => {
  const v = sim[t.day].map((x) => x[t.stat]).filter(Number.isFinite);
  if (!v.length) return true;
  const m = v.reduce((s, x) => s + x, 0) / v.length;
  return Math.abs((m - t.mean) / (t.sd / Math.sqrt(t.n))) > 5;
}).map((t) => t.id);
const okBout = noBout[0] <= 2 * M1999_NO_BOUT_MAX;
console.log(`dt ${fit.dt}, warm-up ${fit.warmup} s, ${N} recruiters per day, ${perNest} per nest`);
console.log(`no-bout fraction: ${M1999_DAYS.map((d, i) => `${d} d ${(100 * noBout[i]).toFixed(1)} %`).join(', ')} (1-d limit ${(200 * M1999_NO_BOUT_MAX).toFixed(1)} %: ${okBout ? 'met' : 'NOT met'})`);
console.log(`rows with |fitZ| > 5: ${beyond.length ? beyond.join(', ') : 'none'}`);
console.log(`condition 4: ${okBout && !beyond.length ? 'USABLE as gate point' : 'NOT usable'}`);
