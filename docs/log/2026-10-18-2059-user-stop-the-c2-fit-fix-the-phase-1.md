---
id: D069
date: 2026-10-18
time: 20:59
kind: decision
title: User: stop the C2 fit; fix the phase-1 switch; relaunch after the amended design is approved
---
- **2026-10-18 ≈ 20:59 UTC — User: stop the C2 fit; fix the phase-1 switch; relaunch after the amended design is approved.**
  - Why (D068): phase 1's axis switch (σ·max D < 0.25) was met mechanically at generation 0 by both starts
    (σ × largest probe SD ≈ 0.063 / 0.036), so phase 1 did no search; a "not adequate" judgment would not separate
    model failure from search failure. Exception to D055's no-extension, no-restart rule, granted by the user.
  - Action: `run.sh kill c2fit-20261018T152000Z` (that run's process group only). Kept as they are: the checkpoint
    `logs/fitS2018-c2.ckpt.json` and `logs/c2/fit.log` on the box (not read beyond D068). No output was written.
  - Next: an amended phase-1 design, logged and approved by the user before any relaunch; the relaunch starts
    fresh (new checkpoint key), never from this checkpoint.
