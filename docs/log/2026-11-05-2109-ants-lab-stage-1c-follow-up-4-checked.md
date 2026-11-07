---
id: D295
date: 2026-11-05
time: 21:09
kind: run
title: ants-lab stage 1c follow-up 4 checked: login copy-back limited to the refreshable fields (D293), 340 tests; stage 1c complete
---
- **2026-11-05 ≈ 21:09 UTC — ants-lab stage 1c follow-up 4 checked: login copy-back limited to the refreshable fields (D293), 340 tests; stage 1c complete.**
  - **Brief and report:** `logs/handoff/20261105-1710-lab-1c/` (`brief.md` § Follow-up 4; `report.md` § Follow-up 4
    report, with the lead's check).
  - **Implementer's report, quoted:** "A session's login is copied back only when the account is the same and every
    field other than the engine's refreshable ones is unchanged; for Codex, `last_refresh` must also be later than
    the lab file's."
  - **Tests and calls:** 340 tests (26 in `homes.test.ts`, with the real layouts and sentinel values). No model calls.
    The real login files were not read.
  - **Lead's check:**
    - Reproduced 340/340 and tsc 0.
    - The copy-back compares against the lab file as read under the lock, so a Codex conflict is written only when
      the session's refresh is later than the file in place.
    - Also: the lead added DESIGN *Watching the lab* → live-session data, and the `live` block in `lab.config.json`
      (D294). The loader accepts it: 340 pass after that change.
  - **Stage 1c is complete.** Its commit waits for the user (D294). Open, for the stage 2 brief: a sweep at
    conductor start for session homes left by a killed launcher (D292), and the live-session files (D294).
  - **Next:** the stage 2 (conductor) brief.
