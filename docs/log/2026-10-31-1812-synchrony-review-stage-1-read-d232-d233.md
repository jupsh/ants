---
id: D234
date: 2026-10-31
time: 18:12
kind: review
title: Synchrony review stage 1 read (D232, D233; X024): tier-1 checks passed for Richardson et al. 2026, Franks et al. 1990, Cole 1991 (Proc R Soc B) and Richardson et al. 2017, so these four are cleared; Doering et al. 2019 back to the user (identity, status and species settled, but J. N. Pruitt's role in the data is not settable from metadata); no correction or retraction notice on any paper; no Lasius synchrony paper found; four additions proposed for the user, Vaes & Detrain 2022, Cole & Cheshire 1996 (empirical, not modelling only), Cole 1991 (J Insect Behav) and Doering et al. 2022
---
- **2026-10-31 ≈ 18:12 UTC — Synchrony review stage 1 read (D232, D233; X024): tier-1 checks passed for Richardson et al. 2026, Franks et al. 1990, Cole 1991 (Proc R Soc B) and Richardson et al. 2017, so these four are cleared; Doering et al. 2019 back to the user (identity, status and species settled, but J. N. Pruitt's role in the data is not settable from metadata); no correction or retraction notice on any paper; no Lasius synchrony paper found; four additions proposed for the user, Vaes & Detrain 2022, Cole & Cheshire 1996 (empirical, not modelling only), Cole 1991 (J Insect Behav) and Doering et al. 2022.**
  - **What:** stage 1 of the focused review (D232 amendment 1; D233), in one session. Exposure is X024. The method
    used metadata APIs (PubMed, Crossref, the Retraction Watch fields, DataCite, Zenodo, OpenAlex) rather than web
    search, so no snippets came back; abstracts were printed only for other-species papers (P127). Nothing was
    downloaded (P128). Scripts and JSON are in the session scratchpad, not the repo.
  - **Tier-1 checks** (P120: a clearance takes effect only when its check has passed and been logged; P121: notices
    checked). For every paper below, Crossref lists no correction or retraction notice, the Retraction Watch fields are
    empty and OpenAlex does not mark it retracted.
    1. **Richardson, Rüegg, Pritchard, Keller & Stroeymeyt 2026**, *Commun Biol* 9:1317, doi:10.1038/s42003-026-10560-x
       (PMID 42365176). Species *Leptothorax acervorum* (abstract; the data deposit's description). Data: the paper's
       own deposit, Zenodo 10.5281/zenodo.15020313 (2025, CC-BY 4.0, one 12.7 GB archive, not downloaded); no
       held-out term (*Lasius*, *niger*, Stroeymeyt 2018, age experiment, Bonavita, Mailleux) in its description or
       file name. Every held-out set is *L. niger*, so none can be its source. **Check passed: cleared.**
    2. **Franks, Bryant, Griffiths & Hemerik 1990**, *Synchronization of the behaviour within nests of the ant
       Leptothorax acervorum (Fabricius)—I. Discovering the phenomenon and its relation to the level of starvation*,
       *Bull Math Biol* 52:597–612, doi:10.1007/BF02462100 (Elsevier's record of the same article:
       10.1016/S0092-8240(05)80368-4). D232's citation is confirmed. **Check passed: cleared.**
    3. **Cole 1991**, *Is animal behaviour chaotic? Evidence from the activity of ants*, *Proc R Soc B* 244:253–259,
       doi:10.1098/rspb.1991.0079. Crossref lists no author; OpenAlex gives Blaine J. Cole. D232's citation is
       confirmed. **Check passed: cleared.**
    4. **Doering, Sheehy, Lichtenstein, Drawert, Petzold & Pruitt 2019**, *Behav Ecol* 30:1682–1690,
       doi:10.1093/beheco/arz135 (PMID 31723317). Identity and publication status settled (no notice). Species
       *Temnothorax rugatulus*; data on Dryad, doi:10.5061/dryad.4b92t21 (2020), so no held-out overlap. **Not
       settled:** J. N. Pruitt is last author, and many of his papers were retracted or corrected over data integrity
       (2020–2022). The metadata cannot show who collected or handled these data, which is what his co-authorship puts
       in question. **Back to the user unread** (P120).
    5. **Pamplona-Barbosa, Toledo, Oda & Helene 2025**, *The cost of re-synchronization in a leaf-cutter ant colony*,
       *Commun Biol* 8, doi:10.1038/s42003-025-08117-5 (PMID 40775541; an SSRN preprint, *The cost of
       re-entrainment…*, 2023). Abstract only, as decided. One laboratory colony, machine-learning video tracking,
       daily foraging rhythm, a 6-h light–dark phase shift and resynchronisation over a few transient days.
       Observational and one manipulation; a daily, foraging-arena timescale, far from the 10-min in-nest deficit.
    6. **Mildner & Roces 2017**, *PLoS ONE* 12:e0169244 (PMID 28099496). Abstract only, as decided. *Camponotus
       rufipes*, isolated workers against the social context, 1656 h of video, feeding windows by day or night:
       foragers entrain to feeding time; nurses are arrhythmic in the colony and rhythmic in isolation.
       Experimental, at the circadian scale.
    7. **Richardson, Liechti, Stroeymeyt, Bonhoeffer & Keller 2017**, *PLoS Comput Biol* 13:e1005527,
       doi:10.1371/journal.pcbi.1005527 (PMID 28489896). Species *Leptothorax acervorum* (Dryad subjects, doi:10.5061/
       dryad.65q64, the authors' deposit); nine colonies tracked. No held-out overlap. Crossref's only update record is
       PLOS's "new version" link to itself (2017-05-24), a version marker, not a correction. **Check passed: cleared.**
    8. ***Lasius* work:** none found on activity cycles or synchrony. The *L. niger* records found (foraging under
       heat or urban stress; da Silva et al. 2026, Trigos-Peral et al. 2024) are about foraging, not in-nest
       synchrony, and are not proposed (P123).

    Cleared so far: four of at most eight (1, 2, 3, 7). Stage 2 needs their PDFs in `literature/`: the lead downloads
    nothing, so the user places them and the lead pins each SHA-256 before opening it (as for Napoli, P122).
  - **Tier 2, identified (metadata or abstract; no clearance):** Goss & Deneubourg 1988, *Insectes Soc* 35:310–315;
    Hemerik, Britton & Franks 1990, *Bull Math Biol* 52:613–628; Solé, Miramontes & Goodwin 1993, *J Theor Biol*
    161:343–357; da Silveira & Fontanari 2024, *Math Biosci* 375:109245 (delay equations; limit cycles need a long
    rest period and rare spontaneous activation); Fontanari & Campos 2025, *Physica A* 679:130990; Napoli, Sipahi &
    Porfiri 2026, *J Theor Biol*, doi:10.1016/j.jtbi.2025.112286 (model with a reanalysis of published *Temnothorax
    rudis* data: burst period nearly independent of colony size); Doering et al. 2024, *PNAS* 121:e2420078121 (22
    species, over 1500 rhythm time series: **empirical and comparative**, not modelling only, P124).
    - **Cole & Cheshire 1996**, *Am Nat* 148:1–15, is **empirical as well as modelling** (P124). In artificial
      aggregates of *Leptothorax allardycei*, 126 records of 11.5 h, it varied aggregate size and brood and recorded
      the time of day: without brood, size affects periodicity, mostly by day; with brood, periodicity rises linearly
      with size and the time of day has no effect. That bears on density and on C4.
  - **Additions found by the search, proposed for the user** (not cleared; the lead's ranking for the slots left
    under the ceiling):
    1. **Vaes & Detrain 2022**, *PLoS ONE* 17:e0273087 (PMID 35960741): *Myrmica rubra*, 15 days, food deprivation.
       Starvation raised the amplitude and number of synchronised bursts, and wavelets found **no periodicity**.
       This is an experimental test of H4's starvation link, in a temperate, non-cycling species likely closer to
       *L. niger* than *Leptothorax*. Detrain co-authored the Mailleux et al. 2011 papers, but this paper's data are
       its own *M. rubra* colonies.
    2. **Cole & Cheshire 1996** (above): moved from tier 2 if the user agrees.
    3. **Cole 1991**, *Short-term activity cycles in ants: a phase-response curve and phase resetting in worker
       activity*, *J Insect Behav* 4:129–137, doi:10.1007/BF01054607 (no abstract available). A phase-response
       experiment is the kind of evidence that could set up the H3 / H2 contrast struck from D232 (P119).
    4. **Doering et al. 2022**, *R Soc Open Sci* 9:211908 (PMID 35291326): two *Leptothorax* species, 35-h
       recordings, periods from 16 min to 2.8 h in one colony, workers stimulated into activity after a refractory
       rest of variable length; empirical and agent-based. Pruitt is a co-author, so the same question as Doering
       2019 applies.

    Also found, not proposed (circadian or other scales, or weaker fit): Cole 1992 (*Behav Ecol Sociobiol* 31, age
    and tempo; a candidate if a slot is left), Fujioka, Abe & Okada 2021 (*Diacamma*, individuals arrhythmic in the
    colony, also after brood removal), Lone & Sharma 2011 and Sharma et al. 2004 (*Camponotus*, social entrainment of
    circadian rhythms), Jud, Knebel & Ulrich 2022 (month-long brood cycles), Doering, Lee & Dalnoki-Veress 2023
    (*Leptothorax*, synchrony and access to the nest), Nicolis et al. 2013 (*PRL*, internal clock against external
    forcing, a model with field data), Berberich et al. 2019 (*Formica*, field mounds).
  - **For the user (Q28):** whether Doering et al. 2019 is cleared despite the unresolved data-handling question, and
    which additions take the slots left under the ceiling.
  - **Not done:** no paper opened beyond its abstract, no full text placed, no review table written (P115, P125).
    Napoli et al. 2026 is pinned (D233) but not yet re-read.
