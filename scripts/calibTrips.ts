/**
 * Step 4b inputs (STATUS 2026-10-11, targets revised the same day): the
 * forager trip process, from two statistics measured the same way on data
 * and model over a 12-h phase: the number of complete trips per colony
 * (`trip.n`; mostly sets the exit rate `outRate`) and the share of
 * foragers whose latest detection is in the nest (`foragerIn`; with the
 * rate, sets the time out, `exploreGiveUp`); targets = means over colonies
 * and phases. Solved jointly: a 4 × 4 grid (all 22 fit colonies, 12 h
 * each, in parallel), a quadratic surface per statistic in (log
 * exploreGiveUp, log outRate) and Newton on the surfaces; a confirmation
 * run at the solution, and while it misses either target by more than
 * 0.25 SE_data (≤ 2 refinements) a 3 × 3 grid at half the spacing around
 * it. `trip.mean` and `trip.median` are reported beside the data, not
 * targeted (the fixed give-up timer cannot give the data's skewed trip
 * shape). Motion values: the start point or --fit.
 *
 *   npx vite-node scripts/calibTrips.ts [--fit f] [--warmup 1200] [--obs 43200] [--dt 0.1]
 * Writes data/fits/s2018-trips.json.
 */
import fs from 'node:fs';
import { arg, numArg, provenance, seedFor, writeJson } from './lib';
import { SimPool } from './pool';
import { colonyFromData, loadS2018, S2018_START, s2018Params, simulateAll } from './s2018Lib';

const data = loadS2018();
const avg = (k: string) => (data.across[`${k}.light`].mean + data.across[`${k}.dark`].mean) / 2;
const avgSe = (k: string) => (data.across[`${k}.light`].se + data.across[`${k}.dark`].se) / 2;
const T_N = avg('trip.n');
const T_IN = avg('foragerIn');
const TOL = 0.25;
const fit = arg('--fit', '');
const values = fit ? JSON.parse(fs.readFileSync(fit, 'utf8')).free : S2018_START;
const colonies = data.colonies.map((c) => colonyFromData(c));
const base = { phase: 'light' as const, warmupS: numArg('--warmup', 1200), obsS: numArg('--obs', 12 * 3600), dt: numArg('--dt', 0.1) };
const pool = await SimPool.create();
const t0 = Date.now();
const mean = (v: number[]) => {
  const f = v.filter(Number.isFinite);
  return f.reduce((a, b) => a + b, 0) / f.length;
};
type Point = Awaited<ReturnType<typeof at>>;
/** One point: colony means of the trip count, forager share, trip and stay rows. */
const at = async (explore: number, rate: number, round: number) => {
  const runs = await simulateAll(pool, s2018Params(values, rate), colonies, { ...base, exploreGiveUp: explore }, (i) => seedFor(2018, 'probe', 0x7219, round, i));
  const r = runs.map((x) => x.rows);
  const m = (k: string) => mean(r.map((x) => x[`${k}.light`]));
  return { explore, rate, n: m('trip.n'), foragerIn: m('foragerIn'), tripMean: m('trip.mean'), tripMedian: m('trip.median'), stayMean: m('stay.mean'), stayMedian: m('stay.median') };
};
const show = (p: Point) => console.log(`  exploreGiveUp ${p.explore.toFixed(0)} s, outRate 1/${(1 / p.rate).toFixed(0)} s: trips ${p.n.toFixed(1)}, foragerIn ${p.foragerIn.toFixed(3)}; trip mean ${p.tripMean.toFixed(0)} s, median ${p.tripMedian.toFixed(0)} s; stay mean ${p.stayMean.toFixed(0)} s, median ${p.stayMedian.toFixed(0)} s`);

