/**
 * B018 families 3–6 from pass B (out/rules-c*.json), read as logged in the Progress log (readings for 3–6).
 * Ratios across colonies: Mantel–Haenszel rate ratios with colony × role × wall × phase × (other covariates) strata,
 * colony bootstrap (2000). Fits: Poisson (leaving vs A) and interval-censored, left-truncated survival (still runs).
 *   nice -n 19 npx vite-node backlog/B018-resting-site-and-aggregation-in-the/rulesAgg.ts   → results/rules.json
 */
import fs from 'node:fs';
import { readJson, writeJson } from '../../scripts/lib';
import { nelderMead } from '../../src/sim/analysis/optimize';
import { RNG } from '../../src/sim/core/rng';
import { stamp } from '../_lib/stamp';
import { boot, ENTRANCE, FRAME_DT, ITEM, mean, median } from './lib';

interface Zone { role: number; k: number; cx: number; cy: number; rg: number; a90: number; e24: number }
interface Ant { role: number; mv: number[]; st: number[]; sx: number[]; sy: number[]; np: number[] }
interface Rec {
  colony: string;
  dims: { N_BINS: number; A_BINS: number; E_BINS: number; ARR_BINS: number; SURV_EDGES: number[]; G_BIN: number; G_N: number };
  stopT: number[]; leaveT: number[]; leaveUnknown: number; surv: number[]; arrivals: number[]; taxis: number[];
  gNow: number[][]; gLag: number[][]; zones: (Zone | null)[]; e24: { grid: number[]; W: number; H: number };
  bins: { b0: number; ants: Ant[] };
}
const files = fs.readdirSync(`${ITEM}/out`).filter((f) => /^rules-c\d+\.json$/.test(f)).sort((a, b) => parseInt(a.slice(7)) - parseInt(b.slice(7)));
const recs = files.map((f) => readJson<Rec>(`${ITEM}/out/${f}`));
const site = readJson<{ colonies: { colony: string; queen: [number, number]; posthoc: { centroid24: [number, number] } }[] }>(`${ITEM}/results/site.json`);
const { N_BINS, A_BINS, E_BINS, ARR_BINS, SURV_EDGES, G_BIN, G_N } = recs[0].dims;
const COLS = recs.map((_, i) => i);
const B = Number(process.env.B018_B ?? 2000); // smaller only for debugging
const rng = new RNG(1803);
const draws = Array.from({ length: B }, () => COLS.map(() => COLS[rng.int(COLS.length)]));
const ci = (est: number, v: number[]) => {
  const w = v.filter(Number.isFinite).sort((a, b) => a - b);
  return { est, lo: w[Math.floor(0.025 * w.length)], hi: w[Math.floor(0.975 * w.length)] };
};
/** Statistic over a multiset of colony indices: point estimate and colony-bootstrap CI. */
const bootIdx = (stat: (S: number[]) => number) => ci(stat(COLS), draws.map(stat));

// ---------- generic stratified rate tables ----------
/** Cells: { strata key, group (0 reference, 1 exposed, −1 neither), events, seconds } per colony. */
type Cell = { s: string; g: number; ev: number; sec: number };
function mh(cells: Cell[][], S: number[]): number {
  const st = new Map<string, number[]>(); // [a, T1, b, T0]
  S.forEach((c, r) => {
    for (const x of cells[c]) {
      if (x.g < 0) continue;
      const key = `${r}|${x.s}`; // resampled copies are separate strata
      const v = st.get(key) ?? [0, 0, 0, 0];
      if (x.g === 1) { v[0] += x.ev; v[1] += x.sec; } else { v[2] += x.ev; v[3] += x.sec; }
      st.set(key, v);
    }
  });
  let num = 0, den = 0;
  for (const [a, T1, b, T0] of st.values()) {
    const T = T1 + T0;
    if (!T1 || !T0) continue;
    num += (a * T0) / T;
    den += (b * T1) / T;
  }
  return num / den;
}
const pooledRate = (cells: Cell[][], S: number[], g: number) => {
  let ev = 0, sec = 0;
  for (const c of S) for (const x of cells[c]) if (x.g === g) { ev += x.ev; sec += x.sec; }
  return ev / sec;
};

