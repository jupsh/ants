/**
 * Test points for the Mailleux 1999 diagnostics (convergence, warm-up,
 * identifiability): the two fit start points of fitM1999.ts (main layer),
 * or the optimum of a fit file. `c2`: the two step-5 start points of `fitM1999.ts --model C2` (D094; main layer).
 */
import type { ColonyParams } from '../src/sim/experiments/colonyBles';
import { LASIUS_NEST, LASIUS_PARAMS, LASIUS_PARAMS_E2_ALT, MAILLEUX_SETUP, MAILLEUX_SETUP_E2_ALT } from '../src/sim/species/lasiusM1';
import { readJson } from './lib';
import { m1999C2Params } from './m1999C2';

export interface M1999Point {
  label: string;
  P: ColonyParams;
  density: number;
  accessible: number;
  /** Observed-contact minimum duration (s) the point was fitted with (option B: 0.04; else the default). */
  contactMin?: number;
}

const P0: ColonyParams = { ...LASIUS_PARAMS, nest: LASIUS_NEST };

export function m1999Points(fitFile: string): M1999Point[] {
  if (fitFile === 'c2') {
    // As fitM1999.ts --model C2: C2's motion, density 3 (mid-box) and the faster return at 2.3; B3 contacts.
    const C = m1999C2Params('main', 'mix');
    return [
      { label: 'C2 start 1', P: C, density: 3, accessible: MAILLEUX_SETUP.accessible, contactMin: 0.04 },
      { label: 'C2 start 2', P: { ...C, nest: { ...C.nest, returnRate: 1 / 30 } }, density: 2.3, accessible: MAILLEUX_SETUP.accessible, contactMin: 0.04 },
    ];
  }
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
      // The fit's recorded parameter set (STATUS 2026-10-10); older files: current defaults plus their nest parameters.
      P: fit.params ?? { ...(alt ? LASIUS_PARAMS_E2_ALT : LASIUS_PARAMS), nest: { ...LASIUS_NEST, ...fit.nest } },
      density: fit.density1999,
      accessible: (alt ? MAILLEUX_SETUP_E2_ALT : MAILLEUX_SETUP).accessible,
      contactMin: fit.contactMin,
    },
  ];
}
