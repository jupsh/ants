/**
 * Step 3c fits (search around food), frozen pre-registration in
 * docs/STATUS.md (2026-10-09): one candidate of E2_VARIANTS_3C, fitted to
 * the E2 "fit" rows (now including the 2009 between-drop and drop-2 rows).
 *
 * Optimiser (as E1): CMA-ES with per-coordinate initial SDs from a curvature
 * probe, fresh seeds each generation (common within a generation), bounded
 * parameters, two starts plus one IPOP restart, ≤ 300 generations, tolX
 * 0.03, estimate = mean of the last 50 generation means; runs compared on
 * one common selection batch (selection data only; judge with selectE2.ts).
 * A candidate whose simulation leaves a fit row inestimable ranks below all
 * that estimate every row.
 *
 * Usage: npx vite-node scripts/fitE2c.ts --variant S0I0|S1I0|S2I0|S1I1|S2I1 [--recover truthFit.json --rep r]
 * Writes data/fits/e2-3c-<variant>.json (recovery: data/fits/recover/e2-3c-<variant>-rep<r>.json).
 */
import { cmaes } from '../src/sim/analysis/cmaes';
import { e2Loss, simulateE2Async, E2_TARGETS, type E2Sim } from '../src/sim/experiments/e2Targets';
import { atBound, decode, encode, freeValues, E2_VARIANTS_3C, type E2Model } from '../src/sim/experiments/e2Variants';
import { LASIUS_FORAGER, LASIUS_MORPH, LASIUS_PHYS, LASIUS_WALK } from '../src/sim/species/lasiusM1';
import { arg, numArg, readJson, writeJson } from './lib';
import { SimPool } from './pool';

const N = 150;
const DT = 0.1;
const GENS = numArg('--gens', 300);
const TOLX = 0.03;
const AVERAGE_LAST = 50;
const RESTARTS = 1;
const SEED = 30_000_000;
const DEGENERATE = 1e7;
const variant = E2_VARIANTS_3C.find((v) => v.id === arg('--variant', ''));
if (!variant) throw new Error(`--variant ${E2_VARIANTS_3C.map((v) => v.id).join('|')} required`);
const RECOVER = arg('--recover', '');
const REP = numArg('--rep', 0);
const OUT = RECOVER ? `data/fits/recover/e2-3c-${variant.id}-rep${REP}.json` : `data/fits/e2-3c-${variant.id}.json`;

const prev = readJson<any>('data/fits/e2-drinking.json');
const base: E2Model = {
  P: { walk: LASIUS_WALK, forager: { ...LASIUS_FORAGER, ...prev.forager, arsMeanLay: 80 }, phys: { ...LASIUS_PHYS, intakeSd: prev.phys.intakeSd, boutFastUl: 0.1, boutFastRate: 0.05 }, morph: LASIUS_MORPH },
  setup: { accessible: prev.pipetteAccessible, volumeSd: prev.observer.volumeSd },
};
const start1 = variant.fix(base);
const start2 = variant.fix({ ...base, P: { ...base.P, forager: { ...base.P.forager, arsMean: 150, arsMeanLay: 150 }, phys: { ...base.P.phys, boutFastUl: 0.2 } } });

const pool = await SimPool.create();
const run = pool.scouts.bind(pool);

// Targets: the real data, or (recovery) synthetic targets from a fitted candidate, at the real sample sizes.
const truth = RECOVER ? readJson<any>(RECOVER) : null;
const targets = truth ? await (await import('./e2Synthetic')).syntheticTargets(truth, REP, run) : E2_TARGETS;
const fitRows = targets.filter((t) => t.role === 'fit');
console.log(`${variant.label}: ${variant.free.length} free parameters; ${fitRows.length} fit rows${truth ? ` (synthetic, truth ${RECOVER}, rep ${REP})` : ''}`);

const lossOf = (sim: E2Sim) => {
  const bad = fitRows.filter((t) => !Number.isFinite(sim[t.id]?.mean)).length;
  return e2Loss(sim, 'fit', targets) + DEGENERATE * bad;
};
const evalAt = async (m: E2Model, seed: number, n = N) => lossOf(await simulateE2Async(m.P, n, m.setup, DT, seed, 1, run));
const dec = (x: number[]) => decode(variant, start1, x);

