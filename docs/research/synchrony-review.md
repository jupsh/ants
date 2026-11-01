# Focused review of experimental synchrony work (D230, D232)

_Written 2026-11-01 by the lead for the user, before item 1(e)'s design (P114). Scope and rules: D232 with amendment 1
(D233), tier 1 as cleared in D234–D236. A comparison of candidate mechanisms, not a model (P115); it chooses nothing
for 1(e) and adopts nothing. All sources are development literature in other species, read for mechanisms,
manipulations and predictions only (P129): no value below is a parameter or a target. Exposure: X023, X024, X025._

_Amended 2026-11-01 on the user's acceptance with amendments (D238): every C1–C5 cell is **u** where the constraint
itself was not tested (the former "meets in kind" cells, H4's C1 among them); H8 is stated as a hypothesis; the claim
that our data are aperiodic is removed (no record supports it: F012 inconclusive, P80); the discriminators are
qualified as observational where they rest on tracks, contact associations or Granger predictability, and the
air-screen result is limited to an airborne within-nest signal. First version: D237._

**Sources read in full (stage 2):** Richardson et al. 2026 (*Leptothorax acervorum*), Richardson et al. 2017
(*L. acervorum*), Franks et al. 1990 (*L. acervorum*), Cole 1991 *Proc R Soc B* and Cole 1991 *J Insect Behav*
(*L. allardycei*), Cole & Cheshire 1996 (*L. allardycei*), Vaes & Detrain 2022 (*Myrmica rubra*), Despland & Simpson
2006 (*Schistocerca gregaria*), Napoli, Garnier & Porfiri 2026 (theory, *Temnothorax* values). Read earlier and
cited from the record: Boi et al. 1999, Cole 1991 *Am Nat*, Mersch et al. 2013 and the others listed in D232.
**Abstract only** (marked _abs._ below): Doering et al. 2019 and 2022 (deferred, P130), Mildner & Roces 2017,
Pamplona-Barbosa et al. 2025, Fujioka et al. 2021, Lone & Sharma 2011, Doering et al. 2024, Napoli, Sipahi & Porfiri
2026, da Silveira & Fontanari 2024.

**Reading the table.**
- **Evidence** is classed by the study's design (P124): **exp** (a manipulation), **obs** (observational, including
  contrasts the authors did not create and naturally occurring events scored inside an experiment), **mod**
  (modelling only). The strength is the lead's.
- **Transfer** to *L. niger* in the Stroeymeyt recordings (one nest of ~28 cm² with a foraging area, dark nest, 2 fps
  tracker, light phase, 22 colonies): plausible, doubtful or unknown, with the reason.
- **C1–C5** (D231, read as questions, P117; C2 as amended, P118): **m** meets, **c** conflicts, **s** silent (the
  mechanism as published says nothing), **u** unknown (relevant, but the constraint itself was not tested). Where a
  published result is qualitatively relevant to a constraint it did not test, the cell is **u** and the evidence
  column says why. No cell is **m** or **c**: no reviewed study tested any of C1–C5 as stated.
- **Predictions** are listed only where a reviewed study sets up the contrast between explicit alternatives (P119).
  Each is classed **existing data** (checkable in the development data; its own design first, P87), **new data**
  (item 1(d)) or **needs modelling** (item 1(e)). In the development tracks, contacts and activations are observed,
  not assigned: such a check can show patterns consistent with a mechanism, never establish it causally.

## Comparison

