/**
 * Step-4b fit report (STATUS 2026-10-16): the Stroeymeyt 2018 fit rows at a
 * fitted point against the start point, from two `diagS2018` outputs at
 * the same settings and 'diag' seeds (`--reps` runs per colony). Writes
 * nothing.
 *
 * Per fit row and phase: data ± SE_data, simulated mean ± SE_sim (seed
 * noise within colonies: SE_sim² = Σ_c s_c² / R / C²), fitZ (SE_data only,
 * the fit's weights) and combinedZ (SE_data ⊕ SE_sim, for judging). Then
 * the trade: per row the change in |z| from start to estimate, paired over
 * runs (same seeds, other parameters), so rows that got worse while the
 * loss fell are listed. Parameters: values, position in the fit box,
 * those at a bound. Trip statistics from `calibTrips --check --out` if
 * given.
 *
 *   npx vite-node scripts/reportS2018.ts --est logs/c1/diag-est.json --start logs/c1/diag-start.json
 *     [--fit data/fits/s2018-motion-c1.json] [--trips-est f] [--trips-start f]
 */
import fs from 'node:fs';
import { combinedZ, fitZ } from '../src/sim/analysis/compare';
import { S2018_FREE } from '../src/sim/experiments/stroeymeytTargets';
import { arg, readJson } from './lib';
import { s2018TargetsFromData } from './s2018Lib';

interface Diag { source: string; values: Record<string, number>; reps: number; loss: number; window: { warmup: number; obs: number; dt: number }; perColony: { colony: string; rows: Record<string, number> }[] }
const est = readJson<Diag>(arg('--est', 'logs/c1/diag-est.json'));
const start = readJson<Diag>(arg('--start', 'logs/c1/diag-start.json'));
const FIT = arg('--fit', '');
if (JSON.stringify(est.window) !== JSON.stringify(start.window) || est.reps !== start.reps || est.perColony.length !== start.perColony.length)
  throw new Error('estimate and start diagnostics differ in window, reps or runs: not paired');
const targets = s2018TargetsFromData();

/** Mean over runs, SE_sim from the within-colony spread across seeds (NaN with one seed), runs kept for pairing. */
function summary(d: Diag, simId: string) {
  const byColony = new Map<string, number[]>();
  for (const p of d.perColony) {
    const v = p.rows[simId];
    if (Number.isFinite(v)) byColony.set(p.colony, [...(byColony.get(p.colony) ?? []), v]);
  }
  const all = [...byColony.values()].flat();
  const mean = all.reduce((a, b) => a + b, 0) / all.length;
  let varSum = 0;
  let C = 0;
  for (const v of byColony.values()) {
    C++;
    if (v.length < 2) return { mean, se: NaN, runs: d.perColony.map((p) => p.rows[simId]) };
    const m = v.reduce((a, b) => a + b, 0) / v.length;
    varSum += v.reduce((a, b) => a + (b - m) ** 2, 0) / (v.length - 1) / v.length;
  }
  return { mean, se: Math.sqrt(varSum) / C, runs: d.perColony.map((p) => p.rows[simId]) };
}

const f = (x: number, d = 3) => (Number.isFinite(x) ? (Math.abs(x) >= 100 ? x.toFixed(0) : x.toPrecision(d)) : '—');
const z1 = (x: number) => (Number.isFinite(x) ? x.toFixed(1) : '—');
console.log(`estimate: ${est.source}`);
console.log(`start:    ${start.source}`);
console.log(`window ${est.window.warmup} + ${est.window.obs} s, dt ${est.window.dt}, ${est.reps} seed(s) per colony, ${est.perColony.length} runs each`);
console.log(`loss (debiased fitZ², ${targets.length} targets): estimate ${est.loss.toFixed(1)}, start ${start.loss.toFixed(1)}`);
console.log('reference points: light/dark floor ≈ 16; right up to sampling noise ≈ 30–50; every target at 2 SE ≈ 130, at 3 SE ≈ 290\n');

const rows = [...new Set(targets.map((t) => t.simId))].map((simId) => {
  const e = summary(est, simId);
  const s = summary(start, simId);
  const ts = targets.filter((t) => t.simId === simId);
  const per = ts.map((t) => ({
    phase: t.id.endsWith('.dark') ? 'dark' : 'light',
    data: t.mean,
    seData: t.se,
    zFit: fitZ(e.mean, t.mean, t.se),
    zComb: combinedZ(e.mean, e.se, t.mean, t.se),
    zStart: fitZ(s.mean, t.mean, t.se),
  }));
  // Paired change, in units of the smaller SE_data: estimate − start per run (same seed index), 90 % normal interval.
  const seRef = Math.min(...ts.map((t) => t.se));
  const d = e.runs.map((x, i) => (x - s.runs[i]) / seRef).filter(Number.isFinite);
  const dm = d.reduce((a, b) => a + b, 0) / d.length;
  const dse = Math.sqrt(d.reduce((a, b) => a + (b - dm) ** 2, 0) / (d.length - 1) / d.length);
  const absNow = Math.sqrt(per.reduce((a, p) => a + p.zFit ** 2, 0) / per.length);
  const absStart = Math.sqrt(per.reduce((a, p) => a + p.zStart ** 2, 0) / per.length);
  return { row: simId.replace(/\.light$/, ''), sim: e.mean, seSim: e.se, simStart: s.mean, per, shift: dm, shiftSe: dse, rmsZ: absNow, rmsZStart: absStart };
});

