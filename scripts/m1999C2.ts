/**
 * Step 5 (D094, choices of 2026-10-20): C2's in-nest motion transferred unchanged onto the Mailleux 1999 nest model.
 * The base is the 1999 protocol's own parameters (E2 layer, `LASIUS_NEST`, as `fitM1999.ts --model A`); only the motion
 * keys below take C2's fitted values (nurse values and the forager overlay). Not transferred: the Stroeymeyt trip inputs
 * (`forager.outRate`; no trips in the 1999 protocol), the Stroeymeyt water set-up (`thirstFrac`, `phys.cropWaterRate`)
 * and its `returnRate` 0 (step 5 fits `returnRate`). Checked 2026-10-20: these are the only keys in which C2's
 * parameters differ from the base besides the motion keys.
 */
import fs from 'node:fs';
import type { ColonyParams } from '../src/sim/experiments/colonyBles';
import type { NestParams } from '../src/sim/behavior/lasiusNestWorker';
import { LASIUS_NEST, LASIUS_PARAMS, LASIUS_PARAMS_E2_ALT } from '../src/sim/species/lasiusM1';
import { loadS2018, loadTrips, s2018Params } from './s2018Lib';

export const C2_FIT = 'data/fits/s2018-motion-c2.json';

/** The in-nest motion keys C2 sets (B014's proxy list): rates, rest form, per-ant variation, walking, walls. */
export const M1999_C2_MOTION_KEYS = [
  'restToActive',
  'activeToRest',
  'restCrowdExp',
  'encounterStop',
  'encounterMin',
  'encounterGap',
  'restShape',
  'restDeepFrac',
  'restDeepRatio',
  'walkOnSd',
  'driveSd',
  'driveTau',
  'nestSpeedFactor',
  'nestPauseFactor',
  'nestSpeedSdFactor',
  'nestSpeedTauFactor',
  'wallRule',
] as const satisfies readonly (keyof NestParams)[];

/**
 * The 1999 parameters with C2's motion: `layer` main (L0S1c) or alt (L0S1), C2's point from `fitFile`'s `free`.
 * `roles` (D094 open choice 1): 'mix' (default) gives each nestmate the forager trait with probability
 * `c2ForagerShare()` (the existing `foragerFrac` draw, per ant from its own trait stream); 'nurse' none (the
 * sensitivity). The recruiter always has it.
 */
export function m1999C2Params(layer: 'main' | 'alt', roles: 'mix' | 'nurse' = 'mix', fitFile = C2_FIT): ColonyParams {
  const free = JSON.parse(fs.readFileSync(fitFile, 'utf8')).free;
  const c2 = s2018Params(free, loadTrips().outRate, 'C2').nest;
  const nest: Record<string, unknown> = { ...LASIUS_NEST };
  for (const k of M1999_C2_MOTION_KEYS) nest[k] = c2[k];
  // The forager overlay without its trip rate (the recruiter and forager nestmates make no Stroeymeyt trips).
  const { outRate: _outRate, ...forager } = c2.forager ?? {};
  nest.forager = forager;
  nest.foragerFrac = roles === 'mix' ? c2ForagerShare() : 0;
  return { ...(layer === 'main' ? LASIUS_PARAMS : LASIUS_PARAMS_E2_ALT), nest: nest as unknown as NestParams };
}

/**
 * Open choice 1 (a): the share of 1999 nestmates drawn as foragers = the 22 fit colonies' mean forager share of
 * workers (nurses + foragers; queen excluded), the role mix C2 was fitted on. 0.320 (range 0.10–0.69) on 2026-10-20.
 */
export function c2ForagerShare(): number {
  const s = loadS2018().colonies.map((c) => c.ants.forager / (c.ants.forager + c.ants.nurse));
  return s.reduce((a, b) => a + b, 0) / s.length;
}
