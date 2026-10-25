---
id: D145
date: 2026-10-25
time: 03:02
kind: decision
title: User: Q02 answered, the S2 audit (D136) approved with amendments (pasted, adopted): J primary with narrowed wording, 30–210 bins provisional with a synthetic recovery check and the shift rule frozen before any audit result, reference window on matched support, 100 draws an initial budget under a frozen Monte Carlo precision criterion, the floor with undefined-value handling and common colonies, the directional gate narrowed, V1 and V3 amended; Stages 1–3 held; P02/Q03 not waived
authority: user
scope: Q02 T032
---
- **2026-10-25 ≈ 03:02 UTC — User: Q02 answered, the S2 audit (D136) approved with amendments (pasted, adopted): J primary with narrowed wording, 30–210 bins provisional with a synthetic recovery check and the shift rule frozen before any audit result, reference window on matched support, 100 draws an initial budget under a frozen Monte Carlo precision criterion, the floor with undefined-value handling and common colonies, the directional gate narrowed, V1 and V3 amended; Stages 1–3 held; P02/Q03 not waived.**
  - **User (pasted, adopted as given):** "approve the S2 audit with amendments, rather than approve D136 unchanged.
    The audit is useful, but some proposed interpretations are stronger than its comparisons support."
    1. **Keep joint shift J as primary.** Describe S2_J as "decay exceeding the joint-shift null." J changes
       simultaneous geometry as well as timing, so it does not isolate coupling. Likewise, J − A is a contrast between
       two nulls, not a clean estimate of the artefact caused by same-bin classing.
    2. **Keep 30–210 bins provisionally, with a synthetic validity check.** Independent shifts in that range can be
       almost equal: ants shifted by 100 and 101 bins remain nearly aligned. The range therefore does not guarantee a
       30-minute separation between ants. Test recovery under persistent signals and freeze the shift rule before
       inspecting audit results.
    3. **Keep the proposed reference window, but compare on matched support.** Calculate ordinary S2 and
       reference-position S2 on the same eligible pair-bins; otherwise their difference also reflects dropped
       observations. Specify reference-position weighting and minimum coverage, and do not wrap reference windows
       across block boundaries. Keep block-mean positions descriptive.
    4. **Treat 100 draws as an initial computational budget.** Freeze a Monte Carlo precision criterion and maximum
       budget before running. Report uncertainty in the null expectation; if it is large enough to affect the gate,
       report the verdict as unresolved. Do not add draws opportunistically until a preferred answer appears.
    5. **Keep the proposed estimability floor, with explicit undefined-value handling.** Require finite, positive
       normalising denominators as well as ≥ 100 pair-bins and ≥ 90 % valid null draws. Specify how activity and
       position masks work under A. Use the same ≥ 15 colony identities for both gate conditions, with a joint
       bootstrap of colony-level data–base differences. Report exclusions.
    6. **Keep the directional gate, but narrow its wording.** If both lower confidence bounds exceed zero, conclude:
       "S2's decay exceeds the specified joint-shift null and C2 base." Otherwise retain the proposed consequence: S2
       is not established as the main spatial row for Stages 1–3. Neither outcome identifies a mechanism or
       establishes its absence.
    - **Amend the synthetic checks too.** A shared signal need not cancel from this normalised near-minus-far
      statistic when ants differ in responsiveness, noise or spatial distribution. Test both homogeneous and spatially
      structured responses. Similarly, reference positions need not remove an artefact associated with stable resting
      sites; V1 should not universally require L − L_ref > 0.
    - Stages 1–3 remain held. The outstanding C2 warm-up commitment, P02/Q03, remains a disclosed limitation of the
      base comparison and is not waived by this approval.
    - (The reviewer reports reading the records and the S2 implementation, changing no files, running nothing and
      inspecting no sealed data or audit outputs.)
  - **Effect on the record (lead):**
    - Q02 is answered by this entry; T032's design is approved as amended here. Before any audit statistic is computed
      on data or simulated files, the amendments are made concrete in a design amendment (the shift rule, the
      Monte Carlo criterion and budget, matched support, reference weighting and coverage, masks under A, the
      synthetic checks), which the user confirms; the synthetic checks must pass on the frozen code; then the script
      hashes are frozen and the run starts.
    - `logs/s2audit/` is sealed from now until the reading is frozen (P22).
    - D136's wording is superseded where this entry narrows it: S2_J is "decay exceeding the joint-shift null", not
      "decay that needs between-ant timing"; E_J[L] − E_A[L] is a contrast between two nulls; the gate's pass wording is
      the one in item 6.
