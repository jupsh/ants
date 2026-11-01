---
id: X024
title: Synchrony review stage 1 metadata search by the lead (D232, D233): 17 PubMed queries, Crossref, DataCite, Zenodo and OpenAlex; about 160 titles, 19 other-species abstracts
date: 2026-10-31
role: development (other species)
---
- **Synchrony review stage 1 metadata search by the lead (D232, D233): 17 PubMed queries, Crossref, DataCite, Zenodo and OpenAlex; about 160 titles, 19 other-species abstracts (2026-10-31 ≈ 18:11 UTC):**
  - **Who and how:** the lead, in one session, after D233. Metadata APIs instead of web search, so nothing came back
    as a snippet: PubMed E-utilities (esearch for IDs; esummary for title, authors, journal, year, DOI and publication
    type; efetch parsed in memory for MeSH terms, keywords and correction or retraction links, with the abstract
    discarded unread unless printed on purpose, below); Crossref (citations, update notices); the Crossref Labs
    Retraction Watch fields; DataCite and Zenodo (linked datasets: title, publisher, subjects, file names); OpenAlex
    (authorship, retraction flag, one abstract). Nothing was downloaded; the scripts and their JSON output are in the
    session scratchpad, outside the repo.
  - **Queries (PubMed):** the eight of D232 ("ants activity cycles synchronization"; "short-term activity cycles
    ants"; "ant colony activity waves"; "(Leptothorax OR Temnothorax) activity synchrony"; "Lasius activity rhythm";
    "ant colony rhythm (temperature OR vibration)"; "ant activity starvation synchronization"; "ants activity
    initiators") and nine for coverage ("Lasius niger activity"; "Lasius synchronization"; "Lasius circadian"; "ants
    activity waves"; "Leptothorax activity cycles"; "Temnothorax activity cycles"; "ant colony oscillations
    activity"; "ants excitable activity"; "ants activity cycles"), at most 40 or 60 IDs each; then title look-ups for
    the tier-1 and tier-2 papers in PubMed and Crossref.
  - **What was seen:**
    - **Titles, authors, journals and years** of about 160 PubMed records and 36 Crossref records, most of them
      unrelated (pest control, forensic, medical).
    - **Abstracts (19), all other species or none:** Richardson et al. 2026 and 2017 (*Leptothorax acervorum*);
      Doering et al. 2019 (*Temnothorax rugatulus*), 2022 (*Leptothorax*) and 2023 (*Leptothorax*); Doering et al.
      2024 (22 species, acorn ants); Mildner & Roces 2017 (*Camponotus rufipes*); Pamplona-Barbosa et al. 2025
      (leaf-cutter); Fujioka, Abe & Okada 2021 (*Diacamma*); Lone & Sharma 2011 (*Camponotus paria*); Sharma et al.
      2004 (*C. compressus*); Jud, Knebel & Ulrich 2022 (clonal raider ant); Vaes & Detrain 2022 (*Myrmica rubra*);
      Berberich et al. 2019 (*Formica rufa* group); Nicolis et al. 2013 (model, field colonies); da Silveira &
      Fontanari 2024 (model); Napoli, Sipahi & Porfiri 2026 (*J Theor Biol*; model and published *Temnothorax rudis*
      data); Cole & Cheshire 1996 (*Leptothorax allardycei*, from OpenAlex); and one unrelated optimisation paper
      returned by a title look-up.
    - **Richardson et al. 2026's data deposit** (Zenodo 10.5281/zenodo.15020313): creators, licence, one file name
      and size, and a pattern match over its description for species and held-out terms, printing only the matches
      (*Leptothorax*, *acervorum*). The description itself was not printed.
    - **Datasets:** Dryad subjects of Richardson et al. 2017 (doi:10.5061/dryad.65q64) and Doering et al. 2019
      (doi:10.5061/dryad.4b92t21).
  - **Held-out-adjacent records (title and authors only; no abstract read):** Mailleux, Deneubourg & Detrain 2005
    (*J Insect Physiol*, trail-laying in *L. niger*); Khuong et al. 2013 (*PLoS One*, *L. niger* trajectories on
    inclines; E1's own source, X004); Planckaert et al. 2019 (*Sci Rep*, *L. niger* trophallactic network, Bles and
    Deneubourg co-authors); Leckie et al. 2025 (*Science*, nest networks, Stroeymeyt last author); and *L. niger*
    papers outside synchrony: da Silva et al. 2026 (heat stress and foraging of incipient colonies), Trigos-Peral et
    al. 2024 (urban stressors and foraging), and toxicology, chemistry and microbiology titles. None is a held-out
    set's paper (Stroeymeyt 2018, Bonavita 2026, Mailleux et al. 2011, Portha et al. 2004); none was opened.
  - **Role:** development (other species) for the abstracts; titles only for the rest. These papers inform candidate
    mechanisms only (D232); nothing is imported, and no model, run or reading changes. Their reported results are no
    longer untouched evidence for this project.
