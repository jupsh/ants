---
id: D116
date: 2026-10-22
time: 19:43
kind: review
title: User guidance on D115, pasted, adopted: Part C direction, variants and 1-min calibration supported; amendments before building (consistent P and its global comparator, normalised E_l, grid calibration with fresh-seed verification, equivalence sufficiency, a non-circular separation check, tighter S5 / S6, interventions ranked with controls)
---
- **2026-10-22 ≈ 19:43 UTC — User guidance on D115, pasted, adopted: Part C direction, variants and 1-min calibration supported; amendments before building (consistent P and its global comparator, normalised E_l, grid calibration with fresh-seed verification, equivalence sufficiency, a non-circular separation check, tighter S5 / S6, interventions ranked with controls).**
  - **Guidance (pasted by the user), adopted in full.** "I support Part C's direction, the six variants, and calibration
    on 1-minute all-ant synchrony only. I would amend D115 before building it." The points:
    1. **Consistent P.** P excludes the focal ant, the global oracle includes it, so r = ∞ cannot reproduce it. Test
       against a global version that also excludes the focal ant. No neighbours gives g = 1 *immediately*; a neutral
       value fed into a smoothing filter would keep earlier coupling for a while.
    2. **E_l's built-in activity increase:** its multiplier is always ≥ 1, while E_u is mean-one. Normalise E_l using
       its prescribed disturbance process, by a method fixed beforehand, and keep reporting realised multiplier
       distributions and mean activity for every mechanism (normalising does not guarantee equal activity).
    3. **Calibration tolerant of non-monotone responses:** a fixed bounded grid first, a predefined refinement and
       selection rule, verification on fresh seeds. A variant that misses the target is a reported sufficiency
       failure; its comparison with calibrated variants cannot isolate mechanism from magnitude.
    4. **Sufficiency by equivalence:** the difference CI wholly within a fixed tolerance. Spatial co-movement can be
       near zero or negative, so its tolerance is absolute. Other outcomes are unresolved or clearly outside.
    5. **No circularity:** screen signatures by simulation-only separation, then compute the fixed data statistics and
       their uncertainty. Keep the all-nine-pairs screen and report partial separation. Call it a **separation check**,
       not demonstrated power: separation of estimated means does not show reliable classification of another
       22-colony data set. Include simulation uncertainty in each mechanism's range. Failure means "no discriminator
       found among these signatures and variants".
    6. **S5 / S6:** fix when neighbour count is measured relative to the activity interval, tracking eligibility, and
       ants lacking both crowded and isolated observations. Ant fixed effects hold identity, not current position, so
       E_l could produce neighbour dependence through position and packing. S6's density: mean in-nest occupancy over
       the accessible nest area, the same in data and simulation; the association is descriptive.
    - Interventions stay candidates. A barrier need not block every propagation channel while preserving external
      disturbances, and density changes also alter exposure to a driver. Rank them by their predicted differences
      **and the controls needed to interpret them**.
    - "With those amendments, this is a useful bounded investigation. It can establish which tested mechanisms
      reproduce the observations and whether the current measurement pipeline can distinguish them."
  - **Applied:** D115 amendment 1 (in D115's file). The specific values it introduces, which the guidance did not give,
    are marked for the user's confirmation before any run.
