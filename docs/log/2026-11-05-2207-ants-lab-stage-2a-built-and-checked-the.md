---
id: D297
date: 2026-11-05
time: 22:07
kind: run
title: ants-lab stage 2a built and checked: the step pipeline with fake engines, live-session files and alerts, the stale-home sweep, the D296 amendment tripwire, and the T065 dry run; 388 + 10 tests; the lead's readings of the session limit and of review after execution
---
- **2026-11-05 ≈ 22:07 UTC — ants-lab stage 2a built and checked: the step pipeline with fake engines, live-session files and alerts, the stale-home sweep, the D296 amendment tripwire, and the T065 dry run; 388 + 10 tests; the lead's readings of the session limit and of review after execution.**
  - **Brief and report:** `logs/handoff/20261105-2112-lab-2a/` (`brief.md`, `report.md`). The session that wrote the
    brief hit its usage limit before the implementer started; it was relaunched at ≈ 21:37 UTC on the same brief, gate
    `run:lab-2a` re-checked (passed; P198-P200 not-applicable or met as disposed at 21:12).
  - **Implementer's report, quoted:** "Every module in the brief is built, along with the test list. `npx vitest run`
    (388 tests), `npx tsc --noEmit` and `npm run test:docker` (10 tests) all pass."
  - **Built** (ants-lab, uncommitted; tree `84a50dde` → `b7bd1a7d`): `src/conductor/` (`step.ts` runStep, `sessions.ts`,
    `live.ts`, `sweep.ts`, `packet.ts`, `git.ts`), `src/cli.ts` (`lab step --dry-run`), `onEvent` on the three adapters,
    the `live` config schema, the D296 tripwire.
  - **Lead's check:**
    - Reproduced 388/388, tsc 0, and the Docker tier 10/10.
    - `git -C ~/repos/ants status --short` unchanged by the work (the implementer's before/after diff is empty; the
      lead's listing after matches it).
    - The dry run on T065: 17 packet files hashed, governing D277-D282, D287, D288, D294, commitments P198-P200; the
      one planned session (researcher, Claude Opus, high) would not start because no meter is held, so the step would
      end paused. No probe, no model call.
    - The commit path never pushes and strips attribution lines; the D296 rule reads as D296 says (six bound fields a
      halt, a body-only change to an entry carrying `authority:` a user hit).
    - One defect: the end-of-step plied note omits `--expect` (D298).
  - **Lead's readings of the implementer's two questions:**
    - **Session limit** (DESIGN *Hand-off and context budgets*; D279 "per-node session limits"; config
      `limits.maxSessionsPerNodeBeforeNotify`). The brief's "the eighth … is an ask", counted inside the running step,
      would stop legitimate steps: a panel clerk step needs 8 sessions (researcher, panel, clerk, panel on the clerk's
      patch), a brief with two revisions 9. The limit is about drift across steps, and DESIGN says the user is
      notified. Reading: the counter holds the sessions of earlier steps on the node that ended without closing
      (`paused`, `failed`, `discarded`); a closed outcome (`applied`, `done`, `asked`, `revised-then-asked`) resets it.
      It is checked when a step starts: at 8 or more, the step is an ask "drift or stuck node" before any session.
      Within a step the sessions are already bounded by `limits.maxRevisions` and the artifact re-review limit.
    - **Review after execution** stays as built: an implementer's or clerk's patch does not exist when the contract is
      approved, so it changes the artifact and goes to a new review (for a panel kind, a new panel). D278 item 4 is the
      user's: "A verdict should approve a particular diff, command, input manifest and governing rule, identified by
      hashes. Changes invalidate that approval." It roughly doubles review sessions for executed steps; a lighter
      re-review would loosen the user's rule, so only on the user's say-so.
  - **Left open:**
    - Codex and Muse sessions report context use in the live data but have no soft or hard context enforcement (1b
      adapters); for 2b.
    - Usage lines carry the pre-session estimate, not a measured share; the p90 estimate learns from measured shares
      once 2b's loop reads meters after sessions.
  - **Next:** follow-up 1 (brief § Follow-up 1): the D298 fix, the session-limit reading above, and a test of
    `apply_patch` on a kept workspace. Then 2b.
