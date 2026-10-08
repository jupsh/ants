/**
 * E1 stop and speed–turning diagnostics (STATUS decisions log 2026-10-08,
 * "Two exploratory E1 checks"). Same code on the Khuong et al. 2013 data and
 * on simulated tracks (through the tracking observer), cluster-bootstrap SEs
 * over ants, combined-SE z. Writes nothing.
 *
 *   1. Heading in vs out of a stop by stop duration (stop episodes as in
 *      walkDiagnostics.diagTrack), and alignment with downhill and with the
 *      direction to the release point before and after stops.
 *   2. Slope of log(1 − ⟨cos⟩ at 10 mm) on log speed between ants vs within
 *      ants (ant fixed effects over within-ant terciles of segment speed;
 *      speed from arc length / moving time, and from displacement).
 *
 * Usage: npx vite-node scripts/diagE1Stops.ts [--ants 600] [--incline k] [--clean]
 *          [--fits A0=data/fits/e1-walk.json,B=data/fits/e1-B-loss11.json]
 *   --clean  leave out 10 mm segments within 0.4 s of a stop in the
 *            speed–turning slopes (are coupling and stop resets separate?)
 */
import fs from 'node:fs';
import { bootstrapSE, combinedZ, olsFit } from '../src/sim/analysis/compare';
import { KHUONG_PREP, prepareTrack, type Track } from '../src/sim/analysis/trajectory';
import { diagTrack } from '../src/sim/analysis/walkDiagnostics';
import { walkParams } from '../src/sim/models/walk';
import { khuongTracking } from '../src/sim/species/lasiusM1';
import { arg, INCLINES, loadKhuong, numArg, readJson } from './lib';
import { SimPool } from './pool';

const DT = 0.04, LAG = 0.2, STOP = 2, ARC = 0.5, CHORD = 5, LAG10 = 20, DOWN = -Math.PI / 2;
const K = Math.round(LAG / DT);
const DUR: [number, number][] = [[0, 0.13], [0.13, 0.25], [0.25, 0.41], [0.41, 0.81], [0.81, 1.61], [1.61, 4.01], [4.01, Infinity]];
const ANTS = numArg('--ants', 600);
const ONLY = numArg('--incline', 0);
const CLEAN = process.argv.includes('--clean');

interface Ant {
  stopCos: number[]; stopN: number[];
  /** Σ over stops (r > 10 mm): cos(out − down) − cos(in − down), cos(out − home) − cos(in − home); n. */
  dDown: number; dHome: number; nBias: number; inHome: number; outHome: number; nLong: number; inHomeL: number; outHomeL: number;
  /** Per 10 mm pair: log arc speed, log displacement speed, cos. */
  segArc: number[]; segDisp: number[]; segCos: number[];
  logArcSpeed: number | null;
  logMedian: number | null; cos10: number | null;
  /** Within-ant terciles of segment speed: [mean log speed, log(1 − ⟨cos⟩)] × 3, or null. */
  grpArc: number[][] | null; grpDisp: number[][] | null;
  meanCos: number | null;
}

