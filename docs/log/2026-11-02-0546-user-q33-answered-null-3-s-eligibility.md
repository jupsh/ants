---
id: D246
date: 2026-11-02
time: 05:46
kind: decision
title: User: Q33 answered, null 3's eligibility uses point 1's three conditions only (the coverage rule's neighbour clause stays for classifying no observed contact in onsets and S1's at-risk reference) and the observed initiator must meet them; one pooled blind check of S1's unknown share allowed; the implementer's fill-ins confirmed; the S3 entry rule gets D212's observed condition; V1-V4 to run
authority: user
scope: Q33 T059 P151
---
- **2026-11-02 ≈ 05:46 UTC — User: Q33 answered, null 3's eligibility uses point 1's three conditions only (the coverage rule's neighbour clause stays for classifying no observed contact in onsets and S1's at-risk reference) and the observed initiator must meet them; one pooled blind check of S1's unknown share allowed; the implementer's fill-ins confirmed; the S3 entry rule gets D212's observed condition; V1-V4 to run.**
  - **User (verbatim; adopted). It answers Q33 on D245:**
    > Q33: my recommendation.
    >
    > Null 3's eligibility: use only point 1's three conditions:
    >
    > the stand-in was detected on the initiator's onset frame;
    > it was detected in at least 90 % of the preceding 10 s;
    > it was still throughout those 10 s.
    > The neighbour clause stays for classifying "no observed contact" in onsets and in S1's at-risk reference, which is what it guards.
    >
    > The real initiator must also meet those conditions, or the burst is left out of null 3. A diagnostic without this rule gave a V1 false positive.
    >
    > Allow one blind check of S1's "unknown" share. The same clause may make most onsets and at-risk times "unknown", which would leave S1 empty. I'd print only the unknown share, pooled over all colonies, once for onsets and once for the at-risk reference. No roles, zones, contact split or initiators would be printed. If S1 turns out mostly unknown, I'd come back with a radius proposal. The alternative is to report S1 as it falls.
    >
    > Confirm the implementer's fill-ins where D241 is silent. They are listed in the report under doubts, point 4. For example, halves are assigned by a burst's first onset, and an initiator in an unassigned cell makes the burst uninformative.

    and, sent while the lead was recording it:
    > Do V1-V4 run when you're ready. also: fix this - the S3 rule leaves out D212's "observed" condition, which D241 requires.
  - **Effect:**
    - **Q33** is answered. D241 amendment 1 point 3 no longer extends the coverage rule to null 3's eligibility:
      eligibility is point 1's three conditions (detected on the initiator's onset frame, detected in at least 90 % of
      the preceding 10 s, still throughout those 10 s), applied to the observed initiator as well as to each stand-in;
      an episode whose initiator fails them is excluded from null 3 (counted). The coverage rule, neighbour clause
      included, still classes "no observed contact" against "unknown" for onsets and S1's at-risk reference (P148's
      wording is unchanged). Recorded in D241 as amendment 2.
    - **The implementer's fill-ins** (`logs/handoff/20261101-2249-h6-build/report.md`, Deviations and doubts point 4,
      eleven items) are confirmed as written; they become part of the frozen design with the reader.
    - **S3:** the entry-from-the-arena rule gets D212 amendment 1's *observed* condition (every detection in the 30 s
      before the entry outside the nest, the ant's detections from its last one at or before the window's start to the
      entry at most 10 s apart, as `absenceAt` in `scripts/scratch/triggersCore.ts`). A defect against D241's "the D212
      matching", logged as a correction; fixed before the freeze.
    - **One blind check** of S1's unknown share is allowed before the freeze, as an exception to P151 for this check
      only. Details fixed by the lead: light phase, W = 10 s, the onsets and at-risk ant-times that S1 reads under the
      primary settings; the share is pooled counts over all 22 colonies (unknown / all classed), printed as two numbers
      and nothing else. "Mostly unknown" is read as above 50 % in either (lead). If so, the lead returns with a radius
      proposal before the freeze; otherwise S1 is reported as it falls. The check is an inspection of empirical output
      and goes in the contamination log when done.
    - **V1–V4** run at full size (200 data sets per case, 1,000 reference draws) as a lead's long run once the fixes
      are in and checked, on the reader that will be frozen.
  - **2026-11-02 ≈ 15:27 UTC — superseded in part (D249, the user):** "mostly unknown" is now above 50 % in either pooled share or in either zone's share, with one yes/no zone flag printed; the lead's 50 %-pooled reading above no longer applies.
