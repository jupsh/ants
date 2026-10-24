import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

/**
 * The project record (STATUS 2026-10-18 ≈ 16:32): findings/, docs/log/ and
 * docs/contamination/ must be consistent: fields valid, every evidence
 * reference resolvable, indexes regenerated, no dated entry written back
 * into docs/STATUS.md. Fix with the command the failure names.
 *
 * plied's records (plied/, D142) must pass `plied check` (no errors; warnings
 * are for review) and its view must be current. Skipped where plied is not
 * installed (CI).
 */
function check(script: string): { status: number | null; out: string } {
  const r = spawnSync(process.execPath, [script, 'check'], { encoding: 'utf8' });
  return { status: r.status, out: `${r.stdout}${r.stderr}` };
}

const hasPlied = spawnSync('plied', ['--version'], { encoding: 'utf8' }).status === 0;
function plied(...args: string[]): { status: number | null; out: string } {
  const r = spawnSync('plied', args, { encoding: 'utf8' });
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
  it.skipIf(!hasPlied)('plied records pass `plied check`, and `plied/README.md` is current', () => {
    const c = plied('check');
    expect(c.status, c.out).toBe(0);
    const v = plied('view', '--check');
    expect(v.status, v.out).toBe(0);
  });
});
