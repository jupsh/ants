---
id: D160
date: 2026-10-25
time: 04:21
kind: design
title: Q03 recheck design (proposal, D159 item 4; awaiting the user's approval, nothing built or run): original vs revised water-init starts at C2 settings, 22 colonies on paired seeds, 20-h runs, late window 14–20 h, five colony-state rows with paired equivalence; the observation window's drift descriptive
---
- **2026-10-25 ≈ 04:21 UTC — Q03 recheck design (proposal, D159 item 4; awaiting the user's approval, nothing built or run): original vs revised water-init starts at C2 settings, 22 colonies on paired seeds, 20-h runs, late window 14–20 h, five colony-state rows with paired equivalence; the observation window's drift descriptive.**
  - **Status: proposal.** Values marked **[confirm]** are the lead's. They bind on the user's approval and are frozen
    before any run (D159 item 4; P49). This is the recheck P02 asks for (A003: "provided the original and revised
    starts converge to the same late-window behaviour … rechecked if walk-on rates or water parameters change").
  - **What was shown before (A003, 2026-10-15):** one seed per start, three colony sizes, start-point parameters (not
    C2), late window 14–20 h. Activity agreed. Bouts in the 143-ant colony approached from both sides and were "not
    yet shown converged … to be rechecked with several seeds at the chosen start point". C1 and C2 have since changed
    the walk-on rates (D080).
    - **Corrected (D161 item 5, 2026-10-25):** A003 also holds that later check, at the chosen start point (b 1.0;
      143 ants × 3 seeds, 70 ants × 2; 20 h): the original start had a transient in 2–8 h and joined by 8–14 h; at
      14–20 h it was read "converged in the behavioural quantities within seed spread; the revised start removes a
      ≈ 8-h transient". The single-seed uncertainty above was the earlier state. The C2 recheck remains due because
      the settings changed after that check.
  - **Compared starts:**
    - **revised** (production): `STROEYMEYT_WATER_INIT`; nurses' body water U(thirst, thirst + 0.06) with empty crops,
      foragers full with crops U(1.4, 2.0) µL from a random source;
    - **original:** body water U(thirst, 1) for every ant, all crops empty (A003's start, as in `tmpDrift.ts --init
      old`).
  - **Settings:** C2's fit (`data/fits/s2018-motion-c2.json`), light phase (26 °C), its dt, the experiment's water and
    sugar sources, no mechanism (base). The 22 fit colonies, each at its own size and composition.
  - **Seeds [confirm]:** per colony one seed, `RNG.stream(0xc4c3, colony)`, shared by both starts (common random
    numbers; the per-ant streams make the starts differ only through the initial water state).
  - **Duration and windows [confirm]:**
    - 20 h per run from t = 0 (the production warm-up of 7200 s plus 18 h);
    - **late window 14–20 h** (A003's), for the primary comparison;
    - the production observation window 2–6 h, for a descriptive drift check.
  - **Rows** (colony-level, from 10-s state samples; definitions as `tmpDrift.ts`) [confirm]:
    1. nurse mean body water;
    2. trophallaxis bouts to nurses per hour;
    3. largest resting-cluster share (in-nest resting ants, centres < 5 mm);
    4. nurse active fraction (in-nest nurses not resting);
    5. forager outside share.
  - **Primary rule: equivalence of the starts in the late window [confirm].**
    - Per row: the mean over colonies of (original − revised), paired by colony; 90 % colony bootstrap, 2,000
      resamples, `RNG.stream(0x5ea0, 30)`.
    - Tolerances: body water ±0.005; bouts ±10 % of the revised mean; largest cluster ±0.03; nurse active ±10 % of the
      revised mean; forager outside ±0.02.
    - **Equivalent:** the interval lies inside ±tolerance. **Outside:** wholly beyond. **Unresolved:** otherwise.
    - **The shortcut is supported at C2 settings** only if all five rows are equivalent. Any row outside: "the starts
      did not converge to the same late-window behaviour at C2 settings". Otherwise: unresolved, with the rows named.
      What follows a failure or an unresolved result is the user's decision (for example, the original start with a
      longer warm-up for Stage 2).
  - **Descriptive (no rule):** each start's 2–6 h window minus its own 14–20 h window, per row. This is the drift
    inside the window production runs observe.
  - **Wording limits (D159 item 4):**
    - a pass covers C2 base only. It is not a proof of convergence for every Stage 1–3 member: a common
      initialisation need not mean a common bias across mechanisms;
    - the rows are colony-state rows, not the assessment rows of Stages 1–3.
  - **Build:** a diagnostic switch for the original start in `simulateStroeymeyt` (off by default, bit-identical when
    off, with a test), and a scratch runner adapted from `tmpDrift.ts` with C2's fit, writing hourly state.
    The runner and reader are frozen by md5 here before the run.
  - **Compute:** 44 runs × 20 h simulated. Estimate ≈ 3–5 h on 15 local cores, from Part C's ≈ 16 CPU-min per 6-h run;
    the first colony is timed. Local, through `run.sh` on T015.
  - **For the user: approve or amend** the seeds, the windows, the five rows and their tolerances, and the pass rule.
