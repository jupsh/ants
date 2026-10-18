---
id: D018
date: 2026-10-17
time: 15:36
kind: design
title: Comparisons Ra (moving-involved contacts), P (packing) and Y (synchrony vs distance): designs and readings logged before any data-side output or packing output exists
---
**2026-10-17 ≈ 15:36 UTC — Comparisons Ra (moving-involved contacts), P
(packing) and Y (synchrony vs distance): designs and readings logged
before any data-side output or packing output exists** (user ≈ 15:35,
"sure" to (a) and (b); Y proposed at ≈ 15:31, taken as included).
Data side: `robustData.ts` on the 22 fit colonies (PreTreatment, light /
dark by UTC as before); model side: the R runs already on disk
(`logs/robust/cs-rob-{ctl,M}-*`). Packing parts of those files have not
been opened.

*Ra — contacts involving a moving ant.* **Cell fixed now: rOut 5.1 mm,
dwell 2** (moving ratio under M 0.972 / 0.970, closest to 1; the
narrowest-band rule would give (5.1, 0) at 0.917 / 0.914, near the
edge — reported as sensitivity with every other cell). Model control /
data, moving-involved contacts per detected ant-frame, geometric mean of
per-colony ratios, colony bootstrap 2000 (`robustAgg.py data`).
**Reading:** *reproduced* if the point ratio lies in [0.8, 1.25] in both
phases; *deficit* (*excess*) in a phase if its CI lies entirely below
0.8 (above 1.25); otherwise marginal. The data's light / dark contrast
is reported beside (old statistic: model / data 0.78 light, 1.19 dark).
If reproduced, the step-5 relevance argument (the 1999 contact rows are
the recruiter's, a moving ant's) is put to the user; the blocker stays
the user's call.

*P — packing (robust state measures).* From the recorded nearest-
neighbour (NN) histograms (tracked ants detected in the nest; 0.25-mm
bins) and 1-mm occupancy maps, per colony, role group and phase:
statistics **S1** median NN distance, **S2** share with NN < 4.1 mm
(near share), **S3** share with NN < 8.2 mm (two body lengths), **S4**
A50 = area (mm²) of the fewest 1-mm cells holding 50 % of ant-frames.
**Robustness filter first (model only):** M / control per statistic,
pooled per phase; only statistics within [0.90, 1.10] in both phases
are judged, the others reported only. **Then data vs model** (control),
per colony ratio model / data, geometric mean, colony bootstrap, all
ants (nurses and foragers beside, descriptive). **Reading:** the model
is *less packed* if S1 and S4 ratios have CIs entirely above 1.1 (or
S2 / S3 entirely below 0.9) for every judged statistic, in both phases;
*matched* if every judged statistic's point ratio is within [0.9, 1.1];
otherwise mixed. Descriptive beside: correlation of data and model
occupancy maps per colony (5-mm cells), i.e. whether the ants are in
the same places (the model has no brood or brood-pile attraction).

*Y — synchrony against distance between ants (comparison X follow-up).*
Recorder `scripts/scratch/ydistData.ts` (data, fit tracks): per tracked
ant per 1-min clock bin, moving steps, steps and mean observed position.
Deviation = moving fraction minus the ant's 4-h clock-block mean (as X).
For every pair of ants both detected in a bin, the product of their
deviations is accumulated by the pair's distance in that bin (distance
of mean positions; classes < 5, 5–10, 10–20, 20–40, ≥ 40 mm);
C(class) = Σ dev_i·dev_j / √(Σ dev_i² · Σ dev_j²) over the class's
pair-bins; per colony, then mean over colonies with colony bootstrap.
**Decay ratio D = C(< 10 mm) / C(≥ 40 mm)** (pair-bins < 5 and 5–10
pooled). **Reading:** *local coupling supported* if D's 95 % lower bound
> 1.5; *box-wide driver supported* if D's upper bound < 1.25 and C(≥ 40)
> 0 (CI); otherwise mixed. Limits, stated now: ants close together share
a micro-environment (brood pile, entrance region), so decay can also
come from region-specific drivers; nurses on the brood are both close and
mostly still. Reported beside: C by class for nurse–nurse,
nurse–forager and forager–forager pairs; the share of pair-bins per
class.
- **Y amended ≈ 15:43, before any Y data output exists** (`logs/ydist/`
  empty; user agreed ≈ 15:40 to model reference runs for Y in the 4-h
  gap). **Seen while smoke-testing the model hook (disclosed):** colony 0,
  model control, light, 300 s + 30 min: C(< 5) 0.13, C(5–10) 0.03,
  C(≥ 40) −0.006, so D = −11.6. Encounter mechanics alone give close ants
  correlated activity, and D is unstable when C(≥ 40) ≈ 0. **Amended
  reading:** primary statistics **L = C(< 10) − C(≥ 40)** (local excess)
  and C(≥ 40) (co-movement at a distance), data (24 h) vs **model
  references** through the same recorder (`ydistStats.ts`, also wired
  into `tmpShortSim --ydist`): control (no coupling), oracle coupled κ =
  1 (`coupled:1:60`, a box-wide driver) and its placebo (`placebo:0.53:
  60`); start point, 22 colonies, light and dark 12 h pooled per colony
  (blocks from the first frame), seed 4242. Comparisons pair colonies by
  label, bootstrap over colonies jointly (2000). *Local coupling
  supported* if data L − control L > 0 (95 % CI) and data D's lower
  bound > 1.5; *box-wide driver supported* if data C(≥ 40) > 0 (CI) and
  data L − control L includes 0; otherwise mixed. **Method check:** κ = 1
  must raise C(≥ 40) above the control's (CI of the difference > 0) and
  leave L − control L including 0; the placebo must leave both at the
  control's level. A failed check is reported and makes the matching
  outcome uninformative. Role-pair rows descriptive. Box run prepared
  for launch ≈ 16:40 (user).
