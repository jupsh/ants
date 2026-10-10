/**
 * dt decomposition of the recruiter's stay (STATUS 2026-10-10 night,
 * pre-registered): where does a dt shift in timeInNest / contacts sit? Same
 * design and seeds as `convergeM1999.ts --vary dt` (independent design,
 * warm-up 300 s, paired seeds per point), so it decomposes exactly the
 * recruiters the gate compares. Parts: stay, unload (entry → crop ≤
 * giveFrac × capacity, censored at the stay), after unload, bout time,
 * give-wait, rest, contacts ≥ 1 s (`M1999Parts`). Per day and part: the
 * paired mean difference (level 1 − level 2, seconds or counts) ± its SE
 * over recruiters. Locates a shift; decides nothing. Means are not printed
 * (as in the gate).
 *
 * Usage: npx vite-node scripts/decompM1999.ts [--fit f] [--levels 0.1,0.025] [--n 1600]
 */
import { M1999_DAYS, type M1999Day, type M1999Recruiter } from '../src/sim/experiments/colonyMailleux1999';
import { arg, numArg, seedFor } from './lib';
import { m1999Points } from './m1999Points';
import { SimPool } from './pool';

const N = numArg('--n', 1600);
const LEVELS = arg('--levels', '0.1,0.025').split(',').map(Number);
if (LEVELS.length !== 2) throw new Error('--levels a,b');
const POINTS = m1999Points(arg('--fit', ''));
// The dt gate's seeds (convergeM1999: 'converge' namespace, key 10 for dt, then the point).
const seedOf = (p: number) => seedFor(1999, 'converge', 10, p);

const PARTS: [string, (r: M1999Recruiter) => number][] = [
  ['stay', (r) => r.timeInNest],
  ['unload', (r) => r.parts!.unload],
  ['after unload', (r) => r.timeInNest - r.parts!.unload],
  ['bout time', (r) => r.parts!.bout],
  ['give-wait', (r) => r.parts!.giveWait],
  ['rest', (r) => r.parts!.rest],
  ['contacts ≥ 1 s', (r) => r.contacts],
];

const pool = await SimPool.create();
for (const [p, pt] of POINTS.entries()) {
  const runs: Record<M1999Day, M1999Recruiter[]>[] = [];
  for (const dt of LEVELS) {
    const t0 = Date.now();
    runs.push(Object.fromEntries(await Promise.all(M1999_DAYS.map(async (d) => [d, await pool.m1999(pt.P, { seed: seedOf(p), starvationDays: d, density: pt.density, pipetteAccessible: pt.accessible, warmup: 300, dt, decompose: true }, N)] as const))) as Record<M1999Day, M1999Recruiter[]>);
    console.log(`${pt.label}, dt ${dt}: ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  console.log(`${pt.label}: paired Δ (dt ${LEVELS[0]} − ${LEVELS[1]}) ± SE over ${N} recruiters per day`);
  for (const d of M1999_DAYS) {
    const a = runs[0][d];
    const b = runs[1][d];
    const unl = (xs: M1999Recruiter[]) => (100 * xs.filter((r) => r.parts!.unloaded).length) / xs.length;
    const cells = PARTS.map(([name, f]) => {
      const diff = a.map((r, i) => f(r) - f(b[i])).filter(Number.isFinite);
      const m = diff.reduce((s, x) => s + x, 0) / diff.length;
      const sd = Math.sqrt(diff.reduce((s, x) => s + (x - m) ** 2, 0) / (diff.length - 1));
      return `${name} ${m >= 0 ? '+' : ''}${m.toFixed(2)} ± ${(sd / Math.sqrt(diff.length)).toFixed(2)}`;
    });
    console.log(`  ${d} d: ${cells.join(' · ')} (unloaded ${unl(a).toFixed(0)} / ${unl(b).toFixed(0)} %)`);
  }
}
pool.close();
