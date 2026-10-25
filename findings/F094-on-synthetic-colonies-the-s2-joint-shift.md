---
id: F094
title: On synthetic colonies, the S2 joint-shift null J removes place–activity artefacts (moving paths, stable rest sites) and a homogeneous shared driver (S2_J within ±0.002) and recovers planted local spatial dependence at 97–100 % for latent bout lengths 2–30 bins, but passes a spatially structured shared driver as decay (S2_J ≈ 0.16), so S2_J > 0 names no mechanism
topic: synchrony
status: indicated
date: 2026-10-25
data: simulation only (synthetic colonies, D148 / D151 generator)
evidence: docs/log/2026-10-25-0341-s2-audit-synthetic-checks-read-d148-d151.md
bears_on: reading of the S2 audit (T032) and whether S2 can be Stages 1–3's main spatial row
related: F065, F067
supersedes:
superseded_by:
depends:
---
24 synthetic colonies per case, 100 J draws each (D152). V1a 0.0002 [−0.0004, 0.0009], V1b −0.0004, V3a −0.0005; V2 0.048
[0.045, 0.051] against a planted effect ≈ 0.05; V5 recovery 1.000 / 0.988 / 0.973 at b = 2 / 10 / 30 (lower bounds ≥ 0.966).
A colony-wide signal whose response varies over space gives S2_J 0.164 [0.150, 0.178]; spatially patterned noise leaves
≤ ≈ 0.006. Same-bin classing gives L 0.209 (V1a) and 0.370 (V1b); reference classing gives −0.002 and −0.015, so it greatly
reduced both artefacts (point estimates, no interval: not shown equivalent to zero; corrected 2026-10-25, D154). Caveats: the generator is far more active than real colonies (D148); fixed homes, 80 ants.
