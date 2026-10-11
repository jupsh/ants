/**
 * Censoring audit for E1 (STATUS 2026-10-09, item 4). The exit-time
 * comparison uses only tracks that reach the final radius; this reports
 * what drops out: the fraction of tracks that are unusable (too short to
 * prepare) and the fraction of usable tracks that never exit, for the
 * Khuong data and for simulated walkers, with how simulated tracks ended
 * (exit vs time limit). Writes nothing.
 *
 * Usage: npx vite-node scripts/censorE1.ts [--fits walk,A0,T] [--ants 1000]
 */
import { KHUONG_PREP, prepareTrack, trackStats, type Track } from '../../src/sim/analysis/trajectory';
import { walkParams } from '../../src/sim/models/walk';
import { khuongTracking } from '../../src/sim/species/lasiusM1';
import { arg, INCLINES, loadKhuong, numArg, readJson } from '../lib';
import { SimPool } from '../pool';

const FITS = arg('--fits', 'walk,A0,T').split(',');
const ANTS = numArg('--ants', 1000);

function audit(tracks: Track[]) {
  let unusable = 0;
  let exits = 0;
  let timeouts = 0;
  const times: number[] = [];
  for (const t of tracks) {
    if (t.end === 'timeout') timeouts++;
    const p = prepareTrack(t, KHUONG_PREP);
    const s = p ? trackStats(p) : null;
    if (!s) unusable++;
    else if (s.exitTime !== null) {
      exits++;
      times.push(s.exitTime);
    }
  }
  times.sort((a, b) => a - b);
  const q = (p: number) => (times.length ? times[Math.min(times.length - 1, Math.round(p * (times.length - 1)))] : NaN);
  const usable = tracks.length - unusable;
  return { n: tracks.length, unusable, usable, exits, timeouts, exitFrac: exits / usable, q: [q(0.1), q(0.5), q(0.9)] };
}

const pool = await SimPool.create();
const pc = (x: number) => `${(100 * x).toFixed(1)} %`;
console.log('per incline: tracks; unusable; usable tracks that exit (fraction); simulated tracks that hit the 600 s limit; exit time q10/q50/q90 (s) of the exiting tracks');
for (let k = 1; k <= 5; k++) {
  console.log(`\nincline ${k} (${((INCLINES[k - 1] * 180) / Math.PI).toFixed(0)}°)`);
  const rows: [string, ReturnType<typeof audit>][] = [['data', audit(loadKhuong(k))]];
  for (const f of FITS) rows.push([f, audit(await pool.e1(walkParams(readJson<any>(`data/fits/e1-${f}.json`).params), { incline: INCLINES[k - 1], ants: ANTS, seed: 7070 + k, dt: 0.02, tracking: khuongTracking(k) }))]);
  for (const [name, a] of rows) {
    // Binomial SE of the exit fraction; z against the data's.
    const d = rows[0][1];
    const se = Math.hypot(Math.sqrt((a.exitFrac * (1 - a.exitFrac)) / a.usable), Math.sqrt((Math.max(d.exitFrac * (1 - d.exitFrac), 0.25 / d.usable) ) / d.usable));
    const z = name === 'data' ? '' : `, z vs data ${((a.exitFrac - d.exitFrac) / se).toFixed(1)}`;
    console.log(`  ${name.padEnd(6)} ${String(a.n).padStart(5)}; unusable ${a.unusable} (${pc(a.unusable / a.n)}); exit ${a.exits}/${a.usable} (${pc(a.exitFrac)}${z}); time limit ${name === 'data' ? '—' : a.timeouts}; exit time ${a.q.map((v) => v.toFixed(0)).join(' / ')}`);
  }
}
pool.close();
