---
id: D033
date: 2026-10-17
time: 21:31
kind: decision
title: User decisions on the guard and Q (pasted, adopted), and comparison WR (wall rule) designed before building
---
**2026-10-17 ≈ 21:31 UTC — User decisions on the guard and Q (pasted,
adopted), and comparison WR (wall rule) designed before building.**
- **Guard re-anchored to the data (option B; the user withdrew
  "preserve exits" given the baseline's excess).** Exact rule: for each
  guarded quantity, mismatch **m = max(model / data, data / model)**;
  an arm passes a quantity if **m_arm ≤ 1.10 × m_baseline**. Quantities,
  each separately: exits per in-nest ant-hour (light, dark), moving
  fraction (light, dark), the light / dark ratio of the moving fraction,
  and the light / dark ratio of moving-involved contacts (cell 5.1 /
  dwell 0, per detected ant-frame). Passing means **acceptable for the
  next comparison**, not that the quantities are reproduced.
- **Q's interpretation (beside the table verdict, which stands):** the
  missing activity guard, applied now: W+E(0.25) / W+E(1.0) moving
  fraction ≈ 0.008 / 0.0025 against the data's 0.024 / 0.018 (21:26).
  What Q shows is **an over-packed, nearly frozen colony plus M-sized
  error producing enough crossings** — a narrow demonstration of
  possibility; it does not resolve the contact blocker.
- **Packing follow-up (later, pre-registered separately):** every arm
  guarded against the data and compared with the chosen wall control;
  aggregation changes where stops happen, and realised activity, exits
  and still-run durations are checked (preserving the nominal stop rate
  is not enough).
- **Oracle correction:** unchanged, read on its 05:11 rule and geometry.

*Comparison WR — wall rule.*
- **Arms** (start point, 22 colonies × light / dark × 12 h, seed 4242,
  control observer, `--lite --robust`): **W** (uniform inward heading;
  Q's `q-W-ctl` runs reused, same seeds and code) and **W-spec**
  (specular reflection: at an edge the heading is mirrored — of π − h and
  −h, the one whose next 0.5 mm stays on the surface; if both, the
  smaller turn; if neither, reverse; no random draw). Neither adds a
  chance to stop or changes rests. Reference: Q's baseline (`q-base-ctl`)
  and the data (exits `logs/q/exits-data-*`, moving fraction from X's
  per-ant series, moving-involved contacts from `logs/robust/data-*`).
- **Guard per quantity as above**, on geometric means over colonies
  (point estimates). **Uncertainty rule, fixed now:** the colony
  bootstrap (2000, colonies resampled jointly for arm, baseline and
  data) of m_arm / m_baseline is reported per quantity; a quantity
  passes on its point estimate; if its 95 % upper bound exceeds 1.10 the
  pass is labelled "uncertain" (still a pass); a rule passes if every
  quantity passes.
- **Choice:** among passing rules, the one with the lower wall-band
  share (3 mm; the reason for the rule); if neither passes, reported, and
  the packing follow-up waits for the user. Occupancy correlation, S1–S3
  and still–still crossings reported beside, not used.
- **WR built and queued ≈ 21:34.** `ColonyOptions.wall: 'specular'`
  (`ColonySim.specularTurn`), `--wall specular` (`s2018Lib.ts`); test:
  specular changes the run and differs from inward (`test/packingArms`;
  13 / 13 with `test/oracle`; tsc clean). Data references for the guard
  precomputed in `logs/q/guard-data.json` (exits from
  `exitsData.ts`, moving fraction from X's per-ant series,
  moving-involved contacts from `logs/robust/data-*`); aggregator
  `scripts/scratch/wrAgg.py` (not run). `run.sh` run
  `wr-20261017T213410Z` waits for the oracle run's exit file, then
  installs the staged `colonyBles.ts` / `s2018Lib.ts` (md5 checked; the
  running oracle jobs keep their loaded copies) and runs 44 W-spec runs.
