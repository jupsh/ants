---
id: D003
date: 2026-10-17
time: 13:14
kind: reading
title: C-a read: inconclusive by its own rule (the rule does not discriminate)
---
**2026-10-17 ≈ 13:14 UTC — C-a read: inconclusive by its own rule (the
rule does not discriminate).** Model control (start point, 22 colonies,
12 h light and dark, same `activitySeries.ts` / `caAgg.py`): autocorrelation
of colony moving fraction 0.34 / 0.20 / 0.15 / 0.07 / 0.03 at 1 / 2 / 3 / 5 /
10 min (data light 0.74 / 0.52 / 0.37 / 0.18 / 0.02), and the logged rule
fires at many lags in both phases for the control, which has no periodic
mechanism. So the rule, as written, passes noise; it cannot support
"periodic". Description only: the data's colony activity is far more
autocorrelated at 1–5 min (the synchrony again); its light bumps at 17–28
min (+0.06–0.07) are above the model's (≤ +0.03) but are not established
as periodicity. No periodic-burst (Temnothorax-type) mechanism is assumed
for *L. niger* from this; a stronger test (e.g. spectral peak against
colony-level surrogates) would need its own design if it matters later.
Comparisons L and O launched 13:13 UTC (`logs/lo/run-lo.sh`; code
checksums match; 572 reduced duplicates removed from the box's
`logs/short` first, each verified to have its `cs-` copy on the box and
locally).
Clock note: the 13:11 and 13:14 entries were first headed 13:15 and 13:20
(ahead of the clock) and corrected; the code comments and
`logs/lo/run-lo.sh` cite "≈ 13:15" for the 13:11 entry and are left as
they are so the box copies keep matching the local checksums.
