# *Lasius niger* — evidence base and validation targets (M1)

This file collects the empirical results the M1 model must reproduce, the
conditions under which they were measured, and what each one constrains.
"Fit" targets are used for calibration; "Validate" targets are withheld and
only used to test the calibrated model.

## Datasets in the repository

| Dataset | Source | Licence | Location |
|---|---|---|---|
| 345 trajectories of isolated foragers exploring a 0.5 × 0.5 m canvas at 5 inclines (0, π/9, π/6, π/4, π/3 rad), 26 °C, 50 % RH, 25 Hz, 69 ants per incline, tracks end at 0.2 m from the release point | Khuong et al. 2013, PLoS ONE 8:e76531, Datasets S1–S5 | CC BY 4.0 | `data/khuong2013/incline{1..5}.csv.gz` (columns: incline index, colony, °C, %RH, ant id, t s, x mm, y mm) |

## Experiments and targets

### E1 — Exploratory walking (Khuong et al. 2013) — Fit: inclines 0, π/6, π/3; Validate: π/9, π/4
- Setup: single workers released by brush at the arena centre; no trail laying
  during exploration (stated in the paper), passive footprint marking negligible.
- Observables (computed by the same code for data and simulation):
  moving-speed distribution, heading autocorrelation vs lag, mean squared
  displacement, time to exit the 0.2 m circle, alignment with the steepest
  line on inclines.
- Published findings: speed ≈ 3× lower on the π/3 incline; no effect of
  heading on speed; longer straight segments and preferential new headings
  along the steepest line on inclines (klinokinesis + geomenotaxis).
- Constrains: speed at 26 °C, rotational diffusion, slope effects.

### E2 — Food volume and the trail-laying decision (Mailleux, Deneubourg & Detrain 2000; 2005; 2009) — Fit
Full source extraction (equations verbatim, all tables, contradictions):
[`mailleux-rules.md`](mailleux-rules.md).

- Scouts finding droplets of 0.3, 0.7, 1, 3, 6 µL sucrose (2000; concentration
  unverified — the follow-ups used 0.6 M): for 3 and 6 µL
  (more than a crop holds), 90 % return immediately laying trail; for small
  droplets many scouts keep searching and return without laying trail.
- Rule: each forager has an individual "desired volume"; trail laying is
  triggered only if it can ingest that volume. The droplet volume changes the
  *proportion* of trail layers, not the *intensity* of marking.
- Desired volume is constant per individual across trips; 14 % of foragers
  never lay trail (Mailleux et al. 2005).
- Trail layers do not fill their crops completely and keep drinking from other
  sources on the way home (Mailleux et al. 2009). Drinking time is 65–94 s
  at an unlimited 3 µL drop (1999, 2006) and 51 ± 12 s for *all* scouts at a
  0.7 µL drop that runs out (2009). (An earlier version of these notes
  misread the 51 s as the drinking time of trail layers.)
- Constrains: distribution of desired volumes, crop capacity (max ingested
  1.8 µL, Mailleux et al. 2006),
  drinking rate, fraction of non-layers.

#### E2 details from open sources
**Mailleux et al. 1999** (Actes Coll. Insectes Soc. 12; colonies of 1000–2000
workers, 22 ± 3 °C, scouts drink a 3 µL drop of 0.6 M sucrose; mean ± SD):

| Starvation | find food (s) | drink (s) | % laying trail | gaster-contact fraction on return | return to nest (s) |
|---|---|---|---|---|---|
| 1 day | 39 ± 41 (n 68) | 65 ± 21 (n 63) | 85 % (n 67) | 0.11 ± 0.09 | 110 ± 69 |
| 4 days | 56 ± 66 | 88 ± 24 | 94 % | 0.14 ± 0.11 | 137 ± 86 |
| 8 days | 59 ± 64 | 93 ± 23 | 88 % | 0.13 ± 0.12 | 156 ± 129 |

Recruiter inside the nest (first recruiter, filmed 20 min):

