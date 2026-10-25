---
id: D156
date: 2026-10-25
time: 04:02
kind: reading
title: S2 audit read (frozen rule, D136 as amended by D145–D147, D150; J primary): pass at 100 draws on 20 common colonies — S2's decay exceeds the specified joint-shift null and C2 base (data S2_J 0.052, lower bound 0.039; data − base 0.035, lower bound 0.021; MC SE 0.0003); no extension; names no mechanism (V3b)
---
- **2026-10-25 ≈ 04:02 UTC — S2 audit read (frozen rule, D136 as amended by D145–D147, D150; J primary): pass at 100 draws on 20 common colonies — S2's decay exceeds the specified joint-shift null and C2 base (data S2_J 0.052, lower bound 0.039; data − base 0.035, lower bound 0.021; MC SE 0.0003); no extension; names no mechanism (V3b).**
  - **Run:** `s2audit-20261025T035716Z` (D155), ok in 4 min 30 s. 154 files (132 simulated, 22 data), each log ending
    "done". The frozen reader (`s2AuditRead.ts` `75414e8c55c9e64ee38bf27c313ef840`) wrote `logs/s2audit/s2audit-main.json`.
    Hashes as D153.
  - **Continuity:** the full-support data profile is 0.0918 / 0.0538 / 0.0279 / 0.0122 / 0.0034, equal to D122 and
    D149.
  - **Gate (frozen rule):**
    - Common colonies 20 (≥ 15). Excluded: colony112 and colony215, data, observed not estimable; their ≥ 40 mm band
      has 46 and 50 pair-bins in their two light blocks (floor 100). No base colony was excluded.
    - Data S2_J = 0.0515, lower 95 % bound 0.0389, MC SE of the bound 0.0003.
    - Data − base S2_J = 0.0350, lower bound 0.0213, MC SE 0.0003.
    - Both bounds are resolved (|bound| > 2 MC SE) at 100 draws, so the reader did not request the extension and none
      was run.
    - **Verdict: pass. "S2's decay exceeds the specified joint-shift null and C2 base."** Neither outcome identifies a
      mechanism or establishes its absence (P34).
  - **Disclosed limitations (P34, P35, P38, D154):**
    - **V3b:** on synthetic colonies, a shared signal whose response varies over space gives S2_J ≈ 0.16 under J
      (D152, F094). A positive data S2_J is therefore compatible with local spatial dependence and equally with a
      spatially varying response to a shared signal. This audit does not choose between them.
    - **Phase:** the gate uses complete light-phase blocks only. The all-phase data profile is descriptive (below).
    - **Duration:** data colonies give 2–3 contiguous light blocks (8–12 h); simulated colonies give two independent
      4-h light runs (8 h), each started from its warm-up.
    - **P02/Q03:** the C2 water-init warm-up shortcut is not rechecked at C2 settings. This stays an unwaived
      limitation of the base comparison.
  - **Descriptive (95 % colony bootstrap; not gated):**

    | Set | L | Ê_J[L] | S2_J | Ê_A[L] | Ê_J − Ê_A | L_same − L_ref (share kept) |
    |---|---|---|---|---|---|---|
    | data (20) | 0.073 [0.059, 0.088] | 0.022 [0.014, 0.030] | 0.052 [0.039, 0.063] | −0.000 | 0.022 | 0.042 [0.024, 0.061] (17 colonies; 0.90) |
    | base (22) | 0.028 [0.023, 0.034] | 0.011 | 0.017 [0.013, 0.021] | 0.000 | 0.011 | 0.025 [0.020, 0.031] (0.83) |
    | Eu (22) | 0.030 | 0.008 | 0.021 [0.017, 0.026] | −0.000 | 0.008 | 0.026 (0.83) |
    | El20 (22) | 0.059 | 0.007 | 0.052 [0.049, 0.054] | 0.000 | 0.007 | 0.051 (0.83) |

    - **Light-phase C bands:** data 0.104 / 0.060 / 0.030 / 0.014 / −0.001; base 0.066 / 0.010 / −0.002 / −0.004 /
      −0.002.
    - **J is not empty on the data:** Ê_J[L] = 0.022 is what the joint shift keeps with between-ant timing removed.
      Under A (positions at the true bin), the null decay is ≈ 0 in every set. ~~So that share runs through each ant's
      same-bin position–activity dependence, which the data have (F067).~~ **Corrected (D157):** J and A also differ
      in simultaneous geometry and eligible observations. Ê_J − Ê_A = 0.022 is the frozen contrast between the two
      nulls. It is consistent with same-bin position–activity dependence (F067) but does not establish it, and no
      artefact fraction is assigned (D145).
    - **Band-wise excess over J (data):** 0.088 / 0.052 / 0.030 / 0.017 / 0.010, falling with distance.
    - **Reference classing (matched support):** classing by positions 5–15 min earlier lowers the data's L by 0.042
      [0.024, 0.061]. Only the reduction is reported (D154); whether decay remains under reference classing is not
      claimed.
    - **Block-mean classing:** L 0.027 [−0.020, 0.057]; estimable in only 7 data colonies.
    - **Role pairs (data S2_J):** nurse–nurse 0.070 [0.055, 0.084] (16 colonies), forager–nurse 0.042 [0.031, 0.053]
      (20), forager–forager 0.048 [0.031, 0.066] (18). All are positive; base is 0.008 / 0.019 / 0.032.
    - **All-phase data (complete blocks, light and dark, 22 colonies):** L 0.062 [0.050, 0.075]; light-phase L is
      0.073.
    - **Other sets minus base (S2_J):** Eu +0.004 [0.000, 0.009]; El20 +0.035 [0.030, 0.039].
      - El20's S2_J (0.052) equals the data's, but its profile does not fall to zero: excess over J 0.017 at ≥ 40 mm
        (data 0.010), and C(≥ 40) 0.017 against −0.001 (D122's misfit, light phase).
      - Eu's excess is nearly flat with distance (0.084 / 0.050 / 0.044 / 0.039 / 0.038), the shared-driver pattern
        (D122).
  - **Consequence:** S2 is not removed as Stages 1–3's main spatial row (P22's failed-rule branch is not triggered).
    The audit establishes decay beyond the joint-shift null and C2 base, as worded above, and nothing about its cause.
    Stages 1–3 stay held. Whether and how they proceed, given V3b, is the user's decision (D154; Q15).
