# Resting sites, aggregation and spatial structure in the nest — source notes

Roles (STATUS 2026-10-18 ≈ 15:52, contamination log and Decisions log): the
three *L. niger* Depickère papers are **parameter and structure sources**
(read in full, never a test). The rest are **development, other species**
(hypotheses, test design, analysis methods; no parameter imported).
Held-out and unread, not used here: Depickère et al. 2008 and Mailleux,
Sempo et al. 2011 (in-nest spatial organisation under starvation). The
earlier sources (Depickère, Fresneau & Deneubourg 2004, Insect. Soc.;
Nicolis et al. 2005) are in `encounters-aggregation.md`.

What was read: Lenoir & Ataya 1983 (from page images), the three Depickère papers, Amé et al. 2006 and Jeanson et
al. 2005 in full (Jeanson's appendix and tables 1–2 only in passing). Boi
et al. 1999: model set-up, results and discussion. The others: abstract
and the passages found by searching (`rg`) for the questions below.

## *L. niger* (Depickère and colleagues, Brussels)

### Depickère, Fresneau & Deneubourg 2004, *J. Insect Behav.* 17:81–97
"A basis for spatial and social patterns in ant species: dynamics and
mechanisms of aggregation" (J. Insect Behav. 17(1); not the Insect. Soc.
paper of the same year, doi:10.1007/s00040-003-0719-8).

- **Set-up:** brood-tenders (taken near the brood) in a 98.2 cm² ring
  (between 10 and 15 cm Petri dishes), Fluon edges, wet cotton (humidity),
  **red transparent cover** + dark-chamber bulb, 90 min. 10 / 25 / 50 /
  100 ants = 0.10 / 0.25 / 0.51 / 1.02 per cm² (said to match natural
  nests, Rasse & Deneubourg 2001). 20 runs per density (23 at 25).
  Aggregated: thorax-to-thorax < 1 cm (ants stepping a few mm out and back
  stay aggregated). A different set-up from the Insect. Soc. paper (19.8 cm
  ring, 20 ants), so the experiments do not overlap.
- **Individual rules** (from the 10-ant runs): stop on encounter with
  probability 1; spontaneous stop pS **0.2354 /s**, spontaneous U-turn
  pU **0.1256 /s** (moving bouts exponential, total 0.361 /s; 75 stops,
  40 U-turns); leaving a stop of A ants pL = a·A^−b with **a 0.35 /s, b
  2.125** (exponential stop durations at each A; fit over 8 sizes).
  Speed 2.45 ± 0.69 cm/s (40 paths of 3 s).
  - Compare the Insect. Soc. paper (19.8-cm ring, 20 ants, also red
    light): brood-tenders pS 0.11, a 0.4, b 1.16. Same lab and caste,
    exponent nearly doubled and pS doubled; the source of the difference
    is not discussed.
- **Their model:** 3-mm cells (so one ant per cell — a body-exclusion
  lattice), eight directions, at most 8 neighbours counted in pL.
