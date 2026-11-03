---
id: D247
date: 2026-11-02
time: 05:46
kind: correction
title: S3 entry rule in the H6 build omits D212's observed condition (found in D245): a defect against D241's the D212 matching; fix commissioned before the freeze (D246)
---
- **2026-11-02 ≈ 05:46 UTC — S3 entry rule in the H6 build omits D212's observed condition (found in D245): a defect against D241's the D212 matching; fix commissioned before the freeze (D246).**
  - **The defect.** D241's S3 matches arrivals "on that zone's pre-arrival level and trend (the D212 matching)", and its
    entries from the arena follow D212's entry rule. D212 amendment 1 (D213) requires every event to be *observed*: "an
    ant is *observed* over an interval if its consecutive detections are at most 10 s (20 frames) apart throughout it
    and the last one is at most 10 s before the interval's end", and a forager entry needs "every detection in
    [f − 30 s, f) outside the nest, observed". The H6 extractor (`scripts/scratch/h6/extract.ts`, the arrivals in
    `ZonePass.frame`, about lines 354–357) records an entry when the ant's reads in the previous 30 s (at least one) were
    all outside the nest, with no condition on the gaps between them: an ant unseen for most of the window counts.
    Found by the implementer (build report, Deviations and doubts point 5) and recorded in D245; no S3 statistic has
    been computed, so nothing was read under the defective rule.
  - **Fix (D246):** the entry rule takes the observed condition as `absenceAt` in `scripts/scratch/triggersCore.ts`
    implements it; zone crossings (consecutive in-nest reads at most 3 frames apart) are unaffected. Brief to the
    implementer; the fix and its check are recorded with the build report.
