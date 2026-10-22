---
id: D094
date: 2026-10-20
time: 20:34
kind: design
title: Step 5 (Mailleux 1999 with C2's motion fixed): design and runtime benchmark, for approval (nothing run)
---
- **2026-10-20 ≈ 20:34 UTC — Step 5 (Mailleux 1999 with C2's motion fixed): design and runtime benchmark, for approval (nothing run).**
  - **Purpose (Plan step 5, D093):** test whether C2's in-nest motion, fitted on Stroeymeyt 2018, transfers to the
    Mailleux 1999 recruiter rows. Only the trophallaxis parameters and density are fitted. Distance and contacts stay
    fit rows, but no motion parameter is free, so they test transfer. **Stopping rule** (Plan step 5): this is the last
    1999-driven model revision in M1. If the fit is not adequate, the failing rows are reported as a transfer failure
    and the plan goes on to step 9; only bug fixes reopen it.
  - **Model: C2 transferred unchanged.**
    - *Motion:* every in-nest motion key of `s2018Params(free of data/fits/s2018-motion-c2.json, ·, 'C2').nest`, with
      the forager overlay. The keys are the 17 of B014's proxy:
      - rates: restToActive, activeToRest, restCrowdExp, encounterStop / Min / Gap;
      - rest form: restShape, restDeepFrac / Ratio;
      - per-ant variation: walkOnSd, driveSd, driveTau;
      - walking: nestSpeedFactor, nestPauseFactor, nestSpeedSd / TauFactor;
      - walls: wallRule (specular).

      Not transferred: the Stroeymeyt trip inputs (outRate, exploreGiveUp; there are no trips in the 1999 protocol) and
      S2018's water settings (the 1999 physiology layer stays as it is: E2 main layer, `--layer main`). No phase or
      temperature dependence: Mailleux lighting is unknown (F042). 22 °C enters only intake and metabolism, as
      before.
    - *Roles* (**open choice 1**): C2 has nurse values and a forager overlay; the 1999 nests have no role labels.
      - (a) **recommended:** nestmates drawn as foragers at the 22 fit colonies' mean forager share of workers (0.32;
        range 0.10–0.69 across colonies), the rest nurses; the recruiter a forager. This is the role mix C2 was fitted on. All-nurse nestmates as a sensitivity.
      - (b) all nestmates nurses, the recruiter a forager (B014's proxy).
    - *Observer and protocol* (Rules in force, unchanged):
      - B3 contacts ≥ 0.04 s primary, ≥ 1 s as a sensitivity;
      - distance = path walked during the stay;
      - giveUpTime 120 s (60 / 300 s as sensitivities);
      - shareEnd derived from Buffin (0.0195 /s);
      - shared warm-ups, 4 recruiters per nest.
  - **Free (k = 5):** returnRate, shareRate, receiveReserve, reserveSd (boxes as `M1999_FREE`), and **density**.
    - Density is per full chamber footprint: nestmates = density × 56 × 41 mm. That matches F043's full-footprint
      range (Mailleux 2000, 2–4 /cm²), not the occupied-section range (3.9–7.8), which is a different quantity.
    - **Box 2–4 /cm²** (**open choice 2**; the code's 0.25–6 is not independently justified). Under the adoption rule a
      density within 5 % of 2 or 4 is a bound hit: a result, not something to widen. It is not fixed to make distance
      or contacts agree.
    - nestSpeedFactor and shareEnd are not free (motion from step 4; shareEnd derived).
  - **Numerics, before fitting, at the step-5 start point** (the equivalence gate, Rules in force, unchanged rule):
    - **dt 0.05** (C2's fitted and gated dt) vs 0.025;
    - **warm-up** 900 s vs 7200 s. C2's rests are heavy-tailed (restShape 1.001) and the Stroeymeyt runs used 7200 s, so
      900 s may not reach C2's resting state. If 900 fails, try 1800 / 3600 in order and adopt the shortest that
      passes;
    - a failing knob is changed and its comparison rerun before fitting.
  - **Start point:** the trophallaxis values of the provisional 1999 layer (`m1999Points('')`'s start 0), density 3 /cm²
    (mid-box). Second start: start 1. CMA-ES as `fitM1999.ts` (two starts plus one IPOP restart, debiased objective,
    common random numbers, selection batch).
  - **Gates and judgment** (Rules in force, unchanged): Plan steps 6–8 (flat directions, recovery, refits with a larger
    budget, judging on fresh seeds; ranking check, profiles). The adoption rule: no parameter within 5 % of a box end,
    condition 4, Buffin dish check. Adequacy: no row |z| > 3, at most 2 in (2, 3], the no-bout bound. Sensitivities at
    the optimum: contacts ≥ 1 s, giveUpTime 60 / 300 s, and the role mix (open choice 1). A verdict that flips under
    one is a real result (refit there; that optimum joins the E6 ensemble).
  - **Synchrony gate (D093, fixed now):** at the optimum, the 1999 rows are re-evaluated with the oracle coupling on
    (κ = 1, τ_c 60 s) and its placebo, on the same seeds.
    - **Failure:** any row moves by more than 1 combined SE beyond the placebo's shift, or the adoption verdict
      changes. A failure means the step-5 result is sensitive to this partial, artificial, overshooting synchrony. It
      becomes the disclosed blocker for freezing the structure before any held-out test (Rules in force). It does not
      trigger a refit, κ tuning or a synchrony mechanism here, and it does not show that realistic synchrony would act
      the same.
    - **Pass:** insensitivity to this artificial synchrony only, disclosed as such.
  - **Disclosed with any step-5 result:**
    - C2's failing rows (F068) and the diagnostic round (F071–F074);
    - the checks (F075–F079), above all short-stay movement (F077): 0.44 mm/s among eligible Stroeymeyt runs is a
      warning, not the predicted speed of the hungry, food-carrying 1999 recruiter. The distance rows test it;
    - the density rank association (F076; sensitivity untested);
    - G3 departures (B001 deferred);
    - phase dependence omitted.
  - **Code before any fit** (tests first; nothing changes the stepped default):
    - `--model C2 [--roles mix|nurse]` in `fitM1999.ts`, `reportM1999.ts`, `convergeM1999.ts` and `identM1999.ts`, through
      one transfer function in `scripts/` (`m1999C2Params`);
    - the density box as decided;
    - `lazyRest` passed through if B014 is applied (bit-identical).
    - Tests: the transfer sets exactly the listed keys to C2's values and leaves trip, water and trophallaxis keys
      untouched; the role mix draws the stated share; runs with C2's motion are seed-reproducible and pooled = serial.
  - **Runtime benchmark** (small, local, after open choices 1–2):
    - one objective evaluation (days 1 / 4 / 8 × the fit's n recruiters, 4 per nest);
    - at density 2 / 3 / 4, dt 0.05, warm-up 900 and 7200 s, `lazyRest` off / on (the patched worktree until B014 is
      applied);
    - three repetitions, back to back, niced; seconds per evaluation.
    - From it: generations × λ on the box (62 workers), and whether the warm-up gate's outcome changes the budget.
      Reported before any fit is launched.
  - **Not in step 5:** motion changes (C3 deferred, D088), B001's rule, κ tuning, density fixed to the rows.
  - **For the user:** approve or amend, and decide open choices 1 (roles) and 2 (density box).
- 2026-10-20 ≈ 20:36 UTC (time from `date -u`), **user: "I will take your recommendation on these"** (open choices 1–2):
  - **roles:** (a). Nestmates are drawn as foragers at the fit colonies' mean forager share of workers (0.32), the rest
    nurses; the recruiter is a forager. All-nurse nestmates are a sensitivity at the optimum;
  - **density box:** 2–4 /cm², full chamber footprint (Mailleux 2000, F043).
  - Next: the code and tests listed above, then the runtime benchmark (local, small). No fit is launched before the
    benchmark is reported.
