/**
 * Judge a Mailleux 1999 colony calibration (STATUS 2026-10-09/10, frozen
 * rule): fresh seeds (the judging namespace, never used by a fit; STATUS
 * 2026-10-10), the fit's design, 240 recruiters per day, followed for
 * Table 2b. Fit rows: judging z (SE_data ⊕ SE_sim, 10 blocks); adequate =
 * every fit row |z| ≤ 3, at most 2 of 15 in (2, 3], and on every day at
 * most M1999_NO_BOUT_MAX (≈ 11 %) of recruiters without a bout (added
 * 2026-10-10, user decision, before any refit was judged).
 *
 * The model is the fit file's recorded parameter set (`params`); a fit
 * made under other simulation code (`provenance.simHash`) is refused
 * unless --allow-code-change is given (then judged under the current
 * code, with a warning). Older files without `params` are rebuilt from the
 * current defaults plus their nest parameters, with a warning.
 * Checks: between-recruiter SDs (log-SD z). Development (reported only):
 * Table 2b, and "all recruiters leave within 20 min". Writes nothing.
 *
 * Step 5 (D104): `--roles nurse` (all-nurse nestmates), `--contactMin s`, `--set nest.k=v,…` (e.g. giveUpTime) and
 * `--oracle coupled:κ:τ_c|placebo:sd:τ_c` judge the fit's point under a sensitivity or the synchrony gate; `--out f`
 * writes the rows (read by `syncGateM1999.ts`). The fit's `lazyRest` is followed (bit-identical), except under the
 * oracle, which it refuses. Condition 4 (|fitZ| ≤ 5) and the 5 % bound check (unit scale, as `s2018AtBound`) are
 * printed for the adoption rule.
 *
 * Usage: npx vite-node scripts/reportM1999.ts --fit data/fits/colony-m1999-<layer>-shared.json [--n 240] [--allow-code-change]
 *   [--roles nurse] [--contactMin s] [--set nest.k=v,…] [--oracle spec] [--out f.json]
 */
import { binomialSE, fitZ, logSdZ, verdict } from '../src/sim/analysis/compare';
import type { ColonyParams } from '../src/sim/experiments/colonyBles';
import { M1999_DAYS, M1999_FREE, M1999_LEAVE, M1999_NO_BOUT_MAX, m1999Compare, m1999NoBout, type M1999Day, type M1999Recruiter } from '../src/sim/experiments/colonyMailleux1999';
import { LASIUS_NEST, LASIUS_PARAMS, LASIUS_PARAMS_E2_ALT, MAILLEUX_SETUP, MAILLEUX_SETUP_E2_ALT } from '../src/sim/species/lasiusM1';
import { arg, flag, numArg, readJson, seedFor, writeJson } from './lib';
import { simHash } from './simHash';
import { SimPool } from './pool';

