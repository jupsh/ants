/**
 * Activity rows of candidate C2 on the Stroeymeyt et al. 2018 fit colonies
 * (main experiment, PreTreatment; definitions STATUS 2026-10-18 ≈ 01:46):
 * per-ant hourly activity through `ActivityStats`, the colony's longest
 * contiguous light block split into complete 6-h windows, persistence and
 * top-20 % spread per group. Writes per-colony rows and their across-colony
 * means.
 *
 *   npx vite-node scripts/stroeymeytActivityRows.ts [--out data/reference/stroeymeyt2018-activity-rows.json] [--colonies 20,112]
 *
 * Never reads age- or survival-experiment files (held-out / unused).
 */
import { ActivityStats, activityRows, ACT_MIN_ANTS, ACT_MIN_PER_H, lightWindows } from '../src/sim/analysis/activity';
import { acrossColonies, phaseOf, STROEYMEYT_CFG } from '../src/sim/analysis/inNest';
import { arg, provenance, writeJson } from './lib';
import { colonies, roles, streamColony, type ColonyInfo } from './stroeymeytTracks';

async function reduce(col: ColonyInfo) {
  const roleOf = roles(col);
  const tags = [...roleOf.keys()];
  const index = new Map(tags.map((t, i) => [t, i]));
  const hourOf = (t: number) => Math.floor(t / 3600);
  const nurse = new ActivityStats(tags.map((t) => roleOf.get(t) === 'nurse'), hourOf);
  const forager = new ActivityStats(tags.map((t) => roleOf.get(t) === 'forager'), hourOf);
  await streamColony(col, index, (frame, t, ids, xs, ys, ins) => {
    nurse.frame(frame, t, ids, xs, ys, ins);
    forager.frame(frame, t, ids, xs, ys, ins);
  });
  const byGroup = { nurse: nurse.out(), forager: forager.out() };
  const hours = [...byGroup.nurse, ...byGroup.forager].flatMap((a) => Object.keys(a).map(Number));
  const windows = lightWindows(hours, (h) => phaseOf(h, STROEYMEYT_CFG) === 'light');
  return { colony: col.label, windows: windows.map((w) => [w[0], w[w.length - 1] + 1]), rows: activityRows(byGroup, windows) };
}

async function main() {
  const only = arg('--colonies', '');
  const want = only ? new Set(only.split(',').map((c) => `colony${c.padStart(3, '0')}`)) : null;
  const cols = colonies().filter((c) => !want || want.has(c.label));
  const per = [];
  for (const col of cols) {
    const t0 = Date.now();
    const r = await reduce(col);
    per.push(r);
    console.log(`${col.label}: ${r.windows.length} windows, ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  const out = arg('--out', 'data/reference/stroeymeyt2018-activity-rows.json');
  writeJson(out, {
    source: 'Stroeymeyt et al. 2018, main experiment, PreTreatment (fit colonies); Zenodo 10.5281/zenodo.1480665, CC BY 4.0',
    definitions: 'docs/STATUS.md, 2026-10-18 ≈ 01:46 UTC: activity rows of candidate C2 (src/sim/analysis/activity.ts)',
    eligibility: { stepFramesPerHour: ACT_MIN_PER_H, minAnts: ACT_MIN_ANTS },
    windows: 'longest contiguous light block (UTC hour keys), complete 6-h windows from its start; [first hour key, end) per colony',
    provenance: provenance(),
    colonies: per,
    across: acrossColonies(per.map((p) => p.rows)),
  });
  console.log(`wrote ${out} (${per.length} colonies)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