function antStats(tr: Track): Ant {
  const { x, y } = tr;
  const n = x.length;
  const a: Ant = { stopCos: DUR.map(() => 0), stopN: DUR.map(() => 0), dDown: 0, dHome: 0, nBias: 0, inHome: 0, outHome: 0, nLong: 0, inHomeL: 0, outHomeL: 0, segArc: [], segDisp: [], segCos: [], logArcSpeed: null, logMedian: null, cos10: null, grpArc: null, grpDisp: null, meanCos: null };
  const d = diagTrack(tr, undefined, false);
  if (d && d.logMedian !== null && d.cos10N >= 20) { a.logMedian = d.logMedian; a.cos10 = d.cos10Sum / d.cos10N; }
  if (n < 10) return a;
  const sp = new Float64Array(n);
  for (let i = 0; i < n; i++) { const j = Math.min(i + K, n - 1); sp[i] = Math.hypot(x[j] - x[i], y[j] - y[i]) / LAG; }

  // 1. Stops (same episode rule as walkDiagnostics.diagTrack).
  for (let s = K; s < n; s++) {
    if (sp[s] >= STOP || sp[s - 1] < STOP) continue;
    let b = s;
    while (b + 1 < n && sp[b + 1] < STOP) b++;
    if (b + 2 * K >= n) break;
    const bx = x[s] - x[s - K], by = y[s] - y[s - K];
    const ax = x[b + 2 * K] - x[b + K], ay = y[b + 2 * K] - y[b + K];
    if (Math.hypot(bx, by) >= STOP * LAG && Math.hypot(ax, ay) >= STOP * LAG) {
      const hin = Math.atan2(by, bx), hout = Math.atan2(ay, ax);
      const dur = (b - s + 1) * DT;
      const k = DUR.findIndex(([lo, hi]) => dur >= lo && dur < hi);
      a.stopCos[k] += Math.cos(hout - hin);
      a.stopN[k]++;
      if (Math.hypot(x[s], y[s]) > 10) {
        const home = Math.atan2(-y[s], -x[s]);
        a.dDown += Math.cos(hout - DOWN) - Math.cos(hin - DOWN);
        a.dHome += Math.cos(hout - home) - Math.cos(hin - home);
        a.nBias++;
        a.inHome += Math.cos(hin - home);
        a.outHome += Math.cos(hout - home);
        if (dur > 0.13) { a.nLong++; a.inHomeL += Math.cos(hin - home); a.outHomeL += Math.cos(hout - home); }
      }
    }
    s = b;
  }

  // 2. Arc-length resampling of the moving path, carrying moving time and window speed.
  // Samples within 2K of a stopped sample (for --clean).
  const near = new Uint8Array(n);
  for (let i = 0; i < n; i++) if (sp[i] < STOP) for (let q = Math.max(0, i - 2 * K); q <= Math.min(n - 1, i + 2 * K); q++) near[q] = 1;
  const px = [x[0]], py = [y[0]], pt = [0], pv = [sp[0]], pn = [near[0]];
  let acc = 0, mt = 0;
  for (let i = 1; i < n; i++) {
    if (sp[i] < STOP) continue;
    const seg = Math.hypot(x[i] - x[i - 1], y[i] - y[i - 1]);
    acc += seg;
    while (acc >= ARC) {
      const f = seg > 0 ? 1 - (acc - ARC) / seg : 1;
      px.push(x[i - 1] + (x[i] - x[i - 1]) * f);
      py.push(y[i - 1] + (y[i] - y[i - 1]) * f);
      pt.push(mt + f * DT);
      pv.push(sp[i]);
      pn.push(near[i]);
      acc -= ARC;
    }
    mt += DT;
  }
  const m = px.length;
  if (m > 40 && mt > 0) a.logArcSpeed = Math.log(((m - 1) * ARC) / pt[m - 1]);
  const H = new Float64Array(Math.max(0, m - CHORD));
  for (let j = 0; j + CHORD < m; j++) H[j] = Math.atan2(py[j + CHORD] - py[j], px[j + CHORD] - px[j]);
  const span = LAG10 + CHORD;
  for (let j = 0; j + LAG10 < H.length; j += 2) {
    const t = pt[j + span] - pt[j];
    if (!(t > 0)) continue;
    let v = 0, touch = 0;
    for (let q = j; q <= j + span; q++) { v += pv[q]; touch |= pn[q]; }
    if (CLEAN && touch) continue;
    a.segArc.push(Math.log((span * ARC) / t));
    a.segDisp.push(Math.log(v / (span + 1)));
    a.segCos.push(Math.cos(H[j + LAG10] - H[j]));
  }
  if (a.segCos.length >= 20) a.meanCos = a.segCos.reduce((s, v) => s + v, 0) / a.segCos.length;
  a.grpArc = terciles(a.segArc, a.segCos);
  a.grpDisp = terciles(a.segDisp, a.segCos);
  a.segArc = a.segDisp = a.segCos = [];
  return a;
}

function terciles(xs: number[], cs: number[]): number[][] | null {
  if (xs.length < 60) return null;
  const order = xs.map((_, i) => i).sort((p, q) => xs[p] - xs[q]);
  const g: number[][] = [];
  for (let t = 0; t < 3; t++) {
    const part = order.slice(Math.floor((t * order.length) / 3), Math.floor(((t + 1) * order.length) / 3));
    const c = part.reduce((s, i) => s + cs[i], 0) / part.length;
    if (part.length < 20 || c >= 1) return null;
    g.push([part.reduce((s, i) => s + xs[i], 0) / part.length, Math.log(1 - c)]);
  }
  return g;
}

/** Within-ant slope: ant fixed effects over within-ant terciles of segment speed. */
function withinSlope(ants: Ant[], key: 'grpArc' | 'grpDisp'): number {
  let sxy = 0, sxx = 0;
  for (const a of ants) {
    const g = a[key];
    if (!g) continue;
    const mx = (g[0][0] + g[1][0] + g[2][0]) / 3, my = (g[0][1] + g[1][1] + g[2][1]) / 3;
    for (const [x, y] of g) { sxy += (x - mx) * (y - my); sxx += (x - mx) ** 2; }
  }
  return sxx > 0 ? sxy / sxx : NaN;
}

