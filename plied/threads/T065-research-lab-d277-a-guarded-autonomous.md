---
id: T065
title: >-
  Research lab (D277): a guarded autonomous lab outside the repo (ants-lab), built by the
  implementer from briefs
status: open
actor: lead
uses: [D277]
scanned:
  - record: D287
    rev: 0842e30c5f21db39572e29843ef8aa4d88c51cf4c0c04e2c87fcd92ada4a5015
    at: "2026-11-05 16:55 UTC"
    by: lead (session 772be7be)
    because: >-
      D287 is the user's instruction to commit the stage-1b records and ants-lab's code, then write
      the stage-1c brief; it holds no if-X-then-Y commitment
  - record: D297
    rev: e33106d3fa8a1ce0ec2ef77bd17ba08a7e90249beb7a1bc132f03286eca52074
    at: "2026-11-05 22:08 UTC"
    by: lead (session 487510ed)
    because: >-
      'before any session' describes when the lab's session-limit check runs in its code (an ask at
      step start); it commits the project to nothing, and its follow-up is the brief § Follow-up 1,
      not a commitment.
  - record: D299
    rev: 8e6a248061db6ae08094ea0374a6835a4db20c9c414d140dfc68668401f137fc
    at: "2026-11-05 22:17 UTC"
    by: lead (session 487510ed)
    because: >-
      'pending ask' names a requirement for the 2b brief (the loop must not start a step on a node
      with a pending ask); it is carried into that brief, not a project commitment.
  - record: D323
    rev: aa8cf7819ac48b758a116c8c0b2d523587a7004a427eec49f94f11306200b97a
    at: "2026-11-07 05:28 UTC"
    by: lead (session 9871fd6b)
    because: >-
      D323's 'before any' restates D290's standing rule (allowedFeatures changes are the user's); no
      new commitment
---

## History
- 2026-11-05 05:33 UTC lead (session 48c74063): created — D277: the user asked for an Agent SDK research lab with delegated review; this thread holds its build
- 2026-11-05 05:37 UTC lead (session 48c74063): reviewed D278@07ac35c141c5; D278: user's review adopted in full; ants-lab DESIGN, policy, schemas and prompts revised; the stage-1a brief rewritten before hand-over (old dispositions for run:lab-1a superseded by a new action name).
- 2026-11-05 05:45 UTC lead (session 48c74063): reviewed D279@22eb7cdfc9f1; D279 read: the user's design instructions (container guardrails, housekeeping, suggestions register, model ladder, never Fable 5.1) are built into ants-lab DESIGN, config and prompts; no change to T065's commitments.
- 2026-11-05 05:47 UTC lead (session 48c74063): Stage 1a (decision core) handed to the implementer: brief logs/handoff/20261105-0535-lab-1a/brief.md; code in ~/repos/ants-lab (local). Later briefs: 1b processes, 1c containers, 2 conductor.
- 2026-11-05 05:59 UTC lead (session 48c74063): reviewed D280@e1c4e6a09f8a; D280 read: commit of the lab records authorised by the user; data-roles table filled in ants-lab (deny by default); tokens in place. No change to T065's commitments.
- 2026-11-05 06:03 UTC lead (session 48c74063): reviewed D281@bd2f465cb817; D281 read: treated_worker_list.txt set to unused in the lab's data-roles table (user); table otherwise approved.
- 2026-11-05 06:08 UTC lead (session 48c74063): reviewed D282@23fbdb91f91f; D282 read: Claude made the scarce provider (per-provider pacing; clerk and curator on Codex with Claude fallbacks); DESIGN and config updated; the implementer told mid-stage.
- 2026-11-05 06:19 UTC lead (session 48c74063): Stage 1a built and checked (D284; correction D283 fixed); next: stage 1b brief.
- 2026-11-05 06:21 UTC lead (session 48c74063): Stage 1b handed to the implementer: brief logs/handoff/20261105-0620-lab-1b/brief.md (gate run:lab-1b passes); lab repo still uncommitted pending the user's OK, baseline copy of 1a kept in the lead's scratch.
- 2026-11-05 07:02 UTC lead (session 48c74063): Stage 1b reported (logs/handoff/20261105-0620-lab-1b/report.md); the lead's check found workspaces carry the checkout's git history (D285, correction); follow-up handed to the same implementer (brief follow-up section; gate run:lab-1b-fix passes).
- 2026-11-05 16:35 UTC lead (session 772be7be): Stage 1b follow-up (D285, logs/handoff/20261105-0620-lab-1b/brief.md § Follow-up) was interrupted at the previous session's usage limit partway through item 1: workspace.ts rewritten toward a history-free init, 5 tests failing (index-pack --stdin usage error), tsc clean, no follow-up report. Re-handed to the implementer to finish from that state.
- 2026-11-05 16:52 UTC lead (session 772be7be): Stage 1b follow-up done and checked (D286): workspaces carry no history (D285 fixed), Codex strict schemas with one real smoke, probes and tripwire severity/authority; 244 tests. Open for the next brief: the curator's read-only sandbox against its drafts write set, and whether amended authority entries halt. Next: stage 1c (containers).
- 2026-11-05 16:55 UTC lead (session 772be7be): scanned D287 (rev 0842e30c5f21): no commitment to record — D287 is the user's instruction to commit the stage-1b records and ants-lab's code, then write the stage-1c brief; it holds no if-X-then-Y commitment
- 2026-11-05 16:59 UTC lead (session 772be7be): Stage 1c (containers, proxy, runner, transcript audit; curator back to read-only) handed to the implementer: brief logs/handoff/20261105-1710-lab-1c/brief.md, gated run:lab-1c. Lead's files changed for it: policy/actions.json (curator write set [], docs_map note) and prompts/curator.md.
- 2026-11-05 17:04 UTC lead (session 772be7be): D288: the user asked for a local, read-only tracking UI for the lab at work (lab ui); specified in ants-lab DESIGN 'Watching the lab'. Its brief follows stage 2 (the conductor defines the step, session and inbox records it reads).
- 2026-11-05 17:35 UTC lead (session 772be7be): Stage 1c built and checked (D289). Follow-up handed to the same implementer (brief.md § Follow-up, gated run:lab-1c-fix): per-role allowlists keyed by fixed container IPs, per-session proxy log, Claude non-essential traffic off, host-side git config isolated. Lead's policy split: policy/net-roles.json (new) and web-allowlist.txt now docs only. Codex and Muse smokes wait on the user's lab logins.
- 2026-11-05 17:39 UTC lead (session 772be7be): The user logged in to the lab's Codex and Muse homes (~/.config/ants-lab/{codex,muse}-home; login files present, mode 600, contents not read). The implementer is told to run the Codex and Muse container smokes in the 1c follow-up.
- 2026-11-05 17:52 UTC lead (session 772be7be): Stage 1c follow-up 1 checked (D290): per-role allowlists, per-session proxy log; Claude and Muse smokes ok, Codex failed on its code-mode host. Lead narrowed provider hosts and made Codex features deny-by-default (lab.config.json codex.allowedFeatures); follow-up 2 (gated run:lab-1c-fix2) wires it and repeats the Codex smoke.
- 2026-11-05 18:02 UTC lead (session 772be7be): Stage 1c follow-up 2 checked (D291): Codex features deny-by-default, 42 disabled, 310 + 9 tests. Lead decisions in D291: engine homes per session (only the login crosses sessions; DESIGN Walls 3-4 amended), the pre-turn code-mode notice is not a failure. Follow-up 3 next (brief § Follow-up 3).
- 2026-11-05 18:14 UTC lead (session 772be7be): Stage 1c follow-up 3 checked (D292): per-session engine homes, code-mode notice recorded, 324 + 10 tests, Codex and Muse smokes ok. Stage 1c done; open: login field names unverified (user keys-only check), stale-home sweep (stage 2 brief). The 1c commit waits for the user (D290).
- 2026-11-05 21:04 UTC lead (session 772be7be): Login copy-back fields verified from the user's keys-only listing and the rule tightened to refreshable fields only (D293); follow-up 4 next, no model calls.
- 2026-11-05 21:09 UTC lead (session 772be7be): User (D294): hold the 1c commits, go ahead; live-session data and quiet/refused-request alerts added to DESIGN and go in the stage 2 brief. Follow-up 4 checked (D295): stage 1c complete, uncommitted. Next: stage 2 brief.
- 2026-11-05 21:12 UTC lead (session 772be7be): Stage 2 split (D296): 2a the step pipeline with fakes, 2b loop/CLI/recovery, 2c first live steps (to the user first), then the UI. Amendments to authority entries go to the user. Implementer working on 2a: logs/handoff/20261105-2112-lab-2a/brief.md.
- 2026-11-05 21:36 UTC lead (session 487510ed): Previous session hit its usage limit at 21:13 UTC before the 2a implementer started (no transcript, ants-lab tree unchanged at 84a50dde). Gate run:lab-2a re-checked (passed); implementer relaunched at 21:37 UTC on logs/handoff/20261105-2112-lab-2a/brief.md.
- 2026-11-05 22:08 UTC lead (session 487510ed): Stage 2a checked (D297): 388 + 10 tests reproduced, ants status unchanged, T065 dry run ok. Defect D298 (plied note without --expect). Lead readings in D297: session limit counts earlier unclosed steps, checked at step start; executed patches are re-reviewed (D278 item 4). Follow-up 1 (gated run:lab-2a-fix1) running: brief § Follow-up 1.
- 2026-11-05 22:08 UTC lead (session 487510ed): scanned D297 (rev e33106d3fa8a): no commitment to record — 'before any session' describes when the lab's session-limit check runs in its code (an ask at step start); it commits the project to nothing, and its follow-up is the brief § Follow-up 1, not a commitment.
- 2026-11-05 22:17 UTC lead (session 487510ed): Stage 2a follow-up 1 checked (D299): D298 fixed, session limit per D297, kept-workspace apply_patch false-halt bug fixed; 396 + 10 tests. Stage 2a complete, uncommitted. Next: the 2b brief (loop, CLI, recovery, notifications).
- 2026-11-05 22:17 UTC lead (session 487510ed): scanned D299 (rev 8e6a248061db): no commitment to record — 'pending ask' names a requirement for the 2b brief (the loop must not start a step on a node with a pending ask); it is carried into that brief, not a project commitment.
- 2026-11-05 22:21 UTC lead (session 487510ed): Stage 2b brief written (D300 rules; DESIGN amended): logs/handoff/20261105-2219-lab-2b/brief.md, gated run:lab-2b (P198-P201 disposed). P201: the lab's thread queue goes to the user with 2c. Implementer running 2b.
- 2026-11-05 23:08 UTC lead (session 487510ed): Stage 2b checked (D301): 456 + 10 tests, real lab run refuses (not enabled). 1c-2b uncommitted (D294). Before 2c: Q40 to the user (meter wiring from the lab's homes, the thread queue P201, --alongside, config duplicates, then lab enable).
- 2026-11-05 23:14 UTC lead (session 487510ed): reviewed D302@1aa559d7d917; Q40 answered (D302): 2c prepared as recommended; P201 fulfilled (plied lab actor, queue.actor lab). 2c-prep brief at logs/handoff/20261105-2314-lab-2c-prep/ to the implementer, gate run:lab-2c-prep passed. Then a real meter read and the first analysis step's dry run go to the user before lab enable.
- 2026-11-05 23:39 UTC lead (session 487510ed): reviewed D303@af28df3b4f76; 2c-prep checked (D303): 494 + 10 tests, lab queue actor lab, lab run refuses. Follow-up 1 (Claude meter HOME, Codex/Muse hard limit on completed turns, meter cleanup) to the implementer; gate run:lab-2c-prep-fix1 passed.
- 2026-11-06 02:57 UTC lead (session 487510ed): reviewed D304@91ca25ffbcd8; 2c-prep follow-up 1 checked (D304): Claude meter HOME lab-owned, Codex/Muse hard limits flagged on completed turns, meter dirs removed, sweep grace. Prep complete; next the lead's real lab usage --read, then the first thread's lab step --dry-run, both to the user before lab enable.
- 2026-11-06 02:58 UTC lead (session 487510ed): reviewed D305@781dc037c068; First real meter read and T064 dry run (D305): Codex 2% weekly, Claude and Muse unknown; the researcher would pause. Q41 to the user.
- 2026-11-06 03:05 UTC lead (session 487510ed): reviewed D307@372812bd6428; probe flag built and checked, real probe run (D307): Claude meter 42% weekly, lean; T064 actor=lab; its researcher cannot start before about 2026-11-08 07:30 UTC. lab enable is the user's.
- 2026-11-06 03:11 UTC lead (session 487510ed): reviewed D308@3e3d773d24c6; D308 trial: Claude capped at 62% weekly (reserve 0.38, paceSlack 0.85 in lab.config.json); restore due by the 2026-11-12 reset (P202). Six tests pinned the live config; brief 20261106-0315-lab-test-fixture moves them onto a fixture.
- 2026-11-06 03:17 UTC lead (session 487510ed): reviewed D309@212fa9986cd5; D309: tests on a standing-config fixture (509 + 10); lab ui briefed (20261106-0320-lab-ui), gate run:lab-ui passed.
- 2026-11-06 03:30 UTC lead (session 487510ed): reviewed D311@aa5f19e967e5; D311: first live step L0001 failed (researcher session ended within a second, error not kept); lab paused by the lead; fix in the UI brief's follow-up 1.
- 2026-11-06 03:38 UTC lead (session 487510ed): reviewed D312@e90bedcca8db; D312: cause found, the Claude CLI rejects the lab's 2020-12 output schemas; fix as follow-up 2 of the UI brief; lab paused.
- 2026-11-06 03:47 UTC lead (session 487510ed): reviewed D313@d85982b43fa9; D313: lab ui, session errors and the Claude schema fix built and checked (823c84db, 542 + 10). Ready for the T064 retry; Muse schema acceptance unknown.
- 2026-11-06 04:19 UTC lead (session 487510ed): reviewed D316@0d85836f48e6; D315 L0003 read; D316 user: S001 approved (cited context in the packet) and read-only plied in the box; brief 20261106-0425-lab-packet-plied, gate run:lab-packet-plied passed; lab paused after L0004.
- 2026-11-06 04:24 UTC lead (session 487510ed): reviewed D317@74ec6195052a; D317: L0004 drafted the T064 1(e) pre-registration, ask L0004 to the user (no panel: P200 unsupported); draft lost with the workspace, recovered by the lead; carry-outputs fix added to the packet/plied brief.
- 2026-11-06 04:46 UTC lead (session 487510ed): reviewed D319@d6625bbcf330; D318 user: live rehearsal with real models; D319 packet/plied/outputs build checked (394ecda9, 571 + 11). Rehearsal brief 20261106-0445-lab-rehearsal started, gate run:lab-rehearsal passed.
- 2026-11-06 16:32 UTC lead (session 487510ed): reviewed D320@98296f0f84b9; Rehearsal with real models checked (D320): 7 lab defects fixed with tests; apply, commit and clerk unreachable while Codex has no tool (Q42); plied in the box needs the sealed list (Q43); tree 837a7da3, uncommitted.
- 2026-11-07 05:14 UTC lead (session 9871fd6b): D321: the user raised the trial's Claude cap from 62 % to 70 % (reserve 0.30, paceSlack 0.85); restore under P202 unchanged
- 2026-11-07 05:16 UTC lead (session 9871fd6b): D323: Q42 and Q43 answered; next, implementer briefs for the Codex shell-tool diagnosis and the plied-in-box tmpfs config
- 2026-11-07 05:18 UTC lead (session 9871fd6b): implementer working on Q43's fix and Q42's diagnosis; brief logs/handoff/20261107-0530-lab-codex-plied/brief.md (gate run:lab-codex-plied)
- 2026-11-07 05:28 UTC lead (session 9871fd6b): scanned D323 (rev aa8cf7819ac4): no commitment to record — D323's 'before any' restates D290's standing rule (allowedFeatures changes are the user's); no new commitment
