---
id: D321
date: 2026-11-07
time: 05:14
kind: decision
title: User: the lab trial's Claude cap raised from 62 % to 70 % of the weekly limit; reserve 0.38 → 0.30, paceSlack stays 0.85, restore unchanged (P202)
authority: user
scope: T065
---
- **2026-11-07 ≈ 05:14 UTC — User: the lab trial's Claude cap raised from 62 % to 70 % of the weekly limit; reserve 0.38 → 0.30, paceSlack stays 0.85, restore unchanged (P202).**
  - **The user's words:** "let's start the next step in the lab. increase the claude limit from 62 to 70%".
  - **Setting** (`lab.config.json`, `quota.perProvider.claude`; existing keys, no code change), amending D308:
    - `reserve` 0.38 → 0.30: Claude halts at weekly ≥ 0.70 (`1 - reserve`).
    - `paceSlack` stays 0.85: the allowance `(1 - reserve) × min(1, f + paceSlack)` is 0.70 for any f ≥ 0.15, so the
      whole margin up to 70 % is open now and Claude stays `normal`.
    - Codex, Muse, the short-window halt and every other guardrail unchanged. The meter is the account's, so the
      user's and the lead's own Claude use counts toward the 70 % too.
  - **Restore unchanged** (P202): reserve 0.15 and paceSlack 0.05 before the Claude weekly reset at 2026-11-12 01:00
    UTC, or when the user ends the trial if sooner.
