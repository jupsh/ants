/**
 * Step-4b diagnosis (STATUS 2026-10-15): is the heavy tail of still runs in
 * the Stroeymeyt fit colonies between ants or within ants? Streams every fit
 * colony's tracks through the in-nest accumulator three ways: the colony
 * (as the rows), one accumulator per ant, and one per ant and time block
 * (`--block` s, aligned to UTC so blocks stay inside a phase; runs crossing
 * a block edge are lost there). For each, still runs from a base duration
 * on get a geometric excess with that unit's own mean, and the expected
 * number of runs ≥ D is compared with the observed one:
 *   - one rate per colony × group: the fitted model's structure;
 *   - one rate per ant: a per-ant trait would explain the tail if this fits;
 *   - one rate per ant and block: slow drift of each ant's activity.
 * Observed ≫ predicted under per-ant rates means each ant's own rests are
 * heavy-tailed, which no per-ant rate can produce.
 *
 *   npx vite-node scripts/diagS2018Runs.ts [--block 7200] [--out logs/diagS2018Runs.json]
 *
 * Fit colonies only (data role: fit); never reads held-out files.
 */
import { GROUPS, InNestAccumulator, PHASES, STROEYMEYT_CFG, type AntRole, type Group, type Phase, type RunHist } from '../src/sim/analysis/inNest';
import { arg, numArg, provenance, writeJson } from './lib';
import { colonies, roles, streamColony } from './stroeymeytTracks';

const BLOCK = numArg('--block', 7200);
const OUT = arg('--out', 'logs/diagS2018Runs.json');
const CFG = STROEYMEYT_CFG;
const FRAME = CFG.frameDt;
const BASES = [2, 10];
const DS = [10, 30, 60, 120, 300];
const ZEROS = new Array(64).fill(0);

interface Unit { colony: string; tag: number; group: Group; phase: Phase; block: number | null; hist: RunHist }
const cellKey = (g: Group, p: Phase) => `${g}.${p}` as const;

