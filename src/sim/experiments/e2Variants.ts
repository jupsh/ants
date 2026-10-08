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
  /** 'log' for positive values, 'logit' for (0, 1), or a bounded interval. */
  tf: 'log' | 'logit' | { lo: number; hi: number };
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

export const E2_VARIANTS: E2Variant[] = [
  {
    id: 'Ma',
    label: 'M_a (current)',
    description: 'Individual log-normal desired volume; per-second leaving hazard with a low maximum; 12 % never-layers; unsatisfied ants lay trail with probability q.',
    fix: (m) => withForager(m, { stopPerVolume: 0, neverLayFraction: 0.12 }),
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

function get(m: E2Model, key: string): number {
  const [a, b] = key.split('.');
  return (a === 'setup' ? m.setup : (m.P as unknown as Record<string, Record<string, number>>)[a])[b as never] as number;
}

function set(m: E2Model, key: string, v: number): E2Model {
  const [a, b] = key.split('.');
  if (a === 'setup') return { ...m, setup: { ...m.setup, [b]: v } };
  const P = m.P as unknown as Record<string, Record<string, number>>;
  return { ...m, P: { ...m.P, [a]: { ...P[a], [b]: v } } as unknown as LasiusParams };
}

const logit = (p: number) => Math.log(p / (1 - p));
const sig = (x: number) => 1 / (1 + Math.exp(-x));

function toX(v: number, tf: FreeParam['tf']): number {
  if (tf === 'log') return Math.log(v);
  if (tf === 'logit') return logit(Math.min(0.999, Math.max(0.001, v)));
  return logit(Math.min(0.999, Math.max(0.001, (v - tf.lo) / (tf.hi - tf.lo))));
}

function fromX(x: number, tf: FreeParam['tf']): number {
  if (tf === 'log') return Math.exp(x);
  if (tf === 'logit') return sig(x);
  return tf.lo + (tf.hi - tf.lo) * sig(x);
}

export const encode = (v: E2Variant, m: E2Model): number[] => v.free.map((f) => toX(get(m, f.key), f.tf));
export const decode = (v: E2Variant, base: E2Model, x: number[]): E2Model => v.free.reduce((m, f, i) => set(m, f.key, fromX(x[i], f.tf)), v.fix(base));
export const freeValues = (v: E2Variant, m: E2Model): Record<string, number> => Object.fromEntries(v.free.map((f) => [f.key, get(m, f.key)]));
