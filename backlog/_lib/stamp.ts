/**
 * Provenance for backlog results (backlog/PROTOCOL.md § Working on it). Every
 * results file an item commits carries `provenance: stamp(ITEM)`, so
 * `node backlog/backlog.mjs check` can tell when its findings were computed on
 * simulation code or inputs that have since changed.
 *
 * `simHash` (scripts/simHash.ts) covers src/sim, src/worker and the fits and
 * data the pages use. Anything else an item depends on (other fits, the
 * Stroeymeyt data, the frozen tracker, a side project) goes in its README
 * frontmatter as `depends: path, path` and is hashed here.
 *
 * Run item scripts from the repository root (provenance() hashes and asks git
 * relative to the working directory).
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenance } from '../../scripts/lib';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));

/** Content hash of each path (a file, or every file under a directory), relative to the repository root. */
export function hashPaths(paths: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const rel of paths) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) {
      out[rel] = 'missing';
      continue;
    }
    const files: string[] = [];
    const walk = (p: string) => {
      if (fs.statSync(p).isDirectory()) for (const e of fs.readdirSync(p)) walk(path.join(p, e));
      else files.push(p);
    };
    walk(abs);
    const h = crypto.createHash('sha256');
    for (const f of files.sort()) {
      h.update(path.relative(ROOT, f).split(path.sep).join('/'));
      h.update('\0');
      h.update(fs.readFileSync(f));
      h.update('\0');
    }
    out[rel] = h.digest('hex').slice(0, 16);
  }
  return out;
}

/** The `depends:` list of an item's README frontmatter. */
export function readDepends(itemDir: string): string[] {
  const text = fs.readFileSync(path.join(itemDir, 'README.md'), 'utf8');
  const fm = text.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? '';
  const line = fm.split('\n').find((l) => l.startsWith('depends:'));
  return (line?.slice('depends:'.length) ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Provenance for a results file of the item in `itemDir` (pass the folder, e.g. `path.dirname(fileURLToPath(import.meta.url))`). */
export function stamp(itemDir: string) {
  return { ...provenance(), item: path.basename(itemDir), depends: hashPaths(readDepends(itemDir)) };
}
