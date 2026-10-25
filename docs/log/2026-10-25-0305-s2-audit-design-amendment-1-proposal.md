---
id: D146
date: 2026-10-25
time: 03:05
kind: design
title: S2 audit design amendment 1 (proposal, D145 made concrete; awaiting the user's confirmation, nothing built or run): complete-block support, per-ant-per-block shifts with a recovery check V5 and a pairwise-shift fallback, masks under A, matched-support reference classing, a two-step Monte Carlo budget with an unresolved verdict, the floor and gate on common colonies, amended V1 and V3; the descriptive simulated set unavailable
---
- **2026-10-25 ≈ 03:05 UTC — S2 audit design amendment 1 (proposal, D145 made concrete; awaiting the user's confirmation, nothing built or run): complete-block support, per-ant-per-block shifts with a recovery check V5 and a pairwise-shift fallback, masks under A, matched-support reference classing, a two-step Monte Carlo budget with an unresolved verdict, the floor and gate on common colonies, amended V1 and V3; the descriptive simulated set unavailable.**
  - **Status: proposal.** It makes D145's amendments to D136 concrete. Every value is proposed and binds only on the
    user's confirmation; D136 holds where this entry is silent. Nothing is built or run; the output folder stays sealed
    (P22). Wording of results: D145 items 1 and 6 (P34).
  - **Inputs, two discrepancies with D136 (found reading file structure only, no statistic computed):**
    - **D136's descriptive simulated set has no S2 series.** The `pc-ver-*` files carry no `ydist`; only
      `pc-sep-{base,Eu,El20}` do. Proposed: the descriptive set is dropped, no new simulation.
    - **Simulated files are two 4-h light-phase replicates per colony** (`r0`, `r1`), not light and dark files. They
      are pooled by colony label as `ydistAgg.ts` does. The data are ≈ 24 h, light and dark. This asymmetry was already
      present in D122's base comparison and is disclosed again.
  - **Support: complete 4-h blocks only.** The data's first and last blocks are partial (2–239 bins); each simulated
    file ends with a one-bin block. Every audit statistic (observed, J, A, reference) uses only complete 240-bin
    blocks, so observed and null values share support and a circular shift is defined. The continuity check (data =
    D122) is run on the full support as built. The audit's observed L is reported beside it.
  - **Shift rule J (provisional, D145 item 2):** each ant's series (deviation, positions, both masks) is rotated
    within each complete block by its own τ, drawn per ant **and per block**, uniform on 30–210 bins;
    `RNG.stream(0x52a0, set, file, draw, ant, block)`. Deviations come from the unshifted series; rotation keeps each
    ant's block mean.
    - **Disclosed:** under this rule ≈ 30 % of pairs fall within 30 bins of each other (≈ 10 % within 10), so a
      persistent coupling partly survives in E_J and S2_J is biased toward zero.
    - **Fallback J′ (pairwise relative shift):** for each pair, j's series is rotated against i's by its own δ_ij,
      uniform on 30–210 (`RNG.stream(0x52a1, set, file, draw, i, j, block)`). This gives every pair at least 30 bins of
      separation. A draw's C(band) is still the pooled ratio over its pair-bins.
    - **Freezing rule (V5, before any audit statistic):** J is primary if it meets the V5 recovery criterion at every
      persistence level; otherwise J′ is primary and J is reported as descriptive. The choice is made on synthetic
      results only and written here before the run (P31).
  - **Null A, masks:** deviations and the activity mask are rotated as in J. Positions and the position mask stay at
    the true bin. A pair-bin is eligible under A if both ants have valid activity at their rotated source bin and a
    detected position at the true bin. Observed and J: both masks at the same (rotated) bin; activity valid implies
    detected.
  - **Reference classing on matched support (D145 item 3):**
    - Reference position: all detections in bins k − 15 … k − 6 of the same block pooled (Σ positions / Σ detections,
      so bins are weighted by detections). It exists if at least 5 of the 10 bins have a detection. No window wraps
      or crosses a block boundary, so bins 0–14 of each block have none.
    - Eligible: observed-eligible pair-bins where both ants have a reference position. On this set, L_same (same-bin
      classing) and L_ref are computed and contrasted. The share of observed pair-bins it keeps is reported.
    - Block-mean classing: descriptive only.
  - **Draws and Monte Carlo precision (D145 item 4; P32):**
    - Per colony, Ê_J[L] and its MC SE (SD over valid draws / √n). Set level: MC SE of the colony-mean null
      expectation = √(Σ SE_c²) / n_colonies; for data − base, the two combined in quadrature.
    - **Budget:** 100 draws per file for J (or J′) and for A. **Criterion:** a gate condition is resolved if its lower
      95 % bound is more than 2 MC SE from zero. **One extension, frozen here:** if either condition is not resolved at
      100, every set and file is extended to 400 draws for the primary null (the maximum), the extra draws on the same
      streams. Still not resolved at 400: the verdict is "unresolved". No other change of budget.
  - **Estimability (D145 item 5):**
    - A colony's statistic is defined for a set if every band has ≥ 100 pair-bins and finite, positive Σx² and Σy².
    - A null draw is valid under the same condition. Ê is taken over valid draws and needs ≥ 90 % of draws valid.
    - The colonies used: those estimable in data and in base, observed and primary null both. Fewer than 15:
      "unestimable". The same identities serve both gate conditions, with one joint colony bootstrap (2,000 draws,
      seed 0x5ea0 + set index; data 0, base 1, Eu 2, El20 3). Exclusions are listed with their reason.
    - The gate uses all pairs. Role-pair rows are descriptive.
  - **Synthetic checks** (`scripts/scratch/s2AuditTest.ts`, beside the scratch S2 code; ≥ 20 synthetic colonies of
    80 ants × 5 blocks; "≈ 0" means the 95 % synthetic-colony bootstrap interval contains 0; all must pass on the
    frozen code):
    - **V1a, transient place-linked activity** (positions along paths while moving): S2_J ≈ 0; L − L_ref reported,
      expected > 0.
    - **V1b, stable resting sites** (clustered rest sites, independent timing): S2_J ≈ 0; L − L_ref reported with no
      sign required (D145).
    - **V2, coupling:** a planted distance-dependent coupling gives S2_J > 0.
    - **V3a, homogeneous shared driver**, with heterogeneous noise: S2_J ≈ 0.
    - **V3b, spatially structured shared driver** (response strength depending on location): S2_J is reported, not
      required ≈ 0. It shows how much "decay exceeding the joint-shift null" can come from a spatial driver without
      coupling. That limit is disclosed with the result.
    - **V4, identity:** τ = 0 reproduces observed values exactly (J and J′). Rotations preserve block means and
      detected-bin counts.
    - **V5, recovery under persistent signals:** a two-state activity process with mean bout lengths 2, 10 and 30 bins
      and V2's coupling. Recovery = (mean S2_J with coupling − mean without) / (mean L with coupling − mean without),
      paired seeds. **Criterion: ≥ 0.8 at every level.**
    - **V6, reader:** unestimable with 14 common colonies, unresolved under the MC criterion, exclusions listed.
  - **Then:** the user confirms or amends this entry. The code is built, the synthetic checks are run, the J / J′
    choice and the script hashes are frozen here, and the run starts (P33). Stages 1–3 stay held.
