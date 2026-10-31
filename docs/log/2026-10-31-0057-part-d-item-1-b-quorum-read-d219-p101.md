---
id: D220
date: 2026-10-31
time: 00:57
kind: reading
title: Part D item 1(b) quorum read (D219; P101): the independent second implementation agrees with the first on both synthetic cases: every event, drop, matched control and per-event value (1,100 events, 5,266 controls, within 1e-9), every count, the aggregate point estimates, classes and rise labels; only the joined label string's format differs; the read may proceed
---
- **2026-10-31 ≈ 00:57 UTC — Part D item 1(b) quorum read (D219; P101): the independent second implementation agrees with the first on both synthetic cases: every event, drop, matched control and per-event value (1,100 events, 5,266 controls, within 1e-9), every count, the aggregate point estimates, classes and rise labels; only the joined label string's format differs; the read may proceed.**
  - **Inputs:** the dumped synthetic cases `rise` and `none3` (22 colonies each; `logs/partd2/quorum/frames/`, MANIFEST
    sha256 `d3e3f1b6…` and `b86605c0…`), written by `triggersSyn.ts --dump-quorum` (md5 `a96f4e90`; brief and report
    `logs/handoff/20261031-0045-quorum-dump/`; round trip equal for all 44 colonies, checked by the lead: Core and Stats
    md5s unchanged, every frame sha256 matches). First implementation's results in `first/`; the second's
    (`scripts/scratch/quorum2.ts`, md5 `f3fe5400`, built from D212's text under the independence rule; brief and report
    `logs/handoff/20261031-0050-quorum-second/`) in `second/`.
  - **Comparison** (lead's script, scratchpad `quorumCompare.py`; ant tags mapped to indices from the frame headers;
    first's unmatched events left out, as the second lists matched events only): per colony and type the found, edge,
    gap, empty, unmatched and matched counts; the event frames; per event the ant, L, R, A_pre, A_post, DiD, rise and
    the sorted control frames; per type contributing, support, balance L, R and ok, the point estimates of DiD,
    post − pre, DiD − δ and rise, the class, the rise label and the label. Sensitivity checked: a planted 1e-6 change in
    one DiD and one shifted control were both reported.
  - **Result: agreement.** 1,100 events and 5,266 controls compared; 0 differences in counts, events, controls,
    per-event values, aggregate estimates, classes or rise labels. One difference, format only: the none3 forager
    label joins the same class and rise label as "preceded by a rise: … (class: …)" (first) and "<class>; preceded by
    a rise: …" (second). Classes: rise, both types "exceeds"; none3, both types "an association smaller than the
    chosen margin", the forager with the rise label.
  - **Intervals** (separate bootstraps, not compared): e.g. rise forager DiD [0.0716, 0.0976] and [0.0721, 0.0972].
  - **Noted:** amendment 2 wrote the pooled SD as "Σ(n−1)·SD²/Σ(n−1)", which is a variance; both implementations
    take its square root. The text is corrected in place (dated line in D212). The no-rise case's forager rise label
    fires on seed 3, as D215 reported: that is what the 100-seed calibration (amendment 2) measures.
  - **Effect (P101):** no difference to resolve; the read may proceed once the calibration and per-colony runs end.
