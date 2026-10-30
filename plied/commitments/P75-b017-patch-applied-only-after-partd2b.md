---
id: P75
title: B017 patch applied only after partd2b-read and capfiles finish
wording: the patch is applied only after run partd2b-read and the paused capfiles stage have finished
made: D190
state: open
nodes: [T046]
---

## History
- 2026-10-30 04:38 UTC lead (session d2c88fa6): created — D190 item 1: timing of applying B017's patch
- 2026-10-30 04:44 UTC lead (session 9aa22476): reviewed D191: it names P75 only to say the src/sim tree stays unchanged during the judge, as P75 already holds B017's patch back; P75 is unaffected
- 2026-10-30 05:36 UTC lead (session 9d2b15e6): reviewed D194: run partd2b-read finished at 05:29 UTC (D194); the paused capfiles stage resumed at 05:30 (partd2-capfiles-20261030T053011Z) and is still running, so the patch condition is half met. Open.
- 2026-10-30 17:29 UTC lead (session 9d2b15e6): partd2b-read finished 05:29 UTC (D194) and capfiles exited 0 at ≈ 12:36 UTC (partd2-capfiles-20261030T053011Z): both conditions for applying the B017 patch now hold. Not applied by this session; P75 stays open until the patch is applied.
