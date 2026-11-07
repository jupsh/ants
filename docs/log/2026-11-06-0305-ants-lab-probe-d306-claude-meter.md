---
id: D307
date: 2026-11-06
time: 03:05
kind: run
title: ants-lab probe (D306): Claude meter obtained, weekly 42 % and short 17 %; Muse 1 %, Codex 2 %; Claude is lean and the T064 researcher cannot start before about 2026-11-08 07:30 UTC under the pacing rule; T064 set actor=lab
---
- **2026-11-06 ≈ 03:05 UTC — ants-lab probe (D306): Claude meter obtained, weekly 42 % and short 17 %; Muse 1 %, Codex 2 %; Claude is lean and the T064 researcher cannot start before about 2026-11-08 07:30 UTC under the pacing rule; T064 set actor=lab.**
  - **Built first:** `lab usage --read --probe` (brief and report `logs/handoff/20261106-0300-lab-probe/`; ants-lab
    tree `f99d99a7` → `e03a95a9`, `src/cli.ts`, README, 5 new tests). It calls the loop's own `ensureFreshMeter`.
    Lead's check: 507/507, tsc 0, Docker 10/10, diff as reported. Gate `run:lab-probe-flag` passed.
  - **The probe** (gate `run:lab-probe-1` passed; `lab usage --read --probe`, ≈ 03:04 UTC, the lab's own logins):
    - Claude: probed (Haiku 5.5, low; 381 in / 4 out tokens). Weekly 42 % (resets 2026-11-12 01:00 UTC), short 17 %
      (resets 2026-11-06 07:40 UTC). The SDK's rate-limit events carry the meter, so the lab token can be metered.
    - Muse: probed (default model, low; 15,488 in / 14 out tokens). Weekly 1 % (resets 2026-11-09 00:00 UTC),
      short 0 %.
    - Codex: read, not probed. Weekly 2 %, short 0 %.
    - No `sessions/meter-*` left; no `enabled.json`.
  - **Dry run again on T064** with these meters held: Claude `lean`, Codex and Muse `normal`. The researcher would
    drop one effort level (Opus 5.5 medium, D279's lean rule) and `canStart no` (estimate 0.02 from the prior).
  - **Reading, the pacing:** the Claude weekly window began 2026-11-05 01:00 UTC, so at 03:05 UTC the elapsed fraction
    is 0.155 and the allowance `0.85 × (f + 0.05)` is 0.174 against 0.42 used. A step needing 0.02 starts once
    `0.44 ≤ 0.85 × (f + 0.05)`, at f = 0.468, about **2026-11-08 07:30 UTC**, and later if Claude use outside the lab
    keeps rising. The meter is the account's, so the user's and the lead's sessions count against it. Claude-free work
    still runs meanwhile (DESIGN *Claude-free work*), but T064's first session is a Claude researcher, so enabling now
    would make no progress on T064 before then.
  - **Under D306:** Claude gave a meter, so T064 gets actor=lab, and `lab enable` is the user's to run, with the
    pacing above stated.
