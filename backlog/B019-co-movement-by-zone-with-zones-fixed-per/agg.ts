/**
 * B019 aggregation: reads out/comove-c*.json, applies the readings R1–R4 stated in the Progress log, writes
 * results/comove.json (stamped). Colony mean and colony bootstrap 2000 as B018 (lib boot, seed 18).
 *   npx vite-node backlog/B019-co-movement-by-zone-with-zones-fixed-per/agg.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson, writeJson } from '../../scripts/lib';
import { boot, mean } from '../B018-resting-site-and-aggregation-in-the/lib';
import { stamp } from '../_lib/stamp';

const ITEM = path.dirname(fileURLToPath(import.meta.url));
const ZN = ['core', 'entrance', 'periphery', 'mid', 'mixed'];
const CL = ['M', 'F4', 'F24'] as const;
type Run = { C: (number | null)[][]; pairs: number[][]; Cnull: (number | null)[][][] };
type Col = { colony: string } & Record<(typeof CL)[number], Run>;
const files = fs.readdirSync(`${ITEM}/out`).filter((f) => /^comove-c\d+\.json$/.test(f)).sort((a, b) => parseInt(a.slice(8)) - parseInt(b.slice(8)));
const cols = files.map((f) => readJson<Col>(`${ITEM}/out/${f}`));
if (cols.length !== 22) throw new Error(`expected 22 colonies, got ${cols.length}`);

const num = (v: number | null | undefined) => (v === null || v === undefined ? NaN : v);
const zi = (z: string) => ZN.indexOf(z);
/** Per colony: observed C, null C (mean over replicates), Δ, pair-minutes; for classing c, zone z, distance class dc. */
const per = (c: (typeof CL)[number], z: string, dc: number) =>
  cols.map((col) => {
    const r = col[c];
    const obs = num(r.C[zi(z)][dc]);
    const nv = r.Cnull.map((rep) => num(rep[zi(z)][dc])).filter(Number.isFinite);
    const nul = nv.length ? mean(nv) : NaN;
    return { obs, nul, delta: obs - nul, pairs: r.pairs[zi(z)][dc] };
  });
const fin = (v: number[]) => v.filter(Number.isFinite);
const contrast = (c: (typeof CL)[number], a: string, b: string, dc: number, key: 'obs' | 'nul' | 'delta', minPairs = 0) => {
  const A = per(c, a, dc), B = per(c, b, dc);
  return boot(fin(A.map((x, k) => (x.pairs >= minPairs && B[k].pairs >= minPairs ? x[key] - B[k][key] : NaN))), mean);
};
const verdict = (ci: { lo: number; hi: number }, pos: string, neg: string, none: string) => (ci.lo > 0 ? pos : ci.hi < 0 ? neg : none);

// R1: reproduction of B018's minute-classed values.
const b018 = readJson<any>(`${ITEM}/../B018-resting-site-and-aggregation-in-the/results/rules.json`);
let r1Max = 0;
cols.forEach((col, k) => {
  const ref = b018.perColony.comove[k];
  if (ref.colony !== col.colony) throw new Error(`colony order ${ref.colony} vs ${col.colony}`);
  ZN.forEach((z) => [0, 1].forEach((dc) => {
    const a = num(col.M.C[zi(z)][dc]), b = num(ref.C[z][dc]);
    if (Number.isFinite(a) !== Number.isFinite(b)) r1Max = Infinity;
    else if (Number.isFinite(a)) r1Max = Math.max(r1Max, Math.abs(a - b));
  }));
});
const R1 = { maxAbsDiff: r1Max, pass: r1Max <= 1e-9 };
if (!R1.pass) throw new Error(`R1 failed: max |diff| ${r1Max}`);

// R2: artefact share of B018's periphery − core contrast (M, < 10 mm), colonies paired.
const pm = per('M', 'periphery', 0), cm = per('M', 'core', 0);
const pairsPC = pm.map((p, k) => ({ obs: p.obs - cm[k].obs, nul: p.nul - cm[k].nul })).filter((x) => Number.isFinite(x.obs) && Number.isFinite(x.nul));
const share = boot(pairsPC, (s) => mean(s.map((x) => x.nul)) / mean(s.map((x) => x.obs)));
const nullContrast = boot(pairsPC.map((x) => x.nul), mean);
const R2 = {
  observedContrast_perMinusCore: boot(pairsPC.map((x) => x.obs), mean),
  nullContrast_perMinusCore: nullContrast,
  artefactShare: share,
  verdict: share.est >= 0.5 ? 'mostly artefact' : nullContrast.lo > 0 ? 'partly artefact' : 'not an artefact',
};

