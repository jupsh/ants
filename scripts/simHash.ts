import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Hash of everything that determines the pages' simulation results
 * (simulation and worker code, fits, recorded data). The precomputed page
 * results (scripts/precompute.ts) carry it, and the pages (via the
 * `__SIM_HASH__` define in vite.config.ts) use a precomputed result only when
 * it matches, so a stale file is never shown as the current model's output.
 */
// Only the fits the pages use: candidate and recovery fits elsewhere in data/fits must not mark the pages stale.
const ROOTS = ['src/sim', 'src/worker', 'data/fits/e1-walk.json', 'data/fits/e2-drinking.json', 'data/fits/e6-tec.json', 'data/khuong2013', 'data/bles2022'];

export function simHash(root = process.cwd()): string {
  const files: string[] = [];
  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else files.push(p);
    }
  };
  for (const r of ROOTS) {
    const p = path.join(root, r);
    if (!fs.existsSync(p)) continue;
    if (fs.statSync(p).isDirectory()) walk(p);
    else files.push(p);
  }
  const h = crypto.createHash('sha256');
  for (const f of files.sort()) {
    h.update(path.relative(root, f).split(path.sep).join('/'));
    h.update('\0');
    h.update(fs.readFileSync(f));
    h.update('\0');
  }
  return h.digest('hex').slice(0, 16);
}
