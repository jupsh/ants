/**
 * B018 pass B (families 3–6), one colony per call, two sweeps of its PreTreatment tracks; readings in the Progress log.
 * Sweep 1: per-ant still maps by phase (for the site field E), per-ant in-nest position sums and 2-mm cells (zones),
 * per-ant 1-min activity bins (co-movement, Y's recorder definitions). Sweep 2: stop and leaving tables, still-run
 * survival histograms, mover arrivals, taxis turning sums, g(r) now vs 1 h apart.
 * Step = consecutive in-nest detections ≤ 3 frames apart; still = < 0.6 mm per frame; neighbours = still workers (and
 * the queen when still) within 4.1 mm. Site field for ant i in phase p: still occupancy of phase 1 − p without ant i,
 * 5 × 5-mm box sum on the 1-mm grid, over its mean on the nest rectangle.
 *   nice -n 19 npx vite-node backlog/B018-resting-site-and-aggregation-in-the/rules.ts --colony i   → out/rules-c<i>.json
 */
import fs from 'node:fs';
import { numArg, readJson, writeJson } from '../../scripts/lib';
import { BRIDGE, colony, FRAME_DT, ITEM, isLight, NEST, QUEEN, STILL_MM, stream, WALL_MM, wallDist } from './lib';

const W = 72, H = 48, G = W * H;
const R_IN = 4.1, R_OUT = 5.1, R_NB = 8; // contact radii; T's neighbour radius
const LAG = 7200; // frames (1 h)
const SNAP = 20; // frames between snapshots of still positions (10 s)
const ANCHOR_MM = 1.5;
const NONE = 0, STILL = 1, MOVE = 2;
const N_BINS = 7; // N still neighbours 0…5, 6+
const A_BINS = 9; // A = 1 + N: 1…8, 9+
const E_EDGES = [0.5, 1, 2, 4];
const E_BINS = 5;
const ARR_BINS = 6; // s since a mover arrived: 0–1, 1–2, 2–5, 5–10, 10–30, ≥ 30 or none
const RUN_A = (A: number) => (A === 1 ? 0 : A === 2 ? 1 : A <= 4 ? 2 : A <= 8 ? 3 : 4);
const SURV_EDGES = [...new Set(Array.from({ length: 73 }, (_, k) => Math.round(2 ** (k / 4))))]; // frames
const G_BIN = 0.25, G_N = 120;

const ci = numArg('--colony', 0);
const c = colony(ci);
const n = c.role.length;
const cellOf = (x: number, y: number) => Math.max(0, Math.min(H - 1, Math.floor(y))) * W + Math.max(0, Math.min(W - 1, Math.floor(x)));
const eBin = (e: number) => { let k = 0; while (k < E_EDGES.length && e >= E_EDGES[k]) k++; return k; };
const wallOf = (x: number, y: number) => (wallDist(x, y) < WALL_MM ? 1 : 0);
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

function smooth(g: ArrayLike<number>): Float64Array {
  const out = new Float64Array(G);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      let s = 0;
      for (let dy = -2; dy <= 2; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= H) continue;
        for (let dx = -2; dx <= 2; dx++) {
          const xx = x + dx;
          if (xx >= 0 && xx < W) s += g[yy * W + xx];
        }
      }
      out[y * W + x] = s;
    }
  return out;
}
const rectCells: number[] = [];
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (x + 0.5 > NEST.x0 && x + 0.5 < NEST.x1 && y + 0.5 > NEST.y0 && y + 0.5 < NEST.y1) rectCells.push(y * W + x);
const rectMean = (g: ArrayLike<number>) => rectCells.reduce((a, q) => a + g[q], 0) / rectCells.length;

