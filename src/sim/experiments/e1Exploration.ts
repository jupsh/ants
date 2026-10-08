import { RNG } from '../core/rng';
import type { Track } from '../analysis/trajectory';
import { initWalkState, walkStep, type WalkParams } from '../models/walk';
import { basicPercept } from '../perception/types';
import { PlaneSurface } from '../world/surface';

/**
 * E1 — exploratory walking of isolated Lasius niger workers
 * (Khuong et al. 2013 apparatus): ants released one at a time at the centre
 * of a plane tilted by `incline` (steepest line along the y axis), filmed at
 * 25 Hz until they leave a 0.2 m circle around the release point.
 * Conditions: 26 °C, 50 % RH.
 */
export interface E1Options {
  incline: number;
  ants: number;
  seed: number;
  /** Integration time step (s). */
  dt: number;
  /** Recording interval (s); the data were sampled at 25 Hz. */
  sampleDt?: number;
  /** Give up after this long (s). */
  maxTime?: number;
  /** Path-integration noise (rad² per mm); 0 = perfect. */
  piNoise?: number;
  /** Index of the first ant (each ant's stream is RNG.stream(seed, index)), for splitting runs across workers. */
  firstAnt?: number;
  /**
   * Simulated tracking: independent Gaussian position error per recorded
   * sample (SD in mm along x and along the slope axis y), drawn from the
   * ant's own observer stream so the walk itself is unchanged.
   */
  tracking?: { sx: number; sy: number };
}

/** RNG key of the per-ant observer stream. */
const OBSERVER_KEY = 0x0b5e;

export function runE1(p: WalkParams, o: E1Options): Track[] {
  const surface = new PlaneSurface(o.incline, -Math.PI / 2);
  const sampleDt = o.sampleDt ?? 0.04;
  const maxTime = o.maxTime ?? 600;
  const tracks: Track[] = [];
  const first = o.firstAnt ?? 0;
  for (let a = first; a < first + o.ants; a++) {
    // One independent stream per ant: results do not depend on the number of
    // ants simulated before it, or on the time step used for other ants.
    const rng = RNG.stream(o.seed, a);
    const s = initWalkState(p, rng);
    let x = 0;
    let y = 0;
    const pi = { x: 0, y: 0 };
    const move = (dx: number, dy: number, len: number) => {
      x += dx;
      y += dy;
      const noise = o.piNoise ? Math.sqrt(o.piNoise * len) * rng.gauss() : 0;
      const h = Math.atan2(dy, dx) + noise;
      pi.x += Math.cos(h) * len;
      pi.y += Math.sin(h) * len;
    };
    const t: number[] = [0];
    const xs: number[] = [0];
    const ys: number[] = [0];
    let time = 0;
    let nextSample = sampleDt;
    const slope = surface.slopeAt();
    const per = basicPercept(o.dt, slope.incline, slope.downhill, 26);
    while (time < maxTime) {
      walkStep(p, s, per, rng, 1, pi, move);
      time += o.dt;
      while (time >= nextSample - 1e-9) {
        t.push(nextSample);
        xs.push(x);
        ys.push(y);
        nextSample += sampleDt;
      }
      if (x * x + y * y > 205 * 205) break;
    }
    if (o.tracking) {
      const obs = RNG.stream(o.seed, a, OBSERVER_KEY);
      for (let i = 0; i < xs.length; i++) {
        xs[i] += obs.normal(0, o.tracking.sx);
        ys[i] += obs.normal(0, o.tracking.sy);
      }
    }
    tracks.push({ id: `sim-${a}`, t: Float64Array.from(t), x: Float64Array.from(xs), y: Float64Array.from(ys) });
  }
  return tracks;
}
