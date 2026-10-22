/**
 * Per-ant activity vs rest position, data side (pre-registration D076, approved D077), on the Stroeymeyt et al.
 * 2018 fit colonies (main experiment, PreTreatment; development use). Same stream and observed history as the
 * activity rows (`stroeymeytActivityRows.ts`, D043), with still cells recorded. Site field E from the colony's dark
 * hours (the other phase), focal ant left out, normalised on `DATA_NEST`; rest positions and window statistics
 * in the light windows of the activity rows. Checks that zFull on the full D043 ant set reproduces the activity
 * rows exactly; then the across-colony summary and D076's readings, mechanically.
 *
 *   nice -n 10 npx vite-node scripts/stroeymeytRestPosition.ts [--out data/reference/stroeymeyt2018-rest-position.json] [--colonies 20,112]
 *
 * Never reads age- or survival-experiment files (held-out / unused).
 */
import { ActivityStats, activityRows, lightWindows, type AntHours, type AntRest } from '../src/sim/analysis/activity';
import { GROUPS, phaseOf, STROEYMEYT_CFG, type Group } from '../src/sim/analysis/inNest';
import { DATA_NEST, restColony, restCounts, restPosition, restWindow, SiteField, sumCounts, type RestColony } from '../src/sim/analysis/restPosition';
import { arg, provenance, readJson, writeJson } from './lib';
import { readData, summarise } from './restLib';
import { colonies, roles, streamColony, type ColonyInfo } from './stroeymeytTracks';

const REF = 'data/reference/stroeymeyt2018-activity-rows.json';
const ref = readJson<{ colonies: { colony: string; rows: Record<string, number> }[] }>(REF);

async function reduce(col: ColonyInfo) {
  const roleOf = roles(col);
  const tags = [...roleOf.keys()];
  const index = new Map(tags.map((t, i) => [t, i]));
  const hourOf = (t: number) => Math.floor(t / 3600);
  const st = { nurse: new ActivityStats(tags.map((t) => roleOf.get(t) === 'nurse'), hourOf, true), forager: new ActivityStats(tags.map((t) => roleOf.get(t) === 'forager'), hourOf, true) };
  await streamColony(col, index, (frame, t, ids, xs, ys, ins) => {
    st.nurse.frame(frame, t, ids, xs, ys, ins);
    st.forager.frame(frame, t, ids, xs, ys, ins);
  });
  const act: Record<Group, AntHours[]> = { nurse: st.nurse.out(), forager: st.forager.out() };
  const rest: Record<Group, AntRest[]> = { nurse: st.nurse.restOut(), forager: st.forager.restOut() };
  const hours = [...act.nurse, ...act.forager].flatMap((a) => Object.keys(a).map(Number));
  const windows = lightWindows(hours, (h) => phaseOf(h, STROEYMEYT_CFG) === 'light');

  // Check (D076): the activity rows on the full D043 ant set reproduce the reference rows exactly.
  const rows = activityRows(act, windows);
  const want = ref.colonies.find((c) => c.colony === col.label)?.rows;
  if (!want) throw new Error(`${col.label}: not in ${REF}`);
  for (const k of Object.keys(want)) if (!Object.is(rows[k], want[k]) && !(Number.isNaN(rows[k]) && want[k] === null)) throw new Error(`${col.label}: ${k} ${rows[k]} ≠ reference ${want[k]}`);

  // Site field from the dark hours, every worker; each focal ant's own dark still steps left out.
  const dark = (h: number) => phaseOf(h, STROEYMEYT_CFG) === 'dark';
  const own: Record<Group, Float64Array[]> = { nurse: rest.nurse.map((r) => restCounts(r, dark)), forager: rest.forager.map((r) => restCounts(r, dark)) };
  const field = new SiteField(sumCounts([...own.nurse, ...own.forager]), DATA_NEST);
  const out = {} as Record<Group, RestColony>;
  const perWindow = {} as Record<Group, ReturnType<typeof restWindow>[]>;
  for (const g of GROUPS) {
    const E = own[g].map((o) => field.field(o));
    perWindow[g] = windows.map((w) => restWindow(act[g], act[g].map((a, i) => restPosition(a, rest[g][i], w, E[i])), w));
    out[g] = restColony(perWindow[g]);
  }
  return { colony: col.label, windows: windows.map((w) => [w[0], w[w.length - 1] + 1]), groups: out, perWindow };
}

async function main() {
  const only = arg('--colonies', '');
  const want = only ? new Set(only.split(',').map((c) => `colony${c.padStart(3, '0')}`)) : null;
  const cols = colonies().filter((c) => !want || want.has(c.label));
  const per: Awaited<ReturnType<typeof reduce>>[] = [];
  for (const col of cols) {
    const t0 = Date.now();
    per.push(await reduce(col));
    console.log(`${col.label}: ${per[per.length - 1].windows.length} windows, check passed, ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  const summary = Object.fromEntries(
    GROUPS.map((g) => {
      const s = summarise(per.map((p) => p.groups[g]));
      return [g, { ...s, reading: readData(s) }];
    }),
  );
  const out = arg('--out', 'data/reference/stroeymeyt2018-rest-position.json');
  writeJson(out, {
    source: 'Stroeymeyt et al. 2018, main experiment, PreTreatment (fit colonies, development use); Zenodo 10.5281/zenodo.1480665, CC BY 4.0',
    definitions: 'docs/log D076 (pre-registration, approved D077), D078 (code); src/sim/analysis/restPosition.ts',
    field: 'dark-hour still occupancy of all workers, focal ant left out, 5 × 5-mm box sum over its mean on DATA_NEST',
    provenance: provenance(),
    colonies: per,
    summary,
  });
  console.log(`wrote ${out} (${per.length} colonies)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
