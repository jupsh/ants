/**
 * B008 measurement 1: where a Mailleux 1999 recruiter run's time goes.
 * Times, serially on this machine: warm-up alone (ColonySim stepped to the
 * recruiter's entry, replicating colonyOptions in colonyMailleux1999.ts),
 * the E2 recruiter load, full independent recruiters, and shared-warm-up
 * nests (perNest 4), at both m1999Points starts and days 1 and 8.
 * Also times dt 0.2 / 0.05 recruiters (step-count scaling for multi-fidelity).
 * Run from the repo root: npx vite-node backlog/B008-fit-speed-options-not-taken/timeM1999.ts
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RNG } from '../../src/sim/core/rng';
import { blesApparatus } from '../../src/sim/world/apparatus';
import { ColonySim } from '../../src/sim/experiments/colonyBles';
import { recruiterLoad, runNest1999, runRecruiter1999, type M1999Options } from '../../src/sim/experiments/colonyMailleux1999';
import { seedFor, writeJson } from '../../scripts/lib';
import { m1999Points } from '../../scripts/m1999Points';
import { stamp } from '../_lib/stamp';

const ITEM = path.dirname(fileURLToPath(import.meta.url));
const WARMUP = 300;
const DT = 0.1;
const BASE = seedFor(1999, 'diag', 8008);
const ms = (t0: number) => Date.now() - t0;
const stats = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  return { n: xs.length, mean, median: s[Math.floor(s.length / 2)], min: s[0], max: s[s.length - 1], sum: xs.reduce((a, b) => a + b, 0) };
};

function nestmates(density: number): number {
  const { app } = blesApparatus();
  const nest = app.regions.find((r) => r.kind === 'nest')!;
  return Math.max(1, Math.round((density * (nest.x1 - nest.x0) * (nest.y1 - nest.y0)) / 100));
}

const points = m1999Points('');
const out: any = { provenance: stamp(ITEM), base: { commitNote: 'see provenance', warmup: WARMUP, dt: DT, seedBase: BASE }, points: [] };

for (const [pi, pt] of points.entries()) {
  const n = nestmates(pt.density);
  const rec: any = { label: pt.label, density: pt.density, nestmates: n, days: {} };
  for (const day of [1, 8] as const) {
    const o: M1999Options = { seed: BASE, starvationDays: day, density: pt.density, pipetteAccessible: pt.accessible, warmup: WARMUP, dt: DT };
    // Warm-up alone: same ColonySim set-up as colonyOptions(o, seed, n, enterAt), stepped to entry.
    const warmMs: number[] = [];
    for (let k = 0; k < 3; k++) {
      const seed = RNG.stream(BASE, day, 0xaa, k).int(2 ** 31);
      const sim = new ColonySim(pt.P, { seed, ants: n, dt: DT, minutes: (WARMUP + 1200) / 60 + 0.01, foodMinute: Infinity, starvationDays: day });
      const t0 = Date.now();
      while (sim.stepIndex * sim.dt < WARMUP - 1e-9) sim.step();
      warmMs.push(ms(t0));
    }
    // Recruiter load (E2 scout run inside every recruiter).
    const loadMs: number[] = [];
    for (let k = 0; k < 3; k++) {
      const t0 = Date.now();
      recruiterLoad(pt.P, { ...o, seed: RNG.stream(BASE, day, 0xbb, k).int(2 ** 31) });
      loadMs.push(ms(t0));
    }
    // Independent recruiters.
    const indMs: number[] = [];
    const stays: number[] = [];
    for (let k = 0; k < 6; k++) {
      const t0 = Date.now();
      const r = runRecruiter1999(pt.P, { ...o, seed: RNG.stream(BASE, day, k).int(2 ** 31) });
      indMs.push(ms(t0));
      stays.push(r.timeInNest);
    }
    // Shared-warm-up nests, 4 recruiters each.
    const nestMs: number[] = [];
    for (let k = 0; k < 3; k++) {
      const t0 = Date.now();
      runNest1999(pt.P, { ...o, seed: RNG.stream(BASE, day, 0xcc, k).int(2 ** 31) }, k, 4);
      nestMs.push(ms(t0));
    }
    rec.days[day] = { warmupAlone: stats(warmMs), recruiterLoad: stats(loadMs), independent: stats(indMs), sharedNest4: stats(nestMs), sharedPerRecruiterMs: nestMs.map((v) => v / 4), staySeconds: stats(stays) };
    console.log(`${pt.label} day ${day}: n=${n} warmup ${stats(warmMs).mean.toFixed(0)} ms, load ${stats(loadMs).mean.toFixed(0)} ms, independent ${stats(indMs).mean.toFixed(0)} ms, shared/4 ${(stats(nestMs).mean / 4).toFixed(0)} ms/recruiter, stay ${stats(stays).mean.toFixed(0)} s`);
  }
  // dt scaling at day 1 (2 recruiters each).
  rec.dtScaling = {};
  for (const dt of [0.2, 0.05]) {
    const xs: number[] = [];
    for (let k = 0; k < 2; k++) {
      const t0 = Date.now();
      runRecruiter1999(pt.P, { seed: RNG.stream(BASE, 1, 0xdd, k).int(2 ** 31), starvationDays: 1, density: pt.density, pipetteAccessible: pt.accessible, warmup: WARMUP, dt });
      xs.push(ms(t0));
    }
    rec.dtScaling[dt] = stats(xs);
    console.log(`${pt.label} dt ${dt}: ${stats(xs).mean.toFixed(0)} ms/recruiter`);
  }
  out.points.push(rec);
}
writeJson(path.join(ITEM, 'results/timings.json'), out);
console.log('wrote results/timings.json');
