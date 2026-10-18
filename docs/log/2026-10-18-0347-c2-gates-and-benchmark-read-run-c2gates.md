---
id: D046
date: 2026-10-18
time: 03:47
kind: reading
title: C2 gates and benchmark read (run `c2gates-20261018T020646Z`, ok, 1 h 39 m; box code checksums equal to the local files; outputs in `logs/c2/`, `logs/checkS2018-{dt,window}-c2-*.json`)
---
- **2026-10-18 ≈ 03:47 UTC — C2 gates and benchmark read (run `c2gates-20261018T020646Z`, ok, 1 h 39 m; box code
  checksums equal to the local files; outputs in `logs/c2/`, `logs/checkS2018-{dt,window}-c2-*.json`).** Rule as
  logged: per row, the 90 % bootstrap CI of the paired difference inside ±0.5 SE_data. A failing gate's rows and
  effect sizes go to the user **before any setting changes. Nothing is changed.** **No missing-value cases** in any
  gate or benchmark batch (every colony of every target's set estimable).
  - **Gate 1, dt 0.05 vs 0.025, motion rows (36 seeds × 22 × 1 h): 15 of 16 pass.**
    - FAIL: `runStill.P10.forager` +0.14 SE [−0.25, 0.53], on width, not shift. C1 at its start point: +0.11
      [−0.11, 0.35], pass.
  - **Gate 2, dt 0.05 vs 0.025, activity rows (6 seeds × 22 × 6 h): 2 of 4 pass** (`top20.nurse`, `top20.forager`).
    - FAIL `persist.nurse` +0.51 SE [−0.10, 1.15]: the point estimate is just past the bound.
    - FAIL `persist.forager` +0.31 SE [−0.43, 1.03].
  - **Gate 3, window (4 seeds, 2-h warm-up, 88 runs).**
    - Motion rows: 6 h vs 12 h **0 of 16 fail**; 9 h vs 12 h 0 of 16.
    - Activity rows, 6 h right after the warm-up vs the next 6 h (elapsed 2–8 vs 8–14 h): **2 of 4 pass** (both
      spread rows).
      - FAIL `persist.nurse` −0.21 SE [−0.94, 0.61];
      - FAIL `persist.forager` −0.09 SE [−1.06, 0.86].
  - **Reading:** the persistence failures are mainly precision. One colony-run's Fisher z varies far more than the
    target's SE_data (nurse 0.042), and the dt arms decorrelate within a run. Only the dt nurse point estimate lies
    outside ±0.5.
    - Approximate power, assuming the means stay: the window gate would need ≈ 5–7 × its runs to resolve the
      persistence rows, the dt gate ≈ 15 × for forager persistence; dt nurse persistence cannot pass at its present
      point estimate at any power.
    - Options for the user, none taken:
      - more seeds for the persistence gates (precision only, no setting change);
      - a finer dt comparison for nurse persistence;
      - another decision on how the persistence rows enter.
  - **Benchmark (242 colony runs = one generation's load, 62 workers):** dt 0.1, 2 h + 6 h: 623 s wall (628
    CPU-min, slowest colony 4.7 min). dt 0.05: 1192 s (1204 CPU-min, slowest 9.6 min). CPU-bound: wall ≈
    CPU / 62.
    - **Projected fit time at the caps:**

      | Stage | Load | Time |
      |---|---|---|
      | Phase-1 probes | 2 starts × 27 evaluations | ≈ 50 min |
      | Phase 1 | 30 generations, both starts side by side (484 runs each) | ≈ 20 min each, ≈ 10.1 h |
      | Selection batches | 2 × 66 runs | ≈ 15 min |
      | Phase-2 probe | 27 evaluations | ≈ 50 min |
      | Phase 2 | 60 generations | ≈ 20 min each, ≈ 19.9 h |
      | Final selection | | ≈ 10 min |
      | **Total** | | **≈ 32 h (≈ $10 of box time)** |

    - Phase 1 may stop earlier by its own rule. C1 took 20.8 h with phase 1 at 2 h.
  - **The fit stays pending** (user's go-ahead, and the gate decision above).
