---
id: D101
date: 2026-10-21
time: 01:36
kind: decision
title: User: bounded diagnostic pilot at dt 0.025 instead of the staged full fit at 0.05 (the failed dt gate does not support treating a 0.05 fit as numerically reliable); launched
---
- **2026-10-21 ≈ 01:36 UTC — User: bounded diagnostic pilot at dt 0.025 instead of the staged full fit at 0.05 (the failed dt gate does not support treating a 0.05 fit as numerically reliable); launched.**
  - **User:** "Lets use dt 0.025 for a bounded diagnostic pilot, rather than launch the staged full fit at 0.05. The
    failed gate does not support treating that full fit as numerically reliable." The staged dt 0.05 fit is not run.
  - **Pilot** (pilot conditions, Rules in force: a tool, never judged, adopted, ranked or in the E6 ensemble; own seed
    namespace; its loss is not reported as fit quality):
    `fitM1999.ts --layer main --model C2 --roles mix --perNest 4 --dt 0.025 --warmup 7200 --gens 30 --tag c2-dt025-pilot --lazy`
    → `data/fits/colony-m1999-c2-main-shared-c2-dt025-pilot.json`.
    - The bound: a 30-generation cap per run (two starts plus one IPOP restart), ≈ 5 h at most on the box.
    - dt 0.025 is the gate's reference, so the pilot is not subject to D100's dt failure. Equivalence of 0.025 itself
      with a finer dt is not shown.
  - **What it is for:** whether the four trophallaxis parameters and density can reach the day-1 no-bout bound and the
    rows at all with C2's motion; where the parameters go (bounds); the generation cost at dt 0.025. Any full fit is a
    separate decision.
  - Script `scripts/scratch/box/run-step5pilot.sh`; box inputs md5-equal to the local tree (D099's check; nothing has
    changed since).
- 2026-10-21 ≈ 01:36 UTC: launched, `run.sh` run `step5pilot-20261021T013624Z` (box, 62 workers).
