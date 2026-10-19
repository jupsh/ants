/**
 * B018 families 1–2 (anchor, stability) from pass A (out/site-c*.json), read as logged in the Progress log.
 *   npx vite-node backlog/B018-resting-site-and-aggregation-in-the/siteAgg.ts   → results/site.json
 */
import fs from 'node:fs';
import { readJson, writeJson } from '../../scripts/lib';
import { stamp } from '../_lib/stamp';
import { boot, ITEM, mean, median, quantile } from './lib';

interface Hour { h: number; grid: number[]; qx: number[]; qy: number[]; qStill: number; qSteps: number }
interface Pass { colony: string; W: number; H: number; all: number[]; light: number[]; dark: number[]; nurse: number[]; forager: number[]; hours: Hour[]; dQueen: number[]; noQueen: number }
type P = [number, number];

const MIN_HOUR = 500; // still steps an hour needs for its centroid and peak
const dist = (a: P, b: P) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** Peak of a 1-mm grid under a 5 × 5-mm moving window (centre of the window, mm), and the window's share of the total. */
function peak(g: number[], W: number, H: number, exclude?: { at: P; r: number }): { at: P; share: number } {
  let best = -1;
  let at: P = [NaN, NaN];
  const tot = g.reduce((a, b) => a + b, 0);
  for (let y = 0; y + 5 <= H; y++)
    for (let x = 0; x + 5 <= W; x++) {
      const c: P = [x + 2.5, y + 2.5];
      if (exclude && dist(c, exclude.at) < exclude.r) continue;
      let s = 0;
      for (let dy = 0; dy < 5; dy++) for (let dx = 0; dx < 5; dx++) s += g[(y + dy) * W + x + dx];
      if (s > best) {
        best = s;
        at = c;
      }
    }
  return { at, share: best / tot };
}
function centroid(g: number[], W: number): { at: P; n: number } {
  let n = 0, sx = 0, sy = 0;
  g.forEach((v, q) => {
    n += v;
    sx += v * ((q % W) + 0.5);
    sy += v * (Math.floor(q / W) + 0.5);
  });
  return { at: [sx / n, sy / n], n };
}
/** Weighted quantile of distances from cell centres to a point. */
function distQuantile(g: number[], W: number, to: P, p: number): number {
  const d: [number, number][] = [];
  g.forEach((v, q) => v && d.push([Math.hypot((q % W) + 0.5 - to[0], Math.floor(q / W) + 0.5 - to[1]), v]));
  d.sort((a, b) => a[0] - b[0]);
  const tot = d.reduce((a, b) => a + b[1], 0);
  let c = 0;
  for (const [x, v] of d) if ((c += v) >= p * tot) return x;
  return NaN;
}
function histQuantile(h: number[], bin: number, p: number): number {
  const tot = h.reduce((a, b) => a + b, 0);
  let c = 0;
  for (let k = 0; k < h.length; k++) {
    if (c + h[k] >= p * tot) return (k + (p * tot - c) / h[k]) * bin;
    c += h[k];
  }
  return NaN;
}
/** 1-mm grid → 5-mm cells (shares), as comparison P. */
function coarse(g: number[], W: number, H: number): number[] {
  const w = Math.ceil(W / 5);
  const out = new Array(w * Math.ceil(H / 5)).fill(0);
  const tot = g.reduce((a, b) => a + b, 0);
  g.forEach((v, q) => (out[Math.floor(Math.floor(q / W) / 5) * w + Math.floor((q % W) / 5)] += v / tot));
  return out;
}
function corr(a: number[], b: number[]): number {
  const ma = mean(a), mb = mean(b);
  let s = 0, sa = 0, sb = 0;
  for (let k = 0; k < a.length; k++) {
    s += (a[k] - ma) * (b[k] - mb);
    sa += (a[k] - ma) ** 2;
    sb += (b[k] - mb) ** 2;
  }
  return s / Math.sqrt(sa * sb);
}
const maxPair =(v: P[]) => Math.max(0, ...v.flatMap((a, i) => v.slice(i + 1).map((b) => dist(a, b))));

