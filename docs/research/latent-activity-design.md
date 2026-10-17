# Per-ant latent activity state: design proposal (step 4 desk work)

_Drafted 2026-10-17 ≈ 16:25 UTC for the user; a proposal, not adopted. Context: STATUS Decisions log, comparison L
(14:35), the nurse-only defect (16:18), comparison Y (16:19)._

## What the diagnostics showed

- **Comparison L:** a slowly varying per-ant multiplier on the walk-on rate (OU on the log scale, SD 1, τ 60 s, mean
  one) improved the nurse rows (nurse T2 +0.04; P2 / P10 |z| 34 → 27 / 59 → 47) at matched realised activity, without a
  stillness cost, and kept 6-h persistence (0.44; data 0.43). A constant higher rate did not.
- **Defect (16:18):** that switch scaled `P.nest.restToActive` only, and foragers have their own value, so it never
  reached foragers. "Nurse-only" was by construction. Whether foragers gain is unknown.
- **Comparison Y:** the data's co-movement between ants decays smoothly over 1–4 cm; the model's is contact-range only.
  Independent per-ant states cannot produce that (L's arms left synchrony and contacts unchanged).

## Proposed mechanism (two stages, the second optional)

**Stage 1: independent latent drive (replaces the runner switch).**
- Mind state `m.drive` (log scale), per ant, evolving as an OU process: dx = −x/τ dt + σ·√(2/τ) dW. The walk-on rate is
  `restToActive × walkOnFactor × exp(x − σ²/2)` (mean one, as `meanOne`). The fixed trait `walkOnFactor` (σ 0.4,
  hours) stays as the slow component; the drive is the fast one (τ ≈ 1 min).
- **Both roles**, with role-specific σ (nurse, forager) and a shared τ to start; σ = 0 is bit-identical (test).
- Randomness from the ant's own per-purpose stream (`RNG.stream(seed, purpose, ant)`), so adding the drive does not
  shift other draws.
- Lives in `src/sim/mind/` (state) and is read by `lasiusNestWorker` (allowed: behaviour reads mind). It is updated once
  per step by the policy from its own time step. No percept needed for stage 1.
- **Free parameters for a later fit:** σ_nurse, σ_forager, τ (3), with the compact persistence targets (on hold)
  added as fit rows. T2 and the short-still rows are the targets this mechanism is meant to move.

**Stage 2: local coupling of the drive (only if stage 1 is adopted and Y's gap matters).**
- The drive relaxes toward what the ant perceives of its neighbours' activity: an extra term −κ·(x_i − x̄_perceived)
  dt, where x̄_perceived is built from percepts (e.g. the fraction of contacted or nearby nestmates that are moving,
  within the existing contact percept, or a new short-range vibration / motion percept). Arousal then diffuses through
  the cluster, which could give co-movement that decays over centimetres (the Y shape) rather than at contact range.
- A new percept would go through `perception/` (the boundary test). One extra parameter (κ), plus the percept range.
- Not excitable (no refractory state), so distinct from the parked Napoli et al. 2026 structure.

## Tests before any fit

1. σ = 0: bit-identical rows (existing fit files reproduce).
2. Mean one: the long-run mean walk-on multiplier is 1 within simulation error (as `meanOne`).
3. Both roles reached: a test with a forager overlay where only σ_forager > 0 changes forager rows only.
4. Stage 2 only: κ = 0 bit-identical; with κ > 0, the Y recorder on a short run shows co-movement beyond contact range.

## Open questions for the user

- Shared or role-specific τ?
- Is stage 2 in scope for M1, or a disclosed limitation (synchrony unexplained) with stage 1 only?
- Order relative to Q's outcome: if aggregation (Q) is adopted, packing changes the contact percepts that stage 2 would
  use, so stage 2 should come after Q's mechanism is settled.
