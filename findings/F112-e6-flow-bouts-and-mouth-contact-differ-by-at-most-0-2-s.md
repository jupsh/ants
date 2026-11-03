---
id: F112
title: In the provisional spatial colony, flow-associated mouth contact outlasts positive flow by at most 0.2 s (mean 0.014 s over 630 bouts), below E6's 60-s scan, yet one of 60 colony/scan-phase comparisons gains one observed event; 84,437 no-flow mouth episodes are excluded and unscored
topic: measurement
status: indicated
date: 2026-11-02
data: simulated only (provisional spatial colony defaults, Bles apparatus, 3 diagnostic colonies); no E6 data
evidence: docs/log/2026-11-02-0559-b011-read-t043-codex-user-handed-in-the.md
bears_on: E6 measurement definition (step 9; T038)
related:
supersedes:
superseded_by:
depends: backlog/B011-e6-bout-end-vs-observed-contact/results/summary.json
---
B011 (codex-side agent, user-handed): every positive-flow bout (630, three colonies) sits in a distinct uncensored
mouth-contact episode; the extra contact is 0 s in 548 bouts, 0.1 s in 78 and 0.2 s in 4. Through the unchanged
`observeContacts`, 12,599 of 12,600 bout/phase pairs are identical; one gains a scan, moving one non-forager donor and
one receiver by one event-count bin (E6 has event-count, not duration, histograms). So the flow-based bout end is a
definitional mismatch with a small measured timing effect that can still cross a scan boundary. Limits: these
defaults only, not the step-5 candidate or another dt; three colonies; mouth episodes without flow (84,437) carry no
donor and are excluded, so how they would be scored is not established. A geometric contact recorder is proposed for
step 9, not adopted.
