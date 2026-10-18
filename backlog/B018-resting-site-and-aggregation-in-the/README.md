---
id: B018
title: Resting site and aggregation in the Stroeymeyt nests
status: active
size: M
priority: 30
note:
outcome:
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

## Findings
<When done: the answer in a few sentences; evidence (paths in this folder);
confidence and caveats; what it implies; suggested next steps or new items. A
change the main code needs goes in this folder as `proposal.patch`.>
