---
id: P165
title: "Contact-reset: the speed bound checked before anything else is read"
wording: >-
  If it exceeds 0.1 %, the bound is not independent of the data and the user decides before anything
  else is read.
made: D243
state: not-triggered
nodes: [T060]
resolved_by: D265
reviews:
  - action: commit:t060-stage0-design-20261102
    disposition: not-triggered
    because: Nothing is read; the speed-bound check comes with the reproduction, after the build.
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
      committed, and T060's design is unchanged.
    by: lead (session f6353347)
    at: "2026-11-03 00:59 UTC"
    inputs:
      - record: D260
        rev: 33ffee2d7b35cc68baca7141a758621b02f8e5a016a185532a7b57b6aa1126cf
  - action: run:t060-s0-brief1
    disposition: not-triggered
    because: >-
      Nothing empirical is read in brief 1; the speed-bound check comes with the reproduction in
      brief 2, before anything else empirical. Brief 1 runs only tests and a Scope A smoke on fully
      synthetic event tables (3 data sets per case) into logs/t060-synthetic/; it reads no tracks
      and no H6 intermediate, only roles() metadata for ant counts.
    by: lead (session f6353347)
    at: "2026-11-03 01:05 UTC"
    inputs:
      - record: D243
        rev: f25336a56aedb6617594ff5e016b3b016991badba61a07f1db99860b9db336da
  - action: commit:t060-stage0-design-20261102
    disposition: not-triggered
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
    disposition: not-triggered
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
      Nothing empirical read; the speed-bound check comes with brief 2. Follow-up 1b changes the
      brief-1 code for D243 amendment 2 and runs tests and a Scope A smoke (3 sets per case, plus
      b2, a-sparse, c-sparse) into logs/t060-synthetic/ only; no tracks, no H6 intermediates, no
      empirical output.
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
      Nothing empirical read; the speed-bound check comes with brief 2. The run is Scope A's V0 in
      full: scripts/scratch/t060/scopeA.ts --case all --sets 0:200 --par 10, fully synthetic event
      tables (only roles() ant counts read), output under logs/t060-synthetic/v0A; code as checked
      in D263 (reader.ts 01d574a3, scopeA.ts ca53b396).
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
      The speed-bound shares are printed with the reproduction; the brief says that if either
      exceeds 0.1 % the implementer stops and reports, and nothing else runs on real tracks. Brief
      2's runs: T060 tests, tsc, npm test, a Scope A determinism check and a Scope B smoke
      (synthetic, logs/t060-synthetic/ only), and the reproduction mode on real tracks, which builds
      event tables in memory and prints or writes only the reproduction values and the speed-bound
      shares (logs/t060-repro/).
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
    disposition: not-triggered
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
    disposition: not-triggered
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
    disposition: not-triggered
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
    disposition: not-triggered
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
    disposition: not-triggered
    because: >-
      Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's
      details of the support-only audit after D266: a restricted support reader, the extraction in
      memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates
      this action and changes nothing it did or read, so the earlier disposition (not-triggered)
      stands; the block is reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 15:23 UTC"
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
    at: "2026-11-03 15:23 UTC"
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
    disposition: not-triggered
    because: >-
      Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's
      details of the support-only audit after D266: a restricted support reader, the extraction in
      memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates
      this action and changes nothing it did or read, so the earlier disposition (not-triggered)
      stands; the block is reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 15:23 UTC"
    inputs:
      - record: D243
        rev: ab96ad707023467de1602a4777f8393d5032ec0974422b5d054200af52b9502a
---

