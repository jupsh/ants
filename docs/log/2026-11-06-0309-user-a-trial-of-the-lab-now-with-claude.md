---
id: D308
date: 2026-11-06
time: 03:09
kind: decision
title: User: a trial of the lab now, with Claude spend capped at 62 % of the weekly limit (about 20 % above the current 42 %); the Claude pacing set to reserve 0.38 and paceSlack 0.85 until the reset, then restored
authority: user
scope: T065 T064
---
- **2026-11-06 ≈ 03:09 UTC — User: a trial of the lab now, with Claude spend capped at 62 % of the weekly limit (about 20 % above the current 42 %); the Claude pacing set to reserve 0.38 and paceSlack 0.85 until the reset, then restored.**
  - **The user's words** (after D307): "i kinda just wanna try it out. let's use up to 20% - putting us at 62"
  - **Reading:** a trial now, not waiting for the pacing to allow T064 (about 2026-11-08 07:30 UTC, D307). Claude
    spend is capped at 62 % of the account's weekly meter. The meter is the account's, so the user's and the lead's
    own Claude use counts toward the 62 % too.
  - **Setting** (`lab.config.json`, `quota.perProvider.claude`; existing keys, no code change):
    - `reserve` 0.15 → 0.38: Claude halts at weekly ≥ 0.62 (`mode`: halt at `1 - reserve`).
    - `paceSlack` 0.05 → 0.85: the allowance `(1 - reserve) × min(1, f + paceSlack)` is 0.62 from now on, so the
      margin up to 62 % is open at once and Claude is `normal`, not lean (full effort).
    - Codex and Muse are unchanged. The short-window halt and every other guardrail stay as they are.
  - **Restore:** the trial setting is restored to reserve 0.15 and paceSlack 0.05 before the Claude weekly reset at 2026-11-12 01:00 UTC, or when the user ends the trial if sooner.
  - DESIGN.md's *Quota* keeps the standing rule (Claude slack 0.05); this is a dated override under the user's
    authority, cited in the config's `$comment`.
