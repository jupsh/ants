---
id: D112
date: 2026-10-22
time: 16:31
kind: reading
title: Synchrony Part B, B2 read (D108 amendments 1–2, D110): matching not met at the 60-s autocorrelation, so an oracle-versus-placebo stress test; contrast equivalent for 24 of 36 rows, 1 sensitive, 11 unresolved (the still-run tails and nurse persistence)
---
- **2026-10-22 ≈ 16:31 UTC — Synchrony Part B, B2 read (D108 amendments 1–2, D110): matching not met at the 60-s autocorrelation, so an oracle-versus-placebo stress test; contrast equivalent for 24 of 36 rows, 1 sensitive, 11 unresolved (the still-run tails and nurse persistence).**
  - **Run:** `syncB-20261022T143252Z`. B2's three arms and the reader completed, but the run exited 1 because of B1's
    set-up error (D111 correction; B1 is being rerun as `syncB1-20261022T162959Z`). Outputs are local in
    `logs/s5sync/b2-*`. The settings were D111's: C2 fit, judge seeds, 22 reps × 22 colonies, dt 0.05, warm-up
    7200 s, 21 600 s window. The matched placebo was fixed from the coupled arm's realised signal only:
    `placebo:0.337684:60:shift=-0.064832`.
  - **Matching (amendment 1): NOT met.**
    - E[g]: coupled 0.9922 vs placebo 0.9919 (ok);
    - SD of log g: 0.338 vs 0.338 (ok);
    - **lag-60-s autocorrelation: 0.845 vs 0.362** (not met). The colony signal stays correlated much longer than the
      placebo's τ_c of 60 s (the placebo's 0.362 ≈ e⁻¹, as its OU gives);
    - beside: mean log g −0.061 / −0.065, skewness −0.71 / 0.00, clipped 0.28 % / 0 %, autocorrelation at 10 s
      0.990 / 0.845 and at 10 min −0.114 / −0.006.
    - **By the fixed rule:** the comparison is an *oracle-versus-placebo stress test*, and no part of its contrast is
      attributed to sharing as such. Matching τ_c would have needed another arm; none was added (D110: no extra
      arms).
  - **Rows (36; contrast D = coupled − placebo, 90 % CI in SE_data):**
    - **The coupled–placebo contrast is equivalent within ±0.5 SE_data for 24 rows:**
      - still fraction (nurse, forager × light, dark);
      - moving speed (4);
      - still-run mean (4);
      - still-run P2, nurse light;
      - moving-run mean (4) and P2 (4);
      - top-20 % share (nurse, forager);
      - forager persistence.

      Δc and Δp from base are small in all of them: neither arm moves any of them by more than ≈ 0.5 in z. The
      largest moves are moving-run nurse rows under coupling, +0.4 to +0.5 in z.
    - **Sensitive: 1**, `runStill.P10.forager.dark`: D −1.11 SE_data [−1.25, −0.98] (90 %); z base 5.0, coupled 4.1,
      placebo 5.2. Coupling moves it toward the data and the placebo away.
    - **Unresolved: 11.** The CI of D crosses ±0.5 SE_data, and the row is not sensitive by the rule:
      - `runStill.P2` nurse dark (−0.46), forager light / dark (−0.63 / −0.76);
      - `runStill.P10` nurse light / dark (−0.67 / −0.81), forager light (−0.86);
      - `runStill.P60` nurse light / dark (−0.53 / −0.58), forager light / dark (−0.47 / −0.57);
      - `persist.nurse.light` (−0.30, 90 % CI −0.56 to −0.03).

      The common pattern: coupling shortens the still-run tails (Δc < 0, CI excluding 0), while the placebo leaves
      them or lengthens them slightly.
    - |z| counts (descriptive): base 15 > 3, 9 in (2, 3]; coupled 16 / 7; placebo 16 / 6.
  - **Caveats, disclosed:**
    - Each light / dark pair shares one simulated value (the model has no phase dependence); only SE_data differs.
      The 36 classes are therefore not 36 independent results: 18 distinct simulated rows.
    - With matching not met, "equivalent" means only that this stress test and this placebo do not differ beyond
      ±0.5 SE_data on those rows. It does not show the rows insensitive to sharing, nor to other synchrony mechanisms.
    - Not covered: row 1 (stays), row 4 (contacts vs density), the 1999 rows and E6.
    - Coverage (B1) is pending. Until it is read, it is not known whether the coupled arm reaches the data's
      synchrony for C2.
  - **Not done:** no freeze or step-9 conclusion. That follows with B1, for the user.
- 2026-10-22 (D113): coverage read. The coupled arm reaches the data's synchrony in no group × window cell (23–56 % of the
  gap), so the contrasts above describe a coupling well below the data's level.
