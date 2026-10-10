/**
 * Local identifiability of the Mailleux 1999 colony calibration (STATUS
 * 2026-10-10, item 1; a sensitivity diagnostic, logged before running): at
 * each point, central differences of the 15 fit-row means in the fit's
 * encoded coordinates (h = 0.2, common seeds), scaled by SE_data; singular
 * values and right singular vectors of that Jacobian. A singular value s
 * means one encoded unit along its direction changes Σz² by ≈ s² (s < 1:
 * not pinned down by the 15 rows). Noise floor: the centre on a second seed
 * batch, ‖δ‖/(2h) with δ = (m_A − m_B)/SE_data (conservative). Rows not
 * estimable at a point are dropped and listed. Independent design, 240
 * recruiters per day per evaluation, warm-up 300 s. Not a fit; the means
 * are not printed.
 *
 * Usage: npx vite-node scripts/identM1999.ts [--fit data/fits/colony-m1999-<layer>-shared.json] [--n 240]
 */
import { M1999_DAYS, M1999_FREE, M1999_TARGETS, m1999Decode, m1999Encode, type M1999Day, type M1999Recruiter } from '../src/sim/experiments/colonyMailleux1999';
import { arg, numArg, seedFor } from './lib';
import { m1999Points } from './m1999Points';
import { SimPool } from './pool';

const N = numArg('--n', 240);
const H = 0.2;
// Seeds: the 'ident' namespace (STATUS 2026-10-10; were 8.7e9 and 8.71e9); batch 1 is the noise-floor replicate.
const SEED = seedFor(1999, 'ident', 0);
const SEED_B = seedFor(1999, 'ident', 1);
const pool = await SimPool.create();

/** Symmetric eigen-decomposition (cyclic Jacobi): eigenvalues and eigenvectors (columns of V). */
function eigSym(A: number[][]): { values: number[]; vectors: number[][] } {
  const n = A.length;
  const a = A.map((r) => r.slice());
  const V: number[][] = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += a[p][q] ** 2;
    if (off < 1e-24) break;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(a[p][q]) < 1e-300) continue;
        const theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = a[k][p];
          const akq = a[k][q];
          a[k][p] = c * akp - s * akq;
          a[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = a[p][k];
          const aqk = a[q][k];
          a[p][k] = c * apk - s * aqk;
          a[q][k] = s * apk + c * aqk;
        }
        for (let k = 0; k < n; k++) {
          const vkp = V[k][p];
          const vkq = V[k][q];
          V[k][p] = c * vkp - s * vkq;
          V[k][q] = s * vkp + c * vkq;
        }
      }
  }
  return { values: a.map((r, i) => r[i]), vectors: V };
}

for (const pt of m1999Points(arg('--fit', ''))) {
  const means = async (x: number[], seed: number): Promise<number[]> => {
    const m = m1999Decode(x, pt.P);
    const sim = Object.fromEntries(await Promise.all(M1999_DAYS.map(async (d) => [d, await pool.m1999(m.P, { seed, starvationDays: d, density: m.density, pipetteAccessible: pt.accessible, warmup: 300 }, N)] as const))) as Record<M1999Day, M1999Recruiter[]>;
    return M1999_TARGETS.map((t) => {
      const v = sim[t.day].map((r) => r[t.stat]).filter(Number.isFinite);
      return v.length ? v.reduce((a, b) => a + b, 0) / v.length : NaN;
    });
  };
  const x0 = m1999Encode({ P: pt.P, density: pt.density });
  const t0 = Date.now();
  const shift = (j: number, d: number) => x0.map((v, k) => (k === j ? v + d : v));
  const [A, B, ...pm] = await Promise.all([means(x0, SEED), means(x0, SEED_B), ...x0.flatMap((_, j) => [means(shift(j, H), SEED), means(shift(j, -H), SEED)])]);
  const seData = M1999_TARGETS.map((t) => t.sd / Math.sqrt(t.n));
  const rows = M1999_TARGETS.map((_, i) => i).filter((i) => [A, B, ...pm].every((v) => Number.isFinite(v[i])));
  const dropped = M1999_TARGETS.filter((_, i) => !rows.includes(i)).map((t) => t.id);
  const J = rows.map((i) => x0.map((_, j) => (pm[2 * j][i] - pm[2 * j + 1][i]) / (2 * H) / seData[i]));
  const delta = rows.map((i) => (A[i] - B[i]) / seData[i]);
  const floor = Math.hypot(...delta) / (2 * H);
  const JtJ = x0.map((_, p) => x0.map((_, q) => J.reduce((s, r) => s + r[p] * r[q], 0)));
  const { values, vectors } = eigSym(JtJ);
  const order = values.map((_, k) => k).sort((a, b) => values[b] - values[a]);
  const keys = M1999_FREE.map((f) => f.key.replace('nest.', ''));
  console.log(`\n${pt.label} [${((Date.now() - t0) / 1000).toFixed(0)} s; ${rows.length} rows${dropped.length ? `, dropped (not estimable): ${dropped.join(', ')}` : ''}]`);
  console.log(`  encoded point: ${keys.map((k, j) => `${k} ${x0[j].toFixed(2)}`).join(', ')}`);
  console.log(`  column norms (sensitivity of the rows to each parameter, SE_data per encoded unit): ${keys.map((k, j) => `${k} ${Math.hypot(...J.map((r) => r[j])).toFixed(1)}`).join(', ')}`);
  console.log(`  noise floor ‖δ‖/(2h) = ${floor.toFixed(2)}`);
  for (const k of order) {
    const s = Math.sqrt(Math.max(0, values[k]));
    const v = vectors.map((r) => r[k]);
    const sgn = Math.sign(v[v.map(Math.abs).indexOf(Math.max(...v.map(Math.abs)))]) || 1;
    const flag = s < 1 ? (s < floor ? '  ← below 1 and below the noise floor' : '  ← below 1 (not pinned down)') : s < floor ? '  ← below the noise floor' : '';
    console.log(`  s = ${s.toFixed(2).padStart(7)}  direction: ${keys.map((kk, j) => `${(sgn * v[j]).toFixed(2).padStart(5)} ${kk}`).join(', ')}${flag}`);
  }
}
pool.close();
