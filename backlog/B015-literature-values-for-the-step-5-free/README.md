---
id: B015
title: Literature values for the step-5 free parameters
status: open
size: S
priority: 30
note:
outcome:
depends: docs/literature.json
---
# B015 — Literature values for the step-5 free parameters

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: STATUS Plan, parallel track (b). Added and scoped by the lead agent 2026-10-18.

## Question
From cleared literature only, what values or ranges, each with its source page, exist for the step-5 free
parameters and inputs?

| Parameter or input | What to look for |
|---|---|
| 1999 nest density | colony size and nest area in the 1999 set-up |
| `shareRate` | the trophallactic flow rate |
| `receiveReserve`, `reserveSd` | the reserve threshold for accepting food |
| `returnRate` | the return rate after unloading |
| (checks only) | antennation and contact durations |

## Why it matters
- **Fewer flat directions:** step 5 frees returnRate, shareRate, receiveReserve and reserveSd, plus the 1999
  nest density unless the literature fixes it (k = 4 or 5). Fixing it from the literature removes a flat
  direction.
- **Who decides:** fixing a parameter is the user's decision. This item only collects candidates, and should
  finish before the step-5 design is logged.

## Done when
1. **A table in `results/`**, with columns:
   - parameter;
   - candidate value or range;
   - source (file and page in `.cache/papers`);
   - how it was derived;
   - conditions (species, temperature, sugar concentration, starvation);
   - applicability to the 1999 set-up.
2. **A verdict per parameter:** fixable, prior range only, or nothing found.
3. **A list of uncleared papers that would help:** titles from cleared papers' reference lists only, for the
   user's clearing decision. Not fetched, not read.

## Base
<At claim: commit; desk work only.>

## Data and roles
- **Literature:** cleared papers only (`docs/literature.json`), searched with `rg -n "terms" .cache/papers`.
- **Mailleux 1999:** not cleared. Use only the extraction in `docs/research/mailleux-rules.md`.
- **E6 (Bles 2022):** nothing from it may fix any parameter (Plan).
- **Never** the held-literature folder (sealed, AGENTS.md).
- Held-out: none.

## Compute
None.

## Out of scope
Changing parameters or fits, clearing papers, web searches for new papers.

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->

## Findings
<When done: the answer in a few sentences; evidence (paths in this folder);
confidence and caveats; what it implies; suggested next steps or new items. A
change the main code needs goes in this folder as `proposal.patch`.>
