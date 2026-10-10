/**
 * Minimal SVG line chart with a snapping crosshair tooltip. Series colours
 * come from CSS custom properties so light/dark themes swap automatically.
 * The chart is drawn at its container's pixel width (redrawn on resize), so
 * text keeps its size whatever the card width.
 */
export interface Series {
  name: string;
  color: string; // CSS colour or var()
  x: number[];
  y: number[];
  /** Lower edge of a shaded band; `y` is then the upper edge (no line drawn). */
  lower?: number[];
  dashed?: boolean;
  /** Leave out of the legend (e.g. one of several thin context lines). */
  noLegend?: boolean;
  /** Leave out of the hover tooltip. */
  noTooltip?: boolean;
  /** Stroke opacity and width (defaults 1 and 2); fill opacity for bands (default 0.18). */
  opacity?: number;
  width?: number;
}

export interface LineChartOptions {
  title: string;
  xLabel: string;
  yLabel: string;
  xFormat?: (v: number) => string;
  yFormat?: (v: number) => string;
  yMin?: number;
  yMax?: number;
  height?: number;
  /** Optional horizontal reference line. */
  refY?: number;
  /** Optional labelled vertical marker. */
  refX?: { x: number; label: string };
  /** Optional note under the chart. */
  note?: string;
}

const NS = 'http://www.w3.org/2000/svg';

let tipEl: HTMLDivElement | null = null;
/** The one floating tooltip shared by all charts on the page. */
export function sharedTooltip(): HTMLDivElement {
  if (!tipEl) {
    tipEl = document.createElement('div');
    tipEl.className = 'tooltip';
    tipEl.style.display = 'none';
    document.body.appendChild(tipEl);
  }
  return tipEl;
}

function el<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  return e;
}

function niceTicks(lo: number, hi: number, n = 5): number[] {
  const span = hi - lo || 1;
  const step0 = span / n;
  const mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= n) ?? mag * 10;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(10));
  return out;
}

/** Legend/tooltip key drawn in the series' own style (line, dashed line or band). */
function keyEl(s: Series): HTMLSpanElement {
  const key = document.createElement('span');
  key.className = 'key';
  if (s.lower) {
    key.style.cssText = `height:10px;background:${s.color};opacity:${Math.min(1, (s.opacity ?? 0.18) * 2.5)};border-radius:2px`;
  } else {
    const w = Math.max(1, Math.round(s.width ?? 2));
    key.style.cssText = `height:0;border-top:${w}px ${s.dashed ? 'dashed' : 'solid'} ${s.color};background:none;opacity:${s.opacity ?? 1}`;
  }
  return key;
}

const observers = new WeakMap<HTMLElement, ResizeObserver>();

export function lineChart(container: HTMLElement, series: Series[], o: LineChartOptions): void {
  observers.get(container)?.disconnect();
  container.textContent = '';
  const card = document.createElement('div');
  card.className = 'card';
  const h = document.createElement('h2');
  h.textContent = o.title;
  card.appendChild(h);
  const legend = document.createElement('div');
  legend.className = 'legend';
  for (const s of series) {
    if (s.noLegend) continue;
    const item = document.createElement('span');
    item.append(keyEl(s), s.name);
    legend.appendChild(item);
  }
  card.appendChild(legend);
  const plot = document.createElement('div');
  card.appendChild(plot);
  if (o.note) card.appendChild(Object.assign(document.createElement('p'), { className: 'note', textContent: o.note }));
  container.appendChild(card);

  let drawnW = 0;
  const paint = () => {
    const W = Math.max(260, Math.round(plot.clientWidth || 420));
    if (W === drawnW) return;
    drawnW = W;
    plot.textContent = '';
    plot.appendChild(svgChart(series, o, W));
  };
  paint();
  const ro = new ResizeObserver(paint);
  ro.observe(plot);
  observers.set(container, ro);
}