// R3 / R4 tables per classing.
const table = (c: (typeof CL)[number], minPairs = 0) =>
  Object.fromEntries(
    [0, 1].map((dc) => [
      dc === 0 ? 'lt10' : '10to20',
      {
        byZone: Object.fromEntries(
          ZN.map((z) => {
            const v = per(c, z, dc).filter((x) => x.pairs >= minPairs);
            return [z, { obs: mean(fin(v.map((x) => x.obs))), null: mean(fin(v.map((x) => x.nul))), delta: boot(fin(v.map((x) => x.delta)), mean), colonies: fin(v.map((x) => x.delta)).length, pairMinutes: v.reduce((a, x) => a + x.pairs, 0) }];
          }),
        ),
        delta_coreMinusPer: contrast(c, 'core', 'periphery', dc, 'delta', minPairs),
        delta_entMinusPer: contrast(c, 'entrance', 'periphery', dc, 'delta', minPairs),
        delta_entMinusCore: contrast(c, 'entrance', 'core', dc, 'delta', minPairs),
        obs_coreMinusPer: contrast(c, 'core', 'periphery', dc, 'obs', minPairs),
        null_coreMinusPer: contrast(c, 'core', 'periphery', dc, 'nul', minPairs),
      },
    ]),
  );
const tables = Object.fromEntries(CL.map((c) => [c, table(c)]));
const read = (c: (typeof CL)[number]) => {
  const t = tables[c].lt10 as any;
  return {
    site: verdict(t.delta_coreMinusPer, 'centred on the site', 'peripheral', 'no zone difference'),
    entrance: verdict(t.delta_entMinusPer, 'entrance-centred', 'entrance below periphery', 'no entrance difference'),
    couplingPresent: Object.fromEntries(ZN.slice(0, 3).map((z) => [z, t.byZone[z].delta.lo > 0])),
  };
};
const R3 = read('F4');
const R4 = { F24: read('F24'), agreesWithF4: read('F24').site === R3.site && read('F24').entrance === R3.entrance };

// Post hoc, beside (added after seeing colony 0's periphery rest on 98 pair-minutes, before the full run's values):
// the same tables over colonies with ≥ 1000 pair-minutes in each zone compared.
const posthoc = { note: 'post hoc: colonies with ≥ 1000 pair-minutes in each compared zone', F4: table('F4', 1000), M: table('M', 1000) };

const out = { provenance: stamp(ITEM), reps: cols[0].M.Cnull.length, colonies: cols.map((c) => c.colony), R1, R2, R3, R4, tables, posthoc };
fs.mkdirSync(`${ITEM}/results`, { recursive: true });
writeJson(`${ITEM}/results/comove.json`, out);
const f = (x: { est: number; lo?: number; hi?: number }) => (x.lo === undefined || x.hi === undefined ? `${x.est} (no colonies)` : `${x.est.toFixed(3)} [${x.lo.toFixed(3)}, ${x.hi.toFixed(3)}]`);
console.log('R1', R1);
console.log('R2 obs', f(R2.observedContrast_perMinusCore), 'null', f(R2.nullContrast_perMinusCore), 'share', f(R2.artefactShare), '→', R2.verdict);
for (const c of CL) {
  const t = tables[c].lt10 as any;
  console.log(`${c} <10:`, ZN.map((z) => `${z} obs ${t.byZone[z].obs.toFixed(3)} null ${t.byZone[z].null.toFixed(3)} Δ ${f(t.byZone[z].delta)} n${t.byZone[z].colonies} pm${t.byZone[z].pairMinutes}`).join(' | '));
  console.log(`   Δcore−per ${f(t.delta_coreMinusPer)}  Δent−per ${f(t.delta_entMinusPer)}  Δent−core ${f(t.delta_entMinusCore)}`);
  const u = tables[c]['10to20'] as any;
  console.log(`  10–20: Δcore−per ${f(u.delta_coreMinusPer)}  Δent−per ${f(u.delta_entMinusPer)}`);
}
console.log('R3 (F4)', R3);
console.log('R4', R4);
for (const c of ['M', 'F4'] as const) {
  const t = (posthoc as any)[c].lt10;
  console.log(`posthoc ${c} ≥1000: Δcore−per ${f(t.delta_coreMinusPer)} (n ${t.delta_coreMinusPer.n})  Δent−per ${f(t.delta_entMinusPer)} (n ${t.delta_entMinusPer.n})  obs core−per ${f(t.obs_coreMinusPer)}`);
}
