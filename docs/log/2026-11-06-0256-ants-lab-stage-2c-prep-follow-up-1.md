---
id: D304
date: 2026-11-06
time: 02:56
kind: run
title: ants-lab stage 2c-prep follow-up 1 checked: Claude meter read and probe on a lab-owned HOME, Codex and Muse hard limits flagged on a completed turn and stopped only on a later event, meter directories removed and the sweep's two-minute grace; 502 + 10 tests; prep complete
---
- **2026-11-06 ≈ 02:56 UTC — ants-lab stage 2c-prep follow-up 1 checked: Claude meter read and probe on a lab-owned HOME, Codex and Muse hard limits flagged on a completed turn and stopped only on a later event, meter directories removed and the sweep's two-minute grace; 502 + 10 tests; prep complete.**
  - **Brief and report:** `logs/handoff/20261105-2314-lab-2c-prep/` (brief § Follow-up 1; `report.md`, the follow-up
    report and the lead's check appended). The implementer stopped partway on its usage limit and was resumed on the
    same brief; gate `run:lab-2c-prep-fix1` as disposed for D303.
  - **Built** (ants-lab, uncommitted; tree `583d5936` → `f99d99a7`, 9 files, +225 −42):
    - Claude meter read and probe run with `HOME` at `<state>/meter/claude-home` (0700), and refuse without an absolute
      home. D303 item 1; D302 "never the user's homes".
    - Codex and Muse hard context limit: a crossing on a terminal event (Codex `turn.completed`/`turn.failed`/`error`,
      Muse `run.usage`/`run.terminal.*`) is flagged (`limits.hardContext`, a `limit:hardContext` event) and leaves
      `ok` as the engine reported it. A later non-terminal event stops the session ("stopped past hardContext",
      `ok` false). README: these sessions are bounded in practice by their timeouts.
    - After a meter read or probe the whole `sessions/meter-*` directory is removed once `finishSessionHome` succeeds.
      The sweep leaves a meter home whose record is under 2 minutes old (`skipped-young`), and removes the whole
      directory of a stale one; other session homes get no grace.
  - **Lead's check:** reproduced the tree hash, vitest 502/502, tsc 0, Docker 10/10. `git -C ~/repos/ants status
    --short` is the 24-line baseline plus D303; no `enabled.json`. Read the source diff: as reported. `baseEnv` is an
    allowlist (PATH, HOME, LANG, LC_ALL, TMPDIR, TERM), so no `CLAUDE_CONFIG_DIR` reaches the meter session.
  - **Readings:**
    - The implementer's first status listing ran under a stale `GIT_INDEX_FILE` and showed an empty index; it wrote
      nothing (`.git/index` untouched) and the corrected listing matches. No record affected.
    - Whether the Claude CLI needs onboarding state in the new HOME is untested by a run; the lead's first real
      `lab usage --read` shows it (a failure is an unknown Claude reading with its error, which DESIGN already
      expects for the lab token).
  - **2c-prep is complete.** Next under D302's order: the lead's real `lab usage --read` (no probe), then the first
    thread's `lab step --dry-run`, then both to the user before `lab enable`; no node gets actor=lab before that.
