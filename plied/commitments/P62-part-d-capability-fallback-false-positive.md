---
id: P62
title: >-
  Part D capability: fallback false-positive rate measured on the nulls; tightened before freezing
  if above 5 %
wording: >-
  The fallback's false-positive rate is measured on the same nulls and reported; if it exceeds 5 %,
  the Bonferroni level is tightened on the nulls before freezing.
made: D175
state: fulfilled
nodes: [T033]
resolved_by: D196
reviews:
  - action: rent:partd2b-20261029
    disposition: not-applicable
    because: Renting does not freeze the fallback; its FP is measured on the nulls at the freeze.
    by: lead (session 20261029)
    at: "2026-10-29 05:37 UTC"
  - action: run:partd2b-20261029
    disposition: not-applicable
    because: The run does not freeze the fallback.
    by: lead (session 20261029)
    at: "2026-10-29 05:44 UTC"
  - action: rent:partd2b-switch-20261029
    disposition: not-applicable
    because: Switching does not freeze the fallback.
    by: lead (session 20261029)
    at: "2026-10-29 14:49 UTC"
  - action: commit:20261029
    disposition: not-applicable
    because: No fallback rate computed yet.
    by: lead (session 20261029)
    at: "2026-10-29 21:23 UTC"
  - action: run:partd2-capfiles
    disposition: satisfied
    because: The fallback FP rate is measured on the nulls by partDCap.ts nulls before c is frozen.
    by: lead (session 20261029)
    at: "2026-10-29 21:47 UTC"
  - action: run:partd2b-read
    disposition: not-applicable
    because: No capability statistic is involved.
    by: lead (session 20261029)
    at: "2026-10-29 22:36 UTC"
  - action: run:partdcap-nulls
    disposition: satisfied
    because: >-
      nulls measures the fallback's false-positive rate on the same nulls and tightens alpha through
      D176 gap 3's ladder, stopping for the user if none is <= 5 %; reported in the freeze entry
    by: lead (session 9d2b15e6)
    at: "2026-10-30 17:36 UTC"
    inputs:
      - record: D175
        rev: a97c730ed5c53346f2e9dbc37b1db8914870619664c53a4423689b5547f1e3ba
      - record: D176
        rev: 1a0a604d94312ce0b943f54a70dff070a96bb5b490e6fe2f4ec5f8ae18b71d96
---

## History
- 2026-10-29 01:25 UTC lead (session 20261029): created — D175 item 4: a conditional on freezing the fallback
- 2026-10-29 05:27 UTC lead (session 20261029): reviewed D176: the fallback FP is measured on the nulls at each of {0.05, 0.025, 0.01, 0.005, 0.001}/3 and the first <= 5 % is chosen (gap 3, Q22); in synthetic checks the uncalibrated 0.05/3 gave about 6.9 %. Open.
- 2026-10-29 05:32 UTC lead (session 20261029): reviewed D177: the user confirmed the tightening as the first of {0.05, 0.025, 0.01, 0.005, 0.001}/3 with null FP <= 5 %, else back to the user. Open until measured.
- 2026-10-29 05:34 UTC lead (session 20261029): reviewed D178: the fallback rule is unchanged. Open.
- 2026-10-29 05:37 UTC lead (session 20261029): review for rent:partd2b-20261029: not-applicable — Renting does not freeze the fallback; its FP is measured on the nulls at the freeze.
- 2026-10-29 05:44 UTC lead (session 20261029): review for run:partd2b-20261029: not-applicable — The run does not freeze the fallback.
- 2026-10-29 14:49 UTC lead (session 20261029): review for rent:partd2b-switch-20261029: not-applicable — Switching does not freeze the fallback.
- 2026-10-29 21:23 UTC lead (session 20261029): review for commit:20261029: not-applicable — No fallback rate computed yet.
- 2026-10-29 21:47 UTC lead (session 20261029): review for run:partd2-capfiles: satisfied — The fallback FP rate is measured on the nulls by partDCap.ts nulls before c is frozen.
- 2026-10-29 22:36 UTC lead (session 20261029): review for run:partd2b-read: not-applicable — No capability statistic is involved.
- 2026-10-30 05:36 UTC lead (session 9d2b15e6): reviewed D194: names P62 as a step of Stage 3b; the fallback's false-positive rate is not yet measured. Open.
- 2026-10-30 17:36 UTC lead (session 9d2b15e6): review for run:partdcap-nulls: satisfied — nulls measures the fallback's false-positive rate on the same nulls and tightens alpha through D176 gap 3's ladder, stopping for the user if none is <= 5 %; reported in the freeze entry
- 2026-10-30 17:41 UTC lead (session 9d2b15e6): set state=fulfilled; set resolved_by=D196 — D196 reports the fallback's false-positive rate on the same nulls (7.0 % at 0.05/3) and the tightened level 0.025/3 (4.4 %) before freezing
