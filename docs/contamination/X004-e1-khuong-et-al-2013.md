---
id: X004
title: E1 (Khuong et al. 2013)
date: 2026-10-08
role: fit / development / held-out
---
- **E1 (Khuong et al. 2013):**
  - The first fit's results at 20° and 45° were inspected before
    slope-dependent pausing, jitter and speed variability were added.
  - Those terms were fitted only on 30° and 60°, but 20° and 45° are now
    **development**, not held-out.
  - **Held-out (registered 2026-10-08, never inspected):** Bonavita et
    al. 2026's new experiment, `data/bonavita2026/redwhite.csv.gz` (60
    ants × white and red light, same lab, flat 50 cm arena, 25 °C,
    tooth-pick release, arena cleaned between ants; raw 25 Hz tracks, CC
    BY 4.0). Only the file format, counts and the paper's methods have
    been read; no statistic has been computed on the tracks. **Correction
    (2026-10-08):** the paper's *summary* results for this experiment were
    seen before registration: `slope-walking.md` §1.5 (session 2) quotes
    them (homeward bias persists under red light for speed and λ only; ants
    walk faster heading back, ES ≈ 1.7–2.3 mm/s), and that note was read at
    the start of session 3. No model has been compared with them and the
    frozen test statistics do not include direction-to-start effects; if
    such a statistic is ever added it counts as contaminated. It will test the flat-ground walker adopted
    after step 5, under a protocol written down before the first
    computation (geometry, start/end criteria, observer calibration with
    the same noise estimator, white light primary).
  - **Possible exposure (2026-10-08, literature check):** a web-page
    summary of Bonavita et al. 2026, requested for the Khuong re-analysis
    only, also returned one sentence of unclear origin: "Experimentally,
    ants required 4.06 times longer to achieve 200mm net displacement
    compared to isotropic models". It may describe the new experiment. No
    other result on the held-out data was seen; the number is not used
    anywhere. Treat a net-displacement or MSD statistic as contaminated if
    it is ever added to the held-out test.
  - Other candidates: Czaczkes et al. 2011 (speeds and straightness on
    trails; experienced foragers, a different context).
