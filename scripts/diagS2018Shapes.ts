/**
 * Step-4b diagnosis (STATUS 2026-10-15): which rest-duration shape fits the
 * Stroeymeyt fit colonies' still runs, ant by ant? Follows
 * `diagS2018Runs.ts` (rests are heavy-tailed within each ant). Still runs
 * from a base duration on; the excess k (frames) is fitted by discretised
 * continuous families, P(k) = S(k) − S(k + 1):
 *   exp     S = e^(−λx)                               (geometric; 1 parameter)
 *   mix2    S = π e^(−λ₁x) + (1 − π) e^(−λ₂x)         (light and deep rest; 3)
 *   lomax   S = (1 + x/σ)^(−α)                        (rate redrawn per rest from a gamma; 2)
 *   weibull S = e^(−(x/σ)^c)                          (2)
 * under three structures: one parameter set per colony × group (`colony`,
 * as the fitted model), all parameters per ant (`ant`), and a shape shared
 * by all ants of a group with a per-ant time scale (`antScale`: what a
 * per-ant trait on top of a shared rest process gives). Reports −2 log L,
 * BIC and observed / expected runs ≥ D. Observed runs pass through the
 * tracking observer and include walking pauses: shapes, not parameters.
 *
 *   npx vite-node scripts/diagS2018Shapes.ts [--out logs/diagS2018Shapes.json]
 *
 * Fit colonies only (data role: fit). Per-ant run histograms are cached in
 * `logs/s2018-antRuns.json` (delete it to re-read the tracks).
 */
import fs from 'node:fs';
import { GROUPS, InNestAccumulator, PHASES, STROEYMEYT_CFG, type AntRole, type Group, type Phase, type RunHist } from '../src/sim/analysis/inNest';
import { nelderMead } from '../src/sim/analysis/optimize';
import { arg, provenance, writeJson } from './lib';
import { colonies, roles, streamColony } from './stroeymeytTracks';

const OUT = arg('--out', 'logs/diagS2018Shapes.json');
const CACHE = 'logs/s2018-antRuns.json';
const CFG = STROEYMEYT_CFG;
const FRAME = CFG.frameDt;
const BASES = [2, 10];
const DS = [10, 30, 60, 120, 300];
const ZEROS = new Array(64).fill(0);
const t0 = Date.now();

/** One ant × phase: complete still runs (primary threshold) as sparse [frames, count] pairs. */
interface AntRuns { colony: string; tag: number; group: Group; phase: Phase; runs: [number, number][] }

