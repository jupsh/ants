// Scratch (not committed): H6 blind check of S1's unknown share before the freeze (T059; D246, D249; P167, P170, P171).
// Reads logs/h6-work/c<i>.json (all 22 fit colonies, refused otherwise) and prints exactly three lines and nothing else:
//
//   S1 unknown share, onsets, W 10 s, pooled over 22 colonies: 0.xxx
//   S1 unknown share, at-risk reference, W 10 s, pooled over 22 colonies: 0.xxx
//   S1 unknown share, zone condition (L or H above 50 %, onsets or at-risk reference): yes|no
//
// Share = Σ over colonies of the rows classed "unknown" / Σ of all classed rows, over exactly the rows S1 reads (the
// reader's `parseOnsets(d.onsets)` for onsets; the `atRisk` quadruples [frame, ant, cell, flags] for the reference;
// both are light-phase rows by the extractor's construction), each classed by the reader's `classOf(flags, 10)`.
// Zone condition (D249): per colony the reader's `buildZones(d.grid)`; a row's zone is `zoneOf.get(cell)`, L or H (any
// other row, unassigned, counts in the pooled shares and in neither zone). Four shares, each pooled over the colonies
// the same way: onsets in L, onsets in H, at-risk in L, at-risk in H; "yes" if any is strictly above 0.5, else "no".
// Return with a radius proposal (D249) if either pooled share is above 50 % or the flag is "yes".
// No per-zone or per-colony value, role, contact split, count or initiator is printed (P167, P171). Errors go to
// stderr as fixed messages with no data in them (a JSON parse message could quote file content, so none is passed on).
//
//   npx vite-node scripts/scratch/h6/unknownShare.ts --h6-unknown-share      (the lead only; [--work <dir>] for toys)
import fs from 'node:fs';
import { buildZones, classOf, CLS_UNKNOWN, H, L, parseOnsets, type Grid } from './reader';

export const N_COLONIES = 22;
export interface UnknownShares {
  onsets: number;
  atRisk: number;
  /** Pooled zone shares (never printed): onsets in L, onsets in H, at-risk in L, at-risk in H. */
  zoneShares: [number, number, number, number];
  /** Any zone share strictly above 0.5. */
  zoneAbove: boolean;
}

/** Pooled unknown shares at W = 10 s over the colony files c0 … c21 of `dir`; throws (fixed messages) otherwise. */
export function pooledUnknownShares(dir: string): UnknownShares {
  const names = fs.readdirSync(dir).filter((f) => /^c\d+\.json$/.test(f)).sort();
  const want = Array.from({ length: N_COLONIES }, (_, i) => `c${i}.json`).sort();
  if (names.length !== N_COLONIES || names.some((f, k) => f !== want[k])) throw new Error('refused: the work folder must hold exactly the 22 colony files c0.json … c21.json');
  let onU = 0, onN = 0, arU = 0, arN = 0;
  const zU = [0, 0, 0, 0], zN = [0, 0, 0, 0]; // [onsets L, onsets H, at-risk L, at-risk H]
  const zi = (z: number | undefined): number => (z === L ? 0 : z === H ? 1 : -1);
  for (let i = 0; i < N_COLONIES; i++) {
    let d: { onsets: number[]; atRisk: number[]; grid: Grid };
    try { d = JSON.parse(fs.readFileSync(`${dir}/c${i}.json`, 'utf8')); } catch { throw new Error('refused: a colony file could not be read as JSON'); }
    if (!Array.isArray(d?.onsets) || !Array.isArray(d?.atRisk) || d.onsets.length % 8 !== 0 || d.atRisk.length % 4 !== 0) throw new Error('refused: a colony file lacks the onsets or atRisk arrays');
    const g = d.grid;
    if (!g || !Array.isArray(g.cells) || !Array.isArray(g.forager) || !Array.isArray(g.nurse) || g.forager.length !== g.cells.length || g.nurse.length !== g.cells.length) throw new Error('refused: a colony file lacks the zone grid');
    const { zoneOf } = buildZones(g);
    for (const o of parseOnsets(d.onsets)) {
      const u = classOf(o.flags, 10) === CLS_UNKNOWN ? 1 : 0;
      onN++; onU += u;
      const z = zi(zoneOf.get(o.cell));
      if (z >= 0) { zN[z]++; zU[z] += u; }
    }
    for (let k = 0; k < d.atRisk.length; k += 4) {
      const u = classOf(d.atRisk[k + 3], 10) === CLS_UNKNOWN ? 1 : 0;
      arN++; arU += u;
      const z = zi(zoneOf.get(d.atRisk[k + 2]));
      if (z >= 0) { zN[2 + z]++; zU[2 + z] += u; }
    }
  }
  if (onN === 0 || arN === 0) throw new Error('refused: no classed rows');
  if (zN.some((n) => n === 0)) throw new Error('refused: a zone has no classed rows');
  const zoneShares = zU.map((u, k) => u / zN[k]) as [number, number, number, number];
  return { onsets: onU / onN, atRisk: arU / arN, zoneShares, zoneAbove: zoneShares.some((s) => s > 0.5) };
}

/** The three output lines (shares to three decimals; the zone condition as yes/no, no zone value). */
export const shareLines = (s: UnknownShares): string[] => [
  `S1 unknown share, onsets, W 10 s, pooled over ${N_COLONIES} colonies: ${s.onsets.toFixed(3)}`,
  `S1 unknown share, at-risk reference, W 10 s, pooled over ${N_COLONIES} colonies: ${s.atRisk.toFixed(3)}`,
  `S1 unknown share, zone condition (L or H above 50 %, onsets or at-risk reference): ${s.zoneAbove ? 'yes' : 'no'}`,
];

if (process.argv.includes('--h6-unknown-share')) {
  const i = process.argv.indexOf('--work');
  const dir = i >= 0 ? process.argv[i + 1] : 'logs/h6-work';
  try {
    process.stdout.write(shareLines(pooledUnknownShares(dir)).join('\n') + '\n');
  } catch (e) {
    const m = e instanceof Error && e.message.startsWith('refused: ') ? e.message : 'refused: the work folder could not be read';
    process.stderr.write(`unknownShare: ${m}\n`);
    process.exitCode = 1;
  }
}
