---
id: D129
date: 2026-10-23
time: 18:21
kind: decision
title: User: Stage 0 confirmed with amendments; tie averaging inside null 1, 20 references or null 2 undefined, the gate on the same colony identities, equal weighting stays primary (spread weighting a sensitivity), misread sensitivity (d) pending; the audit may proceed
---
- **2026-10-23 ≈ 18:21 UTC — User: Stage 0 confirmed with amendments; tie averaging inside null 1, 20 references or null 2 undefined, the gate on the same colony identities, equal weighting stays primary (spread weighting a sensitivity), misread sensitivity (d) pending; the audit may proceed.**
  - **User: Stage 0 confirmed with amendments; "with those changes, I consider the audit ready to proceed."** On the
    D126 values and the two proposals (D126's 18:18 note):
    1. **Ties:** averaging confirmed, and the same rule applies **inside null 1**: each permutation averages its tied
       candidates. If any candidate's slope is undefined, the permutation is undefined (the observed rule). The raw
       contrast keeps its as-built random choice, for continuity.
    2. **Definedness:** thresholds confirmed. 1e−6 mm² is a numerical-degeneracy cutoff, not evidence of a precise
       slope. **Fewer than 20 available reference episodes ⇒ null 2 undefined**; no smaller substitute. The same applies
       to the raw null-2 expectation: the raw − null-2 excess is taken over the episodes where it is defined.
    3. **Colonies:** five episodes and 15 colonies confirmed. **The gate is evaluated on the same colony identities:**
       colonies estimable in both data and base, at least 15 of them, or "unestimable". A missing base statistic is
       also "unestimable". Exclusions are reported; all-estimable summaries are kept as description.
    4. **Seeds:** confirmed.
       - Set indices: data 0, base 1, Eu 2, El20 3, P20 4 (bootstrap seed 0x5ea0 + index).
       - The final script hashes are frozen in this entry before the run.
       - The independent snapshot stream is kept.
    5. **Snapshot sensitivities** (b), (c), S3-p on the data only: confirmed. They are labelled descriptive and outside
       the gate; without simulated counterparts they cannot show how the restrictions change the data − model
       difference.
    6. **Proposal 1 not adopted: equal weighting stays primary.**
       - Spread weighting changes the estimand, from the average episode's excess slope to one dominated by large,
         widely spread episodes.
       - Lower synthetic variance does not show that both target the same quantity when episode slopes differ.
       - Null calibration: the weight comes from the observed initiator, which null 1 changes and null 2 replaces, so
         weighting observed − null by it is not the full weighted estimator under the null.
       - Spread weighting is a **declared sensitivity**. Promoting it would need a fully specified weighted null and
         checks with heterogeneous episode slopes.
       - The synthetic estimates are **consistent with zero**, not shown unbiased.
    7. **Proposal 2:** confirmed as pending and outside the gate.
       - The misread definition is frozen independently of the S3 results. Suspected onsets are removed before
         episodes are rebuilt, and the numbers of onsets and episodes that change are reported.
       - **Withdrawn:** "would dilute ordering". Misreads could also change the selected initiator, merge episodes or
         alter spatial structure; the direction of bias is not established.
    - **For the later, unapproved stages:** clamping the driver multiplier generally breaks its mean-one normalisation.
      The normalised multiplier before clipping and the multiplier actually applied are kept apart, and both reported.
      This need not be resolved for Stage 0.
  - **Lead's correction:** the D126 amendment-1 lines carried hand-typed times (18:10, and 18:45, which was later than
    the real time). They are corrected from file modification times to 18:09 and 18:18. Times come from the tool or
    file stamps only.
  - **Next:** apply 1–3 and the sensitivity to the code, rerun the synthetic tests, freeze the hashes here, unseal the
    output folder (the pre-registration is now frozen), then run: simulated sets first, then the data.
  - **Frozen before the run** (D129 changes applied; synthetic tests all pass, including new checks: null 2 undefined
    with 19 references, an undefined tie candidate, and the reader's gate on common colonies and its unestimable outcome).
    md5: `scripts/scratch/s3Audit.py` 9ce3f5a29f9f87961c5f884328b778e3; `scripts/scratch/s3AuditRead.py` c79bec04e9beb2195caa5bfb7a5f17db; `scripts/scratch/s3AuditTest.py` 99db17f5a710307be5f3b9722dfde92c; `scripts/scratch/onsetStats.ts` a35e514402a4b82df43ba1e086627630; `scripts/scratch/snapData.ts` a419d2c3e82a65fd3d5353486617d319.
  - **Run started:** `s3audit-20261023T182640Z` (local, 14 jobs; `scripts/scratch/s3AuditRun.sh`): data snapshots and the events
    check, then the simulated sets (base, Eu, El20, P20), then the data, then the reader.
