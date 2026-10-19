/**
 * B018 pass A (families 1–2: anchor and stability), one colony per call. Still steps of workers (step = consecutive
 * in-nest detections ≤ 3 frames apart, still = < 0.6 mm per frame; position at the step's end) on 1-mm grids: 24 h,
 * light, dark, each clock hour, and by role. The queen's positions per clock hour; still nurses' distances to the
 * queen's latest detection (≤ 60 s old).
 *   nice -n 19 npx vite-node backlog/B018-resting-site-and-aggregation-in-the/site.ts --colony i   → out/site-c<i>.json
 */
import { numArg, writeJson } from '../../scripts/lib';
import { BRIDGE, colony, ITEM, isLight, NURSE, QUEEN, STILL_MM, stream } from './lib';

export const W = 72;
export const H = 48;
const ci = numArg('--colony', 0);
const c = colony(ci);
const n = c.role.length;
const grid = () => new Array(W * H).fill(0);
const cell = (x: number, y: number) => Math.max(0, Math.min(H - 1, Math.floor(y))) * W + Math.max(0, Math.min(W - 1, Math.floor(x)));
const all = grid();
const light = grid();
const dark = grid();
const byRole = [grid(), grid()];
const hours: { h: number; grid: number[]; qx: number[]; qy: number[]; qStill: number; qSteps: number }[] = [];
const dQueen = new Array(200).fill(0); // still-nurse distance to the queen, 0.5-mm bins (last = beyond)
let noQueen = 0;
const lastF = new Int32Array(n).fill(-1e9);
const lastX = new Float64Array(n);
const lastY = new Float64Array(n);
let qF = -1e9;
let qX = 0;
let qY = 0;
let h0 = NaN;
await stream(c, (f, t, ids, xs, ys, ins) => {
  if (Number.isNaN(h0)) h0 = Math.floor(t / 3600);
  const k = Math.floor(t / 3600) - h0;
  while (hours.length <= k) hours.push({ h: (h0 + hours.length) % 24, grid: grid(), qx: [], qy: [], qStill: 0, qSteps: 0 });
  const hr = hours[k];
  const lt = isLight(t);
  // Queen first, so nurses in this frame see her current position.
  for (let j = 0; j < ids.length; j++) {
    const i = ids[j];
    if (c.role[i] !== QUEEN || !ins[j]) continue;
    if (f - qF <= BRIDGE) {
      hr.qSteps++;
      if (Math.hypot(xs[j] - qX, ys[j] - qY) / (f - qF) < STILL_MM) hr.qStill++;
    }
    qF = f;
    qX = xs[j];
    qY = ys[j];
    hr.qx.push(Math.round(xs[j] * 100) / 100);
    hr.qy.push(Math.round(ys[j] * 100) / 100);
  }
  for (let j = 0; j < ids.length; j++) {
    const i = ids[j];
    if (c.role[i] === QUEEN) continue;
    const g = f - lastF[i];
    if (ins[j] && g <= BRIDGE && Math.hypot(xs[j] - lastX[i], ys[j] - lastY[i]) / g < STILL_MM) {
      const q = cell(xs[j], ys[j]);
      all[q]++;
      (lt ? light : dark)[q]++;
      byRole[c.role[i]][q]++;
      hr.grid[q]++;
      if (c.role[i] === NURSE) {
        if (f - qF <= 120) dQueen[Math.min(dQueen.length - 1, Math.floor(Math.hypot(xs[j] - qX, ys[j] - qY) / 0.5))]++;
        else noQueen++;
      }
    }
    lastF[i] = ins[j] ? f : -1e9;
    lastX[i] = xs[j];
    lastY[i] = ys[j];
  }
});
writeJson(`${ITEM}/out/site-c${ci}.json`, { colony: c.info.label, W, H, all, light, dark, nurse: byRole[0], forager: byRole[1], hours, dQueen, noQueen });
console.log(`${c.info.label} done`);
