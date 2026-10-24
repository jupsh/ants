---
id: D140
date: 2026-10-24
time: 17:18
kind: decision
title: Record tooling: build plied, a separate Python package (../plied, GitHub), for the work tree, commitments, questions, messaging with presence and literature; design as agreed with the user
---
- **2026-10-24 ≈ 17:18 UTC — Record tooling: build plied, a separate Python package (../plied, GitHub), for the work tree, commitments, questions, messaging with presence and literature; design as agreed with the user.**
  - **Origin.** `docs/threads-draft.md` (revision 2, under D138) proposed a thread tree, a commitments register and
    a register of decisions waiting on the user. The user asked for prior-art research and for many agents to work
    at once; two reviews (lead and another, pasted by the user) were reconciled over three rounds in conversation and
    the user agreed the result ("Agreed with everything").
  - **Prior art (2026-10-24 search).** Nothing combines the pieces. Beads (task graph, ready work; now Dolt-backed,
    so binary), grite and git-bug (data in git refs or objects), GNAP (draft spec), MCP Agent Mail (messaging and
    file leases via a server), QMD and Basic Memory (derived search indexes), PaperQA2 (defaults to external
    services), research-provenance, evidence-docs, ClaimKit, XScientist (early or no code). `weft` is taken on PyPI
    by an agent task tool, so the package is named `plied`.
  - **Where and how (user).** A separate repository at `/home/norma/repos/plied`, published to GitHub separately;
    Python (lead's choice on the user's encouragement: the most widely used language in research teams, `uvx`
    runs it without installing; standard-library core). Project-specific rules (id formats, evidence roles,
    sealed paths, literature clearing) live in this repo's configuration, not in the package.
  - **Design as agreed.**
    1. Storage: Markdown in git, one file per work item, commitment or question; tree, tables and indexes
       generated. Existing decisions and findings stay authoritative and are linked, not restated.
    2. State: status, scheduling (`next`, `actor`), approval and dependencies (`waiting_on` blocks, `uses` does
       not, `parent` organisational only) kept separate; closing records `outcome` (quoted) and `carries`.
    3. Writes: a local CLI, no daemon. One canonical checkout, found through `git rev-parse --git-common-dir`; copies
       in other worktrees are read-only snapshots. A write takes a lock, compares the expected content hash,
       validates, and replaces the file atomically; a stale write is rejected with the current record and a diff.
       Writes are refused while the canonical checkout is off its configured branch or mid-merge or mid-rebase.
       Rejected proposals can be posted as messages.
    4. Managed collections in v1: the new ones only (threads, commitments, questions, messages, claims). A merge
       check rejects code-branch changes to them. Existing collections (`docs/log/`, `findings/`,
       `docs/contamination/`, `backlog/`) keep their tools until each is moved by its own decision. A passing check
       never authorises a commit; commits follow the lead-agent rules.
    5. Messaging: expiring claims (agent, session, node); node-addressed messages recording the active recipients
       when sent; delivery at hook points plus `inbox` polling; delivered, read and acknowledged kept separate
       (acknowledged = receipt, not approval). One JSON line per message with a sender-chosen unique id; under the
       lock a torn last line is cut, duplicate ids are skipped, then append and fsync. A lease estimates presence;
       non-Claude agents claim by hand, so their presence is weaker.
    6. Literature: search cleared papers by paper id and PDF page, open page images, citation backlinks; clearance,
       source hash, page existence and quotation match checked separately. A quotation match does not establish
       scientific support; tables, figures and OCR'd numbers still need the page image.
    7. Search: only explicitly allowed sources; sealed-path rules enforced at indexing and again when a result is
       opened; symlinks resolved; the index stores a hash of the sealing rules, literature manifest and allowlist
       and refuses to serve when it is stale; indexed file identity checked; `logs/` excluded outright. Keyword and
       page search first, semantic ranking optional.
    8. Validation: hard failures for broken references, invalid states, `waiting_on` cycles and required quotation
       mismatches; warnings for staleness and possibly unrecorded commitments. Checker version and configuration
       pinned.
    9. Approval evidence: `approval.by` must cite a record whose structured `authority` (user, or delegated by
       Dnnn) and `scope` (ids approved) cover the node. Log entries gain those fields for new entries; D001–D139
       have none, so approvals citing them warn "unverifiable", never pass.
    10. Commitment review before consequential actions (a fit, a freeze, closing work): commitments that apply by
        direct link, through `waiting_on`/`uses` chains, or as project-wide, and through `parent` only when marked
        `applies_to: subtree`; each shown with the chain by which it applies, and its disposition recorded.
  - **Order.** Writer and registers, tree and queries, messaging with presence, literature, commitment review: all
    in the first deliverable. Adoption in this repo (the STATUS "Where the record lives" row, a CLAUDE.md duty,
    the check in `npm test`, the `records.mjs` fields) is a later user decision.
