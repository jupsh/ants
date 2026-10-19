---
id: B020
title: Nestmate-only crop gate in the Mailleux runner
status: unscoped
size: ?
priority: 920
note:
outcome:
depends:
---
# B020 — Nestmate-only crop gate in the Mailleux runner

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: B001 lead review 2026-10-19 (recruiter shares P.nest.leaveCropFrac)

## Question
With leaveCropFrac relaxed for nestmates only (recruiter at 0.05), does the Table-2a guard still break at 0.5 and 1.0, and does after-trophallaxis leaving still saturate at 13–19 %?

## Why it matters
<What would change, for which part of the project, depending on the answer.>

## Done when
<A concrete end point: a number, a comparison, a yes/no.>

## Base
<At claim: commit, and whether the main-tree files this item depends on are
dirty in the working tree.>

## Data and roles
<Each data set touched and its role (STATUS § Evidence policy). Held-out: none.
Development data inspected → say so here and get a contamination-log entry
(`docs/contamination/`).>

## Compute
<What runs where, roughly how long, how many workers; niced; never slowing a
main-line run.>

## Out of scope
<What this item will not do, so it stays small.>

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->

## Findings
<When done: the answer in a few sentences; evidence (paths in this folder);
confidence and caveats; what it implies; suggested next steps or new items. A
change the main code needs goes in this folder as `proposal.patch`.>