const FIT = arg('--fit', '');
if (!FIT) throw new Error('--fit data/fits/colony-m1999-<layer>.json required');
const N = numArg('--n', 240);
const SEED = seedFor(1999, 'judge');
const fit = readJson<any>(FIT);
const alt = String(fit.layer).startsWith('L0S1 ');
const hash = simHash();
if (!fit.provenance) console.warn(`WARNING: ${FIT} records no code hash; it may have been fitted under other code.`);
else if (fit.provenance.simHash !== hash) {
  const msg = `${FIT} was fitted under simulation code ${fit.provenance.simHash} (commit ${fit.provenance.commit}${fit.provenance.dirty ? ', dirty' : ''}); current code is ${hash}.`;
  if (!flag('--allow-code-change')) throw new Error(`${msg} Refusing to judge it under changed code (--allow-code-change to override).`);
  console.warn(`WARNING: ${msg} Judged under the current code.`);
}
if (!fit.params) console.warn(`WARNING: ${FIT} records no parameter set; rebuilt from the current defaults and its nest parameters.`);
const P0: ColonyParams = fit.params ?? { ...(alt ? LASIUS_PARAMS_E2_ALT : LASIUS_PARAMS), nest: { ...LASIUS_NEST, ...fit.nest } };
// Sensitivities (D104): all-nurse nestmates (the recruiter keeps the forager trait), and nest keys set by --set.
const ROLES = arg('--roles', '');
if (ROLES && ROLES !== 'nurse') throw new Error('--roles nurse');
const SET = Object.fromEntries(
  arg('--set', '')
    .split(',')
    .filter(Boolean)
    .map((kv) => {
      const [k, v] = kv.split('=');
      if (!k.startsWith('nest.') || !(k.slice(5) in P0.nest) || !Number.isFinite(Number(v))) throw new Error(`--set ${kv}: nest.<numeric key>=<number>`);
      return [k.slice(5), Number(v)];
    }),
);
const P: ColonyParams = { ...P0, nest: { ...P0.nest, ...SET, ...(ROLES === 'nurse' ? { foragerFrac: 0 } : {}) } };
const CONTACT_MIN = numArg('--contactMin', fit.contactMin);
const ORC = arg('--oracle', '');
const oracle = ORC
  ? ((kind: string, a: string, b: string) => {
      if (kind === 'coupled') return { kind, kappa: Number(a), tauC: Number(b) } as const;
      if (kind === 'placebo') return { kind, sd: Number(a), tauC: Number(b) } as const;
      throw new Error(`--oracle ${ORC}: coupled:κ:τ_c or placebo:sd:τ_c`);
    })(...(ORC.split(':') as [string, string, string]))
  : undefined;
const LAZY = fit.lazyRest && !oracle ? { lazyRest: {} } : {};
const OUT = arg('--out', '');
const accessible = (alt ? MAILLEUX_SETUP_E2_ALT : MAILLEUX_SETUP).accessible;
const perNest: number = fit.design?.recruitersPerNest ?? 0;

console.log(`${FIT}: layer ${fit.layer}; design ${perNest ? `shared warm-ups, ${perNest} per nest` : 'independent'}; fit loss (selection batch) ${fit.selectionLoss.toFixed(2)}, runs ${fit.runs.map((r: number) => r.toFixed(1)).join(', ')}`);
console.log(`free: ${Object.entries(fit.free).map(([k, v]) => `${k} = ${(v as number).toPrecision(3)}`).join(', ')}${fit.atBound.length ? `; at a bound: ${fit.atBound.join(', ')}` : ''}`);

const pool = await SimPool.create();
const t0 = Date.now();
const sim = Object.fromEntries(
  await Promise.all(
    M1999_DAYS.map(async (day) => {
      const o = { seed: SEED, starvationDays: day, density: fit.density1999, pipetteAccessible: accessible, warmup: fit.warmup, dt: fit.dt ?? 0.1, followNestmates: true, contactMin: CONTACT_MIN, ...LAZY, ...(oracle ? { oracle } : {}) };
      return [day, perNest ? await pool.m1999Shared(P, o, N, perNest) : await pool.m1999(P, o, N)] as const;
    }),
  ),
) as Record<M1999Day, M1999Recruiter[]>;
pool.close();
const arm = [ROLES && `roles ${ROLES}`, CONTACT_MIN !== fit.contactMin && `contacts ≥ ${CONTACT_MIN} s`, ...Object.entries(SET).map(([k, v]) => `${k} ${v}`), ORC && `oracle ${ORC}`].filter(Boolean).join(', ') || 'the fit point as fitted';
console.log(`${N} recruiters per day, fresh seeds, ${arm}${LAZY.lazyRest ? ' (lazy rests)' : ''} [${((Date.now() - t0) / 1000).toFixed(0)} s]\n`);

