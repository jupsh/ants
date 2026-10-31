---
id: P98
title: "Item 1(b): observational associations; not an explanation of the 10-min D_w shortfall"
wording: >-
  These are observational associations; shared drivers and reverse causation remain possible. This
  analysis does … not establish whether either event type explains the 10-minute D_w shortfall.
made: D213
state: fulfilled
nodes: [T035]
resolved_by: D221
links: [D221]
reviews:
  - action: run:triggers-build-smoke
    disposition: not-applicable
    because: Governs the reading's interpretation; the build and smoke make none.
    by: lead (session 108deea8)
    at: "2026-10-30 22:42 UTC"
  - action: run:triggers-amend2
    disposition: not-applicable
    because: >-
      The build, synthetic checks and smoke rerun read and report no result (counts, self-check,
      time and memory only).
    by: lead (session 108deea8)
    at: "2026-10-31 00:20 UTC"
  - action: run:triggers-cal-full
    disposition: not-applicable
    because: >-
      These runs write files only; nothing is read or reported until the aggregator, which is a
      separate step.
    by: lead (session 108deea8)
    at: "2026-10-31 00:37 UTC"
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
  - action: run:triggers-read
    disposition: acting
    because: >-
      The reading states these are observational associations, shared drivers and reverse causation
      remain possible, and the 10-min shortfall question is untested.
    by: lead (session 108deea8)
    at: "2026-10-31 01:00 UTC"
    inputs:
      - record: D213
        rev: 3e24af2a43b97b483f93952dc62b2ed6e838224efa81e3d21b6130fa596738e4
---

## History
- 2026-10-30 22:41 UTC lead (session 108deea8): created — recorded from D213 (Q25 answer)
- 2026-10-30 22:42 UTC lead (session 108deea8): review for run:triggers-build-smoke: not-applicable — Governs the reading's interpretation; the build and smoke make none.
- 2026-10-31 00:20 UTC lead (session 108deea8): review for run:triggers-amend2: not-applicable — The build, synthetic checks and smoke rerun read and report no result (counts, self-check, time and memory only).
- 2026-10-31 00:37 UTC lead (session 108deea8): review for run:triggers-cal-full: not-applicable — These runs write files only; nothing is read or reported until the aggregator, which is a separate step.
- 2026-10-31 00:41 UTC lead (session 108deea8): review for run:triggers-quorum: not-applicable — Synthetic data only; no real-data value is computed or read in the quorum check.
- 2026-10-31 00:42 UTC lead (session 108deea8): review for commit:item1b-design-20261031: not-applicable — No item 1(b) result is committed: nothing has been read on real data; the aggregator is held (D219).
- 2026-10-31 01:00 UTC lead (session 108deea8): review for run:triggers-read: acting — The reading states these are observational associations, shared drivers and reverse causation remain possible, and the 10-min shortfall question is untested.
- 2026-10-31 01:11 UTC lead (session 108deea8): set state=fulfilled; set resolved_by=D221; added D221 to links — D221 states the associations are observational, shared drivers and reverse causation possible, and the 10-min shortfall untested
