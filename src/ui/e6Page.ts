import refit from '../../data/fits/e6-tec.json';
import { verdict, type Comparison } from '../sim/analysis/compare';
import type { E6Row } from '../sim/experiments/e6Bles';
import { BLES_TABLE1, type BlesParams } from '../sim/reference/blesTEC';
import { REFS } from '../sim/species/refs';
import type { E6Request, E6Response } from '../worker/e6Worker';
import E6Worker from '../worker/e6Worker?worker';
import { drawAnt } from './antSprite';
import { lineChart } from './lineChart';

const MODELS: { id: string; label: string; params: () => BlesParams }[] = [
  { id: 'refit', label: 'TEC, refitted through the observer', params: () => ({ ...BLES_TABLE1.TEC_exp, T: 3660, ...refit.params }) },
  { id: 'published', label: 'TEC, published parameters', params: () => ({ ...BLES_TABLE1.TEC_exp, T: 3660 }) },
  { id: 'oc', label: 'One caste, published parameters', params: () => ({ ...BLES_TABLE1.OC_exp, T: 3660 }) },
];

// Lab geometry of Bles et al. (mm): nest chamber, access route, foraging area.
const NEST = { x: 0, y: 0, w: 56, h: 41 };
const ROUTE = { x: 56, y: 19, w: 4, h: 3 };
const AREA = { x: 60, y: -4, w: 61, h: 49 };
const DROP = { x: 96, y: 20.5 };

