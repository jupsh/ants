---
id: P25
title: Wall behaviour and packing settled before any spatial coupling
wording: wall behaviour and packing settled before any spatial coupling
summary: >-
  Applies at Stages 1-3's gate (transmission members are a spatial coupling); whether wall and
  packing are settled (T009 closed, S001) is for that review.
made: D030
state: open
nodes: [T023, T033]
links: [D158, D159]
reviews:
  - action: run:q03-recheck-20261025
    disposition: not-applicable
    because: >-
      This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism,
      no spatial coupling, no assessment rows. Base runs add no spatial coupling.
    by: lead (session 421f3ea4)
    at: "2026-10-25 16:54 UTC"
  - action: run:partd-bench-20261026
    disposition: satisfied
    because: >-
      The transmission members are spatial couplings; D159 item 5 accepted P25's disposition for
      these bounded comparisons (settled = closed with failures accepted, P52).
    by: lead (session 0cf57b71)
    at: "2026-10-26 01:31 UTC"
  - action: rent:partd2a-20261026
    disposition: satisfied
    because: D159 item 5 accepted P25's disposition for these comparisons (P52).
    by: lead (session 0cf57b71)
    at: "2026-10-26 03:38 UTC"
  - action: rent:partd2a-20261026-d172
    disposition: satisfied
    because: D159 item 5 accepted P25's disposition for these comparisons (P52); no change since.
    by: lead (session d6df3027)
    at: "2026-10-26 16:07 UTC"
  - action: rent:partd2a-20261026-56637446
    disposition: satisfied
    because: D159 item 5 accepted P25's disposition for these comparisons (P52); no change since.
    by: lead (session d6df3027)
    at: "2026-10-26 16:14 UTC"
  - action: run:partd2a
    disposition: satisfied
    because: D159 item 5 accepted P25's disposition for these comparisons (P52); no change since.
    by: lead (session d6df3027)
    at: "2026-10-26 16:16 UTC"
  - action: rent:partd2b-20261029
    disposition: satisfied
    because: D159 item 5 accepted P25's disposition for these comparisons (P52); no packing change since.
    by: lead (session 20261029)
    at: "2026-10-29 05:37 UTC"
  - action: run:partd2b-20261029
    disposition: satisfied
    because: "D159 item 5 / P52: packing closed with failures accepted for these comparisons; unchanged."
    by: lead (session 20261029)
    at: "2026-10-29 05:44 UTC"
  - action: rent:partd2b-switch-20261029
    disposition: satisfied
    because: "Unchanged since run:partd2b-20261029: P52's disposition holds; no packing arm."
    by: lead (session 20261029)
    at: "2026-10-29 14:49 UTC"
  - action: commit:20261029
    disposition: not-applicable
    because: A commit adds no spatial coupling; P52's disposition for these comparisons is unchanged.
    by: lead (session 20261029)
    at: "2026-10-29 21:23 UTC"
---

