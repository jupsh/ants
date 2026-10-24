---
id: D141
date: 2026-10-24
time: 17:44
kind: run
title: plied 0.1.0 built (D140): checked writes, registers, tree and queries, messaging with presence, literature, search, commitment review, git guards; 73 tests pass on Python 3.11-3.13; read-only trial on this repo's records
---
- **2026-10-24 ≈ 17:44 UTC — plied 0.1.0 built (D140): checked writes, registers, tree and queries, messaging with presence, literature, search, commitment review, git guards; 73 tests pass on Python 3.11-3.13; read-only trial on this repo's records.**
  - **Where.** `/home/norma/repos/plied` (git initialised, nothing committed, not pushed). Python ≥ 3.11, no
    runtime dependencies; optional `pdf` extra (pypdfium2, Pillow) for page text and images.
  - **What it does, against D140's design.** Items 1–10 are implemented as designed, with the differences below.
    Tests: 73 pass on 3.11, 3.12 and 3.13 (Linux), including six concurrent writers from one revision (exactly one
    accepted, five conflicts), quote, authority and scope checks, the branch guard, torn-line repair and retry
    deduplication, hook delivery once per session, lease expiry, review chains (`parent` alone carries nothing),
    the git guards, sealed paths through symlinks, refusal of a stale index after a policy change, and the four
    citation checks. A CI workflow for Linux, macOS and Windows is written but has not run.
  - **Differences from D140, found while building.**
    1. Claims (presence) live in the untracked runtime directory (`<git common dir>/plied/claims.json`), not in a
       tracked collection: a lease renewed on every hook would churn git. The managed collections are threads,
       commitments, questions, messages and the generated view.
    2. git runs `pre-merge-commit` before it writes `MERGE_HEAD`, so a range check found nothing and a merge
       carrying a code branch's record edit went through in testing. The merge guard now judges what the merge
       stages: every managed file must be content plied wrote (`written.txt` in the runtime directory).
       `plied guard range BASE HEAD` stays the strict check for CI and review.
    3. The hook costs ≈ 0.16 s per call (Python start-up and imports; its own work ≈ 2 ms). PostToolUse
       registration is optional.
  - **Read-only trial on this repo (no file here changed; config and runtime in the session scratchpad).**
    Sources D, F, B, X; cleared literature from `docs/literature.json` with `.cache/papers` page text; sealed
    file `.claude/sealed-paths.txt`; `logs/` excluded. `check`: 278 linked records, 0 errors, 97 warnings (93
    findings no plied record links to, as expected with no records yet; 4 log entries since 2026-10-24 with a
    deferral or conditional that no commitment links: D131, D132, D134, D138). `index`: 279 records and 296
    paper pages in 1.8 s. `check` takes 0.5 s.
  - **Not done.** Nothing in this repo uses plied; adoption (config, migrating `docs/threads-draft.md` into
    records, the `records.mjs` authority and scope fields, hooks, the check in `npm test`) is the user's
    decision. Semantic search is not built (keyword search only). Publishing to GitHub waits for the user.
  - **Amended 2026-10-24 ≈ 22:16 UTC (lead, D142):** the plied installed and adopted here is a later Rust build of
    the same design (`plied 0.1.0`, `~/.cargo/bin/plied`, plied repo commit `43ab9ba`), not the Python package
    described above. Its contract is the plied repo's `docs/FORMAT.md`.
