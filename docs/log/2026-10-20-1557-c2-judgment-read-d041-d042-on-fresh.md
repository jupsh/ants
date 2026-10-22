---
id: D081
date: 2026-10-20
time: 15:57
kind: reading
title: C2 judgment read (D041 / D042 on fresh seeds; run c2judge-20261020T143946Z, ok, 1 h 16 m): C2 not adequate; C1 beside, also not adequate; D076 model side
---
- **2026-10-20 ≈ 15:57 UTC — C2 judgment read (D041 / D042 on fresh seeds; run c2judge-20261020T143946Z, ok, 1 h 16 m): C2 not adequate; C1 beside, also not adequate; D076 model side.**
  - **Run:** D080's settings. Box md5 of every input printed first; they equal the files checked at launch. C2 484
    runs in 39.5 min, C1 in 33.7 min; no missing simulated values. Outputs fetched to `logs/c2/judge/`. The C2 fit file
    is copied to `data/fits/s2018-motion-c2.json` (md5 `bccbe886…`, as on the box). C1's table comes from the same
    report with the two outputs swapped (local, no new runs).
  - **Verdict (D041 / D042, mechanically): C2 is not adequate.**
    - **Rows:** 15 of 36 at |combinedZ| > 3, 6 in (2, 3], 15 within 2. The rule allows 0 above 3 and at most 2 in
      (2, 3].
    - **Box ends** (the 5 % rule): `restShape` 1.001 (unit 0.000, the D3 lower bound), `nurse.driveSd` 1.99 (unit
      0.996, upper), `forager.driveSd` 1.94 (unit 0.970, upper), `restCrowdExp` 1.19 (unit 0.953, the provisional
      1.25 search boundary). The σ_drive exception covers the lower bound only; both drives sit at the upper bound.
  - **C1 beside, same seeds:** not adequate either: 24 of 36 above 3, 4 in (2, 3], 8 within 2; `encounterStop` at a
    bound. Debiased loss on the judging seeds: C2 963.2, C1 1024.1 (floor ≈ 16; "every row at 2 SE" ≈ 130).
  - **Rows by family**, combinedZ light / dark; C1 in brackets:

    | family | nurse | forager |
    |---|---|---|
    | still fraction | **−7.8 / −13.1** (−3.3 / −7.8) | −2.1 / **−4.4** (1.9 / −0.5) |
    | moving speed | −2.5 / −1.7 (2.2 / 3.4) | 2.8 / 2.6 (2.9 / 2.7) |
    | still-run mean | −1.6 / −1.7 (−4.1 / −3.8) | **−3.7** / −2.8 (−4.0 / −3.1) |
    | P(still ≥ 2 s) | **3.5** / 2.7 (5.3 / 4.5) | 0.9 / 0.5 (6.2 / 6.8) |
    | P(still ≥ 10 s) | **10.3 / 10.9** (6.9 / 6.8) | 2.9 / **5.0** (4.8 / 7.4) |
    | P(still ≥ 60 s) | **4.6 / 6.8** (−1.9 / −0.4) | −2.2 / −0.2 (−5.1 / −3.6) |
    | moving-run mean | 0.4 / 0.9 (1.1 / 1.7) | **−3.7 / −3.5** (1.4 / 0.8) |
    | P(moving ≥ 2 s) | −0.4 / −0.1 (2.4 / 3.2) | −0.5 / −1.1 (7.4 / 6.8) |
    | persistence (light) | −2.9 (−11.6) | **−4.9** (−7.9) |
    | top-20 % share (light) | **−12.7** (−12.1) | **−8.8** (−6.0) |

    - **Gains over C1 (paired shifts, report "trade"):** per-ant persistence (nurses r ≈ 0.58 vs data 0.66; foragers
      0.41 vs 0.62), the short-stop rows (P2 still and moving, both groups), forager tails, nurse still-run mean.
    - **Costs:** nurse still fraction (0.974 vs 0.984 / 0.989), nurse still-run tails P10 and P60 (too many long
      runs), forager still fraction (dark) and moving-run mean, top-20 % forager.
    - **Unchanged:** the top-20 % spread: the model's activity is far more even across ants than the data's (nurses
      0.36 vs 0.51) even with the drive at its upper bound.
  - **Fit facts now seen** (from the report): all three CMA-ES runs ended at their generation caps, not converged
    (phase 1: start 0 30 gen σ 0.62; start 1 30 gen σ 1.19; phase 2 from start 0, 60 gen, σ 0.61). Selection-batch
    loss 960.1 vs 963.2 on the judging seeds, so no sign of selection on seed noise.
  - **D076 model side** (beside the verdict; readings mechanical):

    | | S (data) | S C2 (z) | S C1 (z) | z_E (data) | z_E C2 (z) | z_E C1 (z) |
    |---|---|---|---|---|---|---|
    | nurse | 0.047 | 0.000 (−2.87) | −0.008 (−3.31) | −0.211 | 0.004 (4.52) | 0.017 (4.80) |
    | forager | 0.087 | −0.003 (−3.43) | 0.013 (−2.57) | −0.335 | −0.022 (6.52) | 0.091 (8.90) |

    - C2 nurses fall in the band D076 labels "reproduces how much is spatial" only by |z| ≤ 2. At −2.87 they don't.
      Both groups of both candidates read "less spatial than the data, against a 'mostly not spatial' data reading",
      the case D076 left unlabelled.
    - Descriptively: in both models rest position carries none of the persistence, and an ant's activity level has
      no link to where it rests. In the data, more active ants rest in less occupied places (F067). The models'
      per-ant activity is placeless.
    - zFull here (colony values (n − 3)-weighted over runs) is 0.665, against the row's 0.666 (plain mean over runs):
      the weighting differs, as defined.
  - **Checks at the optimum** (spread rule, crowding, stays and trips, packing, contacts; disclosed, not judged): not
    run yet. They need their own diagnostics, and the user decides whether they are worth running on a non-adequate
    fit.
  - **Outcome (D041 / D042):** not adequate, so the failing rows and the C1 comparison go to the user. The user decides:
    proceed provisionally (C2 or C1) or stop step 4. No mechanism is added automatically. Findings F068 (C2), F069 (C1
    judged), F070 (D076 model side).
