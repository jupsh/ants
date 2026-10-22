/**
 * B014: Mailleux 1999 workload parameters. `pilot`: B008's largest pilot nest (start 2). `c2`: a PROXY for step 5,
 * C2's start-0 in-nest motion keys copied onto the same nest (cost-representative only, not a step-5 model).
 */
import type { ColonyParams } from '../../src/sim/experiments/colonyBles';
import { m1999Points } from '../../scripts/m1999Points';
import { C2_DRIVE_START, loadTrips, s2018Params, S2018_START } from '../../scripts/s2018Lib';

export function m1999Workload(motion: string): { P: ColonyParams; density: number; accessible: number } {
  const pt = m1999Points('')[1];
  if (motion === 'pilot') return { P: pt.P, density: pt.density, accessible: pt.accessible };
  if (motion !== 'c2') throw new Error('motion: pilot | c2');
  const c2 = s2018Params({ ...S2018_START, ...C2_DRIVE_START[0] }, loadTrips().outRate, 'C2').nest;
  const keys = ['restToActive', 'activeToRest', 'restCrowdExp', 'encounterStop', 'encounterMin', 'encounterGap', 'restShape', 'restDeepFrac', 'restDeepRatio', 'walkOnSd', 'driveSd', 'driveTau', 'nestSpeedFactor', 'nestPauseFactor', 'nestSpeedSdFactor', 'nestSpeedTauFactor', 'wallRule'] as const;
  const nest: Record<string, unknown> = { ...pt.P.nest };
  for (const k of keys) nest[k] = c2[k];
  // The forager overlay without its trip rate (Mailleux nestmates make no Stroeymeyt trips; the recruiter is a forager).
  const { outRate: _o, ...fo } = c2.forager ?? {};
  nest.forager = fo;
  return { P: { ...pt.P, nest: nest as ColonyParams['nest'] }, density: pt.density, accessible: pt.accessible };
}
