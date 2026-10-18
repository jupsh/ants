---
id: D039
date: 2026-10-18
time: 01:33
kind: reading
title: comparison T read against the fixed table (22:59)
---
- **2026-10-18 ≈ 01:33 UTC — comparison T read against the fixed table (22:59).** Run `t-20261017T230244Z`
  finished ok (2 h 14 m): 3 row files and 220 reductions, fetched by tar stream (a first fetch mixed the ssh banner
  into the stream and was discarded unread). `python3 -I scripts/scratch/tAgg.py`, output in `logs/t/tAgg.out`; 22
  colonies.
  - **T0.3: packing not reached.** S1 median-NN ratio 0.425 light / 0.432 dark (bar 0.90–1.10; CIs 0.40–0.47), FAIL in
    both phases. S2 0.945 / 0.941 vs data 0.962 / 0.955 ± 0.02, pass (light uncertain). Guards FAIL: moving fraction
    light (ratio to W-spec 1.59); all 8 still-run rows (nurse mean 2.29, forager mean 1.50, nurse P10 1.33, forager
    P10 1.28; SE_sim intervals all above 1.10). Exits L/D and dark moving fraction pass (uncertain); both light/dark
    ratios pass.
  - **T1.0: packing not reached.** S1 0.358 / 0.372, FAIL. S2 0.993 / 0.991, FAIL (overshoots the + 0.02 bound). Guards
    FAIL: moving fraction light 3.05 and dark 1.56; all 8 still-run rows (1.74–3.49). Exits pass (uncertain), the
    light/dark moving-fraction ratio passes (uncertain), and the moving-contact ratio passes.
  - **Reading (mechanical): neither strength reaches the joint packing criterion → "this bounded test did not
    establish the explanation".** Both strengths also fail the guards on their own, so neither would have been usable
    had packing been reached.
  - **Beside (not used, not for choosing strengths):**
    - crossings model / data, still–still: control observer 0.87 / 0.96 (T0.3) and 0.64 / 0.67 (T1.0); M observer
      3.36 / 3.73 and 2.42 / 2.49. Moving-involved: control observer 1.23 / 1.78 and 0.82 / 1.19; M observer
      1.03 / 1.49 and 0.67 / 0.99.
    - W-spec for comparison: still–still control observer 0.27 / 0.31, M observer 0.63 / 0.72; moving-involved
      control observer 0.87 / 1.33, M observer 0.81 / 1.24.
    - occupancy r +0.30 / +0.19 (T0.3) and +0.23 / +0.22 (T1.0).
    - wall-band share 0.020 (T0.3) and 0.026 (T1.0), vs W-spec 0.108.
  - **Description, not a reading:** taxis draws the ants into clumps much tighter than the data (median NN about 0.4 ×
    the data's) and away from the walls. Without any rate change, it lengthens observed still runs by 1.3–3.5× in
    mismatch. The W-spec control's uncertain light-activity pass (WR, 22:55) stays attached. Per the user's
    instruction, nothing further is decided or run until the user has seen this.
