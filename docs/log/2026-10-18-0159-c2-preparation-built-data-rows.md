---
id: D044
date: 2026-10-18
time: 01:59
kind: design
title: C2 preparation: built, data rows, feasibility, gate and benchmark design (fixed before running)
---
- **2026-10-18 ≈ 01:59 UTC — C2 preparation: built, data rows, feasibility, gate and benchmark design (fixed before
  running).**
  - **Built (tests 188 / 188, tsc clean; uncommitted):**
    - the drive (`src/sim/mind/drive.ts`, `NestParams.driveSd` / `driveTau`, the forager overlay's `driveSd`);
    - the wall-rule parameter (`NestParams.wallRule`, default 'follow');
    - the activity rows (`src/sim/analysis/activity.ts`, `activityHours` in `simulateStroeymeyt`);
    - C2 in `stroeymeytTargets.ts` (`S2018_FREE_C2`, `S2018_C2_FIXED`, `s2018BoundReading`);
    - `--candidate C2` in `fitS2018` (refuses a cap raise on resume), `checkS2018Window` and `diagS2018`
      (`--rows 36`, `--fit`, `--seeds judge`, purpose unused for 2018 before), and `reportS2018` on 36 rows.

    Tests:
    - σ = 0 bit-identical (any τ); either role alone changes the run;
    - stationarity, unit variance, lag correlation e^(−1) at τ and a mean-one multiplier;
    - each role reached through its own σ (rest-length ratio exp(σ − σ²/2) at z = 1);
    - specular parameter = the diagnostic switch;
    - the activity definitions (ties, eligibility, ≥ 8 ants, top 20 %, windows).

    The promoted `ActivityStats` reproduces the scratch class's output exactly (colony112, 24 h).
  - **Data activity rows** (`data/reference/stroeymeyt2018-activity-rows.json`; 22 colonies, colony208 one window,
    the others two):

    | Row | Mean ± SE | Colonies |
    |---|---|---|
    | `persist.nurse` | z 0.792 ± 0.042 (r 0.66) | 22 |
    | `persist.forager` | z 0.730 ± 0.059 (r 0.62) | 20 |
    | `top20.nurse` | 0.514 ± 0.012 | 22 |
    | `top20.forager` | 0.401 ± 0.013 | 21 |

  - **Feasibility of the shared light / dark prediction:** for every motion row pair, the best single prediction
    reaches max |z| ≤ 2 in both phases even at SE_sim = 0. The tightest pair is `still.nurse` (1.82), then
    `still.forager` (1.21). No pair is forced above 2, so the phase mismatch does not make the adequacy rule
    impossible; it is the loss floor (≈ 16), not a threshold failure. The activity rows are light only.
  - **C2 start points:** C1's two starts (restShape 1.4 lies inside (1.001, 50]), with drive SD 1.0 per role (start
    0, comparison L's level) or 0.3 (start 1).
  - **Gates at C2's start 0, on the box (rules unchanged: per row the 90 % bootstrap CI of the paired difference
    inside ±0.5 SE_data, the smaller SE of the two phases; a failure goes to the user before any setting changes):**
    1. **dt, motion rows:** C1's gate as run (`--mode dt --dts 0.05,0.025 --reps 36 --obs 3600`, warm-up 1200 s),
       with `--candidate C2`; the 32 motion rows (16 simulated).
    2. **dt, activity rows:** `--mode dt --dts 0.05,0.025 --reps 6 --obs 21600 --only activity`. Six seeds × 6 h
       is the same simulated time per colony as 36 × 1 h; each run's 6-h window is the row's own definition.
    3. **Window:** C1's recheck design (`--mode window --reps 4 --windows 21600,32400 --warmup 7200 --dt 0.05`),
       with `--candidate C2`. Motion rows: 6-h prefix vs 12 h (9 h read only if 6 h fails). Activity rows: the 6-h
       window right after the 2-h warm-up vs the next 6 h of the same runs (elapsed 2–8 h vs 8–14 h). Bootstrap
       units are the 88 runs, as before.
  - **Benchmark (the 21-h estimate no longer holds):** one generation's load at each phase, `diagS2018 --candidate
    C2 --at start --reps 11` (242 colony runs, λ = 11) at dt 0.1 and at dt 0.05, 2 h + 6 h, 62 workers. The
    projected fit time (probes, 2 × 30 phase-1 generations side by side, selection batches, ≤ 60 phase-2
    generations) goes to the user with the gate results before any launch.
