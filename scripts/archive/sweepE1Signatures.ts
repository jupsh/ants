/**
 * Signature table with reachability (STATUS 2026-10-09, step 2). For each
 * model, parameter sets drawn uniformly in the fit's bounded coordinates
 * (scripts/e1Specs.ts), a small simulated sample each, and the mechanism
 * signatures computed with the same code as for the data: can the model
 * produce the data's value at any parameters, and does the fitted model?
 * Writes nothing (prints the table; --out f saves every set's values).
 *
 * Usage: npx vite-node scripts/sweepE1Signatures.ts [--sets 300] [--ants 150] [--fitAnts 2000] [--inclines 1,5] [--out f.json]
 */
import { STOP_IDS, stopCheckSample } from '../../src/sim/analysis/e1StopChecks';
import { TURN_IDS, turnCheckSample } from '../../src/sim/analysis/e1TurnChecks';
import { KHUONG_PREP, prepareTrack, type Track } from '../../src/sim/analysis/trajectory';
import { diagSample } from '../../src/sim/analysis/walkDiagnostics';
import { RNG } from '../../src/sim/core/rng';
import { sampleFor } from '../../src/sim/experiments/e1Compare';
import { walkParams, type WalkParams } from '../../src/sim/models/walk';
import { khuongTracking } from '../../src/sim/species/lasiusM1';
import { decode, encode, logit, specsFor } from '../e1Specs';
import { arg, INCLINES, loadKhuong, numArg, readJson, writeJson } from '../lib';
import { SimPool } from '../pool';

/** Uniform draws over the fit ranges, plus local draws around the fitted point (STATUS 2026-10-09 amendment). */
const SETS = numArg('--sets', 150);
const LOCAL = numArg('--local', 150);
const LOCAL_SD = 0.7;
const ANTS = numArg('--ants', 150);
const FIT_ANTS = numArg('--fitAnts', 2000);
const KS = arg('--inclines', '1,5').split(',').map(Number);
const OUT = arg('--out', '');

/** Signatures: [id, label, used for the verdict]. */
const SIGS: [string, string, boolean][] = [
  ['stopCosFine.0', 'stop ⟨cos⟩ in/out, < 0.13 s (pipeline geometry; not used)', false],
  ['stopCosFine.1', 'stop ⟨cos⟩ in/out, 0.13–0.25 s', true],
  ['stopCosFine.2', 'stop ⟨cos⟩ in/out, 0.25–0.41 s', true],
  ['stopCosFine.3', 'stop ⟨cos⟩ in/out, 0.41–0.81 s', true],
  ['stopCosFine.4', 'stop ⟨cos⟩ in/out, 0.81–1.61 s', true],
  ['turnSpeed.dip', 'speed dip at big turns (min speed / baseline)', true],
  ['turnSpeed.shoulders', 'speed 1–2 s from a big turn / baseline', true],
  ['turnSpeed.asym', 'speed asymmetry before − after a big turn', true],
  ['slopeWithinArc', 'within-ant speed–turning slope (arc speed)', true],
  ['slopeWithinArc.clean', 'within-ant slope, stop-adjacent segments out', true],
  ['antTurn.slope', 'between-ant speed–turning slope', true],
];

/** Signature values (and SEs; `reps` 0 = values only, for the sampled sets) plus the plausibility quantities of a set of raw tracks. */
function signatures(tracks: Track[], reps = 200) {
  const stop = stopCheckSample(tracks, false, reps);
  const clean = stopCheckSample(tracks, true, reps);
  const turn = turnCheckSample(tracks, reps);
  const diag = diagSample(tracks, tracks.map((t) => prepareTrack(t, KHUONG_PREP)), reps);
  const v = new Map<string, [number, number]>();
  STOP_IDS.forEach((id, i) => v.set(id, [stop.v[i], stop.se[i]]));
  STOP_IDS.forEach((id, i) => v.set(`${id}.clean`, [clean.v[i], clean.se[i]]));
  TURN_IDS.forEach((id, i) => v.set(id, [turn.v[i], turn.se[i]]));
  diag.values.forEach((d, i) => v.set(d.id, [d.value, diag.se[i]]));
  const st = sampleFor(tracks).stats;
  const sp = [...st.speeds].sort((a, b) => a - b);
  return { v, median: sp.length ? sp[sp.length >> 1] : NaN, stopped: st.stoppedFraction };
}

