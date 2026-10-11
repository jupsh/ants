# Encounters, stops and aggregation in *Lasius niger* — source values for Plan 4 option B

**Role: parameter and structure sources** (user decision 2026-10-10 night;
STATUS contamination log). Both papers read in full on 2026-10-10 (PDFs
supplied by the user, not in the repo), so none of their results can serve
as a test. Held-out and unread, not used here: Depickère et al. 2008 and
Mailleux, Sempo et al. 2011 (in-nest spatial organisation under
starvation).

## Depickère, Fresneau & Deneubourg 2004 — *Insect. Soc.* 51:81–90

doi:10.1007/s00040-003-0719-8. "Dynamics of aggregation in *Lasius niger*
(Formicidae): influence of polyethism".

### Set-up
- Four colonies (500–1000 workers), Brussels; tube nests; reared at
  23 ± 1 °C, 12 h photoperiod, fed three times a week (**not starved**).
  Experimental temperature not reported.
- Arena: PVC ring 19.8 cm diameter, 2 cm high, on black paper, inner edge
  Fluon-coated; dark cylinder and cover; lit by a 15 W "black chamber
  bulb" through a hole in the cover. Filmed 90 min.
- Groups of 20 ants dropped at the centre: brood-tenders (taken near the
  brood inside the nest; n = 24), foragers (taken outside the nest; n =
  12), mixed 10 + 10 (n = 13), 10 brood-tenders (n = 12).
- Aggregated: two or more ants at rest within 1 cm thorax to thorax (an
  ant moving a few mm away and back has not left).
- Individual analysis: lifetimes of moving paths ending in a spontaneous
  stop; times spent in stops by stop size; duo break-ups; speed from 80
  paths of 3 s (40 per caste, two experiments). Video precision 0.04 s.

### Structure (their individual model, Fig. 1; validated at the collective level)
- A walking ant that **encounters** another **stops with probability 1**
  (stated as the model assumption, "the probability of stopping by
  encounter is always equal to 1").
- A walking ant also **stops spontaneously** at a constant rate pS (paths
  ending in a spontaneous stop have exponential lifetimes).
- A stopped ant **leaves** at a constant hazard that depends on the number
  of ants in the stop N (N = 1 for a spontaneous stop): **pL = a·N^−b**
  (exponential stop durations for each N; Fig. 6A).
- On leaving it may change direction; if the next cell is occupied it stops
  again.
- Ants do not change these rates when the castes are mixed (mixed-duo
  break rate ≈ sum of the two castes' leaving rates).

### Values (per individual; units s⁻¹ unless noted)

| | foragers | brood-tenders | source |
|---|---|---|---|
| spontaneous stop pS | 0.08 | 0.11 | text, p. 86 (n.s. difference) |
| leaving a stop pL = a·N^−b | a 3.9, b 1.36 | a 0.4, b 1.16 | Fig. 6A (N = 1…4 foragers, 1…6 brood-tenders) |
| → lone stop (N = 1) mean | 0.26 s | 2.5 s | from the fits |
| leaving a duo (individual) | 1.75 | 0.14 | text, p. 87 (fit: 1.52 / 0.18) |
| duo break (arrival or leaving) | 3.72 (n 148) | 0.38 (n 108) | text and Fig. 6B, C |
| mixed duo break | 1.70 (n 97); predicted 1.89 | | Fig. 6D |
| moving speed (3-s paths) | 3.67 ± 1.48 cm/s | 2.91 ± 0.96 cm/s | text, p. 86 (n 40 each) |

- Paths to a spontaneous stop analysed: 49 (foragers), 18 (brood-tenders).
- The duo break rates are pair rates, as in Buffin's trophallaxis: a
  break by either ant (or an arrival). Individual leaving ≈ half.
- "A brood-tender remains stationary ten times longer than a forager."

### Seen but not used (collective results; recorded as seen)
- Aggregated fractions at 90 min: brood-tenders 0.68 ± 0.16, foragers
  0.33 ± 0.15, mixed 0.36 ± 0.12. Biggest cluster ≈ 50 % (brood-tenders),
  15–20 % (foragers, mixed). Strong wall-following: ≈ 90 % / 60 % in the
  outer 2 cm ring. Ring densities 0.10–0.15 ants/cm².

## Nicolis, Theraulaz & Deneubourg 2005 — *Anim. Behav.* 69:535–540

doi:10.1016/j.anbehav.2004.06.007. "The effect of aggregates on interaction
rate in ant colonies".

### Set-up
- Circular arena 30 cm diameter, 25 °C, 40 W light. Ants from earth banks
  on the ULB campus, **starved 4 days**, brought from the nest to the arena;
  measured from 2 h on (quasi steady state), 45 min per run.
- Densities 0.03, 0.07, 0.22 ants/cm². Aggregate: ants at rest within
  5 mm. Counts in four 9-cm circles during four 2-min windows.

### Values
- **Aggregate lifetimes exponential.** At 0.07 /cm²: dimers 0.272 s (fit
  132 e^(−3.68 t)), trimers 0.745 s (fit 26.7 e^(−1.34 t)); "statistically
  indistinguishable" at the other densities. Fig. 3 uses k2,exp = 1.881 /s
  (0.53 s) and k3,exp = 0.833 /s (1.2 s): **the paper's two sets of
  numbers disagree by ≈ 2×**; both recorded.
- Speed **including pauses**: 2.56 cm/s (mean distance of 20 ants over
  1 min). Body length 0.3 cm.
- An encounter is effective when the sensory organs are within 0.5 cm
  (citing Depickère et al. 2004, J. Insect Behav. 17:81–97, not read).
- Encounter efficiency q = 1/2: **assumed**, not measured.
- Rate constants (derived from v and size, with q): k11 = 1.08 cm²/s,
  k12 = 0.768 cm²/s.

### Structure
- Only lone ants move; aggregates are immobile and decay one ant at a
  time; mass-action encounters. The interaction rate is subquadratic in
  density because encounters take time, not because ants regulate them.

## How they bear on our model (Plan 4 option B)

- **Structure (Depickère):** stop on encounter (p = 1), spontaneous stops
  at pS, leaving a stop at a·N^−b. This replaces the provisional
  `activeToRest` / `restToActive` placeholders with sourced values, and
  replaces "walk slowly" (the fitted `nestSpeedFactor` 0.03–0.044, i.e.
  ≈ 1–1.6 mm/s) with "walk at a sourced speed and stop often". Every
  sourced speed (2.6–3.7 cm/s) is 20–35× the pilots' fitted in-nest speed.
- **Encounter durations:** forager pairs part in ≈ 0.3–0.6 s, brood-tender
  pairs in ≈ 2.6 s; Nicolis's 4-d-starved field ants ≈ 0.3–0.5 s. Most
  encounters are much shorter than our 1999 contact rule (≥ 1 s), which
  counts overlaps. Under B the observer counts encounters.
- **Differences to keep in mind:** open lit arenas outside the nest, not a
  dark nest chamber; Depickère's ants not starved, Nicolis's 4 d; densities
  0.03–0.22 /cm², an order below E6's ≈ 2.3 /cm²; the pL(N) fits cover
  N ≤ 4–6; no temperature for Depickère; brood-tenders vs foragers is age
  polyethism, which our nestmates do not carry.
