---
id: B002
title: dt dependence of contacts and stay
status: dropped
size: S
priority: 900
note:
outcome: Superseded: measured on the pilot nest model, which step 4/5 replace; Plan step 6 gates dt at the step-5 optimum.
depends:
---
# B002 — dt dependence of contacts and stay

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: STATUS § Open problems and backlog (seeded 2026-10-18).

## Question
Mailleux colony: how do contacts and timeInNest depend on dt (the late-signal test)?

## Progress log

## Findings
Dropped without a run by the lead agent on 2026-10-18, as moot. The reasons, from the night archive
(2026-10-10):
- **What was established.** The late-signal test ruled the handshake lag out as the main cause.
- **Where the shift sat.** The n = 1600 decomposition put the dt 0.1 vs 0.025 shift in the time after unloading
  (−1.5 / −0.75 / −1.85 ± 0.5 s at 1 / 4 / 8 d), on the pilot nest model at returnRate 0.85 /s. Its cause was not
  found.
- **Why that does not carry over.** That model's meeting dynamics and in-nest motion are being replaced: the
  encounter rule with τ_on 0.2 s (chosen for dt invariance) and the step-4 motion, from step 5 onwards. A dt
  study on the old model would not carry over.
- **Where dt is checked now.** Plan step 6 gates dt (and warm-up) at the step-5 optimum, in the form already
  used. If that gate fails on contacts or timeInNest, the pre-registered decomposition (`scripts/decompM1999.ts`)
  is ready.

The unexplained shift on the pilot model stays recorded in the night archive.