| Starvation | stay in nest (s) | distance walked (cm) | contacts | total trophallaxis (s) | contacts before main trophallaxis |
|---|---|---|---|---|---|
| 1 day | 113 ± 57 | 9.1 ± 8.2 | 6.1 ± 4.8 | 57 ± 27 | 3 ± 3 |
| 4 days | 80 ± 26 | 5.9 ± 4.7 | 3.3 ± 1.9 | 66 ± 27 | 1 ± 1 |
| 8 days | 82 ± 43 | 5.4 ± 6.4 | 3.3 ± 3.2 | 56 ± 22 | 1 ± 2 |

Probability a contacted nestmate leaves the nest within 5 min: after a
trophallactic contact 44 / 56 / 86 %; after a non-trophallactic contact
69 / 89 / 93 % (1 / 4 / 8 days).

**Mailleux et al. 2009** (C. R. Biologies 332:500; 4-day-starved queenless
colonies, nest 20 × 25 × 0.5 cm, bridge to a 6 × 6 cm area; 0.7 µL drops of
0.6 M sucrose: one at the area centre, a second on the bridge 9 cm away,
offered on the way home; 63 scouts):
- Volume ingested: 0.47 ± 0.25 µL at the 1st drop, 0.28 ± 0.20 at the 2nd,
  0.75 ± 0.30 total. Fraction laying trail: 38 % after the 1st, 84 % overall.
- Drinking 51 ± 12 s at the 1st drop, 23 ± 11 s at the 2nd; time between
  drops 58 ± 33 s for ants already laying trail vs 134 ± 87 s for unsatisfied
  ants (which search around the first source); total 178 ± 83 s.
- Trail-laying intensity (gaster-contact fraction) 0.16 ± 0.07 before vs
  0.11 ± 0.08 after the 2nd drop; 10–20 % of scouts never lay trail.
- Their individual model: intake ΔV = 0.01 µL per second; per-second
  probability of leaving the food S(V) = ηΔV / (1 + e^{−η(V − Vc)}), which
  levels off at ηΔV ≈ 0.043 s⁻¹ (**not** 1). It is the hazard of a logistic
  distribution of desired volumes (centre Vc, scale 1/η). η = 4.3 µL⁻¹,
  Vc = 1 µL here (0.9 in 2003; 2006: η = 5, Vc = 0.64/0.86/0.90 at 1/4/8
  days). 90 % of ants that reach their threshold lay trail. The 2009 print
  has a sign typo (+η) and its text layer drops the Δ; 2003 and 2006 print
  −η. See `mailleux-rules.md` §1–3.
- Ingested volume ≈ 0.006 × drinking time + 0.15 µL (r_s = 0.46, N = 126);
  intake rate looks like an individual trait (2009).

#### E6 targets computed from the Bles et al. raw scans (`scripts/analyzeBles.ts`)
Mean ± SD over 5 colonies, from food introduction (minute 30) to minute 90:
events 98.4 ± 19.9 (paper: 99.0 ± 17.4 — our merging rule reproduces theirs);
T50 32.8 ± 3.4 min; participants 44.2 ± 1.6 of 50; Gini of per-ant event
counts 0.41 ± 0.03; participants with both donor and receiver roles
58 ± 13 %; global network efficiency 0.40 ± 0.04.

### E3 — Food quality modulates trail laying; collective choice (Beckers, Deneubourg & Goss 1993) — Fit (marking), Validate (choice)
- Foragers at 1 M sucrose lay 43 % more trail marks than at 0.05 or 0.1 M.
- Offered 1 M and 0.1 M together, colonies select the richer source — unless
  the trail to the 0.1 M source was already well developed when the 1 M source
  appeared.
- Trail laying per forager decreases over a recruitment episode.
- Mean lifetime of the trail pheromone: 47 min (behavioural estimate; requires
  an observation model, see "Pheromone model" in docs/STATUS.md).

### E4 — Crowding reduces pheromone deposition (Czaczkes, Grüter & Ratnieks 2013) — Validate
- 5.6-fold reduction in the number of ants depositing pheromone from least to
  most crowded conditions (trail width and ant number manipulated).
