import { binomialSE } from '../analysis/compare';
import type { ScoutResult } from './e2Mailleux';
import type { Condition, Target } from './e2Targets';

/**
 * Held-out test for the E2 models: Mailleux, Deneubourg & Detrain 2003
 * (Proc R Soc B 270:1609, Table 1). Six 0.3 µL drops of 0.6 M sucrose in two
 * rows of three, 10 mm apart, centred in the 6 × 6 cm area. Simulation and
 * scoring were pre-registered (docs/STATUS.md, Decisions log, step 3b)
 * before any model was run on these data. Starvation is not reported; 4
 * days is primary, 1 and 8 days are sensitivity runs.
 */
const SRC = 'mailleux2003';
const m = (id: string, label: string, value: number, sd: number, n: number, unit: string): Target => ({ id, label, role: 'heldout', value, sd, n, se: sd / Math.sqrt(n), unit, source: SRC });

export const SIX_TARGETS: Target[] = [
  { id: 'six.trail', label: 'Six 0.3 µL drops: scouts laying trail', role: 'heldout', value: 0.57, n: 88, se: binomialSE(0.57, 88), unit: '', source: SRC },
  m('six.ul', 'Six drops: ingested volume, all scouts', 0.8, 0.5, 65, 'µL'),
  m('six.visits', 'Six drops: pipettes visited, all scouts', 2.8, 1.3, 88, 'n'),
  m('six.exploit', 'Six drops: exploitation time, all scouts', 115, 67, 86, 's'),
  m('six.ulTL', 'Six drops: ingested volume, trail layers', 0.9, 0.5, 37, 'µL'),
  m('six.ulNTL', 'Six drops: ingested volume, non-layers', 0.8, 0.5, 28, 'µL'),
  m('six.visitsTL', 'Six drops: pipettes visited, trail layers', 2.9, 1.3, 50, 'n'),
  m('six.visitsNTL', 'Six drops: pipettes visited, non-layers', 2.5, 1.3, 38, 'n'),
  m('six.exploitTL', 'Six drops: exploitation time, trail layers', 127, 71, 48, 's'),
  m('six.exploitNTL', 'Six drops: exploitation time, non-layers', 101, 58, 38, 's'),
];

/** The four pre-registered primary measures. */
export const SIX_PRIMARY = ['six.trail', 'six.ul', 'six.visits', 'six.exploit'];

export const SIX_DROPS = [140, 150, 160].flatMap((x) => [-5, 5].map((y) => ({ x, y, ul: 0.3, molar: 0.6 })));

export function sixPipetteCondition(days: number): Condition {
  return {
    id: `six${days}`,
    label: `Mailleux 2003: six 0.3 µL drops, ${days} days starved`,
    options: (n, seed0, su, dt) => Array.from({ length: n }, (_, i) => ({ seed: seed0 + i, drop1: { ul: 0, molar: 0.6 }, drops: SIX_DROPS, pipetteAccessible: su.accessible, volumeSd: su.volumeSd, starvationDays: days, dt, maxTime: 900 })),
    metrics: (rs: ScoutResult[]) => {
      const tl = rs.filter((r) => r.laidFirst25);
      const ntl = rs.filter((r) => !r.laidFirst25);
      return {
        'six.trail': rs.map((r) => (r.laidFirst25 ? 1 : 0)),
        'six.ul': rs.map((r) => r.totalUl),
        'six.ulTL': tl.map((r) => r.totalUl),
        'six.ulNTL': ntl.map((r) => r.totalUl),
        'six.visits': rs.map((r) => r.dropsVisited),
        'six.visitsTL': tl.map((r) => r.dropsVisited),
        'six.visitsNTL': ntl.map((r) => r.dropsVisited),
        'six.exploit': rs.map((r) => r.exploitTime),
        'six.exploitTL': tl.map((r) => r.exploitTime),
        'six.exploitNTL': ntl.map((r) => r.exploitTime),
      };
    },
  };
}
