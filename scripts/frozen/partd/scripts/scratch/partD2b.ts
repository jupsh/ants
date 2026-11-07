// Scratch (not committed): Part D Stage 2b reader (D158 as amended by D159; D174 Part B, approved D178; P47, P64).
// The 20 assessment rows per arm (every calibrated member, the controls Eu and El20, base) against the data, with
// D174 Part B's support, missing-statistic and Monte Carlo rules and D117's equivalence; then Stage 3a (reproduction)
// and the descriptive rows (D158's list). Stages, writing logs/partd2/assess/:
//   files  per run: the S2 audit file (s2AuditFile.ts unchanged, 100 J and A draws; set index 40 + member index, base
//          51, Eu 52, El20 53; file key run · 100 + colony) and the S3 audit file (s3Audit.py unchanged, via s3Snap2b.py
//          with the run's onset snapshots); spreadAgg.py's per-colony dump (S3-ρ).
//   ext --arms a,b  the one MC extension (D174 Part B): J draws 100–399 for those arms' files and the data's (set
//          index 0, file key = colony: the S2 audit's own streams), into s2/ and s2data/.
//   read   the rows. If an S2-J row of an arm is not MC-resolved at 100 draws and that arm has no extension, it writes
//          ext-needed.json (the arms only), prints nothing else and exits 3; run `ext`, then `read` again.
// Rows (D158): S1 = D_w in the 8 cells other than all-ants 1 min (±20 % of the data value); S2 = C in 5 bands; S2-J =
// C − Ê_J[C] in the same bands (±0.015 absolute); S3₁, S3₂ (±1.0 frame per 10 mm).
//   Colony values: a colony's two runs pooled (S1: block sums as partC.ts; S2: accumulators summed, draw d with draw d,
//   as s2AuditRead.ts; S3: episodes concatenated, ≥ 5 with the statistic defined, as s3AuditRead.py). Data: the light
//   clock blocks (S1), the S2 audit's data files, the Stage 0 S3 audit's per-colony values.
//   Estimable: S1 a finite D_w; S2 and S2-J colonyStat(…).est at 100 draws (D145 item 5: every band ≥ 100 pair-bins with
//   finite positive Σx², Σy²; ≥ 90 % valid J draws); S3 the Stage 0 rule.
//   Support (Part B): per row, the colonies estimable in the data and in every assessed arm; below 15, each arm uses
//   data ∩ arm ("per-arm support"). A row is missing for an arm if its support has < 15 colonies or the statistic is
//   undefined; a missing row is never equivalent or outside and blocks that arm's joint reproduction.
//   Equivalence (D117 as partC.ts): sim − data, sim and data colonies resampled independently (2,000 draws), 90 % CI
//   [5 %, 95 %]: inside ±tol equivalent, beyond outside, else unresolved.
//   MC (S2-J rows): each CI endpoint's MC SE from 200 resamples of every support colony's stored valid J draws (data's
//   and arm's), the colony resamples held fixed (D147 item 3). Resolved if each endpoint is > 2 MC SE from the
//   nearest of ±0.015; else the arm and the data are extended once to 400 draws, and the arm's S2-J rows are all
//   recomputed at 400 on the same support; still not resolved: "unresolved (MC)". A support colony with < 90 % valid
//   draws at 400 leaves that row "unresolved (MC)".
// --dry: Part C's base, Eu and El20 separation files (already read, D156, D166) as stand-in arms, on the S2 audit's own
//   set indices and file keys (1–3, 2 · colony + run), into logs/partd2/dry; read checks that the S2 accumulators and
//   the S3 per-colony values reproduce the S2 audit's files and the Stage 0 S3 audit exactly, and prints only that.
//   npx vite-node scripts/scratch/partD2b.ts files|ext|read|selftest [--arms a,b] [--dry] [--jobs n]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { combineOracleStats, oracleSummary } from '../../src/sim/analysis/oracleStats';
import { RNG } from '../../src/sim/core/rng';
import { arg, numArg, writeJson } from '../lib';
import { ACC_LEN, addInto, at, C, estimable, KINDS, L, NB } from './s2Audit';
import { colonyKey, colonyStat, MC_K, MC_N, NULL_VALID } from './s2AuditGate';
import { MEMBERS } from './partDMembers';

const DRY = process.argv.includes('--dry');
const OUT = DRY ? 'logs/partd2/dry' : 'logs/partd2/assess';
const NCOL = 22;
const JOBS = numArg('--jobs', Math.max(1, os.cpus().length - 1));
const TAGP = 'pd';
const D_MAIN = 100;
const D_EXT = 400;
const MIN_COL = 15;
const B = 2000;
const SEED_EQ = 0xd2b0; // sim-side colony resamples; data side SEED_EQ + 1; (row, arm) per stream
const SEED_MC = 0xd2b2; // (m, set index, colony)
const SEED_DESC = 0xd2bd;
const MIN_EP = 5;
const readJ = (f: string) => JSON.parse(fs.readFileSync(f, 'utf8'));
const mean = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
const sd = (v: number[]) => { const m = mean(v); return Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / (v.length - 1)); };
// partC.ts's quantile (D117 as read in Part C).
const q = (v: number[], p: number) => { const w = v.filter(Number.isFinite).sort((a, b) => a - b); return w.length ? w[Math.min(w.length - 1, Math.floor(p * w.length))] : NaN; };

