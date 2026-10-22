/**
 * B019: B018's family-6 co-movement (Y's C by zone and distance) under three classings and a per-ant time-shift
 * null, from B018's per-colony files (out/rules-c<i>.json: per-ant 1-min bins and the 24-h site field). Reading
 * in the Progress log.
 *   M   both ants' positions in that minute (B018's classing; must reproduce its rules.json comove6)
 *   F4  each ant's mean in-nest position over its 4-h block (primary)
 *   F24 each ant's mean in-nest position over 24 h
 * Zone and pair distance both come from the classing's positions. Null: each ant's whole series (deviation,
 * positions) circularly shifted by an independent offset in [60, L − 60] min.
 *   nice -n 19 npx vite-node backlog/B019-co-movement-by-zone-with-zones-fixed-per/comove.ts --colony i [--reps 20]
 *   → out/comove-c<i>.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { numArg, readJson, writeJson } from '../../scripts/lib';
import { RNG } from '../../src/sim/core/rng';
import { ENTRANCE } from '../B018-resting-site-and-aggregation-in-the/lib';

const ITEM = path.dirname(fileURLToPath(import.meta.url));
const B018_OUT = `${ITEM}/../B018-resting-site-and-aggregation-in-the/out`;
export const ZN = ['core', 'entrance', 'periphery', 'mid', 'mixed'];
export const CLASSINGS = ['M', 'F4', 'F24'] as const;
const NZ = ZN.length;
const ci = numArg('--colony', 0);
const REPS = numArg('--reps', 20);
const SHIFT_MIN = 60;

interface Ant { role: number; mv: number[]; st: number[]; sx: number[]; sy: number[]; np: number[] }
const rec = readJson<{ colony: string; e24: { grid: number[]; W: number; H: number }; bins: { b0: number; ants: Ant[] } }>(`${B018_OUT}/rules-c${ci}.json`);
const { grid, W, H } = rec.e24;
const ants = rec.bins.ants;
const n = ants.length;
const L = Math.max(...ants.map((a) => a.np.length));
// B018's 4-h blocks from 02 UTC.
const block = (k: number) => Math.floor(((rec.bins.b0 + k) * 60 - 2 * 3600) / (4 * 3600));
const zoneOf = (x: number, y: number) => {
  const e = grid[Math.max(0, Math.min(H - 1, Math.floor(y))) * W + Math.max(0, Math.min(W - 1, Math.floor(x)))];
  return Math.hypot(x - ENTRANCE.x, y - ENTRANCE.y) <= 10 ? 1 : e >= 2 ? 0 : e < 0.5 ? 2 : 3;
};

// Per ant, length L: deviation (NaN when not usable that minute, as B018: st > 0 and np > 0) and per-classing positions.
const D = Array.from({ length: n }, () => new Float64Array(L).fill(NaN));
const X = CLASSINGS.map(() => Array.from({ length: n }, () => new Float64Array(L).fill(NaN)));
const Y = CLASSINGS.map(() => Array.from({ length: n }, () => new Float64Array(L).fill(NaN)));
const Z = CLASSINGS.map(() => Array.from({ length: n }, () => new Int8Array(L).fill(-1)));
ants.forEach((a, i) => {
  const sum = new Map<number, [number, number]>();
  for (let k = 0; k < a.st.length; k++) if (a.st[k] > 0) { const s = sum.get(block(k)) ?? [0, 0]; s[0] += a.mv[k] / a.st[k]; s[1]++; sum.set(block(k), s); }
  const pos = new Map<number, [number, number, number]>(); // block → Σx, Σy, Σn
  let tx = 0, ty = 0, tn = 0;
  for (let k = 0; k < a.np.length; k++) {
    if (!a.np[k]) continue;
    const p = pos.get(block(k)) ?? [0, 0, 0];
    p[0] += a.sx[k]; p[1] += a.sy[k]; p[2] += a.np[k];
    pos.set(block(k), p);
    tx += a.sx[k]; ty += a.sy[k]; tn += a.np[k];
  }
  for (let k = 0; k < a.np.length; k++) {
    if (!(a.st[k] > 0) || !a.np[k]) continue;
    const s = sum.get(block(k))!;
    D[i][k] = a.mv[k] / a.st[k] - s[0] / s[1];
    const p = pos.get(block(k))!;
    const xy: [number, number][] = [[a.sx[k] / a.np[k], a.sy[k] / a.np[k]], [p[0] / p[2], p[1] / p[2]], [tx / tn, ty / tn]];
    xy.forEach(([x, y], c) => { X[c][i][k] = x; Y[c][i][k] = y; Z[c][i][k] = zoneOf(x, y); });
  }
});

/** C by zone × distance class (< 10, 10–20 mm) for one classing and one set of per-ant offsets. */
function run(c: number, off: Int32Array): { C: number[][]; pairs: number[][] } {
  const acc = new Float64Array(NZ * 2 * 4);
  const li = new Int32Array(n), lk = new Int32Array(n);
  const Xc = X[c], Yc = Y[c], Zc = Z[c];
  for (let k = 0; k < L; k++) {
    let m = 0;
    for (let i = 0; i < n; i++) {
      const j = (k + off[i]) % L;
      if (Number.isFinite(D[i][j])) { li[m] = i; lk[m] = j; m++; }
    }
    for (let p = 0; p < m; p++) {
      const a = li[p], ka = lk[p];
      const xa = Xc[a][ka], ya = Yc[a][ka], za = Zc[a][ka], da = D[a][ka];
      for (let q = p + 1; q < m; q++) {
        const b = li[q], kb = lk[q];
        const d = Math.hypot(xa - Xc[b][kb], ya - Yc[b][kb]);
        if (d >= 20) continue;
        const zb = Zc[b][kb];
        const o = ((za === zb ? za : 4) * 2 + (d < 10 ? 0 : 1)) * 4;
        const db = D[b][kb];
        acc[o] += da * db; acc[o + 1] += da * da; acc[o + 2] += db * db; acc[o + 3]++;
      }
    }
  }
  const C = ZN.map((_, z) => [0, 1].map((dc) => { const o = (z * 2 + dc) * 4; return acc[o + 3] ? acc[o] / Math.sqrt(acc[o + 1] * acc[o + 2]) : NaN; }));
  const pairs = ZN.map((_, z) => [0, 1].map((dc) => acc[(z * 2 + dc) * 4 + 3]));
  return { C, pairs };
}

const t0 = Date.now();
const zero = new Int32Array(n);
const offsets = Array.from({ length: REPS }, (_, r) => {
  const rng = RNG.stream(1903, ci, r);
  return Int32Array.from({ length: n }, () => SHIFT_MIN + rng.int(L - 2 * SHIFT_MIN + 1));
});
const out = Object.fromEntries(
  CLASSINGS.map((name, c) => {
    const obs = run(c, zero);
    const nulls = offsets.map((off) => run(c, off).C);
    return [name, { C: obs.C, pairs: obs.pairs, Cnull: nulls }];
  }),
);
fs.mkdirSync(`${ITEM}/out`, { recursive: true });
writeJson(`${ITEM}/out/comove-c${ci}.json`, { colony: rec.colony, L, ants: n, reps: REPS, zones: ZN, distance: ['<10', '10-20'], ...out });
console.log(`${rec.colony}: ${((Date.now() - t0) / 1000).toFixed(0)} s`);
