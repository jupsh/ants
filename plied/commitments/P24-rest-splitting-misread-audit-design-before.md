---
id: P24
title: "Rest-splitting misread audit: design before running"
wording: >-
  A data-only audit (count such one-frame excursions; recompute still-run survival without them)
  needs a logged design before running.
summary: Carried to paper 3 (D127 amendment 2).
made: D127
state: open
nodes: [T053]
links: [F003, F089]
reviews:
  - action: commit:20261029
    disposition: not-applicable
    because: No audit is run by committing; its design remains due before it runs.
    by: lead (session 20261029)
    at: "2026-10-29 21:24 UTC"
  - action: commit:t060-stage0-design-20261102
    disposition: not-triggered
    because: >-
      The commit records T060's design (D243 with amendment 1), the user's answer (D244), STATUS's
      pointer and plied records only; nothing is built, run, fitted or read; P24's still-run
      survival audit is not run; D243's sustained-onset rule only counts excursions inside T060's
      intervals, in a logged design.
    by: lead (session 7b85e17e)
    at: "2026-11-02 03:34 UTC"
    inputs:
      - record: D243
        rev: a5fef01895d5a78df9941aa9914c404b673e2e4c311a0c7f0d2afc721813260b
      - record: D244
        rev: 8f3c0feeac9407fabac76aaf0ebf0f44d21bfbe13bc4d9b92233335bdf600a3c
---
Draft label: P8b (docs/threads-draft.md revision 2).

## History
- 2026-10-24 22:11 UTC lead (session 104e7640): created — migrated from docs/threads-draft.md revision 2 (D142)
- 2026-10-24 22:12 UTC lead (session 104e7640): set nodes=["T053"] — attached to its nodes (D142)
- 2026-10-29 21:24 UTC lead (session 20261029): review for commit:20261029: not-applicable — No audit is run by committing; its design remains due before it runs.
- 2026-11-02 03:16 UTC lead (session 7b85e17e): reviewed D243@9fcd5b57058b; D243 adds a sustained-onset rule for T060's own intervals (one-frame excursions counted, near and away from partners) and says P24's still-run survival audit stays with T053; P24 itself is unchanged and still needs its own logged design before running
- 2026-11-02 03:30 UTC lead (session 7b85e17e): reviewed D243@a5fef01895d5; D243 amendment 1 adds misread excursions to the Scope B fixture and a rule for missing detections at the sustained-onset check, both inside T060; P24's still-run survival audit stays with T053 and still needs its own design
- 2026-11-02 03:34 UTC lead (session 7b85e17e): review for commit:t060-stage0-design-20261102: not-triggered — The commit records T060's design (D243 with amendment 1), the user's answer (D244), STATUS's pointer and plied records only; nothing is built, run, fitted or read; P24's still-run survival audit is not run; D243's sustained-onset rule only counts excursions inside T060's intervals, in a logged design.
