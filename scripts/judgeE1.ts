/**
 * Judge step-5 E1 candidates against each other (docs/STATUS.md, Decisions
 * 2026-10-08: B pre-registration and review-note amendments). Writes nothing.
 *
 *   (i)  flat-ground loss on the 5 fresh batches stored by fitE1.ts (shared
 *        seeds across variants): paired difference ± SE, and with the
 *        heuristic 2k penalty over stage-1 parameters;
 *   (ii) checks from walkDiagnostics at every incline, all candidates on
 *        identical seeds through the tracking observer: Σ combined-z² over
 *        the decisive set and over all turning statistics.
 *          --checks byspeed (default; for fits with the 15-family loss): the
 *            never-fitted ⟨cos⟩ at 5 and 50 mm and kurtosis by speed bin
 *          --checks loss11 (fits with the old 11-family loss): per-ant
 *            tortuosity–speed slope and big-turn fraction by speed bin
 *
 * Missing statistics (STATUS 2026-10-09): a statistic the data cannot
 * estimate is left out for every candidate; a candidate that cannot
 * estimate a statistic the data can is unjudgeable there and cannot win
 * (previously such z were dropped, which lowered its sum). The fresh flat
 * batches are re-simulated to count missing rows when a fit file predates
 * that record.
 *
 * Usage: npx vite-node scripts/judgeE1.ts --fits A0,B [--ants 2000] [--checks byspeed|loss11]
 */
import { combinedZ, judgedSumZ2 } from '../src/sim/analysis/compare';
import { KHUONG_PREP, prepareTrack } from '../src/sim/analysis/trajectory';
import { compareE1, referenceFor } from '../src/sim/experiments/e1Compare';
import { diagSample, type DiagSample } from '../src/sim/analysis/walkDiagnostics';
import { walkParams } from '../src/sim/models/walk';
import { khuongTracking } from '../src/sim/species/lasiusM1';
import { arg, INCLINES, loadKhuong, numArg, readJson } from './lib';
import { SimPool } from './pool';

const NAMES = arg('--fits', 'A0,B').split(',');
const ANTS = numArg('--ants', 2000);
const fits = NAMES.map((n) => readJson<any>(`data/fits/e1-${n}.json`));

// ---- (i) flat-ground fresh batches
console.log('(i) flat-ground loss, 5 fresh batches of 1000 ants (fit-z):');
const pool = await SimPool.create();
const flatRef = referenceFor(loadKhuong(1));
const flatMissing: number[] = [];
for (const f of fits) {
  let miss: number[] | undefined = f.flatFresh.missing;
  if (!miss) {
    miss = [];
    for (let b = 0; b < 5; b++) {
      const c = compareE1(await pool.e1Sample(walkParams(f.params), { incline: INCLINES[0], ants: 1000, seed: 20131105 + 5000 + b, dt: 0.02, tracking: khuongTracking(1) }), flatRef);
      miss.push(c.missing.length);
    }
  }
  flatMissing.push(miss.reduce((a, v) => a + v, 0));
}
for (const [i, f] of fits.entries()) console.log(`  ${NAMES[i]}: ${flatMissing[i] ? `UNJUDGEABLE (${flatMissing[i]} missing rows over the batches) ` : ''}${f.flatFresh.mean.toFixed(2)} ± ${f.flatFresh.se.toFixed(2)}, k1 ${f.flatFresh.k1}, + 2k1 = ${f.flatFresh.penalised.toFixed(2)}  [${f.flatFresh.batches.map((v: number) => v.toFixed(1)).join(', ')}]`);
for (let i = 1; i < fits.length; i++) {
  const d = fits[i].flatFresh.batches.map((v: number, b: number) => v - fits[0].flatFresh.batches[b]);
  const m = d.reduce((a: number, v: number) => a + v, 0) / d.length;
  const se = Math.sqrt(d.reduce((a: number, v: number) => a + (v - m) ** 2, 0) / (d.length - 1) / d.length);
  const dk = 2 * (fits[i].flatFresh.k1 - fits[0].flatFresh.k1);
  console.log(`  ${NAMES[i]} − ${NAMES[0]}: ${m.toFixed(2)} ± ${se.toFixed(2)} (paired); with penalty ${(m + dk).toFixed(2)}`);
}

// ---- (ii) checks
const BINS = [0, 1, 2, 3, 4];
const TURNING = ['antTurn.slope', 'stopCos.0', 'stopCos.1', ...BINS.flatMap((b) => [`turnBig.${b}`, `turnMed.${b}`, `cos5.${b}`, `cos50.${b}`, `kurt.${b}`])];
const PRIMARY = arg('--checks', 'byspeed') === 'loss11' ? ['antTurn.slope', ...BINS.map((b) => `turnBig.${b}`)] : BINS.flatMap((b) => [`cos5.${b}`, `cos50.${b}`, `kurt.${b}`]);
const zOf = (sim: DiagSample, data: DiagSample, id: string) => {
  const i = data.values.findIndex((v) => v.id === id);
  return combinedZ(sim.values[i].value, sim.se[i], data.values[i].value, data.se[i]);
};
const eligible = (data: DiagSample, id: string) => {
  const i = data.values.findIndex((v) => v.id === id);
  return Number.isFinite(data.values[i].value) && data.se[i] > 0;
};
const judged = (sim: DiagSample, data: DiagSample, ids: string[]) => judgedSumZ2(ids.map((id) => ({ z: zOf(sim, data, id), eligible: eligible(data, id) })));
const show = (j: { sum: number; missing: number }) => (j.missing ? `UNJUDGEABLE (${j.missing} missing; Σz² of the rest ${j.sum.toFixed(1)})` : j.sum.toFixed(1));
console.log(`\n(ii) checks, ${ANTS} simulated ants per incline (Σ z²; primary = ${PRIMARY.join(' ')}):`);
const wins = NAMES.map(() => 0);
for (let k = 1; k <= 5; k++) {
  const raw = loadKhuong(k);
  const data = diagSample(raw, raw.map((t) => prepareTrack(t, KHUONG_PREP)));
  const cells: string[] = [];
  const prim: { sum: number; missing: number }[] = [];
  for (const [i, f] of fits.entries()) {
    const tr = await pool.e1(walkParams(f.params), { incline: INCLINES[k - 1], ants: ANTS, seed: 4242 + k, dt: 0.02, tracking: khuongTracking(k) });
    const sim = diagSample(tr, tr.map((t) => prepareTrack(t, KHUONG_PREP)));
    const p = judged(sim, data, PRIMARY);
    prim.push(p);
    const slope = sim.values.find((v) => v.id === 'antTurn.slope')!.value;
    cells.push(`${NAMES[i]}: primary ${show(p)}, turning ${show(judged(sim, data, TURNING))}, slope ${slope.toFixed(2)}`);
  }
  // An unjudgeable candidate cannot win; a judgeable one beats an unjudgeable baseline.
  for (let i = 1; i < prim.length; i++) if (!prim[i].missing && (prim[0].missing || prim[i].sum < prim[0].sum)) wins[i]++;
  const dSlope = data.values.find((v) => v.id === 'antTurn.slope')!.value;
  console.log(`  incline ${k} (data slope ${dSlope.toFixed(2)}): ${cells.join(' | ')}`);
}
for (let i = 1; i < NAMES.length; i++) console.log(`  ${NAMES[i]} lowers the primary Σz² at ${wins[i]} of 5 inclines (criterion: ≥ 4)`);
pool.close();