console.log('Per row at the estimate (z = fitZ, SE_data only; zc = combined, SE_data ⊕ SE_sim), worst first');
console.log(['row'.padEnd(22), 'data L ± SE'.padEnd(18), 'data D ± SE'.padEnd(18), 'sim ± SE_sim'.padEnd(18), 'z L', 'zc L', 'z D', 'zc D'].join('  '));
for (const r of [...rows].sort((a, b) => b.rmsZ - a.rmsZ)) {
  const L = r.per.find((p) => p.phase === 'light')!;
  const D = r.per.find((p) => p.phase === 'dark')!;
  console.log([r.row.padEnd(22), `${f(L.data)} ± ${f(L.seData, 2)}`.padEnd(18), `${f(D.data)} ± ${f(D.seData, 2)}`.padEnd(18), `${f(r.sim)} ± ${f(r.seSim, 2)}`.padEnd(18), z1(L.zFit).padStart(5), z1(L.zComb).padStart(5), z1(D.zFit).padStart(5), z1(D.zComb).padStart(5)].join('  '));
}
const zc = rows.flatMap((r) => r.per.map((p) => Math.abs(p.zComb))).filter(Number.isFinite);
console.log(zc.length ? `combined |z| ≤ 2: ${zc.filter((z) => z <= 2).length} of ${zc.length}; ≤ 3: ${zc.filter((z) => z <= 3).length}; > 3: ${zc.filter((z) => z > 3).length}\n` : 'combined z: needs ≥ 2 seeds per colony\n');

console.log('Trade, start → estimate (rms fitZ over the two phases; shift = estimate − start in the smaller SE_data, paired over runs, ± 1.645 SE)');
for (const r of [...rows].sort((a, b) => b.rmsZ - b.rmsZStart - (a.rmsZ - a.rmsZStart))) {
  const tag = r.rmsZ > r.rmsZStart + 0.5 ? 'WORSE' : r.rmsZ < r.rmsZStart - 0.5 ? 'better' : '';
  console.log(`  ${r.row.padEnd(22)} |z| ${z1(r.rmsZStart).padStart(6)} → ${z1(r.rmsZ).padStart(6)}  sim ${f(r.simStart)} → ${f(r.sim)}  shift ${r.shift.toFixed(2)} ± ${(1.645 * r.shiftSe).toFixed(2)}  ${tag}`);
}

if (FIT) {
  const fit = readJson<{ free: Record<string, number>; atBound: string[]; selectionLoss: number; runs: number[]; runDetails: { label: string; phase: number; generations: number; finalSigma: number; stopReason: string; converged: boolean; f: number }[] }>(FIT);
  console.log(`\nFit ${FIT}: selection-batch loss ${fit.selectionLoss.toFixed(1)}; runs ${fit.runDetails.map((r) => `${r.label} (phase ${r.phase}, ${r.generations} gen, σ ${r.finalSigma.toFixed(2)}, ${r.stopReason}${r.converged ? '' : ', not converged'}, f ${r.f.toFixed(1)})`).join('; ')}`);
  console.log('Parameters (unit = position in the fit box, log scale where the fit uses one):');
  for (const p of S2018_FREE) {
    const v = fit.free[p.key];
    const u = p.log ? Math.log(v / p.lo) / Math.log(p.hi / p.lo) : (v - p.lo) / (p.hi - p.lo);
    const startV = start.values[p.key];
    console.log(`  ${p.key.padEnd(26)} ${f(v).padStart(8)}  [${p.lo}, ${p.hi}]  unit ${u.toFixed(3)}  start ${f(startV)}${u < 0.02 || u > 0.98 ? '  AT/NEAR BOUND' : ''}`);
  }
  console.log(`  at a bound (fit's own rule): ${fit.atBound.length ? fit.atBound.join(', ') : 'none'}`);
}

for (const [label, path] of [['estimate', arg('--trips-est', '')], ['start', arg('--trips-start', '')]] as const) {
  if (!path || !fs.existsSync(path)) continue;
  const t = readJson<{ window: unknown; reps: number; stats: { key: string; data: number; seData: number; sim: number; seSim: number; fitZ: number; combinedZ: number }[] }>(path);
  console.log(`\nTrips at the ${label} (${path}; window ${JSON.stringify(t.window)}, ${t.reps} seeds per colony):`);
  for (const s of t.stats) console.log(`  ${s.key.padEnd(10)} data ${f(s.data)} ± ${f(s.seData, 2)}  sim ${f(s.sim)} ± ${f(s.seSim, 2)}  z ${z1(s.fitZ)}  zc ${z1(s.combinedZ)}`);
}