function svgChart(series: Series[], o: LineChartOptions, W: number): SVGSVGElement {
  const H = o.height ?? Math.round(Math.min(340, Math.max(200, W * 0.5)));
  const m = { l: 46, r: 14, t: 8, b: 38 };
  const xs = series.flatMap((s) => s.x.filter(Number.isFinite));
  const ys = series.flatMap((s) => [...s.y, ...(s.lower ?? [])].filter(Number.isFinite));
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img', 'aria-label': o.title });
  svg.style.display = 'block';
  svg.style.overflow = 'visible';
  if (!xs.length) return svg;
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const y0 = o.yMin ?? Math.min(0, ...ys);
  const y1 = o.yMax ?? Math.max(...ys) * 1.05;
  const sx = (v: number) => m.l + ((v - x0) / (x1 - x0 || 1)) * (W - m.l - m.r);
  const sy = (v: number) => H - m.b - ((v - y0) / (y1 - y0 || 1)) * (H - m.t - m.b);
  const fx = o.xFormat ?? ((v: number) => String(+v.toFixed(2)));
  const fy = o.yFormat ?? ((v: number) => String(+v.toFixed(2)));
  const text = (x: number, y: number, s: string, attrs: Record<string, string | number>) => {
    const t = el('text', { x, y, 'font-size': 11, fill: 'var(--text-muted)', ...attrs });
    t.textContent = s;
    svg.appendChild(t);
  };
  for (const t of niceTicks(y0, y1)) {
    svg.appendChild(el('line', { x1: m.l, x2: W - m.r, y1: sy(t), y2: sy(t), stroke: 'var(--grid)', 'stroke-width': 1 }));
    text(m.l - 6, sy(t) + 4, fy(t), { 'text-anchor': 'end' });
  }
  for (const t of niceTicks(x0, x1, Math.max(3, Math.min(8, Math.floor(W / 70))))) text(sx(t), H - m.b + 16, fx(t), { 'text-anchor': 'middle' });
  const zeroY = sy(Math.max(y0, Math.min(y1, 0)));
  svg.appendChild(el('line', { x1: m.l, x2: W - m.r, y1: zeroY, y2: zeroY, stroke: 'var(--axis)', 'stroke-width': 1 }));
  if (o.refY !== undefined) svg.appendChild(el('line', { x1: m.l, x2: W - m.r, y1: sy(o.refY), y2: sy(o.refY), stroke: 'var(--axis)', 'stroke-dasharray': '3 3' }));
  if (o.refX && o.refX.x >= x0 && o.refX.x <= x1) {
    svg.appendChild(el('line', { x1: sx(o.refX.x), x2: sx(o.refX.x), y1: m.t, y2: H - m.b, stroke: 'var(--axis)', 'stroke-dasharray': '3 3' }));
    text(sx(o.refX.x) + 4, m.t + 10, o.refX.label, {});
  }
  text((m.l + W - m.r) / 2, H - 4, o.xLabel, { 'text-anchor': 'middle', fill: 'var(--text-secondary)' });
  const ym = (m.t + H - m.b) / 2;
  text(12, ym, o.yLabel, { 'text-anchor': 'middle', fill: 'var(--text-secondary)', transform: `rotate(-90 12 ${ym})` });
  // Bands first, then lines in series order.
  for (const s of series) {
    if (!s.lower) continue;
    const idx = s.x.map((_, i) => i).filter((i) => Number.isFinite(s.x[i]) && Number.isFinite(s.y[i]) && Number.isFinite(s.lower![i]));
    if (!idx.length) continue;
    const up = idx.map((i, k) => `${k ? 'L' : 'M'}${sx(s.x[i]).toFixed(1)},${sy(s.y[i]).toFixed(1)}`).join('');
    const down = [...idx].reverse().map((i) => `L${sx(s.x[i]).toFixed(1)},${sy(s.lower![i]).toFixed(1)}`).join('');
    svg.appendChild(el('path', { d: `${up}${down}Z`, fill: s.color, 'fill-opacity': s.opacity ?? 0.18, stroke: 'none' }));
  }
  for (const s of series) {
    if (s.lower) continue;
    const pts = s.x.map((x, i) => [x, s.y[i]] as const).filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
    if (!pts.length) continue;
    const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('');
    svg.appendChild(el('path', { d, fill: 'none', stroke: s.color, 'stroke-width': s.width ?? 2, 'stroke-opacity': s.opacity ?? 1, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', ...(s.dashed ? { 'stroke-dasharray': '5 4' } : {}) }));
  }
  // Crosshair + tooltip.
  const cross = el('line', { y1: m.t, y2: H - m.b, stroke: 'var(--axis)', 'stroke-width': 1, visibility: 'hidden' });
  svg.appendChild(cross);
  const hit = el('rect', { x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b, fill: 'transparent' });
  svg.appendChild(hit);
  const tip = sharedTooltip();
  const allX = [...new Set(xs)].sort((a, b) => a - b);
  hit.addEventListener('pointermove', (ev) => {
    const r = svg.getBoundingClientRect();
    const px = ((ev.clientX - r.left) / r.width) * W;
    const xv = x0 + ((px - m.l) / (W - m.l - m.r)) * (x1 - x0);
    const near = allX.reduce((b, v) => (Math.abs(v - xv) < Math.abs(b - xv) ? v : b), allX[0]);
    cross.setAttribute('x1', String(sx(near)));
    cross.setAttribute('x2', String(sx(near)));
    cross.setAttribute('visibility', 'visible');
    tip.textContent = '';
    const head = document.createElement('div');
    head.className = 'muted';
    head.textContent = `${o.xLabel}: ${fx(near)}`;
    tip.appendChild(head);
    for (const s of series) {
      if (s.noTooltip) continue;
      let bi = -1;
      let bd = Infinity;
      s.x.forEach((x, i) => {
        if (Math.abs(x - near) < bd) {
          bd = Math.abs(x - near);
          bi = i;
        }
      });
      if (bi < 0) continue;
      const row = document.createElement('div');
      row.className = 'row';
      const val = document.createElement('strong');
      val.textContent = s.lower ? `${fy(s.lower[bi])} – ${fy(s.y[bi])}` : fy(s.y[bi]);
      const name = document.createElement('span');
      name.className = 'muted';
      name.textContent = s.name;
      row.append(keyEl(s), val, name);
      tip.appendChild(row);
    }
    tip.style.display = 'block';
    // Keep the tooltip on screen near the right edge.
    const tw = tip.offsetWidth;
    tip.style.left = `${ev.clientX + 12 + tw > window.innerWidth ? ev.clientX - 12 - tw : ev.clientX + 12}px`;
    tip.style.top = `${ev.clientY + 12}px`;
  });
  hit.addEventListener('pointerleave', () => {
    cross.setAttribute('visibility', 'hidden');
    tip.style.display = 'none';
  });
  return svg;
}

/** Empirical CDF as a series (subsampled). */
export function ecdf(values: number[], points = 60): { x: number[]; y: number[] } {
  const v = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!v.length) return { x: [], y: [] };
  const x: number[] = [];
  const y: number[] = [];
  for (let i = 0; i < points; i++) {
    const idx = Math.min(v.length - 1, Math.round((i / (points - 1)) * (v.length - 1)));
    x.push(v[idx]);
    y.push((idx + 1) / v.length);
  }
  return { x, y };
}
