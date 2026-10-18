/** Paired diagnostic of the E2 observer's zero clamp at the fixed main fit. */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RNG } from '../../src/sim/core/rng';
import { blockEstimate } from '../../src/sim/analysis/compare';
import { E2_CONDITIONS, E2_TARGETS } from '../../src/sim/experiments/e2Targets';
import type { ScoutOptions, ScoutResult } from '../../src/sim/experiments/e2Mailleux';
import { modelOf } from '../../scripts/e2Synthetic';
import { SimPool } from '../../scripts/pool';
import { stamp } from '../_lib/stamp';

const ITEM = dirname(fileURLToPath(import.meta.url));

const fit = JSON.parse(readFileSync('data/fits/e2-3d-L0S1c.json', 'utf8'));
const { P, setup } = modelOf(fit);
const condition = E2_CONDITIONS.find((c) => c.id === 'two')!;
const targets = E2_TARGETS.filter((t) => t.id.startsWith('two.') &&
  ['two.ul1', 'two.ul2', 'two.ulTot', 'two.vtSlope', 'two.vtRs', 'two.vtRs1', 'two.vtRs2'].includes(t.id));
const BLOCKS = 10;
const N = 150;
const SEED_BASE = 7_000_000 + 400_000; // reportE2's fourth condition
const mean = (xs: number[]) => xs.reduce((a, x) => a + x, 0) / xs.length;
const sd = (xs: number[]) => Math.sqrt(xs.reduce((a, x) => a + (x - mean(xs)) ** 2, 0) / (xs.length - 1));
const summary = (xs: number[]) => ({ mean: mean(xs), se: sd(xs) / Math.sqrt(xs.length) });

function unclamp(r: ScoutResult, o: ScoutOptions): { raw: ScoutResult; perDrink: number; total: number } {
  const rng = RNG.stream(o.seed, 0x0b5e);
  let perDrink = 0;
  const drinks = r.drinks.map((d) => {
    const ul = d.trueUl + (o.volumeSd ? rng.normal(0, o.volumeSd) : 0);
    if (Math.abs(d.ul - Math.max(0, ul)) > 1e-12) throw new Error(`observer replay mismatch: seed ${o.seed}`);
    if (ul < 0) perDrink++;
    return { ...d, ul };
  });
  const totalUl = r.totalTrueUl + (o.volumeSd ? rng.normal(0, o.volumeSd) : 0);
  if (Math.abs(r.totalUl - Math.max(0, totalUl)) > 1e-12) throw new Error(`total replay mismatch: seed ${o.seed}`);
  return { raw: { ...r, drinks, totalUl }, perDrink, total: Number(totalUl < 0) };
}

const pool = await SimPool.create(4);
try {
  const blocks = await Promise.all(Array.from({ length: BLOCKS }, async (_, b) => {
    const opts = condition.options(N, SEED_BASE + b * N, setup, 0.1);
    const rs = await pool.scouts(P, opts);
    const raw = rs.map((r, i) => unclamp(r, opts[i]));
    const observed = rs.filter((r) => r.drinks.length);
    const observedRaw = raw.map((r) => r.raw).filter((r) => r.drinks.length);
    const both = rs.filter((r) => r.drinks.length >= 2);
    const bothRaw = raw.map((r) => r.raw).filter((r) => r.drinks.length >= 2);
    return {
      clamped: condition.metrics(observed),
      unclamped: condition.metrics(observedRaw),
      counts: {
        scouts: rs.length,
        both: both.length,
        drop1: bothRaw.filter((r) => r.drinks[0].ul < 0).length,
        drop2: bothRaw.filter((r) => r.drinks[1].ul < 0).length,
        allDrinkEstimates: rs.reduce((n, r) => n + r.drinks.length, 0),
        allClampedDrinkEstimates: raw.reduce((n, r) => n + r.perDrink, 0),
        totalEstimatesClamped: raw.reduce((n, r) => n + r.total, 0),
      },
    };
  }));
  const counts = Object.fromEntries(Object.keys(blocks[0].counts).map((k) =>
    [k, blocks.reduce((n, b) => n + b.counts[k as keyof typeof b.counts], 0)]));
  const rows = targets.map((t) => {
    const c = blocks.map((b) => mean(b.clamped[t.id]));
    const u = blocks.map((b) => mean(b.unclamped[t.id]));
    const d = c.map((v, i) => v - u[i]);
    return {
      id: t.id, role: t.role, dataSE: t.se,
      clamped: blockEstimate(blocks.map((b) => b.clamped[t.id])),
      unclamped: blockEstimate(blocks.map((b) => b.unclamped[t.id])),
      delta: summary(d), deltaOverDataSE: mean(d) / t.se,
    };
  });
  const result = { provenance: stamp(ITEM), fit: 'data/fits/e2-3d-L0S1c.json', blocks: BLOCKS, scoutsPerBlock: N, seedBase: SEED_BASE, counts, rows };
  mkdirSync(join(ITEM, 'results'), { recursive: true });
  writeFileSync(join(ITEM, 'results/results.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result));
} finally {
  pool.close();
}
