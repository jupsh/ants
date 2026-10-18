---
id: B003
title: leaveCropFrac and nestmate departures
status: dropped
size: S
priority: 900
note:
outcome: Merged: the 1999 side (Table 2b, G3) into B001; E6's leaveCropFrac sensitivity is Plan step 9, not backlog.
depends:
---
# B003 — leaveCropFrac and nestmate departures

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: STATUS § Open problems and backlog (seeded 2026-10-18).

## Question
What is leaveCropFrac's effect on nestmate departures (sensitivity, with E6)?

## Progress log

## Findings
Dropped without a run by the lead agent on 2026-10-18, as a duplicate.
- **The 1999 side.** `leaveCropFrac` largely explains why contacted nestmates almost never leave after receiving
  food (G3, STATUS 2026-10-10). That is the same question as B001, which now covers it: a `leaveCropFrac` scan
  against Table 2b (development) and Table 2a (fit).
- **The E6 side.** The sensitivity "with E6" is Plan step 9 (E6 preparation, `leaveCropFrac` sensitivity), so it
  is not backlog (PROTOCOL: steps of the Plan). Running it earlier would look at E6 before its pre-registered run.
