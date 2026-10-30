// Runs currentHashes.ts for `backlog.mjs check` and `findings.mjs check`. The helper writes its JSON to a file named
// here, so the result does not depend on the child's stdout; if no file comes back, the caller gets an error naming
// the exit status and the child's stderr instead of a JSON parse failure.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/** @returns {{ now?: { simHash: string, depends: Record<string, string> }, error?: string }} */
export function currentHashes(root, deps) {
  const helper = path.join(root, 'backlog/_lib/currentHashes.ts');
  const local = path.join(root, 'node_modules/.bin/vite-node');
  const [cmd, pre] = fs.existsSync(local) ? [local, []] : ['npx', ['vite-node']];
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'hashes-')), 'now.json');
  const r = spawnSync(cmd, [...pre, helper, '--out', out, ...deps], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  try {
    return { now: JSON.parse(fs.readFileSync(out, 'utf8')) };
  } catch {
    const how = r.error ? r.error.message : `exit ${r.status}${r.signal ? `, signal ${r.signal}` : ''}`;
    return { error: `currentHashes.ts returned no hashes (${how})${r.stderr?.trim() ? `: ${r.stderr.trim().slice(-400)}` : ''}` };
  } finally {
    fs.rmSync(path.dirname(out), { recursive: true, force: true });
  }
}
