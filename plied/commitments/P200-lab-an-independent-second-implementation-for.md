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
  - action: run:lab-1c
    disposition: not-applicable
    because: >-
      run:lab-1c computes no statistic and works under no pre-registration; it builds the lab's
      isolation layer
    by: lead (session 772be7be)
    at: "2026-11-05 16:58 UTC"
    inputs:
      - record: D278
        rev: 07ac35c141c54e21cf726150cd9670f0669f481aa8d4b15b10dbc1ceed4c153c
  - action: run:lab-1c-fix
    disposition: not-applicable
    because: >-
      run:lab-1c-fix computes no statistic and works under no pre-registration; it hardens the lab's
      isolation layer
    by: lead (session 772be7be)
    at: "2026-11-05 17:35 UTC"
    inputs:
      - record: D278
        rev: 07ac35c141c54e21cf726150cd9670f0669f481aa8d4b15b10dbc1ceed4c153c
  - action: run:lab-1c-fix2
    disposition: not-applicable
    because: run:lab-1c-fix2 computes no statistic and works under no pre-registration
    by: lead (session 772be7be)
    at: "2026-11-05 17:52 UTC"
    inputs:
      - record: D278
        rev: 07ac35c141c54e21cf726150cd9670f0669f481aa8d4b15b10dbc1ceed4c153c
  - action: run:lab-1c-fix3
    disposition: not-applicable
    because: >-
      No pre-registration freezes a statistic here; the follow-up builds the lab's container
      isolation (D291).
    by: lead (session 772be7be)
    at: "2026-11-05 18:02 UTC"
    inputs:
      - record: D291
        rev: 02d5b0a9caebf920b2e88f39a4a6e4135782d1bacd48b9fe106ded757faf9540
  - action: run:lab-1c-fix4
    disposition: not-applicable
    because: No pre-registration freezes a statistic; lab isolation code (D293).
    by: lead (session 772be7be)
    at: "2026-11-05 21:04 UTC"
    inputs:
      - record: D293
        rev: 7917c299322726c9edfc56e548e73b04f6e2dc532b2faa47018c32f645789c47
  - action: run:lab-2a
    disposition: not-applicable
    because: >-
      No pre-registration freezes a statistic; 2a sends every contract with second_implementation to
      the user as not yet supported, so nothing bypasses P200 (D296).
    by: lead (session 772be7be)
    at: "2026-11-05 21:12 UTC"
    inputs:
      - record: D296
        rev: 2a20f9f4f648c7594479973d065f00f070f3ccd680721a094a08087b152dbe21
  - action: run:lab-2a-fix1
    disposition: not-applicable
    because: >-
      No pre-registration freezes a statistic; second_implementation contracts stay asks marked not
      yet supported (D296, D297).
    by: lead (session 487510ed)
    at: "2026-11-05 22:08 UTC"
    inputs:
      - record: D297
        rev: e33106d3fa8a1ce0ec2ef77bd17ba08a7e90249beb7a1bc132f03286eca52074
  - action: run:lab-2b
    disposition: not-applicable
    because: >-
      No pre-registration freezes a statistic; second_implementation contracts stay asks marked not
      yet supported (D296, D300).
    by: lead (session 487510ed)
    at: "2026-11-05 22:21 UTC"
    inputs:
      - record: D300
        rev: d6bfb7a6d85a1d5d13f80c010edaef17ffa9baa09cbab4b1363cf46fd2e17b42
  - action: run:lab-2c-prep
    disposition: not-applicable
    because: No pre-registration and no frozen statistic; contracts with second_implementation stay asks (D302).
    by: lead (session 487510ed)
    at: "2026-11-05 23:13 UTC"
    inputs:
      - record: D302
        rev: 1aa559d7d917b1cf8363c627e9d718523699029d78f5d986a21cc2030e69f532
  - action: run:lab-2c-prep-fix1
    disposition: not-applicable
    because: No pre-registration or frozen statistic (D303).
    by: lead (session 487510ed)
    at: "2026-11-05 23:39 UTC"
    inputs:
      - record: D303
        rev: af28df3b4f7690c8904db184752b48575e8828b31cff3c10a1ff8a4a80e447d1
  - action: run:lab-probe-flag
    disposition: not-applicable
    because: no pre-registration and no frozen statistic; a meter-probe CLI flag
    by: lead (session 487510ed)
    at: "2026-11-06 02:59 UTC"
    inputs:
      - record: D278
        rev: 07ac35c141c54e21cf726150cd9670f0669f481aa8d4b15b10dbc1ceed4c153c
  - action: run:lab-probe-1
    disposition: not-applicable
    because: no pre-registration or frozen statistic; a meter probe
    by: lead (session 487510ed)
    at: "2026-11-06 03:04 UTC"
    inputs:
      - record: D278
        rev: 07ac35c141c54e21cf726150cd9670f0669f481aa8d4b15b10dbc1ceed4c153c
  - action: run:lab-test-fixture
    disposition: not-applicable
    because: no pre-registration or frozen statistic
    by: lead (session 487510ed)
    at: "2026-11-06 03:11 UTC"
    inputs:
      - record: D278
        rev: 07ac35c141c54e21cf726150cd9670f0669f481aa8d4b15b10dbc1ceed4c153c
  - action: run:lab-ui
    disposition: not-applicable
    because: no pre-registration or frozen statistic
    by: lead (session 487510ed)
    at: "2026-11-06 03:17 UTC"
    inputs:
      - record: D278
        rev: 07ac35c141c54e21cf726150cd9670f0669f481aa8d4b15b10dbc1ceed4c153c
  - action: run:lab-session-errors
    disposition: not-applicable
    because: no pre-registration or frozen statistic
    by: lead (session 487510ed)
    at: "2026-11-06 03:30 UTC"
    inputs:
      - record: D278
        rev: 07ac35c141c54e21cf726150cd9670f0669f481aa8d4b15b10dbc1ceed4c153c
  - action: run:lab-claude-schema
    disposition: not-applicable
    because: no pre-registration or frozen statistic
    by: lead (session 487510ed)
    at: "2026-11-06 03:38 UTC"
    inputs:
      - record: D278
        rev: 07ac35c141c54e21cf726150cd9670f0669f481aa8d4b15b10dbc1ceed4c153c
  - action: run:lab-packet-plied
    disposition: not-applicable
    because: no pre-registration or frozen statistic
    by: lead (session 487510ed)
    at: "2026-11-06 04:19 UTC"
    inputs:
      - record: D278
        rev: 07ac35c141c54e21cf726150cd9670f0669f481aa8d4b15b10dbc1ceed4c153c
  - action: run:lab-rehearsal
    disposition: not-applicable
    because: no pre-registration is frozen and no statistic is read; throwaway tasks only
    by: lead (session 487510ed)
    at: "2026-11-06 04:26 UTC"
    inputs:
      - record: D278
        rev: 07ac35c141c54e21cf726150cd9670f0669f481aa8d4b15b10dbc1ceed4c153c
  - action: run:lab-codex-plied
    disposition: not-applicable
    because: lab tooling only; no statistic a pre-registration freezes is computed
    by: lead (session 9871fd6b)
    at: "2026-11-07 05:17 UTC"
    inputs:
      - record: D278
        rev: 07ac35c141c54e21cf726150cd9670f0669f481aa8d4b15b10dbc1ceed4c153c
  - action: commit:partd-backfill-records-20261107
    disposition: not-applicable
    because: >-
      no statistic a pre-registration freezes is computed; the copied readers are frozen earlier
      work, byte-identical
    by: lead (session 9871fd6b)
    at: "2026-11-07 05:33 UTC"
    inputs:
      - record: D278
        rev: 07ac35c141c54e21cf726150cd9670f0669f481aa8d4b15b10dbc1ceed4c153c
      - record: D325
        rev: 7326260db82fda4cc885860de4618ee923614d23b6c81f286bed853e1ff5aaa9
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
- 2026-11-05 16:58 UTC lead (session 772be7be): review for run:lab-1c: not-applicable — run:lab-1c computes no statistic and works under no pre-registration; it builds the lab's isolation layer
- 2026-11-05 17:35 UTC lead (session 772be7be): review for run:lab-1c-fix: not-applicable — run:lab-1c-fix computes no statistic and works under no pre-registration; it hardens the lab's isolation layer
- 2026-11-05 17:52 UTC lead (session 772be7be): review for run:lab-1c-fix2: not-applicable — run:lab-1c-fix2 computes no statistic and works under no pre-registration
- 2026-11-05 18:02 UTC lead (session 772be7be): review for run:lab-1c-fix3: not-applicable — No pre-registration freezes a statistic here; the follow-up builds the lab's container isolation (D291).
- 2026-11-05 21:04 UTC lead (session 772be7be): review for run:lab-1c-fix4: not-applicable — No pre-registration freezes a statistic; lab isolation code (D293).
- 2026-11-05 21:12 UTC lead (session 772be7be): review for run:lab-2a: not-applicable — No pre-registration freezes a statistic; 2a sends every contract with second_implementation to the user as not yet supported, so nothing bypasses P200 (D296).
- 2026-11-05 22:08 UTC lead (session 487510ed): review for run:lab-2a-fix1: not-applicable — No pre-registration freezes a statistic; second_implementation contracts stay asks marked not yet supported (D296, D297).
- 2026-11-05 22:17 UTC lead (session 487510ed): reviewed D299@8e6a248061db; Reviewed against D299: it cites this commitment only for the follow-up-1 gate's not-applicable disposition (no real panel or pre-registration ran); status unchanged, open.
- 2026-11-05 22:21 UTC lead (session 487510ed): review for run:lab-2b: not-applicable — No pre-registration freezes a statistic; second_implementation contracts stay asks marked not yet supported (D296, D300).
- 2026-11-05 23:13 UTC lead (session 487510ed): review for run:lab-2c-prep: not-applicable — No pre-registration and no frozen statistic; contracts with second_implementation stay asks (D302).
- 2026-11-05 23:39 UTC lead (session 487510ed): review for run:lab-2c-prep-fix1: not-applicable — No pre-registration or frozen statistic (D303).
- 2026-11-06 02:59 UTC lead (session 487510ed): review for run:lab-probe-flag: not-applicable — no pre-registration and no frozen statistic; a meter-probe CLI flag
- 2026-11-06 03:04 UTC lead (session 487510ed): review for run:lab-probe-1: not-applicable — no pre-registration or frozen statistic; a meter probe
- 2026-11-06 03:11 UTC lead (session 487510ed): review for run:lab-test-fixture: not-applicable — no pre-registration or frozen statistic
- 2026-11-06 03:17 UTC lead (session 487510ed): review for run:lab-ui: not-applicable — no pre-registration or frozen statistic
- 2026-11-06 03:30 UTC lead (session 487510ed): review for run:lab-session-errors: not-applicable — no pre-registration or frozen statistic
- 2026-11-06 03:38 UTC lead (session 487510ed): review for run:lab-claude-schema: not-applicable — no pre-registration or frozen statistic
- 2026-11-06 04:19 UTC lead (session 487510ed): review for run:lab-packet-plied: not-applicable — no pre-registration or frozen statistic
- 2026-11-06 04:26 UTC lead (session 487510ed): review for run:lab-rehearsal: not-applicable — no pre-registration is frozen and no statistic is read; throwaway tasks only
- 2026-11-07 05:17 UTC lead (session 9871fd6b): review for run:lab-codex-plied: not-applicable — lab tooling only; no statistic a pre-registration freezes is computed
- 2026-11-07 05:33 UTC lead (session 9871fd6b): review for commit:partd-backfill-records-20261107: not-applicable — no statistic a pre-registration freezes is computed; the copied readers are frozen earlier work, byte-identical
