---
id: P175
title: "Contact-reset 0b: established only if k-bar over the memoryless reference's median clears 1.5"
wording: >-
  redraw exponential excesses through the same cells, entry and censoring (1,000 draws);
  'established' needs the lower bound of k̄ / reference median above 1.5.
made: D262
state: open
nodes: [T060]
reviews:
  - action: run:t060-s0-brief1b
    disposition: acting
    because: >-
      1b implements this rule exactly as amendment 2 details it. Follow-up 1b changes the brief-1
      code for D243 amendment 2 and runs tests and a Scope A smoke (3 sets per case, plus b2,
      a-sparse, c-sparse) into logs/t060-synthetic/ only; no tracks, no H6 intermediates, no
      empirical output.
    by: lead (session f6353347)
    at: "2026-11-03 02:23 UTC"
    inputs:
      - record: D243
        rev: e110413606458b965ea5fdc9670f4a7e2a7652f907e74045bcebda2b3b069247
      - record: D262
        rev: 5e65c9064d9dba9e92194d28e8a94eb7b147c0f291e18c795a106331d64c5cea
  - action: run:t060-v0-scopeA-20261103
    disposition: acting
    because: >-
      V0 checks this reading's behaviour on cases a-d, b2 and the sparse cases. The run is Scope A's
      V0 in full: scripts/scratch/t060/scopeA.ts --case all --sets 0:200 --par 10, fully synthetic
      event tables (only roles() ant counts read), output under logs/t060-synthetic/v0A; code as
      checked in D263 (reader.ts 01d574a3, scopeA.ts ca53b396).
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
    disposition: satisfied
    because: >-
      The memoryless reference and the k-bar / m0 reading are in reader.ts (D263), unchanged by
      brief 2; the events.ts validation relaxation must leave Scope A outputs byte-identical. Brief
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
  - action: run:t060-s0-brief1b
    disposition: acting
    because: >-
      Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's
      brief-2 details: the colony's list, death records, blind frames, intervals and the
      sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and
      scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance
      rule. It was appended after this run ended (D261, D263); the run was made against the version
      read, so this disposition stands. The block is gated under run:t060-s0-brief2.
    by: lead (session 691f3fd9)
    at: "2026-11-03 07:02 UTC"
    inputs:
      - record: D243
        rev: 514044e8ab400a7c8f9063172ae40a6f5525784aaf1dfc05f2668f416b23c2c7
  - action: run:t060-v0-scopeA-20261103
    disposition: acting
    because: >-
      Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's
      brief-2 details: the colony's list, death records, blind frames, intervals and the
      sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and
      scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance
      rule. The running Scope A V0 (synthetic event tables; reader.ts 01d574a3, scopeA.ts ca53b396)
      uses none of it, so this disposition stands.
    by: lead (session 691f3fd9)
    at: "2026-11-03 07:02 UTC"
    inputs:
      - record: D243
        rev: 514044e8ab400a7c8f9063172ae40a6f5525784aaf1dfc05f2668f416b23c2c7
  - action: run:t060-s0-brief1b
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
  - action: run:t060-s0-brief2
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
  - action: run:t060-v0-scopeA-20261103
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
  - action: commit:t060-q37-records-20261103
    disposition: not-triggered
    because: >-
      The commit holds records only (git status: nothing under src/, scripts/, test/ or .claude/;
      backlog/ left out): T060's Stage 0 records D261-D266 with D243's dated blocks, X029, STATUS,
      and plied records (Q36, Q37, P175-P183, dispositions, notes, T037's message). 0b is not
      computed: the audit's support reader may not fit, reference or label 0b (D243 15:18 block).
    by: lead (session e38b977a)
    at: "2026-11-03 15:25 UTC"
---

## History
- 2026-11-03 02:21 UTC lead (session f6353347): created — D262: the user's answer to Q36, point 1
- 2026-11-03 02:23 UTC lead (session f6353347): review for run:t060-s0-brief1b: acting — 1b implements this rule exactly as amendment 2 details it. Follow-up 1b changes the brief-1 code for D243 amendment 2 and runs tests and a Scope A smoke (3 sets per case, plus b2, a-sparse, c-sparse) into logs/t060-synthetic/ only; no tracks, no H6 intermediates, no empirical output.
- 2026-11-03 02:58 UTC lead (session f6353347): review for run:t060-v0-scopeA-20261103: acting — V0 checks this reading's behaviour on cases a-d, b2 and the sparse cases. The run is Scope A's V0 in full: scripts/scratch/t060/scopeA.ts --case all --sets 0:200 --par 10, fully synthetic event tables (only roles() ant counts read), output under logs/t060-synthetic/v0A; code as checked in D263 (reader.ts 01d574a3, scopeA.ts ca53b396).
- 2026-11-03 06:53 UTC lead (session 691f3fd9): review for run:t060-s0-brief2: satisfied — The memoryless reference and the k-bar / m0 reading are in reader.ts (D263), unchanged by brief 2; the events.ts validation relaxation must leave Scope A outputs byte-identical. Brief 2's runs: T060 tests, tsc, npm test, a Scope A determinism check and a Scope B smoke (synthetic, logs/t060-synthetic/ only), and the reproduction mode on real tracks, which builds event tables in memory and prints or writes only the reproduction values and the speed-bound shares (logs/t060-repro/).
- 2026-11-03 07:02 UTC lead (session 691f3fd9): review for run:t060-s0-brief1b: acting — Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's brief-2 details: the colony's list, death records, blind frames, intervals and the sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance rule. It was appended after this run ended (D261, D263); the run was made against the version read, so this disposition stands. The block is gated under run:t060-s0-brief2.
- 2026-11-03 07:02 UTC lead (session 691f3fd9): review for run:t060-v0-scopeA-20261103: acting — Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's brief-2 details: the colony's list, death records, blind frames, intervals and the sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance rule. The running Scope A V0 (synthetic event tables; reader.ts 01d574a3, scopeA.ts ca53b396) uses none of it, so this disposition stands.
- 2026-11-03 15:23 UTC lead (session e38b977a): review for run:t060-s0-brief1b: acting — Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's details of the support-only audit after D266: a restricted support reader, the extraction in memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates this action and changes nothing it did or read, so the earlier disposition (acting) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:23 UTC lead (session e38b977a): review for run:t060-s0-brief2: satisfied — Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's details of the support-only audit after D266: a restricted support reader, the extraction in memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates this action and changes nothing it did or read, so the earlier disposition (satisfied) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:23 UTC lead (session e38b977a): review for run:t060-v0-scopeA-20261103: acting — Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's details of the support-only audit after D266: a restricted support reader, the extraction in memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates this action and changes nothing it did or read, so the earlier disposition (acting) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:25 UTC lead (session e38b977a): review for commit:t060-q37-records-20261103: not-triggered — The commit holds records only (git status: nothing under src/, scripts/, test/ or .claude/; backlog/ left out): T060's Stage 0 records D261-D266 with D243's dated blocks, X029, STATUS, and plied records (Q36, Q37, P175-P183, dispositions, notes, T037's message). 0b is not computed: the audit's support reader may not fit, reference or label 0b (D243 15:18 block).
