---
id: D049
date: 2026-10-18
time: 04:21
kind: decision
title: Backlog B014 filed (user request): event-driven resting ants in the colony runner
---
- **2026-10-18 ≈ 04:21 UTC — Backlog B014 filed (user request): event-driven resting ants in the colony runner.**
  - An opt-in switch, off by default and bit-identical when off, for the step-5 Mailleux colonies. Expected
    1.5–2× on colony runs. **Not needed for C2's step-4 fit** (stepped code). Size L, status open, priority
    for the user.
  - Scope in `backlog/B014-…/README.md`, technical background in `GUIDE.md` there: the per-step processes of a
    resting ant and their event treatments; the C2 drive makes the wake rate change every step, so an exact skip
    is impossible and a drive tick (≈ 1 s) would be a **model change for the user**; metabolism stays stepped at
    first; the equivalence gate (event-driven vs stepped, 36 rows and trip statistics) is pre-registered with the
    user; and the results that depend on the stepping path (trip calibration; C1's judging run).
  - Correction (in the reply, not logged before): the earlier remark that Mailleux, E6 and C1 results would need
    reruns overstated it. E1, the E2 fits, the E6 TEC reference and the tracker don't use the colony runner; the
    Mailleux pilots are unadopted tools. Only the trip calibration and C1's judging run would.
  - Also seen: commit `154055d` (AGENTS.md split, `backlog/`) landed on this branch after `9b3987d`. Another
    session's B012 files are modified in this checkout; left untouched.
