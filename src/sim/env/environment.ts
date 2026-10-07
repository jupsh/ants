import { DAY, clamp } from '../core/math';
import type { Species } from '../species';
import { Climate } from './climate';
import { SoilColumn } from './soilHeat';

/**
 * Wood-ant mound cores are held at roughly 25–30 °C in summer by solar
 * heating and colony metabolism (Frouz 2000). Modelled as relaxation of the
 * mound interior towards this core value, scaled by depth into the mound.
 */
const MOUND_CORE_C = 26;

export class Environment {
  readonly climate: Climate;
  readonly soil: SoilColumn;
  time: number;
  readonly meanSurface: number;
  private soilAcc = 0;

  // cached per-step values
  surfaceT = 0;
  airT = 0;
  light = 0;

  constructor(readonly sp: Species, startTime: number) {
    const h = sp.habitat;
    this.climate = new Climate({
      surfaceMin: h.surfaceMin,
      surfaceMax: h.surfaceMax,
      airMin: h.airMin,
      airMax: h.airMax,
      sunrise: h.sunrise,
      sunset: h.sunset,
      indoor: h.indoor,
    });
    // Deep-soil boundary: true daily mean of the surface temperature curve.
    let acc = 0;
    for (let m = 0; m < 24 * 60; m += 5) acc += this.climate.surfaceTemp(m * 60);
    this.meanSurface = acc / (24 * 12);
    const mean = this.meanSurface;
    this.soil = new SoilColumn(Math.max(400, sp.nest.depth * 1.6 + 200), h.soilDiffusivity, mean);
    // Spin up the soil column for 4 days so the profile is periodic.
    this.time = startTime - 4 * DAY;
    while (this.time < startTime) {
      this.soil.step(60, this.climate.surfaceTemp(this.time), mean);
      this.time += 60;
    }
    this.time = startTime;
    this.refresh();
  }

  /** Advance environmental state by dt (seconds). */
  advance(dt: number): void {
    this.time += dt;
    this.soilAcc += dt;
    if (this.soilAcc >= 30) {
      this.soil.step(this.soilAcc, this.climate.surfaceTemp(this.time), this.meanSurface);
      this.soilAcc = 0;
    }
    this.refresh();
  }
  private refresh(): void {
    this.surfaceT = this.climate.surfaceTemp(this.time);
    this.airT = this.climate.airTemp(this.time);
    this.light = this.climate.light(this.time);
  }

  bodyTemp(heightMm: number): number {
    return this.airT + (this.surfaceT - this.airT) * Math.exp(-heightMm / 2.5);
  }

  /**
   * Temperature inside the nest at height z (mm, 0 = ground level, negative =
   * underground). Positive z is inside a mound of height `moundH`.
   */
  nestTemp(z: number, moundH: number): number {
    if (z <= 0) return this.soil.at(-z);
    if (moundH <= 0) return this.airT;
    const inside = clamp(1 - z / moundH, 0, 1); // 1 at mound base, 0 at top surface
    const shell = this.soil.at(0) * 0.5 + this.airT * 0.5;
    return shell + (MOUND_CORE_C - shell) * Math.sqrt(inside) * 0.8;
  }

  get hour(): number {
    return this.climate.hourOf(this.time);
  }

  get day(): number {
    return Math.floor(this.time / DAY);
  }
}
