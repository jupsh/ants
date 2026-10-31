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
  - action: commit:partd-1a-20261030
    disposition: satisfied
    because: >-
      Nothing is waived: D204-D210 change no mapping, clipping, phase or duration treatment and no
      Q03 record; D205 Part 2 item 2 carries C2's failures.
    by: lead (session 108deea8)
    at: "2026-10-30 22:07 UTC"
    inputs:
      - record: D205
        rev: e990086aa7e8f8e7d3a154cc02d3eafe19786ee4ac0e809e3a29f1717a20ad88
      - record: D210
        rev: 91511fa8dac08a97ba28db172b6f39be91fe08489cd10a28a46148d17f90fbc0
  - action: commit:item1b-design-20261031
    disposition: not-applicable
    because: >-
      No Stages 1-3 reading, member, band or multiplier is committed: the entries are item 1(b)'s
      design, decisions and builds (D211-D219).
    by: lead (session 108deea8)
    at: "2026-10-31 00:42 UTC"
  - action: commit:partd-1b1c-20261031
    disposition: not-applicable
    because: no revised member proposal in this commit
    by: lead (session 6b5fb317)
    at: "2026-10-31 03:35 UTC"
    inputs:
      - record: D221
        rev: 2c4c00f83034f74f98234e2e799f1efc5b082fc738fb53e0883c666d6a11adbc
      - record: D226
        rev: 0772038601c49958aa6d4ffa11e0232dbc95648dd8485abef48c8abfc270d480
      - record: D228
        rev: e6f75b99836a72362b3c3186da6f861d048daec16ba326fd504555151c889b23
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
- 2026-10-30 17:58 UTC lead (session 9d2b15e6): reviewed D200: it cites D158 for Stage 3c; the carried disclosures (mapping, clipping, phase, duration, Q03) apply to the reading as a whole and are in D194; D200 adds none and waives none.
- 2026-10-30 20:51 UTC lead (session 20261030): reviewed D205: a proposal with no run; it waives none of the carried items (mapping, clipping, phase and duration, Q03). Its duration remark on D_w's 4-h blocks is from code, not a test. Unchanged
- 2026-10-30 22:07 UTC lead (session 108deea8): review for commit:partd-1a-20261030: satisfied — Nothing is waived: D204-D210 change no mapping, clipping, phase or duration treatment and no Q03 record; D205 Part 2 item 2 carries C2's failures.
- 2026-10-31 00:42 UTC lead (session 108deea8): review for commit:item1b-design-20261031: not-applicable — No Stages 1-3 reading, member, band or multiplier is committed: the entries are item 1(b)'s design, decisions and builds (D211-D219).
- 2026-10-31 03:35 UTC lead (session 6b5fb317): review for commit:partd-1b1c-20261031: not-applicable — no revised member proposal in this commit
