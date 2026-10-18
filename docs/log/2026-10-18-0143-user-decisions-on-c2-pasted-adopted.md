---
id: D042
date: 2026-10-18
time: 01:43
kind: decision
title: User decisions on C2 (pasted, adopted)
---
- **2026-10-18 ≈ 01:43 UTC — User decisions on C2 (pasted, adopted).** Commit the third diagnostic checkpoint, then
  implement C2. Preparation and gates approved; **the fit waits for a separate go-ahead.**
  - **D1:** τ fixed at 60 s, the timescale with direct supporting evidence; it limits overlap with the fixed trait
    and rest-depth variation. Free σ_nurse and σ_forager on [0, 2] → **k = 13**. A failure applies to this
    candidate, not to every activity timescale.
  - **D2:** walk-on trait σ 0.4 fixed, recorded as a data-informed choice, not as independently known.
  - **D3:** restShape > 1, **explicit lower bound 1.001**, log scale and the ordinary 5 % boundary rule kept. This is a
    modelling constraint for finite-mean baseline rests, not a conclusion from the activity-state results.
    - The gamma rest-depth mechanism stays. Described precisely: with a varying walk-on multiplier the resulting rest
      distribution is no longer simply the original Lomax.
    - restShape > 1 avoids the original infinite-mean case; it does **not** guarantee quick equilibration. The window
      gate remains essential.
  - **D4:** specular reflection as a fixed C2 model choice. The existing default is preserved for other
    configurations, and the diagnostic-selection caveat is kept.
  - **D5:** all 36 rows, each with weight 1 after its existing SE standardisation. Eligibility, ties, incomplete
    tracking and missing-row handling are fixed **before** the rows are recomputed.
  - **D6:** two search starts, ≤ 30 generations each, then one full fit of ≤ 60 generations from the better selected
    start. No extension or restart. **C1's conditional second full fit is removed.**
  - **Two changes to the preparation.**
    - **Phase 1 uses 6 observation hours** (not 2), keeping its coarser dt (0.1), because the persistence target
      compares the first and second 3 h of a 6-h window. Selection and fitting then use the same target definitions.
      The revised evaluation cost is benchmarked; the 21-h estimate no longer holds.
    - **The numerical gates cover the four new summaries,** keeping their 6-h definitions. The window gate compares
      equivalent 6-h measurement windows after the relevant warm-up or at different elapsed times, never a different
      lag or a 12-h top-20 % share.
  - **Lower-bound exception for activity σ accepted,** including its lower 5 % neighbourhood. It is reported as
    "little or no drive required for this role by this fit"; a boundary estimate does not establish that the
    biological activity state is absent. Upper-bound σ estimates keep the usual failure rule.
  - **Adequacy and stopping rules otherwise stand.** Before launch, check whether the shared light / dark prediction
    can satisfy the row thresholds at the declared judging precision. If the known irreducible phase mismatch makes
    the criterion impossible, that is resolved before the search budget is spent.
  - **Reporting:** C1 and C2 on the same 36 definitions with fresh judging seeds. Any improvement belongs to the
    **whole C2 candidate** (walls and the rest constraint change alongside the activity state).
  - **Step 5:** κ = 1 stays labelled an **overshooting stress test**, not a calibrated representation of synchrony.
    Its consequences for adoption are decided before step 5; this does not delay C2 preparation.
