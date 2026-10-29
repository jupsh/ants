---
id: Q07
title: Adopt B013's proposal.patch
raised: B013
state: answered
nodes: [T045]
answered_by: D181
---
Draft label: Q7 (docs/threads-draft.md revision 2).

## History
- 2026-10-24 22:11 UTC lead (session 104e7640): created — migrated from docs/threads-draft.md revision 2 (D142)
- 2026-10-24 22:12 UTC lead (session 104e7640): set nodes=["T045"] — attached to its nodes (D142)
- 2026-10-26 03:36 UTC lead (session 0cf57b71): reviewed D170/D171: B013's roundtrip was regenerated under Stage 1 code: still a pass with identical observable hashes; serialised-state hashes changed because ColonySim gained fields (oracleG, oracle caches), which the patch's generic encoder picks up. Bears on adoption only as current evidence that the patch still round-trips; the decision is still the user's.
- 2026-10-29 20:05 UTC lead (session 7f762276): set state=answered; set answered_by=D181 — D181: user — defer adoption (no consumer), with the fixes listed for a later adoption
