---
id: P57
title: >-
  Part D precision forecast: all 20 rows, sources and limits stated, unresolved where unsupported,
  never a filter; smoke statistics unused
wording: >-
  Cover all 20 assessment rows. State the forecast's evidence sources, assumptions and precision
  limitations. Where the available evidence cannot support a forecast, mark it unresolved. The
  forecast must never remove a row from the all-20 equivalence requirement. Do not use the
  uninspected smoke statistics to construct it or carry the toy selected strengths into production
  calibration.
made: D165
state: open
nodes: [T033]
links: [P28, P41]
reviews:
  - action: run:partd-bench-20261026
    disposition: satisfied
    because: >-
      The bench uses strength 2 for every member, fixed in D168; no smoke-selected strength and no
      smoke output is used (the smoke paths are sealed). No row is involved.
    by: lead (session 0cf57b71)
    at: "2026-10-26 01:31 UTC"
  - action: rent:partd2a-20261026
    disposition: satisfied
    because: >-
      Stage 2a writes logs/partd2 with pd- tags; the smoke's sealed outputs and strengths are never
      copied to the box (box setup copies no logs) or read.
    by: lead (session 0cf57b71)
    at: "2026-10-26 03:38 UTC"
  - action: rent:partd2a-20261026-d172
    disposition: satisfied
    because: >-
      Stage 2a writes logs/partd2 with pd- tags; the smoke's sealed outputs and strengths are never
      copied to the box (box setup copies no logs) or read.
    by: lead (session d6df3027)
    at: "2026-10-26 16:07 UTC"
  - action: rent:partd2a-20261026-56637446
    disposition: satisfied
    because: >-
      Stage 2a writes logs/partd2 with pd- tags; the smoke's sealed outputs and strengths are never
      copied to the box (box setup copies no logs) or read.
    by: lead (session d6df3027)
    at: "2026-10-26 16:14 UTC"
  - action: run:partd2a
    disposition: satisfied
    because: >-
      Calibration uses D158's grid; the box has no logs/ (setup copies none), so the sealed smoke
      outputs and toy strengths cannot be read or carried in.
    by: lead (session d6df3027)
    at: "2026-10-26 16:16 UTC"
  - action: rent:partd2b-20261029
    disposition: satisfied
    because: >-
      No forecast is built or changed; setup copies no logs, so the sealed smoke outputs cannot
      reach the box; only the 22 Stage 2a calib/verify files are pushed.
    by: lead (session 20261029)
    at: "2026-10-29 05:37 UTC"
  - action: run:partd2b-20261029
    disposition: satisfied
    because: >-
      The box received only the 22 Stage 2a calib/verify files; no smoke output or toy strength can
      reach it.
    by: lead (session 20261029)
    at: "2026-10-29 05:44 UTC"
  - action: rent:partd2b-switch-20261029
    disposition: satisfied
    because: Only logs/short and logs/partd2 from this run are carried; no smoke output exists on the old box.
    by: lead (session 20261029)
    at: "2026-10-29 14:49 UTC"
  - action: commit:20261029
    disposition: not-applicable
    because: The precision forecast (D166/D167) is committed unchanged; no forecast is used as a filter.
    by: lead (session 20261029)
    at: "2026-10-29 21:23 UTC"
---

## History
- 2026-10-26 01:18 UTC lead (session 0cf57b71): created — D165 item 3
- 2026-10-26 01:26 UTC lead (session 0cf57b71): D166/D167: all 20 rows forecast; sources, assumptions and limits stated; 15 rows forecast unresolved under the proxy-spread rule; the smoke's outputs sealed and unread. Stays open: no row may leave the all-20 requirement at assessment, and the smoke's strengths are never carried into Stage 2a.
- 2026-10-26 01:31 UTC lead (session 0cf57b71): review for run:partd-bench-20261026: satisfied — The bench uses strength 2 for every member, fixed in D168; no smoke-selected strength and no smoke output is used (the smoke paths are sealed). No row is involved.
- 2026-10-26 03:36 UTC lead (session 0cf57b71): reviewed D170/D171: Stage 2a will run into logs/partd2 with pd- tags, separate from the sealed smoke's; the smoke's strengths are never read. Still open through Stage 2.
- 2026-10-26 03:38 UTC lead (session 0cf57b71): review for rent:partd2a-20261026: satisfied — Stage 2a writes logs/partd2 with pd- tags; the smoke's sealed outputs and strengths are never copied to the box (box setup copies no logs) or read.
- 2026-10-26 16:07 UTC lead (session d6df3027): review for rent:partd2a-20261026-d172: satisfied — Stage 2a writes logs/partd2 with pd- tags; the smoke's sealed outputs and strengths are never copied to the box (box setup copies no logs) or read.
- 2026-10-26 16:14 UTC lead (session d6df3027): review for rent:partd2a-20261026-56637446: satisfied — Stage 2a writes logs/partd2 with pd- tags; the smoke's sealed outputs and strengths are never copied to the box (box setup copies no logs) or read.
- 2026-10-26 16:16 UTC lead (session d6df3027): review for run:partd2a: satisfied — Calibration uses D158's grid; the box has no logs/ (setup copies none), so the sealed smoke outputs and toy strengths cannot be read or carried in.
- 2026-10-29 01:26 UTC lead (session 20261029): reviewed D175 (via T033): the capability rule does not use the precision forecast or remove any of the 20 rows. Unaffected.
- 2026-10-29 05:27 UTC lead (session 20261029): reviewed D176: the forecast is neither used nor changed by the capability build. Unaffected.
- 2026-10-29 05:32 UTC lead (session 20261029): reviewed D177: the forecast is not involved. Unaffected.
- 2026-10-29 05:34 UTC lead (session 20261029): reviewed D178: Part B's support rule replaces the forecast's per-set estimable colonies for the actual reading; the forecast stays descriptive and never removes a row. Unaffected.
- 2026-10-29 05:37 UTC lead (session 20261029): review for rent:partd2b-20261029: satisfied — No forecast is built or changed; setup copies no logs, so the sealed smoke outputs cannot reach the box; only the 22 Stage 2a calib/verify files are pushed.
- 2026-10-29 05:44 UTC lead (session 20261029): review for run:partd2b-20261029: satisfied — The box received only the 22 Stage 2a calib/verify files; no smoke output or toy strength can reach it.
- 2026-10-29 14:49 UTC lead (session 20261029): review for rent:partd2b-switch-20261029: satisfied — Only logs/short and logs/partd2 from this run are carried; no smoke output exists on the old box.
- 2026-10-29 21:23 UTC lead (session 20261029): review for commit:20261029: not-applicable — The precision forecast (D166/D167) is committed unchanged; no forecast is used as a filter.