// stop table: ((((role*2+wall)*2+phase)*N_BINS + nb)*E_BINS + e)*3 → [exp, ev, sec]
function stopCells(group: (nb: number, e: number) => number, strata: (role: number, wall: number, ph: number, nb: number, e: number) => string, filter = (_r: number, _w: number) => true): Cell[][] {
  return recs.map((r) => {
    const out: Cell[] = [];
    for (let role = 0; role < 2; role++) for (let wall = 0; wall < 2; wall++) for (let ph = 0; ph < 2; ph++) for (let nb = 0; nb < N_BINS; nb++) for (let e = 0; e < E_BINS; e++) {
      if (!filter(role, wall)) continue;
      const k = ((((role * 2 + wall) * 2 + ph) * N_BINS + nb) * E_BINS + e) * 3;
      out.push({ s: strata(role, wall, ph, nb, e), g: group(nb, e), ev: r.stopT[k + 1], sec: r.stopT[k + 2] });
    }
    return out;
  });
}
// leave table: (((((role*2+wall)*2+phase)*A_BINS + A-1)*E_BINS + e)*ARR_BINS + arr)*4 → [exp, ev, sec, sustained]
function leaveCells(group: (A: number, e: number, arr: number) => number, strata: (role: number, wall: number, ph: number, A: number, e: number, arr: number) => string, sustained = false, filter = (_r: number, _w: number) => true): Cell[][] {
  return recs.map((r) => {
    const out: Cell[] = [];
    for (let role = 0; role < 2; role++) for (let wall = 0; wall < 2; wall++) for (let ph = 0; ph < 2; ph++) for (let A = 1; A <= A_BINS; A++) for (let e = 0; e < E_BINS; e++) for (let arr = 0; arr < ARR_BINS; arr++) {
      if (!filter(role, wall)) continue;
      const k = (((((role * 2 + wall) * 2 + ph) * A_BINS + A - 1) * E_BINS + e) * ARR_BINS + arr) * 4;
      out.push({ s: strata(role, wall, ph, A, e, arr), g: group(A, e, arr), ev: r.leaveT[k + (sustained ? 3 : 1)], sec: r.leaveT[k + 2] });
    }
    return out;
  });
}
const WALLS: [string, (r: number, w: number) => boolean][] = [['all', () => true], ['centre', (_r, w) => w === 0], ['wall', (_r, w) => w === 1]];
const ROLES: [string, (r: number, w: number) => boolean][] = [['nurse', (r) => r === 0], ['forager', (r) => r === 1]];

// ---------- 3a stop hazard ----------
const s3a: Record<string, unknown> = {};
for (const [wn, wf] of WALLS) {
  const nbC = stopCells((nb) => (nb >= 3 ? 1 : nb === 0 ? 0 : -1), (r, w, ph, _nb, e) => `${r}${w}${ph}${e}`, wf);
  const eC = stopCells((_nb, e) => (e >= 3 ? 1 : e <= 1 ? 0 : -1), (r, w, ph, nb) => `${r}${w}${ph}${nb}`, wf);
  const byN = Array.from({ length: N_BINS }, (_, nb) => pooledRate(stopCells((x) => (x === nb ? 1 : -1), () => '', wf), COLS, 1));
  const byE = Array.from({ length: E_BINS }, (_, e) => pooledRate(stopCells((_x, y) => (y === e ? 1 : -1), () => '', wf), COLS, 1));
  s3a[wn] = { neighbourRR_N3plus_vs_N0: bootIdx((S) => mh(nbC, S)), siteRR_E2plus_vs_Elt1: bootIdx((S) => mh(eC, S)), hazardPerS_byN: byN, hazardPerS_byE: byE };
}
for (const [rn, rf] of ROLES) {
  s3a[rn] = {
    neighbourRR_N3plus_vs_N0: bootIdx((S) => mh(stopCells((nb) => (nb >= 3 ? 1 : nb === 0 ? 0 : -1), (r, w, ph, _nb, e) => `${r}${w}${ph}${e}`, rf), S)),
    siteRR_E2plus_vs_Elt1: bootIdx((S) => mh(stopCells((_nb, e) => (e >= 3 ? 1 : e <= 1 ? 0 : -1), (r, w, ph, nb) => `${r}${w}${ph}${nb}`, rf), S)),
  };
}
// Family 4: wall band vs centre at the same N, E, role, phase.
s3a.wallOverCentre = bootIdx((S) => mh(stopCells(() => 0, (r, _w, ph, nb, e) => `${r}${ph}${nb}${e}`).map((cs, c) => cs.map((x, k) => ({ ...x, g: Math.floor(k / (N_BINS * E_BINS * 2)) % 2 }))), S));

