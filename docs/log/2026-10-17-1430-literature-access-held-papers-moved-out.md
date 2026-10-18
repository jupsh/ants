---
id: D010
date: 2026-10-17
time: 14:30
kind: decision
title: Literature access: held papers moved out of the repo; ranked search dropped (user decision, logged before acting)
---
**2026-10-17 ≈ 14:30 UTC — Literature access: held papers moved out of
the repo; ranked search dropped (user decision, logged before acting).**
- **Why.** An uncommitted SQLite full-text search tool
  (`scripts/research_search.py`, `docs/SEARCH.md`, PDF allowlist
  `docs/search-sources.json`) was evaluated with the user. For Markdown it
  added little over `rg` (corpus ≈ 850 KB; word matching without stemming
  fails on the same wording mismatches as `rg`). Its value was the PDF
  allowlist, but that was advisory only: nothing stopped a direct
  `pdftotext` or a Read of a held PDF. The user chose the guardrail without
  the search tool.
- **Decision.** (1) `literature/` keeps only the 11 papers cleared for
  full-text reading (Auger/Hansen 2005, Sakamoto/Akimoto 2017, Carrella
  2021, Charbonneau/Dornhaus 2015, Crosscombe 2026, Gallotti/Chialvo 2018,
  Buffin 2011, Nicolis 2005, Depickère 2004, Greenwald 2015, Mailleux
  2000; roles unchanged, § Evidence policy). The other 18 (held-out,
  unread, role-pending, methods-only, results-restricted, partially read)
  move to `~/ants-literature/held/`, outside the repo; new PDFs go there
  first and move into `literature/` only after a logged decision clears
  the whole paper. (2) Claude Code settings deny reading that folder, with
  the file tools and with shell commands. (3) `scripts/paperText.ts`
  extracts the cleared papers to `.cache/papers/<paper>/pNN.txt` (one file
  per PDF page, gitignored) for `rg`; each paper is pinned by SHA-256 in
  `docs/literature.json`, with the decision that cleared it, and a paper
  whose bytes changed is refused. (4) The search tool, its docs,
  evaluation and tests are deleted (never committed).
- **Exposure.** During the evaluation only cleared papers were opened
  (Crosscombe pp. 3, 10, 12; Charbonneau/Dornhaus pp. 7, 10; via the tool
  and one direct `pdftotext` of Charbonneau p. 10). No held paper was
  opened. Paper roles and the evidence policy are unchanged.
- **Done (≈ 14:40).** 18 PDFs moved; the 11 cleared ones match their
  pinned hashes. `scripts/paperText.ts` tested (extraction, skip when
  unchanged, refusal on a changed hash, warning for an unlisted PDF).
  Guard: `.claude/settings.local.json` denies Read of `~/ants-literature/**`
  and runs `.claude/hooks/sealed.py` before Bash/Read/Grep/Glob, refusing
  any call whose text names a path in `.claude/sealed-paths.txt` (local
  only, not committed; it can also seal pending outputs during a blind
  check). Verified live: a Read and a `cat` of a harmless test file in the
  held folder were both refused. Side effect: any shell command or search
  that merely mentions the folder name is refused too (edit such text with
  the editor tools).
