---
id: B001
title: Contacted-nestmate departures (Mailleux 1999 Table 2b, G3)
status: open
size: M
priority: 40
note:
outcome:
depends: scripts/m1999Points.ts
---
# B001 — Contacted-nestmate departures (Mailleux 1999 Table 2b, G3)

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: STATUS § Open problems and backlog (seeded 2026-10-18); the 1999 side of B003 merged in. Scoped by
the lead agent 2026-10-18.

## Question
- **The gap.** In Mailleux 1999 Table 2b, 44–86 % of nestmates leave within 5 min after a trophallactic contact
  with a recruiter, and 69–93 % after another contact (rising with starvation). The model gives about 0–1 %
  after trophallaxis.
- **The suspected cause.** The `leaveCropFrac` constant: an ant whose crop is ≥ 5 % full never leaves, and
  received food does not raise its reserve (STATUS 2026-10-10 audit).
- **The question.** How much of the gap is that constant, and how much would need a contact-triggered leaving
  rule (gap G3, not modelled)?

## Why it matters
- Step 5 is the last revision round driven by the 1999 data (stopping rule). So any structural change to nestmate
  departures must be decided before the step-5 structure is fixed.
- The same rule governs nestmate departures in E6. E6's `leaveCropFrac` sensitivity stays in Plan step 9 and is
  not part of this item.
- STATUS 2026-10-10: "G3 must not be read as a result until this is settled."

## Done when
1. **Code audit:** a few lines on the departure path of a contacted nestmate (`lasiusNestWorker.ts` leave
   condition, `receiveReserve`, what received food does to reserve and crop).
2. **Table:** the Table-2b statistic (existing code in `reportM1999.ts`, `followNestmates`) and the 15 Table-2a
   rows, with `leaveCropFrac` at 0.05 (current), 0.25, 0.5 and 1.0. Run at the existing pilot point, all three
   starvation levels, paired seeds.
3. **Verdict:** can the constant alone give the 1999 pattern (lower after trophallaxis than after other contacts,
   both rising with starvation) without moving any Table-2a row by more than 1 SE_data?
   - If not: a one-page design note for the user on a contact-triggered leaving rule (the percepts it would
     read, its parameters and provenance). No implementation.

## Base
<At claim: commit, and whether `src/sim/behavior/lasiusNestWorker.ts`,
`src/sim/experiments/colonyMailleux1999.ts`, `scripts/reportM1999.ts` and `scripts/m1999Points.ts` are dirty.>

## Data and roles
- Mailleux 1999 Table 2a: fit. Compared only, never fitted.
- Table 2b and "all recruiters leave within 20 min": development. Compared, never fitted. Its n values look
  copied from Table 1 (`docs/research/mailleux-rules.md`), so no significance tests against it.
- Mailleux 1999 is not a cleared paper: use only the extraction in `docs/research/mailleux-rules.md`.
- Held-out: none.

## Compute
Local and niced: 4 levels × 3 days at the pilot design. Under an hour with the pool.

## Out of scope
- E6 (Plan step 9).
- Changing defaults or fits; implementing any rule; step-5 plumbing.
- **Caveat:** the Mailleux runner still has the pilot nest motion, so these results are indicative. Rerun them
  once the step-5 motion is in.

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->

## Findings
<When done: the answer in a few sentences; evidence (paths in this folder);
confidence and caveats; what it implies; suggested next steps or new items. A
change the main code needs goes in this folder as `proposal.patch`.>
