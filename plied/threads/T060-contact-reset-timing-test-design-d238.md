---
id: T060
title: "Contact-reset timing test: design (D238 item 2)"
parent: T023
status: closed
actor: lead
outcome:
  quote: >-
    the three-interval comparison is unsupported by this extraction and observation rule, and T060
    closes.
  ref: D269
carries: [F117, F114]
links: [D237, D238, D243, Q32, D244, D261, Q36, D262, D264, D265, Q37, D266, D267, D268, D269]
scanned:
  - record: D265
    rev: 78ad4ca2f334fa5f8cc4f7ad113df8220666b1cc9d7463bd0aafce0eb2bf0046
    at: "2026-11-03 09:03 UTC"
    by: lead (session 691f3fd9)
    because: >-
      read in full: its one 'pending' is the colony-237 old-tag EDGE, carried in Q37's body as part
      of the user's decision; no new conditional or deferral
  - record: D268
    rev: a611d465e140a5617e4d1dd8a972961d7f75059ed21e744745ba6177f475830c
    at: "2026-11-03 16:02 UTC"
    by: lead (session e38b977a)
    because: >-
      read in full: its 'before any track is read' describes where an invalid-index run stops; no
      conditional or deferral
---

## History
- 2026-11-01 18:20 UTC lead (session f6ab21fd): created — D238: the user's second next work
- 2026-11-01 19:12 UTC lead (session f6ab21fd): reviewed D239@a5d3879fe9c2, D240@5875f9598246; D239 and D240 read: no change here (D240 is the T061 inventory; D239 starts T059 and T061).
- 2026-11-01 19:16 UTC lead (session f6ab21fd): reviewed D241@c351e62616d5; D241 (H6 design proposal) read: it cites this record's links for context; nothing here changes.
- 2026-11-01 22:45 UTC lead (session f6ab21fd): reviewed D241@597483bc51a5, D242@95cc70c9ace0; D241 amendment 1 and D242 read: nothing here changes beyond what D242's commitments record.
- 2026-11-02 03:14 UTC lead (session 7b85e17e): reviewed D241@3bb427d5e808; D241's implementation details (onset definition from onsetStats.ts, 25 mm coverage radius, S1 sampling, runs, queens) read: T060 reuses the onset definition and replaces the fixed coverage radius with a blind-opportunity rule for whole intervals (D243); nothing else here changes
- 2026-11-02 03:14 UTC lead (session 7b85e17e): set actor=user; added D243 to links; added Q32 to links — D243: design drafted; waiting on the user's approval (Q32)
- 2026-11-02 03:29 UTC lead (session 7b85e17e): set actor=lead; added D244 to links — D244: D243 approved with amendments (amendment 1); next, the Stage 0 extraction, matching and V0 checks by the implementer, once H6's onset, contact, coverage and zone code (T059) is built and checked; Stage 1 deferred
- 2026-11-03 00:44 UTC lead (session eac59010): reviewed F114@33d7702cbae6; Reviewed F114: under H6's coverage rule a covered window almost always holds an observed contact (no-observed-contact share 0.0005 at 10 s, 0 at 60 s) and 76-97 % of windows are unknown at 10 s; Stage 0's identifiability question meets this directly when it reuses H6's code; nothing in T060's design changes here
- 2026-11-03 00:53 UTC lead (session eac59010): reviewed D260@33ffee2d7b35, F114@96172249635c; Correction to my 00:4x note (D260 dated line, F114 revised): the 0.0005 is among classified onsets (an observed contact, counted whatever the coverage, or covered without one); the output shows that windows without an observed contact almost never meet coverage, not that a covered window almost always holds a contact (covered contacts are not counted apart). The coverage limitation stands; Stage 0 meets it
- 2026-11-03 01:07 UTC lead (session f6353347): Stage 0 started: the lead's implementation details appended to D243 (2026-11-03 01:04 UTC dated block); brief 1 (event-table reader with matching, 0a, 0b, and Scope A; smoke of 3 synthetic sets per case) with the implementer, brief logs/handoff/20261103-0106-t060-s0-reader/brief.md, gate run:t060-s0-brief1 passed; code to scripts/scratch/t060/, synthetic outputs to logs/t060-synthetic/. Brief 2 (extraction, Scope B, reproduction, speed-bound check) after it
- 2026-11-03 01:29 UTC lead (session f6353347): set actor=user; added D261 to links; added Q36 to links — D261: brief 1 built and checked; V0 and brief 2 wait on the user's answer to Q36
- 2026-11-03 02:21 UTC lead (session f6353347): set actor=lead; added D262 to links — D262: Q36 answered; D243 amendment 2; next, the brief-1 code changed for it (implementer), then V0
- 2026-11-03 02:23 UTC lead (session f6353347): Q36 answered (D262); D243 amendment 2; follow-up 1b (amendment 2 in the brief-1 code, smoke) with the same implementer, appended to logs/handoff/20261103-0106-t060-s0-reader/brief.md; gate run:t060-s0-brief1b passed
- 2026-11-03 02:59 UTC lead (session f6353347): reviewed D263@5089416b2612; D263: follow-up 1b checked (memoryless reference, b2, a-sparse, c-sparse; smoke as intended). Scope A V0 in full running: logs/runs/t060-v0-scopeA-20261103-20261103T025824Z (gate run:t060-v0-scopeA-20261103, --par 10, about 2 h), outputs logs/t060-synthetic/v0A. Next: brief 2 (extraction, Scope B, reproduction, speed-bound check)
- 2026-11-03 06:55 UTC lead (session 691f3fd9): reviewed D243@514044e8ab40; Brief 2 started: the lead's details appended to D243 (2026-11-03 06:51 UTC dated block: colony's list, death records, blind frames, intervals and the sustained-onset rule, sensitivities, reproduction, speed-bound check, Scope B generator and scoring); gate run:t060-s0-brief2 passed. Implementer working from logs/handoff/20261103-0655-t060-s0-extract/brief.md; code to scripts/scratch/t060/, synthetic outputs logs/t060-synthetic/, reproduction outputs logs/t060-repro/. Scope A V0 still running (logs/runs/t060-v0-scopeA-20261103-20261103T025824Z; a laptop suspend stalled sets 50-59 for about 3 h, the run continued).
- 2026-11-03 09:03 UTC lead (session 691f3fd9): set actor=user; added D264 to links; added D265 to links; added Q37 to links — D264: V0 Scope A passes; D265: brief 2 checked, reproduction and speed bound pass, Scope B's rules cannot be met under the design; Q37 to the user (P166). Outputs: logs/t060-synthetic/v0A, scopeB, logs/t060-repro; code uncommitted scratch in scripts/scratch/t060/
- 2026-11-03 09:03 UTC lead (session 691f3fd9): scanned D265 (rev 78ad4ca2f334): no commitment to record — read in full: its one 'pending' is the colony-237 old-tag EDGE, carried in Q37's body as part of the user's decision; no new conditional or deferral
- 2026-11-03 15:18 UTC lead (session e38b977a): set actor=lead; set next=1; added D266 to links — D266: Q37 answered; next, the support-only audit (D243 dated block of 2026-11-03 ≈ 15:18 UTC): a restricted support reader built by the implementer, the freeze (P172), the extraction run in memory, the support counts read
- 2026-11-03 15:30 UTC lead (session e38b977a): Support-only audit (D266; D243 15:18 block): records committed (3b02e94, gate commit:t060-q37-records-20261103). Implementer building the restricted support reader and audit CLI from logs/handoff/20261103-1529-t060-support/brief.md (gate run:t060-support-brief passed); code to scripts/scratch/t060/support.ts (scratch until frozen), checks to logs/t060-support-check/. Then the lead's check, the freeze under scripts/frozen/t060/ (P172), the audit run.
- 2026-11-03 15:42 UTC lead (session e38b977a): added D267 to links — D267: the freeze commit approved, gated, once the checks pass; the stop rule kept
- 2026-11-03 16:02 UTC lead (session e38b977a): scanned D268 (rev a611d465e140): no commitment to record — read in full: its 'before any track is read' describes where an invalid-index run stops; no conditional or deferral
- 2026-11-03 16:02 UTC lead (session e38b977a): reviewed D268@a611d465e140, D243@a0ceb72f78ab; D268: the support reader and audit CLI built and checked (equality with readStage0, whitelist and forbidden-name tests, colony-237 repro byte-identical). D243's freeze block: support.ts, extract.ts and their 26-file closure frozen under scripts/frozen/t060/ (SHA-256s there); the frozen copy reproduces colony 237 and pools identically (logs/t060-freeze-check/). Next: the gated freeze commit (D267, P184), then the audit from the frozen copy.
- 2026-11-03 16:06 UTC lead (session e38b977a): Audit running: logs/runs/t060-support-audit-20261103-20261103T160635Z (gate run:t060-support-audit-20261103 passed; frozen code from 0e13c45; 3 colonies at a time, about 25-35 min), outputs logs/t060-support/ (support-c<i>.json, pooled.json; whitelisted counts only, no event table).
- 2026-11-03 16:15 UTC lead (session e38b977a): set status=closed; cleared next; added D268 to links; added D269 to links; set outcome.quote=the three-interval comparison is unsupported by this extraction and observati…; set outcome.ref=D269; set carries=["F117","F114"] — D269: support retained by the frozen extraction fails in the primary and every sensitivity; closed by the stop rule (D266, D267)
- 2026-11-03 16:27 UTC lead (session e38b977a): reviewed D270@93338b6cdd5e; D270: the closing records approved for a gated commit; the empty Stage 0 folder stays sealed (P186). The close stands; nothing reopens.
