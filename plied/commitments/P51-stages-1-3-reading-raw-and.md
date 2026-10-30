---
id: P51
title: >-
  Stages 1-3 reading: raw and corrected bands are dependent; a far-band point difference is not
  outside by itself
wording: >-
  The raw and corrected bands are dependent measurements, so their agreement is not ten independent
  confirmations. … a far-band point difference exceeding 0.015 does not by itself earn an "outside"
  verdict. Apply the frozen interval rule; it may instead be unresolved.
summary: Reading wording.
made: D159
state: open
governs: [commit, publish]
nodes: [T033]
reviews:
  - action: run:q03-recheck-20261025
    disposition: not-applicable
    because: >-
      This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism,
      no spatial coupling, no assessment rows. No band rows are read.
    by: lead (session 421f3ea4)
    at: "2026-10-25 16:55 UTC"
  - action: run:partd-bench-20261026
    disposition: not-applicable
    because: No reading.
    by: lead (session 0cf57b71)
    at: "2026-10-26 01:31 UTC"
  - action: commit:20261029
    disposition: not-applicable
    because: No band reading is committed.
    by: lead (session 20261029)
    at: "2026-10-29 21:23 UTC"
---

## History
- 2026-10-25 04:19 UTC lead (session 0bcdd30b): created
- 2026-10-25 04:25 UTC lead (session 0bcdd30b): reviewed D160: it reads its own rows with its own equivalence rule; Stages 1-3 reading wording is untouched.
- 2026-10-25 16:45 UTC lead (session 421f3ea4): reviewed D161: it approves the Q03 recheck design (T015) and confirms Stage 1 may proceed now, Stage 2a after the recheck reading; it mentions T033 only for that order. The Stages 1-3 reading wording is untouched.
- 2026-10-25 16:55 UTC lead (session 421f3ea4): review for run:q03-recheck-20261025: not-applicable — This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism, no spatial coupling, no assessment rows. No band rows are read.
- 2026-10-25 18:12 UTC lead (session fe835760): reviewed D163: the recheck's five rows are colony-state diagnostics for the water start, not Part D assessment rows; no Part D rule, support, MC or reading wording is touched. Unaffected.
- 2026-10-25 18:24 UTC lead (session fe835760): reviewed D164: no band was read; reading wording untouched. Unaffected.
- 2026-10-26 01:19 UTC lead (session 0cf57b71): reviewed D165: reading wording unchanged; the forecast reports half-widths and never classes a row.
- 2026-10-26 01:31 UTC lead (session 0cf57b71): review for run:partd-bench-20261026: not-applicable — No reading.
- 2026-10-26 03:35 UTC lead (session 0cf57b71): set governs=["commit","publish"] — D171 item 5: reading-only wording; it cannot bear on a run, fit or rental, and comes up again when results are committed or published
- 2026-10-26 16:18 UTC lead (session d6df3027): reviewed D172: no bands are read in a rental or a calibration launch; P51 binds the assessment reading, unaffected
- 2026-10-29 01:26 UTC lead (session 20261029): reviewed D173-D175 (via D159/T033): D174 Part B keeps the frozen interval rule (D117) and adds 'unresolved (MC)', consistent with P51. Unaffected.
- 2026-10-29 05:27 UTC lead (session 20261029): reviewed D176: the capability rule does not judge assessment rows; the interval rule for raw and corrected bands is untouched. Unaffected.
- 2026-10-29 05:32 UTC lead (session 20261029): reviewed D177: no assessment-row rule changes. Unaffected.
- 2026-10-29 05:34 UTC lead (session 20261029): reviewed D178: Part B keeps D117's interval rule and adds 'unresolved (MC)', consistent with P51. Unaffected.
- 2026-10-29 05:45 UTC lead (session 20261029): reviewed D179: no reading yet; the interval rule binds the 2b reading. Unaffected.
- 2026-10-29 21:23 UTC lead (session 20261029): review for commit:20261029: not-applicable — No band reading is committed.
- 2026-10-29 22:15 UTC lead (session 20261029): reviewed D185: the dependent-bands disclosure is carried, and classes follow the interval rule, so a point difference is never outside by itself; unaffected
- 2026-10-29 22:37 UTC lead (session 20261029): reviewed D186: it answers Q23 on the MC extension's support; this commitment applies at the 2b reading unchanged
