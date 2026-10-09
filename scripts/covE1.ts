/**
 * Covariance and normality of the E1 fit statistics (STATUS 2026-10-09,
 * step 4; Wood 2010). Report only: the fit loss is not changed.
 *
 * Per incline, cluster-bootstrap replicates (over ants) of the scalar and
 * diagnostic fit statistics on the Khuong data: correlation structure, the
 * effective number of independent statistics, normality of each statistic,
 * and the Mahalanobis misfit of fitted walkers beside the diagonal Σz² and
 * the family-averaged loss. Writes nothing.
 *
 * Usage: npx vite-node scripts/covE1.ts [--reps 1000] [--simAnts 2000] [--simReps 200] [--fits A0,T] [--inclines 1,2,3,4,5]
 */
import { bootstrapDraws } from '../src/sim/analysis/compare';
import { eigenDecomposition } from '../src/sim/analysis/cmaes';
import { compareE1, DIAG_SCALARS, SCALARS, sampleFor, statValues, type E1Sample } from '../src/sim/experiments/e1Compare';
import { walkParams } from '../src/sim/models/walk';
import { khuongTracking } from '../src/sim/species/lasiusM1';
import { arg, INCLINES, loadKhuong, numArg, readJson } from './lib';
import { SimPool } from './pool';

const REPS = numArg('--reps', 1000);
const SIM_ANTS = numArg('--simAnts', 2000);
const SIM_REPS = numArg('--simReps', 200);
const FITS = arg('--fits', 'A0,T').split(',');
const KS = arg('--inclines', '1,2,3,4,5').split(',').map(Number);
const META = [...SCALARS.map((c) => ({ id: c.id, family: c.family })), ...DIAG_SCALARS.map((c) => ({ id: c.id, family: c.family }))];

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
function moments(xs: number[]) {
  const m = mean(xs);
  const c = (k: number) => mean(xs.map((x) => (x - m) ** k));
  const v = c(2);
  return { m, sd: Math.sqrt(v), skew: c(3) / v ** 1.5, exkurt: c(4) / (v * v) - 3 };
}

/** Covariance of replicate rows (columns `cols`), shrunk à la Schäfer–Strimmer: correlation towards I, variances kept. */
function shrunkCov(draws: number[][], cols: number[]) {
  const R = draws.length;
  const p = cols.length;
  const mu = cols.map((c) => mean(draws.map((d) => d[c])));
  const sd = cols.map((c, j) => Math.sqrt(draws.reduce((s, d) => s + (d[c] - mu[j]) ** 2, 0) / (R - 1)));
  const Z = draws.map((d) => cols.map((c, j) => (d[c] - mu[j]) / sd[j]));
  const r: number[][] = Array.from({ length: p }, () => new Array(p).fill(0));
  let num = 0;
  let den = 0;
  for (let i = 0; i < p; i++)
    for (let j = i; j < p; j++) {
      const w = Z.map((z) => z[i] * z[j]);
      const wm = mean(w);
      r[i][j] = r[j][i] = (wm * R) / (R - 1);
      if (i !== j) {
        const varR = (R / (R - 1) ** 3) * w.reduce((s, x) => s + (x - wm) ** 2, 0);
        num += varR;
        den += r[i][j] ** 2;
      }
    }
  const lambda = den > 0 ? Math.min(1, Math.max(0, num / den)) : 1;
  const rs = r.map((row, i) => row.map((v, j) => (i === j ? 1 : (1 - lambda) * v)));
  return { sd, r, rs, lambda, cov: rs.map((row, i) => row.map((v, j) => v * sd[i] * sd[j])) };
}

/** dᵀ A⁻¹ d for symmetric positive definite A. */
function quad(A: number[][], d: number[]) {
  const { B, D } = eigenDecomposition(A);
  let s = 0;
  for (let k = 0; k < D.length; k++) {
    const proj = B.reduce((t, row, i) => t + row[k] * d[i], 0);
    s += (proj * proj) / (D[k] * D[k]);
  }
  return s;
}

