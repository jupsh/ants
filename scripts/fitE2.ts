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
 * Withheld (validation, reported only): 2009 overall trail fraction (84 %),
 * second-drop intake 0.28 ± 0.20 µL and
 * drinking time 23 ± 11 s, between-drop times (TL1 58 ± 33 s, nTL1 134 ± 87 s),
 * total 178 ± 83 s.
 *
 * Usage: npx vite-node scripts/fitE2.ts
 */
import fs from 'node:fs';
import { nelderMead } from '../src/sim/analysis/optimize';
import { summarize } from '../src/sim/analysis/trajectory';
import { runScout, type LasiusParams, type ScoutResult } from '../src/sim/experiments/e2Mailleux';
import { LASIUS_FORAGER, LASIUS_MORPH, LASIUS_PHYS, LASIUS_WALK } from '../src/sim/species/lasiusM1';

const N = 150;
const DT = 0.1;
const base: LasiusParams = { walk: LASIUS_WALK, forager: { ...LASIUS_FORAGER }, phys: { ...LASIUS_PHYS }, morph: LASIUS_MORPH };
let accessible = 0.75;

function scouts(P: LasiusParams, opts: Omit<Parameters<typeof runScout>[1], 'seed'>, seed0: number): ScoutResult[] {
  return Array.from({ length: N }, (_, i) => runScout(P, { ...opts, seed: seed0 + i, dt: DT, maxTime: 900 }));
}

function evaluate(P: LasiusParams, acc: number, report = false): number {
  let loss = 0;
  const z = (sim: number, data: number, se: number) => ((sim - data) / se) ** 2;
  const lines: string[] = [];
  const d1999 = [
    { days: 1, drink: 65, sd: 21, n: 63, trail: 0.85, nt: 67 },
    { days: 4, drink: 88, sd: 24, n: 135, trail: 0.94, nt: 141 },
    { days: 8, drink: 93, sd: 23, n: 92, trail: 0.88, nt: 97 },
  ];
  for (const d of d1999) {
    const rs = scouts(P, { drop1: { ul: 3, molar: 0.6 }, pipetteAccessible: acc, starvationDays: d.days }, 1000 * d.days).filter((r) => r.drinks.length);
    const drink = summarize(rs.map((r) => r.drinks[0].time));
    const trail = rs.filter((r) => r.laidTrail).length / rs.length;
    const se = d.sd / Math.sqrt(d.n);
    const seT = Math.sqrt((d.trail * (1 - d.trail)) / d.nt);
    loss += z(drink.mean, d.drink, se) + z(trail, d.trail, seT);
    lines.push(`1999 ${d.days}d: drink ${drink.mean.toFixed(1)}±${drink.sd.toFixed(1)} (data ${d.drink}±${d.sd}); trail ${(trail * 100).toFixed(0)}% (data ${d.trail * 100}%)`);
  }
  const rs = scouts(P, { drop1: { ul: 0.7, molar: 0.6 }, drop2: { ul: 0.7, molar: 0.6 }, pipetteAccessible: acc, starvationDays: 4 }, 50000);
  const first = rs.filter((r) => r.drinks.length);
  const ul1 = summarize(first.map((r) => r.drinks[0].ul));
  const t1 = summarize(first.map((r) => r.drinks[0].time));
  const tl1Frac = first.filter((r) => r.laidSection1).length / Math.max(1, first.length);
  loss += z(ul1.mean, 0.47, 0.25 / Math.sqrt(63)) + z(t1.mean, 51, 12 / Math.sqrt(63)) + z(tl1Frac, 0.38, Math.sqrt((0.38 * 0.62) / 63));
  lines.push(`2009 drop1 trail (fit): ${(tl1Frac * 100).toFixed(0)}% (data 38%)`);
  lines.push(`2009 drop1 (fit): intake ${ul1.mean.toFixed(2)}±${ul1.sd.toFixed(2)} µL (data 0.47±0.25); drink ${t1.mean.toFixed(1)}±${t1.sd.toFixed(1)} s (data 51±12)`);
  if (report) {
    const both = rs.filter((r) => r.drinks.length >= 2);
    const tl1 = both.filter((r) => r.laidSection1);
    const ntl1 = both.filter((r) => !r.laidSection1);
    const s = (xs: number[]) => {
      const q = summarize(xs);
      return `${q.mean.toFixed(2)}±${q.sd.toFixed(2)}`;
    };
    lines.push(`2009 VALIDATION (n=${both.length} found both drops):`);
    lines.push(`  overall ${((both.filter((r) => r.laidTrail).length / both.length) * 100).toFixed(0)}% (data 84%)`);
    lines.push(`  drop 2 intake ${s(both.map((r) => r.drinks[1].ul))} µL (data 0.28±0.20); drink ${s(both.map((r) => r.drinks[1].time))} s (data 23±11)`);
    lines.push(`  between drops: TL1 ${s(tl1.map((r) => r.betweenTime))} s (data 58±33), nTL1 ${s(ntl1.map((r) => r.betweenTime))} s (data 134±87)`);
    lines.push(`  total intake ${s(both.map((r) => r.drinks[0].ul + r.drinks[1].ul))} µL (data 0.75±0.30); total time ${s(both.map((r) => r.total))} s (data 178±83)`);
    console.log(lines.join('\n'));
  }
  return loss;
}

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
console.log('initial loss', evaluate(base, accessible, true).toFixed(2));
const r = nelderMead((x) => {
  const [P, acc] = dec(x);
  return evaluate(P, acc);
}, enc(base, accessible), 0.25, 160, 1e-4, (s) => console.log(`eval ${s.evals} loss ${s.f.toFixed(2)}`));
const [P, acc] = dec(r.x);
console.log('\nfinal loss', evaluate(P, acc, true).toFixed(2));
accessible = acc;
fs.mkdirSync('data/fits', { recursive: true });
fs.writeFileSync(
  'data/fits/e2-drinking.json',
  JSON.stringify({ experiment: 'E2 drinking & trail-laying decision (Mailleux et al. 1999, 2009)', fittedOn: ['1999 drinking times and % trail (1/4/8 days)', '2009 first-drop intake, time and trail fraction'], validatedOn: ['2009 overall trail fraction, second drop, between/total times'], dt: DT, scoutsPerCondition: N, seconds: (Date.now() - t0) / 1000, loss: r.f, forager: Object.fromEntries(keys.map((k) => [k, P.forager[k]])), pipetteAccessible: accessible }, null, 2),
);
console.log('wrote data/fits/e2-drinking.json');
