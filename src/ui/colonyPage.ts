import { LASIUS_NEST_DEF } from '../sim/species/lasiusM1';
import { blesApparatus } from '../sim/world/apparatus';
import { colonyFromJson, type ColonyRequest, type ColonyView } from '../worker/colonyCompute';
import ColonyWorker from '../worker/colonyWorker?worker';
import { drawAnt } from './antSprite';
import { fitCanvas, labeled } from './dom';
import { lineChart, sharedTooltip } from './lineChart';
import { COLONY_DEFAULTS } from './pageDefaults';
import { loadPrecomputed } from './precomputed';

/**
 * Colony page (step 4, bounded and PROVISIONAL, STATUS 2026-10-08): one
 * simulated Lasius niger colony in the Bles et al. (2022) lab nest, for
 * inspecting movement, antennal contacts, food sharing and the conservation
 * of food. The in-nest behaviour uses placeholder parameters; nothing here is
 * compared with data.
 */
const { app, feeder } = blesApparatus();
const [NEST, PASSAGE, AREA] = app.regions;
const B = app.bounds;
/** Margins around the apparatus (mm): room for the region labels above. */
const PAD = { l: 2, r: 2, t: 7, b: 2 };
const WORLD_W = B.x1 - B.x0 + PAD.l + PAD.r;
const WORLD_H = B.y1 - B.y0 + PAD.t + PAD.b;
/** Seconds of path drawn behind the followed ant. */
const TRAIL_S = 60;
/** Sugar in the drop when it was placed (mg): the largest food balance of the run. */
const foodSugar0 = (v: ColonyView) => {
  let m = 0;
  for (let k = 0; k < v.frames; k++) m = Math.max(m, v.sugar[4 * k]);
  return m;
};

/** Display groups of the behaviour codes. */
type Group = 'rest' | 'walk' | 'share' | 'out';
const GROUPS: Group[] = ['out', 'share', 'walk', 'rest'];
const GROUP: Record<string, Group> = { rest: 'rest', active: 'walk', give: 'share', receive: 'share', leave: 'out', explore: 'out', drink: 'out', search: 'out', return: 'out' };
const GROUP_LABEL: Record<Group, string> = { rest: 'resting', walk: 'walking in the nest', share: 'sharing food', out: 'foraging trip' };
const MODE_LABEL: Record<string, string> = { rest: 'resting', active: 'walking', give: 'giving food', receive: 'receiving food', leave: 'heading out to forage', explore: 'exploring the foraging area', drink: 'drinking at the drop', search: 'searching near the drop', return: 'returning to the nest' };

