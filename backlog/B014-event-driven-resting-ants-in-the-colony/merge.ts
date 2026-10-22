/** B014: merge one workload's numbers into a stamped results file (read, update the entry, rewrite). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stamp } from '../_lib/stamp';

export const ITEM = path.dirname(fileURLToPath(import.meta.url));

export function mergeResult(file: string, name: string, entry: Record<string, unknown>): void {
  const prev = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { workloads: {} };
  prev.workloads[name] = { ...(prev.workloads[name] ?? {}), ...entry };
  prev.provenance = stamp(ITEM);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(prev, null, 2) + '\n');
}
