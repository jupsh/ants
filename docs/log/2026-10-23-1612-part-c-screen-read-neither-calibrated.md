---
id: D122
date: 2026-10-23
time: 16:12
kind: reading
title: Part C screen read: neither calibrated driver (Eu, El20) is sufficient; Eu's distance profile stays flat beyond 10 mm where the data's falls to near 0, El20 under-produces 10-min synchrony; separation not evaluable
---
- **2026-10-23 ≈ 16:12 UTC — Part C screen read: neither calibrated driver (Eu, El20) is sufficient; Eu's distance profile stays flat beyond 10 mm where the data's falls to near 0, El20 under-produces 10-min synchrony; separation not evaluable.**
  - **Inputs:** the separation arms (base, Eu at 0.8125, El20 at 1.5; judge seeds 0xc4a2, 2 runs × 22 colonies); the
    Test A dump run per file (D121 amendment); `partC.ts read --stage screen` → logs/partc/screen.json.
    - **Sufficiency rule (D115 amendment 1, D117):** sim − data with data and simulated colonies resampled
      independently (2000 draws).
      - Equivalent if the 90 % CI lies inside ±20 % of the data's value (D_w) or ±0.015 (C).
      - Outside if the CI lies wholly beyond the tolerance.
      - Otherwise unresolved.
  - **Rows** (sim − data, 90 % CI, tolerance; the calibration target all.120 is not a test row):

    | Row | Data | Eu | Class | El20 | Class |
    |---|---|---|---|---|---|
    | D_w all 5 s | 2.63 | +0.20 [−0.08, +0.46] ±0.53 | equivalent | +0.18 [−0.13, +0.48] | equivalent |
    | D_w all 10 min | 6.28 | −0.77 [−1.70, +0.12] ±1.26 | unresolved | −2.49 [−3.29, −1.69] | **outside** |
    | D_w nurse 5 s | 2.28 | −0.01 [−0.32, +0.27] ±0.46 | equivalent | +0.06 [−0.28, +0.36] | equivalent |
    | D_w nurse 1 min | 3.67 | −0.19 [−0.77, +0.36] ±0.73 | unresolved | −0.29 [−0.90, +0.28] | unresolved |
    | D_w nurse 10 min | 5.12 | −0.97 [−1.80, −0.16] ±1.02 | unresolved | −2.08 [−2.84, −1.31] | **outside** |
    | D_w forager 5 s | 1.58 | +0.00 [−0.18, +0.18] ±0.32 | equivalent | −0.05 [−0.23, +0.12] | equivalent |
    | D_w forager 1 min | 2.12 | +0.09 [−0.28, +0.44] ±0.42 | unresolved | −0.09 [−0.43, +0.23] | unresolved |
    | D_w forager 10 min | 3.12 | −0.71 [−1.37, −0.11] ±0.62 | unresolved | −1.22 [−1.85, −0.66] | **outside** |
    | C < 5 mm | 0.092 | +0.009 [−0.002, +0.020] | unresolved | +0.016 [+0.006, +0.026] | unresolved |
    | C 5–10 mm | 0.054 | +0.001 [−0.007, +0.009] | equivalent | +0.009 [+0.002, +0.015] | unresolved |
    | C 10–20 mm | 0.028 | +0.015 [+0.011, +0.020] | unresolved | +0.018 [+0.014, +0.023] | unresolved |
    | C 20–40 mm | 0.012 | +0.026 [+0.022, +0.029] | **outside** | +0.019 [+0.016, +0.022] | **outside** |
    | C ≥ 40 mm | 0.003 | +0.035 [+0.025, +0.044] | **outside** | +0.013 [+0.003, +0.022] | unresolved |

  - **Reading, as fixed:**
    - **Neither calibrated driver is sufficient** within the specified tolerances.
      - Eu: 4 of 13 rows equivalent, 2 outside, 7 unresolved.
      - El20: 3 equivalent, 4 outside, 6 unresolved.
    - **Eu (shared driver)** matches synchrony at 5 s and 1 min, but its co-movement profile stays flat beyond 10 mm
      (0.043, 0.038, 0.038). The data's falls towards 0 (0.028, 0.012, 0.003). A colony-wide signal moves distant
      ants together, and the data shows little of that.
    - **El20 (local disturbances)** keeps more of the distance decay (0.046, 0.031, 0.017), still too high at 20–40 mm.
      It under-produces 10-min synchrony in every group (3.79 vs 6.28 for all ants).
    - **Separation: not evaluable** (D121: no P variant calibrated). The arms' S3–S6 values are in screen.json as
      description only.
  - **Beside (descriptive, D117):**
    - Mean observed moving fraction: base 3.65 %, Eu 3.41 % (−7 %), El20 3.09 % (−15 %); none past the 20 % flag.
    - Realised multiplier along trajectories: Eu E[g] 1.007, SD log g 0.82, acf 60 s 0.38; El20 E[g] 0.984 (ants
      slightly associated with low-disturbance places), SD 0.80, acf 60 s 0.01; no clipping.
    - S5 estimable in 21 of 22 colonies in every arm.
  - **Wording:** "equivalent within the specified tolerances", for those rows only; no mechanism is shown to operate
    or not.
  - **Next (as planned, not run):** the data side of S5 / S6 (`s5Data.ts --after-screen`), then `--stage place`.
    Placement is descriptive only, because nothing was screened. Part C's outcome bears on the user's question
    (D114): the tested mechanisms don't separate in this pipeline, because no P variant reached the target. The
    distance profile, though, already discriminates between the two calibrated drivers and the data.
  - **2026-10-23 ≈ 16:30 UTC — added: simulation-only descriptive values** (screen.json; not screened, 95 % colony
    bootstrap). They were first written into a duplicate entry by a second session that was open at the same time.
    That session deleted the duplicate; the values here are re-read and checked.
    - **S5 Δβ** (crowded − isolated slope, 4.1 mm): base −0.08 [−0.23, 0.07]; Eu −0.19 [−0.35, −0.04]; El20 +0.08
      [−0.04, 0.20].
    - **S6 Spearman of D_w (1 min) against density** over colonies: base 0.44 [−0.04, 0.78]; Eu 0.71 [0.30, 0.91];
      El20 0.81 [0.52, 0.94].
      - Both drivers give positive density scaling with no propagation. A positive S6 in the data would not on its own
        point to propagation.
    - **S3:** ρ − null 1 / null 2 ≤ 0.01 in every arm; lag 20–40 minus < 5 mm ≈ 1.2–1.3 frames in every arm.
    - **S4:** too noisy in base and El20 to describe (95 % CIs about ±13); Eu 0.06 [−0.32, 0.46].
