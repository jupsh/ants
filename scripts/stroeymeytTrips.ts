/**
 * Forager trip durations of the Stroeymeyt 2018 fit colonies (STATUS
 * 2026-10-15, trip-duration distribution): per colony and phase of the
 * exit, complete trips (exit to the next entry) and trips still open at the
 * end of the PreTreatment file (censored), with the rows' accumulator and
 * definitions (debounce 2). Input of `calibTrips.ts`.
 *   npx vite-node scripts/stroeymeytTrips.ts   → data/reference/stroeymeyt2018-trips.json
 */
import { InNestAccumulator, STROEYMEYT_CFG } from '../src/sim/analysis/inNest';
import { provenance, writeJson } from './lib';
import { colonies, roles, streamColony } from './stroeymeytTracks';

const out: Record<string, unknown> = {};
for (const col of colonies()) {
  const roleOf = roles(col);
  const tags = [...roleOf.keys()];
  const index = new Map(tags.map((t, i) => [t, i]));
  const acc = new InNestAccumulator(tags.map((t) => roleOf.get(t)!), STROEYMEYT_CFG);
  await streamColony(col, index, (frame, t, ids, xs, ys, ins) => acc.frame(frame, (t / 3600) % 24, ids.length, ids, xs, ys, ins));
  const st = acc.result().stays[0];
  out[col.label] = { light: { trips: st.light.trips, open: st.light.tripsOpen }, dark: { trips: st.dark.trips, open: st.dark.tripsOpen } };
  console.log(`${col.label}: ${st.light.trips.length + st.dark.trips.length} complete, ${st.light.tripsOpen.length + st.dark.tripsOpen.length} open`);
}
writeJson('data/reference/stroeymeyt2018-trips.json', { what: 'Forager trips (s) per fit colony and exit phase: complete, and open at the end of the PreTreatment file (censored). STATUS 2026-10-15.', colonies: out, provenance: provenance() });
