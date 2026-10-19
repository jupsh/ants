/**
 * B001: leaveCropFrac sweep at the Mailleux 1999 pilot optimum.
 * Levels (crop fraction below which a hungry active ant may leave) ×
 * starvation days, paired seeds (same seed for every level), shared
 * warm-ups, followNestmates on (Table 2b). Aggregates Table 2a means
 * (guard: shift vs the 0.05 level, in SE_data) and Table 2b proportions.
 * Run from repo root:
 *   npx vite-node backlog/B001-contact-triggered-leaving-mailleux/sweep.ts [--n 240] [--levels 0.05,0.25,0.5,1] [--days 1,4,8] [--out results/sweep.json]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { M1999_DAYS, M1999_LEAVE, M1999_TARGETS, type M1999Day, type M1999Recruiter } from '../../src/sim/experiments/colonyMailleux1999';
import type { ColonyParams } from '../../src/sim/experiments/colonyBles';
import { MAILLEUX_SETUP } from '../../src/sim/species/lasiusM1';
import { arg, numArg, readJson, seedFor, writeJson } from '../../scripts/lib';
import { SimPool } from '../../scripts/pool';
import { stamp } from '../_lib/stamp';

const ITEM = path.dirname(fileURLToPath(import.meta.url));
const FIT = 'data/fits/colony-m1999-main-shared-pilot.json';
const N = numArg('--n', 240);
const LEVELS = arg('--levels', '0.05,0.25,0.5,1').split(',').map(Number);
const DAYS = arg('--days', '1,4,8').split(',').map(Number) as M1999Day[];
const OUT = arg('--out', 'results/sweep.json');
const SEED = seedFor(1999, 'diag', 1001);

const fit = readJson<any>(FIT);
const baseP: ColonyParams = fit.params;
const perNest: number = fit.design?.recruitersPerNest ?? 4;

const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
const sd = (xs: number[]) => (xs.length > 1 ? Math.sqrt(xs.reduce((a, b) => a + (b - mean(xs)) ** 2, 0) / (xs.length - 1)) : NaN);

const pool = await SimPool.create();
console.log(`pool ${pool.size} workers; N=${N}/day; seed=${SEED}; levels=${LEVELS.join(',')}`);
const levels: any[] = [];
for (const lv of LEVELS) {
  const P: ColonyParams = { ...baseP, nest: { ...baseP.nest, leaveCropFrac: lv } };
  const days: any = {};
  for (const day of DAYS) {
    const t0 = Date.now();
    const xs: M1999Recruiter[] = await pool.m1999Shared(
      P,
      { seed: SEED, starvationDays: day, density: fit.density1999, pipetteAccessible: MAILLEUX_SETUP.accessible, warmup: fit.warmup, dt: fit.dt, followNestmates: true, contactMin: fit.contactMin },
      N,
      perNest,
    );
    const rows = M1999_TARGETS.filter((t) => t.day === day).map((t) => {
      const v = xs.map((x) => x[t.stat]).filter(Number.isFinite);
      return { id: t.id, stat: t.stat, mean: mean(v), sd: sd(v), n: v.length, seData: t.sd / Math.sqrt(t.n), dataMean: t.mean };
    });
    const agg = (k: 'troph' | 'other') => {
      const n = xs.reduce((a, x) => a + x[k].n, 0);
      const left = xs.reduce((a, x) => a + x[k].left, 0);
      return { n, left, prop: n ? left / n : NaN };
    };
    days[day] = {
      seconds: (Date.now() - t0) / 1000,
      rows,
      table2b: { troph: agg('troph'), other: agg('other'), data: M1999_LEAVE[day] },
      recruiters: xs.map((x) => ({ timeInNest: x.timeInNest, distance: x.distance, contacts: x.contacts, trophTotal: x.trophTotal, contactsBefore: x.contactsBefore, troph: x.troph, other: x.other })),
    };
    const d = days[day];
    console.log(`lv ${lv} day ${day}: ${d.seconds.toFixed(0)}s troph ${(100 * d.table2b.troph.prop).toFixed(1)}% (n${d.table2b.troph.n}; data ${100 * M1999_LEAVE[day].afterTroph}%) other ${(100 * d.table2b.other.prop).toFixed(1)}% (n${d.table2b.other.n}; data ${100 * M1999_LEAVE[day].afterOther}%)`);
  }
  levels.push({ leaveCropFrac: lv, days });
}
pool.close();

// Guard: Table-2a shift of each level vs the first (0.05) level, in SE_data.
const base = levels[0];
for (const lv of levels) {
  lv.maxAbsShiftSeData = 0;
  lv.shifts = [];
  for (const day of DAYS) {
    if (!base.days[day] || !lv.days[day]) continue;
    for (const r of lv.days[day].rows) {
      const b = base.days[day].rows.find((q: any) => q.id === r.id);
      const shift = (r.mean - b.mean) / r.seData;
      lv.shifts.push({ id: r.id, shiftSeData: shift });
      lv.maxAbsShiftSeData = Math.max(lv.maxAbsShiftSeData, Math.abs(shift));
    }
  }
}

const out = {
  provenance: stamp(ITEM),
  question: 'B001 leaveCropFrac sweep at the pilot optimum',
  fit: FIT,
  seed: SEED,
  nPerDay: N,
  perNest,
  warmup: fit.warmup,
  dt: fit.dt,
  density: fit.density1999,
  levels,
};
const outAbs = path.isAbsolute(OUT) ? OUT : path.join(ITEM, OUT);
fs.mkdirSync(path.dirname(outAbs), { recursive: true });
writeJson(outAbs, out);
console.log(`wrote ${outAbs}`);
