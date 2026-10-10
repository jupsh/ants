/**
 * Bout diagnostic at a 1999 point (STATUS 2026-10-10 night, pre-registered
 * under pilot condition 1; not judged, not compared with the 1999 rows):
 * why do sharing bouts end? For every flow bout in the nest during each
 * recruiter's stay: duration, and the ending cause inferred from the
 * partners' state at the step the flow stopped — donor depleted (crop ≤
 * giveFrac × capacity), receiver satiated (crop full or reserve ≥
 * receiveReserve), stalled (both still in the bout with each other, no
 * flow), else random / other (the shareEnd hazard, a partner leaving).
 * Durations of bouts > 3 s (Buffin's observer): mean, SD/mean, and the
 * maximum-likelihood exponential rate 1/(mean − 3). Recruiter bouts and
 * all bouts separately. Independent design; the fit's dt and warm-up.
 *
 * Usage: npx vite-node scripts/diagBoutsM1999.ts --fit f [--n 100]
 */
import { RNG } from '../src/sim/core/rng';
import { ColonySim, type ShareBout } from '../src/sim/experiments/colonyBles';
import { M1999_DAYS, recruiterLoad } from '../src/sim/experiments/colonyMailleux1999';
import { blesApparatus } from '../src/sim/world/apparatus';
import { arg, numArg, readJson } from './lib';
import { m1999Points } from './m1999Points';

const FIT = arg('--fit', '');
const N = numArg('--n', 100);
const fit = readJson<any>(FIT);
const pt = m1999Points(FIT)[0];
const P = pt.P;
const dt = fit.dt ?? 0.1;
const warmup = fit.warmup ?? 300;
const { app } = blesApparatus();
const nest = app.regions.find((r) => r.kind === 'nest')!;
const n = Math.max(1, Math.round((pt.density * (nest.x1 - nest.x0) * (nest.y1 - nest.y0)) / 100));
type Rec = { dur: number; cause: string; recruiter: boolean };
const CAUSES = ['donor depleted', 'receiver satiated', 'stalled', 'random / other'];

for (const day of M1999_DAYS) {
  const recs: Rec[] = [];
  for (let k = 0; k < N; k++) {
    const seed = RNG.stream(31999, day, k).int(2 ** 31);
    const o = { seed, starvationDays: day, density: pt.density, pipetteAccessible: pt.accessible, dt, warmup };
    const load = recruiterLoad(P, o);
    const sim = new ColonySim(P, { seed, ants: n, dt, minutes: (warmup + 1200) / 60 + 0.01, foodMinute: Infinity, starvationDays: day, recruiter: { enterAt: warmup, ...load } });
    let prev = new Map<string, ShareBout>();
    let inStay = false;
    const onStep = (w: any, info: any) => {
      const t = info.t - warmup;
      const a = w.ants[n];
      if (a && t >= 0) inStay = true;
      if (inStay && (!a || info.outside[n] || t >= 1200)) return true;
      if (inStay)
        for (const [key, b] of prev)
          if (!sim.open.has(key) || sim.open.get(key) !== b) {
            const d = w.ants[b.donor].body;
            const r = w.ants[b.receiver].body;
            const md = w.ants[b.donor].mind;
            const mr = w.ants[b.receiver].mind;
            let cause = 'random / other';
            if (d.cropUl <= P.nest.giveFrac * d.morph.cropCapacity) cause = 'donor depleted';
            else if (r.cropUl >= r.morph.cropCapacity * r.morph.cropFullFrac || r.reserve / r.reserveMax >= P.nest.receiveReserve) cause = 'receiver satiated';
            else if (md.mode === 'give' && md.stay?.bout?.partner === b.receiver && mr.mode === 'receive' && mr.stay?.bout?.partner === b.donor) cause = 'stalled';
            recs.push({ dur: b.end - b.start, cause, recruiter: b.donor === n || b.receiver === n });
          }
      prev = new Map(sim.open);
      return false;
    };
    while (sim.stepIndex < sim.steps) if (sim.step(onStep)) break;
  }
  for (const [label, sel] of [['recruiter bouts', (x: Rec) => x.recruiter], ['all bouts', (_: Rec) => true]] as const) {
    const all = recs.filter(sel);
    const long = all.filter((x) => x.dur > 3);
    const ds = long.map((x) => x.dur);
    const m = ds.reduce((s, x) => s + x, 0) / Math.max(1, ds.length);
    const sd = Math.sqrt(ds.reduce((s, x) => s + (x - m) ** 2, 0) / Math.max(1, ds.length - 1));
    const share = (xs: Rec[]) => CAUSES.map((c) => `${c} ${((100 * xs.filter((x) => x.cause === c).length) / Math.max(1, xs.length)).toFixed(0)} %`).join(', ');
    console.log(`${day} d, ${label}: ${all.length} bouts, ${long.length} > 3 s; > 3 s: mean ${m.toFixed(1)} s, SD/mean ${(sd / m).toFixed(2)}, ML pair rate ${(1 / (m - 3)).toFixed(4)} /s`);
    console.log(`   causes (> 3 s): ${share(long)}`);
    console.log(`   causes (all):   ${share(all)}`);
  }
}
