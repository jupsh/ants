// Scratch (not committed): Part D Part 2 item 1(b), synthetic checks before any data run (P91; D212 amendment 1).
// Synthetic frames go through the same per-colony class (`ColonyTriggers`, triggersCore.ts) and the same statistics
// (`row` / `aggregate`, triggersStats.ts) as the real run. Prints each check with PASS / FAIL and its numbers; exits 1
// if any check fails.
//   npx vite-node scripts/scratch/triggersSyn.ts
//   npx vite-node scripts/scratch/triggersSyn.ts --null-seeds 1-100 --out <file>   (amendment 2 calibration, P100)
import type { AntRole } from '../../src/sim/analysis/inNest';
import { RNG } from '../../src/sim/core/rng';
import { ActivitySeries } from './activitySeries';
import { blockOf, ColonyTriggers, DT, fr, SETTINGS, type ColonyResult, type Ctrl, type EventRow } from './triggersCore';
import { execSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import zlib from 'node:zlib';
import { arg, runProgress, writeJson } from '../lib';
import {
  aggregate, applyCalibration, CAL_MUST_MATCH, CAL_SCRIPTS, calibrationRates, DESIGN, DRAWS, fpRates, LABELS, md5Of, md5s, PRIMARY, read, row, SEED,
  uncalibratedLabel, type Calibration, type CalSeedType,
} from './triggersStats';

let failures = 0;
// In the --null-seeds and --write-dir modes the deterministic checks (cases 0-4) still run first but print nothing;
// --null-seeds refuses to calibrate if one of them failed.
const quiet = process.argv.includes('--null-seeds') || process.argv.includes('--write-dir') || process.argv.includes('--dump-quorum');
const check = (name: string, ok: boolean, detail: string) => {
  if (!ok) failures++;
  if (!quiet || !ok) console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}: ${detail}`);
};
const r6 = (x: number) => (Number.isFinite(x) ? Number(x.toPrecision(6)) : x);
const DAY = 20000; // days since the epoch
const T6 = DAY * 86400 + 6 * 3600; // 06:00 UTC of DAY: frame 0
const MIN = fr(60);

// ---------------------------------------------------------------------------------------------------------------
// Synthetic colony generator.
/** Frame tap for `--dump-quorum` (D219): sees each colony's header and every frame exactly as `ColonyTriggers.frame()`
 * receives it (called just before that call, with the same arguments). Null in every other mode. */
interface FrameTap {
  begin(label: string, roles: AntRole[], tags: number[]): void;
  frame(f: number, t: number, ids: number[], xs: number[], ys: number[], ins: boolean[]): void;
}
let frameTap: FrameTap | null = null;
interface Entry { f: number; ant: number; outS?: number; noDet?: [number, number][]; outsideUndetected?: boolean }
interface Spec {
  label: string; nN: number; nF: number; queen: boolean;
  g0: number; g1: number; tBase?: number;
  level: (g: number) => number; mode: 'random' | 'det'; seed?: number;
  entries?: Entry[]; onsets?: number[]; queenMoveS?: number;
  queenNoDet?: [number, number][]; queenStride?: [number, number, number][];
  recGaps?: [number, number][];
  eventAntMove?: 'random' | 'never' | 'always';
  alwaysMove?: number[]; // ants that move on every frame
  homes?: [number, number][];
  extraFrames?: [number, number][]; // further frame ranges (e.g. a second morning)
}
function simulate(spec: Spec): ColonyResult {
  const nAct = spec.nN + spec.nF;
  const roles: AntRole[] = [...Array(spec.nN).fill('nurse'), ...Array(spec.nF).fill('forager'), ...(spec.queen ? ['queen' as AntRole] : [])];
  const tags = roles.map((_, i) => 1000 + i);
  const ct = new ColonyTriggers(spec.label, roles, tags);
  const tap = frameTap;
  tap?.begin(spec.label, roles, tags);
  const feed = (f: number, t: number, ids: number[], xs: number[], ys: number[], ins: boolean[]) => {
    tap?.frame(f, t, ids, xs, ys, ins);
    ct.frame(f, t, ids, xs, ys, ins);
  };
  const qi = spec.queen ? nAct : -1;
  const rng = Array.from({ length: nAct }, (_, i) => RNG.stream(spec.seed ?? 1, 7, i));
  const home = Array.from({ length: nAct }, (_, i) => spec.homes?.[i] ?? [5 + ((i * 7) % 50), 5 + ((i * 11) % 30)]);
  const tog = new Uint8Array(nAct + 1);
  const entries = spec.entries ?? [];
  const byAnt = new Map<number, Entry[]>();
  for (const e of entries) { const l = byAnt.get(e.ant) ?? []; l.push(e); byAnt.set(e.ant, l); }
  const onsets = spec.onsets ?? [];
  const qMove = fr(spec.queenMoveS ?? 20);
  const inR = (g: number, iv?: [number, number][]) => !!iv && iv.some(([a, b]) => g >= a && g < b);
  const ids: number[] = [];
  const xs: number[] = [];
  const ys: number[] = [];
  const ins: boolean[] = [];
  let cum = 0;
  const ranges: [number, number][] = [[spec.g0, spec.g1], ...(spec.extraFrames ?? [])];
  for (const [g0, g1] of ranges) for (let g = g0; g < g1; g++) {
    if (inR(g, spec.recGaps)) continue;
    const lv = Math.min(0.98, Math.max(0.02, spec.level(g)));
    ids.length = xs.length = ys.length = ins.length = 0;
    let kDet = 0;
    if (spec.mode === 'det') { kDet = Math.round(cum + lv * nAct) - Math.round(cum); cum += lv * nAct; }
    for (let i = 0; i < nAct; i++) {
      let mv = spec.mode === 'random' ? rng[i].next() < lv : i < kDet;
      if (spec.alwaysMove?.includes(i)) mv = true;
      const ev = byAnt.get(i);
      let outside = false;
      let seen = true;
      if (ev) {
        if (spec.eventAntMove === 'never') mv = false;
        if (spec.eventAntMove === 'always') mv = true;
        for (const e of ev) {
          if (g >= e.f - fr(e.outS ?? 45) && g < e.f) { outside = true; if (e.outsideUndetected) seen = false; }
          if (inR(g, e.noDet)) seen = false;
        }
      }
      if (mv) tog[i] ^= 1;
      if (!seen) continue;
      ids.push(i);
      xs.push(home[i][0] + tog[i]);
      ys.push(outside ? 100 : home[i][1]);
      ins.push(!outside);
    }
    if (qi >= 0) {
      const moving = onsets.some((f) => g >= f && g < f + qMove);
      if (moving) tog[qi] ^= 1;
      let seen = !inR(g, spec.queenNoDet);
      for (const [a, b, s] of spec.queenStride ?? []) if (g >= a && g < b && (g - a) % s !== 0) seen = false;
      if (seen) { ids.push(qi); xs.push(30 + tog[qi]); ys.push(20); ins.push(true); }
    }
    feed(g, (spec.tBase ?? T6) + g * DT, ids, xs, ys, ins);
  }
  return ct.finish();
}
const S = (res: ColonyResult, name: string) => res.settings.find((s) => s.name === name)!;
const foundFrames = (res: ColonyResult, name: string) => {
  const s = S(res, name);
  return [...(s.events as EventRow[]).map((e) => e.f), ...s.dropped.map((d) => d.f)].sort((a, b) => a - b);
};

// ---------------------------------------------------------------------------------------------------------------
// 0. Conversions, block keys, ActivitySeries unchanged by the refactor.
{
  const conv = [[10, 20], [20, 40], [30, 60], [60, 120], [120, 240], [300, 600], [5, 10]].map(([s, f]) => fr(s) === f);
  check('seconds → frames', conv.every(Boolean), 'fr(10, 20, 30, 60, 120, 300, 5 s) = 20, 40, 60, 120, 240, 600, 10 frames');
  const k = (h: number, d = DAY) => blockOf(d * 86400 + h * 3600);
  const cases: [string, ReturnType<typeof blockOf>, number, string][] = [
    ['06:30', k(6.5), DAY * 100 + 6, 'light'], ['09:59:59', k(10 - 1 / 3600), DAY * 100 + 6, 'light'], ['10:00', k(10), DAY * 100 + 10, 'light'],
    ['17:59', k(18 - 1 / 60), DAY * 100 + 14, 'light'], ['18:00', k(18), DAY * 100 + 18, 'dark'], ['next 02:00', k(2, DAY + 1), (DAY + 1) * 100 + 2, 'dark'],
    ['next 05:59', k(6 - 1 / 60, DAY + 1), (DAY + 1) * 100 + 2, 'dark'], ['next 06:30', k(6.5, DAY + 1), (DAY + 1) * 100 + 6, 'light'],
  ];
  check('block keys (day × 100 + start hour)', cases.every(([, b, key, ph]) => b.key === key && b.phase === ph), cases.map(([l, b]) => `${l}→${b.key}${b.phase[0]}`).join(', '));
  // Two mornings in one stream stay separate blocks.
  const two = simulate({ label: 'two', nN: 4, nF: 0, queen: false, g0: fr(3.5 * 3600), g1: fr(4.5 * 3600), level: () => 0.3, mode: 'random', extraFrames: [[fr(24 * 3600), fr(24.5 * 3600)]] });
  const keys = two.blocks.map((b) => b.key);
  check('second morning not merged', keys.join() === [DAY * 100 + 6, DAY * 100 + 10, (DAY + 1) * 100 + 6].join(), `blocks ${keys.join(', ')}; self-check ${two.selfCheck.equal}`);

  // Original ActivitySeries (as before the refactor, verbatim) against the refactored one, on a messy stream.
  class Original {
    private readonly lastF: Int32Array;
    private readonly lastX: Float64Array;
    private readonly lastY: Float64Array;
    readonly bins: number[][] = [];
    private cur: number[] | null = null;
    constructor(readonly track: boolean[], readonly binFrames = 120) {
      this.lastF = new Int32Array(track.length).fill(-1e9);
      this.lastX = new Float64Array(track.length);
      this.lastY = new Float64Array(track.length);
    }
    frame(f: number, ids: number[], xs: number[], ys: number[], ins: boolean[], t = NaN): void {
      const b = Math.floor(f / this.binFrames) * this.binFrames;
      if (!this.cur || this.cur[0] !== b) this.bins.push((this.cur = [b, t, 0, 0]));
      for (let q = 0; q < ids.length; q++) {
        const i = ids[q];
        if (!this.track[i] || this.lastF[i] === f) continue;
        const g = f - this.lastF[i];
        if (ins[q] && g <= 3) {
          this.cur[3]++;
          if (Math.hypot(xs[q] - this.lastX[i], ys[q] - this.lastY[i]) / g >= 0.6) this.cur[2]++;
        }
        this.lastF[i] = ins[q] ? f : -1e9;
        this.lastX[i] = xs[q];
        this.lastY[i] = ys[q];
      }
    }
  }
  const r = RNG.stream(99, 1);
  const track = Array.from({ length: 30 }, (_, i) => i % 7 !== 0);
  let same = true;
  for (const bf of [120, 1, 7]) {
    const a = new Original(track, bf);
    const b = new ActivitySeries(track, bf);
    const pos = Array.from({ length: 30 }, () => [r.range(0, 60), r.range(0, 40)]);
    for (let f = 0; f < 20000; f++) {
      if (r.chance(0.02)) f += r.int(8); // missing frames
      const ids: number[] = [], xs: number[] = [], ys: number[] = [], ins: boolean[] = [];
      for (let i = 0; i < 30; i++) {
        if (r.chance(0.2)) continue; // undetected
        const reads = r.chance(0.05) ? 2 : 1; // duplicate reads
        for (let q = 0; q < reads; q++) {
          if (r.chance(0.4)) { pos[i][0] += r.range(-1.5, 1.5); pos[i][1] += r.range(-1.5, 1.5); }
          ids.push(i); xs.push(pos[i][0]); ys.push(pos[i][1]); ins.push(r.chance(0.85));
        }
      }
      a.frame(f, ids, xs, ys, ins, f * 0.5);
      b.frame(f, ids, xs, ys, ins, f * 0.5);
    }
    same &&= JSON.stringify(a.bins) === JSON.stringify(b.bins);
  }
  check('ActivitySeries output unchanged by the StepRule refactor', same, 'bins identical on a stream with missing frames, undetected ants, duplicate reads, outside reads (bin widths 120, 1, 7)');
}

// ---------------------------------------------------------------------------------------------------------------
// 1. Known small case, numbers by hand. 4 nurses, deterministic: k of 4 move on each frame (level k/4), every ant read
// in the nest on every frame. Period 10 min (1200 frames): level 0.25, except 0.5 over phase [540, 600) and, in event
// periods, 0.75 over [600, 720). Queen onsets at phase 600 of periods 8, 11, 14, 17, 20 (block 06-10, frames from
// 07:00). By hand at each event: L = (60·0.25 + 60·0.5)/120 = 0.375, R = 0.5 − 0.25 = 0.25, A_pre = 0.375,
// A_post = 0.75; the only candidates at distance 0 are phase 600 of the other periods (L 0.375, R 0.25, A_post 0.25),
// the 5 earliest kept (periods 6, 7, 9, 10, 12); DiD = (0.75 − 0.375) − (0.25 − 0.375) = 0.5; post − pre = 0.375.
// Bands around the queen (30, 20): nurses 0, 1 at 10 mm, 2 at 30 mm, 3 at 50 mm; ant i moves iff i < k:
// band 0-20: pre (120 + 60)/240 = 0.75, post 1.0 event / 0.5 control → DiD 0.5; band 20-40: 0 → 1 event, 0 → 0
// control → DiD 1; band > 40: never moves → DiD 0. Time course bins (phase 540-600 is the 30 s before the event):
// [−30, −20 s) 0.5 both; [−60, −50 s) 0.25 both; [0, 10 s) 0.75 / 0.25; rise over [−5, −1 min) 0.25 − 0.25 = 0.
{
  const P = 1200;
  const evP = [8, 11, 14, 17, 20];
  const level = (g: number) => {
    const p = Math.floor(g / P);
    const ph = g - p * P;
    if (ph >= 540 && ph < 600) return 0.5;
    if (evP.includes(p) && ph >= 600 && ph < 720) return 0.75;
    return 0.25;
  };
  const res = simulate({
    label: 'hand', nN: 4, nF: 0, queen: true, g0: fr(3600), g1: fr(4 * 3600), level, mode: 'det',
    onsets: evP.map((p) => p * P + 600), homes: [[40, 20], [30, 30], [30, 50], [80, 20]],
  });
  const q = S(res, 'queen');
  const ev = q.events as EventRow[];
  const near = (a: number, b: number) => Math.abs(a - b) < 1e-12;
  const e0 = ev[0];
  const ctrlF = (e0?.ctrl as Ctrl[] | undefined)?.map((c) => c[0]) ?? [];
  const okVals = ev.length === 5 && ev.every((e) => near(e.L, 0.375) && near(e.R, 0.25) && near(e.pre, 0.375) && near(e.post, 0.75) && near(e.did, 0.5) && near(e.pp, 0.375) && e.nC === 5 && near(e.dL, 0) && near(e.dR, 0));
  check('hand case: L, R, A_pre, A_post, DiD, post − pre', okVals,
    `events ${ev.length} (expected 5) at ${ev.map((e) => e.f).join(', ')}; first: L ${r6(e0?.L)}, R ${r6(e0?.R)}, A_pre ${r6(e0?.pre)}, A_post ${r6(e0?.post)}, DiD ${r6(e0?.did)}, post−pre ${r6(e0?.pp)}, controls ${e0?.nC}, ΔL ${r6(e0?.dL)}, ΔR ${r6(e0?.dR)} (expected 0.375, 0.25, 0.375, 0.75, 0.5, 0.375, 5, 0, 0)`);
  const ctrlVals = (e0?.ctrl as Ctrl[] | undefined) ?? [];
  check('hand case: matched controls', ctrlF.join() === [6, 7, 9, 10, 12].map((p) => p * P + 600).join() && ctrlVals.every((c) => near(c[1], 0.375) && near(c[2], 0.25) && near(c[3], 0.375) && near(c[4], 0.25)),
    `control frames ${ctrlF.join(', ')} (expected 7800, 9000, 11400, 12600, 15000); values [L, R, A_pre, A_post] ${JSON.stringify(ctrlVals.map((c) => c.slice(1).map(r6)))}`);
  const b = e0?.bands ?? [];
  check('hand case: distance bands', near(b[0], 0.5) && near(b[1], 1) && near(b[2], 0), `DiD by band ${b.map(r6).join(', ')} (expected 0.5, 1, 0); roles nurse ${r6(e0?.roles?.nurse ?? NaN)} (0.5), forager ${e0?.roles?.forager} (NaN: none)`);
  const tc = q.tc!;
  const at = (s: number) => tc.bins.indexOf(s);
  const tcOk = near(tc.ev[at(-30)], 0.5) && near(tc.ctrl[at(-30)], 0.5) && near(tc.ev[at(-60)], 0.25) && near(tc.ctrl[at(-60)], 0.25) && near(tc.ev[at(0)], 0.75) && near(tc.ctrl[at(0)], 0.25) && near(tc.diff[at(0)], 0.5);
  check('hand case: time course and rise', tcOk && ev.every((e) => e.rise === 0),
    `bins [−30 s] ${r6(tc.ev[at(-30)])}/${r6(tc.ctrl[at(-30)])}, [−60 s] ${r6(tc.ev[at(-60)])}/${r6(tc.ctrl[at(-60)])}, [0 s] ${r6(tc.ev[at(0)])}/${r6(tc.ctrl[at(0)])} diff ${r6(tc.diff[at(0)])}; rise per event ${ev.map((e) => e.rise).join(', ')} (expected 0.5/0.5, 0.25/0.25, 0.75/0.25 diff 0.5; 0)`);
  check('hand case: self-check', res.selfCheck.equal, JSON.stringify(res.selfCheck.triggers.light));
}

// ---------------------------------------------------------------------------------------------------------------
// 1b. Amendment 2 row `queen-ctrl5min` (candidates >= 5 min from every same-type event, ± 5 min inside the block), by
// hand. 4 nurses, deterministic, block 06-10 read from 07:00 (frames 7200-28799). Level 0.25, except 0.5 over
// [d − 60, d) for each marker d, and 0.75 over [e, e + 120) after each queen onset e. Onsets e at 12000, 18000, 24000;
// decoy markers at 9000, 9600, 12240, 15000, 18240, 21000, 27000 (12240 and 18240 are 2 min after an onset). At every
// marker L 0.375, R 0.25 (the events' values); A_post 0.25 at decoys. Only distance-0 candidates are acceptable
// (as in case 1), the 5 earliest kept. Primary (exclusion [c − 1 min, c + 1 min)): controls 9000, 9600, 12240, 15000,
// 18240; candidates 2137 grid frames in [7320, 28680] minus 24 per onset = 2065. 5-min row: controls 9000, 9600,
// 15000, 21000, 27000; candidates 2041 in [7800, 28200] minus 119 per onset (|c − e| < 600) = 1684. DiD 0.5 in both
// rows; rise in the 5-min row 0 (no marker in any [t − 5 min, t − 1 min)).
{
  const ev = [12000, 18000, 24000];
  const decoys = [9000, 9600, 12240, 15000, 18240, 21000, 27000];
  const markers = [...ev, ...decoys];
  const level = (g: number) => {
    if (markers.some((d) => g >= d - 60 && g < d)) return 0.5;
    if (ev.some((e) => g >= e && g < e + 120)) return 0.75;
    return 0.25;
  };
  const res = simulate({ label: 'c5', nN: 4, nF: 0, queen: true, g0: fr(3600), g1: fr(4 * 3600), level, mode: 'det', onsets: ev });
  const qP = S(res, 'queen');
  const q5 = S(res, 'queen-ctrl5min');
  const found = foundFrames(res, 'queen');
  const cf = (r: typeof qP) => (r.events as EventRow[]).map((e) => (e.ctrl as Ctrl[]).map((c) => c[0]));
  const near = (a: number, b: number) => Math.abs(a - b) < 1e-12;
  const pC = cf(qP);
  const c5 = cf(q5);
  const exp5 = [9000, 9600, 15000, 21000, 27000].join();
  const expP = [9000, 9600, 12240, 15000, 18240].join();
  const minDist = (cs: number[][]) => Math.min(...cs.flat().map((c) => Math.min(...found.map((e) => Math.abs(c - e)))));
  check('5-min row: controls by hand, all >= 5 min from same-type events', found.join() === ev.join() && c5.length === 3 && c5.every((c) => c.join() === exp5) && pC.every((c) => c.join() === expP) && minDist(c5) >= fr(300) && minDist(pC) < fr(300),
    `onsets found ${found.join(', ')}; 5-min row controls ${c5.map((c) => c.join(' ')).join(' | ')} (expected ${exp5} for each), nearest same-type event ${minDist(c5)} frames (>= 600); primary controls ${pC[0]?.join(' ')} (expected ${expP}), nearest ${minDist(pC)} frames`);
  check('5-min row: candidate counts by hand', qP.blocks[0].cands === 2065 && q5.blocks[0].cands === 1684, `primary ${qP.blocks[0].cands} (expected 2065), 5-min row ${q5.blocks[0].cands} (expected 1684)`);
  const e5 = q5.events as EventRow[];
  check('5-min row: DiD and rise by hand', e5.length === 3 && e5.every((e) => near(e.did, 0.5) && e.rise === 0) && (qP.events as EventRow[]).every((e) => near(e.did, 0.5)),
    `5-min row DiD ${e5.map((e) => r6(e.did)).join(', ')}, rise ${e5.map((e) => e.rise).join(', ')} (expected 0.5, 0); primary DiD ${(qP.events as EventRow[]).map((e) => r6(e.did)).join(', ')}`);
  const rr = row(Array.from({ length: 11 }, (_, i) => ({ ...res, colony: `c5${i}` })), 'queen-ctrl5min', 50);
  check('5-min row: no class', rr.reading === undefined && rr.ctrlExclS === 300 && !rr.primary && res.selfCheck.equal, `reading ${JSON.stringify(rr.reading)}, ctrlExclS ${rr.ctrlExclS}, primary ${rr.primary}; self-check ${res.selfCheck.equal}`);
}

// ---------------------------------------------------------------------------------------------------------------
// 2. Missing detections never count as absence, stillness or residence (P95); first observed return (P94); the
// recording-gap and block-edge drops. One colony, block 06-10 from 07:00, random activity 0.3.
{
  const nN = 10;
  const at = (min: number) => fr(min * 60); // frame at 06:00 + min
  const E = (ant: number, min: number, extra: Partial<Entry> = {}): Entry => ({ f: at(min), ant: nN + ant, ...extra });
  const entries: Entry[] = [
    E(0, 70), // a: absence 45 s, read every frame → entry
    E(1, 80, { noDet: [[at(80) - 60, at(80) - 30]] }), // b: 15-s detection gap inside the absence → none
    E(2, 90, { noDet: [[at(90) - 60, at(90) - 44]] }), // c: 8-s gap inside the absence → entry
    E(3, 100, { outsideUndetected: true, outS: 60 }), // d: never detected outside (60 s unread), then in the nest → none
    E(4, 110, { noDet: [[at(110) - 30, at(110)]] }), // e: last 15 s before the return unread → none
    E(5, 120, { outS: 20 }), // f: 20-s absence → none at 30 s, entry at 10 s
    E(6, 130), // g: entry, then a 35-s recording gap inside its windows → found, dropped (gap)
    E(7, 239.5), // h: entry 30 s before the block end → found, dropped (edge)
  ];
  const onsets = [75, 85, 95, 105, 115].map(at);
  const res = simulate({
    label: 'p95', nN, nF: 8, queen: true, g0: at(60), g1: at(240), level: () => 0.3, mode: 'random', seed: 5, entries, onsets,
    queenNoDet: [[at(85) - 100, at(85) - 70], [at(95) - 100, at(95) - 84]], // q2: 15-s gap → none; q3: 8-s gap → onset
    queenStride: [[at(105) - 300, at(105) - 2, 4]], // q4: read every 4th frame (no steps) → none
    recGaps: [[at(130) + 20, at(130) + 90]],
  });
  const fF = foundFrames(res, 'forager');
  const exp = [at(70), at(90), at(130), at(239.5)];
  check('P95/P94 forager entries', fF.join() === exp.join(),
    `found at min ${fF.map((f) => f / MIN).join(', ')} (expected 70 a, 90 c, 130 g, 239.5 h; not 80 b 15-s gap, 100 d never seen outside, 110 e unread before return, 120 f 20-s absence)`);
  const f10 = foundFrames(res, 'forager-absence10s');
  const exp10 = [70, 80, 90, 120, 130, 239.5].map(at);
  check('absence 10 s sensitivity', f10.join() === exp10.join(), `found at min ${f10.map((f) => f / MIN).join(', ')} (expected 70, 80 b: 15 s read outside before the return, 90, 120 f, 130, 239.5; not 100 d, 110 e)`);
  const fs = S(res, 'forager');
  const gapRow = fs.dropped.find((d) => d.f === at(130));
  const edgeRow = fs.dropped.find((d) => d.f === at(239.5));
  check('recording gap > 30 s and block edge drop events', gapRow?.reason === 'gap' && edgeRow?.reason === 'edge', `min 130: ${gapRow?.reason}, min 239.5: ${edgeRow?.reason}; counts ${JSON.stringify(fs.counts)}`);
  const fQ = foundFrames(res, 'queen');
  check('P95 queen onsets', fQ.join() === [at(75), at(95), at(115)].join(),
    `found at min ${fQ.map((f) => f / MIN).join(', ')} (expected 75 q1, 95 q3 8-s gap, 115 q5 read every frame; not 85 q2 15-s gap, 105 q4 read every 4th frame, no steps)`);
  // Stillness shorter than 2 min: the queen also moves 90 s before an onset.
  const res2 = simulate({ label: 'p95b', nN, nF: 2, queen: true, g0: at(60), g1: at(240), level: () => 0.3, mode: 'random', seed: 6, onsets: [at(100) - fr(90), at(100), at(150)] });
  const q2 = foundFrames(res2, 'queen');
  const q2s = foundFrames(res2, 'queen-still1min');
  check('stillness 2 min / 1 min', !q2.includes(at(100)) && q2.includes(at(150)) && q2s.includes(at(100)),
    `primary found at min ${q2.map((f) => r6(f / MIN)).join(', ')} (not 100: moved 90 s before); 1-min stillness found at ${q2s.map((f) => r6(f / MIN)).join(', ')} (includes 100)`);
  // Residence sensitivity: an entry followed by an outside read 10 s later is not kept.
  const res3 = simulate({ label: 'res', nN, nF: 2, queen: false, g0: at(60), g1: at(240), level: () => 0.3, mode: 'random', seed: 7,
    entries: [{ f: at(100), ant: nN }, { f: at(150), ant: nN }, { f: at(150) + fr(10) + 10, ant: nN, outS: 5 }] });
  const rr = foundFrames(res3, 'forager-residence30s');
  check('residence 30 s sensitivity', rr.includes(at(100)) && !rr.includes(at(150)) && foundFrames(res3, 'forager').includes(at(150)),
    `primary ${foundFrames(res3, 'forager').map((f) => r6(f / MIN)).join(', ')}; with residence ${rr.map((f) => r6(f / MIN)).join(', ')} (150 dropped: outside read 10 s later)`);
  check('P95 colonies self-check', res.selfCheck.equal && res2.selfCheck.equal && res3.selfCheck.equal, 'equal');
}

// ---------------------------------------------------------------------------------------------------------------
// 3. The event ant is excluded at the event and at its control times (P97): one forager makes every entry; it never
// moves (A) or moves on every frame (B); everything else is the same draws.
{
  const nN = 20;
  const entries = Array.from({ length: 20 }, (_, j) => ({ f: fr(3600 + 300 + j * 600), ant: nN }));
  const base = { label: 'p97', nN, nF: 6, queen: true, g0: fr(3600), g1: fr(4 * 3600), level: (g: number) => 0.3 + 0.1 * Math.sin(g / 700) + 0.05 * Math.sin(g / 97), mode: 'random' as const, seed: 11, entries };
  const A = S(simulate({ ...base, eventAntMove: 'never' }), 'forager');
  const B = S(simulate({ ...base, eventAntMove: 'always' }), 'forager');
  const ea = A.events as EventRow[];
  const eb = B.events as EventRow[];
  let same = ea.length === eb.length && ea.length > 0;
  let common = 0;
  let commonSame = 0;
  for (let k = 0; same && k < ea.length; k++) {
    const a = ea[k], b = eb[k];
    same = a.f === b.f && a.L === b.L && a.R === b.R && a.pre === b.pre && a.post === b.post;
    const cb = new Map((b.ctrl as Ctrl[]).map((c) => [c[0], c]));
    for (const c of a.ctrl as Ctrl[]) {
      const d = cb.get(c[0]);
      if (!d) continue;
      common++;
      if (c.every((v, j) => v === d[j])) commonSame++;
    }
  }
  check('P97 event ant excluded (event values)', same, `${ea.length} vs ${eb.length} matched events; L, R, A_pre, A_post identical: ${same}; e.g. L ${r6(ea[0]?.L)} / ${r6(eb[0]?.L)}`);
  check('P97 event ant excluded (control values)', common > 0 && common === commonSame, `${common} controls chosen in both runs, ${commonSame} with identical L, R, A_pre, A_post`);
  // Control: another forager (never an event ant) moving on every frame does change the event values.
  const D = S(simulate({ ...base, eventAntMove: 'never', alwaysMove: [nN + 1] }), 'forager');
  const changed = ea.filter((e, k) => (D.events as EventRow[])[k] && e.L !== (D.events as EventRow[])[k].L).length;
  check('P97 check is not vacuous', A.blocks[0].sdL !== B.blocks[0].sdL && changed > 0,
    `all-ant SD_L (scale, ant included) ${A.blocks[0].sdL} vs ${B.blocks[0].sdL}; a non-event forager moving on every frame changes the event L in ${changed} of ${ea.length} events`);
}

// ---------------------------------------------------------------------------------------------------------------
// 4. Matching tolerance and balance (deterministic; queen onsets; 11 identical colonies). Activity 0.3 everywhere,
// 0.6 for the first 30 s of each 10-min period (the candidates' spread); onsets at phase 600 of every period, the
// minute before each at 0.3 + Δ. With Δ = 0.15 SD_L the flat candidates (L 0.3) are acceptable and every control
// differs by ≈ 0.15 SD_L → balance fails → unresolved; with Δ = 0.3 SD_L no candidate is acceptable → unmatched.
{
  const P = 1200;
  const onsets = Array.from({ length: 24 }, (_, p) => p * P + 600);
  const mk = (delta: number) => (g: number) => {
    const ph = g % P;
    if (ph < 60) return 0.6;
    if (ph >= 480 && ph < 600) return 0.3 + delta;
    return 0.3;
  };
  const run = (delta: number, label: string) => simulate({ label, nN: 40, nF: 0, queen: true, g0: 0, g1: fr(4 * 3600), level: mk(delta), mode: 'det', onsets });
  const sd = S(run(0, 'sd'), 'queen').blocks[0].sdL;
  const bal = run(0.15 * sd, 'bal');
  const qb = S(bal, 'queen');
  const zs = (qb.events as EventRow[]).map((e) => e.dLz);
  const cols = Array.from({ length: 11 }, (_, i) => ({ ...bal, colony: `bal${i}` }));
  const rb = row(cols, 'queen', 200);
  check('balance > 0.1 → unresolved', rb.reading?.class === LABELS.unresolved && rb.reading.reason.startsWith('balance') && rb.balance.L > 0.1 && rb.balance.L <= 0.2,
    `SD_L ${r6(sd)}; matched ${qb.counts.matched}/${qb.counts.found}, per-event ΔL/SD_L ${r6(Math.min(...zs))}–${r6(Math.max(...zs))}; balance L ${r6(rb.balance.L)}, R ${r6(rb.balance.R)}; ${rb.contributing} colonies; reading "${rb.reading?.label}" (${rb.reading?.reason})`);
  const tol = run(0.3 * sd, 'tol');
  const qt = S(tol, 'queen');
  check('all candidates outside 0.2 SD → unmatched', qt.counts.found > 0 && qt.counts.unmatched === qt.counts.found - qt.counts.edge - qt.counts.gap && qt.counts.matched === 0,
    `found ${qt.counts.found}, edge ${qt.counts.edge}, gap ${qt.counts.gap}, unmatched ${qt.counts.unmatched}, matched ${qt.counts.matched}; SD_L ${r6(qt.blocks[0].sdL)} (same scale: ${qt.blocks[0].sdL === sd})`);
}

// ---------------------------------------------------------------------------------------------------------------
// 5. Stochastic cases, 22 colonies (blocks 06-10 and 10-14, 24 nurses, 12 foragers, a queen; activity 0.3 + an AR(1)
// background per 10 s, ρ 0.6, SD 0.08; in each block events every 16 min from 10 min after its start, alternating
// forager entry / queen onset, 14 of each type in all; a sparse colony keeps only 4 events of that type). Injected: +0.08 over [f, f + 1 min) ("rise"), over [f − 3 min, f + 1 min)
// ("prerise"), or none.
function colony(ci: number, seedCase: number, inj: 'rise' | 'prerise' | 'none', denseF: boolean, denseQ: boolean): ColonyResult {
  const g0 = 0;
  const g1 = fr(8 * 3600);
  const rb = RNG.stream(0x5e1b, seedCase, ci);
  const nCh = Math.ceil((g1 - g0) / fr(10)) + 1;
  const bg = new Float64Array(nCh);
  let v = 0;
  for (let k = 0; k < nCh; k++) { v = 0.6 * v + 0.08 * Math.sqrt(1 - 0.36) * rb.gauss(); bg[k] = v; }
  const times = Array.from({ length: 28 }, (_, j) => fr(Math.floor(j / 14) * 4 * 3600 + 600 + (j % 14) * 960));
  let nf = 0, nq = 0;
  const fE: number[] = [], qE: number[] = [];
  times.forEach((t, j) => {
    if (j % 2 === 0) { if (denseF || nf < 4) fE.push(t); nf++; }
    else { if (denseQ || nq < 4) qE.push(t); nq++; }
  });
  const ev = [...fE, ...qE];
  const [a, b] = inj === 'rise' ? [0, fr(60)] : inj === 'prerise' ? [-fr(180), fr(60)] : [0, 0];
  const level = (g: number) => {
    let l = 0.3 + bg[Math.floor((g - g0) / fr(10))];
    for (const f of ev) if (g >= f + a && g < f + b) l += 0.08;
    return l;
  };
  return simulate({ label: `syn${ci}`, nN: 24, nF: 12, queen: true, g0, g1, level, mode: 'random', seed: 1000 * seedCase + ci,
    entries: fE.map((f, j) => ({ f, ant: 24 + (j % 12) })), onsets: qE });
}
const t0 = Date.now();
if (process.argv.includes('--write-dir')) {
  // For testing the aggregator CLI: the 22 colonies of the first stochastic case as per-colony files (meta as triggers.ts).
  const dir = process.argv[process.argv.indexOf('--write-dir') + 1];
  const cols = Array.from({ length: 22 }, (_, ci) => colony(ci, 1, 'rise', ci < 11, true));
  cols.forEach((c, ci) => writeJson(`${dir}/colony${String(900 + ci)}.json`, { meta: { design: DESIGN, md5: md5s(), command: 'triggersSyn --write-dir' }, ...c }));
  const r = aggregate(cols);
  console.log(`wrote ${cols.length} files; in memory: forager "${r.primary.forager.reading?.label}" DiD ${r6(r.primary.forager.did.est)}, queen "${r.primary.queen.reading?.label}" DiD ${r6(r.primary.queen.did.est)}`);
  process.exit(0);
}
if (process.argv.includes('--dump-quorum')) {
  // Quorum check (D219): for two stochastic cases (those of the main suite), each colony's frame stream exactly as
  // ColonyTriggers.frame() receives it (captured by the frame tap in simulate()), and, separately, this
  // implementation's per-colony results and aggregate (primary readings uncalibrated). Then a round-trip check: each
  // frame file is re-read and fed to a fresh ColonyTriggers; its result must equal the stored one.
  //   npx vite-node scripts/scratch/triggersSyn.ts --dump-quorum [--dir logs/partd2/quorum]
  //   frames/<case>/syn<ci>.txt.gz: line 1 JSON {"label","roles","tags","case","colony"} (roles and tags indexed by
  //     ant id); then per frame "f t n" and n groups "id x y in" (in 1 or 0), numbers as String(x).
  //   frames/<case>/MANIFEST.json; first/<case>/syn<ci>.json (ColonyResult + meta); first/<case>/aggregate.json.
  if (failures) throw new Error(`${failures} deterministic check(s) failed: no dump`);
  const dir = arg('--dir', 'logs/partd2/quorum');
  const md5 = { ...md5s(), ...md5Of(['scripts/scratch/triggersSyn.ts']) };
  let commit = 'unknown';
  try { commit = execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { /* none */ }
  const command = `npx vite-node scripts/scratch/triggersSyn.ts ${process.argv.slice(2).join(' ')}`;
  const sha256 = (b: Buffer) => crypto.createHash('sha256').update(b).digest('hex');
  // Same colonies as the main suite's stochastic cases: rise = runCase(1, 'rise', ci < 11 dense forager, dense queen);
  // none3 = runCase(3, 'none', all dense), also the --null-seeds 3-3 case.
  const cases = [
    { name: 'rise', seedCase: 1, inj: 'rise' as const, dense: (ci: number): [boolean, boolean] => [ci < 11, true] },
    { name: 'none3', seedCase: 3, inj: 'none' as const, dense: (): [boolean, boolean] => [true, true] },
  ];
  type Hdr = { label: string; roles: AntRole[]; tags: number[]; case: string; colony: number };
  const parseFrames = (buf: Buffer) => {
    const lines = zlib.gunzipSync(buf).toString('utf8').split('\n');
    if (lines[lines.length - 1] === '') lines.pop();
    const hdr = JSON.parse(lines[0]) as Hdr;
    const ct = new ColonyTriggers(hdr.label, hdr.roles, hdr.tags);
    for (let k = 1; k < lines.length; k++) {
      const tok = lines[k].split(' ');
      const n = Number(tok[2]);
      if (tok.length !== 3 + 4 * n) throw new Error(`frame line ${k + 1}: ${tok.length} tokens for n ${n}`);
      const ids: number[] = [], xs: number[] = [], ys: number[] = [], ins: boolean[] = [];
      for (let q = 0; q < n; q++) {
        const o = 3 + 4 * q;
        ids.push(Number(tok[o])); xs.push(Number(tok[o + 1])); ys.push(Number(tok[o + 2]));
        if (tok[o + 3] !== '1' && tok[o + 3] !== '0') throw new Error(`frame line ${k + 1}: in "${tok[o + 3]}"`);
        ins.push(tok[o + 3] === '1');
      }
      ct.frame(Number(tok[0]), Number(tok[1]), ids, xs, ys, ins);
    }
    return { hdr, res: ct.finish(), frames: lines.length - 1 };
  };
  let rtFail = 0;
  for (const cs of cases) {
    const fDir = `${dir}/frames/${cs.name}`;
    const rDir = `${dir}/first/${cs.name}`;
    fs.mkdirSync(fDir, { recursive: true });
    fs.mkdirSync(rDir, { recursive: true });
    const seedsOf = (ci: number) => ({ colony: ci, seedCase: cs.seedCase, simulateSeed: 1000 * cs.seedCase + ci, backgroundStream: [0x5e1b, cs.seedCase, ci], denseF: cs.dense(ci)[0], denseQ: cs.dense(ci)[1] });
    const caseMeta = { case: cs.name, seedCase: cs.seedCase, injection: cs.inj, colonies: 22 };
    const files: Record<string, string> = {};
    const cols: ColonyResult[] = [];
    for (let ci = 0; ci < 22; ci++) {
      const parts: string[] = [];
      let buf: string[] = [];
      let label = '';
      frameTap = {
        begin(lb, roles, tags) { label = lb; buf.push(JSON.stringify({ label: lb, roles, tags, case: cs.name, colony: ci } satisfies Hdr)); },
        frame(f, t, ids, xs, ys, ins) {
          let ln = `${String(f)} ${String(t)} ${ids.length}`;
          for (let q = 0; q < ids.length; q++) ln += ` ${String(ids[q])} ${String(xs[q])} ${String(ys[q])} ${ins[q] ? 1 : 0}`;
          buf.push(ln);
          if (buf.length >= 4096) { parts.push(buf.join('\n')); buf = []; }
        },
      };
      const res = colony(ci, cs.seedCase, cs.inj, ...cs.dense(ci));
      frameTap = null;
      if (buf.length) parts.push(buf.join('\n'));
      const gz = zlib.gzipSync(Buffer.from(parts.join('\n') + '\n', 'utf8'), { level: 6 });
      const fp = `${fDir}/syn${ci}.txt.gz`;
      fs.writeFileSync(fp, gz);
      files[`syn${ci}.txt.gz`] = sha256(gz);
      const meta = { design: DESIGN, md5, ...caseMeta, seeds: seedsOf(ci), frameFile: fp, frameSha256: files[`syn${ci}.txt.gz`], command, commit, date: new Date().toISOString() };
      const rp = `${rDir}/syn${ci}.json`;
      writeJson(rp, { meta, ...res });
      cols.push(res);
      // Round trip: the frame file as written, re-read from disk, through a fresh ColonyTriggers.
      const back = parseFrames(fs.readFileSync(fp));
      const stored = JSON.parse(fs.readFileSync(rp, 'utf8')) as { meta: unknown } & ColonyResult;
      const { meta: _m, ...storedRes } = stored;
      const okMem = isDeepStrictEqual(back.res, res);
      const okFile = isDeepStrictEqual(JSON.parse(JSON.stringify(back.res)), storedRes);
      const okHdr = back.hdr.label === label && back.hdr.colony === ci && back.hdr.case === cs.name;
      if (!(okMem && okFile && okHdr)) rtFail++;
      runProgress(`${cs.name} syn${ci}: ${back.frames} frames, round trip ${okMem && okFile && okHdr ? 'equal' : `DIFFERS (in memory ${okMem}, stored ${okFile}, header ${okHdr})`}`);
      if (!(okMem && okFile && okHdr)) console.log(`ROUND TRIP DIFFERS ${cs.name} syn${ci}: in memory ${okMem}, stored file ${okFile}, header ${okHdr}`);
    }
    writeJson(`${fDir}/MANIFEST.json`, { design: DESIGN, md5, ...caseMeta, seeds: Array.from({ length: 22 }, (_, ci) => seedsOf(ci)), files, command, commit, date: new Date().toISOString() });
    const agg = aggregate(cols);
    writeJson(`${rDir}/aggregate.json`, { meta: { design: DESIGN, md5, ...caseMeta, seeds: Array.from({ length: 22 }, (_, ci) => seedsOf(ci)), calibration: 'none: primary readings by read() without a false-positive rate', draws: DRAWS, seed: SEED, frameManifest: `${fDir}/MANIFEST.json`, command, commit, date: new Date().toISOString() }, ...agg });
    for (const k of PRIMARY) console.log(`${cs.name} ${k}: "${agg.primary[k].reading?.label}" (${agg.primary[k].reading?.reason}); DiD ${r6(agg.primary[k].did.est)}`);
  }
  console.log(`round trip: ${rtFail ? `${rtFail} colony file(s) DIFFER` : `all ${22 * cases.length} colonies equal`} (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
  process.exit(rtFail ? 1 : 0);
}
if (process.argv.includes('--null-seeds')) {
  // Amendment 2 calibration (D216, P100): the no-rise case (case 5 with no injection, 22 dense colonies) over seeds
  // a-b, through the same per-colony class and statistics. Writes per seed and type the rise and DiD intervals,
  // whether the rise interval lies above 0, and the (uncalibrated) class; and per type the false-positive rate = share
  // of seeds whose rise interval lies above 0. The file is rewritten after every seed (complete: false until the
  // last), and only the small per-seed records are kept. Prints only the rates and the output path.
  //   npx vite-node scripts/scratch/triggersSyn.ts --null-seeds 1-100 --out logs/partd2/triggers-calibration.json
  const spec = process.argv[process.argv.indexOf('--null-seeds') + 1] ?? '';
  const m = /^(\d+)-(\d+)$/.exec(spec);
  if (!m || Number(m[2]) < Number(m[1])) throw new Error('--null-seeds a-b (a <= b)');
  const out = arg('--out', '');
  if (!out) throw new Error('--null-seeds needs --out <file>');
  if (failures) throw new Error(`${failures} deterministic check(s) failed: no calibration`);
  const seeds = Array.from({ length: Number(m[2]) - Number(m[1]) + 1 }, (_, k) => Number(m[1]) + k);
  let commit = 'unknown';
  try { commit = execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { /* none */ }
  const meta = { design: DESIGN, md5: md5Of(CAL_SCRIPTS), seeds, command: `npx vite-node scripts/scratch/triggersSyn.ts ${process.argv.slice(2).join(' ')}`, commit, date: new Date().toISOString(), draws: DRAWS, seed: SEED };
  const recs: Calibration['seeds'] = [];
  const iv = (x: { est: number; lo: number; hi: number }) => ({ est: x.est, lo: x.lo, hi: x.hi });
  const write = (complete: boolean) => {
    const { positives, rates } = fpRates(recs);
    const file: Calibration = { meta, complete, n: recs.length, seeds: recs, positives, falsePositiveRate: rates };
    writeJson(out, file);
    return { positives, rates };
  };
  for (const sc of seeds) {
    const nu = aggregate(Array.from({ length: 22 }, (_, ci) => colony(ci, sc, 'none', true, true)));
    const rec: Calibration['seeds'][number] = { seed: sc };
    for (const k of PRIMARY) {
      const r = nu.primary[k];
      rec[k] = { rise: iv(r.rise!), riseAbove0: r.rise!.lo > 0, did: iv(r.did), class: r.reading!.class } satisfies CalSeedType;
    }
    recs.push(rec);
    write(recs.length === seeds.length);
    runProgress(`seed ${recs.length}/${seeds.length}`);
  }
  const { positives, rates } = write(true);
  console.log(`false-positive rate of the rise label over ${recs.length} seeds (${seeds[0]}-${seeds[seeds.length - 1]}): ${PRIMARY.map((k) => `${k} ${rates[k]} (${positives[k]}/${recs.length})`).join(', ')}`);
  console.log(`wrote ${out} (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
  process.exit(0);
}
const runCase = (seedCase: number, inj: 'rise' | 'prerise' | 'none', dense: (ci: number) => [boolean, boolean]) =>
  aggregate(Array.from({ length: 22 }, (_, ci) => colony(ci, seedCase, inj, ...dense(ci))));
const fmt = (x: { est: number; lo: number; hi: number }) => `${r6(x.est)} [${r6(x.lo)}, ${r6(x.hi)}]`;
const summary = (r: ReturnType<typeof aggregate>['primary'][string]) =>
  `${r.contributing} colonies, matched ${r.counts.matched}/${r.counts.found}; DiD ${fmt(r.did)}, post−pre ${fmt(r.pp)}, DiD−δ ${fmt(r.didMinusDelta)}, rise ${r.rise ? fmt(r.rise) : '-'}, balance L ${r6(r.balance.L)} R ${r6(r.balance.R)} → "${r.reading?.label}"`;
{
  const ex = runCase(1, 'rise', (ci) => [ci < 11, true]);
  const f = ex.primary.forager, q = ex.primary.queen;
  check('rise after events on 11 colonies → exceeds (forager)', f.reading?.label === LABELS.exceeds && f.contributing === 11, summary(f));
  check('rise after events on 22 colonies → exceeds (queen)', q.reading?.label === LABELS.exceeds, summary(q));
  check('self-checks in the stochastic colonies', ex.selfCheck.every((s) => s.equal), `${ex.selfCheck.filter((s) => s.equal).length}/22`);
  const iso = ex.isolated['forager-isolated'];
  const c5 = Object.values(ex.ctrl5min);
  check('5-min rows written beside the isolated rows, no class', c5.map((r) => r.name).join() === 'forager-ctrl5min,queen-ctrl5min' && c5.every((r) => r.reading === undefined && r.rise !== undefined) && !Object.keys(ex.descriptive).some((k) => k.includes('ctrl5min')) && Object.keys(ex).indexOf('ctrl5min') === Object.keys(ex).indexOf('isolated') + 1,
    c5.map((r) => `${r.name}: ${r.contributing} colonies, matched ${r.counts.matched}/${r.counts.found}, DiD ${fmt(r.did)}, rise ${r.rise ? fmt(r.rise) : '-'}, reading ${r.reading ? 'yes' : 'none'}`).join('; '));
  console.log(`      (descriptive) isolated forager entries: ${iso.contributing} colonies, DiD ${fmt(iso.did)}; overlap shares (matched) same-type ±1 min ${r6(f.overlap.matched.same1m)}, other type in windows ${r6(f.overlap.matched.otherW)}; W 20 s DiD ${fmt(ex.descriptive['forager-W20s'].did)}, W 5 min ${fmt(ex.descriptive['forager-W5min'].did)}`);
}
{
  const sp = runCase(2, 'rise', (ci) => [ci < 10, ci < 10]);
  check('fewer than 11 contributing colonies → unresolved (forager)', sp.primary.forager.reading?.class === LABELS.unresolved && sp.primary.forager.reading.reason.startsWith('support'), summary(sp.primary.forager));
  check('sparse queen support → unresolved (P89)', sp.primary.queen.reading?.class === LABELS.unresolved && sp.primary.queen.reading.reason.startsWith('support'), summary(sp.primary.queen));
}
{
  const nu = runCase(3, 'none', () => [true, true]);
  for (const k of ['forager', 'queen']) {
    const r = nu.primary[k];
    check(`no rise → DiD interval covers 0, not exceeds (${k})`, r.did.lo <= 0 && r.did.hi >= 0 && !r.reading!.class.startsWith('exceeds'), summary(r));
  }
}
{
  const pr = runCase(4, 'prerise', () => [true, true]);
  for (const k of ['forager', 'queen']) {
    const r = pr.primary[k];
    check(`rise from 3 min before → "preceded by a rise", not plain exceeds (${k})`, r.reading?.riseLabel === LABELS.rise && r.reading.label !== LABELS.exceeds && r.reading.label.startsWith(LABELS.rise), summary(r));
  }
  // Amendment 2 rule (P100): rate > 0.05 → rise reported as uncalibrated, class unchanged; rate 0.05 → label as before.
  const raw = { forager: pr.primary.forager.reading!, queen: pr.primary.queen.reading! };
  for (const [hi, lo] of [['forager', 'queen'], ['queen', 'forager']] as const) {
    const a = applyCalibration(structuredClone(pr), { [hi]: 0.06, [lo]: 0.05 });
    const rh = a.primary[hi].reading!;
    const rl = a.primary[lo].reading!;
    check(`calibration rate 0.06 → uncalibrated, class unchanged (${hi}); 0.05 → label as before (${lo})`,
      rh.riseLabel === 'pre-event rise: uncalibrated (null false-positive rate 0.06)' && rh.class === raw[hi].class && rh.label === `${rh.riseLabel} (class: ${raw[hi].class})` && !rh.label.includes(LABELS.rise) && rh.riseCalibrated === false
      && rl.riseLabel === LABELS.rise && rl.class === raw[lo].class && rl.label === raw[lo].label && rl.riseCalibrated === true,
      `${hi}: "${rh.label}" (uncalibrated: "${raw[hi].label}"); ${lo}: "${rl.label}" (uncalibrated: "${raw[lo].label}")`);
  }
  // The rate decides whatever the rise interval: lo > 0 (this case) and lo set to −1 are both uncalibrated at 0.06.
  const nr = read(pr.primary.forager, 0.06);
  check('uncalibrated text whatever the rise interval', nr.riseLabel === uncalibratedLabel(0.06) && read({ ...pr.primary.forager, rise: { ...pr.primary.forager.rise!, lo: -1 } }, 0.06).riseLabel === uncalibratedLabel(0.06) && read({ ...pr.primary.forager, rise: { ...pr.primary.forager.rise!, lo: -1 } }, 0.05).riseLabel === null,
    `rise lo > 0 at 0.06: "${nr.riseLabel}"; rise lo −1 at 0.06: uncalibrated, at 0.05: no label`);
  // Refusals: a calibration file (100 seeds, 6 / 5 positives) is accepted with the current md5s; refused with a changed
  // md5 of triggersCore.ts or triggersStats.ts, or with 99 seeds.
  const fake = (n: number, md5: Record<string, string>): Calibration => {
    const one = (pos: boolean): CalSeedType => ({ rise: { est: 0, lo: pos ? 0.001 : -0.001, hi: 0.01 }, riseAbove0: pos, did: { est: 0, lo: -0.01, hi: 0.01 }, class: LABELS.small });
    const seeds = Array.from({ length: n }, (_, k) => ({ seed: k + 1, forager: one(k < 6), queen: one(k < 5) }));
    const { positives, rates } = fpRates(seeds);
    return { meta: { design: DESIGN, md5, seeds: seeds.map((x) => x.seed), command: 'synthetic', commit: '', date: '', draws: DRAWS, seed: SEED }, complete: true, n, seeds, positives, falsePositiveRate: rates };
  };
  const cur = md5Of(CAL_SCRIPTS);
  const refused = (c: Calibration): string => { try { calibrationRates(c); return ''; } catch (e) { return (e as Error).message; } };
  const okRates = calibrationRates(fake(100, cur));
  const chain = applyCalibration(structuredClone(pr), okRates).primary;
  const msgs = [refused(fake(100, { ...cur, [CAL_MUST_MATCH[0]]: '0'.repeat(32) })), refused(fake(100, { ...cur, [CAL_MUST_MATCH[1]]: '0'.repeat(32) })), refused(fake(99, cur))];
  check('calibration accepted with current md5s and 100 seeds; refused with a changed md5 or 99 seeds',
    okRates.forager === 0.06 && okRates.queen === 0.05 && chain.forager.reading!.riseLabel === uncalibratedLabel(0.06) && chain.queen.reading!.riseLabel === LABELS.rise && msgs.every(Boolean) && refused(fake(100, { ...cur, 'scripts/scratch/triggersSyn.ts': 'x' })) === '',
    `rates ${JSON.stringify(okRates)}; refusals: ${msgs.map((x) => `"${x}"`).join('; ')}; a changed md5 of triggersSyn.ts only: accepted`);
}
console.log(`stochastic cases: ${((Date.now() - t0) / 1000).toFixed(1)} s; settings per colony ${SETTINGS.length}`);
console.log(failures ? `${failures} check(s) FAILED` : 'all checks passed');
process.exit(failures ? 1 : 0);