// ---- arms ----
interface Arm { id: string; family: 'T' | 'D' | 'control' | 'base'; setIdx: number; tag: (r: number) => string; fileKey: (r: number, c: number) => number; strength?: number }
function arms(): Arm[] {
  if (DRY) return ['base', 'Eu', 'El20'].map((id, i) => ({ id, family: id === 'base' ? 'base' : 'control', setIdx: i + 1, tag: (r: number) => `pc-sep-${id}-r${r}`, fileKey: (r: number, c: number) => 2 * c + r }));
  const fk = (r: number, c: number) => r * 100 + c;
  const tag = (id: string) => (r: number) => `${TAGP}-as-${id}-r${r}`;
  const cal = MEMBERS.filter((m) => readJ(`logs/partd2/verify-${m.id}.json`).calibrated);
  return [
    ...cal.map((m) => ({ id: m.id, family: m.family, setIdx: 40 + MEMBERS.indexOf(m), tag: tag(m.id), fileKey: fk, strength: readJ(`logs/partd2/calib-${m.id}.json`).strength as number })),
    { id: 'Eu', family: 'control' as const, setIdx: 52, tag: tag('Eu'), fileKey: fk },
    { id: 'El20', family: 'control' as const, setIdx: 53, tag: tag('El20'), fileKey: fk },
    { id: 'base', family: 'base' as const, setIdx: 51, tag: tag('base'), fileKey: fk },
  ];
}
const runFile = (a: Arm, r: number, c: number) => `logs/short/${a.tag(r)}-c${c}.json`;

// ---- process pool ----
const done = (f: string) => { try { JSON.parse(fs.readFileSync(f, 'utf8')); return true; } catch { return false; } };
let active = 0;
const waiting: (() => void)[] = [];
const acquire = () => (active < JOBS ? (active++, Promise.resolve()) : new Promise<void>((r) => waiting.push(r)));
const release = () => { const w = waiting.shift(); if (w) w(); else active--; };
async function runJobs(jobs: { out: string; cmd: string; args: string[] }[]): Promise<void> {
  let failed = 0;
  await Promise.all(jobs.filter((j) => !done(j.out)).map(async (j) => {
    await acquire();
    try {
      const code = await new Promise<number>((res) => spawn(j.cmd, j.args, { stdio: ['ignore', 'ignore', 'inherit'] }).on('exit', (x) => res(x ?? 1)));
      if (code !== 0 || !done(j.out)) failed++;
    } finally {
      release();
    }
  }));
  if (failed) throw new Error(`${failed} jobs failed`);
}
const base = (f: string) => f.split('/').pop()!.replace(/\.json$/, '');
const s2Job = (f: string, set: string, setIdx: number, key: number, draws: string, nulls: string, dir: string) => ({
  out: `${dir}/${set}--${base(f)}${draws === '0:100' ? '' : `--d${draws.replace(':', '-')}`}.json`,
  cmd: 'npx', args: ['vite-node', 'scripts/scratch/s2AuditFile.ts', '--file', f, '--set', set, '--set-idx', String(setIdx), '--file-key', String(key), '--draws', draws, '--nulls', nulls, '--out', dir],
});

async function files(): Promise<void> {
  for (const d of ['s2', 's3', 'snap']) fs.mkdirSync(`${OUT}/${d}`, { recursive: true });
  const jobs: { out: string; cmd: string; args: string[] }[] = [];
  for (const a of arms())
    for (let r = 0; r < 2; r++)
      for (let c = 0; c < NCOL; c++) {
        const f = runFile(a, r, c);
        jobs.push(s2Job(f, a.id, a.setIdx, a.fileKey(r, c), '0:100', 'J,A', `${OUT}/s2`));
        jobs.push({ out: `${OUT}/s3/${a.id}--${base(f)}.json`, cmd: 'python3', args: ['-I', 'scripts/scratch/s3Snap2b.py', `${a.id}=${f}`, '--out', `${OUT}/s3`, '--snapdir', `${OUT}/snap`, ...(DRY ? [] : ['--require-snap'])] });
      }
  // S3-ρ (carried, descriptive): spreadAgg.py's per-colony Test A dump; the data's is Part C's (logs/partc).
  if (!DRY) jobs.push({ out: `${OUT}/spread-dump.json`, cmd: 'sh', args: ['-c', `python3 -I scripts/scratch/spreadAgg.py ${arms().map((a) => `'${a.id}=logs/short/${a.tag(9).replace('-r9', '-r[01]')}-c*.json'`).join(' ')} --phase light --dump ${OUT}/spread-dump.json > ${OUT}/spread.txt 2>&1`] });
  await runJobs(jobs);
  console.log(`files: ${jobs.length} jobs done in ${OUT}`);
}

async function ext(): Promise<void> {
  const want = arg('--arms', '').split(',').filter(Boolean);
  const as = arms().filter((a) => want.includes(a.id));
  if (!want.length || as.length !== want.length) throw new Error(`ext --arms a,b: unknown arm in ${want}`);
  fs.mkdirSync(`${OUT}/s2data`, { recursive: true });
  const jobs = [
    ...as.flatMap((a) => [0, 1].flatMap((r) => Array.from({ length: NCOL }, (_, c) => s2Job(runFile(a, r, c), a.id, a.setIdx, a.fileKey(r, c), `${D_MAIN}:${D_EXT}`, 'J', `${OUT}/s2`)))),
    ...Array.from({ length: NCOL }, (_, c) => s2Job(`logs/ydist/data-c${c}.json`, 'data', 0, c, `${D_MAIN}:${D_EXT}`, 'J', `${OUT}/s2data`)),
  ];
  await runJobs(jobs);
  console.log(`extension: ${as.map((a) => a.id).join(', ')} and the data to ${D_EXT} draws`);
}

