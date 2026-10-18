---
id: B005
title: Entrance excursions vs foraging trips (path audit)
status: blocked
size: M
priority: 50
note: RESUME has the entrance-excursion trip audit on hold; needs the user's go
outcome:
depends: data/fits/s2018-tracker.json, data/fits/s2018-trips.json
---
# B005 — Entrance excursions vs foraging trips (path audit)

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: STATUS § Open problems and backlog (seeded 2026-10-18); Rules in force (trip inputs); Stroeymeyt
archive 2026-10-15 (diagnostic A). Scoped by the lead agent 2026-10-18.

## Question
- Do short forager trips in the Stroeymeyt fit colonies form a distinct class of entrance excursions? The
  candidate separators are duration, reach from the exit and path shape.
- If so, what single separation rule, applied to data and simulation alike, splits them from foraging trips,
  and what does it do to the trip targets?

## Why it matters
- The trip inputs (`s2018-trips.json`) were calibrated on all trips, including the 30-s survival point.
- "Extra non-foraging excursions" stays a hypothesis in Rules in force until a path audit shows a distinct class.
- What the model does:
  - only 8 % of its sub-30-s trips begin a foraging trip;
  - their rate follows the in-nest forager speed;
  - the model's exits are 1.7–1.8× the data's.
- C2's checks at the optimum include stays and trips.

## Done when
1. **Data:** per phase, the joint distribution of log trip duration and maximum distance from the exit. Compare a
   1- and a 2-component mixture by BIC, pooled and per colony.
2. **Model:** the same for one simulated run at the C2 start point, through the frozen tracker.
3. **Verdict:** yes or no on a distinct class. If yes:
   - a proposed rule;
   - its effect on trip count and on KM survival at 30 / 120 / 600 / 3600 s, data and model.

   The rule is a proposal; the trip inputs stay as they are.

## Base
<At claim: commit, and whether `src/sim/experiments/colonyStroeymeyt.ts`, `src/sim/analysis/inNest.ts` and
`scripts/s2018Lib.ts` are dirty.>

## Data and roles
- Fit colonies (22, PreTreatment): fit. Trip durations were inspected on 2026-10-15.
- Age-experiment colonies: held-out, never.

## Compute
Data side local, minutes. Model side: one local run, about 10 min on 8 workers, niced.

## Out of scope
Recalibrating trips, re-estimating the tracker, changing C2.

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->

## Findings
<When done: the answer in a few sentences; evidence (paths in this folder);
confidence and caveats; what it implies; suggested next steps or new items. A
change the main code needs goes in this folder as `proposal.patch`.>
