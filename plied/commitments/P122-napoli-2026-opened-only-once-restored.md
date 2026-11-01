---
id: P122
title: Napoli 2026 opened only once restored to literature/ and pinned
wording: Restore the approved copy to the cleared collection and pin its hash before opening it.
made: D233
state: fulfilled
nodes: [T058]
resolved_by: D237
reviews:
  - action: commit:q27-review-scope-20261031
    disposition: satisfied
    because: >-
      The user copied Napoli 2026 into literature/; its SHA-256 ff35ee67...31c3 was pinned in
      docs/literature.json (in this commit) before the file was opened; it has not been opened.
    by: lead (session f6ab21fd)
    at: "2026-10-31 18:02 UTC"
    inputs:
      - record: D233
        rev: 1a7007c2f05027e7622bd0015906b742660c0f29da3a8e51b0055306d80bbeaf
  - action: commit:synchrony-stage1-20261101
    disposition: satisfied
    because: >-
      All cleared PDFs, Napoli included, are pinned in docs/literature.json (this commit) and none
      has been opened beyond PDF metadata and page count.
    by: lead (session f6ab21fd)
    at: "2026-11-01 17:19 UTC"
    inputs:
      - record: D234
        rev: 3ab0d191d96fe2ee3e9e14b104ac1c4599cc650c1ec60e1c06c4a3e7b4aa9a8b
      - record: D235
        rev: afeabe355110bf2f83b5d38e32566090d8a1f8d742cd9e381fe0e21fb6155e98
  - action: commit:synchrony-d236-20261101
    disposition: satisfied
    because: >-
      Every cleared PDF, the two added in D236 included, is pinned in docs/literature.json (this
      commit); none opened beyond PDF metadata and page count.
    by: lead (session f6ab21fd)
    at: "2026-11-01 17:29 UTC"
    inputs:
      - record: D236
        rev: 95b5f98a08b3714b9440375496076e499447c6a751b62561d37c5fd381122950
      - record: D235
        rev: afeabe355110bf2f83b5d38e32566090d8a1f8d742cd9e381fe0e21fb6155e98
---

## History
- 2026-10-31 17:28 UTC lead (session f6ab21fd): created — D233: Napoli re-read permitted on this condition
- 2026-10-31 18:02 UTC lead (session f6ab21fd): review for commit:q27-review-scope-20261031: satisfied — The user copied Napoli 2026 into literature/; its SHA-256 ff35ee67...31c3 was pinned in docs/literature.json (in this commit) before the file was opened; it has not been opened.
- 2026-10-31 19:09 UTC lead (session f6ab21fd): reviewed D234@3ab0d191d96f; D234: Napoli pinned (D233), not yet opened; still open.
- 2026-11-01 17:18 UTC lead (session f6ab21fd): reviewed D235@afeabe355110; D235 applies the same pin-before-opening rule to every cleared PDF; Napoli is pinned, not yet opened. Still open.
- 2026-11-01 17:19 UTC lead (session f6ab21fd): review for commit:synchrony-stage1-20261101: satisfied — All cleared PDFs, Napoli included, are pinned in docs/literature.json (this commit) and none has been opened beyond PDF metadata and page count.
- 2026-11-01 17:29 UTC lead (session f6ab21fd): review for commit:synchrony-d236-20261101: satisfied — Every cleared PDF, the two added in D236 included, is pinned in docs/literature.json (this commit); none opened beyond PDF metadata and page count.
- 2026-11-01 18:20 UTC lead (session f6ab21fd): set state=fulfilled; set resolved_by=D237 — D237/X025: Napoli 2026 opened only after its pin (D233)
