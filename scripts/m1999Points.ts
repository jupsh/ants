/**
 * Test points for the Mailleux 1999 diagnostics (convergence, warm-up,
 * identifiability): the two fit start points of fitM1999.ts (main layer),
 * or the optimum of a fit file.
 */
import type { ColonyParams } from '../src/sim/experiments/colonyBles';
import { LASIUS_NEST, LASIUS_PARAMS, LASIUS_PARAMS_E2_ALT, MAILLEUX_SETUP, MAILLEUX_SETUP_E2_ALT } from '../src/sim/species/lasiusM1';
import { readJson } from './lib';

export interface M1999Point {
  label: string;
  P: ColonyParams;
  density: number;
  accessible: number;
}

const P0: ColonyParams = { ...LASIUS_PARAMS, nest: LASIUS_NEST };

export function m1999Points(fitFile: string): M1999Point[] {
  if (!fitFile)
    return [
      { label: 'start 1', P: P0, density: 1, accessible: MAILLEUX_SETUP.accessible },
      { label: 'start 2', P: { ...P0, nest: { ...P0.nest, nestSpeedFactor: 0.2, returnRate: 1 / 30, shareEnd: 1 / 30 } }, density: 2.3, accessible: MAILLEUX_SETUP.accessible },
    ];
  const fit = readJson<any>(fitFile);
  const alt = String(fit.layer).startsWith('L0S1 ');
  return [
    {
      label: `optimum of ${fitFile}`,
      P: { ...(alt ? LASIUS_PARAMS_E2_ALT : LASIUS_PARAMS), nest: { ...LASIUS_NEST, ...fit.nest } },
      density: fit.density1999,
      accessible: (alt ? MAILLEUX_SETUP_E2_ALT : MAILLEUX_SETUP).accessible,
    },
  ];
}