const files = fs.readdirSync(`${ITEM}/out`).filter((f) => /^site-c\d+\.json$/.test(f)).sort((a, b) => parseInt(a.slice(6)) - parseInt(b.slice(6)));
const per = files.map((f) => {
  const d = readJson<Pass>(`${ITEM}/out/${f}`);
  const { W, H } = d;
  const S = peak(d.all, W, H);
  const second = peak(d.all, W, H, { at: S.at, r: 10 });
  const SL = peak(d.light, W, H).at;
  const SD = peak(d.dark, W, H).at;
  const qx = d.hours.flatMap((h) => h.qx);
  const qy = d.hours.flatMap((h) => h.qy);
  const Q: P = [median(qx), median(qy)];
  const dSite = distQuantile(d.nurse, W, S.at, 0.5);
  const dQueen = histQuantile(d.dQueen, 0.5, 0.5); // last bin ≥ 99.5 mm, beyond the nest's diagonal
  const hrs = d.hours.map((h) => {
    const c = centroid(h.grid, W);
    const ok = c.n >= MIN_HOUR;
    return {
      hour: h.h,
      n: c.n,
      C: ok ? c.at : null,
      S: ok ? peak(h.grid, W, H).at : null,
      Q: h.qx.length >= 60 ? ([median(h.qx), median(h.qy)] as P) : null,
      qStill: h.qSteps ? h.qStill / h.qSteps : null,
    };
  });
  const good = hrs.filter((h) => h.C);
  const steps = good.slice(1).map((h, k) => ({ d: dist(h.C!, good[k].C!), light: good[k].hour >= 6 && good[k].hour < 18, adj: h.hour === (good[k].hour + 1) % 24 }));
  const adj = steps.filter((s) => s.adj);
  const both = hrs.filter((h) => h.C && h.Q);
  const mq: P = [mean(both.map((h) => h.Q![0])), mean(both.map((h) => h.Q![1]))];
  const mc: P = [mean(both.map((h) => h.C![0])), mean(both.map((h) => h.C![1]))];
  let sqc = 0, sqq = 0, scc = 0;
  for (const h of both) {
    const a = [h.Q![0] - mq[0], h.Q![1] - mq[1]];
    const b = [h.C![0] - mc[0], h.C![1] - mc[1]];
    sqc += a[0] * b[0] + a[1] * b[1];
    sqq += a[0] ** 2 + a[1] ** 2;
    scc += b[0] ** 2 + b[1] ** 2;
  }
  const qHours = hrs.filter((h) => h.Q).map((h) => h.Q!);
  const sHours = good.map((h) => h.S!);
  const tot = d.all.reduce((a, b) => a + b, 0);
  return {
    colony: d.colony,
    site: S.at,
    siteShare: S.share,
    secondPeak: { at: second.at, share: second.share, distance: dist(S.at, second.at) },
    siteLight: SL,
    siteDark: SD,
    lightDarkPeakMm: dist(SL, SD),
    lightDarkCentroidMm: dist(centroid(d.light, W).at, centroid(d.dark, W).at),
    clusterR50: distQuantile(d.all, W, S.at, 0.5),
    queen: Q,
    queenSiteMm: dist(Q, S.at),
    queenStill: qHours.length ? mean(hrs.filter((h) => h.qStill !== null).map((h) => h.qStill!)) : null,
    stillNurseMedian: { toQueen: dQueen, toSite: dSite, ratio: dQueen / dSite, beyondRange: d.dQueen[d.dQueen.length - 1], noQueenSteps: d.noQueen },
    hours: { usable: good.length, minSteps: MIN_HOUR, stillSteps: tot },
    queenRangeMm: maxPair(qHours),
    queenSiteVecCorr: sqq && scc ? sqc / Math.sqrt(sqq * scc) : null,
    queenSiteHours: both.length,
    driftMmPerH: { all: median(adj.map((s) => s.d)), light: median(adj.filter((s) => s.light).map((s) => s.d)), dark: median(adj.filter((s) => !s.light).map((s) => s.d)) },
    peakRangeMm: maxPair(sHours),
    peakWithin5: sHours.filter((s) => dist(s, S.at) < 5).length / sHours.length,
    peakWithin10: sHours.filter((s) => dist(s, S.at) < 10).length / sHours.length,
    hourly: hrs.map((h) => ({ hour: h.hour, n: h.n, C: h.C?.map((v) => +v.toFixed(2)), S: h.S, Q: h.Q?.map((v) => +v.toFixed(2)), qStill: h.qStill && +h.qStill.toFixed(3) })),
    // Post hoc, beside (Progress: added after the flat-topped peak was seen; the logged verdicts stand).
    posthoc: (() => {
      const C24 = centroid(d.all, W).at;
      const maps = d.hours.map((h) => (centroid(h.grid, W).n >= MIN_HOUR ? coarse(h.grid, W, H) : null));
      const lagR = Object.fromEntries(
        [1, 3, 6, 12].map((L) => {
          const r = maps.slice(L).map((m, k) => (m && maps[k] ? corr(m, maps[k]!) : NaN)).filter(Number.isFinite);
          return [L, mean(r)];
        }),
      );
      return {
        centroid24: C24,
        queenCentroidMm: dist(Q, C24),
        r50AroundCentroid: distQuantile(d.all, W, C24, 0.5),
        stillNurseToCentroid: distQuantile(d.nurse, W, C24, 0.5),
        hourlyMapLagR: lagR,
        lightDarkMapR: corr(coarse(d.light, W, H), coarse(d.dark, W, H)),
        map24: coarse(d.all, W, H),
      };
    })(),
  };
});
// Placebo for the map correlations: a colony's 24-h map against the other colonies' (shared geometry only).
const placeboR = per.map((p, i) => mean(per.filter((_, k) => k !== i).map((o) => corr(p.posthoc.map24, o.posthoc.map24))));

