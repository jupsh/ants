---
id: D182
date: 2026-10-29
time: 20:14
kind: decision
title: User: Q11 answered — Mailleux 1999 cleared for full-text reading, the whole paper (fit / development data, no held-out part); the user moves the PDF into literature/, the lead pins it
authority: user
scope: Q11 T020
---
- **2026-10-29 ≈ 20:14 UTC — User: Q11 answered — Mailleux 1999 cleared for full-text reading, the whole paper (fit / development data, no held-out part); the user moves the PDF into literature/, the lead pins it.**
  - **User (in conversation, verbatim):** "Okay let's clear the whole paper." This answered the lead's
    recommendation after D181 (clear the whole paper rather than the Methods and contact definition only).
  - **Why the whole paper exposes nothing held out:** Table 2a is fit data; Table 2b and "all recruiters leave within
    20 min" are development (X008). The paper was read in full on 2026-10-07 (`docs/research/mailleux-rules.md`),
    before the clearing regime (D010; D133 small items).
  - **Uses:**
    1. The Methods' contact definition, for D139's rule 2: whether Mailleux scored walking and third-party contacts.
       A mismatch becomes a bug only when a test encodes the paper's stated definition and our observer fails it
       (D138 item 1); nothing reopens before that.
    2. Checking the 1999 fit and development rows extracted on 2026-10-07 against the page. An extraction error
       shown against the page is a demonstrated bug under the stopping rule (Plan step 5).
  - **Mechanics:** the user copies the PDF from the held folder into `literature/`; the lead adds it to
    `docs/literature.json` with its SHA-256, role "fit / development", and this entry as the clearance, then builds its
    page text (`scripts/paperText.ts`). The lead does not open the held folder.
