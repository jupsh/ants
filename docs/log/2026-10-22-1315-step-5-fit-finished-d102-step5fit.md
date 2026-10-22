---
id: D103
date: 2026-10-22
time: 13:15
kind: reading
title: Step-5 fit finished (D102; step5fit-20261021T013651Z, ok, 32 h 22 m): no run converged; density and returnRate within 5 % of a box end, so the adoption rule fails on bounds
---
- **2026-10-22 ≈ 13:15 UTC — Step-5 fit finished (D102; step5fit-20261021T013651Z, ok, 32 h 22 m): no run converged; density and returnRate within 5 % of a box end, so the adoption rule fails on bounds.**
  - **Run state** (`npm run runs -- --box`, from files): `step5fit-20261021T013651Z` **ok**, exit 0, elapsed 32 h 22 m
    (D102's upper bound ≈ 20 h), ended 2026-10-22 ≈ 09:59 UTC. The run log has no error or non-finite line. Box idle
    since (no `vite-node` process). `data/fits/colony-m1999-c2-main-shared.json` fetched to the local tree (md5
    `48aa1723…`, equal to the box copy). Nothing was pending a pre-registration; the log and fit file were read in
    full.
  - **Optimizer** (3873 evaluations, 116 528 s):
    - every run stopped at maxGenerations (120); none met tolX;
    - selection-batch losses: start 0 605.3, start 1 384.0, IPOP restart 301.4 (best);
    - restart 1 ended with σ 4.22 and last-30-generation mean drift (encoded units, free order returnRate, shareRate,
      receiveReserve, reserveSd, density) +1.29, −0.06, +0.41, +0.26, −1.28;
    - start 0 also drifted on returnRate (+0.46) and reserveSd (+1.27); start 1 had settled (σ 0.80, drifts ≤ 0.16).
  - **Best point** (box position on the fit's scale, log unless noted):
    - returnRate 0.887 /s, box 1/1200–1, unit **0.983**;
    - shareRate 0.0225, box 0.002–0.1, unit 0.619;
    - receiveReserve 0.936, box 0.2–1 linear, unit 0.920;
    - reserveSd 0.671, box 0.05–2, unit 0.704;
    - density 2.03 /cm², box 2–4 (D094), unit **0.018**;
    - fixed: nestSpeedFactor 0.0405 (C2), shareEnd 0.0195 (Buffin), foragerFrac 0.320.
  - **Bounds:** the fit file's `atBound` is empty because its own flag is unit < 0.01 or > 0.99. The adoption rule
    is 5 %. The project's 5 % check (`s2018AtBound`, step 4) works on the same unit scale (u < 0.05 or > 0.95). On
    that scale density and returnRate are bound hits. Density is a hit on either scale (2.03 is within 5 % of 2).
    returnRate is not a hit if 5 % is read on the value (0.887 is 11 % below 1); this entry uses the unit scale, as
    in step 4. In D094's terms, density at its lower end is "a result, not something to widen". The restart's drift
    runs into both walls, so a longer search would most likely end on them too.
  - **Reading:** the adoption rule's bound condition fails. This does not depend on the judging run. Rows have not
    been evaluated: the fit file stores no per-row values, and condition 4, adequacy, the no-bout bound, the Buffin
    check, the sensitivities and the synchrony gate (D094) are all still to run. Loss 301 over 15 rows (fitZ, debiased,
    with the no-bout penalty) is reported as an optimizer value, not as fit quality.
  - **Disclosed:** not converged (cap hit in every run, restart still moving); dt 0.025 and warm-up 7200 s as D102.
  - **Next:** for the user (Plan steps 6–8 as written, or judge this optimum now under the stopping rule).
