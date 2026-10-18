---
id: D065
date: 2026-10-18
time: 16:36
kind: run
title: STATUS step 2 done: Decisions log and contamination log moved to records
---
- **2026-10-18 ≈ 16:36 UTC — STATUS step 2 done: Decisions log and contamination log moved to records.**
  Design: D064 (2026-10-18 ≈ 16:32).
  - **Moved verbatim** in one read-and-write of STATUS: 64 Decisions-log entries (2026-10-17 13:10 to 2026-10-18
    16:32) → `docs/log/` (D001–D064), and the contamination log → `docs/contamination/` (X001–X021; the
    "Additions" group split into its 14 sub-items, each noting the group). The script refused to write unless
    every non-blank original line was found in a record. STATUS 3,272 → 840 lines; the four archives untouched.
  - **Kinds:** keyword rules plus 22 hand overrides from the titles. **Contamination roles and first-logged
    dates:** set by hand per item (Planckaert 2019 from the night archive).
  - **Tool:** `docs/records.mjs` (regenerate, `log|contamination new`, `log|contamination find` with sift, `check`).
    Shared helpers in `scripts/records.mjs`, now also used by `findings/findings.mjs`, whose `check` resolves
    `STATUS:` references in `docs/log/` too. Slug fix: accented letters no longer split file names (X012 renamed).
  - **Pointers updated:** the STATUS header, quick guide and Rules in force ("Log before acting"); CLAUDE.md (lead
    duties: log entries via the tool, never a hand-typed time); AGENTS.md (where the record is; other agents do not
    write `docs/log/`, `docs/contamination/`, `findings/`); backlog PROTOCOL and TEMPLATE. The STATUS page shows
    STATUS plus the findings and log indexes (`src/main.ts`; tsc clean; not seen in a browser, no dev server
    running).
  - Checks: `node docs/records.mjs check` and `node findings/findings.mjs check` pass.
