---
id: D142
date: 2026-10-24
time: 22:05
kind: decision
title: User: adopt plied in this repo (D140's deferred adoption decision): plied.toml linking the log, findings, backlog, contamination, STATUS and its archives; the thread draft migrated into plied records; records.mjs authority and scope fields; hooks, git guards and the check in npm test
---
- **2026-10-24 ≈ 22:05 UTC — User: adopt plied in this repo (D140's deferred adoption decision): plied.toml linking the log, findings, backlog, contamination, STATUS and its archives; the thread draft migrated into plied records; records.mjs authority and scope fields; hooks, git guards and the check in npm test.**
  - **User:** "I created a new tool, plied, that is installed to help us track everything. Inspect plied
    capabilities and integrate it into this repo." This is the adoption D140 left to the user. Also: report problems
    with plied as GitHub issues, drafted for the user's approval (skill `report-plied-issue`).
  - **The installed plied** is `plied 0.1.0` at `~/.cargo/bin/plied`, a Rust build of `/home/norma/repos/plied`
    (commit `43ab9ba`, record format 1, JSON envelope 1). D141 describes an earlier Python build. The design (D140)
    is unchanged; the contract is the plied repo's `docs/FORMAT.md`.
  - **Plan (lead), within D140's design:**
    - `plied.toml`. Linked, read-only sources: decisions `docs/log/` (with `authority` and `scope` fields for new
      entries, D140 item 9), contamination, findings, backlog, and STATUS with its four archives (new ids S001,
      A001–A004 in their frontmatter, so commitments made there can be quoted from them). Sealed file
      `.claude/sealed-paths.txt`. Cleared literature from `docs/literature.json`, page text `.cache/papers/`, page
      images through `scripts/paperPage.ts`. `canonical_branch` `browser-sim-m1`.
    - Records: the threads draft (revision 2) migrated into threads, commitments and questions, brought up to
      D141 (contact split read D139, B023 filed). Draft labels map to plied ids as listed at the top of the draft.
    - `docs/records.mjs log new … --authority <who> --scope "<ids>"`.
    - Claude Code hook (`plied hook claude`), git guards (`plied guard install`), `plied check` in `npm test`
      (skipped where plied is not installed, e.g. CI), an optional commitment gate in `scripts/run.sh`.
    - CLAUDE.md, AGENTS.md and STATUS ("Where the record lives") say how plied is used.
    - Existing collections keep their tools (D140 item 4). Nothing about the plan, data roles or any model changes.
  - **Done (2026-10-24 ≈ 22:17 UTC):**
    - **Records:** 56 threads (T001–T056), 24 commitments (P01–P24) and 11 questions (Q01–Q11), migrated from the
      draft by checked writes (`plied new` / `set`; script in the session scratchpad, dry-run first in a throwaway
      repository). Every `outcome.quote` and `wording` matches its source. The draft (revision 2) is marked
      superseded, with the label → id map at its top.
    - **Brought up to D141.** T018 (contact split) is closed on D139's reading. P09 (ask for clearance) is fulfilled
      and P16 (rule 1) not triggered (D139). Q11 (clear Mailleux 1999) is open (D139). The brood files are extracted,
      so T034 is open with no analysis designed. B023 is linked to T035.
    - **The draft's P2 and P1** are `due` and `missed`. All open commitments are attached to their nodes, so
      `plied review <node> --gate` lists them.
    - **New task T049 (lead, next 1):** `plied check` flags 44 entries, D004–D142, whose conditional or deferral no
      commitment links (scan since 2026-10-17). Each will be read, its real commitments recorded, and false positives
      listed in T049.
    - **Ids for STATUS and the archives:** S001, A001–A004 in id / title frontmatter. `records.mjs` and
      `findings.mjs` checks are unchanged.
    - **`docs/records.mjs`:** `log new … --authority user|"delegated by Dnnn" --scope "<ids>"`, checked.
    - **Hooks:** `plied hook claude` on SessionStart, UserPromptSubmit and PostToolUse, with `PLIED_AGENT=lead`
      (`.claude/settings.local.json`, local). Delivery tested: one test message on T049, acknowledged; it stays in
      the append-only log `plied/messages/T049.jsonl`.
    - **git guards:** `plied guard install` (pre-commit, pre-merge-commit).
    - **`scripts/run.sh start … --node <ids>`:** refuses to launch until `plied review … --action run:<name> --gate`
      passes. Tested closed (real repository) and open (dry-run repository); the nodes are kept in the run folder.
    - **`test/records.test.ts`:** `plied check` and `plied view --check`, skipped where plied is not installed (CI).
      `npm test` 260 / 260; tsc clean.
    - **Docs:** CLAUDE.md (a lead duty: keep plied current), AGENTS.md (other agents read and message, never write
      records), STATUS (the "Where the record lives" row and RESUME), and a D141 amendment (Rust build).
  - **Not done:** nothing committed (ask first). plied's literature index is not built (`plied index` is local
    runtime state). Search is keyword only.
