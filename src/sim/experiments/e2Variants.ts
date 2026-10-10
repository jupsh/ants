import type { LasiusParams } from './e2Mailleux';
import type { E2Setup } from './e2Targets';

/**
 * Step 3: bounded E2 mechanism comparison (docs/STATUS.md, including the
 * pre-registration in the Decisions log). Every variant shares the base
 * model, the individual intake rate (phys.intakeSd), the volume observer
 * (setup.volumeSd), the fit targets and the optimiser budget; they differ
 * only in the stopping and trail-laying rules below.
 */

/** A free parameter: where it lives and how it is transformed for the optimiser. */
export interface FreeParam {
  key: string;
  /** 'log' for positive values, 'logit' for (0, 1), or a bounded interval (linear, or log-scaled with `log`). */
  tf: 'log' | 'logit' | { lo: number; hi: number; log?: boolean };
}

export interface E2Model {
  P: LasiusParams;
  setup: E2Setup;
}

export interface E2Variant {
  id: string;
  label: string;
  description: string;
  /** Fixed settings applied on top of the base parameters. */
  fix: (m: E2Model) => E2Model;
  free: FreeParam[];
}

const SHARED: FreeParam[] = [
  { key: 'forager.desiredFed', tf: 'log' },
  { key: 'forager.desiredHungry', tf: 'log' },
  { key: 'setup.accessible', tf: 'logit' },
  { key: 'phys.intakeSd', tf: { lo: 0, hi: 1 } },
  { key: 'setup.volumeSd', tf: { lo: 0, hi: 0.5 } },
];

const withForager = (m: E2Model, f: Partial<LasiusParams['forager']>): E2Model => ({ ...m, P: { ...m.P, forager: { ...m.P.forager, ...f } } });
const withPhys = (m: E2Model, f: Partial<LasiusParams['phys']>): E2Model => ({ ...m, P: { ...m.P, phys: { ...m.P.phys, ...f } } });

/**
 * Step 3c (search around food), frozen pre-registration 2026-10-09: M_a
 * structure, bounded parameters; S = who searches after an exhausted drop,
 * I = intake form. Frozen bounds.
 */
const B3C: FreeParam[] = [
  { key: 'forager.desiredFed', tf: { lo: 0.1, hi: 3, log: true } },
  { key: 'forager.desiredHungry', tf: { lo: 0.1, hi: 5, log: true } },
  { key: 'forager.desiredSd', tf: { lo: 0.01, hi: 2, log: true } },
  { key: 'forager.stopHazard', tf: { lo: 1e-4, hi: 1, log: true } },
  { key: 'forager.unsatisfiedLayProb', tf: { lo: 0, hi: 1 } },
  { key: 'setup.accessible', tf: { lo: 0.2, hi: 1 } },
  { key: 'phys.intakeSd', tf: { lo: 0, hi: 1 } },
  { key: 'setup.volumeSd', tf: { lo: 0, hi: 0.5 } },
  { key: 'phys.intakeRate', tf: { lo: 0.002, hi: 0.03, log: true } },
  { key: 'forager.arsMean', tf: { lo: 1, hi: 1000, log: true } },
];
const LAY_MEAN: FreeParam = { key: 'forager.arsMeanLay', tf: { lo: 1, hi: 1000, log: true } };
const V0: FreeParam = { key: 'phys.boutFastUl', tf: { lo: 0, hi: 0.5 } };
const fix3c = (searchMode: number, fast: boolean) => (m: E2Model) =>
  withPhys(withForager(m, { stopPerVolume: 0, satiationOnTime: 0, neverLayFraction: 0.12, searchMode, loadSlowdown: 0 }), fast ? { boutFastRate: 0.05 } : { boutFastUl: 0 });

export const E2_VARIANTS_3C: E2Variant[] = [
  { id: 'S0I0', label: 'S0I0 (adopted structure)', description: 'Laying ants go home at once after an exhausted drop; constant intake rate.', fix: fix3c(0, false), free: B3C },
  { id: 'S1I0', label: 'S1I0', description: 'Every unsatisfied ant leaving an exhausted drop searches (layers too); one mean.', fix: fix3c(1, false), free: B3C },
  { id: 'S2I0', label: 'S2I0', description: 'As S1, separate search means for laying and non-laying ants.', fix: fix3c(2, false), free: [...B3C, LAY_MEAN] },
  { id: 'S1I1', label: 'S1I1', description: 'S1 plus a fast initial uptake of v0 µL per bout at 0.05 µL/s.', fix: fix3c(1, true), free: [...B3C, V0] },
  { id: 'S2I1', label: 'S2I1', description: 'S2 plus the fast initial uptake.', fix: fix3c(2, true), free: [...B3C, LAY_MEAN, V0] },
];

