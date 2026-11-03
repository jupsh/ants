---
id: P184
title: >-
  Contact-reset audit: freeze committed, gated, before the audit, only once the equality, whitelist
  and colony-237 checks pass
wording: >-
  approving the gated freeze commit before the audit, once the equality, whitelist and colony-237
  reproduction checks pass. Include the frozen code, its imports and the SHA-256 records.
made: D267
state: fulfilled
nodes: [T060]
resolved_by: D243
reviews:
  - action: run:t060-freeze-check
    disposition: acting
    because: >-
      Checking that the frozen copy under scripts/frozen/t060/ runs: frozen extract.ts --colony 15
      --repro (reproduction values only, compared with cmp to D265's repro-c15.json) and frozen
      support.ts --pool on the synthetic Scope B support files (compared with the scratch pool). No
      audit on tracks, no event table written, the sealed folder never named. D267's three checks
      passed (D268); this confirms the frozen copy runs before the gated freeze commit.
    by: lead (session e38b977a)
    at: "2026-11-03 15:52 UTC"
  - action: commit:t060-freeze-20261103
    disposition: satisfied
    because: >-
      The commit holds the T060 freeze and its records: scripts/frozen/t060/ (26 files,
      byte-identical to D243's freeze block SHA-256s; checked by sha256sum and by the frozen copy's
      colony-237 repro and synthetic pool, D243), D267, D268, D243's blocks, STATUS, and plied
      records (P184, P185, dispositions, notes). Nothing under src/ or test/; scripts/scratch/ and
      logs/ are not committed; backlog/ left out. Equality, whitelist and colony-237 reproduction
      passed (D268) before the freeze; the commit holds the frozen code, its imports and the SHA-256
      records, before the audit runs.
    by: lead (session e38b977a)
    at: "2026-11-03 16:03 UTC"
  - action: run:t060-support-audit-20261103
    disposition: satisfied
    because: >-
      The run is the support-only audit (D266, D267): the frozen scripts/frozen/t060/ support.ts
      --colony i for the 22 colonies (extraction in memory, no event table written, only whitelisted
      counts to logs/t060-support/), then --pool. The sealed folder is never named or written. The
      freeze was committed, gated, before this run (0e13c45, commit:t060-freeze-20261103), after the
      three checks passed (D268).
    by: lead (session e38b977a)
    at: "2026-11-03 16:06 UTC"
    inputs:
      - record: D243
        rev: a0ceb72f78abef50fd2e7d382e082d8d6ec3fd5a370cd4c5509ad3173ec037fe
      - record: D266
        rev: 9ded34980bb3a0f5531582ebe62e7938c58f957a591032ca0ef067dacc8bdfdf
      - record: D267
        rev: decac8e6aabd3e697d83e23e31b0be661593e1d66231b4eeb812585126e5481c
      - record: D268
        rev: a611d465e140a5617e4d1dd8a972961d7f75059ed21e744745ba6177f475830c
---

## History
- 2026-11-03 15:42 UTC lead (session e38b977a): created — D267: the user approved the freeze commit
- 2026-11-03 15:52 UTC lead (session e38b977a): review for run:t060-freeze-check: acting — Checking that the frozen copy under scripts/frozen/t060/ runs: frozen extract.ts --colony 15 --repro (reproduction values only, compared with cmp to D265's repro-c15.json) and frozen support.ts --pool on the synthetic Scope B support files (compared with the scratch pool). No audit on tracks, no event table written, the sealed folder never named. D267's three checks passed (D268); this confirms the frozen copy runs before the gated freeze commit.
- 2026-11-03 16:03 UTC lead (session e38b977a): review for commit:t060-freeze-20261103: satisfied — The commit holds the T060 freeze and its records: scripts/frozen/t060/ (26 files, byte-identical to D243's freeze block SHA-256s; checked by sha256sum and by the frozen copy's colony-237 repro and synthetic pool, D243), D267, D268, D243's blocks, STATUS, and plied records (P184, P185, dispositions, notes). Nothing under src/ or test/; scripts/scratch/ and logs/ are not committed; backlog/ left out. Equality, whitelist and colony-237 reproduction passed (D268) before the freeze; the commit holds the frozen code, its imports and the SHA-256 records, before the audit runs.
- 2026-11-03 16:06 UTC lead (session e38b977a): review for run:t060-support-audit-20261103: satisfied — The run is the support-only audit (D266, D267): the frozen scripts/frozen/t060/ support.ts --colony i for the 22 colonies (extraction in memory, no event table written, only whitelisted counts to logs/t060-support/), then --pool. The sealed folder is never named or written. The freeze was committed, gated, before this run (0e13c45, commit:t060-freeze-20261103), after the three checks passed (D268).
- 2026-11-03 16:15 UTC lead (session e38b977a): set state=fulfilled; set resolved_by=D243 — Freeze committed, gated, before the audit (0e13c45; D243 freeze block) after the three checks passed (D268).
