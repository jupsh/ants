---
id: D221
date: 2026-10-31
time: 01:10
kind: reading
title: Part D item 1(b) read (D212 amendments 1-2; D220): queen movement onsets exceed the margin (DiD 0.0073 [0.0045, 0.0108] in moving fraction, ≈ 26 % of pre-event activity; no pre-event rise); forager entries 'exceeds: a positive association smaller than the chosen margin' (DiD 0.0022 [0.0018, 0.0026]), preceded by a rise (calibrated, 4 %); observational associations, not triggering established; the 10-min D_w shortfall untested
---
- **2026-10-31 ≈ 01:10 UTC — Part D item 1(b) read (D212 amendments 1-2; D220): queen movement onsets exceed the margin (DiD 0.0073 [0.0045, 0.0108] in moving fraction, ≈ 26 % of pre-event activity; no pre-event rise); forager entries 'exceeds: a positive association smaller than the chosen margin' (DiD 0.0022 [0.0018, 0.0026]), preceded by a rise (calibrated, 4 %); observational associations, not triggering established; the 10-min D_w shortfall untested.**
  - **Run:** `triggers-cal-full-20261031T003816Z` (gated `run:triggers-cal-full`; exit 0): the 100-seed calibration
    (`logs/partd2/triggers-calibration.json`, sha256 `792dd761…`), then the 22-colony pass (`logs/partd2/triggers/`).
    Read with `triggersAgg.ts` (md5 `66823406`; gated `run:triggers-read`) → `logs/partd2/triggers/result.json`
    (sha256 `2aadd51e…`). Scripts as D217; the read followed the quorum agreement (D220).
  - **Self-checks first (P92):** all 22 colonies PASS (moving steps and steps equal an `ActivitySeries` pass exactly),
    checked in the run log before anything else was read; the aggregator refuses otherwise.
  - **Calibration (P100):** the rise label's false-positive rate in the synthetic null was forager 0.04 (4 of 100
    seeds), queen 0.02 (2 of 100); both at or below 0.05, so both types' rise labels are read.
  - **Primary rows** (light, W = 1 min; colonies weighted equally; 2,000 colony draws; moving fraction of in-nest
    nurses and foragers, the event ant excluded):

    | | forager entries | queen movement onsets |
    |---|---|---|
    | events found / edge / unmatched / matched | 4,292 / 63 / 617 / 3,612 | 704 / 8 / 54 / 642 |
    | contributing colonies (support) | 22 (yes) | 22 (yes) |
    | balance L, R (≤ 0.1) | 0.0024, −0.0002 (ok) | 0.0059, 0.0008 (ok) |
    | pre-event activity (mean L) | 0.026 | 0.028 |
    | DiD | 0.0022 [0.0018, 0.0026] | 0.0073 [0.0045, 0.0108] |
    | events' post − pre | 0.0011 [0.0008, 0.0014] | 0.0064 [0.0038, 0.0097] |
    | DiD − δ | −0.0004 [−0.0009, −0.0000] | 0.0045 [0.0018, 0.0079] |
    | rise (−5 to −1 min) | 0.0018 [0.0009, 0.0028] | −0.0016 [−0.0026, −0.0005] |

  - **Reading (frozen rule, labels verbatim):**
    - **Forager entries:** "preceded by a rise: an ongoing association, not evidence of triggering (class: exceeds: a
      positive association smaller than the chosen margin)". Activity after an entry is above both the matched controls
      and its own pre-event level, by less than δ (10 % of pre-event activity); the DiD − δ interval's upper end is
      just below 0 (−0.00004). Activity was already above the controls 5 to 1 min before the entry.
    - **Queen movement onsets:** "exceeds". Activity after an onset is above the matched controls and its own
      pre-event level, by more than δ (DiD ≈ 26 % of pre-event activity, about 0.7 percentage points of moving
      fraction). No pre-event rise: activity 5 to 1 min before an onset is slightly **below** the controls'.
  - **Descriptive (no rule):**
    - **Overlaps:** 56 % of forager entries have another entry within ± 1 min; 11 % have a queen onset within their
      windows. 41 % of queen onsets have a forager entry within their windows.
    - **Isolated events:** forager 0.0013 [0.0007, 0.0018], smaller than with all entries; queen 0.0073 (no queen
      onset is within 1 min of another). **Controls ≥ 5 min from any same-type event:** forager 0.0028 [0.0022,
      0.0035], rise 0.0026 [0.0014, 0.0038]; queen 0.0067 [0.0042, 0.0099].
    - **By role (DiD):** after forager entries, nurses 0.0006 [0.0003, 0.0010], foragers 0.0058 [0.0043, 0.0071];
      after queen onsets, nurses 0.0063 [0.0040, 0.0093], foragers 0.0120 [0.0063, 0.0189].
    - **By distance from the event:** forager 20-40 mm 0.0010 [0.0005, 0.0015], 0-20 and > 40 mm unresolved (wide);
      queen 0-20 mm 0.0073 [0.0048, 0.0106], 20-40 mm 0.0112 [0.0040, 0.0225], > 40 mm unresolved.
    - **Other windows and thresholds:** forager W 20 s 0.0012, W 5 min 0.0010 [−0.0013, 0.0028]; absence 10 s 0.0022,
      2 min 0.0017 (20 colonies); residence 30 s 0.0018. Queen W 20 s 0.0065, W 5 min 0.0053 [0.0032, 0.0072];
      stillness 1 min 0.0066, 5 min 0.0083; 3 steps 0.0090 (15 colonies).
    - **Dark phase:** forager 0.0018 [0.0012, 0.0025]; queen 0.0019 [0.0006, 0.0032] (17 colonies).
    - **Event rates per light block** (beside F108): forager entries 23.2, 11.1 and 14.5 per hour (06-10, 10-14,
      14-18 UTC); queen onsets 2.9, 2.2 and 2.8.
  - **What this shows and does not (D213, P93, P98, P80, P83, P86):**
    - These are observational associations; shared drivers and reverse causation remain possible. Neither class says
      an event type triggers activity.
    - The forager association is preceded by a rise, so it is an ongoing association, not evidence of triggering.
      It sits mostly among foragers and is smaller for isolated entries, so co-arriving foragers may carry part of it.
    - Queen onsets are followed by a rise in nest activity above the margin, with nothing similar before them, near
      the queen (within 40 mm) more clearly than far. That is the pattern a trigger would give; it is also the pattern
      of a queen responding first to something the workers respond to slightly later.
    - Whether either event type explains the 10-min D_w shortfall (F104) is not tested here. A 1-min association does
      not make a 10-min process (P80).
    - The forager entry rate is highest in the 06-10 block, as the slow synchrony is (F108); this is variation over the
      light phase, confounded with time since recording began, not a cause (P83).
  - **Findings:** F109.
  - **Next:** D205's Part 2 item 1(c), the foragers' 10-min shortfall (T012), and any model or data work are for the
    user to order; a queen-linked mechanism in a model would be new modelling, a separate design (P87).
