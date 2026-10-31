---
id: P90
title: "Item 1(b): alternative windows and thresholds descriptive"
wording: Keep the proposed alternative windows and thresholds descriptive
made: D213
state: fulfilled
nodes: [T035]
resolved_by: D221
links: [D221]
reviews:
  - action: run:triggers-build-smoke
    disposition: acting
    because: The brief requires the alternative windows and thresholds output as descriptive rows with no class.
    by: lead (session 108deea8)
    at: "2026-10-30 22:42 UTC"
    inputs:
      - record: D212
        rev: 008d3119e4993d16aae91123639b90f30b48c911514abbd6f3b7009c330cb5ad
      - record: D213
        rev: 3e24af2a43b97b483f93952dc62b2ed6e838224efa81e3d21b6130fa596738e4
  - action: run:triggers-build-smoke
    disposition: acting
    because: >-
      Re-read D212 after amendment 2: the amendment was written after this step finished, from its
      report (D215); it changes nothing the build or smoke did. The step is complete.
    by: lead (session 108deea8)
    at: "2026-10-31 00:20 UTC"
    inputs:
      - record: D212
        rev: 61cade10f360d1e4bf470b5ecacca53a1449f03a63c3457c647826f9250fba5e
      - record: D215
        rev: 27cb81684aecf8d23a36f46f20d76eecaa7fa2aa98f9b3047e10604d5feb37de
  - action: run:triggers-amend2
    disposition: acting
    because: The new 5-min control row is descriptive (no class), as amendment 2 states.
    by: lead (session 108deea8)
    at: "2026-10-31 00:20 UTC"
    inputs:
      - record: D212
        rev: 61cade10f360d1e4bf470b5ecacca53a1449f03a63c3457c647826f9250fba5e
      - record: D216
        rev: 2bfa57b89d06c19abfe5f6e4d95516771eafa89f131df7c30be6b53258ff0364
  - action: run:triggers-cal-full
    disposition: acting
    because: The descriptive rows are written without class (D217); nothing is read in this step.
    by: lead (session 108deea8)
    at: "2026-10-31 00:37 UTC"
    inputs:
      - record: D217
        rev: f3ffeba5c8bc259848581692d44061573acc5ce578f40f35490b2d488913caa9
  - action: run:triggers-quorum
    disposition: acting
    because: >-
      The second implementation is built from D212's text, which carries this rule; the comparison
      tests that both implement it alike.
    by: lead (session 108deea8)
    at: "2026-10-31 00:41 UTC"
    inputs:
      - record: D212
        rev: 61cade10f360d1e4bf470b5ecacca53a1449f03a63c3457c647826f9250fba5e
      - record: D219
        rev: f40d4621554b1c43d95ada49998f2767223f5eb1b71a041a9ec9d77322841df8
  - action: commit:item1b-design-20261031
    disposition: not-applicable
    because: >-
      The scripts are local scratch and not committed; the committed records describe them (D215,
      D217) and the rule stays in force for the read.
    by: lead (session 108deea8)
    at: "2026-10-31 00:42 UTC"
  - action: run:triggers-amend2
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
  - action: run:triggers-build-smoke
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
  - action: run:triggers-quorum
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
    because: Only the forager and queen primary rows carry a class; the other rows are reported descriptively.
    by: lead (session 108deea8)
    at: "2026-10-31 01:00 UTC"
    inputs:
      - record: D212
        rev: c08d81a72ffe2039af178f50cd473fc20e63edae34c1faff63547e4892286a8f
      - record: D213
        rev: 3e24af2a43b97b483f93952dc62b2ed6e838224efa81e3d21b6130fa596738e4
---

## History
- 2026-10-30 22:41 UTC lead (session 108deea8): created — recorded from D213 (Q25 answer and D212 amendment 1)
- 2026-10-30 22:42 UTC lead (session 108deea8): review for run:triggers-build-smoke: acting — The brief requires the alternative windows and thresholds output as descriptive rows with no class.
- 2026-10-31 00:20 UTC lead (session 108deea8): review for run:triggers-build-smoke: acting — Re-read D212 after amendment 2: the amendment was written after this step finished, from its report (D215); it changes nothing the build or smoke did. The step is complete.
- 2026-10-31 00:20 UTC lead (session 108deea8): review for run:triggers-amend2: acting — The new 5-min control row is descriptive (no class), as amendment 2 states.
- 2026-10-31 00:37 UTC lead (session 108deea8): review for run:triggers-cal-full: acting — The descriptive rows are written without class (D217); nothing is read in this step.
- 2026-10-31 00:41 UTC lead (session 108deea8): review for run:triggers-quorum: acting — The second implementation is built from D212's text, which carries this rule; the comparison tests that both implement it alike.
- 2026-10-31 00:42 UTC lead (session 108deea8): review for commit:item1b-design-20261031: not-applicable — The scripts are local scratch and not committed; the committed records describe them (D215, D217) and the rule stays in force for the read.
- 2026-10-31 00:59 UTC lead (session 108deea8): review for run:triggers-amend2: acting — Re-read D212 after its dated correction (D220): it only renames amendment 2's pooled-variance formula as its square root, the pooled SD both implementations compute; it changes nothing this action did or its disposition rests on.
- 2026-10-31 00:59 UTC lead (session 108deea8): review for run:triggers-build-smoke: acting — Re-read D212 after its dated correction (D220): it only renames amendment 2's pooled-variance formula as its square root, the pooled SD both implementations compute; it changes nothing this action did or its disposition rests on.
- 2026-10-31 00:59 UTC lead (session 108deea8): review for run:triggers-quorum: acting — Re-read D212 after its dated correction (D220): it only renames amendment 2's pooled-variance formula as its square root, the pooled SD both implementations compute; it changes nothing this action did or its disposition rests on.
- 2026-10-31 01:00 UTC lead (session 108deea8): review for run:triggers-read: acting — Only the forager and queen primary rows carry a class; the other rows are reported descriptively.
- 2026-10-31 01:11 UTC lead (session 108deea8): set state=fulfilled; set resolved_by=D221; added D221 to links — D221 reports the alternative windows and thresholds as descriptive rows with no class
