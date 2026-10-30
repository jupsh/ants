---
id: D208
date: 2026-10-30
time: 21:52
kind: decision
title: Implementation handed to an Opus implementer subagent; the lead agent keeps the record (user)
---
- **2026-10-30 ≈ 21:52 UTC — Implementation handed to an Opus implementer subagent; the lead agent keeps the record (user).**
  - **Why:** since plied, agents spend their attention on bookkeeping and make more implementation errors. A lead
    session carries ~15k words of process before it writes code (CLAUDE.md + AGENTS.md 3.1k, STATUS 7.2k, plied
    skill 5.5k) and is interrupted by plied hook messages while it works. Bookkeeping errors are caught by
    `plied check` and `records.mjs check`, implementation errors by nothing comparable.
  - **Decision (user):** the user approved the proposal to separate the agent doing the work from the agent doing
    the bookkeeping ("yeah i like that") and chose Opus for the implementer ("i would be fine with an opus subagent
    for doing the actual implementation, yes").
  - **What it sets up:**
    - `.claude/agents/implementer.md`: an Opus subagent that starts without CLAUDE.md (`omitClaudeMd`), works
      under AGENTS.md's rules for other agents, takes a written brief and returns a written report. It writes no
      records and starts no long runs.
    - `docs/HANDOFF.md`: the brief and report formats. The lead turns the commitments that govern the work
      (`plied review`) into requirements in the brief, quoted with their ids; the lead's log entry quotes the
      report rather than paraphrasing it.
    - `.claude/hooks/roles.py` (PreToolUse): refuses the implementer's writes to the record (`docs/STATUS.md`,
      `docs/log/`, `docs/contamination/`, `docs/archive/`, `findings/`, `plied/`, the generated backlog indexes,
      `data/fits/`, `public/precomputed/`, `.claude/`), plied
      writes and messages, long runs, rentals and git commits; asks the user before the lead edits `src/`,
      `scripts/` or `test/` itself.
    - `.claude/hooks/plied_hook.py`: the plied PostToolUse hook is skipped inside the implementer, so the lead's
      messages are not delivered to (and marked read by) the subagent, which shares the lead's session id.
    - CLAUDE.md: implementation goes to the implementer; the lead does the bookkeeping before the brief and after
      the report, not during the work. A defect found in code is logged with `--kind correction`, so the rate
      can be compared before and after this change.