// ---- S2 accumulators per set and colony (as s2AuditRead.ts: main files, then extensions in draw order) ----
interface S2Col { obs: Float64Array; same: Float64Array; ref: Float64Array; blockMean: Float64Array; J: Float64Array[]; A: Float64Array[]; nFiles: number }
interface S2File { set: string; colony: string; draws: [number, number]; obs?: number[]; same?: number[]; ref?: number[]; blockMean?: number[]; J?: number[][]; A?: number[][] }
function loadS2(paths: string[]): Map<string, S2Col> {
  const fsx: S2File[] = paths.map(readJ).sort((a, b) => a.draws[0] - b.draws[0]);
  const zero = () => new Float64Array(ACC_LEN);
  const m = new Map<string, S2Col>();
  const count = new Map<string, number[]>();
  for (const f of fsx) {
    if (!m.has(f.colony)) { m.set(f.colony, { obs: zero(), same: zero(), ref: zero(), blockMean: zero(), J: [], A: [], nFiles: 0 }); count.set(f.colony, []); }
    const c = m.get(f.colony)!;
    if (f.draws[0] === 0) {
      c.nFiles++;
      for (const k of ['obs', 'same', 'ref', 'blockMean'] as const) addInto(c[k], f[k]!);
      (f.A ?? []).forEach((acc, i) => { while (c.A.length <= i) c.A.push(zero()); addInto(c.A[i], acc); });
    }
    (f.J ?? []).forEach((acc, i) => {
      const d = f.draws[0] + i;
      while (c.J.length <= d) c.J.push(zero());
      addInto(c.J[d], acc);
      const n = count.get(f.colony)!;
      n[d] = (n[d] ?? 0) + 1;
    });
  }
  // Every file of a colony must carry every draw: a draw pooled from fewer files would be a different statistic.
  for (const [col, c] of m) count.get(col)!.forEach((n, d) => { if (n !== c.nFiles) throw new Error(`${fsx[0].set} ${col} J draw ${d}: ${n} of ${c.nFiles} files`); });
  return m;
}
const s2Paths = (dir: string, set: string, extOnly = false) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.startsWith(`${set}--`) && f.endsWith('.json') && (!extOnly || f.includes(`--d${D_MAIN}-${D_EXT}`))).map((f) => `${dir}/${f}`) : []);

// ---- statistics ----
type Values = Map<string, number>; // colony label → value (NaN = not estimable)
/** S2-J inputs for one band: the observed C and the valid draws' C, at the first nDraws draws. */
interface JCol { obs: number; draws: number[]; nValid: number; nDraws: number }
function jCol(c: S2Col, band: number, nDraws: number): JCol {
  const J = c.J.slice(0, nDraws);
  const ok = J.filter((d) => estimable(d, 0));
  return { obs: C(c.obs, 0, band), draws: ok.map((d) => C(d, 0, band)), nValid: ok.length, nDraws: J.length };
}
const s2Est = (c: S2Col | undefined) => !!c && colonyStat(c.obs, c.J.slice(0, D_MAIN), 0).est;

type Cls = 'equivalent' | 'outside' | 'unresolved' | 'unresolved (MC)' | 'missing';
interface Eq { lo: number; hi: number; cls: Cls }
/** D117: diff draws with fixed colony resamples; [5 %, 95 %]. */
function equiv(sv: number[], dv: number[], tol: number, iS: Int32Array[], iD: Int32Array[]): Eq {
  const diff = iS.map((I, b) => { let s = 0; for (const i of I) s += sv[i]; let d = 0; for (const i of iD[b]) d += dv[i]; return s / I.length - d / iD[b].length; });
  const lo = q(diff, 0.05);
  const hi = q(diff, 0.95);
  return { lo, hi, cls: lo > -tol && hi < tol ? 'equivalent' : lo > tol || hi < -tol ? 'outside' : 'unresolved' };
}
const resamples = (seed: number, row: number, arm: number, n: number) => { const r = RNG.stream(seed, row, arm); return Array.from({ length: B }, () => Int32Array.from({ length: n }, () => r.int(n))); };
/** MC SE of each endpoint: 200 resamples of each colony's valid draws, colony resamples fixed (D147 item 3). */
function mcSe(sJ: JCol[], dJ: JCol[], sIdx: number, sLab: string[], tol: number, iS: Int32Array[], iD: Int32Array[]): { seLo: number; seHi: number } {
  const re = (c: JCol, set: number, lab: string, m: number) => {
    const r = RNG.stream(SEED_MC, m, set, colonyKey(lab));
    let t = 0;
    for (let k = 0; k < c.draws.length; k++) t += c.draws[r.int(c.draws.length)];
    return c.obs - t / c.draws.length;
  };
  const los: number[] = [];
  const his: number[] = [];
  for (let m = 0; m < MC_N; m++) {
    const e = equiv(sJ.map((c, i) => re(c, sIdx, sLab[i], m)), dJ.map((c, i) => re(c, 0, sLab[i], m)), tol, iS, iD);
    los.push(e.lo);
    his.push(e.hi);
  }
  return { seLo: sd(los), seHi: sd(his) };
}
const mcResolved = (e: Eq, se: { seLo: number; seHi: number }, tol: number) => {
  const dist = (x: number) => Math.min(Math.abs(x - tol), Math.abs(x + tol));
  return dist(e.lo) > MC_K * se.seLo && dist(e.hi) > MC_K * se.seHi;
};

