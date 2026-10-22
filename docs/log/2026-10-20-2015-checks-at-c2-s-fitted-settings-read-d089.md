---
id: D092
date: 2026-10-20
time: 20:15
kind: reading
title: Checks at C2's fitted settings read (D089 amended, D090; run c2checks-20261020T184019Z, ok, 35 m), C1 beside: disclosed, not judged
---
- **2026-10-20 ≈ 20:15 UTC — Checks at C2's fitted settings read (D089 amended, D090; run c2checks-20261020T184019Z, ok, 35 m), C1 beside: disclosed, not judged.**
  - **Run:** D091's script, exit 0, 35 m (18:40–19:15 UTC). 176 output files (88 per candidate, indices 0–87), each
    with rows, trips, crossings, packing and foragersIn (checked by the aggregator; none missing). No run log shows an
    error. The 19 printed input md5s equal the local tree. Fetched in one tar stream to `logs/c2/checks/` (outputs, per-run
    logs) and `logs/runs/c2checks-20261020T184019Z/`. Aggregated by `scripts/scratch/checksAgg.py` (written before the
    fetch) → `logs/c2/checks/checks.log`, `summary.json`.
  - **Disclosed:** the aggregator's dry run (on the two equivalence runs, before the fetch) showed the 6-h spread values
    from the judging runs. They are not withheld data, and nothing here is judged.
  - **Conventions:** D089 amendment 1. The model has one prediction ("light" window), set against each data phase, so
    the model columns are the same for L and D. Model SE from run blocks; data SE colony-block; ratios with colony
    bootstrap.
  - **1. Spread rule** (per-ant SD of still fraction; z of log(SD_sim / SD_data), SE_data ⊕ SE_sim, 12-h runs; 6-h
    judging runs in brackets):

    | cell | data | C2 | z C2 | C1 | z C1 |
    |---|---|---|---|---|---|
    | nurse L | 0.014 | 0.013 | −0.9 (−0.2) | 0.009 | **−4.8** (−2.7) |
    | nurse D | 0.012 | 0.013 | +0.9 (+1.6) | 0.009 | −2.9 (−0.8) |
    | forager L | 0.049 | 0.017 | **−10.1** (−9.0) | 0.017 | **−10.2** (−8.3) |
    | forager D | 0.045 | 0.017 | **−9.8** (−8.6) | 0.017 | **−9.9** (−7.9) |

    - Per-ant speed SD beside: too small everywhere (C2 z −4.2 to −9.0; C1 −6.8 to −9.4).
    - The rule's condition (z < −3 in any cell) holds for both candidates (foragers). Its action (add a trait, refit) is
      not applied: C2 has the trait, and C3 is deferred (D088, D089).
  - **2. Crowding** (Spearman across colonies with each side's own density; 90 %):
    - Moving-run mean: data −0.28 to −0.56. C2 −0.89 (nurses), −0.93 (foragers). C1 −0.97, −0.87.
    - Moving-only speed: data −0.28 / −0.29 nurses, −0.38 / −0.54 foragers. C2 −0.12 nurses, −0.47 foragers. C1 −0.54,
      −0.52.
  - **3. Stays and trips** (12-h windows; data 12-h phases, open trips censored at the stream / window end):
    - V_stay (complete forager stays ≤ 300 s, ≥ 5 per colony): data 1.22 / 1.30 mm/s. C2 0.44 (z −9.6 / −12.1), C1
      0.56 (z −8.1 / −10.4).
      - ≤ 1200 s: data 0.75 / 0.83, C2 0.31, C1 0.35.
      - All stays: data 0.24 / 0.27, C2 0.23 (z −1.0 / −3.1), C1 0.19.
    - Stay median: data 769 / 498 s, C2 3195, C1 2862. Stay mean: data 3629 / 1911 s, C2 4622, C1 4245. Stays per
      colony: data 252 / 224, C2 172, C1 192 (|z| < 2).
    - Trips (`calibTrips`' statistics, z against L / D / their average):
      - trip.n: C2 190 vs 255 / 233 (avg z −1.3);
      - foragerIn: 0.77 vs 0.82 / 0.72 (avg z 0.0);
      - S(30 s): C2 0.81 vs 0.83 / 0.90 (avg z −2.9; C1 0.72, z −8.5);
      - S(120 s): C2 0.75 vs 0.44 / 0.66 (+4.6);
      - S(600 s): C2 0.74 vs 0.20 / 0.34 (+12.9);
      - S(3600 s): C2 0.002 vs 0.07 / 0.12 (−4.7);
      - trip median: 2164 s vs 144 / 423, the same in C1 (2160). As F038: the fixed give-up time shapes the trips.
    - **Missing** (< 5 short stays): data colony265 (both phases). C2 11 of 88 runs (colony220 4, colony237 3,
      colony261 3, colony265 1); C1 4 of 88 (colony112, colony215, colony220, colony261).
  - **4. Packing** (`packAgg`'s statistics; model / data per colony, geometric mean [95 %]; all ants, light; dark
    within 0.02 except A50):
    - Median NN: C2 1.17 [1.09, 1.27] (2.48 vs 2.17 mm), C1 1.36.
    - Share NN < 4.1 mm: C2 0.81 [0.76, 0.86] (0.80 vs 0.96), C1 0.73. Nurses 0.79, foragers 0.87.
    - Share NN < 8.2 mm: C2 0.97, C1 0.96.
    - A50: C2 1.82 [1.63, 2.07] light, 2.04 dark (652 vs 367 / 317 mm²); C1 0.75 / 0.84 (274 mm²).
    - Occupancy correlation with the data, 5-mm cells: C2 median r +0.44 (range +0.15 … +0.70; dark +0.43), C1 −0.04.
  - **5. Crossing rate versus density** (crossings of tracked centres into 4.1 mm, far past 5.1 mm; not the row-4
    front-contact observer). Model / data per ant-hour, geometric mean [95 %], light / dark:
    - all: C2 0.63 [0.56, 0.71] / 0.81 [0.71, 0.93]; C1 0.45 / 0.57;
    - still–still: C2 0.34 / 0.39; C1 0.19 / 0.21;
    - moving-involved: C2 0.96 [0.84, 1.09] / 1.46 [1.24, 1.74]; C1 0.74 / 1.13;
    - moving share of crossings: data 0.48 / 0.42, C2 0.72, C1 0.78. Near share: data 0.95, C2 0.80, C1 0.74;
    - Spearman of crossing rate with density: data +0.14 [−0.32, +0.54] / +0.16; C2 +0.56 [+0.23, +0.80]; C1 +0.67.
  - **Implications for step 5** (one line each; no mechanism search, no verdict):
    1. *Spread:* C2's foragers, the recruiters in Mailleux 1999, are far more alike in activity than real foragers.
       Between-recruiter variation in step 5 will be understated.
    2. *Crowding:* the model's moving-run lengths depend on density much more strongly than the data's. Step 5's
       density input (a literature prior, F043) will move the motion more than the data suggest it should.
    3. *Stays and trips:* C2's foragers move slowly within short stays (0.44 mm/s, below Stroeymeyt's 1.22 and the 1999
       recruiter's 0.81) and stay too long. Step 5's distance rows start from a recruiter that moves too little per
       short stay. Trip shapes remain set by the trip inputs (F038).
    4. *Packing:* C2 is closer to the data than C1 (less isolation, occupancy positively correlated with the data's).
       Its ants still spread over about twice the data's area and are less often within a body length of another.
    5. *Crossings:* the still–still deficit carries forward (about a third of the data's). Crossings involving a mover
       match in light and exceed the data in dark. Crossings rise with density, which the data's do not clearly do.
       Contact opportunity in step 5 depends on density and movement more than in the data.
  - **C1 beside, what C2 changed:** packing (A50 from concentrated to over-spread, occupancy correlation −0.04 → +0.44),
    crossings (closer on every split), S(30 s) and the nurse spread are better in C2. Short-stay speed and stay length
    are worse in C2. Forager spread, crowding and trip shape are about equal.
  - Findings F075–F079. Reproduction material is local: outputs and logs in `logs/c2/checks/`, the runner and aggregator
    in `scripts/scratch/` (local only, excluded from git like all scratch), the box script
    `scripts/scratch/box/run-c2checks.sh`. The box is kept (D090).
- 2026-10-20 ≈ 20:22 UTC (time from `date -u`), **corrections (user review).** They replace the text above where they
  conflict; the original stays for the record.
  - **Correlation is not slope** (implications 2 and 5). Spearman −0.89 / −0.93 says moving-run length falls more
    *consistently* with density across model colonies than in the data (a stronger rank association). It does not say
    it falls more steeply, or that changing density moves the model's motion more than the data's. That sensitivity is
    untested. The same applies to crossings: their rate is positively rank-associated with density across model
    colonies (ρ +0.56), with no slope implied.
  - **Recruiter variation** (implication 1) is *at risk of being understated*, not certain to be. The forager activity
    deficit is established in the Stroeymeyt setup only. In Mailleux 1999, hunger, crop loads and food sharing also
    contribute to variation.
  - **Short stays: unequal eligibility.** The aggregator averages the eligible runs in each block. All four C2 runs of
    colony220 are ineligible (< 5 short stays), while the data exclude colony265. So the means and z-scores of the
    short-stay rows (V_stay ≤ 300 s) compare different colony mixtures, and those z-scores are affected by that
    selection. The descriptive result and the missing counts stand. Among eligible observations, 0.44 vs 1.22–1.30 mm/s
    remains a substantial warning. It is not the predicted speed of the hungry, food-carrying Mailleux recruiter; the
    transfer run must establish that.
- 2026-10-20 ≈ 20:24 UTC, **reproduction archive (user request):**
  - **File:** `~/ants-archive/2026-10-20-c2-judge-diag-checks.tar.gz` (97 MB; SHA-256 `a82bdfea…`, in the `.sha256`
    beside it). Outside the repo, local disk only.
  - **Contents:**
    - the scratch scripts (runner, recorders, aggregators, data-side scripts, box scripts for D080, D086, D091);
    - the uncommitted tree state: a patch against `f0a05a0` and the untracked files;
    - the judgment, diagnostic and check outputs, and the three runs' `run.sh` folders;
    - the packing and crossing data sides;
    - `meta/MANIFEST.txt`: SHA-256 of every simulation input and scratch script.
  - The judgment run's folder (`logs/runs/c2judge-20261020T143946Z`, exit 0) was fetched from the box for it.
  - An off-machine copy is the user's call.
