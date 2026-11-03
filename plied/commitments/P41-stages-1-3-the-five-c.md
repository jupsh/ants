---
id: P41
title: >-
  Stages 1-3: the five C bands and the excess-over-J profile assessed, roles and tolerances frozen
  before new members run, never used to select members
wording: >-
  Retain the five raw C bands and explicitly specify how the audited excess-over-J profile enters
  assessment. … Freeze the roles and tolerances before running new members; do not select members
  using these assessment rows.
summary: Assessment rows of the revised design.
made: D157
state: open
nodes: [T033]
links: [D158]
reviews:
  - action: run:q03-recheck-20261025
    disposition: not-applicable
    because: >-
      This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism,
      no spatial coupling, no assessment rows. Its five rows are colony-state rows, not the Stages
      1-3 assessment rows (D160).
    by: lead (session 421f3ea4)
    at: "2026-10-25 16:55 UTC"
  - action: run:partd-bench-20261026
    disposition: satisfied
    because: >-
      Roles and tolerances frozen in D158 as approved by D159 before any new member runs; the bench
      reads no row and selects no member.
    by: lead (session 0cf57b71)
    at: "2026-10-26 01:31 UTC"
  - action: rent:partd2a-20261026
    disposition: satisfied
    because: Roles and tolerances frozen in D158/D159 before any new member runs.
    by: lead (session 0cf57b71)
    at: "2026-10-26 03:38 UTC"
  - action: rent:partd2a-20261026-d172
    disposition: satisfied
    because: >-
      Roles and tolerances frozen in D158/D159 before any new member runs; calibration does not use
      the assessment rows.
    by: lead (session d6df3027)
    at: "2026-10-26 16:07 UTC"
  - action: rent:partd2a-20261026-56637446
    disposition: satisfied
    because: >-
      Roles and tolerances frozen in D158/D159 before any new member runs; calibration does not use
      the assessment rows.
    by: lead (session d6df3027)
    at: "2026-10-26 16:14 UTC"
  - action: run:partd2a
    disposition: satisfied
    because: >-
      Roles and tolerances frozen in D158/D159 before any new member runs; calibration selects
      strengths by its own frozen rule, not by the assessment rows.
    by: lead (session d6df3027)
    at: "2026-10-26 16:16 UTC"
  - action: rent:partd2b-20261029
    disposition: satisfied
    because: >-
      Roles and tolerances frozen in D158/D159; members were selected by D_w calibration only
      (D173); the rented runs use the D173 strengths, nothing chosen from assessment rows.
    by: lead (session 20261029)
    at: "2026-10-29 05:37 UTC"
  - action: run:partd2b-20261029
    disposition: satisfied
    because: >-
      Roles and tolerances frozen (D158/D159); the 9 members and strengths come from the D_w
      calibration (D173), checked on the box (9 verify files calibrated, pushed md5-checked).
    by: lead (session 20261029)
    at: "2026-10-29 05:44 UTC"
  - action: rent:partd2b-switch-20261029
    disposition: satisfied
    because: >-
      Same 9 members at D173 strengths, carried with the pushed calib/verify files; nothing chosen
      from assessment rows.
    by: lead (session 20261029)
    at: "2026-10-29 14:49 UTC"
  - action: commit:20261029
    disposition: satisfied
    because: >-
      Roles and tolerances frozen in D158/D159; nothing committed selects or tunes a member from
      assessment rows (2b rows unread).
    by: lead (session 20261029)
    at: "2026-10-29 21:23 UTC"
  - action: run:partd2-capfiles
    disposition: satisfied
    because: No member is selected or tuned; the capability files feed the frozen capability rule (D175-D177).
    by: lead (session 20261029)
    at: "2026-10-29 21:47 UTC"
  - action: run:partd2b-read
    disposition: satisfied
    because: >-
      Roles and tolerances frozen (D158/D159); every calibrated member is assessed and reported;
      nothing selected from the rows.
    by: lead (session 20261029)
    at: "2026-10-29 22:36 UTC"
  - action: run:partdcap-nulls
    disposition: satisfied
    because: >-
      nulls reads no member file and no assessment row; c is set on base nulls, so no member is
      selected by the rows (D176 order; D194 lists every member)
    by: lead (session 9d2b15e6)
    at: "2026-10-30 17:36 UTC"
    inputs:
      - record: D176
        rev: 1a0a604d94312ce0b943f54a70dff070a96bb5b490e6fe2f4ec5f8ae18b71d96
      - record: D194
        rev: 3eee0e9774405cf7f7c7bc732310651e00a3a67b628bac2553baaf055388769d
  - action: run:partdcap-same
    disposition: satisfied
    because: >-
      every calibrated member's six datasets are checked, none chosen or dropped; c and α were
      frozen on nulls only (D196) and stay fixed (D197)
    by: lead (session 9d2b15e6)
    at: "2026-10-30 17:47 UTC"
    inputs:
      - record: D196
        rev: e67ec9a3bd52e5eeb41bfcccda9d7a2a85443a1237617457d9c19481031db034
      - record: D197
        rev: b80fed2f6a3a83d6d30dafdd1f6007b7304b1610817dc6abe029073ca9bbafe1
  - action: run:partdcap-cross
    disposition: satisfied
    because: >-
      every calibrated T x D pair is compared (14 pairs), none chosen or dropped; c and α stay as
      frozen (D196, D199)
    by: lead (session 9d2b15e6)
    at: "2026-10-30 17:56 UTC"
    inputs:
      - record: D196
        rev: e67ec9a3bd52e5eeb41bfcccda9d7a2a85443a1237617457d9c19481031db034
      - record: D199
        rev: 95299e0ccca953d02ca049a8f811ddafd02d2ba0e4c5c3051e66822322acb684
  - action: run:partddesc
    disposition: satisfied
    because: >-
      every calibrated member shown with its outside rows; nothing is chosen, dropped or tuned; no
      label or placement (D201, D202)
    by: lead (session 9d2b15e6)
    at: "2026-10-30 18:08 UTC"
    inputs:
      - record: D201
        rev: 3a4e777d8fdde50115ecfed88eb328a25146f3658e9c236e7cb5d0e1e5b5e84e
      - record: D202
        rev: 97916663a5b52f993397cc2e3ac2c9edb295a2193d1d44d74c54c1220764a0b3
  - action: run:partdcap-nulls
    disposition: satisfied
    because: >-
      Re-read after D204, which corrects only D194's S1 window labels (5 s, 1 min, 10 min): nulls
      reads no member file and no assessment row; c is set on base nulls, so no member is selected
      by the rows (D176 order; D194 lists every member)
    by: lead (session 20261030)
    at: "2026-10-30 20:47 UTC"
    inputs:
      - record: D176
        rev: 1a0a604d94312ce0b943f54a70dff070a96bb5b490e6fe2f4ec5f8ae18b71d96
      - record: D194
        rev: 5d5c2108904ee4453da89c3a95d2399691e9acbbdf492a2c6a6bc7bfb294b65f
  - action: run:partdblocks
    disposition: satisfied
    because: >-
      D207 reports all 12 arms and selects none; Stage 2b roles, rows and tolerances are unchanged
      and its classes are copied, not recomputed
    by: lead (session 20261030)
    at: "2026-10-30 21:10 UTC"
    inputs:
      - record: D207
        rev: 8f6f241d26d437df775bce00a27ef04f216e12facb2569dc025e87ee3c8f9396
  - action: run:partdblocks-2
    disposition: satisfied
    because: D207 as amended still reports all 12 arms and selects none; Stage 2b classes copied, not recomputed
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
    disposition: satisfied
    because: all 12 arms reported, none selected; Stage 2b classes copied, not recomputed
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
    disposition: satisfied
    because: all 12 arms reported, none selected; Stage 2b classes copied, not recomputed
    by: lead (session 20261030)
    at: "2026-10-30 21:45 UTC"
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
    disposition: satisfied
    because: >-
      D205 selects no member ('No placement, no family label, no closest member'); D210 is
      descriptive and selects none; no assessment row or tolerance changed.
    by: lead (session 108deea8)
    at: "2026-10-30 22:06 UTC"
    inputs:
      - record: D205
        rev: e990086aa7e8f8e7d3a154cc02d3eafe19786ee4ac0e809e3a29f1717a20ad88
      - record: D210
        rev: 91511fa8dac08a97ba28db172b6f39be91fe08489cd10a28a46148d17f90fbc0
  - action: run:triggers-build-smoke
    disposition: not-applicable
    because: No member is run or selected; data-only analysis of recorded tracks.
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
      No Stages 1-3 reading, member, band or multiplier is committed: the entries are item 1(b)'s
      design, decisions and builds (D211-D219).
    by: lead (session 108deea8)
    at: "2026-10-31 00:42 UTC"
  - action: run:triggers-read
    disposition: not-applicable
    because: No Stages 1-3 member is run, assessed or selected; item 1(b) is a data-only analysis.
    by: lead (session 108deea8)
    at: "2026-10-31 01:00 UTC"
  - action: run:foragers1c-build-smoke
    disposition: not-applicable
    because: no new member runs; stored Stage 2b runs are re-read
    by: lead (session 6b5fb317)
    at: "2026-10-31 02:33 UTC"
    inputs:
      - record: D223
        rev: d91126ff338bb2e03861036626ef624304f4379bd9e707f9ad215faa8f1de646
      - record: D224
        rev: 40e58b5e95b78564c1257ba08746a92d3e52144e55d9f211b0ca5e809910b360
  - action: run:foragers1c-data
    disposition: not-applicable
    because: no new member runs
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
    because: no new member runs
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
    because: no new member runs
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
    because: no new members run
    by: lead (session 6b5fb317)
    at: "2026-10-31 03:35 UTC"
    inputs:
      - record: D221
        rev: 2c4c00f83034f74f98234e2e799f1efc5b082fc738fb53e0883c666d6a11adbc
      - record: D226
        rev: 0772038601c49958aa6d4ffa11e0232dbc95648dd8485abef48c8abfc270d480
      - record: D228
        rev: e6f75b99836a72362b3c3186da6f861d048daec16ba326fd504555151c889b23
