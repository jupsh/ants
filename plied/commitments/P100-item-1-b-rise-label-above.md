---
id: P100
title: "Item 1(b): rise label above 5 % false positives in the null reported uncalibrated"
wording: If it is above 5 % for a type, that type's rise label is reported as uncalibrated rather than read.
made: D216
state: not-triggered
nodes: [T035]
resolved_by: D221
links: [D221]
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
  - action: run:triggers-amend2
    disposition: acting
    because: >-
      Re-read D212 after its dated correction (D220): it only renames amendment 2's pooled-variance
      formula as its square root, the pooled SD both implementations compute; it changes nothing
      this action did or its disposition rests on.
    by: lead (session 108deea8)
    at: "2026-10-31 00:58 UTC"
    inputs:
      - record: D212
        rev: c08d81a72ffe2039af178f50cd473fc20e63edae34c1faff63547e4892286a8f
      - record: D220
        rev: 6a41442d4e57d8a87407783501125e554a7e72d70ac50eac18e3446fc5bfc6f3
  - action: run:triggers-cal-full
    disposition: acting
    because: >-
      Re-read D212 after its dated correction (D220): it only renames amendment 2's pooled-variance
      formula as its square root, the pooled SD both implementations compute; it changes nothing
      this action did or its disposition rests on.
    by: lead (session 108deea8)
    at: "2026-10-31 00:59 UTC"
    inputs:
      - record: D212
        rev: c08d81a72ffe2039af178f50cd473fc20e63edae34c1faff63547e4892286a8f
      - record: D220
        rev: 6a41442d4e57d8a87407783501125e554a7e72d70ac50eac18e3446fc5bfc6f3
  - action: run:triggers-read
    disposition: acting
    because: >-
      The aggregator reads the 100-seed calibration and reports a type's rise label as uncalibrated
      if its rate is above 0.05.
    by: lead (session 108deea8)
    at: "2026-10-31 01:00 UTC"
    inputs:
      - record: D216
        rev: 2bfa57b89d06c19abfe5f6e4d95516771eafa89f131df7c30be6b53258ff0364
      - record: D212
        rev: c08d81a72ffe2039af178f50cd473fc20e63edae34c1faff63547e4892286a8f
---

## History
- 2026-10-31 00:19 UTC lead (session 108deea8): created — recorded from D216 (user)
- 2026-10-31 00:20 UTC lead (session 108deea8): review for run:triggers-amend2: acting — The brief has the aggregator apply this rule from a calibration file: a type above 5 % gets its rise label reported as uncalibrated; tested synthetically.
- 2026-10-31 00:37 UTC lead (session 108deea8): reviewed D217@f3ffeba5c8bc; D217: the rule is built in read() (rate above 0.05 → uncalibrated text, class unchanged) and checked by the lead; it applies at the read, after the 100-seed calibration. Still open
- 2026-10-31 00:37 UTC lead (session 108deea8): review for run:triggers-cal-full: acting — This calibration produces the rates P100's rule reads; the rule is applied by the aggregator, a later step.
- 2026-10-31 00:41 UTC lead (session 108deea8): review for run:triggers-quorum: not-applicable — Synthetic data only; no real-data value is computed or read in the quorum check.
- 2026-10-31 00:42 UTC lead (session 108deea8): review for commit:item1b-design-20261031: not-applicable — No item 1(b) result is committed: nothing has been read on real data; the aggregator is held (D219).
- 2026-10-31 00:58 UTC lead (session 108deea8): review for run:triggers-amend2: acting — Re-read D212 after its dated correction (D220): it only renames amendment 2's pooled-variance formula as its square root, the pooled SD both implementations compute; it changes nothing this action did or its disposition rests on.
- 2026-10-31 00:59 UTC lead (session 108deea8): review for run:triggers-cal-full: acting — Re-read D212 after its dated correction (D220): it only renames amendment 2's pooled-variance formula as its square root, the pooled SD both implementations compute; it changes nothing this action did or its disposition rests on.
- 2026-10-31 01:00 UTC lead (session 108deea8): review for run:triggers-read: acting — The aggregator reads the 100-seed calibration and reports a type's rise label as uncalibrated if its rate is above 0.05.
- 2026-10-31 01:11 UTC lead (session 108deea8): set state=not-triggered; set resolved_by=D221; added D221 to links — D221: null false-positive rates 0.04 and 0.02, not above 5 %, so neither rise label was reported uncalibrated
