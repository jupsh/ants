---
id: B006
title: Light/dark contrasts the nest model lacks
status: open
size: S
priority: 90
note:
outcome:
depends:
---
# B006 — Light/dark contrasts the nest model lacks

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: STATUS § Open problems and backlog (seeded 2026-10-18); Stroeymeyt archive 2026-10-15 (trip-duration
form); STATUS comparisons Ra and Q (2026-10-17). Scoped and widened from trip durations alone by the lead agent
2026-10-18.

## Question
The data differ between light and dark in three statistics:

| Statistic | Light vs dark |
|---|---|
| Trip duration, median (same lognormal shape) | 132 s vs 336 s, ×2.5 |
| In-nest activity | ×1.37 |
| Rate of contacts involving a moving ant | ×1.5 |

The nest model has no phase dependence: one simulated window serves both phases, and the loss has an
irreducible phase floor of 16.4. Are the three contrasts one phenomenon or several, and what would the smallest
mechanism that produces them change?

## Why it matters
- The contrasts are disclosed limitations of step 4.
- A light/dark mechanism would be a model change after M1. Knowing whether one factor covers all three makes
  that proposal concrete.
- No effect on the current plan.

## Done when
1. Per-colony light/dark ratios of the three statistics, from existing data rows and logs (no new statistic
   definitions).
2. Their correlation across colonies.
3. A short design note for the user: candidate mechanisms (a phase factor on walk-on rates, on outRate and
   give-up, or both) and the rows each would move. Nothing implemented.

## Base
<At claim: commit; data side only.>

## Data and roles
- Fit colonies: fit, already inspected. Prefer existing reduced rows and logs (`logs/trips/`, the fit rows,
  `logs/contacts/`).
- Age-experiment colonies: held-out, never.

## Compute
None, or minutes locally.

## Out of scope
Implementing anything, changing C2 or the trip inputs, light/dark in the Mailleux set-up.

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->

## Findings
<When done: the answer in a few sentences; evidence (paths in this folder);
confidence and caveats; what it implies; suggested next steps or new items. A
change the main code needs goes in this folder as `proposal.patch`.>
