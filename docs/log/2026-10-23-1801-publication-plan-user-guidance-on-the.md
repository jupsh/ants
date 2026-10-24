---
id: D127
date: 2026-10-23
time: 18:01
kind: review
title: Publication plan: user guidance on the six-paper proposal, pasted, adopted; manuscript briefs for four candidates, the existing draft left in place, three parked
---
- **2026-10-23 ≈ 18:01 UTC — Publication plan: user guidance on the six-paper proposal, pasted, adopted; manuscript briefs for four candidates, the existing draft left in place, three parked.**
  - **Request (user):** look across the whole project and propose how to publish it as separate papers rather than
    one large paper at the end; folders under `docs/preprint/` once the direction is confirmed, each listing the
    remaining work. The lead agent proposed six candidates in chat (in-nest movement, synchrony, transfer = the
    existing draft, a Bles et al. 2022 reanalysis, incline walking, a simulator paper; a process perspective
    optional). The user pasted a review of that proposal: "take what you can and defer to your own judgment in
    places of disagreement".
  - **Guidance adopted:**
    - Six candidates are not six papers. Active: in-nest movement (narrow its central claim), synchrony (separate,
      its own question, does not wait on the movement paper), transfer (the existing draft as the synthesis, the
      Mailleux 1999 failure kept in it), Bles reanalysis (audit its contribution before calling it near done).
      Parked: incline walking, simulator paper, process perspective.
    - **Corrections to the chat proposal:** (1) "global coupling ruled out" overstated: the tested oracle
      implementation and settings failed particular requirements (F025, F084); global coupling as a mechanism is not
      excluded. (2) "Mostly done" for the movement paper conflated production (tables) with scientific work
      (novelty, auditing observer-dependent conclusions, the scope of the failed fits). (3) The Bles title promised a
      sampling result that would need a designed raw-versus-observed comparison; failing to reject colony means is
      not evidence of equivalence. (4) "Does not use up E6" was wrong framing: E6 is already development (X006,
      X009); where it is published does not change its role.
    - Briefs before moving the existing draft; each adds the one-sentence central claim, its strongest competing
      explanation and the figures needed. Version sources and planning documents, not build products; choose private
      or public storage explicitly.
  - **Lead agent's judgment where the review left it open:**
    - Folders only for the four active candidates; the parked three are listed in `docs/preprint/README.md`.
    - The existing draft stays at the top of `docs/preprint/`; the transfer brief points at it. It moves to its own
      folder once the briefs show the split holds.
    - The held-out Stroeymeyt test (Plan step 9) is reported in exactly one paper: the transfer paper by default,
      since it waits on the structure freeze, which waits on synchrony (Rules in force). The movement paper presents
      C2 as calibrated, not validated, and does not wait for it. The user may reassign it.
    - Bles: Bles et al. already test per-ant distributions themselves (their Table S2 rejects TEC delta on the
      non-forager distributions; STATUS archive 2026-10-09), which weakens a standalone contribution further. Its
      brief starts with a novelty audit and keeps "fold it into the transfer paper's E6 section" as an outcome.
    - Synchrony: Napoli, Garnier & Porfiri 2026 (X018, development; theory, Temnothorax parameters, no tracking
      data) is the nearest prior work found so far; any literature beyond the cleared set needs the user.
  - **Storage:** `docs/preprint/` stays excluded (`.git/info/exclude`) pending the user's choice. The GitHub
    repository `jupsh/ants` is **public**, so committing the drafts here would publish them on the next push.
  - **Nothing run;** no data read; no finding changed. Briefs: `docs/preprint/README.md` and
    `docs/preprint/{1-in-nest-movement,2-synchrony,3-transfer,4-bles-reanalysis}/README.md` (local only).
  - **Amendment 1 (2026-10-23 ≈ 18:08 UTC; user answers to the open items):**
    - **Storage:** `docs/preprint/` stays local only (excluded in `.git/info/exclude`; user: "already gitignored").
      Not committed, so not backed up by git; recorded, not a blocker.
    - **Bles et al. 2022:** its role is not pending. The data are a development benchmark already (X006, X009). Clearing
      the paper is **deferred until after the E6 run of our colony model** (user asked whether to wait; lead
      recommendation, the user may overrule). Reason: the E6 judging rule and the directed-navigation parameters must be frozen before
      that run (Rules in force), and a full read of the paper now would add exposure while those choices are open.
      Paper 4 moves behind paper 3's E6 run; it stays a candidate, and folding it into paper 3 stays an outcome.
    - **Part D:** amended by D128 (S3 audit first; Stages 1–3 amended, not approved). Paper 2's brief follows D128.
  - **Amendment 2 (2026-10-23 ≈ 18:14 UTC; paper 1 scoped, not pursued as a standalone paper):**
    - **User:** start scoping paper 1 (D126 ready); then, mid-scoping: "if we have nothing new to add, it is okay to
      just not do it", and register the papers that match our results.
    - **Novelty audit (cleared set only):** per-ant persistence of activity is known in ants (Charbonneau & Dornhaus
      2015, F091; L. niger task activity, Lenoir & Ataya 1983, F057); a transition hazard that falls with time in state
      is known (Crosscombe et al. 2026, F090, whose abstract also makes the paper's modelling point: reproducing
      macroscopic patterns does not guarantee the mechanism). What would remain new is a confirmation in L. niger
      locomotion (F089, F002, F067) and one calibration case study (C1 fitted to colony averages lost the persistence it
      had at its start point, F002 / F069; C2 not adequate, F068), which ends without a resolution.
    - **Lead judgment:** not enough for a standalone paper. Its parts are folded in: the individual baseline (F089,
      F002, F067, F070 with F090, F091, F057) into paper 2, which needs it to separate individual from collective
      structure; the motion model and its disclosed failures (C1, C2, F068, F069, F071–F076) into paper 3's methods
      and supplement. The folder stays with the scoping notes, marked not pursued. Reopening condition: a result
      with a new claim, e.g. a designed demonstration that colony-average rows leave per-ant structure unidentified.
    - **Measurement item found while scoping, carried to paper 3 (not run):** the frozen tracker models detection gaps
      only; tracking noise is ≈ 0.018 mm per axis (`noise.x`, fit rows), so only gross misreads could make a ≥ 0.6 mm step, and
      the noise estimator skips windows above 0.6 mm, so it cannot see them. A misread that returns to the prior
      position would split a rest in the data but never in the model, which bears on F003 (short-still deficit) and
      F089 (tails). A data-only audit (count such one-frame excursions; recompute still-run survival without them)
      needs a logged design before running.
    - **Recorded:** F089 (heavy-tailed rests within ants, from the 2026-10-15 archive analysis; indicated), F090 and
      F091 (literature). Nothing run.
