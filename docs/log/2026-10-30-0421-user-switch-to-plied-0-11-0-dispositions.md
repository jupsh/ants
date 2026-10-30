---
id: D187
date: 2026-10-30
time: 04:21
kind: decision
title: User: switch to plied 0.11.0; dispositions pin the evidence read (dispose --read ID@SHA256); requires raised to 0.11.0
---
- **2026-10-30 ≈ 04:21 UTC — User: switch to plied 0.11.0; dispositions pin the evidence read (dispose --read ID@SHA256); requires raised to 0.11.0.**
  - **User (in conversation, verbatim):** "We are switching to version 0.11 of plied. any updates to make first?",
    then "go for it" to the lead's proposal: commit the pending work first (done, `10b0ca2`), then adopt
    `dispose --read` with `requires = ">=0.11.0"` and a line in CLAUDE.md's lead-agent duties.
  - **plied 0.11.0** (installed by the user; replaces 0.10.0). Format and JSON envelope stay at version 1. Before
    the switch, `plied check` under 0.10.0: 154 records, 0 errors, 0 warnings. Under 0.11.0: the same, plus one
    warning that the generated view is out of date (its layout changed); `plied view` regenerates it. Nothing in
    the repo depends on changed behaviour: `run.sh` uses `review --gate` (verdicts unchanged), the records test
    uses `check` and `view --check`, the hooks `plied hook claude` and `plied guard pre-commit`.
  - **Rule (CLAUDE.md, lead-agent duties):** a disposition names the evidence it was based on with `dispose --read
    ID@FULL_SHA256`, once per record read, each SHA taken from the same `plied show <ID> --json` that supplied the
    text read. `check` and `review` then report a disposition whose evidence has changed since; a note cannot
    clear that, only reading the changed evidence and recording a new disposition. The pins keep no bytes and do
    not change gate verdicts. Dispositions recorded before this entry carry no pins and stay as they are.
  - **`plied.toml`:** `requires = ">=0.11.0"`, as the 0.11.0 changelog asks of stores that pin inputs.
  - Not adopted: `check --baseline`, `--freshness`, `--group-stale`, `show --summary` (read-only views, used as
    needed).
