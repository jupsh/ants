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

/**
 * One definition per behavioural concept (STATUS 2026-10-10: the deadlock
 * came from "has food to give" defined in the policy and again, as a
 * constant, in perception). Perception reports body states and signals; it
 * never imports behaviour or species parameters. Policies take crop
 * thresholds from parameters or interoception, never numeric literals.
 */
describe('no behavioural thresholds outside their one definition', () => {
  for (const f of files('src/sim/perception')) {
    it(`${f} imports no behaviour or species parameters`, () => {
      const imports = [...fs.readFileSync(f, 'utf8').matchAll(/from\s+'([^']+)'/g)].map((m) => m[1]);
      expect(imports.filter((i) => /\/(behavior|species|mind)\//.test(`/${i.replace(/^\.\.?\//, '')}`))).toEqual([]);
    });
  }
  for (const f of files('src/sim/behavior')) {
    it(`${f} has no numeric crop thresholds`, () => {
      const src = fs.readFileSync(f, 'utf8');
      expect(src.match(/\d\s*\*\s*io\.crop(Capacity|Ul)|io\.crop(Capacity|Ul)\s*\*\s*\d/g) ?? []).toEqual([]);
    });
  }
});
