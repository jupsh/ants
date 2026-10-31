---
id: P87
title: New simulations or experiments only through a separate design
wording: consider new simulations or experiments through a separate design.
made: D206
state: open
nodes: [T033]
reviews:
  - action: run:partdblocks
    disposition: satisfied
    because: >-
      D207 simulates nothing and uses no new experiment: it reads existing data and stored runs; new
      simulations stay for a separate design
    by: lead (session 20261030)
    at: "2026-10-30 21:10 UTC"
    inputs:
      - record: D206
        rev: 8ad2b7661f036244004826f9b7ed2ef18e0ddcd7c95e6df491464b3dba219a02
      - record: D207
        rev: 8f6f241d26d437df775bce00a27ef04f216e12facb2569dc025e87ee3c8f9396
  - action: run:partdblocks-2
    disposition: satisfied
    because: simulates nothing and uses no new experiment; existing data and stored runs only
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
    disposition: satisfied
    because: simulates nothing; existing data and stored runs only
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
    disposition: satisfied
    because: simulates nothing; existing data and stored runs only
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
    at: "2026-10-30 21:46 UTC"
    inputs:
      - record: D207
        rev: 72fe3a177216140b402fbd9675c64f8d4de2d198d87f23f2a0855df7473103ed
  - action: run:partdblocks-2
    disposition: not-applicable
    because: >-
      re-read after D207 amendment 3: this run's output failed P88's self-check and was set aside
      unread; superseded by run:partdblocks-4
    by: lead (session 20261030)
    at: "2026-10-30 21:46 UTC"
    inputs:
      - record: D207
        rev: 72fe3a177216140b402fbd9675c64f8d4de2d198d87f23f2a0855df7473103ed
  - action: run:partdblocks-3
    disposition: not-applicable
    because: >-
      re-read after D207 amendment 3: this run stopped on the block guard with no output; nothing
      was read; superseded by run:partdblocks-4
    by: lead (session 20261030)
    at: "2026-10-30 21:46 UTC"
    inputs:
      - record: D207
        rev: 72fe3a177216140b402fbd9675c64f8d4de2d198d87f23f2a0855df7473103ed
  - action: commit:partd-1a-20261030
    disposition: satisfied
    because: >-
      The commit holds no new simulation or experiment; D210's Next leaves new runs to their own
      design (P87).
    by: lead (session 108deea8)
    at: "2026-10-30 22:07 UTC"
    inputs:
      - record: D210
        rev: 91511fa8dac08a97ba28db172b6f39be91fe08489cd10a28a46148d17f90fbc0
  - action: run:triggers-build-smoke
    disposition: satisfied
    because: >-
      No new simulation or experiment: existing recorded tracks only, under its own design (D212
      amendment 1, approved D213).
    by: lead (session 108deea8)
    at: "2026-10-30 22:42 UTC"
    inputs:
      - record: D212
        rev: 008d3119e4993d16aae91123639b90f30b48c911514abbd6f3b7009c330cb5ad
      - record: D213
        rev: 3e24af2a43b97b483f93952dc62b2ed6e838224efa81e3d21b6130fa596738e4
  - action: run:triggers-build-smoke
    disposition: satisfied
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
    disposition: satisfied
    because: "No new simulation or experiment: synthetic checks and recorded tracks under D212 amendment 2 (D216)."
    by: lead (session 108deea8)
    at: "2026-10-31 00:20 UTC"
    inputs:
      - record: D212
        rev: 61cade10f360d1e4bf470b5ecacca53a1449f03a63c3457c647826f9250fba5e
      - record: D216
        rev: 2bfa57b89d06c19abfe5f6e4d95516771eafa89f131df7c30be6b53258ff0364
  - action: run:triggers-cal-full
    disposition: satisfied
    because: >-
      No new simulation or experiment: synthetic calibration and recorded tracks, under D212
      amendments 1-2 (D213, D216).
    by: lead (session 108deea8)
    at: "2026-10-31 00:37 UTC"
    inputs:
      - record: D212
        rev: 61cade10f360d1e4bf470b5ecacca53a1449f03a63c3457c647826f9250fba5e
      - record: D216
        rev: 2bfa57b89d06c19abfe5f6e4d95516771eafa89f131df7c30be6b53258ff0364
  - action: run:triggers-quorum
    disposition: satisfied
    because: No new simulation or experiment; synthetic test inputs under D219's design.
    by: lead (session 108deea8)
    at: "2026-10-31 00:41 UTC"
    inputs:
      - record: D219
        rev: f40d4621554b1c43d95ada49998f2767223f5eb1b71a041a9ec9d77322841df8
  - action: commit:item1b-design-20261031
    disposition: satisfied
    because: D212 and D219 are separate designs; no new simulation or experiment in the committed records.
    by: lead (session 108deea8)
    at: "2026-10-31 00:42 UTC"
    inputs:
      - record: D212
        rev: 61cade10f360d1e4bf470b5ecacca53a1449f03a63c3457c647826f9250fba5e
      - record: D219
        rev: f40d4621554b1c43d95ada49998f2767223f5eb1b71a041a9ec9d77322841df8
