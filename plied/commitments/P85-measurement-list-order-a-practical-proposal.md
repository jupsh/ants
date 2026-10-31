---
id: P85
title: Measurement-list order a practical proposal, not demonstrated superiority
wording: Retain the order as a practical proposal, rather than demonstrated superiority.
made: D206
state: open
nodes: [T033]
reviews:
  - action: run:partdblocks
    disposition: not-applicable
    because: D207 runs the item the user chose first (D206); it re-ranks nothing
    by: lead (session 20261030)
    at: "2026-10-30 21:10 UTC"
    inputs:
      - record: D206
        rev: 8ad2b7661f036244004826f9b7ed2ef18e0ddcd7c95e6df491464b3dba219a02
      - record: D207
        rev: 8f6f241d26d437df775bce00a27ef04f216e12facb2569dc025e87ee3c8f9396
  - action: run:partdblocks-2
    disposition: not-applicable
    because: runs the item the user chose first (D206); re-ranks nothing
    by: lead (session 20261030)
    at: "2026-10-30 21:22 UTC"
    inputs:
      - record: D206
        rev: 8ad2b7661f036244004826f9b7ed2ef18e0ddcd7c95e6df491464b3dba219a02
      - record: D207
        rev: 9a55da1c62b45147ecc27069e9c2373aa6a0813e34155338fc0296b3db5c4202
  - action: run:partdblocks
    disposition: not-applicable
    because: >-
      re-read after D207's amendment: this run crashed (the machine ran out of memory) before
      writing any output, and nothing was read; the work is rerun under run:partdblocks-2, disposed
      separately
    by: lead (session 20261030)
    at: "2026-10-30 21:23 UTC"
    inputs:
      - record: D207
        rev: 9a55da1c62b45147ecc27069e9c2373aa6a0813e34155338fc0296b3db5c4202
  - action: run:partdblocks-3
    disposition: not-applicable
    because: runs the item the user chose first (D206); re-ranks nothing
    by: lead (session 20261030)
    at: "2026-10-30 21:33 UTC"
    inputs:
      - record: D206
        rev: 8ad2b7661f036244004826f9b7ed2ef18e0ddcd7c95e6df491464b3dba219a02
      - record: D207
        rev: 8ba0cb4f72b4208a701139a480d5c5be0d67b3e8f9ff83864a421d081410fcfd
  - action: run:partdblocks-2
    disposition: not-applicable
    because: >-
      re-read after D207 amendment 2: this run's output failed P88's self-check and was set aside
      unread (blocks-selfcheck-failed-c91854ee.json); the work is rerun under run:partdblocks-3,
      disposed separately
    by: lead (session 20261030)
    at: "2026-10-30 21:34 UTC"
    inputs:
      - record: D207
        rev: 8ba0cb4f72b4208a701139a480d5c5be0d67b3e8f9ff83864a421d081410fcfd
  - action: run:partdblocks
    disposition: not-applicable
    because: >-
      re-read after D207 amendment 2: this first run crashed on memory before writing any output and
      nothing was read; superseded by run:partdblocks-2 (self-check failed, set aside) and
      run:partdblocks-3
    by: lead (session 20261030)
    at: "2026-10-30 21:34 UTC"
    inputs:
      - record: D207
        rev: 8ba0cb4f72b4208a701139a480d5c5be0d67b3e8f9ff83864a421d081410fcfd
  - action: run:partdblocks-4
    disposition: not-applicable
    because: runs the item the user chose first (D206); re-ranks nothing
    by: lead (session 20261030)
    at: "2026-10-30 21:45 UTC"
    inputs:
      - record: D206
        rev: 8ad2b7661f036244004826f9b7ed2ef18e0ddcd7c95e6df491464b3dba219a02
      - record: D207
        rev: 72fe3a177216140b402fbd9675c64f8d4de2d198d87f23f2a0855df7473103ed
  - action: run:partdblocks
    disposition: not-applicable
    because: >-
      re-read after D207 amendment 3: this first run crashed on memory before writing any output and
      nothing was read; superseded by run:partdblocks-4
    by: lead (session 20261030)
    at: "2026-10-30 21:45 UTC"
    inputs:
      - record: D207
        rev: 72fe3a177216140b402fbd9675c64f8d4de2d198d87f23f2a0855df7473103ed
  - action: run:partdblocks-2
    disposition: not-applicable
    because: >-
      re-read after D207 amendment 3: this run's output failed P88's self-check and was set aside
      unread; superseded by run:partdblocks-4
    by: lead (session 20261030)
    at: "2026-10-30 21:45 UTC"
    inputs:
      - record: D207
        rev: 72fe3a177216140b402fbd9675c64f8d4de2d198d87f23f2a0855df7473103ed
  - action: run:partdblocks-3
    disposition: not-applicable
    because: >-
      re-read after D207 amendment 3: this run stopped on the block guard with no output; nothing
      was read; superseded by run:partdblocks-4
    by: lead (session 20261030)
    at: "2026-10-30 21:45 UTC"
    inputs:
      - record: D207
        rev: 72fe3a177216140b402fbd9675c64f8d4de2d198d87f23f2a0855df7473103ed
  - action: commit:partd-1a-20261030
    disposition: satisfied
    because: "D205's Order line: 'a practical proposal, not a demonstrated superiority (D206)'."
    by: lead (session 108deea8)
    at: "2026-10-30 22:07 UTC"
    inputs:
      - record: D205
        rev: e990086aa7e8f8e7d3a154cc02d3eafe19786ee4ac0e809e3a29f1717a20ad88
  - action: run:triggers-build-smoke
    disposition: not-applicable
    because: No order claim made by a build.
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
    because: >-
      No D_w, density, direct-sensing or ordering claim is made in D211-D219 beyond D211's choice,
      which states the order is a practical proposal.
    by: lead (session 108deea8)
    at: "2026-10-31 00:42 UTC"
