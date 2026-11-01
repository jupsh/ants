---
id: D235
date: 2026-11-01
time: 17:16
kind: decision
title: User: Q28 answered (D234): Vaes & Detrain 2022, Cole & Cheshire 1996 and Cole 1991 (J Insect Behav) added to tier 1 under the existing verification and hash-pinning rules; both Doering papers deferred pending data-provenance clarification; seven tier-1 papers, the eighth slot left unused; stage-1 records approved for commit
authority: user
scope: Q28 T058
---
- **2026-11-01 ≈ 17:16 UTC — User: Q28 answered (D234): Vaes & Detrain 2022, Cole & Cheshire 1996 and Cole 1991 (J Insect Behav) added to tier 1 under the existing verification and hash-pinning rules; both Doering papers deferred pending data-provenance clarification; seven tier-1 papers, the eighth slot left unused; stage-1 records approved for commit.**
  - **User (verbatim, its DOI links shown as plain DOIs; adopted). It answers Q28 on D234:**
    > My decision: **add Vaes & Detrain 2022, Cole & Cheshire 1996, and Cole’s 1991 phase-response paper**, under the existing verification and hash-pinning rules. Defer both Doering papers pending data-provenance clarification. That gives seven tier-1 papers; leave the eighth slot unused.
    >
    > **Approve committing the stage-1 records now**, with this Q28 answer recorded by the lead.
    >
    > | Paper | DOI | Decision |
    > |---|---|---|
    > | Richardson et al. 2026 | 10.1038/s42003-026-10560-x | Already cleared |
    > | Franks et al. 1990 | 10.1007/BF02462100 | Already cleared |
    > | Cole 1991, *Proc R Soc B* | 10.1098/rspb.1991.0079 | Already cleared |
    > | Richardson et al. 2017 | 10.1371/journal.pcbi.1005527 | Already cleared |
    > | Vaes & Detrain 2022 | 10.1371/journal.pone.0273087 | Add |
    > | Cole & Cheshire 1996 | 10.1086/285908 | Add |
    > | Cole 1991, *J Insect Behav* | 10.1007/BF01054607 | Add |
    > | Doering et al. 2019 | 10.1093/beheco/arz135 | Defer |
    > | Doering et al. 2022 | 10.1098/rsos.211908 | Defer |
    > | Leaf-cutter resynchronisation, 2025 | 10.1038/s42003-025-08117-5 | Abstract only |
    > | Mildner & Roces 2017, *Camponotus* | 10.1371/journal.pone.0169244 | Abstract only |
    > | Napoli, Garnier & Porfiri 2026 | 10.1103/ghnl-p5c1 | Rereading already approved |
    >
    > all those were added to root folder. let me know if i missed any
  - **Effect:**
    - Q28 is answered. Tier 1 is seven papers; the eighth slot stays unused. The three additions take effect, as
      the first four did, only once their checks (identity, notices, held-out overlap) have passed and been logged
      (P120, P121), and each PDF is opened only after its SHA-256 is pinned in `docs/literature.json` (P122's rule,
      applied to every cleared paper).
    - Doering et al. 2019 and 2022 are deferred, not rejected; they return if their data provenance is clarified.
      The leaf-cutter 2025 and Mildner & Roces 2017 papers stay abstract only.
    - The stage-1 records (D234, X024, Q28) and this entry are committed together.
  - **2026-11-01 — checks of the three additions passed (P120, P121):** no correction or retraction notice in Crossref,
    the Retraction Watch fields, PubMed (Vaes & Detrain) or OpenAlex. Identity from Crossref and OpenAlex: Vaes &
    Detrain 2022, *PLoS ONE* 17:e0273087 (own *Myrmica rubra* colonies); Cole & Cheshire 1996, *Am Nat* 148:1–15
    (*Leptothorax allardycei*); Cole 1991, *J Insect Behav* 4:129–137, sole author Blaine J. Cole (species not in the
    metadata; published before any held-out set was collected, the earliest being Portha et al. 2004). None can
    analyse a held-out set. **All three cleared.**
  - **2026-11-01 — the user's PDFs (repo root), identified by file name, PDF metadata and page count only:**
    - Six cleared papers, moved to `literature/` and pinned in `docs/literature.json` before any was opened:
      Richardson et al. 2026 (14 pp.), Franks et al. 1990 part I (16 pp., matching 597–612; PDF title "…I. Discovering
      the phenomenon and its relation to the level of starvation"), Cole 1991 *Proc R Soc B* (7 pp., matching 253–259; filed as `Cole1991b_…`, since `Cole1991` is the *Am Nat* paper;
      a scan with no text layer, so its title is checked on the page image at stage 2), Richardson et al. 2017 (17
      pp.), Vaes & Detrain 2022 (22 pp.), Cole & Cheshire 1996 (15 pp.).
    - **Missing:** Cole 1991, *J Insect Behav* (doi:10.1007/BF01054607).
    - **Not on the list:** `rspb20063471.pdf`, doi:10.1098/rspb.2006.3471, which Crossref gives as Despland & Simpson
      2006, *Resource distribution mediates synchronization of physiological rhythms in locust groups* (a title seen
      in X024). Not cleared and not opened; left in the repo root for the user.