/** Least squares of y on the quadratic terms of (u, v) = (log explore, log rate). */
const terms = (u: number, v: number) => [1, u, v, u * u, v * v, u * v];
function quadFit(pts: Point[], y: (p: Point) => number): number[] {
  const X = pts.map((p) => terms(Math.log(p.explore), Math.log(p.rate)));
  const k = X[0].length;
  // Normal equations, solved by Gaussian elimination with partial pivoting.
  const A = Array.from({ length: k }, (_, i) => [...Array.from({ length: k }, (_, j) => X.reduce((s, x) => s + x[i] * x[j], 0)), X.reduce((s, x, r) => s + x[i] * y(pts[r]), 0)]);
  for (let c = 0; c < k; c++) {
    const piv = A.slice(c).reduce((b, row, i) => (Math.abs(row[c]) > Math.abs(A[b][c]) ? c + i : b), c);
    [A[c], A[piv]] = [A[piv], A[c]];
    for (let r = 0; r < k; r++) if (r !== c) A[r] = A[r].map((x, j) => x - (A[r][c] / A[c][c]) * A[c][j]);
  }
  return A.map((row, i) => row[k] / row[i]);
}
const evalQ = (b: number[], u: number, v: number) => terms(u, v).reduce((s, t, i) => s + t * b[i], 0);
/** Newton on the two fitted surfaces, scaled by the data SEs, from (u0, v0); clamped to the grid's range. */
function solve(pts: Point[], u0: number, v0: number) {
  const bn = quadFit(pts, (p) => p.n);
  const bi = quadFit(pts, (p) => p.foragerIn);
  const sn = avgSe('trip.n');
  const si = avgSe('foragerIn');
  const us = pts.map((p) => Math.log(p.explore));
  const vs = pts.map((p) => Math.log(p.rate));
  const clamp = (x: number, a: number[]) => Math.min(Math.max(...a), Math.max(Math.min(...a), x));
  let u = u0;
  let v = v0;
  const F = (u: number, v: number) => [(evalQ(bn, u, v) - T_N) / sn, (evalQ(bi, u, v) - T_IN) / si];
  for (let it = 0; it < 50; it++) {
    const f = F(u, v);
    const h = 1e-4;
    const fu = F(u + h, v).map((x, i) => (x - f[i]) / h);
    const fv = F(u, v + h).map((x, i) => (x - f[i]) / h);
    const det = fu[0] * fv[1] - fv[0] * fu[1];
    if (!Number.isFinite(det) || det === 0) break;
    const du = (f[0] * fv[1] - fv[0] * f[1]) / det;
    const dv = (fu[0] * f[1] - f[0] * fu[1]) / det;
    u = clamp(u - du, us);
    v = clamp(v - dv, vs);
    if (Math.hypot(du, dv) < 1e-6) break;
  }
  return { explore: Math.exp(u), rate: Math.exp(v), residualSe: F(u, v) };
}
const miss = (p: Point) => [(p.n - T_N) / avgSe('trip.n'), (p.foragerIn - T_IN) / avgSe('foragerIn')];

console.log(`targets: trips ${T_N.toFixed(1)} per colony per 12 h (SE ${avgSe('trip.n').toFixed(1)}), foragerIn ${T_IN.toFixed(3)} (SE ${avgSe('foragerIn').toFixed(3)}) (means of light and dark); data trip mean ${avg('trip.mean').toFixed(0)} s, median ${avg('trip.median').toFixed(0)} s; dt ${base.dt}; ${pool.size} workers`);
const exploreGrid = [600, 1000, 1600, 2600];
const rateGrid = [1 / 1000, 1 / 2000, 1 / 4000, 1 / 8000];
console.log('round 1: 4 × 4 grid');
const all: Point[] = await Promise.all(exploreGrid.flatMap((e) => rateGrid.map((q) => at(e, q, 1))));
all.forEach(show);
const rounds: { grid: Point[]; solution: ReturnType<typeof solve>; confirmation: Point }[] = [];
let grid = all;
let spacing = { u: Math.log(exploreGrid[1] / exploreGrid[0]), v: Math.log(rateGrid[0] / rateGrid[1]) };
let start = { u: Math.log(1300), v: Math.log(1 / 2800) };
for (let r = 0; ; r++) {
  const s = solve(grid, start.u, start.v);
  console.log(`solution: exploreGiveUp ${s.explore.toFixed(0)} s, outRate 1/${(1 / s.rate).toFixed(0)} s (surface residuals ${s.residualSe.map((x) => x.toFixed(2)).join(', ')} SE)`);
  const c = await at(s.explore, s.rate, 10 + r);
  show(c);
  const m = miss(c);
  console.log(`  confirmation misses: trips ${m[0].toFixed(2)} SE, foragerIn ${m[1].toFixed(2)} SE`);
  rounds.push({ grid, solution: s, confirmation: c });
  if (Math.max(...m.map(Math.abs)) <= TOL || r === 2) break;
  // Refine: a 3 × 3 grid at half the spacing around the solution, fitted together with every point so far.
  spacing = { u: spacing.u / 2, v: spacing.v / 2 };
  const u = Math.log(s.explore);
  const v = Math.log(s.rate);
  console.log(`round ${r + 2}: 3 × 3 grid around the solution`);
  const fine = await Promise.all([-1, 0, 1].flatMap((i) => [-1, 0, 1].map((j) => at(Math.exp(u + i * spacing.u), Math.exp(v + j * spacing.v), 2 + r))));
  fine.forEach(show);
  all.push(c, ...fine);
  grid = [c, ...fine];
  start = { u, v };
}
const last = rounds[rounds.length - 1];
const passed = Math.max(...miss(last.confirmation).map(Math.abs)) <= TOL;
if (!passed) console.log(`NOT within ${TOL} SE after ${rounds.length} rounds`);
writeJson('data/fits/s2018-trips.json', {
  experiment: 'Step 4b inputs: forager trip process (Stroeymeyt 2018 fit colonies)',
  targets: { tripN: T_N, foragerIn: T_IN, se: { tripN: avgSe('trip.n'), foragerIn: avgSe('foragerIn') }, tolSe: TOL },
  reportedOnly: { tripMean: avg('trip.mean'), tripMedian: avg('trip.median') },
  exploreGiveUp: last.solution.explore,
  outRate: last.solution.rate,
  confirmation: last.confirmation,
  passed,
  rounds,
  motion: values,
  window: base,
  seconds: (Date.now() - t0) / 1000,
  provenance: provenance(),
});
console.log(`wrote data/fits/s2018-trips.json (${((Date.now() - t0) / 60000).toFixed(1)} min)`);
pool.close();
