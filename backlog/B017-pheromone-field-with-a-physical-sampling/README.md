---
id: B017
title: Pheromone field with a physical sampling footprint
status: open
size: M
priority: 130
note:
outcome:
depends:
---
# B017 — Pheromone field with a physical sampling footprint

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: B012 Findings (2026-10-18). Added and scoped by the lead agent 2026-10-18.

## Question
B012 found two problems with `PheromoneField`:
- the point-sampled signal does not converge with grid refinement (the centreline factor f² + (1 − f)² stays
  anywhere in 0.5–1);
- 1-mm deposit pieces alias on cells under 1 mm.

Does a physical trail width or antenna-sampling footprint in millimetres, with deposit spacing tied to the cell
size, fix both, so that B012's check passes?

## Why it matters
- The trail-response model (not yet done in the M1 plan) would otherwise depend on the grid size.
- Nothing current uses the field, so this is not urgent, but it must be fixed before any trail-following result.

## Done when
1. **`proposal.patch`:**
   - a footprint parameter, with provenance `estimated` and a value either sourced or marked provisional for the
     user;
   - deposit spacing ≤ cell / 2;
   - tests;
   - the current behaviour kept as the default, bit-identical.
2. **B012's check** (`../B012-pheromone-field-grid-convergence/convergence.ts`, copied here and pointed at the
   patched copy) passes under its own predeclared rule:
   - centreline and 0.5-mm-offset samples within 10 % at the last refinement;
   - no longitudinal gaps.

## Base
<At claim: commit, and whether `src/sim/world/field.ts`, `src/sim/physics/antPhysics.ts` and
`src/sim/perception/perceive.ts` are dirty.>

## Data and roles
No empirical data, synthetic trails only. Held-out: none.

## Compute
Local, under a minute per check, niced.

## Out of scope
Trail-response behaviour, choosing biological values (proposed to the user), applying the patch.

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->

## Findings
<When done: the answer in a few sentences; evidence (paths in this folder);
confidence and caveats; what it implies; suggested next steps or new items. A
change the main code needs goes in this folder as `proposal.patch`.>
