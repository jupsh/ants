/** Generate a reviewable patch, without applying it to the main tree. */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const item = dirname(fileURLToPath(import.meta.url));
const root = join(item, '../..');
mkdirSync(join(item, 'out'), { recursive: true });
let patch = '';
for (const [local, target] of [
  ['field.ts', 'src/sim/world/field.ts'],
  ['antPhysics.ts', 'src/sim/physics/antPhysics.ts'],
  ['footprint.test.ts', 'test/fieldFootprint.test.ts'],
]) {
  const baseline = join(item, 'baseline', local);
  if (local !== 'footprint.test.ts') assert.equal(readFileSync(join(root, target), 'utf8'), readFileSync(baseline, 'utf8'), `Main source moved: review ${target} before regenerating`);
  let source = readFileSync(join(item, local), 'utf8');
  if (local === 'field.ts') source = source.replaceAll("'../../src/sim/", "'../");
  if (local === 'antPhysics.ts') source = source.replaceAll("'../../src/sim/", "'../").replace("'./world'", "'../world/world'");
  if (local === 'footprint.test.ts') source = source.replaceAll("'../../src/", "'../src/")
    .replace("'./antPhysics'", "'../src/sim/physics/antPhysics'")
    .replace("'./field'", "'../src/sim/world/field'")
    .replace("'./world'", "'../src/sim/world/world'");
  const proposed = join(item, 'out', local);
  writeFileSync(proposed, source);
  const added = local === 'footprint.test.ts';
  const diff = spawnSync('diff', ['-u', '--label', added ? '/dev/null' : `a/${target}`, '--label', `b/${target}`, added ? '/dev/null' : baseline, proposed], { encoding: 'utf8' });
  assert.equal(diff.status, 1, diff.stderr || `Expected changes to ${target}`);
  patch += `diff --git a/${target} b/${target}\n${added ? 'new file mode 100644\n' : ''}${diff.stdout}`;
}
writeFileSync(join(item, 'proposal.patch'), patch);
console.log('Wrote proposal.patch (field, deposition spacing, six tests); no patch applied.');
