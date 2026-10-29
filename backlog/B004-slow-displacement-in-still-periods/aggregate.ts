// B004: aggregate out/<prefix>-c*.json (colonies are the units; mean over colonies, colony bootstrap) → results/<prefix>.json.
//   npx vite-node backlog/B004-slow-displacement-in-still-periods/aggregate.ts data
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RNG } from '../../src/sim/core/rng';
import { stamp } from '../_lib/stamp';
import { ANG_EDGES, BLOCKS, D_EDGES, LAGS, T_EDGES } from './stillForm';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const prefix = process.argv[2] ?? 'data';
const files = fs.readdirSync(`${DIR}/out`).filter((f) => f.startsWith(`${prefix}-c`)).sort((a, b) => Number(a.match(/\d+/)![0]) - Number(b.match(/\d+/)![0]));
const cols = files.map((f) => JSON.parse(fs.readFileSync(`${DIR}/out/${f}`, 'utf8')));

const boot = (v: number[]): { mean: number; lo: number; hi: number; n: number } => {
  const x = v.filter(Number.isFinite);
  if (x.length < 3) return { mean: NaN, lo: NaN, hi: NaN, n: x.length };
  const rng = RNG.stream(23, x.length);
  const m = (s: number[]) => s.reduce((a, b) => a + b, 0) / s.length;
  const bs = Array.from({ length: 2000 }, () => m(x.map(() => x[Math.floor(rng.next() * x.length)]))).sort((a, b) => a - b);
  return { mean: m(x), lo: bs[50], hi: bs[1949], n: x.length };
};
const slope = (ks: number[], ys: number[]): number => {
  const lx = ks.map(Math.log), ly = ys.map(Math.log);
  const mx = lx.reduce((a, b) => a + b, 0) / lx.length, my = ly.reduce((a, b) => a + b, 0) / ly.length;
  return lx.reduce((s, x, i) => s + (x - mx) * (ly[i] - my), 0) / lx.reduce((s, x) => s + (x - mx) ** 2, 0);
};
const quant = (hist: { n: number[] }, q: number): number => {
  const tot = hist.n.reduce((a, b) => a + b, 0);
  let c = 0;
  for (let b = 0; b < hist.n.length; b++) {
    c += hist.n[b];
    if (c >= q * tot) return D_EDGES[Math.min(b + 1, D_EDGES.length - 1)]; // upper edge of the bin
  }
  return NaN;
};