// ---------- 3b leaving vs A ----------
const leaveByA = (S: number[], sustained = false, wf = (_r: number, _w: number) => true) => {
  const ev = new Array(A_BINS).fill(0), sec = new Array(A_BINS).fill(0);
  for (const c of S) {
    const r = recs[c];
    for (let role = 0; role < 2; role++) for (let wall = 0; wall < 2; wall++) {
      if (!wf(role, wall)) continue;
      for (let ph = 0; ph < 2; ph++) for (let A = 1; A <= A_BINS; A++) for (let e = 0; e < E_BINS; e++) for (let arr = 0; arr < ARR_BINS; arr++) {
        const k = (((((role * 2 + wall) * 2 + ph) * A_BINS + A - 1) * E_BINS + e) * ARR_BINS + arr) * 4;
        ev[A - 1] += r.leaveT[k + (sustained ? 3 : 1)];
        sec[A - 1] += r.leaveT[k + 2];
      }
    }
  }
  return { ev, sec };
};
/** Weighted (by events) least squares of log pL on log A over A = 1…8: returns b. */
function powerSlope(ev: number[], sec: number[]): number {
  let sw = 0, sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (let A = 1; A <= 8; A++) {
    const e = ev[A - 1];
    if (!e) continue;
    const x = Math.log(A), y = Math.log(e / sec[A - 1]);
    sw += e; sx += e * x; sy += e * y; sxx += e * x * x; sxy += e * x * y;
  }
  return -((sw * sxy - sx * sy) / (sw * sxx - sx * sx));
}
const poissonNLL = (rate: (A: number) => number, ev: number[], sec: number[]) => {
  let s = 0;
  for (let A = 1; A <= 8; A++) {
    const mu = rate(A) * sec[A - 1];
    s += mu - ev[A - 1] * Math.log(mu);
  }
  return s;
};
async function formFits(ev: number[], sec: number[]) {
  const r1 = ev[0] / sec[0];
  const pw = await nelderMead(([la, b]) => poissonNLL((A) => Math.exp(la) * A ** -b, ev, sec), [Math.log(r1), 1], 0.3, 800, 1e-10);
  const am = await nelderMead(([lt, lk, ln]) => poissonNLL((A) => Math.exp(lt) / (1 + Math.exp(lk) * A ** Math.exp(ln)), ev, sec), [Math.log(r1 * 2), 0, Math.log(2)], 0.3, 1500, 1e-10);
  return { power: { a: Math.exp(pw.x[0]), b: pw.x[1], nll: pw.f }, ame: { theta: Math.exp(am.x[0]), k: Math.exp(am.x[1]), n: Math.exp(am.x[2]), nll: am.f }, dAIC_powerMinusAme: 2 * pw.f + 4 - (2 * am.f + 6) };
}
const s3b: Record<string, unknown> = {};
{
  const perColB = COLS.map((c) => { const { ev, sec } = leaveByA([c]); return powerSlope(ev, sec); });
  const pooled = leaveByA(COLS);
  const fits = await formFits(pooled.ev, pooled.sec);
  const bootD: number[] = [];
  const bootB: number[] = [];
  for (const S of draws) {
    const { ev, sec } = leaveByA(S);
    const f = await formFits(ev, sec);
    bootD.push(f.dAIC_powerMinusAme);
    bootB.push(f.power.b);
  }
  const eC = leaveCells((_A, e) => (e >= 3 ? 1 : e <= 1 ? 0 : -1), (r, w, ph, A, _e, arr) => `${r}${w}${ph}${A}${arr}`);
  s3b.all = {
    pL_perS_byA: pooled.ev.map((e, k) => e / pooled.sec[k]),
    events_byA: pooled.ev,
    bPerColonyMean: boot(perColB.filter(Number.isFinite), mean),
    bPerColony: perColB,
    pooledFits: fits,
    pooledPowerB: ci(fits.power.b, bootB),
    ameBetterShare: bootD.filter((d) => d > 4).length / bootD.length,
    dAIC: ci(fits.dAIC_powerMinusAme, bootD),
    siteRR_E2plus_vs_Elt1: bootIdx((S) => mh(eC, S)),
  };
  for (const [wn, wf] of [...WALLS.slice(1), ...ROLES]) {
    const p = leaveByA(COLS, false, wf);
    const sus = leaveByA(COLS, true, wf);
    s3b[wn] = { pL_perS_byA: p.ev.map((e, k) => e / p.sec[k]), sustained_perS_byA: sus.ev.map((e, k) => e / sus.sec[k]), b: bootIdx((S) => { const q = leaveByA(S, false, wf); return powerSlope(q.ev, q.sec); }) };
  }
  s3b.wallOverCentre = bootIdx((S) => mh(leaveCells(() => 0, (r, _w, ph, A, e, arr) => `${r}${ph}${A}${e}${arr}`).map((cs) => cs.map((x, k) => ({ ...x, g: Math.floor(k / (A_BINS * E_BINS * ARR_BINS * 2)) % 2 }))), S));
}

