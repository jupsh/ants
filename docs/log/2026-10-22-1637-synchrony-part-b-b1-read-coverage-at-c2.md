---
id: D113
date: 2026-10-22
time: 16:37
kind: reading
title: Synchrony Part B, B1 read (coverage): at C2's fit the κ = 1 coupling reaches the data's synchrony in none of the 9 group × window cells (about 27–56 % of the gap); C2's own synchrony is near independence; Part B summary for the freeze decision
---
- **2026-10-22 ≈ 16:37 UTC — Synchrony Part B, B1 read (coverage): at C2's fit the κ = 1 coupling reaches the data's synchrony in none of the 9 group × window cells (about 27–56 % of the gap); C2's own synchrony is near independence; Part B summary for the freeze decision.**
  - **Run:** `syncB1-20261022T162959Z` ok, 4 m 27 s, 66 / 66 runs, no errors (D111 correction).
    - Arms: base, `coupled:1:60` and the matched placebo `placebo:0.337684:60:shift=-0.064832`; seed 4242 in every
      arm; C2 fit; light; warm-up 7200 s; the 4-h window; `--noActivity`.
    - Aggregated locally with `syncAgg.py` against the data side (`logs/short/data-c*.json`, 22 colonies). Outputs:
      `logs/s5sync/b1-agg.txt`, `logs/short/s5-<arm>-c*.json`.
  - **D_w, mean over 22 colonies [95 % colony bootstrap], at 5 s / 1 min / 10 min:**

    | group | data | C2 base | coupled κ 1 | matched placebo | coupled share of the gap |
    |---|---|---|---|---|---|
    | all | 2.63 / 4.15 / 6.28 | 1.06 / 1.16 / 1.10 | 1.59 / 2.49 / 3.37 | 1.05 / 1.16 / 1.19 | 34 / 44 / 44 % |
    | nurses | 2.28 / 3.67 / 5.12 | 1.02 / 1.06 / 1.06 | 1.31 / 1.76 / 2.24 | 1.02 / 1.05 / 1.06 | 23 / 27 / 29 % |
    | foragers | 1.58 / 2.12 / 3.12 | 1.03 / 1.07 / 1.04 | 1.25 / 1.66 / 2.08 | 1.03 / 1.11 / 1.22 | 40 / 56 / 50 % |

    Every data − coupled difference has a CI excluding 0 (smallest: foragers at 5 s, +0.33 [+0.20, +0.47]).
  - **Coverage reading (amendment 1): not reached in any of the 9 cells.** At C2's fit, this perturbation reaches
    about a quarter to a half of the gap between C2 and the data. So B2's contrasts (D112) describe a coupling well
    below the data's synchrony: weakest for nurses (23–29 %), strongest for foragers (40–56 %).
    - **Correction to a carried label:** κ = 1 was named an "overshooting stress test" (F025, D093, D094). That was
      measured at C1's start point (all ants 5.99 / 13.26 vs data 4.15 / 6.28). It does not hold at C2's fit, where
      κ = 1 undershoots. This bears on the step-5 gate's description too (D106, F082): its perturbation was not shown
      to overshoot there. That gate was not measured on 1999 nests, so its coverage is unknown.
  - **Placebo check:** the matched placebo does not raise synchrony at 5 s or 1 min (within ±0.04 of base). At 10 min
    it is slightly higher (all 1.19 vs 1.10; foragers 1.22 vs 1.04, CIs overlapping), so a small long-window effect of
    modulation alone is not excluded.
  - **Retained discrepancy (for any omission text):** C2 is almost as independent as C1 was: D_w 1.02–1.16 against
    the data's 1.58–6.28. The data − C2 differences are +1.57 / +2.99 / +5.17 for all ants, +1.26 / +2.61 / +4.06 for
    nurses and +0.55 / +1.06 / +2.08 for foragers (all CIs exclude 0). C2's per-ant drive adds essentially no
    colony synchrony.
  - **Part B, summary for the freeze decision (D108 amendments 1–2, D110 phrasing; not a clearance):**
    - matching not met (60-s autocorrelation 0.845 vs 0.362), so B2 is an oracle-versus-placebo stress test, with
      nothing attributed to sharing;
    - the perturbation reaches none of the data's synchrony cells (23–56 % of the gap);
    - within that: the coupled–placebo contrast is equivalent within ±0.5 SE_data for 24 of the 36 rows (18 distinct
      simulated rows, light / dark paired); 1 is sensitive (`runStill.P10.forager.dark`); 11 are unresolved (the
      still-run tails and nurse persistence);
    - not covered: row 1 (stays), row 4 (contacts vs density), the 1999 rows, E6;
    - **reading:** B does not support stating that the 36 rows would be unaffected by synchrony at the data's level.
      At under half of it, most rows show no contrast, while the still-run tails respond to coupling or cannot be
      separated from it. C2 already fails those same rows (base z 2.7–10.9).
  - **For the user:** the freeze decision before step 9 (Rules in force), including the scope of rows 1 and 4.
    Nothing further runs without it.
