---
id: P66
title: "Rows 1 and 4: held-out predictions, failures reported"
wording: >-
  rows 1 and 4 are held-out predictions, judged and reported, failures included; passing them is not
  a condition of the structure freeze.
made: D181
state: open
nodes: [T036]
reviews:
  - action: commit:20261029
    disposition: not-applicable
    because: No held-out rows are judged or reported by committing.
    by: lead (session 20261029)
    at: "2026-10-29 21:24 UTC"
  - action: run:t057-judge-20261030
    disposition: not-applicable
    because: >-
      Governs the step-9 held-out test of rows 1 and 4; this run is a development judge of the 1999
      fit rows, no held-out data
    by: lead (session 9aa22476)
    at: "2026-10-30 04:50 UTC"
  - action: commit:t060-stage0-design-20261102
    disposition: not-triggered
    because: >-
      The commit records T060's design (D243 with amendment 1), the user's answer (D244), STATUS's
      pointer and plied records only; nothing is built, run, fitted or read; no held-out rows are
      judged or reported.
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
    at: "2026-11-03 07:02 UTC"
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
    at: "2026-11-03 15:24 UTC"
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
    at: "2026-11-03 16:01 UTC"
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
    at: "2026-11-03 16:03 UTC"
  - action: commit:t060-close-20261103
    disposition: not-triggered
    because: >-
      The commit holds records only (git status: nothing under src/, scripts/ or test/; backlog/
      left out): the T060 reading D269, F117, D270, T060's close and its commitment states, P186,
      T063, notes, STATUS. No structure freeze, model change, E6 run, held-out data, paper or
      simulation is in it.
    by: lead (session e38b977a)
    at: "2026-11-03 16:28 UTC"
  - action: commit:b016-records-20261103
    disposition: not-triggered
    because: >-
      The commit holds records only (nothing under src/, scripts/ or test/): B016's item folder
      (README, results, metadata snapshots, item scripts, hand-offs), the generated backlog index,
      X030, D271, D272, Q38, STATUS and plied records (notes, P73/P74 states). No held-out role is
      assigned and no test runs: B016's candidates stay unassigned (X030, Q38).
    by: lead (session e38b977a)
    at: "2026-11-03 16:37 UTC"
  - action: merge:browser-sim-m1@f8d29d5
    disposition: not-triggered
    because: >-
      A local fast-forward of main (8bc7789) to browser-sim-m1 (f8d29d5): it adds no content beyond
      the 18 commits already on the branch, each of them gated when made
      (commit:synchrony-review-20261101 ... commit:b016-records-20261103), where the content this
      commitment governs was reviewed. Nothing is pushed or published by this step. No freeze, model
      change, run, held-out use or new reading is in it.
    by: lead (session e38b977a)
    at: "2026-11-03 16:41 UTC"
  - action: commit:q38-records-20261105
    disposition: not-applicable
    because: >-
      The commit holds records only (D273, D274, P187, T037's close, Q38's answer, node notes,
      STATUS, generated views, and D272's merge-gate dispositions); nothing under src/, scripts/ or
      test/. No held-out prediction is judged or reported.
    by: lead (session bd70e4eb)
    at: "2026-11-05 05:07 UTC"
    inputs:
      - record: D273
        rev: 971eb345342564bda21598cb43c8e576e704a7de4697ed0f942081aae1a269cf
      - record: D274
        rev: f4898d5ef93059e86eeb0fdf449c06180820c023de1b5c03beca59487f7dc48e
  - action: commit:q39-records-20261105
    disposition: not-applicable
    because: >-
      Records-only commit (D275 as corrected, D276, Q39's answer, T063's close, T064 and P188-P197,
      node notes, STATUS, generated views); nothing under src/, scripts/ or test/, and nothing runs.
      No held-out prediction.
    by: lead (session bd70e4eb)
    at: "2026-11-05 05:20 UTC"
    inputs:
      - record: D275
        rev: 332d2e843e26abf8e2eebe32c644ec88dd9f551f1ebdebe77269aee237bc70e5
      - record: D276
        rev: 78ee97edd611e4b322410f6441fc6585434af1b6252b72f4bdb32d49e1271dec
---

## History
- 2026-10-29 20:05 UTC lead (session 7f762276): created — D181 Q05 (the scope rule)
- 2026-10-29 20:16 UTC lead (session 7f762276): reviewed D182: names D181 only for Q11; the rows 1 / 4 rule is unaffected
- 2026-10-29 21:24 UTC lead (session 20261029): review for commit:20261029: not-applicable — No held-out rows are judged or reported by committing.
- 2026-10-30 04:45 UTC lead (session 9aa22476): reviewed D191: it cites D181 only as the source of the Q04 judge; D181's answer on rows 1 and 4 is not touched by T057's L0S1 judge, so P66 is unaffected
- 2026-10-30 04:50 UTC lead (session 9aa22476): review for run:t057-judge-20261030: not-applicable — Governs the step-9 held-out test of rows 1 and 4; this run is a development judge of the 1999 fit rows, no held-out data
- 2026-10-30 05:00 UTC lead (session 9aa22476): reviewed D193: it cites D181 only for the scope of the Q04 judge (sensitivity, no refit); the reading touches none of D181's answer on rows 1 and 4 as held-out predictions, so P66 is unaffected
- 2026-10-31 02:17 UTC lead (session 6b5fb317): reviewed D223@b738f2de5839; D223 cites D181 only to name B005's Done-when 1 as an open option; it uses development data only and judges no held-out row, so rows 1 and 4 are untouched
- 2026-10-31 02:32 UTC lead (session 6b5fb317): reviewed D223@d91126ff338b; D223 amendment 1 (D224) adds the decomposition reading, spell labels, survival support and the entry benchmark; D181 is still cited only for B005's Done-when 1, now left out. No held-out row is judged, so P66 is untouched
- 2026-11-02 03:34 UTC lead (session 7b85e17e): review for commit:t060-stage0-design-20261102: not-triggered — The commit records T060's design (D243 with amendment 1), the user's answer (D244), STATUS's pointer and plied records only; nothing is built, run, fitted or read; no held-out rows are judged or reported.
- 2026-11-03 01:08 UTC lead (session f6353347): review for commit:t060-stage0-design-20261102: not-triggered — Re-read D243@f25336a56aed: one dated block appended since (2026-11-03 01:04 UTC, the lead's Stage 0 implementation details: order of two briefs, event table, near approach, triplets, matching cell, 0a, 0b likelihood and support, Scope A generator), filling gaps in amendment 1 without changing it. The commit (dca4a4a) holds the version read, so this disposition for it stands; the block is reviewed at the next commit's gate.
- 2026-11-03 02:22 UTC lead (session f6353347): review for commit:t060-stage0-design-20261102: not-triggered — Re-read D243@e11041360645: amendment 2 appended (D262: 0b read as k-bar over a memoryless reference's median; V0 cases b2 and a-sparse added). The commit (dca4a4a) holds the version first read, so this disposition for it stands; the later text is reviewed at the next commit's gate.
- 2026-11-03 07:02 UTC lead (session 691f3fd9): review for commit:t060-stage0-design-20261102: not-triggered — Re-read D243@514044e8ab40: one dated block appended since (2026-11-03 06:51 UTC, the lead's brief-2 details: the colony's list, death records, blind frames, intervals and the sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and scoring), filling gaps in amendments 1 and 2 without changing a threshold, label or acceptance rule. The commit (dca4a4a) holds the version first read, so this disposition for it stands; the block is reviewed at the next commit's gate.
- 2026-11-03 15:24 UTC lead (session e38b977a): review for commit:t060-stage0-design-20261102: not-triggered — Re-read D243@ab96ad707023: one dated block appended since (2026-11-03 15:18 UTC, the lead's details of the support-only audit after D266: a restricted support reader, the extraction in memory with no event table written, the colony-237 flag, the freeze, the stops). It postdates this action and changes nothing it did or read, so the earlier disposition (not-triggered) stands; the block is reviewed at the next action's gate.
- 2026-11-03 15:25 UTC lead (session e38b977a): review for commit:t060-q37-records-20261103: not-triggered — The commit holds records only (git status: nothing under src/, scripts/, test/ or .claude/; backlog/ left out): T060's Stage 0 records D261-D266 with D243's dated blocks, X029, STATUS, and plied records (Q36, Q37, P175-P183, dispositions, notes, T037's message). No structure freeze, model change, E6 run, held-out data, paper or simulation is in it.
- 2026-11-03 16:01 UTC lead (session e38b977a): review for commit:t060-stage0-design-20261102: not-triggered — Re-read D243@a0ceb72f78ab: one dated block appended since (2026-11-03, the support audit's code frozen: support.ts, extract.ts and their 26-file import closure copied byte-identical under scripts/frozen/t060/ with their SHA-256s; P172, D267, D268). It postdates this action and changes nothing it did or read, so the earlier disposition (not-triggered) stands; the block is reviewed at the next action's gate.
- 2026-11-03 16:03 UTC lead (session e38b977a): review for commit:t060-freeze-20261103: not-triggered — The commit holds the T060 freeze and its records: scripts/frozen/t060/ (26 files, byte-identical to D243's freeze block SHA-256s; checked by sha256sum and by the frozen copy's colony-237 repro and synthetic pool, D243), D267, D268, D243's blocks, STATUS, and plied records (P184, P185, dispositions, notes). Nothing under src/ or test/; scripts/scratch/ and logs/ are not committed; backlog/ left out. No structure freeze, model change, E6 run, held-out data, paper or simulation is in it.
- 2026-11-03 16:28 UTC lead (session e38b977a): review for commit:t060-close-20261103: not-triggered — The commit holds records only (git status: nothing under src/, scripts/ or test/; backlog/ left out): the T060 reading D269, F117, D270, T060's close and its commitment states, P186, T063, notes, STATUS. No structure freeze, model change, E6 run, held-out data, paper or simulation is in it.
- 2026-11-03 16:32 UTC lead (session e38b977a): reviewed D271@59fa1169345e; D271 cites D181 for B016's exposure rules; it assigns no held-out role and runs no test, so rows 1 and 4's held-out predictions are untouched.
- 2026-11-03 16:37 UTC lead (session e38b977a): review for commit:b016-records-20261103: not-triggered — The commit holds records only (nothing under src/, scripts/ or test/): B016's item folder (README, results, metadata snapshots, item scripts, hand-offs), the generated backlog index, X030, D271, D272, Q38, STATUS and plied records (notes, P73/P74 states). No held-out role is assigned and no test runs: B016's candidates stay unassigned (X030, Q38).
- 2026-11-03 16:41 UTC lead (session e38b977a): review for merge:browser-sim-m1@f8d29d5: not-triggered — A local fast-forward of main (8bc7789) to browser-sim-m1 (f8d29d5): it adds no content beyond the 18 commits already on the branch, each of them gated when made (commit:synchrony-review-20261101 ... commit:b016-records-20261103), where the content this commitment governs was reviewed. Nothing is pushed or published by this step. No freeze, model change, run, held-out use or new reading is in it.
- 2026-11-05 05:07 UTC lead (session bd70e4eb): review for commit:q38-records-20261105: not-applicable — The commit holds records only (D273, D274, P187, T037's close, Q38's answer, node notes, STATUS, generated views, and D272's merge-gate dispositions); nothing under src/, scripts/ or test/. No held-out prediction is judged or reported.
- 2026-11-05 05:20 UTC lead (session bd70e4eb): review for commit:q39-records-20261105: not-applicable — Records-only commit (D275 as corrected, D276, Q39's answer, T063's close, T064 and P188-P197, node notes, STATUS, generated views); nothing under src/, scripts/ or test/, and nothing runs. No held-out prediction.
