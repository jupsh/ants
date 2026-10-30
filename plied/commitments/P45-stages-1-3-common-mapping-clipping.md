---
id: P45
title: >-
  Stages 1-3: common mapping, clipping, phase and duration treatment and Q03 carried forward, none
  waived
wording: >-
  The revised proposal should also carry forward the common behavioural mapping, clipping
  disclosures, phase and duration treatment, and the outstanding Q03 warm-up decision. None is
  implicitly waived.
summary: Carried disclosures.
made: D157
state: open
governs: [commit, publish]
nodes: [T033]
links: [D158]
reviews:
  - action: run:q03-recheck-20261025
    disposition: acting
    because: >-
      This run answers the Q03 warm-up decision P45 carries forward (D161 approved, D162 froze it);
      its reading is reported with Stages 1-3, nothing waived.
    by: lead (session 421f3ea4)
    at: "2026-10-25 16:55 UTC"
  - action: run:partd-bench-20261026
    disposition: not-applicable
    because: >-
      Nothing is read or reported from the bench; the carried disclosures apply to Stage 2 readings,
      none waived.
    by: lead (session 0cf57b71)
    at: "2026-10-26 01:31 UTC"
  - action: commit:20261029
    disposition: satisfied
    because: >-
      Mapping, clipping, phase, duration and Q03 disclosures are carried in D173 and D184 and in the
      Stage 2b reader's disclosures.
    by: lead (session 20261029)
    at: "2026-10-29 21:23 UTC"
---

## History
- 2026-10-25 04:09 UTC lead (session 0bcdd30b): created
- 2026-10-25 04:14 UTC lead (session 0bcdd30b): added D158 to links — D158 lists M, clipping, phase, duration and Q03 as carried, recommending Q03 be decided before Stage 2a
- 2026-10-25 04:20 UTC lead (session 0bcdd30b): reviewed D159: Q03 is decided (recheck, P49) and P25's disposition accepted with F078 carried (P52); none waived.
- 2026-10-25 16:45 UTC lead (session 421f3ea4): reviewed D161: it approves the Q03 recheck design (T015) and confirms Stage 1 may proceed now, Stage 2a after the recheck reading; it mentions T033 only for that order. It answers the Q03 design P45 carries forward; P45 stays open until Stages 1-3 report that recheck with their reading (P54 limits what a pass covers).
- 2026-10-25 16:55 UTC lead (session 421f3ea4): review for run:q03-recheck-20261025: acting — This run answers the Q03 warm-up decision P45 carries forward (D161 approved, D162 froze it); its reading is reported with Stages 1-3, nothing waived.
- 2026-10-25 18:11 UTC lead (session fe835760): reviewed D163: the 'outstanding Q03 warm-up decision' this carries is now settled by the recheck's pass, within P54's scope; what it carries forward from here is F096 (the pass and its limits: not the 2-h warm-up's adequacy, not new mechanisms). Stays open for the other disclosures.
- 2026-10-25 18:24 UTC lead (session fe835760): reviewed D164: the build keeps mapping M common to all members and records clipping (P21); phase and duration are unchanged (light, 4-h window). The Q03 part is settled by D163. Stays open.
- 2026-10-26 01:19 UTC lead (session 0cf57b71): reviewed D165: no carried disclosure is waived; Q03 is now rechecked (D163, accepted within P54 by D165).
- 2026-10-26 01:27 UTC lead (session 0cf57b71): reviewed D166/D167: duration (data 8-12 h vs 2 x 4 h) is listed among the forecast's limits; no carried disclosure dropped.
- 2026-10-26 01:31 UTC lead (session 0cf57b71): review for run:partd-bench-20261026: not-applicable — Nothing is read or reported from the bench; the carried disclosures apply to Stage 2 readings, none waived.
- 2026-10-26 02:38 UTC lead (session 0cf57b71): reviewed D169: cost basis only; the duration disclosure (2 x 4 h) is unchanged by the run count it prices.
- 2026-10-26 03:35 UTC lead (session 0cf57b71): set governs=["commit","publish"] — D171 item 5: reading-only wording; it cannot bear on a run, fit or rental, and comes up again when results are committed or published
- 2026-10-26 16:18 UTC lead (session d6df3027): reviewed D172: no mapping, clipping, phase or duration choice is made; the Q03 item stands as carried (D163); unaffected
- 2026-10-29 01:26 UTC lead (session 20261029): reviewed D173-D175 (via D158/T033): D173 carries the clipping disclosures (P21, P46) and the members' unrechecked warm-up (P02, P54) forward to Stage 2b and the commit; nothing is waived. Unaffected.
- 2026-10-29 05:27 UTC lead (session 20261029): reviewed D176: mapping M and clipping are unchanged for cap runs (same runner, same specs); the Q03/P02 disclosure carries. Unaffected.
- 2026-10-29 05:32 UTC lead (session 20261029): reviewed D177: nothing carried forward is waived. Unaffected.
- 2026-10-29 05:34 UTC lead (session 20261029): reviewed D178: nothing carried forward is waived. Unaffected.
- 2026-10-29 05:45 UTC lead (session 20261029): reviewed D179: same mapping, clipping, phase (light) and duration as D158; nothing waived. Unaffected.
- 2026-10-29 21:23 UTC lead (session 20261029): review for commit:20261029: satisfied — Mapping, clipping, phase, duration and Q03 disclosures are carried in D173 and D184 and in the Stage 2b reader's disclosures.
- 2026-10-29 22:15 UTC lead (session 20261029): reviewed D185: the reader carries mapping, clipping, phase, duration and Q03 disclosures; unaffected
- 2026-10-29 22:37 UTC lead (session 20261029): reviewed D186: it answers Q23 on the MC extension's support; this commitment applies at the 2b reading unchanged
- 2026-10-30 05:36 UTC lead (session 9d2b15e6): reviewed D194: its disclosures carry mapping M, clipping (multipliers before/after, clipped share), light phase, the 2 x 4 h against 8-12 h duration and Q03's member gap; none waived. Applies again to the capability reading and any commit or publication.