// ---------- 3b survival form ----------
const NE = SURV_EDGES.length;
const K0 = SURV_EDGES.indexOf(4); // left truncation at 4 frames = 2 s
function survHist(S: number[], abin: number): number[][] {
  const h = Array.from({ length: NE }, () => [0, 0]);
  for (const c of S) {
    const s = recs[c].surv;
    for (let base = 0; base < 8; base++) {
      const key = base * 5 + abin;
      for (let k = 0; k < NE; k++) {
        h[k][0] += s[(key * NE + k) * 2];
        h[k][1] += s[(key * NE + k) * 2 + 1];
      }
    }
  }
  return h;
}
function survNLL(Sf: (t: number) => number, h: number[][]): number {
  const S0 = Sf(SURV_EDGES[K0] * FRAME_DT);
  let s = 0;
  for (let k = K0; k < NE; k++) {
    const [cpl, cen] = h[k];
    if (!cpl && !cen) continue;
    const a = Sf(SURV_EDGES[k] * FRAME_DT) / S0;
    const b = k + 1 < NE ? Sf(SURV_EDGES[k + 1] * FRAME_DT) / S0 : 0;
    if (cpl) s -= cpl * Math.log(Math.max(a - b, 1e-300));
    if (cen) s -= cen * Math.log(Math.max(a, 1e-300));
  }
  return s;
}
async function survFits(h: number[][]) {
  const n = h.slice(K0).reduce((a, x) => a + x[0] + x[1], 0);
  if (n < 30) return null;
  const one = await nelderMead(([lt]) => survNLL((t) => Math.exp(-t / Math.exp(lt)), h), [Math.log(20)], 0.5, 300, 1e-10);
  const two = await nelderMead(([lp, l1, l2]) => {
    const p = 1 / (1 + Math.exp(-lp)), t1 = Math.exp(l1), t2 = t1 + Math.exp(l2);
    return survNLL((t) => p * Math.exp(-t / t1) + (1 - p) * Math.exp(-t / t2), h);
  }, [0.5, Math.log(5), Math.log(100)], 0.5, 2000, 1e-10);
  const p = 1 / (1 + Math.exp(-two.x[0])), t1 = Math.exp(two.x[1]), t2 = t1 + Math.exp(two.x[2]);
  const t0 = SURV_EDGES[K0] * FRAME_DT;
  const S0 = p * Math.exp(-t0 / t1) + (1 - p) * Math.exp(-t0 / t2);
  return { runs: n, tau1: Math.exp(one.x[0]), pShort: p, pShortGe2s: (p * Math.exp(-t0 / t1)) / S0, tShort: t1, tLong: t2, dAIC_oneMinusTwo: 2 * one.f + 2 - (2 * two.f + 6) };
}
const RUN_LABELS = ['A=1', 'A=2', 'A=3-4', 'A=5-8', 'A>=9'];
const s3bSurv: Record<string, unknown> = {};
{
  const pooled = await Promise.all(RUN_LABELS.map((_, a) => survFits(survHist(COLS, a))));
  const bt: ({ pShortGe2s: number; dAIC_oneMinusTwo: number; tShort: number; tLong: number } | null)[][] = [];
  for (const S of draws.slice(0, B)) bt.push(await Promise.all(RUN_LABELS.map((_, a) => survFits(survHist(S, a)))));
  RUN_LABELS.forEach((lab, a) => {
    const v = bt.map((b) => b[a]).filter((x): x is NonNullable<typeof x> => !!x);
    s3bSurv[lab] = pooled[a] && {
      ...pooled[a],
      mixtureWinsShare: v.filter((x) => x.dAIC_oneMinusTwo > 10).length / v.length,
      pShortGe2s: ci(pooled[a]!.pShortGe2s, v.map((x) => x.pShortGe2s)),
      tShortCI: ci(pooled[a]!.tShort, v.map((x) => x.tShort)),
      tLongCI: ci(pooled[a]!.tLong, v.map((x) => x.tLong)),
    };
  });
  const diff = bt.map((b) => (b[3] && b[0] ? b[3].pShortGe2s - b[0].pShortGe2s : NaN));
  s3bSurv.pShortGe2s_A5to8_minus_A1 = ci(pooled[3] && pooled[0] ? pooled[3].pShortGe2s - pooled[0].pShortGe2s : NaN, diff);
}

