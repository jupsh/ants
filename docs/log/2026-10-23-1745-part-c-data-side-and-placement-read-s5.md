---
id: D124
date: 2026-10-23
time: 17:45
kind: reading
title: Part C data side and placement read: S5 on the data resolves no neighbour dependence (Δβ −0.16, CI includes 0 and every arm); S6 positive (0.59) as in every arm, base included; the data's onset lag rises with distance (+11 frames) where base and both drivers stay near +1.2; descriptive only, nothing screened
---
- **2026-10-23 ≈ 17:45 UTC — Part C data side and placement read: S5 on the data resolves no neighbour dependence (Δβ −0.16, CI includes 0 and every arm); S6 positive (0.59) as in every arm, base included; the data's onset lag rises with distance (+11 frames) where base and both drivers stay near +1.2; descriptive only, nothing screened.**
  - **Inputs (D123):** `scripts/scratch/s5Data.ts --after-screen` on the 22 fit colonies (PreTreatment tracks, light clock
    blocks, ≈ 6 s each) → `logs/short/s5data-c<i>.json`; `partC.ts read --stage place` → `logs/partc/place.json` (data
    95 % colony bootstrap, 2000 draws, seed 0x5e9e). The arms' 95 % CIs are from screen.json (D122). This is the first
    time S5 and S6 have been computed on the data.
  - **Placement rule:** no signature was screened (D122), and no P variant was calibrated (D121), so the P range is
    empty. Every row is classed **not screened (descriptive)**, as fixed (D115 amendment 1). The E range is the union of
    the Eu and El20 CIs.
  - **S1 / S2 data values** are those of D122's sufficiency table (same inputs). They are not repeated here.
  - **S3–S6** (data and each arm's 95 % CI):

    | Signature | Data | Base | Eu | El20 |
    |---|---|---|---|---|
    | S3 ρ − null 1 | 0.015 [0.005, 0.023] | 0.004 [−0.002, 0.009] | 0.009 [0.001, 0.016] | 0.000 [−0.007, 0.007] |
    | S3 ρ − null 2 | 0.007 [−0.001, 0.015] | 0.002 [−0.003, 0.008] | 0.009 [0.003, 0.015] | 0.001 [−0.006, 0.007] |
    | S3 lag 20–40 minus < 5 mm (frames) | **11.0 [3.3, 21.0]** | 1.3 [0.0, 2.5] | 1.2 [−0.3, 2.8] | 1.2 [0.5, 1.9] |
    | S4 pre / post excess ratio | 0.72 [0.53, 0.90] | −1.2 [−12.3, 15.0] | 0.06 [−0.32, 0.46] | 1.8 [−12.4, 15.1] |
    | S5 Δβ (position-matched) | −0.16 [−0.45, 0.08] | −0.08 [−0.23, 0.07] | −0.19 [−0.35, −0.04] | +0.08 [−0.04, 0.20] |
    | S6 Spearman D_w (1 min) vs density | 0.59 [0.22, 0.82] | 0.44 [−0.04, 0.78] | 0.71 [0.30, 0.91] | 0.81 [0.52, 0.94] |

    - Checks against earlier data readings:
      - S4's 0.72 equals F019's light value.
      - S3's ρ differences are close to F026's +0.014 / +0.009 (colony means here).
      - The lag rise (11 frames ≈ 5.5 s) matches F026's light 12 → 18 s from < 5 mm to 20–40 mm.
  - **S5 on the data (new):**
    - Estimable in **22 of 22** colonies: ≥ 12 included ants per colony; 48,405 isolated and 777,242 crowded ant-bins
      in all.
    - Primary Δβ −0.16 [−0.45, 0.08]. The CI includes 0 and overlaps every arm's CI.
    - One colony (colony201, −2.15) carries much of the mean; without it the mean is −0.06. Reported, not removed.
    - Secondary (no position matching): −0.30. The fixed rule gives no CI for it.
    - **Reading:** S5 resolves no dependence of an ant's coupling to colony activity on contact-range neighbours.
      Its CI is too wide to tell base, Eu or El20 apart, and it would not exclude a moderate effect either way.
  - **S6 on the data (new):**
    - Spearman ρ 0.59 [0.22, 0.82]: colonies with more ants per cm² in the nest are more synchronous at 1 min.
    - **Reading:** every arm shows a similar positive relation, including base, which has no driver and no
      propagation (D122). So the data's value does not point to propagation, and it does not place the data among the
      arms.
    - Descriptive only, as fixed: colonies differ in more than density.
  - **S3 lag by distance, data beside the drivers (new comparison; data value known, F026):**
    - In the data, ants farther from an episode's initiator start later: +11.0 frames from < 5 mm to 20–40 mm.
    - Base, Eu and El20 stay at +1.2 to +1.3. The data's CI excludes all three point values, and its lower end (3.3)
      lies above each arm's CI (upper ends 1.9–2.8).
    - Neither calibrated driver reproduces it. This adds to their failures in D122's sufficiency rows, but S3 was not
      a sufficiency row, so it is reported descriptively.
    - A propagating signal would be expected to order onsets by distance. No P variant reached the target magnitude,
      so this pipeline has not shown that propagation of the kind tested gives the data's lag.
  - **S4:** the data's 0.72 lies outside Eu's CI (upper end 0.46). Base and El20 are too noisy to compare (CI widths
    ≈ 27). Descriptive only.
  - **Wording:** descriptive placement of unscreened signatures. No statement that a mechanism operates or not. S5 / S6
    are exploratory (new definitions).
  - **Part C, as it ends:**
    - **Calibration (D121):** no propagation variant reached the data's 1-min synchrony within the bounded search.
    - **Sufficiency (D122):** neither calibrated driver is sufficient.
    - **Separation:** not evaluable.
    - **Data side (this entry):** S5 and S6 don't discriminate on these data. Two of the data's spatial or temporal
      patterns are reproduced by neither driver: co-movement falling with distance (S2) and onset lag rising with
      distance (S3).
    - The user's question (D114), propagation or a within-system driver, is **not answered by this pipeline**. The
      distance patterns are where any follow-up would look.