---

## History
- 2026-10-30 21:06 UTC lead (session 20261030): created — D206 item 3
- 2026-10-30 21:10 UTC lead (session 20261030): review for run:partdblocks: not-applicable — D207 runs the item the user chose first (D206); it re-ranks nothing
- 2026-10-30 21:22 UTC lead (session 20261030): review for run:partdblocks-2: not-applicable — runs the item the user chose first (D206); re-ranks nothing
- 2026-10-30 21:23 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207's amendment: this run crashed (the machine ran out of memory) before writing any output, and nothing was read; the work is rerun under run:partdblocks-2, disposed separately
- 2026-10-30 21:33 UTC lead (session 20261030): review for run:partdblocks-3: not-applicable — runs the item the user chose first (D206); re-ranks nothing
- 2026-10-30 21:34 UTC lead (session 20261030): review for run:partdblocks-2: not-applicable — re-read after D207 amendment 2: this run's output failed P88's self-check and was set aside unread (blocks-selfcheck-failed-c91854ee.json); the work is rerun under run:partdblocks-3, disposed separately
- 2026-10-30 21:34 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207 amendment 2: this first run crashed on memory before writing any output and nothing was read; superseded by run:partdblocks-2 (self-check failed, set aside) and run:partdblocks-3
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks-4: not-applicable — runs the item the user chose first (D206); re-ranks nothing
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207 amendment 3: this first run crashed on memory before writing any output and nothing was read; superseded by run:partdblocks-4
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks-2: not-applicable — re-read after D207 amendment 3: this run's output failed P88's self-check and was set aside unread; superseded by run:partdblocks-4
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks-3: not-applicable — re-read after D207 amendment 3: this run stopped on the block guard with no output; nothing was read; superseded by run:partdblocks-4
- 2026-10-30 22:07 UTC lead (session 108deea8): review for commit:partd-1a-20261030: satisfied — D205's Order line: 'a practical proposal, not a demonstrated superiority (D206)'.
- 2026-10-30 22:14 UTC lead (session 108deea8): reviewed D211@c8f5e94149d3; D211 relies on this: it takes 1(b) because it is next in D205's order, stating the order is a practical proposal, not a ranking by value. Unaffected
- 2026-10-30 22:42 UTC lead (session 108deea8): review for run:triggers-build-smoke: not-applicable — No order claim made by a build.
- 2026-10-31 00:20 UTC lead (session 108deea8): review for run:triggers-amend2: not-applicable — The build, synthetic checks and smoke rerun read and report no result (counts, self-check, time and memory only).
- 2026-10-31 00:37 UTC lead (session 108deea8): review for run:triggers-cal-full: not-applicable — These runs write files only; nothing is read or reported until the aggregator, which is a separate step.
- 2026-10-31 00:41 UTC lead (session 108deea8): review for run:triggers-quorum: not-applicable — Synthetic data only; no real-data value is computed or read in the quorum check.
- 2026-10-31 00:42 UTC lead (session 108deea8): review for commit:item1b-design-20261031: not-applicable — No D_w, density, direct-sensing or ordering claim is made in D211-D219 beyond D211's choice, which states the order is a practical proposal.
