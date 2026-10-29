---
id: D174
date: 2026-10-26
time: 20:14
kind: design
title: Part D: P29's capability rule and P47's support, missing-statistic and MC rules proposed for Stage 2b, for the user's approval
---
- **2026-10-26 ≈ 20:14 UTC — Part D: P29's capability rule and P47's support, missing-statistic and MC rules proposed for Stage 2b, for the user's approval.**
  - **Why now:** Stage 2a is read (D173; F098): 9 members calibrated (T20f, T20m; Eu-M, El20-M, Ed2, Ed5, Ed20, Ew5,
    Es), T10f and T10m ineligible. P29 (D126) puts the 2-D rule after calibration and before Stage 2b; D159 item 3 keeps
    its approval with the user and asks which claim it supports; P47 (D159 item 2) asks for support, missing-statistic
    and MC rules before assessment. Nothing below has been run; no Stage 2b output exists.
  - **Part A, P29: the capability rule (Stage 3b).**
    - **Claim supported:** "with datasets the size of the assessment (22 colonies × 2 runs × 4 h light) observed
      through the frozen tracker, diagnostic (R, S3₂, R_J) distinguishes datasets of each calibrated T member from
      datasets of each calibrated D member, with false-positive rate f and power p per pair". It is not a claim about
      classifying the real data; placement (Stage 3c) stays as D158 states it.
    - **Required pairs:** every calibrated T × every calibrated D member: 2 × 7 = 14 pairs, Es included. T10f and T10m
      are ineligible (D173) and are listed as such; "every T" means the calibrated ones, and the reading says that two
      of four T members could not be tested.
    - **Datasets:** K = 4 independent datasets per calibrated member on a new stream `cap` 0xc4b3 (none of `diag`,
      `judge` 0xc4b1 / 0xc4b2, `probe` 0xc4bf), each 22 colonies × 2 runs, at the D173 strengths: 9 × 4 × 44 =
      1,584 runs, beside Stage 2b's (9 + 2 controls + base) × 44 = 528. The 2b assessment runs are not used.
    - **Statistic per dataset pair:** M² = Mahalanobis² of the difference in (R, S3₂, R_J) under the sum of the two
      datasets' colony-bootstrap covariances (2,000 draws each, colonies resampled independently). R and R_J keep
      D126's edge rules (ratio of colony means; > 1 % of draws with denominator ≤ 0.01 → not evaluable); condition
      number > 1e8 → the per-coordinate screen (each coordinate's 95 % CI with Bonferroni over three).
    - **Threshold, chosen and checked on separate draws:**
      - chosen on synthetic nulls (D126): two arms of one mechanism, 22 colonies, colony summaries resampled from
        Part C's per-colony values, skewed ones included; 10,000 null pairs; threshold c = their 95th percentile of M²;
      - checked on the simulated same-member pairs: 6 pairs per member × 9 = 54. The check fails if 7 or more exceed
        c (binomial p < 0.05 against 5 %); then capability is "not evaluable at this threshold" and goes to the user.
      - c is frozen in its own entry before any `cap` dataset is compared across members.
    - **Power per pair:** the 16 cross-dataset comparisons of T vs D (4 × 4); power = the share with M² > c.
    - **Capability passes** if the check passes and every required pair has power ≥ 0.80 (13 of 16). Otherwise
      D159's wording: "The specified diagnostic did not distinguish all tested transmission and driver members at this
      sample size", with each pair's power and the failing pairs named.
    - **Not evaluable** if Es or any required pair has R or R_J not evaluable (D159: Es never drops out by becoming
      ineligible).
  - **Part B, P47: rows, support, missing statistics and MC (Stage 2b assessment).**
    - **Common colony support, per row:** the colonies estimable in the data and in every assessed arm (9 members,
      Eu, El20, base). Estimable: S1 as in Part C; S2 and S2-J by D145 item 5 (each band ≥ 100 pair-bins, finite
      positive Σx², Σy²; ≥ 90 % valid J draws), the arm's two runs pooled per colony. Each row's support, with its
      colony count, is reported. If a row's common support has fewer than 15 colonies, that row uses data ∩ arm for
      each arm, flagged "per-arm support".
    - **Missing:** a row is missing for an arm if its support (common or per-arm) has fewer than 15 colonies or the
      statistic is undefined. A missing row is never equivalent and never outside; it blocks that arm's joint
      reproduction (D159).
    - **MC precision (S2-J rows, the only rows with a Monte Carlo null):** for each S2-J row and arm, the 90 % CI of
      sim − data at 100 J draws per file; each CI endpoint's MC SE from 200 resamples of the stored J draws, the
      colony-bootstrap resamples held fixed (as D147 item 3). The row's class is resolved if each endpoint lies more
      than 2 MC SE from the nearest tolerance boundary (±0.015). If not, that arm's files and the data's are extended
      once to 400 draws on the same streams; still not resolved: "unresolved (MC)". No other change of budget.
    - **Equivalence:** unchanged (D117 via D158: independent colony resampling, 2,000 draws, 90 % CI inside / beyond /
      across the tolerance).
  - **Cost:** Stage 2b + capability ≈ 2,112 runs. At the bench's per-run cost and the measured 5995WX speed (0.51,
    D172), ≈ 3 h on a 128-vCPU box; an estimate goes to the user with the rental question.
  - **Build before running:** a `cap` stage in partD2.ts, the M² and threshold code, synthetic-null generator; tests
    (seed-stream separation, M² on a known case, the 54-pair check). The frozen S2 audit code is reused unchanged.
  - **For the user:** approve, amend or reject Parts A and B (Q21). The alternative to Part A's datasets is
    D158's original: separation of estimated means from the 2b runs only (no extra runs), with the wording limited to
    "separation of estimated member means", which D159 item 3 says does not show capability.
- **2026-10-26 — Part A amended and approved by the user in D175** (K = 6, ≥ 27 of 36, alarm count, nulls from base
  runs through the identical pipeline, fallback rule, estimability minimum, reader order, "on these 22 colonies").
  Part B awaits the user (Q21).
