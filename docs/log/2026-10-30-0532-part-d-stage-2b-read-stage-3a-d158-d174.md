---
id: D194
date: 2026-10-30
time: 05:32
kind: reading
title: Part D Stage 2b read (Stage 3a; D158, D174 Part B): no member reproduces jointly, family T 0 of 2, family D 0 of 7, controls and base also not; every arm short of the data's 10-min D_w; T too strong in the near bands, Eu-M, Ew5, Es and Eu too strong in the far band; read beside F097, which forecast joint equivalence very unlikely for a perfect model
---
- **2026-10-30 ≈ 05:32 UTC — Part D Stage 2b read (Stage 3a; D158, D174 Part B): no member reproduces jointly, family T 0 of 2, family D 0 of 7, controls and base also not; every arm short of the data's 10-min D_w; T too strong in the near bands, Eu-M, Ew5, Es and Eu too strong in the far band; read beside F097, which forecast joint equivalence very unlikely for a perfect model.**
  - **What:** the Stage 2b reading (D158 as amended by D159; D174 Part B, approved D178, gap-filled by D185 and
    confirmed in D186), read mechanically by the frozen reader `scripts/scratch/partD2b.ts` (md5 `1ff8b42c`, checked
    before running). Answers question 1 of D158 (P43): which tested members reproduce synchrony magnitude, timescales
    and spatial profile together. Evidence class: development only.
  - **Runs (local, gated as `run:partd2b-read`):**
    - `files` (`partd2b-read-20261029T223633Z`): exit 0 at 04:07 UTC, 1,057 jobs into `logs/partd2/assess/`.
    - `read` (`partd2b-read-20261030T040810Z`): exit 3 at 04:46. `ext-needed.json` named Eu-M and Eu.
    - `ext --arms Eu-M,Eu` (`partd2b-read-20261030T044706Z`): exit 0 at 04:51. Eu-M, Eu and the data at 400 draws.
    - `read` again (`partd2b-read-20261030T045153Z`): exit 0 at 05:29. Output `logs/partd2/assess/read.json`, S3
      descriptives in `s3desc.json`.
  - **Support:** 22 colonies on every S1 and S3 row, 20 on every S2 and S2-J row (the data's 20 estimable, D156).
    Common support on all 20 rows, no per-arm support, no missing statistic in any arm.
  - **MC extension:** the S2-J ≥ 40 mm row of Eu-M and Eu was not resolved at 100 draws. After the extension (all
    five S2-J rows of both arms at 400, against the data at 400), Eu's ≥ 40 mm row is outside, CI [0.0158, 0.0348].
    Eu-M's is **unresolved (MC)**: CI [0.0147, 0.0331], with the lower endpoint 0.0003 from +0.015 and MC SE 0.00016.
    No support colony fell below 90 % valid draws at 400.
  - **Row classes** (E equivalent, **O** outside, u unresolved, MC unresolved (MC); forecast as F097, never a filter,
    P57; data = the data's colony mean on the row's support):

    | row | forecast | data | T20f | T20m | Eu-M | El20-M | Ed2 | Ed5 | Ed20 | Ew5 | Es | Eu | El20 | base |
    |---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
    | S1 D_w all 5 s | unresolved | 2.63 | E | E | E | E | E | E | E | E | E | E | E | **O** |
    | S1 D_w all 10 min | unresolved | 6.28 | **O** | u | u | **O** | **O** | **O** | **O** | **O** | **O** | u | **O** | **O** |
    | S1 D_w nurse 5 s | unresolved | 2.28 | u | u | u | E | E | E | E | E | u | E | E | **O** |
    | S1 D_w nurse 1 min | unresolved | 3.67 | u | u | u | E | E | E | E | E | u | u | u | **O** |
    | S1 D_w nurse 10 min | unresolved | 5.12 | **O** | u | u | **O** | **O** | **O** | **O** | **O** | u | u | **O** | **O** |
    | S1 D_w forager 5 s | unresolved | 1.58 | E | E | u | u | u | u | u | u | u | E | E | **O** |
    | S1 D_w forager 1 min | unresolved | 2.12 | u | u | u | u | u | u | u | u | u | E | u | **O** |
    | S1 D_w forager 10 min | unresolved | 3.12 | **O** | u | **O** | **O** | **O** | **O** | **O** | **O** | **O** | u | **O** | **O** |
    | S2 C < 5 mm | marginal | 0.104 | **O** | **O** | u | E | E | E | E | u | u | u | E | **O** |
    | S2 C 5–10 mm | marginal | 0.060 | **O** | **O** | u | E | E | E | E | u | u | u | E | **O** |
    | S2 C 10–20 mm | unresolved | 0.030 | **O** | **O** | E | u | u | u | u | E | u | u | u | **O** |
    | S2 C 20–40 mm | unresolved | 0.014 | E | E | **O** | u | u | u | u | u | E | **O** | u | u |
    | S2 C ≥ 40 mm | unresolved | −0.001 | u | **O** | **O** | u | u | u | u | **O** | **O** | **O** | u | E |
    | S2-J < 5 mm | marginal | 0.088 | u | u | u | E | E | E | E | u | u | u | E | **O** |
    | S2-J 5–10 mm | unresolved | 0.052 | **O** | u | E | E | E | E | E | u | E | E | E | **O** |
    | S2-J 10–20 mm | unresolved | 0.030 | **O** | **O** | E | u | u | u | u | E | E | u | u | **O** |
    | S2-J 20–40 mm | unresolved | 0.017 | E | E | u | u | u | u | u | u | E | **O** | u | u |
    | S2-J ≥ 40 mm | unresolved | 0.010 | E | E | MC | E | E | E | E | u | **O** | **O** | E | u |
    | S3₁ | precise | 0.266 | E | E | E | E | E | E | E | E | u | E | E | E |
    | S3₂ | precise | 0.189 | E | E | E | E | E | E | E | E | u | E | E | E |
    | **equivalent / outside** | | | 7 / 8 | 7 / 5 | 6 / 3 | 10 / 3 | 10 / 3 | 10 / 3 | 10 / 3 | 7 / 4 | 5 / 4 | 7 / 4 | 10 / 3 | 3 / 14 |

    (S1 cells: the reader's keys 10, 120 and 1200 are frames at 2 fps, so 5 s, 1 min and 10 min; labels corrected,
    D204. S2-J rows are C − Ê_J. Every sim value, CI and tolerance is in `read.json`.)
  - **Stage 3a (the rule, D158):** no arm has all 20 rows equivalent. **Family T: no member reproduces, of 2
    calibrated. Family D: no member reproduces, of 7 calibrated** (Es included). T10f and T10m were not calibrated
    (D173) and are not assessed. The controls Eu and El20 and C2 base do not reproduce either. **Answer to question 1:
    none of the tested members reproduces synchrony magnitude, timescales and spatial profile together.**
  - **Read beside F097 (P57):** the forecast found joint equivalence on all 20 rows very unlikely even for a perfect
    model at this sample size, and 15 rows unforecastable. So the joint failure does not by itself count against any
    one member. The outside rows carry the information; unresolved rows are neither failures nor passes (P43). The
    following is description, no new rule:
    - **Slow timescale, every arm.** The data's 10-min D_w (all 6.28, nurse 5.12, forager 3.12) is above every arm's
      (all 3.2–5.25). It is outside on all-ants for 8 of the 11 non-base arms and on foragers for 9. Only T20m, Eu-M
      and Eu are not outside on all-ants at 10 min (unresolved). At 5 s every non-base arm is equivalent on all-ants.
      The members were calibrated on the all-ants 1-min cell (D173; the cell excluded from the rows) and fall short at
      10 min. With 2 × 4 h simulated against 8–12 h of light, the 10-min cell has the fewest blocks per simulated run.
      Whether that biases D_w down is not examined (F104).
    - **Family T: too local.** Both T members' near-band C (< 5, 5–10, 10–20 mm) is 1.7–3.4 times the data's
      (0.18–0.23 against 0.10 at < 5 mm), outside in all six cells. Their excess over J is outside at 10–20 mm (and at
      5–10 mm for T20f).
    - **Drivers: profile too flat in some.** Eu-M, Ew5, Es and the control Eu are outside at ≥ 40 mm on C (0.030–0.073
      against −0.001). El20-M, Ed2, Ed5, Ed20 and the control El20 have nearly identical classes and values (as their
      calibration and multipliers did, D173, D184): their near bands are equivalent, their far bands unresolved, and
      they fail only the 10-min cells.
    - **Es:** S3₁ and S3₂ unresolved (0.98 and 1.04 against 0.27 and 0.19), S2-J ≥ 40 mm outside. The only arm whose
      S3 rows are not equivalent.
    - **Base:** 3 of 20 equivalent (S2 C ≥ 40 mm and the S3 rows), 14 outside.
  - **Descriptive rows (D158's list, no rule):**
    - **Multipliers (P21, P46),** along moving ants' trajectories in the 2b runs; before clipping / applied / clipped
      share: T20f 0.821 / 0.829 / 9.3 %; T20m 0.784 / 0.787 / 10.4 %; Eu-M 1.001 / 1.001 / 0.2 %; El20-M 0.997 /
      0.982 / 0.8 %; Ed2 0.995 / 0.980 / 0.8 %; Ed5 0.995 / 0.980 / 0.8 %; Ed20 0.996 / 0.981 / 0.8 %; Ew5 0.993 / 0.992
      / 0.4 %; **Es 5.966 / 0.322 / 94.3 %**; Eu 1.002 / 1.002 / 0 %; El20 0.979 / 0.979 / 0 %. As in Stage 2a (D184;
      F100), Es works in practice as a two-level switch. Its trajectory mean before clipping here (5.97) differs from
      Stage 2a's (0.52), while the applied mean (0.32 against 0.33) and the clipped share (94.3 % in both) agree. A
      plausible reading, not checked: with a log-SD near 3 before clipping (D184), the sample mean of the unclipped
      multiplier is dominated by rare large samples and is unstable between run sets.
    - **Mean moving fraction against base (> 20 % flag):** T20m −21.6 % and Es −78.5 % are flagged. The others are
      within −17 % to −1 %. Es's ants move about a fifth as much as base's.
    - **S5, S6, S7** (`read.json` → `descriptive.S5S6S7`): data S5 −0.16 (95 % CI −0.43 to 0.09), S6 ρ 0.59, S7 ρ 0.23
      (22 colonies), with every arm's values beside them. **S3-ρ**, the **S2 audit** descriptives (L, Ê_J, S2_J, Ê_A,
      Ê_J − Ê_A, block-mean and reference classing, role pairs) and the **S3 descriptives** (S3-pair, S3-raw,
      sensitivities (a)–(c), S3-p): in `read.json` and `s3desc.json`, not summarised here.
    - **Gate G, recomputed as a descriptive** on the 2b base runs (Stage 0's reader): data − base S3₂ 0.170, 95 % CI
      [0.009, 0.344], "positive excess ordering established". **This does not reverse Stage 0's failed gate G (D130;
      F092), which stays on record (P43).** It is a descriptive on a different base draw (seed 0xc4b2), and the S2
      pass does not restore S3 as an established propagation signature.
    - S4 not recorded (the 2b runs have no `--tb`).
  - **Disclosures carried (P45, P51, P52, P54; written into `read.json`):**
    - Duration: data 8–12 h of light against 2 × 4 h simulated per colony. Phase: light only.
    - Q03: the water-init warm-up shortcut was rechecked at C2 base only (D163). It was not rechecked for the members
      (P54, D173).
    - P25 / P52: packing is closed with its failures accepted, not matched. F078 is carried with the near-share deficit.
    - S3's Stage 0 gate failure stays on record (P43).
    - The raw and corrected bands are dependent, so their agreement is not ten independent confirmations. Far-band
      classes come from the interval rule, not from point differences (P51).
    - Es is dominated by clipping (D184).
  - **Findings:** F103 (the Stage 3a result), F104 (the 10-min shortfall).
  - **What it does not show:** which mechanism is behind the data's synchrony. That is question 2, and it waits on the
    capability test (P44). No member is chosen, dropped or tuned on these rows (P41; stopping rule, D158).
  - **Exposures:** none. The seals on these outputs were lifted by D186; the capability outputs stay sealed (P63), and
    neither this reader nor the lead opened them. Process note: the lead first expected no extension, because the
    reader had already moved on to the S3 descriptives. It in fact writes `ext-needed.json` after them. Nothing was
    changed.
  - **Next:**
    - Stage 3b, capability (P44, P59, P61, P62): `capfiles` resumed at 05:30 UTC (`partd2-capfiles-20261030T053011Z`,
      gated `run:partd2-capfiles`). Then `partDCap.ts`: nulls first, and c frozen on them before any member comparison.
    - Stage 3c only if capability passes (D158).
    - D190's B017 patch waits until `capfiles` finishes.
- **2026-10-30 ≈ 20:45 UTC — Correction (D204).** The S1 cells were labelled 10 s, 2 min and 20 min, reading the
  reader's window keys (10, 120, 1200 frames at 2 fps) as seconds. They are 5 s, 1 min and 10 min, and the labels above
  (title, table, text) are corrected in place. Every number, class and verdict is unchanged.
