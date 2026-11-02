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
  - action: commit:t060-stage0-design-20261102
    disposition: not-triggered
    because: >-
      The commit records T060's design (D243 with amendment 1), the user's answer (D244), STATUS's
      pointer and plied records only; nothing is built, run, fitted or read; no held-out rows are
      judged or reported.
    by: lead (session 7b85e17e)
    at: "2026-11-02 03:34 UTC"
    inputs:
      - record: D243
        rev: a5fef01895d5a78df9941aa9914c404b673e2e4c311a0c7f0d2afc721813260b
      - record: D244
        rev: 8f3c0feeac9407fabac76aaf0ebf0f44d21bfbe13bc4d9b92233335bdf600a3c
---

## History
- 2026-10-29 20:05 UTC lead (session 7f762276): created — D181 Q05 (the scope rule)
- 2026-10-29 20:16 UTC lead (session 7f762276): reviewed D182: names D181 only for Q11; the rows 1 / 4 rule is unaffected
- 2026-10-29 21:24 UTC lead (session 20261029): review for commit:20261029: not-applicable — No held-out rows are judged or reported by committing.
- 2026-10-30 04:45 UTC lead (session 9aa22476): reviewed D191: it cites D181 only as the source of the Q04 judge; D181's answer on rows 1 and 4 is not touched by T057's L0S1 judge, so P66 is unaffected
- 2026-10-30 04:50 UTC lead (session 9aa22476): review for run:t057-judge-20261030: not-applicable — Governs the step-9 held-out test of rows 1 and 4; this run is a development judge of the 1999 fit rows, no held-out data
- 2026-10-30 05:00 UTC lead (session 9aa22476): reviewed D193: it cites D181 only for the scope of the Q04 judge (sensitivity, no refit); the reading touches none of D181's answer on rows 1 and 4 as held-out predictions, so P66 is unaffected
- 2026-10-31 02:17 UTC lead (session 6b5fb317): reviewed D223@b738f2de5839; D223 cites D181 only to name B005's Done-when 1 as an open option; it uses development data only and judges no held-out row, so rows 1 and 4 are untouched
- 2026-10-31 02:32 UTC lead (session 6b5fb317): reviewed D223@d91126ff338b; D223 amendment 1 (D224) adds the decomposition reading, spell labels, survival support and the entry benchmark; D181 is still cited only for B005's Done-when 1, now left out. No held-out row is judged, so P66 is untouched
- 2026-11-02 03:34 UTC lead (session 7b85e17e): review for commit:t060-stage0-design-20261102: not-triggered — The commit records T060's design (D243 with amendment 1), the user's answer (D244), STATUS's pointer and plied records only; nothing is built, run, fitted or read; no held-out rows are judged or reported.
