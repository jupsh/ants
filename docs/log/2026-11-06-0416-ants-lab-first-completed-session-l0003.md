---
id: D315
date: 2026-11-06
time: 04:16
kind: run
title: ants-lab first completed session: L0003 on T064, the researcher read to its context budget and handed off a drafting plan for the item 1(e) pre-registration (no draft yet; flags the development-data calibration as the user's choice); L0004 continues; Claude at 47 % weekly, 52 % short
---
- **2026-11-06 ≈ 04:16 UTC — ants-lab first completed session: L0003 on T064, the researcher read to its context budget and handed off a drafting plan for the item 1(e) pre-registration (no draft yet; flags the development-data calibration as the user's choice); L0004 continues; Claude at 47 % weekly, 52 % short.**
  - **Retry under D310 and D314** (the user's answers to L0001 and L0002), after D313's fixes; the user answered,
    resumed and ran the loop.
  - **L0003** (04:12:41-04:15:35 UTC): one researcher session (Claude Opus 5.5, high), `ok`, 138 events, 1,459,747
    input tokens (mostly cache re-reads) and 10,569 output, cost estimate $1.23. It passed the soft limit (90k) at
    about 2 minutes, read only, and handed off (`<state>/nodes/T064/handoff-3.json`). The proposal was kind `analysis`,
    tier `auto`, empty patch: no review, nothing executed, outcome `done`. Correct under the policy, and the step
    pattern DESIGN intends (*Hand-off and context budgets*).
  - **The hand-off's plan:** write the item 1(e) pre-registration draft (`logs/lab/drafts/…-t064-1e-prereg.md`, kind
    `preregistration`, user tier, panel pre-review) with two candidates (H2 per-ant OU drive; H1 slower common driver)
    under frozen bounds, an explicit C4 time-since-lights-on term, C5 modelled or declared, judging per D117/D158 with
    labelled rows and no joint-equivalence requirement (P190), no F106 error-control claim (P191), a frozen grid and
    budget with P195/P196 branches, adoption separate (P197). It flags that calibrating on the 1-min development cell
    needs the user's explicit choice (Evidence policy), which is the user's to decide.
  - **Its doubts, for the lab:** the Part D frozen readers (`scripts/scratch/partD2b.ts` and others) and `logs/partd2/`
    are not in the workspace clone (made from HEAD; uncommitted and local-only files are absent); `plied` is not on PATH
    in the container. Its suggestion: put the Part D design entries and key findings in the packet, or raise the
    researcher's budget for drafting steps.
  - **Lead:** paused the lab at ≈ 04:16 on misreading the empty-patch outcome as a loop, then removed the pause before
    the boundary once the hand-off was read; L0004 (the drafting continuation) runs.
  - **Meters** (04:12:41 read, before L0003): Claude weekly 0.47, short 0.52 (resets 07:40 UTC); Codex 0.02; Muse 0.01.
    Claude rose from 0.42 at 03:04 with the lead's and implementer sessions included. D308's cap is 0.62.
