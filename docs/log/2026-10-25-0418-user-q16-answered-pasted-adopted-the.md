---
id: D159
date: 2026-10-25
time: 04:18
kind: decision
title: User: Q16 answered (pasted, adopted): the bounded redesign and Stage 1 implementation approved with amendments; Es and the entrance map frozen with corrected normalisation wording; 20 rows approved, boundary-adapted Monte Carlo rule and support rules before assessment; diagnostic provisional, capability claim needs independent datasets with error rates and power; Q03 answered: recheck at C2 settings before Stage 2a; P25 disposition accepted with F078 carried; budget a planning estimate, a measured bench before rental
authority: user
scope: Q16 Q03 T033 T015
---
- **2026-10-25 ≈ 04:18 UTC — User: Q16 answered (pasted, adopted): the bounded redesign and Stage 1 implementation approved with amendments; Es and the entrance map frozen with corrected normalisation wording; 20 rows approved, boundary-adapted Monte Carlo rule and support rules before assessment; diagnostic provisional, capability claim needs independent datasets with error rates and power; Q03 answered: recheck at C2 settings before Stage 2a; P25 disposition accepted with F078 carried; budget a planning estimate, a measured bench before rental.**
  - **User (pasted, adopted as given):** "Q16: approve the bounded redesign and Stage 1 implementation, with the
    amendments below. Stage 2a waits for the warm-up check; the capability rule and rental budget retain their
    specified approval gates."
    1. **Approve Es and the entrance gradient, λ = 20 mm.** Freeze the floor-area normalization and entrance
       coordinates. Correct the normalization wording: the formula gives mean multiplier 1 at a fixed position under
       the stationary signal, before clipping. Response strength still varies spatially. Neither the clipped
       multiplier nor the multiplier experienced along moving ants' trajectories is guaranteed to average 1. Report
       both, as already required. Treat the entrance rationale as a hypothesis; this map was not established by V3b.
    2. **Approve the 20 rows and proposed tolerances.** They are reasonable bounded development criteria, and joint
       reproduction requires all 20 to be equivalent. The raw and corrected bands are dependent measurements, so their
       agreement is not ten independent confirmations.
       - Before assessment, specify common colony support, missing-statistic handling and Monte Carlo precision for
         the corrected rows. In particular, the previous MC check concerned confidence bounds near zero; these
         decisions concern interval endpoints near the equivalence boundaries. Adapt the frozen 100→400 maximum-budget
         rule to those boundaries, with "unresolved" when MC uncertainty could change a row's class. A missing required
         statistic prevents joint reproduction.
    3. **Approve the proposed diagnostic coordinates provisionally; retain P29's approval of the complete rule.**
       Separating estimated member means does not demonstrate reliable classification of another colony dataset. The
       rule must state which claim it supports.
       - For a genuine capability claim, evaluate independent simulated datasets at the intended sample size,
         reporting false-positive behaviour and power across every required T–D pair. Use separate draws to choose and
         check the threshold. Freeze the procedure before inspecting assessment separation. If Es cannot calibrate, or
         a required ratio is undefined, the intended comparison is not evaluable; Es must not disappear from the claim
         by becoming ineligible.
       - Replace the failure wording with: "The specified diagnostic did not distinguish all tested transmission and
         driver members at this sample size." That leaves open whether another diagnostic could do so.
    4. **Q03: recheck the shortcut at C2 settings; do not waive it.** Freeze the compared starts, paired seeds, late
       observation window and equivalence criteria before running the check. Complete it before Stage 2a. A common
       initialization does not guarantee common bias across mechanisms. A C2 pass also should not be described as
       proof of convergence for every new member.
    5. **Accept P25's proposed disposition for these bounded diagnostic comparisons.** "Settled" here means the packing
       work is closed and its unresolved failures are accepted as limitations of this comparison. It does not mean
       packing matches the data. Carry F078's occupancy and spread discrepancy alongside the near-share deficit,
       because both spatial exposure and neighbour interactions depend on geometry. This decision authorizes no further
       packing arms.
    6. **Accept $9–11 as a planning estimate.** Proceed with implementation, synthetic checks and a bounded timing
       benchmark once its settings are frozen. Bring the measured runtime, resource assumptions and cost estimate for
       approval before renting.
    - One reading detail: a far-band point difference exceeding 0.015 does not by itself earn an "outside" verdict.
      Apply the frozen interval rule; it may instead be unresolved.
    - (The reviewer reports reading the proposal and supporting records, changing no files, and running no analyses or
      simulations.)
  - **Effect (lead):**
    - Q16 and Q03 are answered by this entry. T033's design is approved as amended here for Stage 1 implementation
      and synthetic checks. Stage 2a waits on the Q03 recheck (T015). The capability rule (P29) and the rental budget
      keep their own approvals.
    - D158 is corrected in place where this entry rewords it: Es's normalisation, the failure wording, and the far-band
      reading.
    - The Q03 recheck is designed and frozen in its own entry before it runs.
