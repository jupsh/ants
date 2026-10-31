/** B020: historical-pilot crop-gate diagnostic; no production code changes. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { nestParamsOf, type ForagerMotion } from '../../src/sim/behavior/lasiusNestWorker';
import { RNG } from '../../src/sim/core/rng';
import { ColonySim, type ColonyParams } from '../../src/sim/experiments/colonyBles';
import { M1999_DAYS, M1999_TARGETS, type M1999Day, type M1999Recruiter } from '../../src/sim/experiments/colonyMailleux1999';
import { MAILLEUX_SETUP } from '../../src/sim/species/lasiusM1';
import { arg, numArg, readJson, seedFor, writeJson } from '../../scripts/lib';
import { SimPool } from '../../scripts/pool';
import { stamp } from '../_lib/stamp';

const ITEM = path.dirname(fileURLToPath(import.meta.url));
const FIT = 'data/fits/colony-m1999-main-shared-pilot.json';
const fit = readJson<{ params: ColonyParams; density1999: number; warmup: number; dt: number; contactMin?: number }>(FIT);
const SEED = seedFor(1999, 'diag', 1001);
const PER_NEST = 4;
const initialStamp = stamp(ITEM);
function unchangedStamp() {
  const current = stamp(ITEM);
  assert.equal(current.simHash, initialStamp.simHash, 'simulation inputs changed during this invocation');
  assert.deepEqual(current.depends, initialStamp.depends, 'diagnostic inputs changed during this invocation');
  return initialStamp;
}
const ARMS = ['baseline', 'shared-0.5', 'shared-1', 'nestmate-0.5', 'nestmate-1'] as const;
type Arm = typeof ARMS[number];
const mean = (xs: number[]) => xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : NaN;

function parameters(arm: Arm, markedBaseline = false): ColonyParams {
  assert.equal(fit.params.nest.leaveCropFrac, 0.05);
  // The historical pilot has no forager nestmates or motion overrides. The
  // runner marks only the added recruiter when a forager override is present.
  assert.equal(fit.params.nest.foragerFrac ?? 0, 0);
  assert.equal(fit.params.nest.forager, undefined);
  const P = structuredClone(fit.params);
  if (arm !== 'baseline') P.nest.leaveCropFrac = Number(arm.split('-')[1]);
  if (arm.startsWith('nestmate-') || markedBaseline) {
    // nestParamsOf spreads the role override at runtime. leaveCropFrac is
    // intentionally outside the production ForagerMotion type: this item-only
    // diagnostic exercises that existing path without extending its API.
    const override: ForagerMotion & { leaveCropFrac: number } = { leaveCropFrac: 0.05 };
    P.nest.forager = override;
  }
  return P;
}

function options(day: M1999Day) {
  return { seed: SEED, starvationDays: day, density: fit.density1999,
    pipetteAccessible: MAILLEUX_SETUP.accessible, warmup: fit.warmup,
    dt: fit.dt, followNestmates: true, contactMin: fit.contactMin };
}

function checkRoles() {
  const P = parameters('nestmate-1');
  const sim = new ColonySim(P, { seed: SEED, ants: 3, dt: fit.dt, minutes: 1,
    foodMinute: Infinity, recruiter: { enterAt: 0, cropUl: 0, cropSugar: 0, cropWater: 0, ingested: 1 } });
  sim.step();
  assert.equal(sim.w.ants.length, 4);
  assert.deepEqual(sim.w.ants.map(a => !!a.mind.traits.forager), [false, false, false, true]);
  assert.deepEqual(sim.w.ants.map(a => nestParamsOf(P.nest, a.mind.traits.forager).leaveCropFrac), [1, 1, 1, 0.05]);
}

async function check(pool: SimPool) {
  checkRoles();
  const days = [];
  for (const day of M1999_DAYS) {
    const start = Date.now();
    const original = await pool.m1999Shared(parameters('baseline'), options(day), 4, PER_NEST);
    const marked = await pool.m1999Shared(parameters('baseline', true), options(day), 4, PER_NEST);
    assert.deepEqual(marked, original, `role-only baseline changed day ${day}`);
    days.push({ day, recruiters: original.length, bitIdentical: true, seconds: (Date.now() - start) / 1000 });
    console.log(`identity day ${day}: 4 recruiters bit-identical`);
  }
  writeJson(path.join(ITEM, 'results/check.json'), { provenance: unchangedStamp(), roleRouting: true, days });
}

async function run(pool: SimPool) {
  const arm = arg('--arm', 'baseline') as Arm;
  const day = numArg('--day', 1) as M1999Day;
  const n = numArg('--n', 80);
  assert(ARMS.includes(arm) && M1999_DAYS.includes(day));
  assert(n > 0 && n % PER_NEST === 0);
  const start = Date.now();
  const recruiters = await pool.m1999Shared(parameters(arm), options(day), n, PER_NEST);
  writeJson(path.join(ITEM, `results/${arm}-d${day}.json`), { provenance: unchangedStamp(),
    fit: FIT, seed: SEED, perNest: PER_NEST, arm, day, n, dt: fit.dt, warmup: fit.warmup,
    density: fit.density1999, seconds: (Date.now() - start) / 1000, recruiters });
  console.log(`${arm} day ${day}: ${n} recruiters, ${((Date.now() - start) / 1000).toFixed(1)} s`);
}

interface Cell { recruiters: M1999Recruiter[]; n: number; provenance: ReturnType<typeof stamp> }
function summarize() {
  const summaries = [];
  for (const day of M1999_DAYS) {
    const base = readJson<Cell>(path.join(ITEM, `results/baseline-d${day}.json`));
    for (const arm of ARMS) {
      const cell = readJson<Cell>(path.join(ITEM, `results/${arm}-d${day}.json`));
      assert.equal(cell.n, 80);
      assert.equal(base.n, cell.n);
      assert.deepEqual(cell.provenance.depends, base.provenance.depends);
      assert.equal(cell.provenance.simHash, base.provenance.simHash);
      assert.deepEqual(cell.provenance.depends, initialStamp.depends);
      assert.equal(cell.provenance.simHash, initialStamp.simHash);
      const xs = cell.recruiters;
      const rows = M1999_TARGETS.filter(t => t.day === day).map(t => {
        const seData = t.sd / Math.sqrt(t.n);
        // Resample the same whole nests in each arm; each arm keeps its own
        // available cases (contactsBefore is NaN without a main bout).
        const bs: number[] = [];
        const rng = RNG.stream(SEED, 0xb020, day, M1999_TARGETS.indexOf(t));
        for (let b = 0; b < 2000; b++) {
          const sample: number[] = [];
          const baseSample: number[] = [];
          for (let j = 0; j < cell.n / PER_NEST; j++) {
            const nest = rng.int(cell.n / PER_NEST);
            for (let k = 0; k < PER_NEST; k++) {
              const i = nest * PER_NEST + k;
              if (Number.isFinite(xs[i][t.stat])) sample.push(xs[i][t.stat]);
              if (Number.isFinite(base.recruiters[i][t.stat])) baseSample.push(base.recruiters[i][t.stat]);
            }
          }
          if (sample.length && baseSample.length) bs.push((mean(sample) - mean(baseSample)) / seData);
        }
        bs.sort((a, b) => a - b);
        const available = xs.map(x => x[t.stat]).filter(Number.isFinite);
        const baseAvailable = base.recruiters.map(x => x[t.stat]).filter(Number.isFinite);
        return { id: t.id, n: available.length, baseN: baseAvailable.length, mean: mean(available),
          baselineMean: mean(baseAvailable), shiftSeData: (mean(available) - mean(baseAvailable)) / seData,
          ci95: [bs[Math.floor(0.025 * bs.length)], bs[Math.floor(0.975 * bs.length)]] };
      });
      const leaving = (kind: 'troph' | 'other') => {
        const n = xs.reduce((s, x) => s + x[kind].n, 0);
        const left = xs.reduce((s, x) => s + x[kind].left, 0);
        const bs: number[] = [];
        const rng = RNG.stream(SEED, 0xb021, day, kind === 'troph' ? 0 : 1);
        for (let b = 0; b < 2000; b++) {
          let bn = 0; let bl = 0;
          for (let j = 0; j < cell.n / PER_NEST; j++) {
            const nest = rng.int(cell.n / PER_NEST);
            for (let k = 0; k < PER_NEST; k++) { const x = xs[nest * PER_NEST + k][kind]; bn += x.n; bl += x.left; }
          }
          if (bn) bs.push(bl / bn);
        }
        bs.sort((a, b) => a - b);
        return { n, left, proportion: n ? left / n : null,
          ci95: [bs[Math.floor(0.025 * bs.length)], bs[Math.floor(0.975 * bs.length)]] };
      };
      summaries.push({ arm, day, rows, troph: leaving('troph'), other: leaving('other') });
    }
  }
  writeJson(path.join(ITEM, 'results/summary.json'), { provenance: unchangedStamp(),
    bootstrap: { replicates: 2000, unit: 'paired whole nest (4 recruiters)', ci: 'percentile 95%, per row; not simultaneous' },
    summaries });
  console.log('wrote summary.json');
}

fs.mkdirSync(path.join(ITEM, 'results'), { recursive: true });
if (process.argv.includes('--summarize')) summarize();
else {
  const pool = await SimPool.create();
  try { if (process.argv.includes('--check')) await check(pool); else await run(pool); }
  finally { pool.close(); }
}
