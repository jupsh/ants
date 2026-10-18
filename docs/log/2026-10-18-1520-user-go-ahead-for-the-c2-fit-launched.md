---
id: D055
date: 2026-10-18
time: 15:20
kind: decision
title: User: go-ahead for the C2 fit; launched
---
- **2026-10-18 ≈ 15:20 UTC — User: go-ahead for the C2 fit; launched.** `npx vite-node scripts/fitS2018.ts
  --candidate C2` (defaults = the approved design: phase 1 dt 0.1, 2 h + 6 h, both starts side by side, ≤ 30
  generations each, C1's switching rule otherwise; selection batch; phase 2 dt 0.05, 2 h + 6 h, σ 0.5, ≤ 60
  generations, tolX 0.03, from the better selected start only; estimate = mean of the last 20 generation means; no
  extension or restart, enforced by the script). Writes `data/fits/s2018-motion-c2.json`, checkpoint
  `logs/fitS2018-c2.ckpt.json`, log `logs/c2/fit.log` (box). `run.sh` run `c2fit-20261018T152000Z`
  (`scripts/scratch/box/run-c2fit.sh`); box idle; all 209 simulation, script, fit and reference files
  checksum-identical to the local tree at `544e823`; no earlier C2 checkpoint or output. Projected ≈ 28 h.
  - Monitoring: run state only (`npm run runs -- --box`), hourly. The fit's log is fit-role data; judging stays
    the fixed whole-model judgment (01:41 / 01:43) on fresh seeds after the fit, nothing read from the log is used
    for any choice.