const out: Record<string, unknown> = { provenance: stamp(DIR), prefix, colonies: cols.map((c) => c.colony) };
for (const role of ['nurse', 'forager'] as const) {
  const S = cols.map((c) => c[role]).filter((s) => s.nRuns > 0);
  const per = (f: (s: any, c: any) => number) => boot(S.map((s) => f(s, cols[S.indexOf(s)] ?? cols[0])));
  const res: Record<string, unknown> = {
    colonies: S.length,
    runs: S.reduce((a, s) => a + s.nRuns, 0),
    runMinutes: S.reduce((a, s) => a + s.runFrames, 0) / 120,
    runsPerColonyMedian: S.map((s) => s.nRuns).sort((a, b) => a - b)[Math.floor(S.length / 2)],
  };
  const msdAt = (s: any, k: number) => s.msd[k].sum / s.msd[k].pairs;
  const floor = (s: any) => 4 * s.noiseSd ** 2;
  res.msd = Object.fromEntries(LAGS.map((k) => [k, boot(S.map((s) => msdAt(s, k)))]));
  const win: [string, number, number][] = [['1-5s', 2, 10], ['5-30s', 10, 60], ['30-60s', 60, 120], ['1-60s', 2, 120]];
  const coreOk = S.filter((s) => s.msdCore[120].pairs > 0);
  res.coreColonies = coreOk.length;
  res.msdCore = Object.fromEntries(LAGS.map((k) => [k, boot(coreOk.map((s) => s.msdCore[k].sum / s.msdCore[k].pairs))]));
  res.exponentCore = Object.fromEntries(win.map(([nm, a, b]) => {
    const ks = LAGS.filter((k) => k >= a && k <= b);
    return [nm, { raw: boot(coreOk.map((s) => slope(ks, ks.map((k) => s.msdCore[k].sum / s.msdCore[k].pairs)))), floorSubtracted: boot(coreOk.map((s) => slope(ks, ks.map((k) => Math.max(s.msdCore[k].sum / s.msdCore[k].pairs - floor(s), 1e-9))))) }];
  }));
  res.floor = boot(S.map(floor));
  res.exponent = Object.fromEntries(win.map(([nm, a, b]) => {
    const ks = LAGS.filter((k) => k >= a && k <= b);
    return [nm, { raw: boot(S.map((s) => slope(ks, ks.map((k) => msdAt(s, k))))), floorSubtracted: boot(S.map((s) => slope(ks, ks.map((k) => Math.max(msdAt(s, k) - floor(s), 1e-9))))) }];
  }));
  res.msdFloorRatio = Object.fromEntries([1, 10, 60, 120].map((k) => [k, boot(S.map((s) => msdAt(s, k) / floor(s)))]));
  // Step length (lag 1) against the noise: scale of a displacement component is sqrt2*sigma.
  res.step1 = {
    shareAboveThr: boot(S.map((s) => { const h = s.hist[1]; const above = h.n.reduce((a: number, n: number, b: number) => a + (D_EDGES[b] >= s.thr ? n : 0), 0); return above / h.n.reduce((a: number, b: number) => a + b, 0); })),
    sumsqShareAboveThr: boot(S.map((s) => { const h = s.hist[1]; return h.sumsq.reduce((a: number, v: number, b: number) => a + (D_EDGES[b] >= s.thr ? v : 0), 0) / h.sumsq.reduce((a: number, v: number) => a + v, 0); })),
    q50: boot(S.map((s) => quant(s.hist[1], 0.5))), q90: boot(S.map((s) => quant(s.hist[1], 0.9))), q99: boot(S.map((s) => quant(s.hist[1], 0.99))),
    noiseMedian: boot(S.map((s) => 1.1774 * Math.SQRT2 * s.noiseSd)),
    zeroShare: boot(S.map((s) => s.hist[1].n[0] / s.hist[1].n.reduce((a: number, b: number) => a + b, 0))), // steps < 0.002 mm: the same pixel twice
    lag1Autocorr: boot(S.map((s) => s.lag1.dot / s.lag1.sq)),
  };
  res.blocks = Object.fromEntries(BLOCKS.map((k) => [k, {
    activeShare: boot(S.map((s) => s.blocks[k].active / s.blocks[k].n)),
    pActiveGivenActive: boot(S.map((s) => s.blocks[k].actAct / s.blocks[k].prevActive)),
    sumsqShareActive: boot(S.map((s) => s.blocks[k].sumsqActive / s.blocks[k].sumsq)),
    cosConsecutiveActive: boot(S.map((s) => s.blocks[k].cosSum / s.blocks[k].cosN)),
    excessKurtosis: boot(S.map((s) => (s.mom[k === 10 ? 10 : 60].s4 / s.mom[k === 10 ? 10 : 60].n) / (s.mom[k === 10 ? 10 : 60].s2 / s.mom[k === 10 ? 10 : 60].n) ** 2 - 3)),
  }]));
  const tcut = (key: 'byStart' | 'byEnd', k: number) => T_EDGES.map((e, b) => ({ fromFrames: e, share: boot(S.map((s) => s[key][k].n[b] / s[key][k].n.reduce((a: number, v: number) => a + v, 0))), activeShare: boot(S.map((s) => (s[key][k].n[b] ? s[key][k].active[b] / s[key][k].n[b] : NaN))), meanR2: boot(S.map((s) => (s[key][k].n[b] ? s[key][k].sumsq[b] / s[key][k].n[b] : NaN))) }));
  res.sinceStart = Object.fromEntries(BLOCKS.map((k) => [k, tcut('byStart', k)]));
  res.untilEnd = Object.fromEntries(BLOCKS.map((k) => [k, tcut('byEnd', k)]));
  // Angle (data only).
  if (S.every((s) => s.angle1.n > 0)) {
    res.angle = {
      lag1RmsDeg: boot(S.map((s) => Math.sqrt(s.angle1.ss / s.angle1.n))),
      byAngleBin: Object.fromEntries(BLOCKS.map((k) => [k, ANG_EDGES.slice(0, -1).map((e, b) => ({ fromDeg: e, share: boot(S.map((s) => s.angBins[k].n[b] / s.angBins[k].n.reduce((a: number, v: number) => a + v, 0))), meanR2: boot(S.map((s) => (s.angBins[k].n[b] ? s.angBins[k].sumsq[b] / s.angBins[k].n[b] : NaN))) }))])),
      offsetModel: Object.fromEntries(Object.keys(S[0].offset).map((key) => [key, {
        r2: boot(S.map((s) => s.offset[key].expl / s.offset[key].tot)),
        nullMean: boot(S.map((s) => s.offset[key].nullExpl.reduce((a: number, v: number) => a + v, 0) / s.offset[key].nullExpl.length / s.offset[key].tot)),
        nullMax: boot(S.map((s) => Math.max(...s.offset[key].nullExpl) / s.offset[key].tot)),
        offsetMagMedianMm: boot(S.map((s) => { const m = [...s.offset[key].oMag].sort((a: number, b: number) => a - b); return m[Math.floor(m.length / 2)]; })),
        coloniesAboveNullMax: S.filter((s) => s.offset[key].expl > Math.max(...s.offset[key].nullExpl)).length,
      }])),
    };
  }
  out[role] = res;
}
fs.mkdirSync(`${DIR}/results`, { recursive: true });
fs.writeFileSync(`${DIR}/results/${prefix}.json`, JSON.stringify(out, null, 1));
console.log(`wrote results/${prefix}.json`);
