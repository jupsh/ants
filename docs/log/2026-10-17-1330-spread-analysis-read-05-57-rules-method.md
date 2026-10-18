---
id: D005
date: 2026-10-17
time: 13:30
kind: reading
title: Spread analysis read (05:57 rules; method check first)
---
**2026-10-17 ≈ 13:30 UTC — Spread analysis read (05:57 rules; method
check first).** `logs/spread/`, `scratch/spreadAgg.py` (1000
permutations per episode; colony bootstrap).
- **Method check passes for false positives under that particular
  simulated shared signal** (softened 13:54, user): it does not exclude
  shared external causes generally — real disturbances could affect ants
  differently by location or state. Coupled oracle arms show
  no order beyond null 2 (ρ − null 2 −0.004 to +0.003, every CI spanning
  0, light and dark) and no test-B effect beyond the control's (MH risk
  ratio 0.92–0.93 vs control 0.91). Not tested: power to detect local
  spread (no arm with local, contact-based activation exists). Model
  episodes are long (≈ 21 participants, mean lag ≈ 36 s at every
  distance), so the gap-10 episode definition chains many onsets.
- **Test B (contacts predict onset): positive in the data, both phases.**
  Still ant contacted by a moving partner vs matched still ants (strata:
  distance to recent onset × colony onsets in the last 5 s): onset
  within 2 s, light **2.09 [1.97, 2.22]**, dark **2.18 [2.04, 2.35]**
  (crude 0.0190 vs 0.0076; 0.0152 vs 0.0058); model control 0.91 [0.89,
  0.94]. Per the reading: stronger evidence of a social contribution
  beyond distance and episode timing. **Open alternative, stated now:**
  an onset is a threshold crossing, so a push or jostle by the moving
  ant, or tag confusion when two tracked centres come close, could give
  the same signature without activation. The model's 0.91 shows its
  contacts do not trigger onsets (its only local channel is walk-on
  suppression by still contacts).
- **Test A (spatial order within episodes): weak.** Light: ρ +0.015
  [+0.005, +0.024]; above null 1 (+0.014 [+0.005, +0.023]) but not null 2
  (+0.009 [−0.000, +0.017]); partial +0.014 [+0.003, +0.028] → by the
  rule a *regional order*, not spread from the starting point. Dark: ρ
  +0.022 [+0.002, +0.054], above both nulls (+0.022, +0.021, CIs from
  +0.002), so the literal rule reads *spatially structured activation*;
  but the partial (usual earliness) is −0.021 [−0.102, +0.025] and the
  CI is lopsided, so it is not robust. Effect sizes are tiny either
  way. Description: mean lag after the initiator rises with distance in
  the data (light 12 → 18 s from < 5 mm to 20–40 mm, 25 s beyond 40 mm;
  dark 9 → 12 s, 18 s), flat in the model; data episodes are shorter
  (≈ 7 participants).
- **Summary:** synchrony is real and not reproduced; contact with a
  moving ant roughly doubles the chance of a movement onset in the data
  and not at all in the model; spatial ordering within episodes is weak
  at best. Nothing identifies what starts an episode. A check that
  separates activation from pushing (e.g. onset direction relative to
  the partner's motion, or requiring a sustained moving run after the
  onset) would need its own design.
