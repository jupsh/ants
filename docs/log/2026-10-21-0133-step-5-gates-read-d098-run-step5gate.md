---
id: D100
date: 2026-10-21
time: 01:33
kind: reading
title: Step-5 gates read (D098; run step5gate-20261020T212207Z, ok): warm-up not shown equivalent at 900 / 1800 / 3600 vs 7200 (7200 adopted); dt 0.05 vs 0.025 not shown equivalent at 7200; fit not launched (D099); day-1 no-bout ≈ 90 %
---
- **2026-10-21 ≈ 01:33 UTC — Step-5 gates read (D098; run step5gate-20261020T212207Z, ok): warm-up not shown equivalent at 900 / 1800 / 3600 vs 7200 (7200 adopted); dt 0.05 vs 0.025 not shown equivalent at 7200; fit not launched (D099); day-1 no-bout ≈ 90 %.**
  - **Run:** exit 0; the printed input md5s equal the local tree. Outputs fetched to `logs/c2/step5-gate/`.
  - **Warm-up** (dt 0.05; 900, 1800 and 3600 each vs 7200 s): all NOT SHOWN EQUIVALENT, so **7200 s is adopted**
    (D098).
  - **dt** (0.05 vs 0.025 at 7200 s): **NOT SHOWN EQUIVALENT**.
  - **Pattern** (descriptive):
    - most failing rows have Δ near 0 but CIs wider than ±0.5 (e.g. distance.d4 ±1.5, contactsBefore.d1 ±2.7). At
      1600 recruiters the gate is underpowered for C2's between-recruiter variance;
    - some shifts are resolved:
      - warm-up 900: contacts.d8 +1.35 / +1.55, contacts.d4 +1.37 (start 2);
      - dt 0.05: distance.d1 +0.76 (start 1), timeInNest.d4 +0.92, contactsBefore.d1 +2.26 (start 2).
  - **No-bout fraction at both start points:** day 1 ≈ 87–93 %; days 4 / 8 ≈ 2–4 %. The adoption rule allows ≈ 11 % per
    day, so day 1 fails it badly at the start points. Whether the four trophallaxis parameters can move it is what a fit
    would show.
  - **Outcome:** D099's launch condition is not met (the dt gate failed), so **no fit runs**. To the user: launch
    anyway at dt 0.05 / 7200 s as a disclosed provisional fit; raise n for the gates; or dt 0.025 (≈ 2× cost, ≈ 20 h).
