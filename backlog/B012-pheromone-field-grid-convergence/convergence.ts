/** Fixed-geometry convergence check for the dormant surface trail field. */
import { writeFileSync } from 'node:fs';
import { PheromoneField } from '../../src/sim/world/field';

const CELLS = [4, 2, 1, 0.5, 0.25, 0.125];
const X0 = 20;
const LENGTH = 60;
const Y0 = 30.37;
const OFFSETS = [0, 0.25, 0.5, 1, 2];
const MODES = ['fine', 'physics1mm'] as const;

function trial(cell: number, mode: typeof MODES[number], shift: number) {
  const field = new PheromoneField(Math.ceil(100 / cell), Math.ceil(60 / cell), cell, 1e9);
  field.setTime(0);
  const trailY = Y0 + shift;
  const maxStep = mode === 'fine' ? Math.min(0.0625, cell / 8) : 1;
  const n = Math.ceil(LENGTH / maxStep);
  const step = LENGTH / n;
  for (let i = 0; i < n; i++) field.deposit(X0 + (i + 0.5) * step, trailY, 1, step);
  let mass = 0;
  for (let i = 0; i < field.data.length; i++) mass += field.cellValue(i) * cell;
  const samples = Object.fromEntries([50, 50.5].map((x) =>
    [String(x), Object.fromEntries(OFFSETS.map((d) => [String(d), field.sample(x, trailY + d)]))]));
  return { cell, mode, shift, deposits: n, mass, samples };
}

const rows = CELLS.flatMap((cell) => MODES.flatMap((mode) =>
  [0, cell / 4, cell / 2, 3 * cell / 4].map((shift) => trial(cell, mode, shift))));
const result = { geometry: { x0: X0, length: LENGTH, y0: Y0, extent: [100, 60], offsets: OFFSETS }, rows };
writeFileSync('backlog/B012-pheromone-field-grid-convergence/results.json', JSON.stringify(result, null, 2) + '\n');
for (const cell of CELLS) {
  const fine = rows.find((r) => r.cell === cell && r.mode === 'fine' && r.shift === 0)!;
  const physics = rows.find((r) => r.cell === cell && r.mode === 'physics1mm' && r.shift === 0)!;
  const phases = rows.filter((r) => r.cell === cell && r.mode === 'fine').map((r) => r.samples['50.5']['0']);
  console.log(JSON.stringify({ cell, mass: fine.mass, fine: fine.samples['50.5'], physics: physics.samples['50.5'], phaseRange: [Math.min(...phases), Math.max(...phases)] }));
}
