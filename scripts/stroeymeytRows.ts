/**
 * Stroeymeyt et al. 2018 rows on the fit colonies (main experiment,
 * PreTreatment; STATUS, colony split and operational definitions,
 * 2026-10-10). Streams each colony's tracking file through the in-nest
 * accumulator and writes per-colony rows and their across-colony means.
 *
 *   npx vite-node scripts/stroeymeytRows.ts [--out data/reference/stroeymeyt2018-fit-rows.json] [--colonies 20,112]
 *
 * Never reads age- or survival-experiment files (held-out / unused).
 */
import { acrossColonies, colonyRows, InNestAccumulator, STROEYMEYT_CFG, type AntRole } from '../src/sim/analysis/inNest';
import { arg, provenance, writeJson } from './lib';
import { colonies, MM_PER_PX, roles, streamColony, type ColonyInfo } from './stroeymeytTracks';

async function reduce(col: ColonyInfo) {
  const roleOf = roles(col);
  const tags = [...roleOf.keys()];
  const index = new Map(tags.map((t, i) => [t, i]));
  const acc = new InNestAccumulator(tags.map((t) => roleOf.get(t)!), STROEYMEYT_CFG);
  const s = await streamColony(col, index, (frame, t, ids, xs, ys, ins) => acc.frame(frame, (t / 3600) % 24, ids.length, ids, xs, ys, ins));
  const count = (r: AntRole) => [...roleOf.values()].filter((v) => v === r).length;
  return {
    colony: col.label,
    treatment: col.treatment,
    colonySize: col.size,
    ants: { nurse: count('nurse'), forager: count('forager'), queen: count('queen') },
    frames: s.frames,
    /** Lines put back in frame order, and lines dropped for arriving too late. */
    order: { reordered: s.reordered, late: s.late },
    hours: (s.last - s.first) / 3600,
    /** Repeated reads of a tag in a frame: merged, and dropped (disagreeing). */
    duplicates: acc.duplicates,
    rows: colonyRows(acc.result(), STROEYMEYT_CFG),
  };
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
    console.log(`${col.label}: ${r.frames} frames, ${r.hours.toFixed(1)} h, ants ${JSON.stringify(r.ants)}, repeated reads merged ${r.duplicates.merged}, dropped ${r.duplicates.dropped}, lines reordered ${r.order.reordered}, late ${r.order.late}, ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  const out = arg('--out', 'data/reference/stroeymeyt2018-fit-rows.json');
  writeJson(out, {
    source: 'Stroeymeyt et al. 2018, main experiment, PreTreatment (fit colonies); Zenodo 10.5281/zenodo.1480665, CC BY 4.0',
    definitions: 'docs/STATUS.md, 2026-10-10 night: colony split, rows, operational definitions',
    mmPerPx: MM_PER_PX,
    config: STROEYMEYT_CFG,
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
