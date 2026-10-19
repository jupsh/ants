---
id: B013
title: Save and restore of colony state across processes
status: done
size: M
priority: 80
note:
outcome: ColonySim serialises/restores across processes bit-identically (0.7–1.3 MB, ~10–40 ms); proposal.patch ready, unapplied
depends:
---
# B013 — Save and restore of colony state across processes

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: STATUS § Open problems and backlog (seeded 2026-10-18). Scoped by the lead agent 2026-10-18.

## Question
`ColonySim.clone` copies a colony within one process and continues bit-identically. What would it take to
serialise a colony to a pool worker or to disk, and would it pay off? The possible uses:
- shared warm-up snapshots across fit candidates (B008);
- checkpoints inside long single runs;
- resuming pages.

## Why it matters
- Shared warm-ups are Plan step 7's design for the Mailleux refits (4 per nest). Snapshots would extend them to
  candidates and generations.
- The pool tasks are stateless, so a snapshot must cross the process boundary.
- Run B008 first: if it finds no use for snapshots, this item shrinks to a design note.

## Done when
1. **Inventory:** the state a snapshot must hold, and whether structured clone carries each part (classes,
   closures, typed arrays): RNG stream states, minds (drive included), bodies, world fields, contact caches,
   observer and tracker state, diagnostic-switch state.
2. **Prototype** `serialize` / `restore` in `proposal.patch`, with a round-trip test:
   - run to T, snapshot, restore in a fresh process (or through the pool), continue to 2T;
   - the rows must be byte-identical to an uninterrupted run;
   - on one Stroeymeyt and one Mailleux colony.
3. **Cost:** snapshot size, save and restore time.

## Base
Claimed 2026-10-19 by muse-code-01a154a0 at commit `784f21d`. `src/sim/experiments/colonyBles.ts`,
`src/sim/core/clone.ts`, `src/sim/core/rng.ts` and `src/sim/parallel/tasks.ts` were clean; unrelated
B001/B018/STATUS changes by other agents were already dirty and were not touched. B008 is done
(shared warm-ups measured 1.6–2.2×; snapshots are its named extension), so this item kept its full scope.

## Data and roles
No empirical data (colony set-ups only as inputs). Held-out: none.

## Compute
Local, minutes, niced.

