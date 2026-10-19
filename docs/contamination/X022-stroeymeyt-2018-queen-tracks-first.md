---
id: X022
title: Stroeymeyt 2018 queen tracks, first analysis (B018)
date: 2026-10-19
role: fit (development use)
---
- **Stroeymeyt 2018 queen tracks, first analysis (B018) (2026-10-19 ≈ 17:01 UTC):** first analysis of the queen's
  positions, by the B018 agent (claude-opus-B018, handed B018 by the user) from 2026-10-18 16:16 UTC, logged
  late by the lead agent (D059 asked for it when the item ran). Data: the main experiment's PreTreatment tracking files
  of the 22 fit colonies (`data/stroeymeyt2018/main_experiment/original_data`), the same files as comparisons X, Y,
  P and Q; the queen's track was already read for density but never analysed. Seen: her detection coverage
  (0.61–1.00 of frames, always in the nest), her 24-h and hourly median positions, distances of still nurses to her,
  her hourly ranges (median 20.5 mm). Role unchanged: fit data in a development role. No age-experiment
  (held-out) or PostTreatment file was opened (checked in B018's `lib.ts` → `scripts/stroeymeytTracks.ts`).
  What it changes: queen-position statistics are now development, so they cannot serve as an untouched test.
