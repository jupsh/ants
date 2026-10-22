---
id: D091
date: 2026-10-20
time: 18:40
kind: run
title: Checks at C2's fitted settings launched (D089 amended, D090): commands, equivalence and box checks
---
- **2026-10-20 ≈ 18:40 UTC — Checks at C2's fitted settings launched (D089 amended, D090): commands, equivalence and box checks.**
  - **Script** `scripts/scratch/box/run-c2checks.sh` (md5 of every input printed first). Per candidate (C2, C1) and diag
    run index i = 0 … 87 (colony i mod 22, 4 runs per colony, the same indices for both, largest colonies first):
    `tmpShortSim.ts --candidate <C> --fit data/fits/s2018-motion-<c>.json --trips --seeds diag --index i --warmup 7200
    --obs 43200 --lite --robust --tag chk-<c>`, 62 at a time. 176 output files → `logs/c2/checks/` (plus one log per run).
  - **Equivalence (D089 amendment 1):** both candidates identical to diagS2018 on colony112 (261 row values and
    foragersIn); outputs present (rows, trips complete / open, crossings, packing).
  - **Box:** idle, nothing running (`run.sh status`). The md5 of 19 inputs (runner, its scratch recorders, `s2018Lib`,
    `lib`, `pool`, the four fits, the fit rows) and every `src/sim` file equals the local tree. Copied to the box first:
    `tmpShortSim.ts` (the change), `syncStats.ts` (the box had an older version; synchrony output is not used here) and
    the script. Not synchronised, not used by the run: `package.json` / `package-lock.json` (local OCR tooling and the
    `runs` script), `src/main.ts` (UI).
  - **Analysis:** D089 as amended. The aggregator is written before the outputs are fetched; nothing from the run is
    looked at before then except `run.sh status`.
  - **Budget:** ≈ 45 min (D089 amendment 1). The box is kept afterwards (D090).
- 2026-10-20 ≈ 18:40 UTC: launched, `run.sh` run `c2checks-20261020T184019Z` (box, 62 at a time).
