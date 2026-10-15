/**
 * Detection counts of the Stroeymeyt fit colonies for the tracker (STATUS
 * 2026-10-15): per colony, nurses (exits count as detections) and in-nest
 * foragers (exits excluded), per ant × block, blocks = even / odd UTC hours
 * on the original timeline (estimation / validation). Reads only the fit
 * colonies' PreTreatment tracks. Input of `estimateTracker.ts`.
 *   npx vite-node scripts/trackerData.ts [--out logs/tracker-data.json]
 */
import { TrackerStats } from '../src/sim/analysis/detectionStats';
import { arg, writeJson } from './lib';
import { colonies, roles, streamColony } from './stroeymeytTracks';

const blockOf = (t: number) => Math.floor(t / 3600) % 2;
const blockEndFrame = (frame: number, t: number) => frame + Math.round((Math.floor(t / 3600) * 3600 + 3600 - t) / 0.5) - 1;
const out: Record<string, unknown> = {};
for (const col of colonies()) {
  const roleOf = roles(col);
  const tags = [...roleOf.keys()];
  const index = new Map(tags.map((t, i) => [t, i]));
  const nurses = new TrackerStats(tags.map((t) => roleOf.get(t) === 'nurse'), 2, blockOf, blockEndFrame);
  const foragers = new TrackerStats(tags.map((t) => roleOf.get(t) === 'forager'), 2, blockOf, blockEndFrame, true);
  let last = 0;
  await streamColony(col, index, (frame, t, ids, xs, ys, ins) => {
    nurses.frame(frame, t, ids, xs, ys, ins);
    foragers.frame(frame, t, ids, xs, ys, ins);
    last = frame;
  });
  nurses.finish(last);
  foragers.finish(last);
  out[col.label] = { nurses: nurses.trackedAnts(), foragers: foragers.trackedAnts() };
  console.log(`${col.label} done`);
}
const dst = arg('--out', 'logs/tracker-data.json');
writeJson(dst, out);
console.log(`wrote ${dst}`);
