/** Node-only helpers shared by scripts and tests (never imported by the browser bundle). */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import zlib from 'node:zlib';
import { parseKhuongCsv } from '../src/sim/analysis/khuongData';
import { RNG } from '../src/sim/core/rng';
import type { Track } from '../src/sim/analysis/trajectory';
import { buildPools, type SectorFrame, type SectorPools } from '../src/sim/reference/sectoredWalker';
import { simHash } from './simHash';

/**
 * Seeds by namespace (STATUS 2026-10-10): every batch of random streams a
 * script draws is keyed by (study, purpose, ...keys), so fitting, selection,
 * judging and diagnostics never share streams. Hand-picked offsets did: the
 * 1999 judging seed 7.9e9 was fit generation 90's (7e9 + 90 × 1e7).
 */
export const SEED_PURPOSE = { fit: 1, cmaes: 2, probe: 3, select: 4, judge: 5, converge: 6, ident: 7, recover: 8 } as const;
export function seedFor(study: number, purpose: keyof typeof SEED_PURPOSE, ...keys: number[]): number {
  return RNG.stream(study, 0x5eed, SEED_PURPOSE[purpose], ...keys).int(2 ** 32);
}

/** What a result file needs to be reproduced and not reinterpreted under changed code: code hash, commit, command. */
export function provenance(): { simHash: string; commit: string; dirty: boolean; node: string; argv: string[]; date: string } {
  const git = (c: string) => {
    try {
      return execSync(`git ${c}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    } catch {
      return '';
    }
  };
  return { simHash: simHash(), commit: git('rev-parse HEAD') || 'unknown', dirty: git('status --porcelain --untracked-files=no') !== '', node: process.version, argv: process.argv.slice(2), date: new Date().toISOString() };
}

/** Value of `--name <value>` on the command line, or the default. */
export function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(name);
  return i >= 0 && i + 1 < process.argv.length ? process.argv[i + 1] : fallback;
}

export const numArg = (name: string, fallback: number): number => Number(arg(name, String(fallback)));

/** Whether a bare `--flag` is present. */
export const flag = (name: string): boolean => process.argv.includes(name);

export function readJson<T = Record<string, unknown>>(path: string): T {
  return JSON.parse(fs.readFileSync(path, 'utf8')) as T;
}

export function writeJson(path: string, value: unknown): void {
  fs.mkdirSync(path.replace(/\/[^/]*$/, ''), { recursive: true });
  fs.writeFileSync(path, JSON.stringify(value, null, 2));
}

/** Khuong et al. 2013 tracks for incline k = 1…5 (0, π/9, π/6, π/4, π/3). */
export function loadKhuong(k: number): Track[] {
  return parseKhuongCsv(zlib.gunzipSync(fs.readFileSync(`data/khuong2013/incline${k}.csv.gz`)).toString('utf8'));
}

export const INCLINES = [0, Math.PI / 9, Math.PI / 6, Math.PI / 4, Math.PI / 3];

export const BLES_SCANS = (): string => fs.readFileSync('data/bles2022/trophallaxis_scans.csv', 'utf8');

/**
 * Sector pools of the E1 reference walkers (src/sim/reference/sectoredWalker.ts)
 * for incline k, from the Khuong tracks and their stored segmentation
 * (data/reference/khuong-segments.json, written by the local-only segmentation
 * port, see NOTICE.md).
 */
export function loadKhuongPools(k: number, frame: SectorFrame, file = 'data/reference/khuong-segments.json'): SectorPools {
  const seg = readJson<{ inclines: { incline: number; tracks: { id: string; vertices: number[] }[] }[] }>(file);
  const inc = seg.inclines.find((i) => i.incline === k);
  if (!inc) throw new Error(`no segmentation for incline ${k}; run scripts/segmentKhuong.ts`);
  const raw = loadKhuong(k);
  const tracks = inc.tracks.map(({ id, vertices }, i) => {
    const tr = raw[i];
    if (tr.id !== id) throw new Error(`segmentation out of date: track ${i} is ${tr.id}, stored ${id}`);
    return { t: vertices.map((v) => tr.t[v]), x: vertices.map((v) => tr.x[v]), y: vertices.map((v) => tr.y[v]) };
  });
  return buildPools(tracks, frame);
}
