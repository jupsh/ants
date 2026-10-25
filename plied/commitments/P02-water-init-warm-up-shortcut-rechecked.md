---
id: P02
title: Water-init warm-up shortcut rechecked when walk-on rates change
wording: >-
  is accepted as a warm-up shortcut with explicit provenance, **provided the original and revised
  starts converge to the same late-window behaviour** (else it could hide slow adjustment),
  rechecked if walk-on rates or water parameters change
summary: >-
  Due: C1 and C2 changed walk-on rates (C2 drive SD 1.99 / 1.94, D080) and no later recheck was
  found. Covers every Stroeymeyt colony run (colonyStroeymeyt.ts: C1, C2, synchrony Parts B-D, the
  S2 audit base), not step 5 (D094).
made: A003
state: due
nodes: [T015]
links: [S001, D080, D094, D160]
---
Draft label: P2 (docs/threads-draft.md revision 2).

## History
- 2026-10-24 22:11 UTC lead (session 104e7640): created — migrated from docs/threads-draft.md revision 2 (D142)
- 2026-10-24 22:11 UTC lead (session 104e7640): set nodes=["T015"] — attached to its nodes (D142)
- 2026-10-25 00:31 UTC lead (session 7c2d50fd): D144 (T049 scan review) cites this record's links; reviewed, nothing here changes (the cited promises are covered or discharged as D144 lists)
- 2026-10-25 03:03 UTC lead (session 0bcdd30b): reviewed D145: it keeps P02 open and unwaived; the S2 audit discloses it as a limitation of the base comparison (P35). No change.
- 2026-10-25 03:11 UTC lead (session 0bcdd30b): reviewed D147: P02 stays disclosed and unwaived (P35). No change.
- 2026-10-25 03:57 UTC lead (session 0bcdd30b): reviewed D154: P02 stays unwaived and disclosed in the audit reading (P35). No change.
- 2026-10-25 04:03 UTC lead (session 0bcdd30b): reviewed D156: disclosed as an unwaived limitation of the S2 audit's base comparison. Still due; no change.
- 2026-10-25 04:14 UTC lead (session 0bcdd30b): reviewed D158: it proposes that Q03 (this recheck) be decided before Stage 2a, because every redesign member shares the water-init start. P02 stays due.
- 2026-10-25 04:20 UTC lead (session 0bcdd30b): reviewed D159: Q03 is answered 'recheck, not waive' (item 4); T015 is now open to design and run the recheck at C2 settings before Stage 2a. P02 stays due until that reading.
- 2026-10-25 04:22 UTC lead (session 0bcdd30b): added D160 to links — D160 is the proposed recheck: original vs revised starts at C2 settings, 22 colonies, paired seeds, late window 14-20 h
- 2026-10-25 16:45 UTC lead (session 421f3ea4): reviewed D161: it approves D160 as amended, so the recheck P02 asks for is now designed; P02 stays due until the recheck is read (T015). It also corrects D160's account of A003's multi-seed check, which P02's made record holds.
