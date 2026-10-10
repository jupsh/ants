import { verdict, type Verdict } from '../sim/analysis/compare';

/** Shared DOM helpers for the experiment pages. */

/** A form control with its text label. */
export function labeled(text: string, control: HTMLElement): HTMLLabelElement {
  const l = document.createElement('label');
  l.append(text, control);
  return l;
}

/** CSS class for a comparison verdict (style.css). */
export const statusClass = (v: Verdict): string => `status-${v === 'marginal' ? 'warn' : v === 'off' ? 'bad' : 'ok'}`;

export const VERDICT_LABEL: Record<Verdict, string> = { ok: '✓ within', marginal: '~ marginal', off: '✗ off' };

/** Table cell showing a z-score with its verdict mark (|z| ≤ 2 ✓, ≤ 3 ~, else ✗); '—' if not finite. */
export function zCell(z: number | undefined): HTMLTableCellElement {
  const td = document.createElement('td');
  td.className = 'num';
  if (z === undefined || !Number.isFinite(z)) {
    td.textContent = '—';
    return td;
  }
  const v = verdict(z);
  td.classList.add(statusClass(v));
  td.textContent = `${z.toFixed(1)} ${v === 'ok' ? '✓' : v === 'marginal' ? '~' : '✗'}`;
  return td;
}

/**
 * Table cell with a small z strip: the |z| ≤ 2 zone and the ≤ 3 zone shaded,
 * a filled dot for the mean's z and a ring for the spread's z. Values beyond
 * ±4 sit at the edge as a triangle pointing outwards.
 */
export function zStripCell(zMean: number | undefined, zSd?: number): HTMLTableCellElement {
  const td = document.createElement('td');
  td.className = 'zstrip';
  const W = 132;
  const H = 18;
  const L = 4;
  const X = (z: number) => 6 + ((Math.max(-L, Math.min(L, z)) + L) / (2 * L)) * (W - 12);
  const mark = (z: number | undefined, filled: boolean) => {
    if (z === undefined || !Number.isFinite(z)) return '';
    const cls = statusClass(verdict(z));
    const x = X(z);
    if (Math.abs(z) > L) {
      const d = z > 0 ? 1 : -1;
      return `<path class="${cls}" d="M${x + 5 * d},${H / 2} L${x - 2 * d},${H / 2 - 5} L${x - 2 * d},${H / 2 + 5}Z" fill="${filled ? 'currentColor' : 'var(--surface-1)'}" stroke="currentColor" stroke-width="1.5"/>`;
    }
    return `<circle class="${cls}" cx="${x}" cy="${H / 2}" r="${filled ? 4.5 : 3.8}" fill="${filled ? 'currentColor' : 'var(--surface-1)'}" stroke="currentColor" stroke-width="1.5"/>`;
  };
  td.innerHTML =
    `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">` +
    `<rect x="${X(-3)}" y="3" width="${X(3) - X(-3)}" height="${H - 6}" rx="2" class="zone3"/>` +
    `<rect x="${X(-2)}" y="3" width="${X(2) - X(-2)}" height="${H - 6}" rx="2" class="zone2"/>` +
    `<line x1="${X(0)}" x2="${X(0)}" y1="1" y2="${H - 1}" stroke="var(--axis)"/>` +
    mark(zSd, false) +
    mark(zMean, true) +
    '</svg>';
  const t = (z: number | undefined) => (z === undefined || !Number.isFinite(z) ? '—' : z.toFixed(1));
  td.title = `z (mean) ${t(zMean)}${zSd !== undefined ? ` · z (SD) ${t(zSd)}` : ''}`;
  return td;
}

/** Header cell explaining the z strip's marks. */
export function zStripHeader(): HTMLTableCellElement {
  const th = document.createElement('th');
  th.className = 'zstrip';
  th.innerHTML = '<span class="zstrip-head"><span>−4</span><span>● mean ○ SD</span><span>+4</span></span>';
  return th;
}

/**
 * Size a canvas's backing store to its CSS box × devicePixelRatio, reset the
 * transform and clear it. Returns the context and the ratio.
 */
export function fitCanvas(canvas: HTMLCanvasElement): { ctx: CanvasRenderingContext2D; dpr: number } {
  const dpr = window.devicePixelRatio || 1;
  const w = Math.round(canvas.clientWidth * dpr);
  const h = Math.round(canvas.clientHeight * dpr);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  return { ctx, dpr };
}
