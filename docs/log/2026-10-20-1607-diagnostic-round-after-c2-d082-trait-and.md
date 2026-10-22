---
id: D083
date: 2026-10-20
time: 16:07
kind: design
title: Diagnostic round after C2 (D082): trait and drive perturbations at C2's fitted settings, and B018's conditional rest summaries on C2 — design and readings (for approval; nothing run)
---
- **2026-10-20 ≈ 16:07 UTC — Diagnostic round after C2 (D082): trait and drive perturbations at C2's fitted settings, and B018's conditional rest summaries on C2 — design and readings (for approval; nothing run).**
  - **Purpose:** steps 1 and 2 of D082, to decide whether one bounded C3 is warranted and which. Diagnostic only: no
    arm is adopted, ranked or fitted; diagnostic switches stay off by default. The judging seeds are not reused.
  - **Common settings:** C2's fitted point (`data/fits/s2018-motion-c2.json`), `diagS2018.ts --candidate C2 --seeds
    diag --reps 11 --dt 0.05 --warmup 7200 --obs 21600 --rest`, frozen tracker. 242 runs per arm (≈ 20 min each on
    the box, D046), the same diag seeds in every arm (paired). All 36 rows by family, combinedZ, and the paired shift
    of each arm against the control in SE_data units with a 90 % CI (`reportS2018 --est arm --start control`). The
    still-fraction rows are the mean-activity check. D076's S and z_E are reported per arm, descriptive.
  - **Part A, arms** (one change each from C2 as fitted):
    - **control:** C2 as fitted (walkOnSd 0.4, driveSd 1.99 / 1.94);
    - **trait:** `--set walkOnSd=0.7` and `walkOnSd=1.0`;
    - **drive:** `--set nurse.driveSd=1,forager.driveSd=1` and `…=0.5`.
  - **Part A, readings (fixed now):**
    - *Trait:* at walkOnSd 1.0, **"spread responds to stable heterogeneity"** if top-20 % moves toward the data by
      ≥ 3 SE_data with the CI excluding 0 in both groups, and also:
      - every still-fraction row (group × phase) shifts by ≤ 2 SE_data;
      - neither persistence row overshoots the data by more than 2 combined SE.

      **"Responds, with a tradeoff"** if the spread condition holds but either of those fails (named). **"Does not
      respond"** otherwise. walkOnSd 0.7 is reported beside, not read.
    - *Drive:* at driveSd 0.5, **"the drive carries the nurse rest tails"** if P(still ≥ 10 s) and P(still ≥ 60 s) for
      nurses shift by ≥ 2 SE_data, CI excluding 0, in both phases. **"The drive carries spread"** if either top-20 %
      row shifts away from the data by ≥ 2 SE_data, CI excluding 0. Both can hold. Every other shift is descriptive.
      driveSd 1 is reported beside.
  - **Part B, B018's conditional summaries on C2 through the same observer.** The question: does C2 fail within
    comparable neighbourhoods, or mainly by putting ants in the wrong neighbourhoods?
    - *Code:* a shared module in `src/sim/analysis/` on observed tracks. Steps and stills as D043 (< 0.6 mm per
      frame, gaps ≤ 3 frames bridged). Neighbours = still workers within 4.1 mm, plus the queen when still (B018).
      Recorded per group, as counts:
      - (i) stop hazard of moving workers by N (0 … 6+);
      - (ii) leaving hazard of still workers by A = 1 + N (1 … 9+);
      - (iii) the share of moving steps at each N and of still step-frames at each A (where ants are);
      - (iv) observed still-run survival P(≥ 2 / 10 / 60 s) by A at run start (1, 2, 3–4, 5–8, ≥ 9), Kaplan–Meier,
        censored at gaps and the window end.
    - (i) and (ii) are also recorded per 1-mm cell, so the site-field stratification (B018's E bins) can be applied
      afterwards with E from other runs: the data's other phase, the model's other seeds (D076).
    - Off by default and bit-identical; tests as D078. The simHash moves again and the backlog stamps get re-stamped
      with a trail, as in D078.
    - *Data:* the 22 fit colonies through the same module and the D043 stream, light phase (dark beside), colony
      bootstrap 2000. Development use, as B018. B018's own numbers are a cross-check only (different duplicate rule).
    - *Model:* the control arm's runs (the recorder on; rows unchanged); SE by bootstrap over runs within colonies.
  - **Part B, reading (fixed now):** per group, for (a) the overall leaving hazard of still workers and (b) P(still
    run ≥ 10 s), split the model − data gap into
    - **composition** Σ_A (w_model(A) − w_data(A)) · r_model(A), and
    - **within** Σ_A w_data(A) · (r_model(A) − r_data(A)),

    with w = the share at each A and r = the rate or survival at that A. The same split by N applies to the stop hazard.
    - Total gap's 95 % CI includes 0 → "no gap to decompose".
    - Else within share ≥ 2/3 (point, and its CI's lower bound > 1/3) → **"C2 fails within comparable
      neighbourhoods"**.
    - Composition share ≥ 2/3 likewise → **"C2 fails mainly by putting ants in the wrong neighbourhoods"**.
    - Otherwise → **"both"**.
    - The rate tables by N, A and E bin are reported beside, descriptive.
  - **What the readings feed (D082 step 3), as proposals for the user, nothing automatic:**
    - trait responds and part B reads "within" → a C3 with a free continuous trait width first;
    - part B reads "wrong neighbourhoods" → spatial organisation is the issue, which this round cannot fix with
      activity parameters (site mechanism stays out unless shown necessary);
    - drive carries the tails → the rest form is revisited jointly with activity.

    Any B018-derived *shape* in a C3 needs the user's explicit role decision and an uncertainty treatment (D082).
  - **Budget:** part A 5 arms × 242 runs ≈ 1 h 45 min on the box, part B in the control arm's runs; ≈ $0.6. Code for
    part B ≈ a few hours locally, tested before launch.
  - **Before launch:** the user's approval; the code, tests, `tsc`; box checksums; a launch entry with the commands.
- 2026-10-20 ≈ 16:09 UTC (time from `date -u`), **amendment 1 (user: "Not as written"; the five arms and the budget
  kept, no arms added, no budget increase).** It replaces the readings above where they conflict; the original text
  stays for the record.
  - **Drive readings, directional:** at driveSd 0.5, **"lowering the drive reduces the nurse rest tails"** if nurse
    P(still ≥ 10 s) and P(still ≥ 60 s) both shift *down* by ≥ 2 SE_data, CI excluding 0, in both phases. If both
    shift *up* by the same criterion: **"tails respond in the opposite direction"**. Otherwise descriptive. The spread
    reading becomes **"lowering the drive worsens spread"**: either top-20 % row moves away from the data by ≥ 2 SE_data,
    CI excluding 0. Both are local perturbation results, not an attribution of how much spread or tail the drive
    generates.
  - **Trait reading:** the guards are shifts from the control (still fraction ≤ 2 SE_data per group × phase), plus:
    - persistence must not overshoot the data by > 2 combined SE (as before);
    - **new:** neither persistence row may move away from the data by > 2 SE_data (paired shift).

    "Does not respond" becomes **"does not meet the predefined joint response criterion"**. Partial responses (one
    group only, or at 0.7 but not 1.0) are reported as informative, not as failures of the trait idea.
  - **Part B weights:**
    - leaving hazard: shares of eligible **still exposure time** at each A;
    - stop hazard: shares of eligible **moving exposure time** at each N;
    - survival: shares of **rest episodes starting** in each A bin.

    The marginal survival being decomposed is defined as the episode-weighted mixture Σ_A w(A) · S_A(t) of the
    conditional Kaplan–Meier estimates. It is not a separately pooled Kaplan–Meier estimate.
  - **Support:** where one side occupies a bin (w > 0) and either side has no estimable rate or survival there (no
    exposure; no episode still at risk at t), that bin's components are reported as **unestimable** and so is the
    reading for that quantity. Bins are never dropped and values never invented. In the bootstrap, draws without
    support are counted; if more than 5 % of draws lack support, the reading is "unestimable", with its bins named.
  - **Symmetric split** (sums exactly to the gap):
    - C = Σ_A (w_m − w_d)(r_m + r_d)/2;
    - W = Σ_A (w_m + w_d)/2 · (r_m − r_d).

    Report both signed components with 95 % intervals (each draw pairs a data colony-bootstrap draw with a model
    within-colony run-bootstrap draw). Tables are pooled over the 22 colonies on each side. Readings:
    - gap's 95 % CI includes 0 → **"no resolved aggregate gap"** (components still reported);
    - C and W of opposite sign → **"counteracting components"**;
    - same sign, W / gap ≥ 2/3 with its lower bound > 1/3 → **"gap dominated by conditional rates / survival"**;
    - same sign, C / gap likewise → **"gap dominated by neighbourhood composition"**;
    - otherwise "both contribute".
  - **No causal conclusion from Part B.** "What the readings feed" is reworded:
    - composition-dominated does not imply that activity parameters cannot fix it (resting and leaving change
      occupancy);
    - a conditional discrepancy may reflect rest age, site occupancy or individual composition rather than a wrong
      neighbour rule.

    Either reading guides the next investigation. Neither identifies a mechanism or shows a site mechanism to be
    necessary.
  - **Checks before launch, added:** a synthetic reconstruction check of the decomposition (known composition-only
    and within-only gaps, cancellation, missing support), and an observer check (synthetic tracks with known stop and
    leave rates through the new recorder). Beside the unchanged-output tests.
