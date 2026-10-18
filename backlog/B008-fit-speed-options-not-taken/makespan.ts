/**
 * B008 measurement 2: one CMA-ES generation's makespan on 62 workers, modelled
 * from results/timings.json (greedy list scheduling over task times resampled
 * uniformly in each measured cell's [min, max]; 200 replicates, median).
 * Designs: independent (240 recruiter tasks/eval), --perNest 4 shared
 * (60 nest tasks/eval), screening subsets, and multi-fidelity dt scalings.
 * Run: npx vite-node backlog/B008-fit-speed-options-not-taken/makespan.ts
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RNG } from '../../src/sim/core/rng';
import { readJson, writeJson } from '../../scripts/lib';
import { stamp } from '../_lib/stamp';

const ITEM = path.dirname(fileURLToPath(import.meta.url));
const timings = readJson<any>(path.join(ITEM, 'results/timings.json'));
const cells = timings.points.flatMap((p: any) => Object.values(p.days)) as any[];
const pick = (arr: number[], rng: RNG) => arr[rng.int(arr.length)];
// Resample a task time: pick a measured cell, then uniform in its [min, max].
const sampleFrom = (key: string, rng: RNG) => {
  const c = pick(cells, rng) as any;
  const s = key === 'nest' ? c.sharedNest4 : c.independent;
  return s.min + rng.next() * (s.max - s.min);
};
function makespan(taskMs: number[], workers: number): number {
  const load = new Array(workers).fill(0);
  for (const t of taskMs) {
    let m = 0;
    for (let w = 1; w < workers; w++) if (load[w] < load[m]) m = w;
    load[m] += t;
  }
  return Math.max(...load);
}
const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

const WORKERS = 62;
const LAMBDA = 4 + Math.floor(3 * Math.log(7)); // fitM1999: k = 7 free
const N_PER_DAY = 80;
const DAYS = 3;
const rng = RNG.stream(8008, 62);
const reps = 200;
const gen = (tasksPerEval: number, key: string) => {
  const one = () => makespan(Array.from({ length: tasksPerEval * LAMBDA }, () => sampleFrom(key, rng)), WORKERS) / 1000;
  const xs = Array.from({ length: reps }, one);
  return { tasksPerEval, tasksPerGen: tasksPerEval * LAMBDA, medianMakespanS: median(xs), meanWorkS: xs.reduce((a, b) => a + b, 0) / reps };
};
const work = (key: string, tasksPerEval: number) => {
  const means = cells.map((c: any) => (key === 'nest' ? c.sharedNest4.mean : c.independent.mean));
  const meanTask = means.reduce((a, b) => a + b, 0) / means.length;
  return { meanTaskMs: meanTask, totalWorkPerGenS: (meanTask * tasksPerEval * LAMBDA) / 1000, lowerBound62S: (meanTask * tasksPerEval * LAMBDA) / 1000 / WORKERS };
};

const dtScale = timings.points.map((p: any) => ({ label: p.label, dt02vs01: p.dtScaling['0.2'].mean / ((p.days['1'].independent.mean + p.days['8'].independent.mean) / 2), dt005vs01: p.dtScaling['0.05'].mean / ((p.days['1'].independent.mean + p.days['8'].independent.mean) / 2) }));
const warmShares = timings.points.flatMap((p: any) => Object.entries(p.days).map(([d, c]: any) => ({ point: p.label, day: d, nestmates: p.nestmates, warmupShareOfIndependent: c.warmupAlone.mean / c.independent.mean, loadMs: c.recruiterLoad.mean, sharedSavingVsIndependent: c.independent.mean / (c.sharedNest4.mean / 4) })));

const out = {
  provenance: stamp(ITEM),
  assumptions: { workers: WORKERS, lambda: LAMBDA, recruitersPerDayPerEval: N_PER_DAY, days: DAYS, note: 'Local single-core task times; a slower box core scales all designs equally. Pilot nest motion: indicative only.' },
  warmupShares: warmShares,
  dtScaling: dtScale,
  designs: {
    independent: { ...gen(N_PER_DAY * DAYS, 'ind'), ...work('ind', N_PER_DAY * DAYS) },
    sharedPerNest4: { ...gen((N_PER_DAY * DAYS) / 4, 'nest'), ...work('nest', (N_PER_DAY * DAYS) / 4) },
    // Screening: half the recruiters per day (40/day), independent tasks; shared variant in the note.
    screenHalfRecruiters: { ...gen((N_PER_DAY / 2) * DAYS, 'ind'), ...work('ind', (N_PER_DAY / 2) * DAYS) },
    screenTwoDays: { ...gen(N_PER_DAY * 2, 'ind'), ...work('ind', N_PER_DAY * 2) },
    screenHalfShared: { ...gen(((N_PER_DAY / 2) * DAYS) / 4, 'nest'), ...work('nest', ((N_PER_DAY / 2) * DAYS) / 4) },
  },
  // Multi-fidelity saving is a per-task factor on top of any design above.
  multiFidelity: { dt02Factor: dtScale.map((d: any) => d.dt02vs01), comment: 'dt 0.2 task time / dt 0.1 task time, measured; combining dt 0.2 with half recruiters multiplies the factors.' },
};
writeJson(path.join(ITEM, 'results/makespan.json'), out);
console.log(JSON.stringify(out, null, 1).slice(0, 3000));
