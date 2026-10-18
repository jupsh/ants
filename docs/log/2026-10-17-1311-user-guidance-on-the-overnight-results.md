---
id: D002
date: 2026-10-17
time: 13:11
kind: review
title: User guidance on the overnight results (pasted, adopted), corrections, and the next two comparisons, logged before building or running
---
**2026-10-17 ≈ 13:11 UTC — User guidance on the overnight results
(pasted, adopted), corrections, and the next two comparisons, logged
before building or running.**
- **Decisions:** run the mean-matched latent-state check next; the
  contact deficit is a **blocker** for moving straight to step 5.
- **Corrections to the 13:10 entry:** (1) "contacts" are distance
  crossings between tracked centres, not verified touches; physical creep
  is a hypothesis — slowly varying tag error could make some crossings,
  and packing changes how many pairs sit near the threshold. The earlier
  measurement-vs-creep comparison found little difference in the motion
  rows; it did not establish equivalence for contacts. (2) The 0.76 /
  0.26 split was light only and came from combined ratios. **Direct
  counts** (`scratch/contactSplit.py`, 4.1 mm, control / data): light
  moving-involved 0.78 [0.69, 0.88], still-still **0.26** [0.23, 0.29];
  dark moving-involved 1.19 [1.01, 1.42], still-still **0.29** [0.27,
  0.33] (data still-still 123 / 108 per ant-hour). The persistent deficit
  is in contacts between ants classified as still. (3) "T2 can't come from
  a higher constant rate" was too strong: a rate change alters crowding,
  which ants contribute complete runs and their observed sequences, and
  the model already gives T2 > 0. (4) C-b supports only "no recovery
  signature in complete observed still runs from 10 s on"; shorter
  refractoriness and effects hidden by selective censoring are not
  excluded. (5) The slow-episode result rejects the tested settings, not
  the mechanism.
- **Comparison L (mean-matched latent state), SD 1, τ 60 s, paired seeds:**
  (L0) baseline (existing); (L1) constant walk-on × exp(SD²/2) = ×1.6487
  (new, `--oracle const:1.6487`); (L2) existing latent multiplier exp(x)
  (mean ×1.6487; `lat-l1-60`); (L3) mean-one latent exp(x − SD²/2) (new,
  `--oracle placebo:1:60:unit`). Outputs per arm: rows (`diagS2018`, 4
  seeds), T2 (4-h light, `t2Paired.py`), persistence (`simact.py`),
  contacts (lite, light and dark, moving-involved / still-still split)
  and **realised activity** (stillness rows, moving fraction from
  `simact.py`). **Reading, fixed now** — judged together: the
  *variability* part of the latent state is supported if L3 vs L0 has
  nurse T2 difference CI above 0, nurse P2 and P10 |z| both falling, and
  nurse 6-h persistence within 0.10, **and** L3's T2 gain exceeds L1's
  (paired L3 − L1 colony-bootstrap CI above 0). If L1 reproduces L2's row
  and T2 gains (within their CIs), the gain is a rate effect and the
  latent state in this form is not supported. Anything between is
  reported as a decomposition (rate part L1 − L0, variability part L2 −
  L1, mean-one L3 − L0), with realised activity beside it, since matching
  the stationary mean does not match realised activity.
- **Comparison O (contacts under the observation variants):** the
  calibrated observer variants of 03:05 — M (tag 0.7 mm / 90 s), B (rest
  0.7 mm / 90 s), both with pixel rounding, and P (rounding only) — through
  the contact extractor (lite, light and dark, 12 h, seed 4242, paired
  with the overnight control). **Reading, fixed now:** measurement drift
  *substantially changes the apparent contact rate* if, for M or B, the
  paired still-still contact ratio (variant / control, geometric mean)
  is ≥ 1.25 with its CI excluding 1; then the data's still-still excess
  may partly be a tracking effect and the contact statistic needs a
  measurement-robust form before creep is modelled. Otherwise physical
  creep stays the leading hypothesis, to be tested only by an arm that
  moves actual bodies and respects geometry (a separate design later;
  the observer offset cannot test geometric consequences). Moving-
  involved contacts and near share reported beside it.
- No other arms. Spread analysis and C-a are still being read under
  their own entries.