export function renderE6(root: HTMLElement): () => void {
  root.textContent = '';
  const h = document.createElement('h2');
  h.textContent = 'E6 · Food sharing in the nest';
  h.style.margin = '0 0 4px';
  const lede = document.createElement('p');
  lede.className = 'lede';
  lede.textContent =
    'Fifty starved Lasius niger workers, 1 M sucrose introduced at minute 30 (Bles et al. 2022). Shown here is the reference model of Bles et al., two emergent castes (TEC), ported from the authors’ code. Every simulated colony goes through the same observer as the experiment: a scan once a minute, contacts > 5 s, the same pair on consecutive scans merged. Our own encounter-based model will replace it (step 4).';
  root.append(h, lede);

  const bar = document.createElement('div');
  bar.className = 'toolbar';
  const modelSel = document.createElement('select');
  for (const m of MODELS) modelSel.append(Object.assign(document.createElement('option'), { value: m.id, textContent: m.label }));
  const nIn = Object.assign(document.createElement('input'), { type: 'number', value: '200', min: '20', max: '2000', step: '20' });
  const runBtn = Object.assign(document.createElement('button'), { className: 'primary', textContent: 'Run' });
  const speedSel = document.createElement('select');
  for (const v of [10, 30, 60, 120]) speedSel.append(Object.assign(document.createElement('option'), { value: String(v), textContent: `${v}×`, selected: v === 30 }));
  const status = document.createElement('span');
  status.className = 'note';
  const lab = (t: string, e: HTMLElement) => {
    const l = document.createElement('label');
    l.append(t, e);
    return l;
  };
  bar.append(lab('Model', modelSel), lab('Colonies', nIn), runBtn, lab('Playback', speedSel), status);
  root.appendChild(bar);

  const grid = document.createElement('div');
  grid.className = 'grid';
  root.appendChild(grid);
  const left = document.createElement('div');
  const right = document.createElement('div');
  grid.append(left, right);

  const animCard = document.createElement('div');
  animCard.className = 'card';
  const ah = document.createElement('h2');
  ah.textContent = 'One simulated colony';
  const legend = document.createElement('div');
  legend.className = 'legend';
  legend.innerHTML =
    '<span><span class="key" style="background:var(--series-sim)"></span>Forager</span><span><span class="key" style="background:var(--text-muted)"></span>Non-forager</span><span><span class="key" style="background:var(--series-data)"></span>Trophallaxis (donor → receiver)</span>';
  const canvas = document.createElement('canvas');
  canvas.className = 'arena';
  canvas.style.aspectRatio = '2.2';
  const info = document.createElement('p');
  info.className = 'note';
  const caveat = document.createElement('p');
  caveat.className = 'note';
  caveat.textContent = 'The Bles model is not spatial: positions are illustrative only. Gaster size shows crop load. The nest outline flashes at each scan.';
  const playBar = document.createElement('div');
  playBar.className = 'toolbar';
  const playBtn = Object.assign(document.createElement('button'), { textContent: 'Pause' });
  const restartBtn = Object.assign(document.createElement('button'), { textContent: 'Restart' });
  playBar.append(playBtn, restartBtn);
  animCard.append(ah, legend, canvas, info, playBar, caveat);
  left.appendChild(animCard);

  const chartSlot = document.createElement('div');
  const tableCard = document.createElement('div');
  tableCard.className = 'card';
  tableCard.style.marginTop = '16px';
  right.append(chartSlot, tableCard);

  const worker = new E6Worker();
  let res: E6Response | null = null;
  let playT = 0;
  let playing = true;
  let lastTick = performance.now();
  let raf = 0;
  let lastScan = -1;
  let flash = 0;
  let pos: Float32Array | null = null;

  const run = () => {
    runBtn.disabled = true;
    status.textContent = 'Simulating colonies…';
    tableCard.style.opacity = '0.5';
    const m = MODELS.find((x) => x.id === modelSel.value)!;
    const req: E6Request = { params: m.params(), colonies: Number(nIn.value), seed: 6_000_000 };
    worker.postMessage(req);
  };
  worker.onmessage = (ev: MessageEvent<E6Response>) => {
    res = ev.data;
    runBtn.disabled = false;
    tableCard.style.opacity = '1';
    status.textContent = `Done in ${(res.ms / 1000).toFixed(1)} s`;
    playT = 0;
    lastScan = -1;
    pos = null;
    renderChart(chartSlot, res);
    renderTable(tableCard, res.rows);
  };
  runBtn.onclick = run;
  modelSel.onchange = run;
  playBtn.onclick = () => {
    playing = !playing;
    playBtn.textContent = playing ? 'Pause' : 'Play';
  };
  restartBtn.onclick = () => {
    playT = 0;
    lastScan = -1;
  };

  const draw = () => {
    const now = performance.now();
    const dtReal = Math.min(0.1, (now - lastTick) / 1000);
    lastTick = now;
    const css = getComputedStyle(document.documentElement);
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    if (canvas.width !== Math.round(W * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // World window: x ∈ [−3, 124], y ∈ [−7, 48] mm.
    const s = Math.min(canvas.width / 127, canvas.height / 55);
    const X = (x: number) => (x + 3) * s;
    const Y = (y: number) => (y + 7) * s;
    ctx.fillStyle = css.getPropertyValue('--surface-2');
    ctx.fillRect(X(NEST.x), Y(NEST.y), NEST.w * s, NEST.h * s);
    ctx.fillRect(X(ROUTE.x), Y(ROUTE.y), ROUTE.w * s, ROUTE.h * s);
    ctx.fillStyle = css.getPropertyValue('--surface-1');
    ctx.fillRect(X(AREA.x), Y(AREA.y), AREA.w * s, AREA.h * s);
    ctx.lineWidth = dpr;
    ctx.strokeStyle = css.getPropertyValue('--axis');
    ctx.strokeRect(X(AREA.x), Y(AREA.y), AREA.w * s, AREA.h * s);
    ctx.strokeStyle = flash > 0 ? css.getPropertyValue('--series-data') : css.getPropertyValue('--axis');
    ctx.lineWidth = (flash > 0 ? 3 : 1) * dpr;
    ctx.strokeRect(X(NEST.x), Y(NEST.y), NEST.w * s, NEST.h * s);
    ctx.fillStyle = 'rgba(120,170,255,0.55)';
    ctx.beginPath();
    ctx.arc(X(DROP.x), Y(DROP.y), 5 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = css.getPropertyValue('--text-muted');
    ctx.font = `${11 * dpr}px system-ui`;
    ctx.fillText('nest 56 × 41 mm', X(1), Y(-2));
    ctx.fillText('foraging area, 1 M sucrose', X(AREA.x + 1), Y(AREA.y - 1));

    if (res && res.frames.length) {
      const fr = res.frames;
      if (playing) playT = Math.min(fr[fr.length - 1].t, playT + dtReal * Number(speedSel.value));
      const f = fr[Math.min(fr.length - 1, Math.floor(playT / 2))];
      const n = f.act.length;
      // Scan instants.
      const k = Math.floor((playT - res.scanPhase) / 60);
      if (playT >= res.scanPhase && k !== lastScan) {
        if (k > lastScan) flash = 0.4;
        lastScan = k;
      }
      flash = Math.max(0, flash - dtReal);
      // Target positions.
      const tgt = new Float32Array(2 * n);
      for (let i = 0; i < n; i++) {
        const [hx, hy] = home(i, playT);
        if (f.act[i] === 1) {
          const a = (i / n) * Math.PI * 2 + playT * 0.02;
          tgt[2 * i] = DROP.x + Math.cos(a) * 7;
          tgt[2 * i + 1] = DROP.y + Math.sin(a) * 7;
        } else {
          tgt[2 * i] = hx;
          tgt[2 * i + 1] = hy;
        }
      }
      // Receivers sit face to face with their donor.
      for (let i = 0; i < n; i++)
        if (f.act[i] === 3) {
          const d = f.partner[i];
          const a = i * 2.39996;
          tgt[2 * i] = tgt[2 * d] + Math.cos(a) * 3.2;
          tgt[2 * i + 1] = tgt[2 * d + 1] + Math.sin(a) * 3.2;
        }
      if (!pos || pos.length !== tgt.length) pos = tgt.slice();
      const kSmooth = 1 - Math.exp(-dtReal * 6);
      for (let i = 0; i < tgt.length; i++) pos[i] += (tgt[i] - pos[i]) * kSmooth;
      const fCol = css.getPropertyValue('--series-sim');
      const nfCol = css.getPropertyValue('--text-muted');
      const linkCol = css.getPropertyValue('--series-data');
      for (let i = 0; i < n; i++) {
        let heading = home(i, playT + 1)[2];
        if (f.act[i] === 2 || f.act[i] === 3) {
          const d = f.partner[i];
          heading = Math.atan2(pos[2 * d + 1] - pos[2 * i + 1], pos[2 * d] - pos[2 * i]);
        } else if (f.act[i] === 1) heading = Math.atan2(DROP.y - pos[2 * i + 1], DROP.x - pos[2 * i]);
        const still = f.act[i] === 2 || f.act[i] === 3;
        drawAnt(ctx, X(pos[2 * i]), Y(pos[2 * i + 1]), heading, { scale: s, load: f.crop[i] / 240, color: f.forager[i] ? fCol : nfCol, gait: still ? undefined : now / 90 + i });
      }
      // Trophallaxis: a pulsing glow where the two mouths meet, drawn on top.
      for (let i = 0; i < n; i++)
        if (f.act[i] === 3) {
          const d = f.partner[i];
          const mx = X((pos[2 * d] + pos[2 * i]) / 2);
          const my = Y((pos[2 * d + 1] + pos[2 * i + 1]) / 2);
          const pulse = 0.5 + 0.5 * Math.sin(now / 180 + i);
          ctx.globalAlpha = 0.25 + 0.35 * pulse;
          ctx.fillStyle = linkCol;
          ctx.beginPath();
          ctx.arc(mx, my, (1.1 + 0.5 * pulse) * s, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(mx, my, 0.45 * s, 0, Math.PI * 2);
          ctx.fill();
        }
      const trueSoFar = res.trueStarts.filter((t) => t <= playT).length;
      const obsSoFar = res.observed.filter((o) => res!.scanPhase + (o.minute - 30) * 60 <= playT).length;
      const mm = Math.floor(playT / 60);
      const ss = Math.floor(playT % 60);
      info.textContent = `${mm}:${String(ss).padStart(2, '0')} after food · contacts so far ${trueSoFar}, recorded by the once-a-minute observer ${obsSoFar} · foragers ${f.forager.reduce((a, b) => a + b, 0)} · ${speedSel.value}× real time`;
    }
    raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);
  run();
  return () => {
    cancelAnimationFrame(raf);
    worker.terminate();
  };
}

/** Illustrative wandering position (mm) and heading of ant i inside the nest. */
function home(i: number, t: number): [number, number, number] {
  const h1 = Math.sin(i * 12.9898) * 43758.5453;
  const h2 = Math.sin(i * 78.233) * 12543.123;
  const fx = h1 - Math.floor(h1);
  const fy = h2 - Math.floor(h2);
  const w = 0.004 + 0.004 * fx;
  const x = NEST.x + 5 + fx * (NEST.w - 10) + 3 * Math.sin(t * w + i);
  const y = NEST.y + 5 + fy * (NEST.h - 10) + 3 * Math.cos(t * w * 1.3 + 2 * i);
  const heading = Math.atan2(-3 * 1.3 * w * Math.sin(t * w * 1.3 + 2 * i), 3 * w * Math.cos(t * w + i));
  return [x, y, heading];
}

function renderChart(slot: HTMLElement, r: E6Response): void {
  const x = r.cumData.map((_, m) => m);
  lineChart(
    slot,
    [
      ...r.cumDataColonies.map((y, c) => ({ name: c ? `Colony ${c + 1}` : 'Data, single colonies', color: 'var(--series-data)', x, y, width: 1.2, opacity: 0.45, noLegend: c > 0 })),
      { name: 'Data, mean of 5 colonies', color: 'var(--series-data)', x, y: r.cumData, width: 2.5 },
      { name: 'Model, mean as observed', color: 'var(--series-sim)', x, y: r.cumSim, width: 2.5 },
    ],
    { title: 'Cumulative trophallactic events after food introduction', xLabel: 'minutes after food', yLabel: 'events', yMin: 0, xFormat: (v) => v.toFixed(0), yFormat: (v) => v.toFixed(0) },
  );
}

function renderTable(card: HTMLElement, rows: E6Row[]): void {
  card.textContent = '';
  const h = document.createElement('h2');
  h.textContent = 'Simulation vs data (Bles et al. 2022, 5 colonies)';
  const note = document.createElement('p');
  note.className = 'note';
  note.textContent =
    'Mean: z = (simulated − data) / √(SE_data² + SE_sim²), SE_data = SD/√5. Spread: z of log(SD_sim / SD_data) between colonies; with 5 colonies it is weak. Forager-based rows come from the paper (forager identities are not in the raw data). |z| ≤ 2 consistent; ≤ 3 marginal.';
  card.append(h, note);
  const t = document.createElement('table');
  t.className = 'params';
  const head = document.createElement('tr');
  for (const c of ['Measure', 'Data', 'Simulated', 'z (mean)', 'z (SD)', 'Family']) head.appendChild(Object.assign(document.createElement('th'), { textContent: c }));
  t.appendChild(head);
  const f = (v: number) => (Math.abs(v) < 1 ? v.toFixed(2) : v.toFixed(1));
  const zCell = (c: Comparison) => {
    const td = document.createElement('td');
    td.className = 'num';
    if (!Number.isFinite(c.z)) {
      td.textContent = '—';
      return td;
    }
    const v = verdict(c.z);
    td.classList.add(`status-${v === 'marginal' ? 'warn' : v === 'off' ? 'bad' : 'ok'}`);
    td.textContent = `${c.z.toFixed(1)} ${v === 'ok' ? '✓' : v === 'marginal' ? '~' : '✗'}`;
    return td;
  };
  for (const r of rows) {
    const tr = document.createElement('tr');
    const c1 = Object.assign(document.createElement('td'), { textContent: r.target.label, title: REFS.bles2022?.full ?? 'Bles et al. 2022' });
    const c2 = Object.assign(document.createElement('td'), { className: 'num', textContent: `${f(r.target.mean)} ± ${f(r.target.sd)}${r.target.source === 'paper' ? ' (paper)' : ''}` });
    const c3 = Object.assign(document.createElement('td'), { className: 'num', textContent: `${f(r.simMean)} ± ${f(r.simSd)}` });
    const c6 = document.createElement('td');
    c6.appendChild(Object.assign(document.createElement('span'), { className: `badge ${r.target.family === 'primary' ? 'fit' : 'development'}`, textContent: r.target.family === 'primary' ? 'primary' : 'network (one family)' }));
    tr.append(c1, c2, c3, zCell(r.mean), zCell(r.spread), c6);
    t.appendChild(tr);
  }
  card.appendChild(t);
  const p = document.createElement('p');
  p.className = 'note';
  p.textContent = '“± x” is the SD between colonies. The refitted TEC model is fitted to these E6 data (foragers and pair types), so it is a reference baseline, not a test.';
  card.appendChild(p);
}
