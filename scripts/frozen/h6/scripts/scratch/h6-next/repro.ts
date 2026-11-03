// Scratch (not committed): H6 self-check (D241 "Self-check before anything is read"; amendment 1 point 5). Compares the
// extractor's --repro output (nurses and foragers only) with the 2026-10-17 files and runs spreadAgg.py on the rebuilt
// events. Prints only the reproduction values and a pass/fail per colony.
//   npx vite-node scripts/scratch/h6/repro.ts
import { execFileSync } from 'node:child_process';
import { readJson } from '../../lib';

interface Data { colony: string; onsets: Record<string, { events: number[] }> }
interface Tb { colony: string; tb: Record<string, { onsets: number; onsetsAfterContact: number }> }
interface Re { colony: string; onsets: { light: { events: number[] } }; tb: Record<string, { onsets: number; onsetsAfterContact: number }>; check: { eventsEqualOnsetStats: boolean; contactFramesMismatched: number; contacts: number } }

let allPass = true;
for (let c = 0; c < 22; c++) {
  const re = readJson<Re>(`logs/h6-work/repro-c${c}.json`);
  const old = readJson<Data>(`logs/contacts/data-c${c}.json`);
  const tb = readJson<Tb>(`logs/contacts/tb-c${c}.json`);
  const a = re.onsets.light.events, b = old.onsets.light?.events ?? [];
  const evOk = a.length === b.length && a.every((v, k) => v === b[k]);
  const labs = [...new Set([...Object.keys(tb.tb), ...Object.keys(re.tb)])].sort();
  const tbOk = labs.every((l) => re.tb[l]?.onsets === tb.tb[l]?.onsets && re.tb[l]?.onsetsAfterContact === tb.tb[l]?.onsetsAfterContact);
  const ok = evOk && tbOk && re.check.eventsEqualOnsetStats && re.check.contactFramesMismatched === 0 && re.colony === old.colony;
  allPass &&= ok;
  const tbs = labs.map((l) => `${l} ${re.tb[l]?.onsets}/${re.tb[l]?.onsetsAfterContact} vs ${tb.tb[l]?.onsets}/${tb.tb[l]?.onsetsAfterContact}`).join(', ');
  console.log(`c${c} ${re.colony}: light onset events ${a.length / 5} vs ${b.length / 5} ${evOk ? 'equal' : 'DIFFER'}; Test B onsets/onsetsAfterContact ${tbs} ${tbOk ? 'equal' : 'DIFFER'}; extractor = OnsetStats ${re.check.eventsEqualOnsetStats}; contact frames mismatched with ContactOnset ${re.check.contactFramesMismatched} → ${ok ? 'PASS' : 'FAIL'}`);
}
// Only the observed ρ is read (it does not depend on spreadAgg's permutations, so --perms 1 keeps the run short); the
// script's other lines are not printed.
const out = execFileSync('python3', ['-I', 'scripts/scratch/spreadAgg.py', 'rebuilt=logs/h6-work/repro-c*.json', '--phase', 'light', '--perms', '1'], { encoding: 'utf8', maxBuffer: 1 << 26 });
const nCol = /\((light); (\d+) colonies/.exec(out)?.[2];
const rho = Number(/A\s+rho ([+-][0-9.]+)/.exec(out)?.[1]);
const rhoOk = rho.toFixed(3) === '0.015';
console.log(`Test A light rho ${rho >= 0 ? '+' : ''}${rho.toFixed(3)} over ${nCol} colonies (F026: +0.015) → ${rhoOk ? 'PASS' : 'FAIL'}`);
console.log(`reproduction: ${allPass && rhoOk ? 'PASS' : 'FAIL'}`);
