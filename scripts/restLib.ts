/**
 * Across-colony summaries and the fixed readings of D076 (per-ant activity vs rest position), shared by the data
 * side (`stroeymeytRestPosition.ts`) and the model side. Pure; scripts only (outside simHash).
 */
import { GROUPS, type Group } from '../src/sim/analysis/inNest';
import { MODEL_NEST, REST_G, restColony, restPosition, restWindow, shareSpatial, SiteField, sumCounts, type RestColony, type RestWindow } from '../src/sim/analysis/restPosition';
import { RNG } from '../src/sim/core/rng';
import type { RestWindowData } from '../src/sim/experiments/colonyStroeymeyt';

export interface Est {
  est: number;
  lo: number;
  hi: number;
  /** Bootstrap SD (the SE used in D076's model-vs-data z). */
  se: number;
  n: number;
}

/** Colony bootstrap (percentile 95 % CI, SD as SE), seeded so reruns agree. */
export function bootstrap<T>(per: T[], stat: (s: T[]) => number, B = 2000, seed = 76): Est {
  const rng = new RNG(seed);
  const est = stat(per);
  const v: number[] = [];
  for (let b = 0; b < B; b++) {
    const x = stat(per.map(() => per[rng.int(per.length)]));
    if (Number.isFinite(x)) v.push(x);
  }
  v.sort((a, b) => a - b);
  const m = v.reduce((a, b) => a + b, 0) / v.length;
  const se = Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / (v.length - 1));
  return { est, lo: v[Math.floor(0.025 * v.length)], hi: v[Math.floor(0.975 * v.length)], se, n: per.length };
}

const mean = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;

export interface GroupSummary {
  S: Est;
  zFull: Est;
  zPart: Est;
  zE: Est;
  /** Colonies behind S / zFull / zPart (both defined) and behind zE. */
  coloniesZ: number;
  coloniesE: number;
  /** Ants dropped for lacking a rest position, summed over colonies and windows. */
  droppedZ: number;
  droppedE: number;
}

/** One group's summary over its colony values (D076). */
export function summarise(cols: RestColony[], seed = 76): GroupSummary {
  const z = cols.filter((c) => Number.isFinite(c.zFull) && Number.isFinite(c.zPart));
  const e = cols.filter((c) => Number.isFinite(c.zE));
  return {
    S: bootstrap(z, shareSpatial, 2000, seed),
    zFull: bootstrap(z, (s) => mean(s.map((c) => c.zFull)), 2000, seed),
    zPart: bootstrap(z, (s) => mean(s.map((c) => c.zPart)), 2000, seed),
    zE: bootstrap(e, (s) => mean(s.map((c) => c.zE)), 2000, seed),
    coloniesZ: z.length,
    coloniesE: e.length,
    droppedZ: cols.reduce((a, c) => a + c.nZNoR, 0),
    droppedE: cols.reduce((a, c) => a + c.nENoR, 0),
  };
}

/** D076 data-side readings, mechanically. */
export function readData(g: GroupSummary): { persistence: string; level: string } {
  const S = g.S;
  const persistence =
    S.est >= 0.5 && S.lo >= 0.25 ? 'persistence mostly shared with rest position' : S.hi < 0.25 ? 'persistence mostly not spatial' : 'partly spatial';
  const level = g.zE.lo > 0 || g.zE.hi < 0 ? 'activity level varies with rest position' : 'no detectable link';
  return { persistence, level };
}

/** z = (sim − data) / √(SE_data² + SE_sim²). */
export const combZ = (sim: Est, data: Est) => (sim.est - data.est) / Math.hypot(sim.se, data.se);

