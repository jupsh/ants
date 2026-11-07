export const TAU = Math.PI * 2;
export const BOLTZMANN_EV = 8.617333e-5; // eV / K
export const DAY = 86400;
export const HOUR = 3600;
export const MINUTE = 60;

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function smoothstep(e0: number, e1: number, x: number): number {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Wrap an angle to (-PI, PI]. */
export function wrapAngle(a: number): number {
  a = (a + Math.PI) % TAU;
  if (a < 0) a += TAU;
  return a - Math.PI;
}

export function angleTo(dx: number, dy: number): number {
  return Math.atan2(dy, dx);
}

/**
 * Bit-identical to V8's `Math.hypot(x, y)` (src/builtins/math.tq: normalise
 * by the larger magnitude, sum the squares, sqrt × max; the Kahan
 * compensation is exactly zero for two terms) but inlinable, ~3× faster
 * than the vararg builtin. Checked against `Math.hypot` in test/math.test.ts.
 * Use it where results must stay identical to code that used Math.hypot.
 */
export function hypot(x: number, y: number): number {
  const ax = Math.abs(x);
  const ay = Math.abs(y);
  if (ax === Infinity || ay === Infinity) return Infinity;
  if (x !== x || y !== y) return NaN;
  const max = ax > ay ? ax : ay;
  if (max === 0) return 0;
  const a = ax / max;
  const b = ay / max;
  return Math.sqrt(a * a + b * b) * max;
}

export function hypot2(dx: number, dy: number): number {
  return Math.sqrt(dx * dx + dy * dy);
}

export function hypot3(dx: number, dy: number, dz: number): number {
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Arrhenius (Boltzmann) rate factor relative to a reference temperature.
 * rate(T)/rate(Tref) = exp(E/k * (1/Tref - 1/T)), temperatures in °C.
 */
export function arrhenius(tempC: number, refC: number, energyEv: number): number {
  const T = tempC + 273.15;
  const Tr = refC + 273.15;
  return Math.exp((energyEv / BOLTZMANN_EV) * (1 / Tr - 1 / T));
}

/** Hill-type sigmoid response x^n / (x^n + k^n). */
export function hill(x: number, k: number, n: number): number {
  if (x <= 0) return 0;
  const xn = Math.pow(x, n);
  return xn / (xn + Math.pow(k, n));
}

/** Deterministic 2D value noise in [0,1) for procedural terrain/texture. */
export function hash2(ix: number, iy: number, seed: number): number {
  let h = (ix * 374761393 + iy * 668265263 + seed * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

export function valueNoise(x: number, y: number, seed: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy, seed);
  const b = hash2(ix + 1, iy, seed);
  const c = hash2(ix, iy + 1, seed);
  const d = hash2(ix + 1, iy + 1, seed);
  return lerp(lerp(a, b, sx), lerp(c, d, sx), sy);
}

export function fbm(x: number, y: number, seed: number, octaves = 4): number {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += amp * valueNoise(x * freq, y * freq, seed + o * 17);
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm;
}
