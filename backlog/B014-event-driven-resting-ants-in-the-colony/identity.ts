/**
 * B014: byte-for-byte checks of lazy resting ants (DESIGN rev 2, § 7). Each case's full result is serialised and
 * hashed (sha256 of the JSON). Arms:
 *   main     the main checkout (original code; any lazyRest option is ignored there);
 *   off      the worktree with the switch off (must equal main);
 *   on       the worktree with lazyRest (must equal off);
 *   verify   the worktree with lazyRest and the per-step comparison against the full policy (short cases only).
 * Cases: D048's three (C2 1 h colony122; C2 6 h with activity rows colony250; C1 1 h colony112), Mailleux 1999
 * (pilot and C2-proxy motion, days 1/4/8, independent and shared warm-ups, followed nestmates, decomposition),
 * and the 22 fit colonies through the process pool (not in `main` / `verify`). Run from the checkout's root:
 *   npx vite-node backlog/B014-event-driven-resting-ants-in-the-colony/identity.ts --arm off|on|verify|main --out <results file>
 */
import crypto from 'node:crypto';
import { RNG } from '../../src/sim/core/rng';
import { runNest1999, runRecruiter1999, type M1999Day } from '../../src/sim/experiments/colonyMailleux1999';
import { simulateStroeymeyt, type StroeymeytRunOptions } from '../../src/sim/experiments/colonyStroeymeyt';
import { arg, seedFor } from '../../scripts/lib';
import { SimPool } from '../../scripts/pool';
import { C2_DRIVE_START, colonyFromData, loadS2018, loadTrips, s2018Params, simulateAll, S2018_START } from '../../scripts/s2018Lib';
import { m1999Workload } from './m1999Proxy';
import { mergeResult } from './merge';

const arm = arg('--arm', 'off');
const out = arg('--out', '');
if (!['main', 'off', 'on', 'verify'].includes(arm)) throw new Error('--arm main|off|on|verify');
const lazy = arm === 'on' ? { lazyRest: {} } : arm === 'verify' ? { lazyRest: { verify: true } } : {};
const verify = arm === 'verify';
const hash = (x: unknown) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 16);
const trips = loadTrips();
const data = loadS2018().colonies;
const colony = (label: string) => colonyFromData(data.find((c) => c.colony === label)!);
const C2 = s2018Params({ ...S2018_START, ...C2_DRIVE_START[0] }, trips.outRate, 'C2');
const C1 = s2018Params(S2018_START, trips.outRate, 'C1');
const SEED = seedFor(2018, 'diag', 0xb014, 2);
const base = (warmupS: number, obsS: number, dt: number): StroeymeytRunOptions => ({ seed: SEED, phase: 'light', warmupS, obsS, dt, exploreGiveUp: trips.exploreGiveUp, exploreGiveUpSd: trips.exploreGiveUpSd, ...lazy });

const cases: Record<string, () => unknown> = verify
  ? {
      'c2-colony122-10min': () => simulateStroeymeyt(C2, colony('colony122'), base(300, 300, 0.05)),
      'm1999-c2-nest-d8': () => {
        const w = m1999Workload('c2');
        return runNest1999(w.P, { seed: 7, starvationDays: 8, density: w.density, pipetteAccessible: w.accessible, warmup: 300, dt: 0.1, followNestmates: true, decompose: true, ...lazy }, 0, 2);
      },
    }
  : {
      'c2-colony122-1h': () => simulateStroeymeyt(C2, colony('colony122'), base(1800, 3600, 0.05)),
      'c2-colony250-6h-activity': () => simulateStroeymeyt(C2, colony('colony250'), { ...base(7200, 21600, 0.05), activityHours: [0] }),
      'c1-colony112-1h': () => simulateStroeymeyt(C1, colony('colony112'), base(1800, 3600, 0.05)),
      ...Object.fromEntries(
        ['pilot', 'c2'].flatMap((motion) =>
          ([1, 4, 8] as M1999Day[]).map((day) => [
            `m1999-${motion}-d${day}`,
            () => {
              const w = m1999Workload(motion);
              const o = { starvationDays: day, density: w.density, pipetteAccessible: w.accessible, warmup: 300, dt: 0.1, followNestmates: true, decompose: true, ...lazy };
              const independent = Array.from({ length: 4 }, (_, k) => runRecruiter1999(w.P, { ...o, seed: RNG.stream(SEED, day, k).int(2 ** 31) }));
              const shared = [0, 1].flatMap((nest) => runNest1999(w.P, { ...o, seed: SEED }, nest, 4));
              return { independent, shared };
            },
          ]),
        ),
      ),
    };

const results: Record<string, { hash: string; ms: number }> = {};
for (const [name, f] of Object.entries(cases)) {
  const t = performance.now();
  const r = f();
  results[name] = { hash: hash(r), ms: Math.round(performance.now() - t) };
  console.log(`${arm} ${name} ${results[name].hash} ${results[name].ms} ms`);
}
if (arm === 'off' || arm === 'on') {
  // The 22 fit colonies through the process pool (C2 start 0, short window): pooled with the switch must equal pooled without.
  const pool = await SimPool.create();
  const t = performance.now();
  const runs = await simulateAll(pool, C2, data.map((c) => colonyFromData(c)), base(1800, 1800, 0.1), (i) => RNG.stream(SEED, 22, i).int(2 ** 31));
  pool.close();
  results['pooled-22-colonies'] = { hash: hash(runs.map(({ ms: _ms, ...r }) => r)), ms: Math.round(performance.now() - t) };
  console.log(`${arm} pooled-22-colonies ${results['pooled-22-colonies'].hash} ${results['pooled-22-colonies'].ms} ms (${pool.size} workers)`);
}
if (out) mergeResult(out, arm, { cases: results });
