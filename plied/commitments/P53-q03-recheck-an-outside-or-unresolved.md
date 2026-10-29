---
id: P53
title: >-
  Q03 recheck: an outside or unresolved row returns for a decision before any change; runner and
  reader frozen first
wording: >-
  Any outside or unresolved result returns for a decision before changing settings, tolerances or
  run length. … Freeze the amended design and the runner and reader before the recheck.
made: D161
state: not-triggered
nodes: [T015]
resolved_by: D163
links: [D160, D162, D163]
reviews:
  - action: run:q03-recheck-20261025
    disposition: acting
    because: >-
      Runner and reader frozen in D162 before the run; the reader prints 'returns for a decision'
      for any outside, unresolved or missing row, and no setting, tolerance or run length is changed
      before a decision.
    by: lead (session 421f3ea4)
    at: "2026-10-25 16:55 UTC"
---

## History
- 2026-10-25 16:45 UTC lead (session 421f3ea4): created — D161 items 4 and the freeze line
- 2026-10-25 16:54 UTC lead (session 421f3ea4): added D162 to links — D162 freezes the runner and reader before the recheck; the return-for-a-decision part stays open until the reading
- 2026-10-25 16:55 UTC lead (session 421f3ea4): review for run:q03-recheck-20261025: acting — Runner and reader frozen in D162 before the run; the reader prints 'returns for a decision' for any outside, unresolved or missing row, and no setting, tolerance or run length is changed before a decision.
- 2026-10-25 18:11 UTC lead (session fe835760): set state=not-triggered; set resolved_by=D163; added D163 to links — no row outside, unresolved or missing (D163); no setting, tolerance or run length changed
