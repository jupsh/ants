import { summarize } from '../analysis/trajectory';
import { runScout, type LasiusParams, type ScoutResult } from './e2Mailleux';

/**
 * E2 targets from Mailleux et al. 1999 and 2009, with their role in model
 * building. One definition shared by the fit script, tests and the UI.
 */
export type Role = 'fit' | 'validation';

export interface Target {
  id: string;
  label: string;
  role: Role;
  /** Data mean (or proportion) and its standard error. */
  value: number;
  se: number;
  unit: string;
  /** Data SD (for display), if reported. */
  sd?: number;
  source: string;
}

export interface Condition {
  id: string;
  label: string;
  run: (P: LasiusParams, n: number, seed0: number, accessible: number, dt: number) => ScoutResult[];
  metrics: (rs: ScoutResult[]) => Record<string, number>;
}

const prop = (rs: ScoutResult[], f: (r: ScoutResult) => boolean) => (rs.length ? rs.filter(f).length / rs.length : NaN);
const mean = (xs: number[]) => summarize(xs).mean;

export const E2_TARGETS: Target[] = [
  { id: 'd1.drink', label: '3 µL drop, 1 day starved: drinking time', role: 'fit', value: 65, sd: 21, se: 21 / Math.sqrt(63), unit: 's', source: 'mailleux1999' },
  { id: 'd1.trail', label: '3 µL drop, 1 day starved: scouts laying trail', role: 'fit', value: 0.85, se: Math.sqrt((0.85 * 0.15) / 67), unit: '', source: 'mailleux1999' },
  { id: 'd4.drink', label: '3 µL drop, 4 days starved: drinking time', role: 'fit', value: 88, sd: 24, se: 24 / Math.sqrt(135), unit: 's', source: 'mailleux1999' },
  { id: 'd4.trail', label: '3 µL drop, 4 days starved: scouts laying trail', role: 'fit', value: 0.94, se: Math.sqrt((0.94 * 0.06) / 141), unit: '', source: 'mailleux1999' },
  { id: 'd8.drink', label: '3 µL drop, 8 days starved: drinking time', role: 'fit', value: 93, sd: 23, se: 23 / Math.sqrt(92), unit: 's', source: 'mailleux1999' },
  { id: 'd8.trail', label: '3 µL drop, 8 days starved: scouts laying trail', role: 'fit', value: 0.88, se: Math.sqrt((0.88 * 0.12) / 97), unit: '', source: 'mailleux1999' },
  { id: 'two.ul1', label: 'Two drops: intake at drop 1', role: 'fit', value: 0.47, sd: 0.25, se: 0.25 / Math.sqrt(63), unit: 'µL', source: 'mailleux2009' },
  { id: 'two.t1', label: 'Two drops: drinking time at drop 1', role: 'fit', value: 51, sd: 12, se: 12 / Math.sqrt(63), unit: 's', source: 'mailleux2009' },
  { id: 'two.tl1', label: 'Two drops: laying trail after drop 1', role: 'fit', value: 0.38, se: Math.sqrt((0.38 * 0.62) / 63), unit: '', source: 'mailleux2009' },
  { id: 'two.trail', label: 'Two drops: laying trail overall', role: 'validation', value: 0.84, se: Math.sqrt((0.84 * 0.16) / 63), unit: '', source: 'mailleux2009' },
  { id: 'two.ul2', label: 'Two drops: intake at drop 2', role: 'validation', value: 0.28, sd: 0.2, se: 0.2 / Math.sqrt(63), unit: 'µL', source: 'mailleux2009' },
  { id: 'two.t2', label: 'Two drops: drinking time at drop 2', role: 'validation', value: 23, sd: 11, se: 11 / Math.sqrt(63), unit: 's', source: 'mailleux2009' },
  { id: 'two.ulTot', label: 'Two drops: total intake', role: 'validation', value: 0.75, sd: 0.3, se: 0.3 / Math.sqrt(63), unit: 'µL', source: 'mailleux2009' },
  { id: 'two.betweenTL1', label: 'Two drops: time between drops, trail layers', role: 'validation', value: 58, sd: 33, se: 33 / Math.sqrt(24), unit: 's', source: 'mailleux2009' },
  { id: 'two.betweenNTL1', label: 'Two drops: time between drops, non-layers', role: 'validation', value: 134, sd: 87, se: 87 / Math.sqrt(39), unit: 's', source: 'mailleux2009' },
  { id: 'two.total', label: 'Two drops: total time on the apparatus', role: 'validation', value: 178, sd: 83, se: 83 / Math.sqrt(63), unit: 's', source: 'mailleux2009' },
];

const single = (days: number): Condition => ({
  id: `d${days}`,
  label: `Mailleux 1999: 3 µL drop, ${days} day${days > 1 ? 's' : ''} starved`,
  run: (P, n, seed0, acc, dt) => Array.from({ length: n }, (_, i) => runScout(P, { seed: seed0 + i, drop1: { ul: 3, molar: 0.6 }, pipetteAccessible: acc, starvationDays: days, dt, maxTime: 900 })).filter((r) => r.drinks.length),
  metrics: (rs) => ({ [`d${days}.drink`]: mean(rs.map((r) => r.drinks[0].time)), [`d${days}.trail`]: prop(rs, (r) => r.laidTrail) }),
});

export const E2_CONDITIONS: Condition[] = [
  single(1),
  single(4),
  single(8),
  {
    id: 'two',
    label: 'Mailleux 2009: two 0.7 µL drops, 4 days starved',
    run: (P, n, seed0, acc, dt) =>
      Array.from({ length: n }, (_, i) => runScout(P, { seed: seed0 + i, drop1: { ul: 0.7, molar: 0.6 }, drop2: { ul: 0.7, molar: 0.6 }, pipetteAccessible: acc, starvationDays: 4, dt, maxTime: 900 })).filter((r) => r.drinks.length),
    metrics: (rs) => {
      const both = rs.filter((r) => r.drinks.length >= 2);
      return {
        'two.ul1': mean(rs.map((r) => r.drinks[0].ul)),
        'two.t1': mean(rs.map((r) => r.drinks[0].time)),
        'two.tl1': prop(rs, (r) => r.laidSection1),
        'two.trail': prop(both, (r) => r.laidTrail),
        'two.ul2': mean(both.map((r) => r.drinks[1].ul)),
        'two.t2': mean(both.map((r) => r.drinks[1].time)),
        'two.ulTot': mean(both.map((r) => r.drinks[0].ul + r.drinks[1].ul)),
        'two.betweenTL1': mean(both.filter((r) => r.laidSection1).map((r) => r.betweenTime)),
        'two.betweenNTL1': mean(both.filter((r) => !r.laidSection1).map((r) => r.betweenTime)),
        'two.total': mean(both.map((r) => r.total)),
        'two.foundBoth': both.length / Math.max(1, rs.length),
      };
    },
  },
];

/** Run every condition and return simulated metrics keyed by target id. */
export function simulateE2(P: LasiusParams, n: number, accessible: number, dt = 0.1, seedBase = 0): Record<string, number> {
  const out: Record<string, number> = {};
  E2_CONDITIONS.forEach((c, i) => Object.assign(out, c.metrics(c.run(P, n, seedBase + 100000 * (i + 1), accessible, dt))));
  return out;
}

/** Squared z-scores of simulated vs data values for targets with the given role. */
export function e2Loss(sim: Record<string, number>, role: Role): number {
  let l = 0;
  for (const t of E2_TARGETS) if (t.role === role) l += Number.isFinite(sim[t.id]) ? ((sim[t.id] - t.value) / t.se) ** 2 : 100;
  return l;
}
