/**
 * E1 model selection, A0 vs T (DRAFT rule, STATUS 2026-10-09: to be agreed
 * with the user before any pilot data set or the real data are judged).
 * The same code judges the real Khuong data and synthetic data sets (model
 * recovery: both models fitted to data from each), so the rule that is
 * calibrated is the rule that is used. Writes nothing.
 *
 *   (a) Objective: the fit loss (15 families, fit-z) on 5 fresh batches of
 *       1000 ants at each fit incline (0°, 30°, 60°), the same seeds for
 *       both models; per batch the sum over the three inclines. Met if the
 *       paired difference T − A0 plus the heuristic penalty 2Δk is below
 *       −2 SE of the paired difference.
 *   (b) Never-fitted checks: Σ combined-z² over the CHECKS rows, 2000
 *       simulated ants per model and incline (same seeds for both), at all
 *       five inclines. Met if T's sum is lower at ≥ 4 of 5.
 *   T preferred: (a) and (b) met; A0 kept: neither; inconclusive: one.
 *   Missing statistics: a statistic the data cannot estimate is left out for
 *   both; a model that cannot estimate one the data can is unjudgeable in
 *   that comparison and cannot win it (STATUS 2026-10-09).
 *
 * Usage: npx vite-node scripts/selectE1.ts --a fitA0.json --b fitT.json
 *   Real data (Khuong) unless both fits are recovery fits of the same data
 *   set (same truth file, rep and size), which is then regenerated exactly
 *   as fitE1.ts made it.
 */
import { combinedZ, judgedSumZ2 } from '../../src/sim/analysis/compare';
import { STOP_IDS, stopCheckSample } from '../../src/sim/analysis/e1StopChecks';
import { TURN_IDS, turnCheckSample } from '../../src/sim/analysis/e1TurnChecks';
import { KHUONG_PREP, prepareTrack, type Track } from '../../src/sim/analysis/trajectory';
import { diagSample } from '../../src/sim/analysis/walkDiagnostics';
import { compareE1, referenceFor, scaleReference, type E1Reference } from '../../src/sim/experiments/e1Compare';
import { walkParams } from '../../src/sim/models/walk';
import { khuongTracking } from '../../src/sim/species/lasiusM1';
import { arg, INCLINES, loadKhuong, numArg, readJson } from '../lib';
import { SimPool } from '../pool';

const FA = arg('--a', 'data/fits/e1-A0.json');
const FB = arg('--b', 'data/fits/e1-T.json');
const fa = readJson<any>(FA);
const fb = readJson<any>(FB);
const FIT_INCLINES = [0, 2, 4];
/** Defaults are the rule; smaller values only for smoke tests. */
const BATCHES = numArg('--batches', 5);
const CHECK_ANTS = numArg('--checkAnts', 2000);
const BATCH_ANTS = numArg('--batchAnts', 1000);
const SEED = 20131105;

/** The pre-registered never-fitted checks (draft), by id. */
const BINS = [0, 1, 2, 3, 4];
const DIAG_CHECKS = BINS.flatMap((b) => [`cos5.${b}`, `cos50.${b}`, `kurt.${b}`]);
const TURN_CHECKS = ['turnSpeed.dip', 'turnSpeed.shoulders', 'turnSpeed.asym', ...TURN_IDS.filter((id) => id.startsWith('stopRate.'))];
const STOP_CHECKS = [...STOP_IDS.filter((id) => id.startsWith('stopCosFine.')), 'stopOutHome', 'stopOutHomeLong', 'slopeWithinArc', 'slopeWithinDisp'];
const STOP_CLEAN_CHECKS = ['slopeWithinArc', 'slopeWithinDisp'];

// ---- The data: real, or the recovery data set both fits were made on.
const ra = fa.recovery;
const rb = fb.recovery;
if (!!ra !== !!rb || (ra && (ra.truth !== rb.truth || ra.rep !== rb.rep || ra.antsPerIncline !== rb.antsPerIncline))) throw new Error('the two fits were not made on the same data');
const pool = await SimPool.create();
const opts = (i: number, ants: number, seed: number) => ({ incline: INCLINES[i], ants, seed, dt: 0.02, tracking: khuongTracking(i + 1) });
const raw: Track[][] = [];
for (let i = 0; i < 5; i++) raw.push(ra ? await pool.e1(walkParams(readJson<any>(ra.truth).params), opts(i, ra.antsPerIncline, 777000 + 10 * ra.rep + i + 1)) : loadKhuong(i + 1));
const refs: E1Reference[] = raw.map((tr) => (ra && ra.antsPerIncline > 69 ? scaleReference(referenceFor(tr), 69) : referenceFor(tr)));
console.log(`data: ${ra ? `synthetic, truth ${ra.truth}, rep ${ra.rep}, ${ra.antsPerIncline} ants per incline` : 'Khuong et al. 2013'}`);
console.log(`A = ${FA} (${fa.variant}, k ${fa.k}), B = ${FB} (${fb.variant}, k ${fb.k})`);

