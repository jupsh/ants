// Scratch (not committed): D205 Part 2 item 1(c), the data recorder of D223 (amendment 1, D224). One fit colony's
// PreTreatment tracks, per tracked ant (nurses and foragers, as tmpShortData.ts; the queen in no group) and 1-min bin
// counted from the colony's first frame, floor((f − f0) / 120) as `SyncStats` counts its bins: moving steps `mv`, steps
// `st` (the step rule of `SyncStats`: consecutive in-nest detections ≤ 3 frames apart, moving if ≥ 0.6 mm / frame),
// in-nest detections `np`, out-of-nest detections `no`; and per minute the block label `SyncStats` gives that minute's
// first frame (day × 100 + start hour of the 4-h clock block from 06 UTC; D209 defect 2), null for a minute with no
// frame. Every minute of the recording, light and dark. A small class beside `YDistStats` (ydistStats.ts unchanged):
// the runs' `ydist` has the same mv / st / np with bins from frame 0.
//   npx vite-node scripts/scratch/foragers1cData.ts --colony i [--out logs/partd2/foragers]   → <out>/data-c<i>.json
import fs from 'node:fs';
import { arg, numArg } from '../lib';
import { colonies, roles, streamColony } from '../stroeymeytTracks';

const BIN = 120; // frames per minute at 2 fps

/** The block label `SyncStats.frame` gives a frame at UTC time t (copied from syncStats.ts, unchanged). */
export function syncBlock(t: number): number {
  const h = t / 3600 - 6;
  const k = Math.floor(h / 4);
  return Math.floor((k * 4 + 6) / 24) * 100 + ((((k * 4 + 6) % 24) + 24) % 24);
}

interface Ant { lastFrame: number; lastX: number; lastY: number; lastIn: boolean; mv: number[]; st: number[]; np: number[]; no: number[] }

export class MinuteRecorder {
  private readonly ants: Ant[];
  private f0 = NaN;
  readonly label: (number | null)[] = [];
  constructor(readonly track: boolean[]) {
    this.ants = track.map(() => ({ lastFrame: -1e9, lastX: 0, lastY: 0, lastIn: false, mv: [], st: [], np: [], no: [] }));
  }
  frame(f: number, ids: number[], xs: number[], ys: number[], ins: boolean[], t: number): void {
    if (Number.isNaN(this.f0)) this.f0 = f;
    const k = Math.floor((f - this.f0) / BIN);
    while (this.label.length <= k) this.label.push(null);
    if (this.label[k] === null) this.label[k] = syncBlock(t);
    for (let q = 0; q < ids.length; q++) {
      const i = ids[q];
      if (!this.track[i]) continue;
      const a = this.ants[i];
      // As SyncStats: a second read of the same ant in one frame is ignored.
      if (f === a.lastFrame) continue;
      while (a.np.length <= k) { a.mv.push(0); a.st.push(0); a.np.push(0); a.no.push(0); }
      if (ins[q]) a.np[k]++;
      else a.no[k]++;
      const g = f - a.lastFrame;
      if (ins[q] && a.lastIn && g <= 3) {
        a.st[k]++;
        if (Math.hypot(xs[q] - a.lastX, ys[q] - a.lastY) / g >= 0.6) a.mv[k]++;
      }
      a.lastFrame = f; a.lastX = xs[q]; a.lastY = ys[q]; a.lastIn = ins[q];
    }
  }
  /** Dense per-minute arrays for every tracked ant (zeros where it was not read), all of the recording's length. */
  out(tag: number[], role: (string | undefined)[]) {
    const M = this.label.length;
    const pad = (v: number[]) => { const o = v.slice(); while (o.length < M) o.push(0); return o; };
    const ants = [];
    for (let i = 0; i < this.ants.length; i++) {
      if (!this.track[i]) continue;
      const a = this.ants[i];
      ants.push({ tag: tag[i], role: role[i], mv: pad(a.mv), st: pad(a.st), np: pad(a.np), no: pad(a.no) });
    }
    return { f0: this.f0, minutes: M, label: this.label, ants };
  }
}

const ci = numArg('--colony', -1);
if (ci < 0) throw new Error('--colony i');
const OUT = arg('--out', 'logs/partd2/foragers');
const col = colonies()[ci];
const roleOf = roles(col);
const tags = [...roleOf.keys()];
const index = new Map(tags.map((t, i) => [t, i]));
const R = tags.map((t) => roleOf.get(t));
const rec = new MinuteRecorder(R.map((r) => r === 'nurse' || r === 'forager'));
const s = await streamColony(col, index, (f, t, ids, xs, ys, ins) => rec.frame(f, ids, xs, ys, ins, t));
const n = (r: string) => R.filter((x) => x === r).length;
fs.mkdirSync(OUT, { recursive: true });
// Compact JSON (dense arrays; writeJson's indentation would multiply the size).
fs.writeFileSync(`${OUT}/data-c${ci}.json`, JSON.stringify({ colony: col.label, index: ci, binFrames: BIN, tracked: { nurse: n('nurse'), forager: n('forager') }, stream: s, ...rec.out(tags, R) }));
console.log(`${col.label} done, ${rec.label.length} minutes`);
