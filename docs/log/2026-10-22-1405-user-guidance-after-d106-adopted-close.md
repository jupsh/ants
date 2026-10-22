---
id: D107
date: 2026-10-22
time: 14:05
kind: review
title: User guidance after D106, adopted: close step 5 as a transfer failure with the not-converged wording; the synchrony freeze requirement predates the gate; a bounded synchrony design before further computation
---
- **2026-10-22 ≈ 14:05 UTC — User guidance after D106, adopted: close step 5 as a transfer failure with the not-converged wording; the synchrony freeze requirement predates the gate; a bounded synchrony design before further computation.**
  - **User (pasted, adopted):**
    - "The recorded rules support closing step 5 as a transfer failure."
    - Wording: "because the fit did not converge, say 'the fitted candidate failed to reproduce the rows within the
      allotted search,' rather than 'the model cannot reproduce them anywhere within its parameter ranges.' That
      qualification does not change the stopping-rule verdict."
    - "The synchrony requirement also predates this narrow gate failure. Even a passing gate would not have cleared
      the structure freeze; the existing rule independently requires investigating the cause and modelling it or
      justifying its omission."
    - Recommendation, a bounded design proposal before further computation:
      - assess whether the existing synchrony investigations support a defensible omission, explicitly retaining
        the unresolved discrepancy;
      - if they do not, specify the smallest investigation that could distinguish plausible causes, using permitted
        data and fixing its interpretation beforehand;
      - keep this separate from attempts to improve the failed 1999 rows: the stopping rule closes that route except
        for demonstrated bugs.
    - Box: kept for now; to be closed if the wait will cost more than $5 (≈ 16 h idle at $0.307/h).
  - **Applied:**
    - **Step 5 closed as a transfer failure** (D106's verdict unchanged).
    - Corrected in place, dated: D106's verdict sentence and its synchrony paragraph, F081's title and body, and the
      STATUS RESUME line.
  - **Next:** the synchrony design (D108), proposal only; nothing runs before the user decides.