## History
- 2026-10-25 00:28 UTC lead (session 7c2d50fd): created — T049 scan review (D144)
- 2026-10-25 04:10 UTC lead (session 0bcdd30b): reviewed D157: the redesign adds spatial members (transmission and a spatially varying shared response), so this precondition binds the revised design before any of them runs. Still open.
- 2026-10-25 04:14 UTC lead (session 0bcdd30b): added D158 to links — D158 puts this precondition to the user at the gate, proposing 'settled as a closed, disclosed limitation' (T009, F027, F078); undecided
- 2026-10-25 04:19 UTC lead (session 0bcdd30b): added D159 to links — the user accepted the disposition for these bounded diagnostic comparisons (D159 item 5): packing closed, its failures accepted as limitations, F078's occupancy and spread carried with the near-share deficit; recorded as the disposition at the Stage 2 gate
- 2026-10-25 04:25 UTC lead (session 0bcdd30b): reviewed D160: it designs the C2 warm-up recheck (D159 item 4), base only, with no spatial member; packing's disposition is untouched.
- 2026-10-25 16:45 UTC lead (session 421f3ea4): reviewed D161: it approves the Q03 recheck design (T015) and confirms Stage 1 may proceed now, Stage 2a after the recheck reading; it mentions T033 only for that order. Packing is not mentioned; P52's disposition stands.
- 2026-10-25 16:54 UTC lead (session 421f3ea4): review for run:q03-recheck-20261025: not-applicable — This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism, no spatial coupling, no assessment rows. Base runs add no spatial coupling.
- 2026-10-25 18:12 UTC lead (session fe835760): reviewed D163: a water-start recheck at C2 base; it says nothing about wall behaviour or packing (F078 still carried). Unaffected.
- 2026-10-25 18:24 UTC lead (session fe835760): reviewed D164: the build adds spatial coupling members but runs none for assessment; whether wall and packing are settled stays for the Stages 1-3 gate. Unaffected.
- 2026-10-26 01:19 UTC lead (session 0cf57b71): reviewed D165: it cites D158/D159 only for the forecast's timing; P25's disposition (accepted in D159, P52) is unchanged.
- 2026-10-26 01:27 UTC lead (session 0cf57b71): reviewed D166/D167: precision only; P25's disposition and its carried packing limits are untouched.
- 2026-10-26 01:31 UTC lead (session 0cf57b71): review for run:partd-bench-20261026: satisfied — The transmission members are spatial couplings; D159 item 5 accepted P25's disposition for these bounded comparisons (settled = closed with failures accepted, P52).
- 2026-10-26 02:38 UTC lead (session 0cf57b71): reviewed D169: cost basis only (via D158); packing disposition untouched.
- 2026-10-26 03:36 UTC lead (session 0cf57b71): reviewed D170/D171: no packing change; disposition as D159.
- 2026-10-26 03:38 UTC lead (session 0cf57b71): review for rent:partd2a-20261026: satisfied — D159 item 5 accepted P25's disposition for these comparisons (P52).
- 2026-10-26 16:07 UTC lead (session d6df3027): review for rent:partd2a-20261026-d172: satisfied — D159 item 5 accepted P25's disposition for these comparisons (P52); no change since.
- 2026-10-26 16:14 UTC lead (session d6df3027): review for rent:partd2a-20261026-56637446: satisfied — D159 item 5 accepted P25's disposition for these comparisons (P52); no change since.
- 2026-10-26 16:16 UTC lead (session d6df3027): review for run:partd2a: satisfied — D159 item 5 accepted P25's disposition for these comparisons (P52); no change since.
- 2026-10-29 01:26 UTC lead (session 20261029): reviewed D173-D175 (via D158/D159/T033): calibration and the capability/support rules do not touch wall behaviour or packing; P52 still states what 'settled' means for Stages 1-3. Unaffected.
- 2026-10-29 05:27 UTC lead (session 20261029): reviewed D176: a statistics build on the existing spatial members; no wall or packing change. Unaffected.
- 2026-10-29 05:32 UTC lead (session 20261029): reviewed D177: no wall or packing change. Unaffected.
- 2026-10-29 05:34 UTC lead (session 20261029): reviewed D178: no wall or packing change. Unaffected.
- 2026-10-29 05:37 UTC lead (session 20261029): review for rent:partd2b-20261029: satisfied — D159 item 5 accepted P25's disposition for these comparisons (P52); no packing change since.
- 2026-10-29 05:44 UTC lead (session 20261029): review for run:partd2b-20261029: satisfied — D159 item 5 / P52: packing closed with failures accepted for these comparisons; unchanged.
- 2026-10-29 14:49 UTC lead (session 20261029): review for rent:partd2b-switch-20261029: satisfied — Unchanged since run:partd2b-20261029: P52's disposition holds; no packing arm.
- 2026-10-29 21:23 UTC lead (session 20261029): review for commit:20261029: not-applicable — A commit adds no spatial coupling; P52's disposition for these comparisons is unchanged.
