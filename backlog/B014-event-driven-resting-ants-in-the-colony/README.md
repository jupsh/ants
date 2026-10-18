---
id: B014
title: Event-driven resting ants in the colony runner
status: open
size: L
priority: 140
note:
outcome:
depends: data/fits/s2018-tracker.json, data/fits/s2018-trips.json, data/reference/stroeymeyt2018-fit-rows.json, data/reference/stroeymeyt2018-activity-rows.json
---
# B014 — Event-driven resting ants in the colony runner

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: STATUS Decisions log 2026-10-18 ≈ 04:09 (speed-up attempt) and the discussion after it. **Technical
background: `GUIDE.md` in this folder. Read it whole first.**

## Question
Can in-nest ants that are resting be consulted only at events (a constant-rate wake time, contact changes, signal and threshold changes, hazard events), behind a switch that is off by default and bit-identical when off, and how much faster are Stroeymeyt and Mailleux colony runs with it?

## Why it matters
- About 95 % of in-nest ants are still, yet each is stepped every 0.05 s.
- Safe bit-identical micro-optimisation is nearly exhausted (≈ 13 % on 2026-10-18).
- The Mailleux 1999 step-5 colonies are about 10× the Stroeymeyt ones, so a 1.5–2× (or larger) speed-up there
  shortens step 5 by days of box time.
- **Not needed for C2's step-4 fit**, which runs on the stepped code.
- If the gain is small, or equivalence can't be shown, the answer is "stay stepped", which is also useful.

## Done when
1. `DESIGN.md` is approved by the user (GUIDE.md, deliverable 1).
2. `proposal.patch` implements an opt-in switch with tests. Switch off: bit-identical (all tests, the rows of the
   three byte-for-byte checks in STATUS 2026-10-18 ≈ 04:09). Switch on: pooled = serial.
3. A stamped local benchmark gives the speed-up on the largest Stroeymeyt colony (colony122) and on one Mailleux
   1999 colony, back to back on an idle machine, plus the Findings. The box equivalence gate is a separate run,
   on the user's go-ahead.

## Base
<At claim: the commit that holds the C2 preparation (ask the user; the C2 code was uncommitted on 2026-10-18
≈ 04:20), and whether the main-tree files below are dirty: `src/sim/experiments/colonyBles.ts`,
`src/sim/behavior/lasiusNestWorker.ts`, `src/sim/perception/contactPairs.ts`, `src/sim/mind/drive.ts`,
`src/sim/experiments/colonyStroeymeyt.ts`.>

## Data and roles
- Stroeymeyt 2018 fit colonies: fit role. Only as simulation inputs (colony sizes, the frozen tracker) and, for
  the equivalence gate, the existing fit targets.
- Mailleux 1999 set-up: as in `fitM1999.ts`, no new data.
- Held-out: none.

## Compute
- Local: tests and benchmarks, niced, minutes.
- Box: the equivalence gate only, a few hours, on the user's go-ahead and never beside a main-line fit unless on
  idle workers.

## Out of scope
- Changing default numerics, any adopted fit, or the model.
- The drive tick is a model change: it is proposed in `DESIGN.md` for the user, not implemented as a default.
- Analytic metabolism (stays stepped in a first version).
- Applying the patch to the main tree.

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->

## Findings
<When done: the answer in a few sentences; evidence (paths in this folder);
confidence and caveats; what it implies; suggested next steps or new items. A
change the main code needs goes in this folder as `proposal.patch`.>
