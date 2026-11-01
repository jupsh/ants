---
id: P03
title: Synchrony cause investigated before the structure freeze
wording: >-
  the cause of the synchrony is investigated and either modelled or its absence argued and disclosed
  before the freeze
summary: Blocker for freezing the model structure before any held-out colony test (user, 2026-10-17, D015).
made: S001
state: open
nodes: [T023, T036]
links: [D015, D107, D114]
reviews:
  - action: commit:20261029
    disposition: not-applicable
    because: A commit of records and code; no structure freeze is made.
    by: lead (session 20261029)
    at: "2026-10-29 21:24 UTC"
  - action: run:t057-judge-20261030
    disposition: not-applicable
    because: Governs the structure freeze; this judging run freezes nothing and changes no structure
    by: lead (session 9aa22476)
    at: "2026-10-30 04:50 UTC"
  - action: commit:partd-1b1c-20261031
    disposition: not-applicable
    because: >-
      no structure freeze: the commit records development readings; the synchrony cause stays open
      (T023, item 1(e) next)
    by: lead (session 6b5fb317)
    at: "2026-10-31 03:35 UTC"
    inputs:
      - record: D221
        rev: 2c4c00f83034f74f98234e2e799f1efc5b082fc738fb53e0883c666d6a11adbc
      - record: D226
        rev: 0772038601c49958aa6d4ffa11e0232dbc95648dd8485abef48c8abfc270d480
      - record: D228
        rev: e6f75b99836a72362b3c3186da6f861d048daec16ba326fd504555151c889b23
  - action: commit:h6-design-20261101
    disposition: not-triggered
    because: >-
      The commit records the T061 inventory (D240), the H6 design and its amendment (D241), the
      user's answers (D242), F108's update and plied records; no model change, analysis, run or
      reading of new results.
    by: lead (session f6ab21fd)
    at: "2026-11-01 22:46 UTC"
    inputs:
      - record: D242
        rev: 95cc70c9ace090981dbc595ffb10d18a35f19fdbcf8455a6bf43acf2b0db63fa
      - record: D241
        rev: 597483bc51a5737e117a90e3c044b57b707aa0098848143a71938914bc3ba4ca
      - record: D240
        rev: 5875f95982462051e5fa97516cc789db1066fed33cc94c549cb361b80746300d
---
Draft label: P3 (docs/threads-draft.md revision 2).

## History
- 2026-10-24 22:11 UTC lead (session 104e7640): created — migrated from docs/threads-draft.md revision 2 (D142)
- 2026-10-24 22:11 UTC lead (session 104e7640): set nodes=["T023","T036"] — attached to its nodes (D142)
- 2026-10-25 00:31 UTC lead (session 7c2d50fd): D144 (T049 scan review) cites this record's links; reviewed, nothing here changes (the cited promises are covered or discharged as D144 lists)
- 2026-10-29 20:08 UTC lead (session 7f762276): reviewed D181: Q05 makes rows 1 and 4 reported predictions rather than a freeze condition (P66, P67), and says the freeze still waits on the synchrony decision; P03 is unchanged and still open
- 2026-10-29 21:24 UTC lead (session 20261029): review for commit:20261029: not-applicable — A commit of records and code; no structure freeze is made.
- 2026-10-30 04:50 UTC lead (session 9aa22476): review for run:t057-judge-20261030: not-applicable — Governs the structure freeze; this judging run freezes nothing and changes no structure
- 2026-10-31 03:35 UTC lead (session 6b5fb317): review for commit:partd-1b1c-20261031: not-applicable — no structure freeze: the commit records development readings; the synchrony cause stays open (T023, item 1(e) next)
- 2026-11-01 22:46 UTC lead (session f6ab21fd): review for commit:h6-design-20261101: not-triggered — The commit records the T061 inventory (D240), the H6 design and its amendment (D241), the user's answers (D242), F108's update and plied records; no model change, analysis, run or reading of new results.
