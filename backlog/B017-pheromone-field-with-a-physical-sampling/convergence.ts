/** B012 geometry and rule, with the candidate field and cell-resolved physics spacing. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stamp } from '../_lib/stamp';
import { PheromoneField, PROVISIONAL_TRAIL_SAMPLING_SIGMA } from './field';
import { PheromoneField as LegacyField } from './baseline/field';

const ITEM = dirname(fileURLToPath(import.meta.url));
const CELLS = [4, 2, 1, 0.5, 0.25, 0.125];
const X0 = 20;
const LENGTH = 60;
const Y0 = 30.37;
const OFFSETS = [0, 0.25, 0.5, 1, 2];
const SIGMA = PROVISIONAL_TRAIL_SAMPLING_SIGMA.v;

function trial(cell: number, mode: 'fine' | 'physicsCell' | 'physics1mm', phase: number, legacy: boolean) {
  const Field = legacy ? LegacyField : PheromoneField;
  const field = new Field(Math.ceil(100 / cell), Math.ceil(60 / cell), cell, 1e9, legacy ? 0 : SIGMA);
  field.setTime(0);
  const shift = phase * cell;
  const trailY = Y0 + shift;
  const maxStep = mode === 'fine' ? Math.min(0.0625, cell / 8)
    : mode === 'physics1mm' ? 1 : Math.min(1, cell / 2);
  const n = Math.ceil(LENGTH / maxStep);
  const step = LENGTH / n;
  for (let i = 0; i < n; i++) field.deposit(X0 + (i + 0.5) * step, trailY, 1, step);
  let mass = 0;
  for (let i = 0; i < field.data.length; i++) mass += field.cellValue(i) * cell;
  const samples = Object.fromEntries([50, 50.5].map((x) =>
    [String(x), Object.fromEntries(OFFSETS.map((d) => [String(d), field.sample(x, trailY + d)]))]));
  // Dense interior scan, plus raw deposited-amount projection: smoothing
  // alone must not hide empty longitudinal grid columns.
  let minSignal = Infinity;
  for (let x = 40; x <= 60; x += cell / 4) minSignal = Math.min(minSignal, field.sample(x, trailY));
  let emptyColumns = 0;
  for (let ix = Math.ceil(40 / cell); ix < Math.floor(60 / cell); ix++) {
    let amount = 0;
    for (let iy = 0; iy < field.h; iy++) amount += field.data[iy * field.w + ix];
    if (amount === 0) emptyColumns++;
  }
  return { cell, mode, phase, shift, deposits: n, step, mass, samples, minSignal, emptyColumns };
}

const phases = [0, 0.25, 0.5, 0.75];
const rows = CELLS.flatMap((cell) => (['fine', 'physicsCell'] as const).flatMap((mode) =>
  phases.map((phase) => trial(cell, mode, phase, false))));
const legacyRows = CELLS.flatMap((cell) => (['fine', 'physics1mm'] as const).flatMap((mode) =>
  phases.map((phase) => trial(cell, mode, phase, true))));

function judge(data: typeof rows, modes: string[]) {
  const refinements = modes.flatMap((mode) => phases.flatMap((phase) => [50, 50.5].flatMap((x) =>
    [0, 0.5].map((offset) => {
      const coarse = data.find((r) => r.cell === 0.25 && r.mode === mode && r.phase === phase)!.samples[String(x)][String(offset)];
      const fine = data.find((r) => r.cell === 0.125 && r.mode === mode && r.phase === phase)!.samples[String(x)][String(offset)];
      const difference = Math.abs(fine - coarse);
      return { mode, phase, x, offset, coarse, fine, difference,
        relative: coarse === 0 ? null : difference / Math.abs(coarse),
        pass: difference <= Math.max(0.01, 0.1 * Math.abs(coarse)) };
    }))));
  const lastRows = data.filter((r) => r.cell <= 0.25);
  const noGaps = lastRows.every((r) => r.emptyColumns === 0 && r.minSignal > 0);
  return { pass: refinements.every((r) => r.pass) && noGaps, noGaps, refinements,
    maxMassError: Math.max(...data.map((r) => Math.abs(r.mass - LENGTH))),
    maxRelativeRefinement: Math.max(...refinements.map((r) => r.relative ?? 0)) };
}
const candidate = judge(rows, ['fine', 'physicsCell']);
const legacy = judge(legacyRows, ['fine', 'physics1mm']);
const result = {
  provenance: stamp(ITEM),
  parameter: PROVISIONAL_TRAIL_SAMPLING_SIGMA,
  rule: 'B012: centreline and 0.5-mm-offset last refinement within 10% (0.01 absolute near zero); no longitudinal gaps. Checked at both original x points and all four sub-cell phases.',
  geometry: { x0: X0, length: LENGTH, y0: Y0, extent: [100, 60], offsets: OFFSETS },
  candidate, legacy, rows, legacyRows,
};
mkdirSync(join(ITEM, 'results'), { recursive: true });
writeFileSync(join(ITEM, 'results/convergence.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ candidate: { pass: candidate.pass, noGaps: candidate.noGaps, maxRelativeRefinement: candidate.maxRelativeRefinement, maxMassError: candidate.maxMassError },
  legacy: { pass: legacy.pass, noGaps: legacy.noGaps, maxMassError: legacy.maxMassError }, cases: rows.length + legacyRows.length }));
if (!candidate.pass || legacy.pass) process.exitCode = 1;
