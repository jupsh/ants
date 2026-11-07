---
id: P02
title: Water-init warm-up shortcut rechecked when walk-on rates change
wording: >-
  is accepted as a warm-up shortcut with explicit provenance, **provided the original and revised
  starts converge to the same late-window behaviour** (else it could hide slow adjustment),
  rechecked if walk-on rates or water parameters change
summary: >-
  Due: C1 and C2 changed walk-on rates (C2 drive SD 1.99 / 1.94, D080) and no later recheck was
  found. Covers every Stroeymeyt colony run (colonyStroeymeyt.ts: C1, C2, synchrony Parts B-D, the
  S2 audit base), not step 5 (D094).
made: A003
state: open
nodes: [T015, T033]
links: [S001, D080, D094, D160, D163]
reviews:
  - action: run:q03-recheck-20261025
    disposition: acting
    because: >-
      This run is the recheck P02 asks for: original vs revised starts at C2 base (walk-on rates
      changed since A003), late window 14-20 h, frozen in D162 before any run.
    by: lead (session 421f3ea4)
    at: "2026-10-25 16:54 UTC"
  - action: run:partd-bench-20261026
    disposition: not-applicable
    because: >-
      Timing only (D168): no output is read, so no late-window behaviour is relied on. The members'
      walk-on changes are by design; P54 already bars reading the recheck as convergence for them.
    by: lead (session 0cf57b71)
    at: "2026-10-26 01:31 UTC"
  - action: rent:partd2a-20261026
    disposition: not-applicable
    because: >-
      Renting changes no walk-on or water parameter; the Stage 2a members' walk-on changes are their
      mechanisms (P54 limits the recheck's reach).
    by: lead (session 0cf57b71)
    at: "2026-10-26 03:38 UTC"
  - action: rent:partd2a-20261026-d172
    disposition: not-applicable
    because: >-
      Renting changes no walk-on or water parameter; the Stage 2a members' walk-on changes are their
      mechanisms (P54 limits the recheck's reach).
    by: lead (session d6df3027)
    at: "2026-10-26 16:07 UTC"
  - action: rent:partd2a-20261026-56637446
    disposition: not-applicable
    because: >-
      Renting changes no walk-on or water parameter; the Stage 2a members' walk-on changes are their
      mechanisms (P54 limits the recheck's reach).
    by: lead (session d6df3027)
    at: "2026-10-26 16:14 UTC"
  - action: run:partd2a
    disposition: satisfied
    because: >-
      D163: the recheck at C2 base passed and Stage 2a is no longer held by it. Its scope (P54, P49)
      excludes convergence for any new mechanism: the members' walk-on modulation is their design,
      not a change of base rates, and the 2a reading states that the shortcut is unrechecked for
      them.
    by: lead (session d6df3027)
    at: "2026-10-26 16:16 UTC"
  - action: rent:partd2b-20261029
    disposition: satisfied
    because: >-
      As at run:partd2a: D163's C2-base recheck holds; the members' walk-on modulation is their
      design, not a change of base rates; D173 discloses the shortcut as unrechecked for members,
      carried into this reading.
    by: lead (session 20261029)
    at: "2026-10-29 05:37 UTC"
  - action: run:partd2b-20261029
    disposition: satisfied
    because: >-
      Same start as every Part D run; D163's C2-base recheck holds and D173 discloses the shortcut
      as unrechecked for members; carried into the 2b and capability readings.
    by: lead (session 20261029)
    at: "2026-10-29 05:44 UTC"
  - action: rent:partd2b-switch-20261029
    disposition: satisfied
    because: >-
      Same runs and start as run:partd2b-20261029 (D179): nothing changes but the box and its disk;
      the members' warm-up remains disclosed as unrechecked.
    by: lead (session 20261029)
    at: "2026-10-29 14:49 UTC"
  - action: commit:20261029
    disposition: satisfied
    because: >-
      The commit changes no walk-on or water parameter; D163's C2-base recheck holds and the
      members' warm-up stays disclosed as unrechecked (D173, D184).
    by: lead (session 20261029)
    at: "2026-10-29 21:23 UTC"
  - action: run:partd2-capfiles
    disposition: not-applicable
    because: "capfiles simulates nothing: it runs the frozen S2 and S3 audits on the fetched capability outputs."
    by: lead (session 20261029)
    at: "2026-10-29 21:47 UTC"
  - action: run:partd2b-read
    disposition: satisfied
    because: >-
      The reading carries D163's C2-base scope and the members' unrechecked warm-up as a disclosure
      (D185).
    by: lead (session 20261029)
    at: "2026-10-29 22:36 UTC"
  - action: run:partdcap-nulls
    disposition: not-applicable
    because: >-
      nulls reads the existing base-pool capability files (D176); no simulation, no walk-on or water
      parameter changed
    by: lead (session 9d2b15e6)
    at: "2026-10-30 17:36 UTC"
    inputs:
      - record: D176
        rev: 1a0a604d94312ce0b943f54a70dff070a96bb5b490e6fe2f4ec5f8ae18b71d96
  - action: run:partdcap-same
    disposition: not-applicable
    because: same reads stored capability files (D176); no simulation, no walk-on or water parameter changed
    by: lead (session 9d2b15e6)
    at: "2026-10-30 17:47 UTC"
    inputs:
      - record: D176
        rev: 1a0a604d94312ce0b943f54a70dff070a96bb5b490e6fe2f4ec5f8ae18b71d96
  - action: run:partdcap-cross
    disposition: not-applicable
    because: cross reads stored capability files (D176); no simulation, no walk-on or water parameter changed
    by: lead (session 9d2b15e6)
    at: "2026-10-30 17:56 UTC"
    inputs:
      - record: D176
        rev: 1a0a604d94312ce0b943f54a70dff070a96bb5b490e6fe2f4ec5f8ae18b71d96
  - action: run:partddesc
    disposition: not-applicable
    because: reads stored outputs only (D202); no simulation, no walk-on or water parameter changed
    by: lead (session 9d2b15e6)
    at: "2026-10-30 18:08 UTC"
    inputs:
      - record: D202
        rev: 97916663a5b52f993397cc2e3ac2c9edb295a2193d1d44d74c54c1220764a0b3
  - action: run:partdblocks
    disposition: not-applicable
    because: >-
      reads stored data and Stage 2b outputs only (D207); no simulation, no walk-on or water
      parameter changed
    by: lead (session 20261030)
    at: "2026-10-30 21:10 UTC"
    inputs:
      - record: D207
        rev: 8f6f241d26d437df775bce00a27ef04f216e12facb2569dc025e87ee3c8f9396
  - action: run:partdblocks-2
    disposition: not-applicable
    because: >-
      as run:partdblocks: stored data and Stage 2b outputs only; D207's amendment changes file
      loading, no simulation or parameter
    by: lead (session 20261030)
    at: "2026-10-30 21:22 UTC"
    inputs:
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
    because: stored data and Stage 2b outputs only; no simulation, no walk-on or water parameter changed
    by: lead (session 20261030)
    at: "2026-10-30 21:33 UTC"
    inputs:
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
    disposition: not-applicable
    because: stored data and Stage 2b outputs only; no simulation, no walk-on or water parameter changed
    by: lead (session 20261030)
    at: "2026-10-30 21:44 UTC"
    inputs:
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
    disposition: not-applicable
    because: >-
      The commit changes no src/ file, so no walk-on rate or water parameter; D163's C2-base recheck
      stands.
    by: lead (session 108deea8)
    at: "2026-10-30 22:06 UTC"
  - action: run:triggers-build-smoke
    disposition: not-applicable
    because: >-
      No simulation: the build and smoke read recorded tracks only; no walk-on or water parameter is
      touched.
    by: lead (session 108deea8)
    at: "2026-10-30 22:42 UTC"
  - action: run:triggers-amend2
    disposition: not-applicable
    because: >-
      No simulation, member, model, spatial coupling or box: a scratch-script change to the item
      1(b) analysis, synthetic checks and a 2-colony smoke rerun.
    by: lead (session 108deea8)
    at: "2026-10-31 00:20 UTC"
  - action: run:triggers-cal-full
    disposition: not-applicable
    because: >-
      No simulation, member, model, spatial coupling or box: a 100-seed synthetic calibration and
      the per-colony pass over recorded tracks, both local.
    by: lead (session 108deea8)
    at: "2026-10-31 00:37 UTC"
  - action: run:triggers-quorum
    disposition: not-applicable
    because: >-
      Synthetic data only: a frame dump from the synthetic generator and an independent
      implementation run on it; no simulation of the ant model, no box.
    by: lead (session 108deea8)
    at: "2026-10-31 00:41 UTC"
  - action: commit:item1b-design-20261031
    disposition: not-applicable
    because: >-
      The commit changes no src/ file, model parameter, Es map or box state: records and process
      docs only.
    by: lead (session 108deea8)
    at: "2026-10-31 00:42 UTC"
  - action: run:triggers-read
    disposition: not-applicable
    because: The read aggregates recorded-track results; no model, parameter, spatial coupling, Es map or box.
    by: lead (session 108deea8)
    at: "2026-10-31 01:00 UTC"
  - action: run:foragers1c-build-smoke
    disposition: not-applicable
    because: "no simulation and no warm-up: the build re-reads existing tracks and stored Stage 2b runs"
    by: lead (session 6b5fb317)
    at: "2026-10-31 02:33 UTC"
    inputs:
      - record: D223
        rev: d91126ff338bb2e03861036626ef624304f4379bd9e707f9ad215faa8f1de646
      - record: D224
        rev: 40e58b5e95b78564c1257ba08746a92d3e52144e55d9f211b0ca5e809910b360
  - action: run:foragers1c-data
    disposition: not-applicable
    because: no simulation or warm-up; D225's scripts re-read tracks and stored runs
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
    disposition: not-applicable
    because: no simulation or warm-up; D225's scripts re-read tracks and stored runs
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
    because: "no simulation or warm-up: a second implementation of D223's statistics on existing minute records"
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
    disposition: not-applicable
    because: >-
      the commit holds records of data analyses (items 1(b), 1(c)); no warm-up shortcut or walk-on
      rate is changed
    by: lead (session 6b5fb317)
    at: "2026-10-31 03:35 UTC"
    inputs:
      - record: D221
        rev: 2c4c00f83034f74f98234e2e799f1efc5b082fc738fb53e0883c666d6a11adbc
      - record: D226
        rev: 0772038601c49958aa6d4ffa11e0232dbc95648dd8485abef48c8abfc270d480
      - record: D228
        rev: e6f75b99836a72362b3c3186da6f861d048daec16ba326fd504555151c889b23
  - action: merge:browser-sim-m1@f8d29d5
    disposition: not-triggered
    because: >-
      A local fast-forward of main (8bc7789) to browser-sim-m1 (f8d29d5): it adds no content beyond
      the 18 commits already on the branch, each of them gated when made
      (commit:synchrony-review-20261101 ... commit:b016-records-20261103), where the content this
      commitment governs was reviewed. Nothing is pushed or published by this step. No freeze, model
      change, run, held-out use or new reading is in it.
    by: lead (session e38b977a)
    at: "2026-11-03 16:40 UTC"
  - action: merge:browser-sim-m1@78765aa
    disposition: not-triggered
    because: >-
      A fast-forward of main (f8d29d5) to browser-sim-m1 (78765aa), pushed with the user's
      instruction (D326): five commits already on the branch, each gated when made
      (commit:q38-records-20261105 ... commit:partd-backfill-records-20261107). They hold records
      and byte-identical copies of frozen Part D readers; no src/, public/, fit or data change, so
      the published pages are unchanged. No freeze, model change, run, held-out use or new reading
      is in it.
    by: lead (session 9871fd6b)
    at: "2026-11-07 05:43 UTC"
    inputs:
      - record: D326
        rev: 4af08c5fa754c9b883af7b755d3b50d8b0f284acdc6fa13039d238587d0e1a6b
---
Draft label: P2 (docs/threads-draft.md revision 2).

## History
- 2026-10-24 22:11 UTC lead (session 104e7640): created — migrated from docs/threads-draft.md revision 2 (D142)
- 2026-10-24 22:11 UTC lead (session 104e7640): set nodes=["T015"] — attached to its nodes (D142)
- 2026-10-25 00:31 UTC lead (session 7c2d50fd): D144 (T049 scan review) cites this record's links; reviewed, nothing here changes (the cited promises are covered or discharged as D144 lists)
- 2026-10-25 03:03 UTC lead (session 0bcdd30b): reviewed D145: it keeps P02 open and unwaived; the S2 audit discloses it as a limitation of the base comparison (P35). No change.
- 2026-10-25 03:11 UTC lead (session 0bcdd30b): reviewed D147: P02 stays disclosed and unwaived (P35). No change.
- 2026-10-25 03:57 UTC lead (session 0bcdd30b): reviewed D154: P02 stays unwaived and disclosed in the audit reading (P35). No change.
- 2026-10-25 04:03 UTC lead (session 0bcdd30b): reviewed D156: disclosed as an unwaived limitation of the S2 audit's base comparison. Still due; no change.
- 2026-10-25 04:14 UTC lead (session 0bcdd30b): reviewed D158: it proposes that Q03 (this recheck) be decided before Stage 2a, because every redesign member shares the water-init start. P02 stays due.
- 2026-10-25 04:20 UTC lead (session 0bcdd30b): reviewed D159: Q03 is answered 'recheck, not waive' (item 4); T015 is now open to design and run the recheck at C2 settings before Stage 2a. P02 stays due until that reading.
- 2026-10-25 04:22 UTC lead (session 0bcdd30b): added D160 to links — D160 is the proposed recheck: original vs revised starts at C2 settings, 22 colonies, paired seeds, late window 14-20 h
- 2026-10-25 16:45 UTC lead (session 421f3ea4): reviewed D161: it approves D160 as amended, so the recheck P02 asks for is now designed; P02 stays due until the recheck is read (T015). It also corrects D160's account of A003's multi-seed check, which P02's made record holds.
- 2026-10-25 16:54 UTC lead (session 421f3ea4): review for run:q03-recheck-20261025: acting — This run is the recheck P02 asks for: original vs revised starts at C2 base (walk-on rates changed since A003), late window 14-20 h, frozen in D162 before any run.
- 2026-10-25 18:11 UTC lead (session fe835760): set state=open; added T033 to nodes; added D163 to links — the due recheck at C2 settings is done and passes within P54's scope (D163); the standing condition (recheck if walk-on rates or water parameters change) stays open, attached to T033 where the next Stroeymeyt runs are
- 2026-10-25 18:24 UTC lead (session fe835760): reviewed D164: the build changes no walk-on rate or water parameter at base (base and every Part C kind bit-identical to HEAD), so no new recheck is due.
- 2026-10-26 01:19 UTC lead (session 0cf57b71): reviewed D165: it accepts D163's recheck within P54 and changes no walk-on rate or water parameter; P02's standing condition is untouched.
- 2026-10-26 01:31 UTC lead (session 0cf57b71): review for run:partd-bench-20261026: not-applicable — Timing only (D168): no output is read, so no late-window behaviour is relied on. The members' walk-on changes are by design; P54 already bars reading the recheck as convergence for them.
- 2026-10-26 03:36 UTC lead (session 0cf57b71): reviewed D170/D171: no walk-on or water parameter change; the members' walk-on changes are their mechanisms. Standing condition unchanged.
- 2026-10-26 03:38 UTC lead (session 0cf57b71): review for rent:partd2a-20261026: not-applicable — Renting changes no walk-on or water parameter; the Stage 2a members' walk-on changes are their mechanisms (P54 limits the recheck's reach).
- 2026-10-26 16:07 UTC lead (session d6df3027): review for rent:partd2a-20261026-d172: not-applicable — Renting changes no walk-on or water parameter; the Stage 2a members' walk-on changes are their mechanisms (P54 limits the recheck's reach).
- 2026-10-26 16:14 UTC lead (session d6df3027): review for rent:partd2a-20261026-56637446: not-applicable — Renting changes no walk-on or water parameter; the Stage 2a members' walk-on changes are their mechanisms (P54 limits the recheck's reach).
- 2026-10-26 16:16 UTC lead (session d6df3027): review for run:partd2a: satisfied — D163: the recheck at C2 base passed and Stage 2a is no longer held by it. Its scope (P54, P49) excludes convergence for any new mechanism: the members' walk-on modulation is their design, not a change of base rates, and the 2a reading states that the shortcut is unrechecked for them.
- 2026-10-29 01:26 UTC lead (session 20261029): reviewed D173 (and D175 via T033): D173 discloses that the warm-up shortcut is rechecked only at C2 base (D163), not for any calibrated member, and carries that into Stage 2b and any commit; D175 changes no warm-up. The condition stays open and unmet for the members.
- 2026-10-29 05:27 UTC lead (session 20261029): reviewed D176: the capability runs use C2's same water-init start and warm-up as every member; no warm-up recheck is added, so the condition stays unmet for members and carried as disclosed (D173).
- 2026-10-29 05:32 UTC lead (session 20261029): reviewed D177: it confirms counting and colony rules of the capability reader; no warm-up change. Unaffected.
- 2026-10-29 05:34 UTC lead (session 20261029): reviewed D178: Part B governs row support and MC precision, not the warm-up. Unaffected; the members' unrechecked warm-up is still disclosed.
- 2026-10-29 05:37 UTC lead (session 20261029): review for rent:partd2b-20261029: satisfied — As at run:partd2a: D163's C2-base recheck holds; the members' walk-on modulation is their design, not a change of base rates; D173 discloses the shortcut as unrechecked for members, carried into this reading.
- 2026-10-29 05:44 UTC lead (session 20261029): review for run:partd2b-20261029: satisfied — Same start as every Part D run; D163's C2-base recheck holds and D173 discloses the shortcut as unrechecked for members; carried into the 2b and capability readings.
- 2026-10-29 14:49 UTC lead (session 20261029): review for rent:partd2b-switch-20261029: satisfied — Same runs and start as run:partd2b-20261029 (D179): nothing changes but the box and its disk; the members' warm-up remains disclosed as unrechecked.
- 2026-10-29 20:08 UTC lead (session 7f762276): reviewed D181: it cites D094 only for step 5 being fitted and judged on L0S1c (Q04); P02 covers Stroeymeyt colony runs, not step 5 or the L0S1 judge (T057), so it is unaffected
- 2026-10-29 21:23 UTC lead (session 20261029): review for commit:20261029: satisfied — The commit changes no walk-on or water parameter; D163's C2-base recheck holds and the members' warm-up stays disclosed as unrechecked (D173, D184).
- 2026-10-29 21:47 UTC lead (session 20261029): review for run:partd2-capfiles: not-applicable — capfiles simulates nothing: it runs the frozen S2 and S3 audits on the fetched capability outputs.
- 2026-10-29 22:36 UTC lead (session 20261029): review for run:partd2b-read: satisfied — The reading carries D163's C2-base scope and the members' unrechecked warm-up as a disclosure (D185).
- 2026-10-30 04:45 UTC lead (session 9aa22476): reviewed D191: it cites D094 only for the step-5 design. P02 covers Stroeymeyt colony runs, not step 5 (its summary), and the T057 judge changes only E2 layer forager/phys parameters, not walk-on rates or water parameters of those runs; unaffected
- 2026-10-30 05:35 UTC lead (session 9d2b15e6): reviewed D194: it cites D163 only to disclose that the Q03 recheck covered C2 base, not the members; no walk-on or water parameter changed, so the recheck condition is not triggered. Stays open.
- 2026-10-30 17:36 UTC lead (session 9d2b15e6): review for run:partdcap-nulls: not-applicable — nulls reads the existing base-pool capability files (D176); no simulation, no walk-on or water parameter changed
- 2026-10-30 17:47 UTC lead (session 9d2b15e6): review for run:partdcap-same: not-applicable — same reads stored capability files (D176); no simulation, no walk-on or water parameter changed
- 2026-10-30 17:56 UTC lead (session 9d2b15e6): review for run:partdcap-cross: not-applicable — cross reads stored capability files (D176); no simulation, no walk-on or water parameter changed
- 2026-10-30 18:08 UTC lead (session 9d2b15e6): review for run:partddesc: not-applicable — reads stored outputs only (D202); no simulation, no walk-on or water parameter changed
- 2026-10-30 21:10 UTC lead (session 20261030): review for run:partdblocks: not-applicable — reads stored data and Stage 2b outputs only (D207); no simulation, no walk-on or water parameter changed
- 2026-10-30 21:22 UTC lead (session 20261030): review for run:partdblocks-2: not-applicable — as run:partdblocks: stored data and Stage 2b outputs only; D207's amendment changes file loading, no simulation or parameter
- 2026-10-30 21:23 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207's amendment: this run crashed (the machine ran out of memory) before writing any output, and nothing was read; the work is rerun under run:partdblocks-2, disposed separately
- 2026-10-30 21:33 UTC lead (session 20261030): review for run:partdblocks-3: not-applicable — stored data and Stage 2b outputs only; no simulation, no walk-on or water parameter changed
- 2026-10-30 21:33 UTC lead (session 20261030): review for run:partdblocks-2: not-applicable — re-read after D207 amendment 2: this run's output failed P88's self-check and was set aside unread (blocks-selfcheck-failed-c91854ee.json); the work is rerun under run:partdblocks-3, disposed separately
- 2026-10-30 21:34 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207 amendment 2: this first run crashed on memory before writing any output and nothing was read; superseded by run:partdblocks-2 (self-check failed, set aside) and run:partdblocks-3
- 2026-10-30 21:44 UTC lead (session 20261030): review for run:partdblocks-4: not-applicable — stored data and Stage 2b outputs only; no simulation, no walk-on or water parameter changed
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207 amendment 3: this first run crashed on memory before writing any output and nothing was read; superseded by run:partdblocks-4
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks-2: not-applicable — re-read after D207 amendment 3: this run's output failed P88's self-check and was set aside unread; superseded by run:partdblocks-4
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks-3: not-applicable — re-read after D207 amendment 3: this run stopped on the block guard with no output; nothing was read; superseded by run:partdblocks-4
- 2026-10-30 22:06 UTC lead (session 108deea8): review for commit:partd-1a-20261030: not-applicable — The commit changes no src/ file, so no walk-on rate or water parameter; D163's C2-base recheck stands.
- 2026-10-30 22:42 UTC lead (session 108deea8): review for run:triggers-build-smoke: not-applicable — No simulation: the build and smoke read recorded tracks only; no walk-on or water parameter is touched.
- 2026-10-31 00:20 UTC lead (session 108deea8): review for run:triggers-amend2: not-applicable — No simulation, member, model, spatial coupling or box: a scratch-script change to the item 1(b) analysis, synthetic checks and a 2-colony smoke rerun.
- 2026-10-31 00:37 UTC lead (session 108deea8): review for run:triggers-cal-full: not-applicable — No simulation, member, model, spatial coupling or box: a 100-seed synthetic calibration and the per-colony pass over recorded tracks, both local.
- 2026-10-31 00:41 UTC lead (session 108deea8): review for run:triggers-quorum: not-applicable — Synthetic data only: a frame dump from the synthetic generator and an independent implementation run on it; no simulation of the ant model, no box.
- 2026-10-31 00:42 UTC lead (session 108deea8): review for commit:item1b-design-20261031: not-applicable — The commit changes no src/ file, model parameter, Es map or box state: records and process docs only.
- 2026-10-31 01:00 UTC lead (session 108deea8): review for run:triggers-read: not-applicable — The read aggregates recorded-track results; no model, parameter, spatial coupling, Es map or box.
- 2026-10-31 02:33 UTC lead (session 6b5fb317): review for run:foragers1c-build-smoke: not-applicable — no simulation and no warm-up: the build re-reads existing tracks and stored Stage 2b runs
- 2026-10-31 02:57 UTC lead (session 6b5fb317): review for run:foragers1c-data: not-applicable — no simulation or warm-up; D225's scripts re-read tracks and stored runs
- 2026-10-31 02:57 UTC lead (session 6b5fb317): review for run:foragers1c-read: not-applicable — no simulation or warm-up; D225's scripts re-read tracks and stored runs
- 2026-10-31 03:23 UTC lead (session 6b5fb317): review for run:foragers1c-second: not-applicable — no simulation or warm-up: a second implementation of D223's statistics on existing minute records
- 2026-10-31 03:34 UTC lead (session 6b5fb317): review for run:foragers1c-second: not-applicable — re-read D226 after its change: the change appends D228's result only (the independent check agrees); the check was a reproduction on existing records, so this commitment still does not bear on it
- 2026-10-31 03:35 UTC lead (session 6b5fb317): review for commit:partd-1b1c-20261031: not-applicable — the commit holds records of data analyses (items 1(b), 1(c)); no warm-up shortcut or walk-on rate is changed
- 2026-11-03 16:40 UTC lead (session e38b977a): review for merge:browser-sim-m1@f8d29d5: not-triggered — A local fast-forward of main (8bc7789) to browser-sim-m1 (f8d29d5): it adds no content beyond the 18 commits already on the branch, each of them gated when made (commit:synchrony-review-20261101 ... commit:b016-records-20261103), where the content this commitment governs was reviewed. Nothing is pushed or published by this step. No freeze, model change, run, held-out use or new reading is in it.
- 2026-11-07 05:43 UTC lead (session 9871fd6b): review for merge:browser-sim-m1@78765aa: not-triggered — A fast-forward of main (f8d29d5) to browser-sim-m1 (78765aa), pushed with the user's instruction (D326): five commits already on the branch, each gated when made (commit:q38-records-20261105 ... commit:partd-backfill-records-20261107). They hold records and byte-identical copies of frozen Part D readers; no src/, public/, fit or data change, so the published pages are unchanged. No freeze, model change, run, held-out use or new reading is in it.