- After 10 encounters with nestmate-odour beads over 20 cm, foragers were 45 %
  less likely to deposit pheromone.

### E5 — Deposition depends on position along the route (Insect. Soc. 2024, doi:10.1007/s00040-024-00995-y) — Validate
- Up to 22× more pheromone within 10 cm of the food than near the nest; up to
  4× more next to a feeder 100 cm away than one 20 cm away. Ants do not attempt
  to correct erroneous trails.

### E6 — Food collection and sharing in the nest (Bles et al. 2022, Animals 12:2963) — Validate (primary M1 target)
- Setup: queenless, broodless sub-colonies of 50 workers (mean 53), nest
  connected by a 4 × 3 × 2 mm passage to a 61 × 49 × 2 mm foraging area;
  22 ± 3 °C, 60 ± 5 % RH; 4 days of starvation; then 3 mL of 1 M sucrose;
  filmed 90 min (30 min before food); trophallaxis scan-sampled every minute.
- Foragers defined as ants feeding ≥ 5 consecutive seconds at the source.
- Results (mean ± s.d., n = 5): 99.0 ± 17.4 trophallactic events;
  12.2 ± 1.9 foragers; ≈ 40 % of donated food is given by non-foragers;
  T50 of trophallactic events; Gini/Lorenz inequality of activity; network
  efficiency, betweenness, closeness, clustering.
- **How we use it**: their model is non-spatial (per-second give/receive
  probabilities θ, ϒ fitted per caste, dependent on crop content); ours is
  spatial and mechanistic (exchanges only on actual encounters, local
  perception). Their experimental results are a validation target we do not
  fit to, and their two-emergent-castes (TEC) model will be implemented as a
  baseline: our model should match the data at least as well as theirs.
  Their Table 1 rates (θF 1/9–1/11, θW 1/23–1/33, ϒF 1/9–1/60, ϒW 1/27–1/38
  per s) serve as priors/sanity checks.
- Mechanisms reported in the underlying studies: donors do not empty their
  crop; recipients do not fill up; flow can be bidirectional; foragers leave
  with partly full crops; probabilities of giving/receiving/leaving depend
  sigmoidally (weakly) on crop content (Greenwald et al. 2015, 2018).

### E7 — Traffic on alternative routes (Dussutour et al. 2004) — later
- With two bridges, low densities give a single trail; at high crowding a second
  trail forms before flow drops. Needs body-clearance/encounter mechanics.

### E8 — Trail + memory synergy (Czaczkes et al. 2011) — later
- Trail pheromone plus route memory increase walking speed by 25 % and
  straightness by 30 %, only when used together.

## Physiology and morphology
| Quantity | Value | Evidence |
|---|---|---|
| Body length | 4.1 ± 0.14 mm | Khuong et al. 2016 (measured) |
| Fresh mass | ≥ 2 mg (weak) | Bles et al. 2022: a 0.1 mg tag was "< 5 % of the average mass" |
| Crop load carried | > 1 mg | Bles et al. 2022: tag "< 10 % of the amount of food a worker carries" |
| Crop capacity | max ingested 1.8 µL | Mailleux et al. 2006 ("1.8 µl was the maximum ingested volume") |
| Drinking time | 65–94 s at an unlimited 3 µL drop; 51 ± 12 s at a 0.7 µL drop | Mailleux et al. 1999, 2006; 2009 |
| Sucrose acceptance | 0.1–2.5 M; intake efficiency maximal ≥ 1 M | Detrain & Prieur 2014 |

## Open evidence gaps (search priorities)
- Exact distribution of desired volumes (Mailleux 2000 full text).
- Trophallaxis durations and transfer rates in *L. niger* (Buffin et al.
  2011/2012; Mailleux et al.); Greenwald et al. 2018 data are for *Camponotus*.
- Water-loss rates and desiccation tolerance of *L. niger* workers.
- Recruitment time course to a single feeder under controlled conditions.
- Direct measurements of trail chemistry (decay) separate from behaviour.
