---
id: T046
title: Pheromone field with a physical sampling footprint
parent: T044
status: open
backlog: B017
links: [F049, D189, D190]
---
Draft label: T6.2 (docs/threads-draft.md revision 2).

## History
- 2026-10-24 22:11 UTC lead (session 104e7640): created — migrated from docs/threads-draft.md revision 2 (D142)
- 2026-10-30 04:33 UTC lead (session d2c88fa6): reviewed B017 handoff and D188: patch checked by the lead (tsc, 6 tests, git apply --check, stamps current); F101 records the result; B017 passes B012's rule for a provisional, unsourced 0.5-mm sigma. Thread stays open: applying the patch and choosing a sigma are the user's; no question raised yet (no consumer of the field until the trail-response model). Patch unapplied at backlog/B017-pheromone-field-with-a-physical-sampling/proposal.patch.
- 2026-10-30 04:38 UTC lead (session d2c88fa6): set actor=lead; set next=3; added D189 to links; added D190 to links — D189 delegates the B017 questions to the lead; D190 decides: apply the patch (footprint off) after partd2b-read and capfiles finish (P75); no biological sigma until sourced (P76). Queued for the lead behind T033's runs.
- 2026-10-30 04:44 UTC lead (session 9aa22476): reviewed D191: it cites B017/T046 for one constraint, that src/sim is not changed while the T057 judge runs; P75 already delays the patch until Part D's runs end, and the T057 run is local and short, so the patch also waits for it (the lead schedules both). No change to T046's plan
- 2026-10-30 05:37 UTC lead (session 9d2b15e6): reviewed D194: it cites D190 and B017 only to say the B017 patch waits until capfiles finishes (P75); partd2b-read has finished and capfiles is running. T046's next step is unchanged.
- 2026-10-30 17:41 UTC lead (session 13dd4558): D195: B017 patch applied (footprint off, bit-identical, 13 results re-stamped, pages re-precomputed); P75 fulfilled. Remaining: nothing consumes the field until the trail-response model is designed; P76 (sigma sourced, grid cell <= sigma/2) still governs any trail-following result. Cleared next; nothing queued.
- 2026-10-30 17:42 UTC lead (session 13dd4558): cleared next; cleared actor — patch applied (D195); no further work until the trail-response model needs the field