const v = (k: (p: (typeof per)[number]) => number | null) => per.map(k).filter((x): x is number => x !== null && Number.isFinite(x));
const mobileQ = per.filter((p) => p.queenRangeMm >= 5 && p.queenSiteVecCorr !== null);
const summary = {
  anchor: {
    queenSiteMm: { median: median(v((p) => p.queenSiteMm)), lt5: per.filter((p) => p.queenSiteMm < 5).length, gt10: per.filter((p) => p.queenSiteMm > 10).length, n: per.length },
    ratioToQueenOverToSite: boot(v((p) => p.stillNurseMedian.ratio), mean),
    queenRange: { median: median(v((p) => p.queenRangeMm)), coloniesGe5mm: mobileQ.length },
    vecCorrMobileQueens: mobileQ.length >= 6 ? boot(mobileQ.map((p) => p.queenSiteVecCorr!), mean) : { uninformative: true, n: mobileQ.length },
    vecCorrAll: boot(v((p) => p.queenSiteVecCorr), mean),
    queenStill: { median: median(v((p) => p.queenStill)), range: [Math.min(...v((p) => p.queenStill)), Math.max(...v((p) => p.queenStill))] },
  },
  stability: {
    fixedCount: per.filter((p) => p.peakWithin5 >= 0.8).length,
    wanderCount: per.filter((p) => p.peakRangeMm > 20).length,
    peakWithin5: { median: median(v((p) => p.peakWithin5)), q25: quantile(v((p) => p.peakWithin5), 0.25) },
    peakWithin10: { median: median(v((p) => p.peakWithin10)) },
    peakRangeMm: { median: median(v((p) => p.peakRangeMm)), range: [Math.min(...v((p) => p.peakRangeMm)), Math.max(...v((p) => p.peakRangeMm))] },
    driftMmPerH: boot(v((p) => p.driftMmPerH.all), mean),
    driftLightMinusDark: boot(per.filter((p) => Number.isFinite(p.driftMmPerH.light) && Number.isFinite(p.driftMmPerH.dark)).map((p) => p.driftMmPerH.light - p.driftMmPerH.dark), mean),
    lightDarkPeakMm: { median: median(v((p) => p.lightDarkPeakMm)), gt10: per.filter((p) => p.lightDarkPeakMm > 10).length },
    lightDarkCentroidMm: boot(v((p) => p.lightDarkCentroidMm), mean),
    clusterR50: { median: median(v((p) => p.clusterR50)) },
    secondPeak: { shareOverSite: median(per.map((p) => p.secondPeak.share / p.siteShare)), distanceMedian: median(per.map((p) => p.secondPeak.distance)) },
  },
  posthoc: {
    note: 'added after the flat-topped peak was seen at reading time; beside the logged verdicts, which stand',
    queenCentroidMm: { median: median(v((p) => p.posthoc.queenCentroidMm)), lt5: per.filter((p) => p.posthoc.queenCentroidMm < 5).length, gt10: per.filter((p) => p.posthoc.queenCentroidMm > 10).length },
    queenCentroidOverR50: boot(per.map((p) => p.posthoc.queenCentroidMm / p.posthoc.r50AroundCentroid), mean),
    r50AroundCentroid: { median: median(v((p) => p.posthoc.r50AroundCentroid)) },
    stillNurseToQueenOverToCentroid: boot(per.map((p) => p.stillNurseMedian.toQueen / p.posthoc.stillNurseToCentroid), mean),
    hourlyMapLagR: Object.fromEntries([1, 3, 6, 12].map((L) => [L, boot(per.map((p) => p.posthoc.hourlyMapLagR[L]), mean)])),
    lightDarkMapR: boot(per.map((p) => p.posthoc.lightDarkMapR), mean),
    otherColonyMapR: boot(placeboR, mean),
  },
};
for (const p of per) delete (p.posthoc as Partial<typeof p.posthoc>).map24;
fs.mkdirSync(`${ITEM}/results`, { recursive: true });
writeJson(`${ITEM}/results/site.json`, { provenance: stamp(ITEM), definitions: 'B018 Progress log, readings for families 1–2', summary, colonies: per });
console.log(JSON.stringify(summary, null, 1));
for (const p of per)
  console.log(p.colony, 'S', p.site, 'Q', p.queen.map((x) => x.toFixed(1)), 'Q-S', p.queenSiteMm.toFixed(1), 'ratio', p.stillNurseMedian.ratio.toFixed(2), 'qRange', p.queenRangeMm.toFixed(1), 'vc', p.queenSiteVecCorr?.toFixed(2), 'pkRange', p.peakRangeMm.toFixed(1), 'in5', p.peakWithin5.toFixed(2), 'drift', p.driftMmPerH.all.toFixed(2), 'LD', p.lightDarkPeakMm.toFixed(1), 'R50', p.clusterR50.toFixed(1), '2nd', p.secondPeak.distance.toFixed(0), (p.secondPeak.share / p.siteShare).toFixed(2), 'beyond', p.stillNurseMedian.beyondRange);
