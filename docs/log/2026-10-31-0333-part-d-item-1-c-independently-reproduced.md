---
id: D228
date: 2026-10-31
time: 03:33
kind: review
title: Part D item 1(c) independently reproduced (D227): a second implementation from the specification alone, blind to the first, agrees on 643 of 646 per-colony values (two colonies, data and arms T20f and base) to 1e-9, covering m, r, D†, D‡, interior bins, presence and absence spells with their Kaplan-Meier counts and medians, clustering, activity by stay age, coverage and light blocks; the 3 others are a duplicate key the first does not write (2) and a block-edge convention in one coverage row (3e-4); D226 stands as amended
---
- **2026-10-31 ≈ 03:33 UTC — Part D item 1(c) independently reproduced (D227): a second implementation from the specification alone, blind to the first, agrees on 643 of 646 per-colony values (two colonies, data and arms T20f and base) to 1e-9, covering m, r, D†, D‡, interior bins, presence and absence spells with their Kaplan-Meier counts and medians, clustering, activity by stay age, coverage and light blocks; the 3 others are a duplicate key the first does not write (2) and a block-edge convention in one coverage row (3e-4); D226 stands as amended.**
  - **What (D227):** a second implementer (D208), briefed with D223 amendment 1 and D225's settled points only and
    blind to the first implementation's code, outputs and report, computed the item's per-colony statistics on a fixed
    sample: colony265 and colony224 (indices 20, 12), data and arms T20f and base. Gated `run:foragers1c-second`. Brief,
    report and the lead's comparison script are in `logs/handoff/20261031-0330-foragers1c-second/`.
    - **Scripts:** `scripts/scratch/foragers1cB.py` (md5 `7a552ded`) and its hand tests `foragers1cBTest.py`
      (md5 `abe5e3ea`), local scratch.
    - **Output:** `logs/partd2/foragers-second/percolony.json` (sha256 `8eea3d85…`).
  - **Its own checks:**
    - **Hand cases pass:** the identity; D† and D‡ on a 2-colony toy; spells under both rules with left truncation and
      censoring; Kaplan–Meier counts, support and "median not estimable"; the clustering benchmark with window edges,
      E_j and a focal ant's repeat entries; binning and the interior mask.
    - **Stored D_w is rebuilt** for both colonies' data and all 8 runs, every group, at 10 and 1 min, to 1e-9.
    - It recorded 21 interpretation choices in its output's `meta.choices`.
  - **The lead's comparison:** the first implementation was rerun on each sample colony alone (gated the same;
    `logs/partd2/foragers-check-c{20,12}/`, the full run's `result.json` untouched), so that its set values are colony
    values. Survival rows were taken from its per-colony Kaplan–Meier tables.
    - **643 of 646 values agree to a relative 1e-9.** The agreeing set includes:
      - m, r, D, D† and D‡ for all groups at 10 and 1 min;
      - the interior rows;
      - every presence and absence S, at-risk, event and censoring count, and the medians, under both rules;
      - clustering observed, benchmark and excess;
      - activity by stay age;
      - entries and exposure;
      - the coverage rows and the light-block rows.
    - **The other 3:**
      - `S.activity.overall` (2 values) is a key the first implementation does not write; it equals
        `B.activity.overall` by construction.
      - `C.seenByDw`, colony224 data: 0.97335 against 0.97366. This is a convention at block edges, where a 10-min bin
        straddles 06:00 or 18:00 UTC (every edge falls 3 minutes into a bin). The first counts the minutes of
        light-labelled bins; the second counts window minutes. The first's convention, matching D_w's own bin
        labelling, is kept. No reading rests on this row.
  - **Not covered:** set values, the bootstrap and common support were outside this check. They were reviewed in the
    first implementation's code (D225) and its synthetic checks.
  - **Effect:** D226's reading, as amended (D226 amendment 1), stands on two agreeing implementations of its
    statistics. F110 is updated.
