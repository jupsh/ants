---
id: D076
date: 2026-10-20
time: 14:17
kind: design
title: Per-ant activity vs rest position against C2's persistence and top-20 % rows: pre-registration (for approval; written before any C2 output is read)
---
- **2026-10-20 ≈ 14:17 UTC — Per-ant activity vs rest position against C2's persistence and top-20 % rows: pre-registration (for approval; written before any C2 output is read).**
  - **Question.** C2 reaches the persistence and top-20 % rows (D043) through per-ant, non-spatial activity (the
    fixed walk-on trait σ 0.4 plus the OU drive). In the data, part of an ant's lasting activity level may instead
    go with *where it rests*: the resting region is broad and colony-specific and stable over 24 h, and nurses sit
    nearer its centre (F060–F063, B018). If the data's persistence is largely shared with rest position and C2's is
    not, C2 matches the rows by a different route. That bears on how C2's drive σ and trait are read, not on
    whether C2 is adequate.
  - **Status of this rule.** It **does not change the D041 / D042 adequacy verdict or its outcome** (both fixed).
    Its result is reported beside the judgment. It bears on: interpreting σ_drive and the walk-on trait; B021; a
    future site design; the synchrony-cause investigation (the structure-freeze blocker).
  - **Why a covariate, not zones.** B019 (F065): zones classed per minute are endogenous to activity, and with zones
    fixed per ant, periphery-based ants exist in only 3 of 22 colonies. So the zone is a **continuous rest-position
    covariate fixed per ant per window**, built only from the ant's still steps.
  - **Definitions** (shared code for data and simulation, beside `src/sim/analysis/activity.ts`; existing rows
    unchanged, tested bit-identical):
    - *Windows, groups, eligibility, moving fraction:* exactly D043 (light 6-h windows; nurses, foragers; queen
      excluded; ≥ 5400 step-frames per 3-h half for persistence, ≥ 10 800 over 6 h for spread; ≥ 8 ants per window).
    - *Site field E* (B018's definition): still-worker occupancy on the 1-mm grid, focal ant left out, 5 × 5-mm box
      smoothed, divided by its mean over the nest rectangle. Data: from the colony's **dark** phase (the other phase,
      as in B018). Simulation: from the **other judging runs of the same colony** (the focal run left out). The
      simulated nest has no light/dark, so "another sample of the same colony's resting map" is the matching
      construction.
    - *Rest position* R_i = the median of E over ant i's observed still steps in the window (≥ 600 still step-frames,
      else the ant drops out of this analysis; counts reported on both sides).
    - Per window and group, on D043's eligible ants that have an R_i:
      - z_full: D043's persistence (Spearman, half 1 vs half 2, Fisher z) on this ant set;
      - z_part: partial Spearman of the two halves' moving fractions given R (Pearson partial correlation of the
        average ranks), Fisher z;
      - z_E: Spearman of R vs the 6-h moving fraction on the spread-eligible ants, Fisher z.
    - Colony value: (n − 3)-weighted mean over valid windows ((n − 4) for z_part). Row: mean over colonies.
      Uncertainty: colony bootstrap, 2000 resamples (data); on the simulated side, the judging run's SE_sim
      construction for the activity rows.
    - Share of persistence carried by rest position: **S = 1 − mean z_part / mean z_full** (ratio of means, paired
      bootstrap).
    - Check: on the full D043 ant set, z_full must reproduce the data row `persist.<group>.light` exactly, else the
      code is wrong and nothing is read.
  - **Readings, data side** (per group; fit colonies, development use, local, no simulation):
    - S ≥ 0.5 with 95 % lower bound ≥ 0.25 → **"persistence mostly shared with rest position"**;
    - S's 95 % upper bound < 0.25 → **"persistence mostly not spatial"**;
    - otherwise **"partly spatial"**;
    - z_E's 95 % CI excludes 0 → **"activity level varies with rest position"** (sign and size reported); else
      "no detectable link".
  - **Readings, C2 vs data** (C2 at its estimate, on the judging runs, through the frozen tracker; C1 beside on its
    judging runs, same statistics). Per group, z = (sim − data) / √(SE_data² + SE_sim²) for S, z_part and z_E:
    - |z| ≤ 2 on S → "C2 reproduces how much of the persistence is spatial";
    - z ≤ −2 on S and the data read "mostly shared" or "partly spatial" → **"C2 carries as per-ant activity what the
      data share with rest position"**, reported beside the adequacy verdict;
    - z ≥ 2 on S → "C2's persistence is more spatial than the data's", reported likewise;
    - z_E and z_part: reported with the same 2 / 3 cut-offs, descriptive.
  - **Disclosed before computing:**
    - Direction of cause is not identified: active ants may rest where they do *because* they are active (e.g.
      foragers near the entrance). S measures shared variance, not a mechanism.
    - E on the data side comes from the fit colonies' still occupancy. B018 inspected positions (development use),
      and the σ 0.4 choice inspected per-ant spread. No new data role.
    - The model's resting map does not match the data's (comparison P, median r −0.14). So C2's E is its own map, and
      what is compared is the *share*, not the location.
    - Known about C2 when writing: phase-1 progress only (D068, amendment 1); the run's length (37 h 07 m) and its
      health counts (D075). No loss, estimate, σ, stop reason or parameter value has been seen.
  - **Order once approved:**
    1. code and tests (partial Spearman against a known case; existing activity rows bit-identical; `npm test`,
       `tsc`);
    2. data side computed and read against this entry (local, minutes);
    3. the C2 judging run, its settings logged before launch, with these statistics collected from the same runs;
    4. the judgment read (D041 / D042), and this entry's C2-vs-data readings beside it.

    The C2 outputs stay unopened until step 3 is logged.