/** D076 model-vs-data readings, mechanically (data reading from `readData`). */
export function readModel(sim: GroupSummary, data: GroupSummary): { zS: number; zPart: number; zE: number; reading: string } {
  const zS = combZ(sim.S, data.S);
  const dataRead = readData(data).persistence;
  let reading: string;
  if (Math.abs(zS) <= 2) reading = 'reproduces how much of the persistence is spatial';
  else if (zS <= -2 && dataRead !== 'persistence mostly not spatial') reading = 'carries as per-ant activity what the data share with rest position';
  else if (zS >= 2) reading = "persistence more spatial than the data's";
  else reading = 'less spatial than the data, which read "mostly not spatial" (no reading assigned by D076)';
  return { zS, zPart: combZ(sim.zPart, data.zPart), zE: combZ(sim.zE, data.zE), reading };
}

/** Simulated side (D076): per run, one activity window's per-ant data (`StroeymeytRun.restWindows[0]`). */
export function modelRestWindows(
  runs: { restWindows?: RestWindowData[] }[],
  labels: string[],
): { colony: string; runs: Record<Group, RestWindow>[] }[] {
  const byColony = new Map<string, number[]>();
  labels.forEach((l, i) => byColony.set(l, [...(byColony.get(l) ?? []), i]));
  const all = (w: RestWindowData) => [...w.groups.nurse, ...w.groups.forager];
  const dense = (cells: Record<number, number>) => {
    const g = new Float64Array(REST_G);
    for (const [q, n] of Object.entries(cells)) g[Number(q)] += n;
    return g;
  };
  return [...byColony].map(([colony, idx]) => ({
    colony,
    runs: idx.map((i) => {
      const w = runs[i].restWindows?.[0];
      if (!w) throw new Error(`run ${i} (${colony}): no restWindows (run without --rest?)`);
      // Site field from the same colony's other runs (the focal run left out), every worker, on the model nest.
      const others = idx.filter((j) => j !== i).flatMap((j) => all(runs[j].restWindows![0]).map((a) => dense(a.rest)));
      const E = new SiteField(sumCounts(others), MODEL_NEST).field(null);
      const out = {} as Record<Group, RestWindow>;
      for (const g of GROUPS) {
        const ants = w.groups[g];
        const R = ants.map((a) => restPosition(a.act, { [w.hours[0]]: a.rest }, w.hours, E));
        out[g] = restWindow(
          ants.map((a) => a.act),
          R,
          w.hours,
        );
      }
      return out;
    }),
  }));
}

/**
 * One group's simulated summary: colony values = `restColony` over the colony's runs (each run one window), then
 * as `summarise`; SE_sim and the CI from a bootstrap over runs within each colony (seed noise, the judging run's
 * construction), never over colonies.
 */
export function summariseSim(perColony: RestWindow[][], seed = 76, B = 2000): GroupSummary {
  const cols = perColony.map(restColony);
  const point = summarise(cols, seed);
  const rng = new RNG(seed + 1);
  const draws: Record<'S' | 'zFull' | 'zPart' | 'zE', number[]> = { S: [], zFull: [], zPart: [], zE: [] };
  for (let b = 0; b < B; b++) {
    const cs = perColony.map((ws) => restColony(ws.map(() => ws[rng.int(ws.length)])));
    const z = cs.filter((c) => Number.isFinite(c.zFull) && Number.isFinite(c.zPart));
    const e = cs.filter((c) => Number.isFinite(c.zE));
    draws.S.push(shareSpatial(z));
    draws.zFull.push(mean(z.map((c) => c.zFull)));
    draws.zPart.push(mean(z.map((c) => c.zPart)));
    draws.zE.push(mean(e.map((c) => c.zE)));
  }
  const est = (k: keyof typeof draws, e: Est): Est => {
    const v = draws[k].filter(Number.isFinite).sort((a, b) => a - b);
    const m = mean(v);
    return { est: e.est, lo: v[Math.floor(0.025 * v.length)], hi: v[Math.floor(0.975 * v.length)], se: Math.sqrt(v.reduce((a, x) => a + (x - m) ** 2, 0) / (v.length - 1)), n: e.n };
  };
  return { ...point, S: est('S', point.S), zFull: est('zFull', point.zFull), zPart: est('zPart', point.zPart), zE: est('zE', point.zE) };
}
