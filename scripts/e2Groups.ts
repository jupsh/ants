/**
 * Trail-laying group rows for the 2009 two-drop experiment (development,
 * reported only; STATUS 2026-10-09 "trail-laying group rows"). Mailleux
 * et al. 2009 Tables 1–2 and text: drop-1 volume and time for TL1 vs nTL1,
 * drop-2 time and volume for TL1 / TL2 / nTL2. Levels: z = difference /
 * √(SD_data²/n_data + SD_sim²/n_sim); they include any overall level misfit
 * (e.g. drop-2 time). Contrasts, which is what the paper tests: model
 * (TL1 − nTL1) against data (TL1 − nTL1), z with both SEs (data nTL1 at
 * drop 2 pooled from TL2 and nTL2). Also the satiated-at-drop-1 fraction
 * per group (model only; no data; "satiated" = the leaving hazard fired).
 */
import type { ScoutResult } from '../src/sim/experiments/e2Mailleux';

type Pick = (r: ScoutResult) => number;
/** [label, group, value, data mean, data SD, data n]. */
const ROWS: [string, string, Pick, number, number, number][] = [
  ['drop-1 volume (µL)', 'TL1', (r) => r.drinks[0].ul, 0.49, 0.26, 24],
  ['drop-1 volume (µL)', 'nTL1', (r) => r.drinks[0].ul, 0.46, 0.24, 39],
  ['drop-1 time (s)', 'TL1', (r) => r.drinks[0].time, 52, 13, 24],
  ['drop-1 time (s)', 'nTL1', (r) => r.drinks[0].time, 50, 11, 39],
  ['drop-2 time (s)', 'TL1', (r) => r.drinks[1].time, 20, 13, 24],
  ['drop-2 time (s)', 'TL2', (r) => r.drinks[1].time, 25, 10, 29],
  ['drop-2 time (s)', 'nTL2', (r) => r.drinks[1].time, 20, 12, 10],
  ['drop-2 volume (µL)', 'TL1', (r) => r.drinks[1].ul, 0.2, 0.14, 24],
  ['drop-2 volume (µL)', 'TL2', (r) => r.drinks[1].ul, 0.33, 0.2, 29],
  ['drop-2 volume (µL)', 'nTL2', (r) => r.drinks[1].ul, 0.31, 0.24, 10],
];

const GROUPS: Record<string, (r: ScoutResult) => boolean> = {
  TL1: (r) => r.laidSection1,
  nTL1: (r) => !r.laidSection1,
  TL2: (r) => !r.laidSection1 && r.laidTrail,
  nTL2: (r) => !r.laidTrail,
};

/** Report lines for scouts that drank at both drops. */
export function groupRows(both: ScoutResult[]): string[] {
  const out: string[] = [];
  const msd = (xs: number[]) => {
    const m = xs.reduce((a, v) => a + v, 0) / xs.length;
    return [m, Math.sqrt(xs.reduce((a, v) => a + (v - m) ** 2, 0) / Math.max(1, xs.length - 1))];
  };
  const dp = (label: string) => (label.includes('µL') ? 2 : 0);
  for (const [label, g, pick, dm, dsd, dn] of ROWS) {
    const xs = both.filter(GROUPS[g]).map(pick);
    if (xs.length < 2) {
      out.push(`${label} ${g}: model n ${xs.length} (too few) [data ${dm} ± ${dsd}, n ${dn}]`);
      continue;
    }
    const [m, sd] = msd(xs);
    const z = (m - dm) / Math.sqrt(dsd ** 2 / dn + sd ** 2 / xs.length);
    out.push(`${label} ${g}: model ${m.toFixed(dp(label))} ± ${sd.toFixed(dp(label))} (n ${xs.length}) [data ${dm} ± ${dsd}, n ${dn}] z ${z.toFixed(1)}`);
  }
  // Contrasts TL1 − nTL1 (user review 2026-10-09).
  const dataGroup = (label: string, g: string) => ROWS.find((r) => r[0] === label && r[1] === g)!;
  const pooledData = (label: string): [number, number, number] => {
    const nt = dataGroup(label, 'nTL1');
    if (nt) return [nt[3], nt[4], nt[5]];
    const [a, b] = [dataGroup(label, 'TL2'), dataGroup(label, 'nTL2')];
    const n = a[5] + b[5];
    const m = (a[5] * a[3] + b[5] * b[3]) / n;
    const ss = (a[5] - 1) * a[4] ** 2 + (b[5] - 1) * b[4] ** 2 + a[5] * (a[3] - m) ** 2 + b[5] * (b[3] - m) ** 2;
    return [m, Math.sqrt(ss / (n - 1)), n];
  };
  for (const label of ['drop-1 time (s)', 'drop-1 volume (µL)', 'drop-2 time (s)', 'drop-2 volume (µL)']) {
    const tl = dataGroup(label, 'TL1');
    const [nm, nsd, nn] = pooledData(label);
    const pick = tl[2];
    const a = both.filter(GROUPS.TL1).map(pick);
    const b = both.filter(GROUPS.nTL1).map(pick);
    if (a.length < 2 || b.length < 2) continue;
    const [am, asd] = msd(a);
    const [bm, bsd] = msd(b);
    const dm = tl[3] - nm;
    const se = Math.sqrt(tl[4] ** 2 / tl[5] + nsd ** 2 / nn + asd ** 2 / a.length + bsd ** 2 / b.length);
    const d = dp(label) + 1;
    out.push(`CONTRAST ${label} TL1 − nTL1: model ${(am - bm).toFixed(d)} [data ${dm.toFixed(d)}] z ${((am - bm - dm) / se).toFixed(1)}`);
  }
  out.push(`satiated at drop 1 (model only): ${['TL1', 'TL2', 'nTL2'].map((g) => {
    const xs = both.filter(GROUPS[g]);
    return `${g} ${xs.length ? ((100 * xs.filter((r) => r.satisfiedAt1).length) / xs.length).toFixed(0) : '—'} %`;
  }).join(', ')}`);
  return out;
}
