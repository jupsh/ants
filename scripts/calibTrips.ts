/**
 * Step 4b inputs: the forager trip process (STATUS 2026-10-11; v2
 * 2026-10-15 late evening: per-trip lognormal give-up time). Three inputs,
 * the give-up time's median `exploreGiveUp` and SD of log `exploreGiveUpSd`
 * and the exit rate `outRate`, calibrated to six statistics measured the
 * same way on data and model over a 12-h phase (comparable censoring): the
 * number of complete trips per colony (`trip.n`), the share of foragers
 * whose latest detection is in the nest (`foragerIn`), and the Kaplan–Meier
 * trip survival S(30 / 120 / 600 / 3600 s) per colony (open trips
 * censored; data: `data/reference/stroeymeyt2018-trips.json`). Targets are
 * means over colonies, averaged over the two phases (one trip process for
 * both; the data's light/dark difference is disclosed, not modelled), with
 * colony-block SEs. Arena detection is independent at the colony rate (an
 * assumption).
 *
 * Solved on quadratic surfaces in (log median, σ, log rate): a 3 × 3 × 3
 * grid (all 22 colonies, 12 h each), the SE-weighted sum of squared misses
 * minimised on the surfaces, then a 3 × 3 × 3 grid at half the spacing
 * around that solution (surfaces refitted on the points so far) and a
 * confirmation run at the final solution. `passed`: every statistic within
 * 1 SE at the confirmation. Trip mean and median rows are reported beside
 * the data. Motion values: the start point or --fit.
 *
 *   npx vite-node scripts/calibTrips.ts [--fit f] [--warmup 1200] [--obs 43200] [--dt 0.1]
 * Writes data/fits/s2018-trips.json. Its first run (2026-10-15 late
 * evening) did not pass and was not adopted (logs/trips/calibTrips2-failed.json):
 * the inputs in use are still v1's (fixed give-up time, 2026-10-11; v1 is
 * in git history before this version).
 */
import fs from 'node:fs';
import { kmSurvival } from '../src/sim/analysis/inNest';
import { nelderMead } from '../src/sim/analysis/optimize';
import { arg, numArg, provenance, readJson, seedFor, writeJson } from './lib';
import { SimPool } from './pool';
import { colonyFromData, loadS2018, S2018_START, s2018Params, simulateAll } from './s2018Lib';

const data = loadS2018();
const ref = readJson<{ colonies: Record<string, Record<'light' | 'dark', { trips: number[]; open: number[] }>> }>('data/reference/stroeymeyt2018-trips.json').colonies;
const XS = [30, 120, 600, 3600];
const PHASES = ['light', 'dark'] as const;
const meanOf = (v: number[]) => {
  const f = v.filter(Number.isFinite);
  return f.reduce((a, b) => a + b, 0) / f.length;
};
const seOf = (v: number[]) => {
  const m = meanOf(v);
  return Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / (v.length - 1) / v.length);
};
// Targets: means over colonies per phase, averaged over phases; SE likewise.
const avg = (k: string) => (data.across[`${k}.light`].mean + data.across[`${k}.dark`].mean) / 2;
const avgSe = (k: string) => (data.across[`${k}.light`].se + data.across[`${k}.dark`].se) / 2;
const km = PHASES.map((p) => data.colonies.map((c) => kmSurvival(ref[c.colony][p].trips, ref[c.colony][p].open, XS)));
const TARGETS = [
  { key: 'trip.n', T: avg('trip.n'), se: avgSe('trip.n') },
  { key: 'foragerIn', T: avg('foragerIn'), se: avgSe('foragerIn') },
  ...XS.map((x, j) => ({ key: `S(${x} s)`, T: (meanOf(km[0].map((s) => s[j])) + meanOf(km[1].map((s) => s[j]))) / 2, se: (seOf(km[0].map((s) => s[j])) + seOf(km[1].map((s) => s[j]))) / 2 })),
];
const TOL = 1;
const fit = arg('--fit', '');
const values = fit ? JSON.parse(fs.readFileSync(fit, 'utf8')).free : S2018_START;
const colonies = data.colonies.map((c) => colonyFromData(c));
const base = { phase: 'light' as const, warmupS: numArg('--warmup', 1200), obsS: numArg('--obs', 12 * 3600), dt: numArg('--dt', 0.1) };
const pool = await SimPool.create();
const t0 = Date.now();

type Point = Awaited<ReturnType<typeof at>>;
/** One point: the six statistics (colony means), and the trip and stay rows for the report. */
const at = async (median: number, sd: number, rate: number, round: number) => {
  const runs = await simulateAll(pool, s2018Params(values, rate), colonies, { ...base, exploreGiveUp: median, exploreGiveUpSd: sd }, (i) => seedFor(2018, 'probe', 0x7219, round, i));
  const m = (k: string) => meanOf(runs.map((x) => x.rows[`${k}.light`]));
  const s = runs.map((x) => kmSurvival(x.trips.trips, x.trips.open, XS));
  const y = [m('trip.n'), m('foragerIn'), ...XS.map((_, j) => meanOf(s.map((v) => v[j])))];
  return { median, sd, rate, y, tripMean: m('trip.mean'), tripMedian: m('trip.median'), stayMean: m('stay.mean'), stayMedian: m('stay.median') };
};
const z = (p: Point) => p.y.map((y, k) => (y - TARGETS[k].T) / TARGETS[k].se);
const show = (p: Point) =>
  console.log(`  median ${p.median.toFixed(0)} s, σ ${p.sd.toFixed(2)}, outRate 1/${(1 / p.rate).toFixed(0)} s: ${TARGETS.map((t, k) => `${t.key} ${p.y[k].toFixed(t.key === 'trip.n' ? 1 : 3)}`).join(', ')}; z ${z(p).map((x) => x.toFixed(1)).join(' ')}; trip mean ${p.tripMean.toFixed(0)} s, median ${p.tripMedian.toFixed(0)} s`);

