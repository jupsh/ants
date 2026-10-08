/**
 * E1 stop-duration and turn-linked speed diagnostics (STATUS decisions log
 * 2026-10-08, "Two more exploratory E1 checks"). Same code on the Khuong et
 * al. 2013 data and on simulated tracks (through the tracking observer),
 * cluster-bootstrap SEs over ants, combined-SE z. Writes nothing.
 *
 *   1. Stop episodes (forward 0.2 s speed < 2 mm/s, as in diagTrack) per
 *      minute of track, by duration.
 *   2. Speed around big turns: turn = angle > 1 rad between the 0.2 s
 *      displacements before and after a sample (local maxima within ±0.2 s);
 *      3-point speed divided by the ant's median moving speed, averaged at
 *      lags from the turn and divided by the same average over all samples.
 *      Plus the coefficient of variation of the time between big turns.
 *
 * Usage: npx vite-node scripts/diagE1Turns.ts [--ants 600] [--incline k]
 *          [--fits A0=data/fits/e1-walk.json,B=data/fits/e1-B-loss11.json]
 */
import fs from 'node:fs';
import { bootstrapSE, combinedZ } from '../src/sim/analysis/compare';
import { KHUONG_PREP, prepareTrack, type Track } from '../src/sim/analysis/trajectory';
import { walkParams } from '../src/sim/models/walk';
import { khuongTracking } from '../src/sim/species/lasiusM1';
import { arg, INCLINES, loadKhuong, numArg, readJson } from './lib';
import { SimPool } from './pool';

const DT = 0.04;
const K = 5; // 0.2 s
const STOP = 2;
const TURN = 1; // rad
const MIN_DISP = 0.4; // mm over 0.2 s, for a defined heading
const MAXLAG = 50; // samples (2 s)
const DUR: [number, number][] = [
  [0, 0.13],
  [0.13, 0.25],
  [0.25, 0.41],
  [0.41, 0.81],
  [0.81, 1.61],
  [1.61, Infinity],
];
const LAGS = [-2, -1, -0.6, -0.4, -0.2, -0.12, 0, 0.12, 0.2, 0.4, 0.6, 1, 2];
const ANTS = numArg('--ants', 600);
const ONLY = numArg('--incline', 0);

interface Ant {
  minutes: number;
  stops: number[];
  turns: number;
  /** Σ normalised speed and counts at each lag −MAXLAG … +MAXLAG. */
  prof: Float64Array;
  profN: Float64Array;
  /** Σ normalised speed and count over all samples (baseline). */
  base: number;
  baseN: number;
  /** Σ t, Σ t², n of times between consecutive big turns (s). */
  iti: number[];
}

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

function antStats(tr: Track): Ant | null {
  const { x, y } = tr;
  const n = x.length;
  if (n < 4 * K) return null;
  const a: Ant = { minutes: (n * DT) / 60, stops: DUR.map(() => 0), turns: 0, prof: new Float64Array(2 * MAXLAG + 1), profN: new Float64Array(2 * MAXLAG + 1), base: 0, baseN: 0, iti: [0, 0, 0] };
  const sp = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const j = Math.min(i + K, n - 1);
    sp[i] = Math.hypot(x[j] - x[i], y[j] - y[i]) / (K * DT);
  }
  // 1. Stop episodes.
  for (let s = 1; s < n; s++) {
    if (sp[s] >= STOP || sp[s - 1] < STOP) continue;
    let b = s;
    while (b + 1 < n && sp[b + 1] < STOP) b++;
    const dur = (b - s + 1) * DT;
    a.stops[DUR.findIndex(([lo, hi]) => dur >= lo && dur < hi)]++;
    s = b;
  }
  // 2. Normalised 3-point speed.
  const v = new Float64Array(n).fill(NaN);
  const moving: number[] = [];
  for (let i = 1; i < n - 1; i++) {
    v[i] = Math.hypot(x[i + 1] - x[i - 1], y[i + 1] - y[i - 1]) / (2 * DT);
    if (sp[i] >= STOP) moving.push(v[i]);
  }
  if (moving.length < 20) return a;
  moving.sort((p, q) => p - q);
  const med = moving[moving.length >> 1];
  for (let i = 1; i < n - 1; i++) {
    v[i] /= med;
    a.base += v[i];
    a.baseN++;
  }
  // Turn angle at each sample; events are local maxima above TURN.
  const ang = new Float64Array(n);
  for (let i = K; i + K < n; i++) {
    const bx = x[i] - x[i - K];
    const by = y[i] - y[i - K];
    const ax = x[i + K] - x[i];
    const ay = y[i + K] - y[i];
    if (Math.hypot(bx, by) < MIN_DISP || Math.hypot(ax, ay) < MIN_DISP) continue;
    ang[i] = Math.abs(wrap(Math.atan2(ay, ax) - Math.atan2(by, bx)));
  }
  let last = -1;
  for (let i = K; i + K < n; i++) {
    if (ang[i] <= TURN) continue;
    let isMax = true;
    for (let q = i - K; q <= i + K && isMax; q++) if (q !== i && (ang[q] > ang[i] || (ang[q] === ang[i] && q < i))) isMax = false;
    if (!isMax) continue;
    a.turns++;
    for (let L = -MAXLAG; L <= MAXLAG; L++) {
      const q = i + L;
      if (q < 1 || q >= n - 1) continue;
      a.prof[L + MAXLAG] += v[q];
      a.profN[L + MAXLAG]++;
    }
    if (last >= 0) {
      const t = (i - last) * DT;
      a.iti[0] += t;
      a.iti[1] += t * t;
      a.iti[2]++;
    }
    last = i;
  }
  return a;
}

