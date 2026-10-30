---
id: D200
date: 2026-10-30
time: 17:57
kind: reading
title: Part D Stage 3b capability read (P44, P59; D175, D196, D199): capability passes, all 14 T x D pairs distinguished (36 of 36 comparisons each); it meets the frozen separation criterion on these 22 colony set-ups, with uneven observed false-positive rates (7.4 % pooled, 20 % within T, 3.8 % within D); Stage 3c has no member to place the data against (every member has a row outside), so the measurement list is the outcome
---
- **2026-10-30 ≈ 17:57 UTC — Part D Stage 3b capability read (P44, P59; D175, D196, D199): capability passes, all 14 T x D pairs distinguished (36 of 36 comparisons each); it meets the frozen separation criterion on these 22 colony set-ups, with uneven observed false-positive rates (7.4 % pooled, 20 % within T, 3.8 % within D); Stage 3c has no member to place the data against (every member has a row outside), so the measurement list is the outcome.**
  - **What:** step 3 of D175 item 6's order (P59), run on the user's word (D199): every calibrated T × D pair compared
    across datasets under the frozen c = 9.2824 and α = 0.025/3 (D196). The rule is D175 item 1 with D176 gap 1: a pair
    is distinguished if at least 75 % of its evaluable comparisons exceed c (27 of 36), and capability passes if every
    pair is.
  - **Run:** `partDCap.ts cross` (md5 `fa55d891`), run `partdcap-cross-20261030T175621Z`, gated `run:partdcap-cross`
    (dispositions pinned to D175, D176, D196, D198, D199). Exit 0 after ≈ 25 s. Output `logs/partd2/cap/cross.json`
    (md5 `d07ef51c`), which records counts only, no M² values.
  - **Result: capability passes.** All 14 pairs (T20f, T20m × Eu-M, El20-M, Ed2, Ed5, Ed20, Ew5, Es) are evaluable,
    and in each **36 of 36** comparisons exceed c (observed power 1.00).
  - **Reading, in the user's wording (D199):** the diagnostic (R, S3₂, R_J) **meets the frozen separation criterion on
    these 22 colony set-ups, with uneven observed false-positive rates**: 7.4 % pooled, 20 % within T, 3.8 % within D
    (D198, F105). These are dependent, imprecise estimates, and the pooled rate does not establish error control for
    every member.
    - It does not establish a uniformly calibrated diagnostic.
    - It does not identify the biological mechanism, and joint reproduction remains unestablished (F103): no tested
      member reproduces the data on all 20 rows.
    - It is separation of estimated means between simulated members, kept apart from reliable classification of
      another data set (D126 amendment 1).
    - The comparisons share datasets, so 36 of 36 is not 36 independent confirmations (D175 item 1's disclosure).
  - **Stage 3c (D158: "only if capability passes, as amendment 1: 'not rejected' relative to members with no row
    outside").** Amendment 1 (D126) adds: "A member with any row outside does not count towards its family's
    not-rejected set." Every calibrated member has at least 3 rows outside (D194: T20f 8, T20m 5, Eu-M 3, El20-M 3,
    Ed2 3, Ed5 3, Ed20 3, Ew5 4, Es 4). So neither family has a member against which the data could be "not
    rejected", and Stage 3c places the data against no member. Without a placement the data's values are
    descriptive (D126 amendment 1).
  - **Outcome (D126 amendment 1, "Outcomes"):** "In every outcome where both families reproduce jointly, or neither
    does, **the measurement list is the outcome**." Neither family reproduces jointly (F103), so the outcome of Part
    D's question 2 is the ranked measurement list: D126 requirement 6 as amendment 1 lists it. D158's branch for a
    failed capability names direct sensing of a driver and density manipulation as its leading items. That branch does
    not apply here, and the ranking is made at the reading, as amendment 1 says. Each entry is ranked by its predicted T − D difference from the
    implemented members where that needs no new arms, with interventions as hypotheses and each member's prediction
    or "unresolved (needs modelling)".
  - **Findings:** F106 (capability).
  - **Next:**
    - The ranked measurement list, drafted from the implemented members (no new arms; stopping rule, D158), for the
      user.
    - Stage 3c's placement computation is not run, since no member qualifies. Whether to compute the data's (R, S3₂,
      R_J) against the members as a descriptive is the user's call.
