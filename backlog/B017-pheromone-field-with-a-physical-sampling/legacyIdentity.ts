/** Compare off-mode to the untouched original, including its real walking path. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Body } from '../../src/sim/agent/body';
import { RNG } from '../../src/sim/core/rng';
import { newMind } from '../../src/sim/mind/mind';
import { DEFAULT_WALK } from '../../src/sim/models/walk';
import { basicPercept } from '../../src/sim/perception/types';
import { walkAnt as legacyWalkAnt } from '../../src/sim/physics/antPhysics';
import { Apparatus } from '../../src/sim/world/apparatus';
import type { World as LegacyWorld } from '../../src/sim/world/world';
import { stamp } from '../_lib/stamp';
import { walkAnt, type PhysParams } from './antPhysics';
import { PheromoneField } from './field';
import { PheromoneField as LegacyField } from './baseline/field';
import { World } from './world';

const ITEM = dirname(fileURLToPath(import.meta.url));
const cells = [4, 1, 0.5, 0.25, 0.125];
let sampleComparisons = 0;
const hashes: { cell: number; hash: string }[] = [];
for (const cell of cells) {
  const fields = [new LegacyField(30, 25, cell, 100), new PheromoneField(30, 25, cell, 100), new PheromoneField(30, 25, cell, 100, 0)];
  const rng = RNG.stream(4242, 17, 0);
  for (const t of [0, 25, 300, 3100, 3200]) {
    fields.forEach((f) => f.setTime(t));
    for (let k = 0; k < 200; k++) {
      const x = rng.next() * 32 * cell - cell;
      const y = rng.next() * 27 * cell - cell;
      const amount = rng.next() * 2;
      const length = rng.next() * 3;
      fields.forEach((f) => f.deposit(x, y, amount, length));
    }
    fields.forEach((f) => f.clearDisc(10.3 * cell, 7.8 * cell, 2.1 * cell));
    for (const f of fields.slice(1)) {
      assert.deepEqual(f.data, fields[0].data);
      assert.equal(f.currentScale, fields[0].currentScale);
    }
    for (let k = 0; k < 200; k++) {
      const x = rng.next() * 32 * cell - cell;
      const y = rng.next() * 27 * cell - cell;
      for (const f of fields.slice(1)) {
        assert.equal(f.sample(x, y), fields[0].sample(x, y));
        sampleComparisons++;
      }
    }
    for (let i = 0; i < fields[0].data.length; i++) {
      for (const f of fields.slice(1)) assert.equal(f.cellValue(i), fields[0].cellValue(i));
    }
  }
  hashes.push({ cell, hash: createHash('sha256').update(new Uint8Array(fields[0].data.buffer)).digest('hex') });
}

const phys: PhysParams = { intakeRate: 0, intakeSd: 0, metabolic: 0, activeFactor: 1, permeability: 0, surfaceArea: 1, depositPerMm: 1, compassNoise: 0.0005 };
let walkingComparisons = 0;
for (const cell of cells) {
  const fields = [new LegacyField(Math.ceil(100 / cell), Math.ceil(60 / cell), cell, 100),
    new PheromoneField(Math.ceil(100 / cell), Math.ceil(60 / cell), cell, 100),
    new PheromoneField(Math.ceil(100 / cell), Math.ceil(60 / cell), cell, 100, 0)];
  const app = new Apparatus([{ name: 'synthetic', kind: 'arena', x0: 0, x1: 100, y0: 0, y1: 60, covered: false }]);
  const cases = fields.map((field) => {
    const world = new World(app, [0, 0], 31, 25, 50);
    // Harness-only nominal type bridge: the baseline class has its own private members.
    world.trail = field as unknown as PheromoneField;
    const body = new Body(0, 31, { len: 4, mass: 2, cropCapacity: 2, antennaReach: 2.6, cropFullFrac: 0.98 }, 0.5, 1);
    body.x = 90;
    body.y = 30.37;
    body.gasterDown = true;
    const agent = { body, mind: newMind({ desiredVolumeFactor: 1, neverLays: false, layIntensity: 1 }, DEFAULT_WALK, body.rng), inactive: false };
    return { world, field, agent };
  });
  for (const [dx, dy] of [[3.7, 0.9], [8, 0], [0.17, -0.11], [-4.3, -2.1]]) {
    const length = Math.hypot(dx, dy);
    for (const [i, c] of cases.entries()) {
      const motor = (_p: unknown, _s: unknown, _per: unknown, _k: unknown, _pi: unknown, move: (dx: number, dy: number, length: number) => void) => { move(dx, dy, length); return length; };
      if (i === 0) legacyWalkAnt(c.world as unknown as LegacyWorld, c.agent, basicPercept(0.1, 0, 0, 25), DEFAULT_WALK, phys, {}, motor);
      else walkAnt(c.world, c.agent, basicPercept(0.1, 0, 0, 25), DEFAULT_WALK, phys, {}, motor);
    }
    for (const c of cases.slice(1)) {
      assert.deepEqual(c.field.data, cases[0].field.data);
      assert.deepEqual(c.agent, cases[0].agent);
      walkingComparisons++;
    }
  }
}
const result = { provenance: stamp(ITEM), pass: true, cells, sampleComparisons, walkingComparisons, hashes,
  scope: 'Omitted and explicit-zero footprint versus original source: exact Float32 contents, currentScale, all cell values, samples, and body/mind/RNG after walks including a wall turn.' };
writeFileSync(join(ITEM, 'results/legacy-identity.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ pass: true, sampleComparisons, walkingComparisons }));
