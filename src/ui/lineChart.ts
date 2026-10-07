/**
 * Minimal SVG line chart with a snapping crosshair tooltip. Series colours
 * come from CSS custom properties so light/dark themes swap automatically.
 */
export interface Series {
  name: string;
  color: string; // CSS colour or var()
  x: number[];
  y: number[];
  dashed?: boolean;
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
}

const NS = 'http://www.w3.org/2000/svg';

let tipEl: HTMLDivElement | null = null;
function sharedTooltip(): HTMLDivElement {
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

export function lineChart(container: HTMLElement, series: Series[], o: LineChartOptions): void {
  container.textContent = '';
  const card = document.createElement('div');
  card.className = 'card';
  const h = document.createElement('h2');
  h.textContent = o.title;
  card.appendChild(h);
  const legend = document.createElement('div');
  legend.className = 'legend';
  for (const s of series) {
    const item = document.createElement('span');
    const key = document.createElement('span');
    key.className = 'key';
    key.style.background = s.color;
    item.appendChild(key);
    item.appendChild(document.createTextNode(s.name));
    legend.appendChild(item);
  }
  card.appendChild(legend);
  container.appendChild(card);

  const W = 420;
  const H = o.height ?? 220;
  const m = { l: 44, r: 12, t: 8, b: 34 };
  const xs = series.flatMap((s) => s.x.filter(Number.isFinite));
  const ys = series.flatMap((s) => s.y.filter(Number.isFinite));
  if (!xs.length) return;
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const y0 = o.yMin ?? Math.min(0, ...ys);
  const y1 = o.yMax ?? Math.max(...ys) * 1.05;
  const sx = (v: number) => m.l + ((v - x0) / (x1 - x0 || 1)) * (W - m.l - m.r);
  const sy = (v: number) => H - m.b - ((v - y0) / (y1 - y0 || 1)) * (H - m.t - m.b);
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', role: 'img', 'aria-label': o.title });
  svg.style.display = 'block';
  svg.style.overflow = 'visible';
  const fx = o.xFormat ?? ((v: number) => String(+v.toFixed(2)));
  const fy = o.yFormat ?? ((v: number) => String(+v.toFixed(2)));
  for (const t of niceTicks(y0, y1)) {
    svg.appendChild(el('line', { x1: m.l, x2: W - m.r, y1: sy(t), y2: sy(t), stroke: 'var(--grid)', 'stroke-width': 1 }));
    const lab = el('text', { x: m.l - 6, y: sy(t) + 4, 'text-anchor': 'end', 'font-size': 11, fill: 'var(--text-muted)' });
    lab.textContent = fy(t);
    svg.appendChild(lab);
  }
  for (const t of niceTicks(x0, x1)) {
    const lab = el('text', { x: sx(t), y: H - m.b + 16, 'text-anchor': 'middle', 'font-size': 11, fill: 'var(--text-muted)' });
    lab.textContent = fx(t);
    svg.appendChild(lab);
  }
  svg.appendChild(el('line', { x1: m.l, x2: W - m.r, y1: sy(Math.max(y0, Math.min(y1, 0))), y2: sy(Math.max(y0, Math.min(y1, 0))), stroke: 'var(--axis)', 'stroke-width': 1 }));
  if (o.refY !== undefined) svg.appendChild(el('line', { x1: m.l, x2: W - m.r, y1: sy(o.refY), y2: sy(o.refY), stroke: 'var(--axis)', 'stroke-dasharray': '3 3' }));
  const xl = el('text', { x: (m.l + W - m.r) / 2, y: H - 4, 'text-anchor': 'middle', 'font-size': 11, fill: 'var(--text-secondary)' });
  xl.textContent = o.xLabel;
  svg.appendChild(xl);
  const yl = el('text', { x: 12, y: (m.t + H - m.b) / 2, 'text-anchor': 'middle', 'font-size': 11, fill: 'var(--text-secondary)', transform: `rotate(-90 12 ${(m.t + H - m.b) / 2})` });
  yl.textContent = o.yLabel;
  svg.appendChild(yl);
  for (const s of series) {
    const pts = s.x.map((x, i) => [x, s.y[i]] as const).filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
    if (!pts.length) continue;
    const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('');
    svg.appendChild(el('path', { d, fill: 'none', stroke: s.color, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', ...(s.dashed ? { 'stroke-dasharray': '5 4' } : {}) }));
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
      const key = document.createElement('span');
      key.className = 'key';
      key.style.cssText = `display:inline-block;width:12px;height:2px;background:${s.color}`;
      const val = document.createElement('strong');
      val.textContent = fy(s.y[bi]);
      const name = document.createElement('span');
      name.className = 'muted';
      name.textContent = s.name;
      row.append(key, val, name);
      tip.appendChild(row);
    }
    tip.style.display = 'block';
    tip.style.left = `${ev.clientX + 12}px`;
    tip.style.top = `${ev.clientY + 12}px`;
  });
  hit.addEventListener('pointerleave', () => {
    cross.setAttribute('visibility', 'hidden');
    tip.style.display = 'none';
  });
  card.appendChild(svg);
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
