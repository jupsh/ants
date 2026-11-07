---
id: D309
date: 2026-11-06
time: 03:17
kind: run
title: ants-lab tests moved onto a frozen standing-config fixture (509 + 10 pass with the D308 trial config live); the tracking UI (D288, lab ui) briefed now, beside the trial
---
- **2026-11-06 ≈ 03:17 UTC — ants-lab tests moved onto a frozen standing-config fixture (509 + 10 pass with the D308 trial config live); the tracking UI (D288, lab ui) briefed now, beside the trial.**
  - **Tests on a fixture:** brief and report `logs/handoff/20261106-0315-lab-test-fixture/`. Six tests read the live
    `lab.config.json` and pinned D282's Claude values, so they failed under D308's trial setting. The suite now loads
    `test/fixtures/lab.config.standing.json` (the standing values; differs from the live file only in the trial lines),
    keeps one live-file test (validates, no forbidden model, no numbers), and adds a test of the trial values (at
    f = 0.155: allowance 0.62, normal at 0.42, halt at 0.62). Tree `8cc38741` → `01d4f476`, no `src/` change. Lead's
    check: 509/509, tsc 0, Docker 10/10, the fixture diff as reported. When P202 restores the live values, the fixture
    and the live file agree again.
  - **The tracking UI (D288):** the user asked where to get it ("and where to get the ui?"). D288 sequenced its brief
    after stage 2, once the step, session and inbox records existed; they do now. Brief
    `logs/handoff/20261106-0320-lab-ui/`, to DESIGN *Watching the lab*. First version leaves session transcripts out
    (DESIGN allows them on request; they can carry run output, so a later step with its own blind rule).
  - **Sequencing with the trial:** the loop (`lab run --alongside`) starts from a tree the implementer is not
    editing, so if the user enables the lab while the UI is being built, the lead starts the loop once the UI report
    is checked.
