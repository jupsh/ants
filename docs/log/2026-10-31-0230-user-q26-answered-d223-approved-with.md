---
id: D224
date: 2026-10-31
time: 02:30
kind: decision
title: User: Q26 answered, D223 approved with amendments (pasted, adopted): the proposed stay-age groups, survival points and 1-min window kept, B005's data side left separate; m and r read narrowly with both standardisations kept and neither causal; not-in runs labelled observed presence / absence spells, exposure denominators frozen, the out / unseen split kept, a data-only sensitivity with unseen minutes unknown; events, censoring and numbers at risk reported, 'median not estimable', common colony support with exclusions shown; entry clustering excludes the focal ant against an edge- and eligibility-aware uniform benchmark
authority: user
scope: Q26 T012
---
- **2026-10-31 ≈ 02:30 UTC — User: Q26 answered, D223 approved with amendments (pasted, adopted): the proposed stay-age groups, survival points and 1-min window kept, B005's data side left separate; m and r read narrowly with both standardisations kept and neither causal; not-in runs labelled observed presence / absence spells, exposure denominators frozen, the out / unseen split kept, a data-only sensitivity with unseen minutes unknown; events, censoring and numbers at risk reported, 'median not estimable', common colony support with exclusions shown; entry clustering excludes the focal ant against an edge- and eligibility-aware uniform benchmark.**
  - **User (pasted, verbatim; adopted):**
    > I recommend **approve with amendments**.
    >
    > Keep the proposed choices:
    >
    > - **Stay-age groups:** entry minute, 1–4, 5–19, 20–59 and ≥60 minutes.
    > - **Survival points:** stays at 10, 30, 60 and 120 minutes; trips at 2, 10, 30 and 60 minutes.
    > - Keep **1-minute D_w alongside 10-minute D_w** as a secondary descriptive comparison.
    > - Leave **B005’s data-side mixture separate**, keeping this analysis bounded.
    >
    > Amend four points before implementation:
    >
    > 1. **Interpret the decomposition narrowly.** m is activity-variance-weighted co-presence among eligible ants, rather than simply their number. r is a normalized cross-product measure, with its correlation interpretation requiring the stated assumptions. Keep both directions of the arithmetic standardisation; neither estimates what changing residence would cause.
    >
    > 2. **Make missingness explicit in residence and trips.** Runs of “not-in” minutes include nondetection. Label these as observed presence/absence spells rather than verified biological stays and trips. Freeze comparable exposure denominators for data and runs, retain the out/unseen split, and add a data-only sensitivity that treats unseen intervals as unknown rather than confirmed absence.
    >
    > 3. **Handle survival support carefully.** Report events, censoring and numbers at risk at each survival point. If the median is not reached within supported follow-up, report **“median not estimable”**, rather than “> window.” Specify common colony support for comparisons and show exclusions; undefined values must remain missing.
    >
    > 4. **Correct the entry-clustering reference.** The question concerns another forager’s entry, but the proposed N−1 formula also includes repeat entries by the focal ant. Preserve per-ant entry counts, exclude that ant’s entries, and account for window edges and eligible minutes. Describe the uniform-time reference as a simple benchmark: excess clustering against it does not establish interaction or triggering.
    >
    > Preserve the existing Stage 2b classes and the planned reconstruction checks. The result should locate discrepancies in occupancy, observed coupling and stay/trip structure; any model revision follows through a separate design.
  - **Effect:** Q26 is answered. D223 is approved with amendments, frozen as D223 amendment 1 (written into D223, with
    the details the lead fixed to implement points 2–4). The three open choices are settled as proposed: the stay-age
    groups and survival points as drafted, the 1-min window kept as a secondary descriptive comparison, and B005's data
    side left out. Stage 2b's classes (P82) and the reconstruction checks stay as designed. A model revision needs its
    own design (P103).
