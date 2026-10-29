/**
 * The Stroeymeyt PreTreatment stream of scripts/stroeymeytTracks.ts with the tag angle added (that function does
 * not return it, and the main tree is read-only for this item). Same reordering window and the same rows kept.
 */
import fs from 'node:fs';
import readline from 'node:readline';
import zlib from 'node:zlib';
import { MM_PER_PX, ROOT, type ColonyInfo } from '../../scripts/stroeymeytTracks';

const REORDER_WINDOW = 8;

export async function streamWithAngle(
  col: ColonyInfo,
  index: Map<number, number>,
  onFrame: (frame: number, t: number, ids: number[], xs: number[], ys: number[], ins: boolean[], angs: number[]) => void,
): Promise<{ frames: number; first: number; last: number; late: number }> {
  const file = `${ROOT}/tracking/${col.label}_${col.treatment}_PreTreatment.csv.gz`;
  const rl = readline.createInterface({ input: fs.createReadStream(file).pipe(zlib.createGunzip()), crlfDelay: Infinity });
  const ids: number[] = [], xs: number[] = [], ys: number[] = [], ins: boolean[] = [], angs: number[] = [];
  let frames = 0, first = NaN, last = NaN, prevFrame = -Infinity, late = 0;
  const pending: { frame: number; f: string[] }[] = [];
  const emit = (frame: number, f: string[]) => {
    if (frame === prevFrame) throw new Error(`${col.label}: frame ${frame} repeated`);
    prevFrame = frame;
    const t = Number(f[0]);
    const n = Number(f[3]);
    ids.length = xs.length = ys.length = ins.length = angs.length = 0;
    for (let j = 0; j < n; j++) {
      const i = index.get(Number(f[4 + 4 * j]));
      if (i === undefined) continue;
      const yp = Number(f[6 + 4 * j]);
      ids.push(i);
      xs.push(Number(f[5 + 4 * j]) * MM_PER_PX);
      ys.push(yp * MM_PER_PX);
      ins.push(yp <= col.yNestMaxPx);
      angs.push(Number(f[7 + 4 * j]));
    }
    onFrame(frame, t, ids, xs, ys, ins, angs);
    frames++;
    if (Number.isNaN(first)) first = t;
    last = t;
  };
  for await (const line of rl) {
    if (!line) continue;
    const f = line.split(',');
    const frame = Number(f[1]);
    if (frame <= prevFrame) { late++; continue; }
    let k = pending.length;
    while (k > 0 && pending[k - 1].frame > frame) k--;
    pending.splice(k, 0, { frame, f });
    if (pending.length > REORDER_WINDOW) { const p = pending.shift()!; emit(p.frame, p.f); }
  }
  for (const p of pending) emit(p.frame, p.f);
  return { frames, first, last, late };
}
