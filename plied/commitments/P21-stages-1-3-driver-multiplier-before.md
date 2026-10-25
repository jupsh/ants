---
id: P21
title: "Stages 1-3: driver multiplier before and after clipping both reported"
wording: >-
  The normalised multiplier before clipping and the multiplier actually applied are kept apart, and
  both reported.
summary: "With D128: the 2-D separation rule deferred until calibrated."
made: D129
state: open
nodes: [T033]
links: [D128, D158]
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
