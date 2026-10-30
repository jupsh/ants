---
id: P43
title: >-
  Stages 1-3: reproduction asked first; existing rows kept, failures and unresolved rows reported;
  S3's failed gate stays
wording: >-
  First ask which tested members reproduce synchrony magnitude, timescales and spatial profiles
  together. Preserve the existing assessment rows and report failures and unresolved rows. S3's
  failed gate remains on record; the S2 pass does not restore S3 as an established propagation
  signature.
summary: Order and scope of the reading.
made: D157
state: open
governs: [commit, publish]
nodes: [T033]
links: [D158]
reviews:
  - action: run:q03-recheck-20261025
    disposition: not-applicable
    because: >-
      This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism,
      no spatial coupling, no assessment rows. No reproduction question is read from it.
    by: lead (session 421f3ea4)
    at: "2026-10-25 16:55 UTC"
  - action: run:partd-bench-20261026
    disposition: not-applicable
    because: "No reading: outputs deleted unread (D168)."
    by: lead (session 0cf57b71)
    at: "2026-10-26 01:31 UTC"
  - action: commit:20261029
    disposition: not-applicable
    because: "No reproduction reading is committed: Stage 2b is unread."
    by: lead (session 20261029)
    at: "2026-10-29 21:23 UTC"
---

## History
- 2026-10-25 04:09 UTC lead (session 0bcdd30b): created
- 2026-10-25 04:14 UTC lead (session 0bcdd30b): added D158 to links — D158 orders the stages: reproduction read (3a) before the capability test (3b); S3 rows kept, gate G stays failed
- 2026-10-25 04:20 UTC lead (session 0bcdd30b): reviewed D159: the order is approved; Stage 2a additionally waits on the Q03 recheck (P49).
- 2026-10-25 16:45 UTC lead (session 421f3ea4): reviewed D161: it approves the Q03 recheck design (T015) and confirms Stage 1 may proceed now, Stage 2a after the recheck reading; it mentions T033 only for that order. The reading order is untouched.
- 2026-10-25 16:55 UTC lead (session 421f3ea4): review for run:q03-recheck-20261025: not-applicable — This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism, no spatial coupling, no assessment rows. No reproduction question is read from it.
- 2026-10-25 18:12 UTC lead (session fe835760): reviewed D163: it lifts the Q03 hold on Stage 2a but runs no Stages 1-3 member and touches no member, diagnostic or assessment row this governs. Unaffected.
- 2026-10-25 18:24 UTC lead (session fe835760): reviewed D164: no member was assessed for reproduction; the smoke's calibration lines are toy-size and select nothing. Unaffected.
- 2026-10-26 01:19 UTC lead (session 0cf57b71): reviewed D165: P57 keeps every row in the all-20 requirement, consistent with P43's 'preserve the existing assessment rows'; reading order unchanged.
- 2026-10-26 01:27 UTC lead (session 0cf57b71): reviewed D166/D167: F097 forecasts that joint reproduction on all 20 rows is very unlikely even for a perfect model. P43 still requires the rows kept and failures and unresolved rows reported; that is now the expected outcome. Q19 asks the user whether Stage 2 proceeds.
- 2026-10-26 01:31 UTC lead (session 0cf57b71): review for run:partd-bench-20261026: not-applicable — No reading: outputs deleted unread (D168).
- 2026-10-26 02:38 UTC lead (session 0cf57b71): reviewed D169: cost basis only; reading order unchanged.
- 2026-10-26 03:35 UTC lead (session 0cf57b71): set governs=["commit","publish"] — D171 item 5: reading-only wording; it cannot bear on a run, fit or rental, and comes up again when results are committed or published
- 2026-10-26 16:18 UTC lead (session d6df3027): reviewed D172: rental and launch only, no assessment rows read; P43 binds the later Stage 2/3 reading, unaffected
- 2026-10-29 01:26 UTC lead (session 20261029): reviewed D173-D175 (via D158/T033): the joint-reproduction question is still Stage 2b's, asked first; D174 Part B (pending) makes a missing row block joint reproduction, consistent with P43. Unaffected.
- 2026-10-29 05:27 UTC lead (session 20261029): reviewed D176: the capability stage is 3b, after the reproduction reading; D176 changes neither the rows nor the order. Unaffected.
- 2026-10-29 05:32 UTC lead (session 20261029): reviewed D177: the reproduction reading and its order are untouched. Unaffected.
- 2026-10-29 05:34 UTC lead (session 20261029): reviewed D178: Part B's missing-row rule (never equivalent, blocks joint reproduction) and 'unresolved (MC)' fit P43's requirement to report failures and unresolved rows. Unaffected; binds the 2b reading.
- 2026-10-29 05:45 UTC lead (session 20261029): reviewed D179: rental and launch only; reproduction is still read first in 2b, with failures and unresolved rows reported. Unaffected.
- 2026-10-29 21:23 UTC lead (session 20261029): review for commit:20261029: not-applicable — No reproduction reading is committed: Stage 2b is unread.
- 2026-10-29 22:15 UTC lead (session 20261029): reviewed D185: the reader reads reproduction (Stage 3a) first, keeps every row with outside, unresolved and missing listed, and carries S3's failed gate; P43 applies at the reading
- 2026-10-29 22:37 UTC lead (session 20261029): reviewed D186: it answers Q23 on the MC extension's support; this commitment applies at the 2b reading unchanged
- 2026-10-30 05:37 UTC lead (session 9d2b15e6): reviewed D194: D194 answers the first question (no tested member reproduces jointly; F103), keeps all 20 rows, lists every outside and unresolved row, and keeps Stage 0's failed gate G on record; its descriptive gate-G recomputation on the 2b base ('positive excess ordering established') is explicitly said not to reverse it. Governs commit and publish; met in D194. Open.
