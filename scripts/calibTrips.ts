/**
 * Step 4b inputs (STATUS 2026-10-11): the forager trip process, from two
 * statistics measured the same way on data and model over a 12-h phase:
 * the mean duration of complete trips (`trip.mean`, sets `exploreGiveUp`)
 * and the share of foragers whose latest detection is in the nest
 * (`foragerIn`, sets `outRate`); targets = means over colonies and phases.
 * Three rounds on all 22 fit colonies, each round's grid in parallel:
 * exploreGiveUp at a guessed rate, outRate at the interpolated
 * exploreGiveUp, then a confirmation at both. Motion values: the start
 * point or --fit.
 *
 *   npx vite-node scripts/calibTrips.ts [--fit f] [--warmup 1200] [--obs 43200]
 * Writes data/fits/s2018-trips.json.
 */
import fs from 'node:fs';
import { arg, numArg, provenance, seedFor, writeJson } from './lib';
import { SimPool } from './pool';
import { colonyFromData, loadS2018, S2018_START, s2018Params, simulateAll } from './s2018Lib';

const data = loadS2018();
const avg = (k: string) => (data.across[`${k}.light`].mean + data.across[`${k}.dark`].mean) / 2;
const T_TRIP = avg('trip.mean');
const T_IN = avg('foragerIn');
const fit = arg('--fit', '');
const values = fit ? JSON.parse(fs.readFileSync(fit, 'utf8')).free : S2018_START;
const colonies = data.colonies.map(colonyFromData);
const base = { phase: 'light' as const, warmupS: numArg('--warmup', 1200), obsS: numArg('--obs', 12 * 3600), dt: 0.1 };
const pool = await SimPool.create();
const t0 = Date.now();
const mean = (v: number[]) => {
  const f = v.filter(Number.isFinite);
  return f.reduce((a, b) => a + b, 0) / f.length;
};
/** One point: colony means of the trip mean, forager share and stay rows. */
const at = async (explore: number, rate: number, round: number) => {
  const runs = await simulateAll(pool, s2018Params(values, rate), colonies, { ...base, exploreGiveUp: explore }, (i) => seedFor(2018, 'probe', 0x7219, round, i));
  const r = runs.map((x) => x.rows);
  return { explore, rate, trip: mean(r.map((x) => x['trip.mean.light'])), foragerIn: mean(r.map((x) => x['foragerIn.light'])), stayMean: mean(r.map((x) => x['stay.mean.light'])), stayMedian: mean(r.map((x) => x['stay.median.light'])) };
};
/** Interpolate x where y crosses the target, in log x, between the bracketing grid points. */
function cross(pts: { x: number; y: number }[], target: number): number {
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    if ((a.y - target) * (b.y - target) <= 0 && a.y !== b.y) return Math.exp(Math.log(a.x) + ((target - a.y) / (b.y - a.y)) * (Math.log(b.x) - Math.log(a.x)));
  }
  throw new Error(`target ${target} not bracketed: ${pts.map((p) => `${p.x.toPrecision(3)}→${p.y.toFixed(3)}`).join(', ')}`);
}
const show = (p: Awaited<ReturnType<typeof at>>) => console.log(`  exploreGiveUp ${p.explore.toFixed(0)} s, outRate 1/${(1 / p.rate).toFixed(0)} s: trip mean ${p.trip.toFixed(0)} s, foragerIn ${p.foragerIn.toFixed(3)}, stay mean ${p.stayMean.toFixed(0)} s, median ${p.stayMedian.toFixed(0)} s`);
console.log(`targets: trip mean ${T_TRIP.toFixed(0)} s, foragerIn ${T_IN.toFixed(3)} (means of light and dark); ${pool.size} workers`);

const RATE0 = 1 / 2000;
const exploreGrid = [60, 150, 300, 500, 800, 1200, 1800, 2700];
console.log('round 1: exploreGiveUp');
const r1 = await Promise.all(exploreGrid.map((e) => at(e, RATE0, 1)));
r1.forEach(show);
const explore = cross(r1.map((p) => ({ x: p.explore, y: p.trip })), T_TRIP);
const rateGrid = [1 / 250, 1 / 500, 1 / 1000, 1 / 2000, 1 / 4000, 1 / 8000, 1 / 16000, 1 / 32000];
console.log(`round 2: outRate at exploreGiveUp ${explore.toFixed(0)} s`);
const r2 = await Promise.all(rateGrid.map((q) => at(explore, q, 2)));
r2.forEach(show);
const rate = cross(r2.map((p) => ({ x: p.rate, y: p.foragerIn })), T_IN);
console.log('round 3: confirmation');
const r3 = await at(explore, rate, 3);
show(r3);
writeJson('data/fits/s2018-trips.json', {
  experiment: 'Step 4b inputs: forager trip process (Stroeymeyt 2018 fit colonies)',
  targets: { tripMean: T_TRIP, foragerIn: T_IN },
  exploreGiveUp: explore,
  outRate: rate,
  confirmation: r3,
  rounds: { r1, r2 },
  motion: values,
  window: base,
  seconds: (Date.now() - t0) / 1000,
  provenance: provenance(),
});
console.log(`wrote data/fits/s2018-trips.json (${((Date.now() - t0) / 60000).toFixed(1)} min)`);
pool.close();
