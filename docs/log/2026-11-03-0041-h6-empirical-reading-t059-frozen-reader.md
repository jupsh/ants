---
id: D260
date: 2026-11-03
time: 00:41
kind: reading
title: H6 empirical reading (T059; frozen reader D259): both decision labels unresolved; initiation repeatability between day halves is not above either reference (R-bar -0.044 vs null-1 97.5th percentile 0.047; -0.048 vs null-3 0.049, support met in 21 colonies), and no sensitivity disagrees; S1 coverage-limited and uninformative (windows without an observed contact almost never meet coverage); S2 shows no direction by current location; S3's crossing arms are empty under D212's exclusion rule
---
- **2026-11-03 ≈ 00:41 UTC — H6 empirical reading (T059; frozen reader D259): both decision labels unresolved; initiation repeatability between day halves is not above either reference (R-bar -0.044 vs null-1 97.5th percentile 0.047; -0.048 vs null-3 0.049, support met in 21 colonies), and no sensitivity disagrees; S1 coverage-limited and uninformative (windows without an observed contact almost never meet coverage); S2 shows no direction by current location; S3's crossing arms are empty under D212's exclusion rule.**
  - **What ran:** the frozen reader `scripts/frozen/h6/scripts/scratch/h6-next/reader.ts` (`3c3985c0…`, D259; its
    output's `reader` field reads `scripts/scratch/h6/reader.ts`, a string in the code, not the file that ran) with
    `--h6-read --empirical --assign real --work logs/h6-work-next` (the frozen extractor's 22 intermediates, each
    matching the rebuild report's hash), all parts, 1,000 reference draws, 2,000 colony-bootstrap draws. The first
    run (`h6-reading-20261103`, gate `run:h6-reading-20261103`) died of JavaScript heap exhaustion at Node's default
    ~2 GB after 3 min 19 s, writing nothing; the rerun (`h6-reading2-20261103`, its own gate) with
    `NODE_OPTIONS=--max-old-space-size=6000`, nothing else changed, finished `ok` in 4 min 20 s. Output
    `logs/h6/reading.json`, SHA-256 `0e9822fccf81b5f84abd000cd9f7217e5da2053f585310ea9fa925cdb8cfa373`. Data: the 22
    Stroeymeyt fit colonies, light phase (development).
  - **Primary (the only decision labels, P149):** 25,935 episodes (3 ants, 5-s gap); 22 colonies enter under null 1,
    21 under null 3. Null 3's support rule is met (21 colonies with ≥ 30 informative episodes in each half).
    - **Null 1:** R̄ −0.044 against the reference draws' 97.5th percentile 0.047 (median −0.001); R̄ − median 95 % CI
      [−0.069, −0.021]. Label: **unresolved** (the rule needs R̄ above the 97.5th percentile and the interval above 0).
    - **Null 3:** R̄ −0.048 against 0.049 (median 0.001); R̄ − median [−0.095, −0.003]. Label: **unresolved**.
    - So no positive initiation repeatability between day halves (06–12, 12–18 UTC) was detected beyond what
      participation alone, or location within the high- and low-forager-visit zones, gives. The registered rule fixes
      how the result is read; it does not establish that there is none. The point estimates lie below both
      references and both intervals exclude 0 on the negative side; the design labels only the upper side, so this
      is descriptive, not a third label, and no sensitivity repeats it (below).
    - **Dispersion of z** (descriptive): −0.038 [−0.080, 0.006] (null 1), −0.028 [−0.066, 0.009] (null 3).
  - **Sensitivities (all reported, none selected; P144):** no label disagrees with the primary (the reader's
    disagreement list is empty). R̄ (null 1; null 3), R̄ − median CI, colonies entering:
    - 5 ants: −0.007 [−0.063, 0.053], 21; −0.051 [−0.126, 0.023], 21. Unresolved, unresolved.
    - 10-s gap: −0.031 [−0.075, 0.015], 21; −0.040 [−0.101, 0.022], 21. Unresolved, unresolved.
    - 5 ants and 10-s gap: −0.011 [−0.075, 0.052], 20; −0.063 [−0.126, 0.004], 20. Unresolved, unresolved.
    - Strict uninterrupted tracking: +0.016 [−0.041, 0.070], 21; −0.024 [−0.091, 0.036], 20. Unresolved, unresolved.
    - Quiet-start episodes (primary set): null 1 −0.010 [−0.087, 0.070], 19 colonies; null 3 −0.047 [−0.161, 0.059],
      17 colonies; unresolved, unresolved. In the other sets the quiet-start subset mostly has too few colonies.
    - The primary's below-reference interval is not repeated by any sensitivity: each of their intervals includes 0.
  - **Role and zone shares of initiators (descriptive, colony-bootstrap 95 % CIs; observed vs reference expectation):**
    under null 1, nurses 0.573 vs 0.576 (difference −0.003 [−0.011, 0.003]), foragers 0.420 vs 0.418 (0.003 [−0.003,
    0.009]), the queen 0.0066 vs 0.0062; zone L (low-forager-visit) 0.525 vs 0.527, H (high-forager-visit) 0.465 vs
    0.463, unassigned 0.009. Under null 3 likewise within ±0.006. The zones are named by forager visits only
    (P143). Initiators' contact class (10 s, null 1): "contact" 0.179 vs 0.186 (−0.006 [−0.010, −0.002]), "unknown"
    0.821 vs 0.814, "no observed preceding contact" 0.00003 vs 0.00007; 60 s: contact 0.530 vs 0.539 (−0.008
    [−0.017, −0.001]), unknown 0.470 vs 0.461, no observed contact 0. Small differences in the unknown share, not
    interpretable as contact effects.
  - **S1 (descriptive, coverage-limited; P173, P148):** "no observed preceding contact" (P134: an observational class,
    no contact with a moving ant observed in the window, coverage met) almost never occurs. With unknowns excluded
    (the denominator is every onset with an observed contact, covered or not, plus every covered one without; the
    reader classes an observed contact as "contact" whatever the coverage, reader.ts:172) its share is 0.0005
    [0.0001, 0.0011] of classified onsets against 0.0022 [0.0005, 0.0044] of classified at-risk still ant-times at W
    10 s (excess −0.0017 [−0.0033, −0.0003]), and exactly 0 of both at W 60 s; the quiet-start stratum at 10 s:
    0.0020 vs 0.0075. Counting unknowns as contact gives ≤ 0.0004 everywhere. Counting unknowns as no observed
    contact gives 0.797 vs 0.899 at 10 s (excess −0.102 [−0.110, −0.093]) and 0.436 vs 0.633 at 60 s (−0.197
    [−0.211, −0.182]), which is the unknown shares' difference restated. Unknown fractions (10 s; 60 s): onsets
    nurse 0.80; 0.44, forager 0.79; 0.43, queen 0.91; 0.65; zone L 0.82; 0.47, H 0.76; 0.39; at-risk nurse 0.91;
    0.65, forager 0.88; 0.58, queen 0.97; 0.84; L 0.91; 0.67, H 0.87; 0.54; both fall from the quiet to the active
    activity contexts (onsets 10 s from 0.90 at the lowest level and falling slope; full tables in the output).
    Reading: among windows without an observed contact, coverage almost never holds (unknown ≫ no observed
    contact), so S1 cannot separate spontaneous from contact-preceded onsets on these data. How many covered windows
    contain a contact is not in the output (covered contacts are not counted apart), so this does not show that almost
    every covered window contains a contact; it is reported as it falls, labelled coverage-limited, with no further
    tuning (P173).
  - **S2 (descriptive; P147, P137):** by current location, ΔF(L→H − H→L) at lag 2 is 0.24 [−1.16, 1.66] (shift
    reference 0.015; observed − shift 0.23 [−1.18, 1.65]; cross-colony pairs, UTC-aligned, 14 ordered pairs: mean
    0.49, 2.5–97.5 % −2.79 to 2.50); lags 1–5 alike, no direction. By fixed membership (each ant's modal zone), ΔF is
    positive at every lag (lag 2: 1.73 [0.43, 3.09]; observed − shift 1.72 [0.42, 3.08]) but lies inside the
    cross-colony reference's range (mean −0.02, −4.31 to 2.89), so it is not distinguished from what pairing unrelated
    colonies' series gives. Granger predictability is not a causal claim (P137).
  - **S3 (descriptive):** the crossing arms are empty: all 551,202 L→H and 552,086 H→L crossings are dropped by D212's
    rule of no same-type event within the windows (crossings are far too frequent for any to stand alone), so both
    crossing DiDs and the direction differences are not estimable. Entry from the arena into L: 3 events, none
    contributing. Entry into H: 16 colonies, 1,120 matched of 3,333 found, DiD +0.0042 [0.0017, 0.0070] moving
    fraction (own post − pre 0.0026; balance on level 0.001, trend −0.001). This is reported as it falls; changing the
    exclusion rule would be a new design, the user's decision.
  - **What this reading does and does not show:** with episode skeletons fixed, no positive carry-over between day
    halves of which participant starts an episode was detected beyond participation or location; an effect as large
    as V3's (weight 3 for a fifth of the ants) was labelled in 200/200 synthetic sets. It does not show that
    initiation is random or that there is no identity effect: a
    weaker identity effect, effects that change within a day, or effects in the dark phase are not tested. Whether contact
    precedes onsets is not identifiable here (S1), and no directional transfer between zones is distinguished from
    the cross-colony reference (S2). Nothing here is causal (P137).
  - **2026-11-03 ≈ 00:52 UTC — two readings corrected (an outside review the user passed on; the lead checked both
    against the reader):** (1) the primary was first worded "initiation shares are not repeatable"; a registered rule
    fixes the reading, not absence, so it now reads "no positive initiation repeatability was detected", and F113's
    title likewise. (2) S1 was first read as "whenever coverage holds, an observed contact is present"; `classOf`
    classes an observed contact as "contact" whatever the coverage, so the 0.0005 is among classified onsets and the
    output shows only that contact-free windows almost never meet coverage, not how many covered windows hold a contact.
    Corrected here, in the title, in F114 and by notes on T060 and T023. The coverage limitation stands.
