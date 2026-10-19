/**
 * B018 step 0: nest geometry from the data, one colony per call (no behavioural reading). In-nest worker detections:
 * x and y histograms (0.25 mm) for the edges; forager crossings of Ynestmax (consecutive detections ≤ 3 frames apart,
 * one in the nest and one out) for the entrance; the queen's detection coverage.
 *   nice -n 19 npx vite-node backlog/B018-resting-site-and-aggregation-in-the/geometry.ts --colony i   → out/geometry-c<i>.json
 */
import fs from 'node:fs';
import { numArg, writeJson } from '../../scripts/lib';
import { MM_PER_PX } from '../../scripts/stroeymeytTracks';
import { BRIDGE, colony, FORAGER, ITEM, QUEEN, stream } from './lib';

const BIN = 0.25;
const ci = numArg('--colony', 0);
const c = colony(ci);
const hx = new Array(Math.ceil(120 / BIN)).fill(0);
const hy = new Array(Math.ceil(80 / BIN)).fill(0);
const cross: number[] = [];
const n = c.role.length;
const lastF = new Int32Array(n).fill(-1e9);
const lastX = new Float64Array(n);
const lastIn = new Uint8Array(n);
const queen = { frames: 0, det: 0, detIn: 0 };
let frames = 0;
const s = await stream(c, (f, t, ids, xs, ys, ins) => {
  frames++;
  for (let j = 0; j < ids.length; j++) {
    const i = ids[j];
    if (c.role[i] === QUEEN) {
      queen.det++;
      if (ins[j]) queen.detIn++;
    } else if (ins[j]) {
      hx[Math.max(0, Math.min(hx.length - 1, Math.floor(xs[j] / BIN)))]++;
      hy[Math.max(0, Math.min(hy.length - 1, Math.floor(ys[j] / BIN)))]++;
    }
    if (c.role[i] === FORAGER && f - lastF[i] <= BRIDGE && !!lastIn[i] !== ins[j]) cross.push((xs[j] + lastX[i]) / 2);
    lastF[i] = f;
    lastX[i] = xs[j];
    lastIn[i] = ins[j] ? 1 : 0;
  }
});
queen.frames = frames;
fs.mkdirSync(`${ITEM}/out`, { recursive: true });
writeJson(`${ITEM}/out/geometry-c${ci}.json`, {
  colony: c.info.label, yNestMaxMm: c.info.yNestMaxPx * MM_PER_PX, bin: BIN, frames, hours: (s.last - s.first) / 3600,
  dup: s.dup, order: { reordered: s.reordered, late: s.late }, hx, hy, cross, queen,
  ants: { nurse: c.role.filter((r) => r === 0).length, forager: c.role.filter((r) => r === 1).length, queen: c.role.filter((r) => r === 2).length },
});
console.log(`${c.info.label} done`);
