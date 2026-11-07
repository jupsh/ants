---
id: D313
date: 2026-11-06
time: 03:47
kind: run
title: ants-lab lab ui built and checked (D288), failed-session errors kept and idle reasons logged, and the Claude schema fix (a draft-07 copy for the CLI); 542 + 10 tests; ready for the retry of T064
---
- **2026-11-06 ≈ 03:47 UTC — ants-lab lab ui built and checked (D288), failed-session errors kept and idle reasons logged, and the Claude schema fix (a draft-07 copy for the CLI); 542 + 10 tests; ready for the retry of T064.**
  - **Brief and report:** `logs/handoff/20261106-0320-lab-ui/` (brief with follow-ups 1 and 2; `report.md` holds the
    first report, the final one and the lead's check). Gates `run:lab-ui`, `run:lab-session-errors`,
    `run:lab-claude-schema` passed. Tree `01d4f476` → `823c84db`.
  - **`lab ui`** (D288; DESIGN *Watching the lab*): `lab ui [--port N]`, http://127.0.0.1:7377. Read-only, loopback
    only, Host check (421), GET/HEAD only (405), CSP, no external resource. Reads an allowlist of state paths
    (`src/ui/access.ts`); never the embargo, session homes, workspaces, run outputs, transcripts or logins (canary and
    `fs`-spy tests). Panels Now, Queue, Steps, Quota (with the D308 trial values), Inbox, Suggestions, Alerts.
    Transcripts are left out of this version. Steps shows verdicts and the round's fixed-format reasons, not reviewers'
    problem text (not in the step record).
  - **Follow-up 1 (D311's defect):** a failed session's redacted error (≤ 500 chars) is kept in the step record, live
    file, ask reason and loop line; a session failing before its first event is an ask saying so (a behaviour change:
    such a failure no longer climbs a rung); the loop logs each idle with its reason. It ran live in L0002 and gave
    D312's cause.
  - **Follow-up 2 (D312's defect):** `src/adapters/claudeSchema.ts` gives the CLI a draft-07 copy (no `$schema`/`$id`,
    `$defs` → `definitions`); it refuses keywords with no draft-07 form. Established from the CLI binary's own
    validator (Ajv 8 default, draft-07), tested with the same class and options on all six schemas, without a model
    call. Codex took a 2020-12 schema in the 1b smoke. **Muse is unknown**; the first Muse reviewer session shows it.
  - **Lead's check:** 542/542, tsc 0, Docker 10/10; `schemas/` unchanged; the transform read. Accepted.
  - **Next:** the user's paused loop (started 03:37 on the old code) exits at its 03:47 wake-up; then the user answers
    L0002, resumes, and runs a new loop on this tree.
