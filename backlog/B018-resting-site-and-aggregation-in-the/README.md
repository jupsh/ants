---
id: B018
title: Resting site and aggregation in the Stroeymeyt nests
status: done
size: M
priority: 30
note:
outcome: Anchored broad site; retention by neighbours (b≈1.1, saturating, via rest durations) and by site, weak site taxis, no neighbour taxis or collision trigger; co-movement peripheral
depends: data/stroeymeyt2018/main_experiment
---
# B018 — Resting site and aggregation in the Stroeymeyt nests

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: STATUS 2026-10-18 ≈ 15:52–16:00 (resting-site literature); comparison P (occupancy at a colony-specific site)

## Question
The data's ants sit at a colony-specific site (comparison P: occupancy maps correlate negatively with the model's,
median r −0.14; near share 0.96 in the data vs 0.80 in the model). What holds the site, and what are the individual rules that produce the
packing? Measured from the tracks only, in the forms the literature uses (`docs/research/resting-sites.md`):
1. **Anchor.** Is the site where the queen is (a proxy for the brood pile, to be checked, not assumed)?
   Distance of still nurses to the queen vs to the colony's occupancy peak; does the site move when the queen moves?
2. **Stability.** Hourly centroid of still ants over the 24 h, light vs dark: a fixed site (anchor: brood, ground
   marking, micro-climate) or a wandering cluster (self-organised aggregation)?
3. **Rules, as rate functions** (Depickère 2004; Jeanson 2005; Amé 2006):
   - stop hazard (moving → still) vs the number of still ants within a radius and vs distance to the site;
   - still-run duration vs neighbour count: the survival form at each count (one exponential, a short/long mixture
     as in Jeanson, a·N^−b as in Depickère);
   - walk-on after a passing mover: departures in the seconds after a moving ant comes within range, vs a matched
     baseline (Jeanson's "collision" departures);
   - heading bias of moving ants toward the site by distance (the taxis signature T tested);
   - pair correlation g(r) of still ants (the spacing at short range).
4. **Wall vs centre** for each of the above (the model's wall excess; Jeanson's two phases).
5. **Fidelity zones** (Sendova-Franks & Franks 1995): per-ant zone area and distance to the site, by role.
6. **Spatial co-movement** (Boi et al. 1999), descriptive: is co-movement centred on the site and on the entrance?

## Why it matters
- **Packing and the site are the disclosed spatial failures** (Rules in force, Contacts). The packing round tested
  arms (Q: stop rates × neighbours froze the colony; T: taxis over-compacted). This item measures the rules
  instead, so that any later design starts from data. A design would be a new main-line decision for the user.
- **Synchrony:** the structure-freeze blocker requires the cause of the colony synchrony to be investigated before
  any held-out test (Rules in force). Y found co-movement decaying over 1–4 cm, ambiguous between local coupling and
  a shared brood micro-environment; anchor and zone results bear on that.
- **Rest form:** if still-run length depends on neighbour count, heavy-tailed observed rests may be a mixture over
  neighbourhoods. That links the rest-form question to packing. Proposal only; C2's fit and judgment are not
  affected.
- **Urgency:** blocks neither C2 nor step 5.

## Done when
For the 22 fit colonies, each with colony-bootstrap CIs (2000) and per-colony values in `results/`:
- (1) queen-vs-peak distances and the site's co-movement with the queen;
- (2) hourly-centroid drift (mm/h) and light/dark difference;
- (3) the four rate functions and g(r);
- (4) all of these split wall band (≤ 3 mm, the P / WR definition) vs centre;
- (5) zone areas by role;
- (6) co-movement by distance to the site and to the entrance.

Then a classification in a few sentences: anchored or emergent site; kinetic retention, taxis or both; the
neighbour dependence of rests (form and size). Each measure's reading is stated in the Progress log **before** it
is computed.

## Base
`ecbb918`; `src/sim/analysis/` and `data/stroeymeyt2018/` clean at filing (2026-10-18). Re-check at claim.

## Data and roles
- **Stroeymeyt 2018 main experiment, PreTreatment tracks, 22 colonies: fit**, used here in a development role (as in
  comparisons X, Y, P, Q). The queen's track is in these files (counted in density, excluded from the rows); its
  positions have not been analysed before. Say so in the first Progress entry; the lead agent logs it in STATUS.
- **Age-experiment colonies: held-out, never.** PostTreatment files: unused.
- **Literature:** only the cleared sources in `docs/research/resting-sites.md` and `encounters-aggregation.md`.
  Depickère et al. 2008 and Mailleux, Sempo et al. 2011 are held-out and sealed: never.
- **No simulation.** Model comparisons, if wanted later, are a separate item.

## Compute
Local only, niced, data side: one pass over the 22 colonies' 24-h tracks per measure family (minutes each; reuse
the readers in `scripts/s2018Lib.ts` / `scripts/stroeymeytRows.ts`, the step and still definitions of
`src/sim/analysis/inNest.ts`: 0.6 mm per frame, gaps ≤ 3 frames bridged). Never the box: the C2 fit is running
there.

