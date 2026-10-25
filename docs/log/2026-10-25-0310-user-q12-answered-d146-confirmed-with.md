---
id: D147
date: 2026-10-25
time: 03:10
kind: decision
title: User: Q12 answered, D146 confirmed with amendments (pasted, adopted): phase-matched primary gate on complete light-phase blocks, J only (a failed J stops after the synthetic checks, no automatic J′), the Monte Carlo error measured on each lower bound by resampling stored null draws (200 resamples), stricter synthetic acceptance (±0.01 intervals, V2 lower bound > 0, V5 lower bound ≥ 0.8 with a positive denominator, generator and seeds frozen before testing); proceed to implementation and synthetic checks
authority: user
scope: Q12 T032
---
- **2026-10-25 ≈ 03:10 UTC — User: Q12 answered, D146 confirmed with amendments (pasted, adopted): phase-matched primary gate on complete light-phase blocks, J only (a failed J stops after the synthetic checks, no automatic J′), the Monte Carlo error measured on each lower bound by resampling stored null draws (200 resamples), stricter synthetic acceptance (±0.01 intervals, V2 lower bound > 0, V5 lower bound ≥ 0.8 with a positive denominator, generator and seeds frozen before testing); proceed to implementation and synthetic checks.**
  - **User (pasted, adopted as given):** "confirm D146 with the amendments below. The input corrections, matched
    reference support and explicit masks are sound."
    1. **Match phase for the primary gate.** Use complete light-phase blocks in both data and simulations. Keep the
       full-support D122 continuity check and the all-phase data profile descriptive. Comparing day-and-night data
       with light-only simulations could make the gate pass because of phase composition. Disclose the remaining
       difference in observation duration.
    2. **Do not automatically promote J′ if J fails.** Pairwise shifts do not produce one coherent shifted colony: an
       ant occupies different shifted histories in different pairs. That does not make J′ unusable, but it changes the
       null and needs its own validation, including invariance to ant ordering and a corresponding definition of A.
       For this approval, test J; if it fails, stop after the synthetic checks and return with the fallback design.
       Also replace "S2_J is biased toward zero" with "residual alignment may attenuate S2_J"; the direction is not
       guaranteed once geometry and normalisation change.
    3. **Measure Monte Carlo error in the quantity used by the gate.** D146 estimates MC error of the mean null
       correction, but the decision uses a lower confidence bound. Those errors are not interchangeable. Retain 100
       draws and the single extension to 400, but estimate each lower bound's MC error by resampling the stored null
       draws and recomputing the bound, holding the colony-bootstrap resamples fixed. Use 200 such MC resamples.
       Extend when either bound's absolute distance from zero is ≤ 2 of its MC SEs; if that remains true at 400,
       report "unresolved." Pool each colony's file accumulators within each draw before calculating its ratio.
    4. **Strengthen the synthetic acceptance rules.**
       - An interval containing zero establishes compatibility with zero, not negligible bias. For V1a, V1b and the
         homogeneous V3 control, require the entire 95% interval for mean S2_J to lie within ±0.01. This is a proposed
         numerical acceptance tolerance, not a biological threshold.
       - Make the homogeneous V3 control homogeneous in both response and noise. Put heterogeneous noise, especially
         spatially patterned noise, in the descriptive challenge cases alongside V3b.
       - For V2, require a positive lower 95% bound.
       - For V5, retain 0.8, but require the paired-bootstrap lower 95% bound on recovery to reach it at every bout
         length. The denominator must itself be demonstrably positive; otherwise recovery is undefined. Freeze
         generator settings, replicate count and seeds before testing, with no seed selection to obtain a pass.
    - **Confirm the remaining details:** drop P20 without new simulations; use complete blocks; retain the
      detection-weighted reference window with five valid bins out of ten, no boundary crossing, and matched pair-bin
      support; retain the estimability floor, common colony identities and joint bootstrap.
    - With these changes recorded, proceed to implementation and synthetic checks. A passing J and frozen scripts
      permit the audit under the existing gates; a failed synthetic check does not authorize switching methods or
      relaxing thresholds. Stages 1–3 remain held, and P02/Q03 remains disclosed and unwaived.
  - **Effect (lead):** Q12 is answered by this entry. D146 holds as amended here: its J′ fallback and its MC SE of
    the mean null correction are replaced by items 2 and 3; its sentence "S2_J is biased toward zero" reads "residual
    alignment may attenuate S2_J". The synthetic generator settings, replicate count and seeds are frozen in their own
    entry before any synthetic test runs.