/** Theme colours read once per frame. Food is blue everywhere: drop, crop contents, sharing. */
function palette() {
  const css = getComputedStyle(document.documentElement);
  const col = (name: string) => css.getPropertyValue(name).trim();
  return {
    col,
    group: { rest: col('--text-muted'), walk: col('--text-primary'), share: col('--series-data'), out: col('--series-sim') } as Record<Group, string>,
    food: col('--series-data'),
  };
}

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
    'Workers starved for 4 days, in a 56 × 41 mm covered nest joined by a 4 mm passage to a foraging area; 1 M sucrose appears at minute 30 (Bles et al. 2022 set-up). Workers rest, walk, leave to forage and share food mouth to mouth when both partners agree. Every microlitre is tracked by the conservation ledger.';
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
  const status = document.createElement('span');
  status.className = 'note';
  bar.append(labeled('Seed', seedIn), labeled('Workers', antsIn), runBtn, status);
  root.appendChild(bar);

  const grid = document.createElement('div');
  grid.className = 'grid wide-left';
  root.appendChild(grid);
  const left = document.createElement('div');
  const right = document.createElement('div');
  right.className = 'stack';
  grid.append(left, right);

  // Arena card: top view, then the scrubbable activity timeline and controls.
  const arenaCard = document.createElement('div');
  arenaCard.className = 'card';
  const ah = document.createElement('h2');
  ah.textContent = 'Top view';
  const legend = document.createElement('div');
  legend.className = 'legend';
  legend.innerHTML = [
    '<span><span class="key dot" style="background:var(--text-muted)"></span>Resting</span>',
    '<span><span class="key dot" style="background:var(--text-primary)"></span>Walking</span>',
    '<span><span class="key dot" style="background:var(--series-sim)"></span>On a foraging trip</span>',
    '<span><span class="key dot" style="background:var(--series-data)"></span>Sugar: drop, crop contents (gaster core), sharing (glow)</span>',
  ].join('');
  const canvas = document.createElement('canvas');
  canvas.className = 'arena';
  canvas.style.aspectRatio = `${WORLD_W / WORLD_H}`;
  const timeline = document.createElement('canvas');
  timeline.className = 'timeline';
  timeline.setAttribute('aria-label', 'Timeline: workers by activity; drag to move through the run');
  const playBar = document.createElement('div');
  playBar.className = 'toolbar scrub';
  const playBtn = Object.assign(document.createElement('button'), { textContent: 'Pause' });
  const speedSel = document.createElement('select');
  for (const v of [1, 2, 5, 15, 30, 60]) speedSel.append(Object.assign(document.createElement('option'), { value: String(v), textContent: `${v}×`, selected: v === 2 }));
  const jumpBtn = Object.assign(document.createElement('button'), { textContent: 'Jump to food' });
  const tLabel = Object.assign(document.createElement('span'), { className: 'note mono' });
  playBar.append(playBtn, labeled('Playback', speedSel), jumpBtn, tLabel);
  const counts = document.createElement('div');
  counts.className = 'chips';
  const info = document.createElement('p');
  info.className = 'note';
  const hint = Object.assign(document.createElement('p'), {
    className: 'note',
    textContent: 'Gaster size and its blue core show crop load. Click an ant to follow it (its last minute of path is drawn); click again to let go. The strip under the view shows how many workers do what; drag it to move through the run.',
  });
  arenaCard.append(ah, legend, canvas, timeline, playBar, counts, info, hint);
  left.appendChild(arenaCard);

  // Beside the arena: conservation, sugar flows and the sharing log; below: parameters.
  const consCard = document.createElement('div');
  consCard.className = 'card';
  const chartFlows = document.createElement('div');
  const logCard = document.createElement('div');
  logCard.className = 'card';
  right.append(consCard, chartFlows, logCard);
  const paramCard = document.createElement('div');
  paramCard.className = 'card';
  paramCard.style.marginTop = '16px';
  root.append(paramCard);
  renderParams(paramCard);

  const worker = new ColonyWorker();
  let v: ColonyView | null = null;
  /** Workers per display group, sampled every `actStep` frames, for the timeline. */
  let activity: Record<Group, Uint8Array> | null = null;
  let actStep = 1;
  let playT = 0;
  let playing = true;
  let lastTick = performance.now();
  let raf = 0;
  let selected = -1;
  let token = 0;
  let live = -1;
  let lastLogKey = '';
  let hoverT = -1;

  const request = (): ColonyRequest => ({ seed: Number(seedIn.value), ants: Number(antsIn.value), minutes: COLONY_DEFAULTS.minutes, foodMinute: COLONY_DEFAULTS.foodMinute, frameDt: COLONY_DEFAULTS.frameDt });
  const show = (r: ColonyView, how: string) => {
    v = r;
    runBtn.disabled = false;
    status.textContent = how;
    playT = 0;
    selected = -1;
    lastLogKey = '';
    actStep = Math.max(1, Math.round(5 / r.frameDt));
    activity = groupCounts(r, actStep);
    renderFlows(chartFlows, r);
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
  jumpBtn.onclick = () => {
    if (v) playT = Math.max(0, v.foodTime - 5);
  };

  // Geometry of the current view (set in draw, used for picking).
  let view = { s: 1 };
  const X = (x: number) => (x - B.x0 + PAD.l) * view.s;
  const Y = (y: number) => (y - B.y0 + PAD.t) * view.s;
  const antAt = (ev: MouseEvent): number => {
    if (!v) return -1;
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
    return best;
  };
  canvas.onclick = (ev) => {
    const best = antAt(ev);
    selected = best === selected ? -1 : best;
  };
  canvas.onpointermove = (ev) => {
    canvas.style.cursor = antAt(ev) >= 0 ? 'pointer' : 'default';
  };

  // Timeline scrubbing and hover.
  const TL = { l: 0, r: 0 };
  const tAtX = (clientX: number) => {
    if (!v) return 0;
    const r = timeline.getBoundingClientRect();
    const T = (v.frames - 1) * v.frameDt;
    return Math.max(0, Math.min(T, ((clientX - r.left - TL.l) / (r.width - TL.l - TL.r)) * T));
  };
  let dragging = false;
  timeline.onpointerdown = (ev) => {
    dragging = true;
    timeline.setPointerCapture(ev.pointerId);
    playT = tAtX(ev.clientX);
  };
  timeline.onpointerup = () => {
    dragging = false;
  };
  timeline.onpointermove = (ev) => {
    if (!v || !activity) return;
    const t = tAtX(ev.clientX);
    if (dragging) playT = t;
    hoverT = t;
    const j = Math.min(activity.rest.length - 1, Math.round(t / v.frameDt / actStep));
    const tip = sharedTooltip();
    const pal = palette();
    tip.innerHTML =
      `<div class="muted">${fmtTime(t)} · ${t < v.foodTime ? `food in ${fmtTime(v.foodTime - t)}` : `${fmtTime(t - v.foodTime)} after food`}</div>` +
      [...GROUPS]
        .reverse()
        .map((g) => `<div class="row"><span class="key" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${pal.group[g]}"></span><strong>${activity![g][j]}</strong><span class="muted">${GROUP_LABEL[g]}</span></div>`)
        .join('');
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
    const pal = palette();
    const { col } = pal;
    const { ctx, dpr } = fitCanvas(canvas);
    const s = Math.min(canvas.width / WORLD_W, canvas.height / WORLD_H);
    view = { s };
    const rect = (r: { x0: number; y0: number; x1: number; y1: number }) => [X(r.x0), Y(r.y0), (r.x1 - r.x0) * s, (r.y1 - r.y0) * s] as const;
    // Floors: covered nest a shade darker than the open passage and foraging area.
    ctx.fillStyle = col('--surface-2');
    ctx.fillRect(...rect(NEST));
    ctx.fillStyle = col('--surface-1');
    for (const r of [PASSAGE, AREA]) ctx.fillRect(...rect(r));

    let k = 0;
    let st: ReturnType<typeof state> | null = null;
    if (v && v.frames > 1) {
      const T = (v.frames - 1) * v.frameDt;
      if (playing && !dragging) playT = Math.min(T, playT + dtReal * Number(speedSel.value));
      if (playing && playT >= T) playT = 0;
      st = state(v, playT);
      k = st.k;
      // Food drop (hemisphere radius from its volume); before it appears, its place.
      const [fx, fy] = feeder;
      if (playT >= v.foodTime) {
        const ul = v.foodUl[k];
        const r = Math.max(0.3, Math.cbrt((3 * Math.max(ul, 0)) / (2 * Math.PI)));
        const g = ctx.createRadialGradient(X(fx) - r * s * 0.3, Y(fy) - r * s * 0.3, r * s * 0.1, X(fx), Y(fy), r * s);
        g.addColorStop(0, 'rgba(190,215,255,0.95)');
        g.addColorStop(1, 'rgba(90,150,240,0.7)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(X(fx), Y(fy), r * s, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = col('--axis');
        ctx.setLineDash([3 * dpr, 3 * dpr]);
        ctx.lineWidth = dpr;
        ctx.beginPath();
        ctx.arc(X(fx), Y(fy), 2.5 * s, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = col('--text-muted');
        ctx.font = `${11 * dpr}px system-ui`;
        ctx.textAlign = 'center';
        ctx.fillText(`sucrose at ${fmtTime(v.foodTime)}`, X(fx), Y(fy) + 2.5 * s + 14 * dpr);
        ctx.textAlign = 'start';
      }
      // Followed ant: its last minute of path.
      if (selected >= 0 && selected < v.n) {
        const k0 = Math.max(0, k - Math.round(TRAIL_S / v.frameDt));
        ctx.strokeStyle = col('--accent');
        ctx.lineWidth = 1.5 * dpr;
        ctx.lineJoin = 'round';
        for (let j = k0 + 1; j <= k; j++) {
          ctx.globalAlpha = 0.15 + (0.6 * (j - k0)) / (k - k0 + 1);
          ctx.beginPath();
          ctx.moveTo(X(px(v, j - 1, selected)), Y(py(v, j - 1, selected)));
          ctx.lineTo(X(px(v, j, selected)), Y(py(v, j, selected)));
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
      for (let i = 0; i < v.n; i++) {
        const code = v.mode[k * v.n + i];
        if (code === 255) continue;
        const g = GROUP[v.modes[code]] ?? 'walk';
        // Sharing shows as the glow; the body keeps the in-nest colour.
        const body = g === 'share' ? pal.group.walk : pal.group[g];
        ctx.globalAlpha = g === 'rest' ? 0.8 : 1;
        drawAnt(ctx, X(st.x[i]), Y(st.y[i]), st.h[i], { scale: s, load: v.crop[k * v.n + i] / 255, color: body, cropColor: pal.food, gait: st.moving[i] ? now / 80 + i * 1.7 : undefined });
      }
      ctx.globalAlpha = 1;
      // Sharing: a pulsing glow where the mouths meet.
      const pulse = 0.55 + 0.45 * Math.sin(now / 180);
      ctx.fillStyle = pal.food;
      for (let i = 0; i < v.n; i++) {
        const p = v.partner[k * v.n + i];
        if (p < 0 || p < i || v.partner[k * v.n + p] !== i) continue;
        const mx = X((st.x[i] + st.x[p]) / 2);
        const my = Y((st.y[i] + st.y[p]) / 2);
        for (const [r, a] of [[2.2, 0.18], [1.4, 0.3], [0.7, 0.6]] as const) {
          ctx.globalAlpha = a * pulse;
          ctx.beginPath();
          ctx.arc(mx, my, r * s, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }
    // Everything outside the floors is wall: mask it after the ants so bodies stop at the walls.
    ctx.fillStyle = col('--arena');
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    for (const r of [NEST, PASSAGE, AREA]) ctx.rect(...rect(r));
    ctx.fill('evenodd');
    ctx.strokeStyle = col('--axis');
    ctx.lineWidth = 1.5 * dpr;
    // The passage opens into both: leave its mouths out of the wall lines (clip, not paint, so ants in it stay visible).
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.rect(X(PASSAGE.x0) - 3 * dpr, Y(PASSAGE.y0) + dpr, (PASSAGE.x1 - PASSAGE.x0) * s + 6 * dpr, (PASSAGE.y1 - PASSAGE.y0) * s - 2 * dpr);
    ctx.clip('evenodd');
    ctx.beginPath();
    for (const r of [NEST, AREA]) ctx.rect(...rect(r));
    ctx.stroke();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(X(PASSAGE.x0), Y(PASSAGE.y0));
    ctx.lineTo(X(PASSAGE.x1), Y(PASSAGE.y0));
    ctx.moveTo(X(PASSAGE.x0), Y(PASSAGE.y1));
    ctx.lineTo(X(PASSAGE.x1), Y(PASSAGE.y1));
    ctx.stroke();
    ctx.fillStyle = col('--text-muted');
    ctx.font = `${11 * dpr}px system-ui`;
    ctx.fillText('nest (covered) 56 × 41 mm', X(NEST.x0), Y(NEST.y0) - 5 * dpr);
    ctx.fillText('foraging area 61 × 49 mm', X(AREA.x0), Y(AREA.y0) - 5 * dpr);
    ctx.fillText('entrance', X(PASSAGE.x1) + 4 * dpr, Y(PASSAGE.y1) + 12 * dpr);
    // Selected ant: ring on top of everything.
    if (v && st && selected >= 0 && selected < v.n) {
      ctx.strokeStyle = col('--accent');
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.arc(X(st.x[selected]), Y(st.y[selected]), 3.2 * s, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (v && st && activity) {
      drawTimeline(timeline, v, activity, playT, hoverT, pal, TL);
      if (selected >= 0 && selected < v.n) {
        const code = v.mode[k * v.n + selected];
        const p = v.partner[k * v.n + selected];
        const mode = code === 255 ? 'dead' : (MODE_LABEL[v.modes[code]] ?? v.modes[code]);
        info.textContent = `Following ant ${selected}: ${mode}${p >= 0 ? ` (ant ${p})` : ''} · crop ${((v.crop[k * v.n + selected] / 255) * v.cropCapacity).toFixed(2)} µL of ${v.cropCapacity} · ${v.forager[selected] ? 'fed at the source during the run (forager)' : 'never fed at the source'}`;
      } else info.textContent = `${v.contacts[k]} antennal contacts in progress · ${playT >= v.foodTime ? `${v.foodUl[k].toFixed(1)} µL of sucrose left in the drop` : 'no food yet'}`;
      const rel = playT - v.foodTime;
      tLabel.textContent = `${fmtTime(playT)} · ${rel < 0 ? `food in ${fmtTime(-rel)}` : `${fmtTime(rel)} after food`}`;
      const groups = { out: 0, share: 0, walk: 0, rest: 0 };
      for (let i = 0; i < v.n; i++) {
        const code = v.mode[k * v.n + i];
        if (code !== 255) groups[GROUP[v.modes[code]] ?? 'walk']++;
      }
      const chips = ([...GROUPS].reverse() as Group[])
        .map((g) => `<span class="chip"><span class="key" style="background:${pal.group[g]}"></span>${groups[g]} ${GROUP_LABEL[g]}</span>`)
        .join('');
      if (counts.innerHTML !== chips) counts.innerHTML = chips;
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
    sharedTooltip().style.display = 'none';
  };
}

const px = (v: ColonyView, k: number, i: number) => v.pos[2 * (k * v.n + i)] / 100 + v.x0;
const py = (v: ColonyView, k: number, i: number) => v.pos[2 * (k * v.n + i) + 1] / 100 + v.y0;

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
    const xa = px(v, k, i);
    const ya = py(v, k, i);
    const xb = px(v, k1, i);
    const yb = py(v, k1, i);
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

/** Workers in each display group, every `step` frames. */
function groupCounts(v: ColonyView, step: number): Record<Group, Uint8Array> {
  const m = Math.ceil(v.frames / step);
  const out = { rest: new Uint8Array(m), walk: new Uint8Array(m), share: new Uint8Array(m), out: new Uint8Array(m) };
  for (let j = 0; j < m; j++) {
    const k = j * step;
    for (let i = 0; i < v.n; i++) {
      const code = v.mode[k * v.n + i];
      if (code !== 255) out[GROUP[v.modes[code]] ?? 'walk'][j]++;
    }
  }
  return out;
}

/**
 * Timeline strip: workers by activity stacked over the whole run (foraging at
 * the bottom), sharing bouts as ticks along the top, the food marker, and the
 * playhead.
 */
function drawTimeline(cv: HTMLCanvasElement, v: ColonyView, act: Record<Group, Uint8Array>, t: number, hoverT: number, pal: ReturnType<typeof palette>, m: { l: number; r: number }): void {
  const { ctx, dpr } = fitCanvas(cv);
  const W = cv.width;
  const H = cv.height;
  const T = (v.frames - 1) * v.frameDt;
  const tickH = 7 * dpr;
  const axisH = 14 * dpr;
  const top = tickH + 3 * dpr;
  const bot = H - axisH;
  const X = (s: number) => m.l * dpr + (s / T) * (W - (m.l + m.r) * dpr);
  const n = act.rest.length;
  // Stacked bars, one column per pixel bucket.
  const cols = Math.max(1, Math.floor(W / dpr));
  const per = n / cols;
  for (let c = 0; c < cols; c++) {
    const j = Math.min(n - 1, Math.floor(c * per));
    let y = bot;
    for (const g of GROUPS) {
      const hgt = (act[g][j] / v.n) * (bot - top);
      if (!hgt) continue;
      ctx.fillStyle = pal.group[g];
      ctx.globalAlpha = g === 'walk' ? 0.55 : g === 'rest' ? 0.45 : 0.85;
      ctx.fillRect((c * W) / cols, y - hgt, W / cols + 0.5, hgt);
      y -= hgt;
    }
  }
  ctx.globalAlpha = 1;
  // Sharing bouts: one tick per bout start.
  ctx.fillStyle = pal.food;
  for (const b of v.bouts) ctx.fillRect(X(b.start) - dpr / 2, 0, Math.max(1, dpr), tickH);
  // Time axis: a label every 15 min.
  ctx.fillStyle = pal.col('--text-muted');
  ctx.font = `${10 * dpr}px system-ui`;
  ctx.textAlign = 'center';
  for (let s = 0; s <= T + 1e-6; s += 900) {
    ctx.fillRect(X(s) - dpr / 2, bot, dpr, 3 * dpr);
    ctx.textAlign = s === 0 ? 'left' : s + 900 > T ? 'right' : 'center';
    ctx.fillText(`${Math.round(s / 60)} min`, X(s), H - 2 * dpr);
  }
  // Food marker.
  ctx.strokeStyle = pal.col('--text-primary');
  ctx.lineWidth = dpr;
  ctx.setLineDash([3 * dpr, 2 * dpr]);
  ctx.beginPath();
  ctx.moveTo(X(v.foodTime), top);
  ctx.lineTo(X(v.foodTime), bot);
  ctx.stroke();
  ctx.setLineDash([]);
  // Hover and playhead.
  if (hoverT >= 0) {
    ctx.fillStyle = pal.col('--text-primary');
    ctx.globalAlpha = 0.35;
    ctx.fillRect(X(hoverT) - dpr / 2, top, dpr, bot - top);
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = pal.col('--accent');
  ctx.fillRect(X(t) - dpr, 0, 2 * dpr, bot);
  ctx.beginPath();
  ctx.arc(X(t), bot, 4 * dpr, 0, Math.PI * 2);
  ctx.fill();
  ctx.textAlign = 'start';
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
    ['Taken from the drop', taken, 'var(--series-sim)'],
    ['Now in crops', s(1) - s0(1), 'var(--series-data)'],
    ['Change in body reserves', s(2) - s0(2), 'var(--text-secondary)'],
    ['Respired (metabolism)', s(3) - s0(3), 'var(--text-muted)'],
  ];
  const balance = taken - (s(1) - s0(1)) - (s(2) - s0(2)) - (s(3) - s0(3));
  const html = [
    '<h2>Where the sugar went (mg)</h2>',
    '<table class="params"><tbody>',
    ...rows.map(([label, val, c]) => `<tr><td><span class="key-dot" style="background:${c}"></span>${label}</td><td class="num mono">${val.toFixed(3)}</td></tr>`),
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
      // Wide and faint, so the crop line on top stays visible where the two coincide.
      { name: 'Taken from the drop', color: 'var(--series-sim)', x, y: taken, width: 6, opacity: 0.35 },
      { name: 'In crops', color: 'var(--series-data)', x, y: d(1) },
      { name: 'Reserves (change)', color: 'var(--text-secondary)', x, y: d(2) },
      { name: 'Respired', color: 'var(--text-muted)', x, y: d(3), dashed: true },
    ],
    {
      title: 'Sugar flows (mg)',
      xLabel: 'minutes',
      yLabel: 'mg sucrose',
      xFormat: (t) => t.toFixed(0),
      yFormat: (y) => y.toFixed(2),
      height: 220,
      refX: { x: v.foodTime / 60, label: 'food' },
      note: 'Changes since the start of the run. Taken = in crops + change in reserves + respired.',
    },
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
