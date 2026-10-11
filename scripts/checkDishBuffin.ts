/**
 * Buffin-dish check (STATUS 2026-10-10 night; a check at each 1999 optimum,
 * not a fit): does the model's trophallaxis reproduce Buffin et al. 2011's
 * fed → starved duration distribution (1 M sucrose, 4-d starved; Table 2:
 * 29 ± 28 s, ending rate 0.039 /s, n 66, exponential)?
 *
 * Set-up: the nest chamber with 46 workers (≈ 2.0 /cm², as the 5 cm dish
 * with 40), 23 fed (crop 0.9 µL of 1 M sucrose, Buffin's quoted intake) and
 * 23 starved, all with 4-d reserves (the 2 h of feeding may have refilled
 * reserves too: disclosed), no leaving (closed dish: leaveRate 0, no trip
 * memory), 30 min, the fit's parameters and dt. Observer: flow bouts from a
 * fed-group donor to a starved-group receiver lasting > 3 s (Buffin's
 * threshold); bouts still running at 30 min are dropped. Estimates: the ML
 * exponential rate 1/(mean − 3), Buffin's log-survival slope, and SD/mean.
 * Pass (pre-registered in STATUS): |z| ≤ 2 for the rate against 0.039 (SE
 * 0.039/√66) and for SD/mean against Buffin's 28/29 (SE from a parametric
 * bootstrap of 66 shifted-exponential durations), each with the simulation's
 * own SE added.
 *
 * Usage: npx vite-node scripts/checkDishBuffin.ts --fit f [--dishes 200]
 */
import { RNG } from '../src/sim/core/rng';
import { ColonySim } from '../src/sim/experiments/colonyBles';
import { sucroseSugarPerUl, sucroseWaterPerUl } from '../src/sim/physics/ledger';
import { arg, numArg, readJson } from './lib';
import { m1999Points } from './m1999Points';

const FIT = arg('--fit', '');
const DISHES = numArg('--dishes', 200);
const fit = readJson<any>(FIT);
const pt = m1999Points(FIT)[0];
const P = { ...pt.P, nest: { ...pt.P.nest, leaveRate: 0 } };
const dt = fit.dt ?? 0.1;
const FED = 23;
const ANTS = 46;
const T0 = 3;
const DATA = { p: 0.039, n: 66, cv: 28 / 29 };

const durs: number[] = [];
const perDish: number[][] = [];
for (let k = 0; k < DISHES; k++) {
  const seed = RNG.stream(0xb0ff, 2011, k).int(2 ** 31);
  const sim = new ColonySim(P, { seed, ants: ANTS, dt, minutes: 30, foodMinute: Infinity, starvationDays: 4 });
  for (let i = 0; i < FED; i++) {
    const b = sim.w.ants[i].body;
    b.cropUl = 0.9;
    b.cropSugar = 0.9 * sucroseSugarPerUl(1);
    b.cropWater = 0.9 * sucroseWaterPerUl(1);
    sim.w.ledger.move('sugar', 'external', 'crop', b.cropSugar);
    sim.w.ledger.move('water', 'external', 'crop', b.cropWater);
  }
  while (sim.stepIndex < sim.steps) sim.step();
  const mine = sim.bouts.filter((b) => b.donor < FED && b.receiver >= FED && b.end - b.start > T0).map((b) => b.end - b.start);
  perDish.push(mine);
  durs.push(...mine);
}

const mean = (v: number[]) => v.reduce((s, x) => s + x, 0) / v.length;
const sdOf = (v: number[]) => {
  const m = mean(v);
  return Math.sqrt(v.reduce((s, x) => s + (x - m) ** 2, 0) / (v.length - 1));
};
const pML = (v: number[]) => 1 / (mean(v) - T0);
const cv = (v: number[]) => sdOf(v) / mean(v);
/** Buffin's estimator: least-squares fit of ln S(t) = ln k − p t over the empirical survival points. */
const pSlope = (v: number[]) => {
  const s = v.slice().sort((a, b) => a - b);
  const pts = s.map((t, i) => [t, Math.log(1 - i / s.length)] as const);
  const mt = mean(pts.map((q) => q[0]));
  const my = mean(pts.map((q) => q[1]));
  const sxy = pts.reduce((a, q) => a + (q[0] - mt) * (q[1] - my), 0);
  const sxx = pts.reduce((a, q) => a + (q[0] - mt) ** 2, 0);
  return -sxy / sxx;
};
// Simulation SEs: bootstrap over dishes (dishes are the replicates).
const rng = RNG.stream(0xb0ff, 2011, 'boot'.length);
const boot = (stat: (v: number[]) => number) => {
  const reps = Array.from({ length: 1000 }, () => stat(Array.from({ length: DISHES }, () => perDish[rng.int(DISHES)]).flat()));
  return sdOf(reps);
};
// Data SE of SD/mean: parametric bootstrap of 66 durations, 3 s + exponential at Buffin's rate.
const dataCvSe = sdOf(Array.from({ length: 4000 }, () => cv(Array.from({ length: DATA.n }, () => T0 + rng.exp(1 / DATA.p)))));
const p = pML(durs);
const zP = (p - DATA.p) / Math.hypot(DATA.p / Math.sqrt(DATA.n), boot(pML));
const c = cv(durs);
const zC = (c - DATA.cv) / Math.hypot(dataCvSe, boot(cv));
console.log(`${FIT}: ${DISHES} dishes, dt ${dt}; fed→starved bouts > ${T0} s: ${durs.length}`);
console.log(`  ending rate: ML ${p.toFixed(4)} /s (z ${zP.toFixed(2)} vs 0.039), log-survival slope ${pSlope(durs).toFixed(4)} /s; mean ${mean(durs).toFixed(1)} s`);
console.log(`  SD/mean ${c.toFixed(2)} (z ${zC.toFixed(2)} vs ${DATA.cv.toFixed(2)}, data SE ${dataCvSe.toFixed(3)})`);
console.log(`  dish check: ${Math.abs(zP) <= 2 && Math.abs(zC) <= 2 ? 'PASS' : 'FAIL'}`);
