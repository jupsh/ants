---
id: P161
title: "Contact-reset: reader edge cases resolved before freezing"
wording: Resolve reader edge cases before freezing.
made: D244
state: open
nodes: [T060]
reviews:
  - action: commit:t060-stage0-design-20261102
    disposition: not-triggered
    because: >-
      No reader is frozen by this commit; D243 amendment 1, point 5, fixes the edge cases the user
      named (frame resolution, reuse and weighting, bins, missing detections at the sustained-onset
      check) for the freeze.
    by: lead (session 7b85e17e)
    at: "2026-11-02 03:35 UTC"
    inputs:
      - record: D243
        rev: a5fef01895d5a78df9941aa9914c404b673e2e4c311a0c7f0d2afc721813260b
      - record: D244
        rev: 8f3c0feeac9407fabac76aaf0ebf0f44d21bfbe13bc4d9b92233335bdf600a3c
---

## History
- 2026-11-02 03:29 UTC lead (session 7b85e17e): created — D244: point 5
- 2026-11-02 03:35 UTC lead (session 7b85e17e): review for commit:t060-stage0-design-20261102: not-triggered — No reader is frozen by this commit; D243 amendment 1, point 5, fixes the edge cases the user named (frame resolution, reuse and weighting, bins, missing detections at the sustained-onset check) for the freeze.