const colonyUnits: Unit[] = [];
const antUnits: Unit[] = [];
const blockUnits: Unit[] = [];
const t0 = Date.now();
for (const col of colonies()) {
  const roleOf = roles(col);
  const tags = [...roleOf.keys()];
  const index = new Map(tags.map((t, i) => [t, i]));
  const roleArr: AntRole[] = tags.map((t) => roleOf.get(t)!);
  const colonyAcc = new InNestAccumulator(roleArr, CFG);
  const antAcc = roleArr.map((r) => (r === 'queen' ? null : new InNestAccumulator([r], CFG)));
  const blockAcc = roleArr.map(() => new Map<number, InNestAccumulator>());
  const bx: number[][] = roleArr.map(() => []);
  const by: number[][] = roleArr.map(() => []);
  const bin: boolean[][] = roleArr.map(() => []);
  const touched: number[] = [];
  await streamColony(col, index, (frame, t, ids, xs, ys, ins) => {
    const h = (t / 3600) % 24;
    colonyAcc.frame(frame, h, ids.length, ids, xs, ys, ins);
    // Each ant's reads of this frame (repeated reads included, as the colony accumulator sees them).
    touched.length = 0;
    for (let j = 0; j < ids.length; j++) {
      const i = ids[j];
      if (!antAcc[i]) continue;
      if (!bx[i].length) touched.push(i);
      bx[i].push(xs[j]);
      by[i].push(ys[j]);
      bin[i].push(ins[j]);
    }
    const b = Math.floor(t / BLOCK);
    for (const i of touched) {
      const n = bx[i].length;
      antAcc[i]!.frame(frame, h, n, ZEROS, bx[i], by[i], bin[i]);
      let a = blockAcc[i].get(b);
      if (!a) blockAcc[i].set(b, (a = new InNestAccumulator([roleArr[i]], CFG)));
      a.frame(frame, h, n, ZEROS, bx[i], by[i], bin[i]);
      bx[i].length = by[i].length = bin[i].length = 0;
    }
  });
  const colRes = colonyAcc.result();
  const sums: Record<string, RunHist> = {};
  for (const g of GROUPS) for (const p of PHASES) colonyUnits.push({ colony: col.label, tag: -1, group: g, phase: p, block: null, hist: colRes.motion[cellKey(g, p)].runsStill[0] });
  roleArr.forEach((r, i) => {
    if (r === 'queen') return;
    const g = r as Group;
    const res = antAcc[i]!.result();
    for (const p of PHASES) {
      const hist = res.motion[cellKey(g, p)].runsStill[0];
      antUnits.push({ colony: col.label, tag: tags[i], group: g, phase: p, block: null, hist });
      const s = (sums[cellKey(g, p)] ??= []);
      hist.forEach((c, f) => (s[f] = (s[f] ?? 0) + (c || 0)));
    }
    for (const [b, a] of blockAcc[i]) {
      const res = a.result();
      for (const p of PHASES) {
        const hist = res.motion[cellKey(g, p)].runsStill[0];
        if (hist.length) blockUnits.push({ colony: col.label, tag: tags[i], group: g, phase: p, block: b, hist });
      }
    }
  });
  // Per-ant accumulators must add up to the colony's (same code, same frames).
  for (const g of GROUPS)
    for (const p of PHASES) {
      const a = colRes.motion[cellKey(g, p)].runsStill[0];
      const s = sums[cellKey(g, p)] ?? [];
      const len = Math.max(a.length, s.length);
      for (let f = 0; f < len; f++) if ((a[f] || 0) !== (s[f] || 0)) throw new Error(`${col.label} ${g}.${p}: per-ant runs do not add up to the colony's at ${f} frames`);
    }
  console.log(`${col.label}: ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}

/** Runs ≥ base and their mean excess (frames); expected and observed runs ≥ d under a geometric excess. */
function tail(h: RunHist, bF: number, dF: number): { obs: number; pred: number } {
  let n = 0;
  let ex = 0;
  let obs = 0;
  for (let f = bF; f < h.length; f++) {
    const c = h[f] || 0;
    n += c;
    ex += c * (f - bF);
    if (f >= dF) obs += c;
  }
  if (!n) return { obs, pred: 0 };
  const m = ex / n;
  return { obs, pred: n * (m / (m + 1)) ** (dF - bF) };
}

const variants = { colony: colonyUnits, ant: antUnits, antBlock: blockUnits } as const;
const results: Record<string, unknown>[] = [];
for (const g of GROUPS)
  for (const p of PHASES)
    for (const base of BASES) {
      const bF = Math.round(base / FRAME);
      console.log(`\n${g}.${p}, runs from ${base} s: observed runs ≥ D vs expected (ratio obs/exp)`);
      console.log(['D (s)', 'observed', 'colony rate', 'ant rate', `ant × ${BLOCK / 3600} h rate`, 'ant-rate log ratio, colony mean ± SE'].join('\t'));
      for (const D of DS) {
        if (D <= base) continue;
        const dF = Math.round(D / FRAME);
        const row: Record<string, unknown> = { group: g, phase: p, base, D };
        const cells: string[] = [`${D}`];
        for (const [name, units] of Object.entries(variants)) {
          let obs = 0;
          let pred = 0;
          for (const u of units) {
            if (u.group !== g || u.phase !== p) continue;
            const r = tail(u.hist, bF, dF);
            obs += r.obs;
            pred += r.pred;
          }
          row[name] = { obs, pred, ratio: obs / pred };
          if (name === 'colony') cells.push(`${obs}`);
          cells.push(`${pred.toFixed(1)} (${(obs / pred).toFixed(2)})`);
        }
        // Colony blocks for the per-ant variant: log(obs/exp) per colony.
        const per = new Map<string, { obs: number; pred: number }>();
        for (const u of antUnits) {
          if (u.group !== g || u.phase !== p) continue;
          const r = tail(u.hist, bF, dF);
          const c = per.get(u.colony) ?? { obs: 0, pred: 0 };
          c.obs += r.obs;
          c.pred += r.pred;
          per.set(u.colony, c);
        }
        const lr = [...per.values()].filter((c) => c.obs > 0 && c.pred > 0).map((c) => Math.log(c.obs / c.pred));
        const m = lr.reduce((a, b) => a + b, 0) / lr.length;
        const se = Math.sqrt(lr.reduce((a, b) => a + (b - m) ** 2, 0) / (lr.length - 1) / lr.length);
        row.antLogRatio = { mean: m, se, colonies: lr.length };
        cells.push(`${m.toFixed(2)} ± ${se.toFixed(2)} (${lr.length} col.)`);
        console.log(cells.join('\t'));
        results.push(row);
      }
    }

// Per-ant rates (mean excess over 2 s), for sizing a trait: spread of log mean excess across ants with enough runs.
const perAnt = antUnits.map((u) => {
  const bF = Math.round(2 / FRAME);
  let n = 0;
  let ex = 0;
  for (let f = bF; f < u.hist.length; f++) {
    n += u.hist[f] || 0;
    ex += (u.hist[f] || 0) * (f - bF);
  }
  return { colony: u.colony, tag: u.tag, group: u.group, phase: u.phase, n2: n, meanExcess2: n ? (ex / n) * FRAME : NaN };
});
console.log('\nPer-ant mean excess over 2 s (s), ants with ≥ 30 runs ≥ 2 s: median, SD of log (sampling noise included)');
for (const g of GROUPS)
  for (const p of PHASES) {
    const v = perAnt.filter((a) => a.group === g && a.phase === p && a.n2 >= 30).map((a) => a.meanExcess2);
    const lv = v.map(Math.log);
    const lm = lv.reduce((a, b) => a + b, 0) / lv.length;
    const lsd = Math.sqrt(lv.reduce((a, b) => a + (b - lm) ** 2, 0) / (lv.length - 1));
    const sorted = [...v].sort((a, b) => a - b);
    console.log(`${g}.${p}: ${v.length} ants, median ${sorted[sorted.length >> 1].toFixed(2)} s, SD log ${lsd.toFixed(2)}`);
  }

writeJson(OUT, {
  study: 'Step 4b: between- vs within-ant still-run tails, Stroeymeyt 2018 fit colonies (STATUS 2026-10-15)',
  config: { block: BLOCK, bases: BASES, D: DS, threshold: CFG.stillMm[0], frameDt: FRAME },
  results,
  perAnt,
  seconds: (Date.now() - t0) / 1000,
  provenance: provenance(),
});
console.log(`\nwrote ${OUT}`);
