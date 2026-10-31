---
id: P100
title: "Item 1(b): rise label above 5 % false positives in the null reported uncalibrated"
wording: If it is above 5 % for a type, that type's rise label is reported as uncalibrated rather than read.
made: D216
state: open
nodes: [T035]
reviews:
  - action: run:triggers-amend2
    disposition: acting
    because: >-
      The brief has the aggregator apply this rule from a calibration file: a type above 5 % gets
      its rise label reported as uncalibrated; tested synthetically.
    by: lead (session 108deea8)
    at: "2026-10-31 00:20 UTC"
    inputs:
      - record: D212
        rev: 61cade10f360d1e4bf470b5ecacca53a1449f03a63c3457c647826f9250fba5e
      - record: D216
        rev: 2bfa57b89d06c19abfe5f6e4d95516771eafa89f131df7c30be6b53258ff0364
  - action: run:triggers-cal-full
    disposition: acting
    because: >-
      This calibration produces the rates P100's rule reads; the rule is applied by the aggregator,
      a later step.
    by: lead (session 108deea8)
    at: "2026-10-31 00:37 UTC"
    inputs:
      - record: D212
        rev: 61cade10f360d1e4bf470b5ecacca53a1449f03a63c3457c647826f9250fba5e
      - record: D216
        rev: 2bfa57b89d06c19abfe5f6e4d95516771eafa89f131df7c30be6b53258ff0364
  - action: run:triggers-quorum
    disposition: not-applicable
    because: Synthetic data only; no real-data value is computed or read in the quorum check.
    by: lead (session 108deea8)
    at: "2026-10-31 00:41 UTC"
  - action: commit:item1b-design-20261031
    disposition: not-applicable
    because: "No item 1(b) result is committed: nothing has been read on real data; the aggregator is held (D219)."
    by: lead (session 108deea8)
    at: "2026-10-31 00:42 UTC"
---

## History
- 2026-10-31 00:19 UTC lead (session 108deea8): created — recorded from D216 (user)
- 2026-10-31 00:20 UTC lead (session 108deea8): review for run:triggers-amend2: acting — The brief has the aggregator apply this rule from a calibration file: a type above 5 % gets its rise label reported as uncalibrated; tested synthetically.
- 2026-10-31 00:37 UTC lead (session 108deea8): reviewed D217@f3ffeba5c8bc; D217: the rule is built in read() (rate above 0.05 → uncalibrated text, class unchanged) and checked by the lead; it applies at the read, after the 100-seed calibration. Still open
- 2026-10-31 00:37 UTC lead (session 108deea8): review for run:triggers-cal-full: acting — This calibration produces the rates P100's rule reads; the rule is applied by the aggregator, a later step.
- 2026-10-31 00:41 UTC lead (session 108deea8): review for run:triggers-quorum: not-applicable — Synthetic data only; no real-data value is computed or read in the quorum check.
- 2026-10-31 00:42 UTC lead (session 108deea8): review for commit:item1b-design-20261031: not-applicable — No item 1(b) result is committed: nothing has been read on real data; the aggregator is held (D219).
