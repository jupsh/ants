---
id: P05
title: Directed navigation frozen before any E6 run
wording: >-
  parameters from the literature, frozen in this file before any E6 run (E6's T50 has been
  inspected); own tests and invariants; run-hash check that the 1999 rows and E2 do not change,
  against a baseline at 157cd66 or later
summary: >-
  "This file" is STATUS (E6 pre-registration, 2026-10-09; baseline clause after the 2026-10-10 wall
  fix).
made: S001
state: open
nodes: [T040, T038]
reviews:
  - action: commit:20261029
    disposition: not-applicable
    because: No E6 run; the commit freezes nothing for E6.
    by: lead (session 20261029)
    at: "2026-10-29 21:24 UTC"
  - action: run:t057-judge-20261030
    disposition: not-applicable
    because: Governs E6 runs; this is a 1999 judge, no E6 run
    by: lead (session 9aa22476)
    at: "2026-10-30 04:50 UTC"
---
Draft label: P5 (docs/threads-draft.md revision 2).

## History
- 2026-10-24 22:11 UTC lead (session 104e7640): created — migrated from docs/threads-draft.md revision 2 (D142)
- 2026-10-24 22:11 UTC lead (session 104e7640): set nodes=["T040","T038"] — attached to its nodes (D142)
- 2026-10-25 00:31 UTC lead (session 7c2d50fd): D144 (T049 scan review) cites this record's links; reviewed, nothing here changes (the cited promises are covered or discharged as D144 lists)
- 2026-10-29 21:24 UTC lead (session 20261029): review for commit:20261029: not-applicable — No E6 run; the commit freezes nothing for E6.
- 2026-10-30 04:50 UTC lead (session 9aa22476): review for run:t057-judge-20261030: not-applicable — Governs E6 runs; this is a 1999 judge, no E6 run
