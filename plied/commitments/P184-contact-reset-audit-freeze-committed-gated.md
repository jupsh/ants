---
id: P184
title: >-
  Contact-reset audit: freeze committed, gated, before the audit, only once the equality, whitelist
  and colony-237 checks pass
wording: >-
  approving the gated freeze commit before the audit, once the equality, whitelist and colony-237
  reproduction checks pass. Include the frozen code, its imports and the SHA-256 records.
made: D267
state: open
nodes: [T060]
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
---

## History
- 2026-11-03 15:42 UTC lead (session e38b977a): created — D267: the user approved the freeze commit
- 2026-11-03 15:52 UTC lead (session e38b977a): review for run:t060-freeze-check: acting — Checking that the frozen copy under scripts/frozen/t060/ runs: frozen extract.ts --colony 15 --repro (reproduction values only, compared with cmp to D265's repro-c15.json) and frozen support.ts --pool on the synthetic Scope B support files (compared with the scratch pool). No audit on tracks, no event table written, the sealed folder never named. D267's three checks passed (D268); this confirms the frozen copy runs before the gated freeze commit.
- 2026-11-03 16:03 UTC lead (session e38b977a): review for commit:t060-freeze-20261103: satisfied — The commit holds the T060 freeze and its records: scripts/frozen/t060/ (26 files, byte-identical to D243's freeze block SHA-256s; checked by sha256sum and by the frozen copy's colony-237 repro and synthetic pool, D243), D267, D268, D243's blocks, STATUS, and plied records (P184, P185, dispositions, notes). Nothing under src/ or test/; scripts/scratch/ and logs/ are not committed; backlog/ left out. Equality, whitelist and colony-237 reproduction passed (D268) before the freeze; the commit holds the frozen code, its imports and the SHA-256 records, before the audit runs.
