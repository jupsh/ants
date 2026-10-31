---
id: D214
date: 2026-10-31
time: 00:12
kind: decision
title: User: the implementer's token use cut (D208 amended): tools limited to Bash, Read, Edit and Write; a short rules file (docs/IMPLEMENTER.md) instead of all of AGENTS.md; smaller briefs with exact line ranges; Edit for small changes; effort set per task (high for pre-registered statistics, medium otherwise); the implementer returns its report as text and the lead saves it
authority: user
scope: D208
---
- **2026-10-31 ≈ 00:12 UTC — User: the implementer's token use cut (D208 amended): tools limited to Bash, Read, Edit and Write; a short rules file (docs/IMPLEMENTER.md) instead of all of AGENTS.md; smaller briefs with exact line ranges; Edit for small changes; effort set per task (high for pre-registered statistics, medium otherwise); the implementer returns its report as text and the lead saves it.**
  - **Why:** the first implementer task (item 1(b), D212) used 256k tokens. The lead tallied its transcript by tool
    without reading it: visible content ≈ 70k tokens (command outputs ≈ 27k, of which AGENTS.md + HANDOFF.md read whole
    ≈ 20k characters; code written ≈ 20k); the rest is its hidden reasoning and the schemas of every tool, sent on every
    turn. The harness also refused its write of `report.md` ("Subagents should return findings as text").
  - **Decision (user):** chose "Tools, rules, briefs, edits", the lead's recommended option:
    - `.claude/agents/implementer.md`: tools limited to Bash, Read, Edit, Write; it reads `docs/IMPLEMENTER.md` (a
      short rules file holding the AGENTS.md rules that apply to it and the report format) instead of AGENTS.md and
      HANDOFF.md; Edit for small changes, outputs piped through `tail`/`grep`, files read by range.
    - Briefs are smaller (one stage per brief) and point to exact line ranges; each names its effort: **high** for code
      that computes a pre-registered statistic, **medium** otherwise (passed as the Agent call's `effort`).
    - The implementer returns its report as text; the lead saves it to `logs/handoff/<task>/report.md`.
  - **Changed:** `.claude/agents/implementer.md`, `docs/IMPLEMENTER.md` (new), `docs/HANDOFF.md`, CLAUDE.md (the
    implementer bullet).
