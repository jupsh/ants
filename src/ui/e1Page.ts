import fit from '../../data/fits/e1-walk.json';
import incline1 from '../../data/khuong2013/incline1.csv.gz?url';
import incline2 from '../../data/khuong2013/incline2.csv.gz?url';
import incline3 from '../../data/khuong2013/incline3.csv.gz?url';
import incline4 from '../../data/khuong2013/incline4.csv.gz?url';
import incline5 from '../../data/khuong2013/incline5.csv.gz?url';
import { summarize } from '../sim/analysis/trajectory';
import { walkParams, type WalkParams } from '../sim/models/walk';
import type { E1Request, E1Response, PlainTrack } from '../worker/e1Worker';
import E1Worker from '../worker/e1Worker?worker';
import { ecdf, lineChart } from './lineChart';

const INCLINES = [
  { label: '0° (flat)', rad: 0, url: incline1, role: 'fit' },
  { label: '20° (π/9)', rad: Math.PI / 9, url: incline2, role: 'validation' },
  { label: '30° (π/6)', rad: Math.PI / 6, url: incline3, role: 'fit' },
  { label: '45° (π/4)', rad: Math.PI / 4, url: incline4, role: 'validation' },
  { label: '60° (π/3)', rad: Math.PI / 3, url: incline5, role: 'fit' },
];

const PARAM_INFO: Record<string, [string, string]> = {
  speed: ['Median walking speed, flat, 26 °C', 'mm/s'],
  speedSdBetween: ['Between-ant SD of log speed', ''],
  speedSdWithin: ['Within-ant SD of log speed', ''],
  speedTau: ['Speed fluctuation correlation time', 's'],
  meanFreePath: ['Mean free path between reorientations', 'mm'],
  g: ['Mean cosine of reorientation angle', ''],
  jitter: ['Continuous heading diffusion', 'rad²/mm'],
  pauseRate: ['Pause rate (flat)', '1/s'],
  pauseMean: ['Mean pause duration', 's'],
  slopeSpeedK: ['Speed loss per rad of incline', '1/rad'],
  slopePauseK: ['Pause-rate increase per rad of incline (log)', '1/rad'],
  slopeJitterK: ['Jitter increase per rad of incline (log)', '1/rad'],
  slopeSpeedSdK: ['Speed variability increase per rad of incline (log)', '1/rad'],
  geoRunGain: ['Geomenotaxis: run-length gain along steepest line', '1/rad'],
  geoHeadingPull: ['Geomenotaxis: heading pull to steepest line', '1/rad'],
  homeRunBias: ['Homing: run-length bias towards start', ''],
  homeHeadingPull: ['Homing: heading pull towards start', ''],
  homeRange: ['Homing: distance over which the bias fades', 'mm'],
};

const PART_LABELS: Record<string, string> = {
  speedKS: 'Speed distribution (KS)',
  trackSpeedKS: 'Per-ant mean speed (KS)',
  stopped: 'Fraction of time stopped',
  headingCorrPath: 'Heading correlation vs path length',
  turnSd: 'Turn increment SD (0.2 s)',
  turnKurtosis: 'Turn increment kurtosis',
  exitKS: 'Time to leave 0.2 m circle (KS)',
  radial: 'Radial drift vs distance',
  align: 'Alignment with steepest line',
  straightness: 'Straightness over 50 mm',
};

