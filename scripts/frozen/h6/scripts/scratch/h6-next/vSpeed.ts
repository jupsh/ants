// Scratch (not committed): the speed v of H6's reachability coverage clause (D252, P174), computed once from the tracks.
// v = the 99th percentile (nearest rank) of light-phase (06–18 UTC) in-nest moving step speeds under the onset step rule
// (`StepRule`, activitySeries.ts: a step between two in-nest reads of the same ant at most 3 frames apart; moving if its
// length per frame ≥ 0.6 mm; an out-of-nest read restarts), speed = length / gap frames × 2 fps (mm/s); all ants (queen
// included), the 22 fit colonies pooled. Histogram of mm/frame in 0.001 bins; the reported value is the percentile bin's
// midpoint × 2 fps. A motion statistic of the tracks, not an H6 output. Prints exactly one line.
//   npx vite-node scripts/scratch/h6-next/vSpeed.ts
import { colonies, roles, streamColony } from '../../stroeymeytTracks';
import { StepRule } from '../activitySeries';
import { isLight } from './extract';

export const V_BIN = 0.001; // mm/frame
export const V_MAX_BINS = 400_000; // 400 mm/frame; larger steps go to the last bin (the percentile must fall below it)

/** Pooled histogram → nearest-rank percentile in mm/s (bin midpoint × 2 fps). */
export function percentileSpeed(hist: Float64Array, p: number): { v: number; n: number } {
  let n = 0;
  for (let b = 0; b < hist.length; b++) n += hist[b];
  const rank = Math.ceil(p * n);
  let c = 0;
  for (let b = 0; b < hist.length; b++) {
    c += hist[b];
    if (c >= rank) {
      if (b === hist.length - 1) throw new Error('percentile in the overflow bin');
      return { v: (b + 0.5) * V_BIN * 2, n };
    }
  }
  throw new Error('empty histogram');
}

/** Adds one colony's light in-nest moving step speeds (mm/frame) to `hist`. */
export function addRead(rule: StepRule, hist: Float64Array, lastX: Float64Array, lastY: Float64Array, lastF: Int32Array, i: number, f: number, x: number, y: number, inNest: boolean, light: boolean): void {
  // StepRule decides still/moving; its private state is mirrored here only to get the step length and gap
  const g = f - lastF[i];
  const px = lastX[i], py = lastY[i];
  const r = rule.read(i, f, x, y, inNest);
  if (r === -1) return;
  lastF[i] = inNest ? f : -1e9;
  lastX[i] = x;
  lastY[i] = y;
  if (r !== 2 || !light) return;
  const s = Math.hypot(x - px, y - py) / g;
  hist[Math.min(Math.floor(s / V_BIN), hist.length - 1)]++;
}

async function main(): Promise<void> {
  const hist = new Float64Array(V_MAX_BINS);
  const cols = colonies();
  if (cols.length !== 22) throw new Error(`expected 22 fit colonies, found ${cols.length}`);
  for (const col of cols) {
    const tags = [...roles(col).keys()];
    const index = new Map(tags.map((t, i) => [t, i]));
    const n = tags.length;
    const rule = new StepRule(n);
    const lastF = new Int32Array(n).fill(-1e9), lastX = new Float64Array(n), lastY = new Float64Array(n);
    await streamColony(col, index, (f, t, ids, xs, ys, ins) => {
      const light = isLight(t);
      for (let q = 0; q < ids.length; q++) addRead(rule, hist, lastX, lastY, lastF, ids[q], f, xs[q], ys[q], ins[q], light);
    });
  }
  const { v, n } = percentileSpeed(hist, 0.99);
  let moving = 0;
  for (let b = 0; b < hist.length; b++) moving += hist[b];
  if (moving !== n) throw new Error('count mismatch');
  console.log(`v99 in-nest moving step speed, light, all ants, 22 fit colonies: ${v.toFixed(3)} mm/s (n = ${n})`);
}

if (!process.env.VITEST) await main();