// ---------- 3c walk-on after a passing mover ----------
const s3c: Record<string, unknown> = {};
for (const sustained of [true, false]) {
  const res: Record<string, unknown> = {};
  for (const [wn, wf] of WALLS) {
    const cells = leaveCells((_A, _e, arr) => (arr <= 1 ? 1 : arr === 5 ? 0 : -1), (r, w, ph, A, e) => `${r}${w}${ph}${A}${e}`, sustained, wf);
    const byArr = Array.from({ length: ARR_BINS }, (_, k) => pooledRate(leaveCells((_A, _e, arr) => (arr === k ? 1 : -1), () => '', sustained, wf), COLS, 1));
    res[wn] = { rr_0to2s_vs_ge30s: bootIdx((S) => mh(cells, S)), hazardPerS_bySinceArrival: byArr };
  }
  // Excess departures within 5 s of an arrival, per arrival: Σ_strata (events − baseline hazard × seconds) over bins 0–5 s.
  const excess = (S: number[]) => {
    let ex = 0, arrivals = 0;
    for (const c of S) {
      const r = recs[c];
      arrivals += r.arrivals.reduce((a, b) => a + b, 0);
      for (let base = 0; base < 8; base++) for (let A = 1; A <= A_BINS; A++) for (let e = 0; e < E_BINS; e++) {
        const k0 = ((((base * A_BINS) + A - 1) * E_BINS + e) * ARR_BINS) * 4;
        const at = (arr: number, f: number) => r.leaveT[k0 + arr * 4 + f];
        const h0 = at(5, 2) ? at(5, sustained ? 3 : 1) / at(5, 2) : 0;
        for (let arr = 0; arr <= 2; arr++) ex += at(arr, sustained ? 3 : 1) - h0 * at(arr, 2);
      }
    }
    return ex / arrivals;
  };
  res.excessPerArrival_0to5s = bootIdx(excess);
  s3c[sustained ? 'sustained' : 'any'] = res;
}
s3c.unknownSustained = recs.reduce((a, r) => a + r.leaveUnknown, 0);

// ---------- 3d taxis ----------
// taxis[((key*4 + src)*4)] with key = (role*2 + wall)*E_BINS + e; src 0 own, 1 placebo, 2 neighbours, 3 lagged.
const tSum = (S: number[], src: number, sel: (role: number, wall: number, e: number) => boolean) => {
  const v = [0, 0, 0, 0];
  for (const c of S) for (let role = 0; role < 2; role++) for (let wall = 0; wall < 2; wall++) for (let e = 0; e < E_BINS; e++) {
    if (!sel(role, wall, e)) continue;
    const k = ((((role * 2 + wall) * E_BINS + e) * 4) + src) * 4;
    for (let m = 0; m < 4; m++) v[m] += recs[c].taxis[k + m];
  }
  return v;
};
const kappa = (v: number[]) => v[1] / v[2];
const s3d: Record<string, unknown> = {};
const TSEL: [string, (r: number, w: number, e: number) => boolean][] = [
  ['centre', (_r, w) => w === 0], ['wall', (_r, w) => w === 1], ['all', () => true],
  ...[0, 1, 2, 3, 4].map((eb) => [`centre.E${eb}`, (_r: number, w: number, e: number) => w === 0 && e === eb] as [string, (r: number, w: number, e: number) => boolean]),
  ['centre.nurse', (r, w) => w === 0 && r === 0], ['centre.forager', (r, w) => w === 0 && r === 1],
];
for (const [name, sel] of TSEL) {
  s3d[name] = {
    siteMinusPlacebo: bootIdx((S) => kappa(tSum(S, 0, sel)) - kappa(tSum(S, 1, sel))),
    neighbourMinusLagged: bootIdx((S) => kappa(tSum(S, 2, sel)) - kappa(tSum(S, 3, sel))),
    kappa: [0, 1, 2, 3].map((src) => kappa(tSum(COLS, src, sel))),
    meanCosBeta: [0, 1, 2, 3].map((src) => { const v = tSum(COLS, src, sel); return v[3] / v[0]; }),
    n: [0, 1, 2, 3].map((src) => tSum(COLS, src, sel)[0]),
  };
}