const f = (v: number) => (Math.abs(v) < 10 ? v.toFixed(2) : v.toFixed(1));
const rows = m1999Compare(sim);
console.log('Fit rows (judging z; SD check = log-SD z between recruiters):');
let over2 = 0;
let over3 = 0;
for (const r of rows) {
  const z = r.comparison.z;
  if (Math.abs(z) > 3 || !Number.isFinite(z)) over3++;
  else if (Math.abs(z) > 2) over2++;
  const nSim = sim[r.target.day].map((x) => x[r.target.stat]).filter(Number.isFinite).length;
  const zSd = logSdZ(r.simSd, nSim, r.target.sd, r.target.n);
  console.log(`  z=${z.toFixed(1).padStart(5)} ${verdict(z).padEnd(8)} fitZ=${fitZ(r.comparison.sim, r.target.mean, r.comparison.seData).toFixed(1).padStart(5)} zSD=${zSd.toFixed(1).padStart(5)}  ${r.target.label}: data ${f(r.target.mean)} ± ${f(r.target.sd)} (n ${r.target.n}), sim ${f(r.comparison.sim)} ± ${f(r.simSd)}`);
}
const noBout = M1999_DAYS.map((d) => m1999NoBout(sim[d]));
const noBoutOk = noBout.every((f) => f <= M1999_NO_BOUT_MAX);
console.log(`Recruiters without a bout: ${M1999_DAYS.map((d, i) => `${d} d ${(100 * noBout[i]).toFixed(0)} %`).join(', ')} (bound ${(100 * M1999_NO_BOUT_MAX).toFixed(1)} % per day)`);
const adequate = over3 === 0 && over2 <= 2 && noBoutOk;
console.log(`\nAdequacy (frozen; no-bout bound added 2026-10-10): ${over3} rows |z| > 3 (or not estimable), ${over2} in (2, 3], no-bout bound ${noBoutOk ? 'met' : 'EXCEEDED'} → ${adequate ? 'ADEQUATE' : 'NOT ADEQUATE'}`);
// Adoption rule, parts read here (the Buffin dish check is `checkDishBuffin.ts`): condition 4, no row beyond |fitZ| 5
// with the no-bout bound; no free parameter within 5 % of a box end on the unit scale (step 4's convention, D103).
const fitZs = rows.map((r) => fitZ(r.comparison.sim, r.target.mean, r.comparison.seData));
const cond4 = fitZs.every((z) => Math.abs(z) <= 5) && noBoutOk;
// Free = in `free` and not in `fixed` (flat keys). C2 fit files also list density under `fixed` (a recording slip in
// fitM1999.ts: its C2 density entry is a copy, so the identity test misses it); it is free there, on `densityBox`.
const fixedKeys = Object.keys(fit.fixed ?? {}).filter((k) => !(k === 'density' && fit.densityBox));
const boxes = M1999_FREE.filter((f) => f.key in fit.free && !fixedKeys.includes(f.key)).map((f) => ({ key: f.key, tf: (f.key === 'density' && fit.densityBox ? fit.densityBox : f.tf) as { lo: number; hi: number; log?: boolean } }));
const units = boxes.map(({ key, tf }) => {
  const v = fit.free[key] as number;
  return { key, unit: tf.log ? Math.log(v / tf.lo) / Math.log(tf.hi / tf.lo) : (v - tf.lo) / (tf.hi - tf.lo) };
});
const near = units.filter((u) => u.unit < 0.05 || u.unit > 0.95);
console.log(`Condition 4: max |fitZ| ${Math.max(...fitZs.map(Math.abs)).toFixed(1)} (bound 5), no-bout ${noBoutOk ? 'met' : 'exceeded'} → ${cond4 ? 'met' : 'NOT MET'}`);
console.log(`Bounds (unit scale): ${units.map((u) => `${u.key} ${u.unit.toFixed(3)}`).join(', ')} → ${near.length ? `within 5 %: ${near.map((u) => u.key).join(', ')}` : 'none within 5 %'}`);
const logs = Object.values(sim).flat().map((x) => x.oracleLog).filter((l): l is NonNullable<typeof l> => !!l);
let oracleLogSd = NaN;
if (logs.length) {
  const t = logs.reduce((a, l) => ({ sum: a.sum + l.sum, sq: a.sq + l.sq, n: a.n + l.n }), { sum: 0, sq: 0, n: 0 });
  oracleLogSd = Math.sqrt(t.sq / t.n - (t.sum / t.n) ** 2);
  console.log(`Coupled oracle: realised SD of log g ${oracleLogSd.toFixed(3)} over ${logs.length} recruiters' colonies (warm-up steps counted once per copy)`);
}
if (OUT)
  writeJson(OUT, {
    fit: FIT,
    arm,
    n: N,
    seed: SEED,
    options: { roles: ROLES || 'as fitted', contactMin: CONTACT_MIN, set: SET, oracle: oracle ?? null, lazyRest: !!LAZY.lazyRest },
    rows: rows.map((r, i) => ({ id: r.target.id, label: r.target.label, data: r.target.mean, seData: r.comparison.seData, sim: r.comparison.sim, seSim: r.comparison.seSim, z: r.comparison.z, fitZ: fitZs[i], simSd: r.simSd })),
    noBout: Object.fromEntries(M1999_DAYS.map((d, i) => [d, noBout[i]])),
    adequate,
    over3,
    over2,
    condition4: cond4,
    bounds: units,
    oracleLogSd,
    simHash: hash,
  });

