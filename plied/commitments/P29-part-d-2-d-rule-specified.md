---
id: P29
title: Part D 2-D rule specified before Stage 2 runs, after its calibration
wording: >-
  2-D rule (point 5): deferred. It is specified in a later amendment, before Stage 2 runs and after
  its calibration
made: D126
state: fulfilled
nodes: [T033]
resolved_by: D175
links: [D158]
reviews:
  - action: run:q03-recheck-20261025
    disposition: not-applicable
    because: >-
      This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism,
      no spatial coupling, no assessment rows. It is not a Stage 2 run.
    by: lead (session 421f3ea4)
    at: "2026-10-25 16:54 UTC"
  - action: run:partd-bench-20261026
    disposition: not-applicable
    because: >-
      The bench is not a Stage 2 run: fresh probe seeds, strength 2, timing only, no calibration or
      assessment (D168). P29 still binds before Stage 2 assessment runs.
    by: lead (session 0cf57b71)
    at: "2026-10-26 01:31 UTC"
  - action: rent:partd2a-20261026
    disposition: not-applicable
    because: >-
      The rental is for Stage 2a calibration only (D171 item 2); P29's rule is specified after
      calibration, before Stage 2b, with the user's approval.
    by: lead (session 0cf57b71)
    at: "2026-10-26 03:38 UTC"
  - action: rent:partd2a-20261026-d172
    disposition: not-applicable
    because: >-
      This rental is Stage 2a calibration only (D172 scope); P29's rule comes after calibration and
      before Stage 2b, with the user's approval.
    by: lead (session d6df3027)
    at: "2026-10-26 16:07 UTC"
  - action: rent:partd2a-20261026-56637446
    disposition: not-applicable
    because: >-
      This rental is Stage 2a calibration only (D172 scope); P29's rule comes after calibration and
      before Stage 2b, with the user's approval.
    by: lead (session d6df3027)
    at: "2026-10-26 16:14 UTC"
  - action: run:partd2a
    disposition: not-applicable
    because: >-
      These are Stage 2a calibration and verification runs; P29's rule is specified after
      calibration and before Stage 2b (D126, D171 item 1).
    by: lead (session d6df3027)
    at: "2026-10-26 16:16 UTC"
---

## History
- 2026-10-25 00:28 UTC lead (session 7c2d50fd): created — T049 scan review (D144)
- 2026-10-25 04:10 UTC lead (session 0bcdd30b): reviewed D157: the redesign may change Stage 2; the 2-D rule is still specified before Stage 2 runs, now within the revised design. Still open.
- 2026-10-25 04:14 UTC lead (session 0bcdd30b): added D158 to links — D158 adds R_J to the capability diagnostic; its rule is still fixed after calibration and before Stage 2b
- 2026-10-25 04:20 UTC lead (session 0bcdd30b): reviewed D159: the diagnostic coordinates are approved provisionally; the complete rule keeps the user's approval, now with independent datasets, error rates and power, and separate draws (P48).
- 2026-10-25 16:45 UTC lead (session 421f3ea4): reviewed D161: it approves the Q03 recheck design (T015) and confirms Stage 1 may proceed now, Stage 2a after the recheck reading; it mentions T033 only for that order. The 2-D rule and its approval are untouched.
- 2026-10-25 16:54 UTC lead (session 421f3ea4): review for run:q03-recheck-20261025: not-applicable — This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism, no spatial coupling, no assessment rows. It is not a Stage 2 run.
- 2026-10-25 18:12 UTC lead (session fe835760): reviewed D163: the recheck's five rows are colony-state diagnostics for the water start, not Part D assessment rows; no Part D rule, support, MC or reading wording is touched. Unaffected.
- 2026-10-25 18:24 UTC lead (session fe835760): reviewed D164: the build includes the Stage 2a calibration driver, but no 2-D rule is specified yet; it is due after calibration and before Stage 2b. Unchanged.
- 2026-10-26 01:19 UTC lead (session 0cf57b71): reviewed D165: item 4 says the capability rule keeps its separate approval; P29's rule is still specified after calibration, before Stage 2 assessment runs. Unaffected.
- 2026-10-26 01:27 UTC lead (session 0cf57b71): reviewed D166/D167: the forecast covers assessment rows, not the capability diagnostic; P29's rule is still to be specified after calibration, before the Stage 2 assessment runs.
- 2026-10-26 01:31 UTC lead (session 0cf57b71): review for run:partd-bench-20261026: not-applicable — The bench is not a Stage 2 run: fresh probe seeds, strength 2, timing only, no calibration or assessment (D168). P29 still binds before Stage 2 assessment runs.
- 2026-10-26 02:38 UTC lead (session 0cf57b71): reviewed D169: cost basis only; P29's rule is still due before the Stage 2 assessment runs.
- 2026-10-26 03:36 UTC lead (session 0cf57b71): reviewed D170/D171: the delegation excludes P29's complete rule, which keeps the user's approval (D159 item 3). D171 orders it after Stage 2a calibration and before 2b. Still open.
- 2026-10-26 03:38 UTC lead (session 0cf57b71): review for rent:partd2a-20261026: not-applicable — The rental is for Stage 2a calibration only (D171 item 2); P29's rule is specified after calibration, before Stage 2b, with the user's approval.
- 2026-10-26 16:07 UTC lead (session d6df3027): review for rent:partd2a-20261026-d172: not-applicable — This rental is Stage 2a calibration only (D172 scope); P29's rule comes after calibration and before Stage 2b, with the user's approval.
- 2026-10-26 16:14 UTC lead (session d6df3027): review for rent:partd2a-20261026-56637446: not-applicable — This rental is Stage 2a calibration only (D172 scope); P29's rule comes after calibration and before Stage 2b, with the user's approval.
- 2026-10-26 16:16 UTC lead (session d6df3027): review for run:partd2a: not-applicable — These are Stage 2a calibration and verification runs; P29's rule is specified after calibration and before Stage 2b (D126, D171 item 1).
- 2026-10-26 20:23 UTC lead (session d6df3027): set state=fulfilled; set resolved_by=D175 — the 2-D (capability) rule is specified after calibration (D173) and before Stage 2b runs, approved by the user as amended (D175)
- 2026-10-29 05:34 UTC lead (session 20261029): reviewed D178: it names P29 only to say its rule is fixed (D175, with D176/D177's confirmed details); it does not reopen it. Stays fulfilled.