// ---- colony inputs ----
type SyncOut = Record<string, Record<string, { blocks: Record<string, { num: number; den: number }> }>>;
const GROUPS = ['all', 'nurse', 'forager'];
const WS = ['10', '120', '1200'];
const CELLS = GROUPS.flatMap((g) => WS.map((w) => `${g}.${w}`)).filter((c) => c !== 'all.120');
function dwOf(syncs: SyncOut[], data: boolean, cell: string): number {
  const [g, w] = cell.split('.');
  let num = 0;
  let den = 0;
  for (const s of syncs)
    for (const [k, b] of Object.entries(s[g][w].blocks)) {
      if (data && ![6, 10, 14].includes(Number(k) % 100)) continue;
      num += b.num;
      den += b.den;
    }
  return den ? num / den : NaN;
}
interface RunCol { label: string; dw: Record<string, number>; dw1: number; moving: number; s5: number; occ: number; oracleStats: unknown[]; oracleG: { n: number; sumPre: number; sumPost: number; sumInvPost: number; clipped: number }[] }
function loadRuns(a: Arm): RunCol[] {
  return Array.from({ length: NCOL }, (_, c) => {
    const fr = [0, 1].map((r) => { const j = readJ(runFile(a, r, c)); return { colony: j.colony as string, sync: j.sync as SyncOut, actBins: j.actBins as number[][], s5: j.s5, oracleStats: j.oracleStats, oracleG: j.oracleG }; });
    if (fr[0].colony !== fr[1].colony) throw new Error(`${a.id} c${c}: runs disagree on the colony`);
    const s5 = fr.map((f) => f.s5).filter(Boolean);
    return {
      label: fr[0].colony,
      dw: Object.fromEntries(CELLS.map((cell) => [cell, dwOf(fr.map((f) => f.sync), false, cell)])),
      dw1: dwOf(fr.map((f) => f.sync), false, 'all.120'),
      moving: fr.reduce((t, f) => t + f.actBins.reduce((u, b) => u + b[2], 0), 0) / fr.reduce((t, f) => t + f.actBins.reduce((u, b) => u + b[3], 0), 0),
      s5: s5.length ? mean(s5.map((x) => x.primary)) : NaN,
      occ: s5.length ? mean(s5.map((x) => x.occupancy)) : NaN,
      oracleStats: fr.map((f) => f.oracleStats).filter(Boolean),
      oracleG: fr.map((f) => f.oracleG).filter(Boolean),
    };
  });
}
/** Python ≥ 3.12's float sum (Neumaier compensated), so colony values equal s3AuditRead.py's bit for bit. */
function pySum(v: number[]): number {
  let s = 0;
  let c = 0;
  for (const x of v) {
    const t = s + x;
    c += Math.abs(s) >= Math.abs(x) ? s - t + x : x - t + s;
    s = t;
  }
  return s + c;
}
function s3Values(dir: string, set: string): { s1: Values; s2: Values } {
  const by = new Map<string, { s1: number | null; s2: number | null }[]>();
  // Sorted, as s3AuditRead.py's glob: episode order fixes the floating-point sums.
  for (const f of fs.readdirSync(dir).filter((x) => x.startsWith(`${set}--`)).sort()) {
    const j = readJ(`${dir}/${f}`);
    if (!by.has(j.colony)) by.set(j.colony, []);
    by.get(j.colony)!.push(...j.episodes);
  }
  const cv = (key: 's1' | 's2') => new Map([...by].map(([col, eps]) => { const v = eps.map((e) => e[key]).filter((x): x is number => x !== null && x !== undefined); return [col, v.length >= MIN_EP ? pySum(v) / v.length : NaN]; }));
  return { s1: cv('s1'), s2: cv('s2') };
}

// ---- read ----
interface RowDef { id: string; kind: 'S1' | 'S2' | 'S2J' | 'S3'; tol: (dataValue: number) => number; band?: number; key?: string }
const BANDS = ['< 5', '5–10', '10–20', '20–40', '≥ 40'];
const ROWS: RowDef[] = [
  ...CELLS.map((cell) => ({ id: `S1 D_w ${cell}`, kind: 'S1' as const, key: cell, tol: (d: number) => 0.2 * d })),
  ...BANDS.map((b, k) => ({ id: `S2 C ${b} mm`, kind: 'S2' as const, band: k, tol: () => 0.015 })),
  ...BANDS.map((b, k) => ({ id: `S2-J C − Ê_J ${b} mm`, kind: 'S2J' as const, band: k, tol: () => 0.015 })),
  { id: 'S3₁', kind: 'S3', key: 's1', tol: () => 1.0 },
  { id: 'S3₂', kind: 'S3', key: 's2', tol: () => 1.0 },
];

