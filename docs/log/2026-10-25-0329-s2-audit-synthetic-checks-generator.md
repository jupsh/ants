---
id: D151
date: 2026-10-25
time: 03:29
kind: design
title: S2 audit synthetic checks, generator revision (D150) frozen before the γ calibration: planted local spatial dependence for V2 and V5, revised hashes, the γ rule; everything else as D148
---
- **2026-10-25 ≈ 03:29 UTC — S2 audit synthetic checks, generator revision (D150) frozen before the γ calibration: planted local spatial dependence for V2 and V5, revised hashes, the γ rule; everything else as D148.**
  - **Frozen before the γ calibration runs (D150, P40).** Only `s2AuditSyn.ts` changed:
    - `s2Audit.ts` `88c4463d0e317c0254d9723533e25cd5`, `s2AuditGate.ts` `8123fe67af67fc632088778073806417` and
      `s2AuditFile.ts` `d888bb33e91583b6853dd75265e72856` are unchanged from D148;
    - `s2AuditSyn.ts` is now `49d3e26028b495837de3668c04ca7669`.
    - The 17 unit checks pass on it.
  - **Change:** V2 and V5 (the "on" cases) use **planted local spatial dependence**, D150's definition, with κ = 0.
    - Latent states z_i(t) are independent, as in D148's process with κ = 0.
    - a_i(t) = clip[0.05 + 0.45 z_i(t) + γ · mean_{j ∈ N_i}(z_j(t) − 0.5) + 0.05 ε_i(t)]. N_i = homes within 10 mm,
      itself excluded; the term is zero for an empty neighbourhood. It comes from the completed state vector of the same
      bin.
    - No random draw was added, and the term is added only when γ ≠ 0. The other cases' generator is unchanged, and
      in V5 the on and off colonies share their latent states exactly.
    - The κ path stays in the code at κ = 0 (`--calibrate-kappa` reproduces D149). Its output was renamed
      `logs/s2syn/calibration-kappa.json`, contents unchanged.
    - Each case also records the share of clipped ant-bins (before detection), as a description.
  - **γ calibration rule (D150):**
    - grid 0.05, 0.1, 0.2, 0.4, 0.8; seed 0x5a01, 24 colonies, b = 10, on and off paired, observed L only;
    - γ* = the smallest value with mean(L_on − L_off) ≥ 0.05; none: stop and report;
    - one γ* for every V5 bout length and for V2;
    - clipping share reported beside each value, never used to choose.
    - γ* is recorded below before any case runs.
  - **Unchanged from D148:** cases, seeds, replicate count (24 colonies, 100 J draws) and acceptance rules. P36
    applies to any failure.
  - **2026-10-25 ≈ 03:30 UTC — γ calibration read, before any case ran:** γ 0.05 → planted effect 0.0246 (clipped ant-bins
    8.19 %); γ 0.1 → 0.0501 (8.89 %); grid stopped there by the rule. With γ off, 7.93 % of ant-bins are clipped
    (mostly the noise at the 0.05 resting level). **γ* = 0.1**, for V2 and every V5 bout length.
    (`logs/s2syn/calibration-gamma.json`.)