// ---- (a) objective on fresh batches
const batchLoss = async (f: any) => {
  const p = walkParams(f.params);
  const out: { loss: number; missing: number }[] = [];
  for (let b = 0; b < BATCHES; b++) {
    let loss = 0;
    let missing = 0;
    for (const i of FIT_INCLINES) {
      const c = compareE1(await pool.e1Sample(p, opts(i, BATCH_ANTS, SEED + 5000 + b)), refs[i]);
      loss += c.loss;
      missing += c.missing.length;
    }
    out.push({ loss, missing });
  }
  return out;
};
const la = await batchLoss(fa);
const lb = await batchLoss(fb);
const missA = la.reduce((s, x) => s + x.missing, 0);
const missB = lb.reduce((s, x) => s + x.missing, 0);
const d = lb.map((x, b) => x.loss - la[b].loss);
const dm = d.reduce((s, v) => s + v, 0) / BATCHES;
const dse = Math.sqrt(d.reduce((s, v) => s + (v - dm) ** 2, 0) / (BATCHES - 1) / BATCHES);
const pen = 2 * (fb.k - fa.k);
const aMet = !missB && (missA > 0 || dm + pen < -2 * dse);
console.log(`\n(a) fit loss summed over 0°/30°/60°, ${BATCHES} fresh batches of ${BATCH_ANTS} ants:`);
console.log(`  A ${(la.reduce((s, x) => s + x.loss, 0) / BATCHES).toFixed(2)}${missA ? ` UNJUDGEABLE (${missA} missing rows)` : ''}, B ${(lb.reduce((s, x) => s + x.loss, 0) / BATCHES).toFixed(2)}${missB ? ` UNJUDGEABLE (${missB} missing rows)` : ''}`);
console.log(`  B − A = ${dm.toFixed(2)} ± ${dse.toFixed(2)} (paired), + 2Δk = ${(dm + pen).toFixed(2)}; margin ${((dm + pen) / dse).toFixed(1)} SE → ${aMet ? 'met' : 'not met'}`);

// ---- (b) never-fitted checks
const checkRows = async (tracks: Track[]) => {
  const diag = diagSample(tracks, tracks.map((t) => prepareTrack(t, KHUONG_PREP)));
  const turn = turnCheckSample(tracks);
  const stop = stopCheckSample(tracks);
  const clean = stopCheckSample(tracks, true);
  const m = new Map<string, [number, number]>();
  diag.values.forEach((v, i) => DIAG_CHECKS.includes(v.id) && m.set(v.id, [v.value, diag.se[i]]));
  TURN_IDS.forEach((id, i) => TURN_CHECKS.includes(id) && m.set(id, [turn.v[i], turn.se[i]]));
  STOP_IDS.forEach((id, i) => STOP_CHECKS.includes(id) && m.set(id, [stop.v[i], stop.se[i]]));
  STOP_IDS.forEach((id, i) => STOP_CLEAN_CHECKS.includes(id) && m.set(`${id}.clean`, [clean.v[i], clean.se[i]]));
  return m;
};
console.log(`\n(b) never-fitted checks, Σ combined z², ${CHECK_ANTS} simulated ants per model and incline:`);
let wins = 0;
for (let i = 0; i < 5; i++) {
  const data = await checkRows(raw[i]);
  const sums = [];
  for (const f of [fa, fb]) {
    const sim = await checkRows(await pool.e1(walkParams(f.params), opts(i, CHECK_ANTS, 4242 + i + 1)));
    sums.push(judgedSumZ2([...data].map(([id, [v, se]]) => ({ z: combinedZ(sim.get(id)![0], sim.get(id)![1], v, se), eligible: Number.isFinite(v) && se > 0 }))));
  }
  const [sa, sb] = sums;
  const win = !sb.missing && (sa.missing > 0 || sb.sum < sa.sum);
  if (win) wins++;
  const show = (j: { sum: number; missing: number }) => (j.missing ? `UNJUDGEABLE (${j.missing} missing; rest ${j.sum.toFixed(1)})` : j.sum.toFixed(1));
  console.log(`  incline ${i + 1} (${((INCLINES[i] * 180) / Math.PI).toFixed(0)}°): A ${show(sa)}, B ${show(sb)} → ${win ? 'B lower' : 'B not lower'}`);
}
const bMet = wins >= 4;
console.log(`  B lower at ${wins} of 5 → ${bMet ? 'met' : 'not met'}`);
const outcome = aMet && bMet ? `${fb.variant} preferred` : !aMet && !bMet ? `${fa.variant} kept` : 'inconclusive';
console.log(`\noutcome: ${outcome}${ra ? ` (data from ${ra.truth})` : ''}`);
pool.close();
