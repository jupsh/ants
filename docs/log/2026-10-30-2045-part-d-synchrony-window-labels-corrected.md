---
id: D204
date: 2026-10-30
time: 20:45
kind: correction
title: Part D synchrony window labels corrected: the S1 D_w cells are 5 s, 1 min and 10 min (SYNC_W in frames at 2 fps), not 10 s, 2 min and 20 min as D194, D203, F103, F104 and STATUS wrote; verdicts and numbers unchanged
---
- **2026-10-30 ≈ 20:45 UTC — Part D synchrony window labels corrected: the S1 D_w cells are 5 s, 1 min and 10 min (SYNC_W in frames at 2 fps), not 10 s, 2 min and 20 min as D194, D203, F103, F104 and STATUS wrote; verdicts and numbers unchanged.**
  - **Found by:** the lead, while drafting D201's measurement list (a new session). The Stage 2b reader
    `scripts/scratch/partD2b.ts` computes S6 from `all.120` under the comment "D_w at 1 min", and excludes `all.120`
    from the rows as the 1-min calibration cell (D173). That cell cannot be 2 min.
  - **Evidence:**
    - `scripts/scratch/syncStats.ts:11`: `SYNC_W = [10, 120, 1200]; // 5 s, 1 min, 10 min`, window lengths in frames at
      2 fps, for data and simulation alike.
    - The data's values match the earlier record's windows: D_w all ants 4.15 at 1 min and 6.28 at 10 min (D108; F022);
      Part C's screen row "D_w all 10 min | 6.28" (D122).
    - `logs/partd2/assess/read.json` names the rows by key (`S1 D_w all.1200`, …), with no unit.
  - **What was wrong:** D194 read the keys as seconds ("S1 cells as the reader names them: 10, 120 and 1200 s") and
    labelled the cells 10 s, 2 min and 20 min. F103, F104, D203's "Next", STATUS's RESUME and a T033 history line
    carried "20-min D_w" from it.
  - **Correct labels:** 10 → **5 s**, 120 → **1 min**, 1200 → **10 min**. The shortfall F104 describes is at **10 min**,
    the slowest window S1 measures; nothing slower than 10 min was measured in Part D.
  - **Unchanged:** every number, CI, tolerance, row class and verdict (the rows are relative, ±20 %, and the reader
    is untouched). The reader is frozen and is not edited; only the records' labels change.
  - **Corrected in place, each with a dated line:** D194 (title, table, text), D203 ("Next"), F103, F104 (title and
    text), STATUS (RESUME). T033's history line cannot be edited; a note on T033 points here.
