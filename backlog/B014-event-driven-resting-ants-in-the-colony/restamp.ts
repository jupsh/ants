/**
 * B014: provenance for results measured on the patched worktree. The stamp is the main tree's (the tree
 * `proposal.patch` applies to), so `backlog.mjs check` and the findings check go stale once the patch is applied,
 * as they should; `measuredOn` records the patch itself (sha256 of proposal.patch and the patched tree's simHash).
 * Run from the main checkout's root, after the runs:
 *   npx vite-node backlog/B014-event-driven-resting-ants-in-the-colony/restamp.ts --patchedSimHash <hash> [--note text] results/identity.json …
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { arg } from '../../scripts/lib';
import { stamp } from '../_lib/stamp';
import { ITEM } from './merge';

const patched = arg('--patchedSimHash', '');
if (!patched) throw new Error('--patchedSimHash required');
const patch = fs.readFileSync(path.join(ITEM, 'proposal.patch'));
const note = arg('--note', '');
const measuredOn = { patchSha256: crypto.createHash('sha256').update(patch).digest('hex').slice(0, 16), patchedSimHash: patched, base: 'f0a05a0', worktree: '../ants-b014 (branch b014-lazy-rest)', ...(note ? { note } : {}) };
for (const rel of process.argv.slice(2).filter((a) => a.endsWith('.json'))) {
  const f = path.join(ITEM, rel);
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  d.provenance = stamp(ITEM);
  d.measuredOn = measuredOn;
  fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
  console.log(`${rel}: stamped ${d.provenance.simHash}, measured on ${patched} (patch ${measuredOn.patchSha256})`);
}
