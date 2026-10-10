/**
 * Step-3c diagnostics (STATUS 2026-10-09), Mailleux 2009 two-drop protocol:
 *   (i) the model's time between drops split by what the scout was doing
 *       (searching vs heading home), by the paper's groups: TL1 laid trail
 *       before drop 2, TL2 started after drop 2, nTL2 never laid;
 *   (ii) the volume–drinking-time regression over both drops (slope and
 *       intercept), against the published 0.006·t + 0.15 µL, and per drop
 *       (slope, intercept, rs), against Mailleux et al.'s equal slopes and
 *       intercepts at the two drops (rs 0.22 / 0.31; STATUS correction);
 *   (iii) scouts that drank at drop 1 but never reached drop 2: satiated at
 *       drop 1 or not, whether they walked past drop 2 without touching it,
 *       and whether they got home or were still out at the time limit;
 *   (iv) the trail-laying group rows (scripts/e2Groups.ts).
 * Writes nothing.
 *
 * Usage: npx vite-node scripts/diagE2Search.ts [--n 600]
 */
import { olsFit, spearman } from '../src/sim/analysis/compare';
import { mailleuxApparatus } from '../src/sim/world/apparatus';
import { runScoutWorld, type ScoutResult } from '../src/sim/experiments/e2Mailleux';
import { LASIUS_PARAMS, MAILLEUX_SETUP } from '../src/sim/species/lasiusM1';
import { groupRows } from './e2Groups';
import { numArg } from './lib';

const N = numArg('--n', 600);
type Row = { r: ScoutResult; search: number; home: number; other: number; satisfied1: boolean; laidBefore2: boolean; minX: number; lastMode: string };
const rows: Row[] = [];
const missed: Row[] = [];
const drop2X = mailleuxApparatus().feeder2[0];
for (let i = 0; i < N; i++) {
  let search = 0;
  let home = 0;
  let other = 0;
  let phase = 0; // 0 before drop 1 ends, 1 between drops, 2 after drop 2 starts
  let laidBefore2 = false;
  let lastMode = '';
  let minX = Infinity;
  const { result: r, world } = runScoutWorld(
    LASIUS_PARAMS,
    { seed: 8_000_000 + i, drop1: { ul: 0.7, molar: 0.6 }, drop2: { ul: 0.7, molar: 0.6 }, pipetteAccessible: MAILLEUX_SETUP.accessible, volumeSd: MAILLEUX_SETUP.volumeSd, desiredScale: MAILLEUX_SETUP.desiredScale2009, starvationDays: 4, dt: 0.1, maxTime: 900 },
    (w) => {
      const a = w.ants[0];
      const mode = a.mind.mode;
      if (phase === 0 && lastMode === 'drink' && mode !== 'drink') phase = 1;
      if (phase === 1 && mode === 'drink') phase = 2;
      if (phase === 1) {
        if (mode === 'search') search += 0.1;
        else if (mode === 'return') home += 0.1;
        else other += 0.1;
        if (a.mind.laying) laidBefore2 = true;
        minX = Math.min(minX, a.body.x);
      }
      lastMode = mode;
    },
  );
  void world;
  const row = { r, search, home, other, satisfied1: r.satisfiedAt1, laidBefore2, minX, lastMode };
  if (r.drinks.length >= 2) rows.push(row);
  else if (r.drinks.length === 1) missed.push(row);
}
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);
const sd = (xs: number[]) => Math.sqrt(xs.reduce((a, x) => a + (x - mean(xs)) ** 2, 0) / Math.max(1, xs.length - 1));
const groups: [string, (x: Row) => boolean, string][] = [
  ['TL1 (laid before drop 2)', (x) => x.r.laidSection1, '58 ± 33 s, n 24'],
  ['TL2 (started after drop 2)', (x) => !x.r.laidSection1 && x.r.laidTrail, '141 ± 89 s, n 29'],
  ['nTL2 (never laid)', (x) => !x.r.laidTrail, '114 ± 83 s, n 10'],
];
console.log(`${rows.length} of ${N} scouts found both drops.\n(i) time between drops: model mean ± SD = searching + heading home + other; data in brackets`);
for (const [name, f, data] of groups) {
  const g = rows.filter(f);
  console.log(`  ${name.padEnd(28)} n ${String(g.length).padStart(3)} (${((100 * g.length) / rows.length).toFixed(0)} %): ${mean(g.map((x) => x.r.betweenTime)).toFixed(0)} ± ${sd(g.map((x) => x.r.betweenTime)).toFixed(0)} s = ${mean(g.map((x) => x.search)).toFixed(0)} + ${mean(g.map((x) => x.home)).toFixed(0)} + ${mean(g.map((x) => x.other)).toFixed(0)}; searched at all ${((100 * g.filter((x) => x.search > 0).length) / Math.max(1, g.length)).toFixed(0)} %; satisfied at drop 1 ${((100 * g.filter((x) => x.satisfied1).length) / Math.max(1, g.length)).toFixed(0)} %   [data ${data}]`);
}
const t: number[] = [];
const v: number[] = [];
for (const x of rows)
  for (const d of x.r.drinks.slice(0, 2)) {
    t.push(d.time);
    v.push(d.ul);
  }