console.log('\nDevelopment (reported only):');
for (const day of M1999_DAYS) {
  const xs = sim[day];
  const left = xs.filter((x) => x.left).length / xs.length;
  const noTroph = xs.filter((x) => !(x.trophTotal > 0)).length / xs.length;
  const tr = xs.reduce((a, x) => ({ n: a.n + x.troph.n, left: a.left + x.troph.left }), { n: 0, left: 0 });
  const ot = xs.reduce((a, x) => ({ n: a.n + x.other.n, left: a.left + x.other.left }), { n: 0, left: 0 });
  const d = M1999_LEAVE[day];
  // Table 2b n are unreliable (copied from Table 1); the data's n is used as printed, so these z are indicative.
  const zOf = (p: number, q: number, n: number) => (p - q) / binomialSE(q, n);
  const nTr = ({ 1: 68, 4: 132, 8: 82 } as const)[day];
  const nOt = ({ 1: 63, 4: 135, 8: 92 } as const)[day];
  console.log(`  ${day} d: recruiters that left within 20 min ${(100 * left).toFixed(0)} % (data: all); without any trophallaxis ${(100 * noTroph).toFixed(0)} %`);
  console.log(`       contacted nestmate leaves within 5 min: after trophallaxis ${tr.n ? ((100 * tr.left) / tr.n).toFixed(0) : '–'} % (n ${tr.n}; data ${(100 * d.afterTroph).toFixed(0)} %, z ≈ ${tr.n ? zOf(tr.left / tr.n, d.afterTroph, nTr).toFixed(1) : '–'}), after other contact ${ot.n ? ((100 * ot.left) / ot.n).toFixed(0) : '–'} % (n ${ot.n}; data ${(100 * d.afterOther).toFixed(0)} %, z ≈ ${ot.n ? zOf(ot.left / ot.n, d.afterOther, nOt).toFixed(1) : '–'})`);
}

// Diagnostics (reported only): recruiters that left vs those still in the nest at 20 min.
const med = (v: number[]) => {
  const s = v.filter(Number.isFinite).sort((a, b) => a - b);
  return s.length ? s[(s.length - 1) >> 1] : NaN;
};
console.log(`\nDiagnostics, leavers vs stayers (medians; giveFrac × crop capacity = ${(P.nest.giveFrac * P.morph.cropCapacity).toFixed(2)} µL):`);
for (const day of M1999_DAYS) {
  for (const [label, xs] of [['left', sim[day].filter((x) => x.left)], ['stayed', sim[day].filter((x) => !x.left)]] as const) {
    if (!xs.length) continue;
    console.log(
      `  ${day} d ${label.padEnd(6)} n ${String(xs.length).padStart(3)}: time ${med(xs.map((x) => x.timeInNest)).toFixed(0)} s, trophallaxis ${med(xs.map((x) => x.trophTotal)).toFixed(0)} s (none ${xs.filter((x) => !(x.trophTotal > 0)).length}), contacts ${med(xs.map((x) => x.contacts))}, crop ${med(xs.map((x) => x.cropAtEntry)).toFixed(2)} → ${med(xs.map((x) => x.cropAtExit)).toFixed(2)} µL`,
    );
  }
}
