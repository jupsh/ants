---
id: D317
date: 2026-11-06
time: 04:23
kind: run
title: ants-lab L0004 on T064: the researcher drafted the item 1(e) pre-registration, sent to the user as ask L0004 without panel pre-review (P200 second implementation not yet supported); the draft was lost with the workspace (gitignored output) and recovered from the transcript
---
- **2026-11-06 ≈ 04:23 UTC — ants-lab L0004 on T064: the researcher drafted the item 1(e) pre-registration, sent to the user as ask L0004 without panel pre-review (P200 second implementation not yet supported); the draft was lost with the workspace (gitignored output) and recovered from the transcript.**
  - **L0004** (04:15:35-04:21:55 UTC), continuing L0003's hand-off (D315): one researcher session (Claude Opus 5.5,
    high), `ok`, 251 events, 1,324,650 input / 31,182 output tokens, cost estimate $1.44. Proposal kind
    `preregistration`, tier user; contract artifact `2bc321c1…`. The conductor made it ask L0004 directly, with no panel
    pre-review: "not yet supported: second_implementation (P200); kind preregistration is tier user; escalate_if
    input-role: … (unclassified) …; escalate_if second-implementation: P200".
  - **Correction (defect in the lab):** the declared output `logs/lab/drafts/20261106-0419-t064-1e-prereg.md` is under a
    gitignored path, so the patch was empty and the draft was discarded with the workspace. The lead recovered it from
    the session transcript's single Write call (13,930 characters, no later edit) and placed it at that path in the
    checkout (untracked, ignored), sha256 `4079cf20b9bb361364260f03bbc66d35186588501692396909fbc14811a5cf7d`. Fix as
    follow-up 1 of `logs/handoff/20261106-0425-lab-packet-plied/` (outputs carried into the step and ask packets and
    into later packets under `prior/`).
  - **The draft:** two candidates under mapping M (H2, a coupled per-ant OU drive, 4 points; H1, a slower shared or
    entrance-graded driver, 4 points), each with a fixed lights-on term s(t) = 1 + 1.5·exp(−t/7,200 s) set from F108
    (disclosed); 2 stationary twins as the C4 null and 2 protocol controls; 12-h runs from lights-on with a coverage
    mask; calibration of one strength per point on the 1-min all-ants D_w cell (4.15 ± 0.30); labels E/O/u on 20 rows
    (D117 tolerances, or a 99.5 % CI for the 10 rows without one), never combined; compatible = calibrated, not
    clipped, no O at assessment and again at a fresh-seed confirmation; branches P195/P196, adoption separate (P197);
    single pass; ≤ 2,948 12-h runs, about 53-63 box-hours and $23-28, rental its own request; the mask and labeller get
    the P200 second implementation.
  - **Lead's check of the draft:** the arithmetic holds (block means of s(t) 1.65/1.09/1.01; 1,980 + 528 + 440 = 2,948
    runs ≈ 8,850 four-hour equivalents; the scaling from D158's 3,500 runs; α = 0.05/10). Not checked against the
    sources: the calibration target and tolerances quoted from D158/D173/D117, and the frozen readers' hashes (the
    Part D scratch readers are not in the lab's workspace clone, D315). No panel has reviewed it.
  - **The user's decisions (§8):** (a) the data role, calibrating again on a development cell (option 1, recommended),
    or no calibration (2), or argue omission (3); (b) ρ and τ_L fixed from F108 (recommended) or a 2-point grid;
    (c) the rental later, as its own request. Pre-registrations are the user's (AGENTS.md); an approval is frozen as a
    log entry before anything is built.
