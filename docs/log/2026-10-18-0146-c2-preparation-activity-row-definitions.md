---
id: D043
date: 2026-10-18
time: 01:46
kind: design
title: C2 preparation: activity-row definitions fixed (before any recomputation) and one design deviation
---
- **2026-10-18 ≈ 01:46 UTC — C2 preparation: activity-row definitions fixed (before any recomputation) and one
  design deviation.** Committed checkpoint `9b3987d` first.
  - **The four activity rows** (`persist.<group>.light`, `top20.<group>.light`; groups nurse and forager, queen
    excluded). Code is shared by data and simulation in `src/sim/analysis/activity.ts`, promoted from
    `scratch/activityStats.ts` with the same observed-history definitions: still = step < 0.6 mm per frame, gaps of
    ≤ 3 frames bridged, in-nest steps only; per ant and hour, stepF and moveF.
    - **Windows.** Data: each colony's longest contiguous light block, split from its start into consecutive
      **complete** 6-h windows (06–12, 12–18 UTC; an 11-h block gives one). Simulation: the 6-h observation window
      after the warm-up (one per colony and seed), labelled light as for the other rows.
    - **Per-ant statistic:** moving fraction = Σ moveF / Σ stepF over the hours of a period.
    - **Eligibility** (the persistence diagnostic's 1800 step-frames per hour, kept). Persistence: stepF ≥ 5400 in
      **each** 3-h half. Spread: stepF ≥ 10 800 over the 6 h. A window needs **≥ 8 eligible ants** (both rows),
      else it is missing.
    - **Persistence:** Spearman across eligible ants, first vs second 3-h half, with ties at average ranks; r clipped
      to ±0.999, Fisher z. Undefined (no rank variance on a side) → window missing. Colony value: the (n − 3)-weighted
      mean of z over its valid windows.
    - **Spread:** the share of the summed per-ant moving fraction carried by the top k = max(1, round(0.2 n)) ants
      (ties do not affect it); total 0 → window missing. Colony value: the mean over valid windows.
      - The 23:35 proposal said "moving time". **Moving fraction** is used because the σ-selection evidence that
        inspected spread used it, and it does not mix activity with time spent in the nest (foragers' trips).
        **Flagged to the user.**
    - **Row:** mean of colony values; SE = SD across colonies / √n (the existing estimator). Persistence is in Fisher
      z units, reported back-transformed beside.
    - **Missing / incomplete tracking:**
      - No imputation. The observer (the recorded detections; the frozen tracker in simulation) and the eligibility
        thresholds carry incomplete tracking.
      - A colony without a valid value is left out of that row, on each side by the same rule; the counts are
        reported.
      - A simulated batch with < 2 valid colonies for a row makes the loss infinite (existing rule); when judging,
        such a row is missing and the candidate unjudgeable (existing policy).
  - **Deviation from the design note:** the drive is advanced by the runner for every ant every step (exact OU
    update, k = e^(−dt/τ), held constant within the step), wherever the ant is. It is not advanced by the nest policy.
    Two reasons:
    - an ant returning from a trip carries a correctly aged drive;
    - the unit process uses the ant's own stream (`RNG.stream(seed, 0xd21e, i)`), and its draws do not depend on σ,
      so the fit keeps common random numbers across σ.

    The policy only reads it: walk-on × exp(σ_role · z − σ_role²/2). The state lives in the mind (`m.drive`, `src/sim/mind/`).
