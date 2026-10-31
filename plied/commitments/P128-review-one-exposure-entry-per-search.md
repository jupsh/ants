---
id: P128
title: "Review: one exposure entry per search session; nothing downloaded"
wording: >-
  This means one entry per search session, listing the queries, the papers named and what was seen.
  Nothing is downloaded.
made: D232
state: open
nodes: [T058]
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
---

## History
- 2026-10-31 17:28 UTC lead (session f6ab21fd): created — D232: approved by D233
- 2026-10-31 18:02 UTC lead (session f6ab21fd): review for commit:q27-review-scope-20261031: not-triggered — A D232 stage rule (search, abstracts, exposure logging or full-text reading); the commit performs no search, reads no abstract or paper and downloads nothing.
