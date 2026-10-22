---
id: D080
date: 2026-10-20
time: 14:39
kind: run
title: C2 judging run (D041 / D042) with C1 beside and D076's model side: settings fixed before launch
---
- **2026-10-20 ≈ 14:39 UTC — C2 judging run (D041 / D042) with C1 beside and D076's model side: settings fixed before launch.**
  - **What:** the whole-model judgment fixed in D041 / D042, run for the first time. C1 has never been judged on fresh
    seeds (only diagnosed), so both run now, on the same 36 definitions, with C1 beside as D042 asks. The run also
    collects D076's model side (approved D077; data side read in D079, F067).
  - **Settings (declared now; D042 asked for a declared judging precision and none was fixed before):**
    - `diagS2018.ts --candidate C2 --fit data/fits/s2018-motion-c2.json` and `--candidate C1 --rows 36 --fit
      data/fits/s2018-motion-c1.json`, both `--seeds judge --reps 22 --dt 0.05 --warmup 7200 --obs 21600 --rest`;
      the frozen tracker observer (default); light phase as the fit.
    - **Seeds:** the `judge` purpose (`seedFor(2018, 'judge', 0x1d6e, i)`), used by no fit or diagnostic before. The
      same seeds for C1 and C2, so the comparison is paired.
    - **Reps 22 per colony** (484 runs per candidate). The D046 benchmark gives ≈ 20 min per 242 runs at these
      settings, so ≈ 40 min each. SE_sim then sits well below SE_data (seed noise within colonies over 22 runs).
      Each run's model site field comes from 21 other runs.
    - **Then** `reportS2018.ts --est judge-c2 --start judge-c1 --fit data/fits/s2018-motion-c2.json`: combinedZ per
      row and phase, the paired C1 → C2 trade, parameters at or near box ends.
    - Outputs on the box: `logs/c2/judge-{c2,c1}.{json,log}`, `logs/c2/judge-report.log`. Script
      `scripts/scratch/box/run-c2judge.sh` (md5 of every input printed first).
  - **D076 model side (`--rest`, `scripts/restLib.ts`):**
    - E for each run comes from the same colony's other runs (the focal run left out), every worker's still steps in
      their 6-h windows, normalised on the model nest (0–70 × 0–40 mm).
    - Colony values come from the colony's runs (one window each), with D076's weights.
    - The colony sets are the data's (the 2026-10-18 colony-set rule): persistence statistics on the colonies where
      the data have z_full and z_part (nurses 22, foragers 20); z_E where the data have it (22 / 21). A simulated
      colony missing a value on its set makes that group's reading unjudgeable, never a smaller set.
    - SE_sim: SD of a bootstrap over runs within each colony (2000; seed noise, as the judging rows' SE_sim). The CI
      is from the same bootstrap.
    - Readings by D076, mechanically against D079's data summary. Since the data read "mostly not spatial" in both
      groups, D076's "carries as per-ant activity what the data share" reading cannot arise (D079).
  - **Reading:** D041 / D042 as fixed.
    - Adequate = no row |z| > 3, at most 2 in (2, 3], no free parameter at or within 5 % of a box end (σ_drive at its
      lower bound read as "little or no drive needed for that role").
    - Then the checks at the optimum, disclosed and not judged.
    - Not adequate → failing rows and the C1 comparison go to the user.
    - D076's readings beside, without changing the verdict.
  - **Box:** idle before launch. 11 changed files copied. SHA-256 of every simulation, script, fit and reference file
    equals the local tree, except the known files outside the run (UI, paper and record scripts, old box scripts)
    and `data/fits/s2018-motion-c2.json` (box only, unopened until this run). `test/restPosition.test.ts` and
    `test/activity.test.ts` pass on the box (15 / 15).
  - From this entry on, the C2 outputs are read (D075's hold ends).
- 2026-10-20 ≈ 14:40 UTC: launched, `run.sh` run `c2judge-20261020T143946Z` (box, 62 workers); ≈ 1.5 h projected.