const pool = await SimPool.create();
const f = (x: number, d = 2) => (Number.isFinite(x) ? x.toFixed(d) : '—');
for (const k of KS) {
  const sample = sampleFor(loadKhuong(k));
  const n = sample.acc.length;
  const dv = statValues(sample);
  const draws = bootstrapDraws(n, (idx) => statValues(sample, idx), REPS, 17);
  const cols = META.map((_, c) => c).filter((c) => Number.isFinite(dv[c]) && draws.every((d) => Number.isFinite(d[c])));
  const dropped = META.filter((_, c) => !cols.includes(c)).map((m) => m.id);
  const C = shrunkCov(draws, cols);
  const ev = eigenDecomposition(C.r)
    .D.map((d) => d * d)
    .sort((a, b) => b - a);
  const tot = ev.reduce((a, b) => a + b, 0);
  const pr = tot ** 2 / ev.reduce((a, b) => a + b * b, 0);
  let cum = 0;
  const n90 = ev.findIndex((e) => (cum += e) >= 0.9 * tot) + 1;
  console.log(`\n=== incline ${k} (${((INCLINES[k - 1] * 180) / Math.PI).toFixed(0)}°): ${n} ants, ${cols.length} statistics (${dropped.length ? `left out, not estimable in every resample: ${dropped.join(' ')}` : 'none left out'})`);
  console.log(`  effective number of independent statistics: participation ratio ${pr.toFixed(1)}, ${n90} components for 90 % of the variance; shrinkage λ ${C.lambda.toFixed(2)}`);
  // Correlation within vs between families.
  const fam = cols.map((c) => META[c].family);
  const within: number[] = [];
  const between: number[] = [];
  const strong: string[] = [];
  for (let i = 0; i < cols.length; i++)
    for (let j = i + 1; j < cols.length; j++) {
      const v = Math.abs(C.r[i][j]);
      (fam[i] === fam[j] ? within : between).push(v);
      if (v >= 0.7) strong.push(`${META[cols[i]].id}~${META[cols[j]].id} ${C.r[i][j].toFixed(2)}`);
    }
  console.log(`  mean |r| within families ${f(mean(within))}, between families ${f(mean(between))}; pairs with |r| ≥ 0.7 (${strong.length}): ${strong.join(', ') || 'none'}`);
  // Per-family effective size.
  const fams = [...new Set(fam)];
  const famEff = fams.map((F) => {
    const idx = fam.map((x, i) => (x === F ? i : -1)).filter((i) => i >= 0);
    if (idx.length < 2) return `${F} 1/1`;
    const sub = idx.map((i) => idx.map((j) => C.r[i][j]));
    const e = eigenDecomposition(sub).D.map((d) => d * d);
    const t = e.reduce((a, b) => a + b, 0);
    return `${F} ${(t ** 2 / e.reduce((a, b) => a + b * b, 0)).toFixed(1)}/${idx.length}`;
  });
  console.log(`  effective size per family (participation ratio / rows): ${famEff.join(', ')}`);
  // Normality of the bootstrap distributions.
  const odd = cols
    .map((c) => ({ id: META[c].id, ...moments(draws.map((d) => d[c])) }))
    .filter((m) => Math.abs(m.skew) > 0.5 || Math.abs(m.exkurt) > 1)
    .map((m) => `${m.id} (skew ${m.skew.toFixed(1)}, ex.kurt ${m.exkurt.toFixed(1)})`);
  console.log(`  far from normal (|skew| > 0.5 or |excess kurtosis| > 1): ${odd.length ? odd.join(', ') : 'none'}`);
  // Misfit of fitted walkers.
  for (const name of FITS) {
    const sim: E1Sample = await pool.e1Sample(walkParams(readJson<any>(`data/fits/e1-${name}.json`).params), { incline: INCLINES[k - 1], ants: SIM_ANTS, seed: 6060 + k, dt: 0.02, tracking: khuongTracking(k) });
    const sv = statValues(sim);
    const sdraws = bootstrapDraws(sim.acc.length, (idx) => statValues(sim, idx), SIM_REPS, 19);
    const ok = cols.filter((c) => Number.isFinite(sv[c]) && sdraws.every((d) => Number.isFinite(d[c])));
    const pos = ok.map((c) => cols.indexOf(c));
    const Cs = shrunkCov(sdraws, ok);
    const A = pos.map((i, a) => pos.map((j, b) => C.cov[i][j] + Cs.cov[a][b]));
    const d = ok.map((c) => sv[c] - dv[c]);
    const diag = d.reduce((s, x, i) => s + (x * x) / A[i][i], 0);
    const maha = quad(A, d);
    const loss = compareE1(sim, { sample: sample as any, values: dv, se: C.sd.length ? cols.reduce((se, c, i) => ((se[c] = C.sd[i]), se), new Array(META.length).fill(NaN)) : [] }).loss;
    console.log(`  ${name.padEnd(4)} ${ok.length} statistics: diagonal Σz² ${diag.toFixed(0)}, Mahalanobis d² ${maha.toFixed(0)} (ratio ${(maha / diag).toFixed(2)}), family-averaged loss (fit-z) ${loss.toFixed(0)}${ok.length < cols.length ? `; missing ${cols.length - ok.length}` : ''}`);
  }
}
pool.close();
