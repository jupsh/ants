import { verdict } from '../sim/analysis/compare';
import type { E6Row } from '../sim/experiments/e6Bles';
import { REFS } from '../sim/species/refs';
import { E6_MODELS as MODELS, reviveE6 } from '../worker/e6Compute';
import type { E6Request, E6Response } from '../worker/e6Worker';
import E6Worker from '../worker/e6Worker?worker';
import { drawAnt } from './antSprite';
import { fitCanvas, labeled, zCell, zStripCell, zStripHeader } from './dom';
import { lineChart, sharedTooltip } from './lineChart';
import { E6_DEFAULTS } from './pageDefaults';
import { loadPrecomputed } from './precomputed';

// Lab geometry of Bles et al. (mm): nest chamber, access route, foraging area.
const NEST = { x: 0, y: 0, w: 56, h: 41 };
const ROUTE = { x: 56, y: 19, w: 4, h: 3 };
const AREA = { x: 60, y: -4, w: 61, h: 49 };
const DROP = { x: 96, y: 20.5 };
/** Doorways either side of the access route: ants walk through them, not through walls. */
const DOOR_IN = { x: NEST.x + NEST.w - 2, y: ROUTE.y + ROUTE.h / 2 };
const DOOR_OUT = { x: AREA.x + 2, y: ROUTE.y + ROUTE.h / 2 };
/** World window (mm), with room for labels above. */
const WIN = { x0: -2, y0: -10, x1: 123, y1: 47 };
/** Illustrative walking speed (mm per real second), independent of playback speed. */
const WALK = 28;
const ACT = { nest: 0, source: 1, giving: 2, receiving: 3 };

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
  const nIn = Object.assign(document.createElement('input'), { type: 'number', value: String(E6_DEFAULTS.colonies), min: '20', max: '2000', step: '20' });
  const runBtn = Object.assign(document.createElement('button'), { className: 'primary', textContent: 'Run' });
  const status = document.createElement('span');
  status.className = 'note';
  bar.append(labeled('Model', modelSel), labeled('Colonies', nIn), runBtn, status);
  root.appendChild(bar);

  const grid = document.createElement('div');
  grid.className = 'grid wide-left';
  root.appendChild(grid);
  const left = document.createElement('div');
  const right = document.createElement('div');
  grid.append(left, right);

  const animCard = document.createElement('div');
  animCard.className = 'card';
  const ah = document.createElement('h2');
  ah.textContent = 'One simulated colony, and what the observer sees';
  const legend = document.createElement('div');
  legend.className = 'legend';
  legend.innerHTML = [
    '<span><span class="key dot" style="background:var(--series-sim)"></span>Forager</span>',
    '<span><span class="key dot" style="background:var(--text-muted)"></span>Non-forager</span>',
    '<span><span class="key dot" style="background:var(--series-data)"></span>Sugar: crop contents (gaster core), trophallaxis (glow)</span>',
  ].join('');
  const canvas = document.createElement('canvas');
  canvas.className = 'arena';
  canvas.style.aspectRatio = `${(WIN.x1 - WIN.x0) / (WIN.y1 - WIN.y0)}`;
  const timeline = document.createElement('canvas');
  timeline.className = 'timeline';
  timeline.style.height = '58px';
  timeline.setAttribute('aria-label', 'Timeline: true contacts and observed events; drag to move through the hour');
  const playBar = document.createElement('div');
  playBar.className = 'toolbar scrub';
  const playBtn = Object.assign(document.createElement('button'), { textContent: 'Pause' });
  const speedSel = document.createElement('select');
  for (const v of [10, 30, 60, 120]) speedSel.append(Object.assign(document.createElement('option'), { value: String(v), textContent: `${v}×`, selected: v === 30 }));
  const tLabel = Object.assign(document.createElement('span'), { className: 'note mono' });
  playBar.append(playBtn, labeled('Playback', speedSel), tLabel);
  const counts = document.createElement('div');
  counts.className = 'chips';
  const caveat = document.createElement('p');
  caveat.className = 'note';
  caveat.textContent =
    'The Bles model is not spatial: positions and walking are illustrative only. Gaster size and its blue core show crop load. The strip counts contacts as they start (top) and the events the once-a-minute observer records (bottom, at its scans); the nest outline flashes at each scan. Drag the strip to move through the hour.';
  animCard.append(ah, legend, canvas, timeline, playBar, counts, caveat);
  left.appendChild(animCard);

  const chartSlot = document.createElement('div');
  right.append(chartSlot);
  const tableCard = document.createElement('div');
  tableCard.className = 'card';
  tableCard.style.marginTop = '16px';
  root.appendChild(tableCard);

  const worker = new E6Worker();
  let res: E6Response | null = null;
  let playT = 0;
  let playing = true;
  let lastTick = performance.now();
  let raf = 0;
  let lastScan = -1;
  let flash = 0;
  /** Displayed positions (mm), headings and which side of the doorway each ant is on (0 nest, 1 area). */
  let pos: Float32Array | null = null;
  let head: Float32Array | null = null;
  let side: Uint8Array | null = null;
  let hoverT = -1;
  let dragging = false;

  /** Bumped on every request; `live` is the token of the live run in flight. */
  let token = 0;
  let live = -1;
  const request = (): E6Request => ({ params: MODELS.find((x) => x.id === modelSel.value)!.params(), colonies: Number(nIn.value), seed: E6_DEFAULTS.seed });
  const restart = () => {
    playT = 0;
    lastScan = -1;
    pos = null;
  };
  const show = (r: E6Response, how: string) => {
    res = r;
    runBtn.disabled = false;
    tableCard.style.opacity = '1';
    status.textContent = how;
    restart();
    renderChart(chartSlot, r);
    renderTable(tableCard, r.rows);
  };
  const run = () => {
    live = ++token;
    runBtn.disabled = true;
    status.textContent = 'Simulating colonies…';
    tableCard.style.opacity = '0.5';
    worker.postMessage(request());
  };
  /** Show the build-time result for these settings if there is one, else simulate. */
  const open = async () => {
    const t = ++token;
    status.textContent = 'Loading…';
    const pre = await loadPrecomputed<E6Response>(`e6-${modelSel.value}`, request());
    if (t !== token) return;
    if (pre) show(reviveE6(pre), `Precomputed (${nIn.value} colonies) · Run to simulate again`);
    else run();
  };
  worker.onmessage = (ev: MessageEvent<E6Response>) => {
    if (live === token) show(ev.data, `Done in ${(ev.data.ms / 1000).toFixed(1)} s`);
  };
  runBtn.onclick = run;
  modelSel.onchange = open;
  playBtn.onclick = () => {
    playing = !playing;
    playBtn.textContent = playing ? 'Pause' : 'Play';
  };

  // Timeline scrubbing and hover.
  const endT = () => (res && res.frames.length ? res.frames[res.frames.length - 1].t : 3600);
  const tAtX = (clientX: number) => {
    const r = timeline.getBoundingClientRect();
    return Math.max(0, Math.min(endT(), ((clientX - r.left) / r.width) * endT()));
  };
  timeline.onpointerdown = (ev) => {
    dragging = true;
    timeline.setPointerCapture(ev.pointerId);
    playT = tAtX(ev.clientX);
    lastScan = -1;
  };
  timeline.onpointerup = () => {
    dragging = false;
  };
  timeline.onpointermove = (ev) => {
    if (!res) return;
    const t = tAtX(ev.clientX);
    if (dragging) {
      playT = t;
      lastScan = -1;
    }
    hoverT = t;
    const tip = sharedTooltip();
    tip.innerHTML = `<div class="muted">${fmtTime(t)} after food</div><div class="row"><strong>${countTrue(res, t)}</strong><span class="muted">contacts started</span></div><div class="row"><strong>${countObserved(res, t)}</strong><span class="muted">recorded by the observer</span></div>`;
    tip.style.display = 'block';
    const tw = tip.offsetWidth;
    tip.style.left = `${ev.clientX + 12 + tw > window.innerWidth ? ev.clientX - 12 - tw : ev.clientX + 12}px`;
    tip.style.top = `${ev.clientY + 14}px`;
  };
  timeline.onpointerleave = () => {
    hoverT = -1;
    sharedTooltip().style.display = 'none';
  };

  const draw = () => {
    const now = performance.now();
    const dtReal = Math.min(0.1, (now - lastTick) / 1000);
    lastTick = now;
    const css = getComputedStyle(document.documentElement);
    const col = (name: string) => css.getPropertyValue(name).trim();
    const { ctx, dpr } = fitCanvas(canvas);
    const s = Math.min(canvas.width / (WIN.x1 - WIN.x0), canvas.height / (WIN.y1 - WIN.y0));
    const X = (x: number) => (x - WIN.x0) * s;
    const Y = (y: number) => (y - WIN.y0) * s;
    const box = (r: { x: number; y: number; w: number; h: number }) => [X(r.x), Y(r.y), r.w * s, r.h * s] as const;
    ctx.fillStyle = col('--surface-2');
    ctx.fillRect(...box(NEST));
    ctx.fillStyle = col('--surface-1');
    ctx.fillRect(...box(ROUTE));
    ctx.fillRect(...box(AREA));
    const g = ctx.createRadialGradient(X(DROP.x) - 1.5 * s, Y(DROP.y) - 1.5 * s, 0.5 * s, X(DROP.x), Y(DROP.y), 5 * s);
    g.addColorStop(0, 'rgba(190,215,255,0.95)');
    g.addColorStop(1, 'rgba(90,150,240,0.7)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(X(DROP.x), Y(DROP.y), 5 * s, 0, Math.PI * 2);
    ctx.fill();

    const food = col('--series-data');
    if (res && res.frames.length) {
      const fr = res.frames;
      if (playing && !dragging) playT = Math.min(endT(), playT + dtReal * Number(speedSel.value));
      const f = fr[Math.min(fr.length - 1, Math.floor(playT / 2))];
      const n = f.act.length;
      // Scan instants.
      const k = Math.floor((playT - res.scanPhase) / 60);
      if (playT >= res.scanPhase && k !== lastScan) {
        if (k > lastScan && lastScan >= 0) flash = 0.45;
        lastScan = k;
      }
      flash = Math.max(0, flash - dtReal);
      // Where each ant should be: wandering in the nest, around the drop, or face to face with its donor.
      const tgt = new Float32Array(2 * n);
      for (let i = 0; i < n; i++) {
        if (f.act[i] === ACT.source) {
          const a = (i / n) * Math.PI * 2 + playT * 0.004;
          tgt[2 * i] = DROP.x + Math.cos(a) * 6.5;
          tgt[2 * i + 1] = DROP.y + Math.sin(a) * 6.5;
        } else {
          const [hx, hy] = home(i, playT);
          tgt[2 * i] = hx;
          tgt[2 * i + 1] = hy;
        }
      }
      for (let i = 0; i < n; i++)
        if (f.act[i] === ACT.receiving) {
          const d = f.partner[i];
          const a = i * 2.39996;
          tgt[2 * i] = tgt[2 * d] + Math.cos(a) * 3.2;
          tgt[2 * i + 1] = tgt[2 * d + 1] + Math.sin(a) * 3.2;
        }
      // Move at walking speed, through the doorways; snap on (re)start.
      if (!pos || pos.length !== tgt.length) {
        pos = tgt.slice();
        head = new Float32Array(n).map((_, i) => home(i, playT + 1)[2]);
        side = Uint8Array.from({ length: n }, (_, i) => (tgt[2 * i] >= AREA.x ? 1 : 0));
      }
      const moving = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        const tx = tgt[2 * i];
        const ty = tgt[2 * i + 1];
        const want = tx >= AREA.x ? 1 : 0;
        let ax = tx;
        let ay = ty;
        const x = pos[2 * i];
        const y = pos[2 * i + 1];
        if (want !== side![i]) {
          const [near, far] = side![i] === 0 ? [DOOR_IN, DOOR_OUT] : [DOOR_OUT, DOOR_IN];
          const atNear = Math.hypot(x - near.x, y - near.y) < 1 || (side![i] === 0 ? x > near.x : x < near.x);
          [ax, ay] = atNear ? [far.x, far.y] : [near.x, near.y];
          if (side![i] === 0 ? x >= AREA.x : x <= NEST.x + NEST.w) side![i] = want;
        }
        const dx = ax - x;
        const dy = ay - y;
        const d = Math.hypot(dx, dy);
        const step = Math.min(d, WALK * dtReal);
        if (d > 1e-6) {
          pos[2 * i] += (dx / d) * step;
          pos[2 * i + 1] += (dy / d) * step;
        }
        moving[i] = step > 0.02 ? 1 : 0;
        // Face the way it walks; still ants face their partner, the drop, or keep their heading.
        let want_h = head![i];
        if (step > 0.15) want_h = Math.atan2(dy, dx);
        else if (f.act[i] === ACT.giving || f.act[i] === ACT.receiving) {
          const p = f.partner[i];
          want_h = Math.atan2(pos[2 * p + 1] - pos[2 * i + 1], pos[2 * p] - pos[2 * i]);
        } else if (f.act[i] === ACT.source) want_h = Math.atan2(DROP.y - pos[2 * i + 1], DROP.x - pos[2 * i]);
        else want_h = home(i, playT + 1)[2];
        const dh = Math.atan2(Math.sin(want_h - head![i]), Math.cos(want_h - head![i]));
        head![i] += dh * Math.min(1, dtReal * 10);
      }
      const fCol = col('--series-sim');
      const nfCol = col('--text-muted');
      for (let i = 0; i < n; i++)
        drawAnt(ctx, X(pos[2 * i]), Y(pos[2 * i + 1]), head![i], { scale: s, load: f.crop[i] / 240, color: f.forager[i] ? fCol : nfCol, cropColor: food, gait: moving[i] ? now / 90 + i : undefined });
      // Trophallaxis: a pulsing glow where the two mouths meet, drawn on top.
      ctx.fillStyle = food;
      for (let i = 0; i < n; i++)
        if (f.act[i] === ACT.receiving) {
          const d = f.partner[i];
          const mx = X((pos[2 * d] + pos[2 * i]) / 2);
          const my = Y((pos[2 * d + 1] + pos[2 * i + 1]) / 2);
          const pulse = 0.55 + 0.45 * Math.sin(now / 180 + i);
          for (const [r, a] of [[2.2, 0.18], [1.4, 0.3], [0.7, 0.65]] as const) {
            ctx.globalAlpha = a * pulse;
            ctx.beginPath();
            ctx.arc(mx, my, r * s, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      ctx.globalAlpha = 1;
      const fmt = (c: number, label: string, key: string) => `<span class="chip"><span class="key" style="background:${key}"></span>${c} ${label}</span>`;
      let atFood = 0;
      let pairs = 0;
      for (let i = 0; i < n; i++) {
        if (f.act[i] === ACT.source) atFood++;
        if (f.act[i] === ACT.receiving) pairs++;
      }
      const chips =
        fmt(f.forager.reduce((a, b) => a + b, 0), 'foragers', fCol) +
        fmt(atFood, 'at the food', fCol) +
        fmt(pairs, pairs === 1 ? 'pair sharing' : 'pairs sharing', food) +
        fmt(countTrue(res, playT), 'contacts so far', 'var(--text-secondary)') +
        fmt(countObserved(res, playT), 'recorded by the observer', food);
      if (counts.innerHTML !== chips) counts.innerHTML = chips;
      tLabel.textContent = `${fmtTime(playT)} after food · ${speedSel.value}× real time`;
      drawTimeline(timeline, res, playT, hoverT, col);
    }
    // Walls over everything (ants walking through the doorway pass under the wall line), then labels.
    ctx.lineWidth = 1.5 * dpr;
    ctx.strokeStyle = col('--axis');
    ctx.beginPath();
    ctx.rect(...box(AREA));
    ctx.stroke();
    ctx.strokeStyle = flash > 0 ? food : col('--axis');
    ctx.lineWidth = (flash > 0 ? 3 : 1.5) * dpr;
    ctx.beginPath();
    ctx.rect(...box(NEST));
    ctx.stroke();
    ctx.fillStyle = col('--surface-1');
    ctx.fillRect(X(ROUTE.x) - 2 * dpr, Y(ROUTE.y) + dpr, ROUTE.w * s + 4 * dpr, ROUTE.h * s - 2 * dpr);
    ctx.strokeStyle = col('--axis');
    ctx.lineWidth = 1.5 * dpr;
    ctx.beginPath();
    ctx.moveTo(X(ROUTE.x), Y(ROUTE.y));
    ctx.lineTo(X(ROUTE.x + ROUTE.w), Y(ROUTE.y));
    ctx.moveTo(X(ROUTE.x), Y(ROUTE.y + ROUTE.h));
    ctx.lineTo(X(ROUTE.x + ROUTE.w), Y(ROUTE.y + ROUTE.h));
    ctx.stroke();
    ctx.font = `${11 * dpr}px system-ui`;
    ctx.fillStyle = col('--text-muted');
    ctx.fillText('nest 56 × 41 mm', X(NEST.x), Y(NEST.y) - 5 * dpr);
    ctx.fillText('foraging area, 1 M sucrose', X(AREA.x), Y(AREA.y) - 5 * dpr);
    if (flash > 0) {
      ctx.fillStyle = food;
      ctx.textAlign = 'right';
      ctx.fillText('scan', X(NEST.x + NEST.w), Y(NEST.y) - 5 * dpr);
      ctx.textAlign = 'start';
    }
    raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);
  void open();
  return () => {
    cancelAnimationFrame(raf);
    worker.terminate();
    sharedTooltip().style.display = 'none';
  };
}

/** Time (s after food) at which the recorded colony's observer logs an event. */
const obsTime = (r: E6Response, minute: number) => r.scanPhase + (minute - 30) * 60;
const countTrue = (r: E6Response, t: number) => r.trueStarts.filter((s) => s <= t).length;
const countObserved = (r: E6Response, t: number) => r.observed.filter((o) => obsTime(r, o.minute) <= t).length;

function fmtTime(s: number): string {
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

/**
 * Timeline strip for the animated colony: every true contact as a tick when
 * it starts (top row), every observed event as a tick at the scan that
 * recorded it (bottom row), scan instants as faint marks, and the playhead.
 */
function drawTimeline(cv: HTMLCanvasElement, r: E6Response, t: number, hoverT: number, col: (n: string) => string): void {
  const { ctx, dpr } = fitCanvas(cv);
  const W = cv.width;
  const H = cv.height;
  const T = r.frames[r.frames.length - 1].t;
  const X = (s: number) => (s / T) * W;
  const axisH = 13 * dpr;
  const rowH = (H - axisH - 6 * dpr) / 2;
  const r1 = 2 * dpr;
  const r2 = r1 + rowH + 2 * dpr;
  ctx.fillStyle = col('--surface-2');
  ctx.fillRect(0, r1, W, rowH);
  ctx.fillRect(0, r2, W, rowH);
  // Scans.
  ctx.fillStyle = col('--grid');
  for (let s = r.scanPhase; s <= T; s += 60) ctx.fillRect(X(s), r2, Math.max(1, dpr), rowH);
  ctx.globalAlpha = 0.75;
  ctx.fillStyle = col('--text-secondary');
  for (const s of r.trueStarts) ctx.fillRect(X(s) - dpr / 2, r1 + rowH * 0.15, Math.max(1, dpr), rowH * 0.7);
  ctx.globalAlpha = 1;
  ctx.fillStyle = col('--series-data');
  for (const o of r.observed) ctx.fillRect(X(obsTime(r, o.minute)) - dpr, r2 + rowH * 0.1, 2 * dpr, rowH * 0.8);
  ctx.font = `${10 * dpr}px system-ui`;
  ctx.fillStyle = col('--text-muted');
  // Row labels on a backing so the ticks do not run through them.
  for (const [label, y] of [['contacts', r1], ['observed', r2]] as const) {
    const w = ctx.measureText(label).width + 8 * dpr;
    ctx.fillStyle = col('--surface-1');
    ctx.globalAlpha = 0.85;
    ctx.fillRect(0, y, w, rowH);
    ctx.globalAlpha = 1;
    ctx.fillStyle = col('--text-muted');
    ctx.fillText(label, 4 * dpr, y + rowH - 4 * dpr);
  }
  for (let m = 0; m <= T / 60 + 1e-6; m += 10) {
    ctx.textAlign = m === 0 ? 'left' : m + 10 > T / 60 ? 'right' : 'center';
    ctx.fillText(`${m} min`, X(m * 60), H - 2 * dpr);
  }
  ctx.textAlign = 'start';
  if (hoverT >= 0) {
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = col('--text-primary');
    ctx.fillRect(X(hoverT) - dpr / 2, r1, dpr, 2 * rowH + 2 * dpr);
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = col('--accent');
  ctx.fillRect(X(t) - dpr, 0, 2 * dpr, r2 + rowH + 2 * dpr);
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
  const band = r.cumSimLo && r.cumSimHi ? [{ name: 'Model, central 90 % of single colonies', color: 'var(--series-sim)', x, y: r.cumSimHi, lower: r.cumSimLo, opacity: 0.16 }] : [];
  lineChart(
    slot,
    [
      ...band,
      ...r.cumDataColonies.map((y, c) => ({ name: c ? `Data colony ${c + 1}` : 'Data, single colonies', color: 'var(--series-data)', x, y, width: 1.2, opacity: 0.5, noLegend: c > 0, noTooltip: true })),
      { name: 'Data, mean of 5 colonies', color: 'var(--series-data)', x, y: r.cumData, width: 2.5 },
      { name: 'Model, mean as observed', color: 'var(--series-sim)', x, y: r.cumSim, width: 2.5 },
    ],
    {
      title: 'Cumulative trophallactic events after food introduction',
      xLabel: 'minutes after food',
      yLabel: 'events',
      yMin: 0,
      xFormat: (v) => v.toFixed(0),
      yFormat: (v) => v.toFixed(0),
      note: band.length
        ? 'Every curve is what the once-a-minute observer records. The shaded band holds 90 % of single simulated colonies (100 colonies), so with a fitting model most of the five thin data curves fall inside it.'
        : 'Every curve is what the once-a-minute observer records.',
    },
  );
}

function renderTable(card: HTMLElement, rows: E6Row[]): void {
  card.textContent = '';
  const h = document.createElement('h2');
  h.textContent = 'Simulation vs data (Bles et al. 2022, 5 colonies)';
  const tally = (zs: number[]) => {
    const c = { ok: 0, marginal: 0, off: 0 };
    for (const z of zs) if (Number.isFinite(z)) c[verdict(z)]++;
    return `${c.ok} within, ${c.marginal} marginal, ${c.off} off`;
  };
  const summary = document.createElement('p');
  summary.className = 'note';
  summary.innerHTML = `<strong>Means:</strong> ${tally(rows.map((r) => r.mean.z))} · <strong>Spread:</strong> ${tally(rows.map((r) => r.spread.z))}`;
  const note = document.createElement('p');
  note.className = 'note';
  note.textContent =
    'Mean: t = (simulated − data) / √(SE_data² + SE_sim²), SE_data = SD/√5; SE_data rests on 5 colonies, so z is the normal equivalent of t with 4 degrees of freedom. Spread: variance-ratio F test between colonies, as a normal-equivalent z; with 5 colonies it is weak. Forager-based rows come from the paper (forager identities are not in the raw data). |z| ≤ 2 consistent (green zone); ≤ 3 marginal (amber zone).';
  card.append(h, summary);
  const t = document.createElement('table');
  t.className = 'params';
  const headRow = document.createElement('tr');
  for (const c of ['Measure', 'Data', 'Simulated', 'z (mean)', 'z (SD)']) headRow.appendChild(Object.assign(document.createElement('th'), { textContent: c, className: c.startsWith('z') || c === 'Data' || c === 'Simulated' ? 'num' : '' }));
  headRow.appendChild(zStripHeader());
  t.appendChild(headRow);
  const f = (v: number) => (Math.abs(v) < 1 ? v.toFixed(2) : v.toFixed(1));
  const families: [string, (r: E6Row) => boolean][] = [
    ['Primary measures', (r) => r.target.family === 'primary'],
    ['Network measures (judged together as one family)', (r) => r.target.family !== 'primary'],
  ];
  for (const [label, keep] of families) {
    const group = rows.filter(keep);
    if (!group.length) continue;
    const gr = document.createElement('tr');
    gr.className = 'group';
    gr.appendChild(Object.assign(document.createElement('td'), { colSpan: 6, textContent: label }));
    t.appendChild(gr);
    for (const r of group) {
      const tr = document.createElement('tr');
      const c1 = Object.assign(document.createElement('td'), { textContent: r.target.label, title: REFS.bles2022?.full ?? 'Bles et al. 2022' });
      const c2 = Object.assign(document.createElement('td'), { className: 'num', textContent: `${f(r.target.mean)} ± ${f(r.target.sd)}${r.target.source === 'paper' ? ' (paper)' : ''}` });
      const c3 = Object.assign(document.createElement('td'), { className: 'num', textContent: `${f(r.simMean)} ± ${f(r.simSd)}` });
      tr.append(c1, c2, c3, zCell(r.mean.z), zCell(r.spread.z), zStripCell(r.mean.z, r.spread.z));
      t.appendChild(tr);
    }
  }
  card.appendChild(t);
  const p = document.createElement('p');
  p.className = 'note';
  p.textContent = '“± x” is the SD between colonies. The refitted TEC model is fitted to these E6 data (foragers and pair types), so it is a reference baseline, not a test.';
  card.append(p, note);
}
