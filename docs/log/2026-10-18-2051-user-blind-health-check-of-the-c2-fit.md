---
id: D068
date: 2026-10-18
time: 20:51
kind: decision
title: User: blind health check of the C2 fit (counts only)
---
- **2026-10-18 ≈ 20:51 UTC — User: blind health check of the C2 fit (counts only).** Amends D055's monitoring
  (run state only). Reason: run state cannot see a silent failure, e.g. a missing row making every evaluation an
  infinite loss (`fitS2018.ts` evalAt), which would burn the remaining ≈ 22 h; a crash already shows as `failed`.
  - Rule, fixed before looking: on the box, over `logs/c2/fit.log`, print only (a) the number of generation lines
    whose `best` is not a finite number (NaN / ±Infinity), (b) whether at least one generation line exists (yes/no),
    (c) the number of lines matching error / exception, (d) the checkpoint's mtime. No loss values, generation
    numbers, phase or start labels, line counts beyond these, or log tail are printed or read.
  - Action: (a) = 0, (b) yes, (c) = 0 → healthy, nothing changes. Otherwise the offending lines are shown to the
    user before anyone reads them, and the user decides; the fit's no-extension, no-restart rule is unchanged.
  - The activity-by-zone pre-registration (STATUS, pending) stays blind: these counts say nothing about fit quality.
  - Reading (2026-10-18 ≈ 20:51 UTC): (a) 0, (b) yes, (c) 0, (d) checkpoint written 20:40:01 UTC (11 min before);
    62 pool workers busy, load ≈ 63. Healthy; nothing changes. Nothing else from the log was printed or seen.
- 2026-10-18, amendment 1 (user; between 20:51 and 20:59 UTC): read phase 1's generation count and check it is plausible. Printed
  per start only: the latest generation number, its minutes this generation, and whether that start has
  finished phase 1 (yes/no, without its loss or stop reason). No best / median loss, σ or parameter means.
  Disclosed as known when the activity-by-zone pre-registration is written: phase-1 progress only.
  - Reading of amendment 1 (before 20:59 UTC): each phase-1 start has exactly one generation line (gen 0; 42.3 and 24.0 min) and
    has finished phase 1; phase 2 has 8 generation lines. `cmaes` logs before its stop tests, so each start ran
    one generation and then stopped. Not what the design expected (D044 benchmark: 2 × 30 generations ≈ 10 h).
    C1 from the same two starts (its log, already read) had generation-0 best 18,859 and 114,380 and never reached
    the < 300 switch in 30 generations; the colony-set correction (D045) does not rescale the loss. So the loss
    switch firing at generation 0 is implausible; the likelier cause is the axis switch (σ·max D < 0.25) firing
    mechanically, if every probe SD came out < 0.25 (σ0 = 1, so the generation-0 axis ≈ the largest probe SD; C1's
    probes hit the 0.5 cap on several axes, C2's 6-h cheap window is less noisy). Not confirmed: stop reason and
    probe SDs not read. Goes to the user; the fit keeps running meanwhile.
- 2026-10-18, amendment 2 (user; between 20:51 and 20:59 UTC): confirm the cause. From the checkpoint's finished phase-1 runs, print
  per start only: stopReason, generations, the largest initial (probe) SD and finalSigma. No loss (`f`), estimate,
  mean or parameter values. If the largest SD ≥ 0.25 (the loss switch fired), report only that.
  - Reading of amendment 2 (before 20:59 UTC, D069), cause confirmed: both starts `stop` (the switching rule) after 1 generation, k 13, no
    probe SD at the 0.5 cap; largest probe SD 0.068 / 0.039, final σ 0.933 / 0.923, so σ × largest SD ≈ 0.063 /
    0.036, far below the 0.25 axis switch (the loss switch is not needed to explain it). The axis switch fired
    mechanically: with probe-scaled initial SDs all < 0.25, σ0 = 1 cannot meet the "search has narrowed" intent of
    the rule. Phase 1 did no search; phase 2 runs from the better of two one-generation estimates. Small SDs mean
    high curvature at the starts (disclosed; no loss value seen). Decision to the user: let phase 2 run (disclosed)
    or stop, amend the switch and relaunch (an exception to D055's no-restart rule).
- 2026-10-18, correction (lead agent, written ≈ 20:59 UTC by `date -u`): the two amendments and their readings
  first carried hand-typed times (20:55, 21:00, 21:05, 21:06), three of them later than the real time; replaced
  by the bounds above. Order unchanged: amendment 1, its reading, amendment 2, its reading, then D069.
