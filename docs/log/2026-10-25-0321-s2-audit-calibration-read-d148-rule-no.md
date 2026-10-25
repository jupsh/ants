---
id: D149
date: 2026-10-25
time: 03:21
kind: reading
title: S2 audit κ calibration read (D148 rule): no grid value reaches the 0.05 planted effect (peak 0.023 at κ = 0.2, then saturation); stopped before any synthetic case ran, as frozen. Unit checks (V4, V6, masks, reference window, band edges) pass; continuity with D122 exact
---
- **2026-10-25 ≈ 03:21 UTC — S2 audit κ calibration read (D148 rule): no grid value reaches the 0.05 planted effect (peak 0.023 at κ = 0.2, then saturation); stopped before any synthetic case ran, as frozen. Unit checks (V4, V6, masks, reference window, band edges) pass; continuity with D122 exact.**
  - **Run (D148's frozen code, hashes unchanged):**
    - `s2AuditSyn.ts --unit`: all 17 checks pass. They cover V4 (τ = 0 reproduces observed J and A exactly; rotations
      keep block means and bin counts; τ within 30–210), masks under A and J, the reference window (matched support,
      none in bins 0–14, none with < 5 detected bins), band edges, V6 (14 common colonies → unestimable; exclusions
      listed; pass, fail, extend at 100 and unresolved at 400), and pooling within a draw.
    - **Continuity:** `s2Audit.ts` on full support gives 0.0918 / 0.0538 / 0.0279 / 0.0122 / 0.0034, L 0.0605. This
      equals `ydistAgg.ts` to 4 decimals and agrees with D122 (0.092 / 0.054 / 0.028 / 0.012 / 0.003).
    - **κ calibration** (`--calibrate`, seed 0x5a01, b = 10, observed L only): planted effect mean(L_on − L_off) =
      0.0144 (κ 0.05), 0.0216 (0.1), 0.0227 (0.2), 0.0165 (0.4), 0.0091 (0.8).
  - **Reading, as frozen (D148):** no grid value reaches 0.05, so the calibration stops. No synthetic case ran, and
    no null draw or S2_J was computed on synthetic, simulated or data files. The audit output folder is still empty.
  - **What it says:** this is about the generator, not about J. Contagion through lagged switching rates gives
    neighbours only weak simultaneous co-movement in this statistic, at most ≈ 0.023, about a third of the data's L
    (≈ 0.06). Beyond κ ≈ 0.2, saturation (most ants moving near moving neighbours) shrinks the deviations it
    correlates.
  - **Next:** the user decides how the planted coupling is generated or sized (Q13). Under D147 the lead does not
    change the target, the grid or the mechanism itself. Then V1–V6 run as frozen.
