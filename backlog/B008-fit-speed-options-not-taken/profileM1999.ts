/** B008: CPU-profile workload — largest pilot nest (start 2, density 2.3, 53 nestmates), day 1, 4 independent recruiters. */
import { RNG } from '../../src/sim/core/rng';
import { runRecruiter1999 } from '../../src/sim/experiments/colonyMailleux1999';
import { seedFor } from '../../scripts/lib';
import { m1999Points } from '../../scripts/m1999Points';

const pt = m1999Points('')[1];
const BASE = seedFor(1999, 'diag', 8008);
for (let k = 0; k < 4; k++) {
  const r = runRecruiter1999(pt.P, { seed: RNG.stream(BASE, 1, k).int(2 ** 31), starvationDays: 1, density: pt.density, pipetteAccessible: pt.accessible, warmup: 300, dt: 0.1 });
  console.log(`recruiter ${k}: stay ${r.timeInNest.toFixed(0)} s, contacts ${r.contacts}`);
}
