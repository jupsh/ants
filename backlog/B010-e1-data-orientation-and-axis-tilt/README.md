---
id: B010
title: E1 data orientation and axis tilt
status: blocked
size: S
priority: 140
note: E1 is paused (STATUS); not before it resumes
outcome:
depends:
---
# B010 — E1 data orientation and axis tilt

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: STATUS § Open problems and backlog (seeded 2026-10-18). Scoped by the lead agent 2026-10-18, so it is
ready when E1 resumes.

## Question
- **Orientation:** is the E1 data orientation right ("+y uphill" is assumed)?
- **Bias:** the alignment axis is tilted 10–20° at slopes of 20–45°. How much does that bias `alignY` (≈ cos 2·tilt)?

## Why it matters
`alignY` is one of the E1 statistics. A wrong sign, or an uncorrected tilt, biases the slope rows of any E1 fit
and of the Bonavita 2026 held-out test on the adopted walker.

## Done when
1. **Orientation:** whether "+y uphill" holds, from the Khuong 2013 data files' metadata and from the tracks
   themselves (mean displacement direction per slope).
2. **Bias:** the measured tilt per slope and the resulting `alignY` bias, as numbers.
3. **Recommendation:** a correction or a disclosure, for E1's resumption.

## Base
<At claim: commit, and whether `src/sim/analysis/` (trajectory statistics, Khuong parser) is dirty.>

## Data and roles
- Khuong 2013 E1 data, within the role STATUS § Evidence policy gives it. Check that role before opening.
- Bonavita 2026: held-out, never.

## Compute
None, or minutes locally.

## Out of scope
Refitting E1, the Bonavita test, the local-only Khuong segmentation port.

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->

## Findings
<When done: the answer in a few sentences; evidence (paths in this folder);
confidence and caveats; what it implies; suggested next steps or new items. A
change the main code needs goes in this folder as `proposal.patch`.>
