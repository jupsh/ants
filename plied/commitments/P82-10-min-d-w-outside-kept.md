---
id: P82
title: "10-min D_w: outside kept apart from unresolved"
wording: >-
  Preserve the distinction between rows … judged outside and unresolved: every arm's point estimate
  is low, but not every arm is statistically … outside.
made: D206
state: open
nodes: [T033]
reviews:
  - action: run:partdblocks
    disposition: satisfied
    because: >-
      D207 copies Stage 2b's outside / unresolved classes unchanged and rules that a per-block
      difference is not a class
    by: lead (session 20261030)
    at: "2026-10-30 21:10 UTC"
    inputs:
      - record: D206
        rev: 8ad2b7661f036244004826f9b7ed2ef18e0ddcd7c95e6df491464b3dba219a02
      - record: D207
        rev: 8f6f241d26d437df775bce00a27ef04f216e12facb2569dc025e87ee3c8f9396
  - action: run:partdblocks-2
    disposition: satisfied
    because: >-
      D207 copies Stage 2b's outside / unresolved classes unchanged; a per-block difference is not a
      class (unchanged by the amendment)
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
    because: Stage 2b's outside / unresolved classes copied unchanged; a per-block difference is not a class
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
    at: "2026-10-30 21:33 UTC"
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
    because: Stage 2b's outside / unresolved classes copied unchanged; a per-block difference is not a class
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
    because: >-
      D210 lists unresolved arms (T20m, Eu-M, Eu, Es) apart from lower ones per block and copies
      Stage 2b's outside/unresolved classes beside; F108 says the same.
    by: lead (session 108deea8)
    at: "2026-10-30 22:07 UTC"
    inputs:
      - record: D210
        rev: 91511fa8dac08a97ba28db172b6f39be91fe08489cd10a28a46148d17f90fbc0
      - record: F108
        rev: b5dd9256e4fcbd988a503e004eee2b99e8600a92e4ac65c7cc146a5846b04d57
  - action: run:triggers-build-smoke
    disposition: not-applicable
    because: No D_w classification in the build or smoke.
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
  - action: run:triggers-read
    disposition: not-applicable
    because: No 10-min D_w row is classified in this read.
    by: lead (session 108deea8)
    at: "2026-10-31 01:00 UTC"
  - action: run:foragers1c-build-smoke
    disposition: satisfied
    because: the brief copies Stage 2b's classes from read.json unchanged; no row is reclassified
    by: lead (session 6b5fb317)
    at: "2026-10-31 02:33 UTC"
    inputs:
      - record: D223
        rev: d91126ff338bb2e03861036626ef624304f4379bd9e707f9ad215faa8f1de646
      - record: D224
        rev: 40e58b5e95b78564c1257ba08746a92d3e52144e55d9f211b0ca5e809910b360
  - action: run:foragers1c-data
    disposition: not-applicable
    because: the recorder copies or reads no Stage 2b class
    by: lead (session 6b5fb317)
    at: "2026-10-31 02:57 UTC"
    inputs:
      - record: D223
        rev: d91126ff338bb2e03861036626ef624304f4379bd9e707f9ad215faa8f1de646
      - record: D224
        rev: 40e58b5e95b78564c1257ba08746a92d3e52144e55d9f211b0ca5e809910b360
      - record: D225
        rev: 75b5077cef0329318950747616b3444f23f232161a33bb8e2b5fd3dc79f3ca27
  - action: run:foragers1c-read
    disposition: satisfied
    because: the analysis copies Stage 2b classes from read.json unchanged (D225)
    by: lead (session 6b5fb317)
    at: "2026-10-31 02:57 UTC"
    inputs:
      - record: D223
        rev: d91126ff338bb2e03861036626ef624304f4379bd9e707f9ad215faa8f1de646
      - record: D224
        rev: 40e58b5e95b78564c1257ba08746a92d3e52144e55d9f211b0ca5e809910b360
      - record: D225
        rev: 75b5077cef0329318950747616b3444f23f232161a33bb8e2b5fd3dc79f3ca27
  - action: run:foragers1c-second
    disposition: not-applicable
    because: no Stage 2b class is used or changed
    by: lead (session 6b5fb317)
    at: "2026-10-31 03:23 UTC"
    inputs:
      - record: D226
        rev: 056c295f9e6f53d9e245e750bdac2d11fe65d2f7b6b655afdf7e330d7e43b714
      - record: D227
        rev: 9164b9580a47b25b5ccdcf1db0487c714c0f94bbad35e19763e200514d2db2b1
  - action: run:foragers1c-second
    disposition: not-applicable
    because: >-
      re-read D226 after its change: the change appends D228's result only (the independent check
      agrees); the check was a reproduction on existing records, so this commitment still does not
      bear on it
    by: lead (session 6b5fb317)
    at: "2026-10-31 03:34 UTC"
    inputs:
      - record: D226
        rev: 0772038601c49958aa6d4ffa11e0232dbc95648dd8485abef48c8abfc270d480
      - record: D227
        rev: 9164b9580a47b25b5ccdcf1db0487c714c0f94bbad35e19763e200514d2db2b1
      - record: D228
        rev: e6f75b99836a72362b3c3186da6f861d048daec16ba326fd504555151c889b23
  - action: commit:partd-1b1c-20261031
    disposition: satisfied
    because: >-
      D226 copies Stage 2b's outside/unresolved classes unchanged and says its intervals reclassify
      nothing
    by: lead (session 6b5fb317)
    at: "2026-10-31 03:35 UTC"
    inputs:
      - record: D221
        rev: 2c4c00f83034f74f98234e2e799f1efc5b082fc738fb53e0883c666d6a11adbc
      - record: D226
        rev: 0772038601c49958aa6d4ffa11e0232dbc95648dd8485abef48c8abfc270d480
      - record: D228
        rev: e6f75b99836a72362b3c3186da6f861d048daec16ba326fd504555151c889b23
  - action: commit:partd-1a-20261030
    disposition: satisfied
    because: >-
      Re-read F108@1f7135c39159: since the b5dd9256 bytes this review read (committed in 1e5f59e),
      one dated update was added (D240: lights-on is 06 UTC for every colony; time of day and time
      since lights-on cannot be separated). It leaves 'does not establish a 10-min oscillator' and
      the time-of-day reading this disposition rests on unchanged, and the commit holds the version
      read, so the disposition stands.
    by: lead (session 0e89af04)
    at: "2026-11-02 05:56 UTC"
    inputs:
      - record: F108
        rev: 1f7135c3915940ea485b428dd86f547f6ee415c339d28a917c97c6f2b126bdf7
  - action: merge:browser-sim-m1@f8d29d5
    disposition: not-triggered
    because: >-
      A local fast-forward of main (8bc7789) to browser-sim-m1 (f8d29d5): it adds no content beyond
      the 18 commits already on the branch, each of them gated when made
      (commit:synchrony-review-20261101 ... commit:b016-records-20261103), where the content this
      commitment governs was reviewed. Nothing is pushed or published by this step. No freeze, model
      change, run, held-out use or new reading is in it.
    by: lead (session e38b977a)
    at: "2026-11-03 16:41 UTC"
