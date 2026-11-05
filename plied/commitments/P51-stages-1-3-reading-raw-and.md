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
  - action: commit:partd-1a-20261030
    disposition: not-applicable
    because: No band reading or far-band verdict in this commit; D210 is descriptive with no outside class.
    by: lead (session 108deea8)
    at: "2026-10-30 22:07 UTC"
  - action: commit:item1b-design-20261031
    disposition: not-applicable
    because: >-
      No Stages 1-3 reading, member, band or multiplier is committed: the entries are item 1(b)'s
      design, decisions and builds (D211-D219).
    by: lead (session 108deea8)
    at: "2026-10-31 00:42 UTC"
  - action: commit:partd-1b1c-20261031
    disposition: not-applicable
    because: no near or far band reading in these records
    by: lead (session 6b5fb317)
    at: "2026-10-31 03:35 UTC"
    inputs:
      - record: D221
        rev: 2c4c00f83034f74f98234e2e799f1efc5b082fc738fb53e0883c666d6a11adbc
      - record: D226
        rev: 0772038601c49958aa6d4ffa11e0232dbc95648dd8485abef48c8abfc270d480
      - record: D228
        rev: e6f75b99836a72362b3c3186da6f861d048daec16ba326fd504555151c889b23
  - action: merge:browser-sim-m1@f8d29d5
    disposition: not-triggered
    because: >-
      A local fast-forward of main (8bc7789) to browser-sim-m1 (f8d29d5): it adds no content beyond
      the 18 commits already on the branch, each of them gated when made
      (commit:synchrony-review-20261101 ... commit:b016-records-20261103), where the content this
      commitment governs was reviewed. Nothing is pushed or published by this step. No freeze, model
      change, run, held-out use or new reading is in it.
    by: lead (session e38b977a)
    at: "2026-11-03 16:41 UTC"
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
- 2026-10-30 05:36 UTC lead (session 9d2b15e6): reviewed D194: D194 discloses the dependence of raw and corrected bands and classes far bands by the frozen interval rule only (e.g. Eu-M's S2-J >= 40 mm unresolved (MC), Ew5's C >= 40 mm outside by its CI). F103 carries the same disclosure. Applies to commit and publish of the reading.
- 2026-10-30 22:07 UTC lead (session 108deea8): review for commit:partd-1a-20261030: not-applicable — No band reading or far-band verdict in this commit; D210 is descriptive with no outside class.
- 2026-10-31 00:42 UTC lead (session 108deea8): review for commit:item1b-design-20261031: not-applicable — No Stages 1-3 reading, member, band or multiplier is committed: the entries are item 1(b)'s design, decisions and builds (D211-D219).
- 2026-10-31 03:35 UTC lead (session 6b5fb317): review for commit:partd-1b1c-20261031: not-applicable — no near or far band reading in these records
- 2026-11-03 16:41 UTC lead (session e38b977a): review for merge:browser-sim-m1@f8d29d5: not-triggered — A local fast-forward of main (8bc7789) to browser-sim-m1 (f8d29d5): it adds no content beyond the 18 commits already on the branch, each of them gated when made (commit:synchrony-review-20261101 ... commit:b016-records-20261103), where the content this commitment governs was reviewed. Nothing is pushed or published by this step. No freeze, model change, run, held-out use or new reading is in it.