---

## History
- 2026-10-30 21:06 UTC lead (session 20261030): created — D206 closing line
- 2026-10-30 21:10 UTC lead (session 20261030): review for run:partdblocks: satisfied — D207 simulates nothing and uses no new experiment: it reads existing data and stored runs; new simulations stay for a separate design
- 2026-10-30 21:22 UTC lead (session 20261030): review for run:partdblocks-2: satisfied — simulates nothing and uses no new experiment; existing data and stored runs only
- 2026-10-30 21:23 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207's amendment: this run crashed (the machine ran out of memory) before writing any output, and nothing was read; the work is rerun under run:partdblocks-2, disposed separately
- 2026-10-30 21:33 UTC lead (session 20261030): review for run:partdblocks-3: satisfied — simulates nothing; existing data and stored runs only
- 2026-10-30 21:34 UTC lead (session 20261030): review for run:partdblocks-2: not-applicable — re-read after D207 amendment 2: this run's output failed P88's self-check and was set aside unread (blocks-selfcheck-failed-c91854ee.json); the work is rerun under run:partdblocks-3, disposed separately
- 2026-10-30 21:34 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207 amendment 2: this first run crashed on memory before writing any output and nothing was read; superseded by run:partdblocks-2 (self-check failed, set aside) and run:partdblocks-3
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks-4: satisfied — simulates nothing; existing data and stored runs only
- 2026-10-30 21:46 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207 amendment 3: this first run crashed on memory before writing any output and nothing was read; superseded by run:partdblocks-4
- 2026-10-30 21:46 UTC lead (session 20261030): review for run:partdblocks-2: not-applicable — re-read after D207 amendment 3: this run's output failed P88's self-check and was set aside unread; superseded by run:partdblocks-4
- 2026-10-30 21:46 UTC lead (session 20261030): review for run:partdblocks-3: not-applicable — re-read after D207 amendment 3: this run stopped on the block guard with no output; nothing was read; superseded by run:partdblocks-4
- 2026-10-30 21:57 UTC lead (session 20261030): reviewed D210: it simulated nothing; its Next leaves new simulations or experiments to their own design; stays open
- 2026-10-30 22:07 UTC lead (session 108deea8): review for commit:partd-1a-20261030: satisfied — The commit holds no new simulation or experiment; D210's Next leaves new runs to their own design (P87).
- 2026-10-30 22:14 UTC lead (session 108deea8): reviewed D211@c8f5e94149d3; D211: 1(b) uses existing development data and needs no new simulation; 1(d) and 1(e) stay separate designs. Respected, still open
- 2026-10-30 22:42 UTC lead (session 108deea8): review for run:triggers-build-smoke: satisfied — No new simulation or experiment: existing recorded tracks only, under its own design (D212 amendment 1, approved D213).
- 2026-10-31 00:20 UTC lead (session 108deea8): review for run:triggers-build-smoke: satisfied — Re-read D212 after amendment 2: the amendment was written after this step finished, from its report (D215); it changes nothing the build or smoke did. The step is complete.
- 2026-10-31 00:20 UTC lead (session 108deea8): review for run:triggers-amend2: satisfied — No new simulation or experiment: synthetic checks and recorded tracks under D212 amendment 2 (D216).
- 2026-10-31 00:37 UTC lead (session 108deea8): review for run:triggers-cal-full: satisfied — No new simulation or experiment: synthetic calibration and recorded tracks, under D212 amendments 1-2 (D213, D216).
- 2026-10-31 00:41 UTC lead (session 108deea8): review for run:triggers-quorum: satisfied — No new simulation or experiment; synthetic test inputs under D219's design.
- 2026-10-31 00:42 UTC lead (session 108deea8): review for commit:item1b-design-20261031: satisfied — D212 and D219 are separate designs; no new simulation or experiment in the committed records.
