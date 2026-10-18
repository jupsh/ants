---
id: D054
date: 2026-10-18
time: 15:18
kind: reading
title: C2 last dt seed batch read (12:45 pre-registration; run `c2gates3-20261018T124606Z`, ok, 2 h 31 m; outputs `logs/c2/gate-dt-{motion-r72,activity-r48}.log`, `logs/checkS2018-dt-c2-c2-{motion-r72, activity-r48}.json`)
---
- **2026-10-18 ≈ 15:18 UTC — C2 last dt seed batch read (12:45 pre-registration; run `c2gates3-20261018T124606Z`, ok,
  2 h 31 m; outputs `logs/c2/gate-dt-{motion-r72,activity-r48}.log`, `logs/checkS2018-dt-c2-c2-{motion-r72,
  activity-r48}.json`).** Rule unchanged. No missing-value cases.
  - **Bit-identity on the box:** the recomputed overlapping rep (motion rep 35, activity rep 23) equals the earlier
    files in all 22 colonies, both arms. The 04:09 speed-up reproduces the gates' code exactly at this scale.
  - **Verdicts: both rows pass.**
    - `runStill.P10.forager` (72 seeds): +0.20 SE [−0.06, 0.47], **pass**.
    - `persist.forager` (48 seeds): −0.12 SE [−0.36, 0.14], **pass** (the 24-seed +0.17 was noise).
  - Beside (earlier passes stand): every other motion row passes at 72 seeds (largest `runMove.P2.forager` −0.25
    [−0.33, −0.17]); the other activity rows pass at 48 seeds.
  - **All C2 numerical gates now pass at the start point** (dt 0.05 vs 0.025 on 36 rows; window: motion 6 h and
    activity 2–8 h vs 8–14 h). Settings unchanged: phase 1 dt 0.1, phase 2 and judging dt 0.05.
  - **Next: the C2 fit (≈ 28 h on the box, 01:59 / 03:47 budget), on the user's go-ahead only.**