async function read(): Promise<void> {
  const AS = arms();
  // Inputs: data.
  const dataLab = Array.from({ length: NCOL }, (_, c) => readJ(`logs/short/data-c${c}.json`));
  const dataS1 = new Map(dataLab.map((j) => [j.colony as string, j.sync as SyncOut]));
  const dataS2 = loadS2([...s2Paths('logs/s2audit/files', 'data'), ...s2Paths(`${OUT}/s2data`, 'data', true)]);
  const s3d = readJ('logs/partd/s3audit.json').sets.data;
  const toV = (o: Record<string, number | null>) => new Map(Object.entries(o).map(([k, v]) => [k, v === null ? NaN : v]));
  const dataS3 = { s1: toV(s3d.S3_1.perColony), s2: toV(s3d.S3_2.perColony) };
  // Inputs: arms.
  const runs = Object.fromEntries(AS.map((a) => [a.id, loadRuns(a)]));
  const s2 = Object.fromEntries(AS.map((a) => [a.id, loadS2(s2Paths(`${OUT}/s2`, a.id))]));
  const s3 = Object.fromEntries(AS.map((a) => [a.id, s3Values(`${OUT}/s3`, a.id)]));
  const extended = new Set(AS.filter((a) => [...s2[a.id].values()].every((c) => c.J.length >= D_EXT)).map((a) => a.id));
  for (const a of AS) if (!extended.has(a.id) && [...s2[a.id].values()].some((c) => c.J.length > D_MAIN)) throw new Error(`${a.id}: a partial extension`);
  if (extended.size && ![...dataS2.values()].every((c) => c.J.length >= D_EXT)) throw new Error('arms extended without the data');

  await s3Desc(AS);
  if (DRY) dryChecks(AS, s2, s3);

  const labels = [...dataS1.keys()].sort();
  const value = (row: RowDef, set: string, lab: string): number => {
    if (row.kind === 'S1') return set === 'data' ? dwOf([dataS1.get(lab)!], true, row.key!) : runs[set].find((r) => r.label === lab)?.dw[row.key!] ?? NaN;
    if (row.kind === 'S3') return (set === 'data' ? dataS3 : s3[set])[row.key as 's1' | 's2'].get(lab) ?? NaN;
    const c = (set === 'data' ? dataS2 : s2[set]).get(lab);
    if (!s2Est(c)) return NaN;
    if (row.kind === 'S2') return C(c!.obs, 0, row.band!);
    const j = jCol(c!, row.band!, D_MAIN);
    return j.obs - mean(j.draws);
  };

  const needExt = new Set<string>();
  const rows = ROWS.map((row, ri) => {
    const est = (set: string) => new Set(labels.filter((l) => Number.isFinite(value(row, set, l))));
    const eD = est('data');
    const eA = Object.fromEntries(AS.map((a) => [a.id, est(a.id)]));
    const common = labels.filter((l) => eD.has(l) && AS.every((a) => eA[a.id].has(l)));
    const perArm = common.length < MIN_COL;
    const perArmOut = Object.fromEntries(AS.map((a, ai) => {
      const sup = perArm ? labels.filter((l) => eD.has(l) && eA[a.id].has(l)) : common;
      const dv = sup.map((l) => value(row, 'data', l));
      const sv = sup.map((l) => value(row, a.id, l));
      const dataValue = sup.length ? mean(dv) : NaN;
      const tol = row.tol(dataValue);
      const head = { support: sup.length, supportKind: perArm ? 'per-arm support' : 'common', data: dataValue, sim: sup.length ? mean(sv) : NaN, tol };
      if (sup.length < MIN_COL || !Number.isFinite(dataValue) || !Number.isFinite(head.sim) || !Number.isFinite(tol)) return [a.id, { ...head, cls: 'missing' as Cls, why: sup.length < MIN_COL ? `support ${sup.length} < ${MIN_COL}` : 'statistic undefined' }];
      const iS = resamples(SEED_EQ, ri, ai, sup.length);
      const iD = resamples(SEED_EQ + 1, ri, ai, sup.length);
      let e = equiv(sv, dv, tol, iS, iD);
      if (row.kind !== 'S2J') return [a.id, { ...head, diff: head.sim - dataValue, ci90: [e.lo, e.hi], cls: e.cls }];
      // MC rule (Part B): at 100 draws; if not resolved, at 400 when the arm is extended.
      const at = (n: number) => ({ s: sup.map((l) => jCol(s2[a.id].get(l)!, row.band!, n)), d: sup.map((l) => jCol(dataS2.get(l)!, row.band!, n)) });
      let J = at(D_MAIN);
      let se = mcSe(J.s, J.d, a.setIdx, sup, tol, iS, iD);
      const res100 = mcResolved(e, se, tol);
      let draws = D_MAIN;
      let invalid400: string[] = [];
      if (extended.has(a.id)) {
        J = at(D_EXT);
        draws = D_EXT;
        invalid400 = sup.filter((_, i) => J.s[i].nValid < NULL_VALID * J.s[i].nDraws || J.d[i].nValid < NULL_VALID * J.d[i].nDraws);
        const sv4 = J.s.map((c) => c.obs - mean(c.draws));
        const dv4 = J.d.map((c) => c.obs - mean(c.draws));
        e = equiv(sv4, dv4, tol, iS, iD);
        se = mcSe(J.s, J.d, a.setIdx, sup, tol, iS, iD);
        head.sim = mean(sv4);
        head.data = mean(dv4);
      } else if (!res100) needExt.add(a.id);
      const resolved = mcResolved(e, se, tol) && !invalid400.length;
      return [a.id, { ...head, diff: head.sim - head.data, ci90: [e.lo, e.hi], mcSe: [se.seLo, se.seHi], draws, resolvedAt100: res100, invalidAt400: invalid400, cls: resolved ? e.cls : ('unresolved (MC)' as Cls) }];
    }));
    return { row: row.id, common: common.length, perArmSupport: perArm, excluded: { data: labels.filter((l) => !eD.has(l)), ...Object.fromEntries(AS.map((a) => [a.id, labels.filter((l) => !eA[a.id].has(l))])) }, arms: perArmOut };
  });
  if (needExt.size) {
    writeJson(`${OUT}/ext-needed.json`, { arms: [...needExt], note: 'S2-J rows not MC-resolved at 100 draws (D174 Part B); run ext --arms, then read' });
    console.log(`extension needed (D174 Part B): ext --arms ${[...needExt].join(',')}${DRY ? ' (dry run)' : ''}`);
    process.exit(3);
  }

  // Stage 3a: joint reproduction per arm; a family reproduces if at least one calibrated member does.
  const repro = Object.fromEntries(AS.map((a) => {
    const by = (c: Cls) => rows.filter((r) => r.arms[a.id].cls === c).map((r) => r.row);
    const eq = by('equivalent');
    return [a.id, { family: a.family, joint: eq.length === ROWS.length, equivalent: eq.length, outside: by('outside'), unresolved: by('unresolved'), unresolvedMC: by('unresolved (MC)'), missing: by('missing') }];
  }));
  const fam = (f: 'T' | 'D') => { const m = AS.filter((a) => a.family === f); return { members: m.length, reproducing: m.filter((a) => repro[a.id].joint).map((a) => a.id), reproduces: m.some((a) => repro[a.id].joint) }; };
  const notCalibrated = MEMBERS.filter((m) => !AS.some((a) => a.id === m.id)).map((m) => m.id);

  const out = {
    design: 'D158 (D159); D174 Part B (D178)', arms: AS.map((a) => ({ id: a.id, family: a.family, strength: a.strength, setIdx: a.setIdx })), notCalibrated,
    extended: [...extended], rows, reproduction: repro, families: { T: fam('T'), D: fam('D') },
    descriptive: descriptive(AS, runs, s2, s3, dataS1, dataS2, dataS3, labels),
    disclosures: [
      'duration: data 8–12 h of light against 2 × 4 h simulated per colony',
      'phase: light only (S2 on complete light blocks; S3 on light onsets)',
      'Q03: the water-init warm-up shortcut, rechecked at C2 base only (D163); unrechecked for the members (P54, D173)',
      'P25 / P52: packing closed with failures accepted, not matched; F078 carried with the near-share deficit',
      'S3: Stage 0 gate G failed and stays on record (D130, P43); the S2 pass does not restore S3',
      'raw and corrected bands are dependent: their agreement is not ten independent confirmations (D159)',
      'S4 not recorded in the 2b runs (no --tb); reported as such',
    ],
    computedAt: new Date().toISOString(),
  };
  writeJson(`${OUT}/read.json`, out);
  if (DRY) { console.log(`dry run: ${rows.length} rows × ${AS.length} arms, extended ${[...extended].join(', ') || 'none'}; classes written to ${OUT}/read.json, not printed`); return; }
  for (const a of AS) { const r = repro[a.id]; console.log(`${a.id} (${a.family}): ${r.equivalent}/20 equivalent${r.joint ? ' — JOINT REPRODUCTION' : ''}; outside ${r.outside.join(', ') || '—'}; unresolved ${r.unresolved.join(', ') || '—'}; unresolved (MC) ${r.unresolvedMC.join(', ') || '—'}; missing ${r.missing.join(', ') || '—'}`); }
  for (const f of ['T', 'D'] as const) console.log(`family ${f}: ${out.families[f].reproduces ? `reproduces (${out.families[f].reproducing.join(', ')})` : 'no member reproduces'} of ${out.families[f].members} calibrated`);
  console.log(`not calibrated: ${notCalibrated.join(', ')}; written ${OUT}/read.json`);
}

