import { arrhenius, clamp, smoothstep } from '../core/math';
import type { Species } from '../species';
import type { Ant } from './ant';

/** Activation energy for whole-organism metabolism (Gillooly et al. 2001). */
const METABOLIC_E = 0.65;
/** 1 M sucrose: mg sugar per µL. */
export const SUCROSE_MG_PER_UL_PER_M = 0.342;

/**
 * Locomotion temperature factor relative to 28 °C: Arrhenius with the
 * species' activation energy (Hurlbert et al. 2008) up to the optimum, a
 * decline towards CTmax, and a smooth onset of chill coma near CTmin.
 */
export function tempSpeedFactor(sp: Species, temp: number): number {
  const lo = sp.locomotion;
  if (temp <= lo.tempMin) return 0;
  let f = arrhenius(Math.min(temp, lo.tempOpt), 28, lo.activationEnergy);
  if (temp > lo.tempOpt) f *= clamp(1 - (0.6 * (temp - lo.tempOpt)) / Math.max(1, lo.tempMax - lo.tempOpt), 0.3, 1);
  return f * smoothstep(lo.tempMin, lo.tempMin + 4, temp);
}

/** Speed fraction retained under a load (linear decline, Burd 1996). */
export function loadFactor(sp: Species, a: Ant): number {
  if (!a.load) return 1;
  return clamp(1 - (sp.locomotion.loadSlope * a.load.mass) / a.mass, 0.2, 1);
}

/** Metabolic consumption (mg sugar-equivalent per second). */
export function metabolicRate(sp: Species, a: Ant, temp: number, active: boolean): number {
  const p = sp.physiology;
  const base = (p.metabolicRate * Math.pow(a.mass, 0.75)) / 1000 / 3600;
  return base * arrhenius(clamp(temp, 0, 45), 25, METABOLIC_E) * (active ? p.activeFactor : 1) * (a.queen ? 1.5 : 1);
}

/**
 * Burn energy over dt: first from the crop (social stomach contents are
 * absorbed), then from the fat-body reserve. Returns false if the ant starved.
 */
export function consume(a: Ant, mgSugar: number): boolean {
  // Absorb from crop into reserve when reserve is below max.
  const want = Math.max(0, a.reserveMax - a.reserve) + mgSugar;
  if (a.cropSugar > 0 && want > 0) {
    const take = Math.min(a.cropSugar, want, a.reserveMax * 0.02 + mgSugar);
    const frac = take / a.cropSugar;
    a.cropSugar -= take;
    a.cropVol -= a.cropVol * frac;
    a.reserve += take;
  }
  a.reserve -= mgSugar;
  if (a.reserve > a.reserveMax) a.reserve = a.reserveMax;
  return a.reserve > 0;
}

/** Move liquid food between crops (trophallaxis). Returns µL moved. */
export function transferCrop(from: Ant, to: Ant, maxUl: number): number {
  const room = to.cropCap - to.cropVol;
  const ul = Math.min(maxUl, from.cropVol, room);
  if (ul <= 0) return 0;
  const conc = from.cropSugar / Math.max(1e-9, from.cropVol);
  from.cropVol -= ul;
  from.cropSugar -= ul * conc;
  to.cropVol += ul;
  to.cropSugar += ul * conc;
  return ul;
}
