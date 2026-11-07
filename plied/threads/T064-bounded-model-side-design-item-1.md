---
id: T064
title: >-
  Bounded model-side design (item 1(e)): slow per-ant state (H2) and slower or spatially structured
  common driver (H1) judged against C1-C5 (D276)
parent: T023
status: open
next: 1
actor: lab
links:
  - D276
  - D275
  - D231
  - D205
  - F097
  - F103
  - F104
  - F105
  - F106
  - F107
  - F108
  - F109
  - F110
  - F113
  - F115
  - F116
---

## History
- 2026-11-05 05:19 UTC lead (session bd70e4eb): created
- 2026-11-05 05:37 UTC lead (session 48c74063): reviewed D278@07ac35c141c5; D278 (the user's review of the lab design) names T064 only as an example: its authority is a design brought back before implementation or runs, so a lab brief may not proceed on path rules alone. Nothing in T064 changes; it remains the other session's.
- 2026-11-05 05:59 UTC lead (session 48c74063): reviewed D280@e1c4e6a09f8a; D280 read: names T064 only because the lead's earlier note on it (D278) is part of this commit; nothing in T064 changes, and it remains the other session's.
- 2026-11-06 03:05 UTC lead (session 487510ed): set actor=lab — D306/D307: Claude gave a meter after the probe; T064 is the lab's first thread
- 2026-11-06 03:24 UTC lab (session lab-L000): ants-lab step L0001: asked
- 2026-11-06 03:37 UTC lab (session lab-L000): ants-lab step L0002: asked
- 2026-11-06 04:15 UTC lab (session lab-L000): ants-lab step L0003: done
- 2026-11-06 04:21 UTC lab (session lab-L000): ants-lab step L0004: asked
- 2026-11-07 05:16 UTC lead (session 9871fd6b): D322: ask L0004 answered (calibrate on the 1-min all-ants cell; rho, tau_L fixed from F108; rental later). Not frozen: the freeze waits on the lead's source check, the frozen readers reaching the lab's workspaces (T062) and a panel pre-review (needs Q42's fix). P188 holds until then.
- 2026-11-07 05:28 UTC lead (session 9871fd6b): D324: D322 condition 2 done in the tree (scripts/frozen/partd/, uncommitted); the readers call scratch paths, so the build must run them from a layout where those resolve
