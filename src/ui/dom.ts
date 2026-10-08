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
