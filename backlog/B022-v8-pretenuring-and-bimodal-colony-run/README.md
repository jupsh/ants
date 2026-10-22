---
id: B022
title: V8 pretenuring and bimodal colony-run times
status: unscoped
size: ?
priority: 940
note:
outcome:
depends:
---
# B022 — V8 pretenuring and bimodal colony-run times

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: B014 Progress 2026-10-19 (benchmark regression investigation)

## Question
Stepped colony runs (colony122, C2, dt 0.05) take either ~30 s or ~35–38 s, depending on incidental heap layout; the slow mode is V8 allocation-site pretenuring (gone with node --no-allocation-site-pretenuring, B014 2026-10-19). Does it occur on the box (Node 22.22.1, pool workers, long runs), how much fit time does it cost, and should pool workers run with the flag (results are unaffected: a GC setting changes no arithmetic, to be checked byte for byte)?

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
