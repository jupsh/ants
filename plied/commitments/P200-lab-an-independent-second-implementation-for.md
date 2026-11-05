---
id: P200
title: "Lab: an independent second implementation for every statistic a pre-registration freezes"
wording: The independent second implementation is required for any statistic a pre-registration freezes.
made: D278
state: open
nodes: [T065]
reviews:
  - action: run:lab-1a
    disposition: not-applicable
    because: run:lab-1a computes no statistic a pre-registration freezes; it builds lab tooling
    by: lead (session 48c74063)
    at: "2026-11-05 05:38 UTC"
    inputs:
      - record: D278
        rev: 07ac35c141c54e21cf726150cd9670f0669f481aa8d4b15b10dbc1ceed4c153c
  - action: commit:lab-records-20261105
    disposition: not-applicable
    because: no statistic is computed or frozen in this commit; it records the lab's design
    by: lead (session 48c74063)
    at: "2026-11-05 06:00 UTC"
    inputs:
      - record: D278
        rev: 07ac35c141c54e21cf726150cd9670f0669f481aa8d4b15b10dbc1ceed4c153c
  - action: run:lab-1b
    disposition: not-applicable
    because: run:lab-1b computes no statistic a pre-registration freezes; it builds lab tooling
    by: lead (session 48c74063)
    at: "2026-11-05 06:21 UTC"
    inputs:
      - record: D278
        rev: 07ac35c141c54e21cf726150cd9670f0669f481aa8d4b15b10dbc1ceed4c153c
  - action: run:lab-1b-fix
    disposition: not-applicable
    because: >-
      run:lab-1b-fix computes no statistic and works under no pre-registration; it is the lab's own
      infrastructure
    by: lead (session 48c74063)
    at: "2026-11-05 07:02 UTC"
    inputs:
      - record: D278
        rev: 07ac35c141c54e21cf726150cd9670f0669f481aa8d4b15b10dbc1ceed4c153c
  - action: commit:lab-1b-records-20261105
    disposition: not-applicable
    because: no statistic is computed or frozen in this commit; it records lab infrastructure and its build
    by: lead (session 772be7be)
    at: "2026-11-05 16:54 UTC"
    inputs:
      - record: D278
        rev: 07ac35c141c54e21cf726150cd9670f0669f481aa8d4b15b10dbc1ceed4c153c
---

## History
- 2026-11-05 05:37 UTC lead (session 48c74063): created — D278 item 6: adopted from the user's review
- 2026-11-05 05:38 UTC lead (session 48c74063): review for run:lab-1a: not-applicable — run:lab-1a computes no statistic a pre-registration freezes; it builds lab tooling
- 2026-11-05 05:45 UTC lead (session 48c74063): reviewed D279@22eb7cdfc9f1; D279 read: the model ladder keeps the second implementer on GPT-6.1 Sol, high; P200 unchanged.
- 2026-11-05 05:59 UTC lead (session 48c74063): reviewed D280@e1c4e6a09f8a; D280 read: lists P200 among the records to commit; unchanged.
- 2026-11-05 06:00 UTC lead (session 48c74063): review for commit:lab-records-20261105: not-applicable — no statistic is computed or frozen in this commit; it records the lab's design
- 2026-11-05 06:21 UTC lead (session 48c74063): review for run:lab-1b: not-applicable — run:lab-1b computes no statistic a pre-registration freezes; it builds lab tooling
- 2026-11-05 07:02 UTC lead (session 48c74063): review for run:lab-1b-fix: not-applicable — run:lab-1b-fix computes no statistic and works under no pre-registration; it is the lab's own infrastructure
- 2026-11-05 16:54 UTC lead (session 772be7be): review for commit:lab-1b-records-20261105: not-applicable — no statistic is computed or frozen in this commit; it records lab infrastructure and its build