const fit = olsFit(t, v);
console.log(`\n(ii) volume vs drinking time over both drops (estimated volumes): slope ${fit.slope.toFixed(4)} µL/s, intercept ${fit.intercept.toFixed(3)} µL   [data 0.006, 0.15]`);
const perDrop = (j: number) => {
  const tt = rows.map((x) => x.r.drinks[j].time);
  const vv = rows.map((x) => x.r.drinks[j].ul);
  const f = olsFit(tt, vv);
  return `slope ${f.slope.toFixed(4)}, intercept ${f.intercept.toFixed(3)} µL, rs ${spearman(tt, vv).toFixed(2)}`;
};
console.log(`    per drop: drop 1 ${perDrop(0)}; drop 2 ${perDrop(1)}   [data: slopes and intercepts not different between drops (F-tests NS), rs 0.22 / 0.31, pooled 0.006, 0.15]`);
const d2 = rows.map((x) => x.r.drinks[1]);
console.log(`    drop 2: ${mean(d2.map((d) => d.time)).toFixed(0)} ± ${sd(d2.map((d) => d.time)).toFixed(0)} s, ${mean(d2.map((d) => d.ul)).toFixed(2)} ± ${sd(d2.map((d) => d.ul)).toFixed(2)} µL; drop 1: ${mean(rows.map((x) => x.r.drinks[0].time)).toFixed(0)} s, ${mean(rows.map((x) => x.r.drinks[0].ul)).toFixed(2)} µL   [data drop 2 23 ± 11 s, 0.28 ± 0.20 µL; drop 1 51 ± 12 s, 0.47 ± 0.25 µL]`);
const ex2 = rows.filter((x) => x.r.drinks[1].trueUl >= 0.98 * 0.7 * MAILLEUX_SETUP.accessible).length;
console.log(`    drop 2 drunk to exhaustion (≥ 98 % of the accessible volume): ${((100 * ex2) / rows.length).toFixed(0)} %`);

// (iii) Scouts that drank at drop 1 but never reached drop 2.
const pc = (k: number) => `${k} (${((100 * k) / Math.max(1, missed.length)).toFixed(0)} %)`;
console.log(`\n(iii) ${missed.length} scouts drank at drop 1 but never reached drop 2 (${((100 * missed.length) / (missed.length + rows.length)).toFixed(1)} % of those that drank):`);
console.log(`    satiated at drop 1: ${pc(missed.filter((x) => x.satisfied1).length)}; laying before drop 2: ${pc(missed.filter((x) => x.laidBefore2).length)}`);
console.log(`    walked past drop 2 (x < ${drop2X} mm) without touching it: ${pc(missed.filter((x) => x.minX < drop2X - 1).length)}; got home: ${pc(missed.filter((x) => x.r.reachedNest).length)}; still out at the time limit: ${pc(missed.filter((x) => !x.r.reachedNest).length)} (last mode: ${[...new Set(missed.filter((x) => !x.r.reachedNest).map((x) => x.lastMode))].join(', ') || '—'})`);

console.log('\n(iv) trail-laying groups (development, reported only):');
for (const l of groupRows(rows.map((x) => x.r))) console.log(`    ${l}`);
