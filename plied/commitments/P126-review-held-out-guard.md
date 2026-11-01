---
id: P126
title: "Review: held-out guard"
wording: >-
  the review excludes any paper that analyses held-out data: … A paper whose sources cannot be
  settled from metadata is listed for the user, not read.
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
  - action: commit:synchrony-stage1-20261101
    disposition: satisfied
    because: >-
      D234/D235: every tier-1 paper is another species or predates the held-out sets;
      held-out-adjacent records seen by title only.
    by: lead (session f6ab21fd)
    at: "2026-11-01 17:19 UTC"
    inputs:
      - record: D234
        rev: 3ab0d191d96fe2ee3e9e14b104ac1c4599cc650c1ec60e1c06c4a3e7b4aa9a8b
      - record: D235
        rev: afeabe355110bf2f83b5d38e32566090d8a1f8d742cd9e381fe0e21fb6155e98
---

## History
- 2026-10-31 17:28 UTC lead (session f6ab21fd): created — D232: approved by D233
- 2026-10-31 18:02 UTC lead (session f6ab21fd): review for commit:q27-review-scope-20261031: not-triggered — A D232 stage rule (search, abstracts, exposure logging or full-text reading); the commit performs no search, reads no abstract or paper and downloads nothing.
- 2026-10-31 19:09 UTC lead (session f6ab21fd): reviewed D234@3ab0d191d96f; D234: every checked paper's species is not L. niger; held-out-adjacent records seen by title only (X024); still open.
- 2026-11-01 17:19 UTC lead (session f6ab21fd): review for commit:synchrony-stage1-20261101: satisfied — D234/D235: every tier-1 paper is another species or predates the held-out sets; held-out-adjacent records seen by title only.
