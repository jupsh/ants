import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Perception boundary: behaviour policies and motor models may only use
 * percepts, the ant's own mind/body state, core utilities and species
 * parameters — never world truth (world/, nest/, env/, simulation).
 */
const POLICY_DIRS = ['src/sim/behavior', 'src/sim/models', 'src/sim/mind'];
const FORBIDDEN = [/\/world\//, /\/nest\//, /\/env\//, /\/simulation/, /\/physics\//, /\/experiments\//];

function files(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? files(path.join(dir, e.name)) : e.name.endsWith('.ts') ? [path.join(dir, e.name)] : []));
}

describe('perception boundary', () => {
  for (const f of POLICY_DIRS.flatMap(files)) {
    it(`${f} does not import world truth`, () => {
      const src = fs.readFileSync(f, 'utf8');
      const imports = [...src.matchAll(/from\s+'([^']+)'/g)].map((m) => m[1]);
      const bad = imports.filter((i) => FORBIDDEN.some((re) => re.test(`/${i.replace(/^\.\.?\//, '')}/`) || re.test(i)));
      expect(bad).toEqual([]);
    });
  }
});
