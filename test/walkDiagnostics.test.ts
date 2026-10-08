import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { RNG } from '../src/sim/core/rng';
import type { Track } from '../src/sim/analysis/trajectory';
import { diagTrack, diagValues, noiseTrack, SPEED_BINS } from '../src/sim/analysis/walkDiagnostics';
import { runE1 } from '../src/sim/experiments/e1Exploration';
import { walkParams } from '../src/sim/models/walk';

const params = walkParams(JSON.parse(fs.readFileSync('data/fits/e1-walk.json', 'utf8')).params);
const value = (vals: ReturnType<typeof diagValues>, id: string) => vals.find((v) => v.id === id)!.value;

function track(n: number, f: (i: number) => [number, number]): Track {
  const t = new Float64Array(n);
  const x = new Float64Array(n);
  const y = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    t[i] = i * 0.04;
    [x[i], y[i]] = f(i);
  }
  return { id: 'synthetic', t, x, y };
}

describe('walk diagnostics', () => {
  it('recovers white tracking noise of a stationary ant, and flags it as white', () => {
    const rng = new RNG(4);
    const tr = track(20000, () => [rng.normal(0, 0.15), rng.normal(0, 0.3)]);
    const v = diagValues([], [noiseTrack(tr)]);
    expect(value(v, 'noise.x')).toBeCloseTo(0.15, 2);
    expect(value(v, 'noise.y')).toBeCloseTo(0.3, 2);
    expect(value(v, 'noise.whiteX')).toBeCloseTo(1, 1);
    expect(value(v, 'noise.whiteY')).toBeCloseTo(1, 1);
  });

  it('sees a straight constant-speed walk as perfectly persistent, in the right speed bin', () => {
    const tr = track(3000, (i) => [i * 0.04 * 30, 0]); // 30 mm/s along x
    const v = diagValues([diagTrack(tr)], []);
    const b = SPEED_BINS.findIndex(([lo, hi]) => 30 >= lo && 30 < hi);
    expect(value(v, `cos5.${b}`)).toBeCloseTo(1, 6);
    expect(value(v, `cos50.${b}`)).toBeCloseTo(1, 6);
    expect(value(v, `turnBig.${b}`)).toBe(0);
    expect(value(v, 'align.5')).toBeCloseTo(-1, 6); // all along x: −⟨cos 2h⟩ = −1
  });
});

describe('E1 tracking observer', () => {
  it('adds noise of the requested SD without changing the walk', () => {
    const o = { incline: Math.PI / 6, ants: 20, seed: 12, dt: 0.02 };
    const clean = runE1(params, o);
    expect(runE1(params, { ...o, tracking: { sx: 0, sy: 0 } }).map((t) => Array.from(t.x))).toEqual(clean.map((t) => Array.from(t.x)));
    const noisy = runE1(params, { ...o, tracking: { sx: 0.1, sy: 0.4 } });
    let sx = 0;
    let sy = 0;
    let n = 0;
    noisy.forEach((t, a) => {
      expect(t.t.length).toBe(clean[a].t.length);
      for (let i = 0; i < t.x.length; i++) {
        sx += (t.x[i] - clean[a].x[i]) ** 2;
        sy += (t.y[i] - clean[a].y[i]) ** 2;
        n++;
      }
    });
    expect(Math.sqrt(sx / n)).toBeCloseTo(0.1, 2);
    expect(Math.sqrt(sy / n)).toBeCloseTo(0.4, 1);
  });
});

describe('continuous geomenotaxis', () => {
  it('is integrated exactly: one 10 mm step equals ten 1 mm steps (each torque alone)', async () => {
    const { geoSteer, DEFAULT_WALK } = await import('../src/sim/models/walk');
    const per = { dt: 0.02, incline: Math.PI / 4, downhill: -Math.PI / 2 } as Parameters<typeof geoSteer>[2];
    for (const q of [{ geoTorque: 0.05, geoPolar: 0 }, { geoTorque: 0, geoPolar: 0.03 }]) {
      const p = { ...DEFAULT_WALK, ...q };
      for (const h0 of [0.3, 2, -2.8, 3.0]) {
        let h = h0;
        for (let i = 0; i < 10; i++) h = geoSteer(p, h, per, 1);
        const d = geoSteer(p, h0, per, 10) - h;
        expect(Math.abs(Math.atan2(Math.sin(d), Math.cos(d)))).toBeLessThan(1e-12);
      }
    }
    // Direction: the axial torque turns a heading 30° off downhill back towards it; the polar torque turns an uphill-ish heading downhill.
    const ax = geoSteer({ ...DEFAULT_WALK, geoTorque: 0.05, geoPolar: 0 }, -Math.PI / 2 + 0.5, per, 5);
    expect(ax).toBeLessThan(-Math.PI / 2 + 0.5);
    const po = geoSteer({ ...DEFAULT_WALK, geoTorque: 0, geoPolar: 0.05 }, Math.PI / 2 - 0.3, per, 5);
    expect(Math.cos(po + Math.PI / 2)).toBeGreaterThan(Math.cos(Math.PI / 2 - 0.3 + Math.PI / 2));
  });
});
