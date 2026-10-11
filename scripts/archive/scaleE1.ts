/**
 * Sampling-scale sweep (STATUS 2026-10-09, step 3; Rosser et al.: a turn
 * inside one sampling interval appears as two turns and a shortened step,
 * so apparent speed and turning are coupled by the sampling). Apparent
 * step statistics at moving-average windows 1/3/5 and subsampling
 * τ = 0.04–0.32 s, for the Khuong data, fitted A0 and T, and the Khuong
 * reference walker, tracking observer on, cluster-bootstrap SEs over ants.
 * Writes nothing (--out f saves the curves).
 *
 * Usage: npx vite-node scripts/scaleE1.ts [--ants 1000] [--inclines 1,2,3,4,5] [--out f.json]
 */
import { bootstrapSE, combinedZ } from '../../src/sim/analysis/compare';
import { prepareTrack, type Track } from '../../src/sim/analysis/trajectory';
import { walkParams } from '../../src/sim/models/walk';
import { khuongTracking } from '../../src/sim/species/lasiusM1';
import { arg, INCLINES, loadKhuong, loadKhuongPools, numArg, readJson, writeJson } from '../lib';
import { SimPool } from '../pool';

const ANTS = numArg('--ants', 1000);
const KS = arg('--inclines', '1,2,3,4,5').split(',').map(Number);
const OUT = arg('--out', '');
const WINDOWS = [1, 3, 5];
const TAUS = [0.04, 0.08, 0.16, 0.32];
const STOP = 2; // mm/s
const BIG = 0.5; // rad
const SPEED_BIN = 0.5;
const SPEED_NBIN = 600;
const TURN_BIN = 0.01;
const TURN_NBIN = Math.ceil(Math.PI / TURN_BIN) + 1;

const STATS = ['stopped', 'speed.q10', 'speed.q50', 'turn.med', 'turn.big', 'cos', 'coupling'] as const;
const LABEL: Record<(typeof STATS)[number], string> = {
  stopped: 'stopped-step fraction',
  'speed.q10': 'step speed q10 (mm/s)',
  'speed.q50': 'step speed median (mm/s)',
  'turn.med': 'median |turn| (rad)',
  'turn.big': 'P(|turn| > 0.5)',
  cos: '⟨cos turn⟩',
  coupling: 'log(|turn| slow third / fast third)',
};

/** Per-ant sums at one (window, τ). */
interface AntScale {
  steps: number;
  stopped: number;
  speed: Float64Array;
  turn: Float64Array;
  turns: number;
  big: number;
  cos: number;
  slow: number;
  slowN: number;
  fast: number;
  fastN: number;
}

function antScale(tr: Track, w: number, tau: number): AntScale | null {
  const prep = prepareTrack(tr, { dt: 0.04, smooth: w, startRadius: 10, endRadius: 200 });
  if (!prep) return null;
  const m = Math.round(tau / 0.04);
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i < prep.x.length; i += m) {
    xs.push(prep.x[i]);
    ys.push(prep.y[i]);
  }
  if (xs.length < 4) return null;
  const a: AntScale = { steps: 0, stopped: 0, speed: new Float64Array(SPEED_NBIN), turn: new Float64Array(TURN_NBIN), turns: 0, big: 0, cos: 0, slow: 0, slowN: 0, fast: 0, fastN: 0 };
  const n = xs.length - 1;
  const v = new Float64Array(n);
  const h = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const dx = xs[i + 1] - xs[i];
    const dy = ys[i + 1] - ys[i];
    v[i] = Math.hypot(dx, dy) / tau;
    h[i] = Math.atan2(dy, dx);
    a.steps++;
    if (v[i] < STOP) a.stopped++;
    else a.speed[Math.min(SPEED_NBIN - 1, Math.floor(v[i] / SPEED_BIN))]++;
  }
  // Turns between consecutive moving steps, with the mean speed of the pair.
  const tv: number[] = [];
  const ta: number[] = [];
  for (let i = 0; i + 1 < n; i++) {
    if (v[i] < STOP || v[i + 1] < STOP) continue;
    const d = Math.atan2(Math.sin(h[i + 1] - h[i]), Math.cos(h[i + 1] - h[i]));
    const t = Math.abs(d);
    a.turn[Math.min(TURN_NBIN - 1, Math.floor(t / TURN_BIN))]++;
    a.turns++;
    if (t > BIG) a.big++;
    a.cos += Math.cos(d);
    tv.push((v[i] + v[i + 1]) / 2);
    ta.push(t);
  }
  if (tv.length >= 30) {
    const order = tv.map((_, i) => i).sort((p, q) => tv[p] - tv[q]);
    const third = Math.floor(order.length / 3);
    for (const i of order.slice(0, third)) {
      a.slow += ta[i];
      a.slowN++;
    }
    for (const i of order.slice(order.length - third)) {
      a.fast += ta[i];
      a.fastN++;
    }
  }
  return a;
}

function histQ(h: Float64Array, bin: number, p: number): number {
  const total = h.reduce((s, c) => s + c, 0);
  if (!total) return NaN;
  const target = p * total;
  let cum = 0;
  for (let i = 0; i < h.length; i++) {
    if (cum + h[i] >= target && h[i] > 0) return (i + (target - cum) / h[i]) * bin;
    cum += h[i];
  }
  return h.length * bin;
}