export function renderE1(root: HTMLElement): () => void {
  root.textContent = '';
  const h = document.createElement('h2');
  h.textContent = 'E1 · Exploratory walking of isolated Lasius niger workers';
  h.style.margin = '0 0 4px';
  root.appendChild(h);
  const lede = document.createElement('p');
  lede.className = 'lede';
  lede.textContent =
    'Recorded trajectories (Khuong et al. 2013, PLoS ONE, CC BY 4.0: 69 ants per incline, 26 °C, 50 % RH) versus the walking model fitted on 0°, 30° and 60°. 20° and 45° are withheld for validation. Statistics are computed by the same code for both.';
  root.appendChild(lede);

  const bar = document.createElement('div');
  bar.className = 'toolbar';
  const sel = document.createElement('select');
  INCLINES.forEach((c, i) => {
    const o = document.createElement('option');
    o.value = String(i);
    o.textContent = `${c.label} — ${c.role}`;
    sel.appendChild(o);
  });
  const antsIn = Object.assign(document.createElement('input'), { type: 'number', value: '300', min: '20', max: '2000', step: '20' });
  const seedIn = Object.assign(document.createElement('input'), { type: 'number', value: '1', min: '1', step: '1' });
  const runBtn = Object.assign(document.createElement('button'), { className: 'primary', textContent: 'Run simulation' });
  const status = document.createElement('span');
  status.className = 'note';
  const lab = (t: string, e: HTMLElement) => {
    const l = document.createElement('label');
    l.append(t, e);
    return l;
  };
  bar.append(lab('Incline', sel), lab('Simulated ants', antsIn), lab('Seed', seedIn), runBtn, status);
  root.appendChild(bar);

  const grid = document.createElement('div');
  grid.className = 'grid';
  root.appendChild(grid);
  const left = document.createElement('div');
  const right = document.createElement('div');
  grid.append(left, right);

  // Arena
  const arenaCard = document.createElement('div');
  arenaCard.className = 'card';
  arenaCard.innerHTML = '<h2>Arena (0.2 m radius around the release point)</h2>';
  const legend = document.createElement('div');
  legend.className = 'legend';
  legend.innerHTML = '<span><span class="key" style="background:var(--series-data)"></span>Recorded ants</span><span><span class="key" style="background:var(--series-sim)"></span>Simulated ants</span>';
  arenaCard.appendChild(legend);
  const canvas = document.createElement('canvas');
  canvas.className = 'arena';
  arenaCard.appendChild(canvas);
  const playBar = document.createElement('div');
  playBar.className = 'toolbar';
  const showData = Object.assign(document.createElement('input'), { type: 'checkbox', checked: true });
  const showSim = Object.assign(document.createElement('input'), { type: 'checkbox', checked: true });
  const playBtn = Object.assign(document.createElement('button'), { className: 'primary', textContent: 'Pause' });
  const tLabel = document.createElement('span');
  tLabel.className = 'note';
  playBar.append(lab('Recorded', showData), lab('Simulated', showSim), playBtn, tLabel);
  arenaCard.appendChild(playBar);
  left.appendChild(arenaCard);

  const agreeCard = document.createElement('div');
  agreeCard.className = 'card';
  agreeCard.style.marginTop = '16px';
  left.appendChild(agreeCard);
  const paramCard = document.createElement('div');
  paramCard.className = 'card';
  paramCard.style.marginTop = '16px';
  left.appendChild(paramCard);
  renderParams(paramCard, walkParams(fit.params as Partial<WalkParams>));

  const charts = document.createElement('div');
  charts.className = 'charts';
  right.appendChild(charts);
  const slots = Array.from({ length: 4 }, () => {
    const d = document.createElement('div');
    charts.appendChild(d);
    return d;
  });

  const worker = new E1Worker();
  let result: E1Response | null = null;
  let playing = true;
  let playT = 0;
  let last = performance.now();
  let raf = 0;

  const run = () => {
    const c = INCLINES[Number(sel.value)];
    runBtn.disabled = true;
    status.textContent = 'Simulating…';
    root.style.opacity = '1';
    charts.style.opacity = '0.5';
    const req: E1Request = { dataUrl: c.url, incline: c.rad, ants: Number(antsIn.value), seed: Number(seedIn.value), dt: 0.02, params: walkParams(fit.params as Partial<WalkParams>) };
    worker.postMessage(req);
  };
  worker.onmessage = (ev: MessageEvent<E1Response>) => {
    result = ev.data;
    runBtn.disabled = false;
    charts.style.opacity = '1';
    status.textContent = `Done in ${(result.ms / 1000).toFixed(1)} s · overall discrepancy ${result.loss.toFixed(1)}`;
    playT = 0;
    renderCharts(slots, result);
    renderAgreement(agreeCard, result, INCLINES[Number(sel.value)].role);
  };
  runBtn.onclick = run;
  sel.onchange = run;
  playBtn.onclick = () => {
    playing = !playing;
    playBtn.textContent = playing ? 'Pause' : 'Play';
  };

  const draw = () => {
    const now = performance.now();
    if (playing) playT += ((now - last) / 1000) * 2;
    last = now;
    const dpr = window.devicePixelRatio || 1;
    const size = canvas.clientWidth;
    if (canvas.width !== Math.round(size * dpr)) {
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
    }
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const css = getComputedStyle(document.documentElement);
    const scale = (canvas.width / 2 - 8 * dpr) / 210;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.strokeStyle = css.getPropertyValue('--axis');
    ctx.lineWidth = dpr;
    ctx.beginPath();
    ctx.arc(0, 0, 200 * scale, 0, Math.PI * 2);
    ctx.stroke();
    if (result) {
      const maxT = Math.max(...result.data.tracks.map((t) => t.t[t.t.length - 1]), ...result.sim.tracks.map((t) => t.t[t.t.length - 1]));
      if (playT > maxT + 5) playT = 0;
      tLabel.textContent = `t = ${playT.toFixed(0)} s (2× speed)`;
      const drawSet = (tracks: PlainTrack[], color: string) => {
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.25;
        ctx.lineWidth = dpr;
        for (const t of tracks) {
          ctx.beginPath();
          for (let i = 0; i < t.t.length && t.t[i] <= playT; i++) {
            const x = t.x[i] * scale;
            const y = -t.y[i] * scale;
            if (i) ctx.lineTo(x, y);
            else ctx.moveTo(x, y);
          }
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = color;
        for (const t of tracks) {
          let i = 0;
          while (i < t.t.length - 1 && t.t[i + 1] <= playT) i++;
          if (t.t[t.t.length - 1] < playT) continue;
          ctx.beginPath();
          ctx.arc(t.x[i] * scale, -t.y[i] * scale, 2.5 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      };
      if (showData.checked) drawSet(result.data.tracks, css.getPropertyValue('--series-data'));
      if (showSim.checked) drawSet(result.sim.tracks, css.getPropertyValue('--series-sim'));
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

function renderCharts(slots: HTMLElement[], r: E1Response): void {
  const D = 'var(--series-data)';
  const S = 'var(--series-sim)';
  const sd = ecdf(r.data.stats.speeds);
  const ss = ecdf(r.sim.stats.speeds);
  lineChart(slots[0], [
    { name: 'Recorded', color: D, ...sd },
    { name: 'Simulated', color: S, ...ss },
  ], { title: 'Walking speed (cumulative distribution)', xLabel: 'speed (mm/s)', yLabel: 'fraction ≤ x', yMin: 0, yMax: 1, xFormat: (v) => v.toFixed(0) });
  lineChart(slots[1], [
    { name: 'Recorded', color: D, x: r.data.stats.pathLags, y: r.data.stats.headingCorrPath },
    { name: 'Simulated', color: S, x: r.sim.stats.pathLags, y: r.sim.stats.headingCorrPath },
  ], { title: 'Heading persistence vs distance walked', xLabel: 'path length (mm)', yLabel: '⟨cos Δθ⟩', yMin: -0.1, yMax: 1, refY: 0, xFormat: (v) => v.toFixed(0) });
  lineChart(slots[2], [
    { name: 'Recorded', color: D, x: r.data.stats.radialBins.map((b) => b - 10), y: r.data.stats.radialVelocity },
    { name: 'Simulated', color: S, x: r.sim.stats.radialBins.map((b) => b - 10), y: r.sim.stats.radialVelocity },
  ], { title: 'Radial drift (− = back towards start)', xLabel: 'distance from start (mm)', yLabel: 'mm/s', refY: 0, xFormat: (v) => v.toFixed(0) });
  const ed = ecdf(r.data.stats.exitTimes);
  const es = ecdf(r.sim.stats.exitTimes);
  lineChart(slots[3], [
    { name: 'Recorded', color: D, ...ed },
    { name: 'Simulated', color: S, ...es },
  ], { title: 'Time to leave the 0.2 m circle', xLabel: 'time (s)', yLabel: 'fraction ≤ x', yMin: 0, yMax: 1, xFormat: (v) => v.toFixed(0) });
}

function renderAgreement(card: HTMLElement, r: E1Response, role: string): void {
  card.textContent = '';
  const h = document.createElement('h2');
  h.textContent = 'Agreement with data ';
  const b = document.createElement('span');
  b.className = `badge ${role}`;
  b.textContent = role === 'validation' ? 'withheld (validation)' : 'used for fitting';
  h.appendChild(b);
  card.appendChild(h);
  const note = document.createElement('p');
  note.className = 'note';
  note.textContent = 'Each score is the squared discrepancy in units of the data’s own sampling uncertainty: ≤ 4 is within ~2 SE.';
  card.appendChild(note);
  const t = document.createElement('table');
  t.className = 'params';
  for (const [k, v] of Object.entries(r.parts)) {
    const tr = document.createElement('tr');
    const name = document.createElement('td');
    name.textContent = PART_LABELS[k] ?? k;
    const val = document.createElement('td');
    val.className = 'num';
    val.textContent = v.toFixed(2);
    const st = document.createElement('td');
    const ok = v <= 4;
    const warn = v <= 9;
    st.className = ok ? 'status-ok' : warn ? 'status-warn' : 'status-bad';
    st.textContent = ok ? '✓ within' : warn ? '~ marginal' : '✗ off';
    tr.append(name, val, st);
    t.appendChild(tr);
  }
  card.appendChild(t);
  const sd = summarize(r.data.stats.speeds);
  const ss = summarize(r.sim.stats.speeds);
  const p = document.createElement('p');
  p.className = 'note';
  p.textContent = `Median speed: recorded ${sd.q50.toFixed(1)} mm/s, simulated ${ss.q50.toFixed(1)} mm/s. Stopped: ${(r.data.stats.stoppedFraction * 100).toFixed(1)} % vs ${(r.sim.stats.stoppedFraction * 100).toFixed(1)} %.`;
  card.appendChild(p);
}

function renderParams(card: HTMLElement, p: WalkParams): void {
  card.textContent = '';
  const h = document.createElement('h2');
  h.textContent = 'Fitted walking parameters (provenance: fitted to Khuong et al. 2013, E1)';
  card.appendChild(h);
  const t = document.createElement('table');
  t.className = 'params';
  for (const [k, v] of Object.entries(p)) {
    const tr = document.createElement('tr');
    const [label, unit] = PARAM_INFO[k] ?? [k, ''];
    const a = document.createElement('td');
    a.textContent = label;
    const b = document.createElement('td');
    b.className = 'num';
    b.textContent = `${Number(v).toPrecision(3)} ${unit}`;
    tr.append(a, b);
    t.appendChild(tr);
  }
  card.appendChild(t);
  const n = document.createElement('p');
  n.className = 'note';
  n.textContent = `Fit: ${fit.fittedOn.join(', ')}; validated on ${fit.validatedOn.join(', ')}. Regenerate with npx vite-node scripts/fitE1.ts.`;
  card.appendChild(n);
}
