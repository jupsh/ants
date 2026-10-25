---
id: Q17
title: Approve or amend the Q03 recheck design (D160)
options:
  - "seeds: one per colony, shared by both starts"
  - 20-h runs, late window 14-20 h; 2-6 h drift descriptive
  - five colony-state rows and their tolerances
  - pass only if all five rows are equivalent
raised: D160
state: answered
nodes: [T015]
answered_by: D161
answer: >-
  Approved with amendments (D161): seeds RNG.stream(0xc4c3, colony).int(2 ** 31), 14-20 h primary,
  relative margins as a ratio of means, all-five rule, no larger-half gate; a pass limited to five
  colony means at C2 base.
---

## History
- 2026-10-25 04:22 UTC lead (session 0bcdd30b): created
- 2026-10-25 16:44 UTC lead (session 421f3ea4): set state=answered; set answered_by=D161; set answer=Approved with amendments (D161): seeds RNG.stream(0xc4c3, colony).int(2 ** 31… — user answered Q17 (D161)