// ---------- 3e g(r) ----------
const gOf = (S: number[], walls: number[]) => {
  const now = new Array(G_N + 1).fill(0), lag = new Array(G_N + 1).fill(0);
  for (const c of S) for (const w of walls) for (let k = 0; k <= G_N; k++) { now[k] += recs[c].gNow[w][k]; lag[k] += recs[c].gLag[w][k]; }
  const tn = now.reduce((a, b) => a + b, 0), tl = lag.reduce((a, b) => a + b, 0);
  return now.slice(0, G_N).map((v, k) => (v / tn) / (lag[k] / tl));
};
const gSummary = (g: number[]) => {
  const k1 = Math.round(1 / G_BIN), k2 = Math.round(2 / G_BIN);
  const core = mean(g.slice(k1, k2));
  let kp = k1;
  for (let k = k1; k < g.length; k++) if (g[k] > g[kp]) kp = k;
  let kc = kp;
  while (kc < g.length && g[kc] >= 1.1) kc++;
  return { g1to2mm: core, rPeakMm: (kp + 0.5) * G_BIN, gPeak: g[kp], rBelow1_1Mm: kc * G_BIN };
};
const s3e: Record<string, unknown> = {};
for (const [name, walls] of [['all', [0, 1]], ['centre', [0]], ['wall', [1]]] as [string, number[]][]) {
  const g = gOf(COLS, walls);
  const bs = draws.map((S) => gSummary(gOf(S, walls)));
  const sm = gSummary(g);
  s3e[name] = {
    g1to2mm: ci(sm.g1to2mm, bs.map((x) => x.g1to2mm)), rPeakMm: ci(sm.rPeakMm, bs.map((x) => x.rPeakMm)),
    gPeak: ci(sm.gPeak, bs.map((x) => x.gPeak)), rBelow1_1Mm: ci(sm.rBelow1_1Mm, bs.map((x) => x.rBelow1_1Mm)),
    g: g.map((v) => +v.toFixed(4)),
  };
}

