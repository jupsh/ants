---
id: P92
title: "Item 1(b): self-check before any output is read"
wording: self-check before reading any output
made: D212
state: open
nodes: [T035]
reviews:
  - action: run:triggers-build-smoke
    disposition: acting
    because: >-
      The brief requires the ActivitySeries self-check computed and reported first; the smoke
      reports it and no event-aligned value.
    by: lead (session 108deea8)
    at: "2026-10-30 22:42 UTC"
    inputs:
      - record: D212
        rev: 008d3119e4993d16aae91123639b90f30b48c911514abbd6f3b7009c330cb5ad
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
    because: The self-check stays first and unchanged; the smoke rerun reports it.
    by: lead (session 108deea8)
    at: "2026-10-31 00:20 UTC"
    inputs:
      - record: D212
        rev: 61cade10f360d1e4bf470b5ecacca53a1449f03a63c3457c647826f9250fba5e
  - action: run:triggers-cal-full
    disposition: acting
    because: >-
      The per-colony script prints the self-check first; the aggregator refuses unless every
      self-check passed, before computing anything (D217).
    by: lead (session 108deea8)
    at: "2026-10-31 00:37 UTC"
    inputs:
      - record: D217
        rev: f3ffeba5c8bc259848581692d44061573acc5ce578f40f35490b2d488913caa9
  - action: run:triggers-quorum
    disposition: not-applicable
    because: No real-data output is read in this step.
    by: lead (session 108deea8)
    at: "2026-10-31 00:41 UTC"
  - action: commit:item1b-design-20261031
    disposition: not-applicable
    because: >-
      The scripts are local scratch and not committed; the committed records describe them (D215,
      D217) and the rule stays in force for the read.
    by: lead (session 108deea8)
    at: "2026-10-31 00:42 UTC"
---

## History
- 2026-10-30 22:41 UTC lead (session 108deea8): created — recorded from D212 (Q25 answer and D212 amendment 1)
- 2026-10-30 22:42 UTC lead (session 108deea8): review for run:triggers-build-smoke: acting — The brief requires the ActivitySeries self-check computed and reported first; the smoke reports it and no event-aligned value.
- 2026-10-31 00:20 UTC lead (session 108deea8): review for run:triggers-build-smoke: acting — Re-read D212 after amendment 2: the amendment was written after this step finished, from its report (D215); it changes nothing the build or smoke did. The step is complete.
- 2026-10-31 00:20 UTC lead (session 108deea8): reviewed D214@9ef0bbb80afb, D215@27cb81684aec, D216@2bfa57b89d06; D215: the self-check is computed first and checked by the aggregator; D214 and D216 do not touch it. Still open for the full run
- 2026-10-31 00:20 UTC lead (session 108deea8): review for run:triggers-amend2: acting — The self-check stays first and unchanged; the smoke rerun reports it.
- 2026-10-31 00:37 UTC lead (session 108deea8): review for run:triggers-cal-full: acting — The per-colony script prints the self-check first; the aggregator refuses unless every self-check passed, before computing anything (D217).
- 2026-10-31 00:41 UTC lead (session 108deea8): review for run:triggers-quorum: not-applicable — No real-data output is read in this step.
- 2026-10-31 00:42 UTC lead (session 108deea8): review for commit:item1b-design-20261031: not-applicable — The scripts are local scratch and not committed; the committed records describe them (D215, D217) and the rule stays in force for the read.
