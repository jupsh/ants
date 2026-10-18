---
id: B004
title: Form of the slow displacement in still periods
status: open
size: M
priority: 100
note:
outcome:
depends: data/fits/s2018-tracker.json
---
# B004 — Form of the slow displacement in still periods

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: STATUS § Open problems and backlog (seeded 2026-10-18); RESUME (check B: MSD, no common camera drift).
Scoped by the lead agent 2026-10-18.

## Question
In the data, still periods (< 0.6 mm per frame) carry widespread slow sub-threshold displacement, which the
observer variants do not reproduce. What form does it take?
- continuous creep;
- rare micro-steps between true rests;
- tag rotation: head or body turns that move the tag centre.

## Why it matters
- **Creep or tracking error.** The answer decides between two RESUME options: a physical creep arm (it moves
  bodies) and explaining the displacement as tracking error.
- **Contacts and packing.** It bears on the still–still contact count (now disclosed as measurement-ambiguous,
  no longer a blocker) and on packing.
- **Urgency: low.** It blocks neither C2 nor step 5.

## Done when
For still runs ≥ 60 s in the fit colonies:
- the MSD exponent over 1–60 s;
- the step-length distribution against the tracker's noise floor;
- the share of displacement carried by steps above 3× the noise;
- if the tracks carry the tag angle, the relation between angle change and displacement.

The same statistics on one simulated run through the frozen tracker, for comparison. Then a classification in a
few sentences.

## Base
<At claim: commit, and whether `src/sim/analysis/inNest.ts` is dirty.>

## Data and roles
- Fit colonies: fit, inspected in check B.
- Age-experiment colonies: held-out, never.

## Compute
Local, niced. Data side up to an hour, plus one simulated run.

## Out of scope
Model arms, observer or tracker changes, contacts.

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->

## Findings
<When done: the answer in a few sentences; evidence (paths in this folder);
confidence and caveats; what it implies; suggested next steps or new items. A
change the main code needs goes in this folder as `proposal.patch`.>
