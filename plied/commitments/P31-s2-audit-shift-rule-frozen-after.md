---
id: P31
title: "S2 audit: shift rule frozen after a recovery check, before any audit result"
wording: Test recovery under persistent signals and freeze the shift rule before inspecting audit results.
summary: >-
  The 30-210 rule is provisional; a synthetic recovery check under persistent signals precedes
  freezing it.
made: D145
state: fulfilled
nodes: [T032]
resolved_by: D152
links: [D146, D152]
---

## History
- 2026-10-25 03:03 UTC lead (session 0bcdd30b): created
- 2026-10-25 03:06 UTC lead (session 0bcdd30b): added D146 to links — D146 (proposal, awaiting Q12) holds this commitment's concrete rule
- 2026-10-25 03:11 UTC lead (session 0bcdd30b): reviewed D147: J is tested and frozen only if it passes V5 as tightened (lower bound >= 0.8); no fallback promotion (P36).
- 2026-10-25 03:30 UTC lead (session 0bcdd30b): reviewed D150: the shift rule J is unchanged; it is frozen only after V5 passes.
- 2026-10-25 03:42 UTC lead (session 0bcdd30b): set state=fulfilled; set resolved_by=D152; added D152 to links — V5 passed on the frozen synthetic checks before any audit result; J frozen as primary (D152)
- 2026-10-25 03:58 UTC lead (session 0bcdd30b): reviewed D154, D155: J ran as frozen; D154's correction (L_ref) does not touch the shift rule.
- 2026-10-25 04:03 UTC lead (session 0bcdd30b): reviewed D156: J ran as frozen. No change.
