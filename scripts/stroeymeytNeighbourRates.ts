/**
 * D083 Part B (amendment 1, D084), data side: neighbour-conditioned stop / leave hazards and rest survival on the
 * Stroeymeyt et al. 2018 fit colonies (main experiment, PreTreatment; development use, as B018), through
 * `NeighbourStats` and the D043 stream (the same recorder the simulated observer uses). Light-phase tables (the
 * comparison) and dark-phase tables beside. E-binned tables (descriptive): site field E from the other phase's
 * still-worker occupancy (5 × 5-mm box sum over its mean on `DATA_NEST`); pooled over ants, so a focal ant's own
 * other-phase rests are not left out (the model side uses other runs only: disclosed).
 *
 *   nice -n 10 npx vite-node scripts/stroeymeytNeighbourRates.ts [--out data/reference/stroeymeyt2018-neighbour-rates.json] [--colonies 20,112]
 *
 * Never reads age- or survival-experiment files (held-out / unused).
 */
import { ActivityStats } from '../src/sim/analysis/activity';
import { phaseOf, STROEYMEYT_CFG } from '../src/sim/analysis/inNest';
import { NeighbourStats, type NbTables } from '../src/sim/analysis/neighbourRates';
import { DATA_NEST, restCounts, SiteField, sumCounts } from '../src/sim/analysis/restPosition';
import { arg, provenance, writeJson } from './lib';
import { cellField, eCounts } from './nbDecomp';
import { colonies, roles, streamColony, type ColonyInfo } from './stroeymeytTracks';

/** Tables without the per-cell arrays (kept small for the reference file). */
const slim = (t: NbTables) => ({ ...t, groups: t.groups.map((g) => ({ ...g, stopCellExp: [], stopCellEv: [], leaveCellExp: [], leaveCellEv: [] })) });

async function reduce(col: ColonyInfo) {
  const roleOf = roles(col);
  const tags = [...roleOf.keys()];
  const index = new Map(tags.map((t, i) => [t, i]));
  const role = tags.map((t) => (roleOf.get(t) === 'nurse' ? 0 : roleOf.get(t) === 'forager' ? 1 : roleOf.get(t) === 'queen' ? 2 : -1));
  const isLight = (t: number) => phaseOf(Math.floor(t / 3600), STROEYMEYT_CFG) === 'light';
  const light = new NeighbourStats(role, STROEYMEYT_CFG.frameDt, isLight);
  const dark = new NeighbourStats(role, STROEYMEYT_CFG.frameDt, (t) => !isLight(t));
  const occ = new ActivityStats(role.map((r) => r === 0 || r === 1), (t) => Math.floor(t / 3600), true);
  await streamColony(col, index, (frame, t, ids, xs, ys, ins) => {
    light.frame(frame, t, ids, xs, ys, ins);
    dark.frame(frame, t, ids, xs, ys, ins);
    occ.frame(frame, t, ids, xs, ys, ins);
  });
  const tl = light.finish();
  const td = dark.finish();
  const rest = occ.restOut();
  const field = (ph: 'light' | 'dark') => cellField(new SiteField(sumCounts(rest.map((r) => restCounts(r, (h) => phaseOf(h, STROEYMEYT_CFG) === ph))), DATA_NEST).field(null));
  const Ed = field('dark');
  const El = field('light');
  const eb = (t: NbTables, E: number[]) => [0, 1].map((g) => ({ leave: eCounts(t, g, 'leave', E), stop: eCounts(t, g, 'stop', E) }));
  return { colony: col.label, light: slim(tl), dark: slim(td), eLight: eb(tl, Ed), eDark: eb(td, El) };
}

async function main() {
  const only = arg('--colonies', '');
  const want = only ? new Set(only.split(',').map((c) => `colony${c.padStart(3, '0')}`)) : null;
  const cols = colonies().filter((c) => !want || want.has(c.label));
  const per: Awaited<ReturnType<typeof reduce>>[] = [];
  for (const col of cols) {
    const t0 = Date.now();
    per.push(await reduce(col));
    console.log(`${col.label}: ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  const out = arg('--out', 'data/reference/stroeymeyt2018-neighbour-rates.json');
  writeJson(out, {
    source: 'Stroeymeyt et al. 2018, main experiment, PreTreatment (fit colonies, development use as B018); Zenodo 10.5281/zenodo.1480665, CC BY 4.0',
    definitions: 'docs/log D083 Part B, amendment 1 (D084); src/sim/analysis/neighbourRates.ts; groups [nurse, forager]; E-binned counts: rows N or A bins, columns E < 0.5, 0.5–1, 1–2, 2–4, ≥ 4',
    provenance: provenance(),
    colonies: per,
  });
  console.log(`wrote ${out} (${per.length} colonies)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
