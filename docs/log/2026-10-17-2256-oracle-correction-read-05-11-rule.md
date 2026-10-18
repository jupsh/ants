---
id: D035
date: 2026-10-17
time: 22:56
kind: reading
title: Oracle correction read (05:11 rule, original geometry): with foragers coupled, (a) is met and (b) kept — κ = 1 overshoots the data's synchrony; κ = 0.5 falls short
---
**2026-10-17 ≈ 22:56 UTC — Oracle correction read (05:11 rule,
original geometry): with foragers coupled, (a) is met and (b) kept — κ
= 1 overshoots the data's synchrony; κ = 0.5 falls short.** Run
`oc-20261017T211940Z` ok (53 min); `logs/oc/sync.txt`, `persist.txt`,
`rows.txt`. Checks: the rerun synchrony control `oc-ctl` reproduces the
earlier control (`t12-ctl`) exactly in all-ant and nurse D, 22 / 22
colonies; the data side matched its backups (21:26). Realised SD of log g
in the coupled arms 0.38 (κ 0.5) / 0.63 (κ 1) vs placebo SDs 0.32 /
0.53: 1.19× both, just inside the 20 % flag.

| D_w, light, 1 min / 10 min | data | control | κ 0.5 | κ 1 | placebo 0.32 | placebo 0.53 |
|---|---|---|---|---|---|---|
| all ants | 4.15 / 6.28 | 1.25 / 1.57 | 1.84 / 2.70 | **5.99 / 13.26** | 1.19 / 1.50 | 1.16 / 1.43 |
| nurses | 3.67 / 5.12 | 1.16 / 1.42 | 1.52 / 2.00 | 4.45 / 9.01 | 1.11 / 1.30 | 1.08 / 1.26 |
| foragers | 2.12 / 3.12 | 1.12 / 1.27 | 1.34 / 1.72 | 2.81 / 5.74 | 1.08 / 1.26 | 1.08 / 1.23 |

- **(a) met:** κ = 1 exceeds the half-gap bars (2.7 / 3.9) at both widths,
  indeed overshoots the data (all ants ×1.44 at 1 min, ×2.1 at 10 min);
  its placebo does not rise. *Literal-reading note:* the placebo's 1.16
  at 1 min lies just below the control's CI [1.19, 1.30] (1.43 inside
  [1.37, 1.75] at 10 min); the rule guards against a placebo that rises
  (modulation), and the 06:20 reading accepted a similar slightly-below
  value, so it is read as "at the control's level", flagged. κ = 0.5
  does not meet the bars (1.84 / 2.70). **Corrected ≈ 22:58 (user):**
  the 05:11 rule's clause "the placebo stays at the control's level (the
  CI of the control's D)" is **unmet as written at 1 min** (1.16 below
  [1.19, 1.30]); it is reported as unmet beside the "no increase"
  interpretation used at 06:20, not broadened. The capacity result
  stands on κ = 1's size, not on that clause.
- **(b) kept:** 6-h lag correlation nurse / forager: control 0.49 / 0.46;
  κ 0.5 0.48 / 0.45; κ 1 0.48 / 0.41; placebo 0.32 0.48 / 0.48; placebo
  0.53 0.52 / 0.47 (all within 0.10).
- **(c) rows (loss, control 21 316):** κ 0.5 21 435, κ 1 19 143, placebo
  0.32 18 999, placebo 0.53 15 688. The placebos' row gains equal or
  exceed coupling's: as in the 06:20 run, the row gains come from
  per-ant modulation, not sharing; κ 1 improves still.nurse slightly
  (|z| 5.4 → 5.1) where placebo 0.53 worsens it (→ 7.4).
- **Outcome per 05:11:** shared coupling of this global form *can*
  produce the data's synchrony (at κ = 1 more than enough) without
  breaking persistence. This establishes **diagnostic capacity only**:
  the oracle is a cheat channel on the colony's true state. ~~X says the
  synchrony is mainly within-nest and Y that it is graded over 1–4 cm,
  which a global signal does not produce~~ **(overstated, corrected ≈
  22:58, user):** X argues against a dominant driver shared *across
  recording systems*, but a signal shared within one nest remains
  possible; Y shows spatial structure that a purely uniform signal does
  not explain (Y's κ = 1 reference, nurse-only, was flat beyond contact
  range). Neither establishes that there is no global component; the
  mechanism remains unresolved. The next question (05:11)
  — external vs ant-to-ant coupling, and here the spatial form — is a
  design, not a fit. The 06:20 "closed line" verdict is superseded for
  the coupled-everyone case; no further κ or τ arms (user, 21:15).
