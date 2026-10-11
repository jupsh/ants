/**
 * Stride sway vs correlated tracking error (E1 side task, STATUS 2026-10-10,
 * pre-registered): spectra of the lateral displacement of 1.28 s windows of
 * raw 25 Hz Khuong positions, by chord speed, against the adopted walker
 * with its white tracking observer. Data only (inclines 1–5, fit and
 * development); writes nothing.
 *
 * Moving windows: lateral = signed distance from the chord (first → last
 * point). Stopped windows have no direction, so their x and y spectra are
 * averaged instead.
 *
 * Usage: npx vite-node scripts/strideE1.ts [--ants 600]
 */
import type { Track } from '../../src/sim/analysis/trajectory';
import { walkParams } from '../../src/sim/models/walk';
import { khuongTracking } from '../../src/sim/species/lasiusM1';
import { INCLINES, loadKhuong, numArg, readJson } from '../lib';
import { SimPool } from '../pool';

const DT = 0.04;
const N = 32;
const STEP = 5; // 0.2 s
const BINS: [string, number, number][] = [['10–20', 10, 20], ['20–30', 20, 30], ['30–45', 30, 45], ['45–70', 45, 70]];
const FREQS = Array.from({ length: N / 2 }, (_, k) => (k + 1) / (N * DT));
const HANN = Array.from({ length: N }, (_, n) => 0.5 * (1 - Math.cos((2 * Math.PI * n) / (N - 1))));
const W2 = HANN.reduce((a, w) => a + w * w, 0);

/** One-sided periodogram (mm²/Hz) of a detrended, Hann-tapered series of N samples, at FREQS. */
function spectrum(v: number[]): number[] {
  const n = v.length;
  const mt = (n - 1) / 2;
  const mv = v.reduce((a, x) => a + x, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (i - mt) * (v[i] - mv);
    sxx += (i - mt) ** 2;
  }
  const b = sxy / sxx;
  const r = v.map((x, i) => (x - mv - b * (i - mt)) * HANN[i]);
  return FREQS.map((_, k) => {
    let re = 0;
    let im = 0;
    for (let i = 0; i < n; i++) {
      const a = (-2 * Math.PI * (k + 1) * i) / n;
      re += r[i] * Math.cos(a);
      im += r[i] * Math.sin(a);
    }
    return ((2 * DT) / W2) * (re * re + im * im);
  });
}

interface Acc {
  sum: number[];
  n: number;
}
const acc = (): Acc => ({ sum: FREQS.map(() => 0), n: 0 });
const add = (a: Acc, s: number[]) => {
  s.forEach((v, i) => (a.sum[i] += v));
  a.n++;
};
const mean = (a: Acc) => a.sum.map((v) => v / Math.max(1, a.n));

/** Per class ('stopped' or a speed bin): mean lateral spectrum over non-overlapping windows. */
function classify(tracks: Track[]): Map<string, Acc> {
  const out = new Map<string, Acc>([['stopped', acc()], ...BINS.map(([l]) => [l, acc()] as [string, Acc])]);
  for (const tr of tracks) {
    let i = 0;
    while (i + N <= tr.t.length) {
      // Uniform 25 Hz run of N samples, else skip past the gap.
      let gap = -1;
      for (let j = i + 1; j < i + N; j++) if (Math.abs(tr.t[j] - tr.t[j - 1] - DT) > DT / 2) gap = j;
      if (gap >= 0) {
        i = gap;
        continue;
      }
      const x = Array.from(tr.x.subarray(i, i + N));
      const y = Array.from(tr.y.subarray(i, i + N));
      const steps = Array.from({ length: N - STEP }, (_, j) => Math.hypot(x[j + STEP] - x[j], y[j + STEP] - y[j]) / (STEP * DT));
      const cx = x[N - 1] - x[0];
      const cy = y[N - 1] - y[0];
      const chord = Math.hypot(cx, cy);
      const vChord = chord / ((N - 1) * DT);
      if (vChord < 2 && steps.every((s) => s < 2)) {
        const sx = spectrum(x);
        const sy = spectrum(y);
        add(out.get('stopped')!, sx.map((v, k) => (v + sy[k]) / 2));
      } else if (steps.every((s) => s > 5)) {
        const bin = BINS.find(([, lo, hi]) => vChord >= lo && vChord < hi);
        if (bin) {
          const ux = cx / chord;
          const uy = cy / chord;
          add(out.get(bin[0])!, spectrum(x.map((xi, j) => ux * (y[j] - y[0]) - uy * (xi - x[0]))));
        }
      }
      i += N;
    }
  }
  return out;
}

function classifySpectra(tracks: Track[]): Map<string, { s: number[]; n: number } | null> {
  return new Map([...classify(tracks)].map(([k, a]) => [k, a.n ? { s: mean(a), n: a.n } : null]));
}

const ANTS = numArg('--ants', 600);
const pool = await SimPool.create();
const walk = walkParams(readJson<any>('data/fits/e1-walk.json').params);
const fmt = (v: number) => (v < 0.001 ? v.toExponential(1) : v.toFixed(4));
for (let k = 1; k <= 5; k++) {
  const data = classifySpectra(loadKhuong(k));
  const sim = classifySpectra(await pool.e1(walk, { incline: INCLINES[k - 1], ants: ANTS, seed: 5_100_000 + 10_000 * k, dt: 0.02, tracking: khuongTracking(k) }));
  console.log(`\n=== incline ${k} (${Math.round((INCLINES[k - 1] * 180) / Math.PI)}°): lateral power (mm²/Hz) data / walker, ratio; f in Hz`);
  console.log(`  ${'class'.padEnd(8)} ${FREQS.map((f) => f.toFixed(1).padStart(6)).join(' ')}`);
  for (const [cls] of [['stopped'], ...BINS] as [string][]) {
    const dd = data.get(cls);
    const ss = sim.get(cls);
    const d = dd?.s;
    const s = ss?.s;
    if (!d) {
      console.log(`  ${cls.padEnd(8)} (no data windows)`);
      continue;
    }
    console.log(`  ${cls.padEnd(8)} ${d.map((v) => fmt(v).padStart(6)).join(' ')}  data (${dd!.n} windows)`);
    if (s) {
      console.log(`  ${''.padEnd(8)} ${s.map((v) => fmt(v).padStart(6)).join(' ')}  walker (${ss!.n} windows)`);
      console.log(`  ${''.padEnd(8)} ${d.map((v, i) => (v / s[i]).toFixed(2).padStart(6)).join(' ')}  ratio`);
      const hi = FREQS.map((_, i) => i).filter((i) => FREQS[i] >= 3);
      const ex = hi.map((i) => d[i] - s[i]);
      const peak = hi[ex.indexOf(Math.max(...ex))];
      const pos = ex.map((v) => Math.max(0, v));
      const cen = pos.reduce((a, v, j) => a + v * FREQS[hi[j]], 0) / Math.max(1e-12, pos.reduce((a, v) => a + v, 0));
      const pd = hi.reduce((a, i) => a + d[i], 0);
      const ps = hi.reduce((a, i) => a + s[i], 0);
      console.log(`  ${''.padEnd(8)} ≥ 3 Hz: excess peak ${FREQS[peak].toFixed(1)} Hz, centroid ${cen.toFixed(1)} Hz, power data/walker ${(pd / ps).toFixed(2)}`);
    }
  }
}
pool.close();