function values(ants: AntScale[], idx?: number[]): number[] {
  const s = idx ? idx.map((i) => ants[i]) : ants;
  const sp = new Float64Array(SPEED_NBIN);
  const tu = new Float64Array(TURN_NBIN);
  let steps = 0,
    stopped = 0,
    turns = 0,
    big = 0,
    cos = 0,
    slow = 0,
    slowN = 0,
    fast = 0,
    fastN = 0;
  for (const a of s) {
    for (let i = 0; i < SPEED_NBIN; i++) sp[i] += a.speed[i];
    for (let i = 0; i < TURN_NBIN; i++) tu[i] += a.turn[i];
    steps += a.steps;
    stopped += a.stopped;
    turns += a.turns;
    big += a.big;
    cos += a.cos;
    slow += a.slow;
    slowN += a.slowN;
    fast += a.fast;
    fastN += a.fastN;
  }
  return [stopped / steps, histQ(sp, SPEED_BIN, 0.1), histQ(sp, SPEED_BIN, 0.5), histQ(tu, TURN_BIN, 0.5), turns ? big / turns : NaN, turns ? cos / turns : NaN, slowN && fastN ? Math.log(slow / slowN / (fast / fastN)) : NaN];
}

/** Values and SEs at every (window, τ), keyed "w/τ". */
function curves(tracks: Track[]) {
  const out = new Map<string, { v: number[]; se: number[] }>();
  for (const w of WINDOWS)
    for (const tau of TAUS) {
      const ants = tracks.map((t) => antScale(t, w, tau)).filter((a): a is AntScale => a !== null);
      out.set(`${w}/${tau}`, { v: values(ants), se: bootstrapSE(ants.length, (idx) => values(ants, idx), 100, 3) });
    }
  return out;
}

const pool = await SimPool.create();
const opts = (k: number, seed: number) => ({ incline: INCLINES[k - 1], ants: ANTS, seed, dt: 0.02, tracking: khuongTracking(k) });
const f = (x: number, d = 2) => (Number.isFinite(x) ? x.toFixed(d) : '—');
const saved: Record<string, unknown> = {};
const MODELS = ['A0', 'T', 'khuong'];
console.log(`Apparent step statistics at windows ${WINDOWS.join('/')} × τ ${TAUS.join('/')} s; z = combined; fit scale = window 3, τ 0.04.`);
for (const k of KS) {
  const data = curves(loadKhuong(k));
  const sims = new Map<string, ReturnType<typeof curves>>();
  for (const name of MODELS) {
    const tracks = name === 'khuong' ? await pool.sectored(loadKhuongPools(k, 'xy'), { ants: ANTS, seed: 5150 + k, compat: true, tracking: khuongTracking(k) }) : await pool.e1(walkParams(readJson<any>(`data/fits/e1-${name}.json`).params), opts(k, 5150 + k));
    sims.set(name, curves(tracks));
  }
  console.log(`\n=== incline ${k} (${((INCLINES[k - 1] * 180) / Math.PI).toFixed(0)}°)`);
  STATS.forEach((st, si) => {
    console.log(`  ${LABEL[st]}`);
    for (const w of WINDOWS) {
      const cells = TAUS.map((tau) => {
        const d = data.get(`${w}/${tau}`)!;
        const zs = MODELS.map((m) => {
          const s = sims.get(m)!.get(`${w}/${tau}`)!;
          return f(combinedZ(s.v[si], s.se[si], d.v[si], d.se[si]), 1).padStart(6);
        });
        return `${f(d.v[si], 3).padStart(7)}${zs.join('')}`;
      });
      console.log(`    w${w}  ${cells.join('  |')}`);
    }
  });
  // Shape: does the model's change across scales follow the data's? Σ over scales of z² of
  // (stat at scale − stat at the fit scale), both relative to the fit scale.
  console.log('  scale-curve misfit, Σz² over all 12 scales (fit scale alone in brackets):');
  for (const m of MODELS) {
    const parts = STATS.map((_, si) => {
      let tot = 0;
      for (const key of data.keys()) {
        const d = data.get(key)!;
        const s = sims.get(m)!.get(key)!;
        const z = combinedZ(s.v[si], s.se[si], d.v[si], d.se[si]);
        if (Number.isFinite(z)) tot += z * z;
      }
      const d = data.get('3/0.04')!;
      const s = sims.get(m)!.get('3/0.04')!;
      return `${STATS[si]} ${tot.toFixed(0)} [${(combinedZ(s.v[si], s.se[si], d.v[si], d.se[si]) ** 2).toFixed(0)}]`;
    });
    console.log(`    ${m.padEnd(7)} ${parts.join(', ')}`);
  }
  if (OUT) saved[`incline${k}`] = { data: Object.fromEntries(data), ...Object.fromEntries([...sims].map(([m, c]) => [m, Object.fromEntries(c)])) };
}
console.log('\ncolumns per τ: data value, then z for ' + MODELS.join(', ') + `; τ = ${TAUS.join(' | ')} s`);
if (OUT) writeJson(OUT, saved);
pool.close();
