---
id: D137
date: 2026-10-24
time: 16:25
kind: decision
title: Brood-coordinate allowlist frozen (D134 item 3): 176 main-experiment PreTreatment files (22 fit colonies × 8 bins), SHA-256 250b631c…; development-only role; PostTreatment and age-experiment files not fetched
---
- **2026-10-24 ≈ 16:25 UTC — Brood-coordinate allowlist frozen (D134 item 3): 176 main-experiment PreTreatment files (22 fit colonies × 8 bins), SHA-256 250b631c…; development-only role; PostTreatment and age-experiment files not fetched.**
  - **Authority:** D134 item 3 (user). Development-only use of main-experiment PreTreatment brood coordinates, by an
    explicit filename allowlist frozen before extraction. Age-experiment and PostTreatment files stay unopened. Brood
    proximity is descriptive; box / age comparisons are not causal.
  - **Role:** **development** (inspected; never a fit target). The same 22 colonies as the fit tracks; STATUS § roles
    gains this line.
  - **Allowlist:** `data/stroeymeyt2018-brood/brood-allowlist.txt` (local, git-ignored; moved there after extraction, below),
    **SHA-256 `250b631ce3b1e768bab76387a820464bf828fb44487aa393d698515289089404`**, 176 names.
    - **Rule:** archive members under `main_experiment/original_data/brood_coordinates/` whose name contains
      `PreTreatment` and not `PostTreatment` (`scripts/fetchStroeymeyt.py --brood-allowlist`).
    - **Structure:** `…/colony<NNN>_<treatment>_PreTreatment/brood_TD<h>_TH-<h>.txt`. 8 per colony (the 8 rows of
      each local `time_aggregation_info` PreTreatment file), exactly the 22 fit colonies. Every name has a negative
      TH (hours before treatment). 726,994 bytes uncompressed.
  - **Exposure:** reading the archive's central directory held all member names in memory. Only the 176 candidate
    names were written or printed, plus a count of 176 other files in that folder; no other name was seen. No content
    of any non-allowlisted file was read, and none was fetched. No contamination entry.
  - **Extraction:** `python3 -I scripts/fetchStroeymeyt.py --brood data/stroeymeyt2018/brood-allowlist.txt --sha256
    250b631c…` fetches exactly these names. It refuses if the hash differs or any name breaks the rule.
  - **Not approved here:** the hourly images (README item 18).
  - **2026-10-24, extracted:** 176 fetched, exactly the allowlist (file list diffed against it). They were then moved,
    with the allowlist, to their own git-ignored directory `data/stroeymeyt2018-brood/` (same relative paths; fetch
    with `--out data/stroeymeyt2018-brood`). That keeps development-only data out of `data/stroeymeyt2018/
    main_experiment`, which stamped results hash as an input. The move also cleared the "main_experiment changed"
    staleness its arrival had caused. The allowlist's SHA-256 is unchanged.
