---
id: P101
title: "Item 1(b): the read waits until the two implementations agree"
wording: >-
  any difference in an event list, a per-event value (beyond 1e-9), a count or a class holds the
  read until its cause is found and logged
made: D219
state: fulfilled
nodes: [T035]
resolved_by: D220
links: [D220]
reviews:
  - action: run:triggers-quorum
    disposition: acting
    because: >-
      The quorum check produces the comparison this commitment reads; the aggregator stays held
      until it agrees.
    by: lead (session 108deea8)
    at: "2026-10-31 00:41 UTC"
    inputs:
      - record: D219
        rev: f40d4621554b1c43d95ada49998f2767223f5eb1b71a041a9ec9d77322841df8
  - action: commit:item1b-design-20261031
    disposition: not-applicable
    because: "No item 1(b) result is committed: nothing has been read on real data; the aggregator is held (D219)."
    by: lead (session 108deea8)
    at: "2026-10-31 00:42 UTC"
---

## History
- 2026-10-31 00:40 UTC lead (session 108deea8): created — recorded from D219 (user-approved quorum check)
- 2026-10-31 00:41 UTC lead (session 108deea8): review for run:triggers-quorum: acting — The quorum check produces the comparison this commitment reads; the aggregator stays held until it agrees.
- 2026-10-31 00:42 UTC lead (session 108deea8): review for commit:item1b-design-20261031: not-applicable — No item 1(b) result is committed: nothing has been read on real data; the aggregator is held (D219).
- 2026-10-31 00:58 UTC lead (session 108deea8): set state=fulfilled; set resolved_by=D220; added D220 to links — D220: the two implementations agree on both synthetic cases; nothing held
