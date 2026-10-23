---
id: D121
date: 2026-10-23
time: 15:00
kind: reading
title: Part C calibration read (D115 amendment 1, D117): no P variant calibrated, all four missing the target; Eu and El20 calibrated; separation screen not evaluable; box run closed
---
- **2026-10-23 ≈ 15:00 UTC — Part C calibration read (D115 amendment 1, D117): no P variant calibrated, all four missing the target; Eu and El20 calibrated; separation screen not evaluable; box run closed.**
  - **Run:** `partC-20261022T222313Z`, plus carried work from the three earlier boxes (D119). Calibration done 05:10 UTC,
    separation done 06:08 UTC (132 files: base, Eu, El20 × 44). `partc-finish` fetched 2,704 files, md5-checked, then
    destroyed the box.
    - Box cost: Kenya 7.97 h ≈ $3.32; earlier boxes ≈ $0.53 (Threadripper, interruptible, ≈ 0.3 h; Michigan 0.31 h;
      Thailand 0.59 h); failed rentals ≈ $0. **Total ≈ $3.85.**
  - **Calibration (frozen rule, D117), all-ant D_w at 1 min, target 4.15, verification on fresh seeds within ±0.30:**

    | Variant | Evaluated strength : D_w | Selected | Verified D_w | Result |
    |---|---|---|---|---|
    | P4 | 0.25:1.23, 0.5:1.40, 0.75:1.41, 1:1.37, 1.5:1.50, 2:1.52 | 2 (grid top) | 1.54 | miss |
    | P10 | 0.25:1.31, 0.5:1.55, 0.75:1.87, 1:1.96, 1.5:2.16, 2:2.21 | 2 (grid top) | 2.19 | miss |
    | P20 | …, 1.5:3.27, 2:4.87; refinement 1.625:3.46, 1.75:3.95, 1.875:3.87 | 1.75 | 3.80 | miss (by 0.05) |
    | Eu | …, 0.75:3.81, 1:5.74; refinement 0.8125:4.24, 0.875:4.72, 0.9375:5.35 | 0.8125 | 4.42 | calibrated |
    | El10 | 0.25:1.16 … 1.5:1.59, 2:1.94 | 2 (grid top) | 1.99 | miss |
    | El20 | …, 1:2.41, 1.5:4.19, 2:6.54; refinement 1.125:2.81, 1.25:3.18, 1.375:3.61 | 1.5 | 4.39 | calibrated |

  - **Reading, as fixed:**
    - **No P variant calibrated:** the fitted candidates failed to reach the target within the allotted search.
      - P4, P10 and El10 plateau below the target at the top of the grid.
      - P20 came within range in calibration (3.95) but verified at 3.80, outside 4.15 ± 0.30. A miss stays a miss
        (D117).
      - This is a sufficiency failure on magnitude for these propagation variants in this bounded search. It is not
        evidence against propagation in general.
    - **Separation screen: not evaluable.** D117 says that with no P variant, an empty set of comparisons cannot
      pass.
    - **Still to read, as fixed:** the two calibrated E variants' sufficiency (equivalence vs data within the
      specified tolerances). Next: `spreadAgg.py --dump` with data and the separation arms, then `partC.ts read
      --stage screen`. The data-side S5 / S6 (`s5Data.ts --after-screen`) waits until that reading is logged.
  - **Disclosed:** I read the calibration log (selections, verifications, the arms list) at once on fetch. Nothing
    from the separation files or the data side has been read yet.
  - **2026-10-23 ≈ 16:00 UTC — Test A dump, run per file (fixed before any of its output was seen):**
    - **Why:** the sequential `spreadAgg.py` run would take ≈ 2.5–3 h, one data colony ≈ 78 s and one simulated run
      ≈ 29 s (timed with output discarded). It was stopped after 56 min, with no set finished.
    - **Now:** one process per file (22 data + 132 simulated), 14 at a time locally, each seeding its permutations
      with 53. The per-file dumps are merged by set into logs/partc/spread-dump.json.
    - **Effect:** the permutation draws differ from a single sequential pass. The design fixes 1,000 permutations,
      not a seed. Everything else is unchanged.
