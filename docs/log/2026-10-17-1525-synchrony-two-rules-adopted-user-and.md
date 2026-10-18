---
id: D015
date: 2026-10-17
time: 15:25
kind: decision
title: Synchrony: two rules adopted (user) and comparison X (cross-colony synchrony) designed before building
---
**2026-10-17 ≈ 15:25 UTC — Synchrony: two rules adopted (user) and
comparison X (cross-colony synchrony) designed before building.** User
agreed (≈ 15:24) that synchrony is not a step-5 blocker as such, with a
sensitivity gate in step 5 and a blocker before the structure freeze for
held-out tests (both now in Rules in force, under Contacts), and asked
for a check that separates shared external drivers from within-nest
coupling.
- **Metadata (looked at before the design; not a result):** the 22 fit
  colonies' PreTreatment recordings (24.0 h each, `info_dat.txt`, Unix
  times) include **7 simultaneous pairs**, each started minutes apart in
  different experimental systems ('box'): 020/112 (61/71), 215/213
  (92/102), 250/241 (51/52), 224/204 (71/61), 261/260 (62/52), 226/220
  (81/91), 265/276 (92/102); 8 further pairs overlap by < 20 h (adjacent
  days). Whether the systems share a room is not in the dataset README;
  the Stroeymeyt paper is not cleared (not looked up).
- **Recorder** (`scripts/scratch/xsyncData.ts`, data only, fit tracks):
  per tracked ant (nurse or forager, in the nest), per 5-s clock bin
  (floor(t / 5)), moving steps and steps (moving step as the rows:
  ≤ 3-frame gap, ≥ 0.6 mm/frame), as `ActivitySeries`.
- **Statistic** (`scripts/scratch/xsyncAgg.py`): an ant's deviation in a
  bin = its moving fraction minus its own mean in that 4-h clock block
  (blocks as `syncStats`: 06, 10, 14, 18, 22, 02 UTC), at bin widths 5 s,
  1 min (primary) and 10 min; a series = mean deviation over the ants of
  one random half of a colony detected in the bin. **r_within:** Pearson
  correlation between the two halves of one colony (100 random splits).
  **r_sim:** between a random half of A and a random half of B for the 7
  simultaneous pairs, on common clock bins (100 draws). **r_non (null):**
  the same for all clock-aligned pairs never recorded together (time of
  day, floor((t mod 86400) / w)); they share the light schedule and daily
  rhythm but not room events. The 8 partly overlapping pairs are left
  out. **External share E = (r_sim − r_non) / (r_within − r_non)**,
  r_within over the 14 colonies of the simultaneous pairs; bootstrap 2000
  over the 7 pairs (with their colonies' r_within) and, independently,
  over the non-simultaneous pairs (colony clustering of the null ignored,
  disclosed).
- **Reading, fixed now (1 min; 5 s and 10 min reported beside):**
  **mainly within-nest** if E's 95 % upper bound < 0.25; **mainly shared
  external** if E ≥ 0.5 and its lower bound > 0.25; otherwise
  **undetermined / mixed**, reported as such. Separately, r_sim − r_non
  with its CI says whether any shared external component exists.
  Supporting only: the cross-correlation of the two series of each
  simultaneous pair at lags −5 … +5 min (the systems' clocks may differ).
- **Limits, stated now:** different systems, possibly different rooms,
  so a "within-nest" result cannot exclude drivers local to one system
  (its camera, lighting, handling); a positive result shows drivers
  shared across systems. 7 pairs: the CI may well be too wide to decide.
  The data were inspected before (C-a, activity series): this is a
  diagnostic on development-role use of the fit colonies, not a fit
  target. Runs locally (fit tracks, minutes); no box.
- **Amended ≈ 15:26, before any output (tooling only):** the aggregator
  is `scripts/scratch/xsyncAgg.ts` (no numpy here; pure Python too slow
  at 5-s bins), method as above; splits from `RNG.stream(7301, colony,
  split)`, bootstrap `RNG.stream(7302, w)`. Pair classes are computed
  from the recordings' bin spans (≥ 20 h simultaneous, ≤ 0 never
  together).
