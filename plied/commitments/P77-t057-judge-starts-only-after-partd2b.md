---
id: P77
title: T057 judge starts only after partd2b-read has finished; src/sim unchanged until both arms end
wording: >-
  The src/sim tree must not change between launch and the end of both arms ... only after
  partd2b-read has finished
made: D191
state: superseded
nodes: [T057]
resolved_by: D192
superseded_by: P79
---

## History
- 2026-10-30 04:42 UTC lead (session 9aa22476): created
- 2026-10-30 04:43 UTC lead (session 9aa22476): set wording=The src/sim tree must not change between launch and the end of both arms ... … — quote both clauses of D191's run condition, in record order
- 2026-10-30 04:48 UTC lead (session 9aa22476): set state=superseded; set superseded_by=P79; set resolved_by=D192 — D192 (user): run on a box now; the src/sim clause is kept in P79, adapted to the box; the wait for partd2b-read is dropped
