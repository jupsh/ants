---
id: D322
date: 2026-11-07
time: 05:16
kind: decision
title: User: ask L0004 answered: calibrate on the 1-min all-ants cell (option 1), rho and tau_L fixed from F108, rental later as its own request; freeze only after the lead's checks
authority: user
scope: T064
---
- **2026-11-07 ≈ 05:16 UTC — User: ask L0004 answered: calibrate on the 1-min all-ants cell (option 1), rho and tau_L fixed from F108, rental later as its own request; freeze only after the lead's checks.**
  - **The user's words** (after the lead's recommendation on L0004, Q42 and Q43): "Yeah, that all sounds good to me."
  - **What was recommended and so accepted** (the draft's §8, `logs/lab/drafts/20261106-0419-t064-1e-prereg.md`, sha256
    `4079cf20…`, D317):
    - (a) data role, **option 1**: one strength per point calibrated on the S1 D_w 1-min all-ants cell, as Part D did
      (D158, D173). That cell is never evidence; every other row is an assessment row on development data, so
      "compatible" means compatible with development data, not validated.
    - (b) ρ = 1.5 and τ_L = 7,200 s **fixed** from F108's block values, disclosed as set from development data. C4
      compatibility therefore reads "consistent with F108", not an independent confirmation, and the stationary twins
      stay the C4 power check.
    - (c) the box rental **later, as its own request** after the bench (docs/BOX.md).
  - **Not yet a frozen pre-registration.** These are the design choices. The draft is frozen as its own log entry, with
    the user's approval, only after:
    1. the lead checks the quoted sources against the records: the calibration target 4.15 ± 0.30 (D158, D173), the
       tolerances (D117, D158), and every frozen reader's hash (D185's `1ff8b42c`, D207, D212, D223);
    2. those readers are reachable from the lab's workspaces: D185's Part D reader is `scripts/scratch/partD2b.ts`,
       git-excluded, so it is absent from a clone (D315); bringing it under `scripts/frozen/` is T062's work (D249);
    3. a panel pre-review of the draft, which needs Codex working in its box (Q42, D323).
  - Under P188 nothing in the design is implemented or run before that freeze. This entry answers ask L0004 (step
    L0004, T064).
