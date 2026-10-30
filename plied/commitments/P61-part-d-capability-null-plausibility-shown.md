---
id: P61
title: "Part D capability: null plausibility shown before c is frozen, in the freeze entry"
wording: >-
  Before c is frozen, the null's joint (R, S3₂, R_J) distribution is shown against the base arm's
  and Part C's per-colony values (R, S3₂) as a plausibility check, reported in the freeze entry.
made: D175
state: open
nodes: [T033]
reviews:
  - action: rent:partd2b-20261029
    disposition: not-applicable
    because: >-
      Renting does not freeze c; the plausibility tables come from partDCap.ts nulls into the freeze
      entry.
    by: lead (session 20261029)
    at: "2026-10-29 05:37 UTC"
  - action: run:partd2b-20261029
    disposition: not-applicable
    because: The run does not freeze c.
    by: lead (session 20261029)
    at: "2026-10-29 05:44 UTC"
  - action: rent:partd2b-switch-20261029
    disposition: not-applicable
    because: Switching does not freeze c.
    by: lead (session 20261029)
    at: "2026-10-29 14:49 UTC"
  - action: commit:20261029
    disposition: not-applicable
    because: c is not frozen; nothing computed from the nulls.
    by: lead (session 20261029)
    at: "2026-10-29 21:23 UTC"
  - action: run:partd2-capfiles
    disposition: satisfied
    because: >-
      The null plausibility tables are written by partDCap.ts nulls into the freeze entry before c
      is frozen.
    by: lead (session 20261029)
    at: "2026-10-29 21:47 UTC"
  - action: run:partd2b-read
    disposition: not-applicable
    because: No capability statistic is involved.
    by: lead (session 20261029)
    at: "2026-10-29 22:36 UTC"
---

## History
- 2026-10-29 01:25 UTC lead (session 20261029): created — D175 item 3: a precondition on freezing c
- 2026-10-29 05:27 UTC lead (session 20261029): reviewed D176: partDCap.ts nulls writes the null theta summary and correlation, the pool's per-colony values and Part C base's per-colony c0, c3, S3_2, for the freeze entry. Open until that entry.
- 2026-10-29 05:32 UTC lead (session 20261029): reviewed D177: plausibility tables unchanged. Open until the freeze entry.
- 2026-10-29 05:34 UTC lead (session 20261029): reviewed D178: unrelated to the null plausibility tables. Open.
- 2026-10-29 05:37 UTC lead (session 20261029): review for rent:partd2b-20261029: not-applicable — Renting does not freeze c; the plausibility tables come from partDCap.ts nulls into the freeze entry.
- 2026-10-29 05:44 UTC lead (session 20261029): review for run:partd2b-20261029: not-applicable — The run does not freeze c.
- 2026-10-29 14:49 UTC lead (session 20261029): review for rent:partd2b-switch-20261029: not-applicable — Switching does not freeze c.
- 2026-10-29 21:23 UTC lead (session 20261029): review for commit:20261029: not-applicable — c is not frozen; nothing computed from the nulls.
- 2026-10-29 21:47 UTC lead (session 20261029): review for run:partd2-capfiles: satisfied — The null plausibility tables are written by partDCap.ts nulls into the freeze entry before c is frozen.
- 2026-10-29 22:36 UTC lead (session 20261029): review for run:partd2b-read: not-applicable — No capability statistic is involved.
