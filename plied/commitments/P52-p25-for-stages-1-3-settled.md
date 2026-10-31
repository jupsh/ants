---
id: P52
title: >-
  P25 for Stages 1-3: settled means closed with failures accepted, not matched; F078 carried with
  the near-share deficit; no packing arms
wording: >-
  "Settled" here means the packing work is closed and its unresolved failures are accepted as
  limitations of this comparison. It does not mean packing matches the data. Carry F078's occupancy
  and spread discrepancy alongside the near-share deficit, because both spatial exposure and
  neighbour interactions depend on geometry. This decision authorizes no further packing arms.
summary: Disclosure in every spatial reading of the redesign.
made: D159
state: open
governs: [commit, publish]
nodes: [T033]
reviews:
  - action: run:q03-recheck-20261025
    disposition: not-applicable
    because: >-
      This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism,
      no spatial coupling, no assessment rows. No spatial reading; no packing arm.
    by: lead (session 421f3ea4)
    at: "2026-10-25 16:55 UTC"
  - action: run:partd-bench-20261026
    disposition: not-applicable
    because: No spatial reading; no packing arm.
    by: lead (session 0cf57b71)
    at: "2026-10-26 01:31 UTC"
  - action: commit:20261029
    disposition: not-applicable
    because: No packing arm or spatial reading is committed.
    by: lead (session 20261029)
    at: "2026-10-29 21:23 UTC"
  - action: commit:partd-1a-20261030
    disposition: satisfied
    because: >-
      No packing arm; D205 Part 2 item 2 carries F078 with the near-share deficit (F027, F078; P52)
      as limitations, not matches.
    by: lead (session 108deea8)
    at: "2026-10-30 22:07 UTC"
    inputs:
      - record: D205
        rev: e990086aa7e8f8e7d3a154cc02d3eafe19786ee4ac0e809e3a29f1717a20ad88
  - action: commit:item1b-design-20261031
    disposition: not-applicable
    because: >-
      No Stages 1-3 reading, member, band or multiplier is committed: the entries are item 1(b)'s
      design, decisions and builds (D211-D219).
    by: lead (session 108deea8)
    at: "2026-10-31 00:42 UTC"
  - action: commit:partd-1b1c-20261031
    disposition: not-applicable
    because: packing is not read here
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
- 2026-10-25 04:19 UTC lead (session 0bcdd30b): created
- 2026-10-25 04:25 UTC lead (session 0bcdd30b): reviewed D160: no spatial reading; untouched.
- 2026-10-25 16:45 UTC lead (session 421f3ea4): reviewed D161: it approves the Q03 recheck design (T015) and confirms Stage 1 may proceed now, Stage 2a after the recheck reading; it mentions T033 only for that order. Packing is not mentioned.
- 2026-10-25 16:55 UTC lead (session 421f3ea4): review for run:q03-recheck-20261025: not-applicable — This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism, no spatial coupling, no assessment rows. No spatial reading; no packing arm.
- 2026-10-25 18:12 UTC lead (session fe835760): reviewed D163: a water-start recheck at C2 base; it says nothing about wall behaviour or packing (F078 still carried). Unaffected.
- 2026-10-25 18:24 UTC lead (session fe835760): reviewed D164: no packing or wall change in the build; F078 still carried. Unaffected.
- 2026-10-26 01:19 UTC lead (session 0cf57b71): reviewed D165: packing disposition and its disclosures unchanged.
- 2026-10-26 01:31 UTC lead (session 0cf57b71): review for run:partd-bench-20261026: not-applicable — No spatial reading; no packing arm.
- 2026-10-26 03:35 UTC lead (session 0cf57b71): set governs=["commit","publish"] — D171 item 5: reading-only wording; it cannot bear on a run, fit or rental, and comes up again when results are committed or published
- 2026-10-26 16:18 UTC lead (session d6df3027): reviewed D172: launch adds no packing arm and reads no spatial result; the F078 disclosure stays owed in the spatial readings, unaffected
- 2026-10-29 01:26 UTC lead (session 20261029): reviewed D173-D175 (via D159/T033): no packing arm is proposed or run; F078's discrepancy is still carried. Unaffected.
- 2026-10-29 05:27 UTC lead (session 20261029): reviewed D176: no packing arm. Unaffected.
- 2026-10-29 05:32 UTC lead (session 20261029): reviewed D177: no packing arm. Unaffected.
- 2026-10-29 05:34 UTC lead (session 20261029): reviewed D178: no packing arm. Unaffected.
- 2026-10-29 05:45 UTC lead (session 20261029): reviewed D179: no packing arm among the rented runs. Unaffected.
- 2026-10-29 21:23 UTC lead (session 20261029): review for commit:20261029: not-applicable — No packing arm or spatial reading is committed.
- 2026-10-29 22:15 UTC lead (session 20261029): reviewed D185: carried as a disclosure in the 2b reader; unaffected
- 2026-10-29 22:37 UTC lead (session 20261029): reviewed D186: it answers Q23 on the MC extension's support; this commitment applies at the 2b reading unchanged
- 2026-10-30 05:36 UTC lead (session 9d2b15e6): reviewed D194: its disclosures say packing is closed with failures accepted, not matched, and carry F078 with the near-share deficit; no packing arm added. Applies to commit and publish.
- 2026-10-30 20:51 UTC lead (session 20261030): reviewed D205: it names P52 among the failures every member inherits (packing closed with failures accepted, F078 with the near-share deficit), as P52's wording requires them carried; it proposes no packing arm. Unchanged, open
- 2026-10-30 22:07 UTC lead (session 108deea8): review for commit:partd-1a-20261030: satisfied — No packing arm; D205 Part 2 item 2 carries F078 with the near-share deficit (F027, F078; P52) as limitations, not matches.
- 2026-10-31 00:42 UTC lead (session 108deea8): review for commit:item1b-design-20261031: not-applicable — No Stages 1-3 reading, member, band or multiplier is committed: the entries are item 1(b)'s design, decisions and builds (D211-D219).
- 2026-10-31 03:35 UTC lead (session 6b5fb317): review for commit:partd-1b1c-20261031: not-applicable — packing is not read here
