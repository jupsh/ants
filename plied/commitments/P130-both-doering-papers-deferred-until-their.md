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
  - action: commit:t060-stage0-design-20261102
    disposition: satisfied
    because: >-
      The commit records T060's design (D243 with amendment 1), the user's answer (D244), STATUS's
      pointer and plied records only; nothing is built, run, fitted or read; neither Doering paper
      is read or cited in D243 or D244.
    by: lead (session 7b85e17e)
    at: "2026-11-02 03:34 UTC"
    inputs:
      - record: D243
        rev: a5fef01895d5a78df9941aa9914c404b673e2e4c311a0c7f0d2afc721813260b
      - record: D244
        rev: 8f3c0feeac9407fabac76aaf0ebf0f44d21bfbe13bc4d9b92233335bdf600a3c
  - action: commit:h6-design-20261101
    disposition: satisfied
    because: >-
      Re-read D241@36eec164deeb: since the 597483 bytes this review read (the bytes committed in
      f9ad78f), only two blocks were appended, the lead's implementation details (onset rule, 25 mm
      radius, S1 sampling, runs, queens) and amendment 2 (D246). The commit holds the version read,
      so this disposition for it stands; the additions are reviewed at the next commit's gate.
    by: lead (session 0e89af04)
    at: "2026-11-02 05:55 UTC"
    inputs:
      - record: D241
        rev: 36eec164deeba73a16dff9496b8751e4f5e97dac430d82b680322735d3dd2280
  - action: commit:h6-design-20261101
    disposition: satisfied
    because: >-
      Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's
      cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed)
      (and, since the 597483/2b609a47 pins, the lead's implementation details and amendment 2,
      reviewed at 05:5x UTC). The commit holds the version first read (597483), so this disposition
      for it stands; the later text is reviewed at the next commit's gate.
    by: lead (session 0e89af04)
    at: "2026-11-02 15:32 UTC"
    inputs:
      - record: D241
        rev: 07a71b62d68a8e5fc8683b31f3075cc5bbfe0ceae9456ec136104339bfcbf2a9
  - action: commit:h6-design-20261101
    disposition: satisfied
    because: >-
      Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and
      extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules
      or any amendment. The commit holds the version it was gated on; the later text is reviewed at
      the next commit's gate (commit:h6-freeze-20261102).
    by: lead (session eac59010)
    at: "2026-11-03 00:05 UTC"
    inputs:
      - record: D241
        rev: b1dd437cb8eb845458917e3f9ecf780f783e4ff2bbacbe3adccc128e70630f74
  - action: commit:h6-reading-20261103
    disposition: not-triggered
    because: D260 and F113-F116 cite no Doering paper and use none of their data.
    by: lead (session f6353347)
    at: "2026-11-03 01:00 UTC"
    inputs:
      - record: D260
        rev: 33ffee2d7b35cc68baca7141a758621b02f8e5a016a185532a7b57b6aa1126cf
---

## History
- 2026-11-01 17:17 UTC lead (session f6ab21fd): created — D235: the user's decision on Q28
- 2026-11-01 17:19 UTC lead (session f6ab21fd): review for commit:synchrony-stage1-20261101: satisfied — Neither Doering paper's PDF is in literature/ or pinned; both deferred in D235.
- 2026-11-01 17:27 UTC lead (session f6ab21fd): reviewed D236@95b5f98a08b3; D236 (Despland & Simpson 2006 added as the eighth tier-1 paper) read; no change to this commitment's state.
- 2026-11-01 17:29 UTC lead (session f6ab21fd): review for commit:synchrony-d236-20261101: satisfied — Neither Doering paper is in literature/ or pinned.
- 2026-11-01 18:20 UTC lead (session f6ab21fd): set nodes=["T058","T023"] — kept open beyond T058's close: the Doering papers return if their provenance is clarified
- 2026-11-01 18:21 UTC lead (session f6ab21fd): review for commit:synchrony-review-20261101: satisfied — Neither Doering paper is pinned or in literature/; the note marks both as deferred abstracts.
- 2026-11-01 22:46 UTC lead (session f6ab21fd): review for commit:h6-design-20261101: satisfied — Neither Doering paper is pinned or read.
- 2026-11-02 03:34 UTC lead (session 7b85e17e): review for commit:t060-stage0-design-20261102: satisfied — The commit records T060's design (D243 with amendment 1), the user's answer (D244), STATUS's pointer and plied records only; nothing is built, run, fitted or read; neither Doering paper is read or cited in D243 or D244.
- 2026-11-02 05:55 UTC lead (session 0e89af04): review for commit:h6-design-20261101: satisfied — Re-read D241@36eec164deeb: since the 597483 bytes this review read (the bytes committed in f9ad78f), only two blocks were appended, the lead's implementation details (onset rule, 25 mm radius, S1 sampling, runs, queens) and amendment 2 (D246). The commit holds the version read, so this disposition for it stands; the additions are reviewed at the next commit's gate.
- 2026-11-02 15:32 UTC lead (session 0e89af04): review for commit:h6-design-20261101: satisfied — Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed) (and, since the 597483/2b609a47 pins, the lead's implementation details and amendment 2, reviewed at 05:5x UTC). The commit holds the version first read (597483), so this disposition for it stands; the later text is reviewed at the next commit's gate.
- 2026-11-03 00:05 UTC lead (session eac59010): review for commit:h6-design-20261101: satisfied — Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules or any amendment. The commit holds the version it was gated on; the later text is reviewed at the next commit's gate (commit:h6-freeze-20261102).
- 2026-11-03 01:00 UTC lead (session f6353347): review for commit:h6-reading-20261103: not-triggered — D260 and F113-F116 cite no Doering paper and use none of their data.
