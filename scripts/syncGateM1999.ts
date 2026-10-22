/**
 * Step-5 synchrony gate (D093, D094; settings D104): the 1999 rows at the optimum re-evaluated with the oracle
 * coupling on (κ = 1, τ_c 60 s) and its placebo, on the same seeds as the optimum's judging run. Failure: any row's
 * coupled shift differs from the placebo's shift by more than 1 combined SE (the row's SE_data ⊕ SE_sim at the
 * optimum), or the adequacy or condition-4 verdict changes under coupling. Reads `reportM1999.ts --out` files; writes
 * nothing.
 *
 * Usage: npx vite-node scripts/syncGateM1999.ts --base a.json --coupled b.json --placebo c.json
 */
import { arg, readJson } from './lib';

interface Row {
  id: string;
  label: string;
  data: number;
  seData: number;
  sim: number;
  seSim: number;
  z: number;
}
interface Arm {
  arm: string;
  seed: number;
  n: number;
  rows: Row[];
  adequate: boolean;
  condition4: boolean;
  oracleLogSd: number;
  options: { oracle: { kind: string; sd?: number } | null };
}

const [base, coupled, placebo] = ['--base', '--coupled', '--placebo'].map((k) => {
  const f = arg(k, '');
  if (!f) throw new Error(`${k} file required`);
  return readJson<Arm>(f);
});
if (coupled.seed !== base.seed || placebo.seed !== base.seed || coupled.n !== base.n || placebo.n !== base.n) throw new Error('the three arms must share seeds and n');

const f = (v: number) => (Math.abs(v) < 10 ? v.toFixed(3) : v.toFixed(1));
let moved = 0;
console.log(`Synchrony gate: base "${base.arm}", coupled "${coupled.arm}", placebo "${placebo.arm}" (n ${base.n} per day)`);
console.log('row: Δ coupled, Δ placebo, difference / combined SE');
base.rows.forEach((b, i) => {
  const c = coupled.rows[i];
  const p = placebo.rows[i];
  if (c.id !== b.id || p.id !== b.id) throw new Error(`row ${i}: ids differ`);
  const se = Math.hypot(b.seData, b.seSim);
  const dc = c.sim - b.sim;
  const dp = p.sim - b.sim;
  const r = (dc - dp) / se;
  const out = !(Math.abs(r) <= 1);
  if (out) moved++;
  console.log(`  ${out ? 'MOVES' : 'ok   '} ${b.label}: Δc ${f(dc)}, Δp ${f(dp)}, (Δc − Δp) / SE ${r.toFixed(2)} (SE ${f(se)}; z ${b.z.toFixed(1)} → ${c.z.toFixed(1)} coupled, ${p.z.toFixed(1)} placebo)`);
});
const verdictChange = coupled.adequate !== base.adequate || coupled.condition4 !== base.condition4;
console.log(`Verdicts: adequacy ${base.adequate} → ${coupled.adequate} coupled (${placebo.adequate} placebo); condition 4 ${base.condition4} → ${coupled.condition4} (${placebo.condition4})`);
const pSd = placebo.options.oracle?.sd ?? NaN;
console.log(`Realised SD of log g, coupled ${coupled.oracleLogSd.toFixed(3)} vs placebo SD ${pSd}${!(Math.abs(coupled.oracleLogSd / pSd - 1) <= 0.2) ? ' (mismatch > 20 %, flagged; rule unchanged)' : ''}`);
console.log(`\nGate (D094): ${moved} rows move beyond 1 combined SE of the placebo's shift; verdict ${verdictChange ? 'CHANGES' : 'unchanged'} → ${moved || verdictChange ? 'FAIL (sensitive to this artificial synchrony)' : 'PASS (insensitive to this artificial synchrony only)'}`);
