---
id: P76
title: Trail sigma sourced and grid checked before any trail-following result
wording: >-
  Before any trail-following result, the sigma is chosen from a cleared source, or fitted to trail
  data with a designated role, and the grid is no coarser than the one B017 checked for that sigma
  (cell <= sigma/2) unless a grid check at the new sigma passes B012
made: D190
state: open
nodes: [T046]
reviews:
  - action: merge:browser-sim-m1@f8d29d5
    disposition: not-triggered
    because: >-
      A local fast-forward of main (8bc7789) to browser-sim-m1 (f8d29d5): it adds no content beyond
      the 18 commits already on the branch, each of them gated when made
      (commit:synchrony-review-20261101 ... commit:b016-records-20261103), where the content this
      commitment governs was reviewed. Nothing is pushed or published by this step. No freeze, model
      change, run, held-out use or new reading is in it.
    by: lead (session e38b977a)
    at: "2026-11-03 16:41 UTC"
  - action: merge:browser-sim-m1@78765aa
    disposition: not-triggered
    because: >-
      A fast-forward of main (f8d29d5) to browser-sim-m1 (78765aa), pushed with the user's
      instruction (D326): five commits already on the branch, each gated when made
      (commit:q38-records-20261105 ... commit:partd-backfill-records-20261107). They hold records
      and byte-identical copies of frozen Part D readers; no src/, public/, fit or data change, so
      the published pages are unchanged. No freeze, model change, run, held-out use or new reading
      is in it.
    by: lead (session 9871fd6b)
    at: "2026-11-07 05:44 UTC"
    inputs:
      - record: D326
        rev: 4af08c5fa754c9b883af7b755d3b50d8b0f284acdc6fa13039d238587d0e1a6b
---

## History
- 2026-10-30 04:38 UTC lead (session d2c88fa6): created — D190 item 2: no biological sigma until sourced
- 2026-10-30 05:36 UTC lead (session 9d2b15e6): reviewed D194: D194 cites D190 only for the B017 ordering; it has no trail-following result and chooses no sigma. Unaffected.
- 2026-10-30 17:42 UTC lead (session 13dd4558): reviewed D195: D195 applies the B017 patch with samplingSigmaMm=0 and chooses no sigma, nothing enables the footprint, and no trail-following result exists, so P76 is neither triggered nor changed. It still governs the first trail-following result.
- 2026-11-03 16:41 UTC lead (session e38b977a): review for merge:browser-sim-m1@f8d29d5: not-triggered — A local fast-forward of main (8bc7789) to browser-sim-m1 (f8d29d5): it adds no content beyond the 18 commits already on the branch, each of them gated when made (commit:synchrony-review-20261101 ... commit:b016-records-20261103), where the content this commitment governs was reviewed. Nothing is pushed or published by this step. No freeze, model change, run, held-out use or new reading is in it.
- 2026-11-07 05:44 UTC lead (session 9871fd6b): review for merge:browser-sim-m1@78765aa: not-triggered — A fast-forward of main (f8d29d5) to browser-sim-m1 (78765aa), pushed with the user's instruction (D326): five commits already on the branch, each gated when made (commit:q38-records-20261105 ... commit:partd-backfill-records-20261107). They hold records and byte-identical copies of frozen Part D readers; no src/, public/, fit or data change, so the published pages are unchanged. No freeze, model change, run, held-out use or new reading is in it.
