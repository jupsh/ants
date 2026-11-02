---
id: P157
title: "Contact-reset: Stage 0b's reference rate defined despite threshold, censoring and selection"
wording: >-
  Define how the exponential reference’s rate is estimated despite the 60-s threshold, censoring and
  contact-free selection.
made: D244
state: open
nodes: [T060]
reviews:
  - action: commit:t060-stage0-design-20261102
    disposition: satisfied
    because: >-
      D243 amendment 1, point 3: the threshold is each interval's entry time, PDCs and
      incompleteness are censoring, and the memoryless rate is the censored likelihood with k fixed
      at 1.
    by: lead (session 7b85e17e)
    at: "2026-11-02 03:35 UTC"
    inputs:
      - record: D243
        rev: a5fef01895d5a78df9941aa9914c404b673e2e4c311a0c7f0d2afc721813260b
      - record: D244
        rev: 8f3c0feeac9407fabac76aaf0ebf0f44d21bfbe13bc4d9b92233335bdf600a3c
---

## History
- 2026-11-02 03:29 UTC lead (session 7b85e17e): created — D244: point 3, the reference rate
- 2026-11-02 03:35 UTC lead (session 7b85e17e): review for commit:t060-stage0-design-20261102: satisfied — D243 amendment 1, point 3: the threshold is each interval's entry time, PDCs and incompleteness are censoring, and the memoryless rate is the censored likelihood with k fixed at 1.
