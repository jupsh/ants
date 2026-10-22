/**
 * D083 Part A readings (amendment 1, D084), mechanically, from `diagS2018` outputs of the diagnostic round: the
 * control (C2 as fitted) and the four arms, same diag seeds (paired). Writes nothing.
 *
 * Paired shift per simulated row: the mean over the target's colony-set runs of (arm − control) per run (same seed
 * index), SE = SD / √n over those runs, 90 % interval ± 1.645 SE (as `reportS2018`'s trade). The model has one
 * prediction for both phases, so a phase's shift in SE_data units is that shift over the phase's SE_data.
 * "Toward / away from the data": the sign of the shift against the sign of (data − control) in that phase.
 *
 *   npx vite-node scripts/readDiagRound.ts --dir logs/c2/diag
 *     (reads control.json, trait07.json, trait10.json, drive10.json, drive05.json)
 */
import { combinedZ } from '../src/sim/analysis/compare';
import { arg, readJson } from './lib';
import { s2018TargetsFor } from './s2018Lib';

interface Diag { perColony: { colony: string; rows: Record<string, number> }[]; reps: number; window: unknown }
const DIR = arg('--dir', 'logs/c2/diag');
const ctrl = readJson<Diag>(`${DIR}/control.json`);
const targets = s2018TargetsFor('C2');

interface PhaseShift { phase: 'light' | 'dark'; data: number; seData: number; ctrl: number; ctrlSe: number; arm: number; armSe: number; shiftSd: number; lo: number; hi: number; toward: boolean; zArm: number }

/** Per target (row × phase): the paired shift in SE_data units, its 90 % interval, direction, and the arm's combinedZ. */
function shifts(arm: Diag, simId: string): PhaseShift[] {
  if (JSON.stringify(arm.window) !== JSON.stringify(ctrl.window) || arm.perColony.length !== ctrl.perColony.length) throw new Error('arm and control not paired');
  return targets
    .filter((t) => t.simId === simId)
    .map((t) => {
      const set = new Set(t.colonies);
      const idx = ctrl.perColony.map((_, i) => i).filter((i) => set.has(ctrl.perColony[i].colony));
      const a = idx.map((i) => arm.perColony[i].rows[simId]);
      const c = idx.map((i) => ctrl.perColony[i].rows[simId]);
      if (a.some((x) => !Number.isFinite(x)) || c.some((x) => !Number.isFinite(x))) throw new Error(`${simId}: missing simulated values on the colony set (unjudgeable)`);
      const d = a.map((x, k) => x - c[k]);
      const m = (v: number[]) => v.reduce((x, y) => x + y, 0) / v.length;
      const sd = (v: number[]) => Math.sqrt(v.reduce((x, y) => x + (y - m(v)) ** 2, 0) / (v.length - 1));
      // Seed-noise SE of a row's mean, as reportS2018 (within-colony spread over runs).
      const seRow = (v: number[]) => {
        const by = new Map<string, number[]>();
        idx.forEach((i, k) => by.set(ctrl.perColony[i].colony, [...(by.get(ctrl.perColony[i].colony) ?? []), v[k]]));
        let s = 0;
        for (const x of by.values()) s += sd(x) ** 2 / x.length;
        return Math.sqrt(s) / by.size;
      };
      const dm = m(d);
      const dse = sd(d) / Math.sqrt(d.length);
      const shiftSd = dm / t.se;
      return {
        phase: t.id.endsWith('.dark') ? 'dark' : 'light',
        data: t.mean,
        seData: t.se,
        ctrl: m(c),
        ctrlSe: seRow(c),
        arm: m(a),
        armSe: seRow(a),
        shiftSd,
        lo: (dm - 1.645 * dse) / t.se,
        hi: (dm + 1.645 * dse) / t.se,
        toward: Math.sign(dm) === Math.sign(t.mean - m(c)),
        zArm: combinedZ(m(a), seRow(a), t.mean, t.se),
      };
    });
}

const excl0 = (p: PhaseShift) => p.lo > 0 || p.hi < 0;
const G = ['nurse', 'forager'];
const f2 = (x: number) => x.toFixed(2);
const show = (row: string, ps: PhaseShift[]) =>
  `${row.padEnd(22)} ${ps.map((p) => `${p.phase[0].toUpperCase()} shift ${f2(p.shiftSd)} [${f2(p.lo)}, ${f2(p.hi)}] ${p.toward ? 'toward' : 'away'} (zc ${f2(p.zArm)})`).join(' · ')}`;