/**
 * Step 3d (the laying decision), frozen pre-registration 2026-10-09: the
 * step-3c settings with I1, the never-laying fraction free, and the laying
 * rule of unsatisfied ants leaving an exhausted drop: constant (L0) or
 * graded by ingested ÷ desired volume (L1), crossed with search modes S1/S2.
 */
const NEVER: FreeParam = { key: 'forager.neverLayFraction', tf: { lo: 0, hi: 0.3 } };
const GRADED: FreeParam[] = [
  { key: 'forager.layKappa', tf: { lo: 1, hi: 50, log: true } },
  { key: 'forager.layRatio50', tf: { lo: 0, hi: 1.5 } },
];
const B3D_L0 = [...B3C, V0, NEVER];
const B3D_L1 = [...B3C.filter((f) => f.key !== 'forager.unsatisfiedLayProb'), V0, NEVER, ...GRADED];
const fix3d = (searchMode: number, layRule: number) => (m: E2Model) => withForager(fix3c(searchMode, true)(m), { layRule });

export const E2_VARIANTS_3D: E2Variant[] = [
  { id: 'L0S1', label: 'L0S1', description: 'S1I1 with the never-laying fraction free; constant laying probability after an exhausted drop.', fix: fix3d(1, 0), free: B3D_L0 },
  { id: 'L1S1', label: 'L1S1', description: 'As L0S1, laying after an exhausted drop graded by ingested ÷ desired volume.', fix: fix3d(1, 1), free: B3D_L1 },
  { id: 'L0S2', label: 'L0S2', description: 'As L0S1, with a separate search mean for laying ants.', fix: fix3d(2, 0), free: [...B3D_L0, LAY_MEAN] },
  { id: 'L1S2', label: 'L1S2', description: 'As L1S1, with a separate search mean for laying ants.', fix: fix3d(2, 1), free: [...B3D_L1, LAY_MEAN] },
];

/**
 * Step-3d cohort diagnostic (not a candidate; STATUS 2026-10-09, between-study
 * variance): L0S1 with a desired-volume scale for the 2009 two-drop cohort.
 */
export const E2_DIAGNOSTICS_3D: E2Variant[] = [
  {
    id: 'L0S1c',
    label: 'L0S1c (cohort diagnostic)',
    description: 'L0S1 with a free desired-volume scale for the 2009 cohort.',
    fix: (m) => {
      const f = fix3d(1, 0)(m);
      return { ...f, setup: { ...f.setup, desiredScale2009: f.setup.desiredScale2009 ?? 1 } };
    },
    free: [...B3D_L0, { key: 'setup.desiredScale2009', tf: { lo: 0.3, hi: 3, log: true } }],
  },
];

/** Step-3c and step-3d candidates (and diagnostics) by id. */
export const variant3 = (id: string): E2Variant | undefined => [...E2_VARIANTS_3C, ...E2_VARIANTS_3D, ...E2_DIAGNOSTICS_3D].find((v) => v.id === id);