const LABELS = [
  ...DUR.map(([lo, hi]) => `stop episodes per min, ${lo.toFixed(2)}–${Number.isFinite(hi) ? hi.toFixed(2) : '∞'} s`),
  'big turns per min',
  ...LAGS.map((l) => `speed / baseline at ${l >= 0 ? '+' : ''}${l.toFixed(2)} s from a big turn`),
  'dip: min over |lag| ≤ 0.4 s',
  'shoulders: mean over 1–2 s either side',
  'asymmetry: (−0.6…−0.2 s) − (+0.2…+0.6 s)',
  'CV of time between big turns',
];

function values(ants: Ant[], idx?: number[]): number[] {
  const s = idx ? idx.map((i) => ants[i]) : ants;
  const min = s.reduce((t, a) => t + a.minutes, 0);
  const out = DUR.map((_, k) => s.reduce((t, a) => t + a.stops[k], 0) / min);
  out.push(s.reduce((t, a) => t + a.turns, 0) / min);
  const base = s.reduce((t, a) => t + a.base, 0) / s.reduce((t, a) => t + a.baseN, 0);
  const at = (L: number) => {
    const c = s.reduce((t, a) => t + a.profN[L + MAXLAG], 0);
    return c ? s.reduce((t, a) => t + a.prof[L + MAXLAG], 0) / c / base : NaN;
  };
  for (const l of LAGS) out.push(at(Math.round(l / DT)));
  const range = (lo: number, hi: number) => {
    let sum = 0;
    let c = 0;
    for (let L = Math.round(lo / DT); L <= Math.round(hi / DT); L++) {
      sum += at(L);
      c++;
    }
    return sum / c;
  };
  let dip = Infinity;
  for (let L = -10; L <= 10; L++) dip = Math.min(dip, at(L));
  out.push(dip, (range(-2, -1) + range(1, 2)) / 2, range(-0.6, -0.2) - range(0.2, 0.6));
  const [t1, t2, tn] = s.reduce((t, a) => [t[0] + a.iti[0], t[1] + a.iti[1], t[2] + a.iti[2]], [0, 0, 0]);
  const m = t1 / tn;
  out.push(tn > 10 ? Math.sqrt(t2 / tn - m * m) / m : NaN);
  return out;
}

function sample(tracks: Track[]) {
  const ants = tracks
    .map((t) => prepareTrack(t, KHUONG_PREP))
    .filter((t): t is Track => t !== null)
    .map(antStats)
    .filter((a): a is Ant => a !== null);
  return { v: values(ants), se: bootstrapSE(ants.length, (idx) => values(ants, idx), 200, 11) };
}

const MODELS = arg('--fits', 'A0=data/fits/e1-walk.json,B=data/fits/e1-B-loss11.json')
  .split(',')
  .map((m) => m.split('=') as [string, string])
  .filter(([name, file]) => fs.existsSync(file) || (console.log(`skipping ${name}: ${file} not found`), false));
const f = (v: number, d = 3) => (Number.isFinite(v) ? v.toFixed(d) : '—').padStart(8);
const pool = await SimPool.create();
for (let k = 1; k <= 5; k++) {
  if (ONLY && k !== ONLY) continue;
  const data = sample(loadKhuong(k));
  const sims: ReturnType<typeof sample>[] = [];
  for (const [, file] of MODELS) sims.push(sample(await pool.e1(walkParams(readJson<any>(file).params), { incline: INCLINES[k - 1], ants: ANTS, seed: 20261009 + k, dt: 0.02, tracking: khuongTracking(k) })));
  console.log(`\nincline ${k} (${((INCLINES[k - 1] * 180) / Math.PI).toFixed(0)}°)`);
  console.log(`  ${'statistic'.padEnd(46)}${'data'.padStart(8)}${'±'.padStart(8)}${MODELS.map(([name]) => name.padStart(8) + 'z'.padStart(7)).join('')}`);
  LABELS.forEach((lab, i) => {
    const cols = sims.map((sim) => f(sim.v[i]) + f(combinedZ(sim.v[i], sim.se[i], data.v[i], data.se[i]), 1).slice(1)).join('');
    console.log(`  ${lab.padEnd(46)}${f(data.v[i])}${f(data.se[i])}${cols}`);
  });
}
pool.close();
