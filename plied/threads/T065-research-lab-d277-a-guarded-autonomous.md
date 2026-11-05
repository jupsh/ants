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
