// Scratch (not committed): the S2 audit, one file (T032; D136, D145–D147; statistics in s2Audit.ts). Writes
// <out>/<set>--<file>.json: the observed, matched-support, block-mean, full-support and (data) all-phase accumulators,
// and one accumulator per null draw. With --draws a:b, a > 0 (the one extension, D146 / D147 item 3), only the draws.
//   npx vite-node scripts/scratch/s2AuditFile.ts --file f --set name --set-idx i --file-key k [--draws 0:100]
//     [--nulls J,A] --out dir
import fs from 'node:fs';
import { arg } from '../lib';
import {
  accumulate, blockMeanClassing, complete, gateSegments, loadFile, nullA, nullJ, prep, refClassing, segments, taus,
} from './s2Audit';

const r = (a: Float64Array) => Array.from(a);
const path = arg('--file', '');
const set = arg('--set', '');
const setIdx = Number(arg('--set-idx', 'NaN'));
const fileKey = Number(arg('--file-key', 'NaN'));
const [d0, d1] = arg('--draws', '0:100').split(':').map(Number);
const nulls = arg('--nulls', 'J,A').split(',');
const outDir = arg('--out', '');
if (!path || !set || !outDir || !Number.isInteger(setIdx) || !Number.isInteger(fileKey)) throw new Error('usage');
const { file, sim, phase } = loadFile(path);
const P = prep(file, gateSegments(file, sim, phase));
const ext = d0 > 0;
const out: Record<string, unknown> = {
  set, setIdx, fileKey, file: path, colony: file.colony, sim, phase: phase ?? 'clock',
  n: P.n, T: P.T, segs: P.segs, draws: [d0, d1], nulls,
};
if (!ext) {
  out.obs = r(accumulate(P, P.dev, P.px, P.py));
  const rc = refClassing(P);
  out.same = r(rc.same);
  out.ref = r(rc.ref);
  out.blockMean = r(blockMeanClassing(P));
  const F = prep(file, segments(file));
  out.full = r(accumulate(F, F.dev, F.px, F.py));
  if (!sim) {
    const AP = prep(file, segments(file).filter(complete));
    out.allPhase = r(accumulate(AP, AP.dev, AP.px, AP.py));
  }
}
for (const nl of nulls) {
  const draws: number[][] = [];
  for (let d = d0; d < d1; d++) {
    const tau = taus(P, setIdx, fileKey, d);
    draws.push(r(nl === 'J' ? nullJ(P, tau) : nullA(P, tau)));
  }
  out[nl] = draws;
}
fs.mkdirSync(outDir, { recursive: true });
const name = `${outDir}/${set}--${path.split('/').pop()!.replace(/\.json$/, '')}${ext ? `--d${d0}-${d1}` : ''}.json`;
fs.writeFileSync(name, JSON.stringify(out));
console.log(`${set} ${file.colony} done`);