---

## History
- 2026-10-30 21:05 UTC lead (session 20261030): created — D206 item 1: reporting rule for the shortfall
- 2026-10-30 21:10 UTC lead (session 20261030): review for run:partdblocks: satisfied — D207 copies Stage 2b's outside / unresolved classes unchanged and rules that a per-block difference is not a class
- 2026-10-30 21:22 UTC lead (session 20261030): review for run:partdblocks-2: satisfied — D207 copies Stage 2b's outside / unresolved classes unchanged; a per-block difference is not a class (unchanged by the amendment)
- 2026-10-30 21:23 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207's amendment: this run crashed (the machine ran out of memory) before writing any output, and nothing was read; the work is rerun under run:partdblocks-2, disposed separately
- 2026-10-30 21:33 UTC lead (session 20261030): review for run:partdblocks-3: satisfied — Stage 2b's outside / unresolved classes copied unchanged; a per-block difference is not a class
- 2026-10-30 21:33 UTC lead (session 20261030): review for run:partdblocks-2: not-applicable — re-read after D207 amendment 2: this run's output failed P88's self-check and was set aside unread (blocks-selfcheck-failed-c91854ee.json); the work is rerun under run:partdblocks-3, disposed separately
- 2026-10-30 21:34 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207 amendment 2: this first run crashed on memory before writing any output and nothing was read; superseded by run:partdblocks-2 (self-check failed, set aside) and run:partdblocks-3
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks-4: satisfied — Stage 2b's outside / unresolved classes copied unchanged; a per-block difference is not a class
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207 amendment 3: this first run crashed on memory before writing any output and nothing was read; superseded by run:partdblocks-4
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks-2: not-applicable — re-read after D207 amendment 3: this run's output failed P88's self-check and was set aside unread; superseded by run:partdblocks-4
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks-3: not-applicable — re-read after D207 amendment 3: this run stopped on the block guard with no output; nothing was read; superseded by run:partdblocks-4
- 2026-10-30 21:57 UTC lead (session 20261030): reviewed D210: Stage 2b's classes are copied beside unchanged and per-block differences are reported as differences, not classes; applied here, stays open
- 2026-10-30 22:07 UTC lead (session 108deea8): review for commit:partd-1a-20261030: satisfied — D210 lists unresolved arms (T20m, Eu-M, Eu, Es) apart from lower ones per block and copies Stage 2b's outside/unresolved classes beside; F108 says the same.
- 2026-10-30 22:14 UTC lead (session 108deea8): reviewed D211@c8f5e94149d3; D211 cites D206 only for ordering; no outside/unresolved classification is made, so unaffected
- 2026-10-30 22:42 UTC lead (session 108deea8): review for run:triggers-build-smoke: not-applicable — No D_w classification in the build or smoke.
- 2026-10-31 00:20 UTC lead (session 108deea8): review for run:triggers-amend2: not-applicable — The build, synthetic checks and smoke rerun read and report no result (counts, self-check, time and memory only).
- 2026-10-31 00:37 UTC lead (session 108deea8): review for run:triggers-cal-full: not-applicable — These runs write files only; nothing is read or reported until the aggregator, which is a separate step.
- 2026-10-31 00:41 UTC lead (session 108deea8): review for run:triggers-quorum: not-applicable — Synthetic data only; no real-data value is computed or read in the quorum check.
- 2026-10-31 00:42 UTC lead (session 108deea8): review for commit:item1b-design-20261031: not-applicable — No D_w, density, direct-sensing or ordering claim is made in D211-D219 beyond D211's choice, which states the order is a practical proposal.
- 2026-10-31 01:00 UTC lead (session 108deea8): review for run:triggers-read: not-applicable — No 10-min D_w row is classified in this read.
- 2026-10-31 02:18 UTC lead (session 6b5fb317): reviewed D222@1bbe791636e9, D223@b738f2de5839; D222 repeats it in the user's words for item 1(c); D223 copies Stage 2b's classes beside unchanged and rules that no row here reclassifies one. Open; applies to T012 through uses T033
- 2026-10-31 02:32 UTC lead (session 6b5fb317): reviewed D223@d91126ff338b; D223 amendment 1 and D224 keep Stage 2b's classes as designed ('Preserve the existing Stage 2b classes'); nothing reclassifies. Open
- 2026-10-31 02:32 UTC lead (session 6b5fb317): reviewed D224@40e58b5e95b7; D224 cites P82 when keeping Stage 2b's classes as designed; nothing in item 1(c) reclassifies a row. Open
- 2026-10-31 02:33 UTC lead (session 6b5fb317): review for run:foragers1c-build-smoke: satisfied — the brief copies Stage 2b's classes from read.json unchanged; no row is reclassified
- 2026-10-31 02:57 UTC lead (session 6b5fb317): review for run:foragers1c-data: not-applicable — the recorder copies or reads no Stage 2b class
- 2026-10-31 02:57 UTC lead (session 6b5fb317): review for run:foragers1c-read: satisfied — the analysis copies Stage 2b classes from read.json unchanged (D225)
- 2026-10-31 03:09 UTC lead (session 6b5fb317): reviewed D226@9b60eeb57b4b; D226 keeps Stage 2b's classes unchanged (foragers: T20m, Eu unresolved; all ants: T20m, Eu-M, Eu unresolved) and says its descriptive intervals reclassify nothing. Open
- 2026-10-31 03:23 UTC lead (session 6b5fb317): review for run:foragers1c-second: not-applicable — no Stage 2b class is used or changed
- 2026-10-31 03:34 UTC lead (session 6b5fb317): review for run:foragers1c-second: not-applicable — re-read D226 after its change: the change appends D228's result only (the independent check agrees); the check was a reproduction on existing records, so this commitment still does not bear on it
- 2026-10-31 03:35 UTC lead (session 6b5fb317): review for commit:partd-1b1c-20261031: satisfied — D226 copies Stage 2b's outside/unresolved classes unchanged and says its intervals reclassify nothing
- 2026-11-02 05:56 UTC lead (session 0e89af04): review for commit:partd-1a-20261030: satisfied — Re-read F108@1f7135c39159: since the b5dd9256 bytes this review read (committed in 1e5f59e), one dated update was added (D240: lights-on is 06 UTC for every colony; time of day and time since lights-on cannot be separated). It leaves 'does not establish a 10-min oscillator' and the time-of-day reading this disposition rests on unchanged, and the commit holds the version read, so the disposition stands.
- 2026-11-03 16:41 UTC lead (session e38b977a): review for merge:browser-sim-m1@f8d29d5: not-triggered — A local fast-forward of main (8bc7789) to browser-sim-m1 (f8d29d5): it adds no content beyond the 18 commits already on the branch, each of them gated when made (commit:synchrony-review-20261101 ... commit:b016-records-20261103), where the content this commitment governs was reviewed. Nothing is pushed or published by this step. No freeze, model change, run, held-out use or new reading is in it.
