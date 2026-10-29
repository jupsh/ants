---
id: B004
title: Form of the slow displacement in still periods
status: done
size: M
priority: 100
note:
outcome: Bursty, bounded-amplitude shifts (diffusive in steady state after a decaying post-stop transient), not continuous creep; tag rotation carries about 12-15 %; model lacks it (foragers) or has the wrong structure (nurses)
depends: data/fits/s2018-tracker.json, data/stroeymeyt2018/main_experiment/original_data/info.txt
---
# B004 — Form of the slow displacement in still periods

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: data/fits/s2018-tracker.json, data/stroeymeyt2018/main_experiment/original_data/info.txt
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: STATUS § Open problems and backlog (seeded 2026-10-18); RESUME (check B: MSD, no common camera drift).
Scoped by the lead agent 2026-10-18.

## Question
In the data, still periods (< 0.6 mm per frame) carry widespread slow sub-threshold displacement, which the
observer variants do not reproduce. What form does it take?
- continuous creep;
- rare micro-steps between true rests;
- tag rotation: head or body turns that move the tag centre.

## Why it matters
- **Creep or tracking error.** The answer decides between two RESUME options: a physical creep arm (it moves
  bodies) and explaining the displacement as tracking error.
- **Contacts and packing.** It bears on the still–still contact count (now disclosed as measurement-ambiguous,
  no longer a blocker) and on packing.
- **Urgency: low.** It blocks neither C2 nor step 5.

## Done when
For still runs ≥ 60 s in the fit colonies:
- the MSD exponent over 1–60 s;
- the step-length distribution against the tracker's noise floor;
- the share of displacement carried by steps above 3× the noise;
- if the tracks carry the tag angle, the relation between angle change and displacement.

The same statistics on one simulated run through the frozen tracker, for comparison. Then a classification in a
few sentences.

## Base
<At claim: commit, and whether `src/sim/analysis/inNest.ts` is dirty.>

## Data and roles
- Fit colonies: fit, inspected in check B.
- Age-experiment colonies: held-out, never.

## Compute
Local, niced. Data side up to an hour, plus one simulated run.

## Out of scope
Model arms, observer or tracker changes, contacts.

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->
- 2026-10-29 19:45 UTC · claude-side-B004 · Claimed (claude side session). Base: commit 77fb344, src/sim/analysis/inNest.ts clean. Scope kept as written; ran nothing yet. Plan: one accumulator (backlog/B004-slow-displacement-in-still-periods/stillForm.ts) for data tracks (with tag angle) and for simulated colonies through the frozen tracker (no angle). Unit: bounded still runs >= 120 frames (60 s; steps < 0.6 mm/frame, gaps <= 3, flanked by moving steps), nurse and forager apart, 22 fit colonies PreTreatment. Statistics: MSD at lags 1..120 frames and its exponent with and without the 4*sigma^2 floor; lag-1 step-length histogram vs noise (step scale sqrt2*sigma, threshold 3x = 0.076 mm at sigma 0.018); non-overlapping 5-s and 30-s blocks: share active (> 3*sqrt2*sigma), P(active | prev active), direction cosine of consecutive active blocks, share of sum r^2 from active blocks, lag-10 excess kurtosis; tag angle: |dtheta| vs r^2 by bin, and a per-ant tag-offset model (displacement = (R(th1)-R(th0)) o, both handedness) R^2 against a within-ant shuffle null. Readings fixed before running: CREEP = most blocks active, persistent direction (cos > 0.3), no heavy tail, exponent over 1-60 s near or above 1; MICRO-STEPS = few active blocks, isolated (P(active|active) close to P(active)), heavy tail, large share of sum r^2 from few blocks; TAG ROTATION = offset-model R^2 clearly above its shuffle null and r^2 rising with |dtheta|; if the offset model matches the null, rotation is not the form. Mixed results are reported as mixed. Development use of fit colonies only (already inspected, check B); no held-out data.
- 2026-10-29 20:07 UTC · claude-side-B004 · Data side run (22 colonies x 24 h, stillData.ts, aggregate.ts -> results/data.json); readings below in Findings draft. Now the simulated side: C2 fit (data/fits/s2018-motion-c2.json) through the frozen tracker, 22 colonies x 4 h light phase (stillSim.ts), same accumulator minus angle. Reading: the model has no creep and the observer only noise (+ pixel-level), so if the model reproduces the data's MSD plateau/exponent, block activity and front-loading, the displacement is mostly the walking-to-rest transition the model already makes; if it shows only the noise floor in late blocks (MSD flat, active share ~0 after ~80 s), the slow displacement in long rests is outside the model, as F013 says.
- 2026-10-29 20:54 UTC · claude-side-B004 · Finished: sim side rerun with the steady-state (core) MSD; results/data.json and results/sim.json stamped, check B004 ok. Findings written. Disk-quota stop mid-way (tmp volume) cost one rerun of both sides; nothing deleted.

## Findings
**Answer.** In long still periods (bounded runs of at least 60 s, 22 fit colonies, 24 h each; about 30 900 nurse and 28 400
forager runs) the slow displacement is **intermittent bounded-amplitude movement, diffusive in the steady state, with a
decaying post-stop transient on top; tag rotation carries about 12-15 % of it.** It is neither continuous creep nor
isolated micro-steps between true rests. Nurses and foragers agree.

