import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

/**
 * The project record (STATUS 2026-10-18 ≈ 16:32): findings/, docs/log/ and
 * docs/contamination/ must be consistent: fields valid, every evidence
 * reference resolvable, indexes regenerated, no dated entry written back
 * into docs/STATUS.md. Fix with the command the failure names.
 */
function check(script: string): { status: number | null; out: string } {
  const r = spawnSync(process.execPath, [script, 'check'], { encoding: 'utf8' });
  return { status: r.status, out: `${r.stdout}${r.stderr}` };
}

describe('project record', () => {
  it('findings register passes `node findings/findings.mjs check`', () => {
    const r = check('findings/findings.mjs');
    expect(r.status, r.out).toBe(0);
  });
  it('log and contamination records pass `node docs/records.mjs check`', () => {
    const r = check('docs/records.mjs');
    expect(r.status, r.out).toBe(0);
  });
});
