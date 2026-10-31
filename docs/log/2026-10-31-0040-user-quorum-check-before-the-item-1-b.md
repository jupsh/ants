---
id: D219
date: 2026-10-31
time: 00:40
kind: decision
title: User: quorum check before the item 1(b) read approved: an independent second implementation of the primary rows from D212's text alone, on dumped synthetic frames, compared with the first; the aggregator does not run on real data until they agree
authority: user
scope: T035
---
- **2026-10-31 ≈ 00:40 UTC — User: quorum check before the item 1(b) read approved: an independent second implementation of the primary rows from D212's text alone, on dumped synthetic frames, compared with the first; the aggregator does not run on real data until they agree.**
  - **User:** "All looks good to me", to the lead's list, whose first item was: "The quorum check before the read. A
    second implementer gets only D212 and its amendments, never the first one's code, and computes the result on the
    synthetic files. We compare numbers before I run the aggregator on the real data." Taken also as approval to post
    the three plied suggestions (jupsh/plied #103, #104, #105) and to commit.
  - **Why:** HANDOFF.md already advises a second implementation for a statistic a pre-registration freezes; the lead
    proposed making it the rule here (an ant colony's quorum: commit only when independent scouts agree). The costly
    defects so far (D209) were caught by self-checks, not by review.
  - **Design:**
    - **Inputs:** two stochastic synthetic cases from `triggersSyn.ts` (22 colonies each): an injected rise after
      every event, and no injection, seed 3 (the seed whose forager rise label fired, D215). Their frame streams are
      dumped exactly as the first implementation receives them, with the first implementation's per-colony and
      aggregate results beside them (first brief, medium effort; changes `triggersSyn.ts` only).
    - **Second implementation** (second brief, high effort): the primary rows only (forager, queen; light), from D212's
      text (design and amendments 1-2) and the prose gap-fillings of D215 (report Deviation 2 b-n) and D217, reading
      only the dumped frames. It never opens `scripts/scratch/triggers*.ts` or the first implementation's results.
    - **Compared by the lead:** per colony and type, the event frames, the dropped and unmatched counts, the matched
      controls, and per event L, R, A_pre, A_post and DiD; per type, the colony means, contributing colonies, balance,
      DiD, post − pre, DiD − δ and rise point estimates, and the class and labels. Intervals come from separate
      bootstraps and are compared only for the class they give.
    - **Rule:** any difference in an event list, a per-event value (beyond 1e-9), a count or a class holds the read
      until its cause is found and logged; a difference traced to the first implementation is a correction and is
      fixed (and the calibration and per-colony runs redone if it changes their code). Agreement on both cases lets
      the aggregator run.
