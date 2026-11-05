---
id: D282
date: 2026-11-05
time: 06:08
kind: decision
title: User: Claude's quota must last longest, because the lab's research runs on it; Codex and Muse may run out sooner. Pacing becomes per provider (Claude even, Codex and Muse spend-first), and the clerk and curator move to Codex with Claude fallbacks
authority: user
scope: T065
---
- **2026-11-05 ≈ 06:08 UTC — User: Claude's quota must last longest, because the lab's research runs on it; Codex and Muse may run out sooner. Pacing becomes per provider (Claude even, Codex and Muse spend-first), and the clerk and curator move to Codex with Claude fallbacks.**
  - **User (in conversation, verbatim):** "oh, and i guess it might be obvious, but the conductor, and thus the
    claude quota, needs be maintained the longest. like not as big a deal if chatgpt runs out quicker because it's
    not orchestrating".
  - **Lead's reading:** the conductor is plain code and uses no quota. The researcher, the implementer (D208) and the
    authority reviewer run on Claude, so a Claude pause stops the lab, while a Codex or Muse shortfall only slows
    their jobs. Claude is therefore the scarce provider.
  - **Effect in `~/repos/ants-lab`** (DESIGN *Quota*, *Roles*, *Model ladder*; `lab.config.json`):
    - **Pacing per provider:** Claude has pace slack 0.05 (spread evenly over the week), Codex and Muse 0.5 (they may
      front-load). Each keeps the 15 % reserve of D277.
    - **Roles moved off Claude:** the clerk moves to Codex Terra, the curator to Codex Sol. The implementation and
      statistics reviewers keep their engines, with fallbacks.
    - **Fallback rules:** a Claude fallback is used only while Claude is under its pace. A panel never falls back:
      it waits.
    - **Claude-free work:** while Claude is lean or paused, the conductor keeps working on steps that need no Claude.
    - **What guards the clerk now:** the host hooks don't run inside Codex, so the clerk's record writes are guarded
      by the patch tripwires (any `authority:` field the conductor did not issue, *Rules in force*, write sets) and
      by the `records.mjs`, `findings.mjs` and `plied` checks.
