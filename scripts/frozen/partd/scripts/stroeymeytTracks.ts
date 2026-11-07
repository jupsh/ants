/**
 * Reading the Stroeymeyt et al. 2018 fit-colony tracks (main experiment,
 * PreTreatment): colony list, task groups, and the tracking file streamed in
 * frame order. Shared by `stroeymeytRows.ts` (the rows) and the diagnostics
 * that need the same frames. Never reads age- or survival-experiment files
 * (held-out / unused).
 */
import fs from 'node:fs';
import readline from 'node:readline';
import zlib from 'node:zlib';
import type { AntRole } from '../src/sim/analysis/inNest';

export const ROOT = 'data/stroeymeyt2018/main_experiment/original_data';
/** mm per px (authors' `pix_to_mm_ratio`, the larger of their two values; STATUS 2026-10-10). */
export const MM_PER_PX = 0.0229658793;
/** Lines held back to restore frame order (largest lag seen in the fit files: 5). */
const REORDER_WINDOW = 8;

export interface ColonyInfo {
  label: string; // colony020
  treatment: string;
  size: number;
  yNestMaxPx: number;
}

function table(path: string): string[][] {
  return fs.readFileSync(path, 'utf8').trim().split('\n').map((l) => l.trim().split(/\s+/));
}

export function colonies(): ColonyInfo[] {
  const [head, ...rows] = table(`${ROOT}/info.txt`);
  const c = (name: string) => head.indexOf(name);
  return rows.map((r) => ({
    label: `colony${r[c('colony')].padStart(3, '0')}`,
    treatment: r[c('treatment')],
    size: Number(r[c('colony_size')]),
    yNestMaxPx: Number(r[c('Ynestmax')]),
  }));
}

/** Tag → role for the ants that enter the rows (workers alive or lost-tag; queen for density). */
export function roles(col: ColonyInfo): Map<number, AntRole> {
  const groups = new Map<number, string>();
  for (const [colony, tag, group] of table(`${ROOT}/task_groups.txt`).slice(1)) if (colony === col.label) groups.set(Number(tag), group);
  const lines = fs.readFileSync(`${ROOT}/tag_files/${col.label}_${col.treatment}.tags`, 'utf8').split('\n');
  const head = lines.find((l) => l.startsWith('#tag'))!.slice(1).split(',');
  const iTag = head.indexOf('tag');
  const iStatus = head.indexOf('final_status');
  const out = new Map<number, AntRole>();
  for (const l of lines) {
    if (!l || l.startsWith('#') || l.startsWith('$')) continue;
    const f = l.split(',');
    const tag = Number(f[iTag]);
    const status = f[iStatus];
    const g = groups.get(tag);
    if (g === 'queen') out.set(tag, 'queen');
    else if ((g === 'nurse' || g === 'forager') && (status === 'alive' || status === 'lost_tag')) out.set(tag, g);
  }
  return out;
}

/**
 * Streams a colony's PreTreatment file in frame order. `onFrame` gets, per
 * frame, the reads of the tags in `index` (ant index, position in mm, in the
 * nest); the arrays are reused between calls.
 */
export async function streamColony(
  col: ColonyInfo,
  index: Map<number, number>,
  onFrame: (frame: number, t: number, ids: number[], xs: number[], ys: number[], ins: boolean[]) => void,
): Promise<{ frames: number; first: number; last: number; reordered: number; late: number }> {
  const file = `${ROOT}/tracking/${col.label}_${col.treatment}_PreTreatment.csv.gz`;
  const rl = readline.createInterface({ input: fs.createReadStream(file).pipe(zlib.createGunzip()), crlfDelay: Infinity });
  const ids: number[] = [];
  const xs: number[] = [];
  const ys: number[] = [];
  const ins: boolean[] = [];
  const yMax = col.yNestMaxPx;
  let frames = 0;
  let first = NaN;
  let last = NaN;
  let prevFrame = -Infinity;
  // Lines are sometimes written out of order (adjacent swaps; one line
  // misplaced to the end of a file): reorder within a window, drop and count
  // lines arriving later than that (STATUS 2026-10-11).
  const pending: { frame: number; f: string[] }[] = [];
  let reordered = 0;
  let late = 0;
  const emit = (frame: number, f: string[]) => {
    if (frame === prevFrame) throw new Error(`${col.label}: frame ${frame} repeated`);
    prevFrame = frame;
    const t = Number(f[0]);
    const n = Number(f[3]);
    ids.length = xs.length = ys.length = ins.length = 0;
    for (let j = 0; j < n; j++) {
      const i = index.get(Number(f[4 + 4 * j]));
      if (i === undefined) continue;
      const yp = Number(f[6 + 4 * j]);
      ids.push(i);
      xs.push(Number(f[5 + 4 * j]) * MM_PER_PX);
      ys.push(yp * MM_PER_PX);
      ins.push(yp <= yMax);
    }
    onFrame(frame, t, ids, xs, ys, ins);
    frames++;
    if (Number.isNaN(first)) first = t;
    last = t;
  };
  for await (const line of rl) {
    if (!line) continue;
    const f = line.split(',');
    const frame = Number(f[1]);
    if (frame <= prevFrame) {
      late++;
      continue;
    }
    let k = pending.length;
    while (k > 0 && pending[k - 1].frame > frame) k--;
    if (k < pending.length) reordered++;
    pending.splice(k, 0, { frame, f });
    if (pending.length > REORDER_WINDOW) {
      const p = pending.shift()!;
      emit(p.frame, p.f);
    }
  }
  for (const p of pending) emit(p.frame, p.f);
  return { frames, first, last, reordered, late };
}
