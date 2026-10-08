import { LASIUS_NEST_DEF } from '../sim/species/lasiusM1';
import { blesApparatus } from '../sim/world/apparatus';
import { colonyFromJson, type ColonyRequest, type ColonyView } from '../worker/colonyCompute';
import ColonyWorker from '../worker/colonyWorker?worker';
import { drawAnt } from './antSprite';
import { fitCanvas, labeled } from './dom';
import { lineChart } from './lineChart';
import { COLONY_DEFAULTS } from './pageDefaults';
import { loadPrecomputed } from './precomputed';

/**
 * Colony page (step 4, bounded and PROVISIONAL, STATUS 2026-10-08): one
 * simulated Lasius niger colony in the Bles et al. (2022) lab nest, for
 * inspecting movement, antennal contacts, food sharing and the conservation
 * of food. The in-nest behaviour uses placeholder parameters; nothing here is
 * compared with data.
 */
const { app } = blesApparatus();
const [NEST, PASSAGE, AREA] = app.regions;
const B = app.bounds;
const PAD = 3;
/** Sugar in the drop when it was placed (mg): the largest food balance of the run. */
const foodSugar0 = (v: ColonyView) => {
  let m = 0;
  for (let k = 0; k < v.frames; k++) m = Math.max(m, v.sugar[4 * k]);
  return m;
};

/** Display groups of the behaviour codes. */
const GROUP: Record<string, 'rest' | 'walk' | 'share' | 'out'> = { rest: 'rest', active: 'walk', give: 'share', receive: 'share', leave: 'out', explore: 'out', drink: 'out', search: 'out', return: 'out' };
const GROUP_LABEL = { rest: 'resting', walk: 'walking in the nest', share: 'sharing food', out: 'foraging trip' };
const MODE_LABEL: Record<string, string> = { rest: 'resting', active: 'walking', give: 'giving food', receive: 'receiving food', leave: 'heading out to forage', explore: 'exploring the foraging area', drink: 'drinking at the drop', search: 'searching near the drop', return: 'returning to the nest' };

