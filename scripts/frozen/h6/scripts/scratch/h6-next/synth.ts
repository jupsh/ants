// Scratch (not committed): H6 synthetic checks (D241 amendment 1 point 5; acceptance rules fixed there, P150). Built
// on the real colonies' episode skeletons (participants, their onset zones and null-3 eligibility, halves) with the
// initiators reassigned by a known rule; the real assignment is never formed here: every skeleton passes through the
// reader's `blind` (participants in ant-id order, onset frames dropped) before an initiator is drawn, and the reader's `scorePrimary` scores each data set unchanged.
//
//   npx vite-node scripts/scratch/h6/synth.ts --case V1|V2|V3|V4|S2 --sets a:b [--draws 1000] [--boot 2000] [--par 8]
//       [--dir logs/h6-synth/<case>]   (the smoke uses --dir logs/h6-synth/smoke/<case>)
//     V1 null: uniform among participants. V2 persistent spatial preference: weight 3 in L, 1 in H (and 1 in
//     unassigned cells), uniform within a zone. V3 identity: a fixed random 20 % of each colony's ants weight 3, others
//     1. V4: per data set k, a further 10 % of light-phase in-nest detections deleted (twice as often in H as in L;
//     extract.ts --delete k), onsets, episodes and eligibility rebuilt, then V1 and V3 on the rebuilt skeletons.
//     S2: a shared signal driving both zones with H lagging L by 2 min, and independent zone series, on each colony's
//     own light-phase minutes, through the reader's S2 code (descriptive, no acceptance rule).
//   Writes logs/h6-synth/<case>/s<k>.json per data set; `--summary` prints the label rates of the sets present.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { arg, flag, numArg, readJson, writeJson } from '../../lib';
import { RNG } from '../../../src/sim/core/rng';
import { blind, buildZones, L, s2Summary, scorePrimary, SEED, skeleton, withInit, type Grid, type PCol, type S2Series, type SkEp, type SkInput } from './reader';

const CASES = ['V1', 'V2', 'V3', 'V4', 'S2'];
/** Diagnostic only (not the frozen reading): --elig-initiator 0|1 overrides the reader's ELIG_INITIATOR. (The former
 * --elig basic|coverage diagnostic is gone: null-3 eligibility has one rule, D246.) */
if (arg('--elig', '') !== '') throw new Error('--elig was removed: null-3 eligibility is point 1\'s three conditions only (D246)');
const DIAG = { eligInitiator: arg('--elig-initiator', '') === '' ? undefined : arg('--elig-initiator', '') === '1' };
const N_COL = 22;
interface Base extends SkInput { colony: string; grid: Grid; minutes: { minute: number[] } }

const pick = (w: number[], rng: RNG): number => {
  let s = 0;
  for (const x of w) s += x;
  let u = rng.next() * s;
  for (let k = 0; k < w.length; k++) { u -= w[k]; if (u < 0) return k; }
  return w.length - 1;
};
/** Initiator by rule (one per episode; weights over participants). Never reads ep.frames. */
function assign(eps: SkEp[], rule: 'V1' | 'V2' | 'V3', rng: RNG, heavy: Set<number>): number[][] {
  return eps.map((ep) => {
    const w = ep.ants.map((a, k) => (rule === 'V1' ? 1 : rule === 'V2' ? (ep.zone[k] === L ? 3 : 1) : heavy.has(a) ? 3 : 1));
    return [pick(w, rng)];
  });
}
function heavySet(nAnts: number, rng: RNG): Set<number> {
  const ids = Array.from({ length: nAnts }, (_, i) => i);
  for (let i = ids.length - 1; i > 0; i--) { const j = rng.int(i + 1); [ids[i], ids[j]] = [ids[j], ids[i]]; }
  return new Set(ids.slice(0, Math.round(0.2 * nAnts)));
}
function score(cols: PCol[], key: number, draws: number, B: number) {
  const r = scorePrimary(cols, { draws, boot: B, key, eligInitiator: DIAG.eligInitiator });
  const s = (x: typeof r.null1) => ({ label: x.label, ruleMet: x.ruleMet, reason: x.reason, Rbar: x.Rbar, threshold975: x.threshold975, referenceMedian: x.referenceMedian, diffCI: x.diffCI, entered: x.entered.length, excluded: x.excluded.length });
  return { null1: s(r.null1), null3: { ...s(r.null3), supportMet: r.null3.null3Support!.met, coloniesMeetingSupport: r.null3.null3Support!.coloniesMeeting } };
}
const run = (cmd: string, args: string[]) => new Promise<void>((res, rej) => { const p = spawn(cmd, args, { stdio: ['ignore', 'ignore', 'inherit'] }); p.on('exit', (c) => (c === 0 ? res() : rej(new Error(`${args.join(' ')} exit ${c}`)))); });
async function pool(jobs: (() => Promise<void>)[], par: number) { let i = 0; await Promise.all(Array.from({ length: par }, async () => { while (i < jobs.length) await jobs[i++](); })); }

