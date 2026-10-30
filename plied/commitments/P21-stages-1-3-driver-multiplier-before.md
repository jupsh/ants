---
id: P21
title: "Stages 1-3: driver multiplier before and after clipping both reported"
wording: >-
  The normalised multiplier before clipping and the multiplier actually applied are kept apart, and
  both reported.
summary: "With D128: the 2-D separation rule deferred until calibrated."
made: D129
state: open
governs: [commit, publish]
nodes: [T033]
links: [D128, D158]
reviews:
  - action: run:q03-recheck-20261025
    disposition: not-applicable
    because: >-
      This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism,
      no spatial coupling, no assessment rows. No driver multiplier is applied.
    by: lead (session 421f3ea4)
    at: "2026-10-25 16:54 UTC"
  - action: run:partd-bench-20261026
    disposition: not-applicable
    because: >-
      Nothing is reported from the bench: outputs are deleted unread (D168); the
      before/after-clipping record applies to Stage 2 readings.
    by: lead (session 0cf57b71)
    at: "2026-10-26 01:31 UTC"
  - action: commit:20261029
    disposition: satisfied
    because: >-
      D184 reports the multiplier before and after clipping for every Stage 2a member
      (logs/partd2/mult-2a.json); the Stage 2b reader reports both for the 2b runs.
    by: lead (session 20261029)
    at: "2026-10-29 21:23 UTC"
  - action: commit:partd-1a-20261030
    disposition: not-applicable
    because: >-
      No driver multiplier is newly reported: D204-D210 read D_w by block and draft the list; the
      multipliers stay as D184 reports them.
    by: lead (session 108deea8)
    at: "2026-10-30 22:06 UTC"
---
Draft label: P21 (docs/threads-draft.md revision 2).

## History
- 2026-10-24 22:11 UTC lead (session 104e7640): created — migrated from docs/threads-draft.md revision 2 (D142)
- 2026-10-24 22:12 UTC lead (session 104e7640): set nodes=["T033"] — attached to its nodes (D142)
- 2026-10-25 00:31 UTC lead (session 7c2d50fd): D144 (T049 scan review) cites this record's links; reviewed, nothing here changes (the cited promises are covered or discharged as D144 lists)
- 2026-10-25 04:10 UTC lead (session 0bcdd30b): reviewed D157: it redesigns Stages 1-3 and adds a shared-signal member with spatially varying response (P42). That member has a driver multiplier too, so this reporting rule applies to it and is carried into the revised design.
- 2026-10-25 04:14 UTC lead (session 0bcdd30b): added D158 to links — D158 carries this into the redesign: the multiplier before and after clipping is a descriptive row for every member under M
- 2026-10-25 04:20 UTC lead (session 0bcdd30b): reviewed D159: item 1 adds that for Es neither the clipped multiplier nor the trajectory multiplier is guaranteed to average 1; both reported (P46), alongside this rule's before and after clipping.
- 2026-10-25 16:45 UTC lead (session 421f3ea4): reviewed D161: it approves the Q03 recheck design (T015) and confirms Stage 1 may proceed now, Stage 2a after the recheck reading; it mentions T033 only for that order. Clipping reporting is untouched.
- 2026-10-25 16:54 UTC lead (session 421f3ea4): review for run:q03-recheck-20261025: not-applicable — This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism, no spatial coupling, no assessment rows. No driver multiplier is applied.
- 2026-10-25 18:11 UTC lead (session fe835760): reviewed D163: it reads the water-start recheck at C2 base, with no driver or Es member and no clipping; the multiplier reporting this asks for is untouched.
- 2026-10-25 18:24 UTC lead (session fe835760): reviewed D164: the build adds the before/after-clipping record this asks for (oracleG: g pre and post clipping and 1/g at trace samples). Its reporting is due when Stage 2 results are read; still open.
- 2026-10-26 01:19 UTC lead (session 0cf57b71): reviewed D165: it orders the precision forecast and the bench ahead of further member runs; the before/after-clipping record is not touched and stays required in every reading.
- 2026-10-26 01:27 UTC lead (session 0cf57b71): reviewed D166/D167: the forecast reads Part C proxies only; no multiplier is involved. P21 applies at Stage 2 readings, unchanged.
- 2026-10-26 01:31 UTC lead (session 0cf57b71): review for run:partd-bench-20261026: not-applicable — Nothing is reported from the bench: outputs are deleted unread (D168); the before/after-clipping record applies to Stage 2 readings.
- 2026-10-26 02:38 UTC lead (session 0cf57b71): reviewed D169: it cites D158 only for the old cost basis; timing only, no multiplier read. Unaffected.
- 2026-10-26 03:35 UTC lead (session 0cf57b71): set governs=["commit","publish"] — D171 item 5: reading-only wording; it cannot bear on a run, fit or rental, and comes up again when results are committed or published
- 2026-10-26 16:18 UTC lead (session d6df3027): reviewed D172: a rental and launch record; it reports no multiplier, so nothing to report under P21 yet; Stage 2a's reading must report both multipliers
- 2026-10-29 01:26 UTC lead (session 20261029): reviewed D173 (and D174/D175 via D158/T033): D173 notes the pre- and post-clipping multipliers are not in calib.log and are owed before commit or publication; D174/D175 do not touch clipping. Still open.
- 2026-10-29 05:27 UTC lead (session 20261029): reviewed D176: cap runs carry --oracleTrace via partD2's runner like every member run, so pre- and post-clipping multipliers will exist for them too; the report P21 asks for is still owed. Open.
- 2026-10-29 05:32 UTC lead (session 20261029): reviewed D177: counting rules only; the multiplier report is still owed. Open.
- 2026-10-29 05:34 UTC lead (session 20261029): reviewed D178: support and MC rules do not touch clipping; the multiplier report is still owed before commit or publication. Open.
- 2026-10-29 05:45 UTC lead (session 20261029): reviewed D179 (rental and launch): runs carry --oracleTrace, so pre- and post-clipping multipliers will exist; the report is owed before commit or publication. Open.
- 2026-10-29 21:23 UTC lead (session 20261029): review for commit:20261029: satisfied — D184 reports the multiplier before and after clipping for every Stage 2a member (logs/partd2/mult-2a.json); the Stage 2b reader reports both for the 2b runs.
- 2026-10-29 22:15 UTC lead (session 20261029): reviewed D185: the Stage 2b reader reports the multiplier before and after clipping for every 2b arm; P21 stays open for that reading
- 2026-10-29 22:37 UTC lead (session 20261029): reviewed D186: it answers Q23 on the MC extension's support; this commitment applies at the 2b reading unchanged
- 2026-10-30 05:37 UTC lead (session 9d2b15e6): reviewed D194: both multipliers reported, kept apart, for every 2b member (before clipping and applied, with the clipped share; Es 5.97 / 0.32 / 94.3 %). Governs commit and publish of the reading: met in D194. Applies again to the capability reading. Open.
- 2026-10-30 17:58 UTC lead (session 9d2b15e6): reviewed D200: it cites D158 for Stage 3c's rule; the capability reading uses no multiplier, and both multipliers were reported for the 2b reading (D194). Applies to commit and publish; unaffected.
- 2026-10-30 20:51 UTC lead (session 20261030): reviewed D205: it cites D158 for the stopping rule and its lead items only; it reports no multiplier and runs nothing, so P21's before/after-clipping reporting is not engaged. Unchanged
- 2026-10-30 22:06 UTC lead (session 108deea8): review for commit:partd-1a-20261030: not-applicable — No driver multiplier is newly reported: D204-D210 read D_w by block and draft the list; the multipliers stay as D184 reports them.