// ---------- 5 zones ----------
const spearman = (a: number[], b: number[]) => {
  const rank = (v: number[]) => { const o = v.map((x, i) => [x, i]).sort((p, q) => p[0] - q[0]); const r = new Array(v.length); o.forEach(([, i], k) => (r[i] = k)); return r as number[]; };
  const ra = rank(a), rb = rank(b), ma = mean(ra), mb = mean(rb);
  let s = 0, sa = 0, sb = 0;
  for (let k = 0; k < a.length; k++) { s += (ra[k] - ma) * (rb[k] - mb); sa += (ra[k] - ma) ** 2; sb += (rb[k] - mb) ** 2; }
  return s / Math.sqrt(sa * sb);
};
const zonePer = recs.map((r) => {
  const sc = site.colonies.find((s) => s.colony === r.colony)!;
  const Cn = sc.posthoc.centroid24, Q = sc.queen;
  const z = r.zones.filter((x): x is Zone => !!x).map((x) => ({ ...x, dC: Math.hypot(x.cx - Cn[0], x.cy - Cn[1]), dQ: Math.hypot(x.cx - Q[0], x.cy - Q[1]) }));
  const by = (role: number) => z.filter((x) => x.role === role);
  const med = (v: number[]) => (v.length ? median(v) : NaN);
  return {
    colony: r.colony,
    ants: { nurse: by(0).length, forager: by(1).length },
    rg: { nurse: med(by(0).map((x) => x.rg)), forager: med(by(1).map((x) => x.rg)) },
    a90: { nurse: med(by(0).map((x) => x.a90)), forager: med(by(1).map((x) => x.a90)) },
    dCentre: { nurse: med(by(0).map((x) => x.dC)), forager: med(by(1).map((x) => x.dC)) },
    dQueen: { nurse: med(by(0).map((x) => x.dQ)), forager: med(by(1).map((x) => x.dQ)) },
    rhoRgDist: z.length >= 8 ? spearman(z.map((x) => x.rg), z.map((x) => x.dC)) : NaN,
    rhoRgDistNurses: by(0).length >= 8 ? spearman(by(0).map((x) => x.rg), by(0).map((x) => x.dC)) : NaN,
  };
});
const fin = (v: number[]) => v.filter(Number.isFinite);
const s5 = {
  rhoRgDistanceToCentre: boot(fin(zonePer.map((z) => z.rhoRgDist)), mean),
  rhoRgDistanceNursesOnly: boot(fin(zonePer.map((z) => z.rhoRgDistNurses)), mean),
  nurseMinusForager: {
    dCentreMm: boot(fin(zonePer.map((z) => z.dCentre.nurse - z.dCentre.forager)), mean),
    dQueenMm: boot(fin(zonePer.map((z) => z.dQueen.nurse - z.dQueen.forager)), mean),
    rgMm: boot(fin(zonePer.map((z) => z.rg.nurse - z.rg.forager)), mean),
    a90Mm2: boot(fin(zonePer.map((z) => z.a90.nurse - z.a90.forager)), mean),
  },
  medians: {
    rg: { nurse: median(fin(zonePer.map((z) => z.rg.nurse))), forager: median(fin(zonePer.map((z) => z.rg.forager))) },
    a90: { nurse: median(fin(zonePer.map((z) => z.a90.nurse))), forager: median(fin(zonePer.map((z) => z.a90.forager))) },
    dCentre: { nurse: median(fin(zonePer.map((z) => z.dCentre.nurse))), forager: median(fin(zonePer.map((z) => z.dCentre.forager))) },
  },
};

