---
id: D087
date: 2026-10-20
time: 18:22
kind: reading
title: Diagnostic round read (D083 amended, D084; run c2diag-20261020T163117Z, ok, 1 h 50 m): trait σ 1.0 responds, with a tradeoff; drive σ 0.5 readings descriptive; Part B: counteracting components or no resolved gap in every row
---
- **2026-10-20 ≈ 18:22 UTC — Diagnostic round read (D083 amended, D084; run c2diag-20261020T163117Z, ok, 1 h 50 m): trait σ 1.0 responds, with a tradeoff; drive σ 0.5 readings descriptive; Part B: counteracting components or no resolved gap in every row.**
  - **Run:** D086's script, all five arms and both readers exit 0 (`exit` 0), 1 h 50 m on the box. The md5 of every
    input printed at launch (15 files) equals the local tree (`md5sum -c`). Outputs fetched in one tar stream to
    `logs/c2/diag/` (five arms' `.json` / `.log`, `readings.log`, `report-*.log`) and `logs/runs/c2diag-20261020T163117Z/`.
    Readings below are the readers' own output (`readDiagRound.ts`, `nbDecomp.ts`), copied, not recomputed.
  - **Control (C2 as fitted, diag seeds):** 16 of 36 rows |combinedZ| > 3 (the judging seeds gave 15, D081), loss 965;
    the same failing rows as D081. Every arm's shift is paired against it.
  - **Part A, trait (read at walkOnSd 1.0): "responds, with a tradeoff"**, named failures: still fraction shifts
    > 2 SE_data (2.3 / 2.7 nurse, 2.3 / 2.2 forager, L / D, all toward the data); persistence overshoots in both groups.
    - Spread: top-20 % shifts 10.8 [10.5, 11.1] SE_data (nurse) and 7.5 [7.2, 7.8] (forager), both toward the data;
      0.361 → 0.491 (data 0.514, zc −1.8) and 0.286 → 0.384 (0.401, zc −1.3).
    - Persistence: 0.658 → 1.06 (data 0.792, zc 6.1) and 0.439 → 0.967 (0.730, zc 3.9). Neither moves away from the data
      (both shifts are toward it, then past it).
    - Other rows, descriptive: the nurse rest tails do not improve (P10 zc 10.4 / 10.9, P60 5.5 / 7.7; P60 shifts 0.9
      SE_data away). The forager still-run mean and P2 still nurse move toward the data. 13 of 36 rows > 3, loss 664.
    - **walkOnSd 0.7, beside (not read):** top-20 % 4.8 / 3.5 SE_data toward (zc −7.7 / −5.3), still fraction shifts
      ≤ 1.03, persistence zc 1.9 / 0.5, neither away. The joint criterion's conditions all hold there (informative, per
      amendment 1), but the spread stays far from the data. 15 of 36 rows > 3, loss 744.
  - **Part A, drive (read at driveSd 0.5, both roles):**
    - **Tails: descriptive, neither directional criterion met.** Nurse P(still ≥ 10 s) shifts **up** 0.32 [0.05, 0.59] /
      0.38 [0.06, 0.70] SE_data, P(still ≥ 60 s) **down** 7.4 / 8.2.
    - **Spread: "lowering the drive worsens spread" not met.** Top-20 % moves slightly *toward* the data, 1.50 (nurse)
      and 0.38 (forager) SE_data.
    - Descriptive: lowering the drive makes ants much more active (still fraction shifts −7.8 / −9.1 nurse, −11.1 /
      −10.6 forager; zc down to −22). It also raises short-stop P2 still (+5.3 / +5.6 nurse), raises persistence (+5.7
      nurse, +2.5 forager SE_data) and shortens still runs. 25 of 36 rows > 3, loss 2315.
    - **driveSd 1, beside:** the same direction, smaller (P10 nurse −0.17 / −0.21, CI includes 0; P60 −5.8 / −6.4;
      top-20 % +1.1 / +0.2). 24 of 36 rows > 3, loss 1790.
  - **Part B (light phase, control arm; gap = model − data = C + W, 95 % intervals):**

    | group · quantity | gap | C (composition) | W (conditional) | reading |
    |---|---|---|---|---|
    | nurse · leave (/s) | 0.0084 [0.0059, 0.0106] | 0.0087 [0.0071, 0.0103] | −0.0003 [−0.0032, 0.0024] | counteracting components |
    | nurse · stop (/s) | −0.0025 [−0.042, 0.036] | −0.108 [−0.133, −0.087] | 0.106 [0.077, 0.134] | no resolved aggregate gap |
    | nurse · P(still ≥ 10 s) | 0.028 [0.005, 0.048] | −0.047 [−0.058, −0.038] | 0.075 [0.059, 0.088] | counteracting components |
    | forager · leave | 0.0100 [0.0050, 0.0151] | 0.0100 [0.0073, 0.0131] | −0.0001 [−0.0051, 0.0061] | counteracting components |
    | forager · stop | 0.084 [0.056, 0.115] | −0.036 [−0.047, −0.024] | 0.120 [0.097, 0.144] | counteracting components |
    | forager · P(still ≥ 10 s) | 0.007 [−0.004, 0.017] | −0.024 [−0.030, −0.019] | 0.032 [0.022, 0.039] | no resolved aggregate gap |

    - No row reads "dominated by" either component. No bin was unestimable.
    - **Disclosed, not a re-reading:** the "counteracting" rule compares the point signs of C and W (amendment 1;
      `nbDecomp.ts` line 142). In both leaving rows W is ≈ 0 with an interval spanning 0, and C ≈ the whole gap
      (C / gap ≈ 1.0). By the rule as frozen, the reading stays "counteracting components".
    - **Tables (descriptive, `control.json` → `nbr.tables`):**
      - *Where ants are:* the model puts still exposure and rest starts at lower A, and moving exposure at lower N,
        than the data. Nurse still exposure at A = 1–2: 0.45 model vs 0.13 data. Nurse rest starts at A = 1: 0.34 vs
        0.11. Moving exposure at N = 0: nurses 0.39 vs 0.20, foragers 0.39 vs 0.32.
      - *Conditional rates:* across neighbourhood size they are flatter in the model.
        - Nurse leaving at A = 1 → 9+: model 0.037 → 0.008 /s, data 0.047 → 0.0036.
        - Nurse stop hazard at N = 0 → 6+: model 0.78 → 1.19 /s, data 0.51 → 1.29.
        - Forager stop: model 0.69 → 1.03, data 0.43 → 1.15.
        - Nurse P(still ≥ 10 s) is higher in the model in every A bin (0.25 vs 0.14 at A = 1, 0.47 vs 0.41 at
          A ≥ 9).
    - **No causal conclusion** (amendment 1, point 5). The pattern does not identify a mechanism, and it does not show
      a site mechanism to be necessary.
  - **D076 per arm** (descriptive): S stays ≈ 0 in every arm (nurse −0.004 … 0.000, forager −0.016 … 0.002; data 0.047
    / 0.087), and z_E stays near 0 (data −0.21 / −0.34). The trait arm moves zFull (nurse 0.66 → 1.06) without making
    activity spatial.
  - **Outcome:** none of the arms is adopted, ranked or fitted. These readings go to the user as inputs to D082 step 3
    (whether to build one bounded C3, and which). Mapped onto D083's "what the readings feed", the trait reading is
    "responds, with a tradeoff", not the clean case, and no Part B row reads "conditional-dominated". So neither
    proposal D083 named is triggered as written. A free continuous trait width remains the candidate D082 named
    first; the persistence overshoot at 1.0 and the 0.7 result say its width is not at 1.0. Any B018-derived shape
    still needs the user's data-role decision (D082). Findings F071–F074.
- 2026-10-20 ≈ 18:28 UTC (time from `date -u`), **correction (user review):**
  - The Outcome's "its width is not at 1.0" overreaches. It holds only with every other parameter at C2's fitted
    settings; a joint refit could move the preferred width. The trait arms say nothing about the width a fit would pick.
  - The still-fraction guard failure at walkOnSd 1.0 is a shift *toward* the data (better agreement). The adverse side
    of the tradeoff is the persistence overshoot.