let evals = 0;
const score = (x: number[]) => evalAt(dec(x), SEED + 777_000_000, 3 * N);
const PROBE_H = 0.2;
const PROBE_DELTA = 10;
const PROBE_CAP = 0.3;
const probe = async (x0: number[], off: number) => {
  const seed = SEED + off + 3_000_000;
  const shifted = (i: number, d: number) => x0.map((v, j) => (j === i ? v + d : v));
  const [f0, ...fs] = await Promise.all([evalAt(dec(x0), seed), ...x0.flatMap((_, i) => [evalAt(dec(shifted(i, PROBE_H)), seed), evalAt(dec(shifted(i, -PROBE_H)), seed)])]);
  evals += fs.length + 1;
  return x0.map((_, i) => {
    const c = (fs[2 * i] + fs[2 * i + 1] - 2 * f0) / PROBE_H ** 2;
    return c > 0 && f0 < DEGENERATE ? Math.min(PROBE_CAP, Math.max(0.02, Math.sqrt(PROBE_DELTA / c))) : PROBE_CAP;
  });
};
const one = async (label: string, x0: number[], lambda: number | undefined, off: number) => {
  const stds = await probe(x0, off);
  console.log(`${label}: initial SDs ${stds.map((v) => v.toFixed(2)).join(' ')}`);
  const r = await cmaes((x, g) => evalAt(dec(x), SEED + off + 10_000_000 * (g + 1)), x0, {
    sigma: 1,
    stds,
    lambda,
    maxGenerations: GENS,
    tolX: TOLX,
    seed: SEED + off,
    averageLast: AVERAGE_LAST,
    log: (g) => g.generation % 10 === 0 && console.log(`${label} gen ${g.generation} evals ${g.evals} best ${g.fs[0].toFixed(2)} median ${g.fs[g.fs.length >> 1].toFixed(2)} σ ${g.sigma.toFixed(3)}`),
  });
  evals += r.evals;
  const f = await score(r.meanAvg);
  console.log(`${label}: λ ${lambda ?? 'default'}, ${r.generations} generations, ${r.evals} evaluations, final σ ${r.sigma.toFixed(3)}; selection-batch loss ${f.toFixed(3)}`);
  return { x: r.meanAvg, f };
};

const t0 = Date.now();
const runs: { x: number[]; f: number }[] = [];
for (const [k, s] of [start1, start2].entries()) runs.push(await one(`start ${k}`, encode(variant, s), undefined, 1000 * k));
const lambda0 = 4 + Math.floor(3 * Math.log(variant.free.length));
for (let r = 1; r <= RESTARTS; r++) {
  const best = runs.reduce((a, b) => (b.f < a.f ? b : a));
  runs.push(await one(`restart ${r}`, best.x, lambda0 * 2 ** r, 5000 + 1000 * r));
}
const best = runs.reduce((a, b) => (b.f < a.f ? b : a));
const m = dec(best.x);
console.log(`best selection-batch loss ${best.f.toFixed(3)} (runs ${runs.map((r) => r.f.toFixed(1)).join(', ')}; selection data, judge with selectE2.ts)`);
console.log(Object.entries(freeValues(variant, m)).map(([key, v]) => `${key} = ${v.toPrecision(3)}`).join(', '));
const bound = atBound(variant, m);
if (bound.length) console.log(`at a bound: ${bound.join(', ')}`);
writeJson(OUT, {
  experiment: 'E2 step 3c: search around food (Mailleux et al. 1999, 2009)',
  variant: variant.id,
  label: variant.label,
  description: variant.description,
  fittedOn: fitRows.map((t) => t.id),
  dt: DT,
  scoutsPerCondition: N,
  optimizer: { method: 'CMA-ES', starts: 2, restarts: RESTARTS, maxGenerations: GENS, tolX: TOLX, averageLast: AVERAGE_LAST },
  evals,
  seconds: (Date.now() - t0) / 1000,
  selectionLoss: best.f,
  runs: runs.map((r) => r.f),
  k: variant.free.length,
  free: freeValues(variant, m),
  atBound: bound,
  forager: m.P.forager,
  phys: m.P.phys,
  pipetteAccessible: m.setup.accessible,
  observer: { volumeSd: m.setup.volumeSd },
  ...(RECOVER ? { recovery: { truth: RECOVER, rep: REP } } : {}),
});
console.log(`wrote ${OUT}`);
pool.close();