// ---------- 6 co-movement ----------
const ZN = ['core', 'entrance', 'periphery', 'mid', 'mixed'];
const comove = recs.map((r) => {
  const { grid, W } = r.e24;
  const blockOrigin = 2 * 3600;
  const block = (k: number) => Math.floor(((r.bins.b0 + k) * 60 - blockOrigin) / (4 * 3600));
  const ants = r.bins.ants;
  const dev = ants.map((a) => {
    const sum = new Map<number, [number, number]>();
    for (let k = 0; k < a.st.length; k++) if (a.st[k] > 0) { const s = sum.get(block(k)) ?? [0, 0]; s[0] += a.mv[k] / a.st[k]; s[1]++; sum.set(block(k), s); }
    return a.st.map((st, k) => (st > 0 ? a.mv[k] / st - sum.get(block(k))![0] / sum.get(block(k))![1] : NaN));
  });
  const acc = ZN.map(() => [0, 1].map(() => [0, 0, 0, 0]));
  const len = Math.max(...ants.map((a) => a.np.length));
  const zoneSeries = [0, 1, 2].map(() => new Array(len).fill(NaN)); // core, entrance, periphery: mean deviation
  for (let k = 0; k < len; k++) {
    const live: { i: number; x: number; y: number; z: number }[] = [];
    for (let i = 0; i < ants.length; i++) {
      const a = ants[i];
      if (k >= dev[i].length || !Number.isFinite(dev[i][k]) || !a.np[k]) continue;
      const x = a.sx[k] / a.np[k], y = a.sy[k] / a.np[k];
      const e = grid[Math.max(0, Math.min(r.e24.H - 1, Math.floor(y))) * W + Math.max(0, Math.min(W - 1, Math.floor(x)))];
      const z = Math.hypot(x - ENTRANCE.x, y - ENTRANCE.y) <= 10 ? 1 : e >= 2 ? 0 : e < 0.5 ? 2 : 3;
      live.push({ i, x, y, z });
    }
    for (const zz of [0, 1, 2]) { const v = live.filter((l) => l.z === zz).map((l) => dev[l.i][k]); if (v.length) zoneSeries[zz][k] = mean(v); }
    for (let p = 0; p < live.length; p++) for (let q = p + 1; q < live.length; q++) {
      const A = live[p], Bq = live[q];
      const d = Math.hypot(A.x - Bq.x, A.y - Bq.y);
      const dc = d < 10 ? 0 : d < 20 ? 1 : -1;
      if (dc < 0) continue;
      const s = acc[A.z === Bq.z ? A.z : 4][dc];
      const x = dev[A.i][k], y = dev[Bq.i][k];
      s[0] += x * y; s[1] += x * x; s[2] += y * y; s[3]++;
    }
  }
  const lagCorr = (a: number[], b: number[], L: number) => {
    const xs: number[] = [], ys: number[] = [];
    for (let k = 0; k < a.length; k++) { const j = k + L; if (j >= 0 && j < b.length && Number.isFinite(a[k]) && Number.isFinite(b[j])) { xs.push(a[k]); ys.push(b[j]); } }
    if (xs.length < 30) return NaN;
    const mx = mean(xs), my = mean(ys);
    let s = 0, sx = 0, sy = 0;
    for (let k = 0; k < xs.length; k++) { s += (xs[k] - mx) * (ys[k] - my); sx += (xs[k] - mx) ** 2; sy += (ys[k] - my) ** 2; }
    return s / Math.sqrt(sx * sy);
  };
  const LAGS = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
  return {
    colony: r.colony,
    C: Object.fromEntries(ZN.map((z, m) => [z, acc[m].map((s) => (s[3] ? s[0] / Math.sqrt(s[1] * s[2]) : NaN))])),
    pairBins: Object.fromEntries(ZN.map((z, m) => [z, acc[m].map((s) => s[3])])),
    // corr(core(t), periphery(t + L)): a peak at L > 0 means the core leads.
    corePeriphery: LAGS.map((L) => lagCorr(zoneSeries[0], zoneSeries[2], L)),
    coreEntrance: LAGS.map((L) => lagCorr(zoneSeries[0], zoneSeries[1], L)),
  };
});
const cv = (z: string, dc: number) => comove.map((c) => (c.C as Record<string, number[]>)[z][dc]);
const diffCol = (a: number[], b: number[]) => fin(a.map((x, k) => x - b[k]));
const s6 = {
  C_lt10: Object.fromEntries(ZN.map((z) => [z, { meanOverColonies: mean(fin(cv(z, 0))), colonies: fin(cv(z, 0)).length }])),
  C_10to20: Object.fromEntries(ZN.map((z) => [z, { meanOverColonies: mean(fin(cv(z, 1))), colonies: fin(cv(z, 1)).length }])),
  coreMinusPeriphery_lt10: boot(diffCol(cv('core', 0), cv('periphery', 0)), mean),
  entranceMinusPeriphery_lt10: boot(diffCol(cv('entrance', 0), cv('periphery', 0)), mean),
  coreMinusPeriphery_10to20: boot(diffCol(cv('core', 1), cv('periphery', 1)), mean),
  lagsMin: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
  corePeripheryLagCorr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((m) => mean(fin(comove.map((c) => c.corePeriphery[m])))),
  coreEntranceLagCorr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((m) => mean(fin(comove.map((c) => c.coreEntrance[m])))),
  coreLeadsPeriphery_lag1MinusLagMinus1: boot(fin(comove.map((c) => c.corePeriphery[6] - c.corePeriphery[4])), mean),
};

const summary = { stop3a: s3a, leave3b: s3b, survival3b: s3bSurv, walkOn3c: s3c, taxis3d: s3d, gr3e: s3e, zones5: s5, comove6: s6 };
writeJson(`${ITEM}/results/rules.json`, {
  provenance: stamp(ITEM),
  definitions: 'B018 Progress log, readings for families 3–6; dims in out/rules-c*.json',
  colonies: recs.map((r) => r.colony),
  summary,
  perColony: { zones: zonePer, comove },
});
console.log(JSON.stringify(summary, (k, v) => (k === 'g' ? undefined : typeof v === 'number' ? +v.toPrecision(4) : v), 1));