Evidence (`results/data.json`; colony bootstrap CIs there; nurse figures, foragers within a few percent unless noted):
- **Steps.** 59-63 % of frame-to-frame steps are exactly zero (the same pixel twice; the simulated observer gives 0.3 %).
  5-6 % of steps exceed 3x the noise scale (0.075 mm) and carry 89 % of the summed squared step. Consecutive steps keep
  their direction (lag-1 autocorrelation +0.26 nurse, +0.24 forager; iid position noise would give -0.5). So the
  recorded rest "noise" is sticky and bursty, not frame-level jitter; the Gaussian floor 4 sigma^2 (0.0019 mm^2) is above the data's own lag-1 MSD
  (0.0008 steady state), so it is not the right noise model for exact-zero-heavy positions, and the floor-subtracted
  exponents in `data.json` are unusable at short lags (read the raw ones).
- **Not continuous creep.** 5-s blocks: only 18 % (nurse) / 20 % (forager) are above 3x noise; 30-s blocks 40 / 46 %.
  Excess kurtosis of 5-s displacements 54 / 46 (Gaussian 0).
- **Not isolated micro-steps.** An active block is followed by an active one 61 % of the time (base rate 18-20 %): activity
  comes in episodes. Direction is only weakly kept between consecutive active blocks (cosine 0.18 / 0.15 at 5 s, 0.11 at 30 s).
- **Time since the stop.** Strongly front-loaded: 96 % of the first 5-s block of a run is active (mean r^2 0.98 / 0.90 mm^2), 70 % in the block starting 5-10 s, 48 % at 10-20 s, 30 % at 20-40 s, falling to about 10 % active (mean r^2 0.03 mm^2) after 5 min. The end of a run rises again (63 % active in
  the last 5 s). Over whole runs the MSD therefore saturates (exponent 0.57-0.65 over 30-60 s); that is the transient.
- **Steady state** (pairs at least 80 s from both run ends, all 22 colonies): MSD(5 s) 0.012 / 0.014, MSD(30 s) 0.087 / 0.100
  mm^2, exponent 1.11 / 1.10 over 1-60 s (1.00 / 1.04 over 30-60 s): diffusive, not saturating, not drifting
  (creep would approach 2), about 7e-4 mm^2/s.
- **Tag rotation.** A per-ant tag-offset model (displacement = (R(theta1) - R(theta0)) o, theta sign flipped, i.e. the image
  y-axis) explains 15 % (5 s) / 14.5 % (30 s) of the summed squared block displacement for nurses (14 / 12 % foragers) against 0.07-0.6 % for a
  within-ant shuffle of the angle pairs, in every colony; restricted to the steady-state windows 12 / 14 % (12 / 14 %).
  The fitted offset is 0.4-0.7 mm (median per ant), a plausible tag-to-body-centre distance, and mean r^2 rises steadily with |dtheta|.
  The unflipped sign explains 1-9 %. The rotation can be the tag turning or the ant pivoting; the tracks cannot say which.
- **Model (C2 fit through the frozen tracker, 22 colonies x 4 h, light; `results/sim.json`).** Foragers hardly move in long
  stills (steady-state MSD(30 s) about 0.006 vs 0.10 mm^2), so the forager model lacks this displacement. Nurses match the data's
  steady-state MSD (0.091 vs 0.087 mm^2 at 30 s; exponent 1.02 vs 1.11) but not its structure: exact zeros 0.3 % vs 63 %, lag-1
  autocorrelation -0.07 vs +0.26, consecutive-active-block cosine 0.84 vs 0.18, active-given-active 0.33 vs 0.61. The model's
  displacement in "still" runs is slow directed walking, not the data's bursty wobble. The sim has no tag angle, so the rotation share is data-only.

**What it implies.** (1) A physical creep arm of the continuous kind is not supported: the data are episodic and bounded, not
a steady drift. (2) The tracks cannot separate real small body shifts from tag/pivot error (F013's limit stands), but a
rotation offset accounts for only about an eighth, and the zero-heavy sticky positions mean frame-level measurement jitter
is not the form either. (3) For the 32 motion rows nothing changes (F014). (4) For contacts and packing, a bounded
bursty wobble of about 0.3 mm (steady-state rms over 30 s) is the scale to consider; whether it is body or tag motion decides
if it changes contacts. A model arm would have to be an episode process (bursts of a few seconds with weak direction persistence, decaying
after each stop), not a diffusion constant. Nothing implemented or proposed for the main tree.

**Confidence and caveats.** High for the descriptive statistics (22 colonies, CIs tight). Medium for "diffusive in the steady
state": my core windows need runs of 480 frames or more, which select longer rests, and the 1-5 s exponent in the core is
already close to the zero-heavy noise. The 3x-noise threshold uses the colony noise row (sigma about 0.02 mm) and is a
convention; the zero mass shows it is not a Gaussian scale, so "active" means "above 0.075 mm". The model comparison is 4 h per colony
(light) against 24 h of data, with one seed each. The offset model has two parameters per ant and assumes a rigid tag offset.
Data roles: fit colonies, development use (inspected, as check B); no held-out data read.

**Next steps (for the user to choose).** An episode-process description for the model if the still-period displacement ever matters
for contacts; a body-angle estimate (not in the tracks) would be needed to split pivot from tag error.
