---
id: P135
title: "Contact-reset design: identifiability of the three-interval comparison established first"
wording: >-
  Establish whether complete event histories and suitable controls make the three-interval
  comparison identifiable.
made: D238
state: open
nodes: [T060]
reviews:
  - action: commit:synchrony-review-20261101
    disposition: not-triggered
    because: >-
      Governs designs not yet written (T059-T061); the commit records the accepted review, D238 and
      the plied threads only.
    by: lead (session f6ab21fd)
    at: "2026-11-01 18:21 UTC"
    inputs:
      - record: D238
        rev: 7655ef093c1ff672b1ac5bc85031076c4f54bf6478f98f5dfc141dceb0905e92
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
  - action: commit:t060-stage0-design-20261102
    disposition: not-triggered
    because: >-
      The commit records T060's design (D243 with amendment 1), the user's answer (D244), STATUS's
      pointer and plied records only; nothing is built, run, fitted or read; D243 designs Stage 0 to
      establish identifiability, which is established only when Stage 0 is read.
    by: lead (session 7b85e17e)
    at: "2026-11-02 03:34 UTC"
    inputs:
      - record: D243
        rev: a5fef01895d5a78df9941aa9914c404b673e2e4c311a0c7f0d2afc721813260b
      - record: D244
        rev: 8f3c0feeac9407fabac76aaf0ebf0f44d21bfbe13bc4d9b92233335bdf600a3c
  - action: commit:h6-design-20261101
    disposition: not-triggered
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
    disposition: not-triggered
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
    disposition: not-triggered
    because: >-
      Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and
      extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules
      or any amendment. The commit holds the version it was gated on; the later text is reviewed at
      the next commit's gate (commit:h6-freeze-20261102).
    by: lead (session eac59010)
    at: "2026-11-03 00:06 UTC"
    inputs:
      - record: D241
        rev: b1dd437cb8eb845458917e3f9ecf780f783e4ff2bbacbe3adccc128e70630f74
  - action: commit:h6-reading-20261103
    disposition: not-triggered
    because: >-
      The commit holds the H6 reading (D260), F113-F116 and record notes only (git diff: nothing
      under src/, scripts/, test/ or .claude/); no Stage 0 code, run or output exists or is
      committed, and T060's design is unchanged. F114 (S1 coverage-limited) is input to Stage 0's
      identifiability question; it answers nothing for it.
    by: lead (session f6353347)
    at: "2026-11-03 00:59 UTC"
    inputs:
      - record: D260
        rev: 33ffee2d7b35cc68baca7141a758621b02f8e5a016a185532a7b57b6aa1126cf
      - record: F114
        rev: 96172249635c4cabd1d075ac7d2d01fbcce2301682028755b03ae042de26acae
---

## History
- 2026-11-01 18:20 UTC lead (session f6ab21fd): created — D238: the user's condition on the contact-reset design
- 2026-11-01 18:21 UTC lead (session f6ab21fd): review for commit:synchrony-review-20261101: not-triggered — Governs designs not yet written (T059-T061); the commit records the accepted review, D238 and the plied threads only.
- 2026-11-01 19:11 UTC lead (session f6ab21fd): reviewed D239@a5d3879fe9c2, D240@5875f9598246; D239 and D240 read: no change here (D240 is the T061 inventory; D239 starts T059 and T061).
- 2026-11-01 19:16 UTC lead (session f6ab21fd): reviewed D241@c351e62616d5; D241 (H6 design proposal) read: it cites this record's links for context; nothing here changes.
- 2026-11-01 22:45 UTC lead (session f6ab21fd): reviewed D241@597483bc51a5, D242@95cc70c9ace0; D241 amendment 1 and D242 read: nothing here changes beyond what D242's commitments record.
- 2026-11-01 22:46 UTC lead (session f6ab21fd): review for commit:h6-design-20261101: not-triggered — The commit records the T061 inventory (D240), the H6 design and its amendment (D241), the user's answers (D242), F108's update and plied records; no model change, analysis, run or reading of new results.
- 2026-11-02 03:16 UTC lead (session 7b85e17e): reviewed D243@9fcd5b57058b; D243 addresses this as Stage 0, a decision of its own (0a: support of complete-history triplets with matched near-approach references; 0b: a characteristic per-ant interval against a memoryless reference through the same selection), with V0 checking it; open until the design is approved and Stage 0 is read
- 2026-11-02 03:30 UTC lead (session 7b85e17e): reviewed D243@a5fef01895d5; D243 amendment 1 respecifies Stage 0: 0b becomes a censored Weibull hazard-shape fit on the ants supplying the matched triplets (contact-freeness as censoring), with V0 in two scopes (event-table reader; coherent synthetic tracks); still open until Stage 0 is read
- 2026-11-02 03:34 UTC lead (session 7b85e17e): review for commit:t060-stage0-design-20261102: not-triggered — The commit records T060's design (D243 with amendment 1), the user's answer (D244), STATUS's pointer and plied records only; nothing is built, run, fitted or read; D243 designs Stage 0 to establish identifiability, which is established only when Stage 0 is read.
- 2026-11-02 05:55 UTC lead (session 0e89af04): review for commit:h6-design-20261101: not-triggered — Re-read D241@36eec164deeb: since the 597483 bytes this review read (the bytes committed in f9ad78f), only two blocks were appended, the lead's implementation details (onset rule, 25 mm radius, S1 sampling, runs, queens) and amendment 2 (D246). The commit holds the version read, so this disposition for it stands; the additions are reviewed at the next commit's gate.
- 2026-11-02 15:32 UTC lead (session 0e89af04): review for commit:h6-design-20261101: not-triggered — Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed) (and, since the 597483/2b609a47 pins, the lead's implementation details and amendment 2, reviewed at 05:5x UTC). The commit holds the version first read (597483), so this disposition for it stands; the later text is reviewed at the next commit's gate.
- 2026-11-03 00:06 UTC lead (session eac59010): review for commit:h6-design-20261101: not-triggered — Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules or any amendment. The commit holds the version it was gated on; the later text is reviewed at the next commit's gate (commit:h6-freeze-20261102).
- 2026-11-03 00:59 UTC lead (session f6353347): review for commit:h6-reading-20261103: not-triggered — The commit holds the H6 reading (D260), F113-F116 and record notes only (git diff: nothing under src/, scripts/, test/ or .claude/); no Stage 0 code, run or output exists or is committed, and T060's design is unchanged. F114 (S1 coverage-limited) is input to Stage 0's identifiability question; it answers nothing for it.
