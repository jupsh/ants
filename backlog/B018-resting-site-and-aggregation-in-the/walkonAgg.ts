/**
 * B018 post hoc 3c (run-age-stratified walk-on, out/walkon-c*.json) and family 4's wall-band shares of still steps (pass A
 * grids, out/site-c*.json); readings in the Progress log.
 *   nice -n 19 npx vite-node backlog/B018-resting-site-and-aggregation-in-the/walkonAgg.ts   → results/walkon.json
 */
import fs from 'node:fs';
import { readJson, writeJson } from '../../scripts/lib';
import { RNG } from '../../src/sim/core/rng';
import { stamp } from '../_lib/stamp';
import { boot, ITEM, mean, NEST, wallDist } from './lib';

const list = (re: RegExp) => fs.readdirSync(`${ITEM}/out`).filter((f) => re.test(f)).sort((a, b) => parseInt(a.replace(/\D/g, '')) - parseInt(b.replace(/\D/g, '')));
const recs = list(/^walkon-c\d+\.json$/).map((f) => readJson<{ colony: string; dims: { AGE_BINS: number; A_BINS: number; ARR_BINS: number }; T: number[]; arrivals: number }>(`${ITEM}/out/${f}`));
const { AGE_BINS, A_BINS, ARR_BINS } = recs[0].dims;
const COLS = recs.map((_, i) => i);
const rng = new RNG(1804);
const draws = Array.from({ length: 2000 }, () => COLS.map(() => COLS[rng.int(COLS.length)]));
const ci = (est: number, v: number[]) => { const w = v.filter(Number.isFinite).sort((a, b) => a - b); return { est, lo: w[Math.floor(0.025 * w.length)], hi: w[Math.floor(0.975 * w.length)] }; };
const idx = (base: number, age: number, A: number, arr: number) => (((base * AGE_BINS + age) * A_BINS + A) * ARR_BINS + arr) * 3;

/** MH rate ratio, arrival bins 0–1 (exposed) vs 5 (reference), strata colony draw × base × age × A (ages in `ages`). */
function mh(S: number[], f: number, ages: number[]): number {
  let num = 0, den = 0;
  S.forEach((c) => {
    const T = recs[c].T;
    for (let base = 0; base < 8; base++) for (const age of ages) for (let A = 0; A < A_BINS; A++) {
      const a = T[idx(base, age, A, 0) + f] + T[idx(base, age, A, 1) + f];
      const T1 = T[idx(base, age, A, 0)] + T[idx(base, age, A, 1)];
      const b = T[idx(base, age, A, 5) + f];
      const T0 = T[idx(base, age, A, 5)];
      if (!T1 || !T0) continue;
      num += (a * T0) / (T1 + T0);
      den += (b * T1) / (T1 + T0);
    }
  });
  return num / den;
}
function excess(S: number[], f: number): number {
  let ex = 0, arr = 0;
  for (const c of S) {
    const T = recs[c].T;
    arr += recs[c].arrivals;
    for (let base = 0; base < 8; base++) for (let age = 0; age < AGE_BINS; age++) for (let A = 0; A < A_BINS; A++) {
      const h0 = T[idx(base, age, A, 5)] ? T[idx(base, age, A, 5) + f] / T[idx(base, age, A, 5)] : 0;
      for (let k = 0; k <= 2; k++) ex += T[idx(base, age, A, k) + f] - h0 * T[idx(base, age, A, k)];
    }
  }
  return ex / arr;
}
const hazard = (S: number[], f: number, age: number) => Array.from({ length: ARR_BINS }, (_, k) => {
  let e = 0, s = 0;
  for (const c of S) for (let base = 0; base < 8; base++) for (let A = 0; A < A_BINS; A++) { e += recs[c].T[idx(base, age, A, k) + f]; s += recs[c].T[idx(base, age, A, k)]; }
  return e / s;
});
const ALL = [0, 1, 2, 3, 4];
const AGE_LABELS = ['0-2s', '2-5s', '5-15s', '15-60s', '>=60s'];
const walkOn = {
  sustained: {
    rr_ageStratified: ci(mh(COLS, 1, ALL), draws.map((S) => mh(S, 1, ALL))),
    rr_byAge: Object.fromEntries(ALL.map((a) => [AGE_LABELS[a], ci(mh(COLS, 1, [a]), draws.map((S) => mh(S, 1, [a])))])),
    excessPerArrival_0to5s: ci(excess(COLS, 1), draws.map((S) => excess(S, 1))),
    hazardBySinceArrival_byAge: Object.fromEntries(ALL.map((a) => [AGE_LABELS[a], hazard(COLS, 1, a)])),
  },
  any: { rr_ageStratified: ci(mh(COLS, 2, ALL), draws.map((S) => mh(S, 2, ALL))), excessPerArrival_0to5s: ci(excess(COLS, 2), draws.map((S) => excess(S, 2))) },
  arrivals: recs.reduce((a, r) => a + r.arrivals, 0),
};

// Family 4: share of still steps (pass A, 24 h, workers) within d mm of the pooled edges, over the band's area share.
const sites = list(/^site-c\d+\.json$/).map((f) => readJson<{ W: number; H: number; all: number[] }>(`${ITEM}/out/${f}`));
const band = Object.fromEntries([2, 3, 4].map((d) => {
  const per = sites.map(({ W, all }) => {
    let inB = 0, tot = 0;
    all.forEach((v, q) => { const x = (q % W) + 0.5, y = Math.floor(q / W) + 0.5; tot += v; if (wallDist(x, y) < d) inB += v; });
    return inB / tot;
  });
  const w = NEST.x1 - NEST.x0, h = NEST.y1 - NEST.y0;
  const area = 1 - ((w - 2 * d) * (h - 2 * d)) / (w * h);
  return [`${d}mm`, { stillShare: boot(per, mean), areaShare: area, enrichment: boot(per.map((s) => s / area), mean) }];
}));

writeJson(`${ITEM}/results/walkon.json`, { provenance: stamp(ITEM), definitions: 'B018 Progress log: post hoc 3c (run age) and family 4 band shares', walkOn, wallBand: band });
console.log(JSON.stringify({ walkOn, band }, (k, v) => (typeof v === 'number' ? +v.toPrecision(4) : v), 1));
