---
id: D136
date: 2026-10-24
time: 16:23
kind: design
title: S2 audit design (proposal, D134 item 1; awaiting the user's approval, nothing built or run): does classing pairs by same-bin mean positions create or strengthen S2's distance decay? Joint and activity-only per-ant shift nulls, reference-position classing, synthetic validity checks, a directional rule against C2 base
---
- **2026-10-24 ≈ 16:23 UTC — S2 audit design (proposal, D134 item 1; awaiting the user's approval, nothing built or run): does classing pairs by same-bin mean positions create or strengthen S2's distance decay? Joint and activity-only per-ant shift nulls, reference-position classing, synthetic validity checks, a directional rule against C2 base.**
  - **Status: proposal.** Every value below is proposed and becomes binding only on the user's approval, after which
    the output folder `logs/s2audit/` is sealed until the reading is frozen. Stages 1–3 stay held (D134).
  - **Question:** in each set, how much of the S2 profile survives after removing (i) what classing by **same-bin**
    mean positions produces without between-ant timing, and (ii) what C2 base produces through the same pipeline?
    - S2 is C(band), the normalised product of 1-min activity deviations (each ant's moving fraction minus its own
      4-h block mean), for < 5, 5–10, 10–20, 20–40 and ≥ 40 mm. Its decay is L = C(< 10) − C(≥ 40), as in
      `ydistAgg.ts`. Data (D122): 0.092 / 0.054 / 0.028 / 0.012 / 0.003.
  - **Why Stage 0's nulls do not carry over:**
    - Stage 0 permuted onset times inside episodes; S2 has no episodes.
    - The suspected artefact path is specific to S2: each ant's own activity and its position are measured in the
      same bin. Moving ants' mean positions sit on their paths, and resting ants sit at rest sites that may cluster.
      So a pair's distance class and its activity product are dependent even without any between-ant coupling (cf.
      F065: zone classing about two-thirds artefact). The data have such place–activity structure (F067, ≈ 5–9 % of
      persistence); C1/C2 do not (F070).
  - **Inputs:** existing files only, no new simulation. Data `logs/ydist/data-c*.json` (22). Sets base, Eu, El20 and
    P20 (descriptive) from the Part C files `logs/short/pc-sep-*` / `pc-ver-P20-*` (their `ydist` per-ant series),
    as Stage 0. The sets' indices and the colony pooling (light and dark files of a colony label pooled) are as Stage 0.
  - **Statistics, per colony:**
    - **S2-obs:** C(band) and L exactly as `ydistAgg.ts`. Continuity check: data values equal to D122's.
    - **Null J (joint shift; primary):** each ant's whole series (deviation, positions, detection mask) is shifted
      circularly within each 4-h block by its own τ, uniform on 30–210 bins. Pairs are classed by same-bin
      (shifted) positions. 100 draws per file, `RNG.stream(0x52a0, set, file, draw, ant)`.
      - This keeps each ant's own same-bin position–activity dependence (the suspected path), its persistence and its
        block mean. It breaks between-ant timing.
      - E_J[C(band)], E_J[L].
    - **Null A (activity shift; secondary):** as J, but positions stay at the true time, so classing uses the real
      simultaneous geometry. This breaks both each ant's own same-bin dependence and between-ant timing.
    - **Reference-position classing (S2-ref):** the observed alignment, with pairs classed by each ant's mean position
      over bins k − 15 … k − 6 (5–15 min before the activity bin). A pair without a reference position is dropped.
      Sensitivity: each ant's block-mean position.
    - **Derived:**
      - **S2_J = L − E_J[L]** (primary): decay that needs between-ant timing.
      - **E_J[L] − E_A[L]:** what same-bin classing *creates* without coupling.
      - **L − L_ref:** whether same-bin classing *strengthens* the observed decay.
      - Band-wise excesses C − E_J[C] are descriptive.
  - **Aggregation:** colony = pooled pair-bins (as `ydistAgg.ts`). Set = mean over colonies; 95 % colony bootstrap,
    2,000 draws, seed 0x5ea0 + set index. A colony is estimable if every band has ≥ 100 pair-bins in the observed and
    in ≥ 90 % of the null draws.
  - **Directional rule (as gate G, D129):** on the colonies estimable in both data and base (≥ 15, else
    "unestimable"), if the lower 95 % bound of data S2_J > 0 **and** that of data − base S2_J > 0: "S2's decay exceeds
    same-bin composition and C2 base". Otherwise: "this audit did not establish decay beyond same-bin composition and
    base". In that case S2 cannot be Stages 1–3's main spatial row as currently defined; what it would be replaced by
    is the user's call. Neither outcome says whether coupling exists.
  - **Validity checks before the run** (`test/`, synthetic, must pass):
    - **V1, artefact detectable:** independent ants with place-linked activity and simultaneous resting aggregation.
      E_J[L] reproduces the observed L (S2_J ≈ 0), and L − L_ref > 0.
    - **V2, coupling detectable:** a planted distance-dependent coupling gives S2_J > 0.
    - **V3, shared driver:** a colony-wide signal moves C at every distance, with S2_J ≈ 0.
    - **V4, identity:** τ = 0 for every ant reproduces S2-obs exactly. Shifts preserve each ant's block mean and
      number of detected bins.
  - **Known limits (disclosed):**
    - J also breaks simultaneous co-location (aggregation timing) and colony-wide drivers, so its level C(≥ 40) moves.
      L is chosen because it differences that level out.
    - Circular wrap joins a block's end to its start. Light switches fall on block boundaries (checked, D133), so no
      block straddles one.
  - **Compute:** local, a TS script beside `ydistAgg.ts`. Pair loops are O(n²) per bin; the largest colony (≈ 190
    ants, 1,441 bins) × 200 draws needs a vectorised accumulator. Estimate ≈ 1–2 h on 15 cores; it is to be timed on
    one colony first.
  - **Decisions for the user:** approve or amend the following before anything is built:
    - the shift range (30–210 bins);
    - J as primary;
    - the reference window (5–15 min before);
    - 100 draws;
    - the estimability floor;
    - the directional rule.
