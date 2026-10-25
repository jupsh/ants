---
id: P32
title: "S2 audit: Monte Carlo criterion and budget frozen; unresolved if MC error could flip the gate"
wording: >-
  Freeze a Monte Carlo precision criterion and maximum budget before running. Report uncertainty in
  the null expectation; if it is large enough to affect the gate, report the verdict as unresolved.
  Do not add draws opportunistically until a preferred answer appears.
summary: 100 draws is an initial budget only.
made: D145
state: fulfilled
nodes: [T032]
resolved_by: D156
links: [D146, D147, D156]
reviews:
  - action: run:s2audit
    disposition: acting
    because: >-
      MC criterion and budget frozen in s2AuditGate.ts (D153: 200 resamples of stored draws, colony
      resamples fixed, 2 MC SE, 100 draws then one extension to 400); the extension runs only if the
      frozen reader prints extend (D154); null-expectation uncertainty reported.
    by: lead (session 0bcdd30b)
    at: "2026-10-25 03:56 UTC"
---

## History
- 2026-10-25 03:03 UTC lead (session 0bcdd30b): created
- 2026-10-25 03:06 UTC lead (session 0bcdd30b): added D146 to links — D146 (proposal, awaiting Q12) holds this commitment's concrete rule
- 2026-10-25 03:10 UTC lead (session 0bcdd30b): added D147 to links — D147 item 3 fixes how the MC error is measured (on each lower bound, 200 resamples)
- 2026-10-25 03:22 UTC lead (session 0bcdd30b): reviewed D148, D149: the MC rule is unchanged and not yet exercised (no null draw computed).
- 2026-10-25 03:30 UTC lead (session 0bcdd30b): reviewed D150: MC rule unchanged; no null on real files yet.
- 2026-10-25 03:43 UTC lead (session 0bcdd30b): reviewed D152, D153: the MC rule is in the frozen gate code (200 resamples of stored draws, 2 SE, 100 then one extension to 400); D153 fixes how the extension runs.
- 2026-10-25 03:56 UTC lead (session 0bcdd30b): review for run:s2audit: acting — MC criterion and budget frozen in s2AuditGate.ts (D153: 200 resamples of stored draws, colony resamples fixed, 2 MC SE, 100 draws then one extension to 400); the extension runs only if the frozen reader prints extend (D154); null-expectation uncertainty reported.
- 2026-10-25 03:58 UTC lead (session 0bcdd30b): reviewed D155: the run uses the frozen MC rule; extension only if the reader asks.
- 2026-10-25 04:03 UTC lead (session 0bcdd30b): set state=fulfilled; set resolved_by=D156; added D156 to links — MC SE of each lower bound reported (0.0003 each); both resolved at 100 draws, no extension, no added draws (D156)
- 2026-10-25 04:10 UTC lead (session 0bcdd30b): reviewed D157: the MC result (both bounds resolved at 100 draws) is not touched by the J - A correction. Stays fulfilled.
- 2026-10-25 04:14 UTC lead (session 0bcdd30b): reviewed D158: it reuses the frozen S2 code for S2-J with 100 J draws per file; the S2 audit's MC result is untouched. Stays fulfilled.