// ---------- sweep 1 ----------
const antMap = [new Float32Array(n * G), new Float32Array(n * G)];
const pos = Array.from({ length: n }, () => ({ k: 0, sx: 0, sy: 0, sxx: 0, syy: 0, cells: new Map<number, number>() }));
const bins = Array.from({ length: n }, () => ({ mv: [] as number[], st: [] as number[], sx: [] as number[], sy: [] as number[], np: [] as number[] }));
let b0 = -1;
{
  const lastF = new Int32Array(n).fill(-1e9);
  const lastX = new Float64Array(n);
  const lastY = new Float64Array(n);
  await stream(c, (f, t, ids, xs, ys, ins) => {
    const p = isLight(t) ? 0 : 1;
    const b = Math.floor(t / 60);
    if (b0 < 0) b0 = b;
    const k = b - b0;
    for (let j = 0; j < ids.length; j++) {
      const i = ids[j];
      if (c.role[i] === QUEEN) continue;
      if (ins[j]) {
        const P = pos[i];
        P.k++; P.sx += xs[j]; P.sy += ys[j]; P.sxx += xs[j] ** 2; P.syy += ys[j] ** 2;
        const q2 = Math.floor(ys[j] / 2) * 64 + Math.floor(xs[j] / 2);
        P.cells.set(q2, (P.cells.get(q2) ?? 0) + 1);
        const a = bins[i];
        while (a.np.length <= k) { a.mv.push(0); a.st.push(0); a.sx.push(0); a.sy.push(0); a.np.push(0); }
        a.sx[k] += xs[j]; a.sy[k] += ys[j]; a.np[k]++;
        const g = f - lastF[i];
        if (g <= BRIDGE) {
          const d = Math.hypot(xs[j] - lastX[i], ys[j] - lastY[i]) / g;
          a.st[k]++;
          if (d >= STILL_MM) a.mv[k]++;
          else antMap[p][i * G + cellOf(xs[j], ys[j])]++;
        }
      }
      lastF[i] = ins[j] ? f : -1e9;
      lastX[i] = xs[j];
      lastY[i] = ys[j];
    }
  });
}
const totSm = [0, 1].map((p) => {
  const s = new Float64Array(G);
  for (let i = 0; i < n; i++) for (let q = 0; q < G; q++) s[q] += antMap[p][i * G + q];
  return smooth(s);
});
const antSm = [0, 1].map((p) => Array.from({ length: n }, (_, i) => smooth(antMap[p].subarray(i * G, (i + 1) * G))));
const totMean = totSm.map(rectMean);
const antMean = antSm.map((v) => v.map(rectMean));
/** Field of ant i in phase p at cell q (other phase, without ant i), and its uphill angle. */
const fieldE = (i: number, p: number, q: number) => (totSm[1 - p][q] - antSm[1 - p][i][q]) / (totMean[1 - p] - antMean[1 - p][i]);
function uphill(F: (q: number) => number, x: number, y: number): number {
  const cx = Math.max(2, Math.min(W - 3, Math.floor(x)));
  const cy = Math.max(2, Math.min(H - 3, Math.floor(y)));
  const gx = F(cy * W + cx + 2) - F(cy * W + cx - 2);
  const gy = F((cy + 2) * W + cx) - F((cy - 2) * W + cx);
  return gx === 0 && gy === 0 ? NaN : Math.atan2(gy, gx);
}
const all24 = new Float64Array(G);
for (const p of [0, 1]) for (let i = 0; i < n; i++) for (let q = 0; q < G; q++) all24[q] += antMap[p][i * G + q];
const E24sm = smooth(all24);
const E24mean = rectMean(E24sm);
// Placebo fields: the other colonies' 24-h still maps (pass A), smoothed.
const placebo: Float64Array[] = [];
for (const f of fs.readdirSync(`${ITEM}/out`).filter((f) => /^site-c\d+\.json$/.test(f))) {
  if (f === `site-c${ci}.json`) continue;
  placebo.push(smooth(readJson<{ all: number[] }>(`${ITEM}/out/${f}`).all));
}

// ---------- sweep 2 ----------
// Tables: index = ((((role * 2 + wall) * 2 + phase) * X + a) * E_BINS + e) [* ARR_BINS + arr]; each cell [exposures, events, seconds].
const stopT = new Float64Array(2 * 2 * 2 * N_BINS * E_BINS * 3);
const leaveT = new Float64Array(2 * 2 * 2 * A_BINS * E_BINS * ARR_BINS * 4); // + sustained events
let leaveUnknown = 0; // departures followed by a break (sustained undetermined; counted as not sustained)
const surv = new Float64Array(2 * 2 * 2 * 5 * SURV_EDGES.length * 2); // [complete, censored]
const survIdx = (key: number, len: number) => { let k = 0; while (k + 1 < SURV_EDGES.length && SURV_EDGES[k + 1] <= len) k++; return (key * SURV_EDGES.length + k) * 2; };
const arrivals = new Float64Array(2 * 2 * 2); // mover arrivals at still workers, by role, wall, phase
// Taxis sums per (role, wall, eBin) × source (own, placebo, nb, lag): [n, ΣΔ sinβ, Σ sin²β, Σ cosβ].
const taxis = new Float64Array(2 * 2 * E_BINS * 4 * 4);
const gNow = [new Float64Array(G_N + 1), new Float64Array(G_N + 1)]; // last = beyond 30 mm
const gLag = [new Float64Array(G_N + 1), new Float64Array(G_N + 1)];