## Out of scope
- Using snapshots in a fit (B008, the step-5 design).
- UI.
- Applying the patch.

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->
- 2026-10-19 14:53 UTC · muse-code · Claimed by muse-code-01a154a0 at 784f21d; src/sim/experiments/colonyBles.ts, src/sim/core/clone.ts, src/sim/core/rng.ts, src/sim/parallel/tasks.ts clean (other agents' B001/B018/STATUS changes already dirty, untouched). Reading before runs: inventory ColonySim graph, then prototype generic graph serialize/restore in this folder; if uninterrupted vs split-process continuation hashes differ, prototype fails and Findings say so.
- 2026-10-19 16:22 UTC · muse-code · Cross-process round-trip (roundtrip.ts, niced): Stroeymeyt-config colony (86 ants, dt 0.1) and Mailleux-config colony (23 nestmates + recruiter entering at 60 s), T=1500 steps, snapshot to out/*.snapshot.json, restore in a fresh vite-node process, continue to 3000 steps. Both PASS: final serialised state and observable hash byte-identical to uninterrupted runs (results/roundtrip.json, stamped). Sizes/costs: Stroeymeyt 1,336,496 B, serialise 38.5 ms, restore 32.1 ms; Mailleux 742,759 B, 22.1 ms / 11.4 ms (excl. process start).
- 2026-10-19 16:22 UTC · muse-code · Tests: serialize.test.ts 4/4 pass via this folder's vitest.config.ts (bit-identical continuation; drive+oracle-placebo+slowEp diagnostic state; structuredClone throws on a colony; unregistered function fails closed). proposal.patch (adds src/sim/core/serialize.ts + test/colonySerialize.test.ts) verified unapplied in a clean worktree at 784f21d: git apply ok, vitest colonySerialize+colonyClone 9/9 pass, npx tsc --noEmit clean; worktree removed.
- 2026-10-19 17:00 UTC · lead-claude · Lead review (2026-10-19). Item tests rerun: 4/4 pass; proposal.patch still applies to the working tree (git apply --check). For whoever adopts it: (1) fill() uses push(...items), which spreads whole arrays; large arrays (the ContactPairCache in a big E6 colony, n² entries) can overflow the call stack: use a loop. (2) src/sim/core/serialize.ts would import ColonySim and world classes, so core depends on experiments; src/sim/parallel/ (where it is consumed) fits the layering better. (3) Restore keys on constructor.name: safe under vite-node, but a minified browser build renames classes, so a page cannot use it as is. (4) Typed arrays sharing one buffer are restored as separate buffers (none do today). None affects the round-trip result.

## Findings
**Yes: a `ColonySim` can be serialised to disk / another process and continued bit-identically, for
tens of milliseconds and ~0.7–1.3 MB per colony.** `serialize.ts` (main-tree form in `proposal.patch`:
`src/sim/core/serialize.ts` + `test/colonySerialize.test.ts`) encodes the whole object graph as JSON:
shared references and cycles by id, class instances restored from a 12-class prototype registry
(`ColonySim`, `World`, `Body`, `RNG`, `Ledger`, `SugarDroplet`, `Apparatus`, `PlaneSurface`,
`PathField`, `PheromoneField`, `ContactGrid`, `ContactPairCache`), typed arrays as base64 bytes,
Maps/Sets as entry lists, and `NaN`/`Infinity`/`-0`/`undefined` explicitly. Anything else fails
closed (unknown class, symbol key, accessor, `DataView`, or a function other than the default motor
`walkStep` throws). Evidence: `roundtrip.ts` ran each colony in three fresh processes (uninterrupted
0–3000 steps; write snapshot at 1500; restore in a new process and continue) — for both a
Stroeymeyt-config colony (86 ants, stroeymeyt apparatus/roles/sources/waterInit) and a Mailleux-config
colony (23 nestmates + recruiter entering at 60 s) the final serialised state and the observable hash
(bouts, ant positions/crops/reserves/modes, ledger totals) were byte-identical (`results/roundtrip.json`,
stamped; snapshots in git-ignored `out/`). In-process tests (`serialize.test.ts`, 4/4 via this folder's
`vitest.config.ts`) also cover diagnostic-switch state (`driveSd` drive, oracle placebo, `slowEp`) and
show `structuredClone` throws on a colony. `proposal.patch` was verified without applying it: in a clean
worktree at `784f21d` it applies, its test plus `colonyClone.test.ts` pass 9/9, and `tsc --noEmit` is clean.

**Inventory (Done 1).** A snapshot must hold: `ColonySim` fields (`stepIndex`, `outside`/`forager`/
`feedRun`, `bouts` + open-bout `Map`, `frames`, recruiter state, `foodAdded`, walk parameter objects,
`P`/`o`); per ant `Body` (own `RNG` with cached Gaussian spare) and the plain-object `Mind` (traits,
`WalkState` with 7 per-purpose `RNG` streams, `trip`, `stay`, latent `drive`); `World` (ledger
`Float64Array`, food droplets, `PathField` nest-odour/exit cues, `ContactGrid` cells/hoods,
`PlaneSurface`, trail field if set); caches (`ContactPairCache` sparse pair geometry, grid hoods);
and diagnostic-switch state (oracle OU streams/state, wall/drive/slow-episode RNG arrays and clocks,
aggregation/taxis caches). `ColonySim` stores no closures over state (the only function is `motor`);
module-level memo caches in `walk.ts` recompute bit-identically and need no snapshot. Neither
`structuredClone`/`v8.serialize` nor plain JSON can carry this: functions throw, prototypes are lost,
and JSON additionally loses `Map`/`Set`, typed-array types, shared refs/cycles and non-finite numbers —
hence the custom graph encoding (same object model as the existing `deepClone` in `src/sim/core/clone.ts`).

**Cost (Done 3).** Stroeymeyt 86 ants: 1,336,496 B, serialise 38.5 ms, restore 32.1 ms. Mailleux
24 ants: 742,759 B, 22.1 ms / 11.4 ms (single local timings, excluding process start). The two
`PathField` distance grids dominate the size, so cost scales weakly with ant count. Against a warm-up
of minutes of simulation, snapshots easily pay for the B008/step-7 uses (shared warm-ups across
candidates, checkpoints); they do not replace in-process `clone()` where no process boundary is crossed.

**Caveats.** (1) Not covered: observer/wrapper state living in closures outside `ColonySim` —
`simulateStroeymeyt`'s observer (per-ant noise/tracker/drift RNGs, `ObservedState`s, `InNestAccumulator`/
`ActivityStats`, gap counters) and `observeRecruiter`'s episode/exit maps. Resuming those wrappers
mid-run bit-identically needs that state serialised too (their classes are plain-fielded, so the same
encoder plus registry entries should work; untested). The round-trips above stepped `ColonySim`
directly. (2) Restored sparse cache arrays have explicit `undefined` instead of holes (reads identical).
(3) A custom `motor` other than `walkStep` cannot be snapshotted (fails closed by design).
(4) Timings are one niced local run each, not a benchmark distribution.

**Implication / next steps.** Adopting `proposal.patch` (user's decision) would let pool tasks receive
a warm snapshot instead of re-warming per candidate in step 7, and would give long runs checkpoints.
Suggested follow-ups if adopted: extend the registry to the Stroeymeyt observer state, and measure
snapshot transfer through `scripts/pool.ts` under a real fit design. No main-line decision is changed
by this item; nothing was applied to the main tree.