function betweenSlope(ants: Ant[], speed: 'arc' | 'median'): number {
  const X: number[] = [], Y: number[] = [];
  for (const a of ants) {
    if (speed === 'median') {
      if (a.logMedian === null || a.cos10 === null || a.cos10 >= 1) continue;
      X.push(a.logMedian); Y.push(Math.log(1 - a.cos10));
    } else {
      if (a.logArcSpeed === null || a.meanCos === null || a.meanCos >= 1) continue;
      X.push(a.logArcSpeed); Y.push(Math.log(1 - a.meanCos));
    }
  }
  return X.length > 5 ? olsFit(X, Y).slope : NaN;
}

const LABELS = [
  ...DUR.map(([lo, hi]) => `stop ⟨cos⟩ in/out ${lo.toFixed(2)}–${Number.isFinite(hi) ? hi.toFixed(2) : '∞'} s`),
  'stop Δ alignment with downhill (out − in)',
  'stop Δ alignment with release dir (out − in)',
  '  ⟨cos(in − release dir)⟩, all stops',
  '  ⟨cos(out − release dir)⟩, all stops',
  '  ⟨cos(in − release dir)⟩, stops > 0.13 s',
  '  ⟨cos(out − release dir)⟩, stops > 0.13 s',
  'slope between ants (median disp speed) [= antTurn]',
  'slope between ants (arc speed)',
  'slope within ants (arc speed)',
  'slope within ants (disp speed)',
  'between − within (arc speed)',
];

function values(ants: Ant[], idx?: number[]): number[] {
  const s = idx ? idx.map((i) => ants[i]) : ants;
  const out: number[] = [];
  DUR.forEach((_, k) => {
    const c = s.reduce((t, a) => t + a.stopCos[k], 0), n = s.reduce((t, a) => t + a.stopN[k], 0);
    out.push(n >= 10 ? c / n : NaN);
  });
  const nb = s.reduce((t, a) => t + a.nBias, 0);
  out.push(nb ? s.reduce((t, a) => t + a.dDown, 0) / nb : NaN);
  out.push(nb ? s.reduce((t, a) => t + a.dHome, 0) / nb : NaN);
  const nl = s.reduce((t, a) => t + a.nLong, 0);
  out.push(nb ? s.reduce((t, a) => t + a.inHome, 0) / nb : NaN, nb ? s.reduce((t, a) => t + a.outHome, 0) / nb : NaN);
  out.push(nl >= 10 ? s.reduce((t, a) => t + a.inHomeL, 0) / nl : NaN, nl >= 10 ? s.reduce((t, a) => t + a.outHomeL, 0) / nl : NaN);
  const bArc = betweenSlope(s, 'arc'), wArc = withinSlope(s, 'grpArc');
  out.push(betweenSlope(s, 'median'), bArc, wArc, withinSlope(s, 'grpDisp'), bArc - wArc);
  return out;
}

function sample(tracks: Track[]) {
  const ants = tracks.map((t) => prepareTrack(t, KHUONG_PREP)).filter((t): t is Track => t !== null).map(antStats);
  const counts = DUR.map((_, k) => ants.reduce((t, a) => t + a.stopN[k], 0));
  return { v: values(ants), se: bootstrapSE(ants.length, (idx) => values(ants, idx), 200, 7), counts };
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
  for (const [, file] of MODELS) {
    const p = walkParams(readJson<any>(file).params);
    sims.push(sample(await pool.e1(p, { incline: INCLINES[k - 1], ants: ANTS, seed: 20261008 + k, dt: 0.02, tracking: khuongTracking(k) })));
  }
  const counts = MODELS.map(([name], m) => `, ${name} ${sims[m].counts.join('/')}`).join('');
  console.log(`\nincline ${k} (${((INCLINES[k - 1] * 180) / Math.PI).toFixed(0)}°)  stops per duration bin: data ${data.counts.join('/')}${counts}`);
  console.log(`  ${'statistic'.padEnd(52)}${'data'.padStart(8)}${'±'.padStart(8)}${MODELS.map(([name]) => name.padStart(8) + 'z'.padStart(7)).join('')}`);
  LABELS.forEach((lab, i) => {
    const cols = sims.map((sim) => f(sim.v[i]) + f(combinedZ(sim.v[i], sim.se[i], data.v[i], data.se[i]), 1).slice(1)).join('');
    console.log(`  ${lab.padEnd(52)}${f(data.v[i])}${f(data.se[i])}${cols}`);
  });
}
pool.close();
