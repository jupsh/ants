import { RNG } from '../core/rng';
import { clamp, lerp, smoothstep, TAU } from '../core/math';
import type { Species } from '../species';
import { Mat, NestGrid } from './grid';

/**
 * Nest architecture templates.
 *
 * Real nest architecture emerges from digging rules that are still only
 * partly understood. Here the *regularities* documented from nest casts
 * (shaft geometry, chamber shape, vertical distribution of chamber area) are
 * encoded as a species template — a superset "plan" of voxels with an
 * excavation priority. Workers then excavate the plan pellet by pellet, always
 * at the existing air frontier, so the nest grows realistically in time and
 * stays proportional to colony size. Replacing templates with fully emergent
 * digging rules is on the roadmap (docs/DESIGN.md).
 *
 * Priority key: lower = dug earlier. Shafts lead, chambers fill outward from
 * their junction, and deeper features come later, which yields the top-heavy
 * area distribution described by Tschinkel (2004).
 */
export interface NestPlan {
  /** Planned voxel -> excavation priority. */
  key: Map<number, number>;
  /** Voxels open from the start (pre-existing cavities, entrance column). */
  preOpen: number[];
  entranceVoxel: number;
  /** World coords of the nest centre (mound centre) and entrance. */
  cx: number;
  cy: number;
  ex: number;
  ey: number;
  /** Optional Temnothorax crevice extents (for wall building). */
  crevice?: { x0: number; y0: number; x1: number; y1: number; z0: number; z1: number };
}

interface Ctx {
  g: NestGrid;
  key: Map<number, number>;
  rng: RNG;
  D: number;
  surface: (x: number, y: number) => number;
}

/**
 * Weight of distance-from-junction (in chamber radii) relative to depth (in
 * plan depths). Larger values make the nest deepen before chambers widen.
 */
const RADIAL_WEIGHT = 1.6;

function setKey(c: Ctx, v: number, k: number): void {
  const old = c.key.get(v);
  if (old === undefined || k < old) c.key.set(v, k);
}

/** Depth term of the priority (0 at surface → 1 at plan depth). */
function depthKey(c: Ctx, z: number): number {
  return 0.15 + clamp(-z / c.D, -0.2, 1.4);
}

/** Rasterise a capsule (tunnel segment). */
function capsule(c: Ctx, ax: number, ay: number, az: number, bx: number, by: number, bz: number, r: number, keyOffset = 0): void {
  const g = c.g;
  const v = g.voxel;
  const x0 = Math.min(ax, bx) - r;
  const x1 = Math.max(ax, bx) + r;
  const y0 = Math.min(ay, by) - r;
  const y1 = Math.max(ay, by) + r;
  const z0 = Math.min(az, bz) - r;
  const z1 = Math.max(az, bz) + r;
  const dx = bx - ax;
  const dy = by - ay;
  const dz = bz - az;
  const len2 = dx * dx + dy * dy + dz * dz || 1;
  for (let k = Math.floor((z0 - g.oz) / v); k <= Math.floor((z1 - g.oz) / v); k++)
    for (let j = Math.floor((y0 - g.oy) / v); j <= Math.floor((y1 - g.oy) / v); j++)
      for (let i = Math.floor((x0 - g.ox) / v); i <= Math.floor((x1 - g.ox) / v); i++) {
        if (!g.inBounds(i, j, k)) continue;
        const px = g.ox + (i + 0.5) * v;
        const py = g.oy + (j + 0.5) * v;
        const pz = g.oz + (k + 0.5) * v;
        const t = clamp(((px - ax) * dx + (py - ay) * dy + (pz - az) * dz) / len2, 0, 1);
        const qx = ax + dx * t - px;
        const qy = ay + dy * t - py;
        const qz = az + dz * t - pz;
        if (qx * qx + qy * qy + qz * qz <= r * r) setKey(c, g.idx(i, j, k), depthKey(c, pz) + keyOffset);
      }
}

/**
 * Flat, lobed "pancake" chamber (Tschinkel's casts): floor at zf, domed
 * ceiling of height h, lobed outline of mean radius r around (cx, cy).
 * Excavation priority grows from the junction point (jx, jy) outward.
 */
