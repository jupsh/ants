/**
 * B018 post hoc check of 3c (Progress log): sustained departures of still workers in bounded still runs by time since a
 * moving worker last crossed into 4.1 mm (out 5.1) × run age × A × role × wall × phase. Definitions as rules.ts.
 *   nice -n 19 npx vite-node backlog/B018-resting-site-and-aggregation-in-the/walkon.ts --colony i   → out/walkon-c<i>.json
 */
import { numArg, writeJson } from '../../scripts/lib';
import { BRIDGE, colony, FRAME_DT, ITEM, isLight, QUEEN, STILL_MM, stream, WALL_MM, wallDist } from './lib';

const R_IN = 4.1, R_OUT = 5.1;
const NONE = 0, STILL = 1, MOVE = 2;
const A_BINS = 9, ARR_BINS = 6, AGE_BINS = 5;
const ageBin = (s: number) => (s < 2 ? 0 : s < 5 ? 1 : s < 15 ? 2 : s < 60 ? 3 : 4);
const arrBin = (s: number) => (s < 1 ? 0 : s < 2 ? 1 : s < 5 ? 2 : s < 10 ? 3 : s < 30 ? 4 : 5);
const ci = numArg('--colony', 0);
const c = colony(ci);
const n = c.role.length;
// index: (((((role*2+wall)*2+phase)*AGE_BINS + age)*A_BINS + A-1)*ARR_BINS + arr)*3 → [seconds, sustained, any]
const T = new Float64Array(8 * AGE_BINS * A_BINS * ARR_BINS * 3);
let arrivals = 0;
const lastF = new Int32Array(n).fill(-1e9), lastX = new Float64Array(n), lastY = new Float64Array(n), lastIn = new Uint8Array(n);
const prevState = new Uint8Array(n), prevKey = new Int32Array(n).fill(-1), pend = new Int32Array(n).fill(-1);
const runOn = new Uint8Array(n), runLen = new Int32Array(n);
const lastArr = new Int32Array(n).fill(-1e9);
const pairState = new Uint8Array(n * n), pairLast = new Int32Array(n * n).fill(-1e9);
const reset = (i: number) => { pend[i] = -1; runOn[i] = 0; prevState[i] = NONE; prevKey[i] = -1; };
const D: { i: number; x: number; y: number; s: number; g: number; nb: number }[] = [];
await stream(c, (f, t, ids, xs, ys, ins) => {
  const p = isLight(t) ? 0 : 1;
  D.length = 0;
  for (let j = 0; j < ids.length; j++) {
    const i = ids[j];
    const g = f - lastF[i];
    const cont = ins[j] && lastIn[i] && g <= BRIDGE;
    const s = cont ? (Math.hypot(xs[j] - lastX[i], ys[j] - lastY[i]) / g < STILL_MM ? STILL : MOVE) : NONE;
    if (ins[j]) D.push({ i, x: xs[j], y: ys[j], s, g, nb: 0 });
    else reset(i);
  }
  for (let a = 0; a < D.length; a++)
    for (let b = a + 1; b < D.length; b++) {
      const A = D[a], B = D[b];
      const dx = B.x - A.x, dy = B.y - A.y;
      if (Math.abs(dx) > R_OUT || Math.abs(dy) > R_OUT) {
        if (c.role[A.i] !== QUEEN && c.role[B.i] !== QUEEN) {
          const pq = Math.min(A.i, B.i) * n + Math.max(A.i, B.i);
          pairLast[pq] = f;
          pairState[pq] = 1;
        }
        continue;
      }
      const d = Math.hypot(dx, dy);
      if (d < R_IN) { if (B.s === STILL) A.nb++; if (A.s === STILL) B.nb++; }
      if (c.role[A.i] === QUEEN || c.role[B.i] === QUEEN) continue;
      const pq = Math.min(A.i, B.i) * n + Math.max(A.i, B.i);
      if (f - pairLast[pq] > BRIDGE) pairState[pq] = 0;
      pairLast[pq] = f;
      if (d < R_IN) {
        if (pairState[pq] === 1) { if (B.s === MOVE) lastArr[A.i] = f; if (A.s === MOVE) lastArr[B.i] = f; }
        pairState[pq] = 2;
      } else if (d > R_OUT || pairState[pq] === 0) pairState[pq] = 1;
    }
  for (const d of D) {
    const i = d.i;
    if (c.role[i] !== QUEEN) {
      if (d.s === NONE) reset(i);
      else {
        if (pend[i] >= 0) { if (d.s === MOVE) T[pend[i] * 3 + 1]++; pend[i] = -1; }
        if (prevState[i] === STILL && prevKey[i] >= 0) {
          T[prevKey[i] * 3] += d.g * FRAME_DT;
          if (d.s === MOVE) { T[prevKey[i] * 3 + 2]++; pend[i] = prevKey[i]; }
        }
        if (d.s === STILL) {
          if (runOn[i]) runLen[i] += d.g;
          else if (prevState[i] === MOVE) { runOn[i] = 1; runLen[i] = d.g; }
        } else runOn[i] = 0;
        prevState[i] = d.s;
        prevKey[i] = -1;
        if (d.s === STILL && runOn[i]) {
          const wall = wallDist(d.x, d.y) < WALL_MM ? 1 : 0;
          if (lastArr[i] === f) arrivals++;
          prevKey[i] = (((((c.role[i] * 2 + wall) * 2 + p) * AGE_BINS + ageBin(runLen[i] * FRAME_DT)) * A_BINS + Math.min(1 + d.nb, A_BINS) - 1) * ARR_BINS) + arrBin((f - lastArr[i]) * FRAME_DT);
        }
      }
    }
    lastF[i] = f; lastX[i] = d.x; lastY[i] = d.y; lastIn[i] = 1;
  }
  for (let j = 0; j < ids.length; j++) if (!ins[j]) { lastF[ids[j]] = f; lastIn[ids[j]] = 0; }
});
writeJson(`${ITEM}/out/walkon-c${ci}.json`, { colony: c.info.label, dims: { AGE_BINS, A_BINS, ARR_BINS }, T: [...T], arrivals });
console.log(`${c.info.label} done`);