| Mechanism | Evidence | Transfer | C1 | C2 | C3 | C4 | C5 | Discriminating predictions (contrast established) |
|---|---|---|---|---|---|---|---|---|
| **H1** slow common physical input | No ant study tests a minutes-scale physical driver. obs: day/night (light + temperature together) changes cycle tempo and amplitude (Richardson 2017), a day/night contrast, not variation within the light phase. exp (secondary report): a screen passing air but not ants made the two halves' activity independent (Cole 1991 JIB), which bears only on an airborne within-nest signal, not on temperature, vibration or light. Weak. | unknown: no ant data at our timescale; the air-screen result is one species, reported in passing | u | u | s | u | s | **Shared air, separated ants:** an airborne within-nest signal keeps the halves synchronised, contact coupling does not (Cole 1991 JIB). new data. It does not test common physical inputs reaching both halves (temperature, vibration, light). |
| **H2** slow per-ant state, locally coupled | exp with obs events: isolated ants' inter-bout intervals have a central mode, not exponential; in pairs, a naturally occurring contact always advanced the next bout, and the following interval equalled the ant's usual one, consistent with a phase reset rather than a transient kick or a period change (Cole 1991 JIB, small n). obs: inactivity bouts end non-randomly, activity bouts randomly (Franks 1990). exp (locust): a hunger oscillation advanced by contact, with synchrony rising with coupling at a fixed spontaneous rate (Despland & Simpson 2006). Moderate for "ants carry a resettable timing state". | unknown: one ant species, inactive periods of tens of minutes in a cycling species; the locust case transfers as a type of mechanism only | u (Despland: synchrony rose with coupling, at 4-min sampling in locusts) | u | u | s | u | **Three-interval comparison:** after a contact-associated bout, the next inactive interval is the ant's usual length (consistent with a phase reset), longer (transient kick) or shorter (period change) (Cole 1991 JIB). **Onset distribution:** inter-bout intervals unimodal (timer) or exponential (Poisson) (Cole 1991 JIB; Franks 1990). existing data, observational: identifiability depends on complete event histories and controls (D238). Neither separates H2 from H3 with refractory recovery: both reset phase. |
| **H3** excitable activation with refractoriness | obs: activation follows contact with an active ant more often than not (Franks 1990, a contingency table; Richardson 2026, large n, odds rising with each recent contact); no association of deactivation with contacts (Richardson 2026). exp: periodicity rises with the number of ants at fixed area (Cole & Cheshire 1996); active–active reinforcement estimated in pairs (Cole & Cheshire 1996). Refractory rest: _abs._ only (Doering 2022, deferred). mod: Goss & Deneubourg; Napoli et al. 2026 (bursts need rare spontaneous activation, strong social activation, rest, and fast mixing). Strong for contact-associated activation in *Leptothorax*; refractoriness as a fixed delay not shown in any cleared full text. | unknown for cycles: periodicity in our data is unresolved (F012 inconclusive; P80), and *M. rubra* showed no consistent periodicity at 10-min sampling (Vaes & Detrain 2022); plausible for contact-associated activation as such | u | s | s (models assume homogeneous mixing) | s | s | **Which interaction makes periodicity:** active–active reinforcement makes periodicity grow with aggregate size, while active-stimulates-inactive damps that growth, in the MCA model (Cole & Cheshire 1996). needs modelling. The assumed "periodicity sharper with more ants (H3) versus none for a common input" stays out: no reviewed study sets a common input against it. |
| **H4** food state and returning foragers | exp (within-colony time course, no parallel control): starvation lowered in-nest activity but raised the 10-min-sampled activity CV and burst counts; refeeding lowered both (Vaes & Detrain 2022). exp (n = 4): starvation sent more workers out and, unpublished, flattened the pulses (Franks 1990). obs: activity rose after zone switchers arrived, above a matched-activity control, more inner-to-outer than outer-to-inner, and foragers followed rather than led activation chains (Richardson 2026). exp: with foragers kept from returning, whole-colony cycles were more regular (Boi et al. 1999, *L. acervorum*, read earlier). Moderate for "food state is associated with slow synchrony". | plausible: *M. rubra* is temperate, ~200 workers, nest ~30 cm², dark nest with an arena; limits: constant light, pixel activity, 10-min sampling, starvation confounded with days in set-up | u (CV rose at 10-min sampling; coupling and co-presence were not separated) | u (activity level moves with food state) | s | s | u (an arrival-associated rise in *L. acervorum*; post-entry forager activity and the queen association not tested) | **Food state:** slow synchrony higher in starved than fed colonies, lower during food sharing (Vaes & Detrain 2022). new data (feeding manipulation), or existing data if the Stroeymeyt feeding times give independent variation (inventory, D238). **Arrival-associated rise:** activity after an entry against matched-activity controls, by direction (Richardson 2026). existing data, observational (F109 used matched controls; direction not split). |
| **H5** queen-linked activation | _abs._ only: queen absence impairs synchrony (Doering 2019, deferred). obs: queens and brood workers are less active (Franks 1990). exp: periodicity appears in queenless aggregates and with numbers, not with a central element (Cole & Cheshire 1996). Weak. | unknown | u | s | s | s | u | None established in a cleared full text. |
| **H6** initiators and transfer ants | obs within an exp (nest architecture, crossover, 13 colonies): activations with no observed contact with an active ant in the previous 60 s concentrate in the inner, nurse zone at low and falling activity; nurse-like ants lead reconstructed activation chains; intermediates switching zones are followed by activity rises above matched controls; a two-chamber nest weakens inner-to-outer Granger predictability (Richardson 2026). mod: a "first mover" sets off each burst (Napoli et al. 2026). Strong in *L. acervorum* as a description; causal roles are inferred. | doubtful to unknown: a cycling species with 36–104 workers; the tracking (2 fps, barcodes) and the nurse–entrance layout are comparable to ours | u | s | u (directional, zone-structured coupling; our profile is by distance and was not compared) | s | u (foragers as followers; our C5 associations not tested) | **Initiator heterogeneity:** share of activations with no observed preceding contact, by zone and social maturity, and by activity level and slope (Richardson 2026; against a homogeneous first mover). **Directional predictability:** nurse zone → entrance zone exceeds the reverse (Granger, 1-min bins) (Richardson 2026). **Switcher-associated rise:** as under H4. existing data, observational: "no observed preceding contact" is defined by what the tracker sees, and Granger predictability is not transmission; missed contacts, tracking gaps, ongoing rises and spatially varying common inputs can produce the same patterns (D238). |
| **H7** set-up or time since recording | obs: no trend over 10 h at constant conditions (Franks 1990). exp: runs started at 8 am or 8 pm under constant light, otherwise identical, differ in periodicity (Cole & Cheshire 1996), which elapsed time alone does not predict. Weak either way. | unknown | s | s | s | u (periodicity by clock time, not slow synchrony over the light phase) | s | **Clock versus elapsed time:** identical runs started at different clock times (Cole & Cheshire 1996). new data, or existing data if the Stroeymeyt start times vary (inventory, D238). |
| **H8** (added; hypothesis) clock-associated change in collective periodicity | exp: without brood, periodicity grows with aggregate size in runs started by day and not in runs started by night, under constant light; with brood, the clock has no effect (Cole & Cheshire 1996). obs: day cycles faster and larger (Richardson 2017; light and temperature confounded). _abs._: nurses arrhythmic in the colony and rhythmic in isolation (Mildner & Roces 2017); individuals arrhythmic in the colony (Fujioka 2021). That coupling itself is modulated over the day is an interpretation of these results, not a measured mechanism; weak that it is endogenous. | unknown: our recordings cover the light phase only, and the brood result suggests the effect may vanish in brood-rearing colonies | u | s | s | u (periodicity by clock, not slow synchrony over the light phase) | s | As under H7 (clock vs elapsed time); **brood:** the clock-associated difference present without brood, absent with it (Cole & Cheshire 1996). new data |