export const E2_VARIANTS: E2Variant[] = [
  {
    id: 'Ma',
    label: 'M_a (current)',
    description: 'Individual log-normal desired volume; per-second leaving hazard with a low maximum; 12 % never-layers; unsatisfied ants lay trail with probability q.',
    fix: (m) => withForager(m, { stopPerVolume: 0, satiationOnTime: 0, neverLayFraction: 0.12 }),
    free: [...SHARED, { key: 'forager.desiredSd', tf: 'log' }, { key: 'forager.stopHazard', tf: 'log' }, { key: 'forager.unsatisfiedLayProb', tf: 'logit' }],
  },
  {
    id: 'Mb',
    label: 'M_b (Mailleux et al.)',
    description: 'Published response-threshold rule: per-µL leaving hazard η·σ(η(V − Vc)) with a shared Vc (logistic stopping volumes); 90 % of satisfied ants lay trail; unsatisfied ants never do.',
    fix: (m) => withForager(m, { stopPerVolume: 1, desiredSd: 0, neverLayFraction: 0.1, unsatisfiedLayProb: 0 }),
    free: [...SHARED, { key: 'forager.stopEta', tf: 'log' }],
  },
  {
    id: 'Md',
    label: 'M_d (time-based satiation)',
    description: 'M_a with a satiation signal that measures drinking time (µL-equivalents at the population mean intake rate) instead of the volume ingested (step 3b, pre-registered).',
    fix: (m) => withForager(m, { stopPerVolume: 0, satiationOnTime: 1, neverLayFraction: 0.12 }),
    free: [...SHARED, { key: 'forager.desiredSd', tf: 'log' }, { key: 'forager.stopHazard', tf: 'log' }, { key: 'forager.unsatisfiedLayProb', tf: 'logit' }],
  },
  {
    id: 'Mc',
    label: 'M_c (M_a, never-layers free)',
    description: 'M_a with the never-layer fraction estimated within 10–20 %.',
    fix: (m) => withForager(m, { stopPerVolume: 0 }),
    free: [...SHARED, { key: 'forager.desiredSd', tf: 'log' }, { key: 'forager.stopHazard', tf: 'log' }, { key: 'forager.unsatisfiedLayProb', tf: 'logit' }, { key: 'forager.neverLayFraction', tf: { lo: 0.1, hi: 0.2 } }],
  },
  {
    id: 'Mc0',
    label: 'M_c0 (M_c without q)',
    description: 'M_c with no trail laying by unsatisfied ants (q = 0).',
    fix: (m) => withForager(m, { stopPerVolume: 0, unsatisfiedLayProb: 0 }),
    free: [...SHARED, { key: 'forager.desiredSd', tf: 'log' }, { key: 'forager.stopHazard', tf: 'log' }, { key: 'forager.neverLayFraction', tf: { lo: 0.1, hi: 0.2 } }],
  },
];

export function get(m: E2Model, key: string): number {
  const [a, b] = key.split('.');
  return (a === 'setup' ? m.setup : (m.P as unknown as Record<string, Record<string, number>>)[a])[b as never] as number;
}

export function set(m: E2Model, key: string, v: number): E2Model {
  const [a, b] = key.split('.');
  if (a === 'setup') return { ...m, setup: { ...m.setup, [b]: v } };
  const P = m.P as unknown as Record<string, Record<string, number>>;
  return { ...m, P: { ...m.P, [a]: { ...P[a], [b]: v } } as unknown as LasiusParams };
}

const logit = (p: number) => Math.log(p / (1 - p));
const sig = (x: number) => 1 / (1 + Math.exp(-x));

/** Encode a parameter value for the optimiser (log, logit, or a bounded interval through a logit). */
export function toX(v: number, tf: FreeParam['tf']): number {
  if (tf === 'log') return Math.log(v);
  if (tf === 'logit') return logit(Math.min(0.999, Math.max(0.001, v)));
  const u = tf.log ? Math.log(v / tf.lo) / Math.log(tf.hi / tf.lo) : (v - tf.lo) / (tf.hi - tf.lo);
  return logit(Math.min(0.999, Math.max(0.001, u)));
}

/** Inverse of `toX`. */
export function fromX(x: number, tf: FreeParam['tf']): number {
  if (tf === 'log') return Math.exp(x);
  if (tf === 'logit') return sig(x);
  return tf.log ? tf.lo * (tf.hi / tf.lo) ** sig(x) : tf.lo + (tf.hi - tf.lo) * sig(x);
}

/** A free parameter within 1 % of a bound (bounded transforms only). */
export function atBound(v: E2Variant, m: E2Model): string[] {
  return v.free
    .filter((f) => typeof f.tf === 'object')
    .filter((f) => {
      const tf = f.tf as { lo: number; hi: number; log?: boolean };
      const x = get(m, f.key);
      const u = tf.log ? Math.log(x / tf.lo) / Math.log(tf.hi / tf.lo) : (x - tf.lo) / (tf.hi - tf.lo);
      return u < 0.01 || u > 0.99;
    })
    .map((f) => f.key);
}

export const encode = (v: E2Variant, m: E2Model): number[] => v.free.map((f) => toX(get(m, f.key), f.tf));
export const decode = (v: E2Variant, base: E2Model, x: number[]): E2Model => v.free.reduce((m, f, i) => set(m, f.key, fromX(x[i], f.tf)), v.fix(base));
export const freeValues = (v: E2Variant, m: E2Model): Record<string, number> => Object.fromEntries(v.free.map((f) => [f.key, get(m, f.key)]));
