---
id: T060
title: "Contact-reset timing test: design (D238 item 2)"
parent: T023
status: open
next: 2
actor: lead
links: [D237, D238, D243, Q32, D244]
---

## History
- 2026-11-01 18:20 UTC lead (session f6ab21fd): created — D238: the user's second next work
- 2026-11-01 19:12 UTC lead (session f6ab21fd): reviewed D239@a5d3879fe9c2, D240@5875f9598246; D239 and D240 read: no change here (D240 is the T061 inventory; D239 starts T059 and T061).
- 2026-11-01 19:16 UTC lead (session f6ab21fd): reviewed D241@c351e62616d5; D241 (H6 design proposal) read: it cites this record's links for context; nothing here changes.
- 2026-11-01 22:45 UTC lead (session f6ab21fd): reviewed D241@597483bc51a5, D242@95cc70c9ace0; D241 amendment 1 and D242 read: nothing here changes beyond what D242's commitments record.
- 2026-11-02 03:14 UTC lead (session 7b85e17e): reviewed D241@3bb427d5e808; D241's implementation details (onset definition from onsetStats.ts, 25 mm coverage radius, S1 sampling, runs, queens) read: T060 reuses the onset definition and replaces the fixed coverage radius with a blind-opportunity rule for whole intervals (D243); nothing else here changes
- 2026-11-02 03:14 UTC lead (session 7b85e17e): set actor=user; added D243 to links; added Q32 to links — D243: design drafted; waiting on the user's approval (Q32)
- 2026-11-02 03:29 UTC lead (session 7b85e17e): set actor=lead; added D244 to links — D244: D243 approved with amendments (amendment 1); next, the Stage 0 extraction, matching and V0 checks by the implementer, once H6's onset, contact, coverage and zone code (T059) is built and checked; Stage 1 deferred
