---
id: P05
title: Directed navigation frozen before any E6 run
wording: >-
  parameters from the literature, frozen in this file before any E6 run (E6's T50 has been
  inspected); own tests and invariants; run-hash check that the 1999 rows and E2 do not change,
  against a baseline at 157cd66 or later
summary: >-
  "This file" is STATUS (E6 pre-registration, 2026-10-09; baseline clause after the 2026-10-10 wall
  fix).
made: S001
state: open
nodes: [T040, T038]
reviews:
  - action: commit:20261029
    disposition: not-applicable
    because: No E6 run; the commit freezes nothing for E6.
    by: lead (session 20261029)
    at: "2026-10-29 21:24 UTC"
  - action: run:t057-judge-20261030
    disposition: not-applicable
    because: Governs E6 runs; this is a 1999 judge, no E6 run
    by: lead (session 9aa22476)
    at: "2026-10-30 04:50 UTC"
  - action: commit:t060-stage0-design-20261102
    disposition: not-triggered
    because: >-
      The commit records T060's design (D243 with amendment 1), the user's answer (D244), STATUS's
      pointer and plied records only; nothing is built, run, fitted or read; no E6 run.
    by: lead (session 7b85e17e)
    at: "2026-11-02 03:34 UTC"
    inputs:
      - record: D243
        rev: a5fef01895d5a78df9941aa9914c404b673e2e4c311a0c7f0d2afc721813260b
      - record: D244
        rev: 8f3c0feeac9407fabac76aaf0ebf0f44d21bfbe13bc4d9b92233335bdf600a3c
  - action: commit:t060-stage0-design-20261102
    disposition: not-triggered
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
    disposition: not-triggered
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
    at: "2026-11-03 06:59 UTC"
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
    at: "2026-11-03 15:21 UTC"
    inputs:
      - record: D243
        rev: ab96ad707023467de1602a4777f8393d5032ec0974422b5d054200af52b9502a
  - action: commit:t060-q37-records-20261103
    disposition: not-triggered
    because: >-
      The commit holds records only (git status: nothing under src/, scripts/, test/ or .claude/;
      backlog/ left out): T060's Stage 0 records D261-D266 with D243's dated blocks, X029, STATUS,
      and plied records (Q36, Q37, P175-P183, dispositions, notes, T037's message). No structure
      freeze, model change, E6 run, held-out data, paper or simulation is in it.
    by: lead (session e38b977a)
    at: "2026-11-03 15:25 UTC"
  - action: commit:t060-stage0-design-20261102
    disposition: not-triggered
    because: >-
      Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's
      code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical
      under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action
      and changes nothing it did or read, so the earlier disposition (not-triggered) stands; the
      block is reviewed at the next action's gate.
    by: lead (session e38b977a)
    at: "2026-11-03 15:58 UTC"
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
      logs/ are not committed; backlog/ left out. No structure freeze, model change, E6 run,
      held-out data, paper or simulation is in it.
    by: lead (session e38b977a)
    at: "2026-11-03 16:02 UTC"
  - action: merge:browser-sim-m1@f8d29d5
    disposition: not-triggered
    because: >-
      A local fast-forward of main (8bc7789) to browser-sim-m1 (f8d29d5): it adds no content beyond
      the 18 commits already on the branch, each of them gated when made
      (commit:synchrony-review-20261101 ... commit:b016-records-20261103), where the content this
      commitment governs was reviewed. Nothing is pushed or published by this step. No freeze, model
      change, run, held-out use or new reading is in it.
    by: lead (session e38b977a)
    at: "2026-11-03 16:40 UTC"
  - action: merge:browser-sim-m1@78765aa
    disposition: not-triggered
    because: >-
      A fast-forward of main (f8d29d5) to browser-sim-m1 (78765aa), pushed with the user's
      instruction (D326): five commits already on the branch, each gated when made
      (commit:q38-records-20261105 ... commit:partd-backfill-records-20261107). They hold records
      and byte-identical copies of frozen Part D readers; no src/, public/, fit or data change, so
      the published pages are unchanged. No freeze, model change, run, held-out use or new reading
      is in it.
    by: lead (session 9871fd6b)
    at: "2026-11-07 05:43 UTC"
    inputs:
      - record: D326
        rev: 4af08c5fa754c9b883af7b755d3b50d8b0f284acdc6fa13039d238587d0e1a6b
---
Draft label: P5 (docs/threads-draft.md revision 2).

## History
- 2026-10-24 22:11 UTC lead (session 104e7640): created — migrated from docs/threads-draft.md revision 2 (D142)
- 2026-10-24 22:11 UTC lead (session 104e7640): set nodes=["T040","T038"] — attached to its nodes (D142)
- 2026-10-25 00:31 UTC lead (session 7c2d50fd): D144 (T049 scan review) cites this record's links; reviewed, nothing here changes (the cited promises are covered or discharged as D144 lists)
- 2026-10-29 21:24 UTC lead (session 20261029): review for commit:20261029: not-applicable — No E6 run; the commit freezes nothing for E6.
- 2026-10-30 04:50 UTC lead (session 9aa22476): review for run:t057-judge-20261030: not-applicable — Governs E6 runs; this is a 1999 judge, no E6 run
- 2026-11-02 03:34 UTC lead (session 7b85e17e): review for commit:t060-stage0-design-20261102: not-triggered — The commit records T060's design (D243 with amendment 1), the user's answer (D244), STATUS's pointer and plied records only; nothing is built, run, fitted or read; no E6 run.
- 2026-11-03 01:07 UTC lead (session f6353347): review for commit:t060-stage0-design-20261102: not-triggered — Re-read D243@f25336a56aed: one dated block appended since (2026-11-03 01:04 UTC, the lead's Stage 0 implementation details: order of two briefs, event table, near approach, triplets, matching cell, 0a, 0b likelihood and support, Scope A generator), filling gaps in amendment 1 without changing it. The commit (dca4a4a) holds the version read, so this disposition for it stands; the block is reviewed at the next commit's gate.
- 2026-11-03 02:21 UTC lead (session f6353347): review for commit:t060-stage0-design-20261102: not-triggered — Re-read D243@e11041360645: amendment 2 appended (D262: 0b read as k-bar over a memoryless reference's median; V0 cases b2 and a-sparse added). The commit (dca4a4a) holds the version first read, so this disposition for it stands; the later text is reviewed at the next commit's gate.
- 2026-11-03 06:59 UTC lead (session 691f3fd9): review for commit:t060-stage0-design-20261102: not-triggered — Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's brief-2 details: the colony's list, death records, blind frames, intervals and the sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance rule. The commit (dca4a4a) holds the version first read, so this disposition for it stands; the block is reviewed at the next commit's gate.
- 2026-11-03 15:21 UTC lead (session e38b977a): review for commit:t060-stage0-design-20261102: not-triggered — Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's details of the support-only audit after D266: a restricted support reader, the extraction in memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates this action and changes nothing it did or read, so the earlier disposition (not-triggered) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:25 UTC lead (session e38b977a): review for commit:t060-q37-records-20261103: not-triggered — The commit holds records only (git status: nothing under src/, scripts/, test/ or .claude/; backlog/ left out): T060's Stage 0 records D261-D266 with D243's dated blocks, X029, STATUS, and plied records (Q36, Q37, P175-P183, dispositions, notes, T037's message). No structure freeze, model change, E6 run, held-out data, paper or simulation is in it.
- 2026-11-03 15:58 UTC lead (session e38b977a): review for commit:t060-stage0-design-20261102: not-triggered — Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action and changes nothing it did or read, so the earlier disposition (not-triggered) stands; the block is reviewed at the next action's gate.
- 2026-11-03 16:02 UTC lead (session e38b977a): review for commit:t060-freeze-20261103: not-triggered — The commit holds the T060 freeze and its records: scripts/frozen/t060/ (26 files, byte-identical to D243's freeze block SHA-256s; checked by sha256sum and by the frozen copy's colony-237 repro and synthetic pool, D243), D267, D268, D243's blocks, STATUS, and plied records (P184, P185, dispositions, notes). Nothing under src/ or test/; scripts/scratch/ and logs/ are not committed; backlog/ left out. No structure freeze, model change, E6 run, held-out data, paper or simulation is in it.
- 2026-11-03 16:40 UTC lead (session e38b977a): review for merge:browser-sim-m1@f8d29d5: not-triggered — A local fast-forward of main (8bc7789) to browser-sim-m1 (f8d29d5): it adds no content beyond the 18 commits already on the branch, each of them gated when made (commit:synchrony-review-20261101 ... commit:b016-records-20261103), where the content this commitment governs was reviewed. Nothing is pushed or published by this step. No freeze, model change, run, held-out use or new reading is in it.
- 2026-11-07 05:43 UTC lead (session 9871fd6b): review for merge:browser-sim-m1@78765aa: not-triggered — A fast-forward of main (f8d29d5) to browser-sim-m1 (78765aa), pushed with the user's instruction (D326): five commits already on the branch, each gated when made (commit:q38-records-20261105 ... commit:partd-backfill-records-20261107). They hold records and byte-identical copies of frozen Part D readers; no src/, public/, fit or data change, so the published pages are unchanged. No freeze, model change, run, held-out use or new reading is in it.
