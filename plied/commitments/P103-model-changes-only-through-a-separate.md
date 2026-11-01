---
id: P103
title: Model changes only through a separate design
wording: Model changes would follow through a separate design.
made: D222
state: open
nodes: [T012, T023]
reviews:
  - action: run:foragers1c-build-smoke
    disposition: not-applicable
    because: "no model change: analysis scripts in scripts/scratch only"
    by: lead (session 6b5fb317)
    at: "2026-10-31 02:33 UTC"
    inputs:
      - record: D223
        rev: d91126ff338bb2e03861036626ef624304f4379bd9e707f9ad215faa8f1de646
      - record: D224
        rev: 40e58b5e95b78564c1257ba08746a92d3e52144e55d9f211b0ca5e809910b360
  - action: run:foragers1c-data
    disposition: not-applicable
    because: "no model change (D225: scratch analysis scripts only)"
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
    because: "no model change (D225: scratch analysis scripts only)"
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
    because: no model change
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
    because: no model change is committed; D226 and D227 leave any revision to a separate design
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
- 2026-10-31 02:17 UTC lead (session 6b5fb317): created — D222: model changes after item 1(c) need their own design
- 2026-10-31 02:32 UTC lead (session 6b5fb317): reviewed D223@d91126ff338b, D224@40e58b5e95b7; D224 restates it ('any model revision follows through a separate design'); D223 amendment 1 points to P103 in its reading. Open; no model change is in item 1(c)
- 2026-10-31 02:33 UTC lead (session 6b5fb317): review for run:foragers1c-build-smoke: not-applicable — no model change: analysis scripts in scripts/scratch only
- 2026-10-31 02:57 UTC lead (session 6b5fb317): review for run:foragers1c-data: not-applicable — no model change (D225: scratch analysis scripts only)
- 2026-10-31 02:57 UTC lead (session 6b5fb317): review for run:foragers1c-read: not-applicable — no model change (D225: scratch analysis scripts only)
- 2026-10-31 03:09 UTC lead (session 6b5fb317): reviewed D226@9b60eeb57b4b; D226's Next restates it: any model revision addressing slow coupling or post-entry activity is a separate design. No model change was made. Open
- 2026-10-31 03:23 UTC lead (session 6b5fb317): review for run:foragers1c-second: not-applicable — no model change
- 2026-10-31 03:34 UTC lead (session 6b5fb317): review for run:foragers1c-second: not-applicable — re-read D226 after its change: the change appends D228's result only (the independent check agrees); the check was a reproduction on existing records, so this commitment still does not bear on it
- 2026-10-31 03:35 UTC lead (session 6b5fb317): review for commit:partd-1b1c-20261031: satisfied — no model change is committed; D226 and D227 leave any revision to a separate design
- 2026-10-31 04:22 UTC lead (session 548cad34): reviewed D232@7e78fcc5a5c3; D232 lists P103 under Not in scope: the review changes no model and proposes no member; respected, not discharged
- 2026-10-31 04:23 UTC lead (session 548cad34): reviewed D231@68d492443f36; D231 cites D222 (P103's source) for the queen hypothesis H5 only; it proposes no model change, so P103 is respected, not discharged
- 2026-11-01 17:38 UTC lead (session f6ab21fd): reviewed D237@aeef03977adf; D237 read: the review runs nothing and changes no model; any check it proposes needs its own design. No change.
- 2026-11-01 18:21 UTC lead (session f6ab21fd): reviewed D237@2e84a192f41d, D238@7655ef093c1f; D237 (corrected) and D238 read: every proposed check needs its own design; nothing run or changed. No change.
