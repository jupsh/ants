---
id: P164
title: "Contact-reset Stage 0: outputs sealed until the reader is frozen and V0 and the reproduction pass"
wording: until the reader is frozen by its SHA-256 in this entry and V0 and the reproduction pass.
made: D243
state: fulfilled
nodes: [T060]
resolved_by: D269
reviews:
  - action: commit:t060-stage0-design-20261102
    disposition: satisfied
    because: No empirical Stage 0 output exists; its output path is in .claude/sealed-paths.txt.
    by: lead (session 7b85e17e)
    at: "2026-11-02 03:35 UTC"
    inputs:
      - record: D243
        rev: a5fef01895d5a78df9941aa9914c404b673e2e4c311a0c7f0d2afc721813260b
      - record: D244
        rev: 8f3c0feeac9407fabac76aaf0ebf0f44d21bfbe13bc4d9b92233335bdf600a3c
  - action: commit:h6-reading-20261103
    disposition: not-triggered
    because: >-
      The commit holds the H6 reading (D260), F113-F116 and record notes only (git diff: nothing
      under src/, scripts/, test/ or .claude/); no Stage 0 code, run or output exists or is
      committed, and T060's design is unchanged. Stage 0's sealed output paths are untouched and
      nothing from them is in the commit (git status shows no logs/ or Stage 0 files; logs/ is
      git-ignored).
    by: lead (session f6353347)
    at: "2026-11-03 01:00 UTC"
    inputs:
      - record: D260
        rev: 33ffee2d7b35cc68baca7141a758621b02f8e5a016a185532a7b57b6aa1126cf
  - action: run:t060-s0-brief1
    disposition: satisfied
    because: >-
      Brief 1 writes only the synthetic folder and must not read, list or write the sealed Stage 0
      output folder; no empirical output exists. Brief 1 runs only tests and a Scope A smoke on
      fully synthetic event tables (3 data sets per case) into logs/t060-synthetic/; it reads no
      tracks and no H6 intermediate, only roles() metadata for ant counts.
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
    at: "2026-11-03 01:08 UTC"
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
    at: "2026-11-03 02:22 UTC"
    inputs:
      - record: D243
        rev: e110413606458b965ea5fdc9670f4a7e2a7652f907e74045bcebda2b3b069247
  - action: run:t060-s0-brief1
    disposition: satisfied
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
    disposition: satisfied
    because: >-
      Writes only the synthetic folder; the sealed Stage 0 output folder untouched. Follow-up 1b
      changes the brief-1 code for D243 amendment 2 and runs tests and a Scope A smoke (3 sets per
      case, plus b2, a-sparse, c-sparse) into logs/t060-synthetic/ only; no tracks, no H6
      intermediates, no empirical output.
    by: lead (session f6353347)
    at: "2026-11-03 02:23 UTC"
    inputs:
      - record: D243
        rev: e110413606458b965ea5fdc9670f4a7e2a7652f907e74045bcebda2b3b069247
      - record: D262
        rev: 5e65c9064d9dba9e92194d28e8a94eb7b147c0f291e18c795a106331d64c5cea
  - action: run:t060-v0-scopeA-20261103
    disposition: satisfied
    because: >-
      Writes only the synthetic folder; the sealed Stage 0 output folder untouched; no empirical
      output. The run is Scope A's V0 in full: scripts/scratch/t060/scopeA.ts --case all --sets
      0:200 --par 10, fully synthetic event tables (only roles() ant counts read), output under
      logs/t060-synthetic/v0A; code as checked in D263 (reader.ts 01d574a3, scopeA.ts ca53b396).
    by: lead (session f6353347)
    at: "2026-11-03 02:58 UTC"
    inputs:
      - record: D243
        rev: e110413606458b965ea5fdc9670f4a7e2a7652f907e74045bcebda2b3b069247
      - record: D262
        rev: 5e65c9064d9dba9e92194d28e8a94eb7b147c0f291e18c795a106331d64c5cea
      - record: D263
        rev: 5089416b2612a10df982d5340f41dd8ffbde7c625f3191a883d40cff15de3c79
  - action: run:t060-s0-brief2
    disposition: acting
    because: >-
      The sealed folder is never named, read or written; real tracks run only in reproduction mode,
      which writes no event table and prints no statistic from one; real event tables are the lead's
      after the freeze. Brief 2's runs: T060 tests, tsc, npm test, a Scope A determinism check and a
      Scope B smoke (synthetic, logs/t060-synthetic/ only), and the reproduction mode on real
      tracks, which builds event tables in memory and prints or writes only the reproduction values
      and the speed-bound shares (logs/t060-repro/).
    by: lead (session 691f3fd9)
    at: "2026-11-03 06:53 UTC"
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
    at: "2026-11-03 07:01 UTC"
    inputs:
      - record: D243
        rev: 514044e8ab400a7c8f9063172ae40a6f5525784aaf1dfc05f2668f416b23c2c7
  - action: run:t060-s0-brief1
    disposition: satisfied
    because: >-
      Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's
      brief-2 details: the colony's list, death records, blind frames, intervals and the
      sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and
      scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance
      rule. It was appended after this run ended (D261, D263); the run was made against the version
      read, so this disposition stands. The block is gated under run:t060-s0-brief2.
    by: lead (session 691f3fd9)
    at: "2026-11-03 07:01 UTC"
    inputs:
      - record: D243
        rev: 514044e8ab400a7c8f9063172ae40a6f5525784aaf1dfc05f2668f416b23c2c7
  - action: run:t060-s0-brief1b
    disposition: satisfied
    because: >-
      Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's
      brief-2 details: the colony's list, death records, blind frames, intervals and the
      sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and
      scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance
      rule. It was appended after this run ended (D261, D263); the run was made against the version
      read, so this disposition stands. The block is gated under run:t060-s0-brief2.
    by: lead (session 691f3fd9)
    at: "2026-11-03 07:01 UTC"
    inputs:
      - record: D243
        rev: 514044e8ab400a7c8f9063172ae40a6f5525784aaf1dfc05f2668f416b23c2c7
  - action: run:t060-v0-scopeA-20261103
    disposition: satisfied
    because: >-
      Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's
      brief-2 details: the colony's list, death records, blind frames, intervals and the
      sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and
      scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance
      rule. The running Scope A V0 (synthetic event tables; reader.ts 01d574a3, scopeA.ts ca53b396)
      uses none of it, so this disposition stands.
    by: lead (session 691f3fd9)
    at: "2026-11-03 07:01 UTC"
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
    at: "2026-11-03 15:23 UTC"
    inputs:
      - record: D243
        rev: ab96ad707023467de1602a4777f8393d5032ec0974422b5d054200af52b9502a
  - action: run:t060-s0-brief1
    disposition: satisfied
    because: >-
      Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's
      details of the support-only audit after D266: a restricted support reader, the extraction in
      memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates
      this action and changes nothing it did or read, so the earlier disposition (satisfied) stands;
      the block is reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 15:23 UTC"
    inputs:
      - record: D243
        rev: ab96ad707023467de1602a4777f8393d5032ec0974422b5d054200af52b9502a
  - action: run:t060-s0-brief1b
    disposition: satisfied
    because: >-
      Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's
      details of the support-only audit after D266: a restricted support reader, the extraction in
      memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates
      this action and changes nothing it did or read, so the earlier disposition (satisfied) stands;
      the block is reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 15:23 UTC"
    inputs:
      - record: D243
        rev: ab96ad707023467de1602a4777f8393d5032ec0974422b5d054200af52b9502a
  - action: run:t060-s0-brief2
    disposition: acting
    because: >-
      Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's
      details of the support-only audit after D266: a restricted support reader, the extraction in
      memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates
      this action and changes nothing it did or read, so the earlier disposition (acting) stands;
      the block is reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 15:23 UTC"
    inputs:
      - record: D243
        rev: ab96ad707023467de1602a4777f8393d5032ec0974422b5d054200af52b9502a
  - action: run:t060-v0-scopeA-20261103
    disposition: satisfied
    because: >-
      Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's
      details of the support-only audit after D266: a restricted support reader, the extraction in
      memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates
      this action and changes nothing it did or read, so the earlier disposition (satisfied) stands;
      the block is reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 15:23 UTC"
    inputs:
      - record: D243
        rev: ab96ad707023467de1602a4777f8393d5032ec0974422b5d054200af52b9502a
  - action: commit:t060-q37-records-20261103
    disposition: satisfied
    because: >-
      The commit holds records only (git status: nothing under src/, scripts/, test/ or .claude/;
      backlog/ left out): T060's Stage 0 records D261-D266 with D243's dated blocks, X029, STATUS,
      and plied records (Q36, Q37, P175-P183, dispositions, notes, T037's message). No empirical
      Stage 0 output exists or is committed (the sealed folder is untouched and git-ignored). D266
      waives Scope B's acceptance for the support reading alone, and the audit writes no event table
      (D243 15:18 block).
    by: lead (session e38b977a)
    at: "2026-11-03 15:25 UTC"
  - action: run:t060-support-brief
    disposition: acting
    because: >-
      The run is the implementer's build of the restricted support reader and audit CLI (brief
      logs/handoff/20261103-1529-t060-support/brief.md): tests, tsc, the support reader on synthetic
      Scope A/B tables, and one extract.ts --repro on colony 237 (reproduction values only). The
      audit is not run on tracks; no event table from tracks is written; the sealed folder is never
      named. D266 waives Scope B's acceptance for the support reading alone; in this build nothing
      from tracks beyond reproduction values is produced, and the audit CLI writes no event table.
    by: lead (session e38b977a)
    at: "2026-11-03 15:30 UTC"
    inputs:
      - record: D243
        rev: ab96ad707023467de1602a4777f8393d5032ec0974422b5d054200af52b9502a
      - record: D266
        rev: 9ded34980bb3a0f5531582ebe62e7938c58f957a591032ca0ef067dacc8bdfdf
  - action: run:t060-freeze-check
    disposition: acting
    because: >-
      Checking that the frozen copy under scripts/frozen/t060/ runs: frozen extract.ts --colony 15
      --repro (reproduction values only, compared with cmp to D265's repro-c15.json) and frozen
      support.ts --pool on the synthetic Scope B support files (compared with the scratch pool). No
      audit on tracks, no event table written, the sealed folder never named. Only reproduction
      values from tracks, already reported in D265; nothing beyond them.
    by: lead (session e38b977a)
    at: "2026-11-03 15:52 UTC"
  - action: commit:t060-stage0-design-20261102
    disposition: satisfied
    because: >-
      Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's
      code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical
      under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action
      and changes nothing it did or read, so the earlier disposition (satisfied) stands; the block
      is reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 16:00 UTC"
    inputs:
      - record: D243
        rev: a0ceb72f78abef50fd2e7d382e082d8d6ec3fd5a370cd4c5509ad3173ec037fe
  - action: run:t060-s0-brief1
    disposition: satisfied
    because: >-
      Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's
      code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical
      under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action
      and changes nothing it did or read, so the earlier disposition (satisfied) stands; the block
      is reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 16:00 UTC"
    inputs:
      - record: D243
        rev: a0ceb72f78abef50fd2e7d382e082d8d6ec3fd5a370cd4c5509ad3173ec037fe
  - action: run:t060-s0-brief1b
    disposition: satisfied
    because: >-
      Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's
      code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical
      under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action
      and changes nothing it did or read, so the earlier disposition (satisfied) stands; the block
      is reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 16:00 UTC"
    inputs:
      - record: D243
        rev: a0ceb72f78abef50fd2e7d382e082d8d6ec3fd5a370cd4c5509ad3173ec037fe
  - action: run:t060-s0-brief2
    disposition: acting
    because: >-
      Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's
      code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical
      under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action
      and changes nothing it did or read, so the earlier disposition (acting) stands; the block is
      reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 16:00 UTC"
    inputs:
      - record: D243
        rev: a0ceb72f78abef50fd2e7d382e082d8d6ec3fd5a370cd4c5509ad3173ec037fe
  - action: run:t060-support-brief
    disposition: acting
    because: >-
      Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's
      code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical
      under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action
      and changes nothing it did or read, so the earlier disposition (acting) stands; the block is
      reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 16:00 UTC"
    inputs:
      - record: D243
        rev: a0ceb72f78abef50fd2e7d382e082d8d6ec3fd5a370cd4c5509ad3173ec037fe
  - action: run:t060-v0-scopeA-20261103
    disposition: satisfied
    because: >-
      Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's
      code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical
      under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action
      and changes nothing it did or read, so the earlier disposition (satisfied) stands; the block
      is reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 16:00 UTC"
    inputs:
      - record: D243
        rev: a0ceb72f78abef50fd2e7d382e082d8d6ec3fd5a370cd4c5509ad3173ec037fe
  - action: commit:t060-freeze-20261103
    disposition: satisfied
    because: >-
      The commit holds the T060 freeze and its records: scripts/frozen/t060/ (26 files,
      byte-identical to D243's freeze block SHA-256s; checked by sha256sum and by the frozen copy's
      colony-237 repro and synthetic pool, D243), D267, D268, D243's blocks, STATUS, and plied
      records (P184, P185, dispositions, notes). Nothing under src/ or test/; scripts/scratch/ and
      logs/ are not committed; backlog/ left out. No empirical Stage 0 output exists or is
      committed; the sealed folder is untouched. D266 waives Scope B's acceptance for the support
      reading alone, and the frozen audit writes no event table (D268).
    by: lead (session e38b977a)
    at: "2026-11-03 16:03 UTC"
  - action: run:t060-support-audit-20261103
    disposition: acting
    because: >-
      The run is the support-only audit (D266, D267): the frozen scripts/frozen/t060/ support.ts
      --colony i for the 22 colonies (extraction in memory, no event table written, only whitelisted
      counts to logs/t060-support/), then --pool. The sealed folder is never named or written. D266
      waives Scope B's acceptance for this support reading alone; the reader is frozen (D243 freeze
      block, committed 0e13c45) and the reproduction passed (D265, D268); no event table is written,
      and nothing beyond support is computed.
    by: lead (session e38b977a)
    at: "2026-11-03 16:06 UTC"
    inputs:
      - record: D243
        rev: a0ceb72f78abef50fd2e7d382e082d8d6ec3fd5a370cd4c5509ad3173ec037fe
      - record: D266
        rev: 9ded34980bb3a0f5531582ebe62e7938c58f957a591032ca0ef067dacc8bdfdf
      - record: D267
        rev: decac8e6aabd3e697d83e23e31b0be661593e1d66231b4eeb812585126e5481c
      - record: D268
        rev: a611d465e140a5617e4d1dd8a972961d7f75059ed21e744745ba6177f475830c
