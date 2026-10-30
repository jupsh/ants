---
id: P47
title: >-
  Stages 1-3 rows: support, missing statistics and a boundary-adapted MC rule fixed before
  assessment; a missing statistic blocks joint reproduction
wording: >-
  Before assessment, specify common colony support, missing-statistic handling and Monte Carlo
  precision for the corrected rows. … Adapt the frozen 100→400 maximum-budget rule to those
  boundaries, with "unresolved" when MC uncertainty could change a row's class. A missing required
  statistic prevents joint reproduction.
summary: Before Stage 2b.
made: D159
state: fulfilled
nodes: [T033]
resolved_by: D194
reviews:
  - action: run:q03-recheck-20261025
    disposition: not-applicable
    because: >-
      This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism,
      no spatial coupling, no assessment rows. Its own interval rule is frozen in D162 (missing rows
      block a pass); P47 governs the Stages 1-3 rows.
    by: lead (session 421f3ea4)
    at: "2026-10-25 16:55 UTC"
  - action: run:partd-bench-20261026
    disposition: not-applicable
    because: Not an assessment; P47's rules are still due before Stage 2b.
    by: lead (session 0cf57b71)
    at: "2026-10-26 01:31 UTC"
  - action: rent:partd2a-20261026
    disposition: not-applicable
    because: Calibration is not assessment; P47's rules come before Stage 2b.
    by: lead (session 0cf57b71)
    at: "2026-10-26 03:38 UTC"
  - action: rent:partd2a-20261026-d172
    disposition: not-applicable
    because: Calibration is not assessment; P47's rules come before Stage 2b (D171 item 1).
    by: lead (session d6df3027)
    at: "2026-10-26 16:07 UTC"
  - action: rent:partd2a-20261026-56637446
    disposition: not-applicable
    because: Calibration is not assessment; P47's rules come before Stage 2b (D171 item 1).
    by: lead (session d6df3027)
    at: "2026-10-26 16:14 UTC"
  - action: run:partd2a
    disposition: not-applicable
    because: Calibration is not assessment; P47's rules are fixed before Stage 2b (D171 item 1).
    by: lead (session d6df3027)
    at: "2026-10-26 16:16 UTC"
  - action: rent:partd2b-20261029
    disposition: satisfied
    because: >-
      Support, missing-statistic and MC rules specified and approved (D174 Part B, D178) before any
      assessment run; the missing-row clause binds the reading.
    by: lead (session 20261029)
    at: "2026-10-29 05:37 UTC"
  - action: run:partd2b-20261029
    disposition: satisfied
    because: Part B's rules approved before any assessment run (D178); the missing-row clause binds the reading.
    by: lead (session 20261029)
    at: "2026-10-29 05:44 UTC"
  - action: rent:partd2b-switch-20261029
    disposition: satisfied
    because: Part B approved (D178) before any assessment; the reruns of broken 2b runs use the same seeds.
    by: lead (session 20261029)
    at: "2026-10-29 14:49 UTC"
  - action: commit:20261029
    disposition: satisfied
    because: >-
      Support, missing-statistic and MC rules fixed (D174 Part B, approved D178); no assessment is
      read or committed.
    by: lead (session 20261029)
    at: "2026-10-29 21:23 UTC"
  - action: run:partd2-capfiles
    disposition: not-applicable
    because: The capability files are not the Stage 2b assessment rows.
    by: lead (session 20261029)
    at: "2026-10-29 21:47 UTC"
  - action: run:partd2b-read
    disposition: satisfied
    because: >-
      Support, missing-statistic and MC rules as approved (D178) and coded in the frozen reader
      (D185), its gap confirmed (D186).
    by: lead (session 20261029)
    at: "2026-10-29 22:36 UTC"
---