const pool = await SimPool.create();
const opts = (k: number, ants: number, seed: number) => ({ incline: INCLINES[k - 1], ants, seed, dt: 0.02, tracking: khuongTracking(k) });
const pct = (xs: number[], p: number) => {
  const a = xs.filter(Number.isFinite).sort((x, y) => x - y);
  return a.length ? a[Math.min(a.length - 1, Math.round(p * (a.length - 1)))] : NaN;
};
const f = (x: number, d = 2) => (Number.isFinite(x) ? x.toFixed(d) : '—');
const saved: Record<string, unknown> = {};

for (const k of KS) {
  const data = signatures(loadKhuong(k));
  console.log(`\n=== incline ${k} (${((INCLINES[k - 1] * 180) / Math.PI).toFixed(0)}°): data median speed ${f(data.median, 1)} mm/s, stopped ${f(data.stopped)}`);
  const rows: Record<string, string[]> = Object.fromEntries(SIGS.map(([id]) => [id, []]));
  for (const variant of ['A0', 'T']) {
    const fit = walkParams(readJson<any>(`data/fits/e1-${variant}.json`).params);
    const { S1, S2 } = specsFor(variant);
    const specs = [...S1, ...S2];
    const rng = new RNG(20261009);
    const sets: { p: WalkParams; s: ReturnType<typeof signatures> }[] = [];
    const x0 = encode(specs)(fit);
    for (let j = 0; j < SETS + LOCAL; j++) {
      const x = j < SETS ? specs.map(() => logit(0.001 + 0.998 * rng.next())) : x0.map((v) => v + LOCAL_SD * rng.gauss());
      const p = decode(specs)(x, fit);
      sets.push({ p, s: signatures(await pool.e1(p, opts(k, ANTS, 900000 + j)), 0) });
      if ((j + 1) % 50 === 0) console.log(`  ${variant}: ${j + 1} of ${SETS + LOCAL} sets`);
    }
    const plausible = sets.filter(({ s }) => Math.abs(s.median / data.median - 1) <= 0.3 && Math.abs(s.stopped / data.stopped - 1) <= 0.3);
    const fitted = signatures(await pool.e1(fit, opts(k, FIT_ANTS, 4242 + k)));
    console.log(`  ${variant}: ${plausible.length} of ${SETS + LOCAL} sets plausible (${plausible.filter((x) => sets.indexOf(x) < SETS).length} uniform) (median speed and stopped fraction within ±30 %)`);
    for (const [id] of SIGS) {
      const [dv, dse] = data.v.get(id)!;
      const all = sets.map(({ s }) => s.v.get(id)![0]);
      const pl = plausible.map(({ s }) => s.v.get(id)![0]);
      const reach = (xs: number[]) => xs.some((x) => Math.abs(x - dv) <= 2 * dse);
      const [fv, fse] = fitted.v.get(id)!;
      const z = (fv - dv) / Math.hypot(fse, dse);
      rows[id].push(
        `${variant}: fitted ${f(fv)} (z ${f(z, 1)}); reachable ${f(pct(all, 0.05))}…${f(pct(all, 0.95))} [${f(Math.min(...all.filter(Number.isFinite)))}, ${f(Math.max(...all.filter(Number.isFinite)))}] ${reach(all) ? 'contains data' : 'NOT FOUND'}; plausible ${f(pct(pl, 0.05))}…${f(pct(pl, 0.95))} ${pl.length ? (reach(pl) ? 'contains data' : 'NOT FOUND') : '(none)'}`,
      );
    }
    if (OUT) saved[`${variant}.incline${k}`] = sets.map(({ p, s }) => ({ p, median: s.median, stopped: s.stopped, sig: Object.fromEntries(SIGS.map(([id]) => [id, s.v.get(id)![0]])) }));
  }
  for (const [id, label, used] of SIGS) {
    const [dv, dse] = data.v.get(id)!;
    console.log(`  ${label}${used ? '' : ' [not used]'}: data ${f(dv)} ± ${f(dse)}`);
    for (const r of rows[id]) console.log(`      ${r}`);
  }
}
if (OUT) writeJson(OUT, saved);
pool.close();
