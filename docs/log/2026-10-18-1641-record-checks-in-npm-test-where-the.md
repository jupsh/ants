---
id: D066
date: 2026-10-18
time: 16:41
kind: run
title: Record checks in npm test; where-the-record-lives block in STATUS; RESUME trim drafted for the user
---
- **2026-10-18 ≈ 16:41 UTC — Record checks in npm test; where-the-record-lives block in STATUS; RESUME trim drafted for the user.**
  User: "Yes" to the three items proposed after the question whether the changes make agents' work harder.
  - **`test/records.test.ts`** runs `node findings/findings.mjs check` and `node docs/records.mjs check` in the fast
    tier (≈ 1 s); a failure prints the problems and the command that fixes them. Both checks now also fail when
    a generated index is out of date (`renderIndex` compared with the file). Negative tests: a stale index fails
    the check and the test; regenerating clears it.
  - **STATUS preamble** replaced: a short "last updated" (history is in `docs/log/`), the where-the-record-lives
    table (what / where / write / read), the archive names entries cite.
  - **RESUME trim: drafted, not applied** (the user reviews first). 266 → 105 lines for RESUME plus the quick
    guide: state, what happens next, open decisions and pointers to findings (F-ids) and log entries (D-ids).
    It also corrects stale items: the 14:38 "next steps" (done), contacts as a step-5 blocker (lifted 01:41),
    persistence targets "on hold" (now C2's rows).
