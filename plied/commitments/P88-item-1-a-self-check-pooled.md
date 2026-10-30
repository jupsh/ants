---
id: P88
title: "Item 1(a) self-check: pooled values equal D194's before anything is read"
wording: >-
  the pooled data and arm values at all ants 10 min must equal D194's … to the printed precision. If
  not, nothing is read and the cause is logged.
made: D207
state: fulfilled
nodes: [T033]
resolved_by: D210
reviews:
  - action: run:partdblocks-2
    disposition: acting
    because: >-
      recorded after this run's gate passed; the run only writes blocks.json, and the reading opens
      with this self-check against D194's values before anything else in the file is read
    by: lead (session 20261030)
    at: "2026-10-30 21:23 UTC"
    inputs:
      - record: D207
        rev: 9a55da1c62b45147ecc27069e9c2373aa6a0813e34155338fc0296b3db5c4202
  - action: run:partdblocks-3
    disposition: acting
    because: >-
      the reading opens with the self-check against read.json and D194; if it fails again nothing is
      read and the cause is logged
    by: lead (session 20261030)
    at: "2026-10-30 21:33 UTC"
    inputs:
      - record: D207
        rev: 8ba0cb4f72b4208a701139a480d5c5be0d67b3e8f9ff83864a421d081410fcfd
  - action: run:partdblocks-2
    disposition: satisfied
    because: >-
      the self-check ran first and failed (data pooled 6.3191 against 6.2762); nothing else was read
      and the cause is logged in D207 amendment 2
    by: lead (session 20261030)
    at: "2026-10-30 21:34 UTC"
    inputs:
      - record: D207
        rev: 8ba0cb4f72b4208a701139a480d5c5be0d67b3e8f9ff83864a421d081410fcfd
  - action: run:partdblocks-4
    disposition: acting
    because: >-
      the reading opens with the self-check against read.json and D194; if it fails again nothing is
      read and the cause is logged
    by: lead (session 20261030)
    at: "2026-10-30 21:45 UTC"
    inputs:
      - record: D207
        rev: 72fe3a177216140b402fbd9675c64f8d4de2d198d87f23f2a0855df7473103ed
  - action: run:partdblocks-2
    disposition: satisfied
    because: >-
      re-read after D207 amendment 3: this run's output failed P88's self-check and was set aside
      unread; superseded by run:partdblocks-4
    by: lead (session 20261030)
    at: "2026-10-30 21:46 UTC"
    inputs:
      - record: D207
        rev: 72fe3a177216140b402fbd9675c64f8d4de2d198d87f23f2a0855df7473103ed
  - action: run:partdblocks-3
    disposition: satisfied
    because: >-
      re-read after D207 amendment 3: this run stopped on the block guard with no output; nothing
      was read; superseded by run:partdblocks-4
    by: lead (session 20261030)
    at: "2026-10-30 21:46 UTC"
    inputs:
      - record: D207
        rev: 72fe3a177216140b402fbd9675c64f8d4de2d198d87f23f2a0855df7473103ed
---

## History
- 2026-10-30 21:23 UTC lead (session 20261030): created — D207's self-check is a precondition on reading blocks.json
- 2026-10-30 21:23 UTC lead (session 20261030): review for run:partdblocks-2: acting — recorded after this run's gate passed; the run only writes blocks.json, and the reading opens with this self-check against D194's values before anything else in the file is read
- 2026-10-30 21:33 UTC lead (session 20261030): review for run:partdblocks-3: acting — the reading opens with the self-check against read.json and D194; if it fails again nothing is read and the cause is logged
- 2026-10-30 21:34 UTC lead (session 20261030): review for run:partdblocks-2: satisfied — the self-check ran first and failed (data pooled 6.3191 against 6.2762); nothing else was read and the cause is logged in D207 amendment 2
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks-4: acting — the reading opens with the self-check against read.json and D194; if it fails again nothing is read and the cause is logged
- 2026-10-30 21:46 UTC lead (session 20261030): review for run:partdblocks-2: satisfied — re-read after D207 amendment 3: this run's output failed P88's self-check and was set aside unread; superseded by run:partdblocks-4
- 2026-10-30 21:46 UTC lead (session 20261030): review for run:partdblocks-3: satisfied — re-read after D207 amendment 3: this run stopped on the block guard with no output; nothing was read; superseded by run:partdblocks-4
- 2026-10-30 21:57 UTC lead (session 20261030): set state=fulfilled; set resolved_by=D210 — D210: the self-check passed (all 13 pooled values equal read.json) before anything else was read
