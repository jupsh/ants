---
id: D130
date: 2026-10-23
time: 23:03
kind: reading
title: Part D Stage 0 (S3 audit) read: gate G not passed (data S3₂ +0.19 [0.04, 0.36], but data − base +0.10 [−0.06, 0.28]); most of the 11-frame raw contrast is episode composition (null 1 expects 8.8); the excess is small, carried by episodes over 15 ants, and absent when distances are taken at the initiator's frame
---
- **2026-10-23 ≈ 23:03 UTC — Part D Stage 0 (S3 audit) read: gate G not passed (data S3₂ +0.19 [0.04, 0.36], but data − base +0.10 [−0.06, 0.28]); most of the 11-frame raw contrast is episode composition (null 1 expects 8.8); the excess is small, carried by episodes over 15 ants, and absent when distances are taken at the initiator's frame.**
  - **Run:** `s3audit-20261023T182640Z`, local, ok.
    - 4 h 35 m wall time, of which ≈ 2 h 47 m the laptop was suspended (12:00–13:05 and 13:06–14:48 local), so ≈ 1 h 50 m
      of compute.
    - Snapshot events were identical to `contactData.ts`'s for all 22 colonies.
    - Every set complete: data 22; base, Eu, El20, P20 44 files each.
    - Scripts as frozen in D129: `s3Audit.py` 9ce3f5a2…, `s3AuditRead.py` c79bec04…; md5 also in `s3audit.json`.
    - Output: `logs/partd/s3audit.json`.
  - **Gate G (D129: same colony identities, 22 of 22 estimable in both):**
    - data S3₂ +0.189 [+0.036, +0.355]: lower bound > 0 ✓;
    - base S3₂ +0.085 [+0.028, +0.146];
    - data − base +0.104 [**−0.062**, +0.280]: lower bound not > 0 ✗.
    - **Reading, as fixed:** "this gate did not establish positive excess ordering". It is not evidence that propagation
      is absent. Whether Stages 1–3 go on is the user's decision (D126 amendment 1).
  - **Primary statistics** (frames per 10 mm; colony mean, 95 % colony bootstrap; every colony estimable in every set):

    | Set | S3₁ (vs null 1) | S3₂ (vs null 2) | S3-pair |
    |---|---|---|---|
    | data | +0.266 [+0.100, +0.448] | +0.189 [+0.036, +0.355] | +0.014 [+0.007, +0.022] |
    | base | +0.047 [−0.007, +0.104] | +0.085 [+0.028, +0.146] | +0.003 [+0.001, +0.006] |
    | Eu | −0.019 [−0.091, +0.051] | +0.011 [−0.039, +0.059] | +0.009 [+0.003, +0.016] |
    | El20 | +0.017 [−0.054, +0.102] | +0.021 [−0.048, +0.097] | +0.008 [+0.004, +0.011] |
    | P20 (uncalibrated) | +0.068 [−0.038, +0.170] | +0.116 [+0.031, +0.201] | +0.011 [+0.006, +0.017] |

    - Eligible episodes: data 19,409 of 25,903 (S3₁ and S3₂); base 18,071, Eu 17,617, El20 18,271, P20 17,418.
  - **S3-raw (20–40 minus < 5 mm, pooled; two separate comparisons, not a decomposition):**

    | Set | Observed | Null-1 expectation | Observed − null 1 | Null-2 expectation | Observed − null 2 |
    |---|---|---|---|---|---|
    | data | 11.01 [3.29, 21.03] | **8.76** [2.34, 17.25] | 2.25 [0.72, 4.01] | 5.55 [0.25, 12.41] | 5.47 [2.82, 9.01] |
    | base | 1.35 | 0.38 | 0.97 [−0.32, 2.34] | 0.11 | 1.24 [−0.01, 2.41] |
    | Eu | 1.28 | 0.10 | 1.18 [−0.33, 2.86] | −0.46 | 1.74 [0.09, 3.84] |
    | El20 | 1.20 | 0.03 | 1.17 [0.46, 1.86] | −0.09 | 1.29 [0.52, 2.04] |
    | P20 | 2.32 | 0.93 | 1.39 [0.31, 2.53] | 0.27 | 2.06 [0.86, 3.48] |

    - Null 2 is defined for every episode in every set (all files have ≥ 21 episodes).
    - **Continuity:** the observed 11.013 differs from D124's 11.034 because `spreadAgg.py` adds an episode's lags only
      when its ρ is defined. The frozen definition here takes every episode; recomputed both ways from the same files,
      11.013 vs 11.034 exactly.
  - **Sensitivities (data; descriptive, outside the gate):**
    - (a) 4–15 participants: S3₁ +0.150 [−0.031, +0.342], S3₂ +0.085 [−0.082, +0.270] (17,141 episodes). The excess
      comes from the episodes with more than 15 participants.
    - Spread-weighted (D129: a sensitivity; its null is not re-weighted): S3₁ +0.513 [+0.268, +0.768], S3₂ +0.501
      [+0.301, +0.709]. In base: +0.074 and +0.151.
    - (b) detection-complete (2,612 episodes): S3₁ +0.299 [−0.411, +1.007], S3₂ +0.277 [−0.335, +0.868].
    - (c) distances at the initiator's onset frame: S3₁ −0.009 [−0.454, +0.341], S3₂ −0.154 [−0.684, +0.238].
      - The participants have been still ≥ 10 s before their onsets, so their positions at f0 and at their own onsets
        should nearly coincide. That the excess vanishes is unexplained here. Candidates are position errors at or
        just before onset frames (compare the D127 misread note) and the snapshot rule (last detection ≤ 3 frames
        back). Not resolved; data only, no simulated counterpart.
    - **S3-p**, the share of still ants that join, by band from the initiator (observed / null 2 / excess): < 5 mm
      0.120 / 0.075 / **+0.044**; 5–10 mm 0.079 / 0.073 / +0.006; 10–20, 20–40 and ≥ 40 mm all within ±0.004.
      The response excess sits at contact range.
    - (d) misreads: pending (D129), not computed.
  - **Reading:**
    - **Most of the raw 11-frame contrast is episode composition.** Permuting onset times within episodes, keeping
      every episode's membership and positions, already gives 8.8 frames. The synthetic size-mixed case (D126, 18:18
      note) showed that mechanism.
    - **The excess ordering in the data is small.** S3₂ is +0.19 frames per 10 mm (≈ 0.1 s per 10 mm), a fifth of the
      proposed ±1.0 tolerance. The pooled raw contrast is ≈ 4 frames per 10 mm.
    - **It is not separated from C2 base,** which has neither mechanism and gives +0.085 [+0.028, +0.146] through the
      same pipeline.
    - It is carried by large episodes ((a) includes 0), and it vanishes in sensitivity (c).
    - **Eu and El20 give no excess** (S3₁ and S3₂ within ±0.03, CIs including 0). P20 (uncalibrated) is at base's level.
    - **F088 is superseded:** its raw contrast stands as a description, but it is mostly composition. Its contrast
      with the arms (11 vs ≈ 1.2) compares a statistic dominated by the data's larger, longer episodes.
    - The response-by-distance excess at < 5 mm (S3-p) is the clearest spatial structure remaining in the data's
      episodes. It is descriptive, without a simulated counterpart. F019 already showed that contact-associated onsets
      cannot be attributed to the contact.
  - **Carried, as required (D125):** S3-ρ − null 2 +0.007 [−0.001, +0.015] includes 0 (D124).
  - **Wording:** "this gate did not establish positive excess ordering beyond the reference-position control and C2
    base". No statement that propagation is absent, nor that the drivers are supported.
  - **Next (the user's call, D126 amendment 1):**
    - (i) stop Part D at Stage 0: S2's distance decay stays the one profile the tested drivers miss (D122);
    - (ii) continue to Stages 1–3 with S3 as computed (expected near 0) and S2 as the main spatial row, once the
      remaining amendments are approved and the 2-D rule is calibrated;
    - (iii) first resolve sensitivity (c) and the misread check (d), which bear on whether any data ordering survives.
  - **Finding: F092** (supersedes F088).
    - Slip, corrected at once: a concurrent session had added F089–F091, so the new finding was numbered F092. The
      lead's first supersede command named F089, linking F088 to the other session's rest-shape finding and writing
      `supersedes: F088` into its file.
    - Both were reverted, F088 → F092 linked, and `findings.mjs check` passes. No other field of F089 was changed (its
      title was already quoted).