const lastF = new Int32Array(n).fill(-1e9);
const lastX = new Float64Array(n);
const lastY = new Float64Array(n);
const lastIn = new Uint8Array(n);
const prevState = new Uint8Array(n);
const prevStop = new Int32Array(n).fill(-1);
const prevLeave = new Int32Array(n).fill(-1);
const pendSust = new Int32Array(n).fill(-1);
const runOn = new Uint8Array(n);
const runLen = new Int32Array(n);
const runKey = new Int32Array(n);
const lastArr = new Int32Array(n).fill(-1e9);
const pairState = new Uint8Array(n * n); // 0 unknown, 1 far, 2 near
const pairLast = new Int32Array(n * n).fill(-1e9);
// Taxis chain per ant.
const chOn = new Uint8Array(n);
const chX = new Float64Array(n), chY = new Float64Array(n);
const chPhi = new Float64Array(n).fill(NaN);
const chT = Array.from({ length: n }, () => ({ own: NaN, plc: [] as number[], nb: NaN, lag: NaN, key: 0 }));
// Snapshots of still positions (workers and queen), every SNAP frames.
const snaps = new Map<number, { ids: number[]; xs: number[]; ys: number[] }>();
let lastSnapBlock = -1;

const D: { i: number; x: number; y: number; s: number; g: number; nb: number; vx: number; vy: number }[] = [];
await stream(c, (f, t, ids, xs, ys, ins) => {
  const p = isLight(t) ? 0 : 1;
  D.length = 0;
  for (let j = 0; j < ids.length; j++) {
    const i = ids[j];
    const g = f - lastF[i];
    const cont = ins[j] && lastIn[i] && g <= BRIDGE;
    const s = cont ? (Math.hypot(xs[j] - lastX[i], ys[j] - lastY[i]) / g < STILL_MM ? STILL : MOVE) : NONE;
    if (ins[j]) D.push({ i, x: xs[j], y: ys[j], s, g, nb: 0, vx: 0, vy: 0 });
    else breakAnt(i);
  }
  // Pairs: neighbour counts, neighbour vectors, mover arrivals, g(r) now.
  for (let a = 0; a < D.length; a++) {
    const A = D[a];
    for (let b = a + 1; b < D.length; b++) {
      const B = D[b];
      const dx = B.x - A.x, dy = B.y - A.y;
      const qa = c.role[A.i] === QUEEN, qb = c.role[B.i] === QUEEN;
      if (!qa && !qb) {
        const [i, j] = A.i < B.i ? [A.i, B.i] : [B.i, A.i];
        const pq = i * n + j;
        if (f - pairLast[pq] > BRIDGE) pairState[pq] = 0;
        pairLast[pq] = f;
        if (Math.abs(dx) > R_OUT || Math.abs(dy) > R_OUT) pairState[pq] = 1;
        else {
          const d = Math.hypot(dx, dy);
          if (d < R_IN) {
            if (pairState[pq] === 1) {
              if (B.s === MOVE) lastArr[A.i] = f;
              if (A.s === MOVE) lastArr[B.i] = f;
            }
            pairState[pq] = 2;
          } else if (d > R_OUT || pairState[pq] === 0) pairState[pq] = 1;
        }
        if (A.s === STILL && B.s === STILL && Math.abs(dx) < 30 && Math.abs(dy) < 30) {
          const d = Math.hypot(dx, dy);
          const k = d < 30 ? Math.floor(d / G_BIN) : G_N;
          gNow[wallOf(A.x, A.y)][k]++;
          gNow[wallOf(B.x, B.y)][k]++;
        } else if (A.s === STILL && B.s === STILL) {
          gNow[wallOf(A.x, A.y)][G_N]++;
          gNow[wallOf(B.x, B.y)][G_N]++;
        }
      }
      if (Math.abs(dx) > R_NB || Math.abs(dy) > R_NB) continue;
      const d = Math.hypot(dx, dy);
      if (d < R_IN) {
        if (B.s === STILL) A.nb++;
        if (A.s === STILL) B.nb++;
      }
      if (d < R_NB && d > 0) {
        if (B.s === STILL) { A.vx += dx / d; A.vy += dy / d; }
        if (A.s === STILL) { B.vx -= dx / d; B.vy -= dy / d; }
      }
    }
  }
  // Snapshot and lagged g(r).
  const blk = Math.floor(f / SNAP);
  const snapNow = blk !== lastSnapBlock;
  if (snapNow) {
    lastSnapBlock = blk;
    const S = { ids: [] as number[], xs: [] as number[], ys: [] as number[] };
    for (const d of D) if (d.s === STILL) { S.ids.push(d.i); S.xs.push(d.x); S.ys.push(d.y); }
    snaps.set(blk, S);
    snaps.delete(blk - LAG / SNAP - 2);
  }
  const lagSnap = snaps.get(Math.floor((f - LAG) / SNAP));
  if (snapNow && lagSnap) {
    for (const d of D) {
      if (d.s !== STILL || c.role[d.i] === QUEEN) continue;
      const w = wallOf(d.x, d.y);
      for (let k = 0; k < lagSnap.ids.length; k++) {
        if (lagSnap.ids[k] === d.i || c.role[lagSnap.ids[k]] === QUEEN) continue;
        const r = Math.hypot(lagSnap.xs[k] - d.x, lagSnap.ys[k] - d.y);
        gLag[w][r < 30 ? Math.floor(r / G_BIN) : G_N]++;
      }
    }
  }
  // Per worker: transitions, runs, taxis.
  for (const d of D) {
    const i = d.i;
    if (c.role[i] !== QUEEN) {
      if (d.s === NONE) breakAnt(i);
      else step(i, d, p, f, lagSnap);
    }
    lastF[i] = f;
    lastX[i] = d.x;
    lastY[i] = d.y;
    lastIn[i] = 1;
  }
  for (let j = 0; j < ids.length; j++) if (!ins[j]) { lastF[ids[j]] = f; lastIn[ids[j]] = 0; }
});
for (let i = 0; i < n; i++) breakAnt(i);

