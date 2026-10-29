---
id: P59
title: >-
  Part D capability: c frozen on nulls first, then the same-member check; a failed check returns to
  the user before any cross-member value
wording: >-
  c frozen (on nulls only) → same-member check → cross-member comparisons only if it passes. A
  failed check returns to the user before any cross-member value is computed.
made: D175
state: open
nodes: [T033]
reviews:
  - action: rent:partd2b-20261029
    disposition: satisfied
    because: >-
      Renting computes nothing; partDCap.ts enforces nulls -> same --frozen -> cross (D176), and
      member capability outputs are sealed from launch (P63).
    by: lead (session 20261029)
    at: "2026-10-29 05:37 UTC"
  - action: run:partd2b-20261029
    disposition: satisfied
    because: >-
      Running computes no separation: partDCap.ts runs locally later in the enforced order; member
      capability outputs sealed (P63).
    by: lead (session 20261029)
    at: "2026-10-29 05:44 UTC"
  - action: rent:partd2b-switch-20261029
    disposition: satisfied
    because: Switching computes nothing; the reader order is enforced locally later.
    by: lead (session 20261029)
    at: "2026-10-29 14:49 UTC"
  - action: commit:20261029
    disposition: not-applicable
    because: No capability statistic has been computed; the reader enforces the order in code.
    by: lead (session 20261029)
    at: "2026-10-29 21:23 UTC"
---

## History
- 2026-10-26 20:23 UTC lead (session d6df3027): created — reader order fixed by D175 item 6
- 2026-10-29 05:27 UTC lead (session 20261029): reviewed D176: the order is enforced in partDCap.ts (nulls writes nulls.json from base runs only; same needs --frozen Dnnn; cross refuses unless same passed). Not yet exercised. Open.
- 2026-10-29 05:32 UTC lead (session 20261029): reviewed D177: the order is unchanged; the same-member alarm now counts shares of evaluable pairs (more than 10 %). Open.
- 2026-10-29 05:34 UTC lead (session 20261029): reviewed D178: the capability order is untouched. Open.
- 2026-10-29 05:37 UTC lead (session 20261029): review for rent:partd2b-20261029: satisfied — Renting computes nothing; partDCap.ts enforces nulls -> same --frozen -> cross (D176), and member capability outputs are sealed from launch (P63).
- 2026-10-29 05:44 UTC lead (session 20261029): review for run:partd2b-20261029: satisfied — Running computes no separation: partDCap.ts runs locally later in the enforced order; member capability outputs sealed (P63).
- 2026-10-29 14:49 UTC lead (session 20261029): review for rent:partd2b-switch-20261029: satisfied — Switching computes nothing; the reader order is enforced locally later.
- 2026-10-29 21:23 UTC lead (session 20261029): review for commit:20261029: not-applicable — No capability statistic has been computed; the reader enforces the order in code.
