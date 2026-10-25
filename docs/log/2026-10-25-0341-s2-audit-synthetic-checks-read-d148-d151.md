---
id: D152
date: 2026-10-25
time: 03:41
kind: reading
title: S2 audit synthetic checks read (D148 / D151 rules): all 13 cases run, every acceptance rule passes (V1a, V1b, V3a within ±0.01; V2 lower bound > 0; V5 recovery lower bounds 0.966–0.997 at b = 2, 10, 30); J is the primary null; a spatially structured shared driver gives S2_J ≈ 0.16 (the disclosed limit)
---
- **2026-10-25 ≈ 03:41 UTC — S2 audit synthetic checks read (D148 / D151 rules): all 13 cases run, every acceptance rule passes (V1a, V1b, V3a within ±0.01; V2 lower bound > 0; V5 recovery lower bounds 0.966–0.997 at b = 2, 10, 30); J is the primary null; a spatially structured shared driver gives S2_J ≈ 0.16 (the disclosed limit).**
  - **Run:** the 13 cases of D148 with D151's revision (`s2AuditSyn.ts` `49d3e26028b495837de3668c04ca7669`; `s2Audit.ts`
    and `s2AuditGate.ts` as frozen in D148), γ* = 0.1, 24 colonies × 100 J draws each. Every case exited 0 and every
    synthetic colony was estimable. Then `--accept` on the same code. Outputs are in `logs/s2syn/` (synthetic, not
    sealed).
  - **Read against the frozen thresholds** (mean S2_J, 95 % synthetic-colony bootstrap interval):

    | Case | Mean S2_J | 95 % interval | Rule | Result |
    |---|---|---|---|---|
    | V1a transient place-linked activity | 0.0002 | [−0.0004, 0.0009] | within ±0.01 | pass |
    | V1b stable resting sites | −0.0004 | [−0.0009, 0.0001] | within ±0.01 | pass |
    | V3a homogeneous shared driver | −0.0005 | [−0.0022, 0.0012] | within ±0.01 | pass |
    | V2 planted local spatial dependence (b = 10) | 0.0480 | [0.0454, 0.0506] | lower bound > 0 | pass |
    | V3b spatially structured shared driver | 0.1637 | [0.1495, 0.1779] | none (descriptive) | — |
    | V3c heterogeneous noise | 0.0007 | [−0.0017, 0.0029] | none | — |
    | V3d spatially patterned noise | 0.0028 | [0.0000, 0.0059] | none | — |

    - **V5, recovery of planted local spatial dependence** (paired colony bootstrap; planted effect = mean(L_on −
      L_off)):

      | Latent bout length b | Planted effect | 95 % interval | Recovery | 95 % interval | Result |
      |---|---|---|---|---|---|
      | 2 | 0.0511 | [0.0498, 0.0525] | 1.000 | [0.997, 1.002] | pass |
      | 10 | 0.0490 | [0.0477, 0.0502] | 0.988 | [0.984, 0.993] | pass |
      | 30 | 0.0502 | [0.0489, 0.0516] | 0.973 | [0.966, 0.981] | pass |

      Every planted effect is demonstrably positive, and every recovery lower bound is ≥ 0.8.
    - **Reported without a rule:** L_same − L_ref = 0.211 [0.199, 0.223] in V1a and 0.385 [0.378, 0.391] in V1b; the
      matched support keeps 93.7 % of pair-bins in both.
    - Unit checks (V4, V6): 17 of 17 pass (D149; rerun on the fixed code, D153).
  - **Reading, as frozen:** synthetic acceptance passes. **J is the primary null** (P31: the shift rule is frozen as
    D146 defines it, 30–210 bins per ant and block). P36 is not triggered.
  - **What the cases say about the audit's reading:**
    - J removes the place–activity artefacts V1a and V1b and a homogeneous shared driver (V3a). It recovers planted
      local spatial dependence almost whole at every latent bout length tested.
    - **A spatially structured shared driver (V3b) passes J as decay** (S2_J ≈ 0.16, larger than the planted
      dependence). So data S2_J > 0 cannot tell local dependence from a colony-wide signal whose response varies
      over space. This is the limit D145 item 1 and D150 anticipated: "decay exceeding the joint-shift null" names no
      mechanism (P34).
    - V3d: spatially patterned noise leaves a small residue, compatible with up to ≈ 0.006.
    - L_same − L_ref is large and positive in **both** V1 cases, including stable rest sites, so same-bin classing
      strengthens decay under both artefacts. ~~Reference classing does not remove a stable-site artefact to zero (as
      D145 warned).~~ **Corrected (D154):** a positive difference alone does not show that. Reported separately, L_ref
      is near 0 in both (V1a: L_same 0.209, L_ref −0.002; V1b: 0.370, −0.015). Reference classing greatly reduced both
      artefacts. Point estimates without an interval do not establish equivalence to zero (user, after D155). L − L_ref
      on the data is descriptive only.
  - **Correction of the lead's prediction:** the lead predicted (reply after D149, not a record) that about a third of a
    long-lived dependence might survive J at b = 30. At b = 30, 97 % was recovered. The prediction was wrong.
  - **Limits:** synthetic colonies are far more active than real ones (D148), with 80 ants, 5 blocks and homes fixed
    for a whole run. Recovery is shown for this generator, not for every persistence structure.
