---
id: D299
date: 2026-11-05
time: 22:17
kind: run
title: ants-lab stage 2a follow-up 1 checked: the plied note with --expect and its own session (D298 fixed), the session limit as D297 reads it, and a kept-workspace apply_patch bug (frozen files read as added, a false halt) found and fixed; 396 + 10 tests; stage 2a complete
---
- **2026-11-05 ≈ 22:17 UTC — ants-lab stage 2a follow-up 1 checked: the plied note with --expect and its own session (D298 fixed), the session limit as D297 reads it, and a kept-workspace apply_patch bug (frozen files read as added, a false halt) found and fixed; 396 + 10 tests; stage 2a complete.**
  - **Brief and report:** `logs/handoff/20261105-2112-lab-2a/` (`brief.md` § Follow-up 1; `report.md` § Follow-up 1
    report, with the lead's check). Gated `run:lab-2a-fix1` (P198-P200 not-applicable, disposed 22:08 UTC).
  - **Implementer's report, quoted:** "All three parts are built: the plied note with `--expect` and a shared
    `--session`, the session limit as D297 reads it, and the `apply_patch` path on a kept workspace. Part 3 turned up a
    real bug in the kept-workspace path, which I fixed".
  - **The bug** (found by the implementer's new test, in uncommitted 2a code that never ran for real): a workspace kept
    by an asked step was rebuilt without its frozen-file hashes, so every frozen file in the checkout read as added and
    a legitimate `apply_patch` became a halt (`tripwire: frozen-file`). In the real checkout `data/fits/s2018-tracker.json`
    is frozen, so the first kept apply would have halted the lab. Fixed: `kept` stores the hashes; a kept workspace is
    discarded once applied or on a halt, kept on a refusal.
  - **Lead's check:** reproduced 396/396, tsc 0, the Docker tier 10/10; tree `dbe25a8c` reproduced and its diff from
    `b7bd1a7d` limited to `README.md`, `src/conductor/step.ts`, `test/step.test.ts`, `test/stepHarness.ts`; the claim
    and note argv read in `step.ts`; `git -C ~/repos/ants status --short` identical to the listing saved before.
  - **Stage 2a is complete,** uncommitted, like 1c (D294).
  - **For the 2b brief** (from the report's doubts):
    - A drift ask is `asked`, a closed outcome, so it resets the count. The loop must not start a step on a node that
      has a pending ask; then the reset is harmless.
    - The note passes no `--json`, so an exit-0 refusal is seen only if plied prints an envelope anyway. Add `--json` to
      the claim and the note, and read `ok` from the envelope.
    - Codex and Muse context limits are not enforced (D297).
