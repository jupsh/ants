---
id: D166
date: 2026-10-26
time: 01:22
kind: design
title: Part D precision forecast, method fixed before computing (D165 items 2-3; P56, P57; D126's formula, D158): all 20 rows, a perfect model's 90 % half-width from the data and Part C's base, Eu and El20 per-colony spreads at 2 runs x 22; Monte Carlo SE of the S2-J rows; descriptive labels, never a filter; unresolved where the sources cannot support a forecast
---
- **2026-10-26 ≈ 01:22 UTC — Part D precision forecast, method fixed before computing (D165 items 2-3; P56, P57; D126's formula, D158): all 20 rows, a perfect model's 90 % half-width from the data and Part C's base, Eu and El20 per-colony spreads at 2 runs x 22; Monte Carlo SE of the S2-J rows; descriptive labels, never a filter; unresolved where the sources cannot support a forecast.**
  - **Purpose:** the precision forecast D158 requires (amendment 1, "reported before Stage 2 and never a filter"), done
    now, before any further Part D member simulation (D165 item 2; P56), with the content D165 item 3 sets (P57). Fixed
    here before any number is computed.
  - **Rows (all 20, D158):** S1, the 8 D_w cells other than all ants at 1 min (all, nurse, forager × 5 s, 1 min, 10 min,
    less all × 1 min), tolerance ±20 % of the data value; S2, C in the 5 bands, ±0.015; S2-J, C − Ê_J[C] in the same 5
    bands, ±0.015; S3₁ and S3₂, ±1.0 frame per 10 mm.
  - **Evidence sources (all already read; no Part D member output):**
    - data: S1 from `logs/short/data-c*.json` (light clock blocks, as Part C's reader); S2 and S2-J from the S2 audit's
      data files (`logs/s2audit/files`, complete light-phase blocks, 100 J draws; D156); S3₁, S3₂ from the Stage 0 S3
      audit's per-colony values (`logs/partd/s3audit.json`, primary, equal weights; D130);
    - simulation proxies for a perfect model's spread: Part C's separation arms **base, Eu and El20** (judge 0xc4a2,
      2 runs × 22, 4 h light after a 2-h warm-up: the design Stage 2b uses), through the same three readers (D122,
      D130, D156);
    - not used: the D164 smoke's outputs (sealed in `.claude/sealed-paths.txt`) and its selected strengths (P57).
  - **Computation, per row:**
    - colony values as each reader defines them; the set value is the mean over that set's estimable colonies;
    - SE_data and SE_sim(a), a ∈ {base, Eu, El20}: SD of 2,000 colony-bootstrap means;
    - **h_formula** = 1.645 · √(SE_data² + max_a SE_sim(a)²) (D126's attainability formula);
    - **h_boot(a)**: half the 5–95 % width of D117's difference distribution (sim − data, colonies resampled
      independently, 2,000 draws); the width does not depend on the arm's mean, so it is a perfect model's;
    - **forecast half-width h** = max(h_formula, max_a h_boot(a));
    - **P_eq**, the chance that a perfect model's 90 % interval lies inside ±tolerance, normal approximation:
      2Φ(tol / SE − 1.645) − 1 (0 when negative), SE = √(SE_data² + max_a SE_sim(a)²);
    - **S2-J only, Monte Carlo SE** of the set mean from the 100 J draws per file (per colony, the variance of C(J_d)
      over draws divided by the draw count), for data and each arm, and h with it added in quadrature. P47's
      boundary-adapted Monte Carlo rule is separate and still fixed before assessment.
    - Bootstrap streams `RNG.stream(0xf0c0, row, set)`.
  - **Labels (descriptive; a label never removes a row from the all-20 requirement and never selects, drops or tunes a
    member):**
    - **precise:** h ≤ 0.5 · tol; **marginal:** 0.5 · tol < h < tol;
    - **not attainable at this sample size:** h ≥ tol; a perfect model could not be shown equivalent on the row, so
      joint reproduction would be unattainable; the row can still be outside or unresolved, and stays in the
      requirement;
    - **forecast unresolved:** fewer than 15 estimable colonies in the data or in any proxy arm for the row, or the
      largest proxy SE_sim more than twice the smallest (the spread depends on the mechanism, so these proxies do not
      forecast a new member's).
  - **Assumptions and limits, reported with the forecast:** a perfect model's between-colony spread at 2 × 4 h per
    colony is taken as the largest of three Part C arms; members with stronger coupling may spread more. P47's common
    colony support is not fixed yet: each set uses its own estimable colonies. The S1 tolerance uses the data's point
    value. P_eq is a normal approximation. Duration (data 8–12 h of light, simulation 2 × 4 h) enters only through the
    observed SEs.
  - **Output:** `scripts/scratch/partDForecast.ts` (local) → `logs/partd/forecast.json`; read in its own entry.
