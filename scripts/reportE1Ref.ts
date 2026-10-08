/**
 * Our E1 walkers vs the published reference walkers (STATUS decisions log
 * 2026-10-08, "Reference baselines for E1"): Khuong et al. 2013's sectored
 * walker (`khuong`, arena-axis sectors, every incline) and Bonavita et al.
 * 2026's Φu walker (`bonavita`, sectors relative to the start, flat ground
 * only), both as published (`compat`) and with the two quirks fixed (`*`).
 * All simulated tracks pass through the same tracking observer and the same
 * statistics. Writes nothing.
 *
 * The reference walkers resample the Khuong segments themselves, so they are
 * judged in-sample at every incline.
 *
 * Usage: npx vite-node scripts/reportE1Ref.ts [--fits walk,A0,T] [--ants 600] [--incline k] [--show regex]
 *          [--segments data/reference/khuong-segments-alt.json]
 *   --show      also print every compareE1 row whose label matches (data, sim, z)
 *   --segments  segment pools (default khuong-segments.json; -alt.json is the
 *               pre-registered alternative slope threshold, STATUS 2026-10-08)
 */
import { combinedZ, verdict } from '../src/sim/analysis/compare';
import { KHUONG_PREP, prepareTrack, type Track } from '../src/sim/analysis/trajectory';
import { diagSample, type DiagSample } from '../src/sim/analysis/walkDiagnostics';
import { compareE1, referenceFor, sampleFor, scalarSE } from '../src/sim/experiments/e1Compare';
import { walkParams } from '../src/sim/models/walk';
import type { SectorFrame } from '../src/sim/reference/sectoredWalker';
import { khuongTracking } from '../src/sim/species/lasiusM1';
import { arg, INCLINES, loadKhuong, loadKhuongPools, numArg, readJson } from './lib';
import { SimPool } from './pool';

const FITS = arg('--fits', 'walk').split(',').filter(Boolean);
const ANTS = numArg('--ants', 600);
const ONLY = numArg('--incline', 0);
const SHOW = arg('--show', '');
const SEGMENTS = arg('--segments', 'data/reference/khuong-segments.json');
const ROLE = ['fit', 'development', 'fit', 'development', 'fit'];
const BINS = [0, 1, 2, 3, 4];
const PRIMARY = BINS.flatMap((b) => [`cos5.${b}`, `cos50.${b}`, `kurt.${b}`]);
const TURNING = ['antTurn.slope', 'stopCos.0', 'stopCos.1', ...BINS.flatMap((b) => [`turnBig.${b}`, `turnMed.${b}`, `cos5.${b}`, `cos50.${b}`, `kurt.${b}`])];

interface Model {
  name: string;
  run: (k: number, seed: number) => Promise<Track[]>;
  flatOnly?: boolean;
}

const pool = await SimPool.create();
const models: Model[] = FITS.map((f) => {
  const p = walkParams(readJson<any>(`data/fits/e1-${f}.json`).params);
  return { name: f, run: (k, seed) => pool.e1(p, { incline: INCLINES[k - 1], ants: ANTS, seed, dt: 0.02, tracking: khuongTracking(k) }) };
});
const ref = (name: string, frame: SectorFrame, compat: boolean, flatOnly = false): Model => ({
  name,
  flatOnly,
  run: (k, seed) => pool.sectored(loadKhuongPools(k, frame, SEGMENTS), { ants: ANTS, seed, compat, tracking: khuongTracking(k) }),
});
models.push(ref('khuong', 'xy', true), ref('khuong*', 'xy', false), ref('bonavita', 'start', true, true), ref('bonavita*', 'start', false, true));

const ss = (zs: number[]) => zs.filter(Number.isFinite).reduce((a, z) => a + z * z, 0);
const prep = (tr: Track[]) => tr.map((t) => prepareTrack(t, KHUONG_PREP));
const zOf = (sim: DiagSample, data: DiagSample, id: string) => {
  const i = data.values.findIndex((v) => v.id === id);
  return combinedZ(sim.values[i].value, sim.se[i], data.values[i].value, data.se[i]);
};

console.log(`${ANTS} simulated ants per model and incline; z = combined (SE_data ⊕ SE_sim); segments ${SEGMENTS}.`);
console.log('columns: loss = E1 fit objective (fit-z, 15 families); Σz² and off/marg over all compareE1 rows; primary = Σz² of the by-speed checks (cos5, cos50, kurtosis); turning = Σz² of all turning checks');
for (let k = 1; k <= 5; k++) {
  if (ONLY && k !== ONLY) continue;
  const raw = loadKhuong(k);
  const reference = referenceFor(raw);
  const data = diagSample(raw, prep(raw));
  console.log(`\nincline ${k} (${((INCLINES[k - 1] * 180) / Math.PI).toFixed(0)}°, ${ROLE[k - 1]})`);
  console.log(`  ${'model'.padEnd(10)}${'loss'.padStart(8)}${'Σz²'.padStart(9)}${'off'.padStart(5)}${'marg'.padStart(6)}${'primary'.padStart(9)}${'turning'.padStart(9)}   worst rows`);
  for (const m of models) {
    if (m.flatOnly && k !== 1) continue;
    const tracks = await m.run(k, 20261008 + k);
    const sample = sampleFor(tracks);
    const c = compareE1(sample, reference, scalarSE(sample));
    const zs = c.rows.map((r) => r.z);
    const off = zs.filter((z) => verdict(z) === 'off').length;
    const marg = zs.filter((z) => verdict(z) === 'marginal').length;
    const sim = diagSample(tracks, prep(tracks));
    const worst = [...c.rows].sort((a, b) => Math.abs(b.z) - Math.abs(a.z)).slice(0, 3).map((r) => `${r.label} ${r.z.toFixed(1)}`).join('; ');
    if (SHOW) for (const r of c.rows.filter((r) => new RegExp(SHOW).test(r.label))) console.log(`      ${m.name.padEnd(10)} ${r.label}: data ${r.data.toPrecision(3)}, sim ${r.sim.toPrecision(3)}, z ${r.z.toFixed(1)}`);
    console.log(`  ${m.name.padEnd(10)}${c.loss.toFixed(1).padStart(8)}${ss(zs).toFixed(0).padStart(9)}${String(off).padStart(5)}${String(marg).padStart(6)}${ss(PRIMARY.map((id) => zOf(sim, data, id))).toFixed(0).padStart(9)}${ss(TURNING.map((id) => zOf(sim, data, id))).toFixed(0).padStart(9)}   ${worst}`);
  }
}
pool.close();
