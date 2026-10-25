---
id: D150
date: 2026-10-25
time: 03:27
kind: decision
title: User: Q13 answered (pasted, adopted): V2 and V5 use planted local spatial dependence, a same-bin neighbour term on independent latent states, replacing κ; bounded γ calibration on the same rule and 0.05 target, one γ for every bout length, clipping reported; the failed κ calibration stays on record; reporting correction on the continuity check
authority: user
scope: Q13 T032
---
- **2026-10-25 ≈ 03:27 UTC — User: Q13 answered (pasted, adopted): V2 and V5 use planted local spatial dependence, a same-bin neighbour term on independent latent states, replacing κ; bounded γ calibration on the same rule and 0.05 target, one γ for every bout length, clipping reported; the failed κ calibration stays on record; reporting correction on the continuity check.**
  - **User (pasted, adopted as given):** "approve a same-bin spatial mixing term as a synthetic positive control, with
    the explicit definition below. Keep the 0.05 calibration target and all acceptance thresholds. The failed
    calibration says nothing yet about J."
    - For V2 and V5, **replace the κ mechanism**, rather than combining mechanisms:
      - Generate independent latent states z_i(t) ∈ {0, 1}, initially Bernoulli(½), each switching with probability
        1/b per bin. Set κ = 0.
      - Define neighbours by home positions within 10 mm, excluding the ant itself, as in the existing generator.
      - Set the observed moving fraction, before the existing detection and rounding steps, to a_i(t) = clip_[0,1][0.05
        + 0.45 z_i(t) + γ · mean_{j ∈ N_i}(z_j(t) − 0.5) + 0.05 ε_i(t)].
      - The neighbour term is zero for an empty neighbourhood. Compute it from the completed latent-state vector, never
        from another ant's already-modified activity. This avoids circular definitions and update-order dependence.
    - Call this **planted local spatial dependence**, not a simulation of causal transmission. It tests whether J
      recovers an imposed distance-dependent signal. The latent bout lengths remain controlled at 2, 10 and 30 bins;
      they are not necessarily bout lengths of the resulting observed activity.
    - **Freeze this bounded calibration before running it:**
      - γ grid: 0.05, 0.1, 0.2, 0.4, 0.8.
      - Retain the existing calibration seeds, 24 colonies, b = 10, paired γ-on/off streams and observed-L-only
        calculation.
      - Choose the smallest γ reaching mean L_on − L_off ≥ 0.05. If none does, stop and report.
      - Use that single γ at every V5 bout length—no separate calibration by persistence.
      - Retain the other cases, seeds, replicate counts and acceptance rules. Freeze the revised code hashes before
        calibration, then record the selected γ before running the cases.
    - Report clipping frequency alongside calibration, since clipping changes the realised signal. Do not use it to
      select another γ outside the frozen rule. Preserve the failed κ calibration in the record; do not substitute
      κ = 0.2 or lower the target.
    - If the synthetic checks subsequently fail, P36 still applies: stop without promoting J′ or changing thresholds.
      The predicted survival of long-lived dependence remains a prediction until V5 runs.
    - **One reporting correction: the continuity check did compute on real data**, as D148 explicitly scheduled. Say:
      "The previously reported full-support statistic was reproduced; no new light-phase audit result or substantive
      null comparison has been computed." That distinguishes the permitted continuity check from the pending audit.
    - (The reviewer reports reading the records and generator source only, changing and running nothing, and inspecting
      no sealed outputs.)
  - **Lead's correction:** the lead's reply after D149 said "nothing has been computed on the real data". That was
    wrong: the continuity check ran on the 22 data files, as D148 scheduled. The correct statement is the user's
    wording above. D149 itself describes the continuity run correctly; its sentence "no null draw or S2_J was computed
    on synthetic, simulated or data files" stands.
  - **Effect:** Q13 is answered by this entry. The generator change, the revised hashes and the γ calibration rule are
    frozen in their own entry before calibration runs. Then γ* is recorded there, and the cases run.
