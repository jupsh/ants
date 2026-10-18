---
id: D038
date: 2026-10-18
time: 00:48
kind: run
title: T aggregator dry run (no T output read)
---
- **2026-10-18 ≈ 00:48 UTC — T aggregator dry run (no T output read).** `tAgg.py` was run end to end on stand-in
  inputs: the W-spec control files from WR copied in for every T arm and observer, and earlier `logs/oc` diag files
  for the rows (all read before). The verdict logic, guards and the still-run rows parse. One omission was fixed: the
  3-mm wall-band share, listed among the "beside" statistics at 22:59, was not printed. It is now printed per arm
  beside W-spec, with wall bounds from the W-spec light occupancy. It does not enter the reading. Box status
  checked only by file counts and timestamps (138 / 220 lite runs at 00:46).
