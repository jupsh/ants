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
  - action: run:t060-s0-brief1
    disposition: not-triggered
    because: >-
      Brief 1 runs only tests and a Scope A smoke on fully synthetic event tables (3 data sets per
      case) into logs/t060-synthetic/; it reads no tracks and no H6 intermediate, only roles()
      metadata for ant counts. No association is read or reported.
    by: lead (session f6353347)
    at: "2026-11-03 01:05 UTC"
    inputs:
      - record: D243
        rev: f25336a56aedb6617594ff5e016b3b016991badba61a07f1db99860b9db336da
  - action: commit:t060-stage0-design-20261102
    disposition: satisfied
    because: >-
      Re-read D243@f25336a56aed: one dated block appended since (2026-11-03 01:04 UTC, the lead's
      Stage 0 implementation details: order of two briefs, event table, near approach, triplets,
      matching cell, 0a, 0b likelihood and support, Scope A generator), filling gaps in amendment 1
      without changing it. The commit (dca4a4a) holds the version read, so this disposition for it
      stands; the block is reviewed at the next commit's gate.
    by: lead (session f6353347)
    at: "2026-11-03 01:07 UTC"
    inputs:
      - record: D243
        rev: f25336a56aedb6617594ff5e016b3b016991badba61a07f1db99860b9db336da
  - action: commit:t060-stage0-design-20261102
    disposition: satisfied
    because: >-
      Re-read D243@e11041360645: amendment 2 appended (D262: 0b read as k-bar over a memoryless
      reference's median; V0 cases b2 and a-sparse added). The commit (dca4a4a) holds the version
      first read, so this disposition for it stands; the later text is reviewed at the next commit's
      gate.
    by: lead (session f6353347)
    at: "2026-11-03 02:21 UTC"
    inputs:
      - record: D243
        rev: e110413606458b965ea5fdc9670f4a7e2a7652f907e74045bcebda2b3b069247
  - action: run:t060-s0-brief1
    disposition: not-triggered
    because: >-
      Re-read D243@e11041360645: amendment 2 (D262) was appended after brief 1's run ended (D261);
      the run was made against the version read, so this disposition for it stands. Amendment 2's
      changes are gated under the next run action.
    by: lead (session f6353347)
    at: "2026-11-03 02:22 UTC"
    inputs:
      - record: D243
        rev: e110413606458b965ea5fdc9670f4a7e2a7652f907e74045bcebda2b3b069247
  - action: run:t060-s0-brief1b
    disposition: not-triggered
    because: >-
      Follow-up 1b changes the brief-1 code for D243 amendment 2 and runs tests and a Scope A smoke
      (3 sets per case, plus b2, a-sparse, c-sparse) into logs/t060-synthetic/ only; no tracks, no
      H6 intermediates, no empirical output. No association read.
    by: lead (session f6353347)
    at: "2026-11-03 02:23 UTC"
    inputs:
      - record: D243
        rev: e110413606458b965ea5fdc9670f4a7e2a7652f907e74045bcebda2b3b069247
      - record: D262
        rev: 5e65c9064d9dba9e92194d28e8a94eb7b147c0f291e18c795a106331d64c5cea
  - action: run:t060-v0-scopeA-20261103
    disposition: not-triggered
    because: >-
      The run is Scope A's V0 in full: scripts/scratch/t060/scopeA.ts --case all --sets 0:200 --par
      10, fully synthetic event tables (only roles() ant counts read), output under
      logs/t060-synthetic/v0A; code as checked in D263 (reader.ts 01d574a3, scopeA.ts ca53b396). No
      association read.
    by: lead (session f6353347)
    at: "2026-11-03 02:57 UTC"
    inputs:
      - record: D243
        rev: e110413606458b965ea5fdc9670f4a7e2a7652f907e74045bcebda2b3b069247
      - record: D262
        rev: 5e65c9064d9dba9e92194d28e8a94eb7b147c0f291e18c795a106331d64c5cea
      - record: D263
        rev: 5089416b2612a10df982d5340f41dd8ffbde7c625f3191a883d40cff15de3c79
  - action: run:t060-s0-brief2
    disposition: not-applicable
    because: >-
      No empirical association is computed or read; the reproduction prints only earlier counts and
      rates. Brief 2's runs: T060 tests, tsc, npm test, a Scope A determinism check and a Scope B
      smoke (synthetic, logs/t060-synthetic/ only), and the reproduction mode on real tracks, which
      builds event tables in memory and prints or writes only the reproduction values and the
      speed-bound shares (logs/t060-repro/).
    by: lead (session 691f3fd9)
    at: "2026-11-03 06:52 UTC"
    inputs:
      - record: D243
        rev: 514044e8ab400a7c8f9063172ae40a6f5525784aaf1dfc05f2668f416b23c2c7
      - record: D244
        rev: 8f3c0feeac9407fabac76aaf0ebf0f44d21bfbe13bc4d9b92233335bdf600a3c
      - record: D262
        rev: 5e65c9064d9dba9e92194d28e8a94eb7b147c0f291e18c795a106331d64c5cea
      - record: D263
        rev: 5089416b2612a10df982d5340f41dd8ffbde7c625f3191a883d40cff15de3c79
  - action: commit:t060-stage0-design-20261102
    disposition: satisfied
    because: >-
      Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's
      brief-2 details: the colony's list, death records, blind frames, intervals and the
      sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and
      scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance
      rule. The commit (dca4a4a) holds the version first read, so this disposition for it stands;
      the block is reviewed at the next commit's gate.
    by: lead (session 691f3fd9)
    at: "2026-11-03 06:59 UTC"
    inputs:
      - record: D243
        rev: 514044e8ab400a7c8f9063172ae40a6f5525784aaf1dfc05f2668f416b23c2c7
  - action: run:t060-s0-brief1
    disposition: not-triggered
    because: >-
      Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's
      brief-2 details: the colony's list, death records, blind frames, intervals and the
      sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and
      scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance
      rule. It was appended after this run ended (D261, D263); the run was made against the version
      read, so this disposition stands. The block is gated under run:t060-s0-brief2.
    by: lead (session 691f3fd9)
    at: "2026-11-03 06:59 UTC"
    inputs:
      - record: D243
        rev: 514044e8ab400a7c8f9063172ae40a6f5525784aaf1dfc05f2668f416b23c2c7
  - action: run:t060-s0-brief1b
    disposition: not-triggered
    because: >-
      Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's
      brief-2 details: the colony's list, death records, blind frames, intervals and the
      sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and
      scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance
      rule. It was appended after this run ended (D261, D263); the run was made against the version
      read, so this disposition stands. The block is gated under run:t060-s0-brief2.
    by: lead (session 691f3fd9)
    at: "2026-11-03 06:59 UTC"
    inputs:
      - record: D243
        rev: 514044e8ab400a7c8f9063172ae40a6f5525784aaf1dfc05f2668f416b23c2c7
  - action: run:t060-v0-scopeA-20261103
    disposition: not-triggered
    because: >-
      Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's
      brief-2 details: the colony's list, death records, blind frames, intervals and the
      sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and
      scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance
      rule. The running Scope A V0 (synthetic event tables; reader.ts 01d574a3, scopeA.ts ca53b396)
      uses none of it, so this disposition stands.
    by: lead (session 691f3fd9)
    at: "2026-11-03 06:59 UTC"
    inputs:
      - record: D243
        rev: 514044e8ab400a7c8f9063172ae40a6f5525784aaf1dfc05f2668f416b23c2c7
  - action: commit:t060-stage0-design-20261102
    disposition: satisfied
    because: >-
      Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's
      details of the support-only audit after D266: a restricted support reader, the extraction in
      memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates
      this action and changes nothing it did or read, so the earlier disposition (satisfied) stands;
      the block is reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 15:21 UTC"
    inputs:
      - record: D243
        rev: ab96ad707023467de1602a4777f8393d5032ec0974422b5d054200af52b9502a
  - action: run:t060-s0-brief1
    disposition: not-triggered
    because: >-
      Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's
      details of the support-only audit after D266: a restricted support reader, the extraction in
      memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates
      this action and changes nothing it did or read, so the earlier disposition (not-triggered)
      stands; the block is reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 15:21 UTC"
    inputs:
      - record: D243
        rev: ab96ad707023467de1602a4777f8393d5032ec0974422b5d054200af52b9502a
  - action: run:t060-s0-brief1b
    disposition: not-triggered
    because: >-
      Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's
      details of the support-only audit after D266: a restricted support reader, the extraction in
      memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates
      this action and changes nothing it did or read, so the earlier disposition (not-triggered)
      stands; the block is reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 15:21 UTC"
    inputs:
      - record: D243
        rev: ab96ad707023467de1602a4777f8393d5032ec0974422b5d054200af52b9502a
  - action: run:t060-s0-brief2
    disposition: not-applicable
    because: >-
      Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's
      details of the support-only audit after D266: a restricted support reader, the extraction in
      memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates
      this action and changes nothing it did or read, so the earlier disposition (not-applicable)
      stands; the block is reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 15:21 UTC"
    inputs:
      - record: D243
        rev: ab96ad707023467de1602a4777f8393d5032ec0974422b5d054200af52b9502a
  - action: run:t060-v0-scopeA-20261103
    disposition: not-triggered
    because: >-
      Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's
      details of the support-only audit after D266: a restricted support reader, the extraction in
      memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates
      this action and changes nothing it did or read, so the earlier disposition (not-triggered)
      stands; the block is reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 15:21 UTC"
    inputs:
      - record: D243
        rev: ab96ad707023467de1602a4777f8393d5032ec0974422b5d054200af52b9502a
  - action: commit:t060-q37-records-20261103
    disposition: not-triggered
    because: >-
      The commit holds records only (git status: nothing under src/, scripts/, test/ or .claude/;
      backlog/ left out): T060's Stage 0 records D261-D266 with D243's dated blocks, X029, STATUS,
      and plied records (Q36, Q37, P175-P183, dispositions, notes, T037's message). No reading or
      causal claim is in it; the audit reads support counts only.
    by: lead (session e38b977a)
    at: "2026-11-03 15:25 UTC"
  - action: run:t060-support-brief
    disposition: not-triggered
    because: >-
      The run is the implementer's build of the restricted support reader and audit CLI (brief
      logs/handoff/20261103-1529-t060-support/brief.md): tests, tsc, the support reader on synthetic
      Scope A/B tables, and one extract.ts --repro on colony 237 (reproduction values only). The
      audit is not run on tracks; no event table from tracks is written; the sealed folder is never
      named. No reading or causal claim.
    by: lead (session e38b977a)
    at: "2026-11-03 15:29 UTC"
    inputs:
      - record: D243
        rev: ab96ad707023467de1602a4777f8393d5032ec0974422b5d054200af52b9502a
      - record: D266
        rev: 9ded34980bb3a0f5531582ebe62e7938c58f957a591032ca0ef067dacc8bdfdf
  - action: run:t060-freeze-check
    disposition: not-triggered
    because: >-
      Checking that the frozen copy under scripts/frozen/t060/ runs: frozen extract.ts --colony 15
      --repro (reproduction values only, compared with cmp to D265's repro-c15.json) and frozen
      support.ts --pool on the synthetic Scope B support files (compared with the scratch pool). No
      audit on tracks, no event table written, the sealed folder never named. Nothing it governs is
      computed or read.
    by: lead (session e38b977a)
    at: "2026-11-03 15:51 UTC"
  - action: commit:t060-stage0-design-20261102
    disposition: satisfied
    because: >-
      Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's
      code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical
      under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action
      and changes nothing it did or read, so the earlier disposition (satisfied) stands; the block
      is reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 15:59 UTC"
    inputs:
      - record: D243
        rev: a0ceb72f78abef50fd2e7d382e082d8d6ec3fd5a370cd4c5509ad3173ec037fe
  - action: run:t060-s0-brief1
    disposition: not-triggered
    because: >-
      Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's
      code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical
      under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action
      and changes nothing it did or read, so the earlier disposition (not-triggered) stands; the
      block is reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 15:59 UTC"
    inputs:
      - record: D243
        rev: a0ceb72f78abef50fd2e7d382e082d8d6ec3fd5a370cd4c5509ad3173ec037fe
  - action: run:t060-s0-brief1b
    disposition: not-triggered
    because: >-
      Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's
      code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical
      under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action
      and changes nothing it did or read, so the earlier disposition (not-triggered) stands; the
      block is reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 15:59 UTC"
    inputs:
      - record: D243
        rev: a0ceb72f78abef50fd2e7d382e082d8d6ec3fd5a370cd4c5509ad3173ec037fe
  - action: run:t060-s0-brief2
    disposition: not-applicable
    because: >-
      Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's
      code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical
      under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action
      and changes nothing it did or read, so the earlier disposition (not-applicable) stands; the
      block is reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 15:59 UTC"
    inputs:
      - record: D243
        rev: a0ceb72f78abef50fd2e7d382e082d8d6ec3fd5a370cd4c5509ad3173ec037fe
  - action: run:t060-support-brief
    disposition: not-triggered
    because: >-
      Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's
      code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical
      under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action
      and changes nothing it did or read, so the earlier disposition (not-triggered) stands; the
      block is reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 15:59 UTC"
    inputs:
      - record: D243
        rev: a0ceb72f78abef50fd2e7d382e082d8d6ec3fd5a370cd4c5509ad3173ec037fe
  - action: run:t060-v0-scopeA-20261103
    disposition: not-triggered
    because: >-
      Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's
      code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical
      under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action
      and changes nothing it did or read, so the earlier disposition (not-triggered) stands; the
      block is reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 15:59 UTC"
    inputs:
      - record: D243
        rev: a0ceb72f78abef50fd2e7d382e082d8d6ec3fd5a370cd4c5509ad3173ec037fe
  - action: commit:t060-freeze-20261103
    disposition: not-triggered
    because: >-
      The commit holds the T060 freeze and its records: scripts/frozen/t060/ (26 files,
      byte-identical to D243's freeze block SHA-256s; checked by sha256sum and by the frozen copy's
      colony-237 repro and synthetic pool, D243), D267, D268, D243's blocks, STATUS, and plied
      records (P184, P185, dispositions, notes). Nothing under src/ or test/; scripts/scratch/ and
      logs/ are not committed; backlog/ left out. No reading or causal claim is in it; the audit
      reads support counts only.
    by: lead (session e38b977a)
    at: "2026-11-03 16:03 UTC"
  - action: run:t060-support-audit-20261103
    disposition: not-triggered
    because: >-
      The run is the support-only audit (D266, D267): the frozen scripts/frozen/t060/ support.ts
      --colony i for the 22 colonies (extraction in memory, no event table written, only whitelisted
      counts to logs/t060-support/), then --pool. The sealed folder is never named or written.
      Support counts only; no association or causal claim.
    by: lead (session e38b977a)
    at: "2026-11-03 16:05 UTC"
    inputs:
      - record: D243
        rev: a0ceb72f78abef50fd2e7d382e082d8d6ec3fd5a370cd4c5509ad3173ec037fe
      - record: D266
        rev: 9ded34980bb3a0f5531582ebe62e7938c58f957a591032ca0ef067dacc8bdfdf
      - record: D267
        rev: decac8e6aabd3e697d83e23e31b0be661593e1d66231b4eeb812585126e5481c
      - record: D268
        rev: a611d465e140a5617e4d1dd8a972961d7f75059ed21e744745ba6177f475830c
  - action: commit:t060-close-20261103
    disposition: satisfied
    because: >-
      The commit holds records only (git status: nothing under src/, scripts/ or test/; backlog/
      left out): the T060 reading D269, F117, D270, T060's close and its commitment states, P186,
      T063, notes, STATUS. D269 and F117 make no causal or associational claim: support counts only,
      worded as not evidence about contact resetting.
    by: lead (session e38b977a)
    at: "2026-11-03 16:28 UTC"
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
- 2026-11-03 01:05 UTC lead (session f6353347): review for run:t060-s0-brief1: not-triggered — Brief 1 runs only tests and a Scope A smoke on fully synthetic event tables (3 data sets per case) into logs/t060-synthetic/; it reads no tracks and no H6 intermediate, only roles() metadata for ant counts. No association is read or reported.
- 2026-11-03 01:07 UTC lead (session f6353347): review for commit:t060-stage0-design-20261102: satisfied — Re-read D243@f25336a56aed: one dated block appended since (2026-11-03 01:04 UTC, the lead's Stage 0 implementation details: order of two briefs, event table, near approach, triplets, matching cell, 0a, 0b likelihood and support, Scope A generator), filling gaps in amendment 1 without changing it. The commit (dca4a4a) holds the version read, so this disposition for it stands; the block is reviewed at the next commit's gate.
- 2026-11-03 02:21 UTC lead (session f6353347): review for commit:t060-stage0-design-20261102: satisfied — Re-read D243@e11041360645: amendment 2 appended (D262: 0b read as k-bar over a memoryless reference's median; V0 cases b2 and a-sparse added). The commit (dca4a4a) holds the version first read, so this disposition for it stands; the later text is reviewed at the next commit's gate.
- 2026-11-03 02:22 UTC lead (session f6353347): review for run:t060-s0-brief1: not-triggered — Re-read D243@e11041360645: amendment 2 (D262) was appended after brief 1's run ended (D261); the run was made against the version read, so this disposition for it stands. Amendment 2's changes are gated under the next run action.
- 2026-11-03 02:23 UTC lead (session f6353347): review for run:t060-s0-brief1b: not-triggered — Follow-up 1b changes the brief-1 code for D243 amendment 2 and runs tests and a Scope A smoke (3 sets per case, plus b2, a-sparse, c-sparse) into logs/t060-synthetic/ only; no tracks, no H6 intermediates, no empirical output. No association read.
- 2026-11-03 02:57 UTC lead (session f6353347): review for run:t060-v0-scopeA-20261103: not-triggered — The run is Scope A's V0 in full: scripts/scratch/t060/scopeA.ts --case all --sets 0:200 --par 10, fully synthetic event tables (only roles() ant counts read), output under logs/t060-synthetic/v0A; code as checked in D263 (reader.ts 01d574a3, scopeA.ts ca53b396). No association read.
- 2026-11-03 06:52 UTC lead (session 691f3fd9): review for run:t060-s0-brief2: not-applicable — No empirical association is computed or read; the reproduction prints only earlier counts and rates. Brief 2's runs: T060 tests, tsc, npm test, a Scope A determinism check and a Scope B smoke (synthetic, logs/t060-synthetic/ only), and the reproduction mode on real tracks, which builds event tables in memory and prints or writes only the reproduction values and the speed-bound shares (logs/t060-repro/).
- 2026-11-03 06:59 UTC lead (session 691f3fd9): review for commit:t060-stage0-design-20261102: satisfied — Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's brief-2 details: the colony's list, death records, blind frames, intervals and the sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance rule. The commit (dca4a4a) holds the version first read, so this disposition for it stands; the block is reviewed at the next commit's gate.
- 2026-11-03 06:59 UTC lead (session 691f3fd9): review for run:t060-s0-brief1: not-triggered — Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's brief-2 details: the colony's list, death records, blind frames, intervals and the sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance rule. It was appended after this run ended (D261, D263); the run was made against the version read, so this disposition stands. The block is gated under run:t060-s0-brief2.
- 2026-11-03 06:59 UTC lead (session 691f3fd9): review for run:t060-s0-brief1b: not-triggered — Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's brief-2 details: the colony's list, death records, blind frames, intervals and the sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance rule. It was appended after this run ended (D261, D263); the run was made against the version read, so this disposition stands. The block is gated under run:t060-s0-brief2.
- 2026-11-03 06:59 UTC lead (session 691f3fd9): review for run:t060-v0-scopeA-20261103: not-triggered — Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's brief-2 details: the colony's list, death records, blind frames, intervals and the sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance rule. The running Scope A V0 (synthetic event tables; reader.ts 01d574a3, scopeA.ts ca53b396) uses none of it, so this disposition stands.
- 2026-11-03 15:21 UTC lead (session e38b977a): review for commit:t060-stage0-design-20261102: satisfied — Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's details of the support-only audit after D266: a restricted support reader, the extraction in memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates this action and changes nothing it did or read, so the earlier disposition (satisfied) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:21 UTC lead (session e38b977a): review for run:t060-s0-brief1: not-triggered — Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's details of the support-only audit after D266: a restricted support reader, the extraction in memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates this action and changes nothing it did or read, so the earlier disposition (not-triggered) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:21 UTC lead (session e38b977a): review for run:t060-s0-brief1b: not-triggered — Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's details of the support-only audit after D266: a restricted support reader, the extraction in memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates this action and changes nothing it did or read, so the earlier disposition (not-triggered) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:21 UTC lead (session e38b977a): review for run:t060-s0-brief2: not-applicable — Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's details of the support-only audit after D266: a restricted support reader, the extraction in memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates this action and changes nothing it did or read, so the earlier disposition (not-applicable) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:21 UTC lead (session e38b977a): review for run:t060-v0-scopeA-20261103: not-triggered — Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's details of the support-only audit after D266: a restricted support reader, the extraction in memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates this action and changes nothing it did or read, so the earlier disposition (not-triggered) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:25 UTC lead (session e38b977a): review for commit:t060-q37-records-20261103: not-triggered — The commit holds records only (git status: nothing under src/, scripts/, test/ or .claude/; backlog/ left out): T060's Stage 0 records D261-D266 with D243's dated blocks, X029, STATUS, and plied records (Q36, Q37, P175-P183, dispositions, notes, T037's message). No reading or causal claim is in it; the audit reads support counts only.
- 2026-11-03 15:29 UTC lead (session e38b977a): review for run:t060-support-brief: not-triggered — The run is the implementer's build of the restricted support reader and audit CLI (brief logs/handoff/20261103-1529-t060-support/brief.md): tests, tsc, the support reader on synthetic Scope A/B tables, and one extract.ts --repro on colony 237 (reproduction values only). The audit is not run on tracks; no event table from tracks is written; the sealed folder is never named. No reading or causal claim.
- 2026-11-03 15:51 UTC lead (session e38b977a): review for run:t060-freeze-check: not-triggered — Checking that the frozen copy under scripts/frozen/t060/ runs: frozen extract.ts --colony 15 --repro (reproduction values only, compared with cmp to D265's repro-c15.json) and frozen support.ts --pool on the synthetic Scope B support files (compared with the scratch pool). No audit on tracks, no event table written, the sealed folder never named. Nothing it governs is computed or read.
- 2026-11-03 15:59 UTC lead (session e38b977a): review for commit:t060-stage0-design-20261102: satisfied — Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action and changes nothing it did or read, so the earlier disposition (satisfied) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:59 UTC lead (session e38b977a): review for run:t060-s0-brief1: not-triggered — Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action and changes nothing it did or read, so the earlier disposition (not-triggered) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:59 UTC lead (session e38b977a): review for run:t060-s0-brief1b: not-triggered — Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action and changes nothing it did or read, so the earlier disposition (not-triggered) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:59 UTC lead (session e38b977a): review for run:t060-s0-brief2: not-applicable — Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action and changes nothing it did or read, so the earlier disposition (not-applicable) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:59 UTC lead (session e38b977a): review for run:t060-support-brief: not-triggered — Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action and changes nothing it did or read, so the earlier disposition (not-triggered) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:59 UTC lead (session e38b977a): review for run:t060-v0-scopeA-20261103: not-triggered — Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action and changes nothing it did or read, so the earlier disposition (not-triggered) stands; the block is reviewed at the next action's gate.
- 2026-11-03 16:03 UTC lead (session e38b977a): review for commit:t060-freeze-20261103: not-triggered — The commit holds the T060 freeze and its records: scripts/frozen/t060/ (26 files, byte-identical to D243's freeze block SHA-256s; checked by sha256sum and by the frozen copy's colony-237 repro and synthetic pool, D243), D267, D268, D243's blocks, STATUS, and plied records (P184, P185, dispositions, notes). Nothing under src/ or test/; scripts/scratch/ and logs/ are not committed; backlog/ left out. No reading or causal claim is in it; the audit reads support counts only.
- 2026-11-03 16:05 UTC lead (session e38b977a): review for run:t060-support-audit-20261103: not-triggered — The run is the support-only audit (D266, D267): the frozen scripts/frozen/t060/ support.ts --colony i for the 22 colonies (extraction in memory, no event table written, only whitelisted counts to logs/t060-support/), then --pool. The sealed folder is never named or written. Support counts only; no association or causal claim.
- 2026-11-03 16:28 UTC lead (session e38b977a): review for commit:t060-close-20261103: satisfied — The commit holds records only (git status: nothing under src/, scripts/ or test/; backlog/ left out): the T060 reading D269, F117, D270, T060's close and its commitment states, P186, T063, notes, STATUS. D269 and F117 make no causal or associational claim: support counts only, worded as not evidence about contact resetting.
