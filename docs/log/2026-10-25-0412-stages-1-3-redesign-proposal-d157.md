---
id: D158
date: 2026-10-25
time: 04:12
kind: design
title: Stages 1–3 redesign (proposal, D157; awaiting the user's approval, nothing built or run): S2's five light-phase C bands and five excess-over-J bands as assessment rows with frozen tolerances, a shared-signal member with an entrance-gradient response (Es), reproduction read before any discrimination, a simulation-only capability test of a frozen diagnostic, carried disclosures and preconditions
---
- **2026-10-25 ≈ 04:12 UTC — Stages 1–3 redesign (proposal, D157; awaiting the user's approval, nothing built or run): S2's five light-phase C bands and five excess-over-J bands as assessment rows with frozen tolerances, a shared-signal member with an entrance-gradient response (Es), reproduction read before any discrimination, a simulation-only capability test of a frozen diagnostic, carried disclosures and preconditions.**
  - **Status: proposal.** It revises D126 amendment 1's Stages 1–3 under D157. D126 amendment 1 holds where this entry
    is silent. Values marked **[confirm]** are the lead's and bind only on the user's approval. No model run starts
    before this design is frozen (D157).
  - **Question, in two parts asked in order (D157 item 3; P43):**
    1. **Reproduction:** which tested members reproduce synchrony magnitude, timescales and the spatial profile
       together?
    2. **Discrimination, conditional (D157 item 4; P44):** only if a frozen diagnostic is first shown, on simulated
       members through the actual observer, to tell the transmission members from every driver member, including the
       spatially varying shared response. Otherwise the outcome is "these mechanisms remain indistinguishable with these
       observations", with the measurement list.
    - **Evidence class:** development only. Every data value used here is already read (D122, D130, D156).
  - **Members (diagnostics behind switches, off by default, never adoptable), all under the common mapping M**
    (walk-on × g, stop × 1/g, g clamped to [0.25, 4]; D126 amendment 1):
    - **T (transmission):** T10f, T20f, T10m, T20m (`relay`, r {10, 20} mm × τ_c {5, 20} s), as amendment 1.
    - **D (drivers):** Eu-M, El20-M, Ed2, Ed5, Ed20, Ew5, as amendment 1, **plus Es (new, D157 item 2; P42):**
      - **one shared temporal signal:** Eu's process, a unit OU signal z(t) with τ 60 s on its own RNG stream;
      - **spatially varying response:** g_i = exp(A·β(x_i)·z − (A·β(x_i))² / 2). ~~so E[g | x] = 1 at every position~~
        **Corrected (D159):** the mean multiplier is 1 at a fixed position under the stationary signal, before clipping.
        Neither the clipped multiplier nor the one experienced along moving ants' trajectories is guaranteed to average
        1; both are reported;
      - **response map, fixed now [confirm]:** β(x) = exp(−d_e(x) / λ) / mean_nest(exp(−d_e / λ)), with d_e the
        distance from the nest entrance (the passage mouth, (35, 40) mm in the 70 × 40 mm nest) and λ = 20 mm. Response
        is strongest by the entrance, where external disturbances (airflow, light, vibration along the passage) would
        enter, and β averages 1 over the floor (floor-area normalisation). **(D159: the entrance rationale is a
        hypothesis; V3b did not establish this map.)**
      - It is a bounded competitor, not a biological model. V3b showed that the possibility exists (F094); it supplies
        neither this map nor a calibration.
      - **Tests:** A = 0 is bit-identical to base; λ = ∞ (β ≡ 1) is bit-identical to Eu-M; Monte Carlo gives
        E[g | x] = 1 at fixed positions; the map's mean over a fine grid is 1.
    - **Controls:** base (no mechanism); Eu and El20 historical (walk-on only, D121 strengths; verdicts D122 unchanged,
      outside the primary comparison).
    - Members: T 4, D 7 (11 primary). The counts are reported with every verdict.
  - **Statistic roles (frozen before any new member runs; P41) [confirm]:**

    | Role | Rows | Tolerance |
    |---|---|---|
    | Calibration | D_w all ants, 1 min | 4.15 ± 0.30 (strength only, per member) |
    | Assessment: magnitude, timescales | S1: the other 8 D_w cells | ±20 % |
    | Assessment: raw profile | S2: C in the 5 bands (< 5, 5–10, 10–20, 20–40, ≥ 40 mm) | ±0.015 absolute |
    | Assessment: audited profile | S2-J: C − Ê_J[C] in the same 5 bands | ±0.015 absolute |
    | Assessment: kept rows | S3₁, S3₂ | ±1.0 frame per 10 mm |
    | Capability diagnostic | below | simulation only |
    | Descriptive | S2_J, Ê_J, Ê_A, block-mean and reference classing, role-pair rows, S3-raw, S3-pair, S3-ρ, S3-p, S4–S7, mean moving fraction (> 20 % flag), realised E[g], E[1/g], g before and after clipping (P21), clipped fraction | reported, no rule |

    - **How the audited profile enters (D157 item 1):** S2 and S2-J are computed by the frozen S2 audit code (D153) on
      complete light-phase blocks for data and members alike, with 100 J draws per file. Data targets (D156, 20
      estimable colonies):
      - S2: 0.104 / 0.060 / 0.030 / 0.014 / −0.001;
      - S2-J: 0.088 / 0.052 / 0.030 / 0.017 / 0.010.
      - The far band (≥ 40 mm) is two rows (C and C − Ê_J), so a member that matches S2_J with the wrong far end, as
        El20 does (C(≥ 40) 0.017 against −0.001, D156), ~~fails a row~~ **(D159)** is caught by them under the frozen
        interval rule: a point difference beyond 0.015 may be outside or unresolved, never outside by itself. The raw
        and corrected bands are dependent, so their agreement is not ten independent confirmations.
    - **20 rows. Joint reproduction is demonstrated only if all 20 are equivalent** (amendment 1, all rows kept).
      Otherwise the equivalent, outside and unresolved rows are listed. Rows are never used to choose, drop or tune a
      member: every calibrated member is assessed and reported (P41).
    - **Precision forecast** (amendment 1; P28): before Stage 2b, each row's 90 % half-width for a perfect model,
      reported, never a filter. The far bands are the likeliest to be imprecise (2 data colonies already unestimable).
    - **S3 (P43):** S3₁ and S3₂ stay assessment rows as defined, and S3's failed gate G stays on record (D130). The S2
      pass does not restore S3 as an established propagation signature.
  - **Stage 1 build:** the `relay` stop channel, `driverWave` (both origin kinds), Es, mapping M for every member,
    the S2 series recorder on new runs, tests as listed, readers. Diagnostic switches are off by default and
    bit-identical when off.
  - **Stage 2:**
    - **2a calibration:** as amendment 1 (grid {0.25, 0.5, 1, 1.5, 2, 3, 4}, `diag` 0xc4b0, one refinement,
      verification `judge` 0xc4b1, 2 runs × 22; calibrated if within ±0.30). A miss is recorded and leaves the member
      ineligible.
    - **Then, before 2b:** the precision forecast, and the capability rule's threshold, specified as P29 requires
      (after calibration, before the Stage 2 assessment runs).
    - **2b assessment:** `judge` 0xc4b2, 2 runs × 22 for every calibrated member, the controls and base, with
      D117's equivalence (sim − data, independent colony resampling, 2000 draws, 90 % CI inside / beyond / across the
      tolerance).
  - **Stage 3a, reproduction reading:** row classes per member and family. A family reproduces if at least one member
    does, reported with its member count.
  - **Stage 3b, capability test (simulation only; P44) [confirm]:**
    - **Diagnostic:** amendment 1's 2-D (R, S3₂), R = mean C(20–40) / mean C(< 5), with its frozen edge rules, plus
      **R_J**, the same ratio on S2-J, as a third coordinate. R_J carries the audited profile into the diagnostic.
    - **Capability passes** if every (T, D) pair of calibrated members, Es included, is separated under the rule that
      P29 fixes before Stage 2b. That rule's false-positive rate is checked on synthetic two-arm nulls and kept ≤ 5 %.
    - **If capability fails:** ~~"these mechanisms remain indistinguishable with these observations"~~ **(D159):** "The
      specified diagnostic did not distinguish all tested transmission and driver members at this sample size." The ranked
      measurement list is the outcome (amendment 1: interventions as hypotheses, members' explicit predictions or
      "unresolved, needs modelling"), led by direct sensing of a driver and density manipulation.
  - **Stage 3c, data placement:** only if capability passes, as amendment 1: "not rejected" relative to members with
    no row outside, never "compatible" or "the cause".
  - **Carried forward, none waived (P45):**
    - common mapping M;
    - clipping disclosures (P21: the multiplier before and after clipping, clipped fraction per member);
    - phase: light only (S2 on complete light blocks; S3 on light onsets);
    - duration: data 8–12 h of light against 2 × 4 h simulated per colony, disclosed in every reading;
    - **Q03** (C2 water-init warm-up shortcut, P02) is outstanding and is the user's decision. Every member, base
      included, shares that start. The lead recommends deciding Q03 before Stage 2a, since it would otherwise be a
      disclosed limit of every comparison.
  - **Preconditions for the user to decide at the gate:**
    - **P25 (D030):** "wall behaviour and packing settled before any spatial coupling". Packing was closed with no
      further arms (T009; F027, F078 carried), and Part C ran spatial couplings after that. The lead proposes the
      disposition "settled as a closed, disclosed limitation", with C2's packing deficit (near share ≈ 0.8 of the data's)
      disclosed in every spatial reading. Whether "settled" may mean that is the user's call.
    - **Stopping rule:** amendment 1's single pass. Once any Stage 2 output is seen, no member is added and no
      parameter, grid, tolerance or seed changes.
  - **Cost (before a bench):**
    - amendment 1's ≈ 3,200 runs plus Es (≈ 264 calibration + 44 assessment) ≈ 3,500 runs, **≈ 21–25 h on a box,
      ≈ $9–11**, rebuilt from a bench and approved before rental (docs/BOX.md);
    - J draws for S2-J run locally after the box run (≈ 5 min per 150 files, D156);
    - Stage 1 build ≈ 1 day local.
  - **For the user, approve or amend:**
    1. Es and its map (entrance gradient, λ = 20 mm);
    2. the 20 assessment rows, S2-J tolerance ±0.015, joint reproduction only if all 20 are equivalent;
    3. the capability diagnostic (R, S3₂, R_J) with its threshold set after calibration;
    4. Q03 decided before Stage 2a;
    5. P25's disposition;
    6. the cost range, to be benched.
