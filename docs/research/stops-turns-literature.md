# Stops, turning and speed in walking ants: literature check

Labels used throughout:
- **[S]** stated in the cited source (full text, or the part of it I could load).
- **[A]** abstract or publisher summary only.
- **[N]** search-result snippet only; the source would not load. Verify before relying on it.
- **[C]** computed from the Khuong et al. 2013 data (see the STATUS decisions log, 2026-10-08).
- **[I]** inferred by me; not stated anywhere.

_Compiled 2026-10-08 (session 3) while the step-5 fits of A0 and candidate T were running. Purpose: outside support (or not) for the mechanisms in candidate T (turn-linked slowing, heading reset at pause onset, homeward pull at stops) and context for G (homing on slopes). Bonavita et al. 2026's **new experiment is held-out data**: only their re-analysis of the Khuong flat-ground data was read._

---

## 0. Key points

- Reorientation tied to pauses is a recognised pattern in walking insects (locusts; a run-and-tumble model of *Anoplolepis gracilipes* with waiting phases; stop-and-scan in desert ants). None of these sources measures it for *Lasius niger*.
- Ants turn by shortening the inner stride, so the body centre is slower in turns (Zollikofer 1994; Choi et al.). A speed–tortuosity trade-off is reported in leaf-cutter ants. Both support T's turn-linked slowing as a mechanism class; none gives a time course comparable to ours.
- One recent model (Freas & Wystrach 2025, not read) reportedly runs the causality the other way: forward speed is inhibited and turning follows. That would explain the reset at stops and the speed–turning coupling with one mechanism. The two directions are distinguishable in our data (§2).
- Bonavita et al. found turn-back bias and direction-dependent run lengths around the release point on flat ground; our stop analysis suggests part of that homing is expressed at stops and reversals.
- For G: the desert-ant literature reports accurate path integration on hills and reliable slope estimation up to 45°, so "homing suppressed on slopes" has no direct literature support; it says nothing about *Lasius* or search on slopes.

## 1. Reorientation at pauses

- **Desert locusts** (Bazazi, Bartumeus, Hale & Couzin 2012). Direction changes are concentrated in pauses: "the mean proportion of pauses with changes in direction from total bouts (moves and pauses) with changes in direction is 0.8609" [S]. Short pauses (< 6 s) act mainly as rests; long ones (> 100 s) are reorientation bouts [S]. Move and pause durations are power-law over about 1.5 decades (μ 1.49 and 1.67) [S].
  - Relevance: same mechanism class (reorient while stopped). Time scales differ by one to two orders of magnitude from our 0.1–0.8 s stops, and our data show **no** dependence on stop duration above 0.13 s [C], unlike the locusts.
- ***Anoplolepis gracilipes*** (Featherstone, Béraud, Virant-Doberlet, Celani & Bandi 2026). Run-and-tumble model with straight runs, discrete reorientations and waiting periods before reorientation [S]. Turn angles von Mises (κ ≈ 0.6–1.3), run times exponential (τ ≈ 1–2.1 s), waiting times power-law (α ≈ 1.5–1.7); speed held constant for simplicity [S].
  - Relevance: an ant model in which pausing and reorienting are linked phases. Their heavy-tailed waiting times contrast with our model's exponential pauses (mean 0.7 s); the shape of the data's stop-duration distribution has not been checked [I].
- **Stop-and-scan in desert ants.**
  - Wystrach et al. 2014 (*Melophorus bagoti*): ants stop, rotate on the spot and fixate several directions; scanning frequency rises with navigational uncertainty (unfamiliar or unexpected views) [N].
  - Deeti, Cheng, Graham & Wystrach 2023: scan bouts start and end as a random-rate (Poisson) process; fixations average ≈ 397 ms and inter-bout intervals ≈ 1.7 s, both exponential [S]. They do not analyse the heading after a scan [S].
  - Relevance: sub-second stops with rotation, as in our data. If uncertainty drives stopping in *L. niger* too, stops and resets should be more frequent near the release point or early in the track [I]; testable on the Khuong data.

## 2. Speed–turning coupling

- **Stride mechanics** (Zollikofer 1994; 12 species including *Lasius*). Ants turn by shortening the inner stride; the outer stride is independent of curvature; tripod geometry is kept [A]. A slower body centre in turns follows from this [I].
- **Choi et al.** (bioRxiv 2021; Ecosphere 2023). Built on Zollikofer: "As ants shorten the inner stride length during the turn, the actual speed of body center (v_C) is always slower than straight speed" [S]. This is a model premise, not a measured dip. They also show that summing straight-line displacements underestimates distance on curved paths, increasingly with longer windows, while short windows are inflated by position error [S].
  - Relevance: the corner-cutting caveat already in STATUS (tortuous segments get a lower measured arc speed). It biases data and model alike only because simulated tracks go through the same observer and preparation [I].
- **Leaf-cutter ants** (Angilletta, Roth, Wilson, Niehaus & Ribeiro 2008), 10–40 °C: faster runners follow straighter paths; the negative speed–tortuosity relation holds within and among thermal environments [A]. "Within" means within a temperature, across individuals, not within an individual [A]. Proposed causes: inertia makes fast turning hard; slow, tortuous running may help evade predators [A].
- **Freas & Wystrach 2025** (bioRxiv 10.1101/2025.10.13.682010; eLife reviewed preprint 110165). Not read: the eLife page did not load and bioRxiv rate-limited the request. From search snippets [N]:
  - A model with central-complex steering, lateral-accessory-lobe oscillators and a downstream stochastic inhibition of forward speed produces saccades, fixations and reversals resembling *Melophorus* scans.
  - "The slower the agent moves, the more it turns for a given steering signal"; a sudden partial speed reduction gives sharper turns and sometimes loops ("voltes").
  - "Simple modulation of forward speed unifies a broad range of behaviours across ant species."