export function renderColony(root: HTMLElement): () => void {
  root.textContent = '';
  const h = document.createElement('h2');
  h.style.margin = '0 0 4px';
  h.append('Colony · one colony in the Bles et al. lab nest ');
  const badge = Object.assign(document.createElement('span'), { className: 'badge warn', textContent: 'provisional' });
  h.appendChild(badge);
  const lede = document.createElement('p');
  lede.className = 'lede';
  lede.textContent =
    'Fifty workers starved for 4 days, in a 56 × 41 mm covered nest joined by a 4 mm passage to a foraging area; 1 M sucrose appears at minute 30 (Bles et al. 2022 set-up). Workers rest, walk, leave to forage and share food mouth to mouth when both partners agree. Every microlitre is tracked by the conservation ledger.';
  const notice = document.createElement('p');
  notice.className = 'notice';
  notice.textContent =
    'Provisional (step 4, bounded version): the in-nest behaviour uses placeholder parameters (table below) and the walker is the E1 model pending its revision. Nothing on this page is calibrated or compared with data — use it to inspect movement, contacts and food flow.';
  root.append(h, lede, notice);

  const bar = document.createElement('div');
  bar.className = 'toolbar';
  const seedIn = Object.assign(document.createElement('input'), { type: 'number', value: String(COLONY_DEFAULTS.seed), min: '1', step: '1' });
  const antsIn = Object.assign(document.createElement('input'), { type: 'number', value: String(COLONY_DEFAULTS.ants), min: '2', max: '120', step: '1' });
  const runBtn = Object.assign(document.createElement('button'), { className: 'primary', textContent: 'Run' });
  const speedSel = document.createElement('select');
  for (const v of [1, 2, 5, 15, 30, 60]) speedSel.append(Object.assign(document.createElement('option'), { value: String(v), textContent: `${v}×`, selected: v === 2 }));
  const status = document.createElement('span');
  status.className = 'note';
  bar.append(labeled('Seed', seedIn), labeled('Workers', antsIn), runBtn, labeled('Playback', speedSel), status);
  root.appendChild(bar);

  const grid = document.createElement('div');
  grid.className = 'grid wide-left';
  root.appendChild(grid);
  const left = document.createElement('div');
  const right = document.createElement('div');
  grid.append(left, right);

  // Arena card.
  const arenaCard = document.createElement('div');
  arenaCard.className = 'card';
  const ah = document.createElement('h2');
  ah.textContent = 'Top view';
  const legend = document.createElement('div');
  legend.className = 'legend';
  legend.innerHTML =
    '<span><span class="key" style="background:var(--text-muted)"></span>Resting</span><span><span class="key" style="background:var(--text-primary)"></span>Walking</span><span><span class="key" style="background:var(--series-sim)"></span>On a foraging trip</span><span><span class="key" style="background:var(--series-data)"></span>Sharing food</span>';
  const canvas = document.createElement('canvas');
  canvas.className = 'arena';
  canvas.style.aspectRatio = `${(B.x1 - B.x0 + 2 * PAD) / (B.y1 - B.y0 + 2 * PAD)}`;
  canvas.style.cursor = 'pointer';
  const playBar = document.createElement('div');
  playBar.className = 'toolbar scrub';
  const playBtn = Object.assign(document.createElement('button'), { textContent: 'Pause' });
  const slider = Object.assign(document.createElement('input'), { type: 'range', min: '0', max: '5400', step: '0.5', value: '0' });
  slider.style.flex = '1';
  const tLabel = Object.assign(document.createElement('span'), { className: 'note mono' });
  playBar.append(playBtn, slider, tLabel);
  const info = document.createElement('p');
  info.className = 'note';
  const counts = document.createElement('div');
  counts.className = 'chips';
  const hint = Object.assign(document.createElement('p'), { className: 'note', textContent: 'Gaster size shows crop load. Click an ant to follow it.' });
  arenaCard.append(ah, legend, canvas, playBar, counts, info, hint);
  left.appendChild(arenaCard);

  // Beside the arena: conservation and the sharing log; below: charts and parameters.
  const consCard = document.createElement('div');
  consCard.className = 'card';
  const logCard = document.createElement('div');
  logCard.className = 'card';
  logCard.style.marginTop = '16px';
  right.append(consCard, logCard);
  const charts = document.createElement('div');
  charts.className = 'charts';
  charts.style.marginTop = '16px';
  const chartFlows = document.createElement('div');
  const chartActivity = document.createElement('div');
  charts.append(chartFlows, chartActivity);
  const paramCard = document.createElement('div');
  paramCard.className = 'card';
  paramCard.style.marginTop = '16px';
  root.append(charts, paramCard);
  renderParams(paramCard);

  const worker = new ColonyWorker();
  let v: ColonyView | null = null;
  let playT = 0;
  let playing = true;
  let lastTick = performance.now();
  let raf = 0;
  let selected = -1;
  let token = 0;
  let live = -1;
  let lastLogKey = '';

  const request = (): ColonyRequest => ({ seed: Number(seedIn.value), ants: Number(antsIn.value), minutes: COLONY_DEFAULTS.minutes, foodMinute: COLONY_DEFAULTS.foodMinute, frameDt: COLONY_DEFAULTS.frameDt });
  const show = (r: ColonyView, how: string) => {
    v = r;
    runBtn.disabled = false;
    status.textContent = how;
    playT = 0;
    selected = -1;
    lastLogKey = '';
    slider.max = String((r.frames - 1) * r.frameDt);
    renderFlows(chartFlows, r);
    renderActivity(chartActivity, r);
  };
  const run = () => {
    live = ++token;
    runBtn.disabled = true;
    status.textContent = 'Simulating the colony (90 min)…';
    worker.postMessage(request());
  };
  const open = async () => {
    const t = ++token;
    status.textContent = 'Loading…';
    const pre = await loadPrecomputed<Record<string, unknown>>('colony', request());
    if (t !== token) return;
    if (pre) show(colonyFromJson(pre), `Precomputed (seed ${seedIn.value}, ${antsIn.value} workers) · Run to simulate again`);
    else run();
  };
  worker.onmessage = (ev: MessageEvent<ColonyView>) => {
    if (live === token) show(ev.data, `Done in ${(ev.data.ms / 1000).toFixed(1)} s`);
  };
  runBtn.onclick = run;
  playBtn.onclick = () => {
    playing = !playing;
    playBtn.textContent = playing ? 'Pause' : 'Play';
  };
  slider.oninput = () => {
    playT = Number(slider.value);
  };

  // Geometry of the current view (set in draw, used for picking).
  let view = { s: 1, ox: 0, oy: 0 };
  const X = (x: number) => view.ox + (x - B.x0 + PAD) * view.s;
  const Y = (y: number) => view.oy + (y - B.y0 + PAD) * view.s;
  canvas.onclick = (ev) => {
    if (!v) return;
    const r = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const px = (ev.clientX - r.left) * dpr;
    const py = (ev.clientY - r.top) * dpr;
    const st = state(v, playT);
    let best = -1;
    let bd = 4 * view.s;
    for (let i = 0; i < v.n; i++) {
      const d = Math.hypot(X(st.x[i]) - px, Y(st.y[i]) - py);
      if (d < bd) {
        bd = d;
        best = i;
      }
    }
    selected = best === selected ? -1 : best;
  };

  const draw = () => {
    const now = performance.now();
    const dtReal = Math.min(0.1, (now - lastTick) / 1000);
    lastTick = now;
    const css = getComputedStyle(document.documentElement);
    const col = (name: string) => css.getPropertyValue(name).trim();
    const { ctx, dpr } = fitCanvas(canvas);
    const s = Math.min(canvas.width / (B.x1 - B.x0 + 2 * PAD), canvas.height / (B.y1 - B.y0 + 2 * PAD));
    view = { s, ox: 0, oy: 0 };
    // Apparatus: covered nest (darker), passage, open foraging area.
    ctx.fillStyle = col('--surface-2');
    for (const r of [NEST, PASSAGE]) ctx.fillRect(X(r.x0), Y(r.y0), (r.x1 - r.x0) * s, (r.y1 - r.y0) * s);
    ctx.fillStyle = col('--surface-1');
    ctx.fillRect(X(AREA.x0), Y(AREA.y0), (AREA.x1 - AREA.x0) * s, (AREA.y1 - AREA.y0) * s);
    ctx.strokeStyle = col('--axis');
    ctx.lineWidth = dpr;
    for (const r of [NEST, PASSAGE, AREA]) ctx.strokeRect(X(r.x0), Y(r.y0), (r.x1 - r.x0) * s, (r.y1 - r.y0) * s);
    // Nest cover: faint diagonal hatching.
    ctx.save();
    ctx.beginPath();
    ctx.rect(X(NEST.x0), Y(NEST.y0), (NEST.x1 - NEST.x0) * s, (NEST.y1 - NEST.y0) * s);
    ctx.clip();
    ctx.strokeStyle = col('--grid');
    ctx.lineWidth = dpr;
    for (let k = -NEST.y1; k < NEST.x1; k += 4) {
      ctx.beginPath();
      ctx.moveTo(X(k), Y(NEST.y0));
      ctx.lineTo(X(k + NEST.y1), Y(NEST.y1));
      ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle = col('--text-muted');
    ctx.font = `${11 * dpr}px system-ui`;
    ctx.fillText('nest (covered) 56 × 41 mm', X(NEST.x0 + 1), Y(NEST.y0) - 4 * dpr);
    ctx.fillText('foraging area 61 × 49 mm', X(AREA.x0 + 1), Y(AREA.y0) - 4 * dpr);
    ctx.textAlign = 'center';
    ctx.fillText('entrance', X((PASSAGE.x0 + PASSAGE.x1) / 2), Y(PASSAGE.y0) - 6 * dpr);
    ctx.textAlign = 'start';

    if (v && v.frames > 1) {
      const T = (v.frames - 1) * v.frameDt;
      if (playing) playT = Math.min(T, playT + dtReal * Number(speedSel.value));
      if (playing && playT >= T) playT = 0;
      slider.value = String(playT);
      const st = state(v, playT);
      const k = st.k;
      // Food drop (hemisphere radius from its volume).
      if (playT >= v.foodTime) {
        const ul = v.foodUl[k];
        const r = Math.cbrt((3 * Math.max(ul, 0)) / (2 * Math.PI));
        const g = ctx.createRadialGradient(X(90.5) - r * s * 0.3, Y(20.5) - r * s * 0.3, r * s * 0.1, X(90.5), Y(20.5), r * s);
        g.addColorStop(0, 'rgba(190,215,255,0.9)');
        g.addColorStop(1, 'rgba(90,150,240,0.55)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(X(90.5), Y(20.5), r * s, 0, Math.PI * 2);
        ctx.fill();
      }
      const colours = { rest: col('--text-muted'), walk: col('--text-primary'), share: col('--series-data'), out: col('--series-sim') };
      const groups = { rest: 0, walk: 0, share: 0, out: 0 };
      for (let i = 0; i < v.n; i++) {
        const code = v.mode[k * v.n + i];
        if (code === 255) continue;
        const g = GROUP[v.modes[code]] ?? 'walk';
        groups[g]++;
        const moving = st.moving[i];
        ctx.globalAlpha = g === 'rest' ? 0.75 : 1;
        drawAnt(ctx, X(st.x[i]), Y(st.y[i]), st.h[i], { scale: s, load: v.crop[k * v.n + i] / 255, color: colours[g], gait: moving ? now / 80 + i * 1.7 : undefined });
      }
      ctx.globalAlpha = 1;
      // Sharing: a soft glow where the mouths meet.
      const pulse = 0.55 + 0.45 * Math.sin(now / 180);
      for (let i = 0; i < v.n; i++) {
        const p = v.partner[k * v.n + i];
        if (p < 0 || p < i || v.partner[k * v.n + p] !== i) continue;
        const mx = (st.x[i] + st.x[p]) / 2;
        const my = (st.y[i] + st.y[p]) / 2;
        const g = ctx.createRadialGradient(X(mx), Y(my), 0, X(mx), Y(my), 2.2 * s);
        g.addColorStop(0, `rgba(57,135,229,${0.55 * pulse})`);
        g.addColorStop(1, 'rgba(57,135,229,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(X(mx), Y(my), 2.2 * s, 0, Math.PI * 2);
        ctx.fill();
      }
      // Selected ant: ring and status.
      if (selected >= 0 && selected < v.n) {
        ctx.strokeStyle = col('--accent');
        ctx.lineWidth = 2 * dpr;
        ctx.beginPath();
        ctx.arc(X(st.x[selected]), Y(st.y[selected]), 3.2 * s, 0, Math.PI * 2);
        ctx.stroke();
        const code = v.mode[k * v.n + selected];
        const p = v.partner[k * v.n + selected];
        const mode = code === 255 ? 'dead' : (MODE_LABEL[v.modes[code]] ?? v.modes[code]);
        info.textContent = `Ant ${selected}: ${mode}${p >= 0 ? ` (ant ${p})` : ''} · crop ${((v.crop[k * v.n + selected] / 255) * v.cropCapacity).toFixed(2)} µL · ${v.forager[selected] ? 'fed at the source during the run (forager)' : 'never fed at the source'}`;
      } else info.textContent = `${v.contacts[k]} antennal contacts in progress · ${v.foodUl[k] > 0 ? `${v.foodUl[k].toFixed(1)} µL of sucrose left` : 'no food yet'}`;
      const rel = playT - v.foodTime;
      tLabel.textContent = `${fmtTime(playT)} · ${rel < 0 ? `food in ${fmtTime(-rel)}` : `${fmtTime(rel)} after food`}`;
      counts.innerHTML = (Object.keys(groups) as (keyof typeof groups)[])
        .map((g) => `<span class="chip"><span class="key" style="background:${colours[g]}"></span>${groups[g]} ${GROUP_LABEL[g]}</span>`)
        .join('');
      renderConservation(consCard, v, k);
      const logKey = `${k}`;
      if (logKey !== lastLogKey) {
        lastLogKey = logKey;
        renderLog(logCard, v, playT);
      }
    }
    raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);
  void open();
  return () => {
    cancelAnimationFrame(raf);
    worker.terminate();
  };
}

/** Interpolated positions and headings at time t (linear between frames). */
function state(v: ColonyView, t: number) {
  const f = Math.min(v.frames - 1, Math.max(0, t / v.frameDt));
  const k = Math.floor(f);
  const k1 = Math.min(v.frames - 1, k + 1);
  const u = f - k;
  const x = new Float32Array(v.n);
  const y = new Float32Array(v.n);
  const h = new Float32Array(v.n);
  const moving = new Uint8Array(v.n);
  for (let i = 0; i < v.n; i++) {
    const a = k * v.n + i;
    const b = k1 * v.n + i;
    const xa = v.pos[2 * a] / 100 + v.x0;
    const ya = v.pos[2 * a + 1] / 100 + v.y0;
    const xb = v.pos[2 * b] / 100 + v.x0;
    const yb = v.pos[2 * b + 1] / 100 + v.y0;
    x[i] = xa + (xb - xa) * u;
    y[i] = ya + (yb - ya) * u;
    const ha = (v.heading[a] / 256) * 2 * Math.PI;
    let dh = (v.heading[b] / 256) * 2 * Math.PI - ha;
    dh = Math.atan2(Math.sin(dh), Math.cos(dh));
    h[i] = ha + dh * u;
    moving[i] = Math.hypot(xb - xa, yb - ya) > 0.05 ? 1 : 0;
  }
  return { k, x, y, h, moving };
}

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

function renderConservation(card: HTMLElement, v: ColonyView, k: number): void {
  const s = (j: number) => v.sugar[4 * k + j];
  const s0 = (j: number) => v.sugar[j];
  const taken = k * v.frameDt >= v.foodTime ? foodSugar0(v) - s(0) : 0;
  const rows: [string, number, string][] = [
    ['Taken from the drop', taken, ''],
    ['Now in crops', s(1) - s0(1), ''],
    ['Change in body reserves', s(2) - s0(2), ''],
    ['Respired (metabolism)', s(3) - s0(3), ''],
  ];
  const balance = taken - (s(1) - s0(1)) - (s(2) - s0(2)) - (s(3) - s0(3));
  const html = [
    '<h2>Where the sugar went (mg)</h2>',
    '<table class="params"><tbody>',
    ...rows.map(([label, val]) => `<tr><td>${label}</td><td class="num mono">${val.toFixed(3)}</td></tr>`),
    `<tr class="total"><td>Unaccounted (should be 0)</td><td class="num mono">${Math.abs(balance) < 1e-6 ? '0.000' : balance.toExponential(1)}</td></tr>`,
    '</tbody></table>',
    `<p class="note">Ledger sum over all accounts: ${v.residual[k].toExponential(1)} mg (rounding only). Every transfer — drinking, sharing, absorption, respiration — goes through the conservation ledger.</p>`,
  ].join('');
  if (card.innerHTML !== html) card.innerHTML = html;
}

function renderLog(card: HTMLElement, v: ColonyView, t: number): void {
  const recent = v.bouts.filter((b) => b.start <= t).slice(-8).reverse();
  const total = v.bouts.filter((b) => b.start <= t);
  const ul = total.reduce((s, b) => s + (b.end <= t ? b.ul : (b.ul * (t - b.start)) / Math.max(1e-9, b.end - b.start)), 0);
  card.innerHTML = [
    `<h2>Food sharing</h2><p class="note">${total.length} bouts so far, ${ul.toFixed(2)} µL passed mouth to mouth.</p>`,
    recent.length
      ? `<table class="params"><thead><tr><th>Time</th><th>Donor → receiver</th><th class="num">µL</th><th class="num">Duration</th></tr></thead><tbody>${recent
          .map((b) => `<tr><td class="mono">${fmtTime(b.start)}</td><td>ant ${b.donor} → ant ${b.receiver}${b.end > t ? ' <span class="badge">now</span>' : ''}</td><td class="num mono">${b.ul.toFixed(2)}</td><td class="num mono">${(b.end - b.start).toFixed(0)} s</td></tr>`)
          .join('')}</tbody></table>`
      : '<p class="note">No sharing yet: crops stay empty until foragers bring food back.</p>',
  ].join('');
}

function renderFlows(slot: HTMLElement, v: ColonyView): void {
  const step = Math.max(1, Math.round(10 / v.frameDt));
  const idx = Array.from({ length: Math.ceil(v.frames / step) }, (_, i) => i * step);
  const x = idx.map((k) => (k * v.frameDt) / 60);
  const d = (j: number) => idx.map((k) => v.sugar[4 * k + j] - v.sugar[j]);
  const f0 = foodSugar0(v);
  const taken = idx.map((k) => (k * v.frameDt >= v.foodTime ? f0 - v.sugar[4 * k] : 0));
  lineChart(
    slot,
    [
      { name: 'Taken from the drop', color: 'var(--series-sim)', x, y: taken },
      { name: 'In crops', color: 'var(--series-data)', x, y: d(1) },
      { name: 'Reserves (change)', color: 'var(--text-secondary)', x, y: d(2) },
      { name: 'Respired', color: 'var(--text-muted)', x, y: d(3), dashed: true },
    ],
    { title: 'Sugar flows (mg)', xLabel: 'minutes', yLabel: 'mg sucrose', xFormat: (t) => t.toFixed(0), yFormat: (y) => y.toFixed(2) },
  );
}

function renderActivity(slot: HTMLElement, v: ColonyView): void {
  const step = Math.max(1, Math.round(10 / v.frameDt));
  const idx = Array.from({ length: Math.ceil(v.frames / step) }, (_, i) => i * step);
  const x = idx.map((k) => (k * v.frameDt) / 60);
  const count = (g: string) =>
    idx.map((k) => {
      let c = 0;
      for (let i = 0; i < v.n; i++) {
        const code = v.mode[k * v.n + i];
        if (code !== 255 && GROUP[v.modes[code]] === g) c++;
      }
      return c;
    });
  lineChart(
    slot,
    [
      { name: 'Resting', color: 'var(--text-muted)', x, y: count('rest') },
      { name: 'Walking', color: 'var(--text-secondary)', x, y: count('walk') },
      { name: 'Sharing', color: 'var(--series-data)', x, y: count('share') },
      { name: 'On a foraging trip', color: 'var(--series-sim)', x, y: count('out') },
    ],
    { title: 'Colony activity', xLabel: 'minutes', yLabel: 'workers', yMin: 0, xFormat: (t) => t.toFixed(0), yFormat: (y) => y.toFixed(0) },
  );
}

function renderParams(card: HTMLElement): void {
  const rows = Object.entries(LASIUS_NEST_DEF)
    .map(([k, p]) => `<tr><td>${k}</td><td class="num mono">${fmtVal(p.v as number)} ${p.unit}</td><td class="note">${(p.note ?? '').replace(/^Provisional placeholder \(step 4, not calibrated\)\.\s*/, '')}</td></tr>`)
    .join('');
  card.innerHTML = `<h2>In-nest behaviour parameters <span class="badge warn">provisional</span></h2><p class="note">Placeholders for inspection, not calibrated; calibration and the E6 comparison follow the E1 walking decision (STATUS, step 4).</p><table class="params"><tbody>${rows}</tbody></table>`;
}

function fmtVal(x: number): string {
  return Math.abs(x) < 0.1 && x !== 0 ? x.toPrecision(2) : String(+x.toPrecision(3));
}