function breakAnt(i: number): void {
  if (pendSust[i] >= 0) leaveUnknown++;
  pendSust[i] = -1;
  if (runOn[i]) surv[survIdx(runKey[i], runLen[i]) + 1]++;
  runOn[i] = 0;
  prevState[i] = NONE;
  prevStop[i] = prevLeave[i] = -1;
  chOn[i] = 0;
  chPhi[i] = NaN;
}

function step(i: number, d: (typeof D)[number], p: number, f: number, lagSnap: { ids: number[]; xs: number[]; ys: number[] } | undefined): void {
  const role = c.role[i];
  const wall = wallOf(d.x, d.y);
  const q = cellOf(d.x, d.y);
  const e = eBin(fieldE(i, p, q));
  const dt = d.g * FRAME_DT;
  const base = (role * 2 + wall) * 2 + p;
  // Resolve the previous step's record.
  if (pendSust[i] >= 0) {
    if (d.s === MOVE) leaveT[pendSust[i] * 4 + 3]++;
    pendSust[i] = -1;
  }
  if (prevState[i] === MOVE && prevStop[i] >= 0) {
    const k = prevStop[i] * 3;
    stopT[k]++;
    stopT[k + 2] += dt;
    if (d.s === STILL) stopT[k + 1]++;
  } else if (prevState[i] === STILL && prevLeave[i] >= 0) {
    const k = prevLeave[i] * 4;
    leaveT[k]++;
    leaveT[k + 2] += dt;
    if (d.s === MOVE) { leaveT[k + 1]++; pendSust[i] = prevLeave[i]; }
  }
  // Still runs (bounded: begun at a moving → still change).
  const A = 1 + d.nb;
  if (d.s === STILL) {
    if (runOn[i]) runLen[i] += d.g;
    else if (prevState[i] === MOVE) {
      runOn[i] = 1;
      runLen[i] = d.g;
      runKey[i] = base * 5 + RUN_A(A);
    }
  } else if (runOn[i]) {
    surv[survIdx(runKey[i], runLen[i])]++;
    runOn[i] = 0;
  }
  // This step's record.
  prevState[i] = d.s;
  prevStop[i] = d.s === MOVE ? (base * N_BINS + Math.min(d.nb, N_BINS - 1)) * E_BINS + e : -1;
  if (d.s === STILL) {
    const since = (f - lastArr[i]) * FRAME_DT;
    const arr = since < 1 ? 0 : since < 2 ? 1 : since < 5 ? 2 : since < 10 ? 3 : since < 30 ? 4 : 5;
    if (lastArr[i] === f) arrivals[base]++;
    prevLeave[i] = ((base * A_BINS + Math.min(A, A_BINS) - 1) * E_BINS + e) * ARR_BINS + arr;
  } else prevLeave[i] = -1;
  // Taxis chain.
  if (d.s !== MOVE) {
    chOn[i] = 0;
    chPhi[i] = NaN;
    return;
  }
  if (!chOn[i]) {
    chOn[i] = 1;
    chX[i] = lastX[i];
    chY[i] = lastY[i];
    chPhi[i] = NaN;
  }
  if (Math.hypot(d.x - chX[i], d.y - chY[i]) < ANCHOR_MM) return;
  const phi = Math.atan2(d.y - chY[i], d.x - chX[i]);
  if (Number.isFinite(chPhi[i])) {
    const turn = wrap(phi - chPhi[i]);
    const T = chT[i];
    const add = (src: number, target: number, wgt = 1) => {
      if (!Number.isFinite(target)) return;
      const beta = wrap(target - chPhi[i]);
      const k = (T.key * 4 + src) * 4;
      taxis[k] += wgt;
      taxis[k + 1] += wgt * turn * Math.sin(beta);
      taxis[k + 2] += wgt * Math.sin(beta) ** 2;
      taxis[k + 3] += wgt * Math.cos(beta);
    };
    add(0, T.own);
    for (const a of T.plc) add(1, a, 1 / T.plc.length);
    add(2, T.nb);
    add(3, T.lag);
  }
  // New anchor: targets seen here, used with the heading that arrived here.
  chX[i] = d.x;
  chY[i] = d.y;
  chPhi[i] = phi;
  const T = chT[i];
  T.key = (role * 2 + wall) * E_BINS + e;
  T.own = uphill((qq) => totSm[1 - p][qq] - antSm[1 - p][i][qq], d.x, d.y);
  T.plc = placebo.map((F) => uphill((qq) => F[qq], d.x, d.y));
  T.nb = Math.hypot(d.vx, d.vy) >= 0.5 ? Math.atan2(d.vy, d.vx) : NaN;
  T.lag = NaN;
  if (lagSnap) {
    let vx = 0, vy = 0;
    for (let k = 0; k < lagSnap.ids.length; k++) {
      if (lagSnap.ids[k] === i) continue;
      const dx = lagSnap.xs[k] - d.x, dy = lagSnap.ys[k] - d.y;
      const r = Math.hypot(dx, dy);
      if (r < R_NB && r > 0) { vx += dx / r; vy += dy / r; }
    }
    if (Math.hypot(vx, vy) >= 0.5) T.lag = Math.atan2(vy, vx);
  }
}

