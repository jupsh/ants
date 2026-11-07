---
id: D298
date: 2026-11-05
time: 22:07
kind: correction
title: Correction: ants-lab stage 2a's conductor writes its end-of-step plied note without --expect (src/conductor/step.ts), so every real note would be refused and recorded only as a failed journal outcome; found by the lead's check against plied note --help, fixed in follow-up 1
---
- **2026-11-05 ≈ 22:07 UTC — Correction: ants-lab stage 2a's conductor writes its end-of-step plied note without --expect (src/conductor/step.ts), so every real note would be refused and recorded only as a failed journal outcome; found by the lead's check against plied note --help, fixed in follow-up 1.**
  - **Found:** while checking the stage 2a report (`logs/handoff/20261105-2112-lab-2a/report.md`, D297). The report
    says the implementer could not read plied's help (the guard hook refused it) and used `plied note <T> "<text>" --as
    lab`, unverified. `plied note --help` gives `plied note [OPTIONS] --expect <REV> <ID> <TEXT>`: `--expect` is required.
    `src/conductor/step.ts` builds `['note', node, text, '--as', agent]`, so plied would refuse every real note, and the
    conductor swallows the error (only the journal records `failed`).
  - **Also:** neither call passes `--session`; plied would take `$PLIED_SESSION` or `$CLAUDE_CODE_SESSION_ID` from
    whatever environment the conductor runs in. The fix passes the step's own session id explicitly.
  - **`plied claim <T> --as lab`** matches `plied claim [OPTIONS] <NODE>`.
  - **Not affected:** nothing ran against real plied; 2a's plied runner is faked in every test and the dry run makes no
    plied write.
  - **Fix** (follow-up 1): read the rev with `plied show <T> --json` (`result.rev`) and note with `--expect <rev>`;
    pass `--session` on both calls; a refused note becomes a step transition and a visible alert line, not silence.
