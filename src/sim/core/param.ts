/**
 * Sourced parameters (provenance v2). Every biological number in a species
 * definition is wrapped in a `Sourced` record so that its origin, the
 * conditions it applies to, and its uncertainty travel with it. Behaviour code
 * works on the *resolved* form (plain numbers) produced by `resolve()`.
 *
 * `conf` describes how the value was obtained:
 *  - measured:  reported directly for this species in the cited source
 *  - fitted:    estimated by fitting this model to cited data (see `fit`)
 *  - derived:   computed from cited measurements (other species, allometry,
 *               unit conversion) — `note` must say how
 *  - estimated: informed guess without direct data — `note` must say why
 *
 * Parameter *uncertainty* (how sure we are about the value) is recorded in
 * `uncertainty`; *biological variation* between individuals belongs in a
 * separate parameter (e.g. a standard deviation across workers).
 */
export type Confidence = 'measured' | 'fitted' | 'derived' | 'estimated';

export interface Uncertainty {
  /** Standard deviation or standard error of the parameter value. */
  sd?: number;
  /** Plausible range (e.g. 95% interval or min–max across studies). */
  range?: [number, number];
  /** What the uncertainty represents, e.g. "SE across 5 colonies". */
  kind?: string;
}

export interface ProvenanceMeta {
  /** Species the measurement was made on, if not the target species. */
  sourceSpecies?: string;
  /** Experimental conditions, e.g. "26 °C, 50% RH, flat canvas". */
  conditions?: string;
  /** Sample size, e.g. "69 ants, 3 colonies". */
  n?: string;
  /** Table/figure/page in the source. */
  where?: string;
  /** Transformation applied to the source value. */
  transform?: string;
  uncertainty?: Uncertainty;
  /** For fitted values: experiment id and fit procedure. */
  fit?: string;
  /** For values to validate rather than fit: experiment id. */
  validatedBy?: string;
}

export interface Sourced<T = number> extends ProvenanceMeta {
  readonly __sourced: true;
  readonly v: T;
  readonly unit: string;
  readonly conf: Confidence;
  /** Keys into REFS (src/sim/species/refs.ts). */
  readonly src: readonly string[];
  readonly note?: string;
}

function make<T>(v: T, unit: string, conf: Confidence, src: string | string[], note?: string, meta?: ProvenanceMeta): Sourced<T> {
  return { __sourced: true, v, unit, conf, src: Array.isArray(src) ? src : src ? [src] : [], note, ...meta };
}

/** Value measured directly in the cited study for this species. */
export const measured = <T = number>(v: T, unit: string, src: string | string[], note?: string, meta?: ProvenanceMeta) =>
  make(v, unit, 'measured', src, note, meta);

/** Value obtained by fitting this model to cited data. */
export const fitted = <T = number>(v: T, unit: string, src: string | string[], note: string, meta?: ProvenanceMeta) =>
  make(v, unit, 'fitted', src, note, meta);

/** Value computed from cited measurements (other species, allometry, unit conversion). */
export const derived = <T = number>(v: T, unit: string, src: string | string[], note: string, meta?: ProvenanceMeta) =>
  make(v, unit, 'derived', src, note, meta);

/** Informed estimate with no direct measurement; note must explain the reasoning. */
export const estimated = <T = number>(v: T, unit: string, note: string, src: string | string[] = [], meta?: ProvenanceMeta) =>
  make(v, unit, 'estimated', src, note, meta);

export function isSourced(x: unknown): x is Sourced<unknown> {
  return typeof x === 'object' && x !== null && (x as { __sourced?: boolean }).__sourced === true;
}

/** Strip provenance: Sourced<T> -> T recursively. */
export type Resolved<T> = T extends Sourced<infer U>
  ? U
  : T extends readonly (infer E)[]
    ? Resolved<E>[]
    : T extends object
      ? { [K in keyof T]: Resolved<T[K]> }
      : T;

export function resolve<T>(def: T): Resolved<T> {
  if (isSourced(def)) return def.v as Resolved<T>;
  if (Array.isArray(def)) return def.map((d) => resolve(d)) as Resolved<T>;
  if (typeof def === 'object' && def !== null) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(def)) out[k] = resolve(v);
    return out as Resolved<T>;
  }
  return def as Resolved<T>;
}

export interface ParamRow extends ProvenanceMeta {
  path: string;
  value: unknown;
  unit: string;
  conf: Confidence;
  src: readonly string[];
  note?: string;
}

/** Flatten a definition into rows for tables/documentation. */
export function flattenParams(def: unknown, prefix = ''): ParamRow[] {
  const rows: ParamRow[] = [];
  if (isSourced(def)) {
    const { __sourced: _s, v, ...rest } = def;
    void _s;
    rows.push({ ...rest, path: prefix, value: v });
    return rows;
  }
  if (typeof def === 'object' && def !== null && !Array.isArray(def)) {
    for (const [k, v] of Object.entries(def)) rows.push(...flattenParams(v, prefix ? `${prefix}.${k}` : k));
  }
  return rows;
}

/**
 * Put the values of a fit file into a definition, so that each provenance
 * record carries the value actually used. Keys listed in `free` (default:
 * every key given) become `fitted` with `fit` recorded; other changed keys
 * (fixed by a model variant) keep their status and gain a note. A key that
 * the definition lacks is an error.
 */
export function applyFit<T extends Record<string, Sourced<unknown>>>(def: T, values: Record<string, unknown> | undefined, o: { fit: string; free?: string[] }): T {
  if (!values) return def;
  const out: Record<string, Sourced<unknown>> = { ...def };
  for (const [k, v] of Object.entries(values)) {
    const rec = def[k];
    if (!rec) throw new Error(`applyFit: fit sets unknown parameter "${k}"`);
    if (v === rec.v) continue;
    out[k] = (o.free ?? Object.keys(values)).includes(k) ? { ...rec, v, conf: 'fitted', fit: o.fit } : { ...rec, v, note: `${rec.note ?? ''} Set to ${String(v)} by ${o.fit}.`.trim() };
  }
  return out as T;
}
