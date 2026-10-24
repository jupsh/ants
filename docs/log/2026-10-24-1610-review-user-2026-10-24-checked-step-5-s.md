---
id: D133
date: 2026-10-24
time: 16:10
kind: review
title: Review (user, 2026-10-24) checked: step 5's Buffin failure is the pilot2 volume cap (bouts end when the donor empties; the pre-committed Buffin fit row lapsed); brood coordinates and colony metadata unused; S2 unaudited for composition; forager-entry and queen triggers untested
---
- **2026-10-24 ≈ 16:10 UTC — Review (user, 2026-10-24) checked: step 5's Buffin failure is the pilot2 volume cap (bouts end when the donor empties; the pre-committed Buffin fit row lapsed); brood coordinates and colony metadata unused; S2 unaudited for composition; forager-entry and queen triggers untested.**
  - **Source:** a review report from the user (2026-10-24), with four gaps and three small items. The lead checked each
    claim against the code and records (below) before relying on it. The reviewer reports touching no held-out or sealed
    material: a scratch dish diagnostic (`scripts/tmpBuffinCause.ts`, local only), frame timestamps of three fit-colony
    tracking files, metadata files and D106's judge rows, all already read. No exposure; no contamination entry.
  - **1. Step 5's Buffin failure is a volume cap, the mechanism pilot2 showed (confirmed).**
    - **Rerun by the lead** at the D103 fit (`tmpBuffinCause.ts --dishes 8`, ≈ 1 min each; development):
      - **at the fit:** shareRate 0.0225 µL/s, giveFrac 0.1, 251 bouts > 3 s. Mean 16.3 s, q90 = max = 31.1 s, ML
        ending rate 0.075/s. 53 % end with the donor at the giveFrac floor.
      - **at shareRate 0.008:** 0.046/s, max 87.5 s, 16 % donor-ended.
      - 31.1 s is exactly (0.9 − 0.2 µL) / 0.0225 µL/s, the time to empty a Buffin donor to the floor.
    - **Contacts (D106 rows):** before the main bout the model matches (2.5 / 1.1 / 1.4 vs 3 / 1 / 1). From the main bout
      on it has ≈ 5.7–5.9 per day against 3.1 / 2.3 / 2.3.
    - **Same as pilot2 (night archive, 2026-10-10):** the same failing rows (trophallaxis totals; contacts), Buffin
      0.085/s and depletion-ended bouts. The fit raises shareRate so recruiters empty fast, and holds density at its
      floor against the contacts row.
    - **Process miss:** the user's adopted review of the Buffin proposal (night archive, 2026-10-10) pre-committed
      that if non-hazard endings were common at the fitted shareRate, Buffin's fed → starved durations would become a
      **fit row in the joint fit**. pilot2 met that condition (55–65 % donor-depleted). Plan 4 A/B followed instead.
      No later entry implements or drops the fit row, and step 5 (D094) used Buffin only as an adoption check.
    - **Reading:** D106 / D107's verdict stands as worded: not adequate, not converged, a transfer failure within the
      allotted search. But its cause is the trophallaxis volume/rate structure diagnosed before step 4; the motion
      transferred from step 4 did not touch it. F081's "no causal reading" is now qualified by F093.
    - **Under the stopping rule (D094, D107) only demonstrated bugs reopen the 1999 rows.** One candidate: whether
      the 1999 contact observer counts contacts Mailleux could not have scored (passers-by brushing a pair during
      trophallaxis, contacts on the walk out). Splitting the post-main-bout contacts into during-bout and after-bout
      would test it (simulation only, minutes).
    - **The user's decisions:** whether to run that split, and whether the lapsed pre-commitment changes the step-5
      closure wording.
  - **2. Brood coordinates and colony metadata are in the dataset and unused (confirmed).**
    - `data/stroeymeyt2018/README.txt` item 15: `original_data/brood_coordinates` holds every brood item's X, Y on the
      first frame of each temporal bin (per `time_aggregation_info`). Item 18: one high-resolution image per hour.
      Neither is in the local copy.
    - `info.txt` (already local) gives box, nb_larvae, nb_pupae and colony_age per colony; no script or record uses
      them. The 22 colonies span 11 boxes: two with 5 colonies, four with 1. Ages are 5, 6, 7 or 16 days, possibly
      confounded with box. A box test of D015's "drivers local to one system" is feasible but weak.
    - **Bears on:** B018 (a brood location), F060 ("queen = brood: not established"), F051 (missing nest structure)
      and F056 (brood-pile waves) as a synchrony driver.
    - **Data role (the user's decision):** STATUS § roles makes main PreTreatment the fit set and age-experiment
      PreTreatment held out; everything else is unused and unopened. The brood folder covers both experiments and
      PostTreatment, so a fetch would have to extract by file name only main-experiment PreTreatment files. Listing
      the archive shows held-out file names, not contents.
  - **3. S2 is unaudited for composition (confirmed).**
    - `scripts/scratch/ydistAgg.ts` (and `partC.ts`, "as ydistAgg.ts") class each pair-bin by the distance between
      the two ants' mean positions in the same 1-min bin as the activity, with no per-ant time-shift or
      reference-position null.
    - F065 found same-bin classing about two-thirds artefact for zones. The data's activity has a spatial component
      (F067: rest position carries ≈ 5 % / 9 % of persistence) that C1/C2 lack (F070). So part of the data-vs-model
      difference in S2's decay may be composition, as Stage 0 found for S3.
    - **Reading:** before S2 carries Stages 1–3 (option (ii), D130), it warrants an audit like Stage 0's. That is a
      plan change, the user's decision.
  - **4. Forager nest entries and queen movements are untested as triggers (confirmed by search).** No record
    averages activity around either event. F056 names returning foragers, and the queen is excluded from the activity
    groups. A backlog candidate, if the user wants it.
  - **Small items:**
    - D131's outputs were read in D132 (after the report was written). STATUS updated.
    - STATUS said Part D's folder is sealed; it was unsealed once D130 was frozen. Clarified in STATUS.
    - **Mailleux 1999 is not in `docs/literature.json` because it is held**, not cleared (D010 kept 11 cleared
      papers; 1999 is not among them). The 1999 rows rest on the 2026-10-07 full-text extraction
      (`docs/research/mailleux-rules.md`), which predates the clearing regime. Re-checking it against the page
      would need the user to clear the paper.
    - Frame timing (0.50 ± 0.02 s, rare skips) and the 06 / 18 UTC light switches on block boundaries: checked by
      the reviewer, no issue.
  - **Finding: F093** (new, colony-1999).
