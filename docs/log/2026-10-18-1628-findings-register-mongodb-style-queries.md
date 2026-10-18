---
id: D063
date: 2026-10-18
time: 16:28
kind: decision
title: Findings register: MongoDB-style queries (user: option 1, "let's use sift")
---
- **2026-10-18 ≈ 16:28 UTC — Findings register: MongoDB-style queries (user: option 1, "let's use sift").**
  - `node findings/findings.mjs find '<JSON query>' [--sort [-]field] [--fields a,b] [--json]`. Matching uses
    **sift** (MIT), a new dev dependency pinned exactly: first 17.1.3, because 17.1.4 (2026-10-08) followed 2.5 years
    without a release; **upgraded to 17.1.4 the same afternoon** (user: those were recent maintainer updates, it is
    fine). Same results on every test query.
  - List fields are arrays (`{"related":"F006"}` matches any finding linked to F006). `$where` is refused (it runs
    code).
  - Tested: topic / status `$in` with sorting, array membership, `$regex` with options, `$elemMatch`, and the three
    error paths (`$where`, unknown operator, bad JSON). `check` still passes (57 findings, 0 problems).
  - `package.json` and the lock also carry the other session's `tesseract.js` (16:16), unchanged.
