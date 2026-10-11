/**
 * Derives option B's in-nest speed factors (STATUS 2026-10-10 night, spec
 * B2): the factor f on the E6-context walker (pauses off, as in the nest
 * under option B) at which the mean speed over 3-s paths on a flat open
 * plane equals Depickère et al. 2004's moving speeds: foragers 3.67 ± 1.48,
 * brood-tenders 2.91 ± 0.96 cm/s (80 paths of 3 s, 40 per caste). With
 * pauses off, path length is proportional to f, so f = target / speed at
 * f = 1. Also reports the SD over paths (reported, not used). Not fitted to
 * any target. Writes nothing; the values go into lasiusM1.ts (LASIUS_NEST_B_DEF).
 *
 * Usage: npx vite-node scripts/calibNestSpeed.ts [--n 2000]
 */
import { RNG } from '../src/sim/core/rng';
import { initWalkState, walkStep } from '../src/sim/models/walk';
import { basicPercept } from '../src/sim/perception/types';
import { E6_CONTEXT, LASIUS_PARAMS } from '../src/sim/species/lasiusM1';
import { numArg } from './lib';

const N = numArg('--n', 2000);
const DT = 0.025;
const SEED = 0xca1b_5bed;
const TARGET = { forager: { m: 36.7, sd: 14.8 }, broodTender: { m: 29.1, sd: 9.6 } }; // mm/s
const W = { ...LASIUS_PARAMS.walk, speed: LASIUS_PARAMS.walk.speed * E6_CONTEXT.walkSpeedFactor, pauseRate: 0 };

// One 3-s path per ant, after 10 s of walking (independent ants, as 40 paths from two experiments).
const v: number[] = [];
for (let a = 0; a < N; a++) {
  const rng = RNG.stream(SEED, a);
  const s = initWalkState(W, rng);
  const per = basicPercept(DT, 0, 0, 22);
  const pi = { x: 0, y: 0 };
  let len = 0;
  const steps = Math.round(3 / DT);
  const skip = Math.round(10 / DT);
  for (let k = 0; k < skip + steps; k++) walkStep(W, s, per, 1, pi, (_dx, _dy, l) => (len += k >= skip ? l : 0));
  v.push(len / 3);
}
const m = v.reduce((x, y) => x + y, 0) / v.length;
const sd = Math.sqrt(v.reduce((x, y) => x + (y - m) ** 2, 0) / (v.length - 1));
console.log(`E6-context walker, pauses off, flat plane, ${N} paths of 3 s: ${(m / 10).toFixed(2)} ± ${(sd / 10).toFixed(2)} cm/s (SD/mean ${(sd / m).toFixed(2)})`);
for (const [k, t] of Object.entries(TARGET))
  console.log(`  ${k}: f = ${(t.m / m).toFixed(3)} → ${(t.m / 10).toFixed(2)} ± ${((sd * t.m) / m / 10).toFixed(2)} cm/s   [data ${(t.m / 10).toFixed(2)} ± ${(t.sd / 10).toFixed(2)}; SD reported, not used]`);
