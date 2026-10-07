import { DAY, HOUR, clamp } from '../core/math';

export interface ClimateParams {
  surfaceMin: number;
  surfaceMax: number;
  airMin: number;
  airMax: number;
  sunrise: number; // h
  sunset: number; // h
  indoor: boolean;
}

/**
 * Parton & Logan (1981) diel temperature model: a truncated sine during the
 * day (with the maximum lagging solar noon) and an exponential decay at night.
 * Lag/decay coefficients: air a = 1.86 h, b = 2.2 (Parton & Logan, 150 cm air);
 * soil surface uses a shorter lag (estimated a = 1.0 h, b = 1.8).
 */
function partonLogan(h: number, tMin: number, tMax: number, rise: number, set: number, a: number, b: number): number {
  const D = set - rise;
  const N = 24 - D;
  const day = (hh: number) => tMin + (tMax - tMin) * Math.sin((Math.PI * (hh - rise)) / (D + 2 * a));
  if (h >= rise && h <= set) return day(h);
  const tSet = day(set);
  const n = h > set ? h - set : h + 24 - set;
  const eb = Math.exp(-b);
  return tMin + ((tSet - tMin) * (Math.exp((-b * n) / N) - eb)) / (1 - eb);
}

export class Climate {
  constructor(readonly p: ClimateParams) {}

  hourOf(t: number): number {
    return ((t % DAY) + DAY) % DAY / HOUR;
  }

  surfaceTemp(t: number): number {
    const p = this.p;
    if (p.indoor) return (p.surfaceMin + p.surfaceMax) / 2 + ((p.surfaceMax - p.surfaceMin) / 2) * Math.sin(((this.hourOf(t) - 9) / 24) * 2 * Math.PI);
    return partonLogan(this.hourOf(t), p.surfaceMin, p.surfaceMax, p.sunrise, p.sunset, 1.0, 1.8);
  }

  airTemp(t: number): number {
    const p = this.p;
    if (p.indoor) return (p.airMin + p.airMax) / 2;
    return partonLogan(this.hourOf(t), p.airMin, p.airMax, p.sunrise, p.sunset, 1.86, 2.2);
  }

  /**
   * Body temperature of an ant whose body is held `height` mm above the
   * ground: exponential boundary-layer profile between ground and air
   * (characteristic thickness ~2.5 mm, estimated). Long-legged desert ants run
   * markedly cooler than the surface.
   */
  bodyTemp(t: number, heightMm: number): number {
    const ts = this.surfaceTemp(t);
    const ta = this.airTemp(t);
    return ta + (ts - ta) * Math.exp(-heightMm / 2.5);
  }

  /** Daylight fraction 0..1 with ~40 min twilight ramps. */
  light(t: number): number {
    const p = this.p;
    const h = this.hourOf(t);
    if (p.indoor) return h >= p.sunrise && h < p.sunset ? 1 : 0.05;
    const tw = 0.7;
    const up = clamp((h - (p.sunrise - tw / 2)) / tw, 0, 1);
    const down = clamp((p.sunset + tw / 2 - h) / tw, 0, 1);
    return Math.min(up, down);
  }

  /** Approximate sun direction for rendering: [azimuth rad from +x, elevation rad]. */
  sun(t: number): [number, number] {
    const p = this.p;
    const h = this.hourOf(t);
    const f = (h - p.sunrise) / (p.sunset - p.sunrise);
    const elev = Math.sin(Math.PI * clamp(f, -0.15, 1.15)) * 1.1;
    const az = Math.PI * (1 - f); // east (+x) to west (-x) across the south (-y)
    return [az, elev];
  }
}