// ---------- output ----------
const zones = pos.map((P, i) => {
  if (c.role[i] === QUEEN || P.k < 7200) return null;
  const mx = P.sx / P.k, my = P.sy / P.k;
  const vals = [...P.cells.values()].sort((a, b) => b - a);
  let acc = 0, a90 = 0;
  for (const v of vals) { acc += v; a90++; if (acc >= 0.9 * P.k) break; }
  return { role: c.role[i], k: P.k, cx: mx, cy: my, rg: Math.sqrt(P.sxx / P.k - mx * mx + P.syy / P.k - my * my), a90: a90 * 4, e24: E24sm[cellOf(mx, my)] / E24mean };
});
writeJson(`${ITEM}/out/rules-c${ci}.json`, {
  colony: c.info.label,
  dims: { N_BINS, A_BINS, E_EDGES, E_BINS, ARR_BINS, SURV_EDGES, G_BIN, G_N, order: 'role(nurse, forager) × wall(centre, band) × phase(light, dark) × …' },
  stopT: [...stopT], leaveT: [...leaveT], leaveUnknown, surv: [...surv], arrivals: [...arrivals], taxis: [...taxis],
  gNow: gNow.map((v) => [...v]), gLag: gLag.map((v) => [...v]),
  zones,
  e24: { grid: [...E24sm].map((v) => +(v / E24mean).toFixed(3)), W, H },
  bins: { b0, ants: bins.map((a, i) => ({ role: c.role[i], ...a, sx: a.sx.map((v) => Math.round(v * 10) / 10), sy: a.sy.map((v) => Math.round(v * 10) / 10) })).filter((a) => a.role !== QUEEN && a.np.length) },
});
console.log(`${c.info.label} done`);
