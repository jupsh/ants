---
id: P49
title: >-
  Q03 recheck: starts, seeds, window and criteria frozen first; done before Stage 2a; a C2 pass is
  not proof for every member
wording: >-
  Freeze the compared starts, paired seeds, late observation window and equivalence criteria before
  running the check. Complete it before Stage 2a. A common initialization does not guarantee common
  bias across mechanisms. A C2 pass also should not be described as proof of convergence for every
  new member.
summary: The recheck that P02 asks for.
made: D159
state: fulfilled
nodes: [T015, T033]
resolved_by: D163
links: [D160, D161, D162, D163]
reviews:
  - action: run:q03-recheck-20261025
    disposition: satisfied
    because: >-
      Starts, seeds (logs/q03/seeds.json md5 7e07d8c0), windows and criteria frozen in D162 with
      runner and reader md5s before any run; Stage 2a has not started.
    by: lead (session 421f3ea4)
    at: "2026-10-25 16:55 UTC"
---

## History
- 2026-10-25 04:19 UTC lead (session 0bcdd30b): created
- 2026-10-25 04:22 UTC lead (session 0bcdd30b): added D160 to links — D160 proposes the frozen starts, paired seeds, late window and equivalence criteria, and limits a pass to C2 base
- 2026-10-25 16:45 UTC lead (session 421f3ea4): added D161 to links — D161 approves D160 as amended: the frozen starts, seeds, windows and criteria P49 asks for
- 2026-10-25 16:54 UTC lead (session 421f3ea4): added D162 to links — D162 freezes the starts, seeds, windows and criteria D161 approved
- 2026-10-25 16:55 UTC lead (session 421f3ea4): review for run:q03-recheck-20261025: satisfied — Starts, seeds (logs/q03/seeds.json md5 7e07d8c0), windows and criteria frozen in D162 with runner and reader md5s before any run; Stage 2a has not started.
- 2026-10-25 18:11 UTC lead (session fe835760): set state=fulfilled; set resolved_by=D163; added D163 to links — frozen first (D162), run and read before Stage 2a (D163); the 'not proof for every member' limit continues in P54 on T033
