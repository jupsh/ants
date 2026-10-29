---
id: F100
title: At its calibrated strength (A = 3), Part D's Es member is clipped in 94 % of trajectory samples (applied mean g 0.33, E[1/g] 3.8): in practice a two-level switch, not a mean-1 shared signal
topic: synchrony
status: established
date: 2026-10-29
data: logs/partd2/mult-2a.json (Stage 2a verification runs, simulation)
evidence: docs/log/2026-10-29-2121-part-d-stage-2a-multipliers-read-p21-p46.md
bears_on:
related: F098
supersedes:
superseded_by:
depends:
---
Multiplier along the oracle trace's samples, 2 × 22 verification runs: before clipping 0.52, applied 0.33, clipped
94.3 %; mapping M's clamp [0.25, 4] holds Es mostly at g = 0.25 with brief bursts at 4. For comparison, the calibrated
T members are clipped ≈ 10 % (applied ≈ 0.8) and the other D members < 1 % (≈ 1.0). Es's D_w calibration (F098) was
reached in this regime. Descriptive (D158); it bears on how Es is read in Stage 2b and the capability test.