## History
- 2026-10-25 04:19 UTC lead (session 0bcdd30b): created
- 2026-10-25 04:25 UTC lead (session 0bcdd30b): reviewed D160: its own five state rows and tolerances belong to the recheck, not to Stages 1-3's rows; the support and MC rules for those are untouched.
- 2026-10-25 16:45 UTC lead (session 421f3ea4): reviewed D161: it approves the Q03 recheck design (T015) and confirms Stage 1 may proceed now, Stage 2a after the recheck reading; it mentions T033 only for that order. The recheck's own interval rule does not change P47's boundary-adapted MC rule for the Stages 1-3 rows.
- 2026-10-25 16:55 UTC lead (session 421f3ea4): review for run:q03-recheck-20261025: not-applicable — This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism, no spatial coupling, no assessment rows. Its own interval rule is frozen in D162 (missing rows block a pass); P47 governs the Stages 1-3 rows.
- 2026-10-25 18:12 UTC lead (session fe835760): reviewed D163: the recheck's five rows are colony-state diagnostics for the water start, not Part D assessment rows; no Part D rule, support, MC or reading wording is touched. Unaffected.
- 2026-10-25 18:24 UTC lead (session fe835760): reviewed D164: no support, missing-statistic or MC rule is touched; these are fixed before assessment. Unaffected.
- 2026-10-26 01:19 UTC lead (session 0cf57b71): reviewed D165: P47's support, missing-statistic and boundary-MC rules are still fixed before assessment; the precision forecast (P56, P57) is a separate, earlier item and does not replace them.
- 2026-10-26 01:27 UTC lead (session 0cf57b71): reviewed D166/D167: the forecast used each set's own estimable colonies, as P47's common support is not fixed; S2-J MC SE is <= 0.0003 per band. P47's support and boundary-MC rules are still due before assessment.
- 2026-10-26 01:31 UTC lead (session 0cf57b71): review for run:partd-bench-20261026: not-applicable — Not an assessment; P47's rules are still due before Stage 2b.
- 2026-10-26 03:36 UTC lead (session 0cf57b71): reviewed D170/D171: D171 orders P47's support, missing-statistic and boundary-MC rules after 2a, before 2b. Still open.
- 2026-10-26 03:38 UTC lead (session 0cf57b71): review for rent:partd2a-20261026: not-applicable — Calibration is not assessment; P47's rules come before Stage 2b.
- 2026-10-26 16:07 UTC lead (session d6df3027): review for rent:partd2a-20261026-d172: not-applicable — Calibration is not assessment; P47's rules come before Stage 2b (D171 item 1).
- 2026-10-26 16:14 UTC lead (session d6df3027): review for rent:partd2a-20261026-56637446: not-applicable — Calibration is not assessment; P47's rules come before Stage 2b (D171 item 1).
- 2026-10-26 16:16 UTC lead (session d6df3027): review for run:partd2a: not-applicable — Calibration is not assessment; P47's rules are fixed before Stage 2b (D171 item 1).
- 2026-10-29 01:26 UTC lead (session 20261029): reviewed D173-D175: D174 Part B proposes the support (common, per-arm fallback below 15 colonies), missing-row and S2-J MC (100 -> 400 draws, 2 MC SE from +/-0.015) rules; D175 approved Part A only, so Part B waits on Q21. Still open; binds before Stage 2b.
- 2026-10-29 05:27 UTC lead (session 20261029): reviewed D176: it builds Part A only; Part B's support, missing and MC rules for the assessment rows are not built and still wait on Q21. Open.
- 2026-10-29 05:32 UTC lead (session 20261029): reviewed D177: it states explicitly that Q21 Part B (P47's rules) is not answered. Open.
- 2026-10-29 05:33 UTC lead (session 20261029): D178: the user approved D174 Part B, so the support, missing-statistic and MC rules are specified before assessment (first clause met). Kept open: 'a missing required statistic prevents joint reproduction' binds the Stage 2b reading.
- 2026-10-29 05:37 UTC lead (session 20261029): review for rent:partd2b-20261029: satisfied — Support, missing-statistic and MC rules specified and approved (D174 Part B, D178) before any assessment run; the missing-row clause binds the reading.
- 2026-10-29 05:44 UTC lead (session 20261029): review for run:partd2b-20261029: satisfied — Part B's rules approved before any assessment run (D178); the missing-row clause binds the reading.
- 2026-10-29 14:49 UTC lead (session 20261029): review for rent:partd2b-switch-20261029: satisfied — Part B approved (D178) before any assessment; the reruns of broken 2b runs use the same seeds.
- 2026-10-29 21:23 UTC lead (session 20261029): review for commit:20261029: satisfied — Support, missing-statistic and MC rules fixed (D174 Part B, approved D178); no assessment is read or committed.
- 2026-10-29 21:47 UTC lead (session 20261029): review for run:partd2-capfiles: not-applicable — The capability files are not the Stage 2b assessment rows.
- 2026-10-29 22:15 UTC lead (session 20261029): reviewed D185: the reader implements P47's support, missing-statistic and MC rules as approved (D178); one gap-filling raised as Q23; P47 applies at the reading
- 2026-10-29 22:36 UTC lead (session 20261029): review for run:partd2b-read: satisfied — Support, missing-statistic and MC rules as approved (D178) and coded in the frozen reader (D185), its gap confirmed (D186).
- 2026-10-30 05:36 UTC lead (session 9d2b15e6): reviewed D194: D194 applied P47's rules through D185's frozen reader: common support on all 20 rows (22/20 colonies), no missing statistic, the 100->400 extension for Eu-M and Eu, and Eu-M's S2-J >= 40 mm left unresolved (MC). The rules governed the 2b assessment, now read; the capability reading has its own rule (P59-P62). Leaving it open for the lead to close against D194 with the user's view.
- 2026-10-30 05:36 UTC lead (session 9d2b15e6): set state=fulfilled; set resolved_by=D194 — P47's rules were specified and frozen before assessment (D174 Part B, D178, D185, D186) and D194 applied them: common support on all 20 rows, no missing statistic, the 100->400 extension adapted to the S2-J boundaries with Eu-M's row unresolved (MC). Supersedes this session's earlier note that left closing open.