// ---- descriptive rows (D158: reported, no rule); 95 % colony bootstrap ----
function boot(vals: number[], k: number) {
  const v = vals.filter(Number.isFinite);
  if (!v.length) return { n: 0, mean: NaN, ci95: [NaN, NaN] };
  const r = RNG.stream(SEED_DESC, k);
  const d = Array.from({ length: B }, () => mean(Array.from({ length: v.length }, () => v[r.int(v.length)])));
  return { n: v.length, mean: mean(v), ci95: [q(d, 0.025), q(d, 0.975)] };
}
const spearman = (x: number[], y: number[]) => {
  const ok = x.map((_, i) => i).filter((i) => Number.isFinite(x[i]) && Number.isFinite(y[i]));
  const rank = (v: number[]) => { const o = ok.map((i) => v[i]); const s = [...o].sort((a, b) => a - b); return o.map((z) => (s.indexOf(z) + s.lastIndexOf(z)) / 2); };
  const rx = rank(x), ry = rank(y);
  const mx = mean(rx), my = mean(ry);
  let n = 0, dx = 0, dy = 0;
  for (let k = 0; k < rx.length; k++) (n += (rx[k] - mx) * (ry[k] - my), dx += (rx[k] - mx) ** 2, dy += (ry[k] - my) ** 2);
  return { rho: n / Math.sqrt(dx * dy), n: ok.length };
};
function descriptive(AS: Arm[], runs: Record<string, RunCol[]>, s2: Record<string, Map<string, S2Col>>, s3: Record<string, { s1: Values; s2: Values }>, dataS1: Map<string, SyncOut>, dataS2: Map<string, S2Col>, dataS3: { s1: Values; s2: Values }, labels: string[]) {
  let k = 0;
  const sets = ['data', ...AS.map((a) => a.id)];
  const s2Of = (set: string) => (set === 'data' ? dataS2 : s2[set]);
  // S2 audit descriptives (as s2AuditRead.ts): L, Ê_J, S2_J, Ê_A, Ê_J − Ê_A, block-mean and reference classing, role pairs.
  const s2d = Object.fromEntries(sets.map((set) => {
    const m = s2Of(set);
    const est = labels.filter((l) => s2Est(m.get(l)));
    const st = (l: string, nl: 'J' | 'A', kd = 0) => colonyStat(m.get(l)!.obs, m.get(l)![nl].slice(0, D_MAIN), kd);
    const estA = est.filter((l) => m.get(l)!.A.length && st(l, 'A').est);
    const estRef = est.filter((l) => estimable(m.get(l)!.same) && estimable(m.get(l)!.ref));
    const share = (a: Float64Array, b: Float64Array) => { let x = 0, y = 0; for (let mm = 0; mm < NB; mm++) { x += at(a, 0, mm, 3); y += at(b, 0, mm, 3); } return x / y; };
    return [set, {
      estimable: est.length,
      L: boot(est.map((l) => st(l, 'J').L), k++), EJ: boot(est.map((l) => st(l, 'J').EJ), k++), S2J: boot(est.map((l) => st(l, 'J').S2J), k++),
      EA: boot(estA.map((l) => st(l, 'A').EJ), k++), EJminusEA: boot(estA.map((l) => st(l, 'J').EJ - st(l, 'A').EJ), k++),
      matched: { colonies: estRef.length, LsameMinusLref: boot(estRef.map((l) => L(m.get(l)!.same) - L(m.get(l)!.ref)), k++), share: boot(estRef.map((l) => share(m.get(l)!.same, m.get(l)!.obs)), k++) },
      blockMean: boot(est.filter((l) => estimable(m.get(l)!.blockMean)).map((l) => L(m.get(l)!.blockMean)), k++),
      kinds: KINDS.slice(1).map((kind, i) => { const ek = labels.filter((l) => m.get(l) && st(l, 'J', i + 1).est); return { kind, estimable: ek.length, L: boot(ek.map((l) => st(l, 'J', i + 1).L), k++), S2J: boot(ek.map((l) => st(l, 'J', i + 1).S2J), k++) }; }),
    }];
  }));
  // S3-ρ (carried): Test A per colony; the data's from Part C's dump (same code), the arms' from this stage's.
  const dump = { ...readJ('logs/partc/spread-dump.json'), ...(fs.existsSync(`${OUT}/spread-dump.json`) ? readJ(`${OUT}/spread-dump.json`) : {}) };
  const rho = Object.fromEntries(sets.map((set) => {
    const A = (dump[set] ?? []) as { colony: string; obs: number; n1: number; n2: number }[];
    const per = labels.map((l) => A.filter((x) => x.colony === l));
    const v = (f: (x: { obs: number; n1: number; n2: number }) => number) => per.map((p) => (p.length ? mean(p.map(f)) : NaN));
    return [set, { minusNull1: boot(v((x) => x.obs - x.n1), k++), minusNull2: boot(v((x) => x.obs - x.n2), k++) }];
  }));
  // S5, S6 (D_w at 1 min vs density), S7 (S3₂ vs density), mean moving fraction, realised multipliers (P21, P46).
  const s5data = labels.map((_, c) => readJ(`logs/short/s5data-c${c}.json`));
  const s5lab = new Map(s5data.map((j) => [j.colony as string, j.s5]));
  const per = (set: string) => labels.map((l) => (set === 'data'
    ? { s5: s5lab.get(l)?.primary ?? NaN, occ: s5lab.get(l)?.occupancy ?? NaN, dw1: dwOf([dataS1.get(l)!], true, 'all.120'), s32: dataS3.s2.get(l) ?? NaN }
    : (() => { const r = runs[set].find((x) => x.label === l)!; return { s5: r.s5, occ: r.occ, dw1: r.dw1, s32: s3[set].s2.get(l) ?? NaN }; })()));
  const sx = Object.fromEntries(sets.map((set) => { const p = per(set); return [set, { S5: boot(p.map((x) => x.s5), k++), S6: spearman(p.map((x) => x.dw1), p.map((x) => x.occ)), S7: spearman(p.map((x) => x.s32), p.map((x) => x.occ)) }]; }));
  const mv = (a: string) => mean(runs[a].map((x) => x.moving));
  const moving = Object.fromEntries(AS.map((a) => [a.id, { moving: mv(a.id), vsBase: mv(a.id) / mv('base') - 1, flag: Math.abs(mv(a.id) / mv('base') - 1) > 0.2 }]));
  const mult = Object.fromEntries(AS.filter((a) => a.id !== 'base').map((a) => {
    const g = runs[a.id].flatMap((r) => r.oracleG).reduce((t, x) => ({ n: t.n + x.n, sumPre: t.sumPre + x.sumPre, sumPost: t.sumPost + x.sumPost, sumInvPost: t.sumInvPost + x.sumInvPost, clipped: t.clipped + x.clipped }), { n: 0, sumPre: 0, sumPost: 0, sumInvPost: 0, clipped: 0 });
    const os2 = runs[a.id].flatMap((r) => r.oracleStats) as Parameters<typeof combineOracleStats>[0];
    return [a.id, { trajectory: g.n ? { samples: g.n, meanGBeforeClipping: g.sumPre / g.n, meanGApplied: g.sumPost / g.n, meanInvGApplied: g.sumInvPost / g.n, clippedFraction: g.clipped / g.n } : null, signal: os2.length ? oracleSummary(combineOracleStats(os2)) : null }];
  }));
  return { S2audit: s2d, S3rho: rho, S5S6S7: sx, S4: 'not recorded (the 2b runs have no --tb)', meanMoving: moving, multipliers: mult, S3: 'logs/partd2/assess/s3desc.json (s3Read2b.py: S3-pair, S3-raw, sensitivities (a)–(c), S3-p, gate G descriptive)' };
}

