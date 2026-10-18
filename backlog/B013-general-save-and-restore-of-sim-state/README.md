---
id: B013
title: Save and restore of colony state across processes
status: open
size: M
priority: 80
note:
outcome:
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
<At claim: commit, and whether `src/sim/experiments/colonyBles.ts`, `src/sim/core/clone.ts`,
`src/sim/core/rng.ts` and `src/sim/parallel/tasks.ts` are dirty.>

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

## Findings
<When done: the answer in a few sentences; evidence (paths in this folder);
confidence and caveats; what it implies; suggested next steps or new items. A
change the main code needs goes in this folder as `proposal.patch`.>
