---
id: P137
title: Contact associations and Granger predictability are not causal evidence
wording: Contact associations and Granger predictability alone cannot establish either mechanism causally.
made: D238
state: open
nodes: [T059, T060]
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
  - action: run:h6-build-smoke
    disposition: acting
    because: >-
      The build writes no causal labels; only the two decision labels of amendment 1, and only from
      the frozen reader later.
    by: lead (session f6ab21fd)
    at: "2026-11-01 22:49 UTC"
    inputs:
      - record: D241
        rev: 2b609a47d2744c5c6281b681206c6f72784e3a354f9daaf856c669f9a08f92e5
      - record: D242
        rev: 95cc70c9ace090981dbc595ffb10d18a35f19fdbcf8455a6bf43acf2b0db63fa
  - action: commit:t060-stage0-design-20261102
    disposition: satisfied
    because: >-
      The commit records T060's design (D243 with amendment 1), the user's answer (D244), STATUS's
      pointer and plied records only; nothing is built, run, fitted or read; every label in D243 is
      an association relative to references; no causal label and no Granger statistic.
    by: lead (session 7b85e17e)
    at: "2026-11-02 03:34 UTC"
    inputs:
      - record: D243
        rev: a5fef01895d5a78df9941aa9914c404b673e2e4c311a0c7f0d2afc721813260b
      - record: D244
        rev: 8f3c0feeac9407fabac76aaf0ebf0f44d21bfbe13bc4d9b92233335bdf600a3c
  - action: run:h6-fixes-20261102
    disposition: not-triggered
    because: >-
      Build, tests, reproduction and synthetic smoke only; no association or Granger result is
      computed or interpreted
    by: lead (session 0e89af04)
    at: "2026-11-02 05:50 UTC"
    inputs:
      - record: D241
        rev: 36eec164deeba73a16dff9496b8751e4f5e97dac430d82b680322735d3dd2280
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
  - action: run:h6-build-smoke
    disposition: acting
    because: >-
      Re-read D241@36eec164deeb: since the 2b609a47 bytes this review read, the queen bullet was
      appended (already stated in the brief; T059 note 03:11) and amendment 2 (D246), written after
      this run finished and was read in D245. The run was done under the text it was gated on, so
      this disposition stands; amendment 2's changes are gated in run:h6-fixes-20261102.
    by: lead (session 0e89af04)
    at: "2026-11-02 05:55 UTC"
    inputs:
      - record: D241
        rev: 36eec164deeba73a16dff9496b8751e4f5e97dac430d82b680322735d3dd2280
  - action: run:h6-zoneflag-20261102
    disposition: not-triggered
    because: No association or Granger result
    by: lead (session 0e89af04)
    at: "2026-11-02 15:29 UTC"
  - action: run:h6-v1v4-20261102
    disposition: not-triggered
    because: The S2 check is synthetic and descriptive; no association is interpreted
    by: lead (session 0e89af04)
    at: "2026-11-02 15:29 UTC"
  - action: commit:h6-design-20261101
    disposition: not-triggered
    because: >-
      Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's
      cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed)
      (and, since the 597483/2b609a47 pins, the lead's implementation details and amendment 2,
      reviewed at 05:5x UTC). The commit holds the version first read (597483), so this disposition
      for it stands; the later text is reviewed at the next commit's gate.
    by: lead (session 0e89af04)
    at: "2026-11-02 15:33 UTC"
    inputs:
      - record: D241
        rev: 07a71b62d68a8e5fc8683b31f3075cc5bbfe0ceae9456ec136104339bfcbf2a9
  - action: run:h6-build-smoke
    disposition: acting
    because: >-
      Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's
      cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed)
      (and, since the 597483/2b609a47 pins, the lead's implementation details and amendment 2,
      reviewed at 05:5x UTC). The run finished before the change and was read in D245, under the
      text it was gated on; the disposition stands.
    by: lead (session 0e89af04)
    at: "2026-11-02 15:33 UTC"
    inputs:
      - record: D241
        rev: 07a71b62d68a8e5fc8683b31f3075cc5bbfe0ceae9456ec136104339bfcbf2a9
  - action: run:h6-fixes-20261102
    disposition: not-triggered
    because: >-
      Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's
      cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed).
      The fixes run finished and was checked (D250) before the change; the cutoff concerns only the
      blind check, which is gated separately (run:h6-zoneflag-20261102 and the check itself), so the
      disposition stands.
    by: lead (session 0e89af04)
    at: "2026-11-02 15:33 UTC"
    inputs:
      - record: D241
        rev: 07a71b62d68a8e5fc8683b31f3075cc5bbfe0ceae9456ec136104339bfcbf2a9
  - action: run:h6-blindcheck-20261102
    disposition: not-triggered
    because: No association or Granger result
    by: lead (session 0e89af04)
    at: "2026-11-02 15:37 UTC"
  - action: run:h6-reach-20261102
    disposition: not-triggered
    because: No association or Granger result
    by: lead (session 0e89af04)
    at: "2026-11-02 16:01 UTC"
  - action: run:h6-blindcheck2-20261102
    disposition: not-triggered
    because: No association or Granger result
    by: lead (session 0e89af04)
    at: "2026-11-02 16:55 UTC"
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
  - action: run:h6-build-smoke
    disposition: acting
    because: >-
      Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and
      extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules
      or any amendment. The run finished and was read before the change, under the text it was gated
      on; the disposition stands.
    by: lead (session eac59010)
    at: "2026-11-03 00:06 UTC"
    inputs:
      - record: D241
        rev: b1dd437cb8eb845458917e3f9ecf780f783e4ff2bbacbe3adccc128e70630f74
  - action: run:h6-fixes-20261102
    disposition: not-triggered
    because: >-
      Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and
      extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules
      or any amendment. The run finished and was read before the change, under the text it was gated
      on; the disposition stands.
    by: lead (session eac59010)
    at: "2026-11-03 00:06 UTC"
    inputs:
      - record: D241
        rev: b1dd437cb8eb845458917e3f9ecf780f783e4ff2bbacbe3adccc128e70630f74
  - action: commit:h6-freeze-20261102
    disposition: not-triggered
    because: >-
      The commit holds records, the frozen code (D259) and no empirical statistic; the sealed output
      folder is untouched until after the commit; no causal claim is made
    by: lead (session eac59010)
    at: "2026-11-03 00:08 UTC"
    inputs:
      - record: D259
        rev: da68ade2ca9f550792fdbb88369ec191646cd6fef041de62b8c6cd7d508f05ef
  - action: commit:h6-freeze-20261102
    disposition: not-triggered
    because: >-
      Re-read D259@8bc940ad09b0: one dated line appended after the commit (committed as fb6af11,
      then the H6 output folder unsealed); the frozen files and hashes are unchanged, so the
      disposition for this commit stands
    by: lead (session eac59010)
    at: "2026-11-03 00:10 UTC"
    inputs:
      - record: D259
        rev: 8bc940ad09b0e75660f466f2aedc70317eaf37118055fa922fecc881a0740227
  - action: run:h6-reading-20261103
    disposition: not-triggered
    because: >-
      The run executes the frozen reader (scripts/frozen/h6/…/reader.ts 3c3985c0, D259) unchanged on
      the frozen extractor's 22 intermediates (logs/h6-work-next, hashes matching the rebuild
      report), all parts, default draws 1000 and boot 2000; no causal claim is made by a run; the
      reading will state it
    by: lead (session eac59010)
    at: "2026-11-03 00:30 UTC"
    inputs:
      - record: D259
        rev: 8bc940ad09b0e75660f466f2aedc70317eaf37118055fa922fecc881a0740227
  - action: run:h6-reading2-20261103
    disposition: not-triggered
    because: >-
      As for run:h6-reading-20261103, which died of heap exhaustion before writing anything: the
      same frozen reader, inputs and options, rerun with Node's heap raised to 6000 MB (no change to
      code or results)
    by: lead (session eac59010)
    at: "2026-11-03 00:35 UTC"
  - action: commit:h6-reading-20261103
    disposition: satisfied
    because: >-
      D260 ('Granger predictability is not a causal claim (P137)'; 'Nothing here is causal'), F115
      and F116 ('Observational') word the S2/S3 associations as non-causal; read in full.
    by: lead (session f6353347)
    at: "2026-11-03 01:00 UTC"
    inputs:
      - record: D260
        rev: 33ffee2d7b35cc68baca7141a758621b02f8e5a016a185532a7b57b6aa1126cf
      - record: F115
        rev: 6ad296290e5b95900c2156392e4e45ad02ed5ca762345c0247b579cdb7f4b55b
      - record: F116
        rev: fbe7736f6c0953ac36701aff0ef88b10be5605ac847aa5e1650f873fd58c16e1
