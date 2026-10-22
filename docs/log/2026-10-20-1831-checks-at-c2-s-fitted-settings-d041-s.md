---
id: D089
date: 2026-10-20
time: 18:31
kind: design
title: Checks at C2's fitted settings (D041's list, D088): operational design, disclosed and not judged (for the user to see; nothing run)
---
- **2026-10-20 ≈ 18:31 UTC — Checks at C2's fitted settings (D041's list, D088): operational design, disclosed and not judged (for the user to see; nothing run).**
  - **Purpose:** characterise the version carried into step 5 (D088). Every check is **disclosed, not judged**. There
    is no adequacy verdict and no switch to another mechanism. Each check reports its numbers and one short
    "implication for step 5" line. Any mechanism question it raises goes to the user, not into a new arm.
  - **Common:** C2 at `data/fits/s2018-motion-c2.json`, frozen tracker, dt 0.05, warm-up 7200 s, observation 21600 s,
    the D086 `diag` seeds (22 colonies × 11). **C1 beside** on the same seeds (the judgment showed C1 beside, D081).
    The data are the 22 fit colonies, both phases, light first, with the role they already have (fit; the packing and
    contact statistics development use, as before). The model has one prediction for both phases (as in the rows).
  - **1. Spread rule** (Rules in force, "Per-ant spread rule"; no new simulation): z of log(SD_sim / SD_data) of the
    per-ant still fraction, per group × phase, colony-block SE. Sources: `perColony[].rows["antSd.still.*"]` in
    `logs/c2/diag/control.json` and `data/reference/stroeymeyt2018-fit-rows.json`. The rule's action (z < −3 → add a
    trait, refit) is not applied: C2 already has the trait, and D088 deferred C3. The rule is reported as disclosed.
    Per-ant speed SD beside.
  - **2. Crowding** (C1's plan, check 1; no new simulation): Spearman across the 22 colonies of density vs moving-only
    speed and vs moving-run mean, per group × phase. Model colony values are the means over 11 runs; the data's come from
    the per-colony fit rows (−0.28 to −0.56 when C1 was planned). 90 % intervals by colony bootstrap (2000).
  - **3. Stays and trips** (row 1, F038): forager stay durations and V_stay (Rules in force, "short-stay speed"),
    and trip durations S(30 s), S(600 s), median (F038's statistics), model vs data, with the trip inputs in use
    (`data/fits/s2018-trips.json`, unchanged).
  - **4. Packing** (F027, F028): median nearest-neighbour distance, share NN < 4.1 mm and < 8.2 mm, A50, and the
    occupancy correlation with the data on 5-mm cells. These are `packAgg.py`'s statistics, unchanged.
  - **5. Contacts** (F017; row 4): crossings into 4.1 mm per ant-hour, split still–still / moving-involved,
    model/data, plus Spearman of contact rate with density across colonies. Disclosed as measurement-ambiguous (F015,
    F016).
  - **Tooling for 3–5:** the scratch runner `scripts/scratch/tmpShortSim.ts` gets `--candidate` / `--fit` (the
    `s2018Lib` loader `diagS2018` uses), so it runs C2 and C1 exactly as fitted. The existing scratch recorders are
    reused unchanged. No `src/sim` change (the simHash does not move).
    - *Correctness check before launch:* on one colony and seed, the runner's 36 rows equal `diagS2018`'s for the
      same seed (identical JSON). The recorders are already checked against their data sides (earlier comparisons).
  - **Budget:** checks 1–2 locally in minutes. Checks 3–5: C2 and C1, 242 runs each, ≈ 20–30 min each on the box
    (the diagnostic arms took ≈ 20 min), ≈ 1 h with the data sides already on disk. ≈ $0.3. Then the box can go.
  - **Output:** one reading entry with a table per check (C2, C1, data), findings updated or superseded (F017, F027,
    F028, F038 are C1- / start-point-era), and STATUS's limitations list refreshed for step 5.
- 2026-10-20 ≈ 18:38 UTC (time from `date -u`), **amendment 1 (user review: scope endorsed, C1 beside, the box; four
  implementation points).** It replaces the text above where they conflict.
  - **Runner equivalence, both candidates (done before launch):** `tmpShortSim.ts --candidate C1|C2 --fit f --trips
    --seeds diag|judge --index i` builds the model with `s2018Params(values, outRate, candidate)` and the 36-row run
    extras (activity window), the frozen tracker, the trip inputs in use and diagS2018's seed for run index i (colony i
    mod 22).
    - On colony112, 6-h window: C2 at diag index 0 against `logs/c2/diag/control.json`, and C1 (36-row configuration)
      at judge index 0 against the judging run's `judge-c1.json`.
    - All 261 row values and `foragersIn` are identical (identical JSON) in both.
  - **One run, all outputs:** `--lite --robust` now also writes the run's rows, its trips (complete, and open at the
    window end, from `colony.stays` as the `s2018Colony` pool task and `calibTrips` take them) and `foragersIn`,
    beside the crossings and packing recorders. Checked present in both equivalence runs. After the run, every file is
    checked for rows, trips, contacts and robust output.
  - **Naming:** check 5 is **"crossing rate versus density"**: crossings of tracked centres into 4.1 mm (far again past
    5.1 mm), split still–still / moving-involved. It is not the front-contact observer specified for row 4. Row 4
    stays unaddressed; no other contact analysis.
  - **Windows and seeds:**
    - checks 3–5: observation 12 h (the data's phase length, as in the trip check and the packing / contact
      comparisons), warm-up 7200 s, dt 0.05. The trip check used warm-up 1200 s and dt 0.1 (disclosed);
    - 4 runs per colony (`calibTrips --check`'s 4): diag indices 0–87, the same for both candidates (paired), 176
      runs;
    - the model has one prediction, observed as "light", compared with each data phase.
  - **Conventions kept** (definitions reused, no new thresholds):
    - *stays:* the rows code. V_stay over complete forager stays ≤ 300 s (≤ 1200 s and all beside); colonies with
      < 5 such stays drop out (counts reported). Stay mean / median beside;
    - *trips:* `calibTrips`' six statistics (trip.n, foragerIn, Kaplan–Meier S(30 / 120 / 600 / 3600 s), open trips
      censored at the window end). Data per phase over 12-h phases, censored at the stream end; the phase average (its
      target) beside. Trip mean / median beside;
    - *spread rule:* per-ant SD of still fraction (ants with ≥ 30 min in-nest steps), mean over colonies; z of log(SD_sim
      / SD_data) with SE_data ⊕ SE_sim (delta method; SE_sim from run blocks of 22 colonies). Primary from the 12-h check
      runs (the data's phase length); the 6-h judging runs (22 per colony, both candidates) beside. Per-ant speed SD
      beside;
    - *crowding:* Spearman across the 22 colonies, each side's own density row against moving-only speed and
      moving-run mean, per group × phase. Model colony values are means over runs; 90 % intervals by colony bootstrap
      (2000);
    - *packing:* `packAgg.py`'s S1–S4 and the 5-mm occupancy correlation. Model / data per colony, geometric mean,
      colony bootstrap 2000 (95 %); data `logs/robust/data-c*.json` per phase;
    - *crossing rate versus density:* `contactAgg.py`'s rate per ant-hour, model / data per colony, geometric mean,
      colony bootstrap 95 %, with the still–still / moving-involved split. Spearman of rate with density across
      colonies, model and data;
    - every missing or unestimable quantity is reported by name (colony and count), never dropped silently. Uncertainty:
      data colony-block, model run blocks.
  - **Budget:** 176 runs at 62 workers, about 3 waves of 10–15 min, ≈ 45 min. The box is kept afterwards (user, D090: "don't
    release the box", replacing the earlier "release it after the checks").