function pancake(c: Ctx, cx: number, cy: number, zf: number, r: number, h: number, jx: number, jy: number, lobes = 3): void {
  const g = c.g;
  const v = g.voxel;
  const phase = c.rng.angle();
  const amp = c.rng.range(0.15, 0.35);
  const lobeR = (a: number) => r * (1 + amp * Math.sin(lobes * a + phase) + 0.1 * Math.sin(7 * a + phase * 2));
  const rmax = r * 1.5;
  for (let k = Math.floor((zf - g.oz) / v); k <= Math.floor((zf + h - g.oz) / v); k++)
    for (let j = Math.floor((cy - rmax - g.oy) / v); j <= Math.floor((cy + rmax - g.oy) / v); j++)
      for (let i = Math.floor((cx - rmax - g.ox) / v); i <= Math.floor((cx + rmax - g.ox) / v); i++) {
        if (!g.inBounds(i, j, k)) continue;
        const px = g.ox + (i + 0.5) * v;
        const py = g.oy + (j + 0.5) * v;
        const pz = g.oz + (k + 0.5) * v;
        const dx = px - cx;
        const dy = py - cy;
        const rad = Math.hypot(dx, dy);
        const lr = lobeR(Math.atan2(dy, dx));
        if (rad > lr) continue;
        const ceil = zf + Math.max(v, h * Math.sqrt(Math.max(0, 1 - (rad / lr) ** 2)));
        if (pz < zf || pz > ceil) continue;
        const fromJunction = Math.hypot(px - jx, py - jy) / lr;
        setKey(c, g.idx(i, j, k), depthKey(c, zf) + RADIAL_WEIGHT * fromJunction + 0.05);
      }
}

/** Ellipsoidal chamber (Atta garden chambers, mound galleries). */
function ellipsoid(c: Ctx, cx: number, cy: number, cz: number, rx: number, rz: number, keyBias = 0.05): void {
  const g = c.g;
  const v = g.voxel;
  for (let k = Math.floor((cz - rz - g.oz) / v); k <= Math.floor((cz + rz - g.oz) / v); k++)
    for (let j = Math.floor((cy - rx - g.oy) / v); j <= Math.floor((cy + rx - g.oy) / v); j++)
      for (let i = Math.floor((cx - rx - g.ox) / v); i <= Math.floor((cx + rx - g.ox) / v); i++) {
        if (!g.inBounds(i, j, k)) continue;
        const px = g.ox + (i + 0.5) * v;
        const py = g.oy + (j + 0.5) * v;
        const pz = g.oz + (k + 0.5) * v;
        // Flatten the floor slightly: ants walk on it.
        const ez = pz < cz ? rz * 0.75 : rz;
        const q = ((px - cx) / rx) ** 2 + ((py - cy) / rx) ** 2 + ((pz - cz) / ez) ** 2;
        if (q <= 1) setKey(c, g.idx(i, j, k), depthKey(c, cz) + RADIAL_WEIGHT * 0.6 * Math.sqrt(q) + keyBias);
      }
}

/** A meandering shaft from (x, y, ztop) down to zbot; returns the polyline. */
function shaft(c: Ctx, x: number, y: number, ztop: number, zbot: number, r: number, wander: number, angleFn: (depth: number) => number): [number, number, number][] {
  const pts: [number, number, number][] = [[x, y, ztop]];
  let heading = c.rng.angle();
  let z = ztop;
  const step = Math.max(r * 1.5, c.g.voxel * 2);
  while (z > zbot) {
    const depth = -z;
    const pitch = angleFn(depth);
    heading += c.rng.normal(0, wander);
    const nx = x + Math.cos(heading) * Math.cos(pitch) * step;
    const ny = y + Math.sin(heading) * Math.cos(pitch) * step;
    const nz = z - Math.sin(pitch) * step;
    capsule(c, x, y, z, nx, ny, nz, r);
    x = nx;
    y = ny;
    z = nz;
    pts.push([x, y, z]);
  }
  return pts;
}

/** Helical shaft (Pogonomyrmex badius casts, Tschinkel 2004). */
function helix(c: Ctx, cx: number, cy: number, ztop: number, zbot: number, helixR: number, r: number): [number, number, number][] {
  const pts: [number, number, number][] = [];
  let phi = c.rng.angle();
  let z = ztop;
  let px = cx + Math.cos(phi) * helixR;
  let py = cy + Math.sin(phi) * helixR;
  capsule(c, cx, cy, ztop + 2 * r, px, py, z, r);
  pts.push([px, py, z]);
  const step = Math.max(r, c.g.voxel * 1.5);
  while (z > zbot) {
    const depth = -z;
    // 15–20° near the surface, steepening to ~70° below ~50 cm.
    const pitch = (lerp(17, 70, smoothstep(30, 500, depth)) * Math.PI) / 180;
    const horiz = Math.cos(pitch) * step;
    phi += horiz / helixR;
    const nx = cx + Math.cos(phi) * helixR;
    const ny = cy + Math.sin(phi) * helixR;
    const nz = z - Math.sin(pitch) * step;
    capsule(c, px, py, z, nx, ny, nz, r);
    px = nx;
    py = ny;
    z = nz;
    pts.push([px, py, z]);
  }
  return pts;
}