/** Least squares of y on the quadratic terms of q = (log median, σ, log rate). */
const terms = (q: number[]) => [1, ...q, ...q.map((a, i) => q.slice(i).map((b) => a * b)).flat()];
const coords = (p: Point) => [Math.log(p.median), p.sd, Math.log(p.rate)];
function quadFit(pts: Point[], k: number): number[] {
  const X = pts.map((p) => terms(coords(p)));
  const n = X[0].length;
  const A = Array.from({ length: n }, (_, i) => [...Array.from({ length: n }, (_, j) => X.reduce((s, x) => s + x[i] * x[j], 0)), X.reduce((s, x, r) => s + x[i] * pts[r].y[k], 0)]);
  for (let c = 0; c < n; c++) {
    const piv = A.slice(c).reduce((b, row, i) => (Math.abs(row[c]) > Math.abs(A[b][c]) ? c + i : b), c);
    [A[c], A[piv]] = [A[piv], A[c]];
    for (let r = 0; r < n; r++) if (r !== c) A[r] = A[r].map((x, j) => x - (A[r][c] / A[c][c]) * A[c][j]);
  }
  return A.map((row, i) => row[n] / row[i]);
}
/** Minimise the SE-weighted squared misses on the surfaces, inside the points' range. */
async function solve(pts: Point[], q0: number[]) {
  const B = TARGETS.map((_, k) => quadFit(pts, k));
  const lo = [0, 1, 2].map((d) => Math.min(...pts.map((p) => coords(p)[d])));
  const hi = [0, 1, 2].map((d) => Math.max(...pts.map((p) => coords(p)[d])));
  const clamp = (q: number[]) => q.map((x, d) => Math.min(hi[d], Math.max(lo[d], x)));
  const pred = (q: number[]) => B.map((b) => terms(q).reduce((s, t, i) => s + t * b[i], 0));
  const J = (q: number[]) => pred(clamp(q)).reduce((s, y, k) => s + ((y - TARGETS[k].T) / TARGETS[k].se) ** 2, 0);
  const r = await nelderMead(J, q0, 0.2, 4000, 1e-10);
  const q = clamp(r.x);
  return { median: Math.exp(q[0]), sd: q[1], rate: Math.exp(q[2]), predictedZ: pred(q).map((y, k) => (y - TARGETS[k].T) / TARGETS[k].se), J: J(q) };
}

console.log(`targets (means over colonies, light and dark averaged): ${TARGETS.map((t) => `${t.key} ${t.T.toFixed(3)} ± ${t.se.toFixed(3)}`).join(', ')}; data trip mean ${avg('trip.mean').toFixed(0)} s, median ${avg('trip.median').toFixed(0)} s; dt ${base.dt}; ${pool.size} workers`);
const grid3 = (c: number[], h: number[]) => [-1, 0, 1].flatMap((i) => [-1, 0, 1].flatMap((j) => [-1, 0, 1].map((k) => [c[0] + i * h[0], c[1] + j * h[1], c[2] + k * h[2]])));
const runGrid = (qs: number[][], round: number) => Promise.all(qs.map((q) => at(Math.exp(q[0]), q[1], Math.exp(q[2]), round)));
let centre = [Math.log(200), 1.8, Math.log(1 / 4000)];
let h = [Math.log(3), 0.6, Math.log(2.5)];
console.log('round 1: 3 × 3 × 3 grid');
const all: Point[] = await runGrid(grid3(centre, h), 1);
all.forEach(show);
let s = await solve(all, centre);
console.log(`surface solution: median ${s.median.toFixed(0)} s, σ ${s.sd.toFixed(2)}, outRate 1/${(1 / s.rate).toFixed(0)} s; predicted z ${s.predictedZ.map((x) => x.toFixed(2)).join(' ')}`);
centre = [Math.log(s.median), s.sd, Math.log(s.rate)];
h = h.map((x) => x / 2);
console.log('round 2: 3 × 3 × 3 grid at half the spacing around it');
const fine = await runGrid(grid3(centre, h), 2);
fine.forEach(show);
all.push(...fine);
s = await solve(fine, centre);
console.log(`surface solution: median ${s.median.toFixed(0)} s, σ ${s.sd.toFixed(2)}, outRate 1/${(1 / s.rate).toFixed(0)} s; predicted z ${s.predictedZ.map((x) => x.toFixed(2)).join(' ')}`);
const conf = await at(s.median, s.sd, s.rate, 10);
console.log('confirmation:');
show(conf);
const passed = Math.max(...z(conf).map(Math.abs)) <= TOL;
if (!passed) console.log(`NOT every statistic within ${TOL} SE at the confirmation`);
writeJson('data/fits/s2018-trips.json', {
  experiment: 'Step 4b inputs: forager trip process (Stroeymeyt 2018 fit colonies), v2: per-trip lognormal give-up time',
  targets: { stats: TARGETS, tolSe: TOL, phases: 'light and dark averaged' },
  reportedOnly: { tripMean: avg('trip.mean'), tripMedian: avg('trip.median') },
  exploreGiveUp: s.median,
  exploreGiveUpSd: s.sd,
  outRate: s.rate,
  confirmation: { ...conf, z: z(conf) },
  surface: s,
  passed,
  grid: all,
  motion: values,
  window: base,
  seconds: (Date.now() - t0) / 1000,
  provenance: provenance(),
});
console.log(`wrote data/fits/s2018-trips.json (${((Date.now() - t0) / 60000).toFixed(1)} min)`);
await pool.close();
