import { describe, expect, it } from 'vitest';
import { combinedZ, meanSd } from '../../src/sim/analysis/compare';
import { raw } from './blesRaw';

// Published means over 1000 runs (Table 1, Table S1, Fig. S4); their SE is
// taken as our run-to-run SD / √1000.
const PAPER: Record<string, number> = { events: 100.1, foragers: 12.2, ff: 3.1, fnf: 44.1, nff: 3.6, nfnf: 49.4 };

describe('E6 reference model: exact reproduction of Bles et al. 2022 (tier 1)', () => {
  it('OC_delta matches the published outputs', () => {
    const sim = raw('OC_delta', 400, 314159) as Record<string, number[]>;
    for (const [k, v] of Object.entries(PAPER)) {
      const s = meanSd(sim[k]);
      const z = combinedZ(s.mean, s.sd / Math.sqrt(s.n), v, s.sd / Math.sqrt(1000));
      expect(Math.abs(z), `${k}: sim ${s.mean.toFixed(2)} vs paper ${v} (z = ${z.toFixed(2)})`).toBeLessThan(3);
    }
  });
});