- **Collective (seen; source, not test):** aggregated fraction ≈ 80 % by
  10 min; one main cluster with 60–70 % of the ants at 90 min, its fraction
  independent of density over 0.1–1 /cm²; more satellite clusters at
  higher density (3 → 10). Cluster area ∝ size^0.6, so **density inside a
  cluster rises with its size**. Main-cluster centroid steadies with time
  (80 mm jumps early, ≈ 20 mm at the end); small clusters unstable, large
  ones stable. Centroids uniform over the ring (no external cue).
  **10–15 % of ants stay unaggregated at every density** ("some
  individuals could specialize in moving between groups").
- **Interpretation offered:** amplification through resting time (the
  bigger the cluster, the longer an ant stays), negative feedback from
  depletion of free ants (local activation, long-range inhibition). In
  dense clusters "movements become more difficult and therefore contacts
  with ants besides those of immediate vicinity ... are reduced".
  Model–data mismatch (faster growth in the model at 10 and 25 ants)
  attributed to unmodelled ground marking. Clusters of *L. niger* are
  known near nest entrances.

### Depickère, Fresneau, Detrain & Deneubourg 2004, *Insect. Soc.* 51:243–246
"Marking as a decision factor in the choice of a new resting site".
doi:10.1007/s00040-004-0739-z.

- Queenless colonies with brood, 26 °C, 12 h photoperiod.
- **Two shelters:** 20 ants, two glass tubes, 100 W light. Two clean tubes:
  one wins at random (4 left, 4 right), slowly (winner 1.8 → 7.2 ants from
  5 to 60 min). One clean vs one marked (left two days in the rearing box
  near the nest entrance): the marked tube wins at once (6.7 at 5 min, 8.2
  at 60 min) and in 8 runs holds a stable cluster.
  **Final numbers equal** in the two conditions.
- **Ring memory test** (98.2 cm² ring, red light, brood-tenders): 50 ants
  for 90 min → one cluster over 2 of 18 sectors with 76 ± 15 %; removed,
  ring turned 90°, 25 fresh ants → one cluster with 75 ± 11 %, overlapping
  the first cluster's sectors in 7 of 11 runs (p ≈ 0.0006 by chance).
- **Conclusion:** passive ground marking (probably tarsal cuticular
  hydrocarbons) fixes **where** the cluster forms and speeds aggregation;
  it does **not** change **how many** ants aggregate. Proposed as a
  long-term external memory of the resting place. The role of the queen
  vs marking is named as open.

### Depickère, Fresneau & Deneubourg 2004, *J. Insect Physiol.* 50:629–635
"The influence of red light on the aggregation of two castes".
doi:10.1016/j.jinsphys.2004.04.009.

- Two colonies (500–1000 workers + brood), 23 °C, 12 h photoperiod; tube
  nests under red filter paper (Lee 106). Arena: 19.8 cm PVC ring (the
  Insect. Soc. set-up), 20 ants, 6 runs per caste × condition. Red light:
  15 W dark-chamber bulb (625–700 nm, 5 lux). Darkness runs: 90 min dark,
  then 90 min red light.
- **Brood-tenders aggregate in both:** ≈ 90 % aggregated, main cluster ≈
  80 %, in red light and in darkness. Switching red light on disperses
  them (40 %), then they re-aggregate (60 % main cluster by 180 min).
- **Foragers depend on light:** red light ≈ 40 % aggregated, biggest
  cluster ≈ 20 %, no spatial stability (centroid jumps 90–120 mm);
  **total darkness ≈ 80 % aggregated, main cluster ≈ 60 %**, centroid
  steadying (30 mm). Switching red light on drops them back at once (40 %
  within 15 min). Foragers in darkness ≈ brood-tenders in red light,
  except in spatial stability (lower for foragers).
- Dispersal starts within a minute of lighting, before the lamp warms the
  arena by 0.1 °C (plateau +3.5 °C at 60 min): wavelength, not heat.
- Main cluster at the wall in red light (all runs), less so in darkness
  (4 of 6 brood-tender runs): wall-following stronger in light.
- In the dark → red switch, brood-tenders re-cluster where the dark
  cluster was (marking again).
- **Discussion:** brood is clustered where the environment suits it
  (humidity, temperature); brood-tenders stay near it. Older ants (more
  phototactic) may sit nearest the entrance and leave first; light
  disperses foragers.

### Lenoir & Ataya 1983, *Z. Tierpsychol.* 63:213–232
"Polyéthisme et répartition des niveaux d'activité chez la fourmi *Lasius niger* L." Role: development (confirmed
2026-10-16). A scan without a text layer; read from page images 2026-10-18 (pp. 1–18; 19–20 are references).
- **Set-up:** 5 young colonies (1 queen, brood, 29–59 workers; 225 marked ants), an artificial nest with **one humid
  chamber holding the queen and the brood** (zone 1) and three outer zones (food in zone 4); chambers 0.5 cm high.
  Fed to satiety (honey, a cricket, daily). Scan sampling once a minute, 3 × 5 × 30 min per colony (7.5 h), plus
  tests (necrophoric, brood retrieval, exploration, defence, unblocking the entrance, brood displacement); 25–30 h
  per colony. 24 behaviours per ant, correspondence analysis.
- **Groups:** nurses 42 % (34–52 %), true foragers 16 % (7–26 %), the rest a **reserve** of intermediate workers.
  Outside workers split into polyvalent foragers, material carriers and explorers. The queen falls among the
  intermediate inside workers, rarely nursing or receiving.
- **Activity levels:** per task, a few hyperactive ants do most of the work (≤ 25 % of ants do up to 95 % of a
  task; rank curves exponential). **Total activity per ant is log-normal** (score 1–501, a 500-fold range;
  χ² p 0.30), 23 % hyperactive, 49 % hypoactive. **Nurses are the more immobile** (73 % of nurses in the lowest
  class); foragers the most active (83 % of polyvalent foragers hyperactive).
- **Brood placement responds to the micro-environment:** focusing the diffuse light on the brood zone for 10 min
  makes workers move the brood a few cm (72 % of workers take part).
- **Discussion (other species, cited):** in the review of *Solenopsis* (Mirenda & Winson 1981) and the three
  species of Fresneau et al. 1982, a third group of 30–60 % of workers, mostly inactive and **located at the
  periphery of the nest**, forms a reserve available on demand; *L. niger*'s polyethism is likened to these.
- **Use, with limits:** "activity" here counts task acts in scans, not locomotion, under observation light, in
  queen-and-brood-in-one-chamber nests. It supports the **form** of a lognormal between-ant activity trait (as the
  fixed σ 0.4 walk-on trait has), not its size. It also supports a nest organised around one brood-and-queen site,
  with immobile nurses at it and a less active reserve at the periphery: a pattern to look for in B018 (zones by
  role and activity).

## Other species (development: hypotheses and methods)

### Amé, Halloy, Rivault, Detrain & Deneubourg 2006, *PNAS* 103:5835–5840
Cockroach (*Blattella germanica*) larvae choosing among identical
shelters. **Model with a site and a capacity:** leaving rate Q_i = θ / (1
+ ρ (x_i/S)^n) (social retention saturating with occupancy relative to
capacity S; n = 2 gives a threshold), joining rate R_i = μ (1 − x_i/S)
(crowding). With σ = S/N: σ < 1 → equal split between shelters; σ > 1 →
all in one, chosen at random (bifurcation confirmed in 263 runs).
n = 1 removes the choice. **Use:** the explicit form of "attraction with
a spacing mechanism" — site plus social retention plus a crowding limit,
which neither Q (stop rates × neighbours) nor T (taxis) had.

### Jeanson, Rivault, Deneubourg, Blanco, Fournier, Jost & Theraulaz 2005, *Anim. Behav.* 69:169–180
Cockroach larvae in an 11-cm arena. Individual rules measured, then an
agent model:
- **Wall-following first** (larvae within 0.5 cm of the wall), then
  angular reorganisation into clusters at the periphery.
- **Stop rate given N stopped larvae within a 12-mm perception radius**
  (up to three counted), estimated as a Markov rate from the fraction
  stopping per encounter.
- **Stop durations are a two-class mixture whose mix depends on the
  neighbours:** P_short 0.93 / 0.66 / 0.34 / 0.24 for N = 1–4, t_short 5.9
  / 16 / 18.5 / 34 s, t_long 700 / 1248 / 1062 / 1719 s; reassigned when
  the neighbourhood changes.
- **Collision departures:** a stopped larva can be set moving by a moving
  one in range (rate measured per aggregate size; usually one leaves).
- Social simulations aggregate, non-social ones do not.

**Use:**
- the analysis design for the data-side measurement (stop rate vs N
  stopped within a radius; stop-duration mixture vs N; departures
  triggered by passing movers; wall vs centre separately);
- the hypothesis that **heavy-tailed rests are a mixture over neighbourhood
  sizes**: isolated stops short, aggregated stops long.

### Boi, Couzin, Del Buono, Franks & Britton 1999, *Proc. R. Soc. B* 266:371–378
*Leptothorax acervorum*: **two spatial aggregates in the nest**, one by
the entrance and one on the brood pile, modelled as coupled oscillators.
With foragers kept out, activity waves start **near the brood pile** and
spread isotropically at **≈ 0.01 cm/s**, followed by very low activity.
With foragers returning, the entrance group's periodicity is disrupted
(non-synchronous activation by returners); the brood-pile group is
buffered by the spatial gap. **Use:** a spatial account of colony
synchrony (comparison Y: co-movement decaying over 1–4 cm); entrance vs
brood-pile groups as a measurable split; returners as a perturbation.

### Cole 1991, *Am. Nat.* 137:244–259
*Leptothorax allardycei*: colony activity periodic (≈ 26 min); single and
paired workers aperiodic, spontaneously active; one worker activates
another; periodicity sharpens with group size (excitable units, as in
epidemics). Bears on the **parked** excitable-coupling line (STATUS Rules
in force); no arm follows from it.

### Sendova-Franks & Franks 1995, *Anim. Behav.* 50:121–136
*L. unifasciatus*, 9 colonies: individual **spatial fidelity zones**,
partly overlapping, ordered from the colony centre (brood) to the
periphery; zones grow towards the periphery; brood care follows overlap
with the brood; peripheral workers most likely to leave the nest; no
clear age segregation. **Use:** per-ant zone statistics (zone area, distance
to the brood or site, by role) for the data-side measurement.

### Franks & Sendova-Franks 1992, *Behav. Ecol. Sociobiol.* 30:109–123
*L. unifasciatus* brood kept in a single cluster in flat nests, sorted in
concentric bands. Each item's Dirichlet tile area grows with its estimated
metabolic need ("domain of care"). Colonies rebuild the pattern after
emigration. **Use:** context for a brood pile of finite extent.

### Heyman, Shental, Brandis, Hefetz & Feinerman 2017, *Nat. Commun.* 8:15414
*Camponotus fellah*: nest surfaces carry distinct chemical signatures
(passively shed cuticular hydrocarbons and more) that separate entrance,
queen and worker chambers. Brood chambers differ from non-brood ones.
Manipulations show at least three signatures guide task groups to their
destinations in the dark nest. **Use:** the hypothesis that site
fidelity is held by surface chemistry (consistent with Depickère's
marking), which tracks cannot see directly.

### Mersch, Crespi & Keller 2013, *Science* 340:1090 (supplement)
The file is the supplementary materials (methods, Figs. S1–S18).
*C. fellah*, same tracking lineage as Stroeymeyt et al. 2018:
- **positional precision 2.37 px = 0.14 mm** (1.6-mm tags at 17–18
  px/mm);
- orientation 3°;
- detection of tags on live ants 88 ± 17 %.

A development methods figure for the measurement question (B004, variant
M's 0.7-mm drift), not a value for the Stroeymeyt tags (0.7 mm, other
optics).

## What this changes for our model (proposals only; nothing adopted)

1. **Option B's forager values came from red light.** Depickère's
   Insect. Soc. rates (`LASIUS_NEST_B`, encounters-aggregation.md) were
   measured under a red dark-chamber lamp, under which foragers aggregate
   poorly. In total darkness they aggregate like brood-tenders. The
   Stroeymeyt nest is under an IR-pass filter (dark to the ants), so the
   forager rates measured in red light are the wrong condition for it.
   Mailleux 1999's lighting is not stated (STATUS 2026-10-17 ≈ 16:16).
2. **Site location vs aggregation level are separable.** Marking sets
   where and how fast; social retention sets how many. A model needs both:
   a persistent site field (marking or brood) and neighbour-dependent
   resting, with a spacing / capacity limit (Amé's S; Depickère's lattice;
   body exclusion).
3. **Rest durations depend on context.** Jeanson's mixture vs N and
   Depickère's a·A^−b both lengthen rests in clusters. Heavy-tailed
   observed rests can arise from a mixture over neighbourhoods. In our
   model ants are rarely in clusters, so `restCrowdExp` has little to act
   on (C1's estimate 0.15 vs Depickère's 1.16–2.1; one generation mean at
   its bound 0). This connects the rest-form question to
   packing.
4. **Synchrony may be spatial.** Boi's waves from the brood pile and the
   entrance group disrupted by returners give a data-side check (does
   co-movement centre on the site and on the entrance?) before any
   coupling mechanism.
5. **Data-side measurement design** (the proposed backlog item):
   - stop rate vs the number of still ants within a radius;
   - still-run durations vs neighbour count (mixture form);
   - departures following a passing mover;
   - site centroid stability;
   - per-ant fidelity zones vs distance to the site and the queen;
   - all separately at the wall and in the centre.
