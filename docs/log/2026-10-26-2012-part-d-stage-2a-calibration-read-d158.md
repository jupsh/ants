---
id: D173
date: 2026-10-26
time: 20:12
kind: reading
title: Part D Stage 2a calibration read (D158 rule): 9 of 11 members calibrated within 4.15 +/- 0.30, Es included; T10f and T10m miss at verification and are ineligible
---
- **2026-10-26 ≈ 20:12 UTC — Part D Stage 2a calibration read (D158 rule): 9 of 11 members calibrated within 4.15 +/- 0.30, Es included; T10f and T10m miss at verification and are ineligible.**
  - **Run:** `partd2a-20261026T161637Z` (D172), exit 0; read `logs/partd2/calib.log` (partD2.ts's application of the
    frozen rule) and nothing else. Code hashes in `logs/partd2/md5.txt` match D168/D172.
  - **Rule (D158, as amended by D159):** grid {0.25, 0.5, 1, 1.5, 2, 3, 4} on `diag` 0xc4b0, one refinement, selection
    frozen; verification on `judge` 0xc4b1, 2 runs × 22 colonies; calibrated if D_w (all ants, 1 min) is within
    4.15 ± 0.30, i.e. [3.85, 4.45]. A miss is recorded and leaves the member ineligible.
  - **Result (selected strength → verified D):**
    - calibrated (9): T20f 0.5 → 3.86; T20m 0.625 → 4.07; Eu-M 0.4375 → 4.44; El20-M 0.875 → 4.13; Ed2 0.875 → 4.02;
      Ed5 0.875 → 4.10; Ed20 0.875 → 4.02; Ew5 0.375 → 4.16; Es 3 → 4.21;
    - missed (2): T10f 1.375 → 4.83 (selection-stage D 4.19); T10m 1.25 → 3.83 (selection-stage 4.35). Both ineligible
      (partD2.ts labels them "sufficiency failure on magnitude").
  - **Reading:**
    - Both 10-min transmission members miss; their response to strength is flat near the band (T10f 4.19–4.72 over
      1–1.5; T10m 3.63–4.71 over 1–1.375), and the 2 × 22 verification moved them by −0.52 and +0.64, more than the
      band's half-width. The 20-min members (T20f, T20m) calibrate, so the transmission family stays represented.
    - Es calibrates, so P48's "Es must not disappear" condition holds for Stage 3b.
    - Three members sit near the band's edges (T20f 3.86, T10m 3.83 outside, Eu-M 4.44); one verification draw decides
      them, as the frozen rule says.
    - Descriptive: El20-M, Ed2, Ed5 and Ed20 give nearly the same response curve (peak ≈ 8.5 at strength 2, ≈ 1.4 at
      4), so the delay parameter barely changes the calibration statistic. Whether they separate on the assessment
      rows is Stage 2b's question.
  - **Disclosures carried into Stage 2b and any commit:**
    - The warm-up shortcut is rechecked only at C2 base (D163, P54), not for any member (P02's `run:partd2a`
      disposition);
    - the multipliers before and after clipping (P21) and Es's clipped and trajectory multipliers (P46) are not in
      `calib.log` and are owed before this is committed or published;
    - D172's disclosure: two of these lines (T10f, T10m) were seen during a fetch check before this reading.
  - **Next:** P29's complete 2-D rule (the user's approval, D159 item 3) and P47's rules, then the Stage 2b estimate on
    9 calibrated members (fewer runs than D169's 616) and its rental approval.
