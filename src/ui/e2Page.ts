import type { E2Row } from '../sim/experiments/e2Targets';
import { REFS } from '../sim/species/refs';
import type { E2Request, E2Response, TripFrame } from '../worker/e2Worker';
import E2Worker from '../worker/e2Worker?worker';
import { drawAnt } from './antSprite';
import { fitCanvas, labeled, zCell } from './dom';
import { E2_CONDITIONS as CONDITIONS, E2_DEFAULTS } from './pageDefaults';
import { loadPrecomputed } from './precomputed';

const MODE_LABEL: Record<string, string> = {
  explore: 'exploring',
  drink: 'drinking',
  search: 'searching nearby (unsatisfied)',
  return: 'returning',
  inNest: 'back in the nest',
};

export function renderE2(root: HTMLElement): () => void {
  root.textContent = '';
  const h = document.createElement('h2');
  h.textContent = 'E2 · Drinking and the decision to recruit';
  h.style.margin = '0 0 4px';
  const lede = document.createElement('p');
  lede.className = 'lede';
  lede.textContent =
    'Single Lasius niger scouts find a drop of 0.6 M sucrose in the Mailleux et al. apparatus (nest → bridge → 6 × 6 cm area). Each ant has its own desired volume; leaving satiated triggers trail laying on the way home. The drinking/decision parameters are fitted to the targets marked “fit”; the rows marked “development” were not fitted but have been inspected while choosing the model’s structure, so they are no longer independent tests.';
  root.append(h, lede);

  const bar = document.createElement('div');
  bar.className = 'toolbar';
  const sel = document.createElement('select');
  for (const c of CONDITIONS) {
    const o = document.createElement('option');
    o.value = c.id;
    o.textContent = c.label;
    sel.appendChild(o);
  }
  const nIn = Object.assign(document.createElement('input'), { type: 'number', value: String(E2_DEFAULTS.scouts), min: '20', max: '1000', step: '10' });
  const runBtn = Object.assign(document.createElement('button'), { className: 'primary', textContent: 'Run' });
  const status = document.createElement('span');
  status.className = 'note';
  const speedSel = document.createElement('select');
  for (const v of [1, 5, 10, 30]) {
    const o = document.createElement('option');
    o.value = String(v);
    o.textContent = `${v}×`;
    if (v === 10) o.selected = true;
    speedSel.appendChild(o);
  }
  bar.append(labeled('Animate', sel), labeled('Playback', speedSel), labeled('Scouts per condition', nIn), runBtn, status);
  root.appendChild(bar);

  const grid = document.createElement('div');
  grid.className = 'grid';
  root.appendChild(grid);
  const left = document.createElement('div');
  const right = document.createElement('div');
  grid.append(left, right);

  const card = document.createElement('div');
  card.className = 'card';
  const ch = document.createElement('h2');
  ch.textContent = 'Example scout trips (top view)';
  const legend = document.createElement('div');
  legend.className = 'legend';
  legend.innerHTML =
    '<span><span class="key" style="background:var(--series-sim)"></span>Scout path</span><span><span class="key" style="background:var(--series-data);height:6px;width:6px;border-radius:3px"></span>Trail marks (gaster contacts)</span>';
  const canvas = document.createElement('canvas');
  canvas.className = 'arena';
  canvas.style.aspectRatio = '2.2';
  const info = document.createElement('p');
  info.className = 'note';
  card.append(ch, legend, canvas, info);
  left.appendChild(card);

  const tableCard = document.createElement('div');
  tableCard.className = 'card';
  right.appendChild(tableCard);

  const worker = new E2Worker();
  let res: E2Response | null = null;
  let tripIdx = 0;
  let frameIdx = 0;
  /** Playback clock in simulated seconds, and how long the finished trip has been held on screen. */
  let playT = 0;
  let holdEnd = 0;
  let raf = 0;
  let lastTick = performance.now();

  /** Bumped on every request; `live` is the token of the live run in flight. */
  let token = 0;
  let live = -1;
  const request = (): E2Request => ({ scouts: Number(nIn.value), seed: E2_DEFAULTS.seed, showCondition: sel.value });
  const show = (r: E2Response, how: string) => {
    res = r;
    runBtn.disabled = false;
    tableCard.style.opacity = '1';
    status.textContent = how;
    tripIdx = 0;
    frameIdx = 0;
    playT = 0;
    holdEnd = 0;
    renderTable(tableCard, r.rows, r.foundBoth);
  };
  const run = () => {
    live = ++token;
    runBtn.disabled = true;
    status.textContent = 'Simulating scouts…';
    tableCard.style.opacity = '0.5';
    worker.postMessage(request());
  };
  /** Show the build-time result for these settings if there is one, else simulate. */
  const open = async () => {
    const t = ++token;
    status.textContent = 'Loading…';
    const pre = await loadPrecomputed<E2Response>(`e2-${sel.value}`, request());
    if (t !== token) return;
    if (pre) show(pre, `Precomputed (${nIn.value} scouts per condition) · Run to simulate again`);
    else run();
  };
  worker.onmessage = (ev: MessageEvent<E2Response>) => {
    if (live === token) show(ev.data, `Done in ${(ev.data.ms / 1000).toFixed(1)} s`);
  };
  runBtn.onclick = run;
  sel.onchange = open;

  const draw = () => {
    const now = performance.now();
    const css = getComputedStyle(document.documentElement);
    const { ctx, dpr } = fitCanvas(canvas);
    // World window: x ∈ [-25, 185] mm, y ∈ [-40, 40] mm.
    const sx = canvas.width / 210;
    const sy = canvas.height / 95;
    const s = Math.min(sx, sy);
    const X = (x: number) => (x + 25) * s;
    const Y = (y: number) => canvas.height / 2 - y * s;
    // Apparatus.
    ctx.fillStyle = css.getPropertyValue('--surface-2');
    ctx.fillRect(X(-25), Y(40), (25 - 0) * s, 80 * s); // nest edge (covered)
    ctx.fillStyle = css.getPropertyValue('--surface-1');
    ctx.fillRect(X(0), Y(2.5), 120 * s, 5 * s);
    ctx.fillRect(X(120), Y(30), 60 * s, 60 * s);
    ctx.strokeStyle = css.getPropertyValue('--axis');
    ctx.lineWidth = dpr;
    ctx.strokeRect(X(0), Y(2.5), 120 * s, 5 * s);
    ctx.strokeRect(X(120), Y(30), 60 * s, 60 * s);
    ctx.fillStyle = css.getPropertyValue('--text-muted');
    ctx.font = `${11 * dpr}px system-ui`;
    ctx.fillText('nest', X(-22), Y(-34));
    ctx.fillText('bridge', X(40), Y(-6));
    ctx.fillText('foraging area 6 × 6 cm', X(122), Y(-34));
    if (res && res.trips.length) {
      const trip = res.trips[tripIdx % res.trips.length];
      const fr = trip.frames;
      // Advance a persistent playback clock; hold the finished trip for 2 s, then show the next.
      const dtReal = Math.min(0.1, (now - lastTick) / 1000);
      const speed = Number(speedSel.value);
      if (frameIdx >= fr.length - 1) {
        holdEnd += dtReal;
        if (holdEnd > 2) {
          tripIdx++;
          frameIdx = 0;
          playT = 0;
          holdEnd = 0;
        }
      } else {
        playT += dtReal * speed;
        while (frameIdx < fr.length - 1 && fr[frameIdx + 1].t - fr[0].t <= playT) frameIdx++;
      }
      for (const d of trip.drops) {
        ctx.fillStyle = 'rgba(120,170,255,0.6)';
        ctx.beginPath();
        ctx.arc(X(d.x), Y(d.y), Math.max(2.5 * dpr, Math.cbrt((3 * d.ul) / (2 * Math.PI)) * s), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = css.getPropertyValue('--series-sim');
      ctx.globalAlpha = 0.7;
      ctx.lineWidth = 1.5 * dpr;
      ctx.beginPath();
      for (let i = 0; i <= frameIdx; i++) (i ? ctx.lineTo : ctx.moveTo).call(ctx, X(fr[i].x), Y(fr[i].y));
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = css.getPropertyValue('--series-data');
      for (let i = 0; i <= frameIdx; i++)
        if (fr[i].gaster) {
          ctx.beginPath();
          ctx.arc(X(fr[i].x), Y(fr[i].y), 1.6 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      const f: TripFrame | undefined = fr[frameIdx];
      if (f) {
        drawAnt(ctx, X(f.x), Y(f.y), -f.heading, { scale: s, load: f.crop / 1.2, color: css.getPropertyValue('--text-primary'), gait: f.mode === 'drink' ? undefined : f.t * 9 });
        info.textContent = `Trip ${(tripIdx % res.trips.length) + 1}/${res.trips.length} · t = ${f.t.toFixed(0)} s · ${MODE_LABEL[f.mode] ?? f.mode} · crop ${f.crop.toFixed(2)} µL · playback ${speedSel.value}× real time`;
      }
    }
    lastTick = now;
    raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);
  void open();
  return () => {
    cancelAnimationFrame(raf);
    worker.terminate();
  };
}

function renderTable(card: HTMLElement, rows: E2Row[], foundBoth: number): void {
  card.textContent = '';
  const h = document.createElement('h2');
  h.textContent = 'Simulation vs data (Mailleux et al. 1999, 2009)';
  const note = document.createElement('p');
  note.className = 'note';
  note.textContent =
    'Mean: z = (simulated − data) / √(SE_data² + SE_sim²), SE_sim from 10 independent seed blocks. Spread: z of log(SD_sim / SD_data), approximate because times are right-skewed. |z| ≤ 2 is consistent with sampling noise; ≤ 3 marginal.';
  card.append(h, note);
  const t = document.createElement('table');
  t.className = 'params';
  const head = document.createElement('tr');
  for (const c of ['Measure', 'Data', 'Simulated', 'z (mean)', 'z (SD)', 'Role']) {
    const th = document.createElement('th');
    th.textContent = c;
    head.appendChild(th);
  }
  t.appendChild(head);
  const dp = (unit: string) => (unit === 'µL/s' ? 4 : unit === 'µL' || unit === 'r' ? 2 : 0);
  const fmt = (v: number, unit: string) => (unit === '' ? `${(v * 100).toFixed(0)} %` : `${v.toFixed(dp(unit))} ${unit}`);
  for (const { target: tg, sim, mean, spread } of rows) {
    const tr = document.createElement('tr');
    const c1 = document.createElement('td');
    c1.textContent = tg.label;
    c1.title = REFS[tg.source]?.full ?? tg.source;
    const c2 = document.createElement('td');
    c2.className = 'num';
    c2.textContent = fmt(tg.value, tg.unit) + (tg.sd !== undefined ? ` ± ${tg.sd.toFixed(dp(tg.unit))}` : '') + ` (n = ${tg.n})`;
    const c3 = document.createElement('td');
    c3.className = 'num';
    c3.textContent = Number.isFinite(sim.mean) ? fmt(sim.mean, tg.unit) + (tg.sd !== undefined ? ` ± ${sim.sd.toFixed(dp(tg.unit))}` : '') + ` (n = ${sim.n})` : '—';
    const c6 = document.createElement('td');
    const b = document.createElement('span');
    b.className = `badge ${tg.role}`;
    b.textContent = tg.role === 'fit' ? 'fit' : 'development';
    c6.appendChild(b);
    tr.append(c1, c2, c3, zCell(mean.z), zCell(spread?.z), c6);
    t.appendChild(tr);
  }
  card.appendChild(t);
  const p = document.createElement('p');
  p.className = 'note';
  p.textContent = `“± x” is the SD between ants. Simulated scouts finding both drops (2009 protocol): ${(foundBoth * 100).toFixed(0)} % (data: > 95 %).`;
  card.appendChild(p);
}
