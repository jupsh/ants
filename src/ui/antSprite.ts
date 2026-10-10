/**
 * Top-view worker ant sprite (roughly Lasius niger proportions, ~3.6 mm):
 * head with elbowed antennae, mesosoma carrying six jointed legs, petiole
 * node and a gaster that swells with the crop load. Drawn pointing along +x.
 */
export interface AntStyle {
  /** Pixels per mm. */
  scale: number;
  /** Crop load 0 (empty) … 1 (full). */
  load: number;
  color: string;
  /** Gait phase (rad) for alternating tripod leg swing; omit for standing still. */
  gait?: number;
  /** If set, the crop contents show as a core of this colour inside the gaster, its size growing with the load. */
  cropColor?: string;
}

// Segment centres (mm along the body axis, head forward) and half-sizes.
const HEAD = { x: 1.25, rx: 0.42, ry: 0.4 };
const MESO = { x: 0.35, rx: 0.62, ry: 0.24 };
const PETIOLE = { x: -0.38, rx: 0.12, ry: 0.15 };
const GASTER = { x: -1.05, rx: 0.62, ry: 0.5 };

// Leg roots on the mesosoma (x, mm) and resting angles (rad from +x) for one side.
const LEGS = [
  { x: 0.62, a: 0.75 },
  { x: 0.35, a: 1.57 },
  { x: 0.08, a: 2.35 },
];

export function drawAnt(ctx: CanvasRenderingContext2D, x: number, y: number, heading: number, st: AntStyle): void {
  const s = st.scale;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(heading);
  ctx.scale(s, s);
  ctx.fillStyle = st.color;
  ctx.strokeStyle = st.color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Legs: femur out, tibia bent back; tripods alternate when walking.
  ctx.lineWidth = 0.09;
  for (const side of [1, -1])
    LEGS.forEach((leg, k) => {
      const tripod = (k % 2 === 0) === (side === 1) ? 1 : -1;
      const swing = st.gait === undefined ? 0 : 0.28 * Math.sin(st.gait) * tripod;
      const a = leg.a + swing;
      const kx = leg.x + Math.cos(a) * 0.75;
      const ky = side * Math.sin(a) * 0.75;
      const b = a + (k === 0 ? -0.35 : 0.45);
      const fx = kx + Math.cos(b) * 0.8;
      const fy = ky + side * Math.sin(b) * 0.8;
      ctx.beginPath();
      ctx.moveTo(leg.x, side * 0.12);
      ctx.lineTo(kx, ky);
      ctx.lineTo(fx, fy);
      ctx.stroke();
    });

  // Antennae: scape forward-out, funiculus bent forward.
  ctx.lineWidth = 0.07;
  for (const side of [1, -1]) {
    const bx = HEAD.x + 0.25;
    const by = side * 0.18;
    const ex = bx + 0.55;
    const ey = by + side * 0.45;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(ex, ey);
    ctx.lineTo(ex + 0.65, ey + side * 0.05);
    ctx.stroke();
  }

  // Body segments.
  const g = 1 + 0.45 * Math.min(1, Math.max(0, st.load));
  const ell = (cx: number, rx: number, ry: number) => {
    ctx.beginPath();
    ctx.ellipse(cx, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  };
  ell(GASTER.x - (g - 1) * 0.35, GASTER.rx * g, GASTER.ry * g);
  ell(PETIOLE.x, PETIOLE.rx, PETIOLE.ry);
  ell(MESO.x, MESO.rx, MESO.ry);
  ell(HEAD.x, HEAD.rx, HEAD.ry);
  const load = Math.min(1, Math.max(0, st.load));
  if (st.cropColor && load > 0.01) {
    const k = 0.8 * Math.sqrt(load);
    ctx.fillStyle = st.cropColor;
    ell(GASTER.x - (g - 1) * 0.35, GASTER.rx * g * k, GASTER.ry * g * k);
  }
  // Swollen gasters show the intersegmental membrane as pale bands.
  if (st.load > 0.3) {
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 0.05;
    const gx = GASTER.x - (g - 1) * 0.35;
    for (const dx of [-0.2, 0.15]) {
      ctx.beginPath();
      ctx.ellipse(gx + dx * g, 0, 0.08, GASTER.ry * g * 0.85, 0, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
    }
  }
  ctx.restore();
}
