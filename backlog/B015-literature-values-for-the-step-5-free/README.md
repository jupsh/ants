---
id: B015
title: Literature values for the step-5 free parameters
status: done
size: S
priority: 30
note:
outcome: No step-5 free input is fixed by the checked cleared papers; related nest set-ups give only a density prior.
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
`ecbb918` at claim (2026-10-18 15:23 UTC). Desk work only;
`docs/literature.json` and `docs/research/mailleux-rules.md` are clean.

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
- 2026-10-18 15:23 UTC · Codex B015 · Claimed B015. Search only pinned
  cleared page text and the existing 1999 extraction. A parameter is fixable
  only if its measured definition and conditions transfer to the 1999 setup;
  otherwise report a prior range or no value. Record exact pages and missing
  conditions, including negative findings; do not use E6 or inspect uncleared
  papers.
- 2026-10-18 15:25 UTC · Codex B015 · Searched the pinned Lasius page text and the 1999 extraction. Wrote results/literature-table.md with 8 evidence rows and 5 reference-list leads. Verdict: density prior only; no directly fixable shareRate, receiveReserve, reserveSd or returnRate. No source or fit changed; findings complete, pending freshness check and release.
- 2026-10-18 15:25 UTC · Codex B015 · Source table complete; git diff --check passed. backlog.mjs check B015 failed in cmdCheck while parsing empty captured output from currentHashes.ts; running that helper directly returned simHash baf4cb0b4b513531. This item has a Markdown result only and no JSON result to stamp. Ready for release; no parameter change proposed.

## Findings
The [source table](results/literature-table.md) gives a page citation,
conditions, derivation and transfer assessment for each candidate. **None of
the five step-5 free inputs is directly fixable** from the cleared papers.
Mailleux 2000 and Buffin 2011 supply nominal nest densities of order a few
ants/cm², but neither measures the 1999 chamber's area or its local occupancy;
this is a **prior range only**, not a value to fix. Buffin 2011 measures
*Lasius niger* trophallaxis durations and shows fed/starved differences, but
not volume transferred per second, a reserve threshold, a reserve
distribution or the wait to depart after unloading. The duration values
can check bout timing, not set `shareRate`. No antennation-only duration was
found. The table also lists five uncleared titles from Buffin's references
for a possible user clearing decision; none was opened.

Confidence is high in these negative findings **within the pinned cleared
set** and low about the wider literature. The 1999 source remains uncleared;
its existing extraction supplies colony size and fit targets but no nest
dimensions. Fixing or constraining a parameter remains the user's decision.
