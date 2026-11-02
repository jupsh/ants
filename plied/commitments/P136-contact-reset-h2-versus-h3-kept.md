---
id: P136
title: "Contact-reset: H2 versus H3 kept unresolved unless the design can distinguish them"
wording: Keep H2 versus H3 unresolved unless the design can distinguish them.
made: D238
state: open
nodes: [T060]
reviews:
  - action: commit:synchrony-review-20261101
    disposition: not-triggered
    because: >-
      Governs designs not yet written (T059-T061); the commit records the accepted review, D238 and
      the plied threads only.
    by: lead (session f6ab21fd)
    at: "2026-11-01 18:21 UTC"
    inputs:
      - record: D238
        rev: 7655ef093c1ff672b1ac5bc85031076c4f54bf6478f98f5dfc141dceb0905e92
  - action: commit:h6-design-20261101
    disposition: not-triggered
    because: >-
      The commit records the T061 inventory (D240), the H6 design and its amendment (D241), the
      user's answers (D242), F108's update and plied records; no model change, analysis, run or
      reading of new results.
    by: lead (session f6ab21fd)
    at: "2026-11-01 22:46 UTC"
    inputs:
      - record: D242
        rev: 95cc70c9ace090981dbc595ffb10d18a35f19fdbcf8455a6bf43acf2b0db63fa
      - record: D241
        rev: 597483bc51a5737e117a90e3c044b57b707aa0098848143a71938914bc3ba4ca
      - record: D240
        rev: 5875f95982462051e5fa97516cc789db1066fed33cc94c549cb361b80746300d
  - action: commit:t060-stage0-design-20261102
    disposition: satisfied
    because: >-
      The commit records T060's design (D243 with amendment 1), the user's answer (D244), STATUS's
      pointer and plied records only; nothing is built, run, fitted or read; D243 amendment 1 and
      D244 keep H2 versus H3 unresolved and no label addresses it.
    by: lead (session 7b85e17e)
    at: "2026-11-02 03:34 UTC"
    inputs:
      - record: D243
        rev: a5fef01895d5a78df9941aa9914c404b673e2e4c311a0c7f0d2afc721813260b
      - record: D244
        rev: 8f3c0feeac9407fabac76aaf0ebf0f44d21bfbe13bc4d9b92233335bdf600a3c
---

## History
- 2026-11-01 18:20 UTC lead (session f6ab21fd): created — D238: the user's condition on the contact-reset design
- 2026-11-01 18:21 UTC lead (session f6ab21fd): review for commit:synchrony-review-20261101: not-triggered — Governs designs not yet written (T059-T061); the commit records the accepted review, D238 and the plied threads only.
- 2026-11-01 19:11 UTC lead (session f6ab21fd): reviewed D239@a5d3879fe9c2, D240@5875f9598246; D239 and D240 read: no change here (D240 is the T061 inventory; D239 starts T059 and T061).
- 2026-11-01 19:15 UTC lead (session f6ab21fd): reviewed D241@c351e62616d5; D241 (the H6 design) read against this; addressed in the design, open until it is approved and read.
- 2026-11-01 22:45 UTC lead (session f6ab21fd): reviewed D241@597483bc51a5, D242@95cc70c9ace0; D241 amendment 1 and D242 read: nothing here changes beyond what D242's commitments record.
- 2026-11-01 22:46 UTC lead (session f6ab21fd): review for commit:h6-design-20261101: not-triggered — The commit records the T061 inventory (D240), the H6 design and its amendment (D241), the user's answers (D242), F108's update and plied records; no model change, analysis, run or reading of new results.
- 2026-11-02 03:16 UTC lead (session 7b85e17e): reviewed D243@9fcd5b57058b; D243 states that neither Δ3 nor the phase-response curve separates H2 from H3 and keeps it unresolved, the descriptives not read for it; open: it governs the reading
- 2026-11-02 03:30 UTC lead (session 7b85e17e): reviewed D243@a5fef01895d5, D244@8f3c0feeac94; D243 amendment 1 and D244 restate that H2 versus H3 stays unresolved; Stage 1's labels are narrowed to change relative to references and Stage 1 is deferred; open: it governs the reading
- 2026-11-02 03:34 UTC lead (session 7b85e17e): review for commit:t060-stage0-design-20261102: satisfied — The commit records T060's design (D243 with amendment 1), the user's answer (D244), STATUS's pointer and plied records only; nothing is built, run, fitted or read; D243 amendment 1 and D244 keep H2 versus H3 unresolved and no label addresses it.
