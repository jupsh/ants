---
id: D064
date: 2026-10-18
time: 16:32
kind: design
title: STATUS step 2: Decisions log and contamination log as records (user: "time to work on the STATUS changes"); design fixed before migrating
---
- **2026-10-18 ≈ 16:32 UTC — STATUS step 2: Decisions log and contamination log as records (user: "time to work on
  the STATUS changes"); design fixed before migrating.**
  - **Decisions log → `docs/log/`:** one file per dated entry (`YYYY-MM-DD-HHMM-slug.md`). Frontmatter: id (D001… in
    date order), date, time, kind, title. The body is the entry **verbatim**, original header line included, so
    existing references ("the 15:51 entry", findings' `STATUS:` evidence) still resolve.
    - Kinds: decision, design (pre-registrations and designs fixed before a run), reading, run, review (pasted
      guidance and reviews), correction, note.
    - New entries via `node docs/records.mjs log new "<title>" --kind k`, which stamps the real UTC time (this also
      removes the repeated ahead-of-the-clock timestamps).
  - **Contamination log → `docs/contamination/`:** one file per top-level item, with the "Additions" group split into
    its sub-items. Frontmatter: id (X001…), title, date, role. The body is verbatim.
  - **Moved:** only the current file's Decisions log (2026-10-17 13:10 onward) and contamination log. The four
    archives stay verbatim. STATUS keeps RESUME, the Plan, Rules in force, Roles of data, Criteria, Results, Open
    problems and Milestones, with pointers to the two folders.
  - **One tool:** `docs/records.mjs`, with commands regenerate, `new`, `find` (sift) and `check`, and shared helpers
    with `findings/findings.mjs`. `check` flags any dated entry written into STATUS after the move.
  - The STATUS page shows STATUS plus the generated log index. CLAUDE.md, AGENTS.md, Rules in force and the quick
    guide point to the new places.
  - **Concurrency:** another session wrote STATUS at 16:16. The move is one read-and-write; anything appended later
    is caught by `check` and moved.