## Out of scope
- model arms, switches or mechanisms (a site field, body exclusion, neighbour-dependent rests): proposals only, in
  Findings;
- **per-ant activity by zone against C2's persistence and top-20 % rows** (it bears on how C2 is read: a main-line
  pre-registration after the C2 reading, not this item);
- observer or tracker changes; contact definitions; the held-out data and papers.

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->
- 2026-10-18 16:16 UTC · claude-opus-B018 · Claimed (handed directly by the user; base ecbb918, src/sim/analysis and data/stroeymeyt2018 clean). **Queen positions are used** (main experiment PreTreatment, 22 fit colonies, development role): first analysis of her track, for the lead agent to log in STATUS. Plan: (0) geometry pass, per colony: in-nest extent of all detections (nest edges from the data, since P's walls from the model frame sit 1–2 mm off the data's), queen detection coverage; no behavioural reading. Then one Progress entry per measure family stating its reading, then one niced pass (≤ 3 colonies at a time) over the tracks with readers from scripts/stroeymeytTracks.ts (reorder 8, lost_tag to last detection), duplicate rule 0.12 mm re-implemented in the item's code (the scratch recorders keep the first read instead). Nothing under 1 mm read as behaviour; colony bootstrap 2000.
- 2026-10-18 16:21 UTC · claude-opus-B018 · Geometry (step 0, no behavioural reading; out/geometry-c*.json): 22 colonies × 24.0 h; queen detected in 0.61–1.00 of frames, always in the nest; forager crossings of Ynestmax at median x 32.8–37.1 mm in every colony (one common frame). Worker occupancy covers only part of the nest in some colonies (colony215: x ≥ 35 mm; colony250: x ≤ 42 mm), so edges are pooled over colonies (ant-centre extent where the edge profile falls to ≈ 10 % of its plateau): **x 0.5–68.75, y 1.25–42.25 mm**; wall band = < 3 mm from that rectangle (2 and 4 mm beside, as the pooled edge may sit ±1 mm off a given box); entrance = (35.5, 42.25), gap x 33–37. A physical cause of the unused nest halves (e.g. an obstruction not visible in tracks) cannot be excluded from the tracks.
- 2026-10-18 16:21 UTC · claude-opus-B018 · Readings before computing families 1–2 (pass A, site.ts). **Site S** = peak of the colony's 24-h still-worker occupancy (still steps, 1-mm grid, 5 × 5-mm moving window); light and dark peaks beside. **(1) Anchor:** Q = queen's 24-h median position. Per still-nurse step: distance to the queen (her latest detection ≤ 60 s old) and to S; per colony the ratio of medians d_queen / d_site. *Queen at the site* if |Q − S| < 5 mm in ≥ 15 of 22 colonies and the colony-mean ratio's 95 % upper bound ≤ 1.2; *site not at the queen* if |Q − S| > 10 mm in ≥ 12 colonies; else mixed. Co-movement: hourly queen median Q_h vs hourly still-worker centroid C_h, vector correlation of deviations from their 24-h means; *site follows the queen* if > 0 with CI over colonies, but only among colonies whose Q_h range ≥ 5 mm; if fewer than 6 such colonies the test is uninformative (queen too still). Queen = brood proxy is not checked (brood untracked). **(2) Stability:** hourly C_h and hourly peaks S_h; drift = median |C_{h+1} − C_h| (mm/h), range of S_h, share of hours with S_h within 5 mm of S. *Fixed site* if in ≥ 15 colonies S_h stays within 5 mm of S in ≥ 80 % of hours; *wandering* if in ≥ 12 colonies the S_h range > 20 mm (Depickère's late main-cluster jumps); else mixed (e.g. two alternating clusters, reported). Light vs dark: distance between light and dark peaks; paired light − dark difference in hourly drift (colony bootstrap 2000).
- 2026-10-18 16:27 UTC · claude-opus-B018 · Families 1–2 read (results/site.json; siteAgg.ts). **By the logged rules:** (1) anchor = **site not at the queen** (|Q − S| < 5 mm in 2 of 22 colonies, > 10 mm in 15; median 12.2 mm); co-movement **supported**: all 22 queens' hourly ranges ≥ 5 mm (median 20.5 mm, although 99.6 % of her steps are still), vector correlation of hourly queen and still-worker centroid deviations **0.24 [0.16, 0.31]** (weak). Still nurses are as close to the queen as to S: median-distance ratio **1.02 [0.97, 1.07]**. (2) stability = **wandering** (S_h within 5 mm of S in ≥ 80 % of hours: 0 colonies; S_h range > 20 mm: 21 of 22, median 30.7 mm). Light − dark hourly drift +0.08 [−0.06, 0.22] mm/h (no difference); light / dark peaks 7.6 mm apart (median), centroids 1.56 [1.16, 2.02] mm. **Disclosed weakness, seen at reading time:** S is the peak of a flat-topped map: the best 5-mm window ≥ 10 mm from S holds a median 0.91 of S's count (11.7 mm away), and half the still-step mass lies within 14 mm of S. So S and S_h are poorly defined, and 'not at the queen' and 'wandering' may reflect peak jumps on a plateau rather than cluster movement. The hourly still-worker centroid moves only 0.98 [0.91, 1.07] mm/h. The verdicts stand as computed. Next, beside and labelled post hoc (not replacing them): Q vs the 24-h still-worker centroid, and the correlation of hourly still-occupancy maps (5-mm cells) by lag (1–12 h).
- 2026-10-18 16:29 UTC · claude-opus-B018 · Post hoc beside 1–2 (results/site.json → summary.posthoc; the logged verdicts stand): hourly still-occupancy maps (5-mm cells) correlate 0.90 [0.89, 0.91] at 1 h lag, 0.84 at 6 h, 0.82 [0.80, 0.84] at 12 h; light vs dark maps 0.95 [0.94, 0.96]; vs other colonies' maps 0.42 [0.36, 0.47] (the shared-geometry baseline). The queen's median position is 6.2 mm from the 24-h still-worker centroid (median; < 5 mm in 6 colonies, > 10 mm in 4), 0.56 [0.44, 0.67] of the half-mass radius (12.1 mm); still nurses sit slightly closer to that centroid than to the queen (ratio 1.15 [1.11, 1.18]). So the resting area is a broad colony-specific region, stable over 24 h and across light/dark, with the queen inside it but not at its centre. Its peak jumps within it.
- 2026-10-18 16:29 UTC · claude-opus-B018 · Readings before computing families 3–6 (pass B, rules.ts; two sweeps per colony). **Site field E** (chosen now, since the peak is ill-defined): the still-worker occupancy of the *other* light/dark phase, leaving out the focal ant, 5 × 5-mm box-smoothed on the 1-mm grid, divided by its mean over the nest rectangle; bins < 0.5, 0.5–1, 1–2, 2–4, ≥ 4. Neighbours: still workers within 4.1 mm, the queen counted when her step is still. Every table also splits role, phase and wall band (< 3 mm; **family 4** = the wall/centre ratio of each rate, descriptive). **(3a) stop hazard** of moving workers (moving step → next step still) by N (0…6+) × E. *Neighbour-dependent stopping* if the E-stratified (Mantel–Haenszel) ratio h(N ≥ 3) / h(N = 0) has a 95 % CI > 1; *site retention beyond neighbours* if the N-stratified h(E ≥ 2) / h(E < 1) has a CI > 1. **(3b) leaving** of still workers (still step → next moving) by A = 1 + N (1…9+): per-colony weighted log–log fit pL = a·A^−b. *Depickère form supported* if b > 0 (CI) and the power law's Poisson deviance is not beaten by Amé's saturating form θ/(1 + ρ·(A/S)^2) (ΔAIC > 4 in ≥ 95 % of colony bootstraps); E-stratified site effect on leaving as in 3a. Survival of bounded still runs by A at the start (1, 2, 3–4, 5–8, ≥ 9), censored at gaps, left-truncated at 2 s, log-binned: 1-exponential vs 2-exponential mixture (MLE). *Jeanson form* if the mixture wins (ΔAIC > 10 pooled, and in ≥ 95 % of bootstraps) at ≥ 3 of 5 A bins and P_short(A ≥ 5) − P_short(A = 1) < 0 (CI). **(3c) walk-on:** leaving hazard of still workers by time since a moving worker last crossed into 4.1 mm (hysteresis out 5.1; bins 0–1, 1–2, 2–5, 5–10, 10–30, ≥ 30 s or none), A-stratified. Primary departure = **sustained** (≥ 2 consecutive moving steps), since a passing tag may perturb a still tag's read; any departure beside. *Collision departures* if the MH ratio h(0–2 s) / h(≥ 30 s) has a CI > 1; excess departures per arrival within 5 s reported. **(3d) taxis:** moving paths resampled at 1.5-mm anchors (chain reset at still steps and gaps); turning slope κ = Σ Δφ·sin β / Σ sin² β, with β the bearing of the target relative to the heading. Targets: (i) uphill of E, with the 21 other colonies' fields as placebo; (ii) T's rule, the resultant of unit vectors to still neighbours within 8 mm when |v| ≥ 0.5, with the same ants' still positions 1 h earlier as placebo. *Site taxis* if κ_E − κ_placebo > 0 (CI) in the centre band; *neighbour taxis* if κ_nb − κ_lag > 0 (CI). The mean cos β is reported only: at a fixed site in steady state, flux balance pushes it toward 0 under taxis or kinesis alike, so it is not a signature. **(3e) g(r)** of still workers: pair distances now vs the same ants' still positions 1 h apart (keeps the site map, removes the instant), 0.25-mm bins to 30 mm, by the focal ant's wall band. *Hard core* if g(1–2 mm) < 0.5 (< 1 mm not read); peak r* and g(r*); cluster scale where g falls below 1.1. **(5) zones:** per ant with ≥ 1 h in the nest: radius of gyration Rg, A90 on 2-mm cells, centroid distance to the colony's 24-h still centroid and to the queen; nurse − forager differences (colony-paired); Spearman ρ(Rg, distance to centre) per colony. *Sendova-Franks pattern* if ρ > 0 (CI) and nurses are nearer the centre (CI). No per-ant activity (out of scope). **(6) co-movement** (descriptive, Y's definitions: 1-min bins, deviations from 4-h block means from 02 UTC, C = Σ d_i d_j / √(Σ d_i² Σ d_j²)): pairs < 10 mm and 10–20 mm apart, classed core (E_24h ≥ 2) / entrance (≤ 10 mm from (35.5, 42.25)) / periphery (E < 0.5) / mixed. *Centred on the site* if C_core(< 10) − C_periphery(< 10) > 0 (CI); same for the entrance; lead–lag of core vs periphery zone means at ±1…5 min reported.
- 2026-10-18 16:57 UTC · claude-opus-B018 · Families 3–6 read (results/rules.json; rules.ts, rulesAgg.ts; 22 colonies, bootstrap 2000). **3a stop hazard:** *neighbour-dependent stopping* supported, h(N ≥ 3) / h(N = 0) **1.64 [1.58, 1.72]** (hazard 0.46 → 1.25 /s over N 0 → 6+); *site retention beyond neighbours* supported, h(E ≥ 2) / h(E < 1) at fixed N **1.38 [1.33, 1.44]**; nurses and foragers alike. **3b leaving:** pL falls from 0.064 /s (A = 1) to 0.0057 /s (A = 8); b = **1.07 [0.98, 1.15]** pooled, 1.11 [1.01, 1.21] as the per-colony mean (nurses 1.05, foragers 0.85 [0.78, 0.92], wall 1.40). Amé's saturating form θ/(1 + k·A^n) (n 1.66) beats the power law in 100 % of bootstraps (ΔAIC 2.8e4), so by the rule **the Depickère form is not supported**: the dependence is strong but concave in log–log. Site effect on leaving at fixed A: **0.64 [0.58, 0.70]**. Survival: the 2-exponential mixture wins at every A bin (100 % of bootstraps); P_short (≥ 2 s) 0.77 → 0.70, difference A 5–8 − A 1 = **−0.064 [−0.081, −0.046]**, so *Jeanson form* supported by the rule. But most of the neighbour effect is in the durations: t_short 3.2 → 6.8 s, t_long 152 [136, 172] → 412 (A 5–8) → 665 s (A ≥ 9); the mix moves little (Jeanson's P_short 0.93 → 0.24). ΔAIC is trivially large at 10^5 runs per bin, and the long component may itself be heavy-tailed. **3c walk-on:** sustained-departure ratio 0–2 s vs ≥ 30 s **2.19 [2.07, 2.34]**, so *collision departures* supported by the rule; excess sustained departures within 5 s = **0.048 [0.042, 0.054] per arrival**. **Disclosed weakness at reading time:** the hazard shows no transient: 0.018 / 0.021 / 0.019 / 0.017 / 0.014 /s at 0–1 / 1–2 / 2–5 / 5–10 / 10–30 s vs 0.0054 at ≥ 30 s. The ratio may reflect confounding by still-run age (fresh stops are often encounter stops and have higher hazards under the mixture), not a collision trigger. A post hoc age-stratified check follows, labelled as such.
- 2026-10-18 16:57 UTC · claude-opus-B018 · **3d taxis:** *site taxis* supported, centre κ_E − κ_placebo **0.045 [0.036, 0.056]** (largest at low E, 0.056; 0.023 at E 2–4); wall band 0.008 [0.005, 0.012]. *Neighbour taxis* (T's rule) **not supported, opposite sign:** κ_nb − κ_lag **−0.0098 [−0.013, −0.007]**, −0.031 [−0.038, −0.024] at E 2–4, i.e. turning away from current still neighbours in the dense core. Mean cos β is −0.04 to −0.08 for every source, placebo included (geometry; not a signature). **3e g(r)** (now vs 1 h apart): g(1–2 mm) **0.74 [0.69, 0.79]**, so by the rule **no hard core at 1–2 mm**; peak r* **2.38 mm**, g(r*) **1.24 [1.22, 1.26]**; falls below 1.1 at **3.25 mm**. Disclosed: by 0.5-mm bins g = 0.00 / 0.01 / 0.48 / 1.01 at 0–0.5 / 0.5–1 / 1–1.5 / 1.5–2 mm. The rule's window straddles a step at ≈ 1.5 mm (≈ body width), and the exclusion may be partly tag-read geometry (overlapping tags). Wall band: g(1–2) 0.63, peak 1.33. **4 wall vs centre** (ratios at the same covariates): stop hazard **1.14 [1.07, 1.21]**, leaving **1.16 [1.03, 1.37]** (steeper in A), walk-on ratio 1.87 vs 2.22, site taxis 0.008 vs 0.045. **5 zones:** ρ(Rg, distance to the 24-h still centroid) **−0.049 [−0.105, 0.002]** (nurses −0.087 [−0.155, −0.022]), so **the Sendova-Franks pattern is not supported** (zones do not grow toward the periphery). Nurses sit nearer the centre (−1.9 mm [−2.4, −1.4]) and the queen (−3.8 [−4.9, −2.8]), with smaller zones (Rg 10.9 vs 12.4 mm, −1.4 [−1.8, −1.0]; A90 298 vs 410 mm²). Individual zones (Rg ≈ 11 mm) span most of the resting region (half-mass radius 12 mm). **6 co-movement:** **not centred on the site:** C(< 10 mm) core 0.062, periphery 0.260, entrance 0.255; core − periphery **−0.198 [−0.257, −0.145]**; entrance − periphery +0.02 [−0.10, 0.17]; 10–20 mm alike (−0.12 [−0.17, −0.08]). Core vs periphery lead–lag ≈ 0 (lag +1 − lag −1: 0.009 [−0.004, 0.023]). **Bears on the main line** (the synchrony cause before a structure freeze, Y's 'shared brood micro-environment' alternative): the local co-movement sits in the periphery and the entrance region, not at the resting site. Reported, not pursued further here.
- 2026-10-18 16:58 UTC · claude-opus-B018 · Post hoc (3c, labelled; the logged verdict stands), reading before running walkon.ts: the sustained-departure hazard of still workers in **bounded** still runs by time since a mover arrival (same bins) × **run age** (0–2, 2–5, 5–15, 15–60, ≥ 60 s) × A × role × wall × phase. *Collision trigger survives* if the MH ratio h(0–2 s) / h(≥ 30 s) with age in the strata has a 95 % CI > 1 **and** is ≥ 1.2; if it is < 1.2 or its CI includes 1, the 3c ratio is attributed to run-age confounding. Excess departures per arrival (0–5 s) recomputed with age-stratified baselines. Also, for family 4, the share of still steps in the 2/3/4-mm wall bands vs the bands' area share (from pass A grids).
- 2026-10-18 17:04 UTC · claude-opus-B018 · Post hoc 3c read (results/walkon.json; walkon.ts, walkonAgg.ts): with run age in the strata, the sustained-departure ratio 0–2 s vs ≥ 30 s since a mover arrival is **1.02 [1.00, 1.04]** (any departure 1.05 [1.04, 1.07]). By the post hoc rule **the collision trigger does not survive; the 3c ratio is attributed to run-age confounding.** Excess per arrival falls to 0.017 [0.014, 0.020]. Within age bins: 0–2 s 1.00, 2–5 s 1.01, 5–15 s 1.05, 15–60 s 1.36 [1.29, 1.45], ≥ 60 s **3.52 [3.12, 4.00]**. In long rests, then, a recent visit goes with leaving 3–4× more often, but with no transient (0.0011 / 0.0010 / 0.0010 / 0.0010 / 0.0007 /s at 0–1 / 1–2 / 2–5 / 5–10 / 10–30 s vs 0.0002 at ≥ 30 s). That fits local traffic or residual age confounding inside the broad ≥ 60 s bin, not a passing-mover trigger. **Family 4 band shares** (data edges): still steps within 3 mm of the walls **0.039 [0.021, 0.060]** of the total vs 0.22 of the area, enrichment **0.18 [0.10, 0.27]** (2 mm: 0.10; 4 mm: 0.24). Resting ants avoid the walls (the model's band enrichment ≈ 2.45, STATUS 2026-10-17 ≈ 16:05).
- 2026-10-19 17:00 UTC · lead-claude · Lead review (2026-10-19). Data use checked: main_experiment PreTreatment files of the 22 fit colonies only (stroeymeytTracks ROOT); queen positions first analysed here, now logged in docs/contamination/. Headline numbers spot-checked against results/rules.json (stop by N, leaving by A, survival, taxis κ differences): they match. Two caveats on readings that bear on the main line. (1) Family 6: each minute's pair is classed by where both ants are in that minute, and that is endogenous to activity. An ant in the periphery (E < 0.5, where nobody rests) is almost always moving, and core ants mostly still. So C(periphery) > C(core) can arise from the classing alone. Finding (i) ('argues against the shared-brood reading') should not be used until zones are fixed per ant over the 4-h block (or by its rest position): filed as a follow-up. (2) 3a: 'stop' is a frame-level step below 0.6 mm, so the neighbour effect on stopping includes slowing in crowds (congestion), not only stop decisions. Also worth noting: the leaving exponent b 1.07 [0.98, 1.15] matches Depickère et al. 2004 (Insect. Soc.; brood-tenders, b 1.16, F052), although the rule's form test rejects the pure power law.

## Findings
**Answer.** The resting site is **anchored, not emergent**, and it is held by **both** kinetic retention and a weak site taxis.
Retention depends on neighbours **and** on the site independently. The neighbour dependence of rests is strong (b ≈ 1.1),
saturating rather than a pure power law, and it acts mainly on rest durations, not on Jeanson's short/long mix. There is no
neighbour taxis (T's rule has the wrong sign in the data) and no collision trigger. Local co-movement sits at the
periphery and the entrance, not at the site.

**Evidence** (22 fit colonies, PreTreatment 24 h, colony bootstrap 2000; Progress log for the readings and their order):
- *Site and anchor* (`results/site.json`). The still-worker occupancy is a broad (half-mass radius ≈ 12 mm), colony-specific
  region that keeps its place: hourly maps r 0.90 at 1 h, 0.82 at 12 h, light vs dark 0.95, vs other colonies 0.42.
  Its peak is ill-defined (a second window ≥ 10 mm away holds 0.91 of the peak's count), so the logged peak-based verdicts
  ("not at the queen", "wandering") are weak and stated as computed. The queen lies inside the region (6.2 mm from its
  centroid, 0.56 of the half-mass radius) but not at its centre, and the still-worker centroid follows her hourly moves
  only weakly (vector correlation 0.24 [0.16, 0.31]). Queen = brood proxy: not established.
- *Rates* (`results/rules.json`). Stop hazard × 1.64 [1.58, 1.72] with ≥ 3 still neighbours, and × 1.38 [1.33, 1.44] at high
  site field at fixed neighbours. Leaving pL(A) 0.064 → 0.0057 /s for A 1 → 8, b 1.07 [0.98, 1.15]; Amé's saturating
  form fits better (ΔAIC 2.8e4; the Depickère power law "not supported" by the rule). Leaving at fixed A × 0.64 [0.58, 0.70]
  at high field. Still runs: 2-exponential mixture at every A; P_short (≥ 2 s) only 0.77 → 0.70, while t_short 3.2 → 6.8 s
  and t_long 152 → 665 s.
- *Walk-on* (`results/walkon.json`). The 3c ratio (2.19) vanishes with run age in the strata (1.02 [1.00, 1.04]); it was
  confounding. A 3–4× excess of leaving in rests ≥ 60 s after a recent visit remains, with no transient.
- *Taxis.* Turning toward the uphill of the site field beats the other-colony placebo by κ 0.045 [0.036, 0.056] (centre);
  turning toward current still neighbours beats their positions 1 h earlier by −0.010 [−0.013, −0.007] (away, most in
  the dense core).
- *g(r).* Exclusion below ≈ 1.5 mm; peak 1.24 at 2.4 mm; back below 1.1 by 3.25 mm. So the packing beyond the site map is
  a one-body-length shell. The rule's 1–2 mm window gave 0.74 ("no hard core"); the step lies inside it.
- *Walls.* Still steps within 3 mm of the walls: enrichment 0.18 [0.10, 0.27] (resting ants avoid walls). At the walls,
  rates are × 1.14 (stop) and × 1.16 (leave) at the same covariates.
- *Zones.* No growth toward the periphery (ρ −0.05 [−0.11, 0.00]). Nurses are 1.9 mm nearer the centre and 3.8 mm nearer the
  queen, with smaller zones (Rg 10.9 vs 12.4 mm), but each ant ranges over most of the region.
- *Co-movement* (Y's definitions). C(< 10 mm) is 0.06 in the core vs 0.26 in the periphery and 0.26 at the entrance;
  no core → periphery lead.

**Confidence and caveats.**
- Rate effects are large relative to their CIs. The forms are less sure: at 10⁵–10⁶ events any curvature wins on AIC.
- Still = < 0.6 mm per frame: nothing under ≈ 1 mm is read as behaviour, but the g(r) step at 1.5 mm may be partly
  tag geometry.
- Wall edges are pooled across boxes (± 1 mm).
- Taxis κ is small; the placebo removes shared geometry, but trails between entrance and site would also read as "site
  taxis".
- The site field is built from other ants' rests in the other phase, so "site effect" means a place where others rest, for
  whatever reason: brood, marking or microclimate; the tracks cannot tell which.
- Unused nest halves in some colonies (e.g. colony215, colony250) may have a physical cause the tracks cannot show.

**What it implies (proposals only; nothing changed or adopted).**
- A model needs a fixed, colony-specific site field acting on stop and leave rates, independently of neighbour-dependent
  resting. It also needs a saturating neighbour dependence that lengthens rests of both kinds, plus short-range spacing
  (≈ 1.5 mm exclusion, ≈ 2.4 mm shell) and no taxis toward resting neighbours. That is Amé's structure
  (site + social retention + crowding), not Q's or T's arms.
- At most a weak site-directed turning, and resting at walls suppressed (the model's edge-following is the opposite).
- Rest durations that depend on neighbours make the observed heavy tail partly a mixture over neighbourhoods. This bears
  on the rest-form question (a proposal for after C2; C2 not affected).

**Bears on the main line** (for the lead agent):
- (i) The synchrony investigation: local co-movement is a periphery / entrance phenomenon, which argues against
  Y's "shared brood micro-environment" reading.
- (ii) The packing limitation: data-side rules for a future design.
- (iii) Wall rule: the data's resting-wall enrichment is 0.18 with data edges, replacing P's unreliable 0.02.

**Next steps (suggested items).**
- A model-side item measuring the same tables on the C2 start point through the observer (same scripts, simulated input).
- Brood location, if any source can give it, to test queen vs brood vs marking.
- The per-ant zone × activity analysis is the main-line pre-registration already planned, not this item.