function trait(file: string, label: string, read: boolean) {
  const arm = readJson<Diag>(`${DIR}/${file}`);
  console.log(`\n== ${label}${read ? '' : ' (reported beside, not read)'}`);
  const top = G.map((g) => shifts(arm, `top20.${g}.light`)[0]);
  const still = G.flatMap((g) => shifts(arm, `still.${g}.light`));
  const pers = G.map((g) => shifts(arm, `persist.${g}.light`)[0]);
  G.forEach((g, k) => console.log(show(`top20.${g}`, [top[k]])));
  G.forEach((g, k) => console.log(show(`still.${g}`, still.slice(2 * k, 2 * k + 2))));
  G.forEach((g, k) => console.log(show(`persist.${g}`, [pers[k]])));
  if (!read) return;
  const spread = top.map((p) => p.toward && Math.abs(p.shiftSd) >= 3 && excl0(p));
  const stillOk = still.every((p) => Math.abs(p.shiftSd) <= 2);
  const overshoot = pers.filter((p) => p.zArm > 2 && p.arm > p.data);
  const persAway = pers.filter((p) => !p.toward && Math.abs(p.shiftSd) > 2);
  let reading: string;
  if (spread.every(Boolean) && stillOk && !overshoot.length && !persAway.length) reading = 'spread responds to stable heterogeneity';
  else if (spread.every(Boolean)) {
    const why = [...(stillOk ? [] : ['still fraction shifts > 2 SE_data']), ...overshoot.map((_, k) => `persistence overshoots (${G[pers.indexOf(overshoot[k])]})`), ...persAway.map((p) => `persistence moves away > 2 SE_data (${G[pers.indexOf(p)]})`)];
    reading = `responds, with a tradeoff: ${why.join('; ')}`;
  } else reading = 'does not meet the predefined joint response criterion';
  const partial = top.map((p, k) => `${G[k]} top-20 % ${f2(p.shiftSd)} SE_data ${p.toward ? 'toward' : 'away from'} the data`).join(', ');
  console.log(`READING (trait, D083 amended): ${reading}  [${partial}]`);
}

function drive(file: string, label: string, read: boolean) {
  const arm = readJson<Diag>(`${DIR}/${file}`);
  console.log(`\n== ${label}${read ? '' : ' (reported beside, not read)'}`);
  const p10 = shifts(arm, 'runStill.P10.nurse.light');
  const p60 = shifts(arm, 'runStill.P60.nurse.light');
  const top = G.map((g) => shifts(arm, `top20.${g}.light`)[0]);
  console.log(show('runStill.P10.nurse', p10));
  console.log(show('runStill.P60.nurse', p60));
  G.forEach((g, k) => console.log(show(`top20.${g}`, [top[k]])));
  if (!read) return;
  const tails = [...p10, ...p60];
  const down = tails.every((p) => p.shiftSd <= -2 && p.hi < 0);
  const up = tails.every((p) => p.shiftSd >= 2 && p.lo > 0);
  const tailsRead = down ? 'lowering the drive reduces the nurse rest tails' : up ? 'tails respond in the opposite direction' : 'tails: descriptive (neither directional criterion met)';
  const worse = top.filter((p) => !p.toward && Math.abs(p.shiftSd) >= 2 && excl0(p));
  const spreadRead = worse.length ? `lowering the drive worsens spread (${worse.map((p) => G[top.indexOf(p)]).join(', ')})` : 'spread: descriptive (criterion not met)';
  console.log(`READING (drive, D083 amended): ${tailsRead}; ${spreadRead}`);
}

// Every row, every arm (all families reported).
function all(file: string, label: string) {
  const arm = readJson<Diag>(`${DIR}/${file}`);
  console.log(`\n-- all rows, ${label}: shift in SE_data per phase [90 %], arm's combinedZ`);
  for (const simId of [...new Set(targets.map((t) => t.simId))]) console.log('  ' + show(simId.replace(/\.light$/, ''), shifts(arm, simId)));
}

trait('trait10.json', 'trait σ 1.0', true);
trait('trait07.json', 'trait σ 0.7', false);
drive('drive05.json', 'drive σ 0.5 (both roles)', true);
drive('drive10.json', 'drive σ 1 (both roles)', false);
for (const [f, l] of [['trait07.json', 'trait σ 0.7'], ['trait10.json', 'trait σ 1.0'], ['drive10.json', 'drive σ 1'], ['drive05.json', 'drive σ 0.5']]) all(f, l);