## What deserves a quantitative test here (P125)

The lead's reading, accepted by the user with amendments (D238), who set the order: H6 first, the contact-reset
test second, and for the other two only a feasibility inventory of permitted metadata. None chooses 1(e)'s mechanism.

1. **Heterogeneous initiation and directional transfer (H6).** Support: Richardson et al. 2026, large and tracked
   at our frame rate. Limits: a cycling species with small colonies; its causal roles are inferred from observed
   contacts and predictability. In the development tracks, patterns consistent with directional transfer can be
   described (who activates with no observed preceding contact, where, at what activity level; nurse-zone to
   entrance-zone predictability; zone switchers); they cannot establish transmission. It bears on C3, which every
   Part D member misses (F107), and on C5.
2. **An individual timing state reset by contact (H2–H3 boundary).** Support: one experiment in *L. allardycei*
   with naturally occurring interactions (Cole 1991 JIB), consistent bout-length evidence (Franks 1990), and a
   mechanism of the same type in locusts (Despland & Simpson 2006). Limits: small samples, cycling species, a
   timescale of tens of minutes. In the development tracks the three-interval comparison is observational, and
   whether it is identifiable depends on complete event histories and controls. If present, such a state is one
   route to C1. It does not separate an intrinsic slow oscillator from excitable recovery.
3. **Food state associated with slow synchrony (H4).** Support: Vaes & Detrain 2022, the closest species to ours
   read here, at a 10-min sampling that matches our deficit window. Limits: no parallel fed control, constant light,
   pixel activity. A design waits on whether the Stroeymeyt feeding times vary independently (inventory).
4. **Clock versus elapsed time (H7, H8).** Support: one constant-light experiment (Cole & Cheshire 1996) and a
   day/night contrast (Richardson 2017). It bears on C4 and F108's open confound (P83). A design waits on whether the
   Stroeymeyt recording starts and lighting vary independently (inventory).

**Not proposed for a test now:** H1 as a minutes-scale physical driver (no ant evidence at that scale; the air-screen
result bears only on an airborne within-nest signal, in one species, and does not exclude common physical inputs
generally); H3's refractory cycles as such (periodicity in our data is unresolved, *M. rubra* showed none at 10-min
sampling, and refractoriness is shown only in a deferred abstract); H5 (its one direct test is in a deferred paper).

## Limits of this review

- Eight full texts, mostly *Leptothorax*, a genus with regular ~20-min cycles; whether *L. niger* has periodic
  structure is unresolved (F012, P80). No *Lasius* synchrony study was found (D234).
- Several key results rest on small samples (Cole 1991 JIB: 23 interactions; Franks 1990: four starved colonies;
  Despland & Simpson: four replicates per pattern) or on unpublished remarks (Franks 1990 on pulses under starvation).
- None of the studies measured co-presence and coupling separately, so C1's "through coupling" is unknown throughout.
  None measured a distance profile like F107's, so C3 is unknown or silent.
- The two Doering papers, the most direct tests of queens, density and refractory rest, are deferred (P130).
