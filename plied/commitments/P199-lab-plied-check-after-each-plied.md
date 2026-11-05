---
id: P199
title: "Lab: plied check after each plied install; new errors roll back and go to the user"
wording: >-
  after each local install the lab runs plied check here; new errors roll the install back to the
  previous version and go to the user.
made: D277
state: open
nodes: [T065]
reviews:
  - action: run:lab-1a
    disposition: not-applicable
    because: >-
      run:lab-1a installs no plied version (the brief forbids touching ~/repos/plied or the
      installed binary)
    by: lead (session 48c74063)
    at: "2026-11-05 05:35 UTC"
    inputs:
      - record: D277
        rev: 4b7df37ecf52dd226b9df30ad81579101ed78f1e88042b334a34b2369b0b025b
  - action: run:lab-1a
    disposition: not-applicable
    because: >-
      re-read D277 and D278: run:lab-1a installs no plied version; the brief forbids touching
      ~/repos/plied or the installed binary
    by: lead (session 48c74063)
    at: "2026-11-05 05:38 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
      - record: D278
        rev: 07ac35c141c54e21cf726150cd9670f0669f481aa8d4b15b10dbc1ceed4c153c
  - action: commit:lab-records-20261105
    disposition: not-applicable
    because: no plied version is installed or changed by this commit
    by: lead (session 48c74063)
    at: "2026-11-05 06:00 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
---

## History
- 2026-11-05 05:34 UTC lead (session 48c74063): created — D277 amendment 1: guard on installing a lab-made plied release
- 2026-11-05 05:35 UTC lead (session 48c74063): review for run:lab-1a: not-applicable — run:lab-1a installs no plied version (the brief forbids touching ~/repos/plied or the installed binary)
- 2026-11-05 05:38 UTC lead (session 48c74063): review for run:lab-1a: not-applicable — re-read D277 and D278: run:lab-1a installs no plied version; the brief forbids touching ~/repos/plied or the installed binary
- 2026-11-05 05:45 UTC lead (session 48c74063): reviewed D279@22eb7cdfc9f1; D279 read: nothing about plied installs; P199 unchanged.
- 2026-11-05 05:59 UTC lead (session 48c74063): reviewed D280@e1c4e6a09f8a; D280 read: nothing about plied installs; unchanged.
- 2026-11-05 06:00 UTC lead (session 48c74063): review for commit:lab-records-20261105: not-applicable — no plied version is installed or changed by this commit
