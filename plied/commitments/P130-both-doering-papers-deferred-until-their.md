---
id: P130
title: Both Doering papers deferred until their data provenance is clarified
wording: Defer both Doering papers pending data-provenance clarification.
made: D235
state: open
nodes: [T058, T023]
reviews:
  - action: commit:synchrony-stage1-20261101
    disposition: satisfied
    because: Neither Doering paper's PDF is in literature/ or pinned; both deferred in D235.
    by: lead (session f6ab21fd)
    at: "2026-11-01 17:19 UTC"
    inputs:
      - record: D234
        rev: 3ab0d191d96fe2ee3e9e14b104ac1c4599cc650c1ec60e1c06c4a3e7b4aa9a8b
      - record: D235
        rev: afeabe355110bf2f83b5d38e32566090d8a1f8d742cd9e381fe0e21fb6155e98
  - action: commit:synchrony-d236-20261101
    disposition: satisfied
    because: Neither Doering paper is in literature/ or pinned.
    by: lead (session f6ab21fd)
    at: "2026-11-01 17:29 UTC"
    inputs:
      - record: D236
        rev: 95b5f98a08b3714b9440375496076e499447c6a751b62561d37c5fd381122950
      - record: D235
        rev: afeabe355110bf2f83b5d38e32566090d8a1f8d742cd9e381fe0e21fb6155e98
  - action: commit:synchrony-review-20261101
    disposition: satisfied
    because: Neither Doering paper is pinned or in literature/; the note marks both as deferred abstracts.
    by: lead (session f6ab21fd)
    at: "2026-11-01 18:21 UTC"
    inputs:
      - record: D238
        rev: 7655ef093c1ff672b1ac5bc85031076c4f54bf6478f98f5dfc141dceb0905e92
  - action: commit:h6-design-20261101
    disposition: satisfied
    because: Neither Doering paper is pinned or read.
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

## History
- 2026-11-01 17:17 UTC lead (session f6ab21fd): created — D235: the user's decision on Q28
- 2026-11-01 17:19 UTC lead (session f6ab21fd): review for commit:synchrony-stage1-20261101: satisfied — Neither Doering paper's PDF is in literature/ or pinned; both deferred in D235.
- 2026-11-01 17:27 UTC lead (session f6ab21fd): reviewed D236@95b5f98a08b3; D236 (Despland & Simpson 2006 added as the eighth tier-1 paper) read; no change to this commitment's state.
- 2026-11-01 17:29 UTC lead (session f6ab21fd): review for commit:synchrony-d236-20261101: satisfied — Neither Doering paper is in literature/ or pinned.
- 2026-11-01 18:20 UTC lead (session f6ab21fd): set nodes=["T058","T023"] — kept open beyond T058's close: the Doering papers return if their provenance is clarified
- 2026-11-01 18:21 UTC lead (session f6ab21fd): review for commit:synchrony-review-20261101: satisfied — Neither Doering paper is pinned or in literature/; the note marks both as deferred abstracts.
- 2026-11-01 22:46 UTC lead (session f6ab21fd): review for commit:h6-design-20261101: satisfied — Neither Doering paper is pinned or read.
