---
id: D155
date: 2026-10-25
time: 03:57
kind: run
title: S2 audit launched (D154): the frozen run, gate passed for run:s2audit on T032
---
- **2026-10-25 ≈ 03:57 UTC — S2 audit launched (D154): the frozen run, gate passed for run:s2audit on T032.**
  - `bash scripts/run.sh start s2audit --node T032 -- bash scripts/scratch/s2AuditRun.sh logs/s2audit 14`; run folder
    `logs/runs/s2audit-20261025T035716Z/`. Hashes re-verified against D153 just before launch, and the output folder
    did not exist.
  - Gate: `plied review T032 --action run:s2audit --gate` passed (exit 0). P33 satisfied; P22, P32, P34, P35, P38 and
    P39 acting, with reasons in their reviews.
  - Order (frozen script): 132 simulated files (base, Eu, El20), then the 22 data files, then the reader
    (`s2audit-main.json`). The extension runs only if that reader prints "extend".
