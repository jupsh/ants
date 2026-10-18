---
id: D056
date: 2026-10-18
time: 15:52
kind: decision
title: Roles for the resting-site / aggregation literature (the user supplied 11 PDFs and delegated the roles to Claude)
---
- **2026-10-18 ≈ 15:52 UTC — Roles for the resting-site / aggregation literature (the user supplied 11 PDFs and
  delegated the roles to Claude).** List and exposure in the contamination log (same time). Reasons:
  - **The three *L. niger* Depickère papers are sources, not tests.** In-nest spatial organisation already has held-out
    tests reserved (Depickère et al. 2008, Mailleux, Sempo et al. 2011, the Stroeymeyt age-experiment colonies). Arena
    aggregation is not an M1 experiment, so these papers could test a model only through a new arena protocol. And
    the 2004 J. Insect Behav. paper is likely to share experiments with Depickère et al. 2004 (Insect. Soc.), already
    read; that overlap is checked while reading. A site / aggregation mechanism needs *L. niger* sources for its
    structure (what anchors a resting site, how stops and departures depend on neighbours, light).
  - **The eight other-species papers are development:** candidate mechanisms (site vs social retention, chemical
    zone marks, spatial fidelity, brood sorting, activity waves) and analysis designs for the data-side
    measurements; no parameter is imported from them.
  - Nothing here changes the model, the C2 fit or its judgment. The papers serve the data-side site question
    (proposed as a backlog item, not yet filed) and the synchrony / structure-freeze question.
  - Mechanics: the PDFs move to `literature/` (local only), pinned by SHA-256 in `docs/literature.json`; page text
    through `scripts/paperText.ts`. Held Lenoir & Ataya 1983 (*L. niger* in-nest resting, DEVELOPMENT, full reading
    permitted) is also relevant; it stays in the held folder until the user moves it.