/**
 * S3 descriptives: s3AuditRead.py unchanged (via s3Read2b.py), one process per arm over the Stage 0 data files and that
 * arm's S3 files, every process given the full set list, so each set keeps the bootstrap stream (0x5ea0 + its index) it
 * would have in one process; merged into s3desc.json (gate G from base's process).
 */
async function s3Desc(AS: Arm[]): Promise<void> {
  const root = `${OUT}/s3read`;
  fs.rmSync(root, { recursive: true, force: true });
  const members = AS.filter((a) => a.family === 'T' || a.family === 'D').map((a) => a.id).join(',');
  const parts = await Promise.all(AS.map(async (a) => {
    const dir = `${root}/${a.id}`;
    fs.mkdirSync(dir, { recursive: true });
    for (const f of fs.readdirSync('logs/partd/files').filter((x) => x.startsWith('data--'))) fs.symlinkSync(path.resolve(`logs/partd/files/${f}`), `${dir}/${f}`);
    for (const f of fs.readdirSync(`${OUT}/s3`).filter((x) => x.startsWith(`${a.id}--`))) fs.symlinkSync(path.resolve(`${OUT}/s3/${f}`), `${dir}/${f}`);
    const out = `${root}/${a.id}.json`;
    await acquire();
    try {
      const code = await new Promise<number>((res) => spawn('python3', ['-I', 'scripts/scratch/s3Read2b.py', dir, out, members], { stdio: ['ignore', 'ignore', 'inherit'] }).on('exit', (x) => res(x ?? 1)));
      if (code !== 0) throw new Error(`s3Read2b.py failed for ${a.id}`);
    } finally {
      release();
    }
    return [a.id, readJ(out)] as const;
  }));
  const by = Object.fromEntries(parts);
  writeJson(`${OUT}/s3desc.json`, { sets: { data: parts[0][1].sets.data, ...Object.fromEntries(parts.map(([id, r]) => [id, r.sets[id]])) }, gateDescriptive: by.base.gate });
}

