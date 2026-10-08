import { describe, expect, it } from 'vitest';
import { combinedZ, meanSd } from '../../src/sim/analysis/compare';
import { raw } from './blesRaw';

// Published means over 1000 runs (Table 1, Table S1, Fig. S4); their SE is
// taken as our run-to-run SD / √1000.
const PAPER: Record<string, number> = { events: 98.7, foragers: 12.5, ff: 9.7, fnf: 49.6, nff: 7.1, nfnf: 32.0, t50: 29.47 };

describe('E6 reference model: exact reproduction of Bles et al. 2022 (tier 1)', () => {
  it('TEC_exp matches the published outputs', () => {
    const sim = raw('TEC_exp', 400, 314159) as Record<string, number[]>;
    for (const [k, v] of Object.entries(PAPER)) {
      const s = meanSd(sim[k]);
      const z = combinedZ(s.mean, s.sd / Math.sqrt(s.n), v, s.sd / Math.sqrt(1000));
      expect(Math.abs(z), `${k}: sim ${s.mean.toFixed(2)} vs paper ${v} (z = ${z.toFixed(2)})`).toBeLessThan(3);
    }
  });
});
