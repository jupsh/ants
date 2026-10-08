import { MODE_NAMES, runColony, type ShareBout } from '../sim/experiments/colonyBles';
import { LASIUS_NEST, LASIUS_PARAMS } from '../sim/species/lasiusM1';
import { blesApparatus } from '../sim/world/apparatus';

/**
 * The colony page's computation (step 4, provisional), shared by its worker
 * and scripts/precompute.ts. Frames are packed compactly: positions in
 * 0.01 mm, heading, crop fill and behaviour as bytes.
 */
export interface ColonyRequest {
  seed: number;
  ants: number;
  minutes: number;
  foodMinute: number;
  /** Seconds between frames. */
  frameDt: number;
}

export interface ColonyView {
  n: number;
  frameDt: number;
  frames: number;
  /** Apparatus offset of the packed positions (mm). */
  x0: number;
  y0: number;
  /** Per frame, per ant: (x − x0)·100, (y − y0)·100 interleaved. */
  pos: Uint16Array;
  /** Heading in 1/256 turns. */
  heading: Uint8Array;
  /** Crop fill in 1/255 of capacity. */
  crop: Uint8Array;
  /** Behaviour code (index into `modes`; 255 = dead). */
  mode: Uint8Array;
  modes: string[];
  /** Sharing partner (−1: none). */
  partner: Int8Array;
  /** Per frame: antennal contacts, food left (µL), sugar (mg) in food, crops, reserves, respired, and the ledger's sum over all accounts (0 if conserved). */
  contacts: Uint16Array;
  foodUl: Float32Array;
  sugar: Float64Array;
  residual: Float64Array;
  bouts: ShareBout[];
  forager: boolean[];
  foodTime: number;
  cropCapacity: number;
  ms: number;
}

export function computeColony(r: ColonyRequest): ColonyView {
  const t0 = performance.now();
  const res = runColony({ ...LASIUS_PARAMS, nest: LASIUS_NEST }, { seed: r.seed, ants: r.ants, minutes: r.minutes, foodMinute: r.foodMinute, frameEvery: r.frameDt });
  const { app } = blesApparatus();
  const { x0, y0 } = app.bounds;
  const n = r.ants;
  const F = res.frames.length;
  const v: ColonyView = {
    n,
    frameDt: r.frameDt,
    frames: F,
    x0,
    y0,
    pos: new Uint16Array(2 * n * F),
    heading: new Uint8Array(n * F),
    crop: new Uint8Array(n * F),
    mode: new Uint8Array(n * F),
    modes: MODE_NAMES,
    partner: new Int8Array(n * F),
    contacts: new Uint16Array(F),
    foodUl: new Float32Array(F),
    sugar: new Float64Array(4 * F),
    residual: new Float64Array(F),
    bouts: res.bouts.map((b) => ({ ...b, start: Math.round(b.start * 10) / 10, end: Math.round(b.end * 10) / 10, ul: Math.round(b.ul * 1e4) / 1e4 })),
    forager: res.forager,
    foodTime: res.foodTime,
    cropCapacity: LASIUS_PARAMS.morph.cropCapacity,
    ms: 0,
  };
  const cap = LASIUS_PARAMS.morph.cropCapacity;
  res.frames.forEach((f, k) => {
    for (let i = 0; i < n; i++) {
      const j = k * n + i;
      v.pos[2 * j] = Math.round((f.x[i] - x0) * 100);
      v.pos[2 * j + 1] = Math.round((f.y[i] - y0) * 100);
      v.heading[j] = Math.round(((((f.heading[i] / (2 * Math.PI)) % 1) + 1) % 1) * 256) & 255;
      v.crop[j] = Math.round(Math.min(1, f.crop[i] / cap) * 255);
      v.mode[j] = f.mode[i];
      v.partner[j] = f.partner[i];
    }
    v.contacts[k] = f.contacts;
    v.foodUl[k] = f.foodUl;
    v.sugar.set([f.sugar.food, f.sugar.crop, f.sugar.reserve, f.sugar.respired], 4 * k);
    v.residual[k] = f.sugarTotal;
  });
  v.ms = performance.now() - t0;
  return v;
}

const TYPED = { Uint16Array, Uint8Array, Int8Array, Float32Array, Float64Array } as const;
type TypedName = keyof typeof TYPED;

/** JSON form for precomputed files: typed arrays as base64 (little-endian, as both writer and reader run on). */
export function colonyToJson(v: ColonyView): unknown {
  return Object.fromEntries(
    Object.entries(v).map(([k, x]) => {
      const name = Object.keys(TYPED).find((t) => x instanceof TYPED[t as TypedName]);
      return [k, name ? { typed: name, b64: toBase64(new Uint8Array((x as ArrayBufferView).buffer, (x as ArrayBufferView).byteOffset, (x as ArrayBufferView).byteLength)) } : x];
    }),
  );
}

export function colonyFromJson(j: Record<string, unknown>): ColonyView {
  return Object.fromEntries(
    Object.entries(j).map(([k, x]) => {
      if (x && typeof x === 'object' && 'typed' in x && 'b64' in x) {
        const bytes = fromBase64((x as { b64: string }).b64);
        const T = TYPED[(x as { typed: TypedName }).typed];
        return [k, new T(bytes.buffer as ArrayBuffer, 0, bytes.byteLength / T.BYTES_PER_ELEMENT)];
      }
      return [k, x];
    }),
  ) as unknown as ColonyView;
}

function toBase64(b: Uint8Array): string {
  let s = '';
  for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000));
  return btoa(s);
}

function fromBase64(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