// ---- dry run checks (Part C files; already read) ----
function dryChecks(AS: Arm[], s2: Record<string, Map<string, S2Col>>, s3: Record<string, { s1: Values; s2: Values }>): void {
  const ref = (set: string) => loadS2(s2Paths('logs/s2audit/files', set));
  const s3ref = readJ('logs/partd/s3audit.json').sets;
  let bad = 0;
  for (const a of AS) {
    const r = ref(a.id);
    for (const [lab, c] of s2[a.id]) {
      const o = r.get(lab)!;
      const same = (x: Float64Array, y: Float64Array) => x.every((v, i) => v === y[i]);
      if (!same(c.obs, o.obs) || o.J.length !== D_MAIN || c.J.length < D_MAIN || !o.J.every((d, i) => same(c.J[i], d)) || !c.A.every((d, i) => same(d, o.A[i]))) { bad++; console.log(`S2 ${a.id} ${lab}: differs from the S2 audit`); }
    }
    for (const key of ['s1', 's2'] as const) {
      const want = s3ref[a.id][key === 's1' ? 'S3_1' : 'S3_2'].perColony as Record<string, number | null>;
      for (const [lab, v] of s3[a.id][key]) if (!(want[lab] === null ? Number.isNaN(v) : want[lab] === v)) { bad++; console.log(`S3 ${a.id} ${lab} ${key}: differs from Stage 0`); }
    }
    console.log(`dry ${a.id}: S2 colonies ${s2[a.id].size}, S3 colonies ${s3[a.id].s2.size}`);
  }
  // The S3 descriptives through s3Read2b.py: every statistic of base, Eu and El20 as Stage 0's reader wrote it.
  const desc = readJ(`${OUT}/s3desc.json`).sets;
  for (const a of AS) if (JSON.stringify(desc[a.id]) !== JSON.stringify(s3ref[a.id])) { bad++; console.log(`S3 descriptives ${a.id}: differ from Stage 0`); }
  console.log(bad ? `dry run: ${bad} mismatches` : 'dry run: S2 accumulators (obs, J, A), S3 per-colony values and S3 descriptives identical to the S2 audit and Stage 0');
  if (bad) process.exit(1);
}

// ---- self-test on synthetic numbers (no simulation output) ----
function selftest(): void {
  const n = 20;
  const iS = resamples(1, 0, 0, n);
  const iD = resamples(2, 0, 0, n);
  const g = RNG.stream(3);
  const norm = () => g.gauss();
  const v = (m: number, s: number) => Array.from({ length: n }, () => m + s * norm());
  const cls = (dm: number, s: number) => equiv(v(dm, s), v(0, s), 0.015, iS, iD).cls;
  const check = (c: boolean, msg: string) => { if (!c) throw new Error(`selftest: ${msg}`); console.log(`ok ${msg}`); };
  check(cls(0, 0.005) === 'equivalent', 'a small spread around 0 is equivalent');
  check(cls(0.05, 0.005) === 'outside', 'a shift of 0.05 with small spread is outside');
  check(cls(0.015, 0.02) === 'unresolved', 'a shift at the boundary with large spread is unresolved');
  // MC: valid draws spread wide around their mean → endpoints within 2 MC SE of a boundary placed at them.
  const jc = (obs: number, sdD: number) => ({ obs, draws: Array.from({ length: 100 }, () => sdD * norm()), nValid: 100, nDraws: 100 });
  const sJ = Array.from({ length: n }, () => jc(0.01, 0.2));
  const dJ = Array.from({ length: n }, () => jc(0, 0.2));
  const lab = Array.from({ length: n }, (_, i) => `c${i}`);
  const e = equiv(sJ.map((c) => c.obs - mean(c.draws)), dJ.map((c) => c.obs - mean(c.draws)), 0.015, iS, iD);
  const se = mcSe(sJ, dJ, 1, lab, 0.015, iS, iD);
  check(se.seLo > 0 && se.seHi > 0, `MC SE positive (${se.seLo.toFixed(4)}, ${se.seHi.toFixed(4)})`);
  const tight = Array.from({ length: n }, () => jc(0, 1e-6));
  const e2 = equiv(tight.map((c) => c.obs - mean(c.draws)), tight.map((c) => c.obs - mean(c.draws)), 0.015, iS, iD);
  check(mcResolved(e2, mcSe(tight, tight, 1, lab, 0.015, iS, iD), 0.015), 'near-zero draw spread is MC-resolved');
  check(mcResolved({ lo: 0.0149, hi: 0.02, cls: 'unresolved' }, { seLo: 0.001, seHi: 0.001 }, 0.015) === false, 'an endpoint 0.0001 from the boundary with MC SE 0.001 is not resolved');
  console.log(`selftest done (e ${e.lo.toFixed(4)}, ${e.hi.toFixed(4)})`);
}

const cmd = process.argv[2];
if (cmd === 'files') await files();
else if (cmd === 'ext') await ext();
else if (cmd === 'read') await read();
else if (cmd === 'selftest') selftest();
else throw new Error('partD2b.ts files | ext | read | selftest [--dry]');
