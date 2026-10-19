/**
 * B013 round-trip check (run from the repo root):
 *   npx vite-node backlog/B013-general-save-and-restore-of-sim-state/roundtrip.ts
 * For each colony kind it runs three fresh processes:
 *   full  — step 0..2T uninterrupted;
 *   write — step 0..T, serialise the ColonySim to out/<kind>.snapshot.json;
 *   read  — restore that file in a new process, step T..2T.
 * Pass = the final serialised state and the observable state hash are
 * byte-identical (same SHA-256) in `full` and `read`, for both kinds.
 * Snapshot byte size and serialise/restore times are printed by write/read.
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ColonySim, type ColonyParams } from '../../src/sim/experiments/colonyBles';
import { STROEYMEYT_SOURCES, STROEYMEYT_WATER_INIT, stroeymeytRoles, type StroeymeytColony } from '../../src/sim/experiments/colonyStroeymeyt';
import { stroeymeytApparatus } from '../../src/sim/world/apparatus';
import { LASIUS_NEST, LASIUS_PARAMS } from '../../src/sim/species/lasiusM1';
import { restoreSim, serializeSim } from './serialize';
import { stamp } from '../_lib/stamp';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const P: ColonyParams = { ...LASIUS_PARAMS, nest: LASIUS_NEST };
const T = 1500; // steps to the snapshot; the run continues to 2T

function makeSim(kind: string): ColonySim {
  if (kind === 'stroeymeyt') {
    const c: StroeymeytColony = { label: 'b013', nurses: 60, foragers: 25, noiseSd: 0.1, detection: 0.9 };
    const roles = stroeymeytRoles(c);
    return new ColonySim(P, {
      seed: 4242,
      ants: roles.length,
      roles,
      setup: stroeymeytApparatus(),
      dt: 0.1,
      minutes: (2 * T * 0.1) / 60 + 1,
      foodMinute: Infinity,
      sources: STROEYMEYT_SOURCES,
      waterInit: STROEYMEYT_WATER_INIT(P.nest.thirstFrac),
      exploreGiveUp: 2147,
      exploreOutside: true,
      starvationDays: 0,
      walkSpeedFactor: 1,
      tempC: 26,
    });
  }
  if (kind === 'mailleux') {
    // 23 nestmates (density 1/cm2 in the 56x41 mm chamber) plus a recruiter
    // entering at 60 s, as in colonyMailleux1999's warm-up design.
    return new ColonySim(P, {
      seed: 777,
      ants: 23,
      dt: 0.1,
      minutes: (2 * T * 0.1) / 60 + 1,
      foodMinute: Infinity,
      starvationDays: 1,
      recruiter: { enterAt: 60, cropUl: 2, cropSugar: 0.4, cropWater: 1.6, ingested: 2 },
    });
  }
  throw new Error(`unknown kind ${kind}`);
}

function stepTo(sim: ColonySim, upto: number): void {
  while (sim.stepIndex < upto) sim.step();
}

function observableHash(sim: ColonySim): string {
  const r = sim.result();
  const ants = sim.w.ants.map((a) => [a.body.x, a.body.y, a.body.heading, a.body.cropUl, a.body.reserve, a.body.water, a.mind.mode, a.mind.modeTime, sim.outside[a.body.id]]);
  return createHash('sha256').update(JSON.stringify([r.bouts, ants, sim.w.ledger.total('sugar'), sim.w.ledger.total('water')])).digest('hex');
}

function finalHashes(sim: ColonySim): { state: string; observable: string } {
  return { state: createHash('sha256').update(serializeSim(sim)).digest('hex'), observable: observableHash(sim) };
}

function child(mode: string, kind: string, file?: string): Record<string, string> {
  const args = ['vite-node', fileURLToPath(import.meta.url), mode, kind, ...(file ? [file] : [])];
  const out = execFileSync('npx', args, { cwd: path.join(HERE, '../..'), encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
  const line = out.trim().split('\n').find((l) => l.startsWith('RESULT '));
  if (!line) throw new Error(`${mode}/${kind}: no RESULT line in:\n${out}`);
  return JSON.parse(line.slice('RESULT '.length)) as Record<string, string>;
}

const [mode, kind, file] = process.argv.slice(2);
if (mode === 'full' || mode === 'write' || mode === 'read') {
  let sim: ColonySim;
  let extra: Record<string, unknown> = {};
  if (mode === 'read') {
    const json = fs.readFileSync(file!, 'utf8');
    const t0 = performance.now();
    sim = restoreSim(json);
    extra = { restoreMs: +(performance.now() - t0).toFixed(1), snapshotBytes: Buffer.byteLength(json) };
    stepTo(sim, 2 * T);
  } else {
    sim = makeSim(kind);
    stepTo(sim, mode === 'full' ? 2 * T : T);
    if (mode === 'write') {
      const t0 = performance.now();
      const json = serializeSim(sim);
      extra = { serializeMs: +(performance.now() - t0).toFixed(1), snapshotBytes: Buffer.byteLength(json) };
      fs.mkdirSync(path.dirname(file!), { recursive: true });
      fs.writeFileSync(file!, json);
    }
  }
  console.log(`RESULT ${JSON.stringify({ kind, mode, stepIndex: sim.stepIndex, ...finalHashes(sim), ...extra })}`);
} else {
  const results: Record<string, unknown>[] = [];
  let ok = true;
  for (const k of ['stroeymeyt', 'mailleux']) {
    const snap = path.join(HERE, 'out', `${k}.snapshot.json`);
    const full = child('full', k);
    const write = child('write', k, snap);
    const read = child('read', k, snap);
    const pass = full.state === read.state && full.observable === read.observable;
    ok &&= pass;
    console.log(`${k}: full=${full.observable.slice(0, 12)} read=${read.observable.slice(0, 12)} stateMatch=${full.state === read.state} pass=${pass} snapshotBytes=${write.snapshotBytes} serializeMs=${write.serializeMs} restoreMs=${read.restoreMs}`);
    results.push({ kind: k, pass, full, write, read });
  }
  fs.mkdirSync(path.join(HERE, 'results'), { recursive: true });
  fs.writeFileSync(path.join(HERE, 'results', 'roundtrip.json'), JSON.stringify({ provenance: stamp(HERE), T, results }, null, 2));
  console.log(ok ? 'ROUNDTRIP PASS' : 'ROUNDTRIP FAIL');
  if (!ok) process.exit(1);
}