async function readTracks(): Promise<AntRuns[]> {
  const out: AntRuns[] = [];
  for (const col of colonies()) {
    const roleOf = roles(col);
    const tags = [...roleOf.keys()];
    const index = new Map(tags.map((t, i) => [t, i]));
    const roleArr: AntRole[] = tags.map((t) => roleOf.get(t)!);
    const acc = roleArr.map((r) => (r === 'queen' ? null : new InNestAccumulator([r], CFG)));
    const bx: number[][] = roleArr.map(() => []);
    const by: number[][] = roleArr.map(() => []);
    const bin: boolean[][] = roleArr.map(() => []);
    const touched: number[] = [];
    await streamColony(col, index, (frame, t, ids, xs, ys, ins) => {
      touched.length = 0;
      for (let j = 0; j < ids.length; j++) {
        const i = ids[j];
        if (!acc[i]) continue;
        if (!bx[i].length) touched.push(i);
        bx[i].push(xs[j]);
        by[i].push(ys[j]);
        bin[i].push(ins[j]);
      }
      for (const i of touched) {
        acc[i]!.frame(frame, (t / 3600) % 24, bx[i].length, ZEROS, bx[i], by[i], bin[i]);
        bx[i].length = by[i].length = bin[i].length = 0;
      }
    });
    roleArr.forEach((r, i) => {
      if (r === 'queen') return;
      const res = acc[i]!.result();
      for (const p of PHASES) {
        const h: RunHist = res.motion[`${r}.${p}`].runsStill[0];
        const runs: [number, number][] = [];
        h.forEach((c, f) => c && runs.push([f, c]));
        out.push({ colony: col.label, tag: tags[i], group: r, phase: p, runs });
      }
    });
    console.log(`${col.label}: ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  return out;
}

const ants: AntRuns[] = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')).ants : await readTracks();
if (!fs.existsSync(CACHE)) writeJson(CACHE, { note: 'Per-ant still-run histograms, Stroeymeyt 2018 fit colonies (scripts/diagS2018Shapes.ts)', provenance: provenance(), ants });

/** Excess over the base (frames) and counts of one unit's runs ≥ base. */
interface Unit { colony: string; k: number[]; c: number[]; n: number }
const unitOf = (colony: string, runs: [number, number][], bF: number): Unit => {
  const k: number[] = [];
  const c: number[] = [];
  let n = 0;
  for (const [f, cnt] of runs)
    if (f >= bF) {
      k.push(f - bF);
      c.push(cnt);
      n += cnt;
    }
  return { colony, k, c, n };
};
const merge = (rs: [number, number][][]): [number, number][] => {
  const m = new Map<number, number>();
  for (const r of rs) for (const [f, c] of r) m.set(f, (m.get(f) ?? 0) + c);
  return [...m].sort((a, b) => a[0] - b[0]);
};

type Surv = (x: number) => number;
const negLL = (S: Surv, u: Unit) => {
  let s = 0;
  for (let i = 0; i < u.k.length; i++) s -= u.c[i] * Math.log(Math.max(S(u.k[i]) - S(u.k[i] + 1), 1e-300));
  return s;
};
const mean = (u: Unit) => u.k.reduce((a, k, i) => a + k * u.c[i], 0) / u.n;
/** Geometric with mean m (frames) as a survival in rate form: λ = ln(1 + 1/m). */
const rateOf = (m: number) => Math.log1p(1 / Math.max(m, 1e-9));

interface Family {
  name: string;
  /** Parameters per unit when all are free. */
  p: number;
  /** Survival from free parameters (unconstrained). */
  surv: (x: number[]) => Surv;
  /** Start of the free parameters for a unit. */
  start: (u: Unit) => number[];
  /** Shared-shape split: the index of the scale parameter (per ant); the rest are shared. */
  scale: number;
}
const sigmoid = (t: number) => 1 / (1 + Math.exp(-t));
const FAMILIES: Family[] = [
  { name: 'exp', p: 1, surv: ([lm]) => { const l = rateOf(Math.exp(lm)); return (x) => Math.exp(-l * x); }, start: (u) => [Math.log(Math.max(mean(u), 0.1))], scale: 0 },
  {
    name: 'mix2',
    p: 3,
    // [log m₁, logit π, log(m₂/m₁ − 1)]: light rests of mean m₁ with weight π, deep rests of mean m₂ > m₁.
    surv: ([lm, tp, tr]) => {
      const m1 = Math.exp(lm);
      const l1 = rateOf(m1);
      const l2 = rateOf(m1 * (1 + Math.exp(tr)));
      const pi = sigmoid(tp);
      return (x) => pi * Math.exp(-l1 * x) + (1 - pi) * Math.exp(-l2 * x);
    },
    start: (u) => [Math.log(Math.max(mean(u) / 4, 0.1)), 1, Math.log(10)],
    scale: 0,
  },
  { name: 'lomax', p: 2, surv: ([ls, la]) => { const s = Math.exp(ls); const a = Math.exp(la); return (x) => Math.pow(1 + x / s, -a); }, start: (u) => [Math.log(Math.max(mean(u), 0.1)), 0], scale: 0 },
  { name: 'weibull', p: 2, surv: ([ls, lc]) => { const s = Math.exp(ls); const c = Math.exp(lc); return (x) => Math.exp(-Math.pow(x / s, c)); }, start: (u) => [Math.log(Math.max(mean(u), 0.1)), Math.log(0.7)], scale: 0 },
];

/** Best of a Nelder–Mead fit from the start and a refit from its optimum. */
async function fitFree(f: Family, u: Unit): Promise<{ x: number[]; nll: number }> {
  if (f.name === 'exp') {
    const x = [Math.log(Math.max(mean(u), 1e-6))];
    return { x, nll: negLL(f.surv(x), u) };
  }
  const obj = (x: number[]) => negLL(f.surv(x), u);
  let r = await nelderMead(obj, f.start(u), 0.5, 600, 1e-7);
  r = await nelderMead(obj, r.x, 0.2, 600, 1e-8);
  return { x: r.x, nll: r.f };
}

/** Golden-section minimum of a 1-D function on [a, b]. */
function golden(fn: (t: number) => number, a: number, b: number, tol = 1e-4): { t: number; f: number } {
  const g = (Math.sqrt(5) - 1) / 2;
  let c = b - g * (b - a);
  let d = a + g * (b - a);
  let fc = fn(c);
  let fd = fn(d);
  while (b - a > tol) {
    if (fc < fd) {
      b = d;
      d = c;
      fd = fc;
      c = b - g * (b - a);
      fc = fn(c);
    } else {
      a = c;
      c = d;
      fc = fd;
      d = a + g * (b - a);
      fd = fn(d);
    }
  }
  return fc < fd ? { t: c, f: fc } : { t: d, f: fd };
}

/** Shared shape (all parameters but the scale) over units, scale per unit. */
async function fitShared(f: Family, units: Unit[], shared0: number[]): Promise<{ shared: number[]; scales: number[]; nll: number }> {
  const scales = units.map((u) => Math.log(Math.max(mean(u), 0.1)));
  const full = (sh: number[], s: number) => {
    const x = [...sh];
    x.splice(f.scale, 0, s);
    return x;
  };
  const inner = (sh: number[]) => {
    let tot = 0;
    units.forEach((u, i) => {
      const r = golden((s) => negLL(f.surv(full(sh, s)), u), scales[i] - 4, scales[i] + 4, 1e-3);
      scales[i] = r.t;
      tot += r.f;
    });
    return tot;
  };
  let r = await nelderMead(inner, shared0, 0.4, 120, 1e-6);
  r = await nelderMead(inner, r.x, 0.15, 80, 1e-7);
  const nll = inner(r.x);
  return { shared: r.x, scales, nll };
}

const results: Record<string, unknown>[] = [];
for (const g of GROUPS)
  for (const p of PHASES)
    for (const base of BASES) {
      const bF = Math.round(base / FRAME);
      const mine = ants.filter((a) => a.group === g && a.phase === p);
      const antUnits = mine.map((a) => unitOf(a.colony, a.runs, bF)).filter((u) => u.n > 0);
      const colUnits = [...new Set(mine.map((a) => a.colony))].map((c) => unitOf(c, merge(mine.filter((a) => a.colony === c).map((a) => a.runs)), bF)).filter((u) => u.n > 0);
      const N = antUnits.reduce((a, u) => a + u.n, 0);
      const obsAt = DS.filter((D) => D > base).map((D) => antUnits.reduce((a, u) => a + u.k.reduce((s, k, i) => s + (k >= Math.round(D / FRAME) - bF ? u.c[i] : 0), 0), 0));
      const expAt = (pairs: { S: Surv; n: number }[]) => DS.filter((D) => D > base).map((D) => pairs.reduce((a, { S, n }) => a + n * S(Math.round(D / FRAME) - bF), 0));
      console.log(`\n${g}.${p}, runs from ${base} s: ${antUnits.length} ants, ${colUnits.length} colonies, ${N} runs (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
      console.log(['structure', 'family', 'params', '−2 log L', 'ΔBIC', ...DS.filter((D) => D > base).map((D) => `≥${D} s obs/exp`), 'shared shape'].join('\t'));
      const rows: { structure: string; family: string; k: number; m2ll: number; bic: number; ratios: number[]; shape: string; shared?: number[] }[] = [];
      for (const f of FAMILIES) {
        // One parameter set per colony × group.
        const cf = await Promise.all(colUnits.map((u) => fitFree(f, u)));
        rows.push({ structure: 'colony', family: f.name, k: f.p * colUnits.length, m2ll: 2 * cf.reduce((a, r) => a + r.nll, 0), bic: 0, ratios: expAt(cf.map((r, i) => ({ S: f.surv(r.x), n: colUnits[i].n }))).map((e, i) => obsAt[i] / e), shape: '' });
        // All parameters per ant.
        const af = [];
        for (const u of antUnits) af.push(await fitFree(f, u));
        rows.push({ structure: 'ant', family: f.name, k: f.p * antUnits.length, m2ll: 2 * af.reduce((a, r) => a + r.nll, 0), bic: 0, ratios: expAt(af.map((r, i) => ({ S: f.surv(r.x), n: antUnits[i].n }))).map((e, i) => obsAt[i] / e), shape: '' });
        // Shared shape, per-ant scale (exp: same as per ant).
        if (f.p > 1) {
          const sh0 = cf.length ? cf[0].x.filter((_, i) => i !== f.scale) : f.start(antUnits[0]).filter((_, i) => i !== f.scale);
          const r = await fitShared(f, antUnits, sh0);
          const full = (s: number) => {
            const x = [...r.shared];
            x.splice(f.scale, 0, s);
            return x;
          };
          const shape =
            f.name === 'mix2'
              ? `π light ${sigmoid(r.shared[0]).toFixed(2)}, deep/light mean ×${(1 + Math.exp(r.shared[1])).toFixed(1)}`
              : f.name === 'lomax'
                ? `α ${Math.exp(r.shared[0]).toFixed(2)}`
                : `c ${Math.exp(r.shared[0]).toFixed(2)}`;
          rows.push({ structure: 'antScale', family: f.name, k: f.p - 1 + antUnits.length, m2ll: 2 * r.nll, bic: 0, ratios: expAt(r.scales.map((s, i) => ({ S: f.surv(full(s)), n: antUnits[i].n }))).map((e, i) => obsAt[i] / e), shape, shared: r.shared });
        }
      }
      for (const r of rows) r.bic = r.m2ll + r.k * Math.log(N);
      const best = Math.min(...rows.map((r) => r.bic));
      for (const r of rows) console.log([r.structure.padEnd(8), r.family.padEnd(7), r.k, r.m2ll.toFixed(0), (r.bic - best).toFixed(0), ...r.ratios.map((x) => x.toFixed(2)), r.shape].join('\t'));
      results.push({ group: g, phase: p, base, ants: antUnits.length, colonies: colUnits.length, runs: N, observed: obsAt, rows });
    }

writeJson(OUT, {
  study: 'Step 4b: rest-duration shapes per ant, Stroeymeyt 2018 fit colonies (STATUS 2026-10-15)',
  config: { bases: BASES, D: DS, threshold: CFG.stillMm[0], frameDt: FRAME },
  results,
  seconds: (Date.now() - t0) / 1000,
  provenance: provenance(),
});
console.log(`\nwrote ${OUT} (${((Date.now() - t0) / 60000).toFixed(1)} min)`);