async function main(): Promise<void> {
  const cs = arg('--case', '');
  if (!CASES.includes(cs)) throw new Error(`--case one of ${CASES.join(', ')}`);
  const [a, b] = arg('--sets', '0:1').split(':').map(Number);
  const draws = numArg('--draws', 1000), B = numArg('--boot', 2000), par = numArg('--par', 8);
  const dir = arg('--dir', `logs/h6-synth/${cs}`);
  if (!dir.startsWith('logs/h6-synth/')) throw new Error('synthetic outputs go under logs/h6-synth/ only');
  if (flag('--summary')) return summary(cs, dir);
  const base: Base[] = Array.from({ length: N_COL }, (_, c) => readJson<Base>(`logs/h6-work/c${c}.json`));
  const ci = CASES.indexOf(cs);
  if (cs === 'S2') {
    for (let k = a; k < b; k++) {
      const out: Record<string, unknown> = { case: 'S2', set: k };
      for (const kind of ['shared, H lags L by 2 min', 'independent'] as const) {
        const series: S2Series[] = base.map((d, c) => {
          const rng = RNG.stream(SEED, 60, k, c, kind === 'independent' ? 1 : 0);
          const ms = d.minutes.minute;
          const ar = (n: number) => { const v: number[] = []; let x = 0; for (let t = 0; t < n; t++) { x = 0.8 * x + rng.gauss(); v.push(x); } return v; };
          const s = ar(ms.length + 2), s2 = ar(ms.length + 2);
          const Lm = new Map<number, number>(), Hm = new Map<number, number>();
          ms.forEach((m, t) => {
            Lm.set(m, 0.3 + 0.02 * s[t + 2] + 0.02 * rng.gauss());
            Hm.set(m, 0.3 + 0.02 * (kind === 'independent' ? s2[t + 2] : s[t]) + 0.02 * rng.gauss());
          });
          return { label: d.colony, L: Lm, H: Hm };
        });
        out[kind] = s2Summary(series, 2, draws, 70000 + 10 * k + (kind === 'independent' ? 1 : 0));
      }
      writeJson(`${dir}/s${k}.json`, out);
      console.log(`S2 set ${k} done`);
    }
    return;
  }
  const zones = base.map((d) => buildZones(d.grid));
  const work = 'logs/h6-synth/V4/work';
  if (cs === 'V4') {
    // one extractor pass per colony builds every missing set of the range (extract.ts --delete a:b)
    // (chunks of --v4-chunk sets per process bound the memory: each rebuilt state holds its onsets and eligibility)
    const chunk = numArg('--v4-chunk', 10);
    const jobs: (() => Promise<void>)[] = [];
    for (let k = a; k < b; k += chunk) {
      for (let c = 0; c < N_COL; c++) {
        const ks = Array.from({ length: Math.min(chunk, b - k) }, (_, q) => k + q);
        if (ks.every((j) => fs.existsSync(`${work}/k${j}-c${c}.json`))) continue;
        jobs.push(() => run('npx', ['vite-node', 'scripts/scratch/h6/extract.ts', '--colony', String(c), '--delete', `${ks[0]}:${ks[ks.length - 1] + 1}`, '--out-dir', work]));
      }
    }
    await pool(jobs, par);
  }
  for (let k = a; k < b; k++) {
    const t0 = Date.now();
    const out: Record<string, unknown> = { case: cs, set: k, draws, boot: B, diagnostic: DIAG.eligInitiator !== undefined ? DIAG : undefined };
    if (cs === 'V4') {
      const rebuilt = base.map((d, c) => ({ ...readJson<SkInput & { deletedShare: number }>(`${work}/k${k}-c${c}.json`), roles: d.roles }));
      out.deletedShare = rebuilt.map((r) => r.deletedShare);
      for (const rule of ['V1', 'V3'] as const) {
        const cols: PCol[] = rebuilt.map((d, c) => {
          const sk = skeleton(d, zones[c], 3, 10).map(blind);
          const rng = RNG.stream(SEED, 50 + ci, k, c, rule === 'V1' ? 1 : 3);
          const heavy = rule === 'V3' ? heavySet(d.roles.length, rng) : new Set<number>();
          const init = assign(sk, rule, rng, heavy);
          return { label: base[c].colony, nAnts: d.roles.length, eps: sk.map((ep, e) => withInit(ep, init[e])) };
        });
        out[`V4-${rule}`] = score(cols, 100000 + ci * 10000 + k * 10 + (rule === 'V1' ? 1 : 3), draws, B);
      }
    } else {
      const rule = cs as 'V1' | 'V2' | 'V3';
      const cols: PCol[] = base.map((d, c) => {
        const sk = skeleton(d, zones[c], 3, 10).map(blind);
        const rng = RNG.stream(SEED, 50 + ci, k, c);
        const heavy = rule === 'V3' ? heavySet(d.roles.length, rng) : new Set<number>();
        const init = assign(sk, rule, rng, heavy);
        return { label: d.colony, nAnts: d.roles.length, eps: sk.map((ep, e) => withInit(ep, init[e])) };
      });
      out[cs] = score(cols, 100000 + ci * 10000 + k * 10, draws, B);
    }
    out.seconds = (Date.now() - t0) / 1000;
    writeJson(`${dir}/s${k}.json`, out);
    console.log(`${cs} set ${k} done (${out.seconds} s)`);
  }
}