## History
- 2026-11-02 03:29 UTC lead (session 7b85e17e): created — D243 amendment 1, point 1
- 2026-11-02 03:35 UTC lead (session 7b85e17e): review for commit:t060-stage0-design-20261102: not-triggered — Nothing is read; the speed-bound check comes with the reproduction, after the build.
- 2026-11-03 00:59 UTC lead (session f6353347): review for commit:h6-reading-20261103: not-triggered — The commit holds the H6 reading (D260), F113-F116 and record notes only (git diff: nothing under src/, scripts/, test/ or .claude/); no Stage 0 code, run or output exists or is committed, and T060's design is unchanged.
- 2026-11-03 01:05 UTC lead (session f6353347): review for run:t060-s0-brief1: not-triggered — Nothing empirical is read in brief 1; the speed-bound check comes with the reproduction in brief 2, before anything else empirical. Brief 1 runs only tests and a Scope A smoke on fully synthetic event tables (3 data sets per case) into logs/t060-synthetic/; it reads no tracks and no H6 intermediate, only roles() metadata for ant counts.
- 2026-11-03 01:08 UTC lead (session f6353347): review for commit:t060-stage0-design-20261102: not-triggered — Re-read D243@f25336a56aed: one dated block appended since (2026-11-03 01:04 UTC, the lead's Stage 0 implementation details: order of two briefs, event table, near approach, triplets, matching cell, 0a, 0b likelihood and support, Scope A generator), filling gaps in amendment 1 without changing it. The commit (dca4a4a) holds the version read, so this disposition for it stands; the block is reviewed at the next commit's gate.
- 2026-11-03 01:29 UTC lead (session f6353347): reviewed D261@23cebf2e477f; D261 cites D243 only; nothing empirical was read, the speed-bound check is still to come with brief 2's reproduction
- 2026-11-03 02:22 UTC lead (session f6353347): review for commit:t060-stage0-design-20261102: not-triggered — Re-read D243@e11041360645: amendment 2 appended (D262: 0b read as k-bar over a memoryless reference's median; V0 cases b2 and a-sparse added). The commit (dca4a4a) holds the version first read, so this disposition for it stands; the later text is reviewed at the next commit's gate.
- 2026-11-03 02:22 UTC lead (session f6353347): review for run:t060-s0-brief1: not-triggered — Re-read D243@e11041360645: amendment 2 (D262) was appended after brief 1's run ended (D261); the run was made against the version read, so this disposition for it stands. Amendment 2's changes are gated under the next run action.
- 2026-11-03 02:22 UTC lead (session f6353347): reviewed D262@5e65c9064d9d; D262 cites D243 (amendment 2): nothing empirical read; the speed-bound check still comes with brief 2
- 2026-11-03 02:23 UTC lead (session f6353347): review for run:t060-s0-brief1b: not-triggered — Nothing empirical read; the speed-bound check comes with brief 2. Follow-up 1b changes the brief-1 code for D243 amendment 2 and runs tests and a Scope A smoke (3 sets per case, plus b2, a-sparse, c-sparse) into logs/t060-synthetic/ only; no tracks, no H6 intermediates, no empirical output.
- 2026-11-03 02:58 UTC lead (session f6353347): review for run:t060-v0-scopeA-20261103: not-triggered — Nothing empirical read; the speed-bound check comes with brief 2. The run is Scope A's V0 in full: scripts/scratch/t060/scopeA.ts --case all --sets 0:200 --par 10, fully synthetic event tables (only roles() ant counts read), output under logs/t060-synthetic/v0A; code as checked in D263 (reader.ts 01d574a3, scopeA.ts ca53b396).
- 2026-11-03 02:59 UTC lead (session f6353347): reviewed D263@5089416b2612; D263 cites D243: nothing empirical read; the check still comes with brief 2
- 2026-11-03 06:53 UTC lead (session 691f3fd9): review for run:t060-s0-brief2: acting — The speed-bound shares are printed with the reproduction; the brief says that if either exceeds 0.1 % the implementer stops and reports, and nothing else runs on real tracks. Brief 2's runs: T060 tests, tsc, npm test, a Scope A determinism check and a Scope B smoke (synthetic, logs/t060-synthetic/ only), and the reproduction mode on real tracks, which builds event tables in memory and prints or writes only the reproduction values and the speed-bound shares (logs/t060-repro/).
- 2026-11-03 07:01 UTC lead (session 691f3fd9): review for commit:t060-stage0-design-20261102: not-triggered — Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's brief-2 details: the colony's list, death records, blind frames, intervals and the sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance rule. The commit (dca4a4a) holds the version first read, so this disposition for it stands; the block is reviewed at the next commit's gate.
- 2026-11-03 07:01 UTC lead (session 691f3fd9): review for run:t060-s0-brief1: not-triggered — Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's brief-2 details: the colony's list, death records, blind frames, intervals and the sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance rule. It was appended after this run ended (D261, D263); the run was made against the version read, so this disposition stands. The block is gated under run:t060-s0-brief2.
- 2026-11-03 07:01 UTC lead (session 691f3fd9): review for run:t060-s0-brief1b: not-triggered — Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's brief-2 details: the colony's list, death records, blind frames, intervals and the sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance rule. It was appended after this run ended (D261, D263); the run was made against the version read, so this disposition stands. The block is gated under run:t060-s0-brief2.
- 2026-11-03 07:01 UTC lead (session 691f3fd9): review for run:t060-v0-scopeA-20261103: not-triggered — Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's brief-2 details: the colony's list, death records, blind frames, intervals and the sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance rule. The running Scope A V0 (synthetic event tables; reader.ts 01d574a3, scopeA.ts ca53b396) uses none of it, so this disposition stands.
- 2026-11-03 09:03 UTC lead (session 691f3fd9): set state=not-triggered; set resolved_by=D265 — D265: the speed-bound shares are 0.0002 % of all steps and 0.0074 % of moving steps, below 0.1 %
- 2026-11-03 15:23 UTC lead (session e38b977a): review for commit:t060-stage0-design-20261102: not-triggered — Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's details of the support-only audit after D266: a restricted support reader, the extraction in memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates this action and changes nothing it did or read, so the earlier disposition (not-triggered) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:23 UTC lead (session e38b977a): review for run:t060-s0-brief1: not-triggered — Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's details of the support-only audit after D266: a restricted support reader, the extraction in memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates this action and changes nothing it did or read, so the earlier disposition (not-triggered) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:23 UTC lead (session e38b977a): review for run:t060-s0-brief1b: not-triggered — Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's details of the support-only audit after D266: a restricted support reader, the extraction in memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates this action and changes nothing it did or read, so the earlier disposition (not-triggered) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:23 UTC lead (session e38b977a): review for run:t060-s0-brief2: acting — Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's details of the support-only audit after D266: a restricted support reader, the extraction in memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates this action and changes nothing it did or read, so the earlier disposition (acting) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:23 UTC lead (session e38b977a): review for run:t060-v0-scopeA-20261103: not-triggered — Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's details of the support-only audit after D266: a restricted support reader, the extraction in memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates this action and changes nothing it did or read, so the earlier disposition (not-triggered) stands; the block is reviewed at the next action's gate.
