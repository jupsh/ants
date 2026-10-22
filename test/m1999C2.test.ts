import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { C2_FIT, c2ForagerShare, m1999C2Params, M1999_C2_MOTION_KEYS } from '../scripts/m1999C2';
import { loadTrips, s2018Params } from '../scripts/s2018Lib';
import { LASIUS_NEST, LASIUS_PARAMS, LASIUS_PARAMS_E2_ALT } from '../src/sim/species/lasiusM1';

// Step 5 (D094): C2's motion on the 1999 nest model, nothing else.
describe('m1999C2Params', () => {
  const c2 = s2018Params(JSON.parse(fs.readFileSync(C2_FIT, 'utf8')).free, loadTrips().outRate, 'C2').nest;
  const P = m1999C2Params('main');

  it('sets exactly the motion keys to C2 and keeps every other nest key of the 1999 base', () => {
    const nest = P.nest as unknown as Record<string, unknown>;
    for (const k of M1999_C2_MOTION_KEYS) expect(nest[k], k).toEqual((c2 as unknown as Record<string, unknown>)[k]);
    for (const k of Object.keys(LASIUS_NEST)) if (!(M1999_C2_MOTION_KEYS as readonly string[]).includes(k) && k !== 'forager' && k !== 'foragerFrac') expect(nest[k], k).toEqual((LASIUS_NEST as unknown as Record<string, unknown>)[k]);
    expect(Object.keys(nest).sort()).toEqual([...new Set([...Object.keys(LASIUS_NEST), 'forager'])].sort());
  });

  it('leaves the trophallaxis and water keys at the 1999 values (not the Stroeymeyt set-up)', () => {
    for (const k of ['returnRate', 'shareRate', 'shareEnd', 'receiveReserve', 'reserveSd', 'thirstFrac', 'giveUpTime'] as const) expect(P.nest[k], k).toEqual(LASIUS_NEST[k]);
    expect(P.phys).toEqual(LASIUS_PARAMS.phys);
    expect(P.forager).toEqual(LASIUS_PARAMS.forager);
    expect(m1999C2Params('alt').phys).toEqual(LASIUS_PARAMS_E2_ALT.phys);
  });

  it('takes the forager overlay without the Stroeymeyt trip rate', () => {
    const { outRate, ...fo } = c2.forager!;
    expect(outRate).toBeGreaterThan(0);
    expect(P.nest.forager).toEqual(fo);
    expect('outRate' in P.nest.forager!).toBe(false);
  });

  it('carries C2 itself: specular walls, the drive, the rest bound', () => {
    expect(P.nest.wallRule).toBe('specular');
    expect(P.nest.driveTau).toBe(60);
    expect(P.nest.driveSd).toBeGreaterThan(1.9);
    expect(P.nest.restShape).toBeCloseTo(1.001, 6);
  });

  it('forager share of workers over the 22 fit colonies is 0.320; roles mix draws it, nurse none', () => {
    expect(c2ForagerShare()).toBeCloseTo(0.32, 2);
    expect(P.nest.foragerFrac).toBe(c2ForagerShare());
    expect(m1999C2Params('main', 'nurse').nest.foragerFrac).toBe(0);
    expect({ ...m1999C2Params('main', 'nurse').nest, foragerFrac: 0 }).toEqual({ ...P.nest, foragerFrac: 0 });
  });
});
