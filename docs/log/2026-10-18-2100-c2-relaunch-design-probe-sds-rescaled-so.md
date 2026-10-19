---
id: D070
date: 2026-10-18
time: 21:00
kind: design
title: C2 relaunch design: probe SDs rescaled so the largest is the 0.5 cap, both phases (amendment to D055, for approval)
---
- **2026-10-18 ≈ 21:00 UTC — C2 relaunch design: probe SDs rescaled so the largest is the 0.5 cap, both phases (amendment to D055, for approval).**
  - **Defect (D068, D069):** phase 1's axis switch σ·max D < 0.25 assumes a starting axis near 0.5. In C1 every
    probe had its largest SD at the 0.5 cap (phase 1 starts 0 and 1, phase 2 start 0; `logs/c1/fitS2018-c1.log`),
    so with σ0 = 1 the switch meant "the largest axis has halved". C2's probes had no axis at the cap (largest 0.068
    / 0.039), so the switch held at generation 0 and phase 1 did no search. Phase 2 (σ 0.5, tolX 0.03) has the same
    exposure: a starting axis ≈ 0.5 × 0.05 would sit at tolX.
  - **Amendment (C2 only, both phases):** after the probe, rescale its SDs so the largest equals the cap,
    `sd × 0.5 / max(sd)`, when the largest is below the cap; unchanged otherwise. The probe still sets the relative
    scales (conditioning); only the overall scale changes. The starting axis is then 0.5 × σ0: 0.5 in phase 1
    (switch at half of it, as in C1), 0.25 in phase 2 (as in C1). For C1 the rule is the identity on all three of
    its probes. The raw probe SDs are kept in the checkpoint and the output.
  - **Unchanged:** everything else in D055 (rows, k 13, starts, cheap and full settings, the < 300 loss switch,
    30 / 60 generation caps, tolX, selection batch, phase 2 from the better start only, estimate, no extension,
    the whole-model judgment of D041 / D042 on fresh seeds).
  - **Fresh start:** the checkpoint key gains the amendment, so the script refuses the old checkpoint; on the box it
    is moved aside to `logs/c2/aborted-20261018/` with `fit.log`, unread. Same seeds, so the relaunch's raw probe
    SDs must reproduce D069 (largest 0.068 / 0.039 at 3 decimals): a check that nothing else changed, read as the
    largest raw SD only.
  - **Budget:** D044's projection applies again (≈ 28 h with phase 1 up to 2 × 30 generations; less if a switch fires).
  - **Alternative not chosen:** keep the probe scale and make the switch relative (axis < 0.5 × starting axis).
    Same meaning for the switch, but phase 1 would search with steps of ≈ 0.04–0.07 box units from starts C1 left
    far behind.
  - **Before launch:** `npm test`, `tsc`, a unit test of the rescaling (identity at the cap); box code checksums
    equal to the local files; the user's approval of this entry.