/** Chambers hung on a shaft polyline with depth-dependent spacing and size. */
function chambersAlong(
  c: Ctx,
  pts: [number, number, number][],
  opts: { spacing: (depth: number) => number; radius: (depth: number) => number; height: number; perLevel: number; outwardFrom?: [number, number] },
): void {
  let nextDepth = opts.spacing(0) * 0.6;
  for (const [x, y, z] of pts) {
    const depth = -z;
    if (depth < nextDepth) continue;
    nextDepth = depth + opts.spacing(depth);
    for (let n = 0; n < opts.perLevel; n++) {
      const r = opts.radius(depth) * c.rng.range(0.8, 1.15);
      let dir = c.rng.angle();
      if (opts.outwardFrom) dir = Math.atan2(y - opts.outwardFrom[1], x - opts.outwardFrom[0]) + c.rng.normal(0, 0.6) + n * Math.PI;
      const ccx = x + Math.cos(dir) * r * 0.75;
      const ccy = y + Math.sin(dir) * r * 0.75;
      pancake(c, ccx, ccy, z - c.g.voxel, r, opts.height, x, y);
    }
  }
}

export function buildPlan(sp: Species, g: NestGrid, rng: RNG, cx: number, cy: number, surface: (x: number, y: number) => number): NestPlan {
  const n = sp.nest;
  const c: Ctx = { g, key: new Map(), rng, D: n.depth, surface };
  const tw = n.tunnelWidth / 2;
  const ch = n.chamberHeight;
  const preOpen: number[] = [];
  let ex = cx;
  let ey = cy;
  let crevice: NestPlan['crevice'];

  // --- Base materials: sky above the surface, soil (or thatch / rock) below.
  const rocky = n.architecture === 'cavity' || n.architecture === 'crevice';
  for (let j = 0; j < g.ny; j++)
    for (let i = 0; i < g.nx; i++) {
      const x = g.ox + (i + 0.5) * g.voxel;
      const y = g.oy + (j + 0.5) * g.voxel;
      const zs = surface(x, y);
      for (let k = 0; k < g.nz; k++) {
        const z = g.oz + (k + 0.5) * g.voxel;
        let m: Mat = z > zs ? Mat.Sky : rocky ? Mat.Rock : Mat.Soil;
        if (m === Mat.Soil && z > 0 && n.architecture === 'formica') m = Mat.Thatch;
        g.setRaw(g.idx(i, j, k), m);
      }
    }

  const steep = (deg: number) => () => (deg * Math.PI) / 180;
  const D = n.depth;

  switch (n.architecture) {
    case 'harvester': {
      const pts = helix(c, cx, cy, 0, -D, 25, tw);
      chambersAlong(c, pts, {
        spacing: (d) => lerp(30, 110, smoothstep(0, 0.75 * D, d)),
        // Chamber area shrinks ~30% per depth decile ⇒ radius × √0.7 per decile.
        radius: (d) => 70 * Math.pow(0.7, (5 * d) / D),
        height: ch,
        perLevel: 2,
        outwardFrom: [cx, cy],
      });
      break;
    }
    case 'fireant': {
      ex = cx + n.moundRadius * 0.85;
      ey = cy;
      // Honeycomb galleries throughout the mound.
      const mh = n.moundHeight;
      const step = Math.max(ch * 1.6, tw * 4);
      for (let z = ch * 0.6; z < mh * 0.85; z += step * 0.7)
        for (let y = -n.moundRadius; y <= n.moundRadius; y += step)
          for (let x = -n.moundRadius; x <= n.moundRadius; x += step) {
            const jx = x + rng.normal(0, step * 0.2);
            const jy = y + rng.normal(0, step * 0.2);
            if (z > surface(cx + jx, cy + jy) - ch) continue;
            ellipsoid(c, cx + jx, cy + jy, z, step * 0.42, ch * 0.5, 0.0);
            capsule(c, cx + jx, cy + jy, z, cx + jx * 0.6, cy + jy * 0.6, z - step * 0.7, tw * 0.8);
          }
      capsule(c, ex, ey, 0, cx, cy, ch, tw);
      for (let s = 0; s < 4; s++) {
        const a = (s / 4) * TAU + rng.range(-0.4, 0.4);
        const sx = cx + Math.cos(a) * n.moundRadius * 0.35;
        const sy = cy + Math.sin(a) * n.moundRadius * 0.35;
        capsule(c, cx, cy, ch, sx, sy, 0, tw);
        const pts = shaft(c, sx, sy, 0, -D * rng.range(0.7, 1), tw, 0.25, steep(78));
        chambersAlong(c, pts, { spacing: (d) => lerp(35, 90, d / D), radius: (d) => 32 * Math.pow(0.75, (5 * d) / D), height: ch, perLevel: 1 });
      }
      break;
    }
    case 'lasius': {
      for (let s = 0; s < 3; s++) {
        const a = (s / 3) * TAU + rng.range(-0.5, 0.5);
        const sx = cx + Math.cos(a) * 15;
        const sy = cy + Math.sin(a) * 15;
        capsule(c, cx, cy, 0, sx, sy, -10, tw);
        const pts = shaft(c, sx, sy, -10, -D * rng.range(0.6, 1), tw, 0.35, () => (rng.range(45, 75) * Math.PI) / 180);
        chambersAlong(c, pts, { spacing: (d) => lerp(22, 60, d / D), radius: (d) => 34 * Math.pow(0.72, (5 * d) / D), height: ch, perLevel: 1 });
      }
      break;
    }
    case 'cataglyphis': {
      const pts = shaft(c, cx, cy, 0, -D, tw, 0.2, () => (rng.range(55, 80) * Math.PI) / 180);
      chambersAlong(c, pts, { spacing: (d) => lerp(45, 90, d / D), radius: (d) => 40 * Math.pow(0.75, (5 * d) / D), height: ch, perLevel: 1 });
      break;
    }
    case 'atta': {
      // Main tunnels descend from the mound; spheroidal garden chambers hang off them.
      for (let s = 0; s < 3; s++) {
        const a = (s / 3) * TAU + rng.range(-0.3, 0.3);
        const sx = cx + Math.cos(a) * 40;
        const sy = cy + Math.sin(a) * 40;
        capsule(c, cx, cy, 0, sx, sy, -30, tw);
        const pts = shaft(c, sx, sy, -30, -D * rng.range(0.75, 1), tw, 0.3, () => (rng.range(50, 75) * Math.PI) / 180);
        let next = 80;
        for (const [x, y, z] of pts) {
          if (-z < next) continue;
          next = -z + rng.range(110, 200);
          const a2 = rng.angle();
          const rr = ch * 0.55 * Math.pow(0.85, (5 * -z) / D) * rng.range(0.85, 1.15);
          const ccx = x + Math.cos(a2) * (rr + tw * 2);
          const ccy = y + Math.sin(a2) * (rr + tw * 2);
          capsule(c, x, y, z, ccx, ccy, z - rr * 0.3, tw);
          ellipsoid(c, ccx, ccy, z - rr * 0.3, rr, rr * 0.7);
        }
      }
      break;
    }
    case 'formica': {
      ex = cx + n.moundRadius * 0.55;
      ey = cy;
      // Gallery network inside the thatch dome.
      const mh = n.moundHeight;
      const step = Math.max(ch * 2.2, tw * 3.5);
      for (let z = ch; z < mh * 0.85; z += step * 0.6)
        for (let y = -n.moundRadius; y <= n.moundRadius; y += step)
          for (let x = -n.moundRadius; x <= n.moundRadius; x += step) {
            const jx = x + rng.normal(0, step * 0.2);
            const jy = y + rng.normal(0, step * 0.2);
            if (z > surface(cx + jx, cy + jy) - ch * 1.2) continue;
            ellipsoid(c, cx + jx, cy + jy, z, step * 0.38, ch * 0.5, -0.05);
            capsule(c, cx + jx, cy + jy, z, cx + jx * 0.7, cy + jy * 0.7, z - step * 0.6, tw);
          }
      capsule(c, ex, ey, surface(ex, ey), cx, cy, ch, tw);
      for (let s = 0; s < 3; s++) {
        const a = (s / 3) * TAU + rng.range(-0.4, 0.4);
        const sx = cx + Math.cos(a) * n.moundRadius * 0.3;
        const sy = cy + Math.sin(a) * n.moundRadius * 0.3;
        capsule(c, cx, cy, ch, sx, sy, -5, tw);
        const pts = shaft(c, sx, sy, -5, -D * rng.range(0.6, 1), tw, 0.3, steep(65));
        chambersAlong(c, pts, { spacing: (d) => lerp(40, 90, d / D), radius: (d) => 45 * Math.pow(0.75, (5 * d) / D), height: ch, perLevel: 1 });
      }
      break;
    }
    case 'cavity': {
      // Pre-existing void beneath the floor (e.g. under a skirting board).
      const zTop = -4;
      const h = ch;
      const lobes = 4;
      const phase = rng.angle();
      for (let k = 0; k < g.nz; k++)
        for (let j = 0; j < g.ny; j++)
          for (let i = 0; i < g.nx; i++) {
            const x = g.ox + (i + 0.5) * g.voxel - cx;
            const y = g.oy + (j + 0.5) * g.voxel - cy;
            const z = g.oz + (k + 0.5) * g.voxel;
            const rr = n.radius * 0.8 * (1 + 0.2 * Math.sin(lobes * Math.atan2(y, x) + phase));
            if (Math.hypot(x * 0.8, y * 1.3) < rr && z < zTop && z > zTop - h) preOpen.push(g.idx(i, j, k));
          }
      // Crack from the floor surface into the void.
      ex = cx + n.radius * 0.6;
      ey = cy;
      const v = g.voxel;
      for (let z = 0; z > zTop - h * 0.5; z -= v * 0.5)
        for (let t = 0; t <= 1.0001; t += 0.1) {
          const vx = g.voxelAt(lerp(ex, ex - 6, t), ey, z);
          if (vx >= 0) preOpen.push(vx);
        }
      break;
    }
    case 'crevice': {
      const cav = sp.special.crevice!;
      const z1 = -0.3;
      const z0 = z1 - cav.cavityHeight;
      const hx = n.radius;
      const hy = n.radius * 0.75;
      crevice = { x0: cx - hx, y0: cy - hy, x1: cx + hx, y1: cy + hy, z0, z1 };
      for (let k = 0; k < g.nz; k++)
        for (let j = 0; j < g.ny; j++)
          for (let i = 0; i < g.nx; i++) {
            const x = g.ox + (i + 0.5) * g.voxel;
            const y = g.oy + (j + 0.5) * g.voxel;
            const z = g.oz + (k + 0.5) * g.voxel;
            const inside = Math.abs(x - cx) < hx && Math.abs(y - cy) < hy;
            if (inside && z > z0 && z < z1) preOpen.push(g.idx(i, j, k));
          }
      // Entrance: the crevice opens at one edge.
      ex = cx + hx + 1.5;
      ey = cy;
      for (let x = cx + hx - 2; x <= ex + 1; x += g.voxel * 0.5)
        for (let z = z0 + 0.1; z < 0.8; z += g.voxel * 0.5) {
          const vx = g.voxelAt(x, ey, z);
          if (vx >= 0) preOpen.push(vx);
          const vy = g.voxelAt(x, ey + g.voxel, z);
          if (vy >= 0) preOpen.push(vy);
        }
      break;
    }
  }

  // Entrance column: from the surface down to the first planned voxels.
  const zSurf = surface(ex, ey);
  const entranceVoxel = g.voxelAt(ex, ey, zSurf - g.voxel * 0.5);
  if (n.architecture !== 'cavity' && n.architecture !== 'crevice') {
    capsule(c, ex, ey, zSurf + g.voxel, ex, ey, Math.min(zSurf - tw * 3, -tw * 2), tw, -1);
    if (ex !== cx || ey !== cy) capsule(c, ex, ey, Math.min(zSurf - tw * 3, -tw * 2), cx, cy, -tw * 2, tw, -1);
  }
  // Anything planned in the sky is not real excavation.
  for (const v of [...c.key.keys()]) if (g.mat[v] === Mat.Sky) c.key.delete(v);
  if (entranceVoxel >= 0) {
    preOpen.push(entranceVoxel);
    c.key.delete(entranceVoxel);
  }
  return { key: c.key, preOpen, entranceVoxel, cx, cy, ex, ey, crevice };
}
