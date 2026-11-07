// Scratch (not committed): the S2 audit's colony statistics and gate (T032; D136, D145–D147).
// A colony's accumulators are pooled over its files within each draw before any ratio (D147 item 3). Colony: S2_J =
// L − Ê_J[L], Ê over the valid draws, defined if the observed values are estimable and ≥ 90 % of draws are valid.
// Gate (D136 as narrowed by D145 item 6, D146, D147): colonies estimable in data and base; < 15 → "unestimable".
// One joint colony bootstrap (2,000 resamples, RNG.stream(0x5ea0)); lower 95 % bounds of mean data S2_J and of mean
// (data − base) S2_J. Monte Carlo error of each bound: 200 resamples of each colony's stored valid null draws
// (RNG.stream(0x52a2, m, set, colony)), the colony resamples held fixed; SD of the recomputed bound. A bound is
// resolved if |bound| > 2 MC SE. Both resolved: pass if both > 0, else fail. Otherwise "extend" below 400 draws, else
// "unresolved".
import { RNG } from '../../src/sim/core/rng';
import { estimable, L } from './s2Audit';

export const NULL_VALID = 0.9;
export const MIN_COLONIES = 15;
export const BOOT = 2000;
export const SEED_BOOT = 0x5ea0;
export const MC_N = 200;
export const SEED_MC = 0x52a2;
export const MC_K = 2;
export const MAX_DRAWS = 400;

export interface ColonyStat { est: boolean; why?: string; L: number; EJ: number; S2J: number; validL: number[]; nDraws: number }

export function colonyStat(obs: ArrayLike<number>, draws: ArrayLike<number>[], kd = 0): ColonyStat {
  const Lo = L(obs, kd);
  const validL = draws.filter((d) => estimable(d, kd)).map((d) => L(d, kd));
  const base = { L: Lo, validL, nDraws: draws.length, EJ: NaN, S2J: NaN };
  if (!estimable(obs, kd)) return { ...base, est: false, why: 'observed not estimable' };
  if (!draws.length || validL.length < NULL_VALID * draws.length)
    return { ...base, est: false, why: `null draws valid ${validL.length}/${draws.length}` };
  const EJ = mean(validL);
  return { ...base, est: true, EJ, S2J: Lo - EJ };
}

export const mean = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
export const quant = (v: number[], p: number) => { const w = [...v].sort((a, b) => a - b); return w[Math.floor(p * (w.length - 1))]; };
export const sd = (v: number[]) => { const m = mean(v); return Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / (v.length - 1)); };
export const colonyKey = (label: string) => Number(label.replace(/\D/g, ''));

export interface GateOut {
  verdict: 'unestimable' | 'pass' | 'fail' | 'extend' | 'unresolved';
  common: string[];
  excluded: { colony: string; set: string; why: string }[];
  nDraws: number;
  data?: { mean: number; lb: number; mcSe: number; resolved: boolean };
  diff?: { mean: number; lb: number; mcSe: number; resolved: boolean };
}

/** Lower 95 % bounds of mean data S2_J and mean (data − base) S2_J over fixed colony resamples. */
function bounds(idx: Int32Array[], d: number[], b: number[]): [number, number] {
  const m1: number[] = [];
  const m2: number[] = [];
  for (const I of idx) {
    let s1 = 0;
    let s2 = 0;
    for (const i of I) { s1 += d[i]; s2 += d[i] - b[i]; }
    m1.push(s1 / I.length);
    m2.push(s2 / I.length);
  }
  return [quant(m1, 0.025), quant(m2, 0.025)];
}

export function gate(data: Map<string, ColonyStat>, base: Map<string, ColonyStat>, setIdx = [0, 1]): GateOut {
  const excluded: GateOut['excluded'] = [];
  const labels = [...new Set([...data.keys(), ...base.keys()])].sort();
  const common: string[] = [];
  for (const c of labels) {
    const d = data.get(c);
    const b = base.get(c);
    if (!d?.est) excluded.push({ colony: c, set: 'data', why: d ? d.why! : 'missing' });
    if (!b?.est) excluded.push({ colony: c, set: 'base', why: b ? b.why! : 'missing' });
    if (d?.est && b?.est) common.push(c);
  }
  const nDraws = common.length ? Math.min(...common.flatMap((c) => [data.get(c)!.nDraws, base.get(c)!.nDraws])) : 0;
  if (common.length < MIN_COLONIES) return { verdict: 'unestimable', common, excluded, nDraws };
  const n = common.length;
  const rb = RNG.stream(SEED_BOOT);
  const idx = Array.from({ length: BOOT }, () => Int32Array.from({ length: n }, () => rb.int(n)));
  const d = common.map((c) => data.get(c)!.S2J);
  const b = common.map((c) => base.get(c)!.S2J);
  const [lb1, lb2] = bounds(idx, d, b);
  const mc1: number[] = [];
  const mc2: number[] = [];
  for (let m = 0; m < MC_N; m++) {
    const re = (s: ColonyStat, si: number, c: string) => {
      const r = RNG.stream(SEED_MC, m, si, colonyKey(c));
      let t = 0;
      for (let k = 0; k < s.validL.length; k++) t += s.validL[r.int(s.validL.length)];
      return s.L - t / s.validL.length;
    };
    const [a1, a2] = bounds(idx, common.map((c) => re(data.get(c)!, setIdx[0], c)), common.map((c) => re(base.get(c)!, setIdx[1], c)));
    mc1.push(a1);
    mc2.push(a2);
  }
  const se1 = sd(mc1);
  const se2 = sd(mc2);
  const res1 = Math.abs(lb1) > MC_K * se1;
  const res2 = Math.abs(lb2) > MC_K * se2;
  const verdict = res1 && res2 ? (lb1 > 0 && lb2 > 0 ? 'pass' : 'fail') : nDraws < MAX_DRAWS ? 'extend' : 'unresolved';
  return {
    verdict, common, excluded, nDraws,
    data: { mean: mean(d), lb: lb1, mcSe: se1, resolved: res1 },
    diff: { mean: mean(d.map((v, i) => v - b[i])), lb: lb2, mcSe: se2, resolved: res2 },
  };
}
