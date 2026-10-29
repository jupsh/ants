---
id: D165
date: 2026-10-26
time: 01:18
kind: decision
title: User: Q18 answered (pasted, adopted): the toy calibration smoke (D164) counts as a Part D model run; P28's timing reconciled with D158 as approved: the precision forecast for all 20 rows comes before any further Part D member simulation, smoke and timing benchmark included, never a filter, built without the smoke's statistics; then the bounded timing benchmark under P50; D163 accepted within P54; commit stays pending
authority: user
scope: Q18 P28 P55 T033
---
- **2026-10-26 ≈ 01:18 UTC — User: Q18 answered (pasted, adopted): the toy calibration smoke (D164) counts as a Part D model run; P28's timing reconciled with D158 as approved: the precision forecast for all 20 rows comes before any further Part D member simulation, smoke and timing benchmark included, never a filter, built without the smoke's statistics; then the bounded timing benchmark under P50; D163 accepted within P54; commit stays pending.**
  - **User (pasted, adopted as given):** "**Q18: yes, the smoke counts as a Part D model run.** It simulated all 11
    members and exposed calibration statistics. Toy size limits the conclusions those statistics support; it does not
    make the run cease to be a model run."
    - "**However, the records contain a timing conflict.** P28 retains “before any Part D model run,” while D158,
      approved by D159, explicitly places the precision forecast before Stage 2b. Under the repository’s rule that
      dated records govern over plied summaries, I would record this as an unreconciled commitment summary, rather
      than an unambiguous breach of the approved design."
    - "My decision is:"
    1. "**Preserve D164’s factual disclosure.** Record what ran, which calibration quantities were seen, and that the
       other saved statistics were not inspected. Describe the values as debugging outputs with no inferential
       standing; “meaningless” is too strong, since they can still influence later choices."
    2. "**Reconcile P28 with the approved record and this decision.** Going forward, complete the precision forecast
       **before any further Part D member simulation, including another smoke or the timing benchmark**. This sets
       the next action clearly without rewriting what was required retrospectively."
    3. "**Cover all 20 assessment rows.** State the forecast’s evidence sources, assumptions and precision
       limitations. Where the available evidence cannot support a forecast, mark it unresolved. The forecast must
       never remove a row from the all-20 equivalence requirement. Do not use the uninspected smoke statistics to
       construct it or carry the toy selected strengths into production calibration."
    4. "**Then freeze and run the bounded timing benchmark under P50.** Bring the measured runtime, resource
       assumptions and estimated cost before rental. The capability rule retains its separate approval."
    - "I accept D163’s recheck pass within P54’s stated scope. The supplemental `noRest = 0` check addresses the
      omitted count’s effect on this result; keep it identified as a supplemental check, rather than something the
      frozen reader reported."
    - "The claim-release correction is accepted; no bug report is needed."
    - "**Leave the commit pending.** Resolve the scratch `tsc` error and verify the provenance of each stale result
      before re-stamping it. A short base/Part C identity check does not by itself establish that all 12 stamped
      results remain unchanged."
    - (The reviewer reports reviewing the records only, changing no files, inspecting no smoke outputs and running no
      simulations.)
  - **Effect (lead):**
    - **Q18** is answered by this entry. D164 is amended in place (dated) where item 1 rewords it.
    - **P28** is resolved by this entry and replaced by P56 (item 2): its "before any Part D model run" stood
      unreconciled with D158's "before Stage 2b", and this entry sets the timing from here on. The smoke ran before
      the forecast existed; per the user, that is recorded as an unreconciled summary, not a breach of the approved
      design. **P55**'s hold until Q18 was answered held (no Part D member was simulated after D164); its "before
      Stage 2a" is superseded by P56, which comes earlier.
    - **P56:** the precision forecast, before any further Part D member simulation, smoke and timing benchmark
      included. **P57:** its content (item 3): all 20 rows, sources, assumptions and limits stated, unresolved where
      evidence cannot support a forecast, never removing a row; the smoke's statistics and selected strengths unused.
    - The forecast is a design entry logged before the benchmark's settings are frozen. The benchmark then follows
      P50; its runtime, resource assumptions and cost come to the user before any rental. P29 keeps its own approval.
    - **D163:** accepted within P54. Its `noRest = 0` count was read from the run files outside the frozen reader, as
      D163 says; F096 does not cite it, and any later citation names it a supplemental check.
    - **Commit:** pending. Before it: the scratch `tsc` error resolved, and each of the 12 stale stamped results checked
      for provenance (what it depends on and whether its output is unchanged) before re-stamping; D164's bit-identity
      check is not taken as covering them.
