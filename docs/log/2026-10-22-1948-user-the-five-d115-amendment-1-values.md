---
id: D117
date: 2026-10-22
time: 19:48
kind: decision
title: User: the five D115 amendment-1 values confirmed (grid, verification 4.15 ± 0.30 frozen before verifying, ±20 % synchrony, ±0.015 distance profile with the full profile reported, 4 × 2 cells); two implementation details fixed; build approved, box after tests
---
- **2026-10-22 ≈ 19:48 UTC — User: the five D115 amendment-1 values confirmed (grid, verification 4.15 ± 0.30 frozen before verifying, ±20 % synchrony, ±0.015 distance profile with the full profile reported, 4 × 2 cells); two implementation details fixed; build approved, box after tests.**
  - **User (pasted):** "Yes—confirm all five values for this bounded diagnostic. Proceed with the build."
    - Strength grid {0.25, 0.5, 0.75, 1.0, 1.5, 2.0} with the specified refinement: a bounded search; failure means
      this search did not reach the target.
    - Verification 4.15 ± 0.30 on fresh seeds (≈ ±7 %). **The selected strength is frozen before verification; a miss
      stays a miss.**
    - Synchrony equivalence ±20 % of each data value: acceptable as this exploratory comparison's resolution.
    - Distance profile ±0.015 absolute: relatively permissive in the distant bands (agreement can include losing a
      small positive tail). **Report the full profile beside the classification.**
    - S5 position matching 4 × 2 cells (17.5 × 20 mm): eligibility rules kept, exclusions reported; insufficient
      coverage makes S5 unestimable.
    - These tolerances define what this experiment calls a sufficiently close reproduction; they are not biological
      thresholds. Conclusions say **"equivalent within the specified tolerances"**.
  - **Implementation details fixed:**
    - if calibration leaves **no P variant or no E variant**, the separation screen is **not evaluable**: an empty
      set of comparisons cannot pass;
    - E_l's normalisation gives expected multiplier 1 **at a fixed location under the prescribed process**. Ants'
      movement can become associated with the process, so the realised multiplier along trajectories can differ
      from 1, and the recorder measures that.
  - No further design round. Build and test, then request the box.
  - **Also asked (literature):** answered in chat. The path stands. Two optional clearings, for the user: Stroeymeyt
    2018's Methods (recording environment) and the classic ant-synchronization papers (to verify before clearing),
    used for interpreting signatures and ranking interventions, not for adding variants to D115.
