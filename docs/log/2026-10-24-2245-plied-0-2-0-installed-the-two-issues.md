---
id: D143
date: 2026-10-24
time: 22:45
kind: run
title: plied 0.2.0 installed: the two issues filed during adoption are fixed (plied#2 broken-pipe panic, plied#3 scan reviews); requires raised to 0.2.0; STATUS RESUME reduced to state and pointers, with open work, commitments and questions in plied
---
- **2026-10-24 ≈ 22:45 UTC — plied 0.2.0 installed: the two issues filed during adoption are fixed (plied#2 broken-pipe panic, plied#3 scan reviews); requires raised to 0.2.0; STATUS RESUME reduced to state and pointers, with open work, commitments and questions in plied.**
  - **plied 0.2.0** (`cargo install --path /home/norma/repos/plied`, commit `4c11991`) replaces 0.1.0. It fixes
    the two issues filed during adoption (D142): jupsh/plied#2, a panic with exit 101 on a closed stdout (now a
    quiet exit; checked), and #3, no way to record a reviewed `scan_commitments` warning (now `plied scanned`).
    `plied.toml` requires `>=0.2.0`. The regenerated view and D142 (a false positive: "deferred" describes D140's
    adoption decision) are recorded as read on T049. 43 scan warnings remain for T049.
  - **STATUS RESUME reduced** (user: "update STATUS's RESUME"). It now holds the state and pointers: `plied
    frontier`, the main line in one bullet each with its records, disclosed limitations by finding, experiments,
    end state, publication plan, box, scratch. The earlier RESUME and "Last updated" line are moved verbatim to
    `docs/archive/STATUS-RESUME-2026-10-24.md` (A005). T026's outcome now cites A005, where its quoted sentence
    moved. The Quick guide, Plan, Rules in force and Evidence policy are unchanged.
  - **The record's division** (user: "update CLAUDE.md and AGENTS.md with the vision"):
    - AGENTS.md *How the record is divided*: STATUS holds state, plan, rules and evidence policy; plied holds open
      work, commitments and questions; the dated records are authoritative, and summaries point to them.
    - CLAUDE.md, lead duty "keep each fact in its one home": RESUME stays short and is archived verbatim when it
      grows. A flagged log entry with no commitment is recorded with `plied scanned`.
  - **Checks:** records, findings and plied (0 errors); `plied view --check`; records test 3 / 3.