---

## History
- 2026-11-02 03:29 UTC lead (session 7b85e17e): created — D243 amendment 1: the blinding order (empirical outputs sealed)
- 2026-11-02 03:35 UTC lead (session 7b85e17e): review for commit:t060-stage0-design-20261102: satisfied — No empirical Stage 0 output exists; its output path is in .claude/sealed-paths.txt.
- 2026-11-03 01:00 UTC lead (session f6353347): review for commit:h6-reading-20261103: not-triggered — The commit holds the H6 reading (D260), F113-F116 and record notes only (git diff: nothing under src/, scripts/, test/ or .claude/); no Stage 0 code, run or output exists or is committed, and T060's design is unchanged. Stage 0's sealed output paths are untouched and nothing from them is in the commit (git status shows no logs/ or Stage 0 files; logs/ is git-ignored).
- 2026-11-03 01:05 UTC lead (session f6353347): review for run:t060-s0-brief1: satisfied — Brief 1 writes only the synthetic folder and must not read, list or write the sealed Stage 0 output folder; no empirical output exists. Brief 1 runs only tests and a Scope A smoke on fully synthetic event tables (3 data sets per case) into logs/t060-synthetic/; it reads no tracks and no H6 intermediate, only roles() metadata for ant counts.
- 2026-11-03 01:08 UTC lead (session f6353347): review for commit:t060-stage0-design-20261102: satisfied — Re-read D243@f25336a56aed: one dated block appended since (2026-11-03 01:04 UTC, the lead's Stage 0 implementation details: order of two briefs, event table, near approach, triplets, matching cell, 0a, 0b likelihood and support, Scope A generator), filling gaps in amendment 1 without changing it. The commit (dca4a4a) holds the version read, so this disposition for it stands; the block is reviewed at the next commit's gate.
- 2026-11-03 01:29 UTC lead (session f6353347): reviewed D261@23cebf2e477f; D261 cites D243 only; brief 1 wrote synthetic outputs only, no empirical output exists, the seal stands
- 2026-11-03 02:22 UTC lead (session f6353347): review for commit:t060-stage0-design-20261102: satisfied — Re-read D243@e11041360645: amendment 2 appended (D262: 0b read as k-bar over a memoryless reference's median; V0 cases b2 and a-sparse added). The commit (dca4a4a) holds the version first read, so this disposition for it stands; the later text is reviewed at the next commit's gate.
- 2026-11-03 02:22 UTC lead (session f6353347): review for run:t060-s0-brief1: satisfied — Re-read D243@e11041360645: amendment 2 (D262) was appended after brief 1's run ended (D261); the run was made against the version read, so this disposition for it stands. Amendment 2's changes are gated under the next run action.
- 2026-11-03 02:22 UTC lead (session f6353347): reviewed D262@5e65c9064d9d; D262 cites D243 (amendment 2): no empirical output exists; the seal stands
- 2026-11-03 02:23 UTC lead (session f6353347): review for run:t060-s0-brief1b: satisfied — Writes only the synthetic folder; the sealed Stage 0 output folder untouched. Follow-up 1b changes the brief-1 code for D243 amendment 2 and runs tests and a Scope A smoke (3 sets per case, plus b2, a-sparse, c-sparse) into logs/t060-synthetic/ only; no tracks, no H6 intermediates, no empirical output.
- 2026-11-03 02:58 UTC lead (session f6353347): review for run:t060-v0-scopeA-20261103: satisfied — Writes only the synthetic folder; the sealed Stage 0 output folder untouched; no empirical output. The run is Scope A's V0 in full: scripts/scratch/t060/scopeA.ts --case all --sets 0:200 --par 10, fully synthetic event tables (only roles() ant counts read), output under logs/t060-synthetic/v0A; code as checked in D263 (reader.ts 01d574a3, scopeA.ts ca53b396).
- 2026-11-03 02:59 UTC lead (session f6353347): reviewed D263@5089416b2612; D263 cites D243: synthetic outputs only (logs/t060-synthetic/); the seal stands
- 2026-11-03 06:53 UTC lead (session 691f3fd9): review for run:t060-s0-brief2: acting — The sealed folder is never named, read or written; real tracks run only in reproduction mode, which writes no event table and prints no statistic from one; real event tables are the lead's after the freeze. Brief 2's runs: T060 tests, tsc, npm test, a Scope A determinism check and a Scope B smoke (synthetic, logs/t060-synthetic/ only), and the reproduction mode on real tracks, which builds event tables in memory and prints or writes only the reproduction values and the speed-bound shares (logs/t060-repro/).
- 2026-11-03 07:01 UTC lead (session 691f3fd9): review for commit:t060-stage0-design-20261102: satisfied — Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's brief-2 details: the colony's list, death records, blind frames, intervals and the sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance rule. The commit (dca4a4a) holds the version first read, so this disposition for it stands; the block is reviewed at the next commit's gate.
- 2026-11-03 07:01 UTC lead (session 691f3fd9): review for run:t060-s0-brief1: satisfied — Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's brief-2 details: the colony's list, death records, blind frames, intervals and the sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance rule. It was appended after this run ended (D261, D263); the run was made against the version read, so this disposition stands. The block is gated under run:t060-s0-brief2.
- 2026-11-03 07:01 UTC lead (session 691f3fd9): review for run:t060-s0-brief1b: satisfied — Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's brief-2 details: the colony's list, death records, blind frames, intervals and the sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance rule. It was appended after this run ended (D261, D263); the run was made against the version read, so this disposition stands. The block is gated under run:t060-s0-brief2.
- 2026-11-03 07:01 UTC lead (session 691f3fd9): review for run:t060-v0-scopeA-20261103: satisfied — Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's brief-2 details: the colony's list, death records, blind frames, intervals and the sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance rule. The running Scope A V0 (synthetic event tables; reader.ts 01d574a3, scopeA.ts ca53b396) uses none of it, so this disposition stands.
- 2026-11-03 09:03 UTC lead (session 691f3fd9): reviewed D264@af6865e287d4, D265@78ad4ca2f334; D264: V0 Scope A passed; D265: the reproduction passed, but Scope B's rules cannot be met, so V0 as a whole has not passed and the outputs stay sealed; Q37's first option would waive Scope B's acceptance for a support-only reading, the user's decision
- 2026-11-03 15:23 UTC lead (session e38b977a): review for commit:t060-stage0-design-20261102: satisfied — Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's details of the support-only audit after D266: a restricted support reader, the extraction in memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates this action and changes nothing it did or read, so the earlier disposition (satisfied) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:23 UTC lead (session e38b977a): review for run:t060-s0-brief1: satisfied — Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's details of the support-only audit after D266: a restricted support reader, the extraction in memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates this action and changes nothing it did or read, so the earlier disposition (satisfied) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:23 UTC lead (session e38b977a): review for run:t060-s0-brief1b: satisfied — Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's details of the support-only audit after D266: a restricted support reader, the extraction in memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates this action and changes nothing it did or read, so the earlier disposition (satisfied) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:23 UTC lead (session e38b977a): review for run:t060-s0-brief2: acting — Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's details of the support-only audit after D266: a restricted support reader, the extraction in memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates this action and changes nothing it did or read, so the earlier disposition (acting) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:23 UTC lead (session e38b977a): review for run:t060-v0-scopeA-20261103: satisfied — Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's details of the support-only audit after D266: a restricted support reader, the extraction in memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates this action and changes nothing it did or read, so the earlier disposition (satisfied) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:24 UTC lead (session e38b977a): reviewed D266@9ded34980bb3; D266 waives Scope B's acceptance (this commitment's 'V0 pass') for the support-only audit alone; everything else here stands: no event table is written (D243 15:18 block), the sealed Stage 0 folder stays sealed and empty, and nothing beyond support is read. The commitment stays open.
- 2026-11-03 15:25 UTC lead (session e38b977a): review for commit:t060-q37-records-20261103: satisfied — The commit holds records only (git status: nothing under src/, scripts/, test/ or .claude/; backlog/ left out): T060's Stage 0 records D261-D266 with D243's dated blocks, X029, STATUS, and plied records (Q36, Q37, P175-P183, dispositions, notes, T037's message). No empirical Stage 0 output exists or is committed (the sealed folder is untouched and git-ignored). D266 waives Scope B's acceptance for the support reading alone, and the audit writes no event table (D243 15:18 block).
- 2026-11-03 15:30 UTC lead (session e38b977a): review for run:t060-support-brief: acting — The run is the implementer's build of the restricted support reader and audit CLI (brief logs/handoff/20261103-1529-t060-support/brief.md): tests, tsc, the support reader on synthetic Scope A/B tables, and one extract.ts --repro on colony 237 (reproduction values only). The audit is not run on tracks; no event table from tracks is written; the sealed folder is never named. D266 waives Scope B's acceptance for the support reading alone; in this build nothing from tracks beyond reproduction values is produced, and the audit CLI writes no event table.
- 2026-11-03 15:42 UTC lead (session e38b977a): reviewed D267@decac8e6aabd; D267 cites D243 for the freeze and keeps event tables in memory only; the sealed folder stays empty and sealed, and the waiver stays limited to the support reading (D266). No change here.
- 2026-11-03 15:52 UTC lead (session e38b977a): review for run:t060-freeze-check: acting — Checking that the frozen copy under scripts/frozen/t060/ runs: frozen extract.ts --colony 15 --repro (reproduction values only, compared with cmp to D265's repro-c15.json) and frozen support.ts --pool on the synthetic Scope B support files (compared with the scratch pool). No audit on tracks, no event table written, the sealed folder never named. Only reproduction values from tracks, already reported in D265; nothing beyond them.
- 2026-11-03 16:00 UTC lead (session e38b977a): review for commit:t060-stage0-design-20261102: satisfied — Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action and changes nothing it did or read, so the earlier disposition (satisfied) stands; the block is reviewed at the next action's gate.
- 2026-11-03 16:00 UTC lead (session e38b977a): review for run:t060-s0-brief1: satisfied — Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action and changes nothing it did or read, so the earlier disposition (satisfied) stands; the block is reviewed at the next action's gate.
- 2026-11-03 16:00 UTC lead (session e38b977a): review for run:t060-s0-brief1b: satisfied — Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action and changes nothing it did or read, so the earlier disposition (satisfied) stands; the block is reviewed at the next action's gate.
- 2026-11-03 16:00 UTC lead (session e38b977a): review for run:t060-s0-brief2: acting — Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action and changes nothing it did or read, so the earlier disposition (acting) stands; the block is reviewed at the next action's gate.
- 2026-11-03 16:00 UTC lead (session e38b977a): review for run:t060-support-brief: acting — Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action and changes nothing it did or read, so the earlier disposition (acting) stands; the block is reviewed at the next action's gate.
- 2026-11-03 16:00 UTC lead (session e38b977a): review for run:t060-v0-scopeA-20261103: satisfied — Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action and changes nothing it did or read, so the earlier disposition (satisfied) stands; the block is reviewed at the next action's gate.
- 2026-11-03 16:03 UTC lead (session e38b977a): review for commit:t060-freeze-20261103: satisfied — The commit holds the T060 freeze and its records: scripts/frozen/t060/ (26 files, byte-identical to D243's freeze block SHA-256s; checked by sha256sum and by the frozen copy's colony-237 repro and synthetic pool, D243), D267, D268, D243's blocks, STATUS, and plied records (P184, P185, dispositions, notes). Nothing under src/ or test/; scripts/scratch/ and logs/ are not committed; backlog/ left out. No empirical Stage 0 output exists or is committed; the sealed folder is untouched. D266 waives Scope B's acceptance for the support reading alone, and the frozen audit writes no event table (D268).
- 2026-11-03 16:06 UTC lead (session e38b977a): review for run:t060-support-audit-20261103: acting — The run is the support-only audit (D266, D267): the frozen scripts/frozen/t060/ support.ts --colony i for the 22 colonies (extraction in memory, no event table written, only whitelisted counts to logs/t060-support/), then --pool. The sealed folder is never named or written. D266 waives Scope B's acceptance for this support reading alone; the reader is frozen (D243 freeze block, committed 0e13c45) and the reproduction passed (D265, D268); no event table is written, and nothing beyond support is computed.
- 2026-11-03 16:15 UTC lead (session e38b977a): set state=fulfilled; set resolved_by=D269 — Stage 0 statistics were never computed and no event table was written; only support was read, under D266 waiver (D269).
