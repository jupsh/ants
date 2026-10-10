import { RNG } from './rng';

export interface CloneOptions {
  /** Objects for which this returns true are shared, not copied (immutable state such as geometry). */
  share?: (o: object) => boolean;
  /** If set, every RNG in the copy is replaced by `rng.fork(rekey)` instead of an exact copy. */
  rekey?: number;
}

/**
 * Type-preserving deep copy of simulation state (STATUS 2026-10-10, shared
 * warm-ups): plain objects and class instances keep their prototypes,
 * arrays, typed arrays, Maps and Sets are copied, shared references and
 * cycles are preserved (memo), functions are shared. Without `rekey` the
 * copy continues exactly as the original would; with it, every random
 * stream is forked so differently keyed copies draw independently.
 *
 * Not supported (none exist in src/sim): JS #private fields, WeakMap/WeakSet,
 * closures over mutable state.
 */
export function deepClone<T>(x: T, o: CloneOptions = {}): T {
  const memo = new Map<object, unknown>();
  const copy = (v: unknown): unknown => {
    if (v === null || typeof v !== 'object') return v;
    const seen = memo.get(v);
    if (seen !== undefined) return seen;
    if (o.share?.(v)) return v;
    if (v instanceof RNG && o.rekey !== undefined) {
      const r = v.fork(o.rekey);
      memo.set(v, r);
      return r;
    }
    if (ArrayBuffer.isView(v)) {
      if (v instanceof DataView) throw new Error('deepClone: DataView not supported');
      const c = (v as unknown as { slice(): unknown }).slice();
      memo.set(v, c);
      return c;
    }
    if (Array.isArray(v)) {
      const c: unknown[] = new Array(v.length);
      memo.set(v, c);
      for (let i = 0; i < v.length; i++) c[i] = copy(v[i]);
      return c;
    }
    if (v instanceof Map) {
      const c = new Map();
      memo.set(v, c);
      for (const [k, val] of v) c.set(copy(k), copy(val));
      return c;
    }
    if (v instanceof Set) {
      const c = new Set();
      memo.set(v, c);
      for (const val of v) c.add(copy(val));
      return c;
    }
    const c = Object.create(Object.getPrototypeOf(v));
    memo.set(v, c);
    for (const k of Reflect.ownKeys(v)) {
      const d = Object.getOwnPropertyDescriptor(v, k)!;
      if ('value' in d) d.value = copy(d.value);
      Object.defineProperty(c, k, d);
    }
    return c;
  };
  return copy(x) as T;
}