function summary(cs: string, dir: string): void {
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^s\d+\.json$/.test(f)) : [];
  const sets = files.map((f) => readJson<Record<string, unknown>>(`${dir}/${f}`));
  console.log(`${cs}: ${sets.length} data sets`);
  if (cs === 'S2') {
    for (const kind of ['shared, H lags L by 2 min', 'independent']) {
      const v = sets.map((s) => s[kind] as { deltaF: number[]; shiftReference: { deltaF: number[]; observedMinusShift: number[] }; crossColony: { pairs: number; deltaF: { mean: number; q025: number; q975: number } } });
      const m = (f: (x: (typeof v)[number]) => number) => (v.reduce((s, x) => s + f(x), 0) / v.length).toFixed(3);
      console.log(`  ${kind}: ΔF(L→H − H→L) ${m((x) => x.deltaF[0])}; shift reference ΔF ${m((x) => x.shiftReference.deltaF[0])}; observed − shift ${m((x) => x.shiftReference.observedMinusShift[0])} (mean CI ${m((x) => x.shiftReference.observedMinusShift[1])}, ${m((x) => x.shiftReference.observedMinusShift[2])}); cross-colony ΔF mean ${m((x) => x.crossColony.deltaF.mean)} [${m((x) => x.crossColony.deltaF.q025)}, ${m((x) => x.crossColony.deltaF.q975)}] over ${v[0]?.crossColony.pairs} ordered pairs`);
    }
    return;
  }
  const keys = cs === 'V4' ? ['V4-V1', 'V4-V3'] : [cs];
  for (const k of keys) {
    const r = sets.map((s) => s[k] as { null1: { ruleMet: boolean; label: string }; null3: { ruleMet: boolean; label: string; supportMet: boolean; coloniesMeetingSupport: number } });
    const n = r.length;
    const n1 = r.filter((x) => x.null1.label !== 'unresolved').length;
    const n3 = r.filter((x) => x.null3.label !== 'unresolved').length;
    const sup = r.filter((x) => x.null3.supportMet).length;
    const n3s = r.filter((x) => x.null3.supportMet && x.null3.label !== 'unresolved').length;
    console.log(`  ${k}: null-1 label fired ${n1}/${n}; null-3 label fired ${n3}/${n} (of the ${sup} with null-3 support met: ${n3s}); null-3 support met in ${sup}/${n} (colonies meeting it: ${r.map((x) => x.null3.coloniesMeetingSupport).join(', ')})`);
  }
}

await main();
