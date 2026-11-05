---
id: P70
title: "B005: a mixture is a class, not foraging intent"
wording: >-
  A two-component mixture is reported as a distinct duration / reach class, not as a difference in
  foraging intent.
made: D181
state: open
nodes: [T012]
reviews:
  - action: commit:partd-1a-20261030
    disposition: not-applicable
    because: No B005 mixture is reported in this commit.
    by: lead (session 108deea8)
    at: "2026-10-30 22:07 UTC"
  - action: commit:item1b-design-20261031
    disposition: not-applicable
    because: No B005 mixture is reported.
    by: lead (session 108deea8)
    at: "2026-10-31 00:42 UTC"
  - action: run:foragers1c-build-smoke
    disposition: not-applicable
    because: no mixture is fitted (B005's data side left out, D224)
    by: lead (session 6b5fb317)
    at: "2026-10-31 02:33 UTC"
    inputs:
      - record: D223
        rev: d91126ff338bb2e03861036626ef624304f4379bd9e707f9ad215faa8f1de646
      - record: D224
        rev: 40e58b5e95b78564c1257ba08746a92d3e52144e55d9f211b0ca5e809910b360
  - action: run:foragers1c-data
    disposition: not-applicable
    because: no mixture fitted (D224)
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
    because: no mixture fitted (D224)
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
    because: no mixture fitted
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
    disposition: satisfied
    because: no mixture is fitted; D226 says B005 stays separate
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
    at: "2026-11-03 16:41 UTC"
---

## History
- 2026-10-29 20:05 UTC lead (session 7f762276): created — D181 Q08
- 2026-10-29 20:16 UTC lead (session 7f762276): reviewed D182: names D181 only for Q11; B005's trip audit is unaffected
- 2026-10-30 04:45 UTC lead (session 9aa22476): reviewed D191: it cites D181 only as the source of the Q04 judge; D181's answer on B005 is not touched by T057's L0S1 judge, so P70 is unaffected
- 2026-10-30 05:00 UTC lead (session 9aa22476): reviewed D193: it cites D181 only for the scope of the Q04 judge (sensitivity, no refit); the reading touches none of D181's answer on B005's mixture reading, so P70 is unaffected
- 2026-10-30 22:07 UTC lead (session 108deea8): review for commit:partd-1a-20261030: not-applicable — No B005 mixture is reported in this commit.
- 2026-10-31 00:42 UTC lead (session 108deea8): review for commit:item1b-design-20261031: not-applicable — No B005 mixture is reported.
- 2026-10-31 02:18 UTC lead (session 6b5fb317): reviewed D222@1bbe791636e9, D223@b738f2de5839; D222 restates the rule in the user's words for item 1(c) (any B005 mixture a duration/reach class); D223 fits no mixture and quotes P70 as a reading rule for a later fit. Still open, nothing reported against it yet
- 2026-10-31 02:32 UTC lead (session 6b5fb317): reviewed D223@d91126ff338b; D223 amendment 1 (D224) leaves B005's data-side mixture out, so no mixture is fitted in item 1(c); P70 stays open for B005
- 2026-10-31 02:33 UTC lead (session 6b5fb317): review for run:foragers1c-build-smoke: not-applicable — no mixture is fitted (B005's data side left out, D224)
- 2026-10-31 02:57 UTC lead (session 6b5fb317): review for run:foragers1c-data: not-applicable — no mixture fitted (D224)
- 2026-10-31 02:57 UTC lead (session 6b5fb317): review for run:foragers1c-read: not-applicable — no mixture fitted (D224)
- 2026-10-31 03:09 UTC lead (session 6b5fb317): reviewed D226@9b60eeb57b4b; D226 fits no mixture and cites P70 only to say B005 stays separate (D224); P70 stays open for B005
- 2026-10-31 03:23 UTC lead (session 6b5fb317): review for run:foragers1c-second: not-applicable — no mixture fitted
- 2026-10-31 03:34 UTC lead (session 6b5fb317): review for run:foragers1c-second: not-applicable — re-read D226 after its change: the change appends D228's result only (the independent check agrees); the check was a reproduction on existing records, so this commitment still does not bear on it
- 2026-10-31 03:35 UTC lead (session 6b5fb317): review for commit:partd-1b1c-20261031: satisfied — no mixture is fitted; D226 says B005 stays separate
- 2026-11-03 16:31 UTC lead (session e38b977a): reviewed X030@e0fc1a79ac45; X030 cites D181 for B016's exposure rules only; nothing on B005's mixture classes. Unaffected.
- 2026-11-03 16:32 UTC lead (session e38b977a): reviewed D271@59fa1169345e; D271 cites D181 for B016's exposure rules only; nothing on B005. Unaffected.
- 2026-11-03 16:41 UTC lead (session e38b977a): review for merge:browser-sim-m1@f8d29d5: not-triggered — A local fast-forward of main (8bc7789) to browser-sim-m1 (f8d29d5): it adds no content beyond the 18 commits already on the branch, each of them gated when made (commit:synchrony-review-20261101 ... commit:b016-records-20261103), where the content this commitment governs was reviewed. Nothing is pushed or published by this step. No freeze, model change, run, held-out use or new reading is in it.
