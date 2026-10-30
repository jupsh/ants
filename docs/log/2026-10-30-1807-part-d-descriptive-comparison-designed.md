---
id: D202
date: 2026-10-30
time: 18:07
kind: design
title: Part D descriptive comparison designed (D201): the data's (R, S3₂, R_J) and near- and far-band means beside every calibrated member's, on common colony support with one joint colony bootstrap; no placement, no label, no M² against c; copy of poolColony checked against nulls.json and D194
---
- **2026-10-30 ≈ 18:07 UTC — Part D descriptive comparison designed (D201): the data's (R, S3₂, R_J) and near- and far-band means beside every calibrated member's, on common colony support with one joint colony bootstrap; no placement, no label, no M² against c; copy of poolColony checked against nulls.json and D194.**
  - **What:** the comparison the user asked for in D201, fixed before it runs. It is descriptive, with no rule, no
    verdict and no placement. `scripts/scratch/partDDesc.ts` (md5 `7ca5a08a`); `run` writes `logs/partd2/desc.json`
    once.
  - **Inputs, all already inspected:**
    - **Members:** the 9 calibrated members' Stage 2b assessment runs (2 × 22, `logs/partd2/assess`), the files whose
      row classes D194 reports. Each member is shown with its outside rows from D194.
    - **Context:** each member's 6 capability datasets (`logs/partd2/cap`), as the minimum and maximum of θ and of the
      band means over the 6.
    - **Data:** the S2 audit's data files (draws 0–99) and the Stage 0 S3 audit's per-colony S3₂ (as Stage 2b's
      reader uses them).
  - **Definitions, frozen (`scripts/capability.ts`, D175, D176):**
    - θ = (R, S3₂, R_J), with R = mean C(20–40) / mean C(< 5) and R_J the same on C − Ê_J.
    - Colony values as `partDCap.ts poolColony`: a set's two runs pooled, estimable as the S2 audit and the Stage 0
      reader. The function is copied, because `partDCap.ts` runs its command on import. J uses the first 100 draws
      everywhere, as the capability stage did, so Stage 2b's extension of Eu-M and Eu does not enter.
    - Denominator rule: a bootstrap draw with mean C(< 5) or mean (C − Ê_J)(< 5) ≤ 0.01 is counted, and more than 1 % of
      draws makes that coordinate not evaluable for the set.
  - **Reported (D201):**
    - for the data and every member, on the common support: R, S3₂, R_J and the near- and far-band means (C(< 5),
      C(20–40), C − Ê_J in both), each with a 95 % percentile CI;
    - per member, its difference from the data on each, with a 95 % CI, the bootstrap correlation matrix of the 3-D
      difference, its outside rows (D194), and its 6 capability datasets' range.
  - **Support and uncertainty:**
    - the colonies estimable in the data and in all 9 members, listed, with each set's exclusions;
    - one joint colony bootstrap, 2,000 draws, `RNG.stream(0xd3d0, 1)`, with the same colony indices for the data and
      every member in each draw (they share the 22 colony set-ups).
  - **Not computed (D200, D201):** no M² against c, no comparison with c or α, no "not rejected", no family label, no
    "closest member". Formal Stage 3c placement stays empty.
  - **Checks run before this entry (inputs already read, no comparison computed):**
    - the copy reproduces `nulls.json`'s base-pool per-colony C(< 5) mean exactly (0.06431179180285346);
    - the data's C(< 5) colony mean on its 20 estimable colonies equals D194's S2 C < 5 mm data value exactly
      (0.10443066151274069).
  - **The lead's choices within D201:**
    - Stage 2b's assessment runs, not the capability datasets, as the members' main values: they carry the row classes
      D201 asks to show.
    - Percentile CIs at 95 %.
    - The correlation, not M², to show the joint uncertainty.
