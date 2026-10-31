---
id: P67
title: Held-out test reported incomplete for contacts if the observer is unvalidated
wording: >-
  If the contact observer is not validated by step 9, the held-out test is reported as incomplete
  for contacts.
made: D181
state: open
nodes: [T036, T010]
reviews:
  - action: commit:20261029
    disposition: not-applicable
    because: The held-out test is not reported by a commit.
    by: lead (session 20261029)
    at: "2026-10-29 21:24 UTC"
  - action: run:t057-judge-20261030
    disposition: not-applicable
    because: Governs reporting of the step-9 held-out test; no held-out test runs here
    by: lead (session 9aa22476)
    at: "2026-10-30 04:50 UTC"
  - action: commit:partd-1a-20261030
    disposition: not-applicable
    because: The held-out test is not reported by this commit.
    by: lead (session 108deea8)
    at: "2026-10-30 22:07 UTC"
---

## History
- 2026-10-29 20:05 UTC lead (session 7f762276): created — D181 Q05 (the conditional)
- 2026-10-29 20:16 UTC lead (session 7f762276): reviewed D182: names D181 only for Q11; it concerns the 1999 contact definition, not the Stroeymeyt observer this commitment is about
- 2026-10-29 21:24 UTC lead (session 20261029): review for commit:20261029: not-applicable — The held-out test is not reported by a commit.
- 2026-10-30 04:45 UTC lead (session 9aa22476): reviewed D191: it cites D181 only as the source of the Q04 judge; D181's answer on the held-out contact test is not touched by T057's L0S1 judge, so P67 is unaffected
- 2026-10-30 04:50 UTC lead (session 9aa22476): review for run:t057-judge-20261030: not-applicable — Governs reporting of the step-9 held-out test; no held-out test runs here
- 2026-10-30 05:00 UTC lead (session 9aa22476): reviewed D193: it cites D181 only for the scope of the Q04 judge (sensitivity, no refit); the reading touches none of D181's answer on reporting the contact held-out test, so P67 is unaffected
- 2026-10-30 22:07 UTC lead (session 108deea8): review for commit:partd-1a-20261030: not-applicable — The held-out test is not reported by this commit.
- 2026-10-31 02:17 UTC lead (session 6b5fb317): reviewed D223@b738f2de5839; D223 cites D181 only for B005's Done-when 1; it uses no contact observer and no held-out test, so P67 is unaffected
- 2026-10-31 02:32 UTC lead (session 6b5fb317): reviewed D223@d91126ff338b; D223 amendment 1 adds no contact observer or held-out test; D181 still cited only for B005's Done-when 1. Unaffected
