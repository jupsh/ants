---
id: P28
title: "Part D: unattainable rows listed before any model run"
wording: Unattainable rows are listed before any Part D model run
made: D126
state: superseded
nodes: [T033]
resolved_by: D165
superseded_by: P56
links: [D158, P56]
reviews:
  - action: run:q03-recheck-20261025
    disposition: not-applicable
    because: >-
      This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism,
      no spatial coupling, no assessment rows. It is not a Part D model run: no Part D member or row
      is simulated.
    by: lead (session 421f3ea4)
    at: "2026-10-25 16:54 UTC"
---

## History
- 2026-10-25 00:28 UTC lead (session 7c2d50fd): created — T049 scan review (D144)
- 2026-10-25 04:10 UTC lead (session 0bcdd30b): reviewed D157: new members and profile rows (P41) mean the unattainable-row list is drawn up for the revised design, before any Part D model run. Still open.
- 2026-10-25 04:14 UTC lead (session 0bcdd30b): added D158 to links — D158 keeps amendment 1's form: a precision forecast for all 20 rows before Stage 2b, reported, never a filter
- 2026-10-25 04:20 UTC lead (session 0bcdd30b): reviewed D159: the precision forecast stands; item 2 adds MC precision near the equivalence boundaries for the corrected rows (P47), fixed before assessment.
- 2026-10-25 16:45 UTC lead (session 421f3ea4): reviewed D161: it approves the Q03 recheck design (T015) and confirms Stage 1 may proceed now, Stage 2a after the recheck reading; it mentions T033 only for that order. The unattainable-rows listing is untouched.
- 2026-10-25 16:54 UTC lead (session 421f3ea4): review for run:q03-recheck-20261025: not-applicable — This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism, no spatial coupling, no assessment rows. It is not a Part D model run: no Part D member or row is simulated.
- 2026-10-25 18:12 UTC lead (session fe835760): reviewed D163: the recheck's five rows are colony-state diagnostics for the water start, not Part D assessment rows; no Part D rule, support, MC or reading wording is touched. Unaffected.
- 2026-10-25 18:24 UTC lead (session fe835760): reviewed D164: its toy calibration smoke simulated all 11 members before this list exists. The lead's lapse is disclosed in D164; whether a toy smoke counts as a model run here is Q18. No further member is simulated, smoke or otherwise, until Q18 is answered, and the list comes before Stage 2a.
- 2026-10-26 01:19 UTC lead (session 0cf57b71): set state=waived; set resolved_by=D165; added P56 to links — D165 item 2: P28's 'before any Part D model run' stood unreconciled with D158's 'before Stage 2b' (approved, D159); the user sets the timing from here on as P56 (forecast before any further Part D member simulation). The D164 smoke is recorded as an unreconciled summary, not a breach
- 2026-10-26 02:09 UTC lead (session 0cf57b71): set state=superseded; set superseded_by=P56 — plied 0.7.0: 'superseded' records D165 accurately; P28 was not released, its obligation moved into P56 with the timing D165 set (it was 'waived', the only state available before 0.7.0)
