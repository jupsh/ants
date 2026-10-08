/**
 * Fit the L. niger drinking / trail-laying decision to Mailleux et al. data.
 *
 * Fit targets (independent of apparatus geometry):
 *   - 1999: drinking time at a 3 µL 0.6 M drop after 1, 4, 8 days of
 *     starvation (65 ± 21, 88 ± 24, 93 ± 23 s; n = 63, 135, 92) and the
 *     proportion of scouts laying trail (85, 94, 88 %; n = 67, 141, 97).
 *   - 2009: first-drop intake 0.47 ± 0.25 µL, drinking time 51 ± 12 s and
 *     trail fraction after drop 1 (38 %) (n = 63) — the latter identifies
 *     the unsatisfied-laying probability.
 * Development (reported, never fitted; inspected, so not held out): 2009 overall trail fraction (84 %),
 * second-drop intake 0.28 ± 0.20 µL and
 * drinking time 23 ± 11 s, between-drop times (TL1 58 ± 33 s, nTL1 134 ± 87 s),
 * total 178 ± 83 s.
 *
 * Usage: npx vite-node scripts/fitE2.ts
 */
import fs from 'node:fs';
import { nelderMead } from '../src/sim/analysis/optimize';
import type { LasiusParams } from '../src/sim/experiments/e2Mailleux';
import { e2Compare, e2Loss, e2Table, simulateE2 } from '../src/sim/experiments/e2Targets';
import { LASIUS_FORAGER, LASIUS_MORPH, LASIUS_PHYS, LASIUS_WALK } from '../src/sim/species/lasiusM1';

const N = 150;
const DT = 0.1;
const base: LasiusParams = { walk: LASIUS_WALK, forager: { ...LASIUS_FORAGER }, phys: { ...LASIUS_PHYS }, morph: LASIUS_MORPH };
let accessible = 0.75;

/** Fitting objective (targets and seeds shared with tests and UI via e2Targets). */
const evaluate = (P: LasiusParams, acc: number) => e2Loss(simulateE2(P, N, acc, DT), 'fit');

/** Judge with the combined-SE criteria: 10 fresh seed blocks of N scouts. */
const report = (P: LasiusParams, acc: number) => console.log(e2Table(e2Compare(simulateE2(P, N, acc, DT, 7_000_000, 10))));

const keys = ['desiredFed', 'desiredHungry', 'desiredSd', 'stopHazard', 'unsatisfiedLayProb'] as const;
const logit = (p: number) => Math.log(p / (1 - p));
const sig = (x: number) => 1 / (1 + Math.exp(-x));
const enc = (P: LasiusParams, acc: number) => [...keys.map((k) => (k === 'unsatisfiedLayProb' ? logit(P.forager[k]) : Math.log(P.forager[k]))), logit(acc)];
const dec = (x: number[]): [LasiusParams, number] => {
  const f = { ...base.forager };
  keys.forEach((k, i) => (f[k] = k === 'unsatisfiedLayProb' ? sig(x[i]) : Math.exp(x[i])));
  return [{ ...base, forager: f }, 1 / (1 + Math.exp(-x[keys.length]))];
};
const t0 = Date.now();
console.log('initial loss', evaluate(base, accessible).toFixed(2));
report(base, accessible);
const r = nelderMead((x) => {
  const [P, acc] = dec(x);
  return evaluate(P, acc);
}, enc(base, accessible), 0.25, 160, 1e-4, (s) => console.log(`eval ${s.evals} loss ${s.f.toFixed(2)}`));
const [P, acc] = dec(r.x);
console.log('\nfinal loss', evaluate(P, acc).toFixed(2));
report(P, acc);
accessible = acc;
fs.mkdirSync('data/fits', { recursive: true });
fs.writeFileSync(
  'data/fits/e2-drinking.json',
  JSON.stringify({ experiment: 'E2 drinking & trail-laying decision (Mailleux et al. 1999, 2009)', fittedOn: ['1999 drinking times and % trail (1/4/8 days)', '2009 first-drop intake, time and trail fraction'], developmentOn: ['2009 overall trail fraction, second drop, between/total times'], dt: DT, scoutsPerCondition: N, seconds: (Date.now() - t0) / 1000, loss: r.f, forager: Object.fromEntries(keys.map((k) => [k, P.forager[k]])), pipetteAccessible: accessible }, null, 2),
);
console.log('wrote data/fits/e2-drinking.json');
