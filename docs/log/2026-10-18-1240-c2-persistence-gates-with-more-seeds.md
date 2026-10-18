---
id: D051
date: 2026-10-18
time: 12:40
kind: reading
title: C2 persistence gates with more seeds read (03:49 pre-registration; run `c2gates2-20261018T034927Z`, ok, 3 h 25 m; box md5 of `activity.ts`, `stroeymeytTargets.ts`, `checkS2018Window.ts` equal to the local files; outputs `logs/c2/gate-{window-r28,dt-activity-r24}.log`, `logs/checkS2018-window-c2-c2r28.json`, `logs/checkS2018-dt-c2-c2-activity-r24.json`)
---
- **2026-10-18 ≈ 12:40 UTC — C2 persistence gates with more seeds read (03:49 pre-registration; run
  `c2gates2-20261018T034927Z`, ok, 3 h 25 m; box md5 of `activity.ts`, `stroeymeytTargets.ts`,
  `checkS2018Window.ts` equal to the local files; outputs `logs/c2/gate-{window-r28,dt-activity-r24}.log`,
  `logs/checkS2018-window-c2-c2r28.json`, `logs/checkS2018-dt-c2-c2-activity-r24.json`).** Rule unchanged (90 %
  bootstrap CI of the paired difference inside ±0.5 SE_data). No missing-value cases.
  - **Window gate (28 seeds, 616 runs): all rows pass.**
    - Activity, elapsed 2–8 h vs 8–14 h: `persist.nurse` +0.01 SE [−0.28, 0.31], `persist.forager` +0.05
      [−0.31, 0.43] (the verdicts); spread rows +0.01 [−0.09, 0.10] and +0.02 [−0.07, 0.12] (beside).
    - Motion rows (beside): 6 h vs 12 h 0 of 16 fail, 9 h vs 12 h 0 of 16; largest 6-h shift
      `runStill.P60.nurse` −0.14 [−0.19, −0.09].
  - **dt gate, activity rows (24 seeds, 528 paired runs): 3 of 4 pass.**
    - `persist.nurse` −0.02 SE [−0.33, 0.30], **pass**: the 6-seed point estimate (+0.51) was noise, not a dt
      shift, so option 2 (finer dt) is not indicated.
    - **FAIL `persist.forager` +0.17 SE [−0.19, 0.55]**, on width (upper end 0.05 past the bound), as the 02:05
      power note expected. Spread rows (beside): +0.05 [−0.04, 0.13], +0.04 [−0.06, 0.14].
  - **Open gate failures for the user (no automatic escalation; nothing changed), both on width with small point
    estimates:**
    - dt motion gate: `runStill.P10.forager` +0.14 SE [−0.25, 0.53] (03:47, not yet decided);
    - dt activity gate: `persist.forager` +0.17 SE [−0.19, 0.55].
  - **The fit stays pending** (the user's decision on these two rows, then the go-ahead). Before launch: deploy the
    04:09 speed-up (bit-identical) to the box and check checksums.
