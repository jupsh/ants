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
