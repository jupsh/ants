---
id: P159
title: "Contact-reset: Stage 0b failure means 'not established for this comparison'"
wording: >-
  Failure should mean “a characteristic interval was not established for this comparison,” rather
  than establish its absence.
made: D244
state: open
nodes: [T060]
reviews:
  - action: commit:t060-stage0-design-20261102
    disposition: satisfied
    because: >-
      D243 amendment 1, point 3: the failure label is 'a characteristic interval was not established
      for this comparison'.
    by: lead (session 7b85e17e)
    at: "2026-11-02 03:35 UTC"
    inputs:
      - record: D243
        rev: a5fef01895d5a78df9941aa9914c404b673e2e4c311a0c7f0d2afc721813260b
      - record: D244
        rev: 8f3c0feeac9407fabac76aaf0ebf0f44d21bfbe13bc4d9b92233335bdf600a3c
  - action: commit:h6-reading-20261103
    disposition: not-triggered
    because: >-
      The commit holds the H6 reading (D260), F113-F116 and record notes only (git diff: nothing
      under src/, scripts/, test/ or .claude/); no Stage 0 code, run or output exists or is
      committed, and T060's design is unchanged.
    by: lead (session f6353347)
    at: "2026-11-03 00:59 UTC"
    inputs:
      - record: D260
        rev: 33ffee2d7b35cc68baca7141a758621b02f8e5a016a185532a7b57b6aa1126cf
---

## History
- 2026-11-02 03:29 UTC lead (session 7b85e17e): created — D244: point 3, the failure label
- 2026-11-02 03:35 UTC lead (session 7b85e17e): review for commit:t060-stage0-design-20261102: satisfied — D243 amendment 1, point 3: the failure label is 'a characteristic interval was not established for this comparison'.
- 2026-11-03 00:59 UTC lead (session f6353347): review for commit:h6-reading-20261103: not-triggered — The commit holds the H6 reading (D260), F113-F116 and record notes only (git diff: nothing under src/, scripts/, test/ or .claude/); no Stage 0 code, run or output exists or is committed, and T060's design is unchanged.
