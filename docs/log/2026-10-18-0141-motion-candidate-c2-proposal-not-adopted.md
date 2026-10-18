---
id: D041
date: 2026-10-18
time: 01:41
kind: design
title: Motion candidate C2: proposal (not adopted; decisions D1–D6 are the user's)
---
- **2026-10-18 ≈ 01:41 UTC — Motion candidate C2: proposal (not adopted; decisions D1–D6 are the user's).** One
  candidate, specified in full before any implementation run or fit.
  - **Structure:** C1 (k = 11, Rules in force) plus:
    - **Stage-1 latent drive** (`docs/research/latent-activity-design.md`): a per-ant OU drive on the log walk-on
      rate, mean one, in `src/sim/mind/`, read by the nest worker. It reaches both roles, with role-specific σ and a
      shared τ, and replaces the runner-level latent switch. Stage 2 (coupling) is out of C2: synchrony stays a
      disclosed limitation with the step-5 sensitivity gate and the structure-freeze blocker unchanged.
    - **The wall rule C2 uses (D4).**
    - The fixed walk-on trait (σ 0.4) stays unless D2 frees it.
  - **D1, drive parameters:** free σ_nurse [0, 2], σ_forager [0, 2] and τ log [10, 1800] s → k = 14 (λ stays 11).
    Alternative: τ fixed at 60 s (comparison L), k = 13.
  - **D2, walk-on trait σ:** fixed at 0.4 (proposed: with the drive free, a free trait σ is the main identifiability
    risk) or free [0, 1.5]. The new spread and persistence rows pull it opposite ways (23:35 note).
  - **D3, rest form:** Lomax kept. Either restShape [0.2, 50] as in C1 (infinite-mean rests allowed), or (1, 50]
    (a finite-mean isolated rest, the 2026-10-16 ≈ 23:30 rule). Proposed: (1, 50]. With the drive free, heavy-tailed
    observed rests no longer need an infinite-mean isolated rest, and an infinite mean makes the window gate and the
    step-5 transfer (longer 1999 runs) depend on the tail. Cost: a fit that pins near 1 fails the adoption rule's
    box-end condition, which is itself informative.
  - **D4, wall rule:** specular (W-spec), promoted from the runner switch to a model parameter of the nest walls
    (tests: the default edge-following stays bit-identical), or C1's edge-following. Proposed: specular, disclosed
    as a geometric rule chosen by a diagnostic guard and not a validated biological wall response. Edge-following
    puts ≈ half the ant-frames in a 3-mm wall band, unlike the data.
  - **Targets (D5):** the 32 rows plus the four compact persistence rows (2026-10-16 ≈ 23:35 proposal): per group,
    persistence (Spearman across ants of moving fraction, first vs second 3 h of the 6-h light window, Fisher-z mean
    over colonies) and spread (moving-time share of the top 20 % of ants). Each is an ordinary row with weight 1
    and SE across colonies; no lag series. Both are computed through the frozen tracker with shared code promoted
    to `src/sim/analysis/`. Data role: fit (inspected when σ 0.4 was chosen; logged). 36 rows in total.
  - **Before fitting:**
    - tests: σ = 0 bit-identical; mean one; both roles reached; wall-parameter defaults;
    - rows computed on the data and the start point;
    - the dt and window gates rerun at the start point under their unchanged rule (a failing gate goes to the user
      before any setting changes).
  - **Budget and stopping (D6):** C1's two-phase rule unchanged. Phase 1: dt 0.1, 2 + 2 h, both starts, cap 30
    generations. Selection batch. Phase 2: full settings, σ 0.5, cap 60 generations, tolX 0.03. Estimate:
    mean of the last 20 generation means. No restart, no extension; the cap ends it (C1 took 20.8 h on the box at the
    same λ). Launch only on the user's go.
  - **Whole-model judgment (fixed now):**
    - Fresh seeds, combinedZ, rows reported by family beside C1.
    - **Adequate** = the existing form applied to the 36 rows: no row |z| > 3, at most 2 in (2, 3], no free parameter
      at or within 5 % of a box end. The irreducible phase floor is disclosed beside, not subtracted.
    - Exception proposed for the user: σ_drive at its lower bound 0 is read as "the drive is not supported for that
      role", not as a bound failure.
    - Checks at the optimum: the spread rule, crowding, stays and trips, packing and contacts (disclosed, not
      judged).
    - **Outcome:** adequate → step 5 with C2's motion fixed. Not adequate → failing rows and the comparison with C1
      reported, then an explicit user decision: proceed provisionally (with C2 or C1) or stop step 4. No further
      mechanism is added automatically.
  - **Out of C2:** stage-2 coupling, packing / aggregation, speed fluctuation, the parked literature structures.
  - **Also flagged for step 5:** the synchrony sensitivity gate specifies κ = 1, set when the oracle reached nurses
    only. With foragers coupled, κ = 1 overshoots the data's synchrony (22:56). The gate's setting needs a decision
    before step 5 (not now).
