---
id: B007
title: Stroeymeyt contact observer: write it and validate it against the authors' tool
status: blocked
size: L
priority: 70
note: needs the user: paper not cleared, GPL tool set-up, agreement criterion in STATUS
outcome:
depends:
---
# B007 — Stroeymeyt contact observer: write it and validate it against the authors' tool

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: STATUS § Open problems and backlog (seeded 2026-10-18); Rules in force (contact observer, approved
2026-10-11); Plan step 4. Scoped by the lead agent 2026-10-18.

## Question
- The user approved our own MIT front-contact observer on 2026-10-11. It is to be written from the paper's
  description and published parameter values: 0.6 mm, 10-s merging, 0.14 mm per frame asleep, 2-min
  truncation, the two width ratios.
- **It has not been written:** no code in `src/` or `scripts/`.
- **The work:** write it, then check it against the authors' GPL-3.0 tool, run locally on the fit colonies. The
  agreement criterion is logged in STATUS before the comparison runs.

## Why it matters
- Row 4 (contacts vs density) and row 1's contacts per stay wait on this observer (Plan step 4, Rules in force).
- Rows 1–4 are the step-9 held-out test, so without the observer that test has no contact rows.
- The centre-distance crossings used in the step-4b diagnostics are a different statistic.

## Done when
1. **The observer**, in `proposal.patch` with tests. It is a pure function of frame records, so the same code
   reads data and simulation.
2. **Agreement statistics** per colony × phase (interaction counts, total durations, pair overlap) against the
   pre-logged criterion: pass or fail.

Row 4 itself (data vs model) stays main-line work.

## Before pickup (the user)
- **Source text:** Stroeymeyt et al. 2018 is not in `docs/literature.json`. Either clear it, or allow working from
  the parameter list in STATUS alone.
- **The tool:** where the authors' tool comes from and how it is built.
- **Criterion:** the agreement criterion, logged in STATUS.

## Base
<At claim: commit, and whether `src/sim/analysis/inNest.ts` and `src/sim/experiments/colonyStroeymeyt.ts` are
dirty.>

## Data and roles
- Fit colonies only (fit).
- Age-experiment colonies: held-out, never.

## Licence
- **Clean room:** our observer is a clean-room MIT implementation, so the tool's source is never read.
- **Black box:** the tool is built and run as a black box, local only, excluded via `.git/info/exclude`.
- **What is committed:** only agreement statistics.

## Compute
The tool's runtime on 22 colonies × 24 h is unknown. Measure it on one colony first. L until then.

## Out of scope
Row 4 and body exclusion, the tracker, held-out data.

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->

## Findings
<When done: the answer in a few sentences; evidence (paths in this folder);
confidence and caveats; what it implies; suggested next steps or new items. A
change the main code needs goes in this folder as `proposal.patch`.>
