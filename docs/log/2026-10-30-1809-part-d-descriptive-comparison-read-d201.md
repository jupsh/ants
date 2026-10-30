---
id: D203
date: 2026-10-30
time: 18:09
kind: reading
title: Part D descriptive comparison read (D201, D202): on 20 colonies, the T members' R_J difference from the data is unresolved while their R is lower and their near-band C 1.7-2.2 times the data's; the D members other than Es have unresolved near-band differences but about twice the data's 20-40 mm band, so R and R_J are about twice the data's; Es's R and C-band differences are unresolved but its R_J is about twice the data's; every member's S3₂ difference is unresolved; every member differs from the data on at least one coordinate or band mean
---
- **2026-10-30 ≈ 18:09 UTC — Part D descriptive comparison read (D201, D202): on 20 colonies, the T members' R_J difference from the data is unresolved while their R is lower and their near-band C 1.7-2.2 times the data's; the D members other than Es have unresolved near-band differences but about twice the data's 20-40 mm band, so R and R_J are about twice the data's; Es's R and C-band differences are unresolved but its R_J is about twice the data's; every member's S3₂ difference is unresolved; every member differs from the data on at least one coordinate or band mean.**
  - **Run:** `partDDesc.ts run` (md5 `7ca5a08a`, as D202), run `partddesc-20261030T180827Z`, gated `run:partddesc`.
    Exit 0 after ≈ 30 s. Output `logs/partd2/desc.json` (md5 `e84a6741`). Descriptive (D201): no rule, no placement, no
    label, no M², no comparison with c or α.
  - **Support:** 20 colonies, estimable in the data and in all 9 members. The data's colony112 and colony215 are
    excluded (S2 not estimable, as D156). No set had a bootstrap draw at or under the 0.01 denominator. 2,000 joint
    colony-bootstrap draws (the same colonies for every set in each draw); 95 % percentile CIs.
  - **Values** (C = C(< 5 mm) and C(20–40 mm); J = C − Ê_J in the same bands):

    | set | R | S3₂ | R_J | C < 5 | C 20–40 | J < 5 | J 20–40 |
    |---|---|---|---|---|---|---|---|
    | data | 0.131 [0.093, 0.168] | 0.154 [0.004, 0.289] | 0.195 [0.153, 0.238] | 0.104 | 0.0137 | 0.088 | 0.0172 |
    | T20f | 0.061 [0.032, 0.091] | 0.290 [0.119, 0.402] | 0.191 [0.162, 0.219] | 0.177 | 0.0108 | 0.113 | 0.0216 |
    | T20m | 0.043 [0.016, 0.074] | 0.070 [−0.026, 0.164] | 0.239 [0.204, 0.274] | 0.226 | 0.0097 | 0.106 | 0.0253 |
    | Eu-M | 0.345 [0.309, 0.382] | −0.003 [−0.050, 0.041] | 0.445 [0.406, 0.485] | 0.096 | 0.0332 | 0.078 | 0.0345 |
    | El20-M | 0.258 [0.230, 0.287] | 0.033 [−0.016, 0.078] | 0.331 [0.305, 0.358] | 0.105 | 0.0272 | 0.087 | 0.0288 |
    | Ed2 | 0.261 [0.240, 0.281] | 0.061 [−0.009, 0.128] | 0.325 [0.305, 0.346] | 0.106 | 0.0275 | 0.089 | 0.0290 |
    | Ed5 | 0.252 [0.227, 0.279] | 0.099 [0.019, 0.180] | 0.328 [0.306, 0.354] | 0.107 | 0.0270 | 0.088 | 0.0289 |
    | Ed20 | 0.260 [0.236, 0.284] | 0.082 [0.021, 0.138] | 0.328 [0.306, 0.352] | 0.104 | 0.0271 | 0.087 | 0.0286 |
    | Ew5 | 0.315 [0.275, 0.355] | 0.001 [−0.069, 0.070] | 0.413 [0.374, 0.451] | 0.093 | 0.0294 | 0.075 | 0.0310 |
    | Es | 0.108 [0.090, 0.125] | 0.159 [−0.110, 0.438] | 0.376 [0.336, 0.423] | 0.109 | 0.0117 | 0.063 | 0.0237 |

    The band means' CIs, every member-minus-data difference with its CI, the bootstrap correlations of the 3-D
    difference (R with R_J 0.67–0.97, the others within ±0.33) and each member's 6 capability datasets' range are in
    `desc.json`. The capability datasets' θ ranges bracket or sit next to these Stage 2b values: for example T20f R
    0.046–0.065, Eu-M R 0.326–0.356, Es S3₂ −0.11 to 0.41.
  - **Reading (descriptive):**
    - **Ratios can hide amplitude (D201).** The T members' R_J differences from the data are unresolved (CIs include
      0: T20f −0.004 [−0.057, 0.045], T20m +0.044 [−0.005, 0.092]). That R_J sits near the data's because the
      **corrected** bands that form it are both high. C − Ê_J < 5 mm is above the data's in both (T20f +0.025 [0.012,
      0.037], T20m +0.018 [0.004, 0.032]). C − Ê_J 20–40 mm is above it in T20m (+0.008 [0.003, 0.013]), and T20f's
      difference is unresolved (+0.004 [−0.001, 0.010]). Their **raw** far band C(20–40) is below the data's as a point
      estimate (0.011 and 0.010 against 0.014), with unresolved differences. Their raw near-band C is 1.7 and 2.2 times
      the data's (differences +0.072 [0.055, 0.087] and +0.122 [0.105, 0.139]), and their R is lower (CIs exclude 0).
    - **The D members other than Es:** their near-band differences from the data, in C and in C − Ê_J, are unresolved
      (CIs include 0), except Ew5's C − Ê_J < 5, which is lower (−0.013 [−0.025, −0.002]). Their 20–40 mm band is about
      twice the data's (C +0.013 to +0.020, all CIs above 0), so their R and R_J are about twice the data's. This is the
      flat profile D194's ≥ 40 mm rows showed.
    - **Es:** its differences from the data in R and in both C bands are unresolved (CIs include 0). Its R_J is about
      twice the data's (+0.181 [0.124, 0.250]), because its near-band excess over J is lower (C − Ê_J < 5: −0.025
      [−0.035, −0.016]). Its S3₂ CI is the widest (−0.11 to 0.44), and its ants move about a fifth as much as base's
      (D194).
    - **S3₂:** every member's difference from the data is unresolved (every CI includes 0). The data's S3₂ on these 20
      colonies is 0.154, against 0.189 on all 22 (D194).
    - **Every member differs from the data** on at least one coordinate or band mean, with a CI excluding 0, beyond the
      outside rows D194 lists (T20f 8, T20m 5, Eu-M, El20-M, Ed2, Ed5, Ed20 3 each, Ew5 and Es 4 each).
  - **Not said (D200, D201):** no placement, no family the data resemble, no closest member. Formal Stage 3c stays
    empty. Capability (F106) separates the simulated members' estimated means; this table shows where the data's
    means sit beside them, not which mechanism produced the data.
  - **Findings:** F107.
  - **Next:** the ranked measurement list (D201): measurements predicted to separate the implemented members, and
    measurements addressing their shared failures (above all the 10-min D_w shortfall, F104). Interventions that need
    new modelling are "unresolved (needs modelling)".
- **2026-10-30 ≈ 18:31 UTC — Correction (user review, in conversation).** Two wordings are tightened in place above.
  1. Where a difference's CI includes 0, the entry now says "the difference is unresolved", not that the member
     "matches" the data.
  2. The T members' "too much co-movement in both bands" referred to the corrected bands (C − Ê_J) that form R_J; their
     raw far-band C is below the data's as a point estimate.
  The numbers are unchanged.
- **2026-10-30 ≈ 20:45 UTC — Correction (D204).** "20-min D_w" in "Next" is the 10-min cell (the S1 window keys are
  frames at 2 fps); corrected in place.
