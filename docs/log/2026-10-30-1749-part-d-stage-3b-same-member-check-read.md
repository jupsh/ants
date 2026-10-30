---
id: D198
date: 2026-10-30
time: 17:49
kind: reading
title: Part D Stage 3b same-member check read (P59; D175 item 2, D196, D197): pass, 10 of 135 same-member pairs exceed c (7.4 %, the estimated false-positive rate f, above the nominal 5 %); per member T20f 4/15, T20m 2, Ed2 2, Es 2, the other five 0; no dataset unevaluable; cross not yet run
---
- **2026-10-30 ≈ 17:49 UTC — Part D Stage 3b same-member check read (P59; D175 item 2, D196, D197): pass, 10 of 135 same-member pairs exceed c (7.4 %, the estimated false-positive rate f, above the nominal 5 %); per member T20f 4/15, T20m 2, Ed2 2, Es 2, the other five 0; no dataset unevaluable; cross not yet run.**
  - **What:** step 2 of D175 item 6's order (P59), run on the user's word (D197): every calibrated member's 6 capability
    datasets compared pairwise with themselves (15 pairs × 9 members = 135) under the frozen c = 9.2824 and α = 0.025/3
    (D196). The rule is D175 item 2 with D176 gap 1: the check fails if more than 10 % of the evaluable pairs exceed c
    (14 or more of 135).
  - **Run:** `partDCap.ts same --frozen D196` (md5 `fa55d891`), run `partdcap-same-20261030T174837Z`, gated
    `run:partdcap-same` (dispositions pinned to D175, D176, D196, D197). It exited 0 after ≈ 25 s. Output
    `logs/partd2/cap/same.json` (md5 `af872b2e`). The member capability outputs were unsealed for it at 17:48 UTC (P63
    fulfilled, D197).
  - **Result: pass.** 10 of 135 pairs exceed (7.4 %). Every dataset was evaluable.

    | member | family | exceed / 15 |
    |---|---|---|
    | T20f | T | 4 |
    | T20m | T | 2 |
    | Eu-M | D | 0 |
    | El20-M | D | 0 |
    | Ed2 | D | 2 |
    | Ed5 | D | 0 |
    | Ed20 | D | 0 |
    | Ew5 | D | 0 |
    | Es | D | 2 |
    | **pooled** | | **10 / 135 = 7.4 %** |

  - **Reading (D175 item 2: report the observed rate as f; no further rule):**
    - **The estimated false-positive rate f is 7.4 % pooled**, above the nominal 5 % that c gives on the base nulls. The
      claim, if capability passes, carries f = 7.4 %, not 5 %.
    - The 15 pairs of a member share its 6 datasets, each dataset in 5 pairs, so per-member counts are not independent
      and are not tested (D175 item 2). T20f's 4 of 15 (27 %) is the highest. The family T members give 6 of 30 (20 %),
      the D members 4 of 105 (3.8 %). Descriptive only. One plausible reading, not examined: members with stronger
      synchrony (T, F103) vary more between datasets than base does, so the base null understates their noise.
  - **Next (P59):** `cross`, every calibrated T × D pair (2 × 7 = 14 pairs, 36 comparisons each, distinguished if at
    least 75 % of evaluable comparisons, i.e. 27 of 36, exceed c). It is the next step of the approved order. It is held
    for the user, because f is above nominal and is concentrated in family T, the family every cross pair contains.
- **2026-10-30 ≈ 17:56 UTC — Correction (user, D199).** The "plausible reading" above is withdrawn as stated. M² already
  uses each dataset's estimated covariance, so greater variability among T datasets alone should be accommodated if that
  estimate works well. The excess could involve covariance estimation, distribution shape or a few unusual datasets. Its
  cause is unresolved. f is reported as three dependent, imprecise rates together: 7.4 % pooled, 20 % within T, 3.8 %
  within D. The pooled rate does not establish error control for every member.
