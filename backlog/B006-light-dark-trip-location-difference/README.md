---
id: B006
title: Light/dark contrasts the nest model lacks
status: open
size: S
priority: 90
note:
outcome:
depends:
---
# B006 — Light/dark contrasts the nest model lacks

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: STATUS § Open problems and backlog (seeded 2026-10-18); Stroeymeyt archive 2026-10-15 (trip-duration
form); STATUS comparisons Ra and Q (2026-10-17). Scoped and widened from trip durations alone by the lead agent
2026-10-18.

## Question
The data differ between light and dark in three statistics:

| Statistic | Light vs dark |
|---|---|
| Trip duration, median (same lognormal shape) | 132 s vs 336 s, ×2.5 |
| In-nest activity | ×1.37 |
| Rate of contacts involving a moving ant | ×1.5 |

The nest model has no phase dependence: one simulated window serves both phases, and the loss has an
irreducible phase floor of 16.4. Are the three contrasts one phenomenon or several, and what would the smallest
mechanism that produces them change?

## Why it matters
- The contrasts are disclosed limitations of step 4.
- A light/dark mechanism would be a model change after M1. Knowing whether one factor covers all three makes
  that proposal concrete.
- No effect on the current plan.

## Done when
1. Per-colony light/dark ratios of the three statistics, from existing data rows and logs (no new statistic
   definitions).
2. Their correlation across colonies.
3. A short design note for the user: candidate mechanisms (a phase factor on walk-on rates, on outRate and
   give-up, or both) and the rows each would move. Nothing implemented.

## Base
Claimed 2026-10-18 by Codex at commit `ecbb918`; data side only. The input summaries
and scripts used here are clean; unrelated STATUS and backlog files were already dirty.

## Data and roles
- Fit colonies: fit, already inspected. Prefer existing reduced rows and logs (`logs/trips/`, the fit rows,
  `logs/contacts/`).
- Age-experiment colonies: held-out, never.

## Compute
None, or minutes locally.

## Out of scope
Implementing anything, changing C2 or the trip inputs, light/dark in the Mailleux set-up.

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->
- 2026-10-18 15:53 UTC · Codex · Reading before calculation: use the 22 designated fit colonies only. Trip contrast = dark/light of each colony's `trip.median` among complete trips; activity and moving-contact contrasts = light/dark of the existing rates in `logs/q/guard-data.json`. Correlate log ratios across colonies (Pearson and Spearman); repeat correlations with at least 10 complete trips in each phase because sparse trip medians can dominate. Consistent positive association would make a shared phase driver plausible; weak or reversed association would favour separate controls. This is descriptive, not a model-selection test. Run one local analysis script and save a per-colony table in this folder.
- 2026-10-18 15:54 UTC · Codex · First calculation: all 22 colonies had at least 10 complete trips in both phases, so that sensitivity is identical to the full sample. Geometric mean ratios: trip 2.368, moving fraction 1.368, moving contacts 1.528. Log-ratio Pearson r: trip/activity 0.453, trip/contacts 0.522, activity/contacts 0.968 (Spearman 0.230, 0.202, 0.967). `results/analysis.md`. Reading before follow-up: repeat each correlation leaving out one colony at a time; if the trip links collapse after one omission, report them as outlier-sensitive and avoid a shared-driver inference.
- 2026-10-18 15:56 UTC · Codex · Follow-up (`nice -n 10 python3 -I backlog/B006-light-dark-trip-location-difference/analyze.py`): omitting colony112 lowers trip/activity and trip/contacts Pearson r to 0.093 and 0.095, while activity/contacts remains ≥0.963 under every single-colony omission. Per-colony table and all leave-one-out ranges in `results/analysis.md`; mechanism note in `results/design.md`. No simulation run or model edit.
- 2026-10-18 16:14 UTC · lead-claude · Lead review (2026-10-18): (1) the design note omits the set-up's phase temperature: light 26 °C, dark 22 °C (colonyStroeymeyt.ts STROEYMEYT_TEMP). Moving speed is equal across phases (0.275 / 0.275 cm/s, Stroeymeyt archive), so temperature does not act through speed; whether it acts through switching rates is open (0.47 eV Arrhenius over 22→26 °C gives ×1.28, Q10 2 ×1.32; activity ratio 1.37). Candidate causes for the in-nest contrast should be named apart: temperature, entrainment to the 12-h cycle, light reaching the nest via the entrance or returning foragers; the nest itself is dark to the ants in both phases (IR-pass filter). This matters for step 5: Mailleux 1999 ran at 22 ± 3 °C, lighting unstated. (2) Trip duration: Depickère et al. 2004 (J. Insect Physiol., cleared) found foragers aggregate in darkness and disperse in light; the outside arena is dark in the dark phase, a candidate for longer dark trips (hypothesis only). (3) Status is still open with Findings written and no claim; close it only after (1) is addressed or explicitly left out.
- 2026-10-18 16:24 UTC · Codex · Addressed the lead review in `results/design.md`: added the 26/22 °C set-up and equal forager moving speed, separated temperature, 12-h entrainment, entrance/returner cues, and the darkness-related trip hypothesis; qualified transfer to Mailleux 1999 at 22 ± 3 °C with unstated lighting. No data recalculation, simulation run or model change. Left status open for the user's phase/cause decision noted in STATUS.

## Findings
The light/dark in-nest activity and moving-involved contact contrasts are tightly associated across the 22 fit colonies (log-ratio Spearman ρ = 0.967; each persists after omitting any one colony). The dark/light trip-duration contrast is weakly ranked against either (ρ = 0.230 and 0.202); its moderate Pearson associations vanish when colony112 is omitted. The geometric mean ratios are 2.368 (trip duration, dark/light), 1.368 (moving fraction, light/dark), and 1.528 (moving contacts, light/dark). Evidence and per-colony counts: `analyze.py`, `results/analysis.md`.

This supports a small **two-behavioral-control proposal** for later testing: phase modulation of in-nest walk-on rates for activity and its contact consequences, plus phase modulation of outside-trip give-up for trip duration. Their causes remain unresolved. In-nest candidates are temperature (26 °C light, 22 °C dark), 12-h entrainment, or cues at the entrance or from returning foragers; the nest is dark to ants in both phases. Darkness-related outside aggregation is a trip-duration hypothesis, not an established cause. `outRate` governs trip starts, not their duration; inspect exit-rate checks before adding it. Mailleux 1999 at 22 ± 3 °C aligns with the dark phase only if temperature controls the motion contrast; its lighting is unstated. The affected rows, indirect effects and caveats are in `results/design.md`. Confidence is high for the descriptive ratios and the activity/contact association, low for any causal claim: moving contacts partly inherit movement by definition, the trip associations are outlier-sensitive, and no mechanism has been simulated. No main-tree change is proposed.
