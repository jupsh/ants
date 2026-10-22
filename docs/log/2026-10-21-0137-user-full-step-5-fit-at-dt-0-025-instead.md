---
id: D102
date: 2026-10-21
time: 01:37
kind: decision
title: User: full step-5 fit at dt 0.025 instead of the pilot; pilot killed after 20 s (no output), fit launched
---
- **2026-10-21 ≈ 01:37 UTC — User: full step-5 fit at dt 0.025 instead of the pilot; pilot killed after 20 s (no output), fit launched.**
  - **User** (≈ 01:36 UTC, just after D101's launch): "Actually lets do the full fit at 0.25". Read as dt **0.025**: 0.25
    is ten times coarser than any gated dt, and 0.05 already failed against 0.025 (D100). Flagged to the user; they can
    stop the run if 0.25 was meant.
  - The pilot `step5pilot-20261021T013624Z` was killed with `run.sh kill` after 20 s; no output was written.
  - **Fit:** `fitM1999.ts --layer main --model C2 --roles mix --perNest 4 --dt 0.025 --warmup 7200 --lazy`. Default budget:
    80 recruiters per day, 120-generation cap, two starts plus one IPOP restart, own seeds (no tag). Output
    `data/fits/colony-m1999-c2-main-shared.json`. Script `scripts/scratch/box/run-step5fit025.sh`.
    - Run `step5fit-20261021T013651Z` (box, 62 workers), launched ≈ 01:37 UTC. Upper bound ≈ 20 h at the caps (twice
      D097's dt-0.05 estimate at 7200 s).
  - **Disclosed:**
    - dt 0.025 is the gate's reference level; its equivalence with a finer dt is not shown;
    - the warm-up gate adopted 7200 s at dt 0.05; it was not repeated at 0.025;
    - day-1 no-bout ≈ 90 % at the start points (D100).
  - **Judgment afterwards:** as Rules in force (adoption rule, adequacy, sensitivities, synchrony gate D094), on fresh
    seeds. Box inputs md5-equal to the local tree (D099, D101 checks; nothing changed since).
