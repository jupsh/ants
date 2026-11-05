---
id: P83
title: "A time-of-day pattern read narrowly: variation the members lack, not its cause"
wording: >-
  A time-of-day pattern would show variation the current members do not … represent. It would not
  distinguish an external driver from an internal rhythm, changing colony composition or … recording
  effects.
made: D206
state: open
nodes: [T033]
reviews:
  - action: run:partdblocks
    disposition: satisfied
    because: D207's reading rules quote the limit and add the time-of-day versus time-since-start confound
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
      D207's reading rules quote the limit and the time-of-day versus time-since-start confound;
      unchanged by the amendment
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
    because: D207's reading rules quote the limit and the time-of-day versus time-since-start confound
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
    because: D207's reading rules quote the limit and the time-of-day versus time-since-start confound
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
      D210 'What this shows (P83)' and F108 read the block pattern as variation the members lack,
      not its cause, with the recording-time confound stated.
    by: lead (session 108deea8)
    at: "2026-10-30 22:07 UTC"
    inputs:
      - record: D210
        rev: 91511fa8dac08a97ba28db172b6f39be91fe08489cd10a28a46148d17f90fbc0
      - record: F108
        rev: b5dd9256e4fcbd988a503e004eee2b99e8600a92e4ac65c7cc146a5846b04d57
  - action: run:triggers-build-smoke
    disposition: not-applicable
    because: The smoke reports counts, timings, memory and the self-check only; no block pattern is read.
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
    disposition: acting
    because: Event rates per light block are reported descriptively, as variation, not as a cause.
    by: lead (session 108deea8)
    at: "2026-10-31 01:00 UTC"
    inputs:
      - record: D206
        rev: 8ad2b7661f036244004826f9b7ed2ef18e0ddcd7c95e6df491464b3dba219a02
      - record: D212
        rev: c08d81a72ffe2039af178f50cd473fc20e63edae34c1faff63547e4892286a8f
  - action: run:foragers1c-build-smoke
    disposition: not-applicable
    because: no reading happens in the build or smoke
    by: lead (session 6b5fb317)
    at: "2026-10-31 02:33 UTC"
    inputs:
      - record: D223
        rev: d91126ff338bb2e03861036626ef624304f4379bd9e707f9ad215faa8f1de646
      - record: D224
        rev: 40e58b5e95b78564c1257ba08746a92d3e52144e55d9f211b0ca5e809910b360
  - action: run:foragers1c-data
    disposition: not-applicable
    because: no reading in the data pass
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
    because: >-
      D223's reading rules read the light-block rows as variation the members lack, confounded with
      time since start
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
    because: "no reading: values are compared between implementations only"
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
    because: D221 and D226 read the block patterns narrowly, confounded with time since recording began
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
- 2026-10-30 21:05 UTC lead (session 20261030): created — D206 item 2: reading limit for 1(a)
- 2026-10-30 21:10 UTC lead (session 20261030): review for run:partdblocks: satisfied — D207's reading rules quote the limit and add the time-of-day versus time-since-start confound
- 2026-10-30 21:22 UTC lead (session 20261030): review for run:partdblocks-2: satisfied — D207's reading rules quote the limit and the time-of-day versus time-since-start confound; unchanged by the amendment
- 2026-10-30 21:23 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207's amendment: this run crashed (the machine ran out of memory) before writing any output, and nothing was read; the work is rerun under run:partdblocks-2, disposed separately
- 2026-10-30 21:33 UTC lead (session 20261030): review for run:partdblocks-3: satisfied — D207's reading rules quote the limit and the time-of-day versus time-since-start confound
- 2026-10-30 21:34 UTC lead (session 20261030): review for run:partdblocks-2: not-applicable — re-read after D207 amendment 2: this run's output failed P88's self-check and was set aside unread (blocks-selfcheck-failed-c91854ee.json); the work is rerun under run:partdblocks-3, disposed separately
- 2026-10-30 21:34 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207 amendment 2: this first run crashed on memory before writing any output and nothing was read; superseded by run:partdblocks-2 (self-check failed, set aside) and run:partdblocks-3
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks-4: satisfied — D207's reading rules quote the limit and the time-of-day versus time-since-start confound
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207 amendment 3: this first run crashed on memory before writing any output and nothing was read; superseded by run:partdblocks-4
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks-2: not-applicable — re-read after D207 amendment 3: this run's output failed P88's self-check and was set aside unread; superseded by run:partdblocks-4
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks-3: not-applicable — re-read after D207 amendment 3: this run stopped on the block guard with no output; nothing was read; superseded by run:partdblocks-4
- 2026-10-30 21:57 UTC lead (session 20261030): reviewed D210: the first-block pattern is read as variation the members do not represent, with the time-since-recording confound; applied here, stays open
- 2026-10-30 22:07 UTC lead (session 108deea8): review for commit:partd-1a-20261030: satisfied — D210 'What this shows (P83)' and F108 read the block pattern as variation the members lack, not its cause, with the recording-time confound stated.
- 2026-10-30 22:14 UTC lead (session 108deea8): reviewed D211@c8f5e94149d3, D212@d4b52839054d; D211 and D212 apply this limit: D212 reads event rates per light block beside F108 'as P83 requires', descriptively; no cause is claimed. Unaffected, still open
- 2026-10-30 22:42 UTC lead (session 108deea8): reviewed D212@008d3119e499; D212 amendment 1 keeps the block event rates descriptive (D212's descriptive rows unchanged) and adds no time-of-day claim; this limit still applies to them. Unaffected
- 2026-10-30 22:42 UTC lead (session 108deea8): review for run:triggers-build-smoke: not-applicable — The smoke reports counts, timings, memory and the self-check only; no block pattern is read.
- 2026-10-31 00:20 UTC lead (session 108deea8): review for run:triggers-amend2: not-applicable — The build, synthetic checks and smoke rerun read and report no result (counts, self-check, time and memory only).
- 2026-10-31 00:37 UTC lead (session 108deea8): review for run:triggers-cal-full: not-applicable — These runs write files only; nothing is read or reported until the aggregator, which is a separate step.
- 2026-10-31 00:41 UTC lead (session 108deea8): review for run:triggers-quorum: not-applicable — Synthetic data only; no real-data value is computed or read in the quorum check.
- 2026-10-31 00:42 UTC lead (session 108deea8): review for commit:item1b-design-20261031: not-applicable — No D_w, density, direct-sensing or ordering claim is made in D211-D219 beyond D211's choice, which states the order is a practical proposal.
- 2026-10-31 01:00 UTC lead (session 108deea8): review for run:triggers-read: acting — Event rates per light block are reported descriptively, as variation, not as a cause.
- 2026-10-31 01:11 UTC lead (session 108deea8): reviewed D221@2c4c00f83034; D221 reports event rates per light block beside F108 as variation confounded with time since recording began, not a cause. Still open
- 2026-10-31 02:18 UTC lead (session 6b5fb317): reviewed D223@b738f2de5839; D223 applies it to its light-block rows (variation the members lack, confounded with time since start); P83 stays open
- 2026-10-31 02:32 UTC lead (session 6b5fb317): reviewed D223@d91126ff338b; D223 amendment 1 leaves the light-block rows and their P83 reading unchanged. Open
- 2026-10-31 02:33 UTC lead (session 6b5fb317): review for run:foragers1c-build-smoke: not-applicable — no reading happens in the build or smoke
- 2026-10-31 02:57 UTC lead (session 6b5fb317): review for run:foragers1c-data: not-applicable — no reading in the data pass
- 2026-10-31 02:57 UTC lead (session 6b5fb317): review for run:foragers1c-read: satisfied — D223's reading rules read the light-block rows as variation the members lack, confounded with time since start
- 2026-10-31 03:09 UTC lead (session 6b5fb317): reviewed D226@9b60eeb57b4b; D226 reads the light-block result (morning D_w through r) as variation the members lack, confounded with time since recording began. Open
- 2026-10-31 03:23 UTC lead (session 6b5fb317): review for run:foragers1c-second: not-applicable — no reading: values are compared between implementations only
- 2026-10-31 03:34 UTC lead (session 6b5fb317): review for run:foragers1c-second: not-applicable — re-read D226 after its change: the change appends D228's result only (the independent check agrees); the check was a reproduction on existing records, so this commitment still does not bear on it
- 2026-10-31 03:35 UTC lead (session 6b5fb317): review for commit:partd-1b1c-20261031: satisfied — D221 and D226 read the block patterns narrowly, confounded with time since recording began
- 2026-10-31 04:22 UTC lead (session 548cad34): reviewed D231@68d492443f36; D231 restates P83 for F108 and keeps a non-biological account (H7) among the untested hypotheses; applied, unchanged
- 2026-11-01 19:12 UTC lead (session f6ab21fd): reviewed D239@a5d3879fe9c2, D240@5875f9598246; D239 and D240 read: no change here (D240 is the T061 inventory; D239 starts T059 and T061).
- 2026-11-02 05:56 UTC lead (session 0e89af04): review for commit:partd-1a-20261030: satisfied — Re-read F108@1f7135c39159: since the b5dd9256 bytes this review read (committed in 1e5f59e), one dated update was added (D240: lights-on is 06 UTC for every colony; time of day and time since lights-on cannot be separated). It leaves 'does not establish a 10-min oscillator' and the time-of-day reading this disposition rests on unchanged, and the commit holds the version read, so the disposition stands.
- 2026-11-02 05:57 UTC lead (session 0e89af04): reviewed D231@80fe73e46b1b; D231 restates P83 among F108's limits and under H7 (a non-biological account); it reads the time-of-day pattern as narrowly as P83 asks. Unchanged
- 2026-11-03 16:41 UTC lead (session e38b977a): review for merge:browser-sim-m1@f8d29d5: not-triggered — A local fast-forward of main (8bc7789) to browser-sim-m1 (f8d29d5): it adds no content beyond the 18 commits already on the branch, each of them gated when made (commit:synchrony-review-20261101 ... commit:b016-records-20261103), where the content this commitment governs was reviewed. Nothing is pushed or published by this step. No freeze, model change, run, held-out use or new reading is in it.
