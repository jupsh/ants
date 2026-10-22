---
id: D099
date: 2026-10-20
time: 21:24
kind: decision
title: User: run the step-5 fit as soon as the gates allow (usage nearly out); launch condition fixed
---
- **2026-10-20 ≈ 21:24 UTC — User: run the step-5 fit as soon as the gates allow (usage nearly out); launch condition fixed.**
  - **User:** "My usage is nearly out so you should prioritize running the fit once you get the gate results."
  - **Launch condition** (fixed before reading the gates): the warm-up gate yields a warm-up W (D098's rule; 7200 s if
    none passes) **and** the dt gate passes at W. Then launch
    `fitM1999.ts --layer main --model C2 --roles mix --perNest 4 --dt 0.05 --warmup W --lazy` (`scripts/scratch/box/run-step5fit.sh W`;
    defaults n 80, 120 generations, two starts plus one IPOP restart). If the dt gate fails, no fit runs; it goes to
    the user (D098).
  - `fitM1999.ts` gains `--lazy` (B014, bit-identical; recorded in the fit file). Box copy md5-equal.
  - The day-1 no-bout signal (D098, n 8) does not change the launch. It is judged by the adoption rule after the
    fit.