- **Two causal pictures [I]:**
  - (a) **turn → slowing** (stride mechanics; what T implements): speed falls with or after the onset of the heading change;
  - (b) **slowing → turning** (speed inhibition with a steering signal of roughly constant angular rate): speed falls first and the heading change follows; a full stop allows the largest turns, which would also produce the reset at stops.
  - **Distinguishing observation:** lead–lag between speed and heading change at a finer time resolution than the current 0.2 s windows (e.g. 0.08 s at 25 Hz, which is noise-limited; check against the tracking observer). Current result: the dip is centred on the turn and nearly symmetric on flat ground, recovering more slowly on slopes [C], which does not separate (a) from (b).

## 3. Homing around the release point and on slopes

- **Bonavita et al. 2026**, re-analysis of the Khuong flat-ground data only [S]:
  - turning-angle distributions are narrower when ants head back towards the start (mean cosine gω);
  - ants moving perpendicular to the start direction tend to turn back towards it (mean sine sω);
  - mean free paths are shorter moving away from the start than towards it;
  - their fitted model's mean squared displacement becomes sub-diffusive (area-restricted search).
  - Relevance: our checks add that the homeward redirection is concentrated at stops and reversals (out-heading towards the release point +0.21/+0.24/+0.16 at 0/20/30° vs ≈ 0 expected from geometry) [C]. Whether their sω picks up the same events is unknown [I].
- **U-turns in *L. niger*** (Beckers, Deneubourg & Goss 1992, J Theor Biol): on trails, U-turns contribute more than bidirectional trail laying to choosing the shorter path; the proportion turning back depends on path geometry and trail strength [A]. Different context (trail foragers), but U-turns are a documented *L. niger* behaviour.
- **Path integration on slopes** (*Cataglyphis fortis*; via Ronacher 2020 review):
  - homing distances match the ground (horizontal) distance, not the distance walked over hills (Wohlgemuth et al. 2001, 2002; Grah et al. 2005), with high accuracy [S];
  - slope-measurement precision is roughly constant up to 45° and breaks down at 60° (Wintergerst & Ronacher 2012) [S];
  - the review covers no non-desert ants and no search behaviour on slopes [S].
  - Relevance for G [I]: nothing here predicts weaker homing at 20–45°. Our redirection weakens between 30° and 45° [C], not at 60°, so the slope-sensing breakdown does not obviously explain it; "masked by geomenotaxis" remains open.

## 4. Implications for the candidates (my reading)

- T's ingredients have mechanism-level support (pause-linked reorientation; slower body centre in turns), but no source pins down sizes or time courses for *L. niger*. Parameter values must come from the fit.
- Before giving T a mechanistic reading, check the causal direction (§2). If speed leads, a "speed-inhibition → turning" variant could replace both the dip and the separate reset with fewer parameters [I].
- Cheap data checks suggested by the literature, none run yet:
  - shape of the stop-duration distribution (exponential vs heavy-tailed);
  - stop and reset rates vs distance from the release point and time since release (uncertainty-driven scanning);
  - speed–heading lead–lag at a finer resolution.
- G: the literature favours "intact but masked" over "suppressed" only weakly, and only for desert ants.

## Sources
- Bazazi, Bartumeus, Hale & Couzin 2012, PLoS Comput Biol 8:e1002498 — https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1002498
- Featherstone, Béraud, Virant-Doberlet, Celani & Bandi 2026, PLoS Comput Biol — https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1014069
- Wystrach et al. 2014, J Comp Physiol A — https://www.sussex.ac.uk/lifesci/insectnavigation/documents/wystrach-et-al-jcpa-2014-scanning.pdf (not read; summary from search)
- Deeti, Cheng, Graham & Wystrach 2023, J Comp Physiol A (PMC10354138) — https://pmc.ncbi.nlm.nih.gov/articles/PMC10354138/
- Freas & Wystrach 2025, bioRxiv — https://www.biorxiv.org/content/10.1101/2025.10.13.682010 ; eLife reviewed preprint 110165 — https://elifesciences.org/reviewed-preprints/110165 (not read)
- Zollikofer 1994, J Exp Biol 192:95 — https://journals.biologists.com/jeb/article/192/1/95/6796/Stepping-Patterns-in-Ants-I-Influence-of-Speed-and
- Choi, Kim, Song, Lee & Jablonski, bioRxiv 2021 (10.1101/2021.08.08.455044, pp. 1–6 read); Ecosphere 2023 (10.1002/ecs2.4693, not accessible)
- Angilletta, Roth, Wilson, Niehaus & Ribeiro 2008, Funct Ecol 22:78 — https://doi.org/10.1111/j.1365-2435.2007.01348.x (abstract)
- Bonavita et al. 2026, PLoS ONE (PMC13419209) — re-analysis section only
- Beckers, Deneubourg & Goss 1992, J Theor Biol — https://agris.fao.org/search/en/records/65dfc4d40f3e94b9e5dc267e (abstract)
- Ronacher 2020, J Comp Physiol A (PMC7192874), for Wohlgemuth et al. 2001/2002, Grah et al. 2005, Wintergerst & Ronacher 2012