---

## History
- 2026-10-25 04:09 UTC lead (session 0bcdd30b): created
- 2026-10-25 04:14 UTC lead (session 0bcdd30b): added D158 to links — D158 proposes the rows: five light-phase C bands and five C - E_J bands at 0.015, all 20 rows for joint reproduction, no member selection
- 2026-10-25 04:20 UTC lead (session 0bcdd30b): reviewed D159: the 20 rows and tolerances are approved; support, missing statistics and boundary MC follow under P47 before assessment.
- 2026-10-25 16:45 UTC lead (session 421f3ea4): reviewed D161: it approves the Q03 recheck design (T015) and confirms Stage 1 may proceed now, Stage 2a after the recheck reading; it mentions T033 only for that order. Its five rows are colony-state rows of the recheck, not Stages 1-3 assessment rows (D160 wording limits); P41 is untouched.
- 2026-10-25 16:55 UTC lead (session 421f3ea4): review for run:q03-recheck-20261025: not-applicable — This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism, no spatial coupling, no assessment rows. Its five rows are colony-state rows, not the Stages 1-3 assessment rows (D160).
- 2026-10-25 18:12 UTC lead (session fe835760): reviewed D163: it lifts the Q03 hold on Stage 2a but runs no Stages 1-3 member and touches no member, diagnostic or assessment row this governs. Unaffected.
- 2026-10-25 18:24 UTC lead (session fe835760): reviewed D164: a build and toy smoke only; no member was assessed and no role or tolerance changed. Unaffected.
- 2026-10-26 01:19 UTC lead (session 0cf57b71): reviewed D165: the forecast covers the 20 rows P41 froze and may never remove one (P57); roles and tolerances unchanged.
- 2026-10-26 01:27 UTC lead (session 0cf57b71): reviewed D166/D167: the forecast uses exactly the 20 frozen rows and tolerances; it removes none and selects no member. Unchanged.
- 2026-10-26 01:31 UTC lead (session 0cf57b71): review for run:partd-bench-20261026: satisfied — Roles and tolerances frozen in D158 as approved by D159 before any new member runs; the bench reads no row and selects no member.
- 2026-10-26 02:38 UTC lead (session 0cf57b71): reviewed D169: cost basis only; no row read, roles and tolerances unchanged.
- 2026-10-26 03:36 UTC lead (session 0cf57b71): reviewed D170/D171: proceeding as designed keeps every row and tolerance; nothing selected.
- 2026-10-26 03:38 UTC lead (session 0cf57b71): review for rent:partd2a-20261026: satisfied — Roles and tolerances frozen in D158/D159 before any new member runs.
- 2026-10-26 16:07 UTC lead (session d6df3027): review for rent:partd2a-20261026-d172: satisfied — Roles and tolerances frozen in D158/D159 before any new member runs; calibration does not use the assessment rows.
- 2026-10-26 16:14 UTC lead (session d6df3027): review for rent:partd2a-20261026-56637446: satisfied — Roles and tolerances frozen in D158/D159 before any new member runs; calibration does not use the assessment rows.
- 2026-10-26 16:16 UTC lead (session d6df3027): review for run:partd2a: satisfied — Roles and tolerances frozen in D158/D159 before any new member runs; calibration selects strengths by its own frozen rule, not by the assessment rows.
- 2026-10-29 01:26 UTC lead (session 20261029): reviewed D173-D175 (via D158/T033): members were selected by D_w calibration only, not by assessment rows; D174 Part B (pending, Q21) keeps the raw C bands and adds support for S1, S2 and S2-J rows without changing roles or tolerances. Unaffected; still binds before Stage 2b.
- 2026-10-29 05:27 UTC lead (session 20261029): reviewed D176: the capability datasets use D_w-calibrated strengths only and never assessment rows to select members; roles and tolerances untouched. Unaffected.
- 2026-10-29 05:32 UTC lead (session 20261029): reviewed D177: capability counting rules; assessment-row roles and tolerances untouched. Unaffected.
- 2026-10-29 05:34 UTC lead (session 20261029): reviewed D178: Part B adds support and MC rules for the existing 20 rows; roles and tolerances stay as frozen in D158/D159 and no row selects members. Unaffected.
- 2026-10-29 05:37 UTC lead (session 20261029): review for rent:partd2b-20261029: satisfied — Roles and tolerances frozen in D158/D159; members were selected by D_w calibration only (D173); the rented runs use the D173 strengths, nothing chosen from assessment rows.
- 2026-10-29 05:44 UTC lead (session 20261029): review for run:partd2b-20261029: satisfied — Roles and tolerances frozen (D158/D159); the 9 members and strengths come from the D_w calibration (D173), checked on the box (9 verify files calibrated, pushed md5-checked).
- 2026-10-29 14:49 UTC lead (session 20261029): review for rent:partd2b-switch-20261029: satisfied — Same 9 members at D173 strengths, carried with the pushed calib/verify files; nothing chosen from assessment rows.
- 2026-10-29 21:23 UTC lead (session 20261029): review for commit:20261029: satisfied — Roles and tolerances frozen in D158/D159; nothing committed selects or tunes a member from assessment rows (2b rows unread).
- 2026-10-29 21:47 UTC lead (session 20261029): review for run:partd2-capfiles: satisfied — No member is selected or tuned; the capability files feed the frozen capability rule (D175-D177).
- 2026-10-29 22:15 UTC lead (session 20261029): reviewed D185: the 20 rows are used for assessment only; no member is selected or tuned from them; unaffected
- 2026-10-29 22:36 UTC lead (session 20261029): review for run:partd2b-read: satisfied — Roles and tolerances frozen (D158/D159); every calibrated member is assessed and reported; nothing selected from the rows.
- 2026-10-30 05:37 UTC lead (session 9d2b15e6): reviewed D194: the five raw C bands and the five S2-J bands were assessed as frozen (D158); every calibrated member is reported and none chosen, dropped or tuned on the rows, as D194 states. Open: applies to the capability reading and anything after.
- 2026-10-30 17:36 UTC lead (session 9d2b15e6): review for run:partdcap-nulls: satisfied — nulls reads no member file and no assessment row; c is set on base nulls, so no member is selected by the rows (D176 order; D194 lists every member)
- 2026-10-30 17:47 UTC lead (session 9d2b15e6): review for run:partdcap-same: satisfied — every calibrated member's six datasets are checked, none chosen or dropped; c and α were frozen on nulls only (D196) and stay fixed (D197)
- 2026-10-30 17:56 UTC lead (session 9d2b15e6): review for run:partdcap-cross: satisfied — every calibrated T x D pair is compared (14 pairs), none chosen or dropped; c and α stay as frozen (D196, D199)
- 2026-10-30 17:58 UTC lead (session 9d2b15e6): reviewed D200: every calibrated member entered the capability comparison and none was chosen on the assessment rows; the rows enter only through D158's Stage 3c restriction (no member without an outside row). Consistent with P41.
- 2026-10-30 18:08 UTC lead (session 9d2b15e6): review for run:partddesc: satisfied — every calibrated member shown with its outside rows; nothing is chosen, dropped or tuned; no label or placement (D201, D202)
- 2026-10-30 20:47 UTC lead (session 20261030): review for run:partdcap-nulls: satisfied — Re-read after D204, which corrects only D194's S1 window labels (5 s, 1 min, 10 min): nulls reads no member file and no assessment row; c is set on base nulls, so no member is selected by the rows (D176 order; D194 lists every member)
- 2026-10-30 20:51 UTC lead (session 20261030): reviewed D205: it uses the members' existing descriptives (S5, S6, S7) to rank measurements, not to select members, and changes no row, role or tolerance. Unchanged
- 2026-10-30 21:10 UTC lead (session 20261030): review for run:partdblocks: satisfied — D207 reports all 12 arms and selects none; Stage 2b roles, rows and tolerances are unchanged and its classes are copied, not recomputed
- 2026-10-30 21:22 UTC lead (session 20261030): review for run:partdblocks-2: satisfied — D207 as amended still reports all 12 arms and selects none; Stage 2b classes copied, not recomputed
- 2026-10-30 21:23 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207's amendment: this run crashed (the machine ran out of memory) before writing any output, and nothing was read; the work is rerun under run:partdblocks-2, disposed separately
- 2026-10-30 21:33 UTC lead (session 20261030): review for run:partdblocks-3: satisfied — all 12 arms reported, none selected; Stage 2b classes copied, not recomputed
- 2026-10-30 21:33 UTC lead (session 20261030): review for run:partdblocks-2: not-applicable — re-read after D207 amendment 2: this run's output failed P88's self-check and was set aside unread (blocks-selfcheck-failed-c91854ee.json); the work is rerun under run:partdblocks-3, disposed separately
- 2026-10-30 21:34 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207 amendment 2: this first run crashed on memory before writing any output and nothing was read; superseded by run:partdblocks-2 (self-check failed, set aside) and run:partdblocks-3
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks-4: satisfied — all 12 arms reported, none selected; Stage 2b classes copied, not recomputed
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207 amendment 3: this first run crashed on memory before writing any output and nothing was read; superseded by run:partdblocks-4
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks-2: not-applicable — re-read after D207 amendment 3: this run's output failed P88's self-check and was set aside unread; superseded by run:partdblocks-4
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks-3: not-applicable — re-read after D207 amendment 3: this run stopped on the block guard with no output; nothing was read; superseded by run:partdblocks-4
- 2026-10-30 22:06 UTC lead (session 108deea8): review for commit:partd-1a-20261030: satisfied — D205 selects no member ('No placement, no family label, no closest member'); D210 is descriptive and selects none; no assessment row or tolerance changed.
- 2026-10-30 22:42 UTC lead (session 108deea8): review for run:triggers-build-smoke: not-applicable — No member is run or selected; data-only analysis of recorded tracks.
- 2026-10-31 00:20 UTC lead (session 108deea8): review for run:triggers-amend2: not-applicable — No simulation, member, model, spatial coupling or box: a scratch-script change to the item 1(b) analysis, synthetic checks and a 2-colony smoke rerun.
- 2026-10-31 00:37 UTC lead (session 108deea8): review for run:triggers-cal-full: not-applicable — No simulation, member, model, spatial coupling or box: a 100-seed synthetic calibration and the per-colony pass over recorded tracks, both local.
- 2026-10-31 00:41 UTC lead (session 108deea8): review for run:triggers-quorum: not-applicable — Synthetic data only: a frame dump from the synthetic generator and an independent implementation run on it; no simulation of the ant model, no box.
- 2026-10-31 00:42 UTC lead (session 108deea8): review for commit:item1b-design-20261031: not-applicable — No Stages 1-3 reading, member, band or multiplier is committed: the entries are item 1(b)'s design, decisions and builds (D211-D219).
- 2026-10-31 01:00 UTC lead (session 108deea8): review for run:triggers-read: not-applicable — No Stages 1-3 member is run, assessed or selected; item 1(b) is a data-only analysis.
- 2026-10-31 02:33 UTC lead (session 6b5fb317): review for run:foragers1c-build-smoke: not-applicable — no new member runs; stored Stage 2b runs are re-read
- 2026-10-31 02:57 UTC lead (session 6b5fb317): review for run:foragers1c-data: not-applicable — no new member runs
- 2026-10-31 02:57 UTC lead (session 6b5fb317): review for run:foragers1c-read: not-applicable — no new member runs
- 2026-10-31 03:23 UTC lead (session 6b5fb317): review for run:foragers1c-second: not-applicable — no new member runs
- 2026-10-31 03:34 UTC lead (session 6b5fb317): review for run:foragers1c-second: not-applicable — re-read D226 after its change: the change appends D228's result only (the independent check agrees); the check was a reproduction on existing records, so this commitment still does not bear on it
- 2026-10-31 03:35 UTC lead (session 6b5fb317): review for commit:partd-1b1c-20261031: not-applicable — no new members run
- 2026-10-31 04:22 UTC lead (session 548cad34): reviewed D231@68d492443f36; D231 cites D158 only to name the members; it restates the band results (F107) without new assessment, roles or tolerances, so P41 is unaffected
- 2026-11-02 05:57 UTC lead (session 0e89af04): reviewed D231@80fe73e46b1b; D231 cites D158 only for the member names; it reads the spatial profile from F107 descriptively and selects no member, so the bands, tolerances and the no-selection rule are untouched
