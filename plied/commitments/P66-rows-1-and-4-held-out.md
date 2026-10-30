---
id: P66
title: "Rows 1 and 4: held-out predictions, failures reported"
wording: >-
  rows 1 and 4 are held-out predictions, judged and reported, failures included; passing them is not
  a condition of the structure freeze.
made: D181
state: open
nodes: [T036]
reviews:
  - action: commit:20261029
    disposition: not-applicable
    because: No held-out rows are judged or reported by committing.
    by: lead (session 20261029)
    at: "2026-10-29 21:24 UTC"
  - action: run:t057-judge-20261030
    disposition: not-applicable
    because: >-
      Governs the step-9 held-out test of rows 1 and 4; this run is a development judge of the 1999
      fit rows, no held-out data
    by: lead (session 9aa22476)
    at: "2026-10-30 04:50 UTC"
---

## History
- 2026-10-29 20:05 UTC lead (session 7f762276): created — D181 Q05 (the scope rule)
- 2026-10-29 20:16 UTC lead (session 7f762276): reviewed D182: names D181 only for Q11; the rows 1 / 4 rule is unaffected
- 2026-10-29 21:24 UTC lead (session 20261029): review for commit:20261029: not-applicable — No held-out rows are judged or reported by committing.
- 2026-10-30 04:45 UTC lead (session 9aa22476): reviewed D191: it cites D181 only as the source of the Q04 judge; D181's answer on rows 1 and 4 is not touched by T057's L0S1 judge, so P66 is unaffected
- 2026-10-30 04:50 UTC lead (session 9aa22476): review for run:t057-judge-20261030: not-applicable — Governs the step-9 held-out test of rows 1 and 4; this run is a development judge of the 1999 fit rows, no held-out data
- 2026-10-30 05:00 UTC lead (session 9aa22476): reviewed D193: it cites D181 only for the scope of the Q04 judge (sensitivity, no refit); the reading touches none of D181's answer on rows 1 and 4 as held-out predictions, so P66 is unaffected
