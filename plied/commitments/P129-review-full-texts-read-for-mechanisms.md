---
id: P129
title: "Review: full texts read for mechanisms, never parameters or targets"
wording: They are read for mechanisms, manipulations and predictions, never for parameters or targets
made: D232
state: fulfilled
nodes: [T058]
resolved_by: D238
reviews:
  - action: commit:q27-review-scope-20261031
    disposition: not-triggered
    because: >-
      A D232 stage rule (search, abstracts, exposure logging or full-text reading); the commit
      performs no search, reads no abstract or paper and downloads nothing.
    by: lead (session f6ab21fd)
    at: "2026-10-31 18:02 UTC"
    inputs:
      - record: D232
        rev: 5c00fbac6f476afe6f8ce50f0e92837bd25020404dfb962fd51420d38c0f31ca
      - record: D233
        rev: 1a7007c2f05027e7622bd0015906b742660c0f29da3a8e51b0055306d80bbeaf
  - action: commit:synchrony-stage1-20261101
    disposition: not-triggered
    because: >-
      The commit records stage 1 (D234, X024), the user's Q28 answer (D235) and six hash pins; no
      review table is written, no full text read, no model or 1(e) design touched, no B020/F111
      text.
    by: lead (session f6ab21fd)
    at: "2026-11-01 17:19 UTC"
    inputs:
      - record: D234
        rev: 3ab0d191d96fe2ee3e9e14b104ac1c4599cc650c1ec60e1c06c4a3e7b4aa9a8b
      - record: D235
        rev: afeabe355110bf2f83b5d38e32566090d8a1f8d742cd9e381fe0e21fb6155e98
  - action: commit:synchrony-d236-20261101
    disposition: not-triggered
    because: No full text read yet.
    by: lead (session f6ab21fd)
    at: "2026-11-01 17:29 UTC"
    inputs:
      - record: D236
        rev: 95b5f98a08b3714b9440375496076e499447c6a751b62561d37c5fd381122950
      - record: D235
        rev: afeabe355110bf2f83b5d38e32566090d8a1f8d742cd9e381fe0e21fb6155e98
---

## History
- 2026-10-31 17:28 UTC lead (session f6ab21fd): created — D232: approved by D233
- 2026-10-31 18:02 UTC lead (session f6ab21fd): review for commit:q27-review-scope-20261031: not-triggered — A D232 stage rule (search, abstracts, exposure logging or full-text reading); the commit performs no search, reads no abstract or paper and downloads nothing.
- 2026-10-31 19:09 UTC lead (session f6ab21fd): reviewed D234@3ab0d191d96f; No full text read yet; still open.
- 2026-11-01 17:19 UTC lead (session f6ab21fd): review for commit:synchrony-stage1-20261101: not-triggered — The commit records stage 1 (D234, X024), the user's Q28 answer (D235) and six hash pins; no review table is written, no full text read, no model or 1(e) design touched, no B020/F111 text.
- 2026-11-01 17:27 UTC lead (session f6ab21fd): reviewed D236@95b5f98a08b3; D236 (Despland & Simpson 2006 added as the eighth tier-1 paper) read; no change to this commitment's state.
- 2026-11-01 17:29 UTC lead (session f6ab21fd): review for commit:synchrony-d236-20261101: not-triggered — No full text read yet.
- 2026-11-01 17:38 UTC lead (session f6ab21fd): reviewed D237@aeef03977adf; D237 (review note delivered) followed this rule; kept open while the user may ask for revisions (Q29).
- 2026-11-01 18:20 UTC lead (session f6ab21fd): set state=fulfilled; set resolved_by=D238 — D238: the user accepted the review (D237, amended) as delivered under this rule; item 1(e)'s design not started
