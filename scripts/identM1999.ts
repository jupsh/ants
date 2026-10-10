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
 * Replicate mode (--replicate; STATUS 2026-10-10 night, pilot condition 6):
 * the Jacobian is computed on two independent seed batches; the reported J
 * is their mean, and the noise floor is the largest singular value of
 * (J_A − J_B)/2 (a direction whose s is below it is not resolved). --dt and
 * --warmup default to the fit's (else 0.1 and 300); --exclude a,b drops
 * parameters (e.g. one to be fixed from the literature) from the Jacobian.
 *
 * Usage: npx vite-node scripts/identM1999.ts [--fit data/fits/colony-m1999-<layer>-shared.json] [--n 240] [--replicate] [--dt] [--warmup] [--exclude shareEnd]
 */
import { M1999_DAYS, M1999_FREE, M1999_TARGETS, m1999Decode, m1999Encode, type M1999Day, type M1999Recruiter } from '../src/sim/experiments/colonyMailleux1999';
import { arg, numArg, readJson, seedFor } from './lib';
import { m1999Points } from './m1999Points';
import { SimPool } from './pool';

const N = numArg('--n', 240);
const H = 0.2;
// Seeds: the 'ident' namespace (STATUS 2026-10-10; were 8.7e9 and 8.71e9); batch 1 is the noise-floor replicate.
const SEED = seedFor(1999, 'ident', 0);
const SEED_B = seedFor(1999, 'ident', 1);
const REPLICATE = process.argv.includes('--replicate');
const EXCLUDE = arg('--exclude', '').split(',').filter(Boolean);
const FIT = arg('--fit', '');
const fitFile = FIT ? readJson<any>(FIT) : null;
const DT = numArg('--dt', fitFile?.dt ?? 0.1);
const WARMUP = numArg('--warmup', fitFile?.warmup ?? 300);
// Replicate batch seed ('ident' namespace, key 2; batches 0 and 1 are the original pair).
const SEED_C = seedFor(1999, 'ident', 2);
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

for (const pt of m1999Points(FIT)) {
  const means = async (x: number[], seed: number): Promise<number[]> => {
    const m = m1999Decode(x, pt.P);
    const sim = Object.fromEntries(await Promise.all(M1999_DAYS.map(async (d) => [d, await pool.m1999(m.P, { seed, starvationDays: d, density: m.density, pipetteAccessible: pt.accessible, warmup: WARMUP, dt: DT }, N)] as const))) as Record<M1999Day, M1999Recruiter[]>;
    return M1999_TARGETS.map((t) => {
      const v = sim[t.day].map((r) => r[t.stat]).filter(Number.isFinite);
      return v.length ? v.reduce((a, b) => a + b, 0) / v.length : NaN;
    });
  };
  const x0 = m1999Encode({ P: pt.P, density: pt.density });
  const keysAll = M1999_FREE.map((f) => f.key.replace('nest.', ''));
  const idx = keysAll.map((_, j) => j).filter((j) => !EXCLUDE.includes(keysAll[j]));
  const keys = idx.map((j) => keysAll[j]);
  const t0 = Date.now();
  const shift = (j: number, d: number) => x0.map((v, k) => (k === j ? v + d : v));
  const seData = M1999_TARGETS.map((t) => t.sd / Math.sqrt(t.n));
  // One Jacobian batch: centre and ± shifts on one seed; returns centre means and per-parameter (+, −) means.
  const batch = async (seed: number) => {
    const [c, ...pm] = await Promise.all([means(x0, seed), ...idx.flatMap((j) => [means(shift(j, H), seed), means(shift(j, -H), seed)])]);
    return { c, pm };
  };
  const bA = await batch(SEED);
  const B = await means(x0, SEED_B);
  const bR = REPLICATE ? await batch(SEED_C) : null;
  const all = [bA.c, B, ...bA.pm, ...(bR ? [bR.c, ...bR.pm] : [])];
  const rows = M1999_TARGETS.map((_, i) => i).filter((i) => all.every((v) => Number.isFinite(v[i])));
  const dropped = M1999_TARGETS.filter((_, i) => !rows.includes(i)).map((t) => t.id);
  const jac = (b: { pm: number[][] }) => rows.map((i) => idx.map((_, q) => (b.pm[2 * q][i] - b.pm[2 * q + 1][i]) / (2 * H) / seData[i]));
  const JA = jac(bA);
  const JB = bR ? jac(bR) : null;
  const J = JB ? JA.map((r, i) => r.map((v, q) => (v + JB[i][q]) / 2)) : JA;
  const delta = rows.map((i) => (bA.c[i] - B[i]) / seData[i]);
  const floorCentre = Math.hypot(...delta) / (2 * H);
  const svals = (M: number[][]) => {
    const MtM = idx.map((_, p) => idx.map((_, q) => M.reduce((s, r) => s + r[p] * r[q], 0)));
    return eigSym(MtM);
  };
  const floorRep = JB ? Math.sqrt(Math.max(0, ...svals(JA.map((r, i) => r.map((v, q) => (v - JB[i][q]) / 2))).values)) : NaN;
  const floor = JB ? floorRep : floorCentre;
  const { values, vectors } = svals(J);
  const order = values.map((_, k) => k).sort((a, b) => values[b] - values[a]);
  console.log(`\n${pt.label} [${((Date.now() - t0) / 1000).toFixed(0)} s; ${rows.length} rows; dt ${DT}, warm-up ${WARMUP} s, n ${N}${EXCLUDE.length ? `; excluded: ${EXCLUDE.join(', ')}` : ''}${dropped.length ? `; dropped (not estimable): ${dropped.join(', ')}` : ''}]`);
  console.log(`  encoded point: ${keys.map((k, q) => `${k} ${x0[idx[q]].toFixed(2)}`).join(', ')}`);
  console.log(`  column norms (sensitivity of the rows to each parameter, SE_data per encoded unit): ${keys.map((k, q) => `${k} ${Math.hypot(...J.map((r) => r[q])).toFixed(1)}`).join(', ')}`);
  console.log(`  noise floor: centre-batch ‖δ‖/(2h) = ${floorCentre.toFixed(2)}${JB ? `; replicate ‖(J_A − J_B)/2‖ = ${floorRep.toFixed(2)} (used)` : ''}`);
  for (const k of order) {
    const sv = Math.sqrt(Math.max(0, values[k]));
    const v = vectors.map((r) => r[k]);
    const sgn = Math.sign(v[v.map(Math.abs).indexOf(Math.max(...v.map(Math.abs)))]) || 1;
    const flag = sv < 1 ? (sv < floor ? '  ← below 1 and below the noise floor' : '  ← below 1 (not pinned down)') : sv < floor ? '  ← below the noise floor' : '';
    console.log(`  s = ${sv.toFixed(2).padStart(7)}  direction: ${keys.map((kk, q) => `${(sgn * v[q]).toFixed(2).padStart(5)} ${kk}`).join(', ')}${flag}`);
  }
}
pool.close();
