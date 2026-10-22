---
id: D086
date: 2026-10-20
time: 16:31
kind: run
title: Diagnostic round launched (D083 amended, D084; built D085): commands and checks
---
- **2026-10-20 ≈ 16:31 UTC — Diagnostic round launched (D083 amended, D084; built D085): commands and checks.**
  - **Script** `scripts/scratch/box/run-c2diag.sh` (md5 of every input printed first). Common settings:
    `diagS2018.ts --candidate C2 --fit data/fits/s2018-motion-c2.json --seeds diag --reps 11 --dt 0.05 --warmup 7200
    --obs 21600 --rest`. Arms in order:
    - `control` (`--nbr`: Part B);
    - `trait07` (`--set walkOnSd=0.7`), `trait10` (`walkOnSd=1.0`);
    - `drive10` (`nurse.driveSd=1,forager.driveSd=1`), `drive05` (`…=0.5`).

    Then `readDiagRound.ts` (Part A readings) and `reportS2018 --est arm --start control` per arm. Outputs:
    `logs/c2/diag/` on the box.
  - **Seeds:** `diag` purpose (`seedFor(2018, 'diag', 0xd1a9, i)`), the same in every arm. Diagnostics at other points
    have used them before; the judging seeds are not reused.
  - **Box:** idle. SHA-256 of every simulation, script, fit and reference file equals the local tree, except the known
    files outside the run. New tests pass on the box (27 / 27).
  - **Readings:** D083 as amended (D084), operational choices in D085. No arm is adopted; results go to the user as
    inputs to D082 step 3.
  - **Budget:** 5 × 242 runs ≈ 1 h 45 min (D083).
- 2026-10-20 ≈ 16:31 UTC: launched, `run.sh` run `c2diag-20261020T163117Z` (box, 62 workers).