---

## History
- 2026-11-01 18:20 UTC lead (session f6ab21fd): created — D238: the user's qualification of the discriminators
- 2026-11-01 18:21 UTC lead (session f6ab21fd): review for commit:synchrony-review-20261101: not-triggered — Governs designs not yet written (T059-T061); the commit records the accepted review, D238 and the plied threads only.
- 2026-11-01 19:12 UTC lead (session f6ab21fd): reviewed D239@a5d3879fe9c2, D240@5875f9598246; D239 and D240 read: no change here (D240 is the T061 inventory; D239 starts T059 and T061).
- 2026-11-01 19:15 UTC lead (session f6ab21fd): reviewed D241@c351e62616d5; D241 (the H6 design) read against this; addressed in the design, open until it is approved and read.
- 2026-11-01 22:45 UTC lead (session f6ab21fd): reviewed D241@597483bc51a5, D242@95cc70c9ace0; D241 amendment 1 and D242 read: nothing here changes beyond what D242's commitments record.
- 2026-11-01 22:46 UTC lead (session f6ab21fd): review for commit:h6-design-20261101: not-triggered — The commit records the T061 inventory (D240), the H6 design and its amendment (D241), the user's answers (D242), F108's update and plied records; no model change, analysis, run or reading of new results.
- 2026-11-01 22:49 UTC lead (session f6ab21fd): review for run:h6-build-smoke: acting — The build writes no causal labels; only the two decision labels of amendment 1, and only from the frozen reader later.
- 2026-11-02 03:16 UTC lead (session 7b85e17e): reviewed D243@9fcd5b57058b; D243's labels are all 'consistent with', the contact observed, not assigned; it uses no Granger statistic; open: it governs the reading
- 2026-11-02 03:30 UTC lead (session 7b85e17e): reviewed D243@a5fef01895d5; D243 amendment 1 renames contacts proximity-defined contacts and narrows Stage 1's labels to 'contact-associated advance with … change relative to references'; no causal label; open
- 2026-11-02 03:34 UTC lead (session 7b85e17e): review for commit:t060-stage0-design-20261102: satisfied — The commit records T060's design (D243 with amendment 1), the user's answer (D244), STATUS's pointer and plied records only; nothing is built, run, fitted or read; every label in D243 is an association relative to references; no causal label and no Granger statistic.
- 2026-11-02 05:50 UTC lead (session 0e89af04): review for run:h6-fixes-20261102: not-triggered — Build, tests, reproduction and synthetic smoke only; no association or Granger result is computed or interpreted
- 2026-11-02 05:55 UTC lead (session 0e89af04): review for commit:h6-design-20261101: not-triggered — Re-read D241@36eec164deeb: since the 597483 bytes this review read (the bytes committed in f9ad78f), only two blocks were appended, the lead's implementation details (onset rule, 25 mm radius, S1 sampling, runs, queens) and amendment 2 (D246). The commit holds the version read, so this disposition for it stands; the additions are reviewed at the next commit's gate.
- 2026-11-02 05:55 UTC lead (session 0e89af04): review for run:h6-build-smoke: acting — Re-read D241@36eec164deeb: since the 2b609a47 bytes this review read, the queen bullet was appended (already stated in the brief; T059 note 03:11) and amendment 2 (D246), written after this run finished and was read in D245. The run was done under the text it was gated on, so this disposition stands; amendment 2's changes are gated in run:h6-fixes-20261102.
- 2026-11-02 15:29 UTC lead (session 0e89af04): review for run:h6-zoneflag-20261102: not-triggered — No association or Granger result
- 2026-11-02 15:29 UTC lead (session 0e89af04): review for run:h6-v1v4-20261102: not-triggered — The S2 check is synthetic and descriptive; no association is interpreted
- 2026-11-02 15:33 UTC lead (session 0e89af04): review for commit:h6-design-20261101: not-triggered — Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed) (and, since the 597483/2b609a47 pins, the lead's implementation details and amendment 2, reviewed at 05:5x UTC). The commit holds the version first read (597483), so this disposition for it stands; the later text is reviewed at the next commit's gate.
- 2026-11-02 15:33 UTC lead (session 0e89af04): review for run:h6-build-smoke: acting — Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed) (and, since the 597483/2b609a47 pins, the lead's implementation details and amendment 2, reviewed at 05:5x UTC). The run finished before the change and was read in D245, under the text it was gated on; the disposition stands.
- 2026-11-02 15:33 UTC lead (session 0e89af04): review for run:h6-fixes-20261102: not-triggered — Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed). The fixes run finished and was checked (D250) before the change; the cutoff concerns only the blind check, which is gated separately (run:h6-zoneflag-20261102 and the check itself), so the disposition stands.
- 2026-11-02 15:37 UTC lead (session 0e89af04): review for run:h6-blindcheck-20261102: not-triggered — No association or Granger result
- 2026-11-02 16:01 UTC lead (session 0e89af04): review for run:h6-reach-20261102: not-triggered — No association or Granger result
- 2026-11-02 16:55 UTC lead (session 0e89af04): review for run:h6-blindcheck2-20261102: not-triggered — No association or Granger result
- 2026-11-03 00:06 UTC lead (session eac59010): review for commit:h6-design-20261101: not-triggered — Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules or any amendment. The commit holds the version it was gated on; the later text is reviewed at the next commit's gate (commit:h6-freeze-20261102).
- 2026-11-03 00:06 UTC lead (session eac59010): review for run:h6-build-smoke: acting — Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules or any amendment. The run finished and was read before the change, under the text it was gated on; the disposition stands.
- 2026-11-03 00:06 UTC lead (session eac59010): review for run:h6-fixes-20261102: not-triggered — Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules or any amendment. The run finished and was read before the change, under the text it was gated on; the disposition stands.
- 2026-11-03 00:08 UTC lead (session eac59010): review for commit:h6-freeze-20261102: not-triggered — The commit holds records, the frozen code (D259) and no empirical statistic; the sealed output folder is untouched until after the commit; no causal claim is made
- 2026-11-03 00:10 UTC lead (session eac59010): review for commit:h6-freeze-20261102: not-triggered — Re-read D259@8bc940ad09b0: one dated line appended after the commit (committed as fb6af11, then the H6 output folder unsealed); the frozen files and hashes are unchanged, so the disposition for this commit stands
- 2026-11-03 00:30 UTC lead (session eac59010): review for run:h6-reading-20261103: not-triggered — The run executes the frozen reader (scripts/frozen/h6/…/reader.ts 3c3985c0, D259) unchanged on the frozen extractor's 22 intermediates (logs/h6-work-next, hashes matching the rebuild report), all parts, default draws 1000 and boot 2000; no causal claim is made by a run; the reading will state it
- 2026-11-03 00:35 UTC lead (session eac59010): review for run:h6-reading2-20261103: not-triggered — As for run:h6-reading-20261103, which died of heap exhaustion before writing anything: the same frozen reader, inputs and options, rerun with Node's heap raised to 6000 MB (no change to code or results)
- 2026-11-03 00:43 UTC lead (session eac59010): set state=fulfilled; set resolved_by=D260 — D260 makes no causal claim from contact associations or Granger predictability
- 2026-11-03 00:44 UTC lead (session eac59010): set state=open; cleared resolved_by — Reopened: P137 is also attached to T060, whose contact-reset reading it still governs; D260 met it for T059 only
- 2026-11-03 01:00 UTC lead (session f6353347): review for commit:h6-reading-20261103: satisfied — D260 ('Granger predictability is not a causal claim (P137)'; 'Nothing here is causal'), F115 and F116 ('Observational') word the S2/S3 associations as non-causal; read in full.
