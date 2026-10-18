---
id: D016
date: 2026-10-17
time: 15:30
kind: reading
title: Comparison X read (15:25 rules): the colony synchrony is mainly within-nest; a small component is shared across simultaneously recorded systems
---
**2026-10-17 ≈ 15:30 UTC — Comparison X read (15:25 rules): the colony
synchrony is mainly within-nest; a small component is shared across
simultaneously recorded systems.** `logs/xsync/agg.txt`
(`xsyncAgg.ts`), recorder outputs `logs/xsync/data-c*.json` (22 fit
colonies). Pair classes from the data: 7 simultaneous pairs as listed,
216 never-together pairs.

| bin | r_within (halves, 14 col.) | r_sim | r_non (null) | r_sim − r_non | **E** |
|---|---|---|---|---|---|
| 5 s | 0.369 | 0.064 | 0.038 | +0.026 [+0.002, +0.054] | 0.079 [0.004, 0.169] |
| **1 min** | 0.519 | 0.101 | 0.060 | +0.042 [−0.000, +0.087] | **0.091 [−0.000, 0.197]** |
| 10 min | 0.566 | 0.176 | 0.113 | +0.063 [−0.026, +0.140] | 0.139 [−0.056, 0.311] |

- **Reading (1 min): E's upper bound 0.197 < 0.25 → mainly within-nest.**
  Halves of one colony co-move strongly (r 0.52 at 1 min); halves of two
  colonies recorded at the same time in different systems barely more
  than colonies recorded on different days at the same clock time. At 5
  s the shared excess excludes 0 (a small shared component exists —
  **tentative**, corrected ≈ 15:45: the null's bootstrap ignores that its
  216 pairs share colonies, so its CI is probably too narrow; the
  headline reading errs on the conservative side, this claim does not);
  at 10 min E is undetermined (CI −0.06 to 0.31).
- **Per pair (1 min):** 112/020 0.21 (strongest), 224/204 0.15, 250/241
  0.14, the other four 0.04–0.06. Supporting, full-colony cross-
  correlation at lags −5 … +5 min: 112/020, 250/241 and 261/260 peak at
  +1 to +3 min (B after A), 224/204 flat, 213/215, 226/220, 265/276 at
  or before 0 and small. Consistent with occasional shared events and
  clock offsets of a minute or two between systems; not read further.
- **What it leaves:** within-nest coupling between ants, **or** drivers
  local to one experimental system (its own camera, lighting, handling,
  vibration). It does not separate those. A system-wide position shift
  of resting tags was already excluded by check A (2026-10-16/17), so a
  pure camera artefact is unlikely, but box-level biological drivers are
  not excluded. Next discriminating check, proposed (not designed or
  run): synchrony against distance between ants within a colony (local
  coupling decays with distance; a box-level driver acts at all
  distances).
